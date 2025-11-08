// RAG 챗봇 API

import { NextRequest, NextResponse } from 'next/server';
import { generateAnswer, getQuickAnswer } from '@/lib/rag/chatbot';

export async function POST(request: NextRequest) {
  try {
    const { message, userId, filters } = await request.json();

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

    console.log('✅ 답변 생성 성공');
    console.log('신뢰도:', (result.confidence * 100).toFixed(1) + '%');
    console.log('관련 문서:', result.sources.length + '개\n');

    // 3. 로그 저장 (TODO: Firebase/Supabase에 저장)
    // await saveToDatabase({
    //   userId,
    //   query: message,
    //   answer: result.answer,
    //   confidence: result.confidence,
    //   timestamp: new Date(),
    // });

    return NextResponse.json({
      ...result,
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

