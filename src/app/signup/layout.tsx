// Signup 페이지를 동적 렌더링으로 설정
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

