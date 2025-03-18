@echo off
setlocal enabledelayedexpansion

echo Finding backup app processes...

:: Kill node processes running electron
echo Checking for node processes...
tasklist /FI "IMAGENAME eq node.exe" /FO TABLE | findstr /i "node"
if %ERRORLEVEL% EQU 0 (
    echo Found node processes, killing them...
    taskkill /F /FI "IMAGENAME eq node.exe" /FI "WINDOWTITLE eq *electron*"
)

:: Kill Electron processes
echo Checking for Electron processes...
tasklist /FI "IMAGENAME eq electron.exe" /FO TABLE | findstr /i "electron"
if %ERRORLEVEL% EQU 0 (
    echo Found Electron processes, killing them...
    taskkill /F /IM electron.exe
)

:: Kill Electron Helper processes
echo Checking for Electron Helper processes...
tasklist /FI "WINDOWTITLE eq *Electron Helper*" /FO TABLE | findstr /i "electron"
if %ERRORLEVEL% EQU 0 (
    echo Found Electron Helper processes, killing them...
    taskkill /F /FI "WINDOWTITLE eq *Electron Helper*"
)

:: Verify
timeout /t 1 /nobreak > nul
echo Verifying all processes are killed...

tasklist /FI "IMAGENAME eq node.exe" /FI "WINDOWTITLE eq *electron*" /FO TABLE 2>NUL | find /I "node.exe" >NUL
set "node_running=!ERRORLEVEL!"

tasklist /FI "IMAGENAME eq electron.exe" /FO TABLE 2>NUL | find /I "electron.exe" >NUL
set "electron_running=!ERRORLEVEL!"

if !node_running! NEQ 0 if !electron_running! NEQ 0 (
    echo All app processes killed successfully
) else (
    echo Warning: Some processes might still be running
    tasklist /FI "IMAGENAME eq node.exe" /FI "WINDOWTITLE eq *electron*" /FO TABLE
    tasklist /FI "IMAGENAME eq electron.exe" /FO TABLE
)

endlocal