'use client';

import { useState } from 'react';
import MainNavigation from '@/components/MainNavigation';
import { FadeIn } from '@/components/animations';

export default function SignatureMakerPage() {
  const [formData, setFormData] = useState({
    name: '홍길동',
    title: '경영관리팀 팀장',
    company: 'PANASONIC DEVICE SALES KOREA',
    phone: '010-1234-1034',
    email: 'AY@NAVER.COM',
    backgroundColor: '#667eea',
  });

  const [copied, setCopied] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Outlook 호환 HTML (Word 엔진 기반, 테이블 레이아웃)
  const generateOutlookHTML = () => {
    return `<table cellpadding="0" cellspacing="0" style="font-family: Arial, sans-serif; font-size: 13px; line-height: 1.4; color: #333333; border-collapse: collapse; max-width: 480px;">
  <tr>
    <td style="padding: 24px; background: linear-gradient(135deg, ${formData.backgroundColor} 0%, ${adjustColor(formData.backgroundColor, -20)} 100%); border-radius: 16px;">
      <table cellpadding="0" cellspacing="0" style="width: 100%;">
        <tr>
          <td style="color: white;">
            <div style="font-size: 20px; font-weight: bold; margin-bottom: 6px;">${formData.name}</div>
            <div style="font-size: 14px; opacity: 0.9; margin-bottom: 16px;">${formData.title}</div>
            <div style="font-size: 14px; font-weight: 600; opacity: 0.95; margin-bottom: 16px;">${formData.company}</div>
            
            <table cellpadding="0" cellspacing="0" style="background: rgba(255,255,255,0.2); border-radius: 12px; padding: 16px; width: 100%;">
              <tr>
                <td>
                  <div style="line-height: 1.8;">
                    <div style="margin-bottom: 4px;">
                      <span style="color: white; font-size: 14px;">📞 ${formData.phone}</span>
                    </div>
                    <div>
                      <span style="color: white; font-size: 14px;">✉️ </span>
                      <a href="mailto:${formData.email}" style="color: white; text-decoration: none;">${formData.email}</a>
                    </div>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`;
  };

  // 색상 조정 함수
  const adjustColor = (color: string, amount: number): string => {
    const hex = color.replace('#', '');
    const num = parseInt(hex, 16);
    const r = Math.max(0, Math.min(255, (num >> 16) + amount));
    const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amount));
    const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount));
    return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
  };

  const copyToClipboard = async () => {
    const html = generateOutlookHTML();
    
    try {
      // HTML을 Blob으로 변환
      const blob = new Blob([html], { type: 'text/html' });
      const clipboardItem = new ClipboardItem({ 'text/html': blob });
      
      await navigator.clipboard.write([clipboardItem]);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error('복사 실패:', err);
      // 대체 방법: 텍스트로 복사
      await navigator.clipboard.writeText(html);
      alert('HTML 코드가 복사되었습니다. Outlook에서는 미리보기 화면을 직접 복사해주세요.');
    }
  };

  const downloadHTML = () => {
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>이메일 서명</title>
</head>
<body style="margin: 20px; background: #f5f5f5;">
  ${generateOutlookHTML()}
</body>
</html>`;
    
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'email-signature.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div 
      className="min-h-screen"
      style={{ 
        background: `linear-gradient(180deg, var(--soft-lilac) 0%, var(--warm-white) 30%)` 
      }}
    >
      <MainNavigation />

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 pt-40">
        {/* 헤더 */}
        <FadeIn>
          <div className="text-center mb-12">
            <h1 
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ 
                background: `linear-gradient(135deg, var(--main-violet) 0%, var(--soft-lilac) 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              ✉️ 이메일 서명 생성기
            </h1>
            <p 
              className="text-lg"
              style={{ color: 'var(--midnight-navy)', opacity: 0.8 }}
            >
              Outlook에서 바로 사용 가능한 전문적인 이메일 서명을 만들어보세요
            </p>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-8">
          {/* 입력 폼 */}
          <FadeIn delay={0.1}>
            <div 
              className="rounded-2xl shadow-lg p-8 border-2"
              style={{ 
                backgroundColor: 'var(--warm-white)',
                borderColor: 'var(--soft-lilac)'
              }}
            >
              <h2 
                className="text-2xl font-bold mb-6"
                style={{ color: 'var(--midnight-navy)' }}
              >
                📝 정보 입력
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label 
                    className="block text-sm font-semibold mb-2"
                    style={{ color: 'var(--midnight-navy)' }}
                  >
                    이름 *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors"
                    style={{
                      backgroundColor: 'var(--warm-white)',
                      borderColor: 'var(--soft-lilac)',
                      color: 'var(--midnight-navy)'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--main-violet)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--soft-lilac)'}
                    placeholder="홍길동"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    직책 *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
                    placeholder="경영관리팀 팀장"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    회사명 *
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
                    placeholder="PANASONIC DEVICE SALES KOREA"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    전화번호 *
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
                    placeholder="010-1234-5678"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    이메일 *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
                    placeholder="example@company.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    배경 색상
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="color"
                      name="backgroundColor"
                      value={formData.backgroundColor}
                      onChange={handleChange}
                      className="w-20 h-12 border-2 border-gray-200 rounded-lg cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.backgroundColor}
                      onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                      className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
                      placeholder="#667eea"
                    />
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* 미리보기 */}
          <FadeIn delay={0.2}>
            <div 
              className="rounded-2xl shadow-lg p-8 border-2 sticky top-8"
              style={{ 
                backgroundColor: 'var(--warm-white)',
                borderColor: 'var(--soft-lilac)'
              }}
            >
              <h2 
                className="text-2xl font-bold mb-6"
                style={{ color: 'var(--midnight-navy)' }}
              >
                👀 미리보기
              </h2>
              
              <div 
                className="mb-6 p-4 bg-gray-50 rounded-xl"
                dangerouslySetInnerHTML={{ __html: generateOutlookHTML() }}
              />

              <div className="space-y-3">
                <button
                  onClick={downloadHTML}
                  className="w-full text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all"
                  style={{ 
                    background: `linear-gradient(135deg, var(--main-violet) 0%, var(--soft-lilac) 100%)` 
                  }}
                >
                  💾 HTML 파일로 다운로드
                </button>
                
                <button
                  onClick={copyToClipboard}
                  className="w-full py-3 rounded-xl font-bold transition-all border-2"
                  style={copied ? {
                    backgroundColor: 'var(--main-violet)',
                    color: 'var(--warm-white)',
                    borderColor: 'var(--main-violet)'
                  } : {
                    backgroundColor: 'transparent',
                    color: 'var(--main-violet)',
                    borderColor: 'var(--soft-lilac)'
                  }}
                >
                  {copied ? '✅ 복사 완료!' : '📋 클립보드에 복사'}
                </button>
              </div>

              {/* 사용 방법 */}
              <div className="mt-6 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <span>💡</span>
                  <span>Outlook 적용 방법</span>
                </h3>
                <ol className="text-sm text-gray-700 space-y-2 ml-6 list-decimal">
                  <li>
                    <strong>"HTML 파일로 다운로드"</strong> 클릭
                  </li>
                  <li>
                    다운로드된 <code className="bg-yellow-100 px-2 py-0.5 rounded">email-signature.html</code> 파일을 브라우저에서 열기
                  </li>
                  <li>
                    화면에 보이는 서명을 <strong>드래그하여 선택</strong> (Ctrl+A)
                  </li>
                  <li>
                    복사 (Ctrl+C)
                  </li>
                  <li>
                    Outlook → 파일 → 옵션 → 메일 → 서명
                  </li>
                  <li>
                    새로 만들기 → 편집 영역에 <strong>붙여넣기</strong> (Ctrl+V)
                  </li>
                </ol>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* 추가 팁 */}
        <FadeIn delay={0.3}>
          <div 
            className="mt-12 rounded-2xl p-8"
            style={{ backgroundColor: 'rgba(175, 166, 255, 0.1)' }}
          >
            <h2 
              className="text-2xl font-bold mb-4"
              style={{ color: 'var(--midnight-navy)' }}
            >
              📌 서명 작성 꿀팁
            </h2>
            <div 
              className="grid md:grid-cols-2 gap-6"
              style={{ color: 'var(--midnight-navy)', opacity: 0.8 }}
            >
              <div>
                <h3 className="font-bold text-lg mb-2">✅ 권장사항</h3>
                <ul className="space-y-1 text-sm">
                  <li>• 필수 정보만 간결하게 (이름, 직책, 연락처)</li>
                  <li>• 모바일에서도 읽기 쉬운 폰트 크기 사용</li>
                  <li>• 회사 브랜드 컬러 활용</li>
                  <li>• 이미지는 최소화 (로딩 속도)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">❌ 피해야 할 것</h3>
                <ul className="space-y-1 text-sm">
                  <li>• 너무 긴 서명 (5줄 이상)</li>
                  <li>• 과도한 색상/장식</li>
                  <li>• 큰 이미지 파일</li>
                  <li>• 복잡한 HTML/CSS</li>
                </ul>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}

