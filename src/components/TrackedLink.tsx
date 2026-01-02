// 클릭 추적이 포함된 Link 컴포넌트

'use client';

import Link from 'next/link';
import { useCallback, forwardRef } from 'react';
import { logBannerClick, logCTAClick, logLinkClick, getSessionId } from '@/lib/analytics/eventLogger';
import { useAuth } from '@/hooks/useAuth';

interface TrackedLinkProps extends React.ComponentProps<typeof Link> {
  // 추적 관련 props
  trackType?: 'banner' | 'cta' | 'link';
  trackId?: string;
  trackName?: string;
  campaignId?: string;
  metadata?: Record<string, any>;
  children: React.ReactNode;
}

/**
 * 클릭 추적이 자동으로 되는 Link 컴포넌트
 * 
 * @example
 * <TrackedLink
 *   href="/tools/blog-generator"
 *   trackType="banner"
 *   trackId="hero-blog-generator"
 *   trackName="Hero 블로그 생성기 배너"
 * >
 *   블로그 생성기 시작하기
 * </TrackedLink>
 */
export const TrackedLink = forwardRef<HTMLAnchorElement, TrackedLinkProps>(
  ({ trackType = 'link', trackId, trackName, campaignId, metadata, children, onClick, ...props }, ref) => {
    const { user } = useAuth();

    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLAnchorElement>) => {
        const linkText = typeof children === 'string' ? children : trackName || '';
        const href = typeof props.href === 'string' ? props.href : props.href?.pathname || '';

        // 추적 로그 전송 (비동기, 블로킹 안함)
        switch (trackType) {
          case 'banner':
            logBannerClick(
              trackId || href,
              trackName || linkText,
              user?.id,
              { ...metadata, campaignId, href }
            );
            break;
          case 'cta':
            logCTAClick(trackId || href, trackName || linkText, user?.id, href);
            break;
          case 'link':
          default:
            logLinkClick(href, linkText, user?.id);
            break;
        }

        // 원래 onClick 핸들러 호출
        if (onClick) {
          onClick(e);
        }
      },
      [trackType, trackId, trackName, campaignId, metadata, children, props.href, user?.id, onClick]
    );

    return (
      <Link ref={ref} {...props} onClick={handleClick}>
        {children}
      </Link>
    );
  }
);

TrackedLink.displayName = 'TrackedLink';

/**
 * 클릭 추적이 자동으로 되는 Button 컴포넌트
 */
interface TrackedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  trackType?: 'banner' | 'cta' | 'button';
  trackId?: string;
  trackName?: string;
  campaignId?: string;
  metadata?: Record<string, any>;
}

export const TrackedButton = forwardRef<HTMLButtonElement, TrackedButtonProps>(
  ({ trackType = 'button', trackId, trackName, campaignId, metadata, children, onClick, ...props }, ref) => {
    const { user } = useAuth();

    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        const buttonText = typeof children === 'string' ? children : trackName || '';

        // CTA 클릭 로그
        logCTAClick(
          trackId || props.id || 'unknown',
          trackName || buttonText,
          user?.id,
          metadata?.destination
        );

        if (onClick) {
          onClick(e);
        }
      },
      [trackId, trackName, metadata, children, props.id, user?.id, onClick]
    );

    return (
      <button ref={ref} {...props} onClick={handleClick}>
        {children}
      </button>
    );
  }
);

TrackedButton.displayName = 'TrackedButton';

export default TrackedLink;

