# 🎨 Render 배포 가이드 (완전 무료)

## ✅ Render 무료 플랜 특징
- **완전 무료** (신용카드 불필요)
- Python/FastAPI 자동 감지
- GitHub 자동 배포
- ⚠️ 15분 동안 요청 없으면 sleep (첫 요청 시 느려질 수 있음)

---

## 📋 배포 단계

### 1️⃣ Render 가입

1. **Render 접속**: https://render.com
2. **"Get Started"** 클릭
3. **"Sign up with GitHub"** 선택
4. GitHub 권한 승인

---

### 2️⃣ 새 Web Service 생성

1. Dashboard에서 **"New +"** 클릭
2. **"Web Service"** 선택
3. GitHub 저장소 연결:
   - **"Connect account"** (처음이면)
   - `workfree-market` 저장소 선택
   - **"Connect"** 클릭

---

### 3️⃣ 서비스 설정

다음 정보를 입력하세요:

#### 기본 설정
- **Name**: `workfree-image-finder` (또는 원하는 이름)
- **Region**: **Oregon (US West)** (무료)
- **Branch**: `main`
- **Root Directory**: `image-finder` ⭐ **중요!**
- **Runtime**: `Python 3` (자동 선택됨)

#### Build & Deploy
- **Build Command**: 
  ```
  pip install -r requirements.txt
  ```
- **Start Command**: 
  ```
  uvicorn app:app --host 0.0.0.0 --port $PORT
  ```

#### Plan
- **Instance Type**: **Free** ✅

---

### 4️⃣ 환경 변수 설정

**"Advanced"** 섹션을 펼치고:

1. **"Add Environment Variable"** 클릭
2. 다음 정보 입력:
   - **Key**: `UNSPLASH_ACCESS_KEY`
   - **Value**: `tYJaN2hzn_j1UEZCH5vd2YfayTwShagHAnmfiyqtYb0`

---

### 5️⃣ 배포 시작

1. **"Create Web Service"** 버튼 클릭
2. 배포 로그 확인 (약 2-3분 소요)
3. 배포 완료 시 **"Live"** 상태 표시

---

### 6️⃣ URL 확인 및 복사

배포 완료 후:
1. 상단에 표시된 URL 복사
   - 예: `https://workfree-image-finder.onrender.com`
2. 브라우저에서 테스트:
   ```
   https://workfree-image-finder.onrender.com/health
   ```

---

### 7️⃣ Vercel 환경 변수 업데이트

1. **Vercel Dashboard**: https://vercel.com/dashboard
2. `workfree-market` 프로젝트 선택
3. **Settings** → **Environment Variables**
4. `IMAGE_FINDER_API_URL` 수정:
   - **Value**: Render URL (예: `https://workfree-image-finder.onrender.com`)
5. **Save** → **Redeploy**

---

## ✅ 배포 완료 확인

### 1. API 테스트
```bash
# 헬스 체크
https://workfree-image-finder.onrender.com/health

# 응답 예시:
{
  "status": "healthy",
  "message": "API is running properly",
  "unsplash_api_configured": true
}
```

### 2. 프론트엔드 테스트
- `https://workfreemarket.com/tools/image-finder` 접속
- 이미지 검색 테스트
- 정상 작동하면 성공! 🎉

---

## 💡 팁

### Sleep 모드 대응
- 15분 동안 요청이 없으면 sleep 상태로 전환
- 첫 요청 시 30초~1분 정도 걸릴 수 있음
- 이후 요청은 빠르게 응답

### 로그 확인
- Dashboard → 서비스 선택 → **"Logs"** 탭
- 실시간 로그 및 에러 확인 가능

### 자동 재배포
- GitHub `main` 브랜치에 push하면 자동으로 재배포됨
- **"Auto-Deploy"** 설정이 기본으로 활성화됨

---

## 🆘 문제 해결

### 배포 실패 시
1. **Logs** 탭에서 에러 확인
2. `Root Directory`가 `image-finder`로 설정되었는지 확인
3. `requirements.txt` 파일 존재 확인

### 500 에러 발생 시
1. 환경 변수 `UNSPLASH_ACCESS_KEY` 확인
2. Logs에서 에러 메시지 확인

### Sleep 모드 깨우기
- 첫 요청 시 30초 정도 기다리기
- 프론트엔드에서 로딩 상태 표시 고려

---

## 🎉 완료!

이제 완전 무료로 이미지 파인더 API가 작동합니다! 🎨✨

