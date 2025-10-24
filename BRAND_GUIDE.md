# 🎨 WorkFree 브랜드 가이드 (배민 스타일)

> 배달의민족처럼 강렬한 브랜드 정체성을 가진 디자인 시스템

---

## 🎯 브랜드 컨셉

**"업무 자동화로 자유를 찾다"**
- 굵고 임팩트 있는 타이포그래피
- 보라색 계열의 강렬한 브랜드 컬러
- 친근하고 신뢰감 있는 디자인

---

## 🎨 컬러 시스템

### 메인 브랜드 컬러
```css
--brand-primary: #4b3eff         /* 메인 보라 */
--brand-primary-light: #6d5aff   /* 밝은 보라 */
--brand-primary-dark: #3626cc    /* 어두운 보라 */
--brand-secondary: #f9f6ff       /* 연한 보라 배경 */
```

### 강조 컬러
```css
--accent-success: #00d97e        /* 성공/완료 - 초록 */
--accent-warning: #ffc107        /* 경고 - 노랑 */
--accent-error: #ff4757          /* 에러 - 빨강 */
```

### 사용 예시
```jsx
// 텍스트에 브랜드 컬러 적용
<h1 className="text-brand">WorkFree</h1>

// 배경에 브랜드 컬러
<div className="bg-brand">버튼</div>

// 그라데이션 배경
<section className="bg-brand-gradient">...</section>
```

---

## ✍️ 타이포그래피

### 폰트: 나눔스퀘어 네오 + 색감 시스템
**세련된 굵기 + 생동감 있는 색상!** 가독성과 임팩트를 동시에

```css
font-family: 'NanumSquareNeo-Variable', 'NanumSquare', sans-serif;
```

#### 최적화된 굵기 (과도함 제거):
- **Light (300)**: 작은 설명 텍스트
- **Regular (400)**: 일반 본문 (기본값)
- **SemiBold (600)**: 강조 본문, 버튼, 배지
- **Bold (700)**: 제목, 헤드라인

#### 색감 시스템:
- **메인 헤드라인**: 그라디언트 (#4b3eff → #7c3aed → #a855f7)
- **섹션 제목**: 브랜드 보라색 (#4b3eff)
- **버튼**: 그라디언트 + 그림자
- **배지**: 그라디언트 + 글로우 효과
- **카드 제목**: 브랜드 컬러
- **본문**: 회색 계열 (가독성)

#### 특징:
- **적당한 굵기**: 과하지 않게 세련됨
- **생동감 있는 색상**: 브랜드 정체성 강화
- **그라디언트 활용**: 모던하고 역동적
- **가독성**: 본문은 회색으로 편안함
- **통일감**: 하나의 폰트로 조화

### 헤드라인 스타일 (배민 스타일)
```jsx
// 초대형 헤드라인 (메인 히어로)
<h1 className="headline-xl">
  업무 자동화의 시작
</h1>

// 대형 헤드라인 (섹션 제목)
<h2 className="headline-lg">
  이제 WorkFree가 대신합니다
</h2>

// 중형 헤드라인 (카드 제목)
<h3 className="headline-md">
  Excel 자동화
</h3>
```

---

## 🎁 컴포넌트 스타일

### 1. 버튼
```jsx
// 브랜드 메인 버튼
<button className="btn-brand">
  시작하기
</button>

// 사용 예시
<button className="btn-brand">
  무료로 시작하기 →
</button>
```

### 2. 카드
```jsx
// 브랜드 카드
<div className="card-brand">
  <h3 className="headline-md">Excel 정리</h3>
  <p>자동으로 정리해드립니다</p>
</div>
```

### 3. 배지
```jsx
// 베타, NEW 등 강조 배지
<span className="badge-brand">Beta</span>
<span className="badge-brand">NEW</span>
<span className="badge-brand">인기</span>
```

---

## 🎯 페이지 예시 (배민 스타일)

### 히어로 섹션
```jsx
<section className="bg-brand-gradient min-h-screen flex items-center">
  <div className="container mx-auto px-4">
    <h1 className="headline-xl mb-6">
      배달의민족
    </h1>
    <h2 className="headline-lg mb-8">
      세상 모든 것이<br />
      식지 않도록
    </h2>
    <p className="text-xl mb-8">
      오늘도 가장 앞서 뜨겁게 달립니다.
    </p>
    <button className="btn-brand">
      시작하기 →
    </button>
  </div>
</section>
```

### WorkFree 버전
```jsx
<section className="bg-brand-gradient min-h-screen flex items-center">
  <div className="container mx-auto px-4">
    <span className="badge-brand mb-4">Beta</span>
    <h1 className="headline-xl mb-6">
      WorkFree
    </h1>
    <h2 className="headline-lg mb-8">
      세상 모든 것이<br />
      식지 않도록
    </h2>
    <p className="text-xl mb-8 text-gray-700">
      오늘도 가장 앞서 뜨겁게 달립니다.
    </p>
    <button className="btn-brand">
      무료로 시작하기 →
    </button>
  </div>
</section>
```

---

## 🎨 디자인 원칙 (배민 스타일)

### 1. **강렬하고 명확하게**
- 큰 폰트 사이즈 사용
- 강한 대비
- 명확한 CTA 버튼

### 2. **친근하고 재미있게**
- 재치 있는 카피
- 일러스트 활용
- 따뜻한 색감

### 3. **일관성 유지**
- 모든 페이지에 동일한 브랜드 컬러
- 통일된 타이포그래피
- 예측 가능한 인터랙션

---

## 🚀 빠른 시작

### CSS 변수 사용
```css
/* 커스텀 스타일에서 브랜드 컬러 사용 */
.my-component {
  color: var(--brand-primary);
  background: var(--brand-gradient);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}
```

### 유틸리티 클래스 조합
```jsx
<div className="bg-brand-gradient p-8 rounded-xl">
  <h2 className="headline-lg text-brand mb-4">제목</h2>
  <button className="btn-brand">버튼</button>
</div>
```

---

## 📱 반응형 디자인

모든 클래스는 자동으로 반응형입니다:
- `clamp()` 함수로 유연한 크기 조절
- 모바일, 태블릿, 데스크톱 최적화

```css
/* headline-xl은 자동으로 반응형 */
font-size: clamp(2.5rem, 8vw, 5rem);
```

---

## 🎯 실전 팁

### 배민처럼 만들기
1. **큰 헤드라인 사용** → `headline-xl`, `headline-lg`
2. **브랜드 컬러 강조** → `text-brand`, `bg-brand`
3. **그라데이션 배경** → `bg-brand-gradient`
4. **굵은 폰트** → 자동 적용 (GmarketSans)
5. **재치 있는 카피** → 직접 작성! 😊

---

## 🎨 색상 팔레트 한눈에 보기

```
메인 컬러:
🟣 #4b3eff  Primary
🟣 #6d5aff  Primary Light  
🟣 #3626cc  Primary Dark
🟪 #f9f6ff  Secondary

강조 컬러:
🟢 #00d97e  Success
🟡 #ffc107  Warning
🔴 #ff4757  Error
```

---

**이제 배민처럼 강렬한 브랜드를 만들 준비가 되었습니다!** 🚀

