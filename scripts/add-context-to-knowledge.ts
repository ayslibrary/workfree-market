// Knowledge base에 Contextual Retrieval 적용

import * as fs from 'fs';
import * as path from 'path';

const knowledgePath = path.join(process.cwd(), 'src', 'lib', 'rag', 'knowledge.json');
const knowledge = JSON.parse(fs.readFileSync(knowledgePath, 'utf-8'));

console.log('🔄 Contextual Retrieval 추가 시작\n');

const updatedKnowledge = knowledge.map((doc: any) => {
  // 문맥 생성
  let context = '';
  
  if (doc.category === 'tool') {
    const audienceStr = doc.targetAudience?.join(', ') || '사용자';
    const tagsStr = doc.tags?.slice(0, 3).join(', ') || '업무 자동화';
    
    context = `이 문서는 WorkFree Market의 자동화 툴 중 하나인 "${doc.toolName || doc.title}"에 대한 설명입니다. 주로 ${audienceStr}를 대상으로 하며, ${tagsStr} 관련 기능을 제공합니다. WorkFree Market은 직장인의 퇴근을 앞당기는 AI 기반 업무 자동화 플랫폼입니다. `;
  } else if (doc.category === 'faq') {
    context = `이 문서는 WorkFree Market 서비스 이용에 관한 자주 묻는 질문(FAQ)입니다. 사용자들이 궁금해하는 내용을 친절하게 안내합니다. `;
  } else if (doc.category === 'policy') {
    context = `이 문서는 WorkFree Market의 공식 정책 및 운영 규정에 대한 내용입니다. 가격, 환불, 이용 약관 등을 설명합니다. `;
  } else if (doc.category === 'intro') {
    context = `이 문서는 WorkFree Market 서비스 전반에 대한 소개 및 개요입니다. 서비스의 목적, 특징, 핵심 가치를 설명합니다. `;
  } else if (doc.category === 'feature') {
    context = `이 문서는 WorkFree Market의 주요 기능 및 특징에 대한 설명입니다. `;
  }
  
  // content에 context 결합 (임베딩 시 사용)
  const enhancedContent = context + doc.content;
  
  console.log(`✅ ${doc.title}`);
  console.log(`   문맥 길이: ${context.length}자`);
  console.log(`   전체 길이: ${enhancedContent.length}자\n`);
  
  return {
    ...doc,
    contextualContent: enhancedContent, // 새 필드 추가
    context: context, // 별도 저장
  };
});

// 저장
fs.writeFileSync(knowledgePath, JSON.stringify(updatedKnowledge, null, 2), 'utf-8');

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(`🎉 ${updatedKnowledge.length}개 문서에 문맥 추가 완료!`);
console.log('📝 다음: npm run embed:contextual 실행\n');

