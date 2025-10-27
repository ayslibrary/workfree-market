import { NextRequest, NextResponse } from 'next/server';

interface GenerateEmailRequest {
  category: string;
  context: string;
  recipientInfo: {
    name?: string;
    company?: string;
    relationship?: string;
  };
  tone: 'formal' | 'casual' | 'friendly';
  language: 'ko' | 'en' | 'ja';
  additionalRequirements?: string;
}

interface GeneratedEmail {
  subject: string;
  content: string;
  variables: string[];
  suggestions: string[];
}

// AI 프롬프트 생성 함수
function createEmailPrompt(request: GenerateEmailRequest): string {
  const { category, context, recipientInfo, tone, language, additionalRequirements } = request;
  
  const toneMap = {
    formal: '공식적이고 격식있는',
    casual: '편안하고 자연스러운',
    friendly: '친근하고 따뜻한'
  };

  const languageMap = {
    ko: '한국어',
    en: '영어',
    ja: '일본어'
  };

  return `
당신은 전문적인 이메일 작성 AI입니다. 다음 요구사항에 따라 완벽한 이메일을 생성해주세요.

**카테고리**: ${category}
**상황/목적**: ${context}
**수신자 정보**: ${recipientInfo.name ? `이름: ${recipientInfo.name}` : ''} ${recipientInfo.company ? `회사: ${recipientInfo.company}` : ''} ${recipientInfo.relationship ? `관계: ${recipientInfo.relationship}` : ''}
**톤앤매너**: ${toneMap[tone]}
**언어**: ${languageMap[language]}
${additionalRequirements ? `**추가 요구사항**: ${additionalRequirements}` : ''}

다음 형식으로 응답해주세요:

SUBJECT: [이메일 제목]
CONTENT: [이메일 본문 내용]
VARIABLES: [사용된 변수들을 쉼표로 구분하여 나열]
SUGGESTIONS: [개선 제안사항들을 쉼표로 구분하여 나열]

**중요 지침**:
1. ${toneMap[tone]} 톤으로 작성하되 자연스럽게
2. ${languageMap[language]}로 작성
3. 변수는 {변수명} 형식으로 표시
4. 실무에서 바로 사용할 수 있는 수준으로 작성
5. 적절한 이모지와 구분선 사용
6. 명확한 행동 요청(CTA) 포함
`;
}

// OpenAI API 호출 함수 (실제 구현에서는 환경변수 사용)
async function callOpenAI(prompt: string): Promise<GeneratedEmail> {
  // 실제 환경에서는 OpenAI API를 호출합니다
  // 여기서는 시뮬레이션된 응답을 반환합니다
  
  const mockResponse = {
    subject: "안녕하세요 {수신자명}님, {제목} 관련 안내",
    content: `안녕하세요 {수신자명}님,

{회사명} {발신자명}입니다.

{제목}에 대해 연락드립니다.

📋 주요 내용:
• {내용1}
• {내용2}
• {내용3}

📅 일정: {날짜}
📍 장소: {장소}

문의사항이 있으시면 언제든 연락주세요.

감사합니다.

{발신자명}
{직책}
{회사명}
{연락처}`,
    variables: ['수신자명', '회사명', '발신자명', '제목', '내용1', '내용2', '내용3', '날짜', '장소', '직책', '연락처'],
    suggestions: ['더 구체적인 일정 정보 추가', '참석자 목록 포함', '준비물 안내 추가']
  };

  // 실제 OpenAI API 호출 (환경변수 설정 후 활성화)
  /*
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: '당신은 전문적인 이메일 작성 AI입니다. 주어진 요구사항에 따라 완벽한 이메일을 생성해주세요.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    })
  });

  const data = await response.json();
  const content = data.choices[0].message.content;
  
  // 응답 파싱
  const subjectMatch = content.match(/SUBJECT:\s*(.+)/);
  const contentMatch = content.match(/CONTENT:\s*([\s\S]+?)(?=VARIABLES:|$)/);
  const variablesMatch = content.match(/VARIABLES:\s*(.+)/);
  const suggestionsMatch = content.match(/SUGGESTIONS:\s*(.+)/);

  return {
    subject: subjectMatch?.[1]?.trim() || '제목 없음',
    content: contentMatch?.[1]?.trim() || '내용 없음',
    variables: variablesMatch?.[1]?.split(',').map(v => v.trim()) || [],
    suggestions: suggestionsMatch?.[1]?.split(',').map(s => s.trim()) || []
  };
  */

  return mockResponse;
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateEmailRequest = await request.json();
    
    // 입력 검증
    if (!body.category || !body.context) {
      return NextResponse.json(
        { error: '카테고리와 상황 설명은 필수입니다.' },
        { status: 400 }
      );
    }

    // AI 프롬프트 생성
    const prompt = createEmailPrompt(body);
    
    // OpenAI API 호출
    const generatedEmail = await callOpenAI(prompt);

    return NextResponse.json({
      success: true,
      email: generatedEmail,
      prompt: prompt // 디버깅용
    });

  } catch (error) {
    console.error('이메일 생성 에러:', error);
    return NextResponse.json(
      { error: '이메일 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
