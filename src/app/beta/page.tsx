"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations";
import { collection, addDoc, getDocs, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import RoulettePopup from "@/components/RoulettePopup";
import { getBetaStatus } from "@/types/beta-onboarding";

export default function BetaPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    job: "",
    environment: "",
    task: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showRoulette, setShowRoulette] = useState(false);
  const [currentParticipants, setCurrentParticipants] = useState(0);

  useEffect(() => {
    // 현재 베타 테스터 수 가져오기
    const fetchParticipants = async () => {
      try {
        const q = query(collection(db, "beta_testers"));
        const snapshot = await getDocs(q);
        setCurrentParticipants(snapshot.size);
      } catch (error) {
        console.error("Error fetching participants:", error);
      }
    };
    fetchParticipants();
  }, [submitted]);

  const betaStatus = getBetaStatus(currentParticipants);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Firebase Firestore에 저장
      await addDoc(collection(db, "beta_testers"), {
        ...formData,
        timestamp: new Date(),
      });

      console.log("Beta Tester Data:", formData);
      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        job: "",
        environment: "",
        task: "",
      });

      // 룰렛 팝업 표시
      setTimeout(() => setShowRoulette(true), 500);

      // 3초 후 다시 폼 표시
      setTimeout(() => setSubmitted(false), 3000);
    } catch (error) {
      console.error("Error submitting beta form:", error);
      alert("신청 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* 헤더 */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white text-xl font-bold">W</span>
            </div>
            <div className="text-xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              WorkFree Market
            </div>
          </Link>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-24 px-6 text-center relative overflow-hidden">
        <FadeIn>
          {/* 모집 현황 배너 */}
          {betaStatus.isOpen ? (
            <div className="mb-6">
              <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-lg px-6 py-3 rounded-full border-2 border-white/30">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="font-bold">모집 중</span>
                </div>
                <div className="w-px h-4 bg-white/30"></div>
                <span className="text-sm">
                  {betaStatus.spotsRemaining}자리 남음 / 100명
                </span>
                {betaStatus.daysUntilRecruitmentEnd > 0 && (
                  <>
                    <div className="w-px h-4 bg-white/30"></div>
                    <span className="text-sm">
                      ⏰ {betaStatus.daysUntilRecruitmentEnd}일 후 마감
                    </span>
                  </>
                )}
              </div>
            </div>
          ) : betaStatus.spotsRemaining === 0 ? (
            <div className="mb-6">
              <div className="inline-flex items-center gap-3 bg-red-500/90 backdrop-blur-lg px-6 py-3 rounded-full border-2 border-red-300">
                <span className="font-bold">🔒 모집 마감</span>
                <div className="w-px h-4 bg-white/30"></div>
                <span className="text-sm">100명 정원 마감</span>
              </div>
            </div>
          ) : (
            <div className="mb-6">
              <div className="inline-flex items-center gap-3 bg-orange-500/90 backdrop-blur-lg px-6 py-3 rounded-full border-2 border-orange-300">
                <span className="font-bold">⏰ 신규 모집 종료</span>
                <div className="w-px h-4 bg-white/30"></div>
                <span className="text-sm">기존 참가자 프로그램 진행 중</span>
              </div>
            </div>
          )}

          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            🚀 WorkFree Beta Test
          </h1>
          <p className="text-xl md:text-2xl opacity-95 mb-6">
            AI 자동화로 당신의 루틴을 바꿀 시간입니다.
          </p>

          {/* 베타 테스트 기간 안내 */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold mb-1">4주</div>
                  <div className="text-sm opacity-90">전체 기간</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-1">3주</div>
                  <div className="text-sm opacity-90">모집 기간</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-1">100명</div>
                  <div className="text-sm opacity-90">선착순</div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/20 text-sm opacity-90">
                💡 가입 후 7일간 개인별 프로그램 진행
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      <div className="container mx-auto px-6 py-16 max-w-4xl">
        {/* 신청 폼 섹션 */}
        <FadeIn delay={0.2}>
          <section className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl md:text-4xl font-bold text-indigo-600">
                베타테스터 신청
              </h2>
              <div className="text-right">
                <div className="text-2xl font-bold text-indigo-600">
                  {betaStatus.currentParticipants} / 100
                </div>
                <div className="text-sm text-gray-600">현재 참가자</div>
              </div>
            </div>
            <p className="text-center text-gray-600 text-lg leading-relaxed mb-4">
              실제 AI 도구를 무료로 체험하고, 크레딧 90개 (9만원 상당)를 받아가세요!
            </p>
            
            {/* 진행률 바 */}
            {betaStatus.isOpen && (
              <div className="mb-10">
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block text-indigo-600">
                        모집 진행률
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-indigo-600">
                        {Math.round((betaStatus.currentParticipants / 100) * 100)}%
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-3 mb-4 text-xs flex rounded-full bg-indigo-100">
                    <div
                      style={{ width: `${(betaStatus.currentParticipants / 100) * 100}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-500"
                    ></div>
                  </div>
                </div>
                {betaStatus.spotsRemaining <= 10 && betaStatus.spotsRemaining > 0 && (
                  <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-4 text-center">
                    <span className="text-orange-700 font-bold">
                      ⚠️ 마감 임박! 남은 자리 {betaStatus.spotsRemaining}개
                    </span>
                  </div>
                )}
              </div>
            )}

            {!betaStatus.isOpen ? (
              <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-8 text-center">
                <div className="text-6xl mb-4">
                  {betaStatus.spotsRemaining === 0 ? '🔒' : '⏰'}
                </div>
                <h3 className="text-2xl font-bold text-red-700 mb-2">
                  {betaStatus.spotsRemaining === 0 ? '모집이 마감되었습니다' : '신규 모집 기간이 종료되었습니다'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {betaStatus.spotsRemaining === 0 
                    ? '100명 정원이 모두 찼습니다. 다음 기회를 기다려주세요!'
                    : '3주 모집 기간이 종료되었습니다. 기존 참가자들의 프로그램이 진행 중입니다.'}
                </p>
                <Link
                  href="/"
                  className="inline-block bg-gray-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-all"
                >
                  홈으로 돌아가기
                </Link>
              </div>
            ) : submitted ? (
              <div className="bg-green-50 border-2 border-green-300 rounded-2xl p-8 text-center">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-2xl font-bold text-green-700 mb-2">
                  신청이 완료되었습니다!
                </h3>
                <p className="text-gray-600 mb-4">
                  WorkFree 베타테스터에 참여해주셔서 감사합니다.
                </p>
                <div className="bg-white rounded-xl p-4 mb-4">
                  <div className="text-sm text-gray-600 mb-2">참가 번호</div>
                  <div className="text-3xl font-bold text-indigo-600">
                    #{betaStatus.currentParticipants}
                  </div>
                </div>
                <Link
                  href="/beta/missions"
                  className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:scale-105 transition-all"
                >
                  🎮 미션 시작하기
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    👤 이름
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="홍길동"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    📧 이메일
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@company.com"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    🏢 직장/직무
                  </label>
                  <input
                    type="text"
                    name="job"
                    value={formData.job}
                    onChange={handleChange}
                    placeholder="예: 영업관리 / 회계 / 마케팅"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    💻 주요 사용 환경
                  </label>
                  <select
                    name="environment"
                    value={formData.environment}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors"
                  >
                    <option value="">선택해주세요</option>
                    <option value="windows">Windows</option>
                    <option value="mac">macOS</option>
                    <option value="google">Google Workspace</option>
                    <option value="microsoft">Microsoft 365</option>
                    <option value="other">기타</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    💬 WorkFree를 통해 자동화하고 싶은 업무
                  </label>
                  <textarea
                    name="task"
                    value={formData.task}
                    onChange={handleChange}
                    rows={4}
                    placeholder="예: 엑셀 보고서 자동작성, 메일 회신 자동화 등"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "📨 신청 중..." : "📨 신청 완료하기"}
                </button>
              </form>
            )}
          </section>
        </FadeIn>

        {/* 혜택 섹션 */}
        <FadeIn delay={0.3}>
          <section className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl shadow-xl p-8 md:p-12 mb-12 border-2 border-indigo-200">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-indigo-600 mb-4">
              🎁 베타테스터 혜택
            </h2>
            <p className="text-center text-gray-600 text-lg mb-4">
              가입 후 7일간 개인별 프로그램 진행!<br />
              최대 크레딧 90개 (9만원 상당) 드립니다.
            </p>
            <div className="text-center mb-8">
              <div className="inline-block bg-indigo-100 px-6 py-2 rounded-full">
                <span className="text-sm font-semibold text-indigo-700">
                  📅 모집 기간: 3주 (선착순 100명) · 전체 베타 기간: 4주
                </span>
              </div>
            </div>
            <StaggerContainer staggerDelay={0.1} className="space-y-4">
              <StaggerItem>
                <div className="flex items-start gap-4 bg-white p-6 rounded-xl border-2 border-indigo-100 hover:scale-[1.02] transition-transform">
                  <div className="text-3xl">⚡</div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900">
                      Day 1: 25분 체험 → 크레딧 30개 (3만원 상당)
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      가장 쉬운 도구로 빠르게 체험
                    </p>
                  </div>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="flex items-start gap-4 bg-white p-6 rounded-xl border-2 border-indigo-100 hover:scale-[1.02] transition-transform">
                  <div className="text-3xl">🎮</div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900">
                      Day 2-7: 선택 미션 → 최대 60개 더!
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      친구 초대, 리뷰 작성 등 원하는 것만 하세요
                    </p>
                  </div>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="flex items-start gap-4 bg-white p-6 rounded-xl border-2 border-indigo-100 hover:scale-[1.02] transition-transform">
                  <div className="text-3xl">🏆</div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900">
                      완주 시 평생 10% 할인권 + VIP 배지
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      정식 런칭 시 우선 혜택 제공
                    </p>
                  </div>
                </div>
              </StaggerItem>
            </StaggerContainer>

            <div className="mt-8 bg-white rounded-2xl p-6 border-2 border-indigo-200">
              <h3 className="font-bold text-gray-900 mb-3 text-center">📅 개인별 7일 프로그램</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm mb-4">
                <div className="bg-indigo-50 p-4 rounded-xl">
                  <div className="font-bold text-indigo-600 mb-2">✅ Day 1 (필수)</div>
                  <div className="text-gray-700">25분 집중 체험 → 크레딧 30개</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-xl">
                  <div className="font-bold text-purple-600 mb-2">🎁 Day 2-7 (선택)</div>
                  <div className="text-gray-700">자유 사용 + 보너스 → 최대 60개</div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4">
                <div className="text-center text-sm text-gray-700">
                  <div className="font-bold mb-2">💡 전체 베타 테스트 구조</div>
                  <div className="space-y-1 text-xs">
                    <div>📍 Week 1-3: 신규 모집 (선착순 100명)</div>
                    <div>📍 Week 4: 기존 참가자 프로그램 완료 기간</div>
                    <div className="pt-2 text-indigo-600 font-semibold">
                      가입일로부터 7일간 개인별 프로그램 진행!
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center mt-4 text-xs text-gray-600">
                부담 없어요! Day 1만 해도 크레딧 30개는 받아가세요 🎁
              </div>
            </div>
          </section>
        </FadeIn>

        {/* 다운로드 섹션 */}
        <FadeIn delay={0.4}>
          <section className="bg-white rounded-3xl shadow-xl p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              💾 베타 키트 다운로드
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              신청 후 바로 다운로드하실 수 있습니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/beta/missions"
                className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:scale-105 transition-all inline-block"
              >
                🎮 베타 미션 시작하기
              </Link>
              <Link
                href="/beta/dashboard"
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:scale-105 transition-all inline-block"
              >
                🚶‍♀️ 퇴근 여정 체험하기
              </Link>
              <Link
                href="/beta/feedback"
                className="bg-gray-900 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:scale-105 transition-all inline-block"
              >
                📝 피드백 남기기
              </Link>
            </div>
          </section>
        </FadeIn>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12 text-center text-gray-600">
        <p className="mb-2">© 2025 WorkFree — Work Less, Create More.</p>
        <p>문의: contact@workfree.ai</p>
      </footer>

      {/* 룰렛 팝업 */}
      {showRoulette && (
        <RoulettePopup
          onClose={() => setShowRoulette(false)}
          autoShow={false}
        />
      )}
    </div>
  );
}
