// 문서 업로드 및 임베딩 API (수정 버전)
import { NextRequest, NextResponse } from 'next/server';
import { storeDocument } from '@/lib/copilot';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    console.log('📤 업로드 시작');
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const anonymousId = formData.get('anonymousId') as string;

    if (!file) {
      return NextResponse.json(
        { error: '파일이 제공되지 않았습니다.' },
        { status: 400 }
      );
    }

    if (!anonymousId) {
      return NextResponse.json(
        { error: '익명 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    console.log('파일명:', file.name);
    console.log('파일 크기:', file.size, 'bytes');

    // 파일 타입 확인
    const fileName = file.name;
    const fileExtension = fileName.split('.').pop()?.toLowerCase();

    // 일단 TXT만 지원 (나중에 PDF, DOCX 추가)
    if (fileExtension !== 'txt' && fileExtension !== 'md') {
      return NextResponse.json(
        { error: '현재는 TXT, MD 파일만 지원합니다.' },
        { status: 400 }
      );
    }

    // 파일 내용 읽기
    const buffer = Buffer.from(await file.arrayBuffer());
    const content = buffer.toString('utf-8');

    console.log('내용 길이:', content.length, '자');

    // 내용이 비어있는지 확인
    if (!content.trim()) {
      return NextResponse.json(
        { error: '파일에서 텍스트를 추출할 수 없습니다.' },
        { status: 400 }
      );
    }

    // 문서 ID 생성
    const documentId = `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    console.log('📦 Pinecone 저장 중...');

    // Pinecone에 저장
    const result = await storeDocument(
      documentId,
      fileName,
      content,
      anonymousId,
      anonymousId
    );

    console.log('✅ 업로드 성공!', result);

    return NextResponse.json({
      success: true,
      message: '문서가 성공적으로 업로드되었습니다.',
      documentId: result.documentId,
      fileName,
      chunksCount: result.chunksCount,
      contentLength: content.length,
    });

  } catch (error: any) {
    console.error('❌ 업로드 에러:', error);
    console.error('스택:', error.stack);
    
    return NextResponse.json(
      { error: error.message || '업로드 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
