// 관리자 설정

// 관리자 이메일 목록
export const ADMIN_EMAILS = [
  'ayoung1034@gmail.com',
  'poy6714@gmail.com',
];

// 관리자 여부 확인
export function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

