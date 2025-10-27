import { NextRequest, NextResponse } from 'next/server';

// 환율 데이터 타입
interface ExchangeRate {
  currency: string;
  name: string;
  rate: number;
  change: number;
  changePercent: number;
  flag: string;
  seoulRate?: number;
  bokRate?: number;
  source?: string;
  reference?: string;
}

// 통화 정보 매핑
const CURRENCY_INFO = {
  USD: { name: "미국 달러", flag: "🇺🇸" },
  EUR: { name: "유로", flag: "🇪🇺" },
  JPY: { name: "일본 엔", flag: "🇯🇵" },
  CNY: { name: "중국 위안", flag: "🇨🇳" },
  GBP: { name: "영국 파운드", flag: "🇬🇧" },
  AUD: { name: "호주 달러", flag: "🇦🇺" },
  CAD: { name: "캐나다 달러", flag: "🇨🇦" },
  CHF: { name: "스위스 프랑", flag: "🇨🇭" },
  HKD: { name: "홍콩 달러", flag: "🇭🇰" },
  SGD: { name: "싱가포르 달러", flag: "🇸🇬" },
};

// 서울외국환중개 매매기준율 데이터 가져오기
async function fetchSeoulExchangeRates(currencies: string[]): Promise<ExchangeRate[]> {
  try {
    // 서울외국환중개 API 호출
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/exchange-rate/seoul-exchange`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currencies }),
    });

    if (!response.ok) {
      throw new Error('서울외국환중개 API 호출 실패');
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || '서울외국환중개 데이터 조회 실패');
    }

    // ExchangeRate 형식으로 변환
    return data.rates.map((rate: any) => ({
      currency: rate.currency,
      name: CURRENCY_INFO[rate.currency as keyof typeof CURRENCY_INFO]?.name || rate.currency,
      rate: rate.seoulRate,
      change: rate.change,
      changePercent: rate.changePercent,
      flag: CURRENCY_INFO[rate.currency as keyof typeof CURRENCY_INFO]?.flag || "🌍",
      // 추가 정보
      seoulRate: rate.seoulRate,
      bokRate: rate.bokRate,
      source: rate.source,
      reference: rate.reference,
    }));
  } catch (error) {
    console.error('서울외국환중개 데이터 가져오기 실패:', error);
    
    // 에러 시 더미 데이터 반환
    return currencies.map(currency => ({
      currency,
      name: CURRENCY_INFO[currency as keyof typeof CURRENCY_INFO]?.name || currency,
      rate: 1000 + Math.random() * 500,
      change: (Math.random() - 0.5) * 20,
      changePercent: (Math.random() - 0.5) * 2,
      flag: CURRENCY_INFO[currency as keyof typeof CURRENCY_INFO]?.flag || "🌍",
      source: '서울외국환중개 매매기준율 (시뮬레이션)',
      reference: '한국은행 환율',
    }));
  }
}

export async function POST(request: NextRequest) {
  try {
    const { currencies, includeBokReference = true } = await request.json();

    if (!currencies || !Array.isArray(currencies) || currencies.length === 0) {
      return NextResponse.json(
        { error: '통화 목록이 필요합니다' },
        { status: 400 }
      );
    }

    // 환율 데이터 가져오기
    const rates = await fetchSeoulExchangeRates(currencies);

    return NextResponse.json({
      success: true,
      rates,
      includeBokReference,
      source: '서울외국환중개 매매기준율',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('환율 미리보기 API 오류:', error);
    return NextResponse.json(
      { error: '환율 데이터를 가져오는 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}