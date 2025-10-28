'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FadeIn } from '@/components/animations';
import MainNavigation from '@/components/MainNavigation';
import { useAuth } from '@/hooks/useAuth';

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
  const { user, isAuthenticated } = useAuth();
  const [rules, setRules] = useState<Rule[]>([]);
  const [currentRuleId, setCurrentRuleId] = useState<number | null>(null);
  const [credits, setCredits] = useState(100);
  const [commuteMinutes, setCommuteMinutes] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      <MainNavigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <FadeIn>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-3 rounded-full text-sm font-bold mb-6 animate-pulse">
              ✨ NEW!
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Outlook 자동메일 빌더
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              <strong className="text-orange-600">IF-THEN 규칙</strong>으로 메일 자동화하고 
              <strong className="text-red-600"> 퇴근 시간을 앞당기세요</strong>
            </p>
          </div>
        </FadeIn>

        {/* Mission Status */}
        <FadeIn delay={0.1}>
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border-2 border-orange-200">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-center sm:text-left">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">퇴근 미션</h2>
                <p className="text-gray-600">
                  규칙 3개를 설정하면 <span className="font-bold text-green-600">+10 크레딧</span> 보상!
                </p>
              </div>
              <button 
                onClick={completeMission}
                disabled={!isMissionComplete}
                className={`px-6 py-3 font-bold rounded-xl transition duration-150 shadow-lg ${
                  isMissionComplete 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isMissionComplete ? '🎉 미션 완료! (+10C)' : `📋 미션 진행 중 (${3 - activeRulesCount}개 더 필요)`}
              </button>
            </div>
          </div>
        </FadeIn>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column: Rule List */}
          <FadeIn delay={0.2}>
            <div className="xl:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-orange-200">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    <span className="text-orange-600 mr-2">📋</span> 나의 규칙
                  </h2>
                  <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {activeRulesCount}개 활성
                  </span>
                </div>
                
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {rules.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-3">📧</div>
                      <p className="text-gray-500 text-sm">아직 규칙이 없습니다</p>
                      <p className="text-gray-400 text-xs">새 규칙을 만들어보세요!</p>
                    </div>
                  ) : (
                    rules.map(rule => (
                      <div
                        key={rule.id}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                          rule.id === currentRuleId 
                            ? 'border-orange-500 bg-orange-50 shadow-md' 
                            : 'border-gray-200 bg-white hover:border-orange-300'
                        }`}
                        onClick={() => loadRuleToEditor(rule.id)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900 mb-1">{rule.name}</h3>
                            <p className="text-sm text-gray-600 mb-2">
                              <span className="font-medium">{rule.subjectKeyword}</span> {rule.logic} <span className="font-medium">{rule.bodyKeyword}</span>
                            </p>
                            <p className="text-xs text-gray-500">
                              → {rule.recipientEmail}
                            </p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleRuleActive(rule.id);
                            }}
                            className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                              rule.active 
                                ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
                  className="mt-6 w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  + 새 규칙 추가
                </button>
              </div>
            </div>
          </FadeIn>

          {/* Right Column: Rule Editor */}
          <FadeIn delay={0.3}>
            <div className="xl:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-orange-200">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                    <span className="text-orange-600 mr-3">⚙️</span> 규칙 편집기
                  </h2>
                  {isEditing && (
                    <button
                      onClick={deleteRule}
                      className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors font-medium"
                    >
                      🗑️ 삭제
                    </button>
                  )}
                </div>
                <form onSubmit={saveRule} className="space-y-8">
                  {/* Rule Title */}
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl border-2 border-orange-200">
                    <label htmlFor="rule-name" className="block text-lg font-bold text-gray-900 mb-3">
                      📝 규칙 이름
                    </label>
                    <input
                      type="text"
                      id="rule-name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="예: A사 견적요청 자동 알림"
                      className="w-full p-4 border-2 border-orange-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg font-medium"
                    />
                  </div>

                  {/* Condition Section */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border-2 border-blue-200">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                      <span className="text-blue-600 mr-3">⚙️</span> 조건 설정 (IF)
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-lg font-bold text-gray-900 mb-3">📧 제목에 포함</label>
                        <input
                          type="text"
                          value={formData.subjectKeyword}
                          onChange={(e) => setFormData(prev => ({ ...prev, subjectKeyword: e.target.value }))}
                          placeholder="예: 견적요청, 긴급, 회의"
                          required
                          className="w-full p-4 border-2 border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-medium"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-lg font-bold text-gray-900 mb-3">📄 본문에 포함</label>
                        <input
                          type="text"
                          value={formData.bodyKeyword}
                          onChange={(e) => setFormData(prev => ({ ...prev, bodyKeyword: e.target.value }))}
                          placeholder="예: A사, 에러, 긴급"
                          required
                          className="w-full p-4 border-2 border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-medium"
                        />
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border-2 border-blue-200">
                      <h4 className="text-lg font-bold text-gray-900 mb-4">🔗 조건 논리</h4>
                      <div className="flex gap-6">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="condition-logic"
                            value="AND"
                            checked={formData.logic === 'AND'}
                            onChange={(e) => setFormData(prev => ({ ...prev, logic: e.target.value as 'AND' | 'OR' }))}
                            className="w-5 h-5 text-blue-600 mr-3"
                          />
                          <span className="text-lg font-medium text-gray-900">AND (모두 일치)</span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="condition-logic"
                            value="OR"
                            checked={formData.logic === 'OR'}
                            onChange={(e) => setFormData(prev => ({ ...prev, logic: e.target.value as 'AND' | 'OR' }))}
                            className="w-5 h-5 text-blue-600 mr-3"
                          />
                          <span className="text-lg font-medium text-gray-900">OR (하나만 일치)</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                  {/* Action Section */}
                  <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-xl border-2 border-red-200">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                      <span className="text-red-600 mr-3">🎯</span> 액션 설정 (THEN)
                    </h3>
                    <div className="space-y-6">
                      <div>
                        <label htmlFor="recipient-email" className="block text-lg font-bold text-gray-900 mb-3">
                          📧 발송 대상 이메일
                        </label>
                        <input
                          type="email"
                          id="recipient-email"
                          value={formData.recipientEmail}
                          onChange={(e) => setFormData(prev => ({ ...prev, recipientEmail: e.target.value }))}
                          placeholder="예: sales@company.com, manager@team.com"
                          required
                          className="w-full p-4 border-2 border-red-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 text-lg font-medium"
                        />
                      </div>
                      <div>
                        <label htmlFor="reply-subject" className="block text-lg font-bold text-gray-900 mb-3">
                          📝 회신 제목
                        </label>
                        <input
                          type="text"
                          id="reply-subject"
                          value={formData.replySubject}
                          onChange={(e) => setFormData(prev => ({ ...prev, replySubject: e.target.value }))}
                          placeholder="예: [자동알림] A사 견적요청 접수"
                          required
                          className="w-full p-4 border-2 border-red-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 text-lg font-medium"
                        />
                      </div>
                      <div>
                        <label htmlFor="reply-body" className="block text-lg font-bold text-gray-900 mb-3">
                          📄 회신 본문 (HTML 지원)
                        </label>
                        <textarea
                          id="reply-body"
                          rows={4}
                          value={formData.replyBody}
                          onChange={(e) => setFormData(prev => ({ ...prev, replyBody: e.target.value }))}
                          placeholder="예: 견적 요청 메일이 접수되었습니다.&#10;ERP에 등록 바랍니다.&#10;&#10;감사합니다."
                          required
                          className="w-full p-4 border-2 border-red-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 text-lg font-medium resize-none"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Submit Button */}
                  <div className="flex justify-center pt-8">
                    <button
                      type="submit"
                      className="px-12 py-4 text-xl font-bold text-white bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105"
                    >
                      {isEditing ? '📝 규칙 수정하기' : '✨ 규칙 생성하기'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Status & Log Section */}
        <FadeIn delay={0.4}>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Status Cards */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-orange-200">
              <div className="text-center">
                <div className="text-4xl mb-3">📋</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">활성 규칙</h3>
                <div className="text-4xl font-bold text-orange-600 mb-2">{activeRulesCount}개</div>
                <p className="text-gray-600">현재 작동 중인 규칙</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-yellow-200">
              <div className="text-center">
                <div className="text-4xl mb-3">💎</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">남은 크레딧</h3>
                <div className="text-4xl font-bold text-yellow-600 mb-2">{credits}C</div>
                <p className="text-gray-600">규칙당 5C/월</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-green-200">
              <div className="text-center">
                <div className="text-4xl mb-3">⏰</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">절약 시간</h3>
                <div className="text-4xl font-bold text-green-600 mb-2">{commuteMinutes}분</div>
                <p className="text-gray-600">오늘 절약한 시간</p>
              </div>
            </div>
          </div>

          {/* Log Section */}
          <div className="mt-8 bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="text-blue-600 mr-3">📊</span> 실행 로그
            </h2>
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="text-center py-8">
                <div className="text-6xl mb-4">📧</div>
                <p className="text-gray-600 text-lg mb-2">아직 실행된 규칙이 없습니다</p>
                <p className="text-gray-500">규칙을 활성화하고 메일을 받아보세요!</p>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
