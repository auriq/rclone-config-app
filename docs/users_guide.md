# Rclone Configuration App - User's Guide

## Main Interface

### Connected Remotes Section

The main interface shows your configured remotes in the "Connected Remotes" section:

1. **Section Header**
   - Title: "Connected Remotes"
   - Reload button: Click to refresh the list of remotes

2. **Remote List**
   - Each remote is displayed as a clickable item
   - Click a remote to select it
   - Selected remote is highlighted with a blue border

3. **Remote Actions**
   When a remote is selected, two action icons appear:
   - ✓ Check Remote: Tests the connection and shows recent files
   - 🗑️ Delete Remote: Removes the remote configuration

### Managing Remotes

#### Checking a Remote
1. Click on a remote name to select it
2. Click the checkmark icon (✓)
3. The app will:
   - Test the connection
   - Display the total number of files
   - Show a list of recent files

#### Deleting a Remote
1. Click on a remote name to select it
2. Click the trash icon (🗑️)
3. The remote will be removed from your configuration

#### Reloading the Remote List
- Click the "Reload Remotes" button next to the section title
- Use this after:
  - Adding a new remote
  - Deleting a remote
  - Making changes outside the app

### Adding New Remotes

The "Add New Remote" section provides buttons for supported cloud providers:

1. Choose a provider:
   - Google Drive
   - OneDrive
   - Box
   - Dropbox

2. Enter configuration:
   - Provide a name for the remote
   - Follow the OAuth authentication process

3. After setup:
   - New remote appears in the list
   - Ready for immediate use

## Tips

- Always select a remote before using action icons
- Use "Reload Remotes" if the list seems outdated
- Check the status messages at the bottom for operation feedback