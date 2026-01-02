"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { signOut } from "@/lib/firebase";
import { useAuthStore } from "@/store/authStore";
import { CreditBalance } from "@/components/CreditBalance";

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
            {/* 📰 뉴스 브리핑 - 메인 메뉴로 승격! */}
            <Link
              href="/tools/search-crawler"
              className="text-[#1E1B33] hover:text-[#6A5CFF] transition-colors font-bold text-[14px] flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#AFA6FF]/10"
            >
              📰 뉴스 브리핑
              <span className="text-[10px] bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2 py-0.5 rounded-full font-bold animate-pulse">NEW</span>
            </Link>

            {/* 🤖 AI 크리에이티브 - 활성화된 도구만 표시 */}
                <Link
                  href="/tools/blog-generator"
              className="text-[#1E1B33] hover:text-[#6A5CFF] transition-colors font-medium text-[14px] flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#AFA6FF]/10"
                >
                  ✍️ AI 블로그 생성
                </Link>
                
            {/* 💱 환율 자동 공유 - 활성화된 도구만 표시 */}
                <Link
                  href="/tools/exchange-rate"
              className="text-[#1E1B33] hover:text-[#6A5CFF] transition-colors font-medium text-[14px] flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#AFA6FF]/10"
                >
              💱 환율 자동 공유
                </Link>
                
            {/* 📱 QR 생성기 - 활성화된 도구만 표시 */}
                <Link
                  href="/tools/qr-generator"
              className="text-[#1E1B33] hover:text-[#6A5CFF] transition-colors font-medium text-[14px] flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#AFA6FF]/10"
                >
                  📱 QR 생성기
                </Link>

            {/* 🛒 마켓 */}
            <Link
              href="/kits"
              className="text-[#1E1B33] hover:text-[#6A5CFF] transition-colors font-medium text-[14px] flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#AFA6FF]/10"
            >
              🛒 마켓
            </Link>
            
            {!isLoading && (
              <>
                {user ? (
                  <>
                    {/* 크레딧 표시 */}
                    <CreditBalance />
                    
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
                  </>
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
              {/* 📰 뉴스 브리핑 - 맨 위로! */}
              <Link
                href="/tools/search-crawler"
                className="text-left px-4 py-2.5 text-[#1E1B33] bg-gradient-to-r from-green-50 to-emerald-50 hover:bg-[#AFA6FF]/10 hover:text-[#6A5CFF] rounded-lg transition-colors font-bold border-2 border-green-200 flex items-center justify-between"
                onClick={() => setShowMobileMenu(false)}
              >
                <span>📰 뉴스 브리핑</span>
                <span className="text-[10px] bg-green-500 text-white px-2 py-0.5 rounded-full">NEW</span>
              </Link>

              <div className="px-4 py-2 text-[#6A5CFF] text-xs font-bold uppercase tracking-wider mt-2">
                도구
              </div>
              {/* 실제 작동하는 도구들 */}
              <Link
                href="/tools/blog-generator"
                className="text-left px-4 py-2.5 text-[#1E1B33] hover:bg-[#AFA6FF]/10 hover:text-[#6A5CFF] rounded-lg transition-colors font-medium"
                onClick={() => setShowMobileMenu(false)}
              >
                ✍️ 블로그 생성기
              </Link>
              <Link
                href="/tools/qr-generator"
                className="text-left px-4 py-2.5 text-[#1E1B33] hover:bg-[#AFA6FF]/10 hover:text-[#6A5CFF] rounded-lg transition-colors font-medium"
                onClick={() => setShowMobileMenu(false)}
              >
                📱 QR 생성기
              </Link>
              <Link
                href="/tools/exchange-rate"
                className="text-left px-4 py-2.5 text-[#1E1B33] hover:bg-[#AFA6FF]/10 hover:text-[#6A5CFF] rounded-lg transition-colors font-medium"
                onClick={() => setShowMobileMenu(false)}
              >
                💱 환율 자동 공유
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


