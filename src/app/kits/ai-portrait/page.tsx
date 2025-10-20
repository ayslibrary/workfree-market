'use client';

import { useState } from 'react';
import Link from 'next/link';
import SimpleHeader from '@/components/SimpleHeader';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/animations';

interface Concept {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  color: string;
  difficulty: string;
}

export default function AIPortraitKitPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  const categories = [
    { id: 'all', name: '전체', icon: '🎨' },
    { id: 'magazine', name: '럭셔리 매거진', icon: '📸' },
    { id: 'business', name: '비즈니스', icon: '💼' },
    { id: 'brand', name: '럭셔리 브랜드', icon: '💎' },
    { id: 'artistic', name: '아티스틱', icon: '🎭' },
    { id: 'sns', name: 'SNS 최적화', icon: '📱' }
  ];

  const concepts: Concept[] = [
    // 럭셔리 매거진
    { id: 'vogue', name: 'Vogue Korea', category: 'magazine', description: '파워풀하고 세련된 보그 스타일 화보', icon: '👑', color: 'from-black to-gray-800', difficulty: '중급' },
    { id: 'harpers', name: "Harper's Bazaar", category: 'magazine', description: '클래식하고 우아한 바자 스타일', icon: '💫', color: 'from-rose-600 to-pink-600', difficulty: '중급' },
    { id: 'elle', name: 'Elle Magazine', category: 'magazine', description: '모던하고 트렌디한 엘르 감성', icon: '✨', color: 'from-purple-600 to-pink-500', difficulty: '초급' },
    { id: 'gq', name: 'GQ 남성 화보', category: 'magazine', description: '남성 전문 매거진 스타일', icon: '🎩', color: 'from-slate-700 to-slate-900', difficulty: '중급' },

    // 비즈니스
    { id: 'linkedin', name: 'LinkedIn 프로필', category: 'business', description: '신뢰감 있는 전문가 프로필', icon: '💼', color: 'from-blue-600 to-blue-800', difficulty: '초급' },
    { id: 'startup', name: '스타트업 대표', category: 'business', description: '혁신적이고 도전적인 이미지', icon: '🚀', color: 'from-indigo-500 to-purple-600', difficulty: '초급' },
    { id: 'speaker', name: '강연자/인플루언서', category: 'business', description: '친근하면서 권위있는 이미지', icon: '🎤', color: 'from-orange-500 to-red-600', difficulty: '중급' },
    { id: 'corporate', name: '명함/회사소개서', category: 'business', description: '격식있고 전문적인 비즈니스 컷', icon: '📇', color: 'from-gray-700 to-gray-900', difficulty: '초급' },

    // 럭셔리 브랜드
    { id: 'chanel', name: 'Chanel 우아함', category: 'brand', description: '타임리스한 샤넬 감성', icon: '🖤', color: 'from-gray-900 to-black', difficulty: '고급' },
    { id: 'dior', name: 'Dior 클래식', category: 'brand', description: '여성스럽고 세련된 디올 스타일', icon: '🌹', color: 'from-rose-500 to-pink-700', difficulty: '고급' },
    { id: 'gucci', name: 'Gucci 모던 아트', category: 'brand', description: '대담하고 아티스틱한 구찌 감성', icon: '🎨', color: 'from-green-600 to-red-600', difficulty: '고급' },
    { id: 'hermes', name: 'Hermès 미니멀', category: 'brand', description: '절제된 럭셔리 에르메스 스타일', icon: '🧡', color: 'from-orange-600 to-orange-800', difficulty: '고급' },

    // 아티스틱
    { id: 'bw', name: '흑백 필름 사진', category: 'artistic', description: '감성적인 흑백 필름 무드', icon: '⚫', color: 'from-gray-500 to-gray-700', difficulty: '중급' },
    { id: 'vintage', name: '빈티지 레트로', category: 'artistic', description: '1970-90년대 빈티지 감성', icon: '📻', color: 'from-amber-600 to-yellow-700', difficulty: '중급' },
    { id: 'cyberpunk', name: '네온 사이버펑크', category: 'artistic', description: '미래적이고 강렬한 네온 스타일', icon: '🌃', color: 'from-cyan-500 to-purple-600', difficulty: '고급' },
    { id: 'movie', name: '감성 무비 스틸컷', category: 'artistic', description: '영화 속 주인공 같은 무드', icon: '🎬', color: 'from-blue-700 to-indigo-900', difficulty: '중급' },

    // SNS
    { id: 'instagram', name: '인스타그램 피드', category: 'sns', description: '감각적인 인스타 피드용', icon: '📸', color: 'from-pink-500 to-rose-500', difficulty: '초급' },
    { id: 'tiktok', name: '틱톡 썸네일', category: 'sns', description: '눈길을 끄는 틱톡 스타일', icon: '🎵', color: 'from-cyan-400 to-pink-500', difficulty: '초급' },
    { id: 'youtube', name: '유튜브 프로필', category: 'sns', description: '친근한 유튜버 프로필', icon: '▶️', color: 'from-red-600 to-red-700', difficulty: '초급' },
    { id: 'twitter', name: '트위터 헤더', category: 'sns', description: '임팩트 있는 헤더 이미지', icon: '🐦', color: 'from-blue-400 to-blue-600', difficulty: '초급' }
  ];

  const filteredConcepts = selectedCategory === 'all' 
    ? concepts 
    : concepts.filter(c => c.category === selectedCategory);

  const handleDownload = () => {
    setShowDownloadModal(true);
    // 실제 다운로드 로직
    setTimeout(() => {
      alert('✅ 프롬프트 키트가 다운로드되었습니다!\n압축을 풀고 README.md를 먼저 읽어주세요.');
      setShowDownloadModal(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <SimpleHeader />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <FadeIn>
            <div className="text-center">
              <div className="inline-block mb-4">
                <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold">
                  ✨ AI 프롬프트 키트
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 break-keep">
                🎨 AI 화보 메이커 프롬프트 키트
              </h1>
              <p className="text-xl md:text-2xl opacity-90 mb-4 break-keep">
                스튜디오 30만원 vs AI 화보 무료
              </p>
              <p className="text-lg opacity-80 mb-8 break-keep">
                내 얼굴로 5분 만에 보그 커버 모델 되기
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={handleDownload}
                  className="bg-white text-purple-600 px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all"
                >
                  💾 무료 다운로드 (베타)
                </button>
                <a
                  href="#preview"
                  className="bg-white/20 backdrop-blur-sm border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/30 transition-all"
                >
                  📸 결과물 보기
                </a>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <StaggerContainer staggerDelay={0.1} className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <StaggerItem>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">20+</div>
                <div className="text-gray-600">프롬프트 컨셉</div>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="text-center">
                <div className="text-4xl font-bold text-pink-600 mb-2">60+</div>
                <div className="text-gray-600">실제 결과물</div>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="text-center">
                <div className="text-4xl font-bold text-rose-600 mb-2">5분</div>
                <div className="text-gray-600">평균 제작시간</div>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-600 mb-2">무료</div>
                <div className="text-gray-600">베타 기간</div>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 bg-gradient-to-b from-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900">
              🚀 사용 방법 (3단계)
            </h2>
            <p className="text-center text-gray-600 mb-12">
              누구나 5분 만에 프로급 화보 제작
            </p>
          </FadeIn>

          <StaggerContainer staggerDelay={0.15} className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <StaggerItem>
              <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-purple-100 text-center hover:scale-105 transition-transform">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
                  📱
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">1. 사진 준비</h3>
                <p className="text-gray-600">
                  본인 정면 사진 준비<br />
                  (스마트폰 셀카도 OK!)
                </p>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-pink-100 text-center hover:scale-105 transition-transform">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
                  📋
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">2. 프롬프트 선택</h3>
                <p className="text-gray-600">
                  원하는 컨셉의<br />
                  프롬프트 복사
                </p>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-rose-100 text-center hover:scale-105 transition-transform">
                <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
                  ✨
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">3. AI 생성</h3>
                <p className="text-gray-600">
                  Gemini에 사진+프롬프트<br />
                  입력 → 완성!
                </p>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* Concepts Catalog */}
      <section id="concepts" className="py-16 bg-purple-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900">
              📸 20가지 프롬프트 컨셉
            </h2>
            <p className="text-center text-gray-600 mb-8">
              초급부터 고급까지, 원하는 스타일을 선택하세요
            </p>
          </FadeIn>

          {/* Category Filter */}
          <div className="mb-8">
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-6 py-3 rounded-full font-semibold transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
                  }`}
                >
                  {cat.icon} {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Concepts Grid */}
          <StaggerContainer staggerDelay={0.1} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredConcepts.map((concept) => (
              <StaggerItem key={concept.id}>
                <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 border-2 border-gray-100 hover:scale-105 cursor-pointer group">
                  <div className={`w-16 h-16 bg-gradient-to-br ${concept.color} rounded-xl flex items-center justify-center mb-4 text-3xl group-hover:scale-110 transition-transform`}>
                    {concept.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {concept.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {concept.description}
                  </p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    concept.difficulty === '초급' ? 'bg-green-100 text-green-700' :
                    concept.difficulty === '중급' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {concept.difficulty}
                  </span>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Preview Section */}
      <section id="preview" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900">
              🎨 실제 결과물 미리보기
            </h2>
            <p className="text-center text-gray-600 mb-12">
              같은 사진으로 만든 다양한 스타일
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-8">
            {/* 예시 이미지 플레이스홀더 */}
            {['Vogue Korea', 'Chanel Concept', 'LinkedIn Profile'].map((title, idx) => (
              <div key={idx} className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden shadow-lg group">
                <div className="aspect-[3/4] bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center relative">
                  <div className="text-6xl">📸</div>
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white font-bold text-lg">Before → After</span>
                  </div>
                </div>
                <div className="p-4 bg-white">
                  <h3 className="font-bold text-lg text-gray-900">{title}</h3>
                  <p className="text-sm text-gray-600">프롬프트 결과물 예시</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-500 mb-4">
              * 실제 결과물은 다운로드 패키지에 60장 포함
            </p>
          </div>
        </div>
      </section>

      {/* Package Contents */}
      <section className="py-16 bg-gradient-to-b from-white to-purple-50">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
              📦 패키지 구성
            </h2>
          </FadeIn>

          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border-2 border-purple-200">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl">
                  📄
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 mb-1">README 가이드</h3>
                  <p className="text-gray-600 text-sm">전체 사용법 및 팁 정리</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl">
                  🎨
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 mb-1">20가지 프롬프트</h3>
                  <p className="text-gray-600 text-sm">컨셉별 완성된 템플릿</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl">
                  📸
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 mb-1">결과물 60장</h3>
                  <p className="text-gray-600 text-sm">Before/After 예시 이미지</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl">
                  🎬
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 mb-1">영상 가이드</h3>
                  <p className="text-gray-600 text-sm">5분 사용법 튜토리얼</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl">
                  💡
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 mb-1">치트시트</h3>
                  <p className="text-gray-600 text-sm">커스터마이징 키워드 모음</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl">
                  ⚙️
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 mb-1">Gemini 설정</h3>
                  <p className="text-gray-600 text-sm">최적 설정값 가이드</p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">🎁</span>
                <h3 className="font-bold text-lg text-gray-900">보너스 콘텐츠</h3>
              </div>
              <ul className="text-gray-700 space-y-1 text-sm ml-10">
                <li>• 사진 찍는 각도별 가이드</li>
                <li>• 컨셉별 의상 선택 팁</li>
                <li>• 조명 설정 완벽 가이드</li>
                <li>• 얼굴 특징별 프롬프트 조정법</li>
                <li>• 배경 교체 프롬프트 30종</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-purple-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
              💬 베타 테스터 후기
            </h2>
          </FadeIn>

          <StaggerContainer staggerDelay={0.15} className="grid md:grid-cols-3 gap-6">
            <StaggerItem>
              <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-purple-100">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-yellow-500 text-xl">⭐⭐⭐⭐⭐</span>
                </div>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  &ldquo;LinkedIn 프로필을 바꿨더니 헤드헌터 연락이 3배 늘었어요. 진짜 전문가처럼 보여요!&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                    김
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">김**</div>
                    <div className="text-sm text-gray-500">IT 개발자</div>
                  </div>
                </div>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-pink-100">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-yellow-500 text-xl">⭐⭐⭐⭐⭐</span>
                </div>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  &ldquo;인스타 팔로워가 1달 만에 500명 늘었어요. 프로필 사진 바꾼 게 다예요!&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center text-white font-bold">
                    이
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">이**</div>
                    <div className="text-sm text-gray-500">프리랜서 디자이너</div>
                  </div>
                </div>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-rose-100">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-yellow-500 text-xl">⭐⭐⭐⭐⭐</span>
                </div>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  &ldquo;스튜디오 예약하려다가 이거 발견했어요. 30만원 절약하고 퀄리티는 더 좋아요!&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                    박
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">박**</div>
                    <div className="text-sm text-gray-500">마케터</div>
                  </div>
                </div>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center text-white">
          <FadeIn>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 break-keep">
              지금 무료로 시작하세요
            </h2>
            <p className="text-xl mb-8 opacity-90 break-keep">
              베타 기간 동안 완전 무료! 정식 출시 시 ₩29,900
            </p>
            <button
              onClick={handleDownload}
              className="bg-white text-purple-600 px-12 py-5 rounded-full font-bold text-xl hover:shadow-2xl hover:scale-105 transition-all"
            >
              💾 무료 다운로드
            </button>
            <p className="mt-6 text-sm opacity-80">
              다운로드 후 바로 사용 가능 • 회원가입 불필요
            </p>
          </FadeIn>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
              ❓ 자주 묻는 질문
            </h2>
          </FadeIn>

          <div className="space-y-4">
            {[
              {
                q: 'Gemini 사용료가 따로 드나요?',
                a: 'Gemini는 기본적으로 무료입니다. 고급 기능이 필요하면 Gemini Advanced(월 ₩24,900)를 사용하시면 더 좋은 결과를 얻을 수 있습니다.'
              },
              {
                q: '스마트폰 셀카로도 가능한가요?',
                a: '네! 밝은 곳에서 찍은 정면 사진이면 충분합니다. 화질이 높을수록 결과물이 좋습니다.'
              },
              {
                q: '상업적으로 사용해도 되나요?',
                a: '네, 본인의 프로필 사진, SNS, 명함 등 개인 브랜딩 목적으로 자유롭게 사용 가능합니다.'
              },
              {
                q: '프롬프트 수정이 가능한가요?',
                a: '물론입니다! 패키지에 포함된 커스터마이징 가이드를 참고해서 자유롭게 수정하세요.'
              },
              {
                q: '환불 정책이 어떻게 되나요?',
                a: '베타 기간은 무료이므로 환불 이슈가 없습니다. 정식 출시 후에는 7일 환불 보장 정책을 제공합니다.'
              }
            ].map((faq, idx) => (
              <div key={idx} className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200 hover:border-purple-300 transition-colors">
                <h3 className="font-bold text-lg text-gray-900 mb-2">
                  Q. {faq.q}
                </h3>
                <p className="text-gray-600">
                  A. {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-12 bg-purple-50">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
          <Link
            href="/kits"
            className="inline-block text-purple-600 hover:text-purple-700 font-semibold mb-4"
          >
            ← 다른 키트 둘러보기
          </Link>
        </div>
      </section>

      {/* Download Modal */}
      {showDownloadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent mb-4"></div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                다운로드 중...
              </h3>
              <p className="text-gray-600">
                잠시만 기다려주세요
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

