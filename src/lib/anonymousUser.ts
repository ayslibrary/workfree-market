// 익명 사용자 ID 관리 (로그인 없이 사용)

const ANONYMOUS_ID_KEY = 'frimanualbot_anonymous_id';
const DOCUMENTS_KEY = 'frimanualbot_documents';

// 고유한 익명 ID 생성
function generateAnonymousId(): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 15);
  return `anon-${timestamp}-${randomPart}`;
}

// 익명 ID 가져오기 (없으면 생성)
export function getAnonymousId(): string {
  if (typeof window === 'undefined') {
    return 'anon-server';
  }

  let anonymousId = localStorage.getItem(ANONYMOUS_ID_KEY);
  
  if (!anonymousId) {
    anonymousId = generateAnonymousId();
    localStorage.setItem(ANONYMOUS_ID_KEY, anonymousId);
    console.log('✅ 새로운 익명 ID 생성:', anonymousId);
  }

  return anonymousId;
}

// 익명 ID 초기화 (테스트용)
export function resetAnonymousId(): string {
  if (typeof window === 'undefined') return 'anon-server';
  
  const newId = generateAnonymousId();
  localStorage.setItem(ANONYMOUS_ID_KEY, newId);
  localStorage.removeItem(DOCUMENTS_KEY); // 문서 목록도 초기화
  console.log('🔄 익명 ID 초기화:', newId);
  return newId;
}

// 문서 정보 타입
export interface DocumentInfo {
  id: string;
  fileName: string;
  uploadedAt: string;
  chunksCount: number;
  contentLength: number;
}

// 문서 목록 저장
export function saveDocumentToLocal(doc: DocumentInfo): void {
  if (typeof window === 'undefined') return;

  const docs = getLocalDocuments();
  docs.push(doc);
  localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(docs));
}

// 문서 목록 가져오기
export function getLocalDocuments(): DocumentInfo[] {
  if (typeof window === 'undefined') return [];

  const docsJson = localStorage.getItem(DOCUMENTS_KEY);
  if (!docsJson) return [];

  try {
    return JSON.parse(docsJson);
  } catch (error) {
    console.error('문서 목록 파싱 오류:', error);
    return [];
  }
}

// 문서 삭제
export function deleteLocalDocument(documentId: string): void {
  if (typeof window === 'undefined') return;

  const docs = getLocalDocuments();
  const filtered = docs.filter(doc => doc.id !== documentId);
  localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(filtered));
}

// 전체 데이터 초기화
export function clearAllData(): void {
  if (typeof window === 'undefined') return;

  localStorage.removeItem(ANONYMOUS_ID_KEY);
  localStorage.removeItem(DOCUMENTS_KEY);
  console.log('🗑️ 모든 데이터 삭제 완료');
}

