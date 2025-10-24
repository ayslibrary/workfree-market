'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import MainNavigation from '@/components/MainNavigation';
import { FadeIn } from '@/components/animations';

export default function WriteReviewPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    service: '',
    rating: 5,
    title: '',
    content: '',
    pros: '',
    cons: '',
    suggestedPrice: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const services = [
    'PDF → Word 변환',
    'Outlook 자동 회신',
    'AI 화보 생성',
    'Excel 데이터 처리',
    '텍스트 일괄 변환',
    '이메일 자동화',
    '기타',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // 시뮬레이션: 실제로는 서버에 전송
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setShowSuccess(true);

    // 3초 후 리다이렉트
    setTimeout(() => {
      router.push('/my/dashboard');
    }, 3000);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-purple-50/30 to-white">
        <MainNavigation />
        <div className="max-w-2xl mx-auto px-4 py-20 text-center pt-28">
          <div className="bg-white rounded-3xl shadow-2xl p-12 border-2 border-green-200">
            <div className="text-6xl mb-6">🎉</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              후기 작성 완료!
            </h2>
            <p className="text-xl text-gray-600 mb-6">
              소중한 의견 감사합니다!
            </p>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200 mb-6">
              <p className="text-2xl font-bold text-green-600 mb-2">
                +5 크레딧 적립!
              </p>
              <p className="text-sm text-gray-600">
                후기 작성 보상이 지급되었습니다
              </p>
            </div>
            <p className="text-gray-500 text-sm">
              잠시 후 마이페이지로 이동합니다...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-purple-50/30 to-white">
      <MainNavigation />

      <div className="max-w-3xl mx-auto px-4 md:px-6 py-12 pt-28">
        {/* 헤더 */}
        <FadeIn>
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              ✍️ 후기 작성하기
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              서비스 사용 경험을 공유해주세요
            </p>
            <div className="inline-block bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl px-6 py-3">
              <p className="text-lg font-bold text-green-600">
                🎁 후기 작성 시 +5 크레딧 지급!
              </p>
            </div>
          </div>
        </FadeIn>

        {/* 폼 */}
        <FadeIn delay={0.1}>
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border-2 border-gray-100">
            {/* 서비스 선택 */}
            <div className="mb-8">
              <label className="block text-lg font-bold text-gray-900 mb-3">
                사용한 서비스 <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.service}
                onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none text-gray-900"
              >
                <option value="">서비스를 선택하세요</option>
                {services.map((service) => (
                  <option key={service} value={service}>
                    {service}
                  </option>
                ))}
              </select>
            </div>

            {/* 별점 */}
            <div className="mb-8">
              <label className="block text-lg font-bold text-gray-900 mb-3">
                만족도 <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    className="text-4xl transition-transform hover:scale-110"
                  >
                    {star <= formData.rating ? '⭐' : '☆'}
                  </button>
                ))}
                <span className="ml-3 text-xl font-semibold text-gray-700">
                  {formData.rating}점
                </span>
              </div>
            </div>

            {/* 제목 */}
            <div className="mb-8">
              <label className="block text-lg font-bold text-gray-900 mb-3">
                제목 <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="한 줄로 요약해주세요"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none text-gray-900"
              />
            </div>

            {/* 상세 후기 */}
            <div className="mb-8">
              <label className="block text-lg font-bold text-gray-900 mb-3">
                상세 후기 <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="서비스를 사용하면서 느낀 점을 자세히 적어주세요 (최소 50자)"
                rows={6}
                minLength={50}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none resize-none text-gray-900"
              />
              <p className="text-sm text-gray-500 mt-2">
                {formData.content.length}자 / 최소 50자
              </p>
            </div>

            {/* 장점 */}
            <div className="mb-8">
              <label className="block text-lg font-bold text-gray-900 mb-3">
                👍 좋았던 점
              </label>
              <textarea
                value={formData.pros}
                onChange={(e) => setFormData({ ...formData, pros: e.target.value })}
                placeholder="서비스의 장점을 알려주세요"
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none resize-none text-gray-900"
              />
            </div>

            {/* 단점 */}
            <div className="mb-8">
              <label className="block text-lg font-bold text-gray-900 mb-3">
                👎 아쉬웠던 점
              </label>
              <textarea
                value={formData.cons}
                onChange={(e) => setFormData({ ...formData, cons: e.target.value })}
                placeholder="개선이 필요한 부분을 알려주세요"
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none resize-none text-gray-900"
              />
            </div>

            {/* 적정 가격 설문 */}
            <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200">
              <label className="block text-lg font-bold text-gray-900 mb-2">
                📊 크레딧 1개에 적정한 가격은? <span className="text-blue-600">(선택)</span>
              </label>
              <p className="text-sm text-gray-600 mb-4">
                정식 출시 시 참고할 예정입니다. 여러분의 의견이 큰 도움이 됩니다!
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['₩10', '₩30', '₩50', '₩100', '₩200', '₩300', '₩500', '기타'].map((price) => (
                  <button
                    key={price}
                    type="button"
                    onClick={() => setFormData({ ...formData, suggestedPrice: price })}
                    className={`
                      px-4 py-3 rounded-xl font-semibold transition-all
                      ${formData.suggestedPrice === price
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white scale-105'
                        : 'bg-white text-gray-700 hover:bg-blue-100'
                      }
                    `}
                  >
                    {price}
                  </button>
                ))}
              </div>
              {formData.suggestedPrice && (
                <p className="mt-3 text-sm text-blue-600 font-semibold">
                  선택하신 가격: {formData.suggestedPrice}
                </p>
              )}
            </div>

            {/* 제출 버튼 */}
            <div className="flex gap-4">
              <Link
                href="/my/dashboard"
                className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-200 transition-all text-center"
              >
                취소
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`
                  flex-1 py-4 rounded-xl font-bold transition-all text-white
                  ${isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg hover:scale-[1.02]'
                  }
                `}
              >
                {isSubmitting ? '작성 중...' : '후기 작성하고 +5 크레딧 받기'}
              </button>
            </div>
          </form>
        </FadeIn>

        {/* 안내 사항 */}
        <FadeIn delay={0.2}>
          <div className="mt-8 bg-blue-50 rounded-2xl p-6 border-2 border-blue-200">
            <h3 className="font-bold text-gray-900 mb-3">📝 후기 작성 안내</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• 솔직하고 상세한 후기를 작성해주세요</li>
              <li>• 최소 50자 이상 작성 시 크레딧이 지급됩니다</li>
              <li>• 동일 서비스는 1회만 후기 작성 가능합니다</li>
              <li>• 부적절한 내용은 삭제될 수 있습니다</li>
            </ul>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}

