"use client";

import { useState, useEffect } from "react";
import QRCode from "qrcode";
import html2canvas from "html2canvas";

interface QRData {
  id: string;
  text: string;
  qrCode: string;
  shortUrl?: string;
}

interface QRDisplayProps {
  qrData: QRData[];
  logoPreview: string;
  options: {
    size: number;
    color: string;
    backgroundColor: string;
    errorCorrectionLevel: "L" | "M" | "Q" | "H";
    margin: number;
  };
}

export default function QRDisplay({ qrData, logoPreview, options }: QRDisplayProps) {
  const [downloading, setDownloading] = useState<string | null>(null);

  // QR 코드를 Canvas에 그리는 함수 (로고 포함)
  const drawQRCode = async (canvas: HTMLCanvasElement, text: string, index: number) => {
    try {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Canvas 크기 설정
      canvas.width = options.size;
      canvas.height = options.size;

      // 배경색 설정
      ctx.fillStyle = options.backgroundColor;
      ctx.fillRect(0, 0, options.size, options.size);

      // QR 코드를 Canvas에 그리기
      const qrDataURL = await QRCode.toDataURL(text, {
        width: options.size,
        color: {
          dark: options.color,
          light: options.backgroundColor,
        },
        errorCorrectionLevel: options.errorCorrectionLevel,
        margin: options.margin,
      });

      const qrImg = new Image();
      qrImg.onload = () => {
        // QR 코드 그리기
        ctx.drawImage(qrImg, 0, 0, options.size, options.size);
        
        // 로고가 있으면 중앙에 합성
        if (logoPreview) {
          const logoImg = new Image();
          logoImg.onload = () => {
            // 로고 크기 계산 (QR 코드의 15% 크기로 줄임)
            const logoSize = Math.floor(options.size * 0.15);
            const logoX = (options.size - logoSize) / 2;
            const logoY = (options.size - logoSize) / 2;
            
            // 로고 배경 (흰색 원) - 더 작게
            ctx.fillStyle = "#FFFFFF";
            ctx.beginPath();
            ctx.arc(options.size / 2, options.size / 2, logoSize / 2 + 2, 0, 2 * Math.PI);
            ctx.fill();
            
            // 로고 그리기
            ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
          };
          logoImg.src = logoPreview;
        }
      };
      qrImg.src = qrDataURL;
    } catch (error) {
      console.error(`QR 코드 그리기 실패 (${text}):`, error);
    }
  };

  // QR 데이터가 변경될 때마다 Canvas에 그리기
  useEffect(() => {
    qrData.forEach((qr, index) => {
      const canvas = document.getElementById(`qr-canvas-${index}`) as HTMLCanvasElement;
      if (canvas) {
        drawQRCode(canvas, qr.text, index);
      }
    });
  }, [qrData, options]);

  const handleDownloadPNG = async (qrData: QRData, index: number) => {
    setDownloading(qrData.id);
    
    try {
      const canvas = document.getElementById(`qr-canvas-${index}`) as HTMLCanvasElement;
      if (!canvas) return;

      const link = document.createElement("a");
      link.download = `qr-code-${index + 1}.png`;
      link.href = canvas.toDataURL("image/png");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("PNG 다운로드 실패:", error);
    } finally {
      setDownloading(null);
    }
  };

  const handleDownloadSVG = async (qrData: QRData, index: number) => {
    setDownloading(qrData.id);
    
    try {
      const svgData = await QRCode.toString(qrData.text, {
        type: "svg",
        width: options.size,
        color: {
          dark: options.color,
          light: options.backgroundColor,
        },
        errorCorrectionLevel: options.errorCorrectionLevel,
        margin: options.margin,
      });

      const blob = new Blob([svgData], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `qr-code-${index + 1}.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("SVG 다운로드 실패:", error);
    } finally {
      setDownloading(null);
    }
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    // 간단한 토스트 알림 (실제로는 더 나은 토스트 라이브러리 사용 권장)
    alert("텍스트가 클립보드에 복사되었습니다!");
  };

  return (
    <div className="space-y-6">
      {qrData.map((qr, index) => (
        <div
          key={qr.id}
          className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 border-2 border-gray-200 dark:border-gray-700"
        >
          <div className="flex flex-col lg:flex-row gap-6">
            {/* QR 코드 표시 */}
            <div className="flex-shrink-0">
              <div className="relative inline-block">
                <canvas
                  id={`qr-canvas-${index}`}
                  width={options.size}
                  height={options.size}
                  className="border-2 border-gray-300 dark:border-gray-600 rounded-lg"
                  style={{
                    backgroundColor: options.backgroundColor,
                  }}
                />
              </div>
            </div>

            {/* QR 코드 정보 */}
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  QR 코드 #{index + 1}
                </h3>
                <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">원본 텍스트:</p>
                  <p className="text-sm font-mono text-gray-900 dark:text-white break-all">
                    {qr.text}
                  </p>
                  {qr.shortUrl && (
                    <>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 mt-3">단축 URL:</p>
                      <p className="text-sm font-mono text-blue-600 dark:text-blue-400 break-all">
                        {qr.shortUrl}
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* 액션 버튼들 */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleDownloadPNG(qr, index)}
                  disabled={downloading === qr.id}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {downloading === qr.id ? (
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : (
                    <span>📷</span>
                  )}
                  PNG 다운로드
                </button>

                <button
                  onClick={() => handleDownloadSVG(qr, index)}
                  disabled={downloading === qr.id}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {downloading === qr.id ? (
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : (
                    <span>🎨</span>
                  )}
                  SVG 다운로드
                </button>

                <button
                  onClick={() => handleCopyText(qr.text)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all"
                >
                  <span>📋</span>
                  텍스트 복사
                </button>

                {qr.shortUrl && (
                  <button
                    onClick={() => handleCopyText(qr.shortUrl!)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all"
                  >
                    <span>🔗</span>
                    단축 URL 복사
                  </button>
                )}
              </div>

              {/* QR 코드 정보 */}
              <div className="grid grid-cols-2 gap-4 text-xs text-gray-500 dark:text-gray-400">
                <div>
                  <span className="font-semibold">크기:</span> {options.size}px
                </div>
                <div>
                  <span className="font-semibold">오류 수정:</span> {options.errorCorrectionLevel}
                </div>
                <div>
                  <span className="font-semibold">여백:</span> {options.margin} 모듈
                </div>
                <div>
                  <span className="font-semibold">로고:</span> {logoPreview ? "포함" : "없음"}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {qrData.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📱</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            QR 코드를 생성해보세요
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            위의 입력란에 URL이나 텍스트를 입력하고 생성 버튼을 눌러보세요
          </p>
        </div>
      )}
    </div>
  );
}
