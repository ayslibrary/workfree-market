import { NextRequest, NextResponse } from 'next/server';

// 서울외국환중개 매매기준율 크롤링 함수
async function crawlSeoulExchangeRates(): Promise<any[]> {
  try {
    // 실제 구현에서는 Puppeteer나 Playwright를 사용하여 웹스크래핑
    // 현재는 시뮬레이션 데이터로 구현 (실제 서비스에서는 웹스크래핑 코드로 교체)
    
    // 서울외국환중개 매매기준율 (실제 데이터 시뮬레이션)
    const seoulRates = {
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

    // 전일 대비 변동률 계산 (실제로는 전일 데이터와 비교)
    const previousRates = {
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

    // 한국은행 환율 (참고용)
    const bokRates = {
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

    const currencies = ['USD', 'EUR', 'JPY', 'CNY', 'GBP', 'AUD', 'CAD', 'CHF', 'HKD', 'SGD'];
    
    return currencies.map(currency => {
      const seoulRate = seoulRates[currency as keyof typeof seoulRates] || 0;
      const bokRate = bokRates[currency as keyof typeof bokRates] || 0;
      const previousRate = previousRates[currency as keyof typeof previousRates] || 0;
      const change = seoulRate - previousRate;
      const changePercent = previousRate > 0 ? (change / previousRate) * 100 : 0;

      return {
        currency,
        seoulRate,
        bokRate,
        change,
        changePercent,
        source: '서울외국환중개 매매기준율',
        reference: '한국은행 환율',
        timestamp: new Date().toISOString(),
      };
    });
  } catch (error) {
    console.error('서울외국환중개 데이터 크롤링 실패:', error);
    throw new Error('서울외국환중개 환율 데이터를 가져올 수 없습니다');
  }
}

// 실제 웹스크래핑 구현 예시 (Puppeteer 사용)
async function crawlSeoulExchangeRatesReal(): Promise<any[]> {
  try {
    // Puppeteer를 사용한 실제 웹스크래핑
    // const puppeteer = require('puppeteer');
    // const browser = await puppeteer.launch();
    // const page = await browser.newPage();
    // await page.goto('https://www.seoulfx.co.kr/'); // 서울외국환중개 사이트
    // 
    // const rates = await page.evaluate(() => {
    //   // 웹페이지에서 환율 데이터 추출
    //   const rateElements = document.querySelectorAll('.rate-item');
    //   return Array.from(rateElements).map(el => ({
    //     currency: el.querySelector('.currency').textContent,
    //     rate: parseFloat(el.querySelector('.rate').textContent),
    //   }));
    // });
    // 
    // await browser.close();
    // return rates;

    // 현재는 시뮬레이션 데이터 반환
    return await crawlSeoulExchangeRates();
  } catch (error) {
    console.error('실제 웹스크래핑 실패:', error);
    throw error;
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const currencies = searchParams.get('currencies')?.split(',') || ['USD', 'EUR', 'JPY', 'CNY'];
    const useRealCrawling = searchParams.get('real') === 'true';

    let rates;
    
    if (useRealCrawling) {
      rates = await crawlSeoulExchangeRatesReal();
    } else {
      rates = await crawlSeoulExchangeRates();
    }

    // 요청된 통화만 필터링
    const filteredRates = rates.filter(rate => currencies.includes(rate.currency));

    return NextResponse.json({
      success: true,
      rates: filteredRates,
      source: '서울외국환중개 매매기준율',
      timestamp: new Date().toISOString(),
      message: '서울외국환중개 매매기준율 데이터를 성공적으로 가져왔습니다',
    });
  } catch (error) {
    console.error('서울외국환중개 API 오류:', error);
    return NextResponse.json(
      { 
        error: '서울외국환중개 환율 데이터를 가져오는 중 오류가 발생했습니다',
        details: error instanceof Error ? error.message : '알 수 없는 오류'
      },
      { status: 500 }
    );
  }
}

// POST 요청으로 특정 통화 조회
export async function POST(request: NextRequest) {
  try {
    const { currencies, includeBokReference = true } = await request.json();

    if (!currencies || !Array.isArray(currencies) || currencies.length === 0) {
      return NextResponse.json(
        { error: '통화 목록이 필요합니다' },
        { status: 400 }
      );
    }

    const rates = await crawlSeoulExchangeRates();
    const filteredRates = rates.filter(rate => currencies.includes(rate.currency));

    return NextResponse.json({
      success: true,
      rates: filteredRates,
      includeBokReference,
      source: '서울외국환중개 매매기준율',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('서울외국환중개 POST API 오류:', error);
    return NextResponse.json(
      { error: '서울외국환중개 환율 데이터를 가져오는 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
