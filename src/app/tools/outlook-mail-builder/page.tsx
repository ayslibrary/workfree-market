'use client';

import { useState, useEffect } from 'react';
import { FadeIn } from '@/components/animations';
import MainNavigation from '@/components/MainNavigation';

interface Rule {
  id: number;
  name: string;
  subjectKeyword: string;
  bodyKeyword: string;
  logic: 'AND' | 'OR';
  recipientEmail: string;
  replySubject: string;
  replyBody: string;
  active: boolean;
  logs: any[];
}

export default function OutlookMailBuilderPage() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [currentRuleId, setCurrentRuleId] = useState<number | null>(null);
  const [credits, setCredits] = useState(100);
  const [commuteMinutes, setCommuteMinutes] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  const RULES_COST = 5; // 규칙 1개당 크레딧 비용 (월)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    subjectKeyword: '',
    bodyKeyword: '',
    logic: 'AND' as 'AND' | 'OR',
    recipientEmail: '',
    replySubject: '',
    replyBody: ''
  });

  useEffect(() => {
    // Initialize with sample rules
    const sampleRules: Rule[] = [
      {
        id: 1,
        name: "A사 견적 자동 알림",
        subjectKeyword: "견적요청",
        bodyKeyword: "A사",
        logic: "AND",
        recipientEmail: "sales@workfree.com",
        replySubject: "A사 견적요청 알림",
        replyBody: "<p>견적 요청 메일이 접수되었습니다. ERP에 등록 바랍니다.</p>",
        active: true,
        logs: []
      },
      {
        id: 2,
        name: "긴급 이슈 자동 전달",
        subjectKeyword: "긴급",
        bodyKeyword: "에러",
        logic: "OR",
        recipientEmail: "devops@workfree.com",
        replySubject: "[긴급] 에러 발생 알림",
        replyBody: "<p>제목에 긴급 또는 본문에 에러가 감지되었습니다. 즉시 확인 바랍니다.</p>",
        active: true,
        logs: []
      }
    ];
    
    setRules(sampleRules);
    setCredits(90); // 2개 규칙으로 인한 크레딧 차감
    setCurrentRuleId(1);
    loadRuleToEditor(1);
  }, []);

  const updateStatus = () => {
    // Status updates are handled by state
  };

  const completeMission = () => {
    if (rules.filter(r => r.active).length >= 3) {
      setCredits(prev => prev + 10);
    }
  };

  const loadRuleToEditor = (id: number) => {
    const rule = rules.find(r => r.id === id);
    if (rule) {
      setCurrentRuleId(id);
      setFormData({
        name: rule.name,
        subjectKeyword: rule.subjectKeyword,
        bodyKeyword: rule.bodyKeyword,
        logic: rule.logic,
        recipientEmail: rule.recipientEmail,
        replySubject: rule.replySubject,
        replyBody: rule.replyBody
      });
      setIsEditing(true);
    }
  };

  const saveRule = (e: React.FormEvent) => {
    e.preventDefault();
    
    const isNew = currentRuleId === null;
    let newRule: Rule;

    if (isNew) {
      if (credits < RULES_COST) {
        alert(`규칙을 생성하기 위한 크레딧(${RULES_COST}C)이 부족합니다.`);
        return;
      }

      newRule = {
        id: Date.now(),
        ...formData,
        active: true,
        logs: []
      };
      
      setRules(prev => [...prev, newRule]);
      setCredits(prev => prev - RULES_COST);
    } else {
      setRules(prev => prev.map(rule => 
        rule.id === currentRuleId 
          ? { ...rule, ...formData }
          : rule
      ));
    }

    // Simulate mail detection
    simulateMailDetection(isNew ? newRule : rules.find(r => r.id === currentRuleId)!);
    
    alert(`규칙이 성공적으로 저장 및 활성화되었습니다! ${isNew ? `(-${RULES_COST}C)` : ''}`);
    resetEditor();
  };

  const deleteRule = () => {
    if (!currentRuleId || !confirm('정말로 이 규칙을 삭제하시겠습니까?')) return;
    
    setRules(prev => prev.filter(r => r.id !== currentRuleId));
    setCurrentRuleId(null);
    resetEditor();
  };

  const resetEditor = () => {
    setFormData({
      name: '',
      subjectKeyword: '',
      bodyKeyword: '',
      logic: 'AND',
      recipientEmail: '',
      replySubject: '',
      replyBody: ''
    });
    setCurrentRuleId(null);
    setIsEditing(false);
  };

  const toggleRuleActive = (id: number) => {
    setRules(prev => prev.map(rule => 
      rule.id === id 
        ? { ...rule, active: !rule.active }
        : rule
    ));
  };

  const simulateMailDetection = (rule: Rule) => {
    if (!rule.active) return;
    
    setCommuteMinutes(prev => prev + 5);
  };

  const activeRulesCount = rules.filter(r => r.active).length;
  const isMissionComplete = activeRulesCount >= 3;

  return (
    <div className="min-h-screen bg-gray-50">
      <MainNavigation />
      
      <div className="max-w-6xl mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <FadeIn>
          <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <span className="mr-2 text-blue-600">🚀</span> WorkFree Rule Builder
            </h1>
            <button 
              onClick={completeMission}
              disabled={!isMissionComplete}
              className={`px-4 py-2 font-semibold rounded-lg transition duration-150 shadow-md ${
                isMissionComplete 
                  ? 'bg-green-500 hover:bg-green-600 text-white' 
                  : 'bg-gray-400 text-gray-200 cursor-not-allowed'
              }`}
            >
              {isMissionComplete ? '퇴근 미션 완료! (+10C)' : `퇴근 미션 (규칙 ${3 - activeRulesCount}개 더 필요)`}
            </button>
          </div>
        </FadeIn>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Rule List */}
          <FadeIn delay={0.1}>
            <div className="lg:col-span-1 bg-white p-4 rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
                나의 자동 회신 규칙
              </h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {rules.length === 0 ? (
                  <p className="text-gray-500 italic text-sm">현재 등록된 규칙이 없습니다. 새로운 규칙을 만들어 보세요.</p>
                ) : (
                  rules.map(rule => (
                    <div
                      key={rule.id}
                      className={`p-3 rounded-lg flex justify-between items-center cursor-pointer transition duration-150 hover:bg-gray-100 ${
                        rule.id === currentRuleId ? 'border-l-4 border-blue-500 bg-blue-50' : 'bg-white'
                      }`}
                      onClick={() => loadRuleToEditor(rule.id)}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-800">{rule.name}</span>
                        <span className="text-xs text-gray-500 italic">
                          {rule.subjectKeyword} {rule.logic} {rule.bodyKeyword}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleRuleActive(rule.id);
                          }}
                          className={`text-xs px-2 py-1 rounded-full ${
                            rule.active 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {rule.active ? 'ON' : 'OFF'}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              <button
                onClick={resetEditor}
                className="mt-4 w-full py-2 border border-blue-500 text-blue-500 font-medium rounded-lg hover:bg-blue-50 transition duration-150"
              >
                + 새 규칙 추가
              </button>
            </div>
          </FadeIn>

          {/* Right Column: Rule Editor */}
          <FadeIn delay={0.2}>
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                규칙 편집기: 메일 자동화 설정
              </h2>
              <form onSubmit={saveRule} className="space-y-5">
                {/* Rule Title */}
                <div>
                  <label htmlFor="rule-name" className="block text-sm font-medium text-gray-700 mb-1">
                    규칙 이름 (예: 견적요청 알림)
                  </label>
                  <input
                    type="text"
                    id="rule-name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Condition Section */}
                <div className="border p-4 rounded-lg bg-gray-50">
                  <h3 className="font-semibold text-lg mb-3 text-gray-700 flex items-center">
                    <span className="text-blue-500 mr-2">⚙️</span> 조건 설정 (IF)
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <label className="text-sm">제목에 포함</label>
                      <input
                        type="text"
                        value={formData.subjectKeyword}
                        onChange={(e) => setFormData(prev => ({ ...prev, subjectKeyword: e.target.value }))}
                        placeholder="키워드 (예: 견적요청)"
                        required
                        className="flex-grow p-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <label className="text-sm">본문에 포함</label>
                      <input
                        type="text"
                        value={formData.bodyKeyword}
                        onChange={(e) => setFormData(prev => ({ ...prev, bodyKeyword: e.target.value }))}
                        placeholder="키워드 (예: A사)"
                        required
                        className="flex-grow p-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-600">조건 논리:</span>
                      <input
                        type="radio"
                        id="logic-and"
                        name="condition-logic"
                        value="AND"
                        checked={formData.logic === 'AND'}
                        onChange={(e) => setFormData(prev => ({ ...prev, logic: e.target.value as 'AND' | 'OR' }))}
                        className="text-blue-600"
                      />
                      <label htmlFor="logic-and" className="text-sm">AND (모두 일치)</label>
                      <input
                        type="radio"
                        id="logic-or"
                        name="condition-logic"
                        value="OR"
                        checked={formData.logic === 'OR'}
                        onChange={(e) => setFormData(prev => ({ ...prev, logic: e.target.value as 'AND' | 'OR' }))}
                        className="ml-4 text-blue-600"
                      />
                      <label htmlFor="logic-or" className="text-sm">OR (하나만 일치)</label>
                    </div>
                  </div>
                </div>

                {/* Action Section */}
                <div className="border p-4 rounded-lg bg-red-50">
                  <h3 className="font-semibold text-lg mb-3 text-gray-700 flex items-center">
                    <span className="text-red-500 mr-2">🎯</span> 액션 설정 (THEN)
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label htmlFor="recipient-email" className="block text-sm font-medium text-gray-700 mb-1">
                        발송 대상 이메일 (To)
                      </label>
                      <input
                        type="email"
                        id="recipient-email"
                        value={formData.recipientEmail}
                        onChange={(e) => setFormData(prev => ({ ...prev, recipientEmail: e.target.value }))}
                        placeholder="예: sales@company.com"
                        required
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="reply-subject" className="block text-sm font-medium text-gray-700 mb-1">
                        회신 제목
                      </label>
                      <input
                        type="text"
                        id="reply-subject"
                        value={formData.replySubject}
                        onChange={(e) => setFormData(prev => ({ ...prev, replySubject: e.target.value }))}
                        placeholder="예: A사 견적요청 접수 알림"
                        required
                        className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="reply-body" className="block text-sm font-medium text-gray-700 mb-1">
                        회신 본문 (HTML 가능)
                      </label>
                      <textarea
                        id="reply-body"
                        rows={3}
                        value={formData.replyBody}
                        onChange={(e) => setFormData(prev => ({ ...prev, replyBody: e.target.value }))}
                        placeholder="예: 견적 요청 메일이 접수되었습니다. ERP에 등록 바랍니다."
                        required
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 text-sm"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Rule Management Buttons */}
                <div className="flex justify-end space-x-3 pt-4">
                  {isEditing && (
                    <button
                      type="button"
                      onClick={deleteRule}
                      className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition duration-150"
                    >
                      규칙 삭제
                    </button>
                  )}
                  <button
                    type="submit"
                    className="px-6 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-150 shadow-md"
                  >
                    {isEditing ? '규칙 수정 및 활성화' : '규칙 저장 및 활성화'}
                  </button>
                </div>
              </form>
            </div>
          </FadeIn>
        </div>

        {/* Status & Log Section */}
        <FadeIn delay={0.3}>
          <div className="mt-8 bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="text-green-500 mr-2">💡</span> WorkFree 자동화 현황
            </h2>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm font-medium text-gray-600 mb-4 border-b pb-3 gap-2">
              <span>총 활성 규칙: <span className="text-blue-600 font-bold">{activeRulesCount}개</span></span>
              <span>남은 크레딧: <span className="text-yellow-600 font-bold">{credits}C</span></span>
              <span className="text-green-600">퇴근 거리 단축 (금일): <span className="font-bold">{commuteMinutes}분</span></span>
            </div>
            
            <h3 className="font-semibold text-base mb-2">최근 실행 로그 (자동 회신)</h3>
            <div className="text-sm space-y-1">
              <p className="text-gray-500 italic">로그가 없습니다. 규칙을 활성화해 보세요.</p>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
