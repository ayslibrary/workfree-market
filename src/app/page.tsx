"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { signOut, db } from "@/lib/firebase";
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import KitOptionsModal from "@/components/KitOptionsModal";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations";

export default function Home() {
  const { user, isLoading } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [betaCount, setBetaCount] = useState<number>(0);
  const [isBetaFull, setIsBetaFull] = useState<boolean>(false);
  const [isCountLoading, setIsCountLoading] = useState<boolean>(true);

  // 베타 참여 인원 수 가져오기
  const getBetaCount = async () => {
    if (!db) return 0;
    try {
      const snapshot = await getDocs(collection(db, "beta_testers"));
      return snapshot.size;
    } catch (error) {
      console.error("베타 인원 조회 오류:", error);
      return 0;
    }
  };

  // 페이지 로드 시 베타 인원 수 조회
  useEffect(() => {
    const fetchBetaCount = async () => {
      setIsCountLoading(true);
      const count = await getBetaCount();
      setBetaCount(count);
      setIsBetaFull(count >= 100);
      setIsCountLoading(false);
    };

    fetchBetaCount();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
    setShowMobileMenu(false);
  };

  const handleSignOut = async () => {
    await signOut();
    setShowUserMenu(false);
  };

  // 베타 신청 핸들러
  const handleBetaSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // 100명 체크
    if (isBetaFull) {
      alert("🚫 베타테스트 신청이 마감되었습니다.\n정식 버전 런칭 시 이메일로 안내드릴게요!");
      return;
    }

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const task = formData.get('task') as string;

    try {
      // 다시 한번 현재 인원 확인 (동시 접속 방지)
      const currentCount = await getBetaCount();
      if (currentCount >= 100) {
        alert("🚫 베타테스트 신청이 마감되었습니다.\n정식 버전 런칭 시 이메일로 안내드릴게요!");
        setIsBetaFull(true);
        setBetaCount(currentCount);
        return;
      }

      // Firestore에 저장
      if (db) {
        await addDoc(collection(db, "beta_testers"), {
          email,
          task,
          created_at: serverTimestamp(),
          status: 'pending' // 회원가입 전
        });
      }

      // 카운터 업데이트
      const newCount = currentCount + 1;
      setBetaCount(newCount);
      if (newCount >= 100) {
        setIsBetaFull(true);
      }

      // sessionStorage에 저장하고 회원가입 페이지로 이동
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('beta_signup', JSON.stringify({ email, task }));
        alert(`✅ 신청 완료! 현재 ${newCount}/100명이 참여 중입니다.\n\n회원가입 후 바로 다운로드하실 수 있습니다.`);
        window.location.href = '/signup';
      }
    } catch (error) {
      console.error("베타 신청 오류:", error);
      alert("⚠️ 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* 네비게이션 */}
      <nav className="fixed top-0 w-full bg-white/95 dark:bg-gray-950/95 backdrop-blur-lg z-50 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-xl font-bold">W</span>
              </div>
              <div>
                <div className="text-xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  WorkFree Market
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                  실무 자동화 키트 거래소
                </div>
              </div>
            </Link>

            {/* 데스크톱 메뉴 */}
            <div className="hidden md:flex gap-8 items-center">
              <Link
                href="/about"
                className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium text-[16px]"
              >
                소개
              </Link>
              <button
                onClick={() => scrollToSection("kits")}
                className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium text-[16px]"
              >
                자동화 키트
              </button>
              <button
                onClick={() => scrollToSection("how-it-works")}
                className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium text-[16px]"
              >
                작동방식
              </button>
              <Link
                href="/pricing"
                className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium text-[16px]"
              >
                요금제
              </Link>
              <button
                onClick={() => scrollToSection("seller")}
                className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium text-[16px]"
              >
                판매자 되기
              </button>
              
              {!isLoading && (
                <>
                  {user ? (
                    <div className="relative">
                      <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-5 py-2.5 rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all text-[16px]"
                      >
                        <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                          <span className="text-sm">{user.displayName[0]}</span>
                        </div>
                        <span>{user.displayName}</span>
                      </button>
                      
                      {showUserMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                          <Link
                            href="/my/purchases"
                            className="block px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors text-[16px]"
                          >
                            구매 내역
                          </Link>
                          <Link
                            href="/seller/dashboard"
                            className="block px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors text-[16px]"
                          >
                            판매자 대시보드
                          </Link>
                          <Link
                            href="/my/settings"
                            className="block px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors text-[16px]"
                          >
                            설정
                          </Link>
                          <hr className="my-2 border-gray-200 dark:border-gray-700" />
                          <button
                            onClick={handleSignOut}
                            className="w-full text-left px-4 py-2.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-[16px]"
                          >
                            로그아웃
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href="/login"
                      className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-6 py-2.5 rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all inline-block text-[16px]"
                    >
                      로그인
                    </Link>
                  )}
                </>
              )}
            </div>

            {/* 모바일 햄버거 메뉴 */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 text-gray-700 dark:text-gray-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {showMobileMenu ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* 모바일 메뉴 드롭다운 */}
          {showMobileMenu && (
            <div className="md:hidden mt-4 pb-4 border-t border-gray-200 dark:border-gray-800 pt-4">
              <div className="flex flex-col gap-3">
                <Link
                  href="/about"
                  className="text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                >
                  소개
                </Link>
                <button
                  onClick={() => scrollToSection("kits")}
                  className="text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                >
                  자동화 키트
                </button>
                <button
                  onClick={() => scrollToSection("how-it-works")}
                  className="text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                >
                  작동방식
                </button>
                <Link
                  href="/pricing"
                  className="text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  요금제
                </Link>
                <button
                  onClick={() => scrollToSection("seller")}
                  className="text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                >
                  판매자 되기
                </button>
                {!isLoading && !user && (
                  <Link
                    href="/login"
                    className="mt-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-6 py-3 rounded-full font-semibold text-center"
                  >
                    로그인
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero 섹션 - 개선 */}
      <section className="pt-32 pb-24 px-6 min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-950 dark:via-indigo-950/30 dark:to-purple-950/30 relative overflow-hidden">
        {/* 배경 패턴 */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(99 102 241) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="container mx-auto text-center max-w-6xl relative z-10">
          <FadeIn delay={0.1}>
            <div className="inline-block mb-6 animate-bounce">
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2 rounded-full text-sm font-semibold shadow-lg">
                💾 즉시다운로드 마켓플레이스
              </span>
            </div>
          </FadeIn>
          
          <FadeIn delay={0.2} duration={0.8}>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                직장인 2,930만명이<br />&apos;자동화 제작자&apos;가 되는 시대
              </span>
            </h1>
          </FadeIn>
          
          <FadeIn delay={0.4}>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed italic">
              — WorkFree: Work Less, Create More.
            </p>
          </FadeIn>
          
          {/* CTA 버튼 2개 */}
          <FadeIn delay={0.6}>
            <div className="flex gap-4 justify-center flex-wrap mb-16">
              <button
                onClick={() => scrollToSection("kits")}
                className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-12 py-5 rounded-full font-bold text-xl hover:shadow-2xl hover:scale-105 transition-all"
              >
                내 업무 자동화 시작 →
              </button>
              <button
                onClick={() => scrollToSection("seller")}
                className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-10 py-5 rounded-full font-bold text-lg hover:shadow-xl hover:scale-105 transition-all border-2 border-indigo-200 dark:border-indigo-800"
              >
                판매자 시작하기
              </button>
            </div>
          </FadeIn>
          
          {/* 통계 */}
          <StaggerContainer staggerDelay={0.15} className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <StaggerItem>
              <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-6 rounded-2xl border border-indigo-100 dark:border-indigo-900 hover:scale-105 transition-transform">
                <div className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  1,200+
                </div>
                <div className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                  자동화 키트
                </div>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-6 rounded-2xl border border-purple-100 dark:border-purple-900 hover:scale-105 transition-transform">
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  8,500+
                </div>
                <div className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                  다운로드
                </div>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-6 rounded-2xl border border-pink-100 dark:border-pink-900 hover:scale-105 transition-transform">
                <div className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-2">
                  4.8★
                </div>
                <div className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                  평균 평점
                </div>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-6 rounded-2xl border border-green-100 dark:border-green-900 hover:scale-105 transition-transform">
                <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                  5분
                </div>
                <div className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                  평균 설치시간
                </div>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* 홍보 영상 섹션 */}
      <section className="py-20 px-6 bg-white dark:bg-gray-950">
        <div className="container mx-auto max-w-6xl">
          <FadeIn>
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-gray-900 dark:text-white">
              WorkFree를 영상으로 만나보세요
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-300 mb-12 text-lg">
              직장인의 반복 업무를 자동화하는 WorkFree의 모든 것
            </p>
          </FadeIn>
          
          <FadeIn delay={0.2}>
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-indigo-100 dark:border-indigo-900 mx-auto max-w-5xl">
              <video
                className="w-full h-auto"
                autoPlay
                muted
                loop
                playsInline
                controls
              >
                <source src="/videos/watermarked-691240b2-610f-42b0-a476-0e148e0a813b.mp4" type="video/mp4" />
                브라우저가 비디오 태그를 지원하지 않습니다.
              </video>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 작동 방식 섹션 */}
      <section id="how-it-works" className="py-24 px-6 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto max-w-6xl">
          <FadeIn>
            <h2 className="text-5xl md:text-6xl font-bold text-center mb-6 text-gray-900 dark:text-white">
              간단한 3단계
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-300 mb-20 text-lg">
              복잡한 커스터마이징 없이, 바로 쓸 수 있는 완성품만 거래합니다
            </p>
          </FadeIn>
          
          <StaggerContainer staggerDelay={0.15} className="grid md:grid-cols-3 gap-8 mb-20">
            <StaggerItem>
              <div className="relative group">
                <div className="bg-white dark:bg-gray-800 p-10 rounded-3xl text-center border-2 border-indigo-100 dark:border-indigo-900 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all hover:-translate-y-2 hover:shadow-2xl">
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform">
                    <span className="text-white text-4xl font-bold">1</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                    키트 선택
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-[17px]">
                    필요한 자동화 키트를 검색하고 미리보기로 기능을 확인하세요
                  </p>
                </div>
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-8 z-10">
                  <svg className="w-full h-full text-indigo-300 dark:text-indigo-700" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="relative group">
                <div className="bg-white dark:bg-gray-800 p-10 rounded-3xl text-center border-2 border-purple-100 dark:border-purple-900 hover:border-purple-300 dark:hover:border-purple-700 transition-all hover:-translate-y-2 hover:shadow-2xl">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform">
                    <span className="text-white text-4xl font-bold">2</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                    즉시 결제
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-[17px]">
                    간편 결제로 5초 안에 구매 완료. 복잡한 견적 요청 불필요
                  </p>
                </div>
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-8 z-10">
                  <svg className="w-full h-full text-purple-300 dark:text-purple-700" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="group">
                <div className="bg-white dark:bg-gray-800 p-10 rounded-3xl text-center border-2 border-pink-100 dark:border-pink-900 hover:border-pink-300 dark:hover:border-pink-700 transition-all hover:-translate-y-2 hover:shadow-2xl">
                  <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform">
                    <span className="text-white text-4xl font-bold">3</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                    즉시 다운로드
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-[17px]">
                    바로 사용 가능한 파일과 설치 가이드를 받고 자동화를 시작하세요
                  </p>
                </div>
              </div>
            </StaggerItem>
          </StaggerContainer>

          {/* 핵심 메시지 */}
          <FadeIn delay={0.2}>
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-10 md:p-14 rounded-3xl text-center text-white shadow-2xl">
              <p className="text-3xl md:text-4xl font-bold mb-4">
                &quot;판매자는 대화하지 않는다. 결과물만 말한다.&quot;
              </p>
              <p className="text-lg opacity-90">
                커스터마이징 요청 없음 | 완성된 키트만 거래 | 다운로드 후 거래 종료
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 무료 자동화 키트 섹션 */}
      <section id="kits" className="py-24 px-6 bg-white dark:bg-gray-950">
        <div className="container mx-auto max-w-7xl">
          <FadeIn>
            <div className="text-center mb-6">
              <span className="inline-block bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-2 rounded-full text-sm font-bold mb-6">
                🎁 무료 제공
              </span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-center mb-6 text-gray-900 dark:text-white">
              무료 자동화 키트
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-300 mb-20 text-lg">
              지금 바로 다운로드해서 사용해보세요. 완전 무료입니다!
            </p>
          </FadeIn>

          <StaggerContainer staggerDelay={0.15} className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* 키트 1 - Outlook AutoResponder */}
            <StaggerItem>
              <div className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-3 border-2 border-green-200 dark:border-green-900 group">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 h-56 flex items-center justify-center relative">
                <svg className="w-24 h-24 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                  🎁 무료
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-semibold">
                    메일자동화
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">.bas 파일</span>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                  Outlook AutoResponder Kit
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed text-[16px]">
                  특정 메일 조건 시 자동회신 + PDF첨부. HTML 메일 템플릿 포함
                </p>
                <div className="mb-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <div>📦 .bas 파일 + HTML 템플릿</div>
                    <div>🎥 5분 설치 영상 가이드</div>
                  </div>
                </div>
                <button 
                  onClick={() => setShowOptionsModal(true)}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-4 rounded-xl font-bold transition-all hover:scale-[1.02] text-[17px]"
                >
                  무료 다운로드
                </button>
              </div>
              </div>
            </StaggerItem>

            {/* 키트 2 - Invoice AutoSorter */}
            <StaggerItem>
              <div className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-3 border-2 border-green-200 dark:border-green-900 group">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 h-56 flex items-center justify-center relative">
                <svg className="w-24 h-24 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                  🎁 무료
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full text-xs font-semibold">
                    엑셀자동화
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">.xlam 파일</span>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                  Invoice AutoSorter Kit
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed text-[16px]">
                  엑셀에서 세율별 자동 분류 + 시트 생성. VBA 매크로 기반
                </p>
                <div className="mb-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <div>📦 .xlam 파일 + 설정 가이드</div>
                    <div>🎥 시연 영상</div>
                  </div>
                </div>
                <button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-4 rounded-xl font-bold transition-all hover:scale-[1.02] text-[17px]">
                  무료 다운로드
                </button>
              </div>
              </div>
            </StaggerItem>

            {/* 키트 3 - Python File Organizer */}
            <StaggerItem>
              <div className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-3 border-2 border-green-200 dark:border-green-900 group">
              <div className="bg-gradient-to-br from-yellow-500 to-orange-600 h-56 flex items-center justify-center relative">
                <svg className="w-24 h-24 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                  🎁 무료
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 px-3 py-1 rounded-full text-xs font-semibold">
                    Python
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">.zip 파일</span>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                  Python File Organizer
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed text-[16px]">
                  특정 폴더의 파일을 날짜별로 자동정리. Python + .bat 실행 파일
                </p>
                <div className="mb-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <div>📦 .zip (스크립트 + bat 파일)</div>
                    <div>🎥 Python 설치 5분 가이드</div>
                  </div>
                </div>
                <button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-4 rounded-xl font-bold transition-all hover:scale-[1.02] text-[17px]">
                  무료 다운로드
                </button>
              </div>
              </div>
            </StaggerItem>

            {/* 키트 4 - GAS AutoMailer */}
            <StaggerItem>
              <div className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-3 border-2 border-green-200 dark:border-green-900 group">
              <div className="bg-gradient-to-br from-green-500 to-green-600 h-56 flex items-center justify-center relative">
                <svg className="w-24 h-24 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                  🎁 무료
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-xs font-semibold">
                    Apps Script
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">.gs 파일</span>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                  GAS AutoMailer for Sheets
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed text-[16px]">
                  구글 시트 변경 시 자동 메일 발송. 트리거 자동 설정
                </p>
                <div className="mb-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <div>📦 .gs 코드</div>
                    <div>🎥 스크립트 등록 영상</div>
                  </div>
                </div>
                <button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-4 rounded-xl font-bold transition-all hover:scale-[1.02] text-[17px]">
                  무료 다운로드
                </button>
              </div>
              </div>
            </StaggerItem>

            {/* 키트 5 - Streamlit Report Viewer */}
            <StaggerItem>
              <div className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-3 border-2 border-green-200 dark:border-green-900 group">
              <div className="bg-gradient-to-br from-pink-500 to-rose-600 h-56 flex items-center justify-center relative">
                <svg className="w-24 h-24 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                  🎁 무료
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span className="bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 px-3 py-1 rounded-full text-xs font-semibold">
                    데이터시각화
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">.py 파일</span>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                  Streamlit Report Viewer
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed text-[16px]">
                  CSV 업로드 → 자동 그래프 시각화. Streamlit 기반 대시보드
                </p>
                <div className="mb-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <div>📦 .py + requirements.txt</div>
                    <div>🎥 영상 가이드</div>
                  </div>
                </div>
                <button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-4 rounded-xl font-bold transition-all hover:scale-[1.02] text-[17px]">
                  무료 다운로드
                </button>
              </div>
              </div>
            </StaggerItem>
          </StaggerContainer>

          <FadeIn delay={0.5}>
            <div className="text-center mt-16">
            <button className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-12 py-5 rounded-full font-bold text-lg hover:shadow-xl hover:scale-105 transition-all">
              모든 자동화 키트 둘러보기 →
            </button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 판매자 되기 섹션 */}
      <section id="seller" className="py-24 px-6 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto max-w-6xl">
          <FadeIn>
            <h2 className="text-5xl md:text-6xl font-bold text-center mb-6 text-gray-900 dark:text-white">
              판매자로 수익 창출하기
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-300 mb-20 text-lg">
              한 번 만들어 놓으면 계속 팔리는 패시브 인컴 시스템
            </p>
          </FadeIn>

          <StaggerContainer staggerDelay={0.15} className="grid md:grid-cols-2 gap-8 mb-16">
            <StaggerItem>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-10 rounded-3xl border-2 border-purple-100 dark:border-purple-900">
              <h3 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
                💰 수익 구조
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-5 bg-white/80 dark:bg-gray-800/80 rounded-xl">
                  <span className="font-semibold text-gray-700 dark:text-gray-300 text-[17px]">판매 수수료</span>
                  <span className="font-bold text-purple-600 dark:text-purple-400 text-xl">25~30%</span>
                </div>
                <div className="flex items-center justify-between p-5 bg-white/80 dark:bg-gray-800/80 rounded-xl">
                  <span className="font-semibold text-gray-700 dark:text-gray-300 text-[17px]">프리미엄 노출</span>
                  <span className="font-bold text-pink-600 dark:text-pink-400 text-xl">₩30,000/월</span>
                </div>
                <div className="flex items-center justify-between p-5 bg-white/80 dark:bg-gray-800/80 rounded-xl">
                  <span className="font-semibold text-gray-700 dark:text-gray-300 text-[17px]">평균 키트 가격</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400 text-xl">₩19,900</span>
                </div>
                <div className="p-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-xl text-white">
                  <div className="text-sm mb-2 opacity-90">월 30개 판매 시 예상 수익</div>
                  <div className="text-4xl font-bold">₩418,000+</div>
                </div>
              </div>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="bg-gradient-to-br from-blue-50 to-teal-50 dark:from-blue-900/20 dark:to-teal-900/20 p-10 rounded-3xl border-2 border-blue-100 dark:border-blue-900">
              <h3 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
                ✅ 판매자 혜택
              </h3>
              <ul className="space-y-5">
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white text-[18px]">자동 정산 시스템</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">매월 1일 자동 입금</div>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white text-[18px]">악성코드 자동검사</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">플랫폼이 보안 책임</div>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white text-[18px]">CS 부담 제로</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">커스터마이징 요청 없음</div>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white text-[18px]">실시간 판매 통계</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">대시보드에서 한눈에 확인</div>
                  </div>
                </li>
              </ul>
              </div>
            </StaggerItem>
          </StaggerContainer>

          <FadeIn delay={0.2}>
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-700 p-12 md:p-16 rounded-3xl text-white shadow-2xl">
            <div className="max-w-3xl mx-auto text-center">
              <h3 className="text-4xl font-bold mb-6">판매자 등록은 무료입니다</h3>
              <p className="text-xl mb-10 opacity-90">
                키트 업로드 → 자동 검수 → 승인 후 즉시 판매 시작
              </p>
              <button className="bg-white text-gray-900 px-12 py-5 rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all">
                지금 판매자 신청하기 →
              </button>
            </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 리뷰 섹션 */}
      <section className="py-24 px-6 bg-white dark:bg-gray-950">
        <div className="container mx-auto max-w-6xl">
          <FadeIn>
            <h2 className="text-5xl md:text-6xl font-bold text-center mb-6 text-gray-900 dark:text-white">
              실제 사용자 리뷰
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-300 mb-20 text-lg">
              직장인들의 솔직한 후기
            </p>
          </FadeIn>

          <StaggerContainer staggerDelay={0.2} className="grid md:grid-cols-3 gap-8">
            <StaggerItem>
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/10 dark:to-purple-900/10 p-8 rounded-2xl border-2 border-indigo-100 dark:border-indigo-900 hover:scale-105 transition-transform">
              <div className="flex items-center gap-2 mb-6">
                <div className="text-yellow-500 text-2xl">★★★★★</div>
                <span className="text-lg font-bold text-gray-900 dark:text-white">5.0</span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed text-[17px]">
                &quot;매일 2시간씩 하던 메일 발송을 5분으로 줄였어요. 진작 살 걸 후회됩니다.&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="font-bold text-white text-lg">김</span>
                </div>
                <div>
                  <div className="font-bold text-gray-900 dark:text-white">김**</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">마케팅팀</div>
                </div>
              </div>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 p-8 rounded-2xl border-2 border-purple-100 dark:border-purple-900 hover:scale-105 transition-transform">
              <div className="flex items-center gap-2 mb-6">
                <div className="text-yellow-500 text-2xl">★★★★★</div>
                <span className="text-lg font-bold text-gray-900 dark:text-white">5.0</span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed text-[17px]">
                &quot;설치 가이드가 너무 친절해서 비개발자인 제가 5분 만에 적용했습니다!&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="font-bold text-white text-lg">이</span>
                </div>
                <div>
                  <div className="font-bold text-gray-900 dark:text-white">이**</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">인사팀</div>
                </div>
              </div>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/10 dark:to-rose-900/10 p-8 rounded-2xl border-2 border-pink-100 dark:border-pink-900 hover:scale-105 transition-transform">
              <div className="flex items-center gap-2 mb-6">
                <div className="text-yellow-500 text-2xl">★★★★★</div>
                <span className="text-lg font-bold text-gray-900 dark:text-white">4.9</span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed text-[17px]">
                &quot;회사에서 저보고 어떻게 이렇게 빨리 처리하냐고 물어봤어요 ㅎㅎ&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center">
                  <span className="font-bold text-white text-lg">박</span>
                </div>
                <div>
                  <div className="font-bold text-gray-900 dark:text-white">박**</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">경영지원팀</div>
                </div>
              </div>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* 베타 신청 섹션 */}
      <section className="py-24 px-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:bg-gradient-to-br dark:from-purple-900/20 dark:to-pink-900/20">
        <div className="container mx-auto max-w-3xl">
          <FadeIn>
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 md:p-12 border-2 border-purple-200 dark:border-purple-800">
              <div className="text-center mb-8">
                <div className={`inline-block ${isBetaFull ? 'bg-gradient-to-r from-gray-500 to-gray-600' : 'bg-gradient-to-r from-green-500 to-emerald-500'} text-white px-6 py-2 rounded-full text-sm font-bold mb-6`}>
                  {isBetaFull ? '🔒 베타테스트 마감' : '🎉 베타테스터 모집 중'}
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                  {isBetaFull ? '베타테스트가 마감되었습니다' : '지금 무료로 시작하세요'}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  {isBetaFull ? (
                    <>정식 버전 런칭 시 이메일로 안내드릴게요!</>
                  ) : (
                    <>
                      베타테스트 기간 동안 모든 키트를 무료로 체험하고,<br />
                      피드백 제출 시 정식 출시 후 <span className="font-bold text-purple-600">50% 할인 쿠폰</span>을 드립니다.
                    </>
                  )}
                </p>
                
                {/* 실시간 카운터 */}
                {!isCountLoading && (
                  <div className={`mt-6 text-center font-bold text-xl ${isBetaFull ? 'text-red-600' : 'text-blue-600'}`}>
                    📊 현재 {betaCount}/100명 참여 중
                  </div>
                )}
              </div>

              {!user ? (
                <div className="space-y-6">
                  <form className="space-y-4" onSubmit={handleBetaSignup}>
                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2 text-left">
                        📧 이메일
                      </label>
                      <input
                        type="email"
                        name="email"
                        placeholder="example@company.com"
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2 text-left">
                        💬 자동화하고 싶은 업무 (선택)
                      </label>
                      <textarea
                        name="task"
                        rows={3}
                        placeholder="예: 엑셀 보고서 작성, 메일 자동 회신 등"
                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:border-purple-500 focus:outline-none transition-colors resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isBetaFull}
                      className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                        isBetaFull
                          ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                          : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white hover:shadow-2xl hover:scale-[1.02]'
                      }`}
                    >
                      {isBetaFull ? '🔒 마감됨' : '🚀 무료로 시작하기'}
                    </button>

                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                      {isBetaFull ? '정식 출시 시 알려드리겠습니다' : '회원가입 후 바로 다운로드하실 수 있습니다'}
                    </p>
                  </form>
                </div>
              ) : (
                <div className="text-center space-y-6">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-800 rounded-2xl p-8">
                    <div className="text-5xl mb-4">✅</div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      환영합니다, {user.displayName}님!
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      이제 모든 자동화 키트를 무료로 다운로드하실 수 있습니다.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Link
                        href="/beta"
                        className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all text-center"
                      >
                        💾 키트 다운로드
                      </Link>
                      <Link
                        href="/feedback"
                        className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-8 py-3 rounded-xl font-bold border-2 border-gray-300 dark:border-gray-700 hover:shadow-xl hover:scale-105 transition-all text-center"
                      >
                        📝 피드백 남기기
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-24 px-6 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
        <div className="container mx-auto max-w-4xl text-center text-white">
          <FadeIn delay={0.1}>
            <h2 className="text-5xl md:text-6xl font-bold mb-8">
              보고서 쓰는 시간에
              <br />
              커피 한 잔 더.
            </h2>
          </FadeIn>
          <FadeIn delay={0.3}>
            <p className="text-2xl md:text-3xl mb-14 opacity-95">
              직장인들의 비밀 무기, WorkFree Market에서 시작하세요
            </p>
          </FadeIn>
          <FadeIn delay={0.5}>
            <div className="flex gap-5 justify-center flex-wrap">
            <button className="bg-white text-indigo-600 px-12 py-5 rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all">
              무료로 둘러보기
            </button>
            <button className="bg-transparent border-3 border-white text-white px-12 py-5 rounded-full font-bold text-lg hover:bg-white hover:text-indigo-600 transition-all">
              판매자 시작하기
            </button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-white py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                  <span className="text-white text-xl font-bold">W</span>
                </div>
                <div className="text-2xl font-bold">WorkFree Market</div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                일 안 하고도 일하는 사람들의 비밀도구
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-5 text-lg">서비스</h4>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li>
                  <a href="#kits" className="hover:text-white transition-colors">
                    자동화 키트
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="hover:text-white transition-colors">
                    작동 방식
                  </a>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-white transition-colors">
                    요금제
                  </Link>
                </li>
                <li>
                  <a href="#seller" className="hover:text-white transition-colors">
                    판매자 되기
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-5 text-lg">지원</h4>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    자주 묻는 질문
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    설치 가이드
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    고객센터
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-5 text-lg">문의</h4>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li>contact@workfreemarket.com</li>
                <li>평일 10:00 - 18:00</li>
                <li>주말 및 공휴일 휴무</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2025 WorkFree Market. All rights reserved.
            </p>
            <div className="flex gap-6 text-gray-400 text-sm">
              <a href="#" className="hover:text-white transition-colors">
                이용약관
              </a>
              <a href="#" className="hover:text-white transition-colors">
                개인정보처리방침
              </a>
              <a href="#" className="hover:text-white transition-colors">
                환불정책
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* 모바일 하단 고정 CTA */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t-2 border-indigo-200 dark:border-indigo-900 p-4 z-40 shadow-2xl">
        <button
          onClick={() => scrollToSection("kits")}
          className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-4 rounded-full font-bold text-lg shadow-lg"
        >
          인기 키트 보기
        </button>
      </div>

      {/* 키트 옵션 선택 모달 */}
      <KitOptionsModal
        isOpen={showOptionsModal}
        onClose={() => setShowOptionsModal(false)}
        kitName="Outlook AutoResponder Kit"
        basePrice={3000}
        options={[
          {
            id: "outlook",
            name: "Outlook 전송 기능",
            description: "자동메일 전송 및 첨부파일 자동 첨부",
            price: 2000,
          },
          {
            id: "pdf",
            name: "PDF 변환 기능",
            description: "파일을 자동으로 PDF로 저장",
            price: 2000,
          },
          {
            id: "cloud",
            name: "클라우드 연동",
            description: "자동 저장 및 백업 (Google Drive / SharePoint)",
            price: 3000,
          },
          {
            id: "ai",
            name: "AI 맞춤 커스터마이징",
            description: "내 회사 환경에 맞게 자동 설정",
            price: 5000,
          },
        ]}
      />
    </div>
  );
}
