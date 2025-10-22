'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getUserCredits } from '@/lib/creditSystem';
import { UserCredits } from '@/types/credit';
import Link from 'next/link';

export default function CreditBalance() {
  const { user } = useAuth();
  const [credits, setCredits] = useState<UserCredits | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCredits = async () => {
      if (!user?.id) return;
      
      setLoading(true);
      const userCredits = await getUserCredits(user.id);
      setCredits(userCredits);
      setLoading(false);
    };

    if (user?.id) {
      loadCredits();
    }
  }, [user]);

  if (!user) return null;
  if (loading) {
    return (
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full animate-pulse">
        <span className="text-sm font-semibold">로딩중...</span>
      </div>
    );
  }

  if (!credits) {
    return (
      <Link
        href="/my/credits"
        className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full hover:shadow-lg transition-all"
      >
        <span className="text-sm font-semibold">크레딧 받기 🎁</span>
      </Link>
    );
  }

  const isLowBalance = credits.balance < 5;
  const isBetaTester = credits.isBetaTester;

  return (
    <Link
      href="/my/credits"
      className={`
        ${isLowBalance 
          ? 'bg-gradient-to-r from-red-500 to-orange-500' 
          : 'bg-gradient-to-r from-purple-500 to-pink-500'
        }
        text-white px-5 py-2.5 rounded-full hover:shadow-lg transition-all flex items-center gap-2
      `}
    >
      {isBetaTester && <span className="text-sm">🎁</span>}
      <span className="font-bold text-lg">{credits.balance}</span>
      <span className="text-sm opacity-90">크레딧</span>
      {isLowBalance && (
        <span className="ml-1 text-xs bg-white/20 px-2 py-0.5 rounded-full">
          충전필요
        </span>
      )}
    </Link>
  );
}

