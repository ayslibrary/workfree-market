'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { signOut } from '@/lib/firebase';
import LoadingSpinner from '@/components/LoadingSpinner';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/animations';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('home');

  // 로그인 체크
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login?redirect=/my/dashboard');
    }
  }, [user, isLoading, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (isLoading || !user) {
    return <LoadingSpinner message="로딩 중..." variant="purple" />;
  }

  // 나만의 루틴 자동화 목록
  const myRoutines = [
    { 
      id: 1, 
      icon: '📊', 
      title: '액셀 정기',
      description: '데이터를 자동으로 정리합니다',
      color: 'var(--main-violet)'
    },
    { 
      id: 2, 
      icon: '📄', 
      title: '보고서 생성',
      description: '주간 보고서를 자동 작성',
      color: 'var(--soft-lilac)'
    },
    { 
      id: 3, 
      icon: '📧', 
      title: '메일 자동 분류',
      description: '수신 메일을 자동 정리',
      color: 'var(--peach-accent)'
    },
    { 
      id: 4, 
      icon: '📑', 
      title: 'PDF 변환',
      description: '문서를 PDF로 자동 변환',
      color: 'var(--main-violet)'
    },
  ];

  return (
    <div className="min-h-screen pb-20 bg-[#f5f0ff]">
      {/* 헤더 */}
      <div className="px-6 pt-24 md:pt-12 pb-8">
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center gap-3">
            <img 
              src="/workfree-logo.png?v=3" 
              alt="WorkFree Logo" 
              className="w-10 h-10"
            />
            <div>
              <h1 className="text-xl font-bold text-[#1E1B33]">
                WorkFree Market
              </h1>
            </div>
          </Link>
          <span className="bg-[#FF9A7A] text-white px-3 py-1 rounded-full text-sm font-bold">
            Beta
          </span>
        </div>

        {/* Fri 캐릭터 & 인사 */}
        <FadeIn>
          <div className="flex flex-col items-center text-center mb-8">
            <div className="relative mb-4">
              {/* Fri 캐릭터 플레이스홀더 */}
              <div className="w-48 h-48 rounded-full flex items-center justify-center text-7xl relative bg-white/50 shadow-lg">
                🐇
                {/* 말풍선 */}
                <div className="absolute -top-2 right-0 px-4 py-2 rounded-2xl text-sm font-bold shadow-lg bg-[#1E1B33] text-white">
                  오늘은
                </div>
              </div>
            </div>
            <p className="text-2xl font-bold text-[#1E1B33]">
              응 칼퇴하네요, {user?.displayName || 'Fri'}님!
            </p>
          </div>
        </FadeIn>

        {/* 자동화 시작 버튼 */}
        <FadeIn delay={0.2}>
          <Link
            href="/automation/create"
            className="block w-full py-4 rounded-full font-bold text-lg text-center shadow-lg transition-all hover:shadow-2xl hover:scale-105 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white"
          >
            🚀 자동화 시작
          </Link>
        </FadeIn>
      </div>

      {/* 나만의 루틴 자동화 */}
      <div className="px-6 mb-8">
        <h2 className="text-xl font-bold mb-4 text-[#1E1B33]">
          나만의 루틴 자동화
        </h2>

        <StaggerContainer className="grid grid-cols-2 gap-4">
          {myRoutines.map((routine) => (
            <StaggerItem key={routine.id}>
              <Link
                href={`/automation/${routine.id}`}
                className="block p-6 rounded-3xl shadow-lg transition-all hover:scale-105 hover:shadow-2xl bg-white border-2 border-[#AFA6FF]/50 hover:border-[#6A5CFF]"
              >
                <div className="text-4xl mb-3 w-14 h-14 rounded-xl flex items-center justify-center bg-[#f5f0ff]">
                  {routine.icon}
                </div>
                <h3 className="font-bold text-base mb-1 text-[#1E1B33]">
                  {routine.title}
                </h3>
                <p className="text-xs leading-relaxed text-[#1E1B33]/70">
                  {routine.description}
                </p>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>

      {/* 하단 네비게이션 */}
      <nav className="fixed bottom-0 left-0 right-0 px-6 py-4 border-t border-[#AFA6FF]/20 bg-[#1E1B33] shadow-2xl">
        <div className="flex items-center justify-around max-w-md mx-auto">
          <Link
            href="/my/dashboard"
            className="flex flex-col items-center gap-1 min-w-[60px] transition-all"
          >
            <span className="text-2xl">🏠</span>
            <span className={`text-xs font-medium ${activeTab === 'home' ? 'text-[#6A5CFF]' : 'text-white/70'}`}>
              홈
            </span>
            {activeTab === 'home' && (
              <div className="w-1 h-1 rounded-full bg-[#6A5CFF]" />
            )}
          </Link>

          <Link
            href="/tools"
            className="flex flex-col items-center gap-1 min-w-[60px] transition-all"
          >
            <span className="text-2xl">🔧</span>
            <span className="text-xs font-medium text-white/70">
              툴
            </span>
          </Link>

          <Link
            href="/community"
            className="flex flex-col items-center gap-1 min-w-[60px] transition-all"
          >
            <span className="text-2xl">💬</span>
            <span className="text-xs font-medium text-white/70">
              톡
            </span>
          </Link>

          <button
            onClick={handleSignOut}
            className="flex flex-col items-center gap-1 min-w-[60px] transition-all"
          >
            <span className="text-2xl">🚪</span>
            <span className="text-xs font-medium text-white/70">
              로그아웃
            </span>
          </button>
        </div>
      </nav>
    </div>
  );
}
