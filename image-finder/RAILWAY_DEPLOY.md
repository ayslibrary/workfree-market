# 🚂 Railway 배포 가이드

## 1️⃣ Railway 준비

1. **Railway 가입**: https://railway.app
   - GitHub 계정으로 로그인

2. **New Project** 클릭
   - "Deploy from GitHub repo" 선택
   - `workfree-market` 저장소 선택

## 2️⃣ 프로젝트 설정

### Root Directory 설정
Railway 대시보드에서:
- **Settings** → **Deploy** 섹션
- **Root Directory**: `image-finder` 입력 ✅
- **Start Command**: `uvicorn app:app --host 0.0.0.0 --port $PORT`

### 환경 변수 설정
Railway 대시보드에서:
- **Variables** 탭 클릭
- 다음 변수 추가:

```
UNSPLASH_ACCESS_KEY=tYJaN2hzn_j1UEZCH5vd2YfayTwShagHAnmfiyqtYb0
```

## 3️⃣ 배포 확인

1. Railway가 자동으로 배포 시작
2. **Deployments** 탭에서 진행 상황 확인
3. 배포 완료 후 **도메인 복사**:
   - Settings → Networking → Generate Domain
   - 예: `https://your-app.up.railway.app`

## 4️⃣ 테스트

배포된 URL로 테스트:
```bash
curl https://your-app.up.railway.app/
# 응답: {"message": "WorkFree Image Finder API", ...}

curl https://your-app.up.railway.app/health
# 응답: {"status": "ok", ...}
```

## 5️⃣ Vercel 환경 변수 업데이트

Vercel 대시보드에서:
1. **Settings** → **Environment Variables**
2. `IMAGE_FINDER_API_URL` 값을 Railway URL로 변경:
   ```
   https://your-app.up.railway.app
   ```
3. **Redeploy** 클릭

---

## 🆘 문제 해결

### 배포 실패 시
- **Logs** 탭에서 에러 확인
- Python 버전 확인 (`runtime.txt`)
- `requirements.txt` 의존성 확인

### 500 에러 발생 시
- Railway 환경 변수 `UNSPLASH_ACCESS_KEY` 확인
- Logs에서 에러 메시지 확인

### CORS 에러 발생 시
- `app.py`의 CORS 설정이 올바른지 확인
- Vercel 도메인이 허용되어 있는지 확인

