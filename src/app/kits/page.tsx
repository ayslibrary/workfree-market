'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, onSnapshot, QueryDocumentSnapshot, DocumentData, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import MainNavigation from '@/components/MainNavigation';

interface Kit {
  id: string;
  title: string;
  job: string;
  tools: string[];
  problem: string;
  expectedFeature: string;
  maker: string;
  status: string;
  createdAt: Timestamp | string;
  downloadUrl?: string;
  rating?: number;
  downloads?: number;
  category?: string;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
}

export default function KitsPage() {
  const [kits, setKits] = useState<Kit[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTesterModal, setShowTesterModal] = useState(false);
  const [selectedKit, setSelectedKit] = useState<Kit | null>(null);
  const [testerEmail, setTesterEmail] = useState('');
  const [testerName, setTesterName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // 카테고리 정의
  const categories: Category[] = [
    {
      id: 'all',
      name: '전체',
      icon: '📦',
      description: '모든 자동화 키트',
      color: 'gray'
    },
    {
      id: 'microsoft',
      name: 'Microsoft Office',
      icon: '🏢',
      description: 'Excel, Outlook, Word, PPT',
      color: 'blue'
    },
    {
      id: 'ai-prompts',
      name: 'AI 프롬프트',
      icon: '🤖',
      description: 'ChatGPT, Gemini, Sora2',
      color: 'purple'
    },
    {
      id: 'automation-tools',
      name: '업무 자동화',
      icon: '⚙️',
      description: 'Python, 파일관리, 스케줄링',
      color: 'green'
    },
    {
      id: 'cloud-collab',
      name: '클라우드 & 협업',
      icon: '☁️',
      description: 'Google, Slack, Notion',
      color: 'cyan'
    },
    {
      id: 'marketing-design',
      name: '마케팅 & 디자인',
      icon: '🎨',
      description: 'SNS, Canva, 이미지',
      color: 'pink'
    }
  ];

  // 필터링된 키트
  const filteredKits = selectedCategory === 'all' 
    ? kits 
    : kits.filter(kit => kit.category === selectedCategory);

  useEffect(() => {
    if (!db) {
      console.error('Firebase가 초기화되지 않았습니다.');
      setLoading(false);
      return;
    }

    // 출시완료된 키트만 조회
    const kitsRef = collection(db, 'requests');
    const q = query(
      kitsRef, 
      where('status', '==', '출시완료'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const kitsData: Kit[] = [];
      snapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
        kitsData.push({
          id: doc.id,
          ...doc.data()
        } as Kit);
      });
      setKits(kitsData);
      setLoading(false);
    }, (error) => {
      console.error('키트 조회 오류:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleTesterApply = (kit: Kit) => {
    setSelectedKit(kit);
    setShowTesterModal(true);
  };

  const handleTesterSubmit = async () => {
    if (!testerEmail.trim() || !testerName.trim()) {
      alert('이름과 이메일을 입력해주세요!');
      return;
    }

    if (!selectedKit) return;

    setIsSubmitting(true);

    try {
      const testerData = {
        kitId: selectedKit.id,
        kitTitle: selectedKit.title,
        testerName,
        testerEmail,
        status: '대기',
        points: 0,
        createdAt: new Date().toISOString()
      };

      // Firebase 설정되어 있으면 Firestore에 저장
      if (db) {
        await addDoc(collection(db, 'testers'), {
          ...testerData,
          createdAt: serverTimestamp()
        });
        console.log('✅ Firestore 저장 성공!');
      } else {
        console.log('⚠️ Firebase 미설정 - 임시 모드');
        // localStorage 저장
        const testers = JSON.parse(localStorage.getItem('testers') || '[]');
        testers.push({ id: Date.now().toString(), ...testerData });
        localStorage.setItem('testers', JSON.stringify(testers));
      }

      alert('✅ 테스터 신청이 완료되었습니다!\n이메일로 테스트 링크를 보내드립니다.');
      setShowTesterModal(false);
      setTesterEmail('');
      setTesterName('');
      setSelectedKit(null);
    } catch (error) {
      console.error('테스터 신청 오류:', error);
      alert('❌ 신청에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f0ff]">
      <MainNavigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 via-[#6A5CFF] to-indigo-600 text-white pt-24 md:pt-20 pb-12 md:pb-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 break-keep">
            ⚡ WorkFree 자동화 키트
          </h1>
          <p className="text-lg md:text-xl opacity-90 break-keep">
            퇴근 시간을 앞당기는 업무 자동화 솔루션
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Beta Notice */}
        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 mb-12">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎁</span>
            <div>
              <p className="text-sm text-blue-800">
                <span className="font-bold">베타 기간 무료!</span> 피드백 남기면 정식 출시 시 <span className="font-semibold">50% 할인 쿠폰</span> 
                <Link href="/feedback" className="ml-2 text-blue-600 hover:underline font-semibold">
                  피드백 남기기 →
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* 🎯 베타 서비스 - 지금 바로 사용 가능 */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <span className="inline-block bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-2 rounded-full text-sm font-bold mb-4 animate-pulse">
              🎁 베타 기간 무료!
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1E1B33] mb-3">
              지금 바로 사용 가능
            </h2>
            <p className="text-[#1E1B33]/70 text-lg">
              NEW 서비스 4개를 먼저 만나보세요
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* 1. AI 블로그 자동 생성기 */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-purple-200 hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1.5 rounded-full text-xs font-bold animate-pulse">
                  ✨ NEW!
                </span>
                <span className="bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-bold">
                  🎁 Beta 무료
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-center mb-3 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                AI 블로그 자동 생성기
              </h3>
              
              <p className="text-center text-sm text-gray-600 mb-4">
                키워드만 입력하면 완성도 높은 블로그 글이 즉시!
              </p>
              
              <div className="space-y-2 mb-4 text-xs">
                <div className="bg-purple-50 rounded-lg p-2 border border-purple-200">
                  ⚡ 3가지 블로그 스타일 (기본/SEO/마케팅)
                </div>
                <div className="bg-blue-50 rounded-lg p-2 border border-blue-200">
                  🌐 HTML 미리보기 & 바로 복붙
                </div>
              </div>
              
              <Link
                href="/tools/blog-generator"
                className="block w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-xl font-bold text-center transition-all hover:scale-105"
              >
                ✍️ 블로그 생성 시작 →
              </Link>
            </div>

            {/* 2. WorkFree 이미지 파인더 */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-200 hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1.5 rounded-full text-xs font-bold animate-pulse">
                  ✨ NEW!
                </span>
                <span className="bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-bold">
                  🎁 Beta 무료
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-center mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                WorkFree 이미지 파인더
              </h3>
              
              <p className="text-center text-sm text-gray-600 mb-4">
                합법적 고품질 이미지, 3개 API에서 한 번에 검색
              </p>
              
              <div className="space-y-2 mb-4 text-xs">
                <div className="bg-blue-50 rounded-lg p-2 border border-blue-200">
                  🌍 3개 소스 통합 (Unsplash + Pexels + Pixabay)
                </div>
                <div className="bg-purple-50 rounded-lg p-2 border border-purple-200">
                  ⚡ 최대 50장 검색 & 상업적 이용 가능
                </div>
              </div>
              
              <Link
                href="/tools/image-finder"
                className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl font-bold text-center transition-all hover:scale-105"
              >
                📸 이미지 검색 시작 →
              </Link>
            </div>

            {/* 3. AI 화보 메이커 */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-pink-200 hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="bg-gradient-to-r from-pink-600 to-rose-600 text-white px-3 py-1.5 rounded-full text-xs font-bold animate-pulse">
                  ✨ NEW!
                </span>
                <span className="bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-bold">
                  🎁 Beta 무료
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-center mb-3 bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                AI 화보 메이커
              </h3>
              
              <p className="text-center text-sm text-gray-600 mb-4">
                한 장의 사진으로 만드는 20가지 스타일 화보
              </p>
              
              <div className="space-y-2 mb-4 text-xs">
                <div className="bg-pink-50 rounded-lg p-2 border border-pink-200">
                  📷 20개 컨셉 (Vogue/Retro/Linkedin 등)
                </div>
                <div className="bg-blue-50 rounded-lg p-2 border border-blue-200">
                  ⚡ Gemini AI 프롬프트로 즉시 생성
                </div>
              </div>
              
              <Link
                href="/gallery"
                className="block w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white py-3 rounded-xl font-bold text-center transition-all hover:scale-105"
              >
                🎨 화보 갤러리 보기 →
              </Link>
            </div>
          </div>
        </div>

        {/* 카테고리 카드 그리드 */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {/* Microsoft 사무자동화 */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 border-2 border-blue-200 hover:shadow-2xl transition-all hover:-translate-y-2 cursor-pointer group">
            <div className="flex items-start gap-4 mb-4">
              <div className="text-6xl">📊</div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-[#1E1B33] mb-2">
                  Microsoft 사무자동화
                </h3>
                <p className="text-[#1E1B33]/70 mb-4">
                  Excel, Outlook, PPT 등 오피스 업무를 완전 자동화
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                    Outlook 자동회신
                  </span>
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                    Excel 보고서
                  </span>
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                    PPT 자동화
                  </span>
                </div>
                <Link
                  href="/automation/microsoft"
                  className="text-blue-600 font-semibold hover:underline inline-flex items-center gap-2 group-hover:gap-3 transition-all"
                >
                  6개 키트 보기 →
                </Link>
              </div>
            </div>
          </div>

          {/* 웹 크롤링 */}
          <div className="bg-gradient-to-br from-cyan-50 to-teal-50 rounded-3xl p-8 border-2 border-cyan-200 hover:shadow-2xl transition-all hover:-translate-y-2 cursor-pointer group">
            <div className="flex items-start gap-4 mb-4">
              <div className="text-6xl">🕷️</div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-[#1E1B33] mb-2">
                  웹 크롤링
                </h3>
                <p className="text-[#1E1B33]/70 mb-4">
                  검색부터 수집, 알림까지 웹 데이터 완전 자동화
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-cyan-100 text-cyan-700 px-3 py-1 rounded-full text-xs font-semibold">
                    검색 자동화
                  </span>
                  <span className="bg-cyan-100 text-cyan-700 px-3 py-1 rounded-full text-xs font-semibold">
                    뉴스 수집
                  </span>
                  <span className="bg-cyan-100 text-cyan-700 px-3 py-1 rounded-full text-xs font-semibold">
                    가격 모니터링
                  </span>
                </div>
                <Link
                  href="/automation/crawling"
                  className="text-cyan-600 font-semibold hover:underline inline-flex items-center gap-2 group-hover:gap-3 transition-all"
                >
                  6개 키트 보기 →
                </Link>
              </div>
            </div>
          </div>

          {/* 데이터 시각화 */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 border-2 border-purple-200 hover:shadow-2xl transition-all hover:-translate-y-2 cursor-pointer group">
            <div className="flex items-start gap-4 mb-4">
              <div className="text-6xl">📈</div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-[#1E1B33] mb-2">
                  데이터 시각화
                </h3>
                <p className="text-[#1E1B33]/70 mb-4">
                  엑셀 데이터를 맞진 대시보드로 자동 변환
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">
                    차트 생성
                  </span>
                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">
                    대시보드
                  </span>
                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">
                    리포트 자동화
                  </span>
                </div>
                <Link
                  href="/automation/visualization"
                  className="text-purple-600 font-semibold hover:underline inline-flex items-center gap-2 group-hover:gap-3 transition-all"
                >
                  6개 키트 보기 →
                </Link>
              </div>
            </div>
          </div>

          {/* AI 프롬프트 */}
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-3xl p-8 border-2 border-orange-200 hover:shadow-2xl transition-all hover:-translate-y-2 cursor-pointer group">
            <div className="flex items-start gap-4 mb-4">
              <div className="text-6xl">🤖</div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-[#1E1B33] mb-2">
                  AI 프롬프트
                </h3>
                <p className="text-[#1E1B33]/70 mb-4">
                  영상, 이미지, 카피까지 AI로 콘텐츠 제작 자동화
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-semibold">
                    블로그 생성
                  </span>
                  <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-semibold">
                    이미지 생성
                  </span>
                  <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-semibold">
                    영상 스크립트
                  </span>
                </div>
                <Link
                  href="/automation/prompts"
                  className="text-orange-600 font-semibold hover:underline inline-flex items-center gap-2 group-hover:gap-3 transition-all"
                >
                  6개 키트 보기 →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 전체 키트 섹션 (기존 코드) */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-[#1E1B33] mb-2">
            🔥 인기 자동화 키트
          </h2>
          <p className="text-[#1E1B33]/70 mb-8">
            실무에 바로 적용 가능한 검증된 자동화 솔루션
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#6A5CFF] border-t-transparent"></div>
            <p className="mt-4 text-[#1E1B33]/70">키트를 불러오는 중...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && kits.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border-2 border-[#AFA6FF]/50">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-[#1E1B33] mb-2">
              아직 출시된 키트가 없습니다
            </h3>
            <p className="text-[#1E1B33]/70 mb-6">
              첫 번째 자동화 키트를 기다리고 있습니다!
            </p>
            <Link
              href="/requests"
              className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all"
            >
              요청 리스트 보기
            </Link>
          </div>
        )}

        {/* Kits Grid */}
        {!loading && kits.length > 0 && (
          <>
            {filteredKits.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl shadow-sm border-2 border-[#AFA6FF]/50">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-[#1E1B33] mb-2">
                  해당 카테고리에 키트가 없습니다
                </h3>
                <p className="text-[#1E1B33]/70 mb-6">
                  다른 카테고리를 선택해보세요
                </p>
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all"
                >
                  전체 보기
                </button>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-[#1E1B33] mb-2">
                    🚀 자동화 키트
                  </h2>
                  <p className="text-[#1E1B33]/70">
                    실무에 바로 적용 가능한 검증된 자동화 솔루션
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredKits.map((kit) => (
                <div
                  key={kit.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 border-2 border-[#AFA6FF]/50 hover:border-[#6A5CFF]"
                >
                  {/* Kit Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-[#1E1B33] mb-2 line-clamp-2">
                        {kit.title}
                      </h3>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-semibold">
                          ✅ 출시완료
                        </span>
                        {kit.rating && (
                          <span className="text-sm text-yellow-600 font-semibold">
                            ⭐ {kit.rating.toFixed(1)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Maker & Job */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 text-sm text-[#1E1B33]/70 mb-2">
                      <span className="font-semibold">👤 제작자:</span>
                      <span>{kit.maker}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs bg-[#f5f0ff] text-[#6A5CFF] px-2 py-1 rounded font-semibold">
                        💼 {kit.job}
                      </span>
                      {kit.tools.slice(0, 3).map((tool, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded"
                        >
                          {tool}
                        </span>
                      ))}
                      {kit.tools.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{kit.tools.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-[#1E1B33]/70 mb-4 line-clamp-3">
                    {kit.problem}
                  </p>

                  {/* Stats */}
                  {kit.downloads && (
                    <div className="flex items-center gap-4 text-sm text-[#1E1B33]/50 mb-4">
                      <span>📥 {kit.downloads} 다운로드</span>
                    </div>
                  )}

                  {/* Download & Tester Buttons */}
                  <div className="flex gap-2">
                    <a
                      href={kit.downloadUrl || '/downloads/rpa-test.txt'}
                      download
                      className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg hover:shadow-lg transition-all font-semibold text-center"
                    >
                      💾 다운로드
                    </a>
                    <button
                      onClick={() => handleTesterApply(kit)}
                      className="px-4 bg-purple-100 text-purple-700 py-3 rounded-lg hover:bg-purple-200 transition-all font-semibold"
                    >
                      🧪
                    </button>
                  </div>
                </div>
              ))}
                </div>
              </>
            )}
          </>
        )}
      </main>

      {/* Tester Application Modal */}
      {showTesterModal && selectedKit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              🧪 테스터 신청
            </h2>
            <p className="text-gray-600 mb-2">
              <span className="font-semibold">{selectedKit.title}</span>
            </p>
            <p className="text-sm text-gray-500 mb-6">
              베타 테스터로 참여하시면 피드백 후 특별 혜택을 드립니다!
            </p>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  이름 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={testerName}
                  onChange={(e) => setTesterName(e.target.value)}
                  placeholder="홍길동"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  이메일 <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={testerEmail}
                  onChange={(e) => setTesterEmail(e.target.value)}
                  placeholder="example@email.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={isSubmitting}
                />
                <p className="text-xs text-gray-500 mt-2">
                  테스트 링크를 이메일로 보내드립니다
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowTesterModal(false);
                  setTesterEmail('');
                  setTesterName('');
                  setSelectedKit(null);
                }}
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium disabled:opacity-50"
              >
                취소
              </button>
              <button
                onClick={handleTesterSubmit}
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all font-medium disabled:opacity-50"
              >
                {isSubmitting ? '신청 중...' : '🧪 신청하기'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

