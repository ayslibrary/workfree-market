// Supabase 벡터 기반 하이브리드 RAG 검색

import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ============================================
// 타입 정의
// ============================================

export interface SearchFilters {
  category?: string;
  toolName?: string;
  tags?: string[];
  targetAudience?: string[];
}

export interface SearchResult {
  id: string;
  content: string;
  metadata: {
    title: string;
    category: string;
    url: string;
    toolName?: string;
    tags: string[];
    targetAudience: string[];
    keywords: string[];
  };
  similarity: number;
}

// ============================================
// Query Expansion (쿼리 확장)
// ============================================

export function expandQuery(query: string): string[] {
  const expansions: Record<string, string[]> = {
    '연봉': ['실수령', '급여', '월급', '세금', '소득'],
    '엑셀': ['Excel', 'spreadsheet', '스프레드시트', '표', '데이터'],
    '자동화': ['automation', '자동', 'RPA', '효율화'],
    '블로그': ['blog', '포스팅', '글쓰기', '콘텐츠'],
    '이메일': ['메일', 'email', 'Outlook', '메시지'],
    '마케팅': ['광고', '홍보', 'SNS', '캠페인'],
    '이직': ['전직', '이동', '커리어'],
    '크레딧': ['포인트', '결제', '충전'],
    '베타': ['테스터', '무료체험', '베타테스트'],
    '이미지': ['사진', '그림', '포토'],
    '뉴스': ['기사', '언론', '뉴스레터'],
  };

  const queries = [query];
  let added = false;

  Object.entries(expansions).forEach(([key, values]) => {
    if (query.includes(key)) {
      values.forEach(value => {
        if (!added) { // 최대 1-2개만 추가
          queries.push(query.replace(key, value));
          added = true;
        }
      });
    }
  });

  return queries.slice(0, 2); // 최대 2개 (원본 + 확장 1개)
}

// ============================================
// 벡터 검색 (단일 쿼리)
// ============================================

export async function vectorSearch(
  query: string,
  options: {
    topK?: number;
    filters?: SearchFilters;
    minSimilarity?: number;
  } = {}
): Promise<SearchResult[]> {
  const { topK = 3, filters = {}, minSimilarity = 0.3 } = options;

  try {
    // 1. 쿼리 벡터화
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: query,
    });

    const queryEmbedding = embeddingResponse.data[0].embedding;

    // 2. 모든 데이터 가져오기
    let query_builder = supabase
      .from('workfree_knowledge')
      .select('id, content, metadata, embedding');

    // 필터 적용
    if (filters.category) {
      query_builder = query_builder.eq('metadata->>category', filters.category);
    }
    if (filters.toolName) {
      query_builder = query_builder.eq('metadata->>toolName', filters.toolName);
    }

    const { data: allData, error } = await query_builder;

    if (error) {
      console.error('Supabase query error:', error);
      return [];
    }

    if (!allData || allData.length === 0) {
      console.log('⚠️  데이터가 없습니다');
      return [];
    }

    // 3. 클라이언트에서 코사인 유사도 계산
    const results = allData.map(row => {
      // embedding이 문자열이면 파싱
      let embedding = row.embedding;
      if (typeof embedding === 'string') {
        embedding = JSON.parse(embedding);
      }
      embedding = embedding as number[];
      
      // 코사인 유사도 계산
      let dotProduct = 0;
      let normA = 0;
      let normB = 0;
      
      for (let i = 0; i < 1536; i++) {
        dotProduct += queryEmbedding[i] * embedding[i];
        normA += queryEmbedding[i] * queryEmbedding[i];
        normB += embedding[i] * embedding[i];
      }
      
      const similarity = dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));

      return {
        id: row.id,
        content: row.content,
        metadata: row.metadata as any,
        similarity: similarity,
      };
    });

    // 4. 유사도 순으로 정렬 및 필터링
    return results
      .filter(r => r.similarity >= minSimilarity)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK);

  } catch (error) {
    console.error('Vector search error:', error);
    return [];
  }
}

// ============================================
// 하이브리드 검색 (멀티 쿼리)
// ============================================

export async function hybridSearch(
  query: string,
  options: {
    topK?: number;
    filters?: SearchFilters;
  } = {}
): Promise<SearchResult[]> {
  const { topK = 3 } = options;

  // 1. Query Expansion
  const queries = expandQuery(query);
  console.log('🔍 확장된 쿼리:', queries);

  // 2. 각 쿼리로 검색 (병렬)
  const allResults = await Promise.all(
    queries.map(q => vectorSearch(q, { ...options, topK: 5 }))
  );

  // 3. 중복 제거 및 점수 합산
  const mergedResults = new Map<string, SearchResult>();

  allResults.flat().forEach(result => {
    if (mergedResults.has(result.id)) {
      const existing = mergedResults.get(result.id)!;
      // 더 높은 유사도로 업데이트
      if (result.similarity > existing.similarity) {
        existing.similarity = result.similarity;
      }
    } else {
      mergedResults.set(result.id, result);
    }
  });

  // 4. 유사도 순 정렬 및 상위 K개
  return Array.from(mergedResults.values())
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topK);
}

// ============================================
// 카테고리별 추천 검색
// ============================================

export async function searchByCategory(
  category: 'tool' | 'faq' | 'policy' | 'intro',
  topK: number = 5
): Promise<SearchResult[]> {
  try {
    const { data, error } = await supabase
      .from('workfree_knowledge')
      .select('*')
      .eq('metadata->>category', category)
      .limit(topK);

    if (error) throw error;

    return data.map((row: any) => ({
      id: row.id,
      content: row.content,
      metadata: row.metadata,
      similarity: 1.0, // 카테고리 검색은 유사도 1
    }));
  } catch (error) {
    console.error('Category search error:', error);
    return [];
  }
}

// ============================================
// 특정 툴 정보 가져오기
// ============================================

export async function getToolInfo(toolName: string): Promise<SearchResult | null> {
  try {
    const { data, error } = await supabase
      .from('workfree_knowledge')
      .select('*')
      .eq('metadata->>toolName', toolName)
      .single();

    if (error) throw error;

    return {
      id: data.id,
      content: data.content,
      metadata: data.metadata,
      similarity: 1.0,
    };
  } catch (error) {
    console.error('Get tool info error:', error);
    return null;
  }
}

// ============================================
// 통계 및 유틸리티
// ============================================

export async function getKnowledgeStats() {
  try {
    const { count: total } = await supabase
      .from('workfree_knowledge')
      .select('*', { count: 'exact', head: true });

    const { count: tools } = await supabase
      .from('workfree_knowledge')
      .select('*', { count: 'exact', head: true })
      .eq('metadata->>category', 'tool');

    const { count: faqs } = await supabase
      .from('workfree_knowledge')
      .select('*', { count: 'exact', head: true })
      .eq('metadata->>category', 'faq');

    return {
      total: total || 0,
      tools: tools || 0,
      faqs: faqs || 0,
    };
  } catch (error) {
    console.error('Stats error:', error);
    return { total: 0, tools: 0, faqs: 0 };
  }
}

