# 🚀 WorkFree.AutoMailer 설치 및 테스트 가이드

## ✅ 단계 1: 현재 상태 확인

프로젝트 파일이 모두 생성되었습니다!

```
WorkFree.AutoMailer/
├── ✅ WorkFree.AutoMailer.csproj  (프로젝트 파일)
├── ✅ WorkFree.AutoMailer.sln     (솔루션 파일)
├── ✅ ThisAddIn.cs                 (Add-in 진입점)
├── ✅ AutoReplyService.cs          (자동회신 로직)
├── ✅ AttachmentManager.cs         (첨부파일 관리)
├── ✅ ConfigManager.cs             (설정 관리)
├── ✅ RibbonController.cs          (리본 UI 컨트롤)
├── ✅ Ribbon.xml                   (리본 UI 정의)
├── ✅ config.json                  (설정 파일)
├── ✅ Properties/AssemblyInfo.cs   (어셈블리 정보)
└── ✅ README.md                    (프로젝트 설명)
```

---

## 📋 단계 2: Visual Studio 요구사항 확인

### 필수 소프트웨어
- [x] **Windows 10/11**
- [ ] **Visual Studio 2019/2022 Community** (무료 다운로드)
- [ ] **.NET Framework 4.8 SDK**
- [ ] **Office Developer Tools (VSTO)**
- [ ] **Microsoft Outlook 2016 이상**

### Visual Studio 다운로드 (필요시)
```
https://visualstudio.microsoft.com/ko/downloads/

→ "Community" 버전 다운로드 (무료)
→ 설치 시 "Office/SharePoint 개발" 워크로드 선택
```

---

## 🔧 단계 3: Visual Studio에서 프로젝트 열기

### 방법 1: 솔루션 파일로 열기 (권장)
```
1. WorkFree.AutoMailer.sln 파일을 더블클릭
   또는
2. Visual Studio 실행 → "프로젝트 또는 솔루션 열기"
   → WorkFree.AutoMailer.sln 선택
```

### 방법 2: 프로젝트 파일로 직접 열기
```
WorkFree.AutoMailer.csproj 파일을 Visual Studio로 드래그
```

---

## 📦 단계 4: NuGet 패키지 설치

프로젝트를 연 후, 다음 패키지를 설치해야 합니다:

### Package Manager Console 사용
```
도구 > NuGet 패키지 관리자 > 패키지 관리자 콘솔

PM> Install-Package Newtonsoft.Json
```

### 또는 NuGet UI 사용
```
솔루션 탐색기에서 프로젝트 우클릭
→ "NuGet 패키지 관리"
→ "찾아보기" 탭
→ "Newtonsoft.Json" 검색 및 설치
```

---

## 🏗️ 단계 5: 빌드 테스트

### 첫 번째 빌드
```
빌드 > 솔루션 빌드 (Ctrl + Shift + B)
```

### 예상되는 결과
```
✅ 빌드 성공: WorkFree.AutoMailer
→ bin\Debug\WorkFree.AutoMailer.dll 생성됨
→ bin\Debug\config.json 복사됨
```

### 오류 발생 시
#### 오류 1: "Office Developer Tools를 찾을 수 없음"
```
해결: Visual Studio Installer에서
     "Office/SharePoint 개발" 워크로드 설치
```

#### 오류 2: "Newtonsoft.Json을 찾을 수 없음"
```
해결: NuGet 패키지 설치 (단계 4 참조)
```

#### 오류 3: ".NET Framework 4.8 타겟 팩 없음"
```
해결: .NET Framework 4.8 Developer Pack 설치
     https://dotnet.microsoft.com/download/dotnet-framework/net48
```

---

## 🧪 단계 6: 디버그 실행 (Outlook에서 테스트)

### 실행 방법
```
디버그 > 디버깅 시작 (F5)
```

### 무슨 일이 일어나나요?
```
1. Outlook이 자동으로 실행됨
2. "WorkFree 자동화" 탭이 리본에 표시됨
3. Visual Studio는 디버그 모드로 대기
```

