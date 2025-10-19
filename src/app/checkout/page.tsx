import { Suspense } from "react";
import CheckoutClient from "./CheckoutClient";

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">결제 페이지 로딩 중...</p>
        </div>
      </div>
    }>
      <CheckoutClient />
    </Suspense>
  );
}

