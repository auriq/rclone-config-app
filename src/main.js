const { app, BrowserWindow, ipcMain } = require("electron");
const { exec } = require("child_process");
const path = require("path");
const fs = require('fs-extra');

let mainWindow;

// Helper function to handle interactive prompts
function handleProviderPrompts(process, provider, event) {
    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            reject(new Error('Configuration timed out'));
        }, 300000); // 5 minute timeout

        process.stdout.on('data', (data) => {
            const input = data.toString().toLowerCase();
            
            if (provider === 'onedrive') {
                if (input.includes('choose a number')) {
                    process.stdin.write('1\n'); // Select default region
                } else if (input.includes('choose drive type')) {
                    process.stdin.write('1\n'); // Select personal account
                }
            }
        });

        process.on('close', (code) => {
            clearTimeout(timeout);
            if (code === 0) {
                resolve();
            } else {
                reject(new Error(`Process exited with code ${code}`));
            }
        });
    });
}

// Helper function to execute rclone commands
function executeRclone(command, options = {}) {
    return new Promise((resolve, reject) => {
        const settings = getSettings();
        if (!settings.rclonePath) {
            reject(new Error('Rclone path not configured. Please set it in the settings.'));
            return;
        }

        console.log(`Executing rclone command: ${command}`);
        const configPath = getRcloneConfigPath();
        
        // Build command with additional flags based on provider
        let fullCommand = `"${settings.rclonePath}" --config "${configPath}"`;
        
        // Add provider-specific flags
        if (options.provider) {
            switch (options.provider) {
                case 'onedrive':
                    // OneDrive will use rclone's default credentials
                    break;
                case 'sharepoint':
                    // SharePoint needs additional parameters for site URL
                    fullCommand += ' --sharepoint-client-id "" --sharepoint-client-secret ""';
                    break;
                case 'box':
                    // Box uses a different authentication flow
                    fullCommand += ' --box-client-id "" --box-client-secret ""';
                    break;
                case 'dropbox':
                    // Dropbox uses app authentication
                    fullCommand += ' --dropbox-client-id "" --dropbox-client-secret ""';
                    break;
            }
        }
        
        // Add the main command
        fullCommand += ` ${command}`;
        
        const rcloneProcess = exec(fullCommand, { maxBuffer: 10 * 1024 * 1024 }, (error, stdout, stderr) => {
            if (error) {
                console.error(`Rclone error: ${error.message}`);
                console.error(`Stderr: ${stderr}`);
                
                // Provider-specific error handling
                if (stderr.includes('oauth2: cannot fetch token')) {
                    reject('Authentication failed. Please check your credentials and try again.');
                } else if (stderr.includes('quota')) {
                    reject('Storage quota exceeded. Please free up space or upgrade your plan.');
                } else {
                    reject(stderr || error.message);
                }
            } else {
                console.log(`Rclone output: ${stdout}`);
                resolve(stdout);
            }
        });

        rcloneProcess.stdout.on('data', (data) => {
            console.log(`Rclone stdout: ${data}`);
            
            // Handle provider-specific interactive prompts
            if (data.includes('Enter a team drive ID')) {
                rcloneProcess.stdin.write('\n'); // Skip team drive selection
            }
        });

        rcloneProcess.stderr.on('data', (data) => {
            console.error(`Rclone stderr: ${data}`);
            
            // Handle provider-specific authentication URLs
            if (data.includes('http://127.0.0.1:53682/auth')) {
                const authUrl = data.match(/http:\/\/127\.0\.0\.1:53682\/auth\?[^\s]*/)[0];
                if (options.event) {
                    options.event.reply("config-status", "Opening browser for authentication...");
                    require('electron').shell.openExternal(authUrl);
                }
            }
        });
    });
}

// Helper function to get app config directory
function getAppConfigDir() {
    const userHome = process.env.HOME || process.env.USERPROFILE;
    const configDir = path.join(userHome, '.config', 'rclone-config-app');
    // Ensure config directory exists
    if (!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir, { recursive: true });
    }
    return configDir;
}

// Helper function to get rclone config path
function getRcloneConfigPath() {
    return path.join(getAppConfigDir(), 'rclone.conf');
}

// Helper function to get settings path
function getSettingsPath() {
    return path.join(getAppConfigDir(), 'settings.json');
}

const DEFAULT_RCLONE_PATH = '/usr/local/bin/rclone';

// Helper function to get/save settings
function getSettings() {
    const settingsPath = getSettingsPath();
    if (fs.existsSync(settingsPath)) {
        return JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
    }
    // Try default path first
    if (fs.existsSync(DEFAULT_RCLONE_PATH)) {
        const settings = { rclonePath: DEFAULT_RCLONE_PATH };
        saveSettings(settings);
        return settings;
    }
    return { rclonePath: '' };
}

