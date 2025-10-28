"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import KitOptionsModal from "@/components/KitOptionsModal";
import RoulettePopup from "@/components/RoulettePopup";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations";
import MainNavigation from "@/components/MainNavigation";

export default function Home() {
  const { user, isLoading } = useAuth();
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [isBetaFull, setIsBetaFull] = useState<boolean>(false);
  const [isFriWaggling, setIsFriWaggling] = useState<boolean>(false);


  // 페이지 로드 시 베타 상태 확인
  useEffect(() => {
    // 베타가 가득 찬 상태로 설정 (임시)
    setIsBetaFull(true);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  // 프리(Fri) 귀 움직임 애니메이션
  const handleFriClick = () => {
    if (isFriWaggling) return;

    setIsFriWaggling(true);
    setTimeout(() => {
      setIsFriWaggling(false);
    }, 600);
    
    console.log("🐰 칼퇴하고 프리(Fri) 귀가 쫑긋!");
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

    // 클라이언트 측 이메일 유효성 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("⚠️ 유효하지 않은 이메일 주소 형식입니다.");
      return;
    }

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
    <div className="min-h-screen bg-[#f5f0ff]">
      <MainNavigation />

      {/* Hero 섹션 */}
      <section className="pt-32 pb-24 px-6 min-h-screen flex items-center justify-center bg-[#f5f0ff] relative overflow-hidden">
        {/* 떠다니는 Office 아이콘들 */}
        <div className="absolute top-[20%] left-[8%] animate-float" style={{ animationDelay: '0s' }}>
          <div className="text-[70px] opacity-50">📊</div>
        </div>
        <div className="absolute top-[30%] right-[12%] animate-float" style={{ animationDelay: '1s' }}>
          <div className="text-[65px] opacity-50">📧</div>
        </div>
        <div className="absolute bottom-[25%] left-[15%] animate-float" style={{ animationDelay: '2s' }}>
          <div className="text-[75px] opacity-50">📈</div>
        </div>
        <div className="absolute top-[60%] right-[20%] animate-float" style={{ animationDelay: '0.5s' }}>
          <div className="text-[60px] opacity-50">💼</div>
        </div>
        <div className="absolute top-[45%] left-[25%] animate-float" style={{ animationDelay: '1.5s' }}>
          <div className="text-[68px] opacity-50">📝</div>
        </div>
        <div className="absolute bottom-[40%] right-[8%] animate-float" style={{ animationDelay: '2.5s' }}>
          <div className="text-[72px] opacity-50">🔧</div>
        </div>

        <div className="container mx-auto text-center max-w-6xl relative z-10">
          <FadeIn delay={0.1}>
            <div className="inline-block mb-6 animate-bounce">
              <span className="bg-[#FF9A7A] text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-xl">
                🎁 베타 테스터 한정 • 10 크레딧 무료 지급
              </span>
            </div>
          </FadeIn>
          
          <FadeIn delay={0.2} duration={0.8}>
            <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold mb-6 md:mb-8 leading-tight px-4 break-keep text-[#1E1B33]">
              세상의 모든 실무를<br />
              <span className="text-[#6A5CFF]">클릭</span> 한 번으로
            </h1>
          </FadeIn>
          
          <FadeIn delay={0.4}>
            <p className="text-lg md:text-xl lg:text-2xl text-[#1E1B33] mb-8 md:mb-12 max-w-3xl mx-auto leading-relaxed px-4 break-keep">
              <span className="font-bold">
                퇴근에 날개를 달다. WorkFree Market
              </span>
            </p>
          </FadeIn>
          
          {/* CTA 버튼 */}
          <FadeIn delay={0.6}>
            <div className="flex gap-6 justify-center items-center mb-12 relative">
              {!isLoading && !user ? (
                <>
                  {/* 왼쪽에 프리(Fri) 캐릭터 - 데스크톱만 */}
                  <div 
                    className="hidden md:flex flex-col items-center cursor-pointer group"
                    onClick={handleFriClick}
                  >
                    <div className="relative">
                      {/* 글로우 효과 배경 */}
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
                      {/* 프리 캐릭터 */}
                      <div className="relative bg-white rounded-full p-3 shadow-2xl group-hover:shadow-purple-300 transition-all group-hover:scale-110 overflow-hidden">
                        <img 
                          src="/fri-free.png" 
                          alt="WorkFree 마스코트 프리(Fri)" 
                          className={`w-24 h-24 object-cover rounded-full ${isFriWaggling ? 'animate-bounce' : 'group-hover:animate-pulse'}`}
                        />
                      </div>
                    </div>
                    {/* 말풍선 */}
                    <div className="mt-3 bg-white px-4 py-2 rounded-full shadow-lg border-2 border-purple-200 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-y-0 translate-y-2">
                      <p className="text-xs font-bold text-purple-600 whitespace-nowrap">클릭해보세요! 🐰</p>
                    </div>
                  </div>

                  <Link
                    href="/kits"
                    className="bg-[#6A5CFF] hover:bg-[#5A4CEF] text-white px-12 py-5 rounded-full font-bold text-xl hover:shadow-2xl hover:scale-105 transition-all"
                  >
                    🚀 지금 칼퇴 클릭
                  </Link>

                  {/* 큰 커서 아이콘 - 데스크톱만 */}
                  <div className="hidden md:block animate-bounce">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#6A5CFF]">
                      <path d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </>
              ) : (
                <>
                  {/* 로그인 시에도 프리(Fri) 표시 */}
                  <div 
                    className="hidden md:flex flex-col items-center cursor-pointer group"
                    onClick={handleFriClick}
                  >
                    <div className="relative">
                      {/* 글로우 효과 배경 */}
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
                      {/* 프리 캐릭터 */}
                      <div className="relative bg-white rounded-full p-3 shadow-2xl group-hover:shadow-purple-300 transition-all group-hover:scale-110 overflow-hidden">
                        <img 
                          src="/fri-free.png" 
                          alt="WorkFree 마스코트 프리(Fri)" 
                          className={`w-24 h-24 object-cover rounded-full ${isFriWaggling ? 'animate-bounce' : 'group-hover:animate-pulse'}`}
                        />
                      </div>
                    </div>
                    {/* 말풍선 */}
                    <div className="mt-3 bg-white px-4 py-2 rounded-full shadow-lg border-2 border-purple-200 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-y-0 translate-y-2">
                      <p className="text-xs font-bold text-purple-600 whitespace-nowrap">반가워요! 🐰</p>
                    </div>
                  </div>

                  <Link
                    href={user ? "/beta/dashboard" : "/beta/dashboard"}
                    className="bg-[#6A5CFF] hover:bg-[#5A4CEF] text-white px-12 py-5 rounded-full font-bold text-xl hover:shadow-2xl hover:scale-105 transition-all inline-flex items-center gap-3"
                  >
                    {user ? (
                      <>
                        <span className="text-2xl">⚡</span>
                        <span>내 WorkFree 허브로 이동</span>
                      </>
                    ) : (
                      <>
                        <span className="text-xl">🚀</span>
                        <span>지금 칼퇴 클릭</span>
                      </>
                    )}
                  </Link>
                </>
              )}
            </div>
          </FadeIn>
          
          {/* 통계 */}
          <StaggerContainer staggerDelay={0.15} className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <StaggerItem>
              <div className="bg-white p-4 rounded-xl border-2 border-[#AFA6FF] hover:scale-105 transition-transform hover:border-[#6A5CFF] shadow-lg">
                <div className="text-2xl font-bold text-[#6A5CFF] mb-1">
                  100명 한정
                </div>
                <div className="text-[#1E1B33]/70 text-xs font-medium">
                  베타 테스터 모집
                </div>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="bg-white p-4 rounded-xl border-2 border-[#AFA6FF] hover:scale-105 transition-transform hover:border-[#6A5CFF] shadow-lg">
                <div className="text-2xl font-bold text-[#6A5CFF] mb-1">
                  10개
                </div>
                <div className="text-[#1E1B33]/70 text-xs font-medium">
                  무료 크레딧
                </div>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="bg-white p-4 rounded-xl border-2 border-[#AFA6FF] hover:scale-105 transition-transform hover:border-[#6A5CFF] shadow-lg">
                <div className="text-2xl font-bold text-[#6A5CFF] mb-1">
                  AI 기반
                </div>
                <div className="text-[#1E1B33]/70 text-xs font-medium">
                  스마트 자동화
                </div>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="bg-white p-4 rounded-xl border-2 border-[#AFA6FF] hover:scale-105 transition-transform hover:border-[#6A5CFF] shadow-lg">
                <div className="text-2xl font-bold text-[#6A5CFF] mb-1">
                  1개월
                </div>
                <div className="text-[#1E1B33]/70 text-xs font-medium">
                  무료 체험 기간
                </div>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>


      {/* 4개 카테고리 섹션 */}
      <section className="py-24 px-6 bg-white">
        <div className="container mx-auto max-w-7xl">
          <FadeIn>
            <div className="text-center mb-6">
              <span className="inline-block bg-[#6A5CFF] text-white px-5 py-2 rounded-full text-sm font-bold mb-6">
                💼 스마트워크
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-[#1E1B33]">
              일은 자동으로,<br />성과는 그대로.
            </h2>
            <p className="text-center text-[#1E1B33]/70 mb-16 text-lg">
              업무 분야별로 엄선된 자동화 키트
            </p>
          </FadeIn>

          <StaggerContainer staggerDelay={0.15} className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Microsoft 사무자동화 */}
            <StaggerItem>
              <Link href="/automation/microsoft" className="block group">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-3xl p-10 border-2 border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600 transition-all hover:scale-105 hover:shadow-2xl">
                  <div className="text-6xl mb-6">📊</div>
                  <h3 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                    Microsoft 사무자동화
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed text-lg">
                    Excel, Outlook, PPT 등 오피스 업무를 완전 자동화
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full">
                      Outlook 자동회신
                    </span>
                    <span className="text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full">
                      Excel 보고서
                    </span>
                    <span className="text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full">
                      PPT 자동화
                    </span>
                  </div>
                  <div className="text-blue-600 dark:text-blue-400 font-semibold group-hover:translate-x-2 transition-transform inline-flex items-center gap-2">
                    6개 키트 보기 →
                  </div>
                </div>
              </Link>
            </StaggerItem>

            {/* 웹 크롤링 */}
            <StaggerItem>
              <Link href="/automation/crawling" className="block group">
                <div className="bg-gradient-to-br from-cyan-50 to-teal-50 dark:from-cyan-900/20 dark:to-teal-900/20 rounded-3xl p-10 border-2 border-cyan-200 dark:border-cyan-800 hover:border-cyan-400 dark:hover:border-cyan-600 transition-all hover:scale-105 hover:shadow-2xl">
                  <div className="text-6xl mb-6">🕷️</div>
                  <h3 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                    웹 크롤링
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed text-lg">
                    검색부터 수집, 알림까지 웹 데이터 완전 자동화
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-xs bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300 px-3 py-1 rounded-full">
                      검색 자동화
                    </span>
                    <span className="text-xs bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300 px-3 py-1 rounded-full">
                      뉴스 수집
                    </span>
                    <span className="text-xs bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300 px-3 py-1 rounded-full">
                      가격 모니터링
                    </span>
                  </div>
                  <div className="text-cyan-600 dark:text-cyan-400 font-semibold group-hover:translate-x-2 transition-transform inline-flex items-center gap-2">
                    6개 키트 보기 →
                  </div>
                </div>
              </Link>
            </StaggerItem>

            {/* 데이터 시각화 */}
            <StaggerItem>
              <Link href="/automation/visualization" className="block group">
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-3xl p-10 border-2 border-purple-200 dark:border-purple-800 hover:border-purple-400 dark:hover:border-purple-600 transition-all hover:scale-105 hover:shadow-2xl">
                  <div className="text-6xl mb-6">📈</div>
                  <h3 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                    데이터 시각화
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed text-lg">
                    엑셀 데이터를 멋진 대시보드로 자동 변환
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-xs bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full">
                      대시보드
                    </span>
                    <span className="text-xs bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full">
                      차트 생성
                    </span>
                    <span className="text-xs bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full">
                      KPI 모니터링
                    </span>
                  </div>
                  <div className="text-purple-600 dark:text-purple-400 font-semibold group-hover:translate-x-2 transition-transform inline-flex items-center gap-2">
                    5개 키트 보기 →
                  </div>
                </div>
              </Link>
            </StaggerItem>

            {/* AI 프롬프트 */}
            <StaggerItem>
              <Link href="/automation/prompts" className="block group">
                <div className="bg-gradient-to-br from-orange-50 to-rose-50 dark:from-orange-900/20 dark:to-rose-900/20 rounded-3xl p-10 border-2 border-orange-200 dark:border-orange-800 hover:border-orange-400 dark:hover:border-orange-600 transition-all hover:scale-105 hover:shadow-2xl">
                  <div className="text-6xl mb-6">🤖</div>
                  <h3 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                    AI 프롬프트
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed text-lg">
                    영상, 이미지, 카피까지 AI로 콘텐츠 제작 자동화
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-xs bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 px-3 py-1 rounded-full">
                      영상 기획
                    </span>
                    <span className="text-xs bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 px-3 py-1 rounded-full">
                      이미지 생성
                    </span>
                    <span className="text-xs bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 px-3 py-1 rounded-full">
                      마케팅 카피
                    </span>
                  </div>
                  <div className="text-orange-600 dark:text-orange-400 font-semibold group-hover:translate-x-2 transition-transform inline-flex items-center gap-2">
                    6개 키트 보기 →
                  </div>
                </div>
              </Link>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* 홍보 영상 섹션 */}
      <section className="py-20 px-6 bg-[#ede7ff]">
        <div className="container mx-auto max-w-6xl">
          <FadeIn>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-center mb-4 text-[#1E1B33] px-4">
              WorkFree를 영상으로 만나보세요
            </h2>
            <p className="text-center text-[#1E1B33]/70 mb-12 text-lg">
              직장인의 반복 업무를 자동화하는 WorkFree의 모든 것
            </p>
          </FadeIn>
          
          <FadeIn delay={0.2}>
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-[#AFA6FF] mx-auto max-w-5xl">
              <video
                className="w-full h-auto"
                autoPlay
                muted
                loop
                playsInline
                controls
                aria-label="WorkFree 자동화 솔루션 데모 영상"
              >
                <source src="/videos/watermarked-691240b2-610f-42b0-a476-0e148e0a813b.mp4" type="video/mp4" />
                브라우저가 비디오 태그를 지원하지 않습니다.
              </video>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 🎯 베타 서비스 체험 섹션 */}
      <section className="py-16 px-6 bg-white">
        <div className="container mx-auto max-w-7xl">
          <FadeIn>
            <div className="text-center mb-12">
              <span className="inline-block bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-2 rounded-full text-sm font-bold mb-6 animate-pulse">
                🎁 베타 기간 무료!
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-[#1E1B33] mb-4">
                지금 바로 사용 가능
              </h2>
              <p className="text-[#1E1B33]/70 text-lg">
                NEW 서비스 4개를 먼저 만나보세요
              </p>
            </div>
          </FadeIn>

          <div className="grid lg:grid-cols-2 xl:grid-cols-2 gap-8">
            {/* QR 코드 생성기 */}
            <FadeIn>
              <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 md:p-10 border-2 border-cyan-200 dark:border-cyan-800 relative overflow-hidden h-full">
                {/* 배경 장식 */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl -z-0"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl -z-0"></div>

                <div className="relative z-10">
                  {/* 뱃지 */}
                  <div className="flex items-center justify-center gap-2 mb-6">
                    <span className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold animate-pulse">
                      ✨ NEW!
                    </span>
                    <span className="inline-flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                      🎁 Beta 무료
                    </span>
                  </div>

                  {/* 메인 제목 */}
                  <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    QR 코드 생성기
                  </h2>
                  <p className="text-center text-gray-600 dark:text-gray-300 mb-2">
                    URL, 텍스트를 QR 코드로 변환하고 <strong className="text-cyan-600 dark:text-cyan-400">로고 삽입까지</strong>
                  </p>
                  <p className="text-center text-sm text-cyan-600 dark:text-cyan-400 font-semibold mb-6">
                    💡 베타 기간 동안 <span className="underline decoration-wavy">완전 무료</span>로 사용하세요
                  </p>

                  {/* 주요 기능 */}
                  <div className="space-y-3 mb-6">
                    <div className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/30 dark:to-blue-900/30 rounded-xl p-3 border border-cyan-200 dark:border-cyan-700">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">📱</div>
                        <div>
                          <div className="font-bold text-gray-900 dark:text-white text-sm">PNG/SVG 다운로드</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">고품질 이미지</div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl p-3 border border-purple-200 dark:border-purple-700">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">🎨</div>
                        <div>
                          <div className="font-bold text-gray-900 dark:text-white text-sm">로고 중앙 삽입</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">브랜드 강화</div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl p-3 border border-green-200 dark:border-green-700">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">📦</div>
                        <div>
                          <div className="font-bold text-gray-900 dark:text-white text-sm">ZIP 일괄 다운로드</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">여러 개 한 번에</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CTA 버튼 */}
                  <Link
                    href="/tools/qr-generator"
                    className="group block w-full bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 text-white px-6 py-4 rounded-xl font-bold text-center hover:shadow-2xl hover:scale-105 transition-all"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-xl">📱</span>
                      <span>QR 코드 생성하기</span>
                      <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </Link>

                  {/* 하단 설명 */}
                  <div className="mt-6 text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      ⚡ 즉시 생성 | 💎 1 크레딧 | 🎉 베타 가입 시 무료 10 크레딧
                    </p>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* 이미지 파인더 */}
            <FadeIn delay={0.2}>
              <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 md:p-10 border-2 border-blue-200 dark:border-blue-800 relative overflow-hidden h-full">
                {/* 배경 장식 */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl -z-0"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-cyan-400/20 to-indigo-400/20 rounded-full blur-3xl -z-0"></div>

                <div className="relative z-10">
                  {/* 뱃지 */}
                  <div className="flex items-center justify-center gap-2 mb-6">
                    <span className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-bold animate-pulse">
                      ✨ NEW!
                    </span>
                    <span className="inline-flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                      🎁 Beta 무료
                    </span>
                  </div>

                  {/* 메인 제목 */}
                  <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    WorkFree 이미지 파인더
                  </h2>
                  <p className="text-center text-gray-600 dark:text-gray-300 mb-2">
                    합법적 고품질 이미지, <strong className="text-blue-600 dark:text-blue-400">3개 API에서 한 번에 검색</strong>
                  </p>
                  <p className="text-center text-sm text-blue-600 dark:text-blue-400 font-semibold mb-6">
                    💡 베타 기간 동안 <span className="underline decoration-wavy">완전 무료</span>로 사용하세요
                  </p>

                  {/* 주요 기능 */}
                  <div className="space-y-3 mb-6">
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-xl p-3 border border-blue-200 dark:border-blue-700">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">🌍</div>
                        <div>
                          <div className="font-bold text-gray-900 dark:text-white text-sm">3개 소스 통합</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Unsplash + Pexels + Pixabay</div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/30 dark:to-indigo-900/30 rounded-xl p-3 border border-purple-200 dark:border-purple-700">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">⚡</div>
                        <div>
                          <div className="font-bold text-gray-900 dark:text-white text-sm">최대 50장 검색</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">한 번에 50장까지</div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl p-3 border border-green-200 dark:border-green-700">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">✅</div>
                        <div>
                          <div className="font-bold text-gray-900 dark:text-white text-sm">상업적 이용 가능</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">저작권 걱정 없음</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CTA 버튼 */}
                  <Link
                    href="/tools/image-finder"
                    className="group block w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white px-6 py-4 rounded-xl font-bold text-center hover:shadow-2xl hover:scale-105 transition-all"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-xl">📸</span>
                      <span>이미지 검색 시작하기</span>
                      <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </Link>

                  {/* 하단 설명 */}
                  <div className="mt-6 text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      ⚡ 즉시 검색 | 💰 완전 무료 | 📊 마케터/디자이너/블로거 필수
                    </p>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* AI 블로그 생성기 */}
            <FadeIn delay={0.4}>
              <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 md:p-10 border-2 border-purple-200 dark:border-purple-800 relative overflow-hidden h-full">
              {/* 배경 장식 */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl -z-0"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl -z-0"></div>

              <div className="relative z-10">
                {/* 뱃지 */}
                <div className="flex items-center justify-center gap-2 mb-6">
                  <span className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-bold animate-pulse">
                    ✨ NEW!
                  </span>
                  <span className="inline-flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                    🎁 Beta 무료
                  </span>
                </div>

                {/* 메인 제목 */}
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent">
                  AI 블로그 자동 생성기
                </h2>
                <p className="text-center text-gray-600 dark:text-gray-300 mb-2">
                  키워드 + 주요 내용 3개만 입력하면 <strong className="text-purple-600 dark:text-purple-400">완성도 높은 블로그 글</strong>이 즉시!
                </p>
                <p className="text-center text-sm text-purple-600 dark:text-purple-400 font-semibold mb-6">
                  💡 베타 기간 동안 <span className="underline decoration-wavy">완전 무료</span>로 사용하세요
                </p>

                {/* 주요 기능 */}
                <div className="space-y-3 mb-6">
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl p-3 border border-purple-200 dark:border-purple-700">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">⚡</div>
                      <div>
                        <div className="font-bold text-gray-900 dark:text-white text-sm">3가지 블로그 스타일</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">기본/SEO/마케팅</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl p-3 border border-blue-200 dark:border-blue-700">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">🌐</div>
                      <div>
                        <div className="font-bold text-gray-900 dark:text-white text-sm">HTML 미리보기</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">바로 복붙 가능</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl p-3 border border-green-200 dark:border-green-700">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">💾</div>
                      <div>
                        <div className="font-bold text-gray-900 dark:text-white text-sm">파일 다운로드</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">TXT/HTML/PDF</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTA 버튼 */}
                <Link
                  href="/tools/blog-generator"
                  className="group block w-full bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white px-6 py-4 rounded-xl font-bold text-center hover:shadow-2xl hover:scale-105 transition-all"
                >
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-xl">✍️</span>
                    <span>AI 블로그 생성 체험하기</span>
                    <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </Link>

                {/* 하단 설명 */}
                <div className="mt-6 text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    ⏱️ 평균 10초 | 💎 3 크레딧 | 🎉 베타 가입 시 무료 10 크레딧
                  </p>
                </div>
              </div>
              </div>
            </FadeIn>

            {/* AI 화보 메이커 */}
            <FadeIn delay={0.4}>
              <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 md:p-10 border-2 border-pink-200 dark:border-pink-800 relative overflow-hidden h-full">
                {/* 배경 장식 */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-pink-400/20 to-rose-400/20 rounded-full blur-3xl -z-0"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-orange-400/20 to-red-400/20 rounded-full blur-3xl -z-0"></div>

                <div className="relative z-10">
                  {/* 뱃지 */}
                  <div className="flex items-center justify-center gap-2 mb-6">
                    <span className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-600 to-rose-600 text-white px-4 py-2 rounded-full text-sm font-bold animate-pulse">
                      ✨ NEW!
                    </span>
                    <span className="inline-flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                      🎁 Beta 무료
                    </span>
                  </div>

                  {/* 메인 제목 */}
                  <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 bg-gradient-to-r from-pink-600 via-rose-600 to-red-600 bg-clip-text text-transparent">
                    AI 화보 메이커
                  </h2>
                  <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
                    한 장의 사진으로 만드는 <strong className="text-pink-600 dark:text-pink-400">20가지 스타일</strong>
                  </p>

                  {/* 이미지 미리보기 (3개 스타일) */}
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="relative group cursor-pointer overflow-hidden rounded-2xl border-2 border-pink-200 dark:border-pink-700 hover:border-pink-400 dark:hover:border-pink-500 transition-all hover:scale-105">
                      <div className="aspect-[3/4] relative">
                        <img 
                          src="/examples/ai-portrait/보그화보.jpg" 
                          alt="Vogue Korea 스타일 화보" 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                          <div className="text-xs font-bold">Vogue Korea</div>
                          <div className="text-[10px] text-gray-300">모던 복고</div>
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    <div className="relative group cursor-pointer overflow-hidden rounded-2xl border-2 border-orange-200 dark:border-orange-700 hover:border-orange-400 dark:hover:border-orange-500 transition-all hover:scale-105">
                      <div className="aspect-[3/4] relative">
                        <img 
                          src="/examples/ai-portrait/레트로.png" 
                          alt="Vintage Retro 스타일 화보" 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                          <div className="text-xs font-bold">Vintage Retro</div>
                          <div className="text-[10px] text-gray-300">레트로 감성</div>
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    <div className="relative group cursor-pointer overflow-hidden rounded-2xl border-2 border-blue-200 dark:border-blue-700 hover:border-blue-400 dark:hover:border-blue-500 transition-all hover:scale-105">
                      <div className="aspect-[3/4] relative">
                        <img 
                          src="/examples/ai-portrait/링크드인.jpg" 
                          alt="LinkedIn 스타일 화보" 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                          <div className="text-xs font-bold">Linkedin</div>
                          <div className="text-[10px] text-gray-300">인플루언서</div>
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                  </div>

                  {/* 주요 기능 */}
                  <div className="space-y-3 mb-6">
                    <div className="bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/30 dark:to-rose-900/30 rounded-xl p-3 border border-pink-200 dark:border-pink-700">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">📷</div>
                        <div>
                          <div className="font-bold text-gray-900 dark:text-white text-sm">20가지 컨셉</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Vogue/Retro/Linkedin 등</div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl p-3 border border-blue-200 dark:border-blue-700">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">⚡</div>
                        <div>
                          <div className="font-bold text-gray-900 dark:text-white text-sm">즉시 생성</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Gemini AI 프롬프트</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CTA 버튼 */}
                  <Link
                    href="/gallery"
                    className="group block w-full bg-gradient-to-r from-pink-600 via-rose-600 to-red-600 text-white px-6 py-4 rounded-xl font-bold text-center hover:shadow-2xl hover:scale-105 transition-all"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-xl">🎨</span>
                      <span>AI 화보 갤러리 보기</span>
                      <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </Link>

                  {/* 하단 설명 */}
                  <div className="mt-6 text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      📸 20개 스타일 | 🎁 프롬프트 키트 제공 | ✨ 5분 만에 보그 커버 모델
                    </p>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 작동 방식 섹션 */}
      <section id="how-it-works" className="py-24 px-6 bg-[#f5f0ff]">
        <div className="container mx-auto max-w-6xl">
          <FadeIn>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-center mb-6 text-[#1E1B33] px-4">
              간단한 3단계
            </h2>
            <p className="text-center text-[#1E1B33]/70 mb-20 text-lg">
              클릭 한 번으로 바로 시작
            </p>
          </FadeIn>
          
          <StaggerContainer staggerDelay={0.15} className="grid md:grid-cols-3 gap-8 mb-20">
            <StaggerItem>
              <div className="relative group">
                <div className="bg-white dark:bg-gray-800 p-10 rounded-3xl text-center border-2 border-indigo-100 dark:border-indigo-900 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all hover:-translate-y-2 hover:shadow-2xl">
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform">
                    <span className="text-white text-4xl font-bold">🎁</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                    무료 가입
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-[17px]">
                    10 크레딧 즉시 지급<br />빠르고 간편한 시작
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
                    <span className="text-white text-4xl font-bold">⚡</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                    웹에서 즉시 실행
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-[17px]">
                    클릭 한 번으로 자동화 시작<br />평균 10초 만에 완료
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
                    <span className="text-white text-4xl font-bold">💾</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                    결과 다운로드
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-[17px]">
                    TXT/PDF/HTML 저장<br />시간 절약 통계 자동 기록
                  </p>
                </div>
              </div>
            </StaggerItem>
          </StaggerContainer>

          {/* 핵심 메시지 */}
          <FadeIn delay={0.2}>
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-10 md:p-14 rounded-3xl text-center text-white shadow-2xl">
              <p className="text-3xl md:text-4xl font-bold mb-4">
                &quot;클릭 한 번으로 완성. 대기 시간 제로.&quot;
              </p>
              <p className="text-lg opacity-90">
                즉시 실행 | 크레딧으로 필요한 만큼만 사용
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 인기 서비스 섹션 */}
      <section id="kits" className="py-24 px-6 bg-white">
        <div className="container mx-auto max-w-7xl">
          <FadeIn>
            <div className="text-center mb-6">
              <span className="inline-block bg-[#6A5CFF] text-white px-6 py-2 rounded-full text-sm font-bold mb-6">
                🔥 인기 서비스
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-center mb-6 text-[#1E1B33] px-4">
              보고서·메일·정리…<br />클릭 한 번이면 끝.
            </h2>
            <p className="text-center text-[#1E1B33]/70 mb-20 text-lg">
              크레딧으로 바로 실행 • 즉시 사용
            </p>
          </FadeIn>

          <StaggerContainer staggerDelay={0.15} className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {/* 서비스 0 - 이미지 어시스턴트 (NEW) */}
            <StaggerItem>
              <div className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-3 border-2 border-purple-200 dark:border-purple-900 group">
              <div className="bg-gradient-to-br from-purple-500 via-blue-500 to-purple-600 h-48 flex items-center justify-center relative">
                <svg className="w-20 h-20 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div className="absolute top-4 right-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-3 py-1.5 rounded-full text-sm font-bold animate-pulse">
                  ✨ NEW
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full text-xs font-semibold">
                    이미지수집
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">⏱️ 30분 절약</span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                  WorkFree 이미지 파인더
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed text-sm">
                  합법적 고품질 이미지, 3개 API에서 한 번에
                </p>
                <div className="mb-4 text-xs text-gray-600 dark:text-gray-400">
                  <div>✅ 브랜드 / 제품 리서치</div>
                  <div>✅ 중복 제거 자동 정리</div>
                </div>
                <Link
                  href="/tools/image-finder"
                  className="block w-full bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 hover:from-purple-700 hover:via-blue-700 hover:to-purple-700 text-white py-3 rounded-xl font-bold transition-all hover:scale-[1.02] text-sm text-center"
                >
                  🚀 바로 사용하기
                </Link>
              </div>
              </div>
            </StaggerItem>

            {/* 서비스 1 - PDF 변환 */}
            <StaggerItem>
              <div className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-3 border-2 border-purple-200 dark:border-purple-900 group">
              <div className="bg-gradient-to-br from-red-500 to-red-600 h-48 flex items-center justify-center relative">
                <svg className="w-20 h-20 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <div className="absolute top-4 right-4 bg-purple-500 text-white px-3 py-1.5 rounded-full text-sm font-bold">
                  💎 1 크레딧
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-3 py-1 rounded-full text-xs font-semibold">
                    문서변환
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">⏱️ 15분 절약</span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                  PDF → Word 변환
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed text-sm">
                  PDF 파일을 편집 가능한 Word 문서로 즉시 변환
                </p>
                <div className="mb-4 text-xs text-gray-600 dark:text-gray-400">
                  <div>📄 원본 레이아웃 유지</div>
                  <div>✍️ 바로 편집 가능</div>
                </div>
                <button 
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-xl font-bold transition-all hover:scale-[1.02] text-sm"
                >
                  사용하기
                </button>
              </div>
              </div>
            </StaggerItem>

            {/* 서비스 2 - Outlook 자동 회신 */}
            <StaggerItem>
              <div className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-3 border-2 border-purple-200 dark:border-purple-900 group">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 h-48 flex items-center justify-center relative">
                <svg className="w-20 h-20 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div className="absolute top-4 right-4 bg-purple-500 text-white px-3 py-1.5 rounded-full text-sm font-bold">
                  💎 1 크레딧
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-semibold">
                    메일자동화
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">⏱️ 30분 절약</span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                  Outlook 자동 회신
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed text-sm">
                  조건에 맞는 메일 자동 회신 및 첨부파일 자동 발송
                </p>
                <div className="mb-4 text-xs text-gray-600 dark:text-gray-400">
                  <div>📧 조건별 자동 분류</div>
                  <div>📎 첨부파일 자동 첨부</div>
                </div>
                <button 
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-xl font-bold transition-all hover:scale-[1.02] text-sm"
                >
                  사용하기
                </button>
              </div>
              </div>
            </StaggerItem>

            {/* 서비스 3 - AI 화보 생성 */}
            <StaggerItem>
              <div className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-3 border-2 border-purple-200 dark:border-purple-900 group">
              <div className="bg-gradient-to-br from-pink-500 to-rose-600 h-48 flex items-center justify-center relative">
                <svg className="w-20 h-20 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div className="absolute top-4 right-4 bg-rose-500 text-white px-3 py-1.5 rounded-full text-sm font-bold">
                  💎 3 크레딧
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 px-3 py-1 rounded-full text-xs font-semibold">
                    AI 생성
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">⏱️ 60분 절약</span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                  AI 화보 생성
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed text-sm">
                  프로필 사진을 보그 커버 스타일 화보로 변환
                </p>
                <div className="mb-4 text-xs text-gray-600 dark:text-gray-400">
                  <div>🎨 20가지 스타일</div>
                  <div>💼 LinkedIn 최적화</div>
                </div>
                <Link
                  href="/gallery"
                  className="block w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-xl font-bold transition-all hover:scale-[1.02] text-sm text-center"
                >
                  갤러리 보기
                </Link>
              </div>
              </div>
            </StaggerItem>

            {/* 서비스 4 - AI 블로그 자동 생성 */}
            <StaggerItem>
              <div className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-3 border-2 border-purple-200 dark:border-purple-900 group">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 h-48 flex items-center justify-center relative">
                <svg className="w-20 h-20 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                <div className="absolute top-4 right-4 bg-purple-500 text-white px-3 py-1.5 rounded-full text-sm font-bold">
                  💎 3 크레딧
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-full text-xs font-semibold">
                    AI 생성
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">⏱️ 30분 절약</span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                  AI 블로그 자동 생성
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed text-sm">
                  키워드만 입력하면 GPT가 자동으로 블로그 글 작성
                </p>
                <div className="mb-4 text-xs text-gray-600 dark:text-gray-400">
                  <div>✍️ GPT-4o-mini 사용</div>
                  <div>📄 TXT/PDF 다운로드</div>
                </div>
                <Link
                  href="/tools/blog-generator"
                  className="block w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-xl font-bold transition-all hover:scale-[1.02] text-sm text-center"
                >
                  사용하기
                </Link>
              </div>
              </div>
            </StaggerItem>

            {/* 서비스 5 - QR 코드 생성기 */}
            <StaggerItem>
              <div className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-3 border-2 border-cyan-200 dark:border-cyan-900 group">
              <div className="bg-gradient-to-br from-cyan-500 to-blue-600 h-48 flex items-center justify-center relative">
                <svg className="w-20 h-20 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
                <div className="absolute top-4 right-4 bg-cyan-500 text-white px-3 py-1.5 rounded-full text-sm font-bold">
                  💎 1 크레딧
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 px-3 py-1 rounded-full text-xs font-semibold">
                    이미지 생성
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">⏱️ 15분 절약</span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                  QR 코드 생성기
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed text-sm">
                  URL, 텍스트를 QR 코드로 변환하고 로고 삽입까지
                </p>
                <div className="mb-4 text-xs text-gray-600 dark:text-gray-400">
                  <div>📱 PNG/SVG 다운로드</div>
                  <div>🎨 로고 중앙 삽입</div>
                </div>
                <Link
                  href="/tools/qr-generator"
                  className="block w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white py-3 rounded-xl font-bold transition-all hover:scale-[1.02] text-sm text-center"
                >
                  사용하기
                </Link>
              </div>
              </div>
            </StaggerItem>
          </StaggerContainer>

          <FadeIn delay={0.5}>
            <div className="text-center mt-16">
            <button className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white px-12 py-5 rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all">
              모든 서비스 둘러보기 →
            </button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 나만의 대시보드 프리뷰 */}
      <section className="py-24 px-6 bg-white dark:bg-gray-900">
        <div className="container mx-auto max-w-6xl">
          <FadeIn>
            <div className="text-center mb-16">
              <span className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-5 py-2 rounded-full text-sm font-bold mb-6">
                📊 나만의 대시보드
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#1E1B33] dark:text-white">
                내 모든 활동이 한눈에
              </h2>
              <p className="text-[#1E1B33]/70 dark:text-gray-300 text-lg max-w-2xl mx-auto">
                시간 절약 통계부터 최근 활동까지, 퍼스널라이징된 대시보드에서 관리하세요
              </p>
            </div>
          </FadeIn>

          {/* 대시보드 미리보기 */}
          <FadeIn delay={0.2}>
            <div className="bg-gradient-to-br from-[#f5f0ff] to-white dark:from-gray-800 dark:to-gray-900 rounded-3xl p-8 md:p-12 border-2 border-[#AFA6FF] shadow-2xl">
              
              {/* 시간 절약 통계 */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-[#1E1B33] dark:text-white mb-4 flex items-center gap-2">
                  <span>⏰</span>
                  <span>내가 절약한 시간</span>
                </h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {/* 이번 달 절약 */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border-2 border-blue-200 dark:border-blue-800">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-2xl">
                        📅
                      </div>
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                        이번 달 절약
                      </h4>
                    </div>
                    <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                      24시간 37분
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      약 ₩820,000 절약
                    </div>
                  </div>

                  {/* 누적 절약 */}
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 border-2 border-purple-200 dark:border-purple-800">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center text-2xl">
                        🏆
                      </div>
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                        누적 절약
                      </h4>
                    </div>
                    <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                      127시간 12분
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      약 ₩4,240,000 절약
                    </div>
                  </div>
                </div>
              </div>

              {/* 활동 통계 */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-[#1E1B33] dark:text-white mb-4">
                  📈 이번 주 활동
                </h3>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border-2 border-[#AFA6FF]/50 text-center">
                    <div className="text-3xl mb-2">📰</div>
                    <div className="text-3xl font-bold text-[#6A5CFF] mb-1">
                      12
                    </div>
                    <div className="text-xs text-[#1E1B33]/70 dark:text-gray-400">
                      생성한 블로그
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border-2 border-[#AFA6FF]/50 text-center">
                    <div className="text-3xl mb-2">⚡</div>
                    <div className="text-3xl font-bold text-[#6A5CFF] mb-1">
                      8
                    </div>
                    <div className="text-xs text-[#1E1B33]/70 dark:text-gray-400">
                      이번 주 활동
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border-2 border-[#AFA6FF]/50 text-center">
                    <div className="text-3xl mb-2">💎</div>
                    <div className="text-3xl font-bold text-[#6A5CFF] mb-1">
                      45
                    </div>
                    <div className="text-xs text-[#1E1B33]/70 dark:text-gray-400">
                      사용한 크레딧
                    </div>
                  </div>
                </div>
              </div>

              {/* 최근 활동 */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-[#1E1B33] dark:text-white">
                    📝 최근 활동
                  </h3>
                  <span className="text-sm text-[#6A5CFF] hover:underline cursor-pointer">
                    전체보기 →
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border-2 border-[#AFA6FF]/50">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">📰</div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm text-[#1E1B33] dark:text-white mb-1">
                          "AI 마케팅 트렌드 2025" 블로그 생성
                        </h4>
                        <p className="text-xs text-[#1E1B33]/70 dark:text-gray-400 mb-2">
                          AI와 자동화를 활용한 최신 마케팅 전략...
                        </p>
                        <div className="flex items-center gap-2 text-xs text-[#1E1B33]/50 dark:text-gray-500">
                          <span>🎨 전문가 스타일</span>
                          <span>•</span>
                          <span>2시간 전</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border-2 border-[#AFA6FF]/50">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">🎨</div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm text-[#1E1B33] dark:text-white mb-1">
                          AI 화보 생성 (LinkedIn 프로필)
                        </h4>
                        <p className="text-xs text-[#1E1B33]/70 dark:text-gray-400 mb-2">
                          전문적인 비즈니스 프로필 이미지 생성 완료
                        </p>
                        <div className="flex items-center gap-2 text-xs text-[#1E1B33]/50 dark:text-gray-500">
                          <span>💼 비즈니스</span>
                          <span>•</span>
                          <span>1일 전</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border-2 border-[#AFA6FF]/50">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">📊</div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm text-[#1E1B33] dark:text-white mb-1">
                          엑셀 자동화 스크립트 실행
                        </h4>
                        <p className="text-xs text-[#1E1B33]/70 dark:text-gray-400 mb-2">
                          월간 보고서 데이터 정리 자동화 완료
                        </p>
                        <div className="flex items-center gap-2 text-xs text-[#1E1B33]/50 dark:text-gray-500">
                          <span>⚙️ 자동화</span>
                          <span>•</span>
                          <span>2일 전</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="text-center pt-6 border-t-2 border-[#AFA6FF]/30">
                <p className="text-sm text-[#1E1B33]/70 dark:text-gray-400 mb-4">
                  지금 시작하면 <span className="font-bold text-[#6A5CFF]">10 크레딧</span>을 무료로 드려요!
                </p>
                <Link
                  href={user ? "/beta/dashboard" : "/beta/dashboard"}
                  className="inline-block bg-gradient-to-r from-purple-600 via-[#6A5CFF] to-indigo-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all"
                >
                  {user ? "⚡ 내 WorkFree 허브로 이동" : "🚀 지금 칼퇴 클릭"}
                </Link>
              </div>
            </div>
          </FadeIn>

          {/* 추가 혜택 */}
          <FadeIn delay={0.4}>
            <div className="mt-12 grid md:grid-cols-3 gap-6">
              <div className="text-center p-6">
                <div className="text-4xl mb-3">🎯</div>
                <h4 className="font-bold text-[#1E1B33] dark:text-white mb-2">
                  맞춤형 추천
                </h4>
                <p className="text-sm text-[#1E1B33]/70 dark:text-gray-400">
                  사용 패턴 분석으로 필요한 자동화를 추천
                </p>
              </div>

              <div className="text-center p-6">
                <div className="text-4xl mb-3">📱</div>
                <h4 className="font-bold text-[#1E1B33] dark:text-white mb-2">
                  모바일 최적화
                </h4>
                <p className="text-sm text-[#1E1B33]/70 dark:text-gray-400">
                  언제 어디서나 내 대시보드 확인 가능
                </p>
              </div>

              <div className="text-center p-6">
                <div className="text-4xl mb-3">🔔</div>
                <h4 className="font-bold text-[#1E1B33] dark:text-white mb-2">
                  실시간 알림
                </h4>
                <p className="text-sm text-[#1E1B33]/70 dark:text-gray-400">
                  작업 완료 시 즉시 알림으로 확인
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 크레딧으로 절약하는 시간과 비용 */}
      <section id="savings" className="py-24 px-6 bg-[#ede7ff]">
        <div className="container mx-auto max-w-6xl">
          <FadeIn>
            <div className="text-center mb-4">
              <span className="inline-block bg-[#6A5CFF] text-white px-5 py-2 rounded-full text-sm font-bold mb-6">
                ⏰ 시간 단축 효과
              </span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-center mb-6 text-[#1E1B33]">
              매일 137분,<br />자동화로 돌려드립니다
            </h2>
            <p className="text-center text-[#1E1B33]/70 mb-20 text-lg">
              크레딧 1개로 평균 30분, 약 10,000원 절약 효과
            </p>
          </FadeIn>

          <StaggerContainer staggerDelay={0.15} className="grid md:grid-cols-2 gap-8 mb-16">
            <StaggerItem>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-10 rounded-3xl border-2 border-purple-100 dark:border-purple-900">
              <h3 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
                💰 절약 계산기
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-5 bg-white/80 dark:bg-gray-800/80 rounded-xl">
                  <span className="font-semibold text-gray-700 dark:text-gray-300 text-[17px]">크레딧 1개 비용</span>
                  <span className="font-bold text-purple-600 dark:text-purple-400 text-xl">₩30</span>
                </div>
                <div className="flex items-center justify-between p-5 bg-white/80 dark:bg-gray-800/80 rounded-xl">
                  <span className="font-semibold text-gray-700 dark:text-gray-300 text-[17px]">평균 절약 시간</span>
                  <span className="font-bold text-pink-600 dark:text-pink-400 text-xl">30분/사용</span>
                </div>
                <div className="flex items-center justify-between p-5 bg-white/80 dark:bg-gray-800/80 rounded-xl">
                  <span className="font-semibold text-gray-700 dark:text-gray-300 text-[17px]">시간당 환산 금액</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400 text-xl">₩20,000</span>
                </div>
                <div className="p-6 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 rounded-xl text-white">
                  <div className="text-sm mb-2 opacity-90">월 10회 사용 시 절약 효과</div>
                  <div className="text-4xl font-bold">₩100,000+</div>
                  <div className="text-sm mt-2 opacity-90">5시간 절약</div>
                </div>
              </div>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="bg-gradient-to-br from-blue-50 to-teal-50 dark:from-blue-900/20 dark:to-teal-900/20 p-10 rounded-3xl border-2 border-blue-100 dark:border-blue-900">
              <h3 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
                ✅ 사용자 혜택
              </h3>
              <ul className="space-y-5">
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white text-[18px]">즉시 실행</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">바로 사용 가능</div>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white text-[18px]">자동 시간 절약 통계</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">대시보드에서 한눈에 확인</div>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white text-[18px]">크레딧 이월 가능</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">남은 크레딧 다음달 사용</div>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white text-[18px]">무료 크레딧 보상</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">후기/공유 시 추가 지급</div>
                  </div>
                </li>
              </ul>
              </div>
            </StaggerItem>
          </StaggerContainer>

          <FadeIn delay={0.2}>
            <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 p-12 md:p-16 rounded-3xl text-white shadow-2xl">
            <div className="max-w-3xl mx-auto text-center">
              <h3 className="text-4xl font-bold mb-6">지금 무료로 시작하세요</h3>
              <p className="text-xl mb-10 opacity-90">
                베타 테스터 가입 시 무료 크레딧 10개 즉시 지급
              </p>
              <Link
                href="/signup"
                className="inline-block bg-white text-purple-600 px-12 py-5 rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all"
              >
                🎁 무료로 시작하기 →
              </Link>
            </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 리뷰 섹션 */}
      <section className="py-24 px-6 bg-[#f5f0ff]">
        <div className="container mx-auto max-w-6xl">
          <FadeIn>
            <h2 className="text-5xl md:text-6xl font-bold text-center mb-6 text-[#1E1B33]">
              실제 사용자 리뷰
            </h2>
            <p className="text-center text-[#1E1B33]/70 mb-20 text-lg">
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
                &quot;사용법이 너무 간단해서 비개발자인 제가 5분 만에 적용했습니다!&quot;
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
      <section className="py-24 px-6 bg-white">
        <div className="container mx-auto max-w-3xl">
          <FadeIn>
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 md:p-12 border-2 border-purple-200 dark:border-purple-800">
              <div className="text-center mb-8">
                <div className={`inline-block ${isBetaFull ? 'bg-gradient-to-r from-gray-500 to-gray-600' : 'bg-gradient-to-r from-green-500 to-emerald-500'} text-white px-6 py-2 rounded-full text-sm font-bold mb-6`}>
                  {isBetaFull ? '🔒 베타테스트 마감' : '🎉 베타테스터 모집 중'}
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4" id="beta">
                  {isBetaFull ? '베타테스트가 마감되었습니다' : '베타 테스터 모집'}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                  {isBetaFull ? (
                    <>정식 버전 런칭 시 이메일로 안내드릴게요!</>
                  ) : (
                    <>
                      회원가입만 하면 <span className="font-bold text-purple-600">무료 크레딧 10개</span>를 즉시 지급합니다<br />
                      (1개월 유효 • 후기 작성 시 추가 크레딧 보상)
                    </>
                  )}
                </p>
                
                {/* 데모 체험 버튼 */}
                <div className="mb-6">
                  <Link
                    href="/beta/dashboard"
                    className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:scale-105 transition-all"
                  >
                    🚶‍♀️ 퇴근 여정 데모 체험하기
                  </Link>
                  <p className="text-sm text-gray-500 mt-2">
                    로그인 없이 바로 체험해보세요!
                  </p>
                </div>
                
                {!isBetaFull && (
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 mb-6">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-3 text-xl">
                      🎁 베타 테스터 혜택
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4 text-left">
                      <div className="flex items-start gap-2">
                        <span className="text-xl">💎</span>
                        <div className="text-sm">
                          <div className="font-semibold text-gray-900 dark:text-white">무료 크레딧 10개</div>
                          <div className="text-gray-600 dark:text-gray-400">웹에서 바로 실행</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-xl">✍️</span>
                        <div className="text-sm">
                          <div className="font-semibold text-gray-900 dark:text-white">후기 작성 +5 크레딧</div>
                          <div className="text-gray-600 dark:text-gray-400">사용 후 리뷰 남기기</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-xl">📱</span>
                        <div className="text-sm">
                          <div className="font-semibold text-gray-900 dark:text-white">SNS 공유 +10 크레딧</div>
                          <div className="text-gray-600 dark:text-gray-400">친구에게 알리기</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-xl">🏅</span>
                        <div className="text-sm">
                          <div className="font-semibold text-gray-900 dark:text-white">베타 테스터 뱃지</div>
                          <div className="text-gray-600 dark:text-gray-400">전용 배지 제공</div>
                        </div>
                      </div>
                    </div>
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
                          : 'bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white hover:shadow-2xl hover:scale-[1.02]'
                      }`}
                    >
                      {isBetaFull ? '🔒 마감됨' : '🎁 무료로 시작하기 (10 크레딧)'}
                    </button>

                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                      {isBetaFull ? '정식 출시 시 알려드리겠습니다' : '회원가입 후 크레딧이 자동 지급됩니다'}
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
                      무료 크레딧 10개가 지급되었습니다! 마이페이지에서 확인하세요.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Link
                        href="/beta/dashboard"
                        className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white px-8 py-3 rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all text-center"
                      >
                        🚶‍♀️ 퇴근 여정 체험하기
                      </Link>
                      <Link
                        href="/tools"
                        className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-8 py-3 rounded-xl font-bold border-2 border-gray-300 dark:border-gray-700 hover:shadow-xl hover:scale-105 transition-all text-center"
                      >
                        🛠️ 도구 사용하기
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
      <section className="py-24 px-6 bg-[#6A5CFF]">
        <div className="container mx-auto max-w-4xl text-center text-white">
          <FadeIn delay={0.1}>
            <h2 className="text-5xl md:text-6xl font-bold mb-8">
              퇴근을 앞당기는
              <br />
              가장 확실한 방법.
            </h2>
          </FadeIn>
          <FadeIn delay={0.3}>
            <p className="text-2xl md:text-3xl mb-14 opacity-95">
              WorkFree — 당신의 시간을 되찾는 AI 자동화 스튜디오
            </p>
          </FadeIn>
          <FadeIn delay={0.5}>
            <div className="flex gap-5 justify-center flex-wrap">
            <Link
              href="#kits"
              className="bg-white text-indigo-600 px-12 py-5 rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all"
            >
              서비스 둘러보기
            </Link>
            {user ? (
              <Link
                href="/beta/dashboard"
                className="bg-transparent border-3 border-white text-white px-12 py-5 rounded-full font-bold text-lg hover:bg-white hover:text-indigo-600 transition-all"
              >
                🚶‍♀️ 퇴근 여정 체험하기
              </Link>
            ) : (
              <Link
                href="/signup"
                className="bg-transparent border-3 border-white text-white px-12 py-5 rounded-full font-bold text-lg hover:bg-white hover:text-indigo-600 transition-all"
              >
                무료 시작하기
              </Link>
            )}
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
              <p className="text-gray-400 text-sm leading-relaxed mb-3">
                당신의 시간을 되찾는 AI 자동화 스튜디오
              </p>
              <p className="text-gray-500 text-xs leading-relaxed">
                클릭 한 번으로 끝. 자동화의 모든 것, 한 곳에.
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
                  <Link href="/my/credits" className="hover:text-white transition-colors">
                    크레딧
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
                    사용 가이드
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

      {/* 룰렛 팝업 - 첫 방문자에게만 자동 표시 */}
      <RoulettePopup />
    </div>
  );
}
