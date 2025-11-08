// RAG 검색 테스트

import { hybridSearch } from '../src/lib/rag/supabaseRAG';

async function testSearch() {
  console.log('🔍 RAG 검색 테스트 시작\n');

  const testQueries = [
    '연봉 계산기',
    '마케터 툴 추천',
    '크레딧 충전',
  ];

  for (const query of testQueries) {
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`질문: "${query}"\n`);

    try {
      const results = await hybridSearch(query, { topK: 3 });
      
      console.log(`✅ ${results.length}개 결과 발견:`);
      results.forEach((r, i) => {
        console.log(`\n${i + 1}. ${r.metadata.title}`);
        console.log(`   유사도: ${(r.similarity * 100).toFixed(1)}%`);
        console.log(`   URL: ${r.metadata.url}`);
        console.log(`   내용: ${r.content.substring(0, 100)}...`);
      });
      
      if (results.length === 0) {
        console.log('⚠️  검색 결과 없음!');
      }
      
      console.log('');
    } catch (error: any) {
      console.error(`❌ 검색 실패: ${error.message}`);
    }
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🎉 테스트 완료!\n');
}

testSearch()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('💥 오류:', err);
    process.exit(1);
  });

