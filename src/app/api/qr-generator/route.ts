import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";
import { spendCredits, updateTimeSavings } from "@/lib/creditSystem";

export async function POST(request: NextRequest) {
  try {
    const { texts, options, enableShortUrl, userId } = await request.json();

    if (!texts || !Array.isArray(texts) || texts.length === 0) {
      return NextResponse.json(
        { error: "최소 하나의 텍스트가 필요합니다" },
        { status: 400 }
      );
    }

    // 크레딧 시스템 연동 (사용자 ID가 있는 경우에만)
    // TODO: Firebase 설정 완료 후 활성화
    if (userId && false) { // 임시로 비활성화
      const creditCost = 1; // QR 생성 1회당 1 크레딧
      const creditResult = await spendCredits(userId, creditCost, "qr-generator", "QR 코드 생성기");
      
      if (!creditResult.success) {
        return NextResponse.json(
          { error: "크레딧이 부족합니다. 크레딧을 충전해주세요." },
          { status: 402 }
        );
      }

      // 시간 절약 데이터 업데이트 (15분 절약, 5,000원 절약)
      await updateTimeSavings(userId, 15, 5000);
    }

    const qrCodes = await Promise.all(
      texts.map(async (text: string, index: number) => {
        try {
          // QR 코드 생성
          const qrCodeDataURL = await QRCode.toDataURL(text, {
            width: options.size || 256,
            color: {
              dark: options.color || "#000000",
              light: options.backgroundColor || "#FFFFFF",
            },
            errorCorrectionLevel: options.errorCorrectionLevel || "M",
            margin: options.margin || 4,
          });

          // 단축 URL 생성 (선택사항)
          let shortUrl: string | undefined;
          if (enableShortUrl && text.startsWith("http")) {
            try {
              const shortResponse = await fetch("https://tinyurl.com/api-create.php", {
                method: "POST",
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
                },
                body: `url=${encodeURIComponent(text)}`,
              });
              
              if (shortResponse.ok) {
                shortUrl = await shortResponse.text();
                // TinyURL이 성공하지 않으면 원본 URL 유지
                if (shortUrl.includes("Error") || shortUrl.includes("error")) {
                  shortUrl = undefined;
                }
              }
            } catch (error) {
              console.warn("단축 URL 생성 실패:", error);
              // 단축 URL 생성 실패해도 계속 진행
            }
          }

          return {
            id: `qr-${Date.now()}-${index}`,
            text,
            qrCode: qrCodeDataURL,
            shortUrl,
          };
        } catch (error) {
          console.error(`QR 코드 생성 실패 (${text}):`, error);
          return {
            id: `qr-${Date.now()}-${index}`,
            text,
            qrCode: "",
            error: "QR 코드 생성 실패",
          };
        }
      })
    );

    return NextResponse.json({ qrCodes });
  } catch (error) {
    console.error("QR Generator API 오류:", error);
    return NextResponse.json(
      { error: "QR 코드 생성 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
