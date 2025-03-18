# Installation Guide for Rclone Config App (macOS)

## Downloads

### Latest Release (v1.0.0)

Download Link:
- [Rclone Config App-1.0.0-mac-arm64-installer.dmg](https://asi-opendata.s3.us-east-1.amazonaws.com/rclone-config-app/Rclone+Config+App-1.0.0-mac-arm64-installer.dmg)

## Prerequisites

1. Install Homebrew (if not already installed):
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

2. Install rclone using Homebrew:
```bash
brew install rclone
```

## Installation Steps

1. Download the .dmg installer from the link above
2. Open the downloaded .dmg file
3. Drag the Rclone Config App to your Applications folder
4. Close the installer window
5. Right-click (or Control-click) the DMG file and select "Eject"

## First Launch

1. Open Finder and navigate to Applications
2. Right-click (or Control-click) "Rclone Config App" and select "Open"
3. Click "Open" in the security dialog if it appears
4. The app should automatically detect rclone in `/usr/local/bin/rclone`
5. If rclone is not detected, use the "Use Default Path" button in the setup dialog

## Verification

After installation, verify that:
- The app appears in your Applications folder
- You can launch it without security warnings
- It detects rclone automatically
- You can access the main interface

## Troubleshooting

### Security Warning on First Launch
If you see a security warning:
1. Right-click (or Control-click) the app
2. Select "Open" from the context menu
3. Click "Open" in the dialog

### Rclone Not Found
If you see "rclone not found" error:
1. Verify rclone is installed:
   ```bash
   which rclone
   ```
2. Make sure it's in the default location: `/usr/local/bin/rclone`
3. If installed elsewhere, enter the correct path in the app's settings

### Permission Issues
If you encounter permission issues:
1. Check your user permissions
2. Ensure rclone is properly installed
3. Verify access to the Applications folder

## Uninstallation

If you need to remove the application:

1. Close the application
2. Remove the app:
   ```bash
   rm -rf "/Applications/Rclone Config App.app"
   ```
3. Remove configuration (optional):
   ```bash
   rm -rf ~/.config/rclone-config-app
   ```
4. Remove rclone if no longer needed:
   ```bash
   brew uninstall rclone
   ```

## Support

If you encounter issues:
1. Check rclone installation: `rclone version`
2. Verify app configuration: `~/.config/rclone-config-app`
3. Ensure proper permissions
4. Consult the [User Guide](users_guide.md) for usage instructions