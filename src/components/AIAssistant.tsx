'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: Array<{ title: string; url: string }>;
  relatedTools?: Array<{ name: string; url: string }>;
  feedbackSubmitted?: boolean;
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/rag-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) throw new Error('API Error');

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.answer || '답변을 생성할 수 없습니다.',
        sources: data.sources || [],
        relatedTools: data.relatedTools || [],
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '죄송합니다. 일시적인 오류가 발생했습니다.',
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = async (messageId: string, helpful: boolean) => {
    try {
      await fetch('/api/rag-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId, helpful }),
      });
      
      setMessages(prev =>
        prev.map(msg =>
          msg.id === messageId ? { ...msg, feedbackSubmitted: true } : msg
        )
      );
    } catch (error) {
      console.error('Feedback error:', error);
    }
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-8 left-4 md:left-8 z-40 w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-2xl hover:scale-110 transition-all flex items-center justify-center"
        >
          <span className="text-3xl">🤖</span>
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-8 left-4 md:left-8 z-40 w-[380px] h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col border-2 border-purple-200">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-2xl flex justify-between items-center">
            <div>
              <h3 className="font-bold text-lg">WorkFree AI 🤖</h3>
              <p className="text-xs opacity-90">무엇을 도와드릴까요?</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-12">
                <div className="text-5xl mb-4">💬</div>
                <p className="text-sm mb-6">WorkFree에 대해<br />궁금한 점을 물어보세요!</p>
                
                <div className="space-y-2 text-xs">
                  {['연봉 계산기 어떻게 사용해?', '마케터에게 좋은 툴 추천해줘', '크레딧은 어떻게 충전해?'].map((q, i) => (
                    <button
                      key={i}
                      onClick={() => setInput(q)}
                      className="block w-full bg-white hover:bg-blue-50 px-3 py-2 rounded-lg text-left transition-colors border border-gray-200"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className="w-full space-y-2">
                      {/* 답변 버블 */}
                      <div className={`${
                        msg.role === 'user' ? 'bg-blue-600 text-white ml-auto' : 'bg-white text-gray-900 border border-gray-200'
                      } px-4 py-3 rounded-2xl shadow-sm max-w-[80%] ${msg.role === 'user' ? 'ml-auto' : ''}`}>
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>

                        {msg.role === 'assistant' && !msg.feedbackSubmitted && (
                          <div className="mt-3 flex gap-2 justify-end">
                            <button
                              onClick={() => handleFeedback(msg.id, true)}
                              className="text-xs px-2 py-1 bg-green-100 text-green-700 hover:bg-green-200 rounded transition-colors"
                            >
                              👍
                            </button>
                            <button
                              onClick={() => handleFeedback(msg.id, false)}
                              className="text-xs px-2 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded transition-colors"
                            >
                              👎
                            </button>
                          </div>
                        )}
                      </div>

                      {/* 링크 카드 (별도 표시) */}
                      {msg.sources && msg.sources.length > 0 && (
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-3 max-w-[85%] shadow-sm">
                          <p className="text-xs font-bold text-blue-900 mb-2 flex items-center gap-1">
                            <span>🔗</span>
                            <span>바로가기</span>
                          </p>
                          <div className="space-y-1.5">
                            {msg.sources.map((source, i) => (
                              <Link
                                key={i}
                                href={source.url}
                                className="block bg-white hover:bg-blue-50 px-3 py-2 rounded-lg text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors border border-blue-200 hover:border-blue-300 hover:shadow-sm"
                                target="_blank"
                              >
                                <span className="flex items-center justify-between">
                                  <span>📄 {source.title}</span>
                                  <span className="text-blue-400">→</span>
                                </span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl shadow-sm">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          <div className="border-t border-gray-200 p-4 bg-white rounded-b-2xl">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                placeholder="메시지를 입력하세요..."
                className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none text-sm"
                disabled={loading}
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50"
              >
                전송
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
