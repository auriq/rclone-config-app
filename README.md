# Rclone Config App

A cross-platform desktop application that provides a graphical user interface for managing rclone configurations. This application simplifies the process of setting up and managing cloud storage connections through rclone.

[English](README.md) | [日本語](README_ja.md)

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Windows-lightgrey.svg)

## Features

- Easy-to-use graphical interface for rclone configuration
- Support for multiple cloud storage providers:
  - Google Drive
  - OneDrive
  - Dropbox
  - Box
- Visual remote management
- Connection testing
- Storage content viewing
- Cross-platform support (macOS and Windows)

## System Requirements

### macOS
- macOS 10.12 or later
- arm64 (Apple Silicon) processor
- rclone installed

### Windows
- Windows 10 or later
- 64-bit (x64) processor
- rclone installed

## Quick Start

1. Install rclone on your system
2. Download the appropriate package for your system:
   - macOS: `Rclone Config App-1.0.0-mac-arm64-installer.dmg`
   - Windows: `Rclone Config App-1.0.0-win-x64-setup.exe`
3. Install and launch the application
4. Start configuring your cloud storage connections

## Documentation

Comprehensive documentation is available in both English and Japanese:

### For Users
- [Installation Guide (macOS)](docs/installation_guide.md)
- [Installation Guide (Windows)](docs/installation_guide_windows.md)
- [User Guide](docs/users_guide.md)

### For Developers
- [Development Guide](docs/development_guide.md)

### 日本語ドキュメント
- [インストールガイド (macOS)](docs/installation_guide_ja.md)
- [インストールガイド (Windows)](docs/installation_guide_windows_ja.md)
- [ユーザーガイド](docs/users_guide_ja.md)
- [開発ガイド](docs/development_guide_ja.md)

## Development

### Prerequisites
- Node.js 18.x or later
- npm 9.x or later
- Git
- rclone installed

### Setup
```bash
# Clone the repository
git clone <repository-url>
cd rclone-config-app

# Install dependencies
npm install

# Start the application in development mode
npm start
```

### Building
```bash
# Build for current platform
npm run dist

# Build for specific platforms
npm run dist -- -m  # macOS only
npm run dist -- -w  # Windows only
npm run dist -- -mw # Both platforms
```

## Project Structure

```
rclone-config-app/
├── src/                    # Source code
│   ├── main.js            # Main process
│   ├── renderer.js        # Renderer process
│   └── index.html         # Main window
├── docs/                  # Documentation
├── scripts/               # Utility scripts
├── build/                 # Distribution packages
└── package.json          # Project configuration
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Uninstallation

### macOS
1. Close the application
2. Remove the application:
   ```bash
   rm -rf "/Applications/Rclone Config App.app"
   ```
3. Remove configuration and data (optional):
   ```bash
   rm -rf ~/.config/rclone-config-app
   ```
4. Remove rclone if no longer needed:
   ```bash
   brew uninstall rclone
   ```

### Windows
1. Close the application
2. Uninstall using Windows Settings:
   - Open Settings > Apps > Apps & Features
   - Find "Rclone Config App"
   - Click Uninstall
3. Remove configuration and data (optional):
   ```cmd
   rd /s /q "%APPDATA%\rclone-config-app"
   ```
4. Uninstall rclone if no longer needed:
   - Use Windows Settings > Apps & Features
   - Or delete from Program Files

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Note: This project uses rclone (also MIT licensed) as a dependency. While we integrate with rclone, this application is a separate project with its own license.

## Acknowledgments

- [Rclone](https://rclone.org/) - The underlying tool that makes this possible
- [Electron](https://www.electronjs.org/) - Framework for building cross-platform applications
- Cloud storage providers for their APIs and services