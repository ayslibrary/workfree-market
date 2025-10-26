import { NextRequest, NextResponse } from 'next/server';

// Python 백엔드 API URL
const PYTHON_API_URL = process.env.IMAGE_FINDER_API_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Python API로 요청 전달
    const response = await fetch(`${PYTHON_API_URL}/api/download`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      // 에러 응답을 텍스트로 읽기
      const errorText = await response.text();
      let errorMessage = '이미지 다운로드 중 오류가 발생했습니다.';
      
      try {
        // JSON 파싱 시도
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.detail || errorMessage;
      } catch {
        // JSON이 아니면 텍스트 그대로 사용
        errorMessage = errorText || errorMessage;
      }
      
      console.error('다운로드 에러:', errorMessage);
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      );
    }

    // ZIP 파일을 스트리밍으로 전달
    const blob = await response.blob();
    const contentDisposition = response.headers.get('Content-Disposition') || 'attachment; filename=workfree_images.zip';
    
    return new NextResponse(blob, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': contentDisposition,
      },
    });
  } catch (error) {
    console.error('이미지 다운로드 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' },
      { status: 500 }
    );
  }
}

