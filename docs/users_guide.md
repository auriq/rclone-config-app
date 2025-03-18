# Rclone Config App User Guide

This guide explains how to use the Rclone Config App to manage your cloud storage connections.

## Overview

Rclone Config App provides a graphical interface for:
- Setting up cloud storage connections
- Managing existing connections
- Testing connections
- Viewing storage contents
- Removing connections

## Getting Started

1. Launch the application
2. The app will automatically detect rclone on your system
3. If rclone is not found, you'll be prompted to:
   - Use the default path
   - Or enter the path to your rclone installation

## Adding a New Remote

1. Click one of the cloud provider buttons:
   - Google Drive
   - OneDrive
   - Dropbox
   - Box

2. Enter a name for your remote:
   - Choose a descriptive name
   - Use only letters, numbers, and underscores
   - Example: "personal_gdrive" or "work_onedrive"

3. Follow the authentication process:
   - A browser window will open automatically
   - Log in to your cloud service
   - Grant permission to rclone
   - Return to the app

4. Wait for confirmation:
   - The app will verify the connection
   - You'll see "Remote configured successfully!" when complete
   - The new remote will appear in the list

## Managing Existing Remotes

### Viewing Remotes
- All configured remotes are listed in the main window
- Click on a remote to select it
- Selected remote's details will be displayed

### Testing a Remote
1. Select a remote from the list
2. Click "Check Remote"
3. The app will:
   - Test the connection
   - Show storage usage information
   - Display recent files (up to 100)

### Deleting a Remote
1. Select the remote you want to remove
2. Click "Delete Remote"
3. The remote will be removed from your configuration
4. The remotes list will update automatically

## Understanding the Interface

### Main Window
- Top: Application header with status messages
- Center: List of configured remotes
- Bottom: Cloud provider buttons for adding new remotes

### Remote List
- Shows all configured remotes
- Click a remote to select it
- Selected remote is highlighted
- Shows status and file information when checked

### Status Messages
- Appear below the header
- Show:
  - Configuration progress
  - Connection status
  - Error messages
  - Success confirmations

### Action Buttons
- Check Remote: Tests the selected connection
- Delete Remote: Removes the selected remote
- Cloud Provider Buttons: Add new remotes

## Common Tasks

### Setting Up Google Drive
1. Click "Google Drive" button
2. Enter a name for the remote
3. Log in to your Google account
4. Grant permissions to rclone
5. Wait for confirmation

### Setting Up OneDrive
1. Click "OneDrive" button
2. Enter a name for the remote
3. Log in to your Microsoft account
4. Grant permissions to rclone
5. Wait for confirmation

### Setting Up Dropbox
1. Click "Dropbox" button
2. Enter a name for the remote
3. Log in to your Dropbox account
4. Grant permissions to rclone
5. Wait for confirmation

### Setting Up Box
1. Click "Box" button
2. Enter a name for the remote
3. Log in to your Box account
4. Grant permissions to rclone
5. Wait for confirmation

## Troubleshooting

### Authentication Issues
- Ensure you're connected to the internet
- Try closing and reopening the app
- Check if your cloud service is accessible
- Try deleting and recreating the remote

### Connection Problems
- Select the remote and click "Check Remote"
- Verify your internet connection
- Check if the cloud service is operational
- Try restarting the application

### Configuration Errors
- Make sure rclone is properly installed
- Check the rclone path in settings
- Verify you have proper permissions
- Try removing and re-adding the remote

### Browser Authentication
- The app will open your default browser
- Allow pop-ups from the application
- Complete the authentication process
- Return to the app after granting access

## Best Practices

1. Naming Remotes
   - Use descriptive names
   - Include provider type
   - Add purpose or location
   - Example: "personal_gdrive_backup"

2. Regular Testing
   - Test remotes periodically
   - Check storage usage
   - Verify file access
   - Monitor for issues

3. Organization
   - Keep remote list organized
   - Delete unused remotes
   - Document remote purposes
   - Maintain clear naming conventions

## Closing the Application

1. Click the "Close Application" button
2. The app will:
   - Clean up any temporary files
   - Save configurations
   - Close properly

## Getting Help

If you encounter issues:
1. Check the status messages
2. Verify rclone installation
3. Test the remote connection
4. Consult the troubleshooting section
5. Check rclone documentation for specific providers