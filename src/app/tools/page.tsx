'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import MainNavigation from '@/components/MainNavigation';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/animations';
import { AUTOMATION_SERVICES, getServicesByCategory, getPopularServices } from '@/lib/services';

const TOOLS = [
  {
    id: 'pdf-convert',
    name: 'PDF → Word 변환',
    icon: '📄',
    description: 'PDF 파일을 편집 가능한 Word 문서로 즉시 변환',
    credits: 1,
    timeSaved: 15,
    color: 'from-red-500 to-red-600',
    bgColor: 'from-red-50 to-red-100',
  },
  {
    id: 'outlook-auto',
    name: 'Outlook 자동 회신',
    icon: '📧',
    description: '조건에 맞는 메일 자동 회신 및 첨부파일 자동 발송',
    credits: 1,
    timeSaved: 30,
    color: 'from-blue-500 to-blue-600',
    bgColor: 'from-blue-50 to-blue-100',
  },
  {
    id: 'ai-portrait',
    name: 'AI 화보 생성',
    icon: '🎨',
    description: '프로필 사진을 보그 커버 스타일 화보로 변환',
    credits: 3,
    timeSaved: 60,
    color: 'from-pink-500 to-rose-600',
    bgColor: 'from-pink-50 to-pink-100',
  },
  {
    id: 'excel-process',
    name: 'Excel 데이터 처리',
    icon: '📊',
    description: '엑셀 병합, 데이터 분석 등 고급 처리',
    credits: 2,
    timeSaved: 45,
    color: 'from-green-500 to-emerald-600',
    bgColor: 'from-green-50 to-green-100',
  },
  {
    id: 'text-convert',
    name: '텍스트 일괄 변환',
    icon: '📝',
    description: '대량 텍스트 포맷 변환 및 정리를 한 번에 처리',
    credits: 1,
    timeSaved: 20,
    color: 'from-purple-500 to-purple-600',
    bgColor: 'from-purple-50 to-purple-100',
  },
  {
    id: 'image-compress',
    name: '이미지 일괄 압축',
    icon: '🖼️',
    description: '여러 이미지를 한 번에 최적화 압축',
    credits: 1,
    timeSaved: 10,
    color: 'from-yellow-500 to-orange-600',
    bgColor: 'from-yellow-50 to-orange-100',
  },
  {
    id: 'blog-generator',
    name: 'AI 블로그 자동 생성',
    icon: '✍️',
    description: '키워드만 입력하면 GPT가 자동으로 블로그 글 작성',
    credits: 3,
    timeSaved: 30,
    color: 'from-indigo-500 to-purple-600',
    bgColor: 'from-indigo-50 to-purple-100',
    link: '/tools/blog-generator',
  },
  {
    id: 'qr-generator',
    name: 'QR 코드 생성기',
    icon: '📱',
    description: 'URL, 텍스트를 QR 코드로 변환하고 로고 삽입까지',
    credits: 1,
    timeSaved: 15,
    color: 'from-cyan-500 to-blue-600',
    bgColor: 'from-cyan-50 to-blue-100',
    link: '/tools/qr-generator',
  },
];

