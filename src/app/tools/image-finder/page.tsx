"use client";

import { useState } from "react";
import Link from "next/link";
import MainNavigation from "@/components/MainNavigation";
import { FadeIn } from "@/components/animations";

interface ImageResult {
  id: string;
  url: string;
  thumbnail_url: string;
  author: string;
  author_url: string;
  source: string;
  license: string;
}

export default function ImageFinderPage() {
  const [keyword, setKeyword] = useState("");
  const [count, setCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ImageResult[]>([]);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!keyword.trim()) {
      setError("검색어를 입력해주세요");
      return;
    }

    setLoading(true);
    setError("");
    setResults([]);

    try {
      const response = await fetch("/api/image-finder/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword, count }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "검색 실패");
      }

      const data = await response.json();
      setResults(data.images || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "검색 중 오류가 발생했습니다");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f0ff]">
      <MainNavigation />

      <div className="max-w-5xl mx-auto px-4 md:px-6 py-12 pt-24 md:pt-20">
        {/* 헤더 */}
        <FadeIn>
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Link
                href="/tools"
                className="text-purple-600 hover:text-purple-700 font-semibold"
              >
                ← 도구 목록으로
              </Link>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              📸 WorkFree 이미지 파인더
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              합법적 고품질 이미지, 3개 API에서 한 번에 검색
            </p>
            <p className="text-base text-gray-500 dark:text-gray-400 mt-2">
              상업적 이용 가능 | 저작권 걱정 없음
            </p>
          </div>
        </FadeIn>

        {/* 검색 폼 */}
        <FadeIn delay={0.1}>
          <div className="max-w-5xl mx-auto mb-8">
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-10 md:p-12 border-2 border-purple-200 dark:border-purple-800">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                <span>🔍</span>
                <span>이미지 검색</span>
              </h2>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  검색어 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="예: 강아지, 비즈니스, 자연 풍경"
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-purple-500 focus:outline-none dark:bg-gray-800 dark:text-white"
                  disabled={loading}
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  📊 이미지 개수: {count}장
                </label>
                <input
                  type="range"
                  min="5"
                  max="50"
                  step="5"
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer"
                  style={{ accentColor: "#9333ea" }}
                  disabled={loading}
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>5장</span>
                  <span>50장</span>
                </div>
              </div>

              <button
                onClick={handleSearch}
                disabled={!keyword.trim() || loading}
                className={`
                  w-full py-4 rounded-xl font-bold text-lg transition-all
                  ${!keyword.trim() || loading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:scale-[1.02]'
                  }
                `}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    이미지 수집 중...
                  </span>
                ) : (
                  "✨ 이미지 검색하기"
                )}
              </button>

              {/* 에러 메시지 */}
              {error && (
                <div className="mt-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl">
                  ⚠️ {error}
                </div>
              )}
            </div>
          </div>
        </FadeIn>

        {/* 검색 결과 */}
        {results.length > 0 && (
          <FadeIn delay={0.2}>
            <div className="max-w-5xl mx-auto">
              <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-10 md:p-12 border-2 border-purple-200 dark:border-purple-800">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    <span>🎨</span>
                    <span>검색 결과: {results.length}장</span>
                  </h2>
                  <button
                    disabled
                    className="bg-gray-400 text-white px-4 py-2 rounded-xl font-semibold cursor-not-allowed opacity-70 text-sm"
                    title="ZIP 다운로드 기능 추가 예정"
                  >
                    📦 ZIP (준비 중)
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {results.map((img) => (
                    <div
                      key={img.id}
                      className="group relative aspect-square rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all"
                    >
                      <img
                        src={img.thumbnail_url}
                        alt={`${keyword} - ${img.author}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                          <p className="text-xs font-semibold truncate">
                            📷 {img.author}
                          </p>
                          <p className="text-[10px] text-gray-300">
                            {img.source}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        )}

        {/* 주요 기능 */}
        <FadeIn delay={0.25}>
          <div className="max-w-5xl mx-auto mt-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-8 border-2 border-blue-200 dark:border-blue-800">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">💡</span>
                주요 기능
              </h3>
              <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>🌍 3개 소스 통합 (Unsplash + Pexels + Pixabay)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>⚡ 최대 50장까지 한 번에 검색</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>✅ 모든 이미지 상업적 이용 가능</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>💰 완전 무료 (API 제한 내)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>📋 저작권 정보 자동 표시</span>
                </li>
              </ul>
            </div>
          </div>
        </FadeIn>

        {/* 실무 활용 */}
        <FadeIn delay={0.3}>
          <div className="max-w-5xl mx-auto mt-8">
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-2xl p-8 border-2 border-orange-200 dark:border-orange-800">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">💼</span>
                이런 분들이 사용해요
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-2">
                    <span className="text-lg">📊</span>
                    <span className="font-semibold">마케터</span>
                  </div>
                  <div className="text-sm text-gray-700 dark:text-gray-300 ml-7">
                    제안서 / 광고 소재용 이미지
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-2">
                    <span className="text-lg">🎨</span>
                    <span className="font-semibold">디자이너</span>
                  </div>
                  <div className="text-sm text-gray-700 dark:text-gray-300 ml-7">
                    트렌드 리서치 / 무드보드
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-2">
                    <span className="text-lg">✍️</span>
                    <span className="font-semibold">블로거</span>
                  </div>
                  <div className="text-sm text-gray-700 dark:text-gray-300 ml-7">
                    포스팅 썸네일 / 삽화
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-2">
                    <span className="text-lg">📱</span>
                    <span className="font-semibold">SNS 운영자</span>
                  </div>
                  <div className="text-sm text-gray-700 dark:text-gray-300 ml-7">
                    피드 / 스토리용 이미지
                  </div>
                </div>
              </div>
              <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-300 dark:border-gray-700">
                <p>Powered by <span className="font-medium">Unsplash</span>, <span className="font-medium">Pexels</span>, <span className="font-medium">Pixabay</span></p>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}

