# Development Guide for Rclone Config App

This guide explains how to set up and run the Rclone Config App from source code for development purposes.

## Development Requirements

- Node.js 18.x or later
- npm 9.x or later
- Git
- rclone installed on your system

## Setting Up Development Environment

1. Install Node.js and npm:
   - Visit https://nodejs.org
   - Download and install the LTS version
   - Verify installation:
     ```bash
     node --version
     npm --version
     ```

2. Install rclone:
   - macOS: `brew install rclone`
   - Windows: Download from https://rclone.org/downloads/
   - Verify installation: `rclone --version`

3. Clone the repository:
   ```bash
   git clone <repository-url>
   cd rclone-config-app
   ```

4. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

1. Start the application in development mode:
   ```bash
   npm start
   ```
   This will launch the Electron application with hot reload enabled.

## Building from Source

1. Build for your current platform:
   ```bash
   npm run dist
   ```

2. Build for specific platforms:
   - macOS only: `npm run dist -- -m`
   - Windows only: `npm run dist -- -w`
   - Both platforms: `npm run dist -- -mw`

The built packages will be available in the `dist` directory.

## Project Structure

```
rclone-config-app/
├── src/                    # Source code files
│   ├── main.js            # Main electron process
│   ├── renderer.js        # Renderer process
│   └── index.html         # Main application window
│
├── scripts/               # Utility scripts
│   ├── kill-app.bat      # Windows process cleanup
│   ├── kill-app.sh       # macOS process cleanup
│   ├── setup-scheduler.bat# Windows scheduler setup
│   └── setup-scheduler.sh # macOS scheduler setup
│
├── docs/                  # Documentation
├── build/                 # Distribution packages
├── package.json          # Project configuration
└── package-lock.json     # Locked dependencies
```

## Development Scripts

- `npm start`: Run the app in development mode
- `npm run pack`: Create unpacked build for testing
- `npm run dist`: Create distributable packages

## Making Changes

1. Main Process (main.js):
   - Handles application lifecycle
   - Manages rclone configuration
   - Implements IPC communication

2. Renderer Process (renderer.js):
   - Implements UI logic
   - Handles user interactions
   - Communicates with main process

3. User Interface (index.html):
   - Defines application layout
   - Contains styles and markup
   - References renderer.js

## Building Distribution Packages

1. Update version in package.json
2. Build the packages:
   ```bash
   npm run dist
   ```
3. Test the built packages:
   - macOS: Test the .dmg installer
   - Windows: Test both setup.exe and portable.exe

## Troubleshooting Development

1. If the app won't start:
   ```bash
   # Clear npm cache
   npm cache clean --force
   # Reinstall dependencies
   rm -rf node_modules
   npm install
   ```

2. If changes aren't reflecting:
   - Restart the application
   - Clear the app data:
     ```bash
     # macOS
     rm -rf ~/.config/rclone-config-app
     # Windows
     rd /s /q "%APPDATA%\rclone-config-app"
     ```

3. Debug logs:
   - Main process: Console where npm start was run
   - Renderer process: DevTools (Ctrl+Shift+I or Cmd+Option+I)

## Code Style

- Use consistent indentation (2 spaces)
- Follow JavaScript Standard Style
- Add comments for complex logic
- Keep functions focused and modular
- Handle errors appropriately

## Testing

Before submitting changes:
1. Test basic functionality
2. Verify rclone integration
3. Check error handling
4. Test on both macOS and Windows if possible
5. Ensure clean builds work