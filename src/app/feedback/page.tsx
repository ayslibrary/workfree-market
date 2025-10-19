"use client";

import { useState } from "react";
import Link from "next/link";

export default function FeedbackPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    // 1. 사용자 정보
    name: "",
    email: "",
    job: "",
    industry: "",
    workType: "",

    // 2. 사용 키트
    usedKits: [] as string[],
    otherKit: "",

    // 3. 사용 환경
    os: "",
    programVersion: "",
    executionResult: "",
    errorMessage: "",

    // 4. 효율성 평가 (1-5점)
    efficiency: 3,
    easeOfUse: 3,
    jobFit: 3,
    reusability: 3,
    nps: 3,

    // 효율 절감 시간
    timeSaved: [] as string[],

    // 5. 피드백
    requestedFeatures: "",
    inconveniences: "",
    customization: "",

    // 6. WorkFree 인식
    howDidYouKnow: "",
    automationReason: "",
    desiredKits: "",

    // 7. 리워드
    selectedReward: "",

    // 8. 후기 공개
    reviewConsent: "",
  });

  const handleCheckboxChange = (field: "usedKits" | "timeSaved", value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((item) => item !== value)
        : [...prev[field], value],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("설문 제출:", formData);
    setSubmitted(true);
    // 실제로는 여기서 백엔드로 데이터 전송
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-2xl w-full text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6">
            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">✅ 설문이 완료되었습니다!</h1>
          <p className="text-xl text-gray-600 mb-8">
            소중한 피드백 감사드립니다.<br />
            정식 출시 알림과 리워드는 이메일로 발송됩니다.
          </p>
          <div className="space-y-4">
            <Link
              href="/beta"
              className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              👉 다른 키트 체험하러 가기
            </Link>
            <Link
              href="/"
              className="block bg-gray-100 text-gray-700 px-8 py-4 rounded-full font-semibold hover:bg-gray-200 transition-all"
            >
              홈으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* 헤더 */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white text-xl font-bold">W</span>
            </div>
            <div className="text-xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              WorkFree Market
            </div>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 max-w-4xl">
        {/* 메인 헤더 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              🧠 WorkFree Beta 설문
            </span>
          </h1>
          <p className="text-xl text-gray-700 mb-4">
            당신의 피드백이 더 나은 자동화를 만듭니다.
          </p>
          <p className="text-gray-600">
            3분 정도만 시간을 내어 아래 항목을 작성해 주세요.<br />
            당신의 의견이 WorkFree의 정식 버전을 완성합니다. 💡
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 1. 사용자 정보 */}
          <section className="bg-white rounded-3xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">👤 1️⃣ 사용자 정보</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  이름 / 닉네임 (선택)
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                  placeholder="홍길동"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  이메일 주소 (정식버전 알림용, 선택)
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">직무</label>
                <select
                  value={formData.job}
                  onChange={(e) => setFormData({ ...formData, job: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                >
                  <option value="">선택하세요</option>
                  <option value="영업">영업</option>
                  <option value="회계">회계</option>
                  <option value="총무">총무</option>
                  <option value="마케팅">마케팅</option>
                  <option value="개발">개발</option>
                  <option value="기타">기타</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">산업군</label>
                <select
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                >
                  <option value="">선택하세요</option>
                  <option value="제조">제조</option>
                  <option value="IT">IT</option>
                  <option value="서비스">서비스</option>
                  <option value="교육">교육</option>
                  <option value="공공">공공</option>
                  <option value="기타">기타</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">근무 형태</label>
                <select
                  value={formData.workType}
                  onChange={(e) => setFormData({ ...formData, workType: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                >
                  <option value="">선택하세요</option>
                  <option value="사무직">사무직</option>
                  <option value="재택">재택</option>
                  <option value="프리랜서">프리랜서</option>
                  <option value="기타">기타</option>
                </select>
              </div>
            </div>
          </section>

          {/* 2. 사용한 자동화 키트 */}
          <section className="bg-white rounded-3xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">💼 2️⃣ 사용한 자동화 키트</h2>
            <div className="space-y-3">
              {["Outlook 자동회신 키트", "Excel 정산 자동입력 키트", "Python 파일정리 스크립트", "GAS AutoMailer", "Streamlit Report Viewer"].map((kit) => (
                <label key={kit} className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-xl hover:border-purple-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.usedKits.includes(kit)}
                    onChange={() => handleCheckboxChange("usedKits", kit)}
                    className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span className="text-gray-700">{kit}</span>
                </label>
              ))}
              <div className="mt-3">
                <input
                  type="text"
                  value={formData.otherKit}
                  onChange={(e) => setFormData({ ...formData, otherKit: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                  placeholder="기타 (직접 입력)"
                />
              </div>
            </div>
          </section>

          {/* 3. 사용 환경 */}
          <section className="bg-white rounded-3xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">⚙️ 3️⃣ 사용 환경</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">사용 OS</label>
                <div className="flex flex-wrap gap-3">
                  {["Windows", "Mac", "기타"].map((os) => (
                    <label key={os} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="os"
                        value={os}
                        checked={formData.os === os}
                        onChange={(e) => setFormData({ ...formData, os: e.target.value })}
                        className="w-4 h-4 text-purple-600"
                      />
                      <span className="text-gray-700">{os}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">사용 프로그램 버전</label>
                <input
                  type="text"
                  value={formData.programVersion}
                  onChange={(e) => setFormData({ ...formData, programVersion: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                  placeholder="예: Excel 2019, Office 365, Outlook 2021"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">실행 결과</label>
                <select
                  value={formData.executionResult}
                  onChange={(e) => setFormData({ ...formData, executionResult: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                >
                  <option value="">선택하세요</option>
                  <option value="정상 작동">정상 작동</option>
                  <option value="오류 발생">오류 발생</option>
                  <option value="일부 기능만 작동">일부 기능만 작동</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">오류 발생 시 메시지</label>
                <textarea
                  value={formData.errorMessage}
                  onChange={(e) => setFormData({ ...formData, errorMessage: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                  placeholder="오류 메시지를 입력해주세요"
                />
              </div>
            </div>
          </section>

          {/* 4. 효율성 및 체감 효과 */}
          <section className="bg-white rounded-3xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">📈 4️⃣ 효율성 및 체감 효과</h2>
            <div className="space-y-6">
              {[
                { key: "efficiency", label: "사용 전보다 업무 효율이 향상되었다" },
                { key: "easeOfUse", label: "설치 및 실행이 쉬웠다" },
                { key: "jobFit", label: "실제 내 업무에 적합했다" },
                { key: "reusability", label: "재사용 의사가 있다" },
                { key: "nps", label: "다른 사람에게 추천하고 싶다 (NPS)" },
              ].map((item) => (
                <div key={item.key}>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    {item.label}
                  </label>
                  <div className="flex justify-between items-center gap-2">
                    {[1, 2, 3, 4, 5].map((score) => (
                      <button
                        key={score}
                        type="button"
                        onClick={() => setFormData({ ...formData, [item.key]: score })}
                        className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                          formData[item.key as keyof typeof formData] === score
                            ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white scale-105"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {["😡", "😕", "😐", "🙂", "🤩"][score - 1]} {score}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">📊 효율 절감 추정 시간</h3>
                <p className="text-sm text-gray-600 mb-4">이번 키트를 사용하면서 절약한 시간을 선택해주세요.</p>
                <div className="space-y-3">
                  {[
                    { label: "메일 처리", value: "하루 약 30분" },
                    { label: "엑셀 정리", value: "주 2시간 이상" },
                    { label: "파일 정리", value: "월 5시간 이상" },
                  ].map((time) => (
                    <label key={time.label} className="flex items-center justify-between p-3 border-2 border-gray-200 rounded-xl hover:border-purple-300 cursor-pointer">
                      <div>
                        <span className="font-semibold text-gray-900">{time.label}</span>
                        <span className="text-gray-500 ml-3">{time.value}</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={formData.timeSaved.includes(time.label)}
                        onChange={() => handleCheckboxChange("timeSaved", time.label)}
                        className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* 5. 피드백 및 개선 의견 */}
          <section className="bg-white rounded-3xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">💬 5️⃣ 피드백 및 개선 의견</h2>
            <p className="text-gray-600 mb-6">
              자유롭게 적어주세요. 실제 반영될 가능성이 높은 항목부터 개발팀이 직접 검토합니다.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  💡 추가되면 좋을 기능
                </label>
                <textarea
                  value={formData.requestedFeatures}
                  onChange={(e) => setFormData({ ...formData, requestedFeatures: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                  placeholder="예: 첨부파일 자동 저장, 조건별 회신, 시트 자동 새로고침 등"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  🧩 사용 중 불편했던 점
                </label>
                <textarea
                  value={formData.inconveniences}
                  onChange={(e) => setFormData({ ...formData, inconveniences: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                  placeholder="예: 설치 과정이 복잡함, 버튼 위치가 헷갈림"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ⚙️ 내가 원하는 커스터마이징 형태
                </label>
                <textarea
                  value={formData.customization}
                  onChange={(e) => setFormData({ ...formData, customization: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                  placeholder="예: 우리 회사 메일 제목 패턴 맞춤, 특정 폴더만 자동화"
                />
              </div>
            </div>
          </section>

          {/* 6. WorkFree에 대한 인식 */}
          <section className="bg-white rounded-3xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">🧠 6️⃣ WorkFree에 대한 인식</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  처음 WorkFree를 어디서 알게 되었나요?
                </label>
                <select
                  value={formData.howDidYouKnow}
                  onChange={(e) => setFormData({ ...formData, howDidYouKnow: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                >
                  <option value="">선택하세요</option>
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
                  value={formData.automationReason}
                  onChange={(e) => setFormData({ ...formData, automationReason: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                  placeholder="자유롭게 작성해주세요"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  앞으로 어떤 자동화 키트를 원하시나요?
                </label>
                <textarea
                  value={formData.desiredKits}
                  onChange={(e) => setFormData({ ...formData, desiredKits: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                  placeholder="예: 고객응대 자동화, 견적서 생성 등"
                />
              </div>
            </div>
          </section>

          {/* 7. 베타테스터 리워드 */}
          <section className="bg-white rounded-3xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">💎 7️⃣ 베타테스터 리워드 선택</h2>
            <p className="text-gray-600 mb-4">
              🎁 피드백을 남겨주신 분께는 아래 중 하나를 선택하실 수 있습니다.
            </p>
            <div className="space-y-3">
              {[
                { value: "discount", label: "🎟️ 정식버전 50% 할인 쿠폰" },
                { value: "challenge", label: "🧠 자동화 챌린지 사전 참여권" },
                { value: "creator", label: "💼 WorkFree 크리에이터 등록 우선 초대" },
              ].map((reward) => (
                <label key={reward.value} className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-purple-300 cursor-pointer">
                  <input
                    type="radio"
                    name="reward"
                    value={reward.value}
                    checked={formData.selectedReward === reward.value}
                    onChange={(e) => setFormData({ ...formData, selectedReward: e.target.value })}
                    className="w-5 h-5 text-purple-600"
                  />
                  <span className="text-gray-700 font-medium">{reward.label}</span>
                </label>
              ))}
            </div>
          </section>

          {/* 8. 후기 공개 동의 */}
          <section className="bg-white rounded-3xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">📩 8️⃣ (선택) 후기 공개 동의</h2>
            <p className="text-gray-600 mb-4">
              베타 후기 일부는 WorkFree 홈페이지나 SNS에 인용될 수 있습니다.<br />
              동의하시면 이름 대신 닉네임으로 공개됩니다.
            </p>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-purple-300 cursor-pointer">
                <input
                  type="radio"
                  name="consent"
                  value="yes"
                  checked={formData.reviewConsent === "yes"}
                  onChange={(e) => setFormData({ ...formData, reviewConsent: e.target.value })}
                  className="w-5 h-5 text-purple-600"
                />
                <span className="text-gray-700">네, 후기 공개에 동의합니다.</span>
              </label>
              <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-purple-300 cursor-pointer">
                <input
                  type="radio"
                  name="consent"
                  value="no"
                  checked={formData.reviewConsent === "no"}
                  onChange={(e) => setFormData({ ...formData, reviewConsent: e.target.value })}
                  className="w-5 h-5 text-purple-600"
                />
                <span className="text-gray-700">아니요, 내부 피드백으로만 활용해주세요.</span>
              </label>
            </div>
          </section>

          {/* 제출 버튼 */}
          <div className="text-center pt-8">
            <button
              type="submit"
              className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-16 py-5 rounded-full font-bold text-xl hover:shadow-2xl hover:scale-105 transition-all"
            >
              ✅ 설문 제출하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


