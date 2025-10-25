'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { signOut } from '@/lib/firebase';
import LoadingSpinner from '@/components/LoadingSpinner';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/animations';
import TimeSavingsCard from '@/components/TimeSavingsCard';
import { getUserBlogHistory } from '@/lib/blogHistory';
import { BlogHistory } from '@/types/blog';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [recentActivities, setRecentActivities] = useState<BlogHistory[]>([]);
  const [activityStats, setActivityStats] = useState({
    totalBlogs: 0,
    totalAutomations: 0,
    thisWeekActivities: 0,
  });

  // 데모 데이터 (나중에 실제 데이터로 교체)
  const totalMinutesSaved = 7632; // 127시간 12분
  const monthlyMinutesSaved = 1477; // 24시간 37분
  const credits = 150;
  const level = Math.floor(totalMinutesSaved / 1000) + 1; // 1000분당 1레벨
  const nextLevelMinutes = (level * 1000) - totalMinutesSaved;
  const levelProgress = ((totalMinutesSaved % 1000) / 1000) * 100;

  // 로그인 체크
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login?redirect=/my/dashboard');
    }
  }, [user, isLoading, router]);

  // 활동 데이터 로드
  useEffect(() => {
    if (user) {
      loadActivityData();
    }
  }, [user]);

  const loadActivityData = async () => {
    if (!user) return;

    try {
      // 블로그 히스토리 가져오기
      const histories = await getUserBlogHistory(user.uid);
      setRecentActivities(histories.slice(0, 3)); // 최근 3개만

      // 통계 계산
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const thisWeekBlogs = histories.filter(h => 
        new Date(h.createdAt) >= oneWeekAgo
      ).length;

      setActivityStats({
        totalBlogs: histories.length,
        totalAutomations: histories.length, // 임시: 나중에 자동화 실행 수로 변경
        thisWeekActivities: thisWeekBlogs,
      });
    } catch (error) {
      console.error('활동 데이터 로드 실패:', error);
    }
  };

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
      <div className="px-6 pt-24 md:pt-12 pb-4">
        <div className="flex items-center justify-between mb-4">
          <Link href="/" className="flex items-center gap-3">
            <img 
              src="/workfree-logo.png?v=3" 
              alt="WorkFree Logo" 
              className="w-10 h-10"
            />
            <div>
              <h1 className="text-xl font-bold text-[#1E1B33]">
                WorkFree
              </h1>
            </div>
          </Link>
          <span className="bg-[#FF9A7A] text-white px-3 py-1 rounded-full text-sm font-bold">
            Beta
          </span>
        </div>

        {/* 환영 메시지 */}
        <FadeIn>
          <div className="mb-6">
            <p className="text-3xl font-bold text-[#1E1B33] mb-1">
              안녕하세요, {user?.displayName || '사용자'}님! 👋
            </p>
            <p className="text-[#1E1B33]/70">
              오늘도 자동화로 칼퇴하세요
            </p>
          </div>
        </FadeIn>
      </div>

      {/* 레벨 & 진행바 */}
      <div className="px-6 mb-6">
        <FadeIn delay={0.1}>
          <div className="bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600 rounded-3xl p-6 shadow-2xl text-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-4xl font-black">LV.{level}</span>
                  <span className="bg-white/20 px-2 py-1 rounded-lg text-xs font-bold">
                    시간 절약 마스터
                  </span>
                </div>
                <p className="text-white/80 text-sm">
                  다음 레벨까지 {nextLevelMinutes}분 남음
                </p>
              </div>
              <div className="text-5xl">🏆</div>
            </div>
            
            {/* 진행바 */}
            <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-yellow-300 to-yellow-500 h-full rounded-full transition-all duration-1000"
                style={{ width: `${levelProgress}%` }}
              />
            </div>
            <p className="text-white/70 text-xs mt-2 text-right">
              {levelProgress.toFixed(0)}% 달성
            </p>
          </div>
        </FadeIn>
      </div>

      {/* 시간 절약 통계 */}
      <div className="px-6 mb-8">
        <h2 className="text-xl font-bold mb-4 text-[#1E1B33] flex items-center gap-2">
          <span>⏰</span>
          <span>내가 절약한 시간</span>
        </h2>
        <TimeSavingsCard userId={user.uid} />
      </div>

      {/* 활동 통계 */}
      <div className="px-6 mb-8">
        <h2 className="text-xl font-bold mb-4 text-[#1E1B33]">
          📊 이번 주 활동
        </h2>
        
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl p-4 border-2 border-[#AFA6FF]/50 text-center">
            <div className="text-2xl mb-2">📰</div>
            <div className="text-2xl font-bold text-[#6A5CFF]">
              {activityStats.totalBlogs}
            </div>
            <div className="text-xs text-[#1E1B33]/70">
              생성한 블로그
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border-2 border-[#AFA6FF]/50 text-center">
            <div className="text-2xl mb-2">⚡</div>
            <div className="text-2xl font-bold text-[#6A5CFF]">
              {activityStats.thisWeekActivities}
            </div>
            <div className="text-xs text-[#1E1B33]/70">
              이번 주 활동
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border-2 border-[#AFA6FF]/50 text-center">
            <div className="text-2xl mb-2">🎯</div>
            <div className="text-2xl font-bold text-[#6A5CFF]">
              {activityStats.totalAutomations}
            </div>
            <div className="text-xs text-[#1E1B33]/70">
              실행한 자동화
            </div>
          </div>
        </div>
      </div>

      {/* 최근 활동 */}
      {recentActivities.length > 0 && (
        <div className="px-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-[#1E1B33]">
              📝 최근 활동
            </h2>
            <Link 
              href="/my/blog-history"
              className="text-sm text-[#6A5CFF] hover:underline"
            >
              전체보기 →
            </Link>
          </div>
          
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="bg-white rounded-xl p-4 border-2 border-[#AFA6FF]/50 hover:border-[#6A5CFF] transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl">📰</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm text-[#1E1B33] mb-1 truncate">
                      {activity.topic}
                    </h3>
                    <p className="text-xs text-[#1E1B33]/70 mb-2 line-clamp-2">
                      {activity.content?.substring(0, 100)}...
                    </p>
                    <div className="flex items-center gap-2 text-xs text-[#1E1B33]/50">
                      <span>🎨 {activity.style}</span>
                      <span>•</span>
                      <span>
                        {new Date(activity.createdAt).toLocaleDateString('ko-KR', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 퀵 링크 섹션 */}
      <div className="px-6 mb-8">
        <h2 className="text-xl font-bold mb-4 text-[#1E1B33]">
          🚀 빠른 이동
        </h2>

        <StaggerContainer className="grid grid-cols-2 gap-3">
          <StaggerItem>
            <Link
              href="/tools/blog-generator"
              className="block p-4 rounded-2xl shadow-md transition-all hover:scale-105 hover:shadow-lg bg-white border-2 border-[#AFA6FF]/50 hover:border-[#6A5CFF]"
            >
              <div className="flex items-center gap-3">
                <div className="text-3xl">📰</div>
                <div>
                  <h3 className="font-bold text-sm text-[#1E1B33]">
                    블로그 생성
                  </h3>
                  <p className="text-xs text-[#1E1B33]/70">
                    AI 블로그
                  </p>
                </div>
              </div>
            </Link>
          </StaggerItem>

          <StaggerItem>
            <Link
              href="/gallery"
              className="block p-4 rounded-2xl shadow-md transition-all hover:scale-105 hover:shadow-lg bg-white border-2 border-[#AFA6FF]/50 hover:border-[#6A5CFF]"
            >
              <div className="flex items-center gap-3">
                <div className="text-3xl">🖼️</div>
                <div>
                  <h3 className="font-bold text-sm text-[#1E1B33]">
                    갤러리
                  </h3>
                  <p className="text-xs text-[#1E1B33]/70">
                    AI 이미지
                  </p>
                </div>
              </div>
            </Link>
          </StaggerItem>

          <StaggerItem>
            <Link
              href="/community"
              className="block p-4 rounded-2xl shadow-md transition-all hover:scale-105 hover:shadow-lg bg-white border-2 border-[#AFA6FF]/50 hover:border-[#6A5CFF]"
            >
              <div className="flex items-center gap-3">
                <div className="text-3xl">💬</div>
                <div>
                  <h3 className="font-bold text-sm text-[#1E1B33]">
                    커뮤니티
                  </h3>
                  <p className="text-xs text-[#1E1B33]/70">
                    소통하기
                  </p>
                </div>
              </div>
            </Link>
          </StaggerItem>

          <StaggerItem>
            <Link
              href="/kits"
              className="block p-4 rounded-2xl shadow-md transition-all hover:scale-105 hover:shadow-lg bg-white border-2 border-[#AFA6FF]/50 hover:border-[#6A5CFF]"
            >
              <div className="flex items-center gap-3">
                <div className="text-3xl">🎁</div>
                <div>
                  <h3 className="font-bold text-sm text-[#1E1B33]">
                    마켓
                  </h3>
                  <p className="text-xs text-[#1E1B33]/70">
                    키트 구매
                  </p>
                </div>
              </div>
            </Link>
          </StaggerItem>

          <StaggerItem>
            <Link
              href="/my/credits"
              className="block p-4 rounded-2xl shadow-md transition-all hover:scale-105 hover:shadow-lg bg-white border-2 border-[#AFA6FF]/50 hover:border-[#6A5CFF]"
            >
              <div className="flex items-center gap-3">
                <div className="text-3xl">💎</div>
                <div>
                  <h3 className="font-bold text-sm text-[#1E1B33]">
                    크레딧
                  </h3>
                  <p className="text-xs text-[#1E1B33]/70">
                    충전하기
                  </p>
                </div>
              </div>
            </Link>
          </StaggerItem>

          <StaggerItem>
            <Link
              href="/automation/steps"
              className="block p-4 rounded-2xl shadow-md transition-all hover:scale-105 hover:shadow-lg bg-white border-2 border-[#AFA6FF]/50 hover:border-[#6A5CFF]"
            >
              <div className="flex items-center gap-3">
                <div className="text-3xl">⚙️</div>
                <div>
                  <h3 className="font-bold text-sm text-[#1E1B33]">
                    자동화
                  </h3>
                  <p className="text-xs text-[#1E1B33]/70">
                    스텝 관리
                  </p>
                </div>
              </div>
            </Link>
          </StaggerItem>
        </StaggerContainer>
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