### 테스트 시나리오 1: 자동회신 테스트
```
1. Outlook에서 자신에게 테스트 메일 작성
2. 제목: "출하예정 문의드립니다"
3. 발송
4. 받은편지함 확인
5. ✅ 자동회신 메일이 발송되어야 함!
```

### 테스트 시나리오 2: 리본 버튼 테스트
```
1. 받은 메일 하나 선택
2. "WorkFree 자동화" 탭 클릭
3. "자동회신 실행" 버튼 클릭
4. ✅ 회신 메일 발송됨
```

### 테스트 시나리오 3: 첨부파일 저장 테스트
```
1. 첨부파일이 있는 메일 선택
2. "첨부파일 저장" 버튼 클릭
3. ✅ C:\WorkFree\Attachments\ 폴더에 저장됨
```

---

## 🐛 단계 7: 디버깅 팁

### Visual Studio 중단점 설정
```
1. AutoReplyService.cs 파일 열기
2. 35번 줄 (딜레이 적용) 왼쪽 클릭하여 중단점 설정
3. F5로 실행
4. 테스트 메일 발송
5. ✅ 중단점에서 멈추면 성공!
```

### 디버그 출력 확인
```
보기 > 출력 (Ctrl + Alt + O)
→ "디버그" 선택
→ 로그 메시지 확인
```

---

## ⚙️ 단계 8: 설정 커스터마이징

### config.json 편집
```
위치: bin\Debug\config.json

주요 설정:
- keywords: 자동회신할 키워드 목록
- replyTemplate: 회신 메일 템플릿
- savePath: 첨부파일 저장 경로
```

### 예시: 키워드 추가
```json
{
  "features": {
    "autoReply": {
      "enabled": true,
      "keywords": ["출하예정", "견적요청", "문의", "급함", "확인요청"]
    }
  }
}
```

---

## 📦 단계 9: 배포 준비 (나중에)

### ClickOnce 배포
```
1. 프로젝트 우클릭 > "게시"
2. 폴더 위치 선택
3. "지금 게시" 클릭
4. ✅ setup.exe 생성됨!
```

### 배포 파일 위치
```
bin\Release\Publish\
├── setup.exe          (설치 파일)
├── WorkFree.AutoMailer.dll
└── config.json
```

---

## ✅ 체크리스트

완료되면 체크하세요:

### 환경 설정
- [ ] Visual Studio 설치됨
- [ ] Office Developer Tools 설치됨
- [ ] Outlook 설치됨

### 프로젝트 설정
- [ ] WorkFree.AutoMailer.sln 열림
- [ ] Newtonsoft.Json 패키지 설치됨
- [ ] 빌드 성공

### 테스트
- [ ] F5로 Outlook 실행됨
- [ ] "WorkFree 자동화" 탭 보임
- [ ] 자동회신 테스트 성공
- [ ] 첨부파일 저장 테스트 성공

---

## 🆘 도움이 필요하면?

### 오류 발생 시
1. **빌드 오류**: 출력 창의 오류 메시지 확인
2. **실행 오류**: Visual Studio 디버그 모드로 실행 (F5)
3. **Outlook 미실행**: Outlook 수동 실행 후 재시도

### 다음 테스트할 내용
```
1. ✅ 프로젝트가 빌드되는지 확인
2. ✅ Outlook에서 리본 탭이 보이는지 확인
3. ✅ 자동회신이 작동하는지 확인
4. ❌ 오류 발생 시 오류 메시지 공유
```

---

## 🎯 다음 단계

### 지금 바로 할 일
1. **Visual Studio에서 WorkFree.AutoMailer.sln 열기**
2. **Newtonsoft.Json 패키지 설치**
3. **빌드 테스트 (Ctrl + Shift + B)**
4. **F5로 Outlook에서 실행**

### 테스트 후 개선할 부분
- 설정 UI 창 추가
- PDF 변환 기능 구현
- 로그 뷰어 추가
- 에러 처리 강화

---

**"설치 5분, 반복업무는 끝."** 🚀

이제 Visual Studio에서 열어서 테스트해보세요!



