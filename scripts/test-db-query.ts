// Supabase 직접 쿼리 테스트

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

async function testQueries() {
  console.log('🔍 Supabase 데이터 확인 테스트\n');

  // 1. 전체 데이터 개수
  const { count, error: countError } = await supabase
    .from('workfree_knowledge')
    .select('*', { count: 'exact', head: true });

  if (countError) {
    console.error('❌ Count 조회 실패:', countError);
  } else {
    console.log(`✅ 총 데이터: ${count}개\n`);
  }

  // 2. 첫 3개 데이터 조회
  const { data, error } = await supabase
    .from('workfree_knowledge')
    .select('id, metadata')
    .limit(3);

  if (error) {
    console.error('❌ 데이터 조회 실패:', error);
  } else {
    console.log('✅ 첫 3개 데이터:');
    data?.forEach((row, i) => {
      console.log(`${i + 1}. ${row.metadata.title} (ID: ${row.id})`);
    });
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // 3. hybrid_search 함수 테스트
  console.log('🧪 hybrid_search 함수 테스트...\n');

  // 임베딩을 임시로 0으로 채운 배열로 테스트
  const dummyEmbedding = Array(1536).fill(0);

  try {
    const { data: searchData, error: searchError } = await supabase.rpc('hybrid_search', {
      query_embedding: dummyEmbedding,
      match_count: 3,
      filter_metadata: {},
    });

    if (searchError) {
      console.error('❌ hybrid_search 함수 오류:', searchError);
    } else {
      console.log(`✅ hybrid_search 결과: ${searchData?.length || 0}개`);
      searchData?.forEach((row: any, i: number) => {
        console.log(`${i + 1}. ${row.metadata?.title || row.id}`);
      });
    }
  } catch (error: any) {
    console.error('❌ RPC 호출 실패:', error.message);
  }
}

testQueries()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('💥 오류:', err);
    process.exit(1);
  });

