// 클릭 추적 커스텀 Hook

'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useAuth } from './useAuth';
import {
  logClickEvent,
  logBannerClick,
  logCTAClick,
  logLinkClick,
  logPageView,
  getSessionId,
} from '@/lib/analytics/eventLogger';

interface UseClickTrackerOptions {
  trackAllClicks?: boolean;
  trackPageViews?: boolean;
  trackScrollDepth?: boolean;
}

export function useClickTracker(options: UseClickTrackerOptions = {}) {
  const { user } = useAuth();
  const pageLoadTime = useRef<number>(Date.now());
  const lastScrollDepth = useRef<number>(0);

  // 페이지 뷰 트래킹
  useEffect(() => {
    if (options.trackPageViews !== false) {
      pageLoadTime.current = Date.now();
      logPageView({ userId: user?.id });
    }
  }, [user?.id, options.trackPageViews]);

  // 스크롤 깊이 트래킹
  useEffect(() => {
    if (!options.trackScrollDepth) return;

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollTop = window.scrollY;
      const scrollPercent = Math.round((scrollTop / scrollHeight) * 100);
      lastScrollDepth.current = Math.max(lastScrollDepth.current, scrollPercent);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [options.trackScrollDepth]);

  // 배너 클릭 트래킹
  const trackBannerClick = useCallback(
    (bannerId: string, bannerName: string, metadata?: Record<string, any>) => {
      logBannerClick(bannerId, bannerName, user?.id, metadata);
    },
    [user?.id]
  );

  // CTA 클릭 트래킹
  const trackCTAClick = useCallback(
    (ctaId: string, ctaText: string, destination?: string) => {
      logCTAClick(ctaId, ctaText, user?.id, destination);
    },
    [user?.id]
  );

  // 링크 클릭 트래킹
  const trackLinkClick = useCallback(
    (linkHref: string, linkText: string) => {
      logLinkClick(linkHref, linkText, user?.id);
    },
    [user?.id]
  );

  // 커스텀 이벤트 트래킹
  const trackCustomEvent = useCallback(
    (
      eventType: string,
      elementId?: string,
      elementText?: string,
      metadata?: Record<string, any>
    ) => {
      const timeOnPage = Math.round((Date.now() - pageLoadTime.current) / 1000);
      
      logClickEvent({
        userId: user?.id,
        sessionId: getSessionId(),
        eventType,
        elementId,
        elementText,
        pageUrl: window.location.href,
        pageTitle: document.title,
        referrer: document.referrer,
        scrollDepth: lastScrollDepth.current,
        timeOnPage,
        metadata,
      });
    },
    [user?.id]
  );

  // 전역 클릭 리스너 (모든 클릭 추적 옵션)
  useEffect(() => {
    if (!options.trackAllClicks) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // data-track 속성이 있는 요소만 추적
      const trackableElement = target.closest('[data-track]') as HTMLElement;
      if (!trackableElement) return;

      const trackData = trackableElement.dataset;
      const timeOnPage = Math.round((Date.now() - pageLoadTime.current) / 1000);

      logClickEvent({
        userId: user?.id,
        sessionId: getSessionId(),
        eventType: trackData.trackType || 'click',
        elementId: trackData.trackId || trackableElement.id,
        elementText: trackData.trackName || trackableElement.textContent?.slice(0, 100),
        elementType: trackableElement.tagName.toLowerCase(),
        bannerId: trackData.trackBannerId,
        bannerName: trackData.trackBannerName,
        campaignId: trackData.trackCampaignId,
        pageUrl: window.location.href,
        pageTitle: document.title,
        referrer: document.referrer,
        clickPositionX: e.clientX,
        clickPositionY: e.clientY,
        scrollDepth: lastScrollDepth.current,
        timeOnPage,
        metadata: trackData.trackMeta ? JSON.parse(trackData.trackMeta) : undefined,
      });
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [options.trackAllClicks, user?.id]);

  return {
    trackBannerClick,
    trackCTAClick,
    trackLinkClick,
    trackCustomEvent,
  };
}

// 컴포넌트용 HOC
export function withClickTracking<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  trackingId: string,
  trackingName: string
) {
  return function TrackedComponent(props: P) {
    const { trackCTAClick } = useClickTracker();

    const handleClick = (originalOnClick?: (...args: any[]) => void) => {
      return (...args: any[]) => {
        trackCTAClick(trackingId, trackingName);
        if (originalOnClick) {
          originalOnClick(...args);
        }
      };
    };

    return <WrappedComponent {...props} onClick={handleClick((props as any).onClick)} />;
  };
}

