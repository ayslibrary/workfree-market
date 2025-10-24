# 🎨 WorkFree 브랜드 디자인 시스템

## 🌟 브랜드 아이덴티티

**핵심 컨셉**: "퇴근 후의 자유, 정돈된 휴식, 자기계발"
- **창의적 에너지** (Main Violet)
- **질서와 신뢰** (Midnight Navy)
- **따뜻함과 여유** (Soft Lilac, Peach Accent)

---

## 🎨 컬러 팔레트

### CSS 변수 (이미 적용됨)

```css
:root {
  --main-violet: #6A5CFF;      /* 창의적 에너지 */
  --soft-lilac: #AFA6FF;       /* 여유, 회복 */
  --midnight-navy: #1E1B33;    /* 집중, 신뢰 */
  --warm-white: #FAFAFF;       /* 깨끗함, 따뜻함 */
  --peach-accent: #FFBCA7;     /* 따뜻한 감정 */
}
```

### Tailwind CSS에서 사용

```tsx
// CSS 변수 직접 사용 (권장)
<div style={{ backgroundColor: 'var(--main-violet)' }}>

// 또는 클래스 사용
<div className="bg-[var(--main-violet)]">
```

---

## 🧩 컴포넌트 사용 가이드

### 1. Button 컴포넌트

```tsx
import { Button } from '@/components/ui/Button';

// Primary CTA (Main Violet)
<Button variant="primary">무료로 시작하기</Button>

// Secondary (Outline with Soft Lilac)
<Button variant="secondary">자세히 보기</Button>

// Outline (Minimal)
<Button variant="outline">취소</Button>
```

### 2. Input 컴포넌트

```tsx
import { Input } from '@/components/ui/Input';

<Input 
  label="이메일" 
  placeholder="example@workfree.com"
  error="오류 메시지"
/>
```

### 3. Card 스타일

```tsx
<div className="card">
  {/* 자동으로 브랜드 스타일 적용됨 */}
</div>
```

---

## 🎯 페이지별 적용 예시

### Hero 섹션

```tsx
<section style={{ 
  background: `linear-gradient(135deg, var(--warm-white) 0%, rgba(175, 166, 255, 0.1) 50%, var(--warm-white) 100%)` 
}}>
  <h1 style={{ 
    background: `linear-gradient(135deg, var(--main-violet) 0%, var(--soft-lilac) 100%)`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  }}>
    WorkFree Market
  </h1>
</section>
```

### Navigation (이미 적용됨)

- **배경**: Midnight Navy
- **활성 링크**: Main Violet
- **CTA 버튼**: Main Violet → Soft Lilac (hover)

### CTA 버튼

```tsx
<Link
  href="/signup"
  className="px-8 py-3 rounded-lg font-semibold"
  style={{
    background: `linear-gradient(135deg, var(--main-violet) 0%, var(--soft-lilac) 100%)`,
    color: 'var(--warm-white)',
  }}
>
  시작하기
</Link>
```

---

## 🐇 Fri 캐릭터 활용

### 컬러 매핑

- **귀**: Main Violet (#6A5CFF)
- **목도리**: Midnight Navy (#1E1B33)
- **볼터치**: Peach Accent (#FFBCA7)
- **몸통**: Warm White 계열

### 사용 위치

1. **환영 위젯**: 메인 대시보드 상단
2. **로딩 애니메이션**: 점프하는 Fri
3. **성공 모달**: 기뻐하는 Fri
4. **아이콘**: 귀 모양 간소화 버전

---

## 📐 레이아웃 가이드라인

### Border Radius

```css
--radius-card: 12px;    /* 카드, 섹션 */
--radius-button: 8px;   /* 버튼, 입력 필드 */
```

### 간격 (Spacing)

- **섹션 간격**: 80px - 120px
- **카드 내부**: 24px
- **버튼 패딩**: 12px 24px
- **입력 필드**: 12px 16px

### 그림자 (Shadows)

```css
/* 카드 호버 */
box-shadow: 0 8px 24px rgba(106, 92, 255, 0.15);

/* 버튼 호버 */
box-shadow: 0 4px 12px rgba(106, 92, 255, 0.3);
```

---

## 📱 모바일 최적화

### 반응형 폰트

```tsx
<h1 className="text-3xl md:text-5xl lg:text-7xl">
```

### 터치 타겟

- **최소 크기**: 44px × 44px
- **버튼 간격**: 최소 8px

---

## ✅ 체크리스트 - 새 페이지 만들 때

- [ ] 배경은 `var(--warm-white)` 사용
- [ ] 주요 CTA는 `var(--main-violet)` 사용
- [ ] 텍스트는 `var(--midnight-navy)` 사용
- [ ] 보조 요소는 `var(--soft-lilac)` 사용
- [ ] 강조/알림은 `var(--peach-accent)` 사용
- [ ] Border radius는 `8px` 또는 `12px` 사용
- [ ] 모든 버튼은 `Button` 컴포넌트 사용
- [ ] 모든 입력은 `Input` 컴포넌트 사용
- [ ] 호버 효과 추가 (색상 변화 + 그림자)
- [ ] 모바일 반응형 확인

---

## 🚀 적용 완료된 항목

- ✅ globals.css - 브랜드 컬러 변수
- ✅ Button 컴포넌트
- ✅ Input 컴포넌트
- ✅ Navigation 컴포넌트
- ✅ 메인 페이지 Hero 섹션

---

## 📦 향후 적용 필요 페이지

### 우선순위 1 (핵심 페이지)
- [ ] `/community` - 커뮤니티 메인
- [ ] `/community/lounge` - 라운지
- [ ] `/tools/blog-generator` - 블로그 생성기
- [ ] `/kits` - 키트 마켓
- [ ] `/my/dashboard` - 대시보드

### 우선순위 2 (부가 페이지)
- [ ] `/about` - 소개
- [ ] `/pricing` - 가격
- [ ] `/feedback` - 피드백
- [ ] `/request` - 요청하기

### 적용 방법

```bash
# 각 페이지에서 브랜드 컬러 변경
# 1. 배경색
className="bg-gradient-to-b from-white ..." 
→ style={{ background: 'var(--warm-white)' }}

# 2. 주요 버튼
className="bg-purple-600 ..."
→ <Button variant="primary">

# 3. 텍스트 강조
className="text-purple-600 ..."
→ style={{ color: 'var(--main-violet)' }}
```

---

## 💡 베스트 프랙티스

### DO ✅

```tsx
// CSS 변수 사용
<div style={{ backgroundColor: 'var(--main-violet)' }}>

// 컴포넌트 활용
<Button variant="primary">

// 그라데이션 활용
background: `linear-gradient(135deg, var(--main-violet) 0%, var(--soft-lilac) 100%)`
```

### DON'T ❌

```tsx
// 하드코딩된 색상
<div className="bg-purple-600">

// 인라인 HEX 코드
<div style={{ backgroundColor: '#6A5CFF' }}>

// 컴포넌트 무시
<button className="px-4 py-2 bg-purple-600">
```

---

## 🎬 시작하기

```bash
# 개발 서버 실행
npm run dev

# 브라우저에서 확인
http://localhost:3000
```

브랜드 컬러가 적용된 새로운 WorkFree를 경험하세요! 🚀

