import { NextRequest, NextResponse } from 'next/server';

// Unsplash API 설정
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

interface ImageSearchRequest {
  keyword: string;
  count: number;
}

interface ImageResult {
  id: string;
  url: string;
  thumbnail_url: string;
  author: string;
  author_url: string;
  source: string;
  license: string;
}

export async function POST(request: NextRequest) {
  try {
    // API 키 확인
    if (!UNSPLASH_ACCESS_KEY) {
      console.error('❌ UNSPLASH_ACCESS_KEY가 설정되지 않았습니다.');
      return NextResponse.json(
        { error: 'API 키가 설정되지 않았습니다. 관리자에게 문의하세요.' },
        { status: 500 }
      );
    }

    const body: ImageSearchRequest = await request.json();
    const { keyword, count = 10 } = body;

    if (!keyword || keyword.trim() === '') {
      return NextResponse.json(
        { error: '검색어를 입력해주세요.' },
        { status: 400 }
      );
    }

    // Unsplash API 호출
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(keyword)}&per_page=${Math.min(count, 30)}`,
      {
        headers: {
          'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Unsplash API 오류:', response.status, errorText);
      return NextResponse.json(
        { error: 'Unsplash API 호출 중 오류가 발생했습니다.' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const results: ImageResult[] = [];

    // 결과 파싱
    for (const photo of data.results || []) {
      results.push({
        id: `unsplash_${photo.id}`,
        url: photo.urls.regular,
        thumbnail_url: photo.urls.thumb,
        author: photo.user.name,
        author_url: photo.user.links.html,
        source: 'Unsplash',
        license: 'Unsplash License (무료, 상업적 이용 가능)',
      });
    }

    if (results.length === 0) {
      return NextResponse.json(
        { error: `'${keyword}' 검색 결과가 없습니다.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      total: results.length,
      images: results,
      keyword: keyword,
    });
  } catch (error) {
    console.error('이미지 검색 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' },
      { status: 500 }
    );
  }
}

