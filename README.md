# Rclone Configuration App

A desktop application for managing rclone remote configurations.

## Features

### Remote Management

The application provides a user-friendly interface for managing rclone remotes:

#### Connected Remotes Section
- Lists all configured rclone remotes
- "Reload Remotes" button next to section title to refresh the list
- Each remote entry shows:
  - Remote name
  - Action icons (visible when remote is selected):
    - ✓ Check Remote: Tests the remote connection and shows recent files
    - 🗑️ Delete Remote: Removes the remote configuration

#### Adding New Remotes
- Supports major cloud storage providers:
  - Google Drive
  - OneDrive
  - Box
  - Dropbox
- Simple configuration flow with OAuth authentication

## Usage

1. Select a remote from the list to manage it
2. Use the action icons to:
   - Check remote connection and view contents
   - Delete the remote configuration
3. Click "Reload Remotes" to refresh the list after making changes
4. Add new remotes using the provider buttons in the "Add New Remote" section

## Requirements

- rclone must be installed on your system
- Supported operating systems: Windows, macOS, Linux