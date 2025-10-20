'use client';

import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface RequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RequestModal({ isOpen, onClose }: RequestModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    job: '',
    problem: '',
    expectedFeature: '',
    priority: '중',
    tools: [] as string[]
  });

  const availableTools = ['Excel', 'Word', 'PowerPoint', 'Outlook', 'Python', 'JavaScript', 'Google Sheets'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleToolToggle = (tool: string) => {
    setFormData(prev => ({
      ...prev,
      tools: prev.tools.includes(tool)
        ? prev.tools.filter(t => t !== tool)
        : [...prev.tools, tool]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const requestData = {
        ...formData,
        status: '대기',
        createdAt: new Date().toISOString(),
      };

      // Firebase에 저장 시도
      if (db) {
        try {
          await addDoc(collection(db, 'requests'), {
            ...requestData,
            createdAt: serverTimestamp()
          });
        } catch (error) {
          console.warn('Firebase 저장 실패 (localStorage로 fallback):', error);
        }
      }

      // localStorage에도 저장 (백업)
      const existingRequests = JSON.parse(localStorage.getItem('requests') || '[]');
      const newRequest = {
        id: Date.now().toString(),
        ...requestData
      };
      existingRequests.push(newRequest);
      localStorage.setItem('requests', JSON.stringify(existingRequests));

      alert('✅ 요청이 제출되었습니다!\n검수 후 제작자에게 공개됩니다.');
      
      // 폼 초기화
      setFormData({
        title: '',
        job: '',
        problem: '',
        expectedFeature: '',
        priority: '중',
        tools: []
      });
      
      onClose();
    } catch (error) {
      console.error('제출 오류:', error);
      alert('❌ 제출에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full my-8 shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold mb-1">✨ 자동화 요청하기</h2>
              <p className="text-purple-100 text-sm">어떤 업무를 자동화하고 싶으신가요?</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-lg p-2 transition-all"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* 제목 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              제목 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="예: 엑셀 자동 정산 키트"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>

          {/* 직무 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              직무 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="job"
              value={formData.job}
              onChange={handleChange}
              placeholder="예: 회계, 영업, 마케팅 등"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>

          {/* 사용 툴 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              사용하는 툴
            </label>
            <div className="flex flex-wrap gap-2">
              {availableTools.map(tool => (
                <button
                  key={tool}
                  type="button"
                  onClick={() => handleToolToggle(tool)}
                  className={`px-4 py-2 rounded-lg border-2 transition-all ${
                    formData.tools.includes(tool)
                      ? 'bg-purple-100 border-purple-500 text-purple-700'
                      : 'border-gray-300 text-gray-700 hover:border-purple-300'
                  }`}
                >
                  {tool}
                </button>
              ))}
            </div>
          </div>

          {/* 문제 설명 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              어떤 문제가 있나요? <span className="text-red-500">*</span>
            </label>
            <textarea
              name="problem"
              value={formData.problem}
              onChange={handleChange}
              placeholder="현재 겪고 있는 불편함이나 문제를 자유롭게 적어주세요"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              rows={4}
              required
            />
          </div>

          {/* 기대 기능 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              어떤 기능을 원하시나요? <span className="text-red-500">*</span>
            </label>
            <textarea
              name="expectedFeature"
              value={formData.expectedFeature}
              onChange={handleChange}
              placeholder="원하는 자동화 기능을 구체적으로 설명해주세요"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              rows={4}
              required
            />
          </div>

          {/* 우선순위 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              우선순위
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="낮음">낮음</option>
              <option value="중">중</option>
              <option value="높음">높음</option>
              <option value="긴급">긴급</option>
            </select>
          </div>

          {/* 버튼 */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-semibold"
              disabled={isSubmitting}
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? '제출 중...' : '✨ 요청하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

