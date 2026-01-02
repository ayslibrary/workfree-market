// 게이미피케이션 데모 - MVP 베타 기간 중 비활성화
import { redirect } from 'next/navigation';

export default function GamificationDemo() {
  // MVP 베타 기간 중 게이미피케이션 기능 숨김
  redirect('/my/dashboard');
}
