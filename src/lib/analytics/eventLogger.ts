// 이벤트 로깅 시스템 (로그인 로그 + 클릭 이벤트 추적)

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ============================================
// 타입 정의
// ============================================

export interface LoginLog {
  userId?: string;
  email: string;
  loginType: 'email' | 'google' | 'oauth';
  ipAddress?: string;
  userAgent?: string;
  deviceType?: string;
  browser?: string;
  os?: string;
  success: boolean;
  errorMessage?: string;
  sessionId?: string;
}

export interface ClickEvent {
  userId?: string;
  sessionId: string;
  eventType: string;
  elementId?: string;
  elementText?: string;
  elementType?: string;
  pageUrl: string;
  pageTitle?: string;
  referrer?: string;
  bannerId?: string;
  bannerName?: string;
  campaignId?: string;
  clickPositionX?: number;
  clickPositionY?: number;
  scrollDepth?: number;
  timeOnPage?: number;
  metadata?: Record<string, any>;
}

export interface PageView {
  userId?: string;
  sessionId: string;
  pageUrl: string;
  pageTitle?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  deviceType?: string;
  browser?: string;
  os?: string;
  durationSeconds?: number;
}

// ============================================
// 유틸리티 함수
// ============================================

/**
 * 세션 ID 생성/조회
 */
export function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  
  let sessionId = sessionStorage.getItem('wf_session_id');
  if (!sessionId) {
    sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    sessionStorage.setItem('wf_session_id', sessionId);
  }
  return sessionId;
}

/**
 * 디바이스 정보 추출
 */
export function getDeviceInfo() {
  if (typeof window === 'undefined') {
    return { deviceType: 'unknown', browser: 'unknown', os: 'unknown' };
  }
  
  const ua = navigator.userAgent;
  
  // 디바이스 타입
  let deviceType = 'desktop';
  if (/Mobile|Android|iPhone|iPad/.test(ua)) {
    deviceType = /iPad|Tablet/.test(ua) ? 'tablet' : 'mobile';
  }
  
  // 브라우저
  let browser = 'unknown';
  if (ua.includes('Chrome')) browser = 'Chrome';
  else if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Safari')) browser = 'Safari';
  else if (ua.includes('Edge')) browser = 'Edge';
  
  // OS
  let os = 'unknown';
  if (ua.includes('Windows')) os = 'Windows';
  else if (ua.includes('Mac')) os = 'macOS';
  else if (ua.includes('Linux')) os = 'Linux';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';
  
  return { deviceType, browser, os };
}

/**
 * UTM 파라미터 추출
 */
export function getUTMParams() {
  if (typeof window === 'undefined') return {};
  
  const params = new URLSearchParams(window.location.search);
  return {
    utmSource: params.get('utm_source') || undefined,
    utmMedium: params.get('utm_medium') || undefined,
    utmCampaign: params.get('utm_campaign') || undefined,
    utmContent: params.get('utm_content') || undefined,
  };
}

// ============================================
// 로그인 로그
// ============================================

/**
 * 로그인 로그 기록
 */
export async function logLogin(data: LoginLog): Promise<boolean> {
  try {
    const deviceInfo = getDeviceInfo();
    
    const { error } = await supabase
      .from('login_logs')
      .insert({
        user_id: data.userId,
        email: data.email,
        login_type: data.loginType,
        ip_address: data.ipAddress,
        user_agent: typeof window !== 'undefined' ? navigator.userAgent : null,
        device_type: deviceInfo.deviceType,
        browser: deviceInfo.browser,
        os: deviceInfo.os,
        success: data.success,
        error_message: data.errorMessage,
        session_id: data.sessionId || getSessionId(),
      });

    if (error) {
      // 테이블이 없을 때(초기 설정 전) 콘솔 스팸을 줄이기 위해 메시지 단순화
      const maybeCode = (error as any)?.code;
      if (maybeCode === 'PGRST205') {
        console.warn('⚠️ login_logs 테이블이 없어 로그인 로그 저장을 건너뜁니다. (Supabase SQL 실행 필요)');
      } else {
        console.error('❌ 로그인 로그 저장 실패:', error);
      }
      return false;
    }

    console.log('✅ 로그인 로그 저장 완료');
    return true;
  } catch (error) {
    console.error('❌ 로그인 로그 오류:', error);
    return false;
  }
}

/**
 * 사용자 마지막 로그인 시간 및 횟수 업데이트
 */
export async function updateUserLoginInfo(userId: string): Promise<void> {
  try {
    await supabase.rpc('increment_login_count', { user_id: userId });
  } catch {
    // RPC 함수가 없으면 직접 업데이트
    try {
      const { data: userData } = await supabase
        .from('users')
        .select('login_count')
        .eq('id', userId)
        .single();
      
      await supabase
        .from('users')
        .update({
          last_login_at: new Date().toISOString(),
          login_count: (userData?.login_count || 0) + 1,
        })
        .eq('id', userId);
    } catch (error) {
      console.error('로그인 정보 업데이트 실패:', error);
    }
  }
}

// ============================================
// 클릭 이벤트
// ============================================

/**
 * 클릭 이벤트 기록
 */
export async function logClickEvent(data: ClickEvent): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('click_events')
      .insert({
        user_id: data.userId,
        session_id: data.sessionId || getSessionId(),
        event_type: data.eventType,
        element_id: data.elementId,
        element_text: data.elementText,
        element_type: data.elementType,
        page_url: data.pageUrl,
        page_title: data.pageTitle,
        referrer: data.referrer,
        banner_id: data.bannerId,
        banner_name: data.bannerName,
        campaign_id: data.campaignId,
        click_position_x: data.clickPositionX,
        click_position_y: data.clickPositionY,
        scroll_depth: data.scrollDepth,
        time_on_page: data.timeOnPage,
        metadata: data.metadata || {},
      });

    if (error) {
      console.error('❌ 클릭 이벤트 저장 실패:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('❌ 클릭 이벤트 오류:', error);
    return false;
  }
}

