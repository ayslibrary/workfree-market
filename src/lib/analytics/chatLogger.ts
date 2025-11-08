// 챗봇 대화 로깅 시스템 (Supabase)

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

// ============================================
// 타입 정의
// ============================================

export interface ChatLog {
  userId?: string;
  sessionId: string;
  message: string;
  answer: string;
  confidence: number;
  responseTimeMs: number;
  model?: string;
  sources?: Array<{ title: string; url: string }>;
  relatedTools?: Array<{ name: string; url: string }>;
}

export interface SearchLog {
  chatLogId: string;
  query: string;
  expandedQueries: string[];
  results: Array<{ id: string; title: string; similarity: number }>;
  resultCount: number;
  avgSimilarity: number;
}

export interface FeedbackLog {
  chatLogId: string;
  userId?: string;
  helpful: boolean;
  comment?: string;
}

// ============================================
// 로깅 함수
// ============================================

/**
 * 챗봇 대화 저장
 */
export async function logChat(data: ChatLog): Promise<string | null> {
  try {
    const { data: result, error } = await supabase
      .from('chat_logs')
      .insert({
        user_id: data.userId || 'anonymous',
        session_id: data.sessionId,
        message: data.message,
        answer: data.answer,
        confidence: data.confidence,
        response_time_ms: data.responseTimeMs,
        model: data.model || 'gpt-3.5-turbo',
        sources: data.sources || [],
        related_tools: data.relatedTools || [],
      })
      .select('id')
      .single();

    if (error) {
      console.error('❌ Chat log 저장 실패:', error);
      return null;
    }

    console.log('✅ Chat log 저장:', result.id);
    return result.id;
  } catch (error) {
    console.error('❌ Chat log 오류:', error);
    return null;
  }
}

/**
 * 검색 결과 저장
 */
export async function logSearchResults(data: SearchLog): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('search_results')
      .insert({
        chat_log_id: data.chatLogId,
        query: data.query,
        expanded_queries: data.expandedQueries,
        results: data.results,
        result_count: data.resultCount,
        avg_similarity: data.avgSimilarity,
      });

    if (error) {
      console.error('❌ Search results 저장 실패:', error);
      return false;
    }

    console.log('✅ Search results 저장');
    return true;
  } catch (error) {
    console.error('❌ Search results 오류:', error);
    return false;
  }
}

/**
 * 피드백 저장
 */
export async function logFeedback(data: FeedbackLog): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('user_feedback')
      .insert({
        chat_log_id: data.chatLogId,
        user_id: data.userId || 'anonymous',
        helpful: data.helpful,
        comment: data.comment,
      });

    if (error) {
      console.error('❌ Feedback 저장 실패:', error);
      return false;
    }

    console.log('✅ Feedback 저장');
    return true;
  } catch (error) {
    console.error('❌ Feedback 오류:', error);
    return false;
  }
}

// ============================================
// 분석 함수
// ============================================

/**
 * RAG 성능 통계
 */
export async function getRAGStats(days: number = 7) {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('chat_logs')
      .select('confidence, response_time_ms, created_at')
      .gte('created_at', startDate.toISOString());

    if (error) throw error;

    const totalChats = data?.length || 0;
    const avgConfidence = data?.reduce((sum, log) => sum + (log.confidence || 0), 0) / totalChats || 0;
    const avgResponseTime = data?.reduce((sum, log) => sum + (log.response_time_ms || 0), 0) / totalChats || 0;

    // 피드백 통계
    const { data: feedbackData } = await supabase
      .from('user_feedback')
      .select('helpful')
      .gte('created_at', startDate.toISOString());

    const totalFeedback = feedbackData?.length || 0;
    const positiveFeedback = feedbackData?.filter(f => f.helpful).length || 0;
    const positiveRate = totalFeedback > 0 ? (positiveFeedback / totalFeedback) * 100 : 0;

    return {
      totalChats,
      avgConfidence: Math.round(avgConfidence * 100) / 100,
      avgResponseTime: Math.round(avgResponseTime),
      totalFeedback,
      positiveRate: Math.round(positiveRate * 10) / 10,
    };
  } catch (error) {
    console.error('Stats 조회 실패:', error);
    return null;
  }
}

/**
 * 인기 질문 조회
 */
export async function getPopularQuestions(limit: number = 10) {
  try {
    const { data, error } = await supabase
      .from('popular_questions')
      .select('*')
      .limit(limit);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('인기 질문 조회 실패:', error);
    return [];
  }
}

/**
 * 검색 실패 키워드
 */
export async function getLowSimilaritySearches(limit: number = 20) {
  try {
    const { data, error } = await supabase
      .from('low_similarity_searches')
      .select('*')
      .limit(limit);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('실패 검색 조회 실패:', error);
    return [];
  }
}

