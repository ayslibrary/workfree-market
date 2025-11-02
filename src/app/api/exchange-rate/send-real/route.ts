import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Gmail SMTP 설정
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER, // Gmail 주소
      pass: process.env.GMAIL_APP_PASSWORD, // Gmail 앱 비밀번호
    },
  });
};

// 환율 데이터 가져오기
async function getExchangeRates(currencies: string[]) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/exchange-rate/seoul-exchange`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currencies }),
    });
    
    if (!response.ok) {
      throw new Error('환율 데이터 조회 실패');
    }
    
    const data = await response.json();
    return data.rates || [];
  } catch (error) {
    console.error('환율 데이터 가져오기 실패:', error);
    return [];
  }
}

// 실제 이메일 발송
async function sendRealEmail(to: string[], subject: string, htmlContent: string) {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"WorkFree 자동화" <${process.env.GMAIL_USER}>`,
      to: to.join(', '),
      subject: subject,
      html: htmlContent,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('이메일 발송 성공:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('이메일 발송 실패:', error);
    throw new Error('이메일 발송에 실패했습니다');
  }
}

// HTML 이메일 템플릿 생성
function generateEmailTemplate(rates: any[], date: string, includeBokReference: boolean = true): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>WorkFree 매매기준율 정보</title>
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
          margin: 0; 
          padding: 0; 
          background-color: #f8fafc; 
          line-height: 1.6;
        }
        .container { 
          max-width: 600px; 
          margin: 0 auto; 
          background: white; 
          border-radius: 16px; 
          box-shadow: 0 10px 25px rgba(0,0,0,0.1); 
          overflow: hidden;
        }
        .header { 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
          color: white; 
          padding: 40px 30px; 
          text-align: center; 
        }
        .header h1 { 
          margin: 0; 
          font-size: 28px; 
          font-weight: 700; 
        }
        .header p { 
          margin: 10px 0 0 0; 
          font-size: 16px; 
          opacity: 0.9; 
        }
        .content { 
          padding: 30px; 
        }
        .date-info {
          background: #f1f5f9;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 25px;
          text-align: center;
          color: #475569;
          font-weight: 500;
        }
        .rates-table { 
          width: 100%; 
          border-collapse: collapse; 
          margin: 20px 0; 
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        .rates-table th { 
          background: #f8fafc; 
          padding: 15px 12px; 
          text-align: left; 
          font-weight: 600; 
          color: #374151;
          border-bottom: 2px solid #e5e7eb;
        }
        .rates-table td { 
          padding: 15px 12px; 
          border-bottom: 1px solid #f3f4f6; 
        }
        .rates-table tr:hover { 
          background-color: #f9fafb; 
        }
        .currency-cell {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .currency-flag {
          font-size: 24px;
        }
        .currency-info h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: #111827;
        }
        .currency-info p {
          margin: 2px 0 0 0;
          font-size: 12px;
          color: #6b7280;
        }
        .rate-value {
          font-size: 18px;
          font-weight: 700;
          color: #111827;
        }
        .change-positive { 
          color: #dc2626; 
          font-weight: 600; 
        }
        .change-negative { 
          color: #2563eb; 
          font-weight: 600; 
        }
        .change-neutral {
          color: #6b7280;
          font-weight: 500;
        }
        .footer { 
          background: #f8fafc; 
          padding: 25px; 
          text-align: center; 
          color: #6b7280; 
          border-top: 1px solid #e5e7eb;
        }
        .footer p {
          margin: 0;
          font-size: 14px;
        }
        .disclaimer {
          background: #fef3c7;
          border: 1px solid #f59e0b;
          border-radius: 6px;
          padding: 12px;
          margin-top: 20px;
          font-size: 13px;
          color: #92400e;
        }
        @media (max-width: 600px) {
          .container { margin: 10px; }
          .header, .content, .footer { padding: 20px; }
          .rates-table th, .rates-table td { padding: 10px 8px; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>💱 WorkFree 매매기준율 정보</h1>
          <p>매일 아침 서울외국환중개 매매기준율을 전해드립니다</p>
        </div>
        <div class="content">
          <div class="date-info">
            📅 ${date} 기준 매매기준율 (서울외국환중개 고시)
          </div>
          
          <table class="rates-table">
            <thead>
              <tr>
                <th>통화</th>
                <th style="text-align: right;">매매기준율 (KRW)</th>
                <th style="text-align: right;">변동</th>
                <th style="text-align: right;">변동률</th>
                ${includeBokReference ? '<th style="text-align: right;">한국은행</th>' : ''}
              </tr>
            </thead>
            <tbody>
              ${rates.map(rate => `
                <tr>
                  <td>
                    <div class="currency-cell">
                      <span class="currency-flag">${rate.flag || '🌍'}</span>
                      <div class="currency-info">
                        <h3>${rate.currency}</h3>
                        <p>${rate.name || ''}</p>
                      </div>
                    </div>
                  </td>
                  <td style="text-align: right;">
                    <span class="rate-value">${rate.seoulRate?.toLocaleString() || rate.rate.toLocaleString()}원</span>
                  </td>
                  <td style="text-align: right;" class="${rate.change > 0 ? 'change-positive' : rate.change < 0 ? 'change-negative' : 'change-neutral'}">
                    ${rate.change > 0 ? '↗️' : rate.change < 0 ? '↘️' : '➡️'} ${rate.change > 0 ? '+' : ''}${rate.change.toFixed(2)}원
                  </td>
                  <td style="text-align: right;" class="${rate.changePercent > 0 ? 'change-positive' : rate.changePercent < 0 ? 'change-negative' : 'change-neutral'}">
                    ${rate.changePercent > 0 ? '+' : ''}${rate.changePercent.toFixed(2)}%
                  </td>
                  ${includeBokReference ? `
                    <td style="text-align: right;">
                      <span style="font-size: 12px; color: #6b7280;">
                        ${rate.bokRate ? rate.bokRate.toLocaleString() + '원' : 'N/A'}
                      </span>
                    </td>
                  ` : ''}
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="disclaimer">
            <strong>⚠️ 주의사항:</strong> 이 매매기준율 정보는 참고용이며, 실제 거래 시에는 해당 금융기관의 환율을 확인하시기 바랍니다.
            ${includeBokReference ? '<br/><strong>📊 참고:</strong> 한국은행 환율은 비교용으로 제공됩니다.' : ''}
          </div>
        </div>
        <div class="footer">
          <p><strong>WorkFree 자동화 시스템</strong></p>
          <p>매일 아침 서울외국환중개 매매기준율을 전해드립니다</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export async function POST(request: NextRequest) {
  try {
    const { currencies, emails, testMode = false, includeBokReference = true } = await request.json();

    if (!currencies || !Array.isArray(currencies) || currencies.length === 0) {
      return NextResponse.json(
        { error: '통화 목록이 필요합니다' },
        { status: 400 }
      );
    }

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return NextResponse.json(
        { error: '이메일 목록이 필요합니다' },
        { status: 400 }
      );
    }

    // Gmail 설정 확인
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      return NextResponse.json(
        { error: 'Gmail 설정이 필요합니다. GMAIL_USER와 GMAIL_APP_PASSWORD 환경변수를 설정해주세요.' },
        { status: 500 }
      );
    }

    // 환율 데이터 가져오기
    const rates = await getExchangeRates(currencies);
    
    if (rates.length === 0) {
      return NextResponse.json(
        { error: '환율 데이터를 가져올 수 없습니다' },
        { status: 500 }
      );
    }

    // 이메일 내용 생성
    const date = new Date().toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });

    const subject = `[WorkFree] ${date} 기준 매매기준율 (서울외국환중개 고시) - ${currencies.join(', ')}`;
    const htmlContent = generateEmailTemplate(rates, date, includeBokReference);

    // 테스트 모드가 아닌 경우에만 실제 이메일 발송
    let result;
    if (!testMode) {
      result = await sendRealEmail(emails, subject, htmlContent);
    }

    return NextResponse.json({
      success: true,
      message: testMode ? '테스트 모드: 이메일이 발송되지 않았습니다' : '환율 이메일이 성공적으로 발송되었습니다',
      details: {
        currencies,
        emailCount: emails.length,
        ratesCount: rates.length,
        testMode,
        includeBokReference,
        timestamp: new Date().toISOString(),
        ...(result && { messageId: result.messageId })
      },
    });
  } catch (error) {
    console.error('환율 이메일 발송 API 오류:', error);
    return NextResponse.json(
      { error: '이메일 발송 중 오류가 발생했습니다: ' + (error instanceof Error ? error.message : '알 수 없는 오류') },
      { status: 500 }
    );
  }
}
