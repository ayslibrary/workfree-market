// RAG 피드백 수집 API

import { NextRequest, NextResponse } from 'next/server';
import { logFeedback } from '@/lib/analytics/chatLogger';

export async function POST(request: NextRequest) {
  try {
    const { messageId, chatLogId, helpful, userId, comment } = await request.json();

    if (typeof helpful !== 'boolean') {
      return NextResponse.json(
        { error: 'helpful must be a boolean' },
        { status: 400 }
      );
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 피드백 수신');
    console.log('메시지 ID:', messageId);
    console.log('Chat Log ID:', chatLogId);
    console.log('도움됨:', helpful ? '👍 Yes' : '👎 No');
    console.log('사용자:', userId || 'anonymous');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Supabase에 피드백 저장
    const success = await logFeedback({
      chatLogId: chatLogId || messageId, // fallback
      userId,
      helpful,
      comment,
    });

    if (!success) {
      throw new Error('피드백 저장 실패');
    }

    console.log('✅ 피드백 저장 완료\n');

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

