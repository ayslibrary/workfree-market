// 상세 디버깅

import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function debug() {
  console.log('🔍 상세 디버깅\n');

  // 1. 데이터 조회
  const { data: allData, error } = await supabase
    .from('workfree_knowledge')
    .select('id, content, metadata, embedding')
    .limit(3);

  if (error) {
    console.error('❌ 조회 실패:', error);
    return;
  }

  console.log(`✅ ${allData?.length}개 조회 성공\n`);

  // 2. 첫 번째 데이터 확인
  if (allData && allData.length > 0) {
    const first = allData[0];
    console.log('첫 번째 문서:');
    console.log('  ID:', first.id);
    console.log('  제목:', first.metadata?.title);
    console.log('  Embedding 타입:', typeof first.embedding);
    console.log('  Embedding 길이:', Array.isArray(first.embedding) ? first.embedding.length : 'Not an array');
    console.log('  Embedding 첫 5개 값:', Array.isArray(first.embedding) ? first.embedding.slice(0, 5) : 'N/A');
    console.log('');
  }

  // 3. 쿼리 벡터화
  console.log('🔍 쿼리 벡터화 테스트...');
  const query = '연봉 계산기';
  const embeddingResponse = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: query,
  });

  const queryEmbedding = embeddingResponse.data[0].embedding;
  console.log('  쿼리:', query);
  console.log('  벡터 길이:', queryEmbedding.length);
  console.log('  벡터 첫 5개:', queryEmbedding.slice(0, 5));
  console.log('');

  // 4. 유사도 계산 테스트
  if (allData && allData.length > 0) {
    console.log('🧮 유사도 계산 테스트...\n');
    
    allData.forEach((row, idx) => {
      const embedding = row.embedding as any;
      
      if (!Array.isArray(embedding) || embedding.length !== 1536) {
        console.log(`  ${idx + 1}. ${row.metadata.title}: ❌ 임베딩 형식 오류`);
        return;
      }

      // 코사인 유사도
      let dotProduct = 0;
      let normA = 0;
      let normB = 0;
      
      for (let i = 0; i < 1536; i++) {
        dotProduct += queryEmbedding[i] * embedding[i];
        normA += queryEmbedding[i] * queryEmbedding[i];
        normB += embedding[i] * embedding[i];
      }
      
      const similarity = dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
      console.log(`  ${idx + 1}. ${row.metadata.title}: ${(similarity * 100).toFixed(2)}%`);
    });
  }
}

debug()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('💥 오류:', err);
    process.exit(1);
  });

