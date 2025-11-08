// Supabase 연결 테스트 스크립트

import { createClient } from '@supabase/supabase-js';

async function testConnection() {
  console.log('🔍 Supabase 연결 테스트 시작...\n');

  // 1. 환경변수 확인
  console.log('📋 환경변수 체크:');
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl) {
    console.error('❌ NEXT_PUBLIC_SUPABASE_URL이 설정되지 않았습니다!');
    process.exit(1);
  }
  if (!supabaseKey) {
    console.error('❌ SUPABASE_SERVICE_KEY가 설정되지 않았습니다!');
    process.exit(1);
  }

  console.log(`✅ SUPABASE_URL: ${supabaseUrl}`);
  console.log(`✅ SERVICE_KEY: ${supabaseKey.substring(0, 20)}...`);
  console.log('');

  // 2. Supabase 클라이언트 생성
  console.log('🔌 Supabase 클라이언트 연결 중...');
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // 3. 간단한 쿼리 테스트
    console.log('📡 연결 테스트 쿼리 실행...');
    const { data, error } = await supabase
      .from('workfree_knowledge')
      .select('count', { count: 'exact', head: true });

    if (error) {
      if (error.message.includes('relation') && error.message.includes('does not exist')) {
        console.log('⚠️  테이블이 아직 생성되지 않았습니다 (정상)');
        console.log('   → 다음 단계에서 테이블을 생성하겠습니다.\n');
        return true;
      } else {
        throw error;
      }
    }

    console.log('✅ Supabase 연결 성공!');
    console.log(`   데이터베이스에 데이터가 ${data || 0}개 있습니다.\n`);
    return true;

  } catch (error) {
    console.error('❌ 연결 실패:', error);
    return false;
  }
}

// 실행
testConnection()
  .then(success => {
    if (success) {
      console.log('🎉 모든 테스트 통과!');
      console.log('📝 다음 단계: 벡터 테이블 생성\n');
      process.exit(0);
    } else {
      console.error('❌ 테스트 실패. 환경변수를 다시 확인해주세요.');
      process.exit(1);
    }
  })
  .catch(err => {
    console.error('💥 예상치 못한 오류:', err);
    process.exit(1);
  });

