'use client';

import { useState } from 'react';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import SimpleHeader from '@/components/SimpleHeader';

interface MakerProject {
  id: string;
  title: string;
  status: string;
  requestId: string;
  startDate: string;
  dueDate: string;
  progress: number;
  coMakers?: string[];
}

export default function MakerPage() {
  const [activeTab, setActiveTab] = useState<'ongoing' | 'submitted' | 'completed'>('ongoing');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<MakerProject | null>(null);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // TODO: 실제로는 Firestore에서 가져올 데이터
  const mockProjects: MakerProject[] = [
    {
      id: '1',
      title: '엑셀 자동 정산 키트',
      status: '제작중',
      requestId: 'req_001',
      startDate: '2025-01-15',
      dueDate: '2025-01-25',
      progress: 60,
      coMakers: ['김개발', '이코딩']
    },
    {
      id: '2',
      title: 'Outlook 자동 회신 키트',
      status: '검수중',
      requestId: 'req_002',
      startDate: '2025-01-10',
      dueDate: '2025-01-20',
      progress: 100
    }
  ];

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      '제작중': 'bg-blue-100 text-blue-700',
      '검수중': 'bg-yellow-100 text-yellow-700',
      '출시완료': 'bg-green-100 text-green-700',
      '수정요청': 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const handleSubmitClick = (project: MakerProject) => {
    setSelectedProject(project);
    setShowSubmitModal(true);
  };

  const handleSubmitComplete = async () => {
    if (!downloadUrl.trim()) {
      alert('다운로드 URL을 입력해주세요!');
      return;
    }

    if (!selectedProject) return;

    setIsSubmitting(true);

    try {
      // Firebase 설정되어 있으면 Firestore 업데이트
      if (db) {
        const requestRef = doc(db, 'requests', selectedProject.requestId);
        await updateDoc(requestRef, {
          status: '검수중',
          downloadUrl: downloadUrl,
          submittedAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        console.log('✅ Firestore 업데이트 성공!');
      } else {
        console.log('⚠️ Firebase 미설정 - 임시 모드');
        // localStorage 업데이트
        const requests = JSON.parse(localStorage.getItem('requests') || '[]');
        const updated = requests.map((req: { id: string; status: string; downloadUrl?: string; submittedAt?: string }) => 
          req.id === selectedProject.requestId 
            ? { ...req, status: '검수중', downloadUrl, submittedAt: new Date().toISOString() }
            : req
        );
        localStorage.setItem('requests', JSON.stringify(updated));
      }

      alert('✅ 제작 완료 제출이 완료되었습니다!\n운영자 검수 후 출시됩니다.');
      setShowSubmitModal(false);
      setDownloadUrl('');
      setSelectedProject(null);
    } catch (error) {
      console.error('제출 오류:', error);
      alert('❌ 제출에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <SimpleHeader />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🧑‍💻 제작자 대시보드
          </h1>
          <p className="text-lg text-gray-600">
            내가 제작 중인 자동화 키트를 관리하세요
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-blue-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">진행중</span>
              <span className="text-3xl">🔨</span>
            </div>
            <p className="text-3xl font-bold text-blue-600">2</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-yellow-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">검수중</span>
              <span className="text-3xl">🔍</span>
            </div>
            <p className="text-3xl font-bold text-yellow-600">1</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-green-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">출시완료</span>
              <span className="text-3xl">🎉</span>
            </div>
            <p className="text-3xl font-bold text-green-600">5</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-purple-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">누적 수익</span>
              <span className="text-3xl">💰</span>
            </div>
            <p className="text-3xl font-bold text-purple-600">₩450K</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('ongoing')}
            className={`px-6 py-3 font-medium transition-all border-b-2 ${
              activeTab === 'ongoing'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-blue-600'
            }`}
          >
            🔨 제작중 (2)
          </button>
          <button
            onClick={() => setActiveTab('submitted')}
            className={`px-6 py-3 font-medium transition-all border-b-2 ${
              activeTab === 'submitted'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-blue-600'
            }`}
          >
            🔍 검수중 (1)
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-6 py-3 font-medium transition-all border-b-2 ${
              activeTab === 'completed'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-blue-600'
            }`}
          >
            ✅ 완료 (5)
          </button>
        </div>

        {/* Projects List */}
        <div className="space-y-6">
          {mockProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-6 border border-gray-100"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-800">
                      {project.title}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    요청 ID: {project.requestId} • 시작: {project.startDate} • 마감: {project.dueDate}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">진행률</span>
                  <span className="text-sm font-bold text-blue-600">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              {/* Co-Makers */}
              {project.coMakers && project.coMakers.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">공동 제작자:</p>
                  <div className="flex flex-wrap gap-2">
                    {project.coMakers.map((maker, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm"
                      >
                        👤 {maker}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                {project.status === '제작중' && (
                  <>
                    <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all font-medium">
                      📝 진행 상황 업데이트
                    </button>
                    <button 
                      onClick={() => handleSubmitClick(project)}
                      className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-all font-medium"
                    >
                      ✅ 제작 완료 제출
                    </button>
                    <button className="px-4 bg-purple-100 text-purple-700 py-2 rounded-lg hover:bg-purple-200 transition-all font-medium">
                      👥 공동 제작자 추가
                    </button>
                  </>
                )}
                {project.status === '검수중' && (
                  <div className="flex-1 text-center py-2 text-gray-600">
                    운영자 검수를 기다리고 있습니다...
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* New Project CTA */}
        <div className="mt-12 text-center bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            새로운 프로젝트 시작하기
          </h3>
          <p className="text-gray-600 mb-6">
            승인된 요청에서 제작 신청을 하면 여기에 표시됩니다
          </p>
          <Link
            href="/requests"
            className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl hover:shadow-lg transition-all font-semibold"
          >
            🚀 요청 리스트 보러가기
          </Link>
        </div>
      </main>

      {/* Submit Modal */}
      {showSubmitModal && selectedProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              ✅ 제작 완료 제출
            </h2>
            <p className="text-gray-600 mb-2">
              <span className="font-semibold">{selectedProject.title}</span>
            </p>
            <p className="text-sm text-gray-500 mb-6">
              제작이 완료되었습니다! 결과물 다운로드 URL을 입력해주세요.
            </p>
            
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                다운로드 URL <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                value={downloadUrl}
                onChange={(e) => setDownloadUrl(e.target.value)}
                placeholder="https://example.com/download/kit.zip"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-500 mt-2">
                예: Google Drive, Dropbox, GitHub Release URL 등
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowSubmitModal(false);
                  setDownloadUrl('');
                  setSelectedProject(null);
                }}
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium disabled:opacity-50"
              >
                취소
              </button>
              <button
                onClick={handleSubmitComplete}
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-medium disabled:opacity-50"
              >
                {isSubmitting ? '제출 중...' : '✅ 제출하기'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

