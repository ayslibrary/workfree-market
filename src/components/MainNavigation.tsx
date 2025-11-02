"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { signOut } from "@/lib/firebase";
import { useAuthStore } from "@/store/authStore";

export default function MainNavigation() {
  const { user, isLoading } = useAuth();
  const { clearUser } = useAuthStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleSignOut = async () => {
    // Firebase/데모 로그아웃
    await signOut();
    
    // 상태 관리 초기화
    clearUser();
    
    // UI 초기화
    setShowUserMenu(false);
    
    // 홈으로 리다이렉트
    window.location.href = '/';
  };

  return (
    <nav className="fixed top-0 w-full bg-[#f5f0ff]/95 backdrop-blur-lg z-50 shadow-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10">
              <Image 
                src="/workfree-logo.png" 
                alt="WorkFree Market - AI 실무 자동화 스튜디오 로고" 
                width={40}
                height={40}
                priority
                className="transition-transform group-hover:scale-110"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <div className="text-xl font-bold text-[#1E1B33]">
                  WorkFree Market
                </div>
                <span className="bg-[#FF9A7A] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                  Beta
                </span>
              </div>
              <div className="text-xs text-[#1E1B33]/70 font-bold">
                AI 실무 자동화 스튜디오
              </div>
            </div>
          </Link>

          {/* 데스크톱 메뉴 */}
          <div className="hidden md:flex gap-6 items-center">
            {/* 도구 드롭다운 (통합) */}
            <div className="relative group">
              <button className="text-[#1E1B33] hover:text-[#6A5CFF] transition-colors font-medium text-[14px] flex items-center gap-1">
                도구
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute left-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border-2 border-[#AFA6FF] py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <Link
                  href="/tools/blog-generator"
                  className="block px-4 py-2.5 text-[#1E1B33] hover:bg-[#AFA6FF]/20 hover:text-[#6A5CFF] transition-colors text-[14px] font-medium"
                >
                  📰 블로그 생성기
                </Link>
                <Link
                  href="/gallery"
                  className="block px-4 py-2.5 text-[#1E1B33] hover:bg-[#AFA6FF]/20 hover:text-[#6A5CFF] transition-colors text-[14px] font-medium"
                >
                  🖼️ AI 갤러리
                </Link>
                <Link
                  href="/automation/steps"
                  className="block px-4 py-2.5 text-[#1E1B33] hover:bg-[#AFA6FF]/20 hover:text-[#6A5CFF] transition-colors text-[14px] font-medium"
                >
                  ⚙️ 자동화 스텝
                </Link>
                <Link
                  href="/tools/search-crawler"
                  className="block px-4 py-2.5 text-[#1E1B33] hover:bg-[#AFA6FF]/20 hover:text-[#6A5CFF] transition-colors text-[14px] font-medium"
                >
                  📰 뉴스 자동 크롤링
                </Link>
                <Link
                  href="/tools/report-generator"
                  className="block px-4 py-2.5 text-[#1E1B33] hover:bg-[#AFA6FF]/20 hover:text-[#6A5CFF] transition-colors text-[14px] font-medium"
                >
                  📋 AI 보고서 생성기
                </Link>
                <hr className="my-2 border-[#AFA6FF]/30" />
                <Link
                  href="/automation/microsoft"
                  className="block px-4 py-2.5 text-[#1E1B33] hover:bg-[#AFA6FF]/20 hover:text-[#6A5CFF] transition-colors text-[14px] font-medium"
                >
                  📊 Microsoft 자동화
                </Link>
                <Link
                  href="/automation/crawling"
                  className="block px-4 py-2.5 text-[#1E1B33] hover:bg-[#AFA6FF]/20 hover:text-[#6A5CFF] transition-colors text-[14px] font-medium"
                >
                  🕷️ 웹 크롤링
                </Link>
                <Link
                  href="/automation/visualization"
                  className="block px-4 py-2.5 text-[#1E1B33] hover:bg-[#AFA6FF]/20 hover:text-[#6A5CFF] transition-colors text-[14px] font-medium"
                >
                  📈 데이터 시각화
                </Link>
                <Link
                  href="/automation/prompts"
                  className="block px-4 py-2.5 text-[#1E1B33] hover:bg-[#AFA6FF]/20 hover:text-[#6A5CFF] transition-colors text-[14px] font-medium"
                >
                  🤖 AI 프롬프트
                </Link>
              </div>
            </div>

            {/* 커뮤니티 드롭다운 */}
            <div className="relative group">
              <button className="text-[#1E1B33] hover:text-[#6A5CFF] transition-colors font-medium text-[14px] flex items-center gap-1">
                커뮤니티
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute left-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border-2 border-[#AFA6FF] py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <Link
                  href="/community"
                  className="block px-4 py-2.5 text-[#1E1B33] hover:bg-[#AFA6FF]/20 hover:text-[#6A5CFF] transition-colors text-[14px] font-medium"
                >
                  💬 커뮤니티 홈
                </Link>
                <Link
                  href="/community/lounge"
                  className="block px-4 py-2.5 text-[#1E1B33] hover:bg-[#AFA6FF]/20 hover:text-[#6A5CFF] transition-colors text-[14px] font-medium"
                >
                  🗨️ 직장인 라운지
                </Link>
                <Link
                  href="/community/career"
                  className="block px-4 py-2.5 text-[#1E1B33] hover:bg-[#AFA6FF]/20 hover:text-[#6A5CFF] transition-colors text-[14px] font-medium"
                >
                  🚀 커리어
                </Link>
              </div>
            </div>

            {/* 마켓 링크 */}
            <Link
              href="/kits"
              className="text-[#1E1B33] hover:text-[#6A5CFF] transition-colors font-medium text-[14px]"
            >
              마켓
            </Link>
            
            <Link
              href="/my/credits"
              className="text-[#1E1B33] hover:text-[#6A5CFF] transition-colors font-medium text-[14px]"
            >
              크레딧
            </Link>
            
            {!isLoading && (
              <>
                {user ? (
                  <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center gap-2 bg-[#6A5CFF] text-white px-5 py-2.5 rounded-full font-bold hover:shadow-lg hover:scale-105 transition-all text-[16px]"
                    >
                      <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold">{user.displayName?.[0] || 'U'}</span>
                      </div>
                      <span>{user.displayName || '사용자'}</span>
                    </button>
                    
                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border-2 border-[#AFA6FF] py-2 z-50">
                        <Link
                          href="/my/dashboard"
                          className="block px-4 py-2.5 text-[#1E1B33] hover:bg-[#AFA6FF]/20 hover:text-[#6A5CFF] transition-colors text-[14px] font-medium"
                          onClick={() => setShowUserMenu(false)}
                        >
                          📊 마이페이지
                        </Link>
                        <Link
                          href="/my/credits"
                          className="block px-4 py-2.5 text-[#1E1B33] hover:bg-[#AFA6FF]/20 hover:text-[#6A5CFF] transition-colors text-[14px] font-medium"
                          onClick={() => setShowUserMenu(false)}
                        >
                          💎 크레딧 관리
                        </Link>
                        <Link
                          href="/my/blog-history"
                          className="block px-4 py-2.5 text-[#1E1B33] hover:bg-[#AFA6FF]/20 hover:text-[#6A5CFF] transition-colors text-[14px] font-medium"
                          onClick={() => setShowUserMenu(false)}
                        >
                          📝 블로그 이력
                        </Link>
                        <hr className="my-2 border-[#AFA6FF]/30" />
                        <Link
                          href="/about"
                          className="block px-4 py-2.5 text-[#1E1B33] hover:bg-[#AFA6FF]/20 hover:text-[#6A5CFF] transition-colors text-[14px] font-medium"
                          onClick={() => setShowUserMenu(false)}
                        >
                          ℹ️ 소개
                        </Link>
                        <Link
                          href="/feedback"
                          className="block px-4 py-2.5 text-[#1E1B33] hover:bg-[#AFA6FF]/20 hover:text-[#6A5CFF] transition-colors text-[14px] font-medium"
                          onClick={() => setShowUserMenu(false)}
                        >
                          💌 피드백 보내기
                        </Link>
                        <hr className="my-2 border-[#AFA6FF]/30" />
                        <button
                          onClick={handleSignOut}
                          className="w-full text-left px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors text-[14px] font-medium"
                        >
                          🚪 로그아웃
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="bg-[#6A5CFF] text-white px-6 py-2.5 rounded-full font-bold hover:shadow-lg hover:scale-105 transition-all inline-block text-[16px]"
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
            className="md:hidden p-2 text-[#1E1B33]"
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
          <div className="md:hidden mt-4 pb-4 border-t border-[#AFA6FF]/30 pt-4">
            <div className="flex flex-col gap-2">
              {/* 도구 섹션 (통합) */}
              <div className="px-4 py-2 text-[#6A5CFF] text-xs font-bold uppercase tracking-wider">
                도구
              </div>
              <Link
                href="/tools/blog-generator"
                className="text-left px-4 py-2.5 text-[#1E1B33] hover:bg-[#AFA6FF]/10 hover:text-[#6A5CFF] rounded-lg transition-colors font-medium"
                onClick={() => setShowMobileMenu(false)}
              >
                블로그 생성기
              </Link>
              <Link
                href="/gallery"
                className="text-left px-4 py-2.5 text-[#1E1B33] hover:bg-[#AFA6FF]/10 hover:text-[#6A5CFF] rounded-lg transition-colors font-medium"
                onClick={() => setShowMobileMenu(false)}
              >
                AI 갤러리
              </Link>
              <Link
                href="/automation/steps"
                className="text-left px-4 py-2.5 text-[#1E1B33] hover:bg-[#AFA6FF]/10 hover:text-[#6A5CFF] rounded-lg transition-colors font-medium"
                onClick={() => setShowMobileMenu(false)}
              >
                자동화 스텝
              </Link>
              <Link
                href="/tools/search-crawler"
                className="text-left px-4 py-2.5 text-[#1E1B33] hover:bg-[#AFA6FF]/10 hover:text-[#6A5CFF] rounded-lg transition-colors font-medium"
                onClick={() => setShowMobileMenu(false)}
              >
                📰 뉴스 자동 크롤링
              </Link>
              <Link
                href="/tools/report-generator"
                className="text-left px-4 py-2.5 text-[#1E1B33] hover:bg-[#AFA6FF]/10 hover:text-[#6A5CFF] rounded-lg transition-colors font-medium"
                onClick={() => setShowMobileMenu(false)}
              >
                📋 AI 보고서 생성기
              </Link>
              <Link
                href="/automation/microsoft"
                className="text-left px-4 py-2.5 text-[#1E1B33] hover:bg-[#AFA6FF]/10 hover:text-[#6A5CFF] rounded-lg transition-colors font-medium"
                onClick={() => setShowMobileMenu(false)}
              >
                Microsoft 자동화
              </Link>
              <Link
                href="/automation/crawling"
                className="text-left px-4 py-2.5 text-[#1E1B33] hover:bg-[#AFA6FF]/10 hover:text-[#6A5CFF] rounded-lg transition-colors font-medium"
                onClick={() => setShowMobileMenu(false)}
              >
                웹 크롤링
              </Link>
              <Link
                href="/automation/visualization"
                className="text-left px-4 py-2.5 text-[#1E1B33] hover:bg-[#AFA6FF]/10 hover:text-[#6A5CFF] rounded-lg transition-colors font-medium"
                onClick={() => setShowMobileMenu(false)}
              >
                데이터 시각화
              </Link>
              <Link
                href="/automation/prompts"
                className="text-left px-4 py-2.5 text-[#1E1B33] hover:bg-[#AFA6FF]/10 hover:text-[#6A5CFF] rounded-lg transition-colors font-medium"
                onClick={() => setShowMobileMenu(false)}
              >
                AI 프롬프트
              </Link>

              {/* 커뮤니티 섹션 */}
              <div className="px-4 py-2 text-[#6A5CFF] text-xs font-bold uppercase tracking-wider mt-2">
                커뮤니티
              </div>
              <Link
                href="/community"
                className="text-left px-4 py-2.5 text-[#1E1B33] hover:bg-[#AFA6FF]/10 hover:text-[#6A5CFF] rounded-lg transition-colors font-medium"
                onClick={() => setShowMobileMenu(false)}
              >
                커뮤니티 홈
              </Link>
              <Link
                href="/community/lounge"
                className="text-left px-4 py-2.5 text-[#1E1B33] hover:bg-[#AFA6FF]/10 hover:text-[#6A5CFF] rounded-lg transition-colors font-medium"
                onClick={() => setShowMobileMenu(false)}
              >
                직장인 라운지
              </Link>
              <Link
                href="/community/career"
                className="text-left px-4 py-2.5 text-[#1E1B33] hover:bg-[#AFA6FF]/10 hover:text-[#6A5CFF] rounded-lg transition-colors font-medium"
                onClick={() => setShowMobileMenu(false)}
              >
                커리어
              </Link>

              {/* 기타 */}
              <hr className="my-2 border-[#AFA6FF]/30" />
              <Link
                href="/kits"
                className="text-left px-4 py-2.5 text-[#1E1B33] hover:bg-[#AFA6FF]/10 hover:text-[#6A5CFF] rounded-lg transition-colors font-medium"
                onClick={() => setShowMobileMenu(false)}
              >
                키트 마켓
              </Link>
              <Link
                href="/my/credits"
                className="text-left px-4 py-2.5 text-[#1E1B33] hover:bg-[#AFA6FF]/10 hover:text-[#6A5CFF] rounded-lg transition-colors font-medium"
                onClick={() => setShowMobileMenu(false)}
              >
                크레딧
              </Link>
              <Link
                href="/about"
                className="text-left px-4 py-2.5 text-[#1E1B33] hover:bg-[#AFA6FF]/10 hover:text-[#6A5CFF] rounded-lg transition-colors font-medium"
                onClick={() => setShowMobileMenu(false)}
              >
                소개
              </Link>
              {user && (
                <>
                  <Link
                    href="/my/dashboard"
                    className="text-left px-4 py-2.5 text-[#1E1B33] hover:bg-[#AFA6FF]/10 hover:text-[#6A5CFF] rounded-lg transition-colors font-medium"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    마이페이지
                  </Link>
                  <Link
                    href="/feedback"
                    className="text-left px-4 py-2.5 text-[#1E1B33] hover:bg-[#AFA6FF]/10 hover:text-[#6A5CFF] rounded-lg transition-colors font-medium"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    피드백 보내기
                  </Link>
                </>
              )}
              {!isLoading && !user && (
                <Link
                  href="/login"
                  className="mt-2 bg-[#6A5CFF] text-white px-6 py-3 rounded-full font-bold text-center hover:shadow-lg hover:scale-105 transition-all"
                  onClick={() => setShowMobileMenu(false)}
                >
                  로그인
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}


