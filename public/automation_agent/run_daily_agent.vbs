' ==============================================================================
' Power Automate Desktop -> VBA Macro Bridge Script
' Triggers Excel Macro in Hidden Mode silently
' ==============================================================================

On Error Resume Next

Dim excelApp, wb, macroPath, logFolder, fso

Set fso = CreateObject("Scripting.FileSystemObject")

' 1. Create Folder structure if missing
If Not fso.FolderExists("C:\Automation") Then fso.CreateFolder("C:\Automation")
If Not fso.FolderExists("C:\Automation\Data") Then fso.CreateFolder("C:\Automation\Data")
If Not fso.FolderExists("C:\Automation\Reports") Then fso.CreateFolder("C:\Automation\Reports")
If Not fso.FolderExists("C:\Automation\Logs") Then fso.CreateFolder("C:\Automation\Logs")

macroPath = "C:\Automation\Daily_Master.xlsm"

' 2. Launch Invisible Excel Application
Set excelApp = CreateObject("Excel.Application")
excelApp.Visible = False
excelApp.DisplayAlerts = False

' 3. Open Master Workbook and Run Macro
Set wb = excelApp.Workbooks.Open(macroPath)
If Err.Number = 0 Then
    excelApp.Run "DailyAutomationModule.Run_Daily_Processing"
    wb.Save
    wb.Close False
End If

excelApp.Quit
Set wb = Nothing
Set excelApp = Nothing
