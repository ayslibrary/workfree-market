'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import MainNavigation from '@/components/MainNavigation';

export default function FeedbackPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    // 사용자 정보
    name: '',
    email: '',
    job: '',
    industry: '',
    workStyle: '',
    
    // 사용한 키트
    usedKits: [] as string[],
    customKit: '',
    
    // 평점 (추가)
    rating: 5,
    
    // 사용 환경
    os: '',
    programVersion: '',
    executionResult: '',
    errorMessage: '',
    
    // 효율성
    mailTime: '',
    excelTime: '',
    fileTime: '',
    otherTime: '',
    
    // 피드백
    additionalFeatures: '',
    inconveniences: '',
    customization: '',
    
    // WorkFree 인식
    howDidYouKnow: '',
    whyAutomation: '',
    futureKits: '',
    
    // 리워드
    reward: '',
    
    // 후기 공개
    allowPublic: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleKitChange = (kit: string) => {
    setFormData(prev => {
      const kits = prev.usedKits.includes(kit)
        ? prev.usedKits.filter(k => k !== kit)
        : [...prev.usedKits, kit];
      return { ...prev, usedKits: kits };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!db) {
        throw new Error('Firebase가 초기화되지 않았습니다.');
      }

      const feedbackData = {
        ...formData,
        points: 100, // 기본 포인트
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'feedbacks'), feedbackData);

      // 자동 승인 로직: 사용한 각 키트의 평균 평점 계산
      for (const kitTitle of formData.usedKits) {
        await checkAndAutoApprove(kitTitle);
      }

      alert('✅ 피드백이 제출되었습니다!\n감사합니다. 100 포인트가 적립되었습니다.');
      router.push('/kits');
    } catch (error) {
      console.error('피드백 제출 오류:', error);
      alert('❌ 피드백 제출에 실패했습니다. 다시 시도해주세요.');
      setIsSubmitting(false);
    }
  };

  // 자동 승인 로직 함수
  const checkAndAutoApprove = async (kitTitle: string) => {
    try {
      if (!db) return;

      // 해당 키트에 대한 모든 피드백 가져오기
      const feedbacksRef = collection(db, 'feedbacks');
      const q = query(feedbacksRef, where('usedKits', 'array-contains', kitTitle));
      const snapshot = await getDocs(q);

      // 평균 평점 계산
      let totalRating = 0;
      let count = 0;
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.rating) {
          totalRating += data.rating;
          count++;
        }
      });

      const averageRating = count > 0 ? totalRating / count : 0;

      console.log(`📊 ${kitTitle} 평균 평점: ${averageRating.toFixed(2)} (${count}개 피드백)`);

      // 평균 평점 4.5 이상이면 자동 승인
      if (averageRating >= 4.5 && count >= 3) { // 최소 3개 이상 피드백 필요
        // requests 컬렉션에서 해당 키트 찾기
        const requestsRef = collection(db, 'requests');
        const requestQuery = query(requestsRef, where('title', '==', kitTitle));
        const requestSnapshot = await getDocs(requestQuery);

        requestSnapshot.forEach(async (requestDoc) => {
          const currentStatus = requestDoc.data().status;
          
          // 검수중 상태인 경우에만 자동 승인
          if (currentStatus === '검수중') {
            const requestRef = doc(db, 'requests', requestDoc.id);
            await updateDoc(requestRef, {
              status: '출시완료',
              approvedAt: serverTimestamp(),
              averageRating: averageRating,
              feedbackCount: count
            });
            console.log(`✅ ${kitTitle} 자동 승인 완료! (평균: ${averageRating.toFixed(2)})`);
          }
        });
      }
    } catch (error) {
      console.error('자동 승인 체크 오류:', error);
      // 에러가 나도 피드백 제출은 완료되어야 하므로 throw하지 않음
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f0ff]">
      <MainNavigation />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12 pt-40 md:pt-28">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-4 px-4 break-keep">
            🧠 WorkFree Beta 설문
          </h1>
          <p className="text-lg text-gray-600 break-keep">
            당신의 피드백이 더 나은 자동화를 만듭니다 💡
          </p>
          <p className="text-sm text-gray-500 mt-2 break-keep">
            3분 정도만 시간을 내어 아래 항목을 작성해 주세요
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
          {/* 1. 사용자 정보 */}
          <section className="border-b border-gray-200 pb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              👤 사용자 정보
            </h2>
            
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    이름 / 닉네임 (선택)
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="선택 입력"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    이메일 (선택)
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="정식버전 알림용"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  직무
                </label>
                <select
                  name="job"
                  value={formData.job}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">선택해주세요</option>
                  <option value="영업">영업</option>
                  <option value="회계">회계</option>
                  <option value="총무">총무</option>
                  <option value="마케팅">마케팅</option>
                  <option value="개발">개발</option>
                  <option value="기타">기타</option>
                </select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    산업군
                  </label>
                  <select
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">선택해주세요</option>
                    <option value="제조">제조</option>
                    <option value="IT">IT</option>
                    <option value="서비스">서비스</option>
                    <option value="교육">교육</option>
                    <option value="공공">공공</option>
                    <option value="기타">기타</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    근무 형태
                  </label>
                  <select
                    name="workStyle"
                    value={formData.workStyle}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">선택해주세요</option>
                    <option value="사무직">사무직</option>
                    <option value="재택">재택</option>
                    <option value="프리랜서">프리랜서</option>
                    <option value="기타">기타</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* 2. 사용한 키트 */}
          <section className="border-b border-gray-200 pb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              💼 사용한 자동화 키트
            </h2>
            
            <div className="space-y-3">
              {['Outlook 자동회신 키트', 'Excel 정산 자동입력 키트', 'Python 파일정리 스크립트'].map((kit) => (
                <label
                  key={kit}
                  className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-purple-50"
                >
                  <input
                    type="checkbox"
                    checked={formData.usedKits.includes(kit)}
                    onChange={() => handleKitChange(kit)}
                    className="w-4 h-4 text-purple-600"
                  />
                  <span className="ml-3 text-gray-700">{kit}</span>
                </label>
              ))}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  기타 (직접 입력)
                </label>
                <input
                  type="text"
                  name="customKit"
                  value={formData.customKit}
                  onChange={handleChange}
                  placeholder="사용한 다른 키트가 있다면..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </section>

          {/* 2-1. 평점 */}
          <section className="border-b border-gray-200 pb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              ⭐ 키트 평가
            </h2>
            <p className="text-gray-600 mb-4">
              사용하신 자동화 키트에 대한 만족도를 평가해주세요
            </p>
            
            <div className="flex items-center gap-4">
              <span className="text-gray-700 font-medium">평점:</span>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                    className={`text-3xl transition-all ${
                      star <= formData.rating
                        ? 'text-yellow-500'
                        : 'text-gray-300 hover:text-yellow-400'
                    }`}
                  >
                    ⭐
                  </button>
                ))}
              </div>
              <span className="text-2xl font-bold text-purple-600">
                {formData.rating}.0
              </span>
            </div>
            
            <p className="text-sm text-gray-500 mt-4">
              💡 평균 평점 4.5 이상 시 자동으로 정식 출시됩니다!
            </p>
          </section>

          {/* 3. 사용 환경 */}
          <section className="border-b border-gray-200 pb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              ⚙️ 사용 환경
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  사용 OS
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="os"
                      value="Windows"
                      checked={formData.os === 'Windows'}
                      onChange={handleChange}
                      className="w-4 h-4 text-purple-600"
                    />
                    <span className="ml-2">Windows</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="os"
                      value="Mac"
                      checked={formData.os === 'Mac'}
                      onChange={handleChange}
                      className="w-4 h-4 text-purple-600"
                    />
                    <span className="ml-2">Mac</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="os"
                      value="기타"
                      checked={formData.os === '기타'}
                      onChange={handleChange}
                      className="w-4 h-4 text-purple-600"
                    />
                    <span className="ml-2">기타</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  사용 프로그램 버전
                </label>
                <input
                  type="text"
                  name="programVersion"
                  value={formData.programVersion}
                  onChange={handleChange}
                  placeholder="예: Excel 2019, Office 365, Outlook 2021"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  실행 결과
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="executionResult"
                      value="정상 작동"
                      checked={formData.executionResult === '정상 작동'}
                      onChange={handleChange}
                      className="w-4 h-4 text-purple-600"
                    />
                    <span className="ml-2">정상 작동</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="executionResult"
                      value="오류 발생"
                      checked={formData.executionResult === '오류 발생'}
                      onChange={handleChange}
                      className="w-4 h-4 text-purple-600"
                    />
                    <span className="ml-2">오류 발생</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="executionResult"
                      value="일부 기능만 작동"
                      checked={formData.executionResult === '일부 기능만 작동'}
                      onChange={handleChange}
                      className="w-4 h-4 text-purple-600"
                    />
                    <span className="ml-2">일부 기능만 작동</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  오류 발생 시 메시지
                </label>
                <textarea
                  name="errorMessage"
                  value={formData.errorMessage}
                  onChange={handleChange}
                  placeholder="오류 메시지를 복사해서 붙여넣어주세요"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </section>

          {/* 4. 효율성 및 체감 효과 */}
          <section className="border-b border-gray-200 pb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              📈 효율성 및 체감 효과
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              키트를 사용하면서 절약한 시간을 선택해주세요
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  메일 처리
                </label>
                <select
                  name="mailTime"
                  value={formData.mailTime}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">선택해주세요</option>
                  <option value="하루 약 30분">하루 약 30분</option>
                  <option value="하루 1시간 이상">하루 1시간 이상</option>
                  <option value="절감 없음">절감 없음</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  엑셀 정리
                </label>
                <select
                  name="excelTime"
                  value={formData.excelTime}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">선택해주세요</option>
                  <option value="주 2시간 이상">주 2시간 이상</option>
                  <option value="주 4시간 이상">주 4시간 이상</option>
                  <option value="절감 없음">절감 없음</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  파일 정리
                </label>
                <select
                  name="fileTime"
                  value={formData.fileTime}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">선택해주세요</option>
                  <option value="월 5시간 이상">월 5시간 이상</option>
                  <option value="월 10시간 이상">월 10시간 이상</option>
                  <option value="절감 없음">절감 없음</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  기타 (직접 입력)
                </label>
                <input
                  type="text"
                  name="otherTime"
                  value={formData.otherTime}
                  onChange={handleChange}
                  placeholder="예: 보고서 작성 주 3시간 절감"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </section>

          {/* 5. 피드백 및 개선 의견 */}
          <section className="border-b border-gray-200 pb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              💬 피드백 및 개선 의견
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              자유롭게 적어주세요. 실제 반영될 가능성이 높은 항목부터 개발팀이 직접 검토합니다
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  💡 추가되면 좋을 기능
                </label>
                <textarea
                  name="additionalFeatures"
                  value={formData.additionalFeatures}
                  onChange={handleChange}
                  placeholder="예: 첨부파일 자동 저장, 조건별 회신, 시트 자동 새로고침 등"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  🧩 사용 중 불편했던 점
                </label>
                <textarea
                  name="inconveniences"
                  value={formData.inconveniences}
                  onChange={handleChange}
                  placeholder="예: 설치 과정이 복잡함, 버튼 위치가 헷갈림"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ⚙️ 내가 원하는 커스터마이징 형태
                </label>
                <textarea
                  name="customization"
                  value={formData.customization}
                  onChange={handleChange}
                  placeholder="예: 우리 회사 메일 제목 패턴 맞춤, 특정 폴더만 자동화"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </section>

          {/* 6. WorkFree에 대한 인식 */}
          <section className="border-b border-gray-200 pb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              🧠 WorkFree에 대한 인식
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  처음 WorkFree를 어디서 알게 되었나요?
                </label>
                <select
                  name="howDidYouKnow"
                  value={formData.howDidYouKnow}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                >
                  <option value="">선택해주세요</option>
                  <option value="인스타그램">인스타그램</option>
                  <option value="네이버 블로그">네이버 블로그</option>
                  <option value="지인 추천">지인 추천</option>
                  <option value="기타">기타</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  자동화에 관심을 가지게 된 이유는 무엇인가요?
                </label>
                <textarea
                  name="whyAutomation"
                  value={formData.whyAutomation}
                  onChange={handleChange}
                  placeholder="자유롭게 작성해주세요"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  앞으로 어떤 자동화 키트를 원하시나요?
                </label>
                <textarea
                  name="futureKits"
                  value={formData.futureKits}
                  onChange={handleChange}
                  placeholder="예: 고객응대 자동화, 견적서 생성 등"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </section>

          {/* 7. 베타테스터 리워드 선택 */}
          <section className="border-b border-gray-200 pb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              💎 베타테스터 리워드 선택
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              🎁 피드백을 남겨주신 분께는 아래 중 하나를 선택하실 수 있습니다
            </p>
            
            <div className="space-y-3">
              <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-purple-50 transition-all">
                <input
                  type="radio"
                  name="reward"
                  value="50% 할인 쿠폰"
                  checked={formData.reward === '50% 할인 쿠폰'}
                  onChange={handleChange}
                  className="w-4 h-4 text-purple-600"
                />
                <span className="ml-3 font-medium">🎟️ 정식버전 50% 할인 쿠폰</span>
              </label>

              <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-purple-50 transition-all">
                <input
                  type="radio"
                  name="reward"
                  value="자동화 챌린지 사전 참여권"
                  checked={formData.reward === '자동화 챌린지 사전 참여권'}
                  onChange={handleChange}
                  className="w-4 h-4 text-purple-600"
                />
                <span className="ml-3 font-medium">🧠 자동화 챌린지 사전 참여권</span>
              </label>

              <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-purple-50 transition-all">
                <input
                  type="radio"
                  name="reward"
                  value="WorkFree 크리에이터 등록 우선 초대"
                  checked={formData.reward === 'WorkFree 크리에이터 등록 우선 초대'}
                  onChange={handleChange}
                  className="w-4 h-4 text-purple-600"
                />
                <span className="ml-3 font-medium">💼 WorkFree 크리에이터 등록 우선 초대</span>
              </label>
            </div>
          </section>

          {/* 8. 후기 공개 동의 */}
          <section className="pb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              📩 후기 공개 동의
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              베타 후기 일부는 WorkFree 홈페이지나 SNS에 인용될 수 있습니다.
              <br />
              동의하시면 이름 대신 닉네임으로 공개됩니다.
            </p>
            
            <label className="flex items-center p-4 border rounded-lg cursor-pointer">
              <input
                type="checkbox"
                name="allowPublic"
                checked={formData.allowPublic}
                onChange={handleChange}
                className="w-4 h-4 text-purple-600"
              />
              <span className="ml-3 text-gray-700">
                네, 후기 공개에 동의합니다
              </span>
            </label>
          </section>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-all disabled:opacity-50"
          >
            {isSubmitting ? '제출 중...' : '✨ 피드백 제출하기'}
          </button>
        </form>

        {/* Back Link */}
        <div className="text-center mt-8">
          <Link href="/kits" className="text-purple-600 hover:underline">
            ← 키트 페이지로 돌아가기
          </Link>
        </div>
      </main>
    </div>
  );
}
