#!/bin/bash

# Get the absolute path of the backup script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
BACKUP_SCRIPT="$SCRIPT_DIR/backup.sh"

# Make backup script executable
chmod +x "$BACKUP_SCRIPT"

# Function to add cron job
setup_cron() {
    local interval=$1
    local schedule=""
    
    case $interval in
        "1") schedule="0 * * * *" ;; # Every hour
        "2") schedule="0 */2 * * *" ;; # Every 2 hours
        "4") schedule="0 */4 * * *" ;; # Every 4 hours
        "8") schedule="0 */8 * * *" ;; # Every 8 hours
        "24") schedule="0 0 * * *" ;; # Every 24 hours
        *) echo "Invalid interval"; exit 1 ;;
    esac
    
    # Remove any existing cron job for this backup
    crontab -l | grep -v "$BACKUP_SCRIPT" | crontab -
    
    # Add new cron job
    (crontab -l 2>/dev/null; echo "$schedule $BACKUP_SCRIPT") | crontab -
    
    echo "Backup scheduled to run$([[ $interval == 1 ]] && echo " every hour" || echo " every $interval hours")"
}

# Function to remove cron job
remove_cron() {
    crontab -l | grep -v "$BACKUP_SCRIPT" | crontab -
    echo "Backup schedule removed"
}

# Show usage if no arguments provided
if [ $# -eq 0 ]; then
    echo "Usage: $0 [start interval_hours|stop]"
    echo "Example: $0 start 24    # Schedule backup every 24 hours"
    echo "         $0 stop        # Remove backup schedule"
    exit 1
fi

# Process commands
case $1 in
    "start")
        if [ -z "$2" ]; then
            echo "Please specify interval in hours (1, 2, 4, 8, or 24)"
            exit 1
        fi
        setup_cron "$2"
        ;;
    "stop")
        remove_cron
        ;;
    *)
        echo "Invalid command. Use 'start' or 'stop'"
        exit 1
        ;;
esac