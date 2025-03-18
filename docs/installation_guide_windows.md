# Installation Guide for Rclone Config App (Windows)

## About Rclone Config App

Rclone Config App is a graphical user interface for managing rclone configurations. It provides an easy way to:

- Configure cloud storage providers (Google Drive, OneDrive, Dropbox, Box)
- Manage multiple remote connections
- Test remote connections
- View remote storage contents
- Delete remote configurations

The app simplifies the process of setting up rclone by providing a user-friendly interface instead of using command-line commands.

## System Requirements

- Windows 10 or later
- 64-bit (x64) processor
- No npm or Node.js required (the app is pre-built and ready to use)

## Prerequisites

Only rclone is required to use the application:

1. Download rclone for Windows:
   - Visit https://rclone.org/downloads/
   - Download the Windows installer
   - Run the installer and follow the prompts
   - Default installation path: `C:\Program Files\rclone\rclone.exe`

## Installing Rclone Config App

### Installer Method (Recommended)
1. Run `Rclone Config App-1.0.0-win-x64-setup.exe` from the dist folder
2. Choose your installation directory (or use the default)
3. Select additional options:
   - Create desktop shortcut
   - Create start menu shortcut
4. Click "Install"
5. Click "Finish" when installation completes

### Portable Method
1. Extract `Rclone Config App-1.0.0-win-x64-portable.exe` to your preferred location
2. Double-click the extracted executable to run

## First Launch

1. Launch Rclone Config App from:
   - Start Menu
   - Desktop shortcut (if created)
   - Installation directory
2. The app should automatically detect rclone in `C:\Program Files\rclone\rclone.exe`
3. If rclone is not detected, use the "Use Default Path" button in the setup dialog
4. If rclone is installed in a different location, enter the correct path

## Verify Installation

- The app should show the main interface with buttons for different cloud providers
- You can add a new remote by clicking any of the cloud provider buttons
- The app will use the system's rclone installation for all operations

## Troubleshooting

### Rclone Not Found
If you see "rclone not found" error:
1. Open Command Prompt and run:
```cmd
where rclone
```
2. Make sure the path matches what's entered in the app's settings

### Custom Rclone Location
If rclone is installed in a non-default location:
1. Open the app
2. Enter the full path to rclone.exe in the setup dialog
3. Click "Save Path" to validate

### Uninstallation

#### Installer Version
1. Open Windows Settings
2. Go to Apps & Features
3. Find "Rclone Config App"
4. Click Uninstall

#### Portable Version
1. Delete the executable file
2. Optionally, remove app data:
   ```cmd
   rd /s /q "%APPDATA%\rclone-config-app"
   ```
3. Remove rclone (optional):
   - Use Windows Settings > Apps & Features
   - Or delete from Program Files

## Support

If you encounter any issues:
1. Verify rclone is properly installed by running `rclone version` in Command Prompt
2. Check the app's configuration directory at `%APPDATA%\rclone-config-app`
3. Ensure you have proper permissions to access the installation directory