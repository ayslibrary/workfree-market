'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import SimpleHeader from '@/components/SimpleHeader';

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
  createdAt: any;
  maker?: string;
  makerStartDate?: any;
}

export default function AdminPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);

  useEffect(() => {
    if (!db) {
      console.error('Firebase가 초기화되지 않았습니다.');
      setLoading(false);
      return;
    }

    const requestsRef = collection(db, 'requests');
    const q = query(requestsRef, orderBy('createdAt', 'desc'));

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
    }, (error) => {
      console.error('요청 조회 오류:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleStatusChange = async (requestId: string, newStatus: string) => {
    if (!db) return;
    
    try {
      const requestRef = doc(db, 'requests', requestId);
      await updateDoc(requestRef, {
        status: newStatus,
        updatedAt: new Date()
      });
      alert(`✅ 상태가 "${newStatus}"(으)로 변경되었습니다!`);
    } catch (error) {
      console.error('상태 변경 오류:', error);
      alert('❌ 상태 변경에 실패했습니다.');
    }
  };

  const filteredRequests = requests.filter(req => {
    if (filter === 'all') return true;
    return req.status === filter;
  });

  const getStatusBadge = (status: string) => {
    const badges: { [key: string]: { bg: string; text: string; label: string } } = {
      '대기': { bg: 'bg-gray-100', text: 'text-gray-700', label: '⏳ 검수 대기' },
      '승인': { bg: 'bg-green-100', text: 'text-green-700', label: '✅ 승인됨' },
      '제작중': { bg: 'bg-blue-100', text: 'text-blue-700', label: '🔨 제작중' },
      '검수중': { bg: 'bg-yellow-100', text: 'text-yellow-700', label: '🔍 검수중' },
      '출시완료': { bg: 'bg-purple-100', text: 'text-purple-700', label: '🎉 출시완료' },
      '반려': { bg: 'bg-red-100', text: 'text-red-700', label: '❌ 반려' },
    };
    const badge = badges[status] || badges['대기'];
    return (
      <span className={`${badge.bg} ${badge.text} px-3 py-1 rounded-full text-xs font-semibold`}>
        {badge.label}
      </span>
    );
  };

  const getStatusCount = (status: string) => {
    return requests.filter(req => req.status === status).length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
      <SimpleHeader />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-gray-400">
            <div className="text-2xl font-bold text-gray-700">{getStatusCount('대기')}</div>
            <div className="text-sm text-gray-600">⏳ 검수 대기</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-green-400">
            <div className="text-2xl font-bold text-green-700">{getStatusCount('승인')}</div>
            <div className="text-sm text-gray-600">✅ 승인됨</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-blue-400">
            <div className="text-2xl font-bold text-blue-700">{getStatusCount('제작중')}</div>
            <div className="text-sm text-gray-600">🔨 제작중</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-yellow-400">
            <div className="text-2xl font-bold text-yellow-700">{getStatusCount('검수중')}</div>
            <div className="text-sm text-gray-600">🔍 검수중</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-purple-400">
            <div className="text-2xl font-bold text-purple-700">{getStatusCount('출시완료')}</div>
            <div className="text-sm text-gray-600">🎉 출시완료</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-red-400">
            <div className="text-2xl font-bold text-red-700">{getStatusCount('반려')}</div>
            <div className="text-sm text-gray-600">❌ 반려</div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'all'
                ? 'bg-red-600 text-white'
                : 'bg-white text-gray-700 hover:bg-red-50'
            }`}
          >
            전체 ({requests.length})
          </button>
          <button
            onClick={() => setFilter('대기')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === '대기'
                ? 'bg-gray-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            ⏳ 검수 대기 ({getStatusCount('대기')})
          </button>
          <button
            onClick={() => setFilter('승인')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === '승인'
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-700 hover:bg-green-50'
            }`}
          >
            ✅ 승인 ({getStatusCount('승인')})
          </button>
          <button
            onClick={() => setFilter('제작중')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === '제작중'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-blue-50'
            }`}
          >
            🔨 제작중 ({getStatusCount('제작중')})
          </button>
          <button
            onClick={() => setFilter('검수중')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === '검수중'
                ? 'bg-yellow-600 text-white'
                : 'bg-white text-gray-700 hover:bg-yellow-50'
            }`}
          >
            🔍 검수중 ({getStatusCount('검수중')})
          </button>
          <button
            onClick={() => setFilter('출시완료')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === '출시완료'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-700 hover:bg-purple-50'
            }`}
          >
            🎉 출시완료 ({getStatusCount('출시완료')})
          </button>
        </div>

        {/* Requests List */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-red-600 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">요청을 불러오는 중...</p>
          </div>
        )}

        {!loading && filteredRequests.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              요청이 없습니다
            </h3>
          </div>
        )}

        {!loading && filteredRequests.length > 0 && (
          <div className="space-y-4">
            {filteredRequests.map((request) => (
              <div
                key={request.id}
                className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-800">
                        {request.title}
                      </h3>
                      {getStatusBadge(request.status)}
                      <span className="text-sm text-gray-500">
                        우선순위: <span className="font-semibold">{request.priority}</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <span className="px-2 py-1 bg-gray-100 rounded">💼 {request.job}</span>
                      {request.tools.slice(0, 3).map((tool, idx) => (
                        <span key={idx} className="px-2 py-1 bg-purple-50 text-purple-700 rounded">
                          {tool}
                        </span>
                      ))}
                      {request.tools.length > 3 && (
                        <span className="text-gray-500">+{request.tools.length - 3}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">문제:</p>
                    <p className="text-sm text-gray-600 line-clamp-2">{request.problem}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">기대 기능:</p>
                    <p className="text-sm text-gray-600 line-clamp-2">{request.expectedFeature}</p>
                  </div>
                </div>

                {request.fileUrls && request.fileUrls.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">
                      📎 첨부파일 ({request.fileUrls.length})
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {request.fileUrls.map((url, idx) => (
                        <a
                          key={idx}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          파일 {idx + 1}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {request.maker && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      🧑‍💻 제작자: <span className="font-semibold">{request.maker}</span>
                    </p>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                  {request.status === '대기' && (
                    <>
                      <button
                        onClick={() => handleStatusChange(request.id, '승인')}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-medium"
                      >
                        ✅ 승인
                      </button>
                      <button
                        onClick={() => handleStatusChange(request.id, '반려')}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-medium"
                      >
                        ❌ 반려
                      </button>
                    </>
                  )}
                  {request.status === '검수중' && (
                    <>
                      <button
                        onClick={() => handleStatusChange(request.id, '출시완료')}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all font-medium"
                      >
                        🎉 출시 승인
                      </button>
                      <button
                        onClick={() => handleStatusChange(request.id, '제작중')}
                        className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-all font-medium"
                      >
                        🔙 수정 요청
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setSelectedRequest(request)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium"
                  >
                    👁️ 상세 보기
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8">
            <div className="flex items-start justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">{selectedRequest.title}</h2>
              <button
                onClick={() => setSelectedRequest(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="font-semibold text-gray-700 mb-1">상태:</p>
                {getStatusBadge(selectedRequest.status)}
              </div>
              <div>
                <p className="font-semibold text-gray-700 mb-1">직무:</p>
                <p className="text-gray-600">{selectedRequest.job}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700 mb-1">사용 툴:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedRequest.tools.map((tool, idx) => (
                    <span key={idx} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-semibold text-gray-700 mb-1">문제:</p>
                <p className="text-gray-600 whitespace-pre-wrap">{selectedRequest.problem}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700 mb-1">기대 기능:</p>
                <p className="text-gray-600 whitespace-pre-wrap">{selectedRequest.expectedFeature}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700 mb-1">우선순위:</p>
                <p className="text-gray-600">{selectedRequest.priority}</p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t flex gap-3">
              <button
                onClick={() => setSelectedRequest(null)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

