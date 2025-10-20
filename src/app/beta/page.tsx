"use client";

import { useState } from "react";
import Link from "next/link";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import RoulettePopup from "@/components/RoulettePopup";

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
      <section className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-24 px-6 text-center">
        <FadeIn>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            🚀 WorkFree Beta Test
          </h1>
          <p className="text-xl md:text-2xl opacity-95">
            AI 자동화로 당신의 루틴을 바꿀 시간입니다.
          </p>
        </FadeIn>
      </section>

      <div className="container mx-auto px-6 py-16 max-w-4xl">
        {/* 신청 폼 섹션 */}
        <FadeIn delay={0.2}>
          <section className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-indigo-600 mb-6">
              베타테스터 신청
            </h2>
            <p className="text-center text-gray-600 text-lg leading-relaxed mb-10">
              WorkFree는 현재 베타테스터를 모집 중입니다.<br />
              실제 키트를 무료로 체험하고, 당신의 효율화 경험을 들려주세요.
            </p>

            {submitted ? (
              <div className="bg-green-50 border-2 border-green-300 rounded-2xl p-8 text-center">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-2xl font-bold text-green-700 mb-2">
                  신청이 완료되었습니다!
                </h3>
                <p className="text-gray-600">
                  WorkFree 베타테스터에 참여해주셔서 감사합니다.
                </p>
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
            <h2 className="text-3xl md:text-4xl font-bold text-center text-indigo-600 mb-8">
              📈 베타테스터 혜택
            </h2>
            <StaggerContainer staggerDelay={0.1} className="space-y-4">
              <StaggerItem>
                <div className="flex items-start gap-4 bg-white p-6 rounded-xl border-2 border-indigo-100 hover:scale-[1.02] transition-transform">
                  <div className="text-3xl">✅</div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900">
                      WorkFree 자동화 키트 2종 무료 다운로드
                    </p>
                  </div>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="flex items-start gap-4 bg-white p-6 rounded-xl border-2 border-indigo-100 hover:scale-[1.02] transition-transform">
                  <div className="text-3xl">✅</div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900">
                      피드백 작성 시 정식 출시 후 50% 할인쿠폰 지급
                    </p>
                  </div>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="flex items-start gap-4 bg-white p-6 rounded-xl border-2 border-indigo-100 hover:scale-[1.02] transition-transform">
                  <div className="text-3xl">✅</div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900">
                      우수 후기자는 &quot;Featured User&quot; 섹션 노출
                    </p>
                  </div>
                </div>
              </StaggerItem>
            </StaggerContainer>
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
              <a
                href="/downloads/rpa-test.txt"
                download
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:scale-105 transition-all inline-block"
              >
                💾 테스트 키트 다운로드
              </a>
              <Link
                href="/feedback"
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
