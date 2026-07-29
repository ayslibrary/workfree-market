@echo off
chcp 65001 > nul
title WorkFree AI Agent Installer ^& Controller
color 0A

echo =====================================================================
echo    🤖 WorkFree AI Agent - Zero-Touch Automation Agent Setup
echo =====================================================================
echo.

echo 📁 [1/4] Setting up C:\Automation Workspace...
if not exist "C:\Automation" mkdir "C:\Automation"
if not exist "C:\Automation\Data" mkdir "C:\Automation\Data"
if not exist "C:\Automation\Reports" mkdir "C:\Automation\Reports"
if not exist "C:\Automation\Logs" mkdir "C:\Automation\Logs"
echo    ✓ Workspace Directories Created Successfully!
echo.

echo 📦 [2/4] Checking Python ^& Installing Dependencies (pywin32, openpyxl, schedule)...
python -m pip install pywin32 openpyxl schedule > nul 2>&1
echo    ✓ Required Python Modules Verified!
echo.

echo ⚡ [3/4] Downloading Agent Controller Script...
powershell -Command "Invoke-WebRequest -Uri 'https://workfreemarket.com/automation_agent/setup_pilot.py' -OutFile 'C:\Automation\setup_pilot.py'" > nul 2>&1
echo    ✓ Agent Controller Downloaded!
echo.

echo 🚀 [4/4] Launching Pilot Agent Task...
python C:\Automation\setup_pilot.py

echo.
echo =====================================================================
echo  🎉 WorkFree AI Agent Setup Complete!
echo  📄 Executive Report Generated at: C:\Automation\Reports\
echo =====================================================================
echo.
pause
