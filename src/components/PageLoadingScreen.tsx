'use client';

import { useEffect, useState } from 'react';

interface LoadingStep {
  text: string;
  icon: string;
  color: string;
}

const loadingSteps: LoadingStep[] = [
  { text: "Excel 정리 중...", icon: "📊", color: "#1D6F42" },
  { text: "PPT 수정 중...", icon: "📽️", color: "#D24625" },
  { text: "Outlook 메일 확인 중...", icon: "📧", color: "#0078D4" },
  { text: "보고서 복붙 중...", icon: "📄", color: "#5B5B5B" },
  { text: "첨부파일 찾는 중...", icon: "📎", color: "#7F7F7F" },
  { text: "퇴근 준비 중...", icon: "☕", color: "#8B4513" },
  { text: "이제 WorkFree가 대신합니다.", icon: "🚀", color: "#6A5CFF" }
];

export default function PageLoadingScreen() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // 로딩 단계 변경
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % loadingSteps.length);
    }, 1200);

    return () => {
      clearInterval(stepInterval);
    };
  }, []);

  const step = loadingSteps[currentStep];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="text-center">
        {/* 로딩 아이콘 */}
        <div 
          className="text-8xl mb-6 animate-bounce"
          style={{ 
            animation: 'fadeInOut 1.2s ease-in-out infinite, rotate 2s linear infinite',
            color: step.color 
          }}
        >
          {step.icon}
        </div>

        {/* 로딩 텍스트 */}
        <div 
          className="text-3xl font-bold mb-12"
          style={{ 
            animation: 'fadeInOut 1.2s ease-in-out infinite',
            color: step.color 
          }}
        >
          {step.text}
        </div>

        {/* 로고 */}
        <div 
          className="text-4xl font-extrabold text-gray-800 opacity-0"
          style={{ 
            animation: 'fadeInLogo 1.5s ease 3s forwards' 
          }}
        >
          WorkFree
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateY(15px); }
          20% { opacity: 1; transform: translateY(0); }
          80% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-15px); }
        }

        @keyframes rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes fadeInLogo {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 0.8; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

