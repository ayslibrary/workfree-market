# 🏗️ WorkFree 커뮤니티 개발 계획

## 📋 프로젝트 개요

### 목표
직장인들이 편하게 소통하고 커리어 성장 정보를 공유하는 커뮤니티 플랫폼 구축

### 핵심 가치
- **접근성**: 누구나 쉽게 참여할 수 있는 낮은 진입장벽
- **실용성**: 실제 도움이 되는 커리어 정보 공유
- **확장성**: Phase별로 점진적 기능 확장 가능한 구조

---

## 🎯 Phase 1: MVP (Minimum Viable Product)

### 핵심 기능
1. **직장인 라운지** (자유게시판)
2. **성장 & 커리어** (이직/공부)
3. 기본 CRUD (글쓰기, 읽기, 수정, 삭제)
4. 댓글 시스템
5. 좋아요 기능

### 제외 기능 (나중에 추가)
- ❌ 자동화 포럼
- ❌ 크레딧 시스템
- ❌ 뱃지/등급
- ❌ 익명 모드
- ❌ 실시간 알림

---

## 🗄️ 데이터베이스 설계

### Collections (Firebase Firestore)

#### 1. `posts` (게시글)
```typescript
{
  id: string;
  title: string;
  content: string;
  category: 'lounge' | 'career';
  subcategory?: string;
  authorId: string;
  authorName: string;
  authorEmail?: string;
  likes: number;
  commentCount: number;
  views: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  isDeleted: boolean;
}
```

#### 2. `comments` (댓글)
```typescript
{
  id: string;
  postId: string;
  content: string;
  authorId: string;
  authorName: string;
  likes: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  isDeleted: boolean;
}
```

#### 3. `likes` (좋아요)
```typescript
{
  id: string;
  userId: string;
  targetType: 'post' | 'comment';
  targetId: string;
  createdAt: Timestamp;
}
```

---

## 📁 폴더 구조

```
src/
├── app/
│   └── community/
│       ├── page.tsx                    # 커뮤니티 메인
│       ├── lounge/
│       │   ├── page.tsx                # 직장인 라운지 목록
│       │   └── [postId]/
│       │       └── page.tsx            # 게시글 상세
│       ├── career/
│       │   ├── page.tsx                # 성장&커리어 목록
│       │   └── [postId]/
│       │       └── page.tsx            # 게시글 상세
│       └── write/
│           └── page.tsx                # 글쓰기
│
├── components/
│   └── community/
│       ├── PostCard.tsx                # 게시글 카드
│       ├── PostList.tsx                # 게시글 목록
│       ├── PostDetail.tsx              # 게시글 상세
│       ├── CommentSection.tsx          # 댓글 영역
│       ├── CommentItem.tsx             # 댓글 아이템
│       ├── WriteForm.tsx               # 글쓰기 폼
│       └── LikeButton.tsx              # 좋아요 버튼
│
├── lib/
│   └── community/
│       ├── posts.ts                    # 게시글 CRUD
│       ├── comments.ts                 # 댓글 CRUD
│       └── likes.ts                    # 좋아요 로직
│
└── types/
    └── community.ts                    # 타입 정의
```

---

## 🎨 UI/UX 설계

### 커뮤니티 메인 페이지
```
┌─────────────────────────────────────┐
│  🏠 WorkFree 커뮤니티               │
├─────────────────────────────────────┤
│                                     │
│  [💬 직장인 라운지]  [🚀 성장&커리어] │
│                                     │
│  최근 인기 게시글                    │
│  ┌───────────────────────────────┐ │
│  │ 📌 오늘 야근 너무 힘들다...      │ │
│  │ 💬 23  👍 45  👁️ 234           │ │
│  └───────────────────────────────┘ │
│                                     │
└─────────────────────────────────────┘
```

### 게시판 목록 페이지
```
┌─────────────────────────────────────┐
│  💬 직장인 라운지                    │
│  [✏️ 글쓰기]                         │
├─────────────────────────────────────┤
│  [최신순] [인기순] [댓글많은순]      │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ 📌 퇴근 후 루틴 공유합니다       │ │
│  │ 👤 익명123  📅 2시간 전          │ │
│  │ 💬 15  👍 32  👁️ 156            │ │
│  └───────────────────────────────┘ │
│                                     │
└─────────────────────────────────────┘
```

### 게시글 상세 페이지
```
┌─────────────────────────────────────┐
│  📌 퇴근 후 루틴 공유합니다           │
│  👤 익명123  📅 2시간 전              │
│  👍 32  💬 15  👁️ 156                │
├─────────────────────────────────────┤
│                                     │
│  (게시글 내용)                       │
│                                     │
│  [👍 좋아요] [💬 댓글] [🔗 공유]     │
├─────────────────────────────────────┤
│  💬 댓글 15개                        │
│  ┌───────────────────────────────┐ │
│  │ 👤 익명456: 좋은 정보 감사...    │ │
│  │ 👍 5  💬 답글 2개                │ │
│  └───────────────────────────────┘ │
└─────────────────────────────────────┘
```

---

## 🔧 기술 스택

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State**: Zustand (이미 사용 중)

### Backend
- **Database**: Firebase Firestore
- **Auth**: Firebase Auth (이미 설정됨)
- **Storage**: Firebase Storage (이미지 업로드용)

### Libraries
- `react-markdown`: 마크다운 렌더링
- `date-fns`: 날짜 포맷팅
- `react-hot-toast`: 알림

---

## 📅 개발 일정

### Week 1: 기반 구축
- [x] 개발 계획 수립
- [ ] 데이터베이스 스키마 설정
- [ ] 타입 정의
- [ ] Firebase 컬렉션 생성

### Week 2: 핵심 기능 구현
- [ ] 커뮤니티 메인 페이지
- [ ] 게시판 목록 페이지
- [ ] 게시글 상세 페이지
- [ ] 글쓰기 기능

### Week 3: 소셜 기능
- [ ] 댓글 시스템
- [ ] 좋아요 기능
- [ ] 조회수 카운트
- [ ] 정렬/필터 기능

### Week 4: 마무리
- [ ] UI/UX 개선
- [ ] 반응형 디자인
- [ ] 성능 최적화
- [ ] 베타 테스트

---

## ✅ 다음 단계

1. ✅ 개발 계획 문서화
2. ⏭️ 타입 정의 작성
3. ⏭️ Firebase 컬렉션 설정
4. ⏭️ 커뮤니티 메인 페이지 구현
5. ⏭️ 게시판 기능 구현

---

## 🚀 Phase 2 이후 확장 계획

### 추가 예정 기능
- ⏳ 자동화 포럼
- ⏳ 크레딧 리워드 시스템
- ⏳ 직무별 세부 카테고리
- ⏳ 베스트 게시글 선정
- ⏳ 검색 기능 강화
- ⏳ 알림 시스템
- ⏳ 익명 모드
- ⏳ 이미지 업로드
- ⏳ 태그 시스템

---

## 📊 성공 지표

### Phase 1 목표
- 베타 사용자: 20명
- 게시글: 30개 이상
- 댓글: 50개 이상
- DAU (Daily Active Users): 10명

### Phase 2 목표
- 회원: 100명
- 게시글: 200개 이상
- DAU: 30명
- 주간 활성 사용자: 50명

---

**마지막 업데이트**: 2025-10-24
**작성자**: AI Assistant
**버전**: 1.0


