// Supabase에 임베딩 저장하는 스크립트

import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import * as fs from 'fs';
import * as path from 'path';

// 환경변수 체크
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const openaiKey = process.env.OPENAI_API_KEY;

if (!supabaseUrl || !supabaseKey || !openaiKey) {
  console.error('❌ 환경변수가 설정되지 않았습니다!');
  console.error('필요한 환경변수: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_KEY, OPENAI_API_KEY');
  process.exit(1);
}

// 클라이언트 초기화
const supabase = createClient(supabaseUrl, supabaseKey);
const openai = new OpenAI({ apiKey: openaiKey });

// Knowledge base 로드
const knowledgePath = path.join(process.cwd(), 'src', 'lib', 'rag', 'knowledge.json');
const knowledge = JSON.parse(fs.readFileSync(knowledgePath, 'utf-8'));

async function generateEmbeddings() {
  console.log('🚀 임베딩 생성 시작!\n');
  console.log(`📚 총 ${knowledge.length}개 문서 처리 예정\n`);

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < knowledge.length; i++) {
    const doc = knowledge[i];
    const progress = `[${i + 1}/${knowledge.length}]`;
    
    console.log(`${progress} "${doc.title}" 처리 중...`);
    
    try {
      // 1. OpenAI로 임베딩 생성
      console.log(`  ⚙️  벡터 생성 중...`);
      const embeddingResponse = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: doc.content,
      });
      
      const embedding = embeddingResponse.data[0].embedding;
      console.log(`  ✅ 벡터 생성 완료 (차원: ${embedding.length})`);
      
      // 2. Supabase에 저장
      console.log(`  💾 Supabase 저장 중...`);
      const { error } = await supabase
        .from('workfree_knowledge')
        .upsert({
          id: doc.id,
          content: doc.content,
          embedding: embedding,
          metadata: {
            title: doc.title,
            category: doc.category,
            toolName: doc.toolName,
            tags: doc.tags,
            url: doc.url,
            targetAudience: doc.targetAudience,
            keywords: doc.keywords,
          },
          updated_at: new Date().toISOString(),
        });
      
      if (error) {
        throw error;
      }
      
      console.log(`  ✅ Supabase 저장 완료\n`);
      successCount++;
      
      // Rate limit 방지 (OpenAI: 500 requests/min for Tier 1)
      // 안전하게 1.5초 대기
      await new Promise(resolve => setTimeout(resolve, 1500));
      
    } catch (error: any) {
      console.error(`  ❌ 실패: ${error.message}\n`);
      errorCount++;
    }
  }
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🎉 임베딩 생성 완료!\n');
  console.log(`✅ 성공: ${successCount}개`);
  console.log(`❌ 실패: ${errorCount}개`);
  console.log(`📊 성공률: ${Math.round((successCount / knowledge.length) * 100)}%\n`);
  
  // 저장된 데이터 확인
  console.log('🔍 Supabase 데이터 확인 중...');
  const { count, error } = await supabase
    .from('workfree_knowledge')
    .select('*', { count: 'exact', head: true });
  
  if (error) {
    console.error('❌ 확인 실패:', error);
  } else {
    console.log(`✅ Supabase에 총 ${count}개 문서 저장됨\n`);
  }
}

// 실행
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('🤖 WorkFree RAG 임베딩 생성 스크립트');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

generateEmbeddings()
  .then(() => {
    console.log('✨ 모든 작업 완료!');
    console.log('📝 다음 단계: RAG 검색 라이브러리 구현\n');
    process.exit(0);
  })
  .catch((err) => {
    console.error('💥 예상치 못한 오류:', err);
    process.exit(1);
  });

