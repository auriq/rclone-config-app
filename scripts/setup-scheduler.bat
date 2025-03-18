@echo off
setlocal enabledelayedexpansion

:: Get the absolute path of the backup script
set "SCRIPT_DIR=%~dp0"
set "BACKUP_SCRIPT=%SCRIPT_DIR%backup.bat"
set "TASK_NAME=RcloneBackup"

:: Function to create scheduled task
:create_task
    set "interval=%~1"
    set "schedule="
    
    if "%interval%"=="1" (
        set "schedule=/sc HOURLY"
    ) else if "%interval%"=="2" (
        set "schedule=/sc HOURLY /mo 2"
    ) else if "%interval%"=="4" (
        set "schedule=/sc HOURLY /mo 4"
    ) else if "%interval%"=="8" (
        set "schedule=/sc HOURLY /mo 8"
    ) else if "%interval%"=="24" (
        set "schedule=/sc DAILY"
    ) else (
        echo Invalid interval
        exit /b 1
    )
    
    :: Remove existing task if it exists
    schtasks /query /tn "%TASK_NAME%" >nul 2>&1
    if not errorlevel 1 (
        schtasks /delete /tn "%TASK_NAME%" /f >nul
    )
    
    :: Create new task
    schtasks /create /tn "%TASK_NAME%" %schedule% /tr "%BACKUP_SCRIPT%" /ru "%USERNAME%" /f
    if errorlevel 1 (
        echo Failed to create scheduled task
        exit /b 1
    )
    
    if "%interval%"=="1" (
        echo Backup scheduled to run every hour
    ) else (
        echo Backup scheduled to run every %interval% hours
    )
    exit /b 0

:: Function to remove scheduled task
:remove_task
    schtasks /query /tn "%TASK_NAME%" >nul 2>&1
    if not errorlevel 1 (
        schtasks /delete /tn "%TASK_NAME%" /f
        echo Backup schedule removed
    ) else (
        echo No backup schedule found
    )
    exit /b 0

:: Show usage if no arguments provided
if "%~1"=="" (
    echo Usage: %~nx0 [start interval_hours^|stop]
    echo Example: %~nx0 start 24    # Schedule backup every 24 hours
    echo          %~nx0 stop        # Remove backup schedule
    exit /b 1
)

:: Process commands
if "%~1"=="start" (
    if "%~2"=="" (
        echo Please specify interval in hours ^(1, 2, 4, 8, or 24^)
        exit /b 1
    )
    call :create_task "%~2"
) else if "%~1"=="stop" (
    call :remove_task
) else (
    echo Invalid command. Use 'start' or 'stop'
    exit /b 1
)