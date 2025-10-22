import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { saveBlogHistory } from '@/lib/blogHistory';

export async function POST(request: NextRequest) {
  try {
    const { keyword, content1, content2, content3, additionalContent, blogCategory = 'info', tone = 'friendly', targetAudience = 'general', length = 'medium', blogStyle = 'basic', userId } = await request.json();

    if (!keyword) {
      return NextResponse.json(
        { error: '키워드를 입력해주세요.' },
        { status: 400 }
      );
    }

    // OpenAI API 키 확인
    const apiKey = process.env.OPENAI_API_KEY;
    console.log('🔑 API Key exists:', !!apiKey);
    console.log('🔑 API Key length:', apiKey?.length || 0);
    console.log('🔑 API Key preview:', apiKey ? apiKey.substring(0, 20) + '...' : 'undefined');
    
    if (!apiKey) {
      // 데모 모드: API 키가 없으면 샘플 블로그 글 반환
      const tonePrefix = tone === 'friendly' ? '안녕하세요! 😊' : 
                        tone === 'professional' ? '존경하는 독자 여러분께,' :
                        tone === 'casual' ? '헤이! 👋' :
                        '본 글에서는';
      
      // 종결어미 함수
      const getEnding = (base: string) => {
        if (tone === 'friendly') return base + '해요';
        if (tone === 'professional') return base + '합니다';
        if (tone === 'casual') return base + '다';
        return base + '합니다';
      };
      
      const demoBlog = `# ${keyword} - 완벽 가이드

${tonePrefix}

## 소개
${keyword}는 현대 디지털 시대에서 점점 더 중요해지고 있는 주제${tone === 'friendly' ? '예요' : tone === 'casual' ? '다' : '입니다'}. ${
  targetAudience === 'student' ? `이 글은 학습자 여러분을 위해 준비되었${tone === 'friendly' ? '어요' : tone === 'casual' ? '다' : '습니다'}.` :
  targetAudience === 'professional' ? `이 글은 실무자 여러분의 업무에 도움이 될 것${tone === 'friendly' ? '이에요' : tone === 'casual' ? '이다' : '입니다'}.` :
  targetAudience === 'expert' ? `본 분석은 전문가 수준의 심화 내용을 다루${tone === 'friendly' ? '어요' : tone === 'casual' ? 'ㄴ다' : '니다'}.` :
  `이 글에서는 ${keyword}에 대해 자세히 알아보${tone === 'friendly' ? '아요' : tone === 'casual' ? '자' : '겠습니다'}.`
}

## ${keyword}란 무엇인가?
${keyword}는 단순히 기술적인 개념을 넘어서, ${
  targetAudience === 'professional' ? '비즈니스 전략의 핵심 요소' :
  targetAudience === 'student' ? '학습해야 할 중요한 주제' :
  targetAudience === 'expert' ? '전문 분야의 고급 개념' :
  '알아두면 유용한 개념'
}로 자리잡고 있${tone === 'friendly' ? '어요' : tone === 'casual' ? '다' : '습니다'}.

${additionalContent ? `\n### 참고 자료 기반 인사이트\n${additionalContent.substring(0, 200)}...\n` : ''}

## ${keyword}의 주요 특징

### 1. 효율성 증대
${keyword}를 활용하면 ${
  targetAudience === 'professional' ? '업무 효율을 크게 높일 수 있습니다' :
  targetAudience === 'student' ? '학습 효율을 극대화할 수 있습니다' :
  '효율성을 높일 수 있습니다'
}.

### 2. ${targetAudience === 'professional' ? '비용 절감' : '시간 절약'}
${targetAudience === 'professional' ? '시간과 인력을 절약함으로써 전체적인 운영 비용을 줄일 수 있습니다.' :
  '더 중요한 일에 집중할 수 있는 시간을 확보할 수 있습니다.'}

## 실무 활용 방법

${keyword}를 실제로 활용하는 방법은 다양합니다:

- **기본 활용**: ${targetAudience === 'student' ? '학습에 즉시 적용' : '일상적인 업무에서 즉시 적용'} 가능한 방법
- **고급 활용**: 좀 더 복잡한 시나리오에서의 전략적 활용
- **통합 활용**: 다른 도구들과 연계하여 시너지 창출

## 성공 사례

많은 ${targetAudience === 'professional' ? '기업들' : targetAudience === 'student' ? '학습자들' : '사람들'}이 ${keyword}를 도입하여 놀라운 성과를 거두고 있습니다.

## 시작하기 위한 팁

1. **작게 시작하기**: 한 번에 모든 것을 바꾸려 하지 말고, 작은 프로젝트부터 시작하세요
2. **학습과 적응**: 꾸준히 학습하고 피드백을 반영하세요
3. **측정과 개선**: 정량적인 지표로 성과를 측정하고 지속적으로 개선하세요

## 결론

${keyword}는 이제 선택이 아닌 필수입니다. ${
  tone === 'friendly' ? '여러분도 지금 바로 시작해보세요! 😊' :
  tone === 'professional' ? '귀하의 성공을 기원합니다.' :
  tone === 'casual' ? '한번 시도해보는 거 어때요? 🚀' :
  '본 분석이 도움이 되기를 바랍니다.'
}

${length === 'long' ? `\n## FAQ\n\n**Q: ${keyword}는 어려운가요?**\nA: 처음엔 어려울 수 있지만, 꾸준히 학습하면 충분히 익힐 수 있습니다.\n\n**Q: 어디서부터 시작해야 하나요?**\nA: 기본부터 차근차근 시작하는 것을 추천합니다.\n` : ''}

---
⚠️ 이 글은 데모 버전입니다. 실제 AI 생성 기능을 사용하려면 OpenAI API 키를 설정하세요.

**선택한 옵션**: ${tone === 'friendly' ? '😊 친근한' : tone === 'professional' ? '💼 전문적' : tone === 'casual' ? '🎉 캐주얼' : '🎓 학술적'} 톤 | ${targetAudience === 'general' ? '🌐 일반인' : targetAudience === 'professional' ? '💼 직장인' : targetAudience === 'student' ? '🎓 학생' : '🔬 전문가'} 타겟 | ${length === 'short' ? '짧게' : length === 'medium' ? '보통' : '길게'} 길이`;

      return NextResponse.json({
        success: true,
        content: demoBlog,
        keyword: keyword,
        tokensUsed: 0,
        isDemo: true,
      });
    }

    const openai = new OpenAI({
      apiKey: apiKey,
    });

    // 블로그 카테고리별 설정
    const categorySettings: Record<string, string> = {
      info: '정보 전달을 목적으로 하는 정보성 블로그',
      review: '제품/서비스 리뷰 블로그',
      guide: '단계별 가이드 블로그',
      story: '스토리텔링 중심의 블로그',
    };

    // 톤 앤 매너 설정 (종결어미)
    const toneSettings: Record<string, string> = {
      friendly: '반드시 ~해요, ~예요, ~네요 등 해요체만 사용하세요. 예: "좋아요", "그래요", "알아보아요"',
      professional: '반드시 ~습니다, ~입니다 등 습니다체만 사용하세요. 예: "좋습니다", "그렇습니다", "알아봅니다"',
      casual: '반드시 ~다, ~지, ~야 등 반말체만 사용하세요. 예: "좋다", "그래", "알아보자"',
      academic: '~하였다, ~이다 등 학술적 문어체로 작성합니다',
    };

    // 타겟 독자 설정
    const audienceSettings: Record<string, string> = {
      general: '일반 대중을 대상으로, 쉽고 이해하기 편하게',
      professional: '직장인을 대상으로, 실무에 바로 적용 가능한 내용 중심',
      student: '학생을 대상으로, 학습과 이해를 돕는 교육적 내용 포함',
      expert: '전문가를 대상으로, 심화된 내용과 전문 용어 사용',
    };

    // 글 길이 설정
    const lengthSettings: Record<string, { wordCount: string; maxTokens: number }> = {
      short: { wordCount: '800~1200자', maxTokens: 2000 },
      medium: { wordCount: '1500~2000자', maxTokens: 3000 },
      long: { wordCount: '2500~3500자', maxTokens: 5000 },
    };

    // 블로그 스타일별 프롬프트 구성
    let prompt = '';
    let systemMessage = '';

    if (blogStyle === 'seo') {
      // SEO 최적화형
      systemMessage = `당신은 SEO 전문 블로그 작가이자 실무형 웹 개발자입니다. 네이버와 구글 검색 상위 노출을 목표로 구조화된 HTML 콘텐츠를 작성합니다. ${toneSettings[tone]}`;
      
      prompt = `다음 주제로 SEO에 최적화된 블로그 콘텐츠를 생성하세요: "${keyword}"

[SEO 목표]
- 네이버, 구글 검색 상위 노출
- 검색 의도 충족 (문제 → 해결 → 구체적 실행)
- 키워드 "${keyword}" 밀도 1.5~2.0% 유지 (3회 이상 자연스럽게 사용)
- 타겟 독자: ${audienceSettings[targetAudience]}
- 분량: ${lengthSettings[length].wordCount}
- **종결어미**: ${toneSettings[tone]}

[출력 형식] - 반드시 아래 HTML 구조를 따르세요:

<article class="blog-post">
  <h1>{매력적인 제목 - 키워드 "${keyword}" 포함}</h1>
  <p class="intro">{공감되는 문제 상황 2-3문장 - 키워드 자연스럽게 포함}</p>

  <!-- image: ${keyword} 관련 대표 이미지 -->

  <h2>왜 {키워드}가 중요할까?</h2>
  <p>{문제 정의 및 중요성}</p>
  <p><strong>{핵심 통계나 데이터}</strong></p>

  <h2>{키워드} 해결 방법</h2>
  <p>{구체적 해결 방안 설명}</p>
  <ul>
    <li><strong>방법 1:</strong> {상세 설명}</li>
    <li><strong>방법 2:</strong> {상세 설명}</li>
    <li><strong>방법 3:</strong> {상세 설명}</li>
  </ul>

  <h3>실무 적용 팁</h3>
  <p>{실제 활용 사례}</p>
  <!-- image: 실무 활용 예시 -->

  <h2>결론</h2>
  <p>{핵심 내용 요약 - 키워드 재언급}</p>
  <p>{독자가 얻을 수 있는 구체적 효과}</p>

  <div class="cta">
    <p><strong>이런 문제를 자동화할 수 있다면?</strong></p>
    <p>WorkFree에서 클릭 한 번으로 시작하세요. AI 자동화로 당신의 시간을 되찾으세요.</p>
  </div>

  <div class="tags">
    <span class="tag">{관련태그1}</span>
    <span class="tag">{관련태그2}</span>
    <span class="tag">{관련태그3}</span>
  </div>
</article>

**중요**: 
- 위 HTML 구조를 정확히 따르세요
- 키워드 "${keyword}"를 자연스럽게 3회 이상 사용
- 각 섹션마다 핵심 문장으로 요약`;

    } else if (blogStyle === 'marketing') {
      // 마케팅/콘텐츠형
      systemMessage = `당신은 마케팅 콘텐츠 전문 작가이자 실무형 웹 개발자입니다. 감정 몰입과 스토리텔링으로 독자를 사로잡는 구조화된 HTML 콘텐츠를 만듭니다. ${toneSettings[tone]}`;
      
      prompt = `"${keyword}"에 대한 마케팅용 블로그 콘텐츠를 생성하세요.

[마케팅 전략]
- 감정 몰입 + 실용 정보의 균형
- "실제로 겪는 문제 → 해결 → 변화를 체감" 구조
- 1문단에 3문장 이하, 짧고 명확한 리듬 유지
- 타겟 독자: ${audienceSettings[targetAudience]}
- 분량: ${lengthSettings[length].wordCount}
- **종결어미**: ${toneSettings[tone]}

[출력 형식] - 반드시 아래 HTML 구조를 따르세요:

<article class="blog-post">
  <h1>{임팩트 있는 제목 - 감정 자극}</h1>
  <p class="intro"><em>{스토리로 시작하는 도입부 - 독자의 고민 대변}</em></p>

  <h2>당신도 이런 경험 있나요?</h2>
  <p>{공감 가는 문제 상황}</p>
  <p><strong>{충격적인 수치나 팩트}</strong></p>

  <!-- image: 문제 상황 이미지 -->

  <h2>해결책은 생각보다 가까이</h2>
  <p>{해결 방법 소개 - 희망 제시}</p>
  <ul>
    <li>{간단한 방법 1}</li>
    <li>{간단한 방법 2}</li>
    <li>{간단한 방법 3}</li>
  </ul>

  <h3>실제로 변화를 경험한 사례</h3>
  <p>{성공 사례 또는 Before/After}</p>
  <p><em>{감동적인 결과 묘사}</em></p>

  <!-- image: 변화 결과 이미지 -->

  <h2>지금 바로 시작하세요</h2>
  <p>{행동 유도 - 간단함 강조}</p>
  <p><strong>{구체적인 혜택 제시}</strong></p>

  <div class="cta">
    <p><strong>WorkFree로 시작하세요.</strong></p>
    <p>클릭 한 번으로 완성. 당신의 시간을 되찾는 가장 확실한 방법입니다.</p>
  </div>
</article>

**중요**: 
- 위 HTML 구조를 정확히 따르세요
- 감정 자극 문구는 <em> 태그 사용
- 짧고 강렬한 문장으로 구성`;

    } else {
      // 기본형 (전문성 중심)
      systemMessage = `당신은 실무형 웹 개발자이자 전문 블로그 작가입니다. ${toneSettings[tone]}. ${audienceSettings[targetAudience]} 글을 작성합니다. 실무 중심의 전문적인 콘텐츠를 구조화된 HTML로 만듭니다.`;
      
      prompt = `다음 주제로 전문적인 블로그 콘텐츠를 생성하세요: "${keyword}"

[요구사항]
- 주제: ${keyword}
- 길이: ${lengthSettings[length].wordCount}
- **종결어미**: ${toneSettings[tone]}
- 타겟 독자: ${audienceSettings[targetAudience]}

[콘텐츠 구조]
1. 제목: 키워드를 포함한 매력적인 제목
2. 도입부: 독자의 공감을 이끄는 문제 상황 제시
3. 문제 정의: 현업의 실제 불편함과 원인 분석
4. 해결 방법: AI/자동화로 해결 가능한 구체적 방법
5. 실무 예시: 실제 활용 사례 (엑셀, 메일, 업무자동화 등)
6. 결론: 핵심 요약 및 행동 유도
7. CTA: WorkFree 또는 AI 자동화 도구 소개

[출력 형식] - 반드시 아래 HTML 구조를 따르세요:

<article class="blog-post">
  <h1>{매력적인 제목 - 키워드 포함}</h1>
  <p class="intro">{도입부 - 공감되는 문제 상황 2-3문장}</p>

  <h2>문제 정의</h2>
  <p>{현업에서 겪는 구체적인 문제점}</p>
  <p>{문제의 원인 분석}</p>

  <h2>해결 방법</h2>
  <p>{AI/자동화로 해결할 수 있는 방법}</p>
  <ul>
    <li>{구체적 방법 1}</li>
    <li>{구체적 방법 2}</li>
    <li>{구체적 방법 3}</li>
  </ul>

  <h2>실무 예시</h2>
  <p>{실제 활용 사례 설명}</p>
  <p><strong>{핵심 데이터나 수치}</strong></p>

  <h2>결론</h2>
  <p>{핵심 내용 요약}</p>
  <p>{독자가 얻을 수 있는 구체적 효과}</p>

  <div class="cta">
    <p><strong>WorkFree로 시작하세요.</strong></p>
    <p>클릭 한 번으로 완성하는 AI 자동화 - 당신의 시간을 되찾는 가장 확실한 방법입니다.</p>
  </div>
</article>

**중요**: 위 HTML 구조를 정확히 따르되, 내용은 창의적으로 작성하세요.`;
    }

    // 블로그 카테고리 정보 추가
    prompt += `\n\n[블로그 종류]\n${categorySettings[blogCategory]}로 작성해주세요.`;

    // 주요 내용 3개 추가
    const contents = [];
    if (content1) contents.push(content1);
    if (content2) contents.push(content2);
    if (content3) contents.push(content3);

    if (contents.length > 0) {
      prompt += `\n\n[포함해야 할 주요 내용]\n`;
      contents.forEach((content, index) => {
        prompt += `${index + 1}. ${content}\n`;
      });
      prompt += `\n위 내용들을 본문의 각 섹션에 자연스럽게 녹여서 작성하세요.`;
    }

    // 참고 자료 추가
    if (additionalContent) {
      prompt += `\n\n[추가 참고 자료]\n${additionalContent}`;
    }

    // OpenAI API 호출
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: systemMessage,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: tone === 'academic' ? 0.5 : tone === 'casual' ? 0.8 : 0.7, // 톤에 따라 창의성 조절
      max_tokens: lengthSettings[length].maxTokens,
    });

    const generatedContent = completion.choices[0]?.message?.content;

    if (!generatedContent) {
      return NextResponse.json(
        { error: '블로그 글 생성에 실패했습니다.' },
        { status: 500 }
      );
    }

    // Firebase에 히스토리 저장
    let historyId: string | undefined;
    if (userId) {
      try {
        historyId = await saveBlogHistory({
          userId,
          keyword,
          content: generatedContent,
          tone: tone as any,
          targetAudience: targetAudience as any,
          length: length as any,
          blogStyle: blogStyle as any,
          additionalContent,
          tokensUsed: completion.usage?.total_tokens || 0,
          createdAt: new Date().toISOString(),
        });
        console.log('✅ Blog history saved:', historyId);
      } catch (error) {
        console.error('❌ Failed to save blog history:', error);
        // 저장 실패해도 블로그는 반환
      }
    }

    return NextResponse.json({
      success: true,
      content: generatedContent,
      keyword: keyword,
      tokensUsed: completion.usage?.total_tokens || 0,
      historyId,
    });
  } catch (error: any) {
    console.error('Blog generation error:', error);
    
    // OpenAI API 에러 처리
    if (error.code === 'insufficient_quota') {
      return NextResponse.json(
        { error: 'OpenAI API 사용량이 초과되었습니다. 관리자에게 문의하세요.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: error.message || '블로그 글 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}


