import { NextRequest, NextResponse } from 'next/server';

// 자동화 설정 저장 (실제로는 데이터베이스에 저장)
const automationSettings: {
  [key: string]: {
    currencies: string[];
    emails: string[];
    sendTime: string;
    createdAt: string;
    isActive: boolean;
  };
} = {};

// 이메일 발송 함수 (실제로는 이메일 서비스 연동)
async function sendExchangeRateEmail(
  currencies: string[],
  emails: string[],
  rates: any[]
) {
  // 실제 구현에서는 SendGrid, AWS SES, 또는 다른 이메일 서비스 사용
  console.log('이메일 발송 시뮬레이션:', {
    to: emails,
    subject: `[WorkFree] ${new Date().toLocaleDateString('ko-KR')} 환율 정보`,
    currencies,
    rates
  });

  // HTML 이메일 템플릿 생성
  const htmlContent = generateEmailTemplate(rates);
  
  // 여기서 실제 이메일 발송 로직 구현
  // await emailService.send({
  //   to: emails,
  //   subject: `[WorkFree] ${new Date().toLocaleDateString('ko-KR')} 환율 정보`,
  //   html: htmlContent
  // });
}

// 이메일 HTML 템플릿 생성
function generateEmailTemplate(rates: any[]): string {
  const date = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; background-color: #f5f0ff; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #9333ea, #ec4899); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
        .content { padding: 30px; }
        .rate-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .rate-table th, .rate-table td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
        .rate-table th { background-color: #f9fafb; font-weight: bold; }
        .rate-table tr:hover { background-color: #f9fafb; }
        .change-positive { color: #dc2626; font-weight: bold; }
        .change-negative { color: #2563eb; font-weight: bold; }
        .footer { background-color: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 12px 12px; color: #6b7280; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>💱 WorkFree 환율 정보</h1>
          <p>${date}</p>
        </div>
        <div class="content">
          <h2>📊 주요 통화 환율</h2>
          <table class="rate-table">
            <thead>
              <tr>
                <th>통화</th>
                <th style="text-align: right;">환율</th>
                <th style="text-align: right;">변동</th>
                <th style="text-align: right;">변동률</th>
              </tr>
            </thead>
            <tbody>
              ${rates.map(rate => `
                <tr>
                  <td>
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <span style="font-size: 20px;">${rate.flag}</span>
                      <div>
                        <div style="font-weight: bold;">${rate.currency}</div>
                        <div style="font-size: 12px; color: #6b7280;">${rate.name}</div>
                      </div>
                    </div>
                  </td>
                  <td style="text-align: right; font-weight: bold; font-size: 16px;">
                    ${rate.rate.toLocaleString()}원
                  </td>
                  <td style="text-align: right;" class="${rate.change >= 0 ? 'change-positive' : 'change-negative'}">
                    ${rate.change >= 0 ? '+' : ''}${rate.change.toFixed(2)}원
                  </td>
                  <td style="text-align: right;" class="${rate.changePercent >= 0 ? 'change-positive' : 'change-negative'}">
                    ${rate.changePercent >= 0 ? '+' : ''}${rate.changePercent.toFixed(2)}%
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <p style="margin-top: 20px; font-size: 14px; color: #6b7280;">
            * 서울 외국환 중개소 기준 환율입니다.
          </p>
        </div>
        <div class="footer">
          <p>WorkFree 자동화 시스템 | 매일 ${new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}에 발송</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// 스케줄러 설정 (실제로는 cron job 또는 스케줄러 서비스 사용)
function setupScheduler(currencies: string[], emails: string[], sendTime: string) {
  // 실제 구현에서는 AWS EventBridge, Google Cloud Scheduler, 또는 cron job 사용
  console.log('스케줄러 설정:', {
    currencies,
    emails,
    sendTime,
    cronExpression: `0 ${sendTime.split(':')[1]} ${sendTime.split(':')[0]} * * *`
  });

  // 여기서 실제 스케줄러 설정 로직 구현
  // 예: AWS EventBridge 규칙 생성
  // await eventBridge.putRule({
  //   Name: 'exchange-rate-daily',
  //   ScheduleExpression: `cron(0 ${sendTime.split(':')[1]} ${sendTime.split(':')[0]} * * *)`,
  //   State: 'ENABLED'
  // });
}

export async function POST(request: NextRequest) {
  try {
    const { currencies, emails, sendTime, includeBokReference = true } = await request.json();

    // 입력 검증
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

    if (!sendTime || !/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(sendTime)) {
      return NextResponse.json(
        { error: '올바른 시간 형식이 아닙니다 (HH:MM)' },
        { status: 400 }
      );
    }

    // 설정 저장 (실제로는 데이터베이스에 저장)
    const settingId = `exchange-rate-${Date.now()}`;
    automationSettings[settingId] = {
      currencies,
      emails,
      sendTime,
      includeBokReference,
      createdAt: new Date().toISOString(),
      isActive: true,
    };

    // 스케줄러 설정
    setupScheduler(currencies, emails, sendTime);

    // 즉시 테스트 이메일 발송 (선택사항)
    try {
      // const rates = await fetchExchangeRates(currencies);
      // await sendExchangeRateEmail(currencies, emails, rates);
    } catch (error) {
      console.error('테스트 이메일 발송 실패:', error);
      // 테스트 이메일 실패는 전체 설정 실패로 처리하지 않음
    }

    return NextResponse.json({
      success: true,
      message: '환율 자동화가 성공적으로 설정되었습니다',
      settingId,
      details: {
        currencies,
        emailCount: emails.length,
        sendTime,
        includeBokReference,
        nextRun: `매일 ${sendTime}`,
      },
    });
  } catch (error) {
    console.error('환율 자동화 설정 API 오류:', error);
    return NextResponse.json(
      { error: '자동화 설정 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
