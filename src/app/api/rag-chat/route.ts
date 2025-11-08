// RAG 챗봇 API

import { NextRequest, NextResponse } from 'next/server';
import { generateAnswer, getQuickAnswer } from '@/lib/rag/chatbot';
import { logChat, logSearchResults } from '@/lib/analytics/chatLogger';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const { message, userId, filters, sessionId } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      );
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📨 새로운 채팅 요청');
    console.log('사용자:', userId || 'anonymous');
    console.log('질문:', message);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // 1. 빠른 답변 체크
    const quickAnswer = getQuickAnswer(message);
    if (quickAnswer) {
      console.log('⚡ 빠른 답변 반환\n');
      
      const responseTime = Date.now() - startTime;
      
      // 빠른 답변도 로그
      await logChat({
        userId,
        sessionId: sessionId || 'unknown',
        message,
        answer: quickAnswer,
        confidence: 1.0,
        responseTimeMs: responseTime,
        model: 'quick-answer',
      });
      
      return NextResponse.json({
        answer: quickAnswer,
        sources: [],
        relatedTools: [],
        confidence: 1.0,
        type: 'quick',
      });
    }

    // 2. RAG 답변 생성
    const result = await generateAnswer(message, filters);

    const responseTime = Date.now() - startTime;
    
    console.log('✅ 답변 생성 성공');
    console.log('신뢰도:', (result.confidence * 100).toFixed(1) + '%');
    console.log('관련 문서:', result.sources.length + '개');
    console.log('응답 시간:', responseTime + 'ms\n');

    // 3. 로그 저장 (Supabase)
    const chatLogId = await logChat({
      userId,
      sessionId: sessionId || 'unknown',
      message,
      answer: result.answer,
      confidence: result.confidence,
      responseTimeMs: responseTime,
      sources: result.sources,
      relatedTools: result.relatedTools,
    });

    // 4. 검색 결과 저장 (상세 분석용)
    if (chatLogId && result.searchResults) {
      await logSearchResults({
        chatLogId,
        query: message,
        expandedQueries: [message], // TODO: 실제 확장 쿼리 전달
        results: result.searchResults.map(r => ({
          id: r.id,
          title: r.metadata.title,
          similarity: r.similarity,
        })),
        resultCount: result.searchResults.length,
        avgSimilarity: result.confidence,
      });
    }

    return NextResponse.json({
      ...result,
      chatLogId, // 프론트엔드에서 피드백 시 사용
      type: 'rag',
    });

  } catch (error: any) {
    console.error('❌ RAG 챗봇 오류:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error.message,
        answer: '죄송합니다. 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        sources: [],
        relatedTools: [],
        confidence: 0,
      },
      { status: 500 }
    );
  }
}

// GET 요청: 통계 정보
export async function GET() {
  try {
    const { getKnowledgeStats } = await import('@/lib/rag/supabaseRAG');
    const stats = await getKnowledgeStats();

    return NextResponse.json({
      status: 'ok',
      stats,
      message: 'WorkFree RAG API is running',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to get stats' },
      { status: 500 }
    );
  }
}

