import { redirect } from 'next/navigation';

export default function PricingPage() {
  // 메인 페이지의 베타 섹션으로 리다이렉트
  redirect('/#beta');
}
