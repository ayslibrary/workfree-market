import { NextRequest, NextResponse } from 'next/server';

// 3개 API 설정
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
const PIXABAY_API_KEY = process.env.PIXABAY_API_KEY;

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

// Unsplash API 호출
async function searchUnsplash(keyword: string, count: number): Promise<ImageResult[]> {
  if (!UNSPLASH_ACCESS_KEY) return [];
  
  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(keyword)}&per_page=${Math.min(count, 30)}&order_by=latest`,
      {
        headers: {
          'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      }
    );

    if (!response.ok) return [];

    const data = await response.json();
    return (data.results || []).map((photo: any) => ({
      id: `unsplash_${photo.id}`,
      url: photo.urls.regular,
      thumbnail_url: photo.urls.thumb,
      author: photo.user.name,
      author_url: photo.user.links.html,
      source: 'Unsplash',
      license: 'Unsplash License (무료, 상업적 이용 가능)',
    }));
  } catch (error) {
    console.error('Unsplash 오류:', error);
    return [];
  }
}

// Pexels API 호출
async function searchPexels(keyword: string, count: number): Promise<ImageResult[]> {
  if (!PEXELS_API_KEY) return [];
  
  try {
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(keyword)}&per_page=${Math.min(count, 80)}`,
      {
        headers: {
          'Authorization': PEXELS_API_KEY,
        },
      }
    );

    if (!response.ok) return [];

    const data = await response.json();
    return (data.photos || []).map((photo: any) => ({
      id: `pexels_${photo.id}`,
      url: photo.src.large,
      thumbnail_url: photo.src.medium,
      author: photo.photographer,
      author_url: photo.photographer_url,
      source: 'Pexels',
      license: 'Pexels License (무료, 상업적 이용 가능)',
    }));
  } catch (error) {
    console.error('Pexels 오류:', error);
    return [];
  }
}

// Pixabay API 호출
async function searchPixabay(keyword: string, count: number): Promise<ImageResult[]> {
  if (!PIXABAY_API_KEY) return [];
  
  try {
    const response = await fetch(
      `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(keyword)}&per_page=${Math.min(count, 200)}&order=latest&image_type=photo`
    );

    if (!response.ok) return [];

    const data = await response.json();
    return (data.hits || []).map((photo: any) => ({
      id: `pixabay_${photo.id}`,
      url: photo.largeImageURL,
      thumbnail_url: photo.webformatURL,
      author: photo.user,
      author_url: `https://pixabay.com/users/${photo.user}-${photo.user_id}/`,
      source: 'Pixabay',
      license: 'Pixabay License (무료, 상업적 이용 가능)',
    }));
  } catch (error) {
    console.error('Pixabay 오류:', error);
    return [];
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: ImageSearchRequest = await request.json();
    const { keyword, count = 30 } = body;

    if (!keyword || keyword.trim() === '') {
      return NextResponse.json(
        { error: '검색어를 입력해주세요.' },
        { status: 400 }
      );
    }

    // 3개 API 동시 호출
    const perApi = Math.ceil(count / 3);
    const [unsplashResults, pexelsResults, pixabayResults] = await Promise.all([
      searchUnsplash(keyword, perApi),
      searchPexels(keyword, perApi),
      searchPixabay(keyword, perApi),
    ]);

    // 결과 합치기
    const allResults = [
      ...unsplashResults,
      ...pexelsResults,
      ...pixabayResults,
    ];

    if (allResults.length === 0) {
      return NextResponse.json(
        { error: `'${keyword}' 검색 결과가 없습니다.` },
        { status: 404 }
      );
    }

    // 최신순으로 섞기 (다양성 확보)
    const shuffled = allResults.sort(() => Math.random() - 0.5);
    const results = shuffled.slice(0, count);

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

