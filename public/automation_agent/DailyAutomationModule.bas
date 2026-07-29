Attribute VB_Name = "DailyAutomationModule"
Option Explicit

' ==============================================================================
' WorkFree Daily Zero-Touch Automation Agent - VBA Macro Module
' Execution Flow: Triggered by Power Automate Desktop / Windows Scheduler
' ==============================================================================

Public Sub Run_Daily_Processing()
    On Error GoTo ErrorHandler
    
    Dim rawFolderPath As String
    Dim rawFilePath As String
    Dim reportFilePath As String
    Dim wbRaw As Workbook
    Dim wbReport As Workbook
    Dim wsRaw As Worksheet
    Dim wsReport As Worksheet
    Dim lastRow As Long
    Dim i As Long
    Dim processTime As String
    
    processTime = Format(Now, "yyyy-mm-dd_hhnnss")
    rawFolderPath = "C:\Automation\Data\"
    rawFilePath = rawFolderPath & "RAW_DATA.xlsx"
    reportFilePath = "C:\Automation\Reports\Daily_Report_" & Format(Now, "yyyymmdd") & ".xlsx"
    
    ' Log Start
    Call WriteLog("INFO: Daily Automation Agent Triggered at " & Now)
    
    ' 1. Check if Raw Data File exists
    If Dir(rawFilePath) = "" Then
        Call WriteLog("ERROR: Raw Data File not found at " & rawFilePath)
        MsgBox "RAW_DATA.xlsx 파일이 존재하지 않습니다.", vbCritical, "WorkFree Agent Error"
        Exit Sub
    End If
    
    ' 2. Open Raw Data Workbook silently
    Application.ScreenUpdating = False
    Application.DisplayAlerts = False
    
    Set wbRaw = Workbooks.Open(rawFilePath)
    Set wsRaw = wbRaw.Sheets(1)
    
    ' Find last row of data
    lastRow = wsRaw.Cells(wsRaw.Rows.Count, 1).End(xlUp).Row
    
    ' 3. Create Daily Executive Report
    Set wbReport = Workbooks.Add
    Set wsReport = wbReport.Sheets(1)
    wsReport.Name = "일간집계보고서"
    
    ' Header Styling
    With wsReport.Range("A1:E1")
        .Value = Array("일자", "부서/거래처", "품목명", "수량", "총금액(원)")
        .Font.Bold = True
        .Font.Color = vbWhite
        .Interior.Color = RGB(15, 23, 42) ' Slate-900
        .HorizontalAlignment = xlCenter
    End With
    
    ' Copy & Format Data
    If lastRow >= 2 Then
        wsRaw.Range("A2:E" & lastRow).Copy Destination:=wsReport.Range("A2")
    End If
    
    wsReport.Columns("A:E").AutoFit
    wsReport.Range("D2:E" & lastRow).NumberFormat = "#,##0"
    
    ' 4. Save Report
    wbReport.SaveAs Filename:=reportFilePath, FileFormat:=xlOpenXMLWorkbook
    wbReport.Close SaveChanges:=False
    wbRaw.Close SaveChanges:=False
    
    Application.ScreenUpdating = True
    Application.DisplayAlerts = True
    
    ' Log Completion
    Call WriteLog("SUCCESS: Daily Executive Report Generated at " & reportFilePath)
    
    Exit Sub

ErrorHandler:
    Application.ScreenUpdating = True
    Application.DisplayAlerts = True
    Call WriteLog("CRITICAL ERROR: " & Err.Description)
End Sub

Private Sub WriteLog(logMessage As String)
    Dim logFilePath As String
    Dim fileNo As Integer
    
    logFilePath = "C:\Automation\Logs\agent_log.txt"
    fileNo = FreeFile
    
    Open logFilePath For Append As #fileNo
    Print #fileNo, "[" & Format(Now, "yyyy-mm-dd hh:nn:ss") & "] " & logMessage
    Close #fileNo
End Sub
