'use client';

import { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import { 
  getAnonymousId, 
  getLocalDocuments, 
  saveDocumentToLocal, 
  deleteLocalDocument,
  DocumentInfo 
} from '@/lib/anonymousUser';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: Array<{ fileName: string; score: number }>;
  timestamp: Date;
}

export default function FriManualBotPage() {
  const [anonymousId, setAnonymousId] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [documents, setDocuments] = useState<DocumentInfo[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'docs'>('chat');
  const [quickTitle, setQuickTitle] = useState('');
  const [quickContent, setQuickContent] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 익명 ID 생성 및 문서 목록 로드
  useEffect(() => {
    const id = getAnonymousId();
    setAnonymousId(id);
    
    // 로컬 저장소에서 문서 목록 불러오기
    const savedDocs = getLocalDocuments();
    setDocuments(savedDocs);
  }, []);

  // 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 문서 업로드
  const handleFileUpload = async (file: File) => {
    if (!anonymousId) return;
    
    setIsUploading(true);
    const loadingToast = toast.loading(`${file.name} 업로드 중...`);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('anonymousId', anonymousId);

      const response = await fetch('/api/frimanualbot/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '업로드 실패');
      }

      toast.success('문서가 성공적으로 업로드되었습니다!', { id: loadingToast });
      
      // 문서 정보를 로컬 저장소에 저장
      const newDoc: DocumentInfo = {
        id: data.documentId,
        fileName: data.fileName,
        uploadedAt: new Date().toISOString(),
        chunksCount: data.chunksCount,
        contentLength: data.contentLength,
      };
      
      saveDocumentToLocal(newDoc);
      setDocuments(prev => [...prev, newDoc]);

      // 환영 메시지
      if (documents.length === 0) {
        setMessages([{
          id: 'welcome',
          role: 'assistant',
          content: `✅ 첫 문서가 업로드되었습니다!\n\n이제 "${data.fileName}"에 대해 무엇이든 질문해보세요. 예를 들어:\n\n• "휴가 신청은 어떻게 하나요?"\n• "견적서 양식 알려줘"\n• "보고서 작성 절차는?"`,
          timestamp: new Date(),
        }]);
      }

    } catch (error: any) {
      console.error('업로드 오류:', error);
      
      // 환경 변수 오류인 경우
      if (error.message?.includes('환경 변수')) {
        toast.error('⚠️ 관리자 설정이 필요합니다. PINECONE_API_KEY를 확인해주세요.', { id: loadingToast, duration: 5000 });
      } else {
        toast.error(error.message || '업로드 실패', { id: loadingToast });
      }
    } finally {
      setIsUploading(false);
    }
  };

  // 파일 드래그 앤 드롭
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // 메시지 전송
  const handleSendMessage = async () => {
    if (!inputValue.trim() || !anonymousId || isLoading) return;

    if (documents.length === 0) {
      toast.error('먼저 문서를 업로드해주세요!');
      setActiveTab('docs');
      return;
    }

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // 임시: 간단한 버전 (스트리밍 없음)
      const response = await fetch('/api/frimanualbot/simple-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: inputValue,
          anonymousId: anonymousId,
        }),
      });

      if (!response.ok) {
        throw new Error('답변 생성 실패');
      }

      const data = await response.json();

      // 답변 메시지 추가
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.answer,
        sources: data.sources,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);

    } catch (error: any) {
      console.error('메시지 전송 오류:', error);
      toast.error('답변을 받아오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 문서 삭제
  const handleDeleteDocument = (docId: string) => {
    if (confirm('이 문서를 삭제하시겠습니까?')) {
      deleteLocalDocument(docId);
      setDocuments(prev => prev.filter(d => d.id !== docId));
      toast.success('문서가 삭제되었습니다');
    }
  };

  // 텍스트로 빠르게 추가
  const handleQuickAdd = async () => {
    if (!quickTitle.trim() || !quickContent.trim()) {
      toast.error('제목과 내용을 모두 입력해주세요!');
      return;
    }

    if (!anonymousId) return;

    setIsUploading(true);
    const loadingToast = toast.loading(`"${quickTitle}" 저장 중...`);

    try {
      // 텍스트를 파일처럼 만들기
      const textBlob = new Blob([quickContent], { type: 'text/plain' });
      const file = new File([textBlob], `${quickTitle}.txt`, { type: 'text/plain' });

      const formData = new FormData();
      formData.append('file', file);
      formData.append('anonymousId', anonymousId);

      const response = await fetch('/api/frimanualbot/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '저장 실패');
      }

      toast.success('지식이 추가되었습니다!', { id: loadingToast });

      // 문서 목록에 추가
      const newDoc: DocumentInfo = {
        id: data.documentId,
        fileName: data.fileName,
        uploadedAt: new Date().toISOString(),
        chunksCount: data.chunksCount,
        contentLength: data.contentLength,
      };

      saveDocumentToLocal(newDoc);
      setDocuments(prev => [...prev, newDoc]);

      // 입력 필드 초기화
      setQuickTitle('');
      setQuickContent('');

    } catch (error: any) {
      console.error('빠른 추가 오류:', error);
      toast.error(error.message || '저장 실패', { id: loadingToast });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                🐶🤖 Fri Manual Bot
              </h1>
              <p className="text-gray-600">
                내 매뉴얼을 업로드하고, 언제든 질문하세요. AI가 즉시 답변해드립니다.
              </p>
            </div>
            <div className="text-sm text-gray-500">
              <p>익명 ID: <code className="bg-gray-100 px-2 py-1 rounded text-xs">{anonymousId.slice(0, 15)}...</code></p>
              <p className="text-xs mt-1">💡 로그인 없이 바로 사용 가능!</p>
            </div>
          </div>
        </div>

        {/* 탭 메뉴 */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('chat')}
              className={`pb-4 px-2 font-medium transition-colors ${
                activeTab === 'chat'
                  ? 'border-b-2 border-indigo-600 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              💬 채팅
            </button>
            <button
              onClick={() => setActiveTab('docs')}
              className={`pb-4 px-2 font-medium transition-colors ${
                activeTab === 'docs'
                  ? 'border-b-2 border-indigo-600 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              📁 문서 관리 ({documents.length})
            </button>
          </div>
        </div>

        {/* 채팅 탭 */}
        {activeTab === 'chat' && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden" style={{ height: '600px' }}>
            <div className="h-full flex flex-col">
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center max-w-md">
                      <div className="text-6xl mb-4">🐶🤖</div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        안녕하세요! Fri Manual Bot입니다
                      </h3>
                      <p className="text-gray-600 mb-6">
                        {documents.length === 0 
                          ? '먼저 "문서 관리" 탭에서 매뉴얼을 업로드해주세요.'
                          : '업로드한 문서에 대해 무엇이든 질문해보세요!'}
                      </p>
                      {documents.length === 0 && (
                        <button
                          onClick={() => setActiveTab('docs')}
                          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                          문서 업로드하러 가기
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <>
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                            message.role === 'user'
                              ? 'bg-indigo-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{message.content}</p>
                          {message.sources && message.sources.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-gray-300">
                              <p className="text-xs font-semibold mb-1">📚 참고 문서:</p>
                              {message.sources.map((source, idx) => (
                                <p key={idx} className="text-xs opacity-80">
                                  • {source.fileName}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* 입력 영역 */}
              <div className="border-t border-gray-200 p-4 bg-gray-50">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="업무 관련 질문을 입력하세요..."
                    disabled={isLoading}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={isLoading || !inputValue.trim()}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    {isLoading ? '⏳' : '전송'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 문서 관리 탭 */}
        {activeTab === 'docs' && (
          <div className="space-y-6">
            {/* 빠른 지식 추가 */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg p-6 border-2 border-green-200">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-2">⚡</span>
                <h3 className="text-xl font-semibold text-gray-900">
                  빠른 지식 추가
                </h3>
                <span className="ml-auto text-xs bg-green-500 text-white px-2 py-1 rounded-full">NEW</span>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                파일 없이 텍스트로 바로 입력하세요. 예: "연차 15개", "휴가규정 링크: https://..."
              </p>
              
              <div className="space-y-3">
                <input
                  type="text"
                  value={quickTitle}
                  onChange={(e) => setQuickTitle(e.target.value)}
                  placeholder="제목 (예: 연차 규정)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  disabled={isUploading}
                />
                <textarea
                  value={quickContent}
                  onChange={(e) => setQuickContent(e.target.value)}
                  placeholder="내용을 입력하세요 (예: 1년차 연차는 15일입니다. 휴가신청 링크: https://...)"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  disabled={isUploading}
                />
                <button
                  onClick={handleQuickAdd}
                  disabled={isUploading || !quickTitle.trim() || !quickContent.trim()}
                  className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
                >
                  {isUploading ? '저장 중...' : '⚡ 빠르게 추가'}
                </button>
              </div>
            </div>

            {/* 업로드 영역 */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="bg-white rounded-2xl shadow-lg p-8 border-2 border-dashed border-gray-300 hover:border-indigo-500 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="text-center">
                <div className="text-5xl mb-4">📤</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  매뉴얼 업로드
                </h3>
                <p className="text-gray-600 mb-4">
                  클릭하거나 파일을 드래그해서 업로드하세요
                </p>
                <p className="text-sm text-gray-500">
                  지원 포맷: PDF, DOCX, TXT, MD
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.txt,.md"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file);
                  }}
                  className="hidden"
                />
              </div>
            </div>

            {/* 문서 목록 */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  업로드된 문서 ({documents.length})
                </h3>
              </div>
              <div className="divide-y divide-gray-200">
                {documents.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    아직 업로드된 문서가 없습니다
                  </div>
                ) : (
                  documents.map((doc) => (
                    <div key={doc.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">📄</div>
                          <div>
                            <p className="font-medium text-gray-900">{doc.fileName}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(doc.uploadedAt).toLocaleDateString('ko-KR')} • 
                              {Math.round(doc.contentLength / 1000)}KB • 
                              {doc.chunksCount}개 청크
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteDocument(doc.id)}
                          className="text-red-600 hover:text-red-700 px-3 py-1 rounded hover:bg-red-50 transition-colors"
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* 안내 메시지 */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-800">
                💡 <span className="font-semibold">브라우저에 저장됩니다:</span> 업로드한 문서는 이 브라우저에서만 보입니다. 
                쿠키를 삭제하면 목록이 사라지니 주의하세요!
              </p>
            </div>
          </div>
        )}

        {/* 무료 사용 안내 */}
        <div className="mt-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-1">🎉 완전 무료!</h3>
              <p className="text-green-100">
                로그인 없이 바로 사용 가능 • 무제한 문서 업로드 • 무제한 질문
              </p>
            </div>
            <div className="text-4xl">🐶</div>
          </div>
        </div>
      </div>
    </div>
  );
}
