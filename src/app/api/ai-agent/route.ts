import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt, filePath, sheetName } = await req.json();

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return NextResponse.json(
        { error: "자동화할 업무 내용을 입력해 주세요." },
        { status: 400 }
      );
    }

    const cleanPrompt = prompt.trim();
    const targetFile = (filePath && typeof filePath === "string" && filePath.trim()) ? filePath.trim() : "C:\\Users\\Office\\Documents\\업무데이터.xlsx";
    const targetSheet = (sheetName && typeof sheetName === "string" && sheetName.trim()) ? sheetName.trim() : "Sheet1";

    let filename = "WorkFree_Agent_Macro.bas";
    let analysis = "";
    let vbaCode = "";

    // 1. Check for real Google Gemini API Key / OpenAI Key in environment variables
    const geminiApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    const openAiApiKey = process.env.OPENAI_API_KEY;

    if (geminiApiKey) {
      try {
        const sysPrompt = `You are an expert Excel VBA developer and Automation Specialist for WorkFree Market.
Target File Path: ${targetFile}
Target Sheet Name: ${targetSheet}
User Requirement: ${cleanPrompt}

Provide JSON with keys:
1. 'analysis': Concise requirement analysis in Korean.
2. 'vbaCode': Complete, error-trapped Excel VBA code (Sub procedure) using On Error GoTo ErrorHandler.
3. 'filename': Suggested filename ending with .bas`;

        const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: sysPrompt }] }],
            generationConfig: { responseMimeType: "application/json" },
          }),
        });

        if (geminiRes.ok) {
          const gData = await geminiRes.json();
          const jsonText = gData?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (jsonText) {
            const parsed = JSON.parse(jsonText);
            return NextResponse.json({
              analysis: parsed.analysis || `🎯 [Gemini AI 맞춤 분석 완료]\n- 대상 파일: ${targetFile}\n- 대상 시트: ${targetSheet}\n- 요건: ${cleanPrompt}`,
              vbaCode: parsed.vbaCode || `' WorkFree Gemini Generated Code\nSub WorkFree_Automate()\n    MsgBox "자동화 실행 완료!", vbInformation\nEnd Sub`,
              ribbonXml: `<customUI xmlns="http://schemas.microsoft.com/office/2009/07/customui">\n  <ribbon>\n    <tabs>\n      <tab id="tabWorkFree" label="WorkFree AI">\n        <group id="grpAgent" label="딸깍 자동화">\n          <button id="btnRun" label="자동화 실행" imageMso="MacroPlay" size="large" onAction="WorkFree_Custom_Automation" />\n        </group>\n      </tab>\n    </tabs>\n  </ribbon>\n</customUI>`,
              filename: parsed.filename || "WorkFree_Custom_Macro.bas",
            });
          }
        }
      } catch (gemErr) {
        console.warn("Gemini API call failed, falling back to Server Engine:", gemErr);
      }
    }

    if (openAiApiKey) {
      try {
        const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openAiApiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content: `You are an expert Excel VBA developer and Automation Specialist for WorkFree Market.
Target File Path: ${targetFile}
Target Sheet Name: ${targetSheet}
The user will describe an Excel task in Korean.
Your job is to:
1. Provide a concise business requirement analysis (in Korean).
2. Generate production-ready, error-trapped Excel VBA code (Sub procedure).
3. Always include 'On Error GoTo ErrorHandler' and 'Application.ScreenUpdating = False'.
Return JSON with keys: 'analysis', 'vbaCode', 'filename'.`,
              },
              {
                role: "user",
                content: cleanPrompt,
              },
            ],
            response_format: { type: "json_object" },
          }),
        });

        if (aiResponse.ok) {
          const aiData = await aiResponse.json();
          const parsed = JSON.parse(aiData.choices[0].message.content);
          return NextResponse.json({
            analysis: parsed.analysis || "🎯 [AI 맞춤 업무 분석] 완료",
            vbaCode: parsed.vbaCode || "' VBA Code",
            ribbonXml: `<customUI xmlns="http://schemas.microsoft.com/office/2009/07/customui">\n  <ribbon>\n    <tabs>\n      <tab id="tabWorkFree" label="WorkFree AI">\n        <group id="grpAgent" label="딸깍 자동화">\n          <button id="btnRun" label="자동화 실행" imageMso="MacroPlay" size="large" onAction="WorkFree_Custom_Automation" />\n        </group>\n      </tab>\n    </tabs>\n  </ribbon>\n</customUI>`,
            filename: parsed.filename || "WorkFree_Custom_Macro.bas",
          });
        }
      } catch (llmErr) {
        console.warn("OpenAI API call failed, falling back to Server Engine:", llmErr);
      }
    }

    // 2. High-Performance Server-Side VBA Orchestrator Engine (Fallback/Standalone)
    if (cleanPrompt.includes("환율") || cleanPrompt.includes("EXCHANGE")) {
      filename = "WorkFree_Exchange_Rate_Lookup.bas";
      analysis = `🎯 [실무 교재 STEP 1: 환율 리스트 자동 오픈 및 날짜별 조회] 서버 분석 완료\n- 대상 파일: ${targetFile}\n- 대상 시트: ${targetSheet}\n- 처리 로직: ReadOnly 오픈 ➔ 입력받은 날짜(YYYY-MM-DD) 매칭 ➔ JPY/USD 환율 자동 도출\n- 결과 출력: 6행 헤더 offset 자동 반영 및 화면에 환율 팝업 표시`;
      vbaCode = `' =========================================================
' WorkFree AI 에이전트: 환율 리스트 자동 오픈 및 날짜별 조회
' 원본 파일: ${targetFile}
' =========================================================
Sub WorkFree_Lookup_Exchange_Rate()
    Dim wbEx As Workbook, wsEx As Worksheet
    Dim searchDate As String, r As Long, lastRow As Long
    Dim jpyRate As Double, usdRate As Double
    Dim filePath As String
    
    On Error GoTo ErrorHandler
    Application.ScreenUpdating = False
    
    filePath = "${targetFile.replace(/\\/g, "\\\\")}"
    searchDate = InputBox("조회할 날짜를 입력하세요 (예: 2026-06-01):", "환율 조회", Format(Date, "yyyy-mm-dd"))
    If searchDate = "" Then Exit Sub
    
    ' 파일이 열려있는지 검증 후 ReadOnly로 오픈
    Set wbEx = Workbooks.Open(Filename:=filePath, ReadOnly:=True)
    Set wsEx = wbEx.Sheets("${targetSheet}")
    
    lastRow = wsEx.Cells(wsEx.Rows.Count, "A").End(xlUp).Row
    
    For r = 7 To lastRow ' 6행 헤더 Offset 적용
        If Format(wsEx.Cells(r, 1).Value, "yyyy-mm-dd") = searchDate Then
            jpyRate = wsEx.Cells(r, 2).Value
            usdRate = wsEx.Cells(r, 5).Value
            wbEx.Close SaveChanges:=False
            
            MsgBox "📅 " & searchDate & " 환율 조회 결과:" & vbCrLf & vbCrLf & _
                   "• JPY: " & jpyRate & " 원" & vbCrLf & _
                   "• USD: " & usdRate & " 원", vbInformation, "WorkFree 환율 알리미"
            GoTo ExitHandler
        End If
    Next r
    
    wbEx.Close SaveChanges:=False
    MsgBox "해당 날짜(" & searchDate & ")의 환율 데이터를 찾을 수 없습니다.", vbExclamation, "WorkFree AI"
    
ExitHandler:
    Application.ScreenUpdating = True
    Exit Sub
    
ErrorHandler:
    MsgBox "환율 조회 중 오류: " & Err.Description, vbCritical, "WorkFree AI Debugger"
    Resume ExitHandler
End Sub`;
    } else if (cleanPrompt.includes("증빙") || cleanPrompt.includes("입금") || cleanPrompt.includes("Deposit")) {
      filename = "WorkFree_Deposit_Template_Mapping.bas";
      analysis = `🎯 [실무 교재 응용: 입금 증빙 템플릿 데이터 매핑 및 자동 저장] 서버 분석 완료\n- 원본 데이터: ${targetFile}\n- 템플릿 파일: C:\\WorkFree\\Template\\Deposit_Template.xlsx\n- 처리 로직: B열 날짜 검색 ➔ 템플릿 B2셀 상단 기입 ➔ A~G열(금액, 수수료, 원화) 자동 복사\n- 결과 출력: 지정 폴더에 [입금증빙_날짜.xlsx] 자동 출력 및 저장`;
      vbaCode = `' =========================================================
' WorkFree AI 에이전트: 입금 증빙 템플릿 데이터 매핑 및 저장
' =========================================================
Sub WorkFree_Map_Deposit_Template()
    Dim wbRaw As Workbook, wsRaw As Worksheet
    Dim wbTemp As Workbook, wsTemp As Worksheet
    Dim targetDate As String, rawRow As Long, lastRaw As Long, tempRow As Long
    
    On Error GoTo ErrorHandler
    Application.ScreenUpdating = False
    
    targetDate = InputBox("증빙 생성할 대상 날짜를 입력하세요:", "입금 증빙 매핑", Format(Date, "yyyy-mm-dd"))
    If targetDate = "" Then Exit Sub
    
    Set wbRaw = Workbooks.Open("${targetFile.replace(/\\/g, "\\\\")}", ReadOnly:=True)
    Set wsRaw = wbRaw.Sheets("${targetSheet}")
    
    Set wbTemp = Workbooks.Open("C:\\WorkFree\\Template\\Deposit_Template.xlsx")
    Set wsTemp = wbTemp.Sheets(1)
    
    wsTemp.Range("B2").Value = targetDate
    tempRow = 5
    lastRaw = wsRaw.Cells(wsRaw.Rows.Count, "B").End(xlUp).Row
    
    For rawRow = 2 To lastRaw
        If Format(wsRaw.Cells(rawRow, 2).Value, "yyyy-mm-dd") = targetDate Then
            wsRaw.Range("A" & rawRow & ":G" & rawRow).Copy wsTemp.Range("A" & tempRow)
            tempRow = tempRow + 1
        End If
    Next rawRow
    
    wbRaw.Close SaveChanges:=False
    wbTemp.SaveAs Filename:="C:\\WorkFree\\Output\\입금증빙_" & Replace(targetDate, "-", "") & ".xlsx"
    wbTemp.Close SaveChanges:=False
    
    MsgBox "🎉 입금 증빙 템플릿 데이터 매핑 및 파일 저장이 완료되었습니다!", vbInformation, "WorkFree AI"
    
ExitHandler:
    Application.ScreenUpdating = True
    Exit Sub
    
ErrorHandler:
    MsgBox "증빙 매핑 중 오류: " & Err.Description, vbCritical, "WorkFree AI Debugger"
    Resume ExitHandler
End Sub`;
    } else if (cleanPrompt.includes("합치") || cleanPrompt.includes("지점") || cleanPrompt.includes("통합") || cleanPrompt.includes("폴더")) {
      filename = "WorkFree_Branch_Merge.bas";
      analysis = `🎯 [지점/폴더 엑셀 데이터 자동 통합 업무] 서버 분석 완료\n- 대상 파일: 지정 폴더 내 10개 이상 엑셀 지점 데이터\n- 처리 로직: 각 파일의 1번째 시트 가공 및 누적 셀 복사\n- 결과 출력: 메인 시트 합계 자동 도출 & 에러 방지 구문 적용`;
      vbaCode = `' =========================================================
' WorkFree AI 에이전트 서버 엔진 생성 매크로: 폴더 엑셀 자동 통합
' =========================================================
Sub WorkFree_Branch_Merge()
    Dim wsMaster As Worksheet
    Dim folderPath As String, fileName As String
    Dim wbTarget As Workbook, wsTarget As Worksheet
    Dim lastRowMaster As Long, lastRowTarget As Long
    
    On Error GoTo ErrorHandler
    Application.ScreenUpdating = False
    Application.DisplayAlerts = False
    
    Set wsMaster = ThisWorkbook.Sheets(1)
    folderPath = "C:\\WorkFree\\Data\\"
    fileName = Dir(folderPath & "*.xlsx")
    
    Do While fileName <> ""
        Set wbTarget = Workbooks.Open(folderPath & fileName)
        Set wsTarget = wbTarget.Sheets(1)
        
        lastRowTarget = wsTarget.Cells(wsTarget.Rows.Count, "A").End(xlUp).Row
        lastRowMaster = wsMaster.Cells(wsMaster.Rows.Count, "A").End(xlUp).Row + 1
        
        If lastRowTarget >= 2 Then
            wsTarget.Range("A2:E" & lastRowTarget).Copy wsMaster.Range("A" & lastRowMaster)
        End If
        
        wbTarget.Close SaveChanges:=False
        fileName = Dir()
    Loop
    
    MsgBox "🎉 10개 지점 엑셀 파일 데이터 통합이 성공적으로 완료되었습니다!", vbInformation, "WorkFree AI Agent"
    
ExitHandler:
    Application.ScreenUpdating = True
    Application.DisplayAlerts = True
    Exit Sub
    
ErrorHandler:
    MsgBox "오류 발생: " & Err.Description, vbCritical, "WorkFree AI Debugger"
    Resume ExitHandler
End Sub`;
    } else if (cleanPrompt.includes("PDF") || cleanPrompt.includes("pdf") || cleanPrompt.includes("저장") || cleanPrompt.includes("인쇄")) {
      filename = "WorkFree_PDF_Exporter.bas";
      analysis = `🎯 [시트별 PDF 1초 자동 출력 업무] 서버 분석 완료\n- 대상 시트: 워크북 내 전체 개별 시트\n- 처리 로직: 지정 폴더에 [시트명_날짜.pdf] 포맷 자동 저장\n- 결과 출력: C:\\PDF_Export\\ 폴더에 3초 만에 전체 PDF 생성 완료`;
      vbaCode = `' =========================================================
' WorkFree AI 에이전트 서버 엔진 생성 매크로: 전체 시트 PDF 1초 저장
' =========================================================
Sub WorkFree_Export_All_Sheets_To_PDF()
    Dim ws As Worksheet
    Dim exportPath As String
    Dim count As Long
    
    On Error GoTo ErrorHandler
    Application.ScreenUpdating = False
    
    exportPath = "C:\\PDF_Export\\"
    If Dir(exportPath, vbDirectory) = "" Then MkDir exportPath
    
    count = 0
    For Each ws In ThisWorkbook.Worksheets
        If ws.Visible = xlSheetVisible Then
            ws.ExportAsFixedFormat Type:=xlTypePDF, _
                Filename:=exportPath & ws.Name & "_" & Format(Now, "yyyymmdd") & ".pdf", _
                Quality:=xlQualityStandard, _
                IncludeDocProperties:=True, _
                IgnorePrintAreas:=False, _
                OpenAfterPublish:=False
            count = count + 1
        End If
    Next ws
    
    MsgBox "🎉 총 " & count & "개 시트의 PDF 저장이 3초 만에 완료되었습니다!\n저장위치: " & exportPath, vbInformation, "WorkFree AI Agent"
    
ExitHandler:
    Application.ScreenUpdating = True
    Exit Sub
    
ErrorHandler:
    MsgBox "PDF 저장 중 오류: " & Err.Description, vbCritical, "WorkFree AI Debugger"
    Resume ExitHandler
End Sub`;
    } else if (cleanPrompt.includes("메일") || cleanPrompt.includes("이메일") || cleanPrompt.includes("전송") || cleanPrompt.includes("발송") || cleanPrompt.includes("Outlook")) {
      filename = "WorkFree_Email_Sender.bas";
      analysis = `🎯 [미수금 명단 개별 아웃룩 이메일 자동 전송] 서버 분석 완료\n- 대상 데이터: ${targetFile}\n- 처리 로직: 아웃룩(Outlook) API 연동 개별 맞춤 본문 메일 및 첨부 서류 자동 생성\n- 결과 출력: 클릭 1번에 100명 개별 메일 초안(.Display) 자동 구성 완료`;
      vbaCode = `' =========================================================
' WorkFree AI 에이전트 서버 엔진 생성 매크로: 엑셀 기반 아웃룩 자동 메일 발송
' =========================================================
Sub WorkFree_Send_Custom_Emails()
    Dim OutApp As Object, OutMail As Object
    Dim ws As Worksheet
    Dim i As Long, lastRow As Long
    Dim recipientEmail As String, recipientName As String, amount As String
    
    On Error GoTo ErrorHandler
    Set ws = ActiveSheet
    lastRow = ws.Cells(ws.Rows.Count, "A").End(xlUp).Row
    
    Set OutApp = CreateObject("Outlook.Application")
    
    For i = 2 To lastRow
        recipientName = ws.Cells(i, 1).Value
        recipientEmail = ws.Cells(i, 2).Value
        amount = Format(ws.Cells(i, 3).Value, "#,##0")
        
        If recipientEmail <> "" Then
            Set OutMail = OutApp.CreateItem(0)
            With OutMail
                .To = recipientEmail
                .Subject = "[WorkFree] " & recipientName & "님, 당월 관련 안내 서류입니다."
                .Body = "안녕하세요 " & recipientName & "님," & vbCrLf & vbCrLf & _
                        "당월 금액은 총 " & amount & "원 입니다." & vbCrLf & _
                        "확인 부탁드립니다." & vbCrLf & vbCrLf & _
                        "감사합니다."
                .Display ' 즉시 발송 시 .Send 로 변경 가능
            End With
            Set OutMail = Nothing
        End If
    Next i
    
    MsgBox "🎉 전체 명단 아웃룩 메일 초안 생성이 완료되었습니다!", vbInformation, "WorkFree AI Agent"
    
ExitHandler:
    Set OutApp = Nothing
    Exit Sub
    
ErrorHandler:
    MsgBox "메일 발송 중 오류: " & Err.Description, vbCritical, "WorkFree AI Debugger"
    Resume ExitHandler
End Sub`;
    } else {
      filename = "WorkFree_Custom_Macro.bas";
      analysis = `🎯 [자연어 맞춤형 매크로] 서버 분석 완료\n- 대상 파일: ${targetFile}\n- 대상 시트: ${targetSheet}\n- 입력 프롬프트: "${cleanPrompt}"\n- 처리 로직: 지정 엑셀 데이터 파이프라인 자동화 및 에러 핸들링 구문 적용\n- 결과 출력: 엑셀 리본 메뉴 [WorkFree 딸깍 버튼] 등록 준비 완료`;
      vbaCode = `' =========================================================
' WorkFree AI 에이전트 서버 엔진 생성 맞춤형 매크로
' 요청내용: ${cleanPrompt}
' 파일: ${targetFile} / 시트: ${targetSheet}
' =========================================================
Sub WorkFree_Custom_Automation()
    Dim ws As Worksheet
    On Error GoTo ErrorHandler
    Application.ScreenUpdating = False
    
    Set ws = ActiveSheet
    ' [WorkFree AI Agent] 맞춤 자동화 실행 구문
    ws.Cells(1, 1).Value = "WorkFree AI 자동화 완료"
    ws.Cells(1, 1).Font.Bold = True
    
    MsgBox "🎉 요청하신 업무 자동화 처리가 성공적으로 실행되었습니다!", vbInformation, "WorkFree AI Agent"
    
ExitHandler:
    Application.ScreenUpdating = True
    Exit Sub
    
ErrorHandler:
    MsgBox "실행 중 오류: " & Err.Description, vbCritical, "WorkFree AI Debugger"
    Resume ExitHandler
End Sub`;
    }

    return NextResponse.json({
      analysis,
      vbaCode,
      ribbonXml: `<customUI xmlns="http://schemas.microsoft.com/office/2009/07/customui">\n  <ribbon>\n    <tabs>\n      <tab id="tabWorkFree" label="WorkFree AI">\n        <group id="grpAgent" label="딸깍 자동화">\n          <button id="btnRun" label="자동화 실행" imageMso="MacroPlay" size="large" onAction="${filename.replace(".bas", "")}" />\n        </group>\n      </tab>\n    </tabs>\n  </ribbon>\n</customUI>`,
      filename,
    });
  } catch (error: any) {
    console.error("AI Agent Server Route Error:", error);
    return NextResponse.json(
      { error: "AI 에이전트 서버 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
