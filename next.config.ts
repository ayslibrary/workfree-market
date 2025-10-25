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
};

export default nextConfig;
