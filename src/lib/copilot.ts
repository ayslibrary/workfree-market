// WorkFree Co-pilot - RAG 기반 업무 어시스턴트 핵심 라이브러리

import { Pinecone } from '@pinecone-database/pinecone';
import { OpenAI } from 'openai';

// Pinecone 클라이언트 초기화
let pineconeClient: Pinecone | null = null;

export function getPineconeClient() {
  if (!process.env.PINECONE_API_KEY) {
    throw new Error('PINECONE_API_KEY 환경 변수가 설정되지 않았습니다. .env.local 파일을 확인해주세요.');
  }

  if (!pineconeClient) {
    pineconeClient = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });
  }
  return pineconeClient;
}

// OpenAI 클라이언트 초기화
let openaiClient: OpenAI | null = null;

export function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY 환경 변수가 설정되지 않았습니다. .env.local 파일을 확인해주세요.');
  }

  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openaiClient;
}

// 텍스트를 청크로 분할 (1000자씩, 200자 오버랩)
export function chunkText(text: string, chunkSize: number = 1000, overlap: number = 200): string[] {
  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    chunks.push(text.slice(start, end));
    
    // 끝에 도달했으면 종료
    if (end >= text.length) break;
    
    // 다음 시작점 (오버랩 고려)
    start = start + chunkSize - overlap;
  }

  return chunks;
}

// 텍스트를 임베딩 벡터로 변환
export async function embedText(text: string): Promise<number[]> {
  const openai = getOpenAIClient();
  
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  });

  return response.data[0].embedding;
}

// Pinecone에 문서 저장
export async function storeDocument(
  documentId: string,
  fileName: string,
  content: string,
  userId: string,
  companyId?: string
) {
  const pinecone = getPineconeClient();
  const indexName = process.env.PINECONE_INDEX || 'workfree-copilot';
  
  // 인덱스 가져오기
  const index = pinecone.index(indexName);

  // 텍스트를 청크로 분할
  const chunks = chunkText(content);

  // 각 청크를 임베딩하고 저장
  const vectors = [];
  
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const embedding = await embedText(chunk);
    
    vectors.push({
      id: `${documentId}-chunk-${i}`,
      values: embedding,
      metadata: {
        documentId,
        fileName,
        chunkIndex: i,
        totalChunks: chunks.length,
        text: chunk,
        userId,
        companyId: companyId || 'default',
        createdAt: new Date().toISOString(),
      },
    });
  }

  // Pinecone에 일괄 업로드
  await index.upsert(vectors);

  return {
    success: true,
    documentId,
    chunksCount: chunks.length,
  };
}

// RAG 검색: 질문과 관련된 문서 찾기
export async function searchDocuments(
  query: string,
  userId: string,
  companyId?: string,
  topK: number = 5
) {
  const pinecone = getPineconeClient();
  const indexName = process.env.PINECONE_INDEX || 'workfree-copilot';
  const index = pinecone.index(indexName);

  // 질문을 임베딩
  const queryEmbedding = await embedText(query);

  // 벡터 검색
  const searchResults = await index.query({
    vector: queryEmbedding,
    topK,
    includeMetadata: true,
    filter: companyId ? { companyId } : undefined,
  });

  return searchResults.matches.map((match: any) => ({
    id: match.id,
    score: match.score,
    text: match.metadata?.text || '',
    fileName: match.metadata?.fileName || '',
    documentId: match.metadata?.documentId || '',
  }));
}

// GPT-4를 사용하여 답변 생성 (RAG 컨텍스트 포함)
export async function generateAnswer(
  query: string,
  context: Array<{ text: string; fileName: string; score: number }>
) {
  const openai = getOpenAIClient();

  // 컨텍스트 구성
  const contextText = context
    .map((doc, i) => `[문서 ${i + 1}: ${doc.fileName}]\n${doc.text}`)
    .join('\n\n---\n\n');

  const systemPrompt = `당신은 WorkFree Co-pilot 업무 어시스턴트입니다.
회사 매뉴얼과 문서를 기반으로 직원들의 업무 질문에 답변합니다.

**답변 원칙:**
1. 제공된 문서 내용을 기반으로만 답변하세요
2. 문서에 없는 내용이면 "제공된 매뉴얼에서 해당 정보를 찾을 수 없습니다"라고 말하세요
3. 답변은 친절하고 명확하게, 단계별로 설명하세요
4. 관련 문서명을 언급하여 출처를 밝히세요
5. 한국어로 답변하세요`;

  const userPrompt = `**참고 문서:**
${contextText}

**질문:**
${query}

**답변:**`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: 1000,
  });

  return completion.choices[0].message.content || '답변을 생성할 수 없습니다.';
}

// 스트리밍 답변 생성
export async function generateAnswerStream(
  query: string,
  context: Array<{ text: string; fileName: string; score: number }>
) {
  const openai = getOpenAIClient();

  const contextText = context
    .map((doc, i) => `[문서 ${i + 1}: ${doc.fileName}]\n${doc.text}`)
    .join('\n\n---\n\n');

  const systemPrompt = `당신은 WorkFree Co-pilot 업무 어시스턴트입니다.
회사 매뉴얼과 문서를 기반으로 직원들의 업무 질문에 답변합니다.

**답변 원칙:**
1. 제공된 문서 내용을 기반으로만 답변하세요
2. 문서에 없는 내용이면 "제공된 매뉴얼에서 해당 정보를 찾을 수 없습니다"라고 말하세요
3. 답변은 친절하고 명확하게, 단계별로 설명하세요
4. 관련 문서명을 언급하여 출처를 밝히세요
5. 한국어로 답변하세요`;

  const userPrompt = `**참고 문서:**
${contextText}

**질문:**
${query}

**답변:**`;

  const stream = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: 1000,
    stream: true,
  });

  return stream;
}

