// 관리자 권한 설정 스크립트

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDtRQXr_vORnHcY_teMD_qNzkwbzTOz2h0",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "workfree-market.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "workfree-market",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function setAdmin() {
  console.log('🔧 관리자 권한 설정 스크립트\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // 사용자 이메일 입력
  const email = process.argv[2];

  if (!email) {
    console.error('❌ 사용법: npm run set:admin <이메일>');
    console.error('예시: npm run set:admin ayslibrary@gmail.com\n');
    process.exit(1);
  }

  console.log(`📧 이메일: ${email}`);
  console.log('🔍 사용자 검색 중...\n');

  try {
    // 사용자 찾기
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.error('❌ 해당 이메일의 사용자를 찾을 수 없습니다.');
      console.error('회원가입을 먼저 해주세요!\n');
      process.exit(1);
    }

    // 관리자 권한 부여
    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();
    
    console.log('✅ 사용자 발견!');
    console.log(`   이름: ${userData.displayName || '없음'}`);
    console.log(`   현재 권한: ${userData.role || 'buyer'}\n`);

    if (userData.role === 'admin') {
      console.log('⚠️  이미 관리자 권한이 있습니다!\n');
      process.exit(0);
    }

    console.log('🔄 관리자 권한 부여 중...');
    
    await updateDoc(doc(db, 'users', userDoc.id), {
      role: 'admin',
      updatedAt: new Date(),
    });

    console.log('✅ 관리자 권한 부여 완료!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 설정 완료!');
    console.log('\n📝 다음 단계:');
    console.log('1. 브라우저 새로고침 (F5)');
    console.log('2. /admin 접속');
    console.log('3. RAG Analytics 버튼 클릭\n');

  } catch (error: any) {
    console.error('❌ 오류 발생:', error.message);
    process.exit(1);
  }
}

setAdmin();

