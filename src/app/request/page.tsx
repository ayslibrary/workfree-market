'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { storage, db } from '@/lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import SimpleHeader from '@/components/SimpleHeader';

export default function RequestPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    job: '',
    problem: '',
    expectedFeature: '',
    priority: '중',
    tools: [] as string[]
  });
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [customTool, setCustomTool] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleToolChange = (tool: string) => {
    setFormData(prev => {
      const tools = prev.tools.includes(tool)
        ? prev.tools.filter(t => t !== tool)
        : [...prev.tools, tool];
      return { ...prev, tools };
    });
  };

  const handleAddCustomTool = () => {
    if (customTool.trim() && !formData.tools.includes(customTool.trim())) {
      setFormData(prev => ({
        ...prev,
        tools: [...prev.tools, customTool.trim()]
      }));
      setCustomTool('');
    }
  };

  const handleCustomToolKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCustomTool();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      const newFiles = Array.from(selectedFiles);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const uploadFiles = async (): Promise<string[]> => {
    if (!storage) {
      console.error('Storage가 초기화되지 않았습니다.');
      return [];
    }

    const uploadPromises = files.map((file) => {
      return new Promise<string>((resolve, reject) => {
        const timestamp = Date.now();
        const fileName = `requests/${timestamp}_${file.name}`;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(prev => ({
              ...prev,
              [file.name]: progress
            }));
          },
          (error) => {
            console.error('파일 업로드 오류:', error);
            reject(error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          }
        );
      });
    });

    return Promise.all(uploadPromises);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const requestData = {
        title: formData.title,
        job: formData.job,
        tools: formData.tools,
        problem: formData.problem,
        expectedFeature: formData.expectedFeature,
        priority: formData.priority,
        fileUrls: [],
        status: '대기',
        createdAt: new Date().toISOString(),
      };

      // Firebase 설정되어 있으면 Firestore에 저장
      if (db) {
        try {
          const docRef = await addDoc(collection(db, 'requests'), {
            ...requestData,
            createdAt: serverTimestamp()
          });
          console.log('✅ Firestore 저장 성공! ID:', docRef.id);
        } catch (error) {
          console.warn('Firestore 저장 실패 (무시하고 계속):', error);
        }
      } else {
        console.log('⚠️ Firebase 미설정 - 임시 모드로 작동');
      }

      // 임시로 localStorage에 저장
      const existingRequests = JSON.parse(localStorage.getItem('requests') || '[]');
      const newRequest = {
        id: Date.now().toString(),
        ...requestData
      };
      existingRequests.push(newRequest);
      localStorage.setItem('requests', JSON.stringify(existingRequests));
      
      console.log('✅ 요청이 저장되었습니다:', requestData);

      alert('✅ 요청이 제출되었습니다!\n(임시 저장 모드 - Firebase 설정 후 실제 저장됩니다)');
      router.push('/requests');
    } catch (error) {
      console.error('제출 오류:', error);
      alert('❌ 제출에 실패했습니다. 다시 시도해주세요.\n\n오류: ' + (error instanceof Error ? error.message : '알 수 없는 오류'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <SimpleHeader />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-4 px-4 break-keep">
            💡 자동화 요청하기
          </h1>
          <p className="text-lg text-gray-600 break-keep">
            반복되는 업무가 있나요? WorkFree 제작자들이 자동화해드립니다.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
          {/* 제목 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              요청 제목 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="예: 매일 반복되는 엑셀 정산 자동화"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* 직무 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              직무 <span className="text-red-500">*</span>
            </label>
            <select
              name="job"
              value={formData.job}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">선택해주세요</option>
              <option value="영업">영업</option>
              <option value="회계">회계</option>
              <option value="총무">총무</option>
              <option value="마케팅">마케팅</option>
              <option value="개발">개발</option>
              <option value="인사">인사</option>
              <option value="기획">기획</option>
              <option value="기타">기타</option>
            </select>
          </div>

          {/* 사용하는 툴 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              사용하는 툴 (복수 선택 가능)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { value: 'Excel', label: '📊 Excel', icon: '📊' },
                { value: 'Word', label: '📝 Word', icon: '📝' },
                { value: 'PowerPoint', label: '📊 PowerPoint', icon: '📊' },
                { value: 'Outlook', label: '📧 Outlook', icon: '📧' },
                { value: 'Python', label: '🐍 Python', icon: '🐍' },
                { value: 'Google Sheets', label: '📈 Google Sheets', icon: '📈' },
                { value: 'Notion', label: '📓 Notion', icon: '📓' },
                { value: 'Slack', label: '💬 Slack', icon: '💬' },
                { value: 'Teams', label: '👥 Teams', icon: '👥' },
                { value: 'SAP', label: '🏢 SAP', icon: '🏢' },
                { value: 'ERP', label: '🔧 ERP', icon: '🔧' }
              ].map((tool) => (
                <label
                  key={tool.value}
                  className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.tools.includes(tool.value)
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.tools.includes(tool.value)}
                    onChange={() => handleToolChange(tool.value)}
                    className="w-4 h-4 text-purple-600 focus:ring-purple-500 rounded"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    {tool.label}
                  </span>
                </label>
              ))}
            </div>

            {/* 기타 툴 입력 */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ➕ 기타 툴 직접 입력
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customTool}
                  onChange={(e) => setCustomTool(e.target.value)}
                  onKeyPress={handleCustomToolKeyPress}
                  placeholder="예: Jira, Figma, AutoCAD..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={handleAddCustomTool}
                  disabled={!customTool.trim()}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  추가
                </button>
              </div>
            </div>

            {/* 선택된 툴 목록 */}
            {formData.tools.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">선택된 툴:</p>
                <div className="flex flex-wrap gap-2">
                  {formData.tools.map((tool, index) => (
                    <span
                      key={`${tool}-${index}`}
                      className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                    >
                      {tool}
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          tools: prev.tools.filter((_, i) => i !== index)
                        }))}
                        className="ml-2 text-purple-500 hover:text-purple-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 문제 설명 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              어떤 문제를 해결하고 싶으신가요? <span className="text-red-500">*</span>
            </label>
            <textarea
              name="problem"
              value={formData.problem}
              onChange={handleChange}
              placeholder="예: 매일 오전 9시에 20개 파일의 데이터를 하나로 합쳐서 정리해야 합니다. 수작업으로 30분 이상 걸립니다."
              required
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
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
              placeholder="예: 특정 폴더의 엑셀 파일을 자동으로 읽어서 하나의 시트로 합쳐주는 기능"
              required
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            />
          </div>

          {/* 우선순위 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              우선순위
            </label>
            <div className="flex gap-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="priority"
                  value="낮음"
                  checked={formData.priority === '낮음'}
                  onChange={handleChange}
                  className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                />
                <span className="ml-2 text-gray-700">낮음</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="priority"
                  value="중"
                  checked={formData.priority === '중'}
                  onChange={handleChange}
                  className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                />
                <span className="ml-2 text-gray-700">중</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="priority"
                  value="높음"
                  checked={formData.priority === '높음'}
                  onChange={handleChange}
                  className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                />
                <span className="ml-2 text-gray-700">높음</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="priority"
                  value="긴급"
                  checked={formData.priority === '긴급'}
                  onChange={handleChange}
                  className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                />
                <span className="ml-2 text-gray-700">🔥 긴급</span>
              </label>
            </div>
          </div>

          {/* 파일 첨부 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📎 참고 파일 첨부 (선택)
            </label>
            <p className="text-sm text-gray-500 mb-2">
              엑셀, 워드, PPT, 이미지, 영상 등 참고 자료를 첨부해주세요
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mb-3">
              <p className="text-sm text-blue-800">
                💡 <span className="font-semibold">TIP:</span> 업무 화면을 <span className="font-semibold">직접 촬영 혹은 캡처한 메뉴얼, 화면 녹화 영상</span>으로 올려주시면 개발 정확도가 가장 높아집니다!
              </p>
            </div>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
              <input
                type="file"
                id="file-upload"
                multiple
                onChange={handleFileChange}
                accept=".xlsx,.xls,.doc,.docx,.ppt,.pptx,.pdf,.png,.jpg,.jpeg,.gif,.mp4,.mov,.avi"
                className="hidden"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span className="text-purple-600 font-medium">파일 선택하기</span>
                <span className="text-xs text-gray-500 mt-1">또는 드래그 앤 드롭</span>
              </label>
            </div>

            {/* 업로드된 파일 목록 */}
            {files.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-semibold text-gray-700">첨부된 파일 ({files.length})</p>
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-3"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <svg className="w-5 h-5 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-700 truncate">{file.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    
                    {/* 업로드 진행률 */}
                    {uploadProgress[file.name] !== undefined && uploadProgress[file.name] < 100 && (
                      <div className="ml-3 flex-shrink-0">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-purple-600 h-2 rounded-full transition-all"
                            style={{ width: `${uploadProgress[file.name]}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 text-center mt-1">
                          {Math.round(uploadProgress[file.name])}%
                        </p>
                      </div>
                    )}
                    
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="ml-3 text-red-500 hover:text-red-700 flex-shrink-0"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 안내 사항 */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 className="font-semibold text-purple-800 mb-2">📌 제출 전 확인</h3>
            <ul className="text-sm text-purple-700 space-y-1">
              <li>• 요청은 검수 후 공개됩니다.</li>
              <li>• 제작자가 신청하면 이메일로 알림을 보내드립니다.</li>
              <li>• 요청이 출시되면 &apos;요청자 명단&apos;에 이름이 등재됩니다.</li>
            </ul>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-purple-700 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? '제출 중...' : '✨ 요청 제출하기'}
          </button>
        </form>

        {/* Back Link */}
        <div className="text-center mt-8">
          <Link href="/" className="text-purple-600 hover:underline">
            ← 홈으로 돌아가기
          </Link>
        </div>
      </main>
    </div>
  );
}