export default function ToolsPage() {
  const router = useRouter();
  const [selectedTool, setSelectedTool] = useState<typeof TOOLS[0] | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentCredits] = useState(10); // 데모: 현재 크레딧
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const handleUseTool = async (tool: typeof TOOLS[0]) => {
    if (currentCredits < tool.credits) {
      alert('크레딧이 부족합니다! 충전 페이지로 이동하시겠습니까?');
      return;
    }

    // link가 있으면 해당 페이지로 이동
    if ('link' in tool && tool.link) {
      router.push(tool.link);
      return;
    }

    setSelectedTool(tool);
    setIsProcessing(true);

    // 시뮬레이션: 실제 처리
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsProcessing(false);
    setShowSuccess(true);

    // 3초 후 초기화
    setTimeout(() => {
      setShowSuccess(false);
      setSelectedTool(null);
    }, 3000);
  };

  if (showSuccess && selectedTool) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-purple-50/30 to-white">
        <MainNavigation />
        <div className="max-w-2xl mx-auto px-4 py-20 text-center pt-24 md:pt-20">
          <div className="bg-white rounded-3xl shadow-2xl p-12 border-2 border-green-200">
            <div className="text-6xl mb-6">✅</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              작업 완료!
            </h2>
            <p className="text-xl text-gray-600 mb-6">
              {selectedTool.name} 처리가 완료되었습니다
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-red-50 rounded-xl p-4 border-2 border-red-200">
                <p className="text-sm text-gray-600 mb-1">사용 크레딧</p>
                <p className="text-2xl font-bold text-red-600">
                  -{selectedTool.credits}
                </p>
              </div>
              <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200">
                <p className="text-sm text-gray-600 mb-1">절약 시간</p>
                <p className="text-2xl font-bold text-green-600">
                  +{selectedTool.timeSaved}분
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 border-2 border-purple-200 mb-6">
              <p className="text-lg font-bold text-purple-600">
                남은 크레딧: {currentCredits - selectedTool.credits}개
              </p>
            </div>

            <p className="text-gray-500 text-sm">
              잠시 후 도구 목록으로 돌아갑니다...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isProcessing && selectedTool) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-purple-50/30 to-white">
        <MainNavigation />
        <div className="max-w-2xl mx-auto px-4 py-20 text-center pt-24 md:pt-20">
          <div className="bg-white rounded-3xl shadow-2xl p-12 border-2 border-purple-200">
            <div className="text-6xl mb-6 animate-bounce">{selectedTool.icon}</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              처리 중...
            </h2>
            <p className="text-xl text-gray-600 mb-6">
              {selectedTool.name} 작업을 진행하고 있습니다
            </p>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 h-4 rounded-full animate-pulse" style={{ width: '70%' }}></div>
            </div>
            <p className="text-gray-500 text-sm">
              잠시만 기다려주세요...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-purple-50/30 to-white">
      <MainNavigation />

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 pt-24 md:pt-20">
        {/* 헤더 */}
        <FadeIn>
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              🛠️ 자동화 도구
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              클릭 한 번으로 업무 자동화를 시작하세요
            </p>
            <div className="inline-block bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl px-6 py-3">
              <p className="text-lg font-bold text-purple-600">
                💎 보유 크레딧: {currentCredits}개
              </p>
            </div>
          </div>
        </FadeIn>

        {/* 카테고리 필터 */}
        <FadeIn>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                selectedCategory === 'all'
                  ? 'bg-[#6A5CFF] text-white shadow-lg'
                  : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-[#6A5CFF]'
              }`}
            >
              전체
            </button>
            <button
              onClick={() => setSelectedCategory('marketing')}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                selectedCategory === 'marketing'
                  ? 'bg-[#6A5CFF] text-white shadow-lg'
                  : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-[#6A5CFF]'
              }`}
            >
              📊 마케팅/영업
            </button>
            <button
              onClick={() => setSelectedCategory('hr')}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                selectedCategory === 'hr'
                  ? 'bg-[#6A5CFF] text-white shadow-lg'
                  : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-[#6A5CFF]'
              }`}
            >
              📝 인사/총무
            </button>
            <button
              onClick={() => setSelectedCategory('finance')}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                selectedCategory === 'finance'
                  ? 'bg-[#6A5CFF] text-white shadow-lg'
                  : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-[#6A5CFF]'
              }`}
            >
              💰 재무/회계
            </button>
            <button
              onClick={() => setSelectedCategory('product')}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                selectedCategory === 'product'
                  ? 'bg-[#6A5CFF] text-white shadow-lg'
                  : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-[#6A5CFF]'
              }`}
            >
              💡 기획/제품
            </button>
          </div>
        </FadeIn>

        {/* 도구 목록 */}
        <StaggerContainer staggerDelay={0.1} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* 기존 도구들 (전체 카테고리일 때만 표시) */}
          {selectedCategory === 'all' && TOOLS.map((tool) => (
            <StaggerItem key={tool.id}>
              <div className={`bg-gradient-to-br ${tool.bgColor} rounded-3xl p-8 border-2 border-gray-200 hover:border-purple-300 hover:scale-105 transition-all`}>
                <div className="text-5xl mb-4">{tool.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {tool.name}
                </h3>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  {tool.description}
                </p>

                {/* 크레딧 정보 */}
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                  <div>
                    <span className="text-sm text-gray-600">사용 크레딧</span>
                    <div className="text-2xl font-bold text-purple-600">
                      {tool.credits}개
                    </div>
                  </div>
                </div>

                {/* 시간 절약 정보 */}
                <div className="mb-6 space-y-3">
                  <div className="flex items-center justify-between bg-white/50 rounded-lg p-3">
                    <span className="text-sm text-gray-600">⏱️ 1회 사용 당</span>
                    <span className="text-lg font-bold text-green-600">
                      {tool.timeSaved}분 절약
                    </span>
                  </div>
                  <div className="flex items-center justify-between bg-white/50 rounded-lg p-3">
                    <span className="text-sm text-gray-600">📅 한 달 (20회)</span>
                    <span className="text-lg font-bold text-blue-600">
                      {Math.floor(tool.timeSaved * 20 / 60)}시간 {(tool.timeSaved * 20) % 60}분 절약
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleUseTool(tool)}
                  disabled={currentCredits < tool.credits}
                  className={`
                    w-full py-3 rounded-xl font-bold transition-all
                    ${currentCredits < tool.credits
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : `bg-gradient-to-r ${tool.color} text-white hover:shadow-lg hover:scale-[1.02]`
                    }
                  `}
                >
                  {currentCredits < tool.credits ? '크레딧 부족' : '사용하기'}
                </button>
              </div>
            </StaggerItem>
          ))}

          {/* 새로운 자동화 서비스들 */}
          {selectedCategory !== 'all' && AUTOMATION_SERVICES.filter(service => service.category === selectedCategory).map((service) => (
            <StaggerItem key={service.id}>
              <div className="bg-white rounded-3xl p-8 border-2 border-gray-200 hover:border-[#6A5CFF] hover:scale-105 transition-all shadow-lg">
                <div className="text-5xl mb-4">{service.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {service.name}
                </h3>
                <p className="text-gray-700 mb-4 leading-relaxed text-sm">
                  {service.description}
                </p>

                {/* 카테고리 태그 */}
                <div className="mb-4">
                  <span className="inline-block bg-[#6A5CFF]/10 text-[#6A5CFF] px-3 py-1 rounded-full text-sm font-medium">
                    {service.categoryName}
                  </span>
                </div>

                {/* 크레딧 및 시간 정보 */}
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                  <div>
                    <span className="text-sm text-gray-600">사용 크레딧</span>
                    <div className="text-2xl font-bold text-[#6A5CFF]">
                      {service.cost}개
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-gray-600">절약 시간</span>
                    <div className="text-2xl font-bold text-green-600">
                      {service.timeSaved}분
                    </div>
                  </div>
                </div>

                {/* 기능 특징 */}
                <div className="mb-6">
                  <h4 className="text-sm font-bold text-gray-700 mb-2">주요 기능</h4>
                  <div className="flex flex-wrap gap-1">
                    {service.features.slice(0, 2).map((feature, index) => (
                      <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 사용하기 버튼 */}
                <button
                  onClick={() => handleUseTool({
                    id: service.id,
                    name: service.name,
                    icon: service.icon,
                    description: service.description,
                    credits: service.cost,
                    timeSaved: service.timeSaved,
                    color: 'from-[#6A5CFF] to-[#5A4CE8]',
                    bgColor: 'from-[#6A5CFF]/10 to-[#5A4CE8]/10'
                  })}
                  disabled={currentCredits < service.cost}
                  className={`
                    w-full py-3 rounded-xl font-bold transition-all
                    ${currentCredits < service.cost
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#6A5CFF] to-[#5A4CE8] text-white hover:shadow-lg hover:scale-[1.02]'
                    }
                  `}
                >
                  {currentCredits < service.cost ? '크레딧 부족' : '사용하기'}
                </button>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* 크레딧 안내 */}
        <FadeIn delay={0.3}>
          <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              💡 크레딧 안내
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl mb-3">💎</div>
                <h3 className="font-bold text-gray-900 mb-2">크레딧 사용</h3>
                <p className="text-sm text-gray-600">
                  각 도구는 정해진 크레딧을 소모합니다
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">⏰</div>
                <h3 className="font-bold text-gray-900 mb-2">시간 절약</h3>
                <p className="text-sm text-gray-600">
                  절약된 시간은 대시보드에서 확인 가능
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">🎁</div>
                <h3 className="font-bold text-gray-900 mb-2">무료 크레딧</h3>
                <p className="text-sm text-gray-600">
                  후기 작성으로 추가 크레딧 획득
                </p>
              </div>
            </div>
            <div className="mt-6 flex gap-4 justify-center">
              <Link
                href="/my/credits"
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full font-bold hover:shadow-lg hover:scale-105 transition-all"
              >
                크레딧 충전하기
              </Link>
              <Link
                href="/reviews/write"
                className="bg-white border-2 border-purple-300 text-purple-600 px-8 py-3 rounded-full font-bold hover:bg-purple-50 transition-all"
              >
                후기 작성하기
              </Link>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}

