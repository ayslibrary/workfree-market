'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc, serverTimestamp, QueryDocumentSnapshot, DocumentData, Timestamp } from 'firebase/firestore';
import MainNavigation from '@/components/MainNavigation';

interface Request {
  id: string;
  title: string;
  job: string;
  tools: string[];
  problem: string;
  expectedFeature: string;
  priority: string;
  fileUrls: string[];
  status: string;
  createdAt: Timestamp | string;
  maker?: string;
  makerStartDate?: Timestamp | string;
  dueDate?: Date;
}

export default function RequestsPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [filter, setFilter] = useState<'all' | 'approved' | 'inProgress' | 'completed'>('approved');
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string>('');
  const [makerName, setMakerName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!db) {
      console.error('Firebase가 초기화되지 않았습니다.');
      setLoading(false);
      setHasError(true);
      return;
    }

    // Firestore 실시간 리스너
    const requestsRef = collection(db, 'requests');
    
    // 기본적으로 승인된 요청만 표시
    let q;
    if (filter === 'all') {
      q = query(requestsRef, orderBy('createdAt', 'desc'));
    } else if (filter === 'approved') {
      q = query(requestsRef, where('status', '==', '승인'), orderBy('createdAt', 'desc'));
    } else if (filter === 'inProgress') {
      q = query(requestsRef, where('status', '==', '제작중'), orderBy('createdAt', 'desc'));
    } else {
      q = query(requestsRef, where('status', '==', '출시완료'), orderBy('createdAt', 'desc'));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const requestsData: Request[] = [];
      snapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
        requestsData.push({
          id: doc.id,
          ...doc.data()
        } as Request);
      });
      setRequests(requestsData);
      setLoading(false);
      setHasError(false);
    }, (error) => {
      console.error('요청 조회 오류:', error);
      setLoading(false);
      setHasError(true);
    });

    return () => unsubscribe();
  }, [filter]);

  const getStatusBadge = (status: string) => {
    const badges: { [key: string]: { bg: string; text: string; label: string } } = {
      '대기': { bg: 'bg-gray-100', text: 'text-gray-700', label: '⏳ 검수 대기' },
      '승인': { bg: 'bg-green-100', text: 'text-green-700', label: '✅ 승인됨' },
      '제작중': { bg: 'bg-blue-100', text: 'text-blue-700', label: '🔨 제작중' },
      '검수중': { bg: 'bg-yellow-100', text: 'text-yellow-700', label: '🔍 검수중' },
      '출시완료': { bg: 'bg-purple-100', text: 'text-purple-700', label: '🎉 출시완료' },
      '수정요청': { bg: 'bg-red-100', text: 'text-red-700', label: '📝 수정 요청' },
    };
    const badge = badges[status] || badges['대기'];
    return (
      <span className={`${badge.bg} ${badge.text} px-3 py-1 rounded-full text-xs font-semibold`}>
        {badge.label}
      </span>
    );
  };

  const getPriorityColor = (priority: string) => {
    const colors: { [key: string]: string } = {
      '긴급': 'text-red-600 font-bold',
      '높음': 'text-orange-600 font-semibold',
      '중': 'text-blue-600',
      '낮음': 'text-gray-600',
    };
    return colors[priority] || colors['중'];
  };

  const handleApplyClick = (requestId: string) => {
    setSelectedRequestId(requestId);
    setShowApplyModal(true);
  };

  const handleApplySubmit = async () => {
    if (!makerName.trim()) {
      alert('제작자 이름을 입력해주세요!');
      return;
    }

    if (!db) {
      alert('Firebase가 초기화되지 않았습니다.');
      return;
    }

    setIsSubmitting(true);

    try {
      const requestRef = doc(db, 'requests', selectedRequestId);
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 10); // 10일 후

      await updateDoc(requestRef, {
        status: '제작중',
        maker: makerName,
        makerStartDate: serverTimestamp(),
        dueDate: dueDate,
        updatedAt: serverTimestamp()
      });

      alert(`✅ 제작 신청이 완료되었습니다!\n제작자: ${makerName}\n마감일: ${dueDate.toLocaleDateString()}`);
      setShowApplyModal(false);
      setMakerName('');
      setSelectedRequestId('');
    } catch (error) {
      console.error('제작 신청 오류:', error);
      alert('❌ 제작 신청에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <MainNavigation />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 pt-24 md:pt-20">
        {/* Page Title */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-4 px-4 break-keep">
            🧩 자동화 요청 리스트
          </h1>
          <p className="text-lg text-gray-600 break-keep">
            직장인들이 실제로 필요한 자동화를 함께 만듭니다
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-3 mb-8 overflow-x-auto">
          <button
            onClick={() => setFilter('approved')}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              filter === 'approved'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-600 hover:bg-purple-50'
            }`}
          >
            ✅ 승인된 요청
          </button>
          <button
            onClick={() => setFilter('inProgress')}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              filter === 'inProgress'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-600 hover:bg-purple-50'
            }`}
          >
            🔨 제작중
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              filter === 'completed'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-600 hover:bg-purple-50'
            }`}
          >
            🎉 출시완료
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              filter === 'all'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-600 hover:bg-purple-50'
            }`}
          >
            📋 전체
          </button>
        </div>

        {/* Error State */}
        {hasError && (
          <div className="text-center py-20 bg-red-50 rounded-lg border border-red-200 flex flex-col items-center">
            <img 
              src="/fri-work.png" 
              alt="프리(Fri) - 에러 발생" 
              className="h-24 w-auto mb-4 opacity-70"
            />
            <p className="text-red-700 font-semibold text-lg">
              ⚠️ 프리(Fri)가 잠시 길을 잃었어요!
            </p>
            <p className="text-red-600 mt-2">
              데이터 로드에 실패했습니다. 관리자에게 문의해주세요.
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading && !hasError && (
          <div className="text-center py-20">
            <div className="mb-4 flex justify-center">
              <img 
                src="/fri-work.png" 
                alt="프리(Fri) 로딩 중" 
                className="h-20 w-auto animate-bounce"
              />
            </div>
            <p className="mt-4 text-purple-600 font-semibold text-lg">
              ✨ 프리(Fri)가 자동화 요청 리스트를 가져오는 중...
            </p>
            <p className="text-gray-500 mt-2">잠시만 기다려주세요!</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !hasError && requests.length === 0 && (
          <div className="text-center py-12 md:py-20 bg-white rounded-2xl shadow-sm">
            <div className="mb-4 flex justify-center">
              <img 
                src="/fri-free.png" 
                alt="프리(Fri) - 요청 없음" 
                className="h-32 w-auto"
              />
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">
              프리(Fri)가 쉴 수 있도록, 새로운 자동화 요청을 부탁해요!
            </h3>
            <p className="text-gray-600 mb-6">
              함께 만들어갈 첫 번째 자동화를 제안해주세요.
            </p>
            <Link
              href="/request"
              className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-all"
            >
              ✨ 요청하기
            </Link>
          </div>
        )}

        {/* Requests Grid */}
        {!loading && requests.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requests.map((request) => (
              <div
                key={request.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 border border-gray-100"
              >
                {/* Status & Priority */}
                <div className="flex items-center justify-between mb-4">
                  {getStatusBadge(request.status)}
                  <span className={`text-sm ${getPriorityColor(request.priority)}`}>
                    {request.priority === '긴급' && '🔥 '}
                    {request.priority}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                  {request.title}
                </h3>

                {/* Job & Tools */}
                <div className="mb-4">
                  <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm mr-2 mb-2">
                    💼 {request.job}
                  </span>
                  {request.tools.slice(0, 3).map((tool, index) => (
                    <span
                      key={index}
                      className="inline-block bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm mr-2 mb-2"
                    >
                      {tool}
                    </span>
                  ))}
                  {request.tools.length > 3 && (
                    <span className="text-sm text-gray-500">
                      +{request.tools.length - 3}
                    </span>
                  )}
                </div>

                {/* Problem */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {request.problem}
                </p>

                {/* Files */}
                {request.fileUrls && request.fileUrls.length > 0 && (
                  <div className="mb-4">
                    <span className="text-xs text-gray-500">
                      📎 첨부파일 {request.fileUrls.length}개
                    </span>
                  </div>
                )}

                {/* Maker Info */}
                {request.maker && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      🧑‍💻 제작자: <span className="font-semibold">{request.maker}</span>
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  {request.status === '승인' && (
                    <button 
                      onClick={() => handleApplyClick(request.id)}
                      className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-all font-medium"
                    >
                      🚀 제작 신청하기
                    </button>
                  )}
                  {request.status === '제작중' && (
                    <div className="text-center text-sm text-gray-600">
                      제작 진행 중입니다
                    </div>
                  )}
                  {request.status === '출시완료' && (
                    <Link
                      href="/kits"
                      className="block w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-all font-medium text-center"
                    >
                      💾 키트 다운로드
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <Link
            href="/request"
            className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl hover:shadow-lg transition-all font-semibold text-lg"
          >
            ✨ 새 자동화 요청하기
          </Link>
        </div>
      </main>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              🚀 제작 신청하기
            </h2>
            <p className="text-gray-600 mb-6">
              이 요청의 자동화 키트를 제작하시겠습니까?
              <br />
              <span className="text-sm text-gray-500">마감일은 10일 후로 설정됩니다.</span>
            </p>
            
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                제작자 이름 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={makerName}
                onChange={(e) => setMakerName(e.target.value)}
                placeholder="이름을 입력하세요"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled={isSubmitting}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowApplyModal(false);
                  setMakerName('');
                  setSelectedRequestId('');
                }}
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium disabled:opacity-50"
              >
                취소
              </button>
              <button
                onClick={handleApplySubmit}
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all font-medium disabled:opacity-50"
              >
                {isSubmitting ? '신청 중...' : '✅ 신청하기'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

