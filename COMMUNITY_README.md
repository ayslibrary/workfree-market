# 💬 WorkFree 커뮤니티

## 📌 개요

WorkFree 커뮤니티는 직장인들이 자유롭게 소통하고 커리어 성장 정보를 공유할 수 있는 공간입니다.

### 핵심 기능
- ✅ **직장인 라운지**: 일상적인 직장 생활 이야기 공유
- ✅ **성장 & 커리어**: 이직, 공부, 자기계발 정보 교류
- ✅ **글쓰기**: 누구나 쉽게 게시글 작성 가능
- ✅ **댓글**: 활발한 토론과 정보 교환
- ✅ **좋아요**: 공감과 응원 표현
- ✅ **조회수**: 인기 게시글 파악

---

## 🚀 빠른 시작

### 1. 커뮤니티 접속
```
https://your-domain.com/community
```

### 2. 주요 페이지
- **커뮤니티 홈**: `/community`
- **직장인 라운지**: `/community/lounge`
- **성장 & 커리어**: `/community/career`
- **글쓰기**: `/community/write`

---

## 📁 프로젝트 구조

```
src/
├── types/
│   └── community.ts              # 타입 정의
├── lib/
│   └── community/
│       ├── posts.ts              # 게시글 CRUD
│       └── comments.ts           # 댓글 CRUD
└── app/
    └── community/
        ├── page.tsx              # 커뮤니티 메인
        ├── lounge/
        │   ├── page.tsx          # 라운지 목록
        │   └── [postId]/
        │       └── page.tsx      # 게시글 상세
        ├── career/
        │   ├── page.tsx          # 커리어 목록
        │   └── [postId]/
        │       └── page.tsx      # 게시글 상세
        └── write/
            └── page.tsx          # 글쓰기
```

---

## 💾 데이터베이스 구조 (Firebase Firestore)

### Collection: `community_posts`
```typescript
{
  id: string;
  title: string;
  content: string;
  category: 'lounge' | 'career';
  authorId: string;
  authorName: string;
  authorEmail?: string;
  likes: number;
  likedBy: string[];
  commentCount: number;
  views: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  isDeleted: boolean;
}
```

### Collection: `community_comments`
```typescript
{
  id: string;
  postId: string;
  content: string;
  authorId: string;
  authorName: string;
  authorEmail?: string;
  likes: number;
  likedBy: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  isDeleted: boolean;
}
```

---

## 🎨 주요 기능 설명

### 1. 게시글 작성
- **경로**: `/community/write`
- **필수 로그인**: ✅
- **입력 항목**:
  - 카테고리 선택 (라운지 / 커리어)
  - 제목 (최대 100자)
  - 내용

### 2. 게시글 목록
- **정렬 옵션**:
  - 최신순
  - 인기순 (좋아요 많은 순)
  - 댓글많은순
- **표시 정보**:
  - 제목, 내용 미리보기
  - 작성자, 작성일
  - 좋아요, 댓글, 조회수

### 3. 게시글 상세
- **기능**:
  - 게시글 내용 전체 보기
  - 좋아요 (토글)
  - 댓글 작성/삭제
  - 댓글 좋아요
  - 조회수 자동 카운트

### 4. 댓글 시스템
- **필수 로그인**: ✅
- **기능**:
  - 댓글 작성
  - 본인 댓글 삭제
  - 댓글 좋아요
- **제약사항**:
  - 타인 댓글 수정/삭제 불가

### 5. 좋아요 시스템
- **필수 로그인**: ✅
- **기능**:
  - 게시글 좋아요/취소
  - 댓글 좋아요/취소
  - 중복 좋아요 방지 (likedBy 배열 활용)

---

## 🔧 API 함수

### 게시글 관련 (`src/lib/community/posts.ts`)

```typescript
// 게시글 생성
createPost(userId, userName, userEmail, postData)

// 게시글 목록 조회
getPosts(category?, sortBy, limitCount)

// 게시글 상세 조회
getPost(postId)

// 게시글 수정
updatePost(postId, userId, updateData)

// 게시글 삭제 (소프트 삭제)
deletePost(postId, userId)

// 조회수 증가
incrementViews(postId)

// 게시글 좋아요 토글
togglePostLike(postId, userId)
```

### 댓글 관련 (`src/lib/community/comments.ts`)

```typescript
// 댓글 생성
createComment(userId, userName, userEmail, commentData)

// 게시글의 댓글 목록 조회
getCommentsByPostId(postId)

// 댓글 수정
updateComment(commentId, userId, content)

// 댓글 삭제 (소프트 삭제)
deleteComment(commentId, userId)

// 댓글 좋아요 토글
toggleCommentLike(commentId, userId)
```

