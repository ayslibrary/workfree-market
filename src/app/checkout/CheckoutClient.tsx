"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { loadPaymentWidget, PaymentWidgetInstance } from "@tosspayments/payment-widget-sdk";

const TOSS_CLIENT_KEY = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || "test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq";
const CUSTOMER_KEY = "customer_" + Math.random().toString(36).substring(2, 15);

export default function CheckoutClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const paymentWidgetRef = useRef<PaymentWidgetInstance | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaymentReady, setIsPaymentReady] = useState(false);

  const kitName = searchParams.get("kitName") || "자동화 키트";
  const amount = parseInt(searchParams.get("amount") || "3000");
  const options = searchParams.get("options") || "";

  useEffect(() => {
    const initializePaymentWidget = async () => {
      try {
        const paymentWidget = await loadPaymentWidget(TOSS_CLIENT_KEY, CUSTOMER_KEY);
        paymentWidgetRef.current = paymentWidget;

        // 결제 UI 렌더링
        await paymentWidget.renderPaymentMethods("#payment-widget", { value: amount });

        // 결제 위젯이 완전히 렌더링될 때까지 대기
        setTimeout(() => {
          setIsLoading(false);
          setIsPaymentReady(true);
        }, 500);
      } catch (error) {
        console.error("결제 위젯 초기화 실패:", error);
        alert("결제 시스템을 불러오는데 실패했습니다.");
        setIsLoading(false);
      }
    };

    initializePaymentWidget();
  }, [amount]);

  const handlePayment = async () => {
    if (!isPaymentReady) {
      alert("결제 준비 중입니다. 잠시만 기다려주세요.");
      return;
    }

    const paymentWidget = paymentWidgetRef.current;
    if (!paymentWidget) {
      alert("결제 시스템을 불러오는데 실패했습니다.");
      return;
    }

    try {
      await paymentWidget.requestPayment({
        orderId: "order_" + Date.now(),
        orderName: kitName + (options ? " + 옵션" : ""),
        successUrl: `${window.location.origin}/checkout/success?kitName=${encodeURIComponent(kitName)}&options=${encodeURIComponent(options)}`,
        failUrl: `${window.location.origin}/checkout/fail`,
        customerEmail: "customer@example.com",
        customerName: "고객",
      });
    } catch (error) {
      console.error("결제 요청 실패:", error);
      alert("결제 요청 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="mb-8">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              뒤로가기
            </button>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">결제하기</h1>
            <p className="text-gray-600">안전한 토스페이먼츠 결제 시스템</p>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{kitName}</h2>
            {options && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">선택한 옵션:</p>
                <p className="text-sm text-gray-700">{options}</p>
              </div>
            )}
            <div className="flex justify-between items-center pt-4 border-t border-indigo-200">
              <span className="text-lg font-semibold text-gray-700">총 결제금액</span>
              <span className="text-2xl font-bold text-purple-600">₩{amount.toLocaleString()}</span>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
          ) : (
            <>
              <div id="payment-widget" className="mb-6"></div>
              
              <button
                onClick={handlePayment}
                disabled={!isPaymentReady}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                  isPaymentReady
                    ? "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white hover:shadow-xl hover:scale-[1.02] cursor-pointer"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {isPaymentReady ? `₩${amount.toLocaleString()} 결제하기` : "결제 준비 중..."}
              </button>
            </>
          )}

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>🔒 안전한 결제 시스템으로 보호됩니다</p>
          </div>
        </div>
      </div>
    </div>
  );
}


