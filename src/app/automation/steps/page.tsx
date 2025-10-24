'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/animations';

export default function AutomationStepsPage() {
  const router = useRouter();
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const steps = [
    {
      id: 1,
      number: '1타운',
      title: '디타 가져이',
      description: '나의 데이터를 먼저 읽 봐주도록 설정드',
    },
    {
      id: 2,
      number: '2단은',
      title: '디타 가져이',
      description: '원본의 반드시를 잡 봐는 포 빌버드',
    },
    {
      id: 3,
      number: '2타은',
      title: '토드 조락',
      description: '의미한 판드 하식를 폭 봐취하는 타봄',
    },
    {
      id: 4,
      number: '3. PDF 변환',
      title: 'PDF 변환',
      description: '모든북의 거이 가 하는 결과 문악기 현감의 소휘드',
    },
  ];

  const handleComplete = () => {
    alert('자동화가 생성되었습니다! 🎉');
    router.push('/my/dashboard');
  };

  return (
    <div 
      className="min-h-screen"
      style={{ backgroundColor: 'var(--warm-white)' }}
    >
      {/* 헤더 */}
      <div 
        className="px-6 py-4 flex items-center gap-4 border-b"
        style={{ borderColor: 'var(--soft-lilac)' }}
      >
        <button
          onClick={() => router.back()}
          className="w-10 h-10 flex items-center justify-center rounded-xl transition-colors"
          style={{ color: 'var(--midnight-navy)' }}
        >
          ←
        </button>
        <h1 
          className="text-xl font-bold"
          style={{ color: 'var(--midnight-navy)' }}
        >
          사용화 스텝
        </h1>
      </div>

      {/* 스텝 목록 */}
      <div className="px-6 py-8">
        <StaggerContainer className="space-y-4 mb-8">
          {steps.map((step, index) => (
            <StaggerItem key={step.id}>
              <div
                className="p-6 rounded-2xl border-2 transition-all"
                style={{
                  backgroundColor: 'var(--warm-white)',
                  borderColor: completedSteps.includes(step.id) 
                    ? 'var(--main-violet)' 
                    : 'var(--soft-lilac)',
                }}
              >
                <div className="flex items-start gap-4">
                  {/* Fri 아이콘 */}
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ 
                      background: completedSteps.includes(step.id)
                        ? `linear-gradient(135deg, var(--main-violet) 0%, var(--soft-lilac) 100%)`
                        : `var(--soft-lilac)`,
                    }}
                  >
                    🐇
                  </div>

                  {/* 내용 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 
                        className="font-bold text-lg"
                        style={{ color: 'var(--midnight-navy)' }}
                      >
                        {step.number}
                      </h3>
                      {completedSteps.includes(step.id) && (
                        <span 
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{ 
                            backgroundColor: 'var(--main-violet)',
                            color: 'var(--warm-white)'
                          }}
                        >
                          완료
                        </span>
                      )}
                    </div>
                    <p 
                      className="font-semibold mb-1"
                      style={{ color: 'var(--midnight-navy)' }}
                    >
                      {step.title}
                    </p>
                    <p 
                      className="text-sm leading-relaxed"
                      style={{ color: 'var(--midnight-navy)', opacity: 0.6 }}
                    >
                      {step.description}
                    </p>

                    {/* 액션 버튼 */}
                    <button
                      onClick={() => {
                        if (completedSteps.includes(step.id)) {
                          setCompletedSteps(completedSteps.filter(id => id !== step.id));
                        } else {
                          setCompletedSteps([...completedSteps, step.id]);
                        }
                      }}
                      className="mt-3 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                      style={{
                        backgroundColor: completedSteps.includes(step.id)
                          ? 'transparent'
                          : 'var(--soft-lilac)',
                        color: completedSteps.includes(step.id)
                          ? 'var(--main-violet)'
                          : 'var(--midnight-navy)',
                        border: completedSteps.includes(step.id)
                          ? '2px solid var(--soft-lilac)'
                          : 'none'
                      }}
                    >
                      {completedSteps.includes(step.id) ? '수정하기' : '설정하기'}
                    </button>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* 완료 버튼 */}
        <FadeIn delay={0.4}>
          <button
            onClick={handleComplete}
            disabled={completedSteps.length < steps.length}
            className="w-full py-4 rounded-2xl font-bold text-lg shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: completedSteps.length === steps.length
                ? `linear-gradient(135deg, var(--main-violet) 0%, var(--soft-lilac) 100%)`
                : 'var(--soft-lilac)',
              color: 'var(--warm-white)',
            }}
          >
            {completedSteps.length === steps.length ? '사용화 토팅' : `${completedSteps.length}/${steps.length} 완료`}
          </button>
        </FadeIn>

        {/* 도움말 */}
        <div 
          className="mt-6 p-4 rounded-xl"
          style={{ 
            backgroundColor: 'rgba(175, 166, 255, 0.1)',
            border: '1px solid var(--soft-lilac)'
          }}
        >
          <p 
            className="text-sm text-center"
            style={{ color: 'var(--midnight-navy)', opacity: 0.7 }}
          >
            💡 각 스텝을 설정하고 "사용화 토팅"을 눌러주세요
          </p>
        </div>
      </div>
    </div>
  );
}

