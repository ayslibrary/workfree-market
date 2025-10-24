import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // !! 경고: 프로덕션 빌드 시 타입 체크를 건너뜁니다 !!
    ignoreBuildErrors: true,
  },
  eslint: {
    // 빌드 시 ESLint 경고를 무시합니다
    ignoreDuringBuilds: false,
  },
  // useSearchParams를 사용하는 모든 페이지에 대해 동적 렌더링 강제
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
};

export default nextConfig;
