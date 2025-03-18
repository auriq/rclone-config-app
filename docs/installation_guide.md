# Installation Guide for Rclone Config App (macOS)

## About Rclone Config App

Rclone Config App is a graphical user interface for managing rclone configurations. It provides an easy way to:

- Configure cloud storage providers (Google Drive, OneDrive, Dropbox, Box)
- Manage multiple remote connections
- Test remote connections
- View remote storage contents
- Delete remote configurations

The app simplifies the process of setting up rclone by providing a user-friendly interface instead of using command-line commands.

## System Requirements

- macOS 10.12 or later
- arm64 (Apple Silicon) processor
- No npm or Node.js required (the app is pre-built and ready to use)

## Prerequisites

Only rclone is required to use the application:

1. Install Homebrew (if not already installed):
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

2. Install rclone using Homebrew:
```bash
brew install rclone
```
This will install rclone to the default location: `/usr/local/bin/rclone`

## Installing Rclone Config App

1. Open `Rclone Config App-1.0.0-mac-arm64-installer.dmg`
2. When the DMG window opens, drag the Rclone Config App to the Applications folder
3. Close the DMG window
4. Right-click (or Control-click) the DMG file and select "Eject"

## First Launch

1. Open Finder and navigate to Applications
2. Right-click (or Control-click) "Rclone Config App" and select "Open"
3. Click "Open" in the security dialog if it appears
4. The app should automatically detect rclone in `/usr/local/bin/rclone`
5. If rclone is not detected, use the "Use Default Path" button in the setup dialog

## Verify Installation

- The app should show the main interface with buttons for different cloud providers
- You can add a new remote by clicking any of the cloud provider buttons
- The app will use the system's rclone installation for all operations

## Troubleshooting

### Rclone Not Found
If you see "rclone not found" error, verify rclone is installed by running:
```bash
which rclone
```

### Custom Rclone Location
If rclone is installed but not in the default location, enter its path in the setup dialog.

### Uninstallation
If you need to remove the application and its data:

```bash
# Remove the app
rm -rf "/Applications/Rclone Config App.app"

# Remove app data (optional)
rm -rf ~/.config/rclone-config-app

# Remove rclone (optional)
brew uninstall rclone
```

## Support

If you encounter any issues:
1. Verify rclone is properly installed and working by running `rclone version`
2. Check the app's configuration directory at `~/.config/rclone-config-app`
3. Ensure you have proper permissions to access the Applications folder