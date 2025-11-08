// RAG 피드백 수집 API

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { messageId, helpful, userId, query, answer } = await request.json();

    if (typeof helpful !== 'boolean') {
      return NextResponse.json(
        { error: 'helpful must be a boolean' },
        { status: 400 }
      );
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 피드백 수신');
    console.log('메시지 ID:', messageId);
    console.log('도움됨:', helpful ? '👍 Yes' : '👎 No');
    console.log('사용자:', userId || 'anonymous');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // TODO: Firebase/Supabase에 피드백 저장
    // await saveToDatabase({
    //   messageId,
    //   helpful,
    //   userId,
    //   query,
    //   answer,
    //   timestamp: new Date(),
    // });

    return NextResponse.json({ 
      success: true,
      message: '피드백 감사합니다! 🙏'
    });

  } catch (error: any) {
    console.error('❌ 피드백 저장 오류:', error);
    
    return NextResponse.json(
      { error: 'Failed to save feedback' },
      { status: 500 }
    );
  }
}

