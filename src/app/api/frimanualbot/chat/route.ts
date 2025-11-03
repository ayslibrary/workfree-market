// 챗봇 질문 답변 API (RAG 기반, 익명 사용자 지원)

import { NextRequest, NextResponse } from 'next/server';
import { searchDocuments, generateAnswerStream } from '@/lib/copilot';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, anonymousId } = body;

    if (!query || !anonymousId) {
      return NextResponse.json(
        { error: '질문과 익명 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    // 1. RAG 검색: 관련 문서 찾기 (anonymousId로 필터링)
    const searchResults = await searchDocuments(
      query, 
      anonymousId,  // userId
      anonymousId,  // companyId (익명 사용자별 격리)
      5
    );

    // 검색 결과가 없는 경우
    if (searchResults.length === 0) {
      return NextResponse.json({
        answer: '아직 업로드된 매뉴얼이 없거나, 관련된 내용을 찾을 수 없습니다. 먼저 문서를 업로드해주세요.',
        sources: [],
      });
    }

    // 2. GPT-4로 답변 생성 (스트리밍)
    const stream = await generateAnswerStream(query, searchResults);

    // 스트리밍 응답 생성
    const encoder = new TextEncoder();
    
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
            }
          }
          
          // 참고 문서 정보 전송
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ 
              sources: searchResults.map(r => ({
                fileName: r.fileName,
                score: r.score,
              }))
            })}\n\n`)
          );
          
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error: any) {
    console.error('챗봇 답변 오류:', error);
    return NextResponse.json(
      { error: error.message || '답변 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
