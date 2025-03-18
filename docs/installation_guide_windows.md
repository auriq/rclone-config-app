# Installation Guide for Rclone Config App (Windows)

## Downloads

### Latest Release (v1.0.0)

Download Link:
- [Rclone Config App-1.0.0-win-x64-setup.exe](https://asi-opendata.s3.us-east-1.amazonaws.com/rclone-config-app/Rclone+Config+App-1.0.0-win-x64-setup.exe)

## Prerequisites

1. Download and install rclone:
   - Visit [Rclone Downloads](https://rclone.org/downloads/)
   - Download the Windows installer
   - Run the installer and follow the prompts
   - Default installation path: `C:\Program Files\rclone\rclone.exe`

## Installation Steps

1. Download the setup.exe from the link above
2. Run the installer
3. Choose installation options:
   - Installation directory
   - Desktop shortcut (recommended)
   - Start menu shortcut (recommended)
4. Click "Install"
5. Wait for installation to complete
6. Click "Finish"

## First Launch

1. Start the application:
   - From Start Menu (if installed)
   - From Desktop shortcut
   - Or directly from installation directory
2. The app should detect rclone automatically
3. If rclone is not found:
   - Use "Use Default Path" button
   - Or enter path manually: `C:\Program Files\rclone\rclone.exe`

## Verification

After installation, verify that:
- The app appears in Start Menu (if installed)
- Desktop shortcut works (if created)
- Rclone is detected automatically
- You can access the main interface

## Troubleshooting

### Security Warning
If Windows Defender SmartScreen shows a warning:
1. Click "More info"
2. Click "Run anyway"

### Rclone Not Found
If you see "rclone not found" error:
1. Open Command Prompt and run:
   ```cmd
   where rclone
   ```
2. Verify rclone is in `C:\Program Files\rclone\`
3. If installed elsewhere, enter the correct path in settings

### Permission Issues
If you encounter permission issues:
1. Run the installer as Administrator
2. Check Windows User Account Control settings
3. Verify write access to installation directory

## Uninstallation

1. Close the application
2. Open Windows Settings
3. Go to Apps & Features
4. Find "Rclone Config App"
5. Click Uninstall
6. Follow uninstallation prompts
7. Remove configuration (optional):
   ```cmd
   rd /s /q "%APPDATA%\rclone-config-app"
   ```

### Remove Rclone (Optional)
1. Open Windows Settings
2. Go to Apps & Features
3. Find "rclone"
4. Click Uninstall

## Support

If you encounter issues:
1. Check rclone installation: Run `rclone version` in Command Prompt
2. Verify app configuration: Check `%APPDATA%\rclone-config-app`
3. Ensure proper permissions
4. Consult the [User Guide](users_guide.md) for usage instructions