"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function FailClient() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const message = searchParams.get("message");

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-md w-full text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
          <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-3">결제 실패</h1>
        <p className="text-lg text-gray-600 mb-6">
          결제 처리 중 문제가 발생했습니다
        </p>

        {message && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-red-800">
              <span className="font-semibold">오류 메시지:</span> {message}
            </p>
            {code && (
              <p className="text-xs text-red-600 mt-2">
                오류 코드: {code}
              </p>
            )}
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={() => window.history.back()}
            className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:scale-[1.02] transition-all"
          >
            다시 시도하기
          </button>
          
          <Link
            href="/"
            className="block w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all"
          >
            홈으로 돌아가기
          </Link>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>문제가 계속되면 고객센터로 문의해주세요</p>
          <p className="mt-2">📧 contact@workfreemarket.com</p>
        </div>
      </div>
    </div>
  );
}


