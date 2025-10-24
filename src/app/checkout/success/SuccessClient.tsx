"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default function SuccessClient() {
  const searchParams = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(true);

  const paymentKey = searchParams.get("paymentKey");
  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount");
  const kitName = searchParams.get("kitName") || "자동화 키트";
  const options = searchParams.get("options") || "";

  useEffect(() => {
    const verifyPayment = async () => {
      // 실제로는 백엔드에서 결제 승인 처리를 해야 합니다
      // 여기서는 간단히 시뮬레이션만 합니다
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsVerifying(false);
    };

    if (paymentKey && orderId && amount) {
      verifyPayment();
    } else {
      setIsVerifying(false);
    }
  }, [paymentKey, orderId, amount]);

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center max-w-md">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">결제 확인 중...</h2>
          <p className="text-gray-600">잠시만 기다려주세요</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            결제가 완료되었습니다! 🎉
          </h1>
          <p className="text-lg text-gray-600">
            자동화 키트를 다운로드하실 수 있습니다
          </p>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{kitName}</h2>
          {options && (
            <div className="mb-4 pb-4 border-b border-indigo-200">
              <p className="text-sm text-gray-600 mb-2">선택한 옵션:</p>
              <p className="text-sm text-gray-700">{options}</p>
            </div>
          )}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">주문번호</span>
              <span className="font-mono text-gray-900">{orderId}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">결제금액</span>
              <span className="font-bold text-purple-600">₩{parseInt(amount || "0").toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:scale-[1.02] transition-all">
            💾 자동화 키트 다운로드
          </button>
          
          <Link
            href="/"
            className="block w-full bg-gray-100 text-gray-700 py-4 rounded-xl font-semibold text-center hover:bg-gray-200 transition-all"
          >
            홈으로 돌아가기
          </Link>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>구매 내역은 마이페이지에서 확인하실 수 있습니다</p>
        </div>
      </div>
    </div>
  );
}



