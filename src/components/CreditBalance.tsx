'use client';

import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export function CreditBalance() {
  const { user } = useAuth();

  if (!user) return null;

  const credits = user.credits || 0;

  return (
    <Link
      href="/my/credits"
      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-full font-bold hover:shadow-lg hover:scale-105 transition-all"
    >
      <span className="text-xl">💎</span>
      <span>{credits} 크레딧</span>
    </Link>
  );
}

export function CreditBadge({ credits }: { credits?: number }) {
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-full font-bold shadow-md">
      <span className="text-base">💎</span>
      <span className="text-sm">{credits || 0}</span>
    </div>
  );
}
