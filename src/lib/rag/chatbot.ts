// GPT-3.5와 RAG 통합 챗봇

import { hybridSearch, type SearchFilters, type SearchResult } from './supabaseRAG';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ============================================
// 타입 정의
// ============================================

export interface ChatResponse {
  answer: string;
  sources: Array<{
    title: string;
    url: string;
  }>;
  relatedTools: Array<{
    name: string;
    url: string;
  }>;
  confidence: number;
  searchResults?: SearchResult[]; // 디버깅용
}

// ============================================
// RAG 기반 답변 생성
// ============================================

export async function generateAnswer(
  userQuery: string,
  filters?: SearchFilters
): Promise<ChatResponse> {
  console.log('💬 사용자 질문:', userQuery);

  // 1. RAG 검색 (하이브리드)
  const searchResults = await hybridSearch(userQuery, {
    topK: 3,
    filters,
  });

  console.log(`🔍 검색 결과: ${searchResults.length}개 문서 발견`);
  searchResults.forEach((r, i) => {
    console.log(`  ${i + 1}. ${r.metadata.title} (유사도: ${(r.similarity * 100).toFixed(1)}%)`);
  });

  // 2. 검색 결과가 없는 경우
  if (searchResults.length === 0) {
    return {
      answer: "죄송합니다. 😅 WorkFree 데이터베이스에서 관련 정보를 찾을 수 없습니다.\n\n다음을 시도해보세요:\n• 다른 키워드로 질문하기\n• '툴 추천', '크레딧', '베타 신청' 등 구체적인 질문\n• 우측 하단 Fri Manual Bot으로 문의",
      sources: [],
      relatedTools: [],
      confidence: 0,
    };
  }

  // 3. 컨텍스트 구성
  const context = searchResults
    .map((r, i) => `[문서 ${i + 1}: ${r.metadata.title}]\n${r.content}\n출처: ${r.metadata.url}`)
    .join('\n\n---\n\n');

  // 4. GPT-3.5에게 답변 요청
  const systemPrompt = `당신은 WorkFree Market의 친절한 AI 어시스턴트입니다.

**역할:**
- 사용자의 질문에 대해 제공된 정보만을 바탕으로 정확하게 답변
- 자연스러운 한국어로 친근하게 소통
- 정보가 부족하면 솔직하게 "현재 정보에 없습니다"라고 답변

**답변 형식 (필수):**
1. 첫 문장: 핵심 답변 (이모지 포함) 
2. 빈 줄
3. 주요 기능 2-3개 (• 불릿 포인트)
4. 빈 줄  
5. 마무리 한 문장

**예시:**
AI 블로그 생성기는 키워드만 입력하면 완성도 높은 글을 자동으로 작성해드립니다! ✍️

• SEO 최적화 제목/본문 자동 생성
• 다양한 톤앤매너 선택 가능
• HTML 다운로드 지원

블로거와 마케터 분들께 특히 유용한 도구예요! 😊

**규칙:**
1. 반드시 위 형식 지키기 (문단 나누기 필수)
2. 한 문장은 20-30자 이내
3. 불릿 포인트는 2-4개만
4. 이모지는 2-3개만 사용
5. 출처 URL은 답변에 포함하지 않기

**톤앤매너:**
- 친근하고 밝은 어조
- 존댓말 사용 ("~해요", "~예요")
- 간결하고 명확하게`;

  console.log('🤖 GPT-3.5 답변 생성 중...');

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `질문: ${userQuery}\n\n관련 정보:\n${context}\n\n위 정보를 바탕으로 친절하게 답변해주세요.`
      }
    ],
    temperature: 0.7,
    max_tokens: 400,
  });

  const answer = completion.choices[0].message.content || "답변을 생성할 수 없습니다.";
  console.log('✅ 답변 생성 완료\n');

  // 5. 응답 구성
  const avgSimilarity = searchResults.reduce((sum, r) => sum + r.similarity, 0) / searchResults.length;

  return {
    answer,
    sources: searchResults.map(r => ({
      title: r.metadata.title,
      url: r.metadata.url,
    })),
    relatedTools: searchResults
      .filter(r => r.metadata.category === 'tool')
      .map(r => ({
        name: r.metadata.toolName || r.metadata.title,
        url: r.metadata.url,
      })),
    confidence: Math.round(avgSimilarity * 100) / 100,
    searchResults, // 디버깅용
  };
}

// ============================================
// 빠른 답변 (미리 정의된 질문)
// ============================================

export function getQuickAnswer(query: string): string | null {
  const quickAnswers: Record<string, string> = {
    '안녕': '안녕하세요! 👋 WorkFree AI 어시스턴트입니다. 무엇을 도와드릴까요?',
    '고마워': '천만에요! 😊 더 궁금한 것이 있으시면 언제든 물어보세요!',
    '감사': '도움이 되어서 기쁩니다! 💙 WorkFree와 함께 효율적인 업무 되세요!',
  };

  for (const [key, value] of Object.entries(quickAnswers)) {
    if (query.includes(key)) {
      return value;
    }
  }

  return null;
}

