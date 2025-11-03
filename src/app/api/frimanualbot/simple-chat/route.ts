// 간단한 챗봇 API (스트리밍 없음)
import { NextRequest, NextResponse } from 'next/server';
import { searchDocuments, generateAnswer } from '@/lib/copilot';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    console.log('💬 챗봇 API 시작');
    
    const body = await request.json();
    const { query, anonymousId } = body;

    console.log('질문:', query);
    console.log('익명 ID:', anonymousId);

    if (!query || !anonymousId) {
      return NextResponse.json(
        { error: '질문과 익명 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    // 1. 문서 검색
    console.log('🔍 문서 검색 중...');
    const searchResults = await searchDocuments(query, anonymousId, anonymousId, 5);
    console.log('검색 결과:', searchResults.length, '개');

    if (searchResults.length === 0) {
      return NextResponse.json({
        answer: '업로드된 문서에서 관련 내용을 찾을 수 없습니다.',
        sources: [],
      });
    }

    // 2. GPT-4 답변 생성
    console.log('🤖 GPT-4 답변 생성 중...');
    const answer = await generateAnswer(query, searchResults);
    console.log('✅ 답변 생성 완료!');

    return NextResponse.json({
      answer: answer,
      sources: searchResults.map(r => ({
        fileName: r.fileName,
        score: r.score,
      })),
    });

  } catch (error: any) {
    console.error('❌ 챗봇 에러:', error);
    console.error('스택:', error.stack);
    
    return NextResponse.json(
      { error: error.message, stack: error.stack },
      { status: 500 }
    );
  }
}

