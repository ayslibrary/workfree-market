@echo off
chcp 65001 > nul
cls
echo =====================================================================
echo    WorkFree AI Agent - Zero-Touch Automation Agent Setup
echo =====================================================================
echo.

if not exist "C:\Automation" mkdir "C:\Automation"
if not exist "C:\Automation\Data" mkdir "C:\Automation\Data"
if not exist "C:\Automation\Reports" mkdir "C:\Automation\Reports"
if not exist "C:\Automation\Logs" mkdir "C:\Automation\Logs"

echo [1/3] Setting up Python dependencies...
python -m pip install pywin32 openpyxl schedule > nul 2>&1

echo [2/3] Downloading Agent Controller Script...
powershell -Command "(New-Object System.Net.WebClient).DownloadFile('https://workfreemarket.com/automation_agent/setup_pilot.py', 'C:\Automation\setup_pilot.py')" > nul 2>&1

echo [3/3] Launching Pilot Agent...
echo.
python C:\Automation\setup_pilot.py

echo.
echo =====================================================================
echo    WorkFree AI Agent Setup Completed Successfully!
echo =====================================================================
echo.
pause