function saveSettings(settings) {
    fs.writeFileSync(getSettingsPath(), JSON.stringify(settings, null, 2));
}

// Helper function to validate rclone path
async function validateRclonePath(rclonePath) {
    return new Promise((resolve) => {
        exec(`"${rclonePath}" --version`, (error, stdout) => {
            resolve(!error && stdout.includes('rclone'));
        });
    });
}

// Helper function to delete remote
async function deleteRemote(remoteName) {
    const configPath = getRcloneConfigPath();
    if (!fs.existsSync(configPath)) {
        throw new Error("Config file not found");
    }
    
    let content = fs.readFileSync(configPath, 'utf8');
    const remoteRegex = new RegExp(`\\[${remoteName}\\][^\\[]*(?=\\[|$)`, 'g');
    
    if (!content.match(remoteRegex)) {
        throw new Error("Remote not found");
    }
    
    content = content.replace(remoteRegex, '');
    fs.writeFileSync(configPath, content.trim() + '\n', 'utf8');
}

// Helper function to list remotes
async function listRemotes() {
    try {
        const settings = getSettings();
        if (!settings.rclonePath) {
            throw new Error('Rclone path not configured');
        }

        const configPath = getRcloneConfigPath();
        const output = await new Promise((resolve, reject) => {
            exec(`"${settings.rclonePath}" --config "${configPath}" listremotes`, (error, stdout) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(stdout);
                }
            });
        });

        return output.trim().split('\n').map(remote => remote.replace(':', ''));
    } catch (error) {
        console.error('Error listing remotes:', error);
        return [];
    }
}

// Helper function to check remote contents
async function checkRemote(remoteName) {
    try {
        // Get total number of files
        const listOutput = await executeRclone(`size ${remoteName}:`);
        
        // Get all files and take first 100
        const recentFiles = await executeRclone(`lsl ${remoteName}:`);
        const header = "     Size     Date       Time    Filename\n" +
                       "----------------------------------------\n";
        const topFiles = header + recentFiles.split('\n')
            .filter(line => line.trim())
            .map(line => {
                // Format: size YYYY-MM-DD HH:MM:SS.nnnnnnnnn filename
                const match = line.match(/^(\s*\d+)\s+(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2}:\d{2})(?:\.\d+)?\s+(.+?)$/);
                if (match) {
                    const [_, size, date, time, filename] = match;
                    // Convert size to human readable format
                    const sizeNum = parseInt(size);
                    let sizeStr;
                    if (sizeNum > 1024 * 1024 * 1024) {
                        sizeStr = `${(sizeNum / (1024 * 1024 * 1024)).toFixed(2)} GB`;
                    } else if (sizeNum > 1024 * 1024) {
                        sizeStr = `${(sizeNum / (1024 * 1024)).toFixed(2)} MB`;
                    } else if (sizeNum > 1024) {
                        sizeStr = `${(sizeNum / 1024).toFixed(2)} KB`;
                    } else {
                        sizeStr = `${sizeNum} B`;
                    }
                    // Pad size to 10 chars
                    sizeStr = sizeStr.padStart(10);
                    return `${sizeStr}  ${date} ${time}  ${filename}`;
                }
                return line;
            })
            .slice(0, 100)
            .join('\n');
        
        return {
            summary: listOutput,
            recentFiles: topFiles || "No files found"
        };
    } catch (error) {
        throw error;
    }
}

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindow.loadFile("index.html");
    
    // List remotes after window loads
    mainWindow.webContents.on('did-finish-load', async () => {
        try {
            const remotes = await listRemotes();
            mainWindow.webContents.send("remotes-list", remotes);
        } catch (error) {
            console.error("Error listing remotes:", error);
        }
    });
}

// Handle rclone path setup
ipcMain.handle('get-rclone-path', () => {
    const settings = getSettings();
    return settings.rclonePath || '';
});

ipcMain.handle('validate-rclone-path', async (event, rclonePath) => {
    const isValid = await validateRclonePath(rclonePath);
    if (isValid) {
        const settings = getSettings();
        settings.rclonePath = rclonePath;
        saveSettings(settings);
    }
    return isValid;
});

