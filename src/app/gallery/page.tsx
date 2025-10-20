'use client';

import { useState } from 'react';
import Link from 'next/link';
import SimpleHeader from '@/components/SimpleHeader';
import AIImageModal from '@/components/AIImageModal';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/animations';

interface AIImage {
  id: string;
  title: string;
  description: string;
  prompt: string;
  category: string;
  price: number;
  imageUrl?: string;
  difficulty: string;
  icon: string;
  gradient: string;
}

export default function AIImageGalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedImage, setSelectedImage] = useState<AIImage | null>(null);

  const categories = [
    { id: 'all', name: '전체', icon: '🎨' },
    { id: '매거진', name: '매거진 화보', icon: '📸' },
    { id: '비즈니스', name: '비즈니스', icon: '💼' },
    { id: '럭셔리', name: '럭셔리 브랜드', icon: '💎' },
    { id: '아티스틱', name: '아티스틱', icon: '🎭' },
    { id: 'SNS', name: 'SNS 최적화', icon: '📱' }
  ];

  // AI 생성 이미지 데이터
  const aiImages: AIImage[] = [
    // 매거진 스타일
    {
      id: 'vogue-cover',
      title: 'Vogue Korea 커버',
      description: '파워풀하고 세련된 보그 스타일 화보. 고급스러운 조명과 포즈로 매거진 커버 모델 느낌을 연출합니다.',
      prompt: 'Professional magazine cover photography, Vogue Korea style, elegant Korean woman in business attire, confident pose, studio lighting, high fashion, sophisticated mood...',
      category: '매거진',
      price: 29900,
      difficulty: '중급',
      icon: '👑',
      gradient: 'from-black via-gray-800 to-gray-900'
    },
    {
      id: 'elle-editorial',
      title: 'Elle Editorial',
      description: '모던하고 트렌디한 엘르 매거진 감성. 자연스러우면서도 세련된 분위기를 표현합니다.',
      prompt: 'Elle magazine editorial style, modern Korean woman, trendy fashion, natural lighting, soft colors, contemporary mood, sophisticated pose...',
      category: '매거진',
      price: 29900,
      difficulty: '초급',
      icon: '✨',
      gradient: 'from-purple-500 via-pink-500 to-rose-500'
    },
    {
      id: 'harpers-bazaar',
      title: "Harper's Bazaar",
      description: '클래식하고 우아한 바자 스타일. 타임리스한 아름다움을 강조합니다.',
      prompt: "Harper's Bazaar photography, classic elegance, Korean woman in luxury fashion, timeless beauty, high-end studio setting...",
      category: '매거진',
      price: 29900,
      difficulty: '중급',
      icon: '💫',
      gradient: 'from-rose-600 via-pink-600 to-red-600'
    },
    {
      id: 'gq-mens',
      title: 'GQ 남성 화보',
      description: '남성 전문 매거진 스타일. 카리스마와 세련미를 동시에 표현합니다.',
      prompt: 'GQ magazine style, professional Korean businessman, sharp suit, confident expression, luxury lifestyle, modern masculinity...',
      category: '매거진',
      price: 29900,
      difficulty: '중급',
      icon: '🎩',
      gradient: 'from-slate-700 via-gray-800 to-slate-900'
    },

    // 비즈니스 프로필
    {
      id: 'linkedin-professional',
      title: 'LinkedIn 프로필',
      description: '신뢰감 있는 전문가 프로필. 경력직 이직이나 네트워킹에 완벽한 이미지입니다.',
      prompt: 'Professional LinkedIn profile photo, Korean business professional, clean background, confident smile, corporate attire, trustworthy appearance...',
      category: '비즈니스',
      price: 19900,
      difficulty: '초급',
      icon: '💼',
      gradient: 'from-blue-600 via-blue-700 to-blue-800'
    },
    {
      id: 'startup-founder',
      title: '스타트업 대표',
      description: '혁신적이고 도전적인 이미지. 투자 유치나 언론 인터뷰에 적합합니다.',
      prompt: 'Startup founder portrait, innovative Korean entrepreneur, casual yet professional, inspiring atmosphere, tech background...',
      category: '비즈니스',
      price: 24900,
      difficulty: '초급',
      icon: '🚀',
      gradient: 'from-indigo-500 via-purple-600 to-purple-700'
    },
    {
      id: 'speaker-influencer',
      title: '강연자/인플루언서',
      description: '친근하면서 권위있는 이미지. 온라인 강의나 개인 브랜딩에 최적화되어 있습니다.',
      prompt: 'Public speaker portrait, Korean influencer, approachable yet authoritative, warm lighting, engaging expression, professional setting...',
      category: '비즈니스',
      price: 24900,
      difficulty: '중급',
      icon: '🎤',
      gradient: 'from-orange-500 via-red-600 to-red-700'
    },
    {
      id: 'corporate-card',
      title: '명함/회사소개서',
      description: '격식있고 전문적인 비즈니스 컷. 임원급 명함이나 회사 소개 자료에 사용됩니다.',
      prompt: 'Corporate headshot, Korean executive, formal business suit, neutral background, professional lighting, confident posture...',
      category: '비즈니스',
      price: 19900,
      difficulty: '초급',
      icon: '📇',
      gradient: 'from-gray-700 via-gray-800 to-gray-900'
    },

    // 럭셔리 브랜드
    {
      id: 'chanel-elegant',
      title: 'Chanel 우아함',
      description: '타임리스한 샤넬 감성. 클래식한 블랙&화이트 톤으로 고급스러움을 극대화합니다.',
      prompt: 'Chanel inspired portrait, timeless elegance, Korean model, classic black and white, luxury fashion, sophisticated composition...',
      category: '럭셔리',
      price: 39900,
      difficulty: '고급',
      icon: '🖤',
      gradient: 'from-gray-900 via-black to-gray-900'
    },
    {
      id: 'dior-classic',
      title: 'Dior 클래식',
      description: '여성스럽고 세련된 디올 스타일. 부드러운 조명과 우아한 포즈가 특징입니다.',
      prompt: 'Dior classic photography, feminine elegance, Korean woman, soft lighting, luxury fashion, romantic mood, refined beauty...',
      category: '럭셔리',
      price: 39900,
      difficulty: '고급',
      icon: '🌹',
      gradient: 'from-rose-500 via-pink-600 to-pink-700'
    },
    {
      id: 'gucci-modern',
      title: 'Gucci 모던 아트',
      description: '대담하고 아티스틱한 구찌 감성. 독특한 컬러와 구도로 개성을 표현합니다.',
      prompt: 'Gucci modern art style, bold colors, artistic composition, Korean model, avant-garde fashion, creative expression, luxury brand aesthetic...',
      category: '럭셔리',
      price: 39900,
      difficulty: '고급',
      icon: '🎨',
      gradient: 'from-green-600 via-yellow-600 to-red-600'
    },
    {
      id: 'hermes-minimal',
      title: 'Hermès 미니멀',
      description: '절제된 럭셔리 에르메스 스타일. 심플함 속의 최고급 품격을 담아냅니다.',
      prompt: 'Hermès minimalist style, understated luxury, Korean model, clean lines, neutral tones, refined simplicity, premium quality...',
      category: '럭셔리',
      price: 39900,
      difficulty: '고급',
      icon: '🧡',
      gradient: 'from-orange-600 via-orange-700 to-orange-800'
    },

    // 아티스틱
    {
      id: 'bw-film',
      title: '흑백 필름 사진',
      description: '감성적인 흑백 필름 무드. 빈티지 필름 카메라로 찍은 듯한 아날로그 감성을 표현합니다.',
      prompt: 'Black and white film photography, Korean subject, analog film grain, vintage mood, high contrast, timeless aesthetic, artistic composition...',
      category: '아티스틱',
      price: 24900,
      difficulty: '중급',
      icon: '⚫',
      gradient: 'from-gray-500 via-gray-600 to-gray-700'
    },
    {
      id: 'vintage-retro',
      title: '빈티지 레트로',
      description: '1970-90년대 빈티지 감성. 따뜻한 필름 톤과 레트로 분위기가 매력적입니다.',
      prompt: 'Vintage retro photography, 1980s aesthetic, Korean subject, film grain, warm color tones, nostalgic mood, retro fashion...',
      category: '아티스틱',
      price: 24900,
      difficulty: '중급',
      icon: '📻',
      gradient: 'from-amber-600 via-yellow-600 to-yellow-700'
    },
    {
      id: 'cyberpunk-neon',
      title: '네온 사이버펑크',
      description: '미래적이고 강렬한 네온 스타일. SF 영화 같은 분위기를 연출합니다.',
      prompt: 'Cyberpunk neon portrait, Korean subject, vibrant neon lights, futuristic cityscape, purple and cyan colors, sci-fi aesthetic, night scene...',
      category: '아티스틱',
      price: 34900,
      difficulty: '고급',
      icon: '🌃',
      gradient: 'from-cyan-500 via-purple-600 to-pink-600'
    },
    {
      id: 'movie-still',
      title: '감성 무비 스틸컷',
      description: '영화 속 주인공 같은 무드. 시네마틱한 조명과 구도로 드라마틱한 느낌을 줍니다.',
      prompt: 'Cinematic movie still, Korean actor/actress, dramatic lighting, film grain, emotional expression, storytelling composition, professional cinematography...',
      category: '아티스틱',
      price: 29900,
      difficulty: '중급',
      icon: '🎬',
      gradient: 'from-blue-700 via-indigo-800 to-indigo-900'
    },

    // SNS 최적화
    {
      id: 'instagram-feed',
      title: '인스타그램 피드',
      description: '감각적인 인스타 피드용. 밝고 깔끔한 톤으로 좋아요와 팔로워를 늘려보세요.',
      prompt: 'Instagram feed aesthetic, Korean influencer, bright and clean, natural lighting, trendy pose, social media optimized, engaging composition...',
      category: 'SNS',
      price: 14900,
      difficulty: '초급',
      icon: '📸',
      gradient: 'from-pink-400 via-rose-500 to-rose-600'
    },
    {
      id: 'tiktok-thumbnail',
      title: '틱톡 썸네일',
      description: '눈길을 끄는 틱톡 스타일. 생동감 있고 친근한 이미지로 클릭률을 높입니다.',
      prompt: 'TikTok thumbnail style, Korean creator, energetic expression, vibrant colors, eye-catching composition, social media friendly, dynamic pose...',
      category: 'SNS',
      price: 14900,
      difficulty: '초급',
      icon: '🎵',
      gradient: 'from-cyan-400 via-blue-500 to-pink-500'
    },
    {
      id: 'youtube-profile',
      title: '유튜브 프로필',
      description: '친근한 유튜버 프로필. 구독자와의 신뢰를 쌓는 따뜻한 이미지입니다.',
      prompt: 'YouTube profile picture, Korean YouTuber, friendly smile, approachable expression, bright background, trustworthy appearance, engaging look...',
      category: 'SNS',
      price: 14900,
      difficulty: '초급',
      icon: '▶️',
      gradient: 'from-red-600 via-red-700 to-red-800'
    },
    {
      id: 'twitter-header',
      title: '트위터 헤더',
      description: '임팩트 있는 헤더 이미지. 개성을 강조하는 와이드 구도로 디자인되었습니다.',
      prompt: 'Twitter header image, Korean professional, wide composition, impactful design, personal branding, professional yet creative, social media optimized...',
      category: 'SNS',
      price: 14900,
      difficulty: '초급',
      icon: '🐦',
      gradient: 'from-blue-400 via-blue-500 to-blue-600'
    }
  ];

  const filteredImages = selectedCategory === 'all' 
    ? aiImages 
    : aiImages.filter(img => img.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-purple-50/30 to-white">
      <SimpleHeader />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <FadeIn>
            <div className="text-center">
              <div className="inline-block mb-4">
                <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold">
                  ✨ AI 화보 결과물 갤러리
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 break-keep">
                🎨 내 얼굴로 만드는<br />AI 프로필 화보
              </h1>
              <p className="text-xl md:text-2xl opacity-90 mb-4 break-keep">
                5분 만에 프로 스튜디오급 결과물
              </p>
              <p className="text-lg opacity-80 break-keep">
                원하는 스타일을 선택하고 &quot;이렇게 만들기&quot;를 눌러보세요
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <StaggerContainer staggerDelay={0.1} className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <StaggerItem>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">20+</div>
                <div className="text-gray-600">스타일 컨셉</div>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="text-center">
                <div className="text-4xl font-bold text-pink-600 mb-2">5분</div>
                <div className="text-gray-600">평균 제작시간</div>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="text-center">
                <div className="text-4xl font-bold text-rose-600 mb-2">4.9★</div>
                <div className="text-gray-600">평균 만족도</div>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-600 mb-2">₩14,900~</div>
                <div className="text-gray-600">시작 가격</div>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16 bg-gradient-to-b from-white to-purple-50/50">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900">
              📸 AI 화보 스타일 선택하기
            </h2>
            <p className="text-center text-gray-600 mb-8">
              카드를 클릭하면 상세 정보와 &quot;이렇게 만들기&quot; 버튼이 나타납니다
            </p>
          </FadeIn>

          {/* Category Filter */}
          <div className="mb-12">
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-6 py-3 rounded-full font-semibold transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 hover:border-purple-300'
                  }`}
                >
                  {cat.icon} {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Images Grid */}
          <StaggerContainer staggerDelay={0.08} className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredImages.map((image) => (
              <StaggerItem key={image.id}>
                <div 
                  onClick={() => setSelectedImage(image)}
                  className="group cursor-pointer"
                >
                  <div className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all overflow-hidden border-2 border-gray-100 hover:border-purple-300 hover:scale-[1.02]">
                    {/* 이미지 영역 */}
                    <div className={`aspect-[3/4] bg-gradient-to-br ${image.gradient} relative overflow-hidden`}>
                      {image.imageUrl ? (
                        <img 
                          src={image.imageUrl} 
                          alt={image.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-6xl">
                          {image.icon}
                        </div>
                      )}
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                          <div className="bg-white text-purple-600 px-6 py-3 rounded-full font-bold shadow-lg">
                            자세히 보기 →
                          </div>
                        </div>
                      </div>

                      {/* 가격 배지 */}
                      <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full">
                        <span className="text-sm font-bold text-purple-600">
                          ₩{(image.price / 1000).toFixed(0)}K
                        </span>
                      </div>

                      {/* 난이도 배지 */}
                      <div className="absolute top-3 left-3">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                          image.difficulty === '초급' ? 'bg-green-500 text-white' :
                          image.difficulty === '중급' ? 'bg-yellow-500 text-white' :
                          'bg-red-500 text-white'
                        }`}>
                          {image.difficulty}
                        </span>
                      </div>
                    </div>

                    {/* 정보 영역 */}
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full font-semibold">
                          {image.category}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                        {image.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {image.description}
                      </p>
                      
                      {/* CTA 힌트 */}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>클릭하여 구매하기</span>
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center text-white">
          <FadeIn>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 break-keep">
              아직도 스튜디오 예약하시나요?
            </h2>
            <p className="text-xl mb-8 opacity-90 break-keep">
              AI로 5분 만에 프로급 화보 완성 • 무제한 재촬영 가능
            </p>
            <Link
              href="/kits/ai-portrait"
              className="inline-block bg-white text-purple-600 px-12 py-5 rounded-full font-bold text-xl hover:shadow-2xl hover:scale-105 transition-all"
            >
              🎨 전체 패키지 보기
            </Link>
            <p className="mt-6 text-sm opacity-80">
              20가지 스타일 • 60개 결과물 • 영상 가이드 포함
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Footer Link */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
          <Link
            href="/"
            className="inline-block text-purple-600 hover:text-purple-700 font-semibold"
          >
            ← 홈으로 돌아가기
          </Link>
        </div>
      </section>

      {/* Modal */}
      {selectedImage && (
        <AIImageModal
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          image={selectedImage}
        />
      )}
    </div>
  );
}

