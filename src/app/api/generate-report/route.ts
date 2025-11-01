import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// 최신 데이터 검색 함수
async function searchLatestData(topic: string): Promise<{ text: string; references: any[] }> {
  try {
    // 네이버 뉴스 API 사용 (search-crawler에서 사용 중인 것과 동일)
    const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID;
    const NAVER_CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET;
    
    if (!NAVER_CLIENT_ID || !NAVER_CLIENT_SECRET) {
      console.log('[SEARCH] Naver API 키 없음 - 검색 생략');
      return { text: '', references: [] };
    }

    const url = "https://openapi.naver.com/v1/search/news.json";
    const headers = {
      'X-Naver-Client-Id': NAVER_CLIENT_ID,
      'X-Naver-Client-Secret': NAVER_CLIENT_SECRET
    };
    const params = new URLSearchParams({
      query: topic,
      display: '10',
      sort: 'date'  // 최신순
    });

    const response = await fetch(`${url}?${params}`, { headers, method: 'GET' });
    
    if (!response.ok) {
      console.log('[SEARCH] Naver API 응답 실패:', response.status);
      return { text: '', references: [] };
    }

    const data = await response.json();
    
    if (!data.items || data.items.length === 0) {
      console.log('[SEARCH] 검색 결과 없음');
      return { text: '', references: [] };
    }

    // 검색 결과를 구조화된 데이터로 변환
    const references = data.items.slice(0, 8).map((item: any, index: number) => ({
      id: index + 1,
      title: item.title.replace(/<\/?b>/g, ''),
      description: item.description.replace(/<\/?b>/g, ''),
      link: item.link,
      pubDate: item.pubDate
    }));

    // GPT에 전달할 텍스트 (출처 번호 포함)
    let searchResults = '\n\n[최신 뉴스 및 자료 - 인용 시 반드시 아래 정보를 정확히 사용]\n\n';
    references.forEach((ref) => {
      searchResults += `[${ref.id}]\n`;
      searchResults += `제목: ${ref.title}\n`;
      searchResults += `내용: ${ref.description}\n`;
      searchResults += `링크 URL (참고 자료에 이 링크를 정확히 사용하세요): ${ref.link}\n`;
      searchResults += `발행일: ${new Date(ref.pubDate).toLocaleDateString('ko-KR')}\n`;
      searchResults += `---\n\n`;
    });

    console.log('[SEARCH] 검색 결과 수집 완료:', references.length);
    return { text: searchResults, references };
  } catch (error) {
    console.error('[SEARCH] 검색 실패:', error);
    return { text: '', references: [] };
  }
}

