'use client';

import React, { useState, useEffect } from 'react';
import { createMockUserProfile } from '@/lib/gamification';
import { UserProfile, Activity, CommunityPost, Routine } from '@/types/gamification';
import { FadeIn } from '@/components/animations';
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

export default function GamificationDemo() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [hotPosts, setHotPosts] = useState<CommunityPost[]>([]);
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showConversionModal, setShowConversionModal] = useState(false);

  // 데모 모드용 Mock 사용자
  const demoUser = {
    uid: 'demo-user-001',
    email: 'demo@workfree.com',
    displayName: '프리(Fri) 마스터',
    photoURL: undefined,
  };

  // 초기 데이터 로드
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Mock 사용자 프로필 생성 (데모 모드)
        const mockProfile = createMockUserProfile('demo-user-123');
        setUserProfile(mockProfile);

        // Mock 활동 데이터
        const mockActivities: Activity[] = [
          {
            id: '1',
            userId: demoUser.uid,
            type: 'tool_run',
            title: '엑셀 정리 실행',
            description: '7분 절약',
            xpEarned: 15,
            creditsSpent: 1,
            timeSaved: 7,
            toolUsed: 'excel-cleaner',
            createdAt: new Date(Date.now() - 5 * 60 * 1000), // 5분 전
          },
          {
            id: '2',
            userId: demoUser.uid,
            type: 'review_write',
            title: '후기 등록',
            description: 'AI 화보 생성 도구 후기 작성',
            xpEarned: 10,
            creditsEarned: 3,
            createdAt: new Date(Date.now() - 60 * 60 * 1000), // 1시간 전
          },
          {
            id: '3',
            userId: demoUser.uid,
            type: 'level_up',
            title: '레벨업!',
            description: 'LV.7에서 LV.8로 상승',
            xpEarned: 50,
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2시간 전
          },
        ];
        setActivities(mockActivities);

        // Mock 커뮤니티 포스트
        const mockPosts: CommunityPost[] = [
          {
            id: '1',
            userId: 'user1',
            userName: '자동화마스터',
            userLevel: 12,
            title: '엑셀 자동화 꿀팁 공유합니다!',
            content: '매일 반복되는 엑셀 작업을 5분으로 줄인 비법을 공유합니다...',
            category: 'tips',
            likes: 24,
            comments: 8,
            views: 156,
            isHot: true,
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
            updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          },
          {
            id: '2',
            userId: 'user2',
            userName: '프리워커',
            userLevel: 8,
            title: '이번 주 3시간 절약했어요!',
            content: 'WorkFree 덕분에 이번 주에만 3시간을 절약했습니다...',
            category: 'showcase',
            likes: 18,
            comments: 5,
            views: 89,
            isHot: true,
            createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
            updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
          },
        ];
        setHotPosts(mockPosts);

        // Mock 루틴 데이터
        const mockRoutines: Routine[] = [
          {
            id: '1',
            userId: demoUser.uid,
            toolId: 'excel-dashboard',
            name: '엑셀 정기 대시보드',
            description: '매주 월요일 9시에 자동으로 대시보드를 생성합니다',
            icon: '📊',
            schedule: {
              type: 'weekly',
              time: '09:00',
              days: [1], // 월요일
            },
            isActive: true,
            lastRun: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2일 전
            nextRun: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5일 후
            totalRuns: 12,
            createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            updatedAt: new Date(),
          },
          {
            id: '2',
            userId: demoUser.uid,
            toolId: 'report-generator',
            name: '보고서 자동 생성',
            description: '매일 오후 6시에 일일 보고서를 자동 작성합니다',
            icon: '📄',
            schedule: {
              type: 'daily',
              time: '18:00',
            },
            isActive: false,
            lastRun: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1일 전
            nextRun: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6시간 후
            totalRuns: 25,
            createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
            updatedAt: new Date(),
          },
        ];
        setRoutines(mockRoutines);

        setIsLoadingData(false);
      } catch (error) {
        console.error('초기 데이터 로드 실패:', error);
        setIsLoadingData(false);
      }
    };

    loadInitialData();
  }, [demoUser.uid]); // demoUser.uid를 의존성에 추가

  // 로딩 상태
  if (isLoadingData) {
    return <LoadingSpinner message="게이미피케이션 대시보드 로딩 중..." variant="purple" />;
  }

  // 도구 실행 핸들러 (Mock)
  const handleToolRun = async (toolId: string, toolName: string, cost: number, minutes: number) => {
    if (!userProfile) return;

    try {
      // Mock 성공 응답
      const result = { success: true, newLevel: userProfile.level, levelUp: false };
      
      if (result.success) {
        // 성공 토스트 표시
        setToastMessage(`완료! ${minutes}분 절약 → +15XP 🎉 후기 남기면 +3C`);
        setShowToast(true);
        
        // 3초 후 토스트 숨기기
        setTimeout(() => setShowToast(false), 3000);
        
        // 프로필 업데이트 (Mock)
        if (result.levelUp) {
          setToastMessage(`🎉 레벨업! LV.${result.newLevel} 달성!`);
          setShowToast(true);
          setTimeout(() => setShowToast(false), 5000);
        }
      }
    } catch (error) {
      console.error('도구 실행 실패:', error);
    }
  };

  // 시간→크레딧 전환 핸들러
  const handleTimeToCreditConversion = () => {
    if (!userProfile || userProfile.time_bank_minutes <= 0) return;
    setShowConversionModal(true);
  };

  // 전환 확인 (Mock)
  const confirmConversion = async () => {
    if (!userProfile) return;

    try {
      // Mock 성공 응답
      const result = { success: true, creditsAwarded: Math.floor(userProfile.time_bank_minutes / 15) };
      
      if (result.success) {
        setToastMessage(`시간→크레딧 전환 완료! +${result.creditsAwarded} 크레딧 획득 💎`);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
      
      setShowConversionModal(false);
    } catch (error) {
      console.error('전환 실패:', error);
    }
  };

  // 루틴 토글 핸들러
  const handleToggleRoutine = (routineId: string, isActive: boolean) => {
    setRoutines(prev => prev.map(routine => 
      routine.id === routineId ? { ...routine, isActive } : routine
    ));
  };

  // 루틴 편집 핸들러
  const handleEditRoutine = (routineId: string) => {
    console.log('루틴 편집:', routineId);
    // 실제로는 루틴 편집 모달을 열거나 페이지로 이동
  };

  // 주간 통계 (Mock)
  const weeklyStats = {
    documentsCreated: 2,
    automationsRun: 15,
    recommendations: 3,
  };

  // 이번 주 자동화 장인 (Mock)
  const topUser = {
    name: '프리마스터',
    level: 12,
    timeSaved: '4시간 30분',
  };

  if (!userProfile) {
    return <LoadingSpinner message="사용자 프로필 로딩 중..." variant="purple" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 헤더 */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🎮</div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">게이미피케이션 대시보드</h1>
              <p className="text-sm text-gray-600">자동화로 레벨업하고 보상을 받으세요!</p>
            </div>
          </div>
          <div className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
            데모
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* LevelBar - 히어로 섹션 */}
        <FadeIn>
          <LevelBar
            user={userProfile}
            onStartAutomation={() => console.log('새 자동화 시작')}
            onViewGuide={() => console.log('가이드 보기')}
          />
        </FadeIn>

        {/* StatsRow - 절약 시간 & 이번 주 활동 */}
        <FadeIn delay={0.1}>
          <StatsRow
            user={userProfile}
            onTimeToCreditConversion={handleTimeToCreditConversion}
            weeklyStats={weeklyStats}
            onViewWeeklyMissions={() => console.log('주간 미션 보기')}
          />
        </FadeIn>

        {/* QuickLaunch - 빠른 실행 */}
        <FadeIn delay={0.2}>
          <QuickLaunch
            onToolRun={handleToolRun}
            userCredits={userProfile.credits}
          />
        </FadeIn>

        {/* 2열 그리드 레이아웃 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 왼쪽 컬럼 */}
          <div className="space-y-6">
            {/* MyRoutines - 나만의 루틴 자동화 */}
            <FadeIn delay={0.3}>
              <MyRoutines
                routines={routines}
                onToggleRoutine={handleToggleRoutine}
                onEditRoutine={handleEditRoutine}
              />
            </FadeIn>

            {/* WeeklyMissions - 주간 미션 & 보상 */}
            <FadeIn delay={0.4}>
              <WeeklyMissions
                missions={userProfile.weeklyMissions}
                onMissionComplete={(missionId) => console.log('미션 완료:', missionId)}
              />
            </FadeIn>
          </div>

          {/* 오른쪽 컬럼 */}
          <div className="space-y-6">
            {/* CommunityTeaser - 커뮤니티 하이라이트 */}
            <FadeIn delay={0.5}>
              <CommunityTeaser
                hotPosts={hotPosts}
                topUser={topUser}
                onViewCommunity={() => console.log('커뮤니티 보기')}
              />
            </FadeIn>

            {/* ActivityFeed - 최근 활동 피드 */}
            <FadeIn delay={0.6}>
              <ActivityFeed
                activities={activities}
                onViewAllActivities={() => console.log('전체 활동 보기')}
              />
            </FadeIn>

            {/* CreditBox - 크레딧/결제 박스 */}
            <FadeIn delay={0.7}>
              <CreditBox
                user={userProfile}
                onViewPlans={() => console.log('플랜 보기')}
                onRecharge={() => console.log('충전하기')}
                onToggleAutoRecharge={(enabled) => console.log('자동충전:', enabled)}
              />
            </FadeIn>
          </div>
        </div>
      </div>

      {/* 토스트 알림 */}
      {showToast && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* 시간→크레딧 전환 모달 */}
      {showConversionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md mx-4 shadow-2xl">
            <div className="text-center">
              <div className="text-4xl mb-4">💎</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                시간→크레딧 전환
              </h3>
              <p className="text-gray-600 mb-6">
                이번 레벨에서 모은 {Math.floor(userProfile.time_bank_minutes / 60)}시간 {userProfile.time_bank_minutes % 60}분을<br />
                크레딧으로 전환할까요?
              </p>
              
              <div className="bg-indigo-50 rounded-lg p-4 mb-6">
                <div className="text-sm text-indigo-800">
                  <div className="font-medium mb-1">예상 전환 크레딧</div>
                  <div className="text-lg font-bold">
                    +{Math.floor(userProfile.time_bank_minutes / 15)} 크레딧
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConversionModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={confirmConversion}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  전환하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
