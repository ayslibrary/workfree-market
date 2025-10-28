'use client';

import React, { useState, useEffect } from 'react';
import { UserProfile, Activity, CommunityPost, Routine } from '@/types/gamification';
import LoadingSpinner from '@/components/LoadingSpinner';

// 게이미피케이션 컴포넌트들
import LevelBar from '@/components/gamification/LevelBar';
import StatsRow from '@/components/gamification/StatsRow';
import QuickLaunch from '@/components/gamification/QuickLaunch';
import MyRoutines from '@/components/gamification/MyRoutines';
import WeeklyMissions from '@/components/gamification/WeeklyMissions';
import CommunityTeaser from '@/components/gamification/CommunityTeaser';
import ActivityFeed from '@/components/gamification/ActivityFeed';
import CreditBox from '@/components/gamification/CreditBox';

export default function DashboardPage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [hotPosts, setHotPosts] = useState<CommunityPost[]>([]);
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showConversionModal, setShowConversionModal] = useState(false);

  // Mock 데이터 생성
  const createMockData = () => {
    // Mock 사용자 프로필
    const mockProfile: UserProfile = {
      userId: 'demo-user-123',
      name: '프리(Fri) 마스터',
      email: 'demo@workfree.com',
      level: 8,
      xp: 366,
      credits: 45,
      plan: 'pro',
      time_bank_minutes: 127,
      cumulative_minutes: 1240,
      monthly_minutes: 180,
      lastLevelUp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      achievements: ['first_tool', 'level_5', 'time_saver'],
      weeklyMissions: [
        {
          id: '1',
          title: '도구 5회 사용',
          description: '이번 주에 도구를 5번 사용하세요',
          type: 'tool_usage',
          target: 5,
          current: 3,
          reward: { xp: 50, credits: 10 },
          completed: false,
          weekStart: new Date(),
          weekEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      ],
      totalToolsUsed: 47,
      totalTimeSaved: 1240,
      totalMoneySaved: 248000,
      currentStreak: 12,
      longestStreak: 25,
    };

    // Mock 활동 데이터
    const mockActivities: Activity[] = [
      {
        id: '1',
        userId: 'demo-user-123',
        type: 'tool_run',
        title: '엑셀 정리 실행',
        description: '7분 절약',
        xpEarned: 15,
        creditsSpent: 1,
        timeSaved: 7,
        toolUsed: 'excel-cleaner',
        createdAt: new Date(Date.now() - 5 * 60 * 1000),
      },
      {
        id: '2',
        userId: 'demo-user-123',
        type: 'review_write',
        title: '후기 등록',
        description: 'AI 화보 생성 도구 후기 작성',
        xpEarned: 10,
        creditsEarned: 3,
        createdAt: new Date(Date.now() - 60 * 60 * 1000),
      },
    ];

    // Mock 커뮤니티 포스트
    const mockPosts: CommunityPost[] = [
      {
        id: '1',
        userId: 'demo-user-123',
        userName: 'FriMaster',
        title: '엑셀 자동화 꿀팁 공유!',
        category: '팁',
        likes: 15,
        comments: 3,
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
      },
    ];

    // Mock 루틴 데이터
    const mockRoutines: Routine[] = [
      {
        id: '1',
        userId: 'demo-user-123',
        name: '엑셀 정기 대시보드',
        description: '매주 월요일 9시에 자동으로 대시보드를 생성합니다',
        icon: '📊',
        schedule: {
          type: 'weekly',
          time: '09:00',
          days: [1],
        },
        isActive: true,
        lastRun: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        nextRun: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        totalRuns: 12,
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      },
    ];

    return { mockProfile, mockActivities, mockPosts, mockRoutines };
  };

  // 초기 데이터 로드
  useEffect(() => {
    const loadData = () => {
      const { mockProfile, mockActivities, mockPosts, mockRoutines } = createMockData();
      
      setUserProfile(mockProfile);
      setActivities(mockActivities);
      setHotPosts(mockPosts);
      setRoutines(mockRoutines);
      setIsLoading(false);
    };

    // 1초 후 데이터 로드 (로딩 효과)
    setTimeout(loadData, 1000);
  }, []);

  // 로딩 상태
  if (isLoading) {
    return <LoadingSpinner message="게이미피케이션 대시보드 로딩 중..." variant="purple" />;
  }

  // 사용자 프로필이 없으면 에러
  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">데이터 로드 실패</h1>
          <p className="text-gray-600">게이미피케이션 데이터를 불러올 수 없습니다.</p>
        </div>
      </div>
    );
  }

  // 도구 실행 핸들러
  const handleToolRun = (toolId: string, toolName: string, cost: number, minutes: number) => {
    setToastMessage(`완료! ${minutes}분 절약 → +15XP 🎉 후기 남기면 +3C`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // 시간→크레딧 전환 핸들러
  const handleTimeToCreditConversion = () => {
    if (userProfile.time_bank_minutes <= 0) return;
    setShowConversionModal(true);
  };

  // 전환 확인
  const confirmConversion = () => {
    const creditsAwarded = Math.floor(userProfile.time_bank_minutes / 15);
    setToastMessage(`시간→크레딧 전환 완료! +${creditsAwarded} 크레딧 획득 💎`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    setShowConversionModal(false);
  };

  // 루틴 토글 처리
  const handleToggleRoutine = (routineId: string, isActive: boolean) => {
    setRoutines(prevRoutines => 
      prevRoutines.map(routine => 
        routine.id === routineId 
          ? { ...routine, isActive }
          : routine
      )
    );
    setToastMessage(isActive ? '루틴이 활성화되었습니다' : '루틴이 비활성화되었습니다');
    setShowToast(true);
  };

  // 루틴 편집 처리
  const handleEditRoutine = (routineId: string) => {
    // TODO: 루틴 편집 모달 열기
    console.log('Edit routine:', routineId);
    setToastMessage('루틴 편집 기능은 준비 중입니다');
    setShowToast(true);
  };

  return (
    <div className="min-h-screen bg-[#f5f0ff] pb-20">
      {/* 토스트 메시지 */}
      {showToast && (
        <div className="fixed top-4 right-4 bg-[#6A5CFF] text-white px-6 py-3 rounded-xl shadow-lg z-50">
          {toastMessage}
        </div>
      )}

      {/* 전환 모달 */}
      {showConversionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 border-2 border-[#AFA6FF]">
            <h3 className="text-xl font-bold mb-4 text-[#1E1B33]">시간→크레딧 전환</h3>
            <p className="text-[#1E1B33]/70 mb-4">
              {userProfile.time_bank_minutes}분을 크레딧으로 전환하시겠습니까?
            </p>
            <div className="flex gap-3">
              <button
                onClick={confirmConversion}
                className="flex-1 bg-[#6A5CFF] text-white py-2 px-4 rounded-xl hover:bg-[#5A4CE8] transition-colors"
              >
                전환하기
              </button>
              <button
                onClick={() => setShowConversionModal(false)}
                className="flex-1 bg-[#AFA6FF]/20 text-[#1E1B33] py-2 px-4 rounded-xl hover:bg-[#AFA6FF]/30 transition-colors"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 헤더 */}
      <div className="px-6 pt-24 md:pt-12 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
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
          </div>
          <span className="bg-[#FF9A7A] text-white px-3 py-1 rounded-full text-sm font-bold">
            Beta
          </span>
        </div>

        {/* 환영 메시지 */}
        <div className="mb-6">
          <p className="text-3xl font-bold text-[#1E1B33] mb-1">
            안녕하세요, {userProfile.name}님! 👋
          </p>
          <p className="text-[#1E1B33]/70">
            오늘도 자동화로 칼퇴하세요
          </p>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="mx-auto max-w-6xl px-6 space-y-6">
        {/* 레벨바 */}
        <LevelBar userProfile={userProfile} />

        {/* 통계 행 */}
        <StatsRow userProfile={userProfile} />

        {/* 퀵런치 */}
        <QuickLaunch onToolRun={handleToolRun} userCredits={userProfile.credits} />

        {/* 나만의 루틴 */}
        <MyRoutines 
          routines={routines} 
          onToggleRoutine={handleToggleRoutine}
          onEditRoutine={handleEditRoutine}
        />

        {/* 주간 미션 */}
        <WeeklyMissions missions={userProfile.weeklyMissions} />

        {/* 커뮤니티 하이라이트 */}
        <CommunityTeaser posts={hotPosts} />

        {/* 최근 활동 */}
        <ActivityFeed activities={activities} />

        {/* 크레딧 박스 */}
        <CreditBox 
          userProfile={userProfile} 
          onTimeToCreditConversion={handleTimeToCreditConversion}
        />
      </div>

      {/* 하단 네비게이션 */}
      <nav className="fixed bottom-0 left-0 right-0 px-6 py-4 border-t border-[#AFA6FF]/20 bg-[#1E1B33] shadow-2xl">
        <div className="flex items-center justify-around max-w-md mx-auto">
          <div className="flex flex-col items-center gap-1 min-w-[60px] transition-all">
            <span className="text-2xl">🏠</span>
            <span className="text-xs font-medium text-[#6A5CFF]">
              홈
            </span>
            <div className="w-1 h-1 rounded-full bg-[#6A5CFF]" />
          </div>

          <a
            href="/tools"
            className="flex flex-col items-center gap-1 min-w-[60px] transition-all"
          >
            <span className="text-2xl">🔧</span>
            <span className="text-xs font-medium text-white/70">
              툴
            </span>
          </a>

          <a
            href="/community"
            className="flex flex-col items-center gap-1 min-w-[60px] transition-all"
          >
            <span className="text-2xl">💬</span>
            <span className="text-xs font-medium text-white/70">
              톡
            </span>
          </a>

          <a
            href="/my/credits"
            className="flex flex-col items-center gap-1 min-w-[60px] transition-all"
          >
            <span className="text-2xl">💎</span>
            <span className="text-xs font-medium text-white/70">
              크레딧
            </span>
          </a>
        </div>
      </nav>
    </div>
  );
}