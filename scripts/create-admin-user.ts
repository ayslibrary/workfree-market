// 관리자 계정 생성 스크립트

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDtRQXr_vORnHcY_teMD_qNzkwbzTOz2h0",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "workfree-market.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "workfree-market",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

async function createAdmin() {
  const email = 'ayoung1034@gmail.com';
  const password = 'workfree2025!'; // 임시 비밀번호
  const displayName = '아영 (관리자)';

  console.log('🔧 관리자 계정 생성\n');
  console.log(`📧 이메일: ${email}`);
  console.log(`🔑 임시 비밀번호: ${password}`);
  console.log('(로그인 후 변경해주세요)\n');

  try {
    // 1. Firebase Auth 계정 생성
    console.log('👤 Firebase Auth 계정 생성 중...');
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log(`✅ Auth 계정 생성 완료 (UID: ${user.uid})\n`);

    // 2. 프로필 업데이트
    await updateProfile(user, { displayName });
    console.log('✅ 프로필 업데이트 완료\n');

    // 3. Firestore에 관리자 정보 저장
    console.log('💾 Firestore 저장 중...');
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      displayName: displayName,
      photoURL: null,
      role: 'admin', // 관리자 권한!
      credits: 100, // 관리자 크레딧
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    console.log('✅ Firestore 저장 완료\n');

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 관리자 계정 생성 완료!\n');
    console.log('📝 로그인 정보:');
    console.log(`   이메일: ${email}`);
    console.log(`   비밀번호: ${password}`);
    console.log('\n🔒 보안을 위해 로그인 후 비밀번호를 변경해주세요!\n');

  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      console.log('⚠️  이미 계정이 존재합니다.');
      console.log('   기존 계정에 관리자 권한을 부여하려면:');
      console.log('   npm run set:admin ayoung1034@gmail.com\n');
    } else {
      console.error('❌ 오류:', error.message);
    }
    process.exit(1);
  }
}

createAdmin();