---

## 🎯 사용 예시

### 게시글 작성하기

```typescript
import { createPost } from '@/lib/community/posts';

const postId = await createPost(
  user.id,
  user.displayName,
  user.email,
  {
    title: '오늘 야근이 너무 힘들었어요',
    content: '어떻게 하면 야근을 줄일 수 있을까요?',
    category: 'lounge',
  }
);
```

### 게시글 목록 가져오기

```typescript
import { getPosts } from '@/lib/community/posts';

// 직장인 라운지의 최신 게시글 20개
const posts = await getPosts('lounge', 'latest', 20);

// 인기순
const popularPosts = await getPosts('lounge', 'popular', 20);
```

### 댓글 작성하기

```typescript
import { createComment } from '@/lib/community/comments';

const commentId = await createComment(
  user.id,
  user.displayName,
  user.email,
  {
    postId: 'post_123',
    content: '저도 같은 고민이에요. 함께 해결책을 찾아봐요!',
  }
);
```

---

## 🚧 향후 개발 계획 (Phase 2)

### 추가 예정 기능
- [ ] **자동화 포럼**: WorkFree 자동화 관련 전문 게시판
- [ ] **검색 기능**: 제목/내용 키워드 검색
- [ ] **이미지 업로드**: 게시글에 이미지 첨부
- [ ] **태그 시스템**: 게시글 분류 및 검색 개선
- [ ] **알림 시스템**: 댓글/좋아요 알림
- [ ] **베스트 게시글**: 주간/월간 인기 게시글
- [ ] **크레딧 리워드**: 활동에 따라 크레딧 지급
- [ ] **뱃지 시스템**: 활동 등급 표시
- [ ] **익명 모드**: 익명으로 게시글 작성
- [ ] **답글 기능**: 댓글에 대한 답글

---

## ⚙️ 설정 및 관리

### Firebase 보안 규칙

커뮤니티 기능이 정상적으로 작동하려면 Firebase Firestore 보안 규칙을 설정해야 합니다:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 커뮤니티 게시글
    match /community_posts/{postId} {
      allow read: if true;  // 누구나 읽기 가능
      allow create: if request.auth != null;  // 로그인한 사용자만 작성
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.authorId;  // 본인만 수정/삭제
    }
    
    // 커뮤니티 댓글
    match /community_comments/{commentId} {
      allow read: if true;  // 누구나 읽기 가능
      allow create: if request.auth != null;  // 로그인한 사용자만 작성
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.authorId;  // 본인만 수정/삭제
    }
  }
}
```

### 인덱스 생성

Firestore 콘솔에서 다음 인덱스를 생성하세요:

1. **community_posts**
   - `category` (Ascending) + `isDeleted` (Ascending) + `createdAt` (Descending)
   - `category` (Ascending) + `isDeleted` (Ascending) + `likes` (Descending)
   - `category` (Ascending) + `isDeleted` (Ascending) + `commentCount` (Descending)

2. **community_comments**
   - `postId` (Ascending) + `isDeleted` (Ascending) + `createdAt` (Ascending)

---

## 🐛 트러블슈팅

### 게시글이 표시되지 않아요
- Firebase Firestore 보안 규칙을 확인하세요
- 브라우저 콘솔에서 에러 메시지를 확인하세요
- Firestore 인덱스가 생성되었는지 확인하세요

### 좋아요가 작동하지 않아요
- 로그인 상태를 확인하세요
- Firebase Auth가 정상적으로 설정되었는지 확인하세요

### 댓글을 삭제할 수 없어요
- 본인이 작성한 댓글만 삭제 가능합니다
- 로그인한 계정이 작성자와 일치하는지 확인하세요

---

## 📊 모니터링

### 주요 지표
- 총 게시글 수
- 총 댓글 수
- 일일 활성 사용자 (DAU)
- 카테고리별 게시글 분포
- 인기 게시글 Top 10

### 통계 조회 (예정)
```typescript
// 커뮤니티 전체 통계 (향후 개발)
const stats = await getCommunityStats();
```

---

## 🤝 기여 가이드

커뮤니티 기능 개선에 참여하고 싶으시다면:

1. 이슈를 등록하거나
2. Pull Request를 제출해주세요

개선 제안은 언제나 환영합니다! 🙌

---

## 📝 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.

---

**마지막 업데이트**: 2025-10-24  
**버전**: 1.0 (MVP)  
**개발자**: WorkFree Team


