const { ipcRenderer } = require("electron");

// Button elements
const addGdriveButton = document.getElementById("add-gdrive");
const addOnedriveButton = document.getElementById("add-onedrive");
const addBoxButton = document.getElementById("add-box");
const addDropboxButton = document.getElementById("add-dropbox");
const closeButton = document.getElementById("close");
const reloadButton = document.getElementById("reload-remotes");

// Other elements
const remoteList = document.getElementById("remote-list");
const configStatusElement = document.getElementById("config-status");

// Dialog elements
const overlay = document.getElementById("overlay");
const remoteDialog = document.getElementById("remote-dialog");
const rcloneSetupDialog = document.getElementById("rclone-setup-dialog");
const remoteNameInput = document.getElementById("remote-name");
const rclonePathInput = document.getElementById("rclone-path");
const confirmRemoteButton = document.getElementById("confirm-remote");
const cancelRemoteButton = document.getElementById("cancel-remote");
const confirmRclonePathButton = document.getElementById("confirm-rclone-path");
const cancelRclonePathButton = document.getElementById("cancel-rclone-path");

let selectedRemote = null;

// Handle rclone setup
ipcRenderer.on('show-rclone-setup', async () => {
    const currentPath = await ipcRenderer.invoke('get-rclone-path');
    rclonePathInput.value = currentPath || '/usr/local/bin/rclone';
    overlay.classList.add("show");
    rcloneSetupDialog.classList.add("show");
});

// Add button to use default path
document.getElementById("use-default-path").addEventListener("click", async () => {
    rclonePathInput.value = '/usr/local/bin/rclone';
    const isValid = await ipcRenderer.invoke('validate-rclone-path', rclonePathInput.value);
    if (isValid) {
        configStatusElement.textContent = "Rclone path configured successfully!";
        hideRcloneSetupDialog();
        enableProviderButtons();
    } else {
        configStatusElement.textContent = "Default rclone path is not valid. Please install rclone first.";
    }
});

confirmRclonePathButton.addEventListener("click", async () => {
    const rclonePath = rclonePathInput.value.trim();
    if (!rclonePath) {
        configStatusElement.textContent = "Please enter the rclone path";
        return;
    }
    
    configStatusElement.textContent = "Validating rclone path...";
    const isValid = await ipcRenderer.invoke('validate-rclone-path', rclonePath);
    
    if (isValid) {
        configStatusElement.textContent = "Rclone path configured successfully!";
        hideRcloneSetupDialog();
        enableProviderButtons();
    } else {
        configStatusElement.textContent = "Invalid rclone path. Please check the path and try again.";
    }
});

cancelRclonePathButton.addEventListener("click", hideRcloneSetupDialog);

function hideRcloneSetupDialog() {
    overlay.classList.remove("show");
    rcloneSetupDialog.classList.remove("show");
}

// Provider configuration handlers
const providers = new Map([
    ['gdrive', 'drive'],
    ['onedrive', 'onedrive'],
    ['box', 'box'],
    ['dropbox', 'dropbox']
]);

// Add provider button handlers
addGdriveButton.addEventListener("click", () => {
    currentProvider = 'gdrive';
    showRemoteDialog("Google Drive");
});

addOnedriveButton.addEventListener("click", () => {
    currentProvider = 'onedrive';
    showRemoteDialog("OneDrive");
});

addBoxButton.addEventListener("click", () => {
    currentProvider = 'box';
    showRemoteDialog("Box");
});

addDropboxButton.addEventListener("click", () => {
    currentProvider = 'dropbox';
    showRemoteDialog("Dropbox");
});

// Remote dialog handlers
function showRemoteDialog(providerName) {
    remoteDialog.querySelector('h3').textContent = `New ${providerName} Remote`;
    overlay.classList.add("show");
    remoteDialog.classList.add("show");
    remoteNameInput.value = "";
    remoteNameInput.focus();
}

function hideRemoteDialog() {
    overlay.classList.remove("show");
    remoteDialog.classList.remove("show");
    currentProvider = null;
}

confirmRemoteButton.addEventListener("click", () => {
    const remoteName = remoteNameInput.value.trim();
    
    if (!remoteName) {
        configStatusElement.textContent = "Please enter a remote name";
        return;
    }
    const providerType = providers.get(currentProvider);
    if (!providerType) {
        configStatusElement.textContent = "Invalid provider type";
        return;
    }
    configStatusElement.textContent = "Starting configuration...";
    disableProviderButtons(true);
    ipcRenderer.send("configure-remote", {
        name: remoteName,
        provider: providerType
    });
    hideRemoteDialog();
});

cancelRemoteButton.addEventListener("click", hideRemoteDialog);

// Close application
closeButton.addEventListener("click", () => {
    closeButton.disabled = true;
    configStatusElement.textContent = "Cleaning up and closing...";
    ipcRenderer.send("close-app");
});

// Reload button handler
reloadButton.addEventListener("click", () => {
    configStatusElement.textContent = "Reloading remotes list...";
    reloadButton.disabled = true;
    ipcRenderer.send("list-remotes");
});

// Handle delete status
ipcRenderer.on("delete-status", (event, { success, message }) => {
    configStatusElement.textContent = message;
    if (success) {
        selectedRemote = null;
        // Refresh the remotes list
        ipcRenderer.send("list-remotes");
    }
});

