import { NextRequest, NextResponse } from "next/server";
import JSZip from "jszip";
import QRCode from "qrcode";

export async function POST(request: NextRequest) {
  try {
    const { qrData, options } = await request.json();

    if (!qrData || !Array.isArray(qrData) || qrData.length === 0) {
      return NextResponse.json(
        { error: "다운로드할 QR 코드가 없습니다" },
        { status: 400 }
      );
    }

    const zip = new JSZip();
    const qrFolder = zip.folder("qr-codes");

    // 각 QR 코드를 ZIP에 추가
    for (let i = 0; i < qrData.length; i++) {
      const qr = qrData[i];
      
      try {
        // PNG 형식으로 QR 코드 생성
        const pngBuffer = await QRCode.toBuffer(qr.text, {
          width: options.size || 256,
          color: {
            dark: options.color || "#000000",
            light: options.backgroundColor || "#FFFFFF",
          },
          errorCorrectionLevel: options.errorCorrectionLevel || "M",
          margin: options.margin || 4,
        });

        // 클라이언트에서 전송한 로고가 포함된 이미지 사용
        let finalBuffer = pngBuffer;
        
        if (qr.imageData) {
          try {
            // base64 데이터를 Buffer로 변환
            const base64Data = qr.imageData.replace(/^data:image\/png;base64,/, '');
            finalBuffer = Buffer.from(base64Data, 'base64');
          } catch (error) {
            console.warn('이미지 데이터 변환 실패, 기본 QR 코드 사용:', error);
            // 변환 실패 시 기본 QR 코드 사용
          }
        }

        // 파일명 생성 (특수문자 제거)
        const safeText = qr.text
          .replace(/[^a-zA-Z0-9가-힣\s-]/g, "")
          .substring(0, 50)
          .trim();
        const fileName = safeText || `qr-code-${i + 1}`;

        qrFolder?.file(`${fileName}.png`, finalBuffer);

        // SVG 형식도 추가
        const svgString = await QRCode.toString(qr.text, {
          type: "svg",
          width: options.size || 256,
          color: {
            dark: options.color || "#000000",
            light: options.backgroundColor || "#FFFFFF",
          },
          errorCorrectionLevel: options.errorCorrectionLevel || "M",
          margin: options.margin || 4,
        });

        qrFolder?.file(`${fileName}.svg`, svgString);

        // 텍스트 파일로 원본 URL 저장
        qrFolder?.file(`${fileName}.txt`, qr.text);
        
        if (qr.shortUrl) {
          qrFolder?.file(`${fileName}-short-url.txt`, qr.shortUrl);
        }

      } catch (error) {
        console.error(`QR 코드 ${i + 1} 처리 실패:`, error);
        // 실패한 QR 코드는 건너뛰고 계속 진행
      }
    }

    // README 파일 추가
    const readmeContent = `WorkFree QR Generator - 생성된 QR 코드들

생성 시간: ${new Date().toLocaleString('ko-KR')}
총 QR 코드 개수: ${qrData.length}

파일 형식:
- .png: PNG 형식 QR 코드 이미지
- .svg: SVG 형식 QR 코드 이미지  
- .txt: 원본 텍스트/URL
- -short-url.txt: 단축 URL (있는 경우)

WorkFree QR Generator로 생성되었습니다.
https://workfree.app/tools/qr-generator
`;

    qrFolder?.file("README.txt", readmeContent);

    // ZIP 파일 생성
    const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

    return new NextResponse(new Uint8Array(zipBuffer), {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="qr-codes-${new Date().getTime()}.zip"`,
      },
    });

  } catch (error) {
    console.error("ZIP 다운로드 생성 오류:", error);
    return NextResponse.json(
      { error: "ZIP 파일 생성 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