export async function POST(request: NextRequest) {
  try {
    const { 
      topic, 
      reportType, 
      point1, 
      point2, 
      point3, 
      audience, 
      length,
      useSearch,
      additionalContent,
      userId 
    } = await request.json();

    if (!topic) {
      return NextResponse.json(
        { error: '보고서 주제를 입력해주세요.' },
        { status: 400 }
      );
    }

    // OpenAI API 키 확인
    const apiKey = process.env.OPENAI_API_KEY;
    console.log('🔑 API Key exists:', !!apiKey);
    
    // 최신 데이터 검색 (옵션)
    let searchData = { text: '', references: [] as any[] };
    if (useSearch) {
      console.log('[SEARCH] 최신 데이터 검색 시작...');
      searchData = await searchLatestData(topic);
    }
    
    if (!apiKey) {
      // 데모 모드
      const demoReport = `
<article class="report">
  <h1 style="text-align: center; color: #1e3a8a; margin-bottom: 30px;">
    ${topic} 보고서
  </h1>
  
  <div style="background: #f3f4f6; padding: 20px; border-left: 4px solid #3b82f6; margin-bottom: 30px;">
    <p><strong>보고서 유형:</strong> ${reportType === 'market' ? '시장 조사' : reportType === 'industry' ? '산업 분석' : reportType === 'project' ? '프로젝트' : '연구'}</p>
    <p><strong>타겟 독자:</strong> ${audience === 'executive' ? '경영진' : audience === 'professional' ? '실무자' : '일반인'}</p>
    <p><strong>작성일:</strong> ${new Date().toLocaleDateString('ko-KR')}</p>
  </div>

  <h2>1. 요약</h2>
  <p>${topic}에 대한 종합적인 분석 보고서입니다. 본 보고서는 현재 시장 동향, 주요 이슈, 그리고 향후 전망을 다룹니다.</p>

  <h2>2. 서론</h2>
  <p>${topic}는 현대 비즈니스 환경에서 중요한 주제로 부상하고 있습니다. 본 보고서는 이에 대한 심층적인 분석을 제공합니다.</p>

  <h2>3. 주요 분석</h2>
  ${point1 ? `<h3>3.1 ${point1}</h3><p>${point1}에 대한 상세한 분석 내용입니다.</p>` : ''}
  ${point2 ? `<h3>3.2 ${point2}</h3><p>${point2}에 대한 상세한 분석 내용입니다.</p>` : ''}
  ${point3 ? `<h3>3.3 ${point3}</h3><p>${point3}에 대한 상세한 분석 내용입니다.</p>` : ''}

  <h2>4. 시장 동향</h2>
  <p>현재 시장은 빠르게 변화하고 있으며, 다음과 같은 주요 트렌드가 관찰됩니다:</p>
  <ul>
    <li>디지털 전환 가속화</li>
    <li>고객 경험 중심의 비즈니스 모델</li>
    <li>지속 가능성과 ESG 중시</li>
  </ul>

  <h2>5. 주요 발견사항</h2>
  <p>본 연구를 통해 다음과 같은 핵심 사항을 발견했습니다:</p>
  <ol>
    <li>시장 성장률은 연평균 15-20%로 예상됩니다</li>
    <li>경쟁 강도가 높아지고 있으나 신규 기회도 증가하고 있습니다</li>
    <li>기술 혁신이 업계 전반의 핵심 동력입니다</li>
  </ol>

  <h2>6. 권장사항</h2>
  <p>${audience === 'executive' ? '경영진께서는' : audience === 'professional' ? '실무진께서는' : '관계자 여러분께서는'} 다음 사항을 고려해야 합니다:</p>
  <ul>
    <li>단기적 조치: 즉각적인 시장 대응 전략 수립</li>
    <li>중기적 조치: 핵심 역량 강화 및 투자</li>
    <li>장기적 조치: 지속 가능한 성장 기반 구축</li>
  </ul>

  <h2>7. 결론</h2>
  <p>${topic}는 앞으로도 지속적인 관심과 투자가 필요한 분야입니다. 본 보고서의 분석과 권장사항을 바탕으로 전략적인 의사결정을 내리실 수 있기를 바랍니다.</p>

  <hr style="margin: 40px 0; border: none; border-top: 2px solid #e5e7eb;">
  
  <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin-top: 30px;">
    <p style="margin: 0; color: #92400e;"><strong>⚠️ 데모 모드</strong></p>
    <p style="margin: 5px 0 0 0; font-size: 14px; color: #92400e;">
      실제 AI 생성 기능을 사용하려면 OpenAI API 키를 Vercel 환경 변수에 추가하세요.
    </p>
  </div>
</article>
      `;

      return NextResponse.json({
        success: true,
        content: demoReport,
        tokensUsed: 0,
        isDemo: true,
      });
    }

    const openai = new OpenAI({ apiKey });

    // 보고서 유형별 설정
    const reportTypeSettings: Record<string, string> = {
      market: '시장 조사 보고서 - 시장 규모, 성장률, 경쟁 구도, 트렌드 분석',
      industry: '산업 분석 보고서 - 산업 구조, 주요 플레이어, 밸류체인, 규제 환경',
      project: '프로젝트 보고서 - 목표, 진행 현황, 성과, 이슈 및 대응방안',
      research: '연구 보고서 - 연구 배경, 방법론, 결과, 의의 및 한계',
    };

    // 타겟 독자별 설정
    const audienceSettings: Record<string, string> = {
      executive: '경영진 대상 - 핵심 요약, 전략적 시사점, 의사결정 가이드 중심',
      professional: '실무자 대상 - 상세한 분석, 실행 가능한 인사이트, 구체적 데이터',
      general: '일반 독자 대상 - 쉬운 설명, 시각적 요소, 이해하기 쉬운 용어',
    };

    // 길이별 설정
    const lengthSettings: Record<string, { pages: string; maxTokens: number }> = {
      short: { pages: '5페이지 분량 (약 2000-3000자)', maxTokens: 3000 },
      medium: { pages: '10페이지 분량 (약 4000-6000자)', maxTokens: 6000 },
      long: { pages: '20페이지 분량 (약 8000-12000자)', maxTokens: 12000 },
    };

    // 시스템 메시지
    const systemMessage = `당신은 전문 보고서 작성 전문가입니다. ${reportTypeSettings[reportType]}를 작성합니다. ${audienceSettings[audience]}으로 구성하세요.

**중요 규칙:**
1. 반드시 HTML 형식으로 출력 (Markdown 금지)
2. 객관적이고 전문적인 톤 유지
3. 데이터와 통계를 활용한 근거 제시
4. 체계적인 구조 (서론 → 본론 → 결론)
5. 실행 가능한 인사이트 제공
6. **출처 명시 필수**: 뉴스/자료 인용 시 반드시 [번호] 형태로 출처 표기 (예: "AI 시장은 25% 성장할 것으로 전망된다 [1]")
7. 구체적인 수치, 날짜, 출처를 최대한 활용하여 신뢰성 확보
8. **⚠️ 매우 중요**: 참고 자료의 링크 URL은 제공된 실제 URL을 정확히 복사해서 사용하세요. 절대로 임의로 만들지 마세요!`;

    // 프롬프트 구성
    let prompt = `다음 주제로 전문 보고서를 작성하세요: "${topic}"

[보고서 요구사항]
- 유형: ${reportTypeSettings[reportType]}
- 대상: ${audienceSettings[audience]}
- 길이: ${lengthSettings[length].pages}
- 작성일: ${new Date().toLocaleDateString('ko-KR')}

[보고서 구조 - 반드시 HTML로 작성]
<article class="report">
  <h1 style="text-align: center; color: #1e3a8a;">${topic} 보고서</h1>
  
  <div style="background: #f3f4f6; padding: 20px; border-left: 4px solid #3b82f6;">
    <p><strong>보고서 유형:</strong> ${reportTypeSettings[reportType]}</p>
    <p><strong>작성일:</strong> ${new Date().toLocaleDateString('ko-KR')}</p>
  </div>

  <h2>1. 요약 (Executive Summary)</h2>
  <p>{핵심 내용 3-5줄 요약}</p>

  <h2>2. 서론</h2>
  <p>{배경, 목적, 범위}</p>

  <h2>3. 주요 분석</h2>
  <h3>3.1 {첫 번째 분석 포인트}</h3>
  <p>{상세 분석, 데이터, 차트 설명}</p>
  
  <h3>3.2 {두 번째 분석 포인트}</h3>
  <p>{상세 분석}</p>

  <h2>4. 발견사항 (Key Findings)</h2>
  <ul>
    <li>{주요 발견 1}</li>
    <li>{주요 발견 2}</li>
  </ul>

  <h2>5. 권장사항 (Recommendations)</h2>
  <ol>
    <li>{단기 권장사항}</li>
    <li>{중기 권장사항}</li>
    <li>{장기 권장사항}</li>
  </ol>

  <h2>6. 결론</h2>
  <p>{전체 요약 및 향후 전망}</p>

  <hr style="margin: 40px 0; border: none; border-top: 2px solid #e5e7eb;">

  <h2>참고 자료 (References)</h2>
  <ol style="font-size: 14px; line-height: 1.8;">
    <li>[1] "{인용한 자료 제목}" - {출처}, {날짜}
        <br><a href="{링크}" target="_blank" style="color: #3b82f6; text-decoration: none;">기사 보기 →</a>
    </li>
  </ol>
  <p style="font-size: 12px; color: #6b7280; margin-top: 20px;">
    * 본 보고서는 위 참고 자료를 기반으로 AI가 작성하였습니다.
  </p>
</article>

**작성 예시:**

[본문 내 출처 표기 방법]
"AI 시장은 2030년까지 연평균 25% 성장할 것으로 전망된다 [1]. 특히 국내 시장 규모는 2025년 15조원에서 2030년 45조원으로 3배 증가할 것으로 예상된다 [2]. 이러한 성장은 자동화 기술의 발전과 기업들의 디지털 전환 가속화에 기인한다 [3]."

[참고 자료 섹션 형식]
<h2>참고 자료 (References)</h2>
<ol style="font-size: 14px; line-height: 1.8;">
  <li>[1] "기사 제목" - 출처명, 날짜
      <br><a href="실제_링크_URL" target="_blank" style="color: #3b82f6; text-decoration: none;">기사 보기 →</a>
  </li>
</ol>

**⚠️ 중요 - 링크 사용 규칙:**
1. 참고 자료의 링크는 **반드시 검색 결과로 제공된 실제 URL만 사용**하세요
2. 절대로 임의로 링크를 만들거나 수정하지 마세요
3. 제공된 [최신 뉴스 및 자료]의 "출처:" 다음에 나오는 URL을 정확히 복사해서 사용하세요
4. 링크가 없는 자료는 참고 자료에 포함하지 마세요

**중요 규칙**: 
- 본문에 [번호] 형태로 출처 표기
- 참고 자료는 제목, 출처, 날짜, **실제 링크** 모두 포함
- **링크는 검색 결과에서 제공된 실제 URL만 사용 (절대 임의 생성 금지)**
- 구체적인 수치와 데이터 활용
- 객관적이고 전문적인 문체 유지`;

    // 주요 분석 포인트 추가
    const points = [];
    if (point1) points.push(point1);
    if (point2) points.push(point2);
    if (point3) points.push(point3);

    if (points.length > 0) {
      prompt += `\n\n[필수 분석 포인트]\n`;
      points.forEach((point, index) => {
        prompt += `${index + 1}. ${point}\n`;
      });
      prompt += `\n위 포인트들을 보고서의 주요 분석 섹션에 반드시 포함하세요.`;
    }

    // 최신 검색 데이터 추가
    if (searchData.text) {
      prompt += searchData.text;
      prompt += `\n\n**⚠️ 매우 중요 - 링크 사용 지침:**
위 뉴스/자료를 참고 자료로 작성할 때:
1. "링크 URL" 다음에 나오는 URL을 **정확히 그대로 복사**해서 <a href="여기에"> 넣으세요
2. URL을 절대 수정하거나 임의로 만들지 마세요
3. 제공된 실제 URL만 사용하세요 (예: ${searchData.references?.[0]?.link || 'https://n.news.naver.com/...'})
4. 본문에는 [번호]로 표기하고, 참고 자료에는 위 정보를 정확히 사용하세요`;
    }

    // 추가 참고 자료
    if (additionalContent) {
      prompt += `\n\n[추가 참고 자료]\n${additionalContent}`;
    }

    console.log('[REPORT] OpenAI API 호출 시작...');

    // OpenAI API 호출
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: prompt },
      ],
      temperature: 0.5, // 보고서는 일관성이 중요
      max_tokens: lengthSettings[length].maxTokens,
    });

    const generatedContent = completion.choices[0]?.message?.content;

    if (!generatedContent) {
      return NextResponse.json(
        { error: '보고서 생성에 실패했습니다.' },
        { status: 500 }
      );
    }

    console.log('[REPORT] 보고서 생성 완료');

    return NextResponse.json({
      success: true,
      content: generatedContent,
      topic: topic,
      tokensUsed: completion.usage?.total_tokens || 0,
      isDemo: false,
    });
  } catch (error: unknown) {
    console.error('Report generation error:', error);
    
    const err = error as { code?: string; message?: string };
    if (err.code === 'insufficient_quota') {
      return NextResponse.json(
        { error: 'OpenAI API 사용량이 초과되었습니다. 관리자에게 문의하세요.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: err.message || '보고서 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

