-- ================================================
-- WorkFree Beta Analytics 테이블 생성
-- 로그인 로그 + 클릭 이벤트 추적
-- Supabase SQL Editor에서 실행하세요
-- ================================================

-- 1. 로그인 로그 테이블
CREATE TABLE IF NOT EXISTS login_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  login_type TEXT NOT NULL CHECK (login_type IN ('email', 'google', 'oauth')),
  ip_address TEXT,
  user_agent TEXT,
  device_type TEXT,
  browser TEXT,
  os TEXT,
  country TEXT,
  city TEXT,
  success BOOLEAN DEFAULT true,
  error_message TEXT,
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS login_logs_user_id_idx ON login_logs(user_id);
CREATE INDEX IF NOT EXISTS login_logs_email_idx ON login_logs(email);
CREATE INDEX IF NOT EXISTS login_logs_created_at_idx ON login_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS login_logs_success_idx ON login_logs(success);

-- 2. 클릭 이벤트 테이블
CREATE TABLE IF NOT EXISTS click_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  session_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  -- 클릭 대상 정보
  element_id TEXT,
  element_text TEXT,
  element_type TEXT,
  -- 페이지 정보
  page_url TEXT NOT NULL,
  page_title TEXT,
  referrer TEXT,
  -- 배너/CTA 정보
  banner_id TEXT,
  banner_name TEXT,
  campaign_id TEXT,
  -- 사용자 행동
  click_position_x INT,
  click_position_y INT,
  scroll_depth INT,
  time_on_page INT, -- seconds
  -- 메타데이터
  metadata JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS click_events_user_id_idx ON click_events(user_id);
CREATE INDEX IF NOT EXISTS click_events_session_id_idx ON click_events(session_id);
CREATE INDEX IF NOT EXISTS click_events_event_type_idx ON click_events(event_type);
CREATE INDEX IF NOT EXISTS click_events_banner_id_idx ON click_events(banner_id);
CREATE INDEX IF NOT EXISTS click_events_page_url_idx ON click_events(page_url);
CREATE INDEX IF NOT EXISTS click_events_created_at_idx ON click_events(created_at DESC);

-- 3. 페이지 뷰 테이블
CREATE TABLE IF NOT EXISTS page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  session_id TEXT NOT NULL,
  page_url TEXT NOT NULL,
  page_title TEXT,
  referrer TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  device_type TEXT,
  browser TEXT,
  os TEXT,
  duration_seconds INT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS page_views_user_id_idx ON page_views(user_id);
CREATE INDEX IF NOT EXISTS page_views_session_id_idx ON page_views(session_id);
CREATE INDEX IF NOT EXISTS page_views_page_url_idx ON page_views(page_url);
CREATE INDEX IF NOT EXISTS page_views_created_at_idx ON page_views(created_at DESC);

-- 4. 개인정보 확장 테이블 (users 테이블 확장)
-- 이미 users 테이블이 있으므로 컬럼 추가
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS company TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS job_title TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS industry TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS team_size TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS how_found_us TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS interests JSONB DEFAULT '[]'::JSONB;
ALTER TABLE users ADD COLUMN IF NOT EXISTS marketing_consent BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS privacy_consent BOOLEAN DEFAULT true;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS login_count INT DEFAULT 0;

-- 5. RLS 설정
ALTER TABLE login_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE click_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- 읽기 권한 (서비스 역할만)
CREATE POLICY "Service role can read login_logs"
  ON login_logs FOR SELECT
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role can read click_events"
  ON click_events FOR SELECT
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role can read page_views"
  ON page_views FOR SELECT
  USING (auth.role() = 'service_role');

-- 쓰기 권한 (누구나 익명으로 작성 가능 - 분석용)
CREATE POLICY "Anyone can insert login_logs"
  ON login_logs FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can insert click_events"
  ON click_events FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can insert page_views"
  ON page_views FOR INSERT
  WITH CHECK (true);

-- ================================================
-- 분석용 뷰 생성
-- ================================================

-- 일별 로그인 통계
CREATE OR REPLACE VIEW daily_login_stats AS
SELECT 
  DATE_TRUNC('day', created_at) AS date,
  COUNT(*) AS total_logins,
  COUNT(DISTINCT user_id) AS unique_users,
  SUM(CASE WHEN success THEN 1 ELSE 0 END) AS successful_logins,
  SUM(CASE WHEN NOT success THEN 1 ELSE 0 END) AS failed_logins,
  COUNT(DISTINCT CASE WHEN login_type = 'google' THEN user_id END) AS google_logins,
  COUNT(DISTINCT CASE WHEN login_type = 'email' THEN user_id END) AS email_logins
FROM login_logs
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY date DESC;

-- 인기 클릭 배너
CREATE OR REPLACE VIEW popular_banners AS
SELECT 
  banner_id,
  banner_name,
  COUNT(*) AS click_count,
  COUNT(DISTINCT user_id) AS unique_users,
  COUNT(DISTINCT session_id) AS unique_sessions
FROM click_events
WHERE banner_id IS NOT NULL
GROUP BY banner_id, banner_name
ORDER BY click_count DESC;

-- 페이지별 트래픽
CREATE OR REPLACE VIEW page_traffic AS
SELECT 
  page_url,
  COUNT(*) AS view_count,
  COUNT(DISTINCT user_id) AS unique_users,
  AVG(duration_seconds) AS avg_duration
FROM page_views
GROUP BY page_url
ORDER BY view_count DESC;

-- ================================================
-- 완료! 🎉
-- ================================================

