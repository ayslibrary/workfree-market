# 📩 WorkFree.AutoMailer - Outlook 자동회신 키트

## 🎯 프로젝트 개요
Outlook에서 자동으로 메일 회신, 첨부파일 저장 등을 처리하는 VSTO Add-in입니다.

---

## 🔧 개발 환경 요구사항

### 필수 소프트웨어
- **Windows 10/11**
- **Visual Studio 2019/2022 Community** (무료)
- **.NET Framework 4.8 SDK**
- **Microsoft Office Developer Tools (VSTO)**
- **Microsoft Outlook 2016 이상**

### Visual Studio에서 VSTO 설치
1. Visual Studio Installer 실행
2. "Office/SharePoint 개발" 워크로드 선택
3. ".NET Framework 4.8 타겟 팩" 선택
4. 설치

---

## 📦 프로젝트 열기

### 1단계: Visual Studio에서 프로젝트 열기
```bash
1. Visual Studio 실행
2. "프로젝트 또는 솔루션 열기" 선택
3. WorkFree.AutoMailer.csproj 파일 선택
```

### 2단계: NuGet 패키지 복원
```bash
도구 > NuGet 패키지 관리자 > 패키지 관리자 콘솔

PM> Install-Package Newtonsoft.Json
```

### 3단계: 빌드
```bash
빌드 > 솔루션 빌드 (Ctrl + Shift + B)
```

### 4단계: 디버그 실행
```bash
디버그 > 디버깅 시작 (F5)
```
→ Outlook이 자동으로 실행되며 "WorkFree 자동화" 탭이 리본에 표시됩니다!

---

## ⚙️ 설정 파일 (config.json)

### 기본 설정
```json
{
  "features": {
    "autoReply": {
      "enabled": true,
      "keywords": ["출하예정", "견적요청", "문의"]
    },
    "attachmentSave": {
      "enabled": true,
      "savePath": "C:\\WorkFree\\Attachments"
    }
  }
}
```

### 설정 변경 방법
1. 빌드 후 `bin\Debug\config.json` 파일 열기
2. 키워드, 경로 등 수정
3. Outlook 재시작

---

## 🚀 주요 기능

### 1. 자동회신
- 키워드("출하예정" 등) 포함 메일 수신 시 자동 회신
- 회신 템플릿은 HTML 형식 지원

### 2. 첨부파일 저장
- 발신자별 폴더에 자동 저장
- 날짜별 하위 폴더 생성 옵션

### 3. 로그 기록
- 모든 자동회신 내역을 log.txt에 저장
- 발신자, 제목, 성공/실패 상태 기록

---

## 🧪 테스트 방법

### 1. 수동 테스트
1. Visual Studio에서 F5로 Outlook 실행
2. Outlook에서 테스트 메일 작성
3. 제목에 "출하예정" 입력
4. 자신에게 발송
5. 자동회신 확인

### 2. 리본 버튼 테스트
1. 메일 선택
2. "WorkFree 자동화" 탭 클릭
3. "자동회신 실행" 버튼 클릭
4. 회신 메일 발송 확인

---

## 📋 알려진 이슈

### ConfigManager 오류
- **문제**: AutoReplyService.cs 48번 줄에 오타 있음
- **해결**: `GetDelaySe conds()` → `GetDelaySeconds()`
- 다음 섹션에서 수정 방법 안내

### Newtonsoft.Json 누락
- NuGet 패키지 설치 필요
```bash
Install-Package Newtonsoft.Json
```

---

## 📦 배포 방법

### ClickOnce 배포 (간단)
```bash
1. 프로젝트 우클릭 > "게시"
2. 폴더 위치 선택 (예: C:\Publish)
3. "지금 게시" 클릭
4. setup.exe 파일 생성됨
```

### Inno Setup 배포 (고급)
```bash
1. Inno Setup Compiler 설치
2. setup-script.iss 파일 작성
3. Compile
4. 설치 파일(.exe) 생성
```

---

## 💰 가격 모델

| 기능 | 가격 |
|------|------|
| 기본 자동회신 | ₩9,900 |
| 첨부파일 저장 | +₩3,000 |
| PDF 변환 | +₩3,000 |
| 로그 기록 | +₩2,000 |
| **전체 패키지** | **₩14,900** |

---

## 🔍 다음 단계

### 즉시 수정 필요
1. **AutoReplyService.cs 48번 줄 오타 수정**
2. **Newtonsoft.Json NuGet 패키지 설치**
3. **Visual Studio에서 빌드 테스트**

### 향후 개선
- [ ] 설정 UI 창 구현
- [ ] PDF 변환 기능 구현
- [ ] 다국어 지원
- [ ] 자동 업데이트 기능

---

## 📞 문의
- 이메일: dev@workfree.ai
- 홈페이지: https://workfreemarket.com

---

**"설치 5분, 반복업무는 끝."** 🚀


