const { ipcRenderer } = require("electron");

// Button elements
const addGdriveButton = document.getElementById("add-gdrive");
const addOnedriveButton = document.getElementById("add-onedrive");
const addBoxButton = document.getElementById("add-box");
const addDropboxButton = document.getElementById("add-dropbox");
const testRemoteButton = document.getElementById("test-remote");
const deleteRemoteButton = document.getElementById("delete-remote");
const closeButton = document.getElementById("close");

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

let selectedRemote = null;
let currentProvider = null;

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

// Test remote connection
testRemoteButton.addEventListener("click", () => {
    if (!selectedRemote) {
        configStatusElement.textContent = "Please select a remote to check";
        return;
    }
    testRemoteButton.disabled = true;
    configStatusElement.textContent = "Testing remote connection...";
    remoteList.classList.add('loading');
    const remoteStatusElement = document.getElementById('remote-status');
    if (remoteStatusElement) {
        remoteStatusElement.textContent = `Checking remote ${selectedRemote}...`;
    }
    ipcRenderer.send("check-remote", selectedRemote);
});

// Close application
// Delete remote handler
deleteRemoteButton.addEventListener("click", () => {
    if (!selectedRemote) {
        configStatusElement.textContent = "Please select a remote to delete";
        return;
    }
    deleteRemoteButton.disabled = true;
    configStatusElement.textContent = `Deleting remote ${selectedRemote}...`;
    ipcRenderer.send("delete-remote", selectedRemote);
});

closeButton.addEventListener("click", () => {
    closeButton.disabled = true;
    configStatusElement.textContent = "Cleaning up and closing...";
    ipcRenderer.send("close-app");
});

// Handle delete status
ipcRenderer.on("delete-status", (event, { success, message }) => {
    configStatusElement.textContent = message;
    if (success) {
        selectedRemote = null;
        testRemoteButton.disabled = true;
        deleteRemoteButton.disabled = true;
        // Refresh the remotes list
        ipcRenderer.send("list-remotes");
    } else {
        deleteRemoteButton.disabled = false;
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
        if (element.textContent === remoteName) {
            element.classList.add('selected');
            break;
        }
    }

    selectedRemote = remoteName;
    testRemoteButton.disabled = false;
    deleteRemoteButton.disabled = false;
    const remoteStatusElement = document.getElementById('remote-status');
    if (remoteStatusElement) {
        remoteStatusElement.textContent = `Selected remote: ${remoteName}`;
    }
}

// Handle remotes list update
ipcRenderer.on("remotes-list", (event, remotes) => {
    // Update remote list display
    let content = '';
    if (remotes.length > 0) {
        content = `
            <div class="remote-items">
                ${remotes.map(remote => `<div class="remote-item">${remote}</div>`).join("")}
            </div>
            <div id="remote-status" style="margin-top: 15px; font-family: monospace; white-space: pre-wrap;"></div>
        `;
        
        remoteList.innerHTML = content;
        
        // Add click handlers to all remote items
        const remoteItems = remoteList.querySelectorAll('.remote-item');
        remoteItems.forEach(item => {
            item.addEventListener('click', () => handleRemoteClick(item.textContent));
        });
        
        // If previously selected remote still exists, reselect it
        if (selectedRemote && remotes.includes(selectedRemote)) {
            handleRemoteClick(selectedRemote);
        } else {
            selectedRemote = null;
            testRemoteButton.disabled = true;
            deleteRemoteButton.disabled = true;
        }
    } else {
        remoteList.innerHTML = "No remotes configured";
        selectedRemote = null;
        testRemoteButton.disabled = true;
        deleteRemoteButton.disabled = true;
    }
    
    enableProviderButtons();
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

// Handle remote check status
ipcRenderer.on("remote-status", (event, result) => {
    testRemoteButton.disabled = false;
    remoteList.classList.remove('loading');
    const remoteStatusElement = document.getElementById('remote-status');
    if (remoteStatusElement) {
        remoteStatusElement.textContent = result.summary + "\n\n" + result.recentFiles;
    }
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