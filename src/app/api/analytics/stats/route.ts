// Analytics API (서버 사이드)

import { NextRequest, NextResponse } from 'next/server';
import { getRAGStats, getPopularQuestions, getLowSimilaritySearches } from '@/lib/analytics/chatLogger';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const days = parseInt(searchParams.get('days') || '7');

    const [stats, popularQuestions, lowSimilarity] = await Promise.all([
      getRAGStats(days),
      getPopularQuestions(10),
      getLowSimilaritySearches(20),
    ]);

    return NextResponse.json({
      stats,
      popularQuestions,
      lowSimilarity,
    });
  } catch (error: any) {
    console.error('Analytics API 오류:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}

