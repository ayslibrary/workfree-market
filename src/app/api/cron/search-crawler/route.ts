import { NextRequest, NextResponse } from 'next/server';
import { getActiveSearchSettings, updateLastRun } from '@/lib/searchCrawler';

// Vercel Cron Job 핸들러
export async function GET(request: NextRequest) {
  try {
    // Vercel Cron Secret 검증
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 활성화된 검색 설정 가져오기
    const settings = await getActiveSearchSettings();

    if (settings.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No active settings',
        count: 0
      });
    }

    // Railway API URL
    const API_URL = process.env.SEARCH_CRAWLER_API_URL || '';

    if (!API_URL) {
      throw new Error('SEARCH_CRAWLER_API_URL not configured');
    }

    // 각 설정에 대해 검색 실행
    const results = [];
    for (const setting of settings) {
      try {
        // 검색 + 이메일 발송
        const response = await fetch(`${API_URL}/api/email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            keyword: setting.keyword,
            recipient_email: setting.email,
            engines: setting.engines,
            max_results: setting.maxResults
          })
        });

        if (response.ok) {
          // 성공 시 lastRun 업데이트
          if (setting.id) {
            await updateLastRun(setting.id);
          }
          results.push({
            settingId: setting.id,
            keyword: setting.keyword,
            status: 'success'
          });
        } else {
          results.push({
            settingId: setting.id,
            keyword: setting.keyword,
            status: 'failed',
            error: await response.text()
          });
        }
      } catch (error: any) {
        results.push({
          settingId: setting.id,
          keyword: setting.keyword,
          status: 'error',
          error: error.message
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${settings.length} settings`,
      results
    });

  } catch (error: any) {
    console.error('Cron job error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// 수동 테스트용 (개발 중)
export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'Not available in production' },
      { status: 403 }
    );
  }

  return GET(request);
}