app.whenReady().then(() => {
    createWindow();
    
    // Check rclone path on startup
    const settings = getSettings();
    if (!settings.rclonePath) {
        mainWindow.webContents.on('did-finish-load', () => {
            mainWindow.webContents.send('show-rclone-setup');
        });
    }
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// Handle remote configuration
ipcMain.on("configure-remote", async (event, { name, provider, directory }) => {
    try {
        event.reply("config-status", `Starting ${provider} configuration...`);
        
        const configPath = getRcloneConfigPath();
        // First ensure config file exists
        if (!fs.existsSync(configPath)) {
            fs.writeFileSync(configPath, '', 'utf8');
        }

        const settings = getSettings();
        if (!settings.rclonePath) {
            event.reply("config-status", "Rclone path not configured. Please set it in the settings.");
            return;
        }

        // Build rclone config command with provider-specific options
        let configCommand = `"${settings.rclonePath}" config create "${name}" "${provider}" --config "${configPath}"`;

        // Use rclone config to start OAuth flow
        const configProcess = exec(configCommand);

        // Set up output handlers
        configProcess.stdout.on('data', (data) => {
            const output = data.toString();
            console.log('Config stdout:', output);
            event.reply("config-status", output);
        });

        configProcess.stderr.on('data', (data) => {
            const output = data.toString();
            console.log('Config stderr:', output);
            
            if (output.includes('http://127.0.0.1:53682/auth')) {
                const authUrl = output.match(/http:\/\/127\.0\.0\.1:53682\/auth\?[^\s]*/)[0];
                event.reply("config-status", "Opening browser for authentication...");
                require('electron').shell.openExternal(authUrl);
            } else if (output.includes('Failed to configure')) {
                console.error(`Config error: ${output}`);
                event.reply("config-status", `Configuration failed: ${output}`);
            } else if (!output.includes('NOTICE:')) {
                console.log(`Config message: ${output}`);
                event.reply("config-status", output);
            }
        });

        // Handle interactive prompts
        try {
            await handleProviderPrompts(configProcess, provider, event);
        } catch (error) {
            event.reply("config-status", `Configuration error: ${error.message}`);
            throw error;
        }

        // Wait for configuration to complete
        await new Promise((resolve, reject) => {
            configProcess.on('close', async (code) => {
                if (code === 0) {
                    try {
                        // Verify access using provider-specific command
                        let verifyCommand = 'about';
                        if (provider === 'sharepoint') {
                            verifyCommand = 'lsd'; // SharePoint doesn't support about command
                        }
                        
                        await executeRclone(`${verifyCommand} ${name}:`, { provider, event });
                        event.reply("config-status", `${provider} configuration successful! Access verified.`);
                        const remotes = await listRemotes();
                        event.reply("remotes-list", remotes);
                        resolve();
                    } catch (error) {
                        event.reply("config-status", `Configuration failed: Could not verify access - ${error}`);
                        reject(error);
                    }
                } else {
                    event.reply("config-status", "Configuration process failed");
                    reject(new Error(`Config process exited with code ${code}`));
                }
            });
        });
        
    } catch (error) {
        event.reply("config-status", `Configuration error: ${error}`);
    }
});

// Handle remote check request
ipcMain.on("check-remote", async (event, remoteName) => {
    try {
        event.reply("config-status", `Checking remote ${remoteName}...`);
        const result = await checkRemote(remoteName);
        event.reply("remote-status", {
            name: remoteName,
            ...result
        });
    } catch (error) {
        event.reply("config-status", `Failed to check remote: ${error}`);
    }
});

// Handle list remotes request
ipcMain.on("list-remotes", async (event) => {
    try {
        const remotes = await listRemotes();
        event.reply("remotes-list", remotes);
    } catch (error) {
        console.error("Error listing remotes:", error);
        event.reply("remotes-list", []);
    }
});

// Handle delete remote request
ipcMain.on("delete-remote", async (event, remoteName) => {
    try {
        await deleteRemote(remoteName);
        event.reply("delete-status", {
            success: true,
            message: `Remote ${remoteName} deleted successfully`
        });
        // Refresh the remotes list after deletion
        const remotes = await listRemotes();
        event.reply("remotes-list", remotes);
    } catch (error) {
        console.error("Error deleting remote:", error);
        event.reply("delete-status", {
            success: false,
            message: `Failed to delete remote: ${error.message}`
        });
    }
});

// Handle close request
ipcMain.on("close-app", async (event) => {
    try {
        // Kill any remaining processes
        const scriptPath = process.platform === 'win32' ? 'kill-app.bat' : './kill-app.sh';
        await new Promise((resolve, reject) => {
            exec(scriptPath, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Kill script error: ${error}`);
                }
                resolve();
            });
        });
        
        // Close the app
        app.quit();
    } catch (error) {
        console.error("Error during cleanup:", error);
        app.quit();
    }
});