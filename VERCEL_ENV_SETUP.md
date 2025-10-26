# 🚀 Vercel 환경 변수 설정 가이드

## ✅ 이미지 파인더가 Next.js에서 직접 작동합니다!

Python 백엔드 없이 Next.js API Route에서 직접 Unsplash API를 호출합니다.

---

## 📋 Vercel 환경 변수 설정

### 1️⃣ Vercel Dashboard 접속

1. **Vercel Dashboard**: https://vercel.com/dashboard
2. `workfree-market` 프로젝트 클릭

---

### 2️⃣ 환경 변수 추가

1. **Settings** 탭 클릭
2. 왼쪽 메뉴에서 **Environment Variables** 클릭
3. **새 환경 변수 추가**:

#### 변수 정보
- **Key (Name)**: `UNSPLASH_ACCESS_KEY`
- **Value**: `tYJaN2hzn_j1UEZCH5vd2YfayTwShagHAnmfiyqtYb0`
- **Environments**: **Production**, **Preview**, **Development** 모두 체크 ✅

4. **Save** 버튼 클릭

---

### 3️⃣ 재배포

1. 상단 탭에서 **Deployments** 클릭
2. 최신 배포 오른쪽의 **"⋯" (메뉴)** 클릭
3. **Redeploy** 선택
4. **Redeploy** 버튼 클릭하여 확인

---

### 4️⃣ 완료 확인 ✅

재배포 완료 후:
1. `https://workfreemarket.com/tools/image-finder` 접속
2. 이미지 검색 테스트
3. 정상 작동하면 완료! 🎉

---

## 🎯 장점

✅ **Python 백엔드 불필요** - Vercel만 사용
✅ **완전 무료** - 추가 비용 없음
✅ **더 빠름** - 직접 Unsplash API 호출
✅ **Sleep 모드 없음** - 항상 빠른 응답

---

## 🆘 문제 해결

### 환경 변수가 적용되지 않을 때
1. Vercel Dashboard → Settings → Environment Variables 확인
2. `UNSPLASH_ACCESS_KEY`가 모든 환경(Production/Preview/Development)에 설정되었는지 확인
3. 재배포 후 5-10분 정도 기다리기

### 500 에러 발생 시
1. Vercel Dashboard → 프로젝트 → **Runtime Logs** 확인
2. 환경 변수 이름이 정확한지 확인 (대소문자 구분)
3. API 키가 올바른지 확인

### 로컬 개발 시
`.env.local` 파일에 동일한 환경 변수 추가:
```
UNSPLASH_ACCESS_KEY=tYJaN2hzn_j1UEZCH5vd2YfayTwShagHAnmfiyqtYb0
```

---

## 🎉 완료!

이제 이미지 파인더가 완전히 작동합니다! 🎨✨

