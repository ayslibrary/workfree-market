'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, onSnapshot, QueryDocumentSnapshot, DocumentData, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import SimpleHeader from '@/components/SimpleHeader';

interface Kit {
  id: string;
  title: string;
  job: string;
  tools: string[];
  problem: string;
  expectedFeature: string;
  maker: string;
  status: string;
  createdAt: Timestamp | string;
  downloadUrl?: string;
  rating?: number;
  downloads?: number;
}

export default function KitsPage() {
  const [kits, setKits] = useState<Kit[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTesterModal, setShowTesterModal] = useState(false);
  const [selectedKit, setSelectedKit] = useState<Kit | null>(null);
  const [testerEmail, setTesterEmail] = useState('');
  const [testerName, setTesterName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!db) {
      console.error('Firebase가 초기화되지 않았습니다.');
      setLoading(false);
      return;
    }

    // 출시완료된 키트만 조회
    const kitsRef = collection(db, 'requests');
    const q = query(
      kitsRef, 
      where('status', '==', '출시완료'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const kitsData: Kit[] = [];
      snapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
        kitsData.push({
          id: doc.id,
          ...doc.data()
        } as Kit);
      });
      setKits(kitsData);
      setLoading(false);
    }, (error) => {
      console.error('키트 조회 오류:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleTesterApply = (kit: Kit) => {
    setSelectedKit(kit);
    setShowTesterModal(true);
  };

  const handleTesterSubmit = async () => {
    if (!testerEmail.trim() || !testerName.trim()) {
      alert('이름과 이메일을 입력해주세요!');
      return;
    }

    if (!selectedKit) return;

    setIsSubmitting(true);

    try {
      const testerData = {
        kitId: selectedKit.id,
        kitTitle: selectedKit.title,
        testerName,
        testerEmail,
        status: '대기',
        points: 0,
        createdAt: new Date().toISOString()
      };

      // Firebase 설정되어 있으면 Firestore에 저장
      if (db) {
        await addDoc(collection(db, 'testers'), {
          ...testerData,
          createdAt: serverTimestamp()
        });
        console.log('✅ Firestore 저장 성공!');
      } else {
        console.log('⚠️ Firebase 미설정 - 임시 모드');
        // localStorage 저장
        const testers = JSON.parse(localStorage.getItem('testers') || '[]');
        testers.push({ id: Date.now().toString(), ...testerData });
        localStorage.setItem('testers', JSON.stringify(testers));
      }

      alert('✅ 테스터 신청이 완료되었습니다!\n이메일로 테스트 링크를 보내드립니다.');
      setShowTesterModal(false);
      setTesterEmail('');
      setTesterName('');
      setSelectedKit(null);
    } catch (error) {
      console.error('테스터 신청 오류:', error);
      alert('❌ 신청에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <SimpleHeader />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-4">
            🎉 WorkFree 자동화 키트
          </h1>
          <p className="text-xl opacity-90 mb-8">
            직장인들이 만든 검증된 자동화 솔루션
          </p>
          <div className="flex justify-center gap-8 text-center">
            <div>
              <div className="text-4xl font-bold">{kits.length}</div>
              <div className="text-sm opacity-80">출시된 키트</div>
            </div>
            <div>
              <div className="text-4xl font-bold">
                {kits.reduce((sum, kit) => sum + (kit.downloads || 0), 0)}
              </div>
              <div className="text-sm opacity-80">총 다운로드</div>
            </div>
            <div>
              <div className="text-4xl font-bold">
                {kits.length > 0 
                  ? (kits.reduce((sum, kit) => sum + (kit.rating || 4.5), 0) / kits.length).toFixed(1)
                  : '0.0'
                }
              </div>
              <div className="text-sm opacity-80">평균 평점</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Beta Notice */}
        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6 mb-12">
          <div className="flex items-start gap-4">
            <span className="text-3xl">🎁</span>
            <div>
              <h3 className="text-lg font-bold text-blue-900 mb-2">
                베타 테스트 기간 무료!
              </h3>
              <p className="text-blue-800 mb-3">
                현재 모든 키트를 무료로 다운로드하실 수 있습니다. 
                피드백을 남겨주시면 정식 출시 시 <span className="font-semibold">50% 할인 쿠폰</span>을 드립니다!
              </p>
              <Link
                href="/feedback"
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all font-medium"
              >
                📝 피드백 남기기
              </Link>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">키트를 불러오는 중...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && kits.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              아직 출시된 키트가 없습니다
            </h3>
            <p className="text-gray-600 mb-6">
              첫 번째 자동화 키트를 기다리고 있습니다!
            </p>
            <Link
              href="/requests"
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-all"
            >
              요청 리스트 보기
            </Link>
          </div>
        )}

        {/* Kits Grid */}
        {!loading && kits.length > 0 && (
          <>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                🚀 출시된 자동화 키트
              </h2>
              <p className="text-gray-600">
                실제 직장인들이 만들고 검증한 자동화 솔루션입니다
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {kits.map((kit) => (
                <div
                  key={kit.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 border border-gray-100"
                >
                  {/* Kit Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                        {kit.title}
                      </h3>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
                          ✅ 출시완료
                        </span>
                        {kit.rating && (
                          <span className="text-sm text-yellow-600 font-semibold">
                            ⭐ {kit.rating.toFixed(1)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Maker & Job */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <span className="font-semibold">👤 제작자:</span>
                      <span>{kit.maker}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        💼 {kit.job}
                      </span>
                      {kit.tools.slice(0, 3).map((tool, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded"
                        >
                          {tool}
                        </span>
                      ))}
                      {kit.tools.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{kit.tools.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {kit.problem}
                  </p>

                  {/* Stats */}
                  {kit.downloads && (
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <span>📥 {kit.downloads} 다운로드</span>
                    </div>
                  )}

                  {/* Download & Tester Buttons */}
                  <div className="flex gap-2">
                    <a
                      href={kit.downloadUrl || '/downloads/rpa-test.txt'}
                      download
                      className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg hover:shadow-lg transition-all font-semibold text-center"
                    >
                      💾 다운로드
                    </a>
                    <button
                      onClick={() => handleTesterApply(kit)}
                      className="px-4 bg-purple-100 text-purple-700 py-3 rounded-lg hover:bg-purple-200 transition-all font-semibold"
                    >
                      🧪
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Tester Section */}
        <section className="mt-16 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              🧪 베타 테스터가 되어주세요!
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              자동화 키트를 먼저 사용해보고 피드백을 남겨주시면
              <br />
              <span className="font-semibold text-purple-600">정식 출시 시 특별 혜택</span>을 드립니다!
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="text-3xl mb-3">🎟️</div>
                <h3 className="font-bold text-gray-800 mb-2">50% 할인 쿠폰</h3>
                <p className="text-sm text-gray-600">
                  정식 출시 시 모든 유료 키트에 사용 가능
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="text-3xl mb-3">🏆</div>
                <h3 className="font-bold text-gray-800 mb-2">얼리 어답터 배지</h3>
                <p className="text-sm text-gray-600">
                  프로필에 특별 배지 부여
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="text-3xl mb-3">💡</div>
                <h3 className="font-bold text-gray-800 mb-2">신규 키트 우선 접근</h3>
                <p className="text-sm text-gray-600">
                  새 키트 출시 시 가장 먼저 알림
                </p>
              </div>
            </div>

            <Link
              href="/feedback"
              className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-10 py-4 rounded-xl hover:shadow-lg transition-all font-bold text-lg"
            >
              📝 지금 바로 피드백 남기기
            </Link>
          </div>
        </section>

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            원하는 자동화가 없으신가요?
          </p>
          <Link
            href="/request"
            className="inline-block bg-purple-600 text-white px-8 py-4 rounded-xl hover:bg-purple-700 transition-all font-semibold text-lg"
          >
            ✨ 새 자동화 요청하기
          </Link>
        </div>
      </main>

      {/* Tester Application Modal */}
      {showTesterModal && selectedKit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              🧪 테스터 신청
            </h2>
            <p className="text-gray-600 mb-2">
              <span className="font-semibold">{selectedKit.title}</span>
            </p>
            <p className="text-sm text-gray-500 mb-6">
              베타 테스터로 참여하시면 피드백 후 특별 혜택을 드립니다!
            </p>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  이름 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={testerName}
                  onChange={(e) => setTesterName(e.target.value)}
                  placeholder="홍길동"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  이메일 <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={testerEmail}
                  onChange={(e) => setTesterEmail(e.target.value)}
                  placeholder="example@email.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={isSubmitting}
                />
                <p className="text-xs text-gray-500 mt-2">
                  테스트 링크를 이메일로 보내드립니다
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowTesterModal(false);
                  setTesterEmail('');
                  setTesterName('');
                  setSelectedKit(null);
                }}
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium disabled:opacity-50"
              >
                취소
              </button>
              <button
                onClick={handleTesterSubmit}
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all font-medium disabled:opacity-50"
              >
                {isSubmitting ? '신청 중...' : '🧪 신청하기'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

