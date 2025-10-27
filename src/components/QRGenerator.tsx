"use client";

import { useState } from "react";

interface QRGeneratorProps {
  onGenerate: (texts: string[]) => void;
  onLogoUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  logoPreview: string;
  options: {
    size: number;
    color: string;
    backgroundColor: string;
    errorCorrectionLevel: "L" | "M" | "Q" | "H";
    margin: number;
    enableShortUrl: boolean;
  };
  onOptionsChange: (options: any) => void;
  loading: boolean;
  error: string;
}

export default function QRGenerator({
  onGenerate,
  onLogoUpload,
  logoPreview,
  options,
  onOptionsChange,
  loading,
  error,
}: QRGeneratorProps) {
  const [inputText, setInputText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const texts = inputText
      .split("\n")
      .map((text) => text.trim())
      .filter((text) => text.length > 0);
    
    if (texts.length === 0) return;
    
    onGenerate(texts);
  };

  const handleOptionChange = (key: string, value: any) => {
    onOptionsChange({
      ...options,
      [key]: value,
    });
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
        <span>🔧</span>
        <span>QR 코드 생성기</span>
      </h2>

      {/* URL/텍스트 입력 */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          URL 또는 텍스트 <span className="text-red-500">*</span>
        </label>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
          여러 개의 URL을 입력하려면 줄바꿈으로 구분해주세요
        </p>
        <form onSubmit={handleSubmit}>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="https://example.com&#10;https://another-url.com&#10;텍스트 메시지"
            className="w-full h-32 px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-purple-500 focus:outline-none dark:bg-gray-800 dark:text-white resize-none"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!inputText.trim() || loading}
            className={`
              w-full mt-4 py-4 rounded-xl font-bold text-lg transition-all
              ${!inputText.trim() || loading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:shadow-lg hover:scale-[1.02]'
              }
            `}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                QR 코드 생성 중...
              </span>
            ) : (
              "✨ QR 코드 생성하기"
            )}
          </button>
        </form>
      </div>

      {/* 로고 업로드 */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          로고 이미지 (선택사항)
        </label>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
          QR 코드 중앙에 삽입될 로고를 업로드하세요 (최대 2MB)
        </p>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-4">
          <div className="flex items-start gap-2">
            <span className="text-yellow-600 dark:text-yellow-400 text-sm">⚠️</span>
            <div className="text-xs text-yellow-700 dark:text-yellow-300">
              <p className="font-semibold mb-1">스캔 가능성 안내</p>
              <ul className="space-y-1 text-xs">
                <li>• 로고가 너무 크면 QR 코드 스캔이 어려울 수 있습니다</li>
                <li>• 오류 수정 레벨을 'Q' 또는 'H'로 설정하면 더 안전합니다</li>
                <li>• QR 코드 크기를 256px 이상으로 설정하는 것을 권장합니다</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <input
            type="file"
            accept="image/*"
            onChange={onLogoUpload}
            className="hidden"
            id="logo-upload"
            disabled={loading}
          />
          <label
            htmlFor="logo-upload"
            className={`
              px-6 py-3 rounded-xl font-semibold cursor-pointer transition-all
              ${loading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:scale-105'
              }
            `}
          >
            📷 로고 업로드
          </label>
          {logoPreview && (
            <div className="flex items-center gap-2">
              <img
                src={logoPreview}
                alt="로고 미리보기"
                className="w-12 h-12 object-cover rounded-lg border-2 border-gray-200"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                로고가 선택되었습니다
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 옵션 설정 */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* QR 코드 크기 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            📏 QR 코드 크기: {options.size}px
          </label>
          <input
            type="range"
            min="128"
            max="512"
            step="32"
            value={options.size}
            onChange={(e) => handleOptionChange("size", Number(e.target.value))}
            className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer"
            style={{ accentColor: "#9333ea" }}
            disabled={loading}
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>128px</span>
            <span>512px</span>
          </div>
        </div>

        {/* 오류 수정 레벨 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            🛡️ 오류 수정 레벨
          </label>
          <select
            value={options.errorCorrectionLevel}
            onChange={(e) => handleOptionChange("errorCorrectionLevel", e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-purple-500 focus:outline-none dark:bg-gray-800 dark:text-white"
            disabled={loading}
          >
            <option value="L">L (낮음) - 7% 복구</option>
            <option value="M">M (중간) - 15% 복구</option>
            <option value="Q">Q (높음) - 25% 복구</option>
            <option value="H">H (최고) - 30% 복구</option>
          </select>
        </div>

        {/* QR 코드 색상 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            🎨 QR 코드 색상
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={options.color}
              onChange={(e) => handleOptionChange("color", e.target.value)}
              className="w-12 h-12 rounded-lg border-2 border-gray-200 cursor-pointer"
              disabled={loading}
            />
            <input
              type="text"
              value={options.color}
              onChange={(e) => handleOptionChange("color", e.target.value)}
              className="flex-1 px-3 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-purple-500 focus:outline-none dark:bg-gray-800 dark:text-white"
              disabled={loading}
            />
          </div>
        </div>

        {/* 배경 색상 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            🖼️ 배경 색상
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={options.backgroundColor}
              onChange={(e) => handleOptionChange("backgroundColor", e.target.value)}
              className="w-12 h-12 rounded-lg border-2 border-gray-200 cursor-pointer"
              disabled={loading}
            />
            <input
              type="text"
              value={options.backgroundColor}
              onChange={(e) => handleOptionChange("backgroundColor", e.target.value)}
              className="flex-1 px-3 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-purple-500 focus:outline-none dark:bg-gray-800 dark:text-white"
              disabled={loading}
            />
          </div>
        </div>
      </div>

      {/* 추가 옵션 */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          ⚙️ 추가 옵션
        </h3>
        <div className="space-y-4">
          {/* 단축 URL 생성 */}
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={options.enableShortUrl}
              onChange={(e) => handleOptionChange("enableShortUrl", e.target.checked)}
              className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
              disabled={loading}
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              🔗 단축 URL 생성 (TinyURL 연동)
            </span>
          </label>
          
          {/* 여백 설정 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              📐 여백: {options.margin} 모듈
            </label>
            <input
              type="range"
              min="0"
              max="8"
              step="1"
              value={options.margin}
              onChange={(e) => handleOptionChange("margin", Number(e.target.value))}
              className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer"
              style={{ accentColor: "#9333ea" }}
              disabled={loading}
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>0</span>
              <span>8</span>
            </div>
          </div>
        </div>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl">
          ⚠️ {error}
        </div>
      )}
    </div>
  );
}
