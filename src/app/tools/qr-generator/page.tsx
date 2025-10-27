"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import MainNavigation from "@/components/MainNavigation";
import { FadeIn } from "@/components/animations";
import QRGenerator from "@/components/QRGenerator";
import QRDisplay from "@/components/QRDisplay";
import { useAuth } from "@/hooks/useAuth";

interface QRData {
  id: string;
  text: string;
  qrCode: string;
  shortUrl?: string;
  imageData?: string; // 로고가 포함된 Canvas 이미지 데이터
}

export default function QRGeneratorPage() {
  const { user, isAuthenticated } = useAuth();
  const [qrData, setQrData] = useState<QRData[]>([]);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [options, setOptions] = useState({
    size: 256,
    color: "#000000",
    backgroundColor: "#FFFFFF",
    errorCorrectionLevel: "Q" as "L" | "M" | "Q" | "H",
    margin: 4,
    enableShortUrl: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError("로고 파일은 2MB 이하로 업로드해주세요.");
        return;
      }
      
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setError("");
    }
  };

  const handleGenerateQR = async (texts: string[]) => {
    if (texts.length === 0) {
      setError("최소 하나의 URL 또는 텍스트를 입력해주세요.");
      return;
    }

    // 로그인 체크
    if (!isAuthenticated) {
      setError("QR 코드 생성을 위해 로그인이 필요합니다.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/qr-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          texts,
          options,
          enableShortUrl: options.enableShortUrl,
          userId: user?.id, // 사용자 ID 전달
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 402) {
          setError("크레딧이 부족합니다. 크레딧을 충전해주세요.");
        } else {
          throw new Error(errorData.error || "QR 코드 생성 실패");
        }
        return;
      }

      const data = await response.json();
      setQrData(data.qrCodes);
    } catch (err) {
      setError(err instanceof Error ? err.message : "QR 코드 생성 중 오류가 발생했습니다");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadAll = async () => {
    if (qrData.length === 0) return;

    try {
      // Canvas에서 로고가 포함된 이미지 데이터를 수집
      const qrDataWithImages = await Promise.all(
        qrData.map(async (qr, index) => {
          const canvas = document.getElementById(`qr-canvas-${index}`) as HTMLCanvasElement;
          const imageData = canvas ? canvas.toDataURL("image/png") : "";
          
          return {
            ...qr,
            imageData, // 로고가 포함된 Canvas 이미지 데이터
          };
        })
      );

      const response = await fetch("/api/qr-generator/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          qrData: qrDataWithImages,
          logoFile: logoPreview,
          options,
        }),
      });

      if (!response.ok) {
        throw new Error("다운로드 실패");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `qr-codes-${new Date().getTime()}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError("다운로드 중 오류가 발생했습니다");
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f0ff]">
      <MainNavigation />

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 pt-24 md:pt-20">
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
              📱 WorkFree QR Generator
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              URL, 텍스트를 QR 코드로 변환하고 로고 삽입까지
            </p>
            <p className="text-base text-gray-500 dark:text-gray-400 mt-2">
              설치 없이 웹에서 바로 실행 가능한 QR 코드 생성기
            </p>
          </div>
        </FadeIn>

        {/* 로그인 안내 */}
        {!isAuthenticated && (
          <FadeIn delay={0.1}>
            <div className="max-w-6xl mx-auto mb-8">
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl p-8 border-2 border-yellow-200 dark:border-yellow-800">
                <div className="text-center">
                  <div className="text-4xl mb-4">🔐</div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    로그인이 필요합니다
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-6">
                    QR 코드 생성을 위해 WorkFree 계정으로 로그인해주세요
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Link
                      href="/login"
                      className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all"
                    >
                      로그인하기
                    </Link>
                    <Link
                      href="/signup"
                      className="bg-white border-2 border-purple-300 text-purple-600 px-8 py-3 rounded-xl font-bold hover:bg-purple-50 transition-all"
                    >
                      회원가입
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        )}

        {/* QR 생성기 */}
        {isAuthenticated && (
          <FadeIn delay={0.1}>
            <div className="max-w-6xl mx-auto mb-8">
              <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-10 md:p-12 border-2 border-purple-200 dark:border-purple-800">
                <QRGenerator
                  onGenerate={handleGenerateQR}
                  onLogoUpload={handleLogoUpload}
                  logoPreview={logoPreview}
                  options={options}
                  onOptionsChange={setOptions}
                  loading={loading}
                  error={error}
                />
              </div>
            </div>
          </FadeIn>
        )}

        {/* QR 코드 표시 */}
        {qrData.length > 0 && (
          <FadeIn delay={0.2}>
            <div className="max-w-6xl mx-auto">
              <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-10 md:p-12 border-2 border-purple-200 dark:border-purple-800">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    <span>🎨</span>
                    <span>생성된 QR 코드: {qrData.length}개</span>
                  </h2>
                  <button
                    onClick={handleDownloadAll}
                    className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all"
                  >
                    📦 전체 다운로드 (ZIP)
                  </button>
                </div>
                
                <QRDisplay
                  qrData={qrData}
                  logoPreview={logoPreview}
                  options={options}
                />
              </div>
            </div>
          </FadeIn>
        )}

        {/* 주요 기능 */}
        <FadeIn delay={0.25}>
          <div className="max-w-6xl mx-auto mt-8">
            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-2xl p-8 border-2 border-cyan-200 dark:border-cyan-800">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">💡</span>
                주요 기능
              </h3>
              <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>🔗 여러 URL/텍스트를 한 번에 QR 코드로 변환</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>🎨 로고 이미지를 QR 코드 중앙에 자동 삽입</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>⚙️ 크기, 색상, 오류 수정 레벨 등 세부 옵션 설정</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>📱 PNG, SVG 형식으로 개별 다운로드</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>📦 ZIP 파일로 전체 QR 코드 일괄 다운로드</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>🔗 선택적 단축 URL 생성 (TinyURL 연동)</span>
                </li>
              </ul>
            </div>
          </div>
        </FadeIn>

        {/* 실무 활용 */}
        <FadeIn delay={0.3}>
          <div className="max-w-6xl mx-auto mt-8">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-8 border-2 border-purple-200 dark:border-purple-800">
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
                    이벤트 페이지, 제품 링크 QR 코드
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-2">
                    <span className="text-lg">🏢</span>
                    <span className="font-semibold">사업자</span>
                  </div>
                  <div className="text-sm text-gray-700 dark:text-gray-300 ml-7">
                    명함, 전단지용 연락처 QR
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-2">
                    <span className="text-lg">✍️</span>
                    <span className="font-semibold">콘텐츠 크리에이터</span>
                  </div>
                  <div className="text-sm text-gray-700 dark:text-gray-300 ml-7">
                    SNS 프로필, 유튜브 채널 QR
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-2">
                    <span className="text-lg">🎓</span>
                    <span className="font-semibold">교육자</span>
                  </div>
                  <div className="text-sm text-gray-700 dark:text-gray-300 ml-7">
                    강의 자료, 과제 링크 QR
                  </div>
                </div>
              </div>
              <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-300 dark:border-gray-700">
                <p>Powered by <span className="font-medium">WorkFree</span> • <span className="font-medium">QR Code Generator</span></p>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
