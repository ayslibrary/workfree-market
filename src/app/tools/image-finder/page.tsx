"use client";

import { useState } from "react";

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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-8">
      <div className="max-w-3xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">📸</div>
          <h1 className="text-5xl font-bold mb-3" style={{ color: "#3A36A2" }}>
            WorkFree 이미지 파인더
          </h1>
          <p className="text-xl text-gray-700 mb-2 font-semibold">
            합법적 고품질 이미지, 3개 API에서 한 번에 검색
          </p>
          <p className="text-base text-gray-500">
            상업적 이용 가능 | 저작권 걱정 없음
          </p>
        </div>

        {/* 검색 폼 */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              🔍 검색어
            </label>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="예: 강아지, 비즈니스, 자연 풍경"
              className="w-full p-4 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:outline-none transition text-lg"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
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
              style={{ accentColor: "#6A5CFF" }}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>5장</span>
              <span>50장</span>
            </div>
          </div>

          <button
            onClick={handleSearch}
            disabled={!keyword.trim() || loading}
            className="w-full bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 text-white py-5 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">📸</span>
                이미지 수집 중...
              </span>
            ) : (
              "🚀 이미지 자동 수집"
            )}
          </button>

          {/* 에러 메시지 */}
          {error && (
            <div className="mt-4 bg-red-50 border-2 border-red-300 rounded-xl p-4 text-center">
              <p className="text-red-700 font-semibold">❌ {error}</p>
            </div>
          )}

          {/* 검색 결과 */}
          {results.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold" style={{ color: "#3A36A2" }}>
                  🎨 검색 결과: {results.length}장
                </h2>
                <button
                  disabled
                  className="bg-gray-400 text-white px-6 py-3 rounded-xl font-bold cursor-not-allowed opacity-70"
                  title="ZIP 다운로드 기능 추가 예정"
                >
                  <span className="flex items-center gap-2">
                    📦 ZIP 다운로드 (준비 중)
                  </span>
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
          )}
        </div>

        {/* 하단 정보 */}
        <div className="mt-8 space-y-6">
          {/* 주요 기능 */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-bold mb-4" style={{ color: "#3A36A2" }}>
              ✨ 이 서비스의 장점
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-gray-800 font-semibold mb-1 flex items-center gap-2">
                  <span className="text-xl">🌍</span>
                  <span>3개 소스 통합</span>
                </p>
                <p className="text-sm text-gray-600 ml-7">
                  Unsplash + Pexels + Pixabay를 한 번에 검색
                </p>
              </div>
              
              <div>
                <p className="text-gray-800 font-semibold mb-1 flex items-center gap-2">
                  <span className="text-xl">⚡</span>
                  <span>최대 50장</span>
                </p>
                <p className="text-sm text-gray-600 ml-7">
                  한 번에 최대 50장까지 검색 가능
                </p>
              </div>
              
              <div>
                <p className="text-gray-800 font-semibold mb-1 flex items-center gap-2">
                  <span className="text-xl">✅</span>
                  <span>합법적 사용</span>
                </p>
                <p className="text-sm text-gray-600 ml-7">
                  모든 이미지 상업적 이용 가능
                </p>
              </div>
              
              <div>
                <p className="text-gray-800 font-semibold mb-1 flex items-center gap-2">
                  <span className="text-xl">💰</span>
                  <span>완전 무료</span>
                </p>
                <p className="text-sm text-gray-600 ml-7">
                  API 제한 내 무제한 사용
                </p>
              </div>
            </div>
          </div>

          {/* 실무 활용 */}
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6">
            <h3 className="text-lg font-bold mb-4" style={{ color: "#3A36A2" }}>
              💼 이런 분들이 사용해요
            </h3>
            <div className="space-y-3 text-sm text-gray-700">
              <p className="flex items-start gap-2">
                <span className="text-lg">📊</span>
                <span><span className="font-semibold">마케터:</span> 제안서 / 광고 소재용 이미지</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-lg">🎨</span>
                <span><span className="font-semibold">디자이너:</span> 트렌드 리서치 / 무드보드</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-lg">✍️</span>
                <span><span className="font-semibold">블로거:</span> 포스팅 썸네일 / 삽화</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-lg">📱</span>
                <span><span className="font-semibold">SNS 운영자:</span> 피드 / 스토리용 이미지</span>
              </p>
            </div>
          </div>

          {/* API 출처 표시 */}
          <div className="text-center text-xs text-gray-400 pt-4">
            <p>Powered by <span className="font-medium">Unsplash</span>, <span className="font-medium">Pexels</span>, <span className="font-medium">Pixabay</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}