// Request initial remotes list
ipcRenderer.send("list-remotes");

// Handle remote selection
function handleRemoteClick(remoteName) {
    // Remove previous selection
    const previousSelected = remoteList.querySelector('.selected');
    if (previousSelected) {
        previousSelected.classList.remove('selected');
    }

    // Add selection to clicked remote
    const remoteElements = remoteList.querySelectorAll('.remote-item');
    for (const element of remoteElements) {
        if (element.querySelector('.remote-item-name').textContent === remoteName) {
            element.classList.add('selected');
            break;
        }
    }

    selectedRemote = remoteName;
    const remoteStatusElement = document.getElementById('remote-status');
    if (remoteStatusElement) {
        remoteStatusElement.textContent = `Selected remote: ${remoteName}`;
    }
}

// Handle remotes list update
ipcRenderer.on("remotes-list", (event, remotes) => {
    // Create remotes list
    const remotesList = document.createElement("div");
    remotesList.className = "remote-items";
    
    if (remotes.length > 0) {
        remotesList.innerHTML = remotes.map(remote => `
            <div class="remote-item">
                <span class="remote-item-name">${remote}</span>
                <div class="remote-item-actions">
                    <button class="action-icon check" title="Check Remote">
                        <svg width="16" height="16" viewBox="0 0 16 16">
                            <path fill="currentColor" d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                        </svg>
                    </button>
                    <button class="action-icon delete" title="Delete Remote">
                        <svg width="16" height="16" viewBox="0 0 16 16">
                            <path fill="currentColor" d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                            <path fill="currentColor" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                        </svg>
                    </button>
                </div>
            </div>
        `).join("");

        // Add status display
        const statusDiv = document.createElement("div");
        statusDiv.id = "remote-status";
        statusDiv.style = "margin-top: 15px; font-family: monospace; white-space: pre-wrap;";

        // Update remoteList content
        remoteList.innerHTML = '';
        remoteList.appendChild(remotesList);
        remoteList.appendChild(statusDiv);

        // Add click handlers
        const remoteItems = remotesList.querySelectorAll('.remote-item');
        remoteItems.forEach(item => {
            const remoteName = item.querySelector('.remote-item-name').textContent;
            
            // Name click handler
            item.querySelector('.remote-item-name').addEventListener('click', () => {
                handleRemoteClick(remoteName);
            });

            // Check button handler
            item.querySelector('.action-icon.check').addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (selectedRemote === remoteName) {
                    configStatusElement.textContent = "Testing remote connection...";
                    remoteList.classList.add('loading');
                    ipcRenderer.send("check-remote", remoteName);
                }
            });

            // Delete button handler
            item.querySelector('.action-icon.delete').addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (selectedRemote === remoteName) {
                    configStatusElement.textContent = `Deleting remote ${remoteName}...`;
                    ipcRenderer.send("delete-remote", remoteName);
                }
            });
        });

        // Reselect previously selected remote
        if (selectedRemote && remotes.includes(selectedRemote)) {
            handleRemoteClick(selectedRemote);
        } else {
            selectedRemote = null;
        }
    } else {
        remoteList.innerHTML = 'No remotes configured';
        selectedRemote = null;
    }

    // Update status
    configStatusElement.textContent = remotes.length > 0 
        ? `${remotes.length} remote(s) found` 
        : "No remotes configured";

    // Enable buttons
    reloadButton.disabled = false;
    enableProviderButtons();
});

// Handle remote check status
ipcRenderer.on("remote-status", (event, result) => {
    remoteList.classList.remove('loading');
    const remoteStatusElement = document.getElementById('remote-status');
    if (remoteStatusElement) {
        remoteStatusElement.textContent = result.summary + "\n\n" + result.recentFiles;
    }
});

// Handle configuration status
ipcRenderer.on("config-status", (event, message) => {
    // Clean up and improve status message
    let cleanMessage = message;
    
    if (message.includes("Rclone is not installed")) {
        cleanMessage = "Error: Rclone is not installed\n\nPlease install rclone first:\n1. Visit https://rclone.org/install/\n2. Follow the installation instructions for your system\n3. Restart this application";
        disableProviderButtons(true);
    } else if (message.includes("token =")) {
        cleanMessage = "Remote configured successfully! (Browser connection errors can be ignored)";
        enableProviderButtons();
    } else if (message.includes("Make sure your Redirect URL")) {
        cleanMessage = "Waiting for authorization...";
        disableProviderButtons(true);
    } else if (message.includes("type =")) {
        cleanMessage = "Remote configured successfully! (Browser connection errors can be ignored)";
        // Request fresh list of remotes after a short delay to ensure rclone has finished writing config
        setTimeout(() => {
            ipcRenderer.send("list-remotes");
            enableProviderButtons();
        }, 1000);
    } else {
        enableProviderButtons();
    }
    
    configStatusElement.textContent = cleanMessage;
});

function disableProviderButtons(disabled) {
    addGdriveButton.disabled = disabled;
    addOnedriveButton.disabled = disabled;
    addBoxButton.disabled = disabled;
    addDropboxButton.disabled = disabled;
}

function enableProviderButtons() {
    disableProviderButtons(false);
}