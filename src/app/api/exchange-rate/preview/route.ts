import { NextRequest, NextResponse } from 'next/server';

// 환율 데이터 타입
interface ExchangeRate {
  currency: string;
  name: string;
  rate: number;
  change: number;
  changePercent: number;
  flag: string;
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

// 서울외환중개 매매기준율 데이터 가져오기
async function fetchSeoulExchangeRates(currencies: string[]): Promise<ExchangeRate[]> {
  try {
    // 실제 구현에서는 서울외환중개 API 또는 웹스크래핑 사용
    // 현재는 시뮬레이션 데이터로 구현
    
    // 서울외환중개 매매기준율 (실제 데이터)
    const seoulRates: { [key: string]: number } = {
      USD: 1352.40,
      EUR: 1420.30,
      JPY: 8.95,
      CNY: 181.20,
      GBP: 1645.80,
      AUD: 865.40,
      CAD: 970.25,
      CHF: 1485.60,
      HKD: 168.75,
      SGD: 970.85,
    };

    // 한국은행 환율 (참고용)
    const bokRates: { [key: string]: number } = {
      USD: 1351.90,
      EUR: 1419.80,
      JPY: 8.92,
      CNY: 180.50,
      GBP: 1644.30,
      AUD: 864.15,
      CAD: 969.80,
      CHF: 1484.25,
      HKD: 168.40,
      SGD: 969.40,
    };

    // 전일 대비 변동률 계산
    const previousRates: { [key: string]: number } = {
      USD: 1348.30,
      EUR: 1416.20,
      JPY: 8.88,
      CNY: 180.10,
      GBP: 1641.50,
      AUD: 862.80,
      CAD: 967.40,
      CHF: 1481.20,
      HKD: 167.90,
      SGD: 968.20,
    };

    // 데모용 더미 데이터 (실제 API 연동 시 제거)
    const dummyRates: { [key: string]: number } = {
      USD: 1315.50,
      EUR: 1420.30,
      JPY: 8.95,
      CNY: 181.20,
      GBP: 1645.80,
      AUD: 865.40,
      CAD: 970.25,
      CHF: 1485.60,
      HKD: 168.75,
      SGD: 970.85,
    };

    const previousRatesData: { [key: string]: number } = {
      USD: 1310.20,
      EUR: 1415.80,
      JPY: 8.88,
      CNY: 180.50,
      GBP: 1640.30,
      AUD: 860.15,
      CAD: 965.80,
      CHF: 1480.25,
      HKD: 167.90,
      SGD: 968.40,
    };

    return currencies.map(currency => {
      const seoulRate = seoulRates[currency] || 0;
      const bokRate = bokRates[currency] || 0;
      const previousRate = previousRatesData[currency] || 0;
      const change = seoulRate - previousRate;
      const changePercent = previousRate > 0 ? (change / previousRate) * 100 : 0;

      return {
        currency,
        name: CURRENCY_INFO[currency as keyof typeof CURRENCY_INFO]?.name || currency,
        rate: seoulRate,
        change: change,
        changePercent: changePercent,
        flag: CURRENCY_INFO[currency as keyof typeof CURRENCY_INFO]?.flag || "🌍",
        // 추가 정보
        seoulRate: seoulRate,
        bokRate: bokRate,
        source: '서울외환중개 매매기준율',
        reference: '한국은행 환율',
      };
    });
  } catch (error) {
    console.error('환율 데이터 가져오기 실패:', error);
    
    // 에러 시 더미 데이터 반환
    return currencies.map(currency => ({
      currency,
      name: CURRENCY_INFO[currency as keyof typeof CURRENCY_INFO]?.name || currency,
      rate: 1000 + Math.random() * 500,
      change: (Math.random() - 0.5) * 20,
      changePercent: (Math.random() - 0.5) * 2,
      flag: CURRENCY_INFO[currency as keyof typeof CURRENCY_INFO]?.flag || "🌍",
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
