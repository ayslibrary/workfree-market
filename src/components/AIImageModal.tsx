'use client';

import Link from 'next/link';

interface AIImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  image: {
    id: string;
    title: string;
    description: string;
    prompt: string;
    category: string;
    price: number;
    imageUrl?: string;
    difficulty: string;
  };
}

export default function AIImageModal({ isOpen, onClose, image }: AIImageModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-900 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="grid md:grid-cols-2 gap-0">
          {/* 왼쪽: 이미지 */}
          <div className="bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 p-8 flex items-center justify-center relative rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none">
            <div className="aspect-[3/4] w-full bg-gradient-to-br from-purple-200 to-pink-200 dark:from-purple-800 to-pink-800 rounded-2xl flex items-center justify-center relative overflow-hidden shadow-xl">
              {image.imageUrl ? (
                <img 
                  src={image.imageUrl} 
                  alt={image.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center">
                  <div className="text-6xl mb-4">✨</div>
                  <p className="text-gray-600 dark:text-gray-400 font-medium">
                    AI Generated Image
                  </p>
                </div>
              )}
            </div>
            
            {/* 배지 */}
            <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-purple-600 dark:text-purple-400 shadow-lg">
              {image.category}
            </div>
          </div>

          {/* 오른쪽: 정보 */}
          <div className="p-8 flex flex-col">
            {/* 닫기 버튼 */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 md:top-8 md:right-8 w-10 h-10 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full flex items-center justify-center transition-all"
            >
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex-1">
              {/* 타이틀 */}
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 pr-8">
                {image.title}
              </h2>

              {/* 난이도 배지 */}
              <div className="mb-6">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                  image.difficulty === '초급' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                  image.difficulty === '중급' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                  'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {image.difficulty}
                </span>
              </div>

              {/* 설명 */}
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                {image.description}
              </p>

              {/* 프롬프트 미리보기 */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-6">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <span>💡</span>
                  프롬프트 미리보기
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                  {image.prompt}
                </p>
              </div>

              {/* 포함 내용 */}
              <div className="mb-6">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">
                  📦 포함 내용
                </h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    완성된 프롬프트 템플릿
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    커스터마이징 가이드
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    결과물 예시 이미지
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    영상 튜토리얼
                  </li>
                </ul>
              </div>
            </div>

            {/* CTA 버튼들 */}
            <div className="space-y-3 pt-6 border-t border-gray-200 dark:border-gray-700">
              {/* 가격 */}
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  ₩{image.price.toLocaleString()}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                  ₩49,900
                </span>
                <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold px-2 py-1 rounded">
                  {Math.round((1 - image.price / 49900) * 100)}% OFF
                </span>
              </div>

              <Link
                href={`/checkout?item=${image.id}&price=${image.price}`}
                className="block w-full bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white text-center py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-[1.02] transition-all"
              >
                🎨 이렇게 만들기
              </Link>

              <button
                onClick={onClose}
                className="w-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 py-3 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
              >
                둘러보기
              </button>
            </div>

            {/* 안내 문구 */}
            <p className="text-xs text-gray-500 dark:text-gray-500 text-center mt-4">
              💡 7일 환불 보장 • 평생 무료 업데이트
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