/**
 * 배너 클릭 이벤트 (단축 함수)
 */
export async function logBannerClick(
  bannerId: string,
  bannerName: string,
  userId?: string,
  metadata?: Record<string, any>
): Promise<boolean> {
  return logClickEvent({
    userId,
    sessionId: getSessionId(),
    eventType: 'banner_click',
    bannerId,
    bannerName,
    pageUrl: typeof window !== 'undefined' ? window.location.href : '',
    pageTitle: typeof window !== 'undefined' ? document.title : '',
    referrer: typeof document !== 'undefined' ? document.referrer : '',
    metadata,
  });
}

/**
 * CTA 버튼 클릭 이벤트
 */
export async function logCTAClick(
  ctaId: string,
  ctaText: string,
  userId?: string,
  destination?: string
): Promise<boolean> {
  return logClickEvent({
    userId,
    sessionId: getSessionId(),
    eventType: 'cta_click',
    elementId: ctaId,
    elementText: ctaText,
    elementType: 'button',
    pageUrl: typeof window !== 'undefined' ? window.location.href : '',
    pageTitle: typeof window !== 'undefined' ? document.title : '',
    referrer: typeof document !== 'undefined' ? document.referrer : '',
    metadata: { destination },
  });
}

/**
 * 링크 클릭 이벤트
 */
export async function logLinkClick(
  linkHref: string,
  linkText: string,
  userId?: string
): Promise<boolean> {
  return logClickEvent({
    userId,
    sessionId: getSessionId(),
    eventType: 'link_click',
    elementText: linkText,
    elementType: 'link',
    pageUrl: typeof window !== 'undefined' ? window.location.href : '',
    pageTitle: typeof window !== 'undefined' ? document.title : '',
    referrer: typeof document !== 'undefined' ? document.referrer : '',
    metadata: { href: linkHref },
  });
}

// ============================================
// 페이지 뷰
// ============================================

/**
 * 페이지 뷰 기록
 */
export async function logPageView(data?: Partial<PageView>): Promise<boolean> {
  try {
    const deviceInfo = getDeviceInfo();
    const utmParams = getUTMParams();
    
    const { error } = await supabase
      .from('page_views')
      .insert({
        user_id: data?.userId,
        session_id: data?.sessionId || getSessionId(),
        page_url: data?.pageUrl || (typeof window !== 'undefined' ? window.location.href : ''),
        page_title: data?.pageTitle || (typeof document !== 'undefined' ? document.title : ''),
        referrer: data?.referrer || (typeof document !== 'undefined' ? document.referrer : ''),
        utm_source: data?.utmSource || utmParams.utmSource,
        utm_medium: data?.utmMedium || utmParams.utmMedium,
        utm_campaign: data?.utmCampaign || utmParams.utmCampaign,
        utm_content: data?.utmContent || utmParams.utmContent,
        device_type: data?.deviceType || deviceInfo.deviceType,
        browser: data?.browser || deviceInfo.browser,
        os: data?.os || deviceInfo.os,
        duration_seconds: data?.durationSeconds,
      });

    if (error) {
      console.error('❌ 페이지 뷰 저장 실패:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('❌ 페이지 뷰 오류:', error);
    return false;
  }
}

// ============================================
// 분석 함수
// ============================================

/**
 * 로그인 통계 조회
 */
export async function getLoginStats(days: number = 7) {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('login_logs')
      .select('*')
      .gte('created_at', startDate.toISOString());

    if (error) throw error;

    const totalLogins = data?.length || 0;
    const successfulLogins = data?.filter(l => l.success).length || 0;
    const uniqueUsers = new Set(data?.map(l => l.user_id)).size;
    const googleLogins = data?.filter(l => l.login_type === 'google').length || 0;
    const emailLogins = data?.filter(l => l.login_type === 'email').length || 0;

    return {
      totalLogins,
      successfulLogins,
      failedLogins: totalLogins - successfulLogins,
      uniqueUsers,
      googleLogins,
      emailLogins,
      successRate: totalLogins > 0 ? Math.round((successfulLogins / totalLogins) * 100) : 0,
    };
  } catch (error) {
    console.error('로그인 통계 조회 실패:', error);
    return null;
  }
}

/**
 * 클릭 이벤트 통계 조회
 */
export async function getClickStats(days: number = 7) {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('click_events')
      .select('*')
      .gte('created_at', startDate.toISOString());

    if (error) throw error;

    const totalClicks = data?.length || 0;
    const bannerClicks = data?.filter(c => c.event_type === 'banner_click').length || 0;
    const ctaClicks = data?.filter(c => c.event_type === 'cta_click').length || 0;
    const linkClicks = data?.filter(c => c.event_type === 'link_click').length || 0;

    // 인기 배너
    const bannerCounts: Record<string, number> = {};
    data?.filter(c => c.banner_id).forEach(c => {
      bannerCounts[c.banner_id] = (bannerCounts[c.banner_id] || 0) + 1;
    });
    const popularBanners = Object.entries(bannerCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return {
      totalClicks,
      bannerClicks,
      ctaClicks,
      linkClicks,
      popularBanners,
    };
  } catch (error) {
    console.error('클릭 통계 조회 실패:', error);
    return null;
  }
}

