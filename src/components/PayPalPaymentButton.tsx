"use client";

import React from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

interface PayPalPaymentButtonProps {
  amount?: string;
  currency?: string;
  onSuccess: (details: any) => void;
  onError?: (err: any) => void;
}

export default function PayPalPaymentButton({
  amount = "4.99",
  currency = "USD",
  onSuccess,
  onError,
}: PayPalPaymentButtonProps) {
  const clientId =
    process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ||
    "BAAw_2RLZt3r5WwpQsQB7shX7r4AiVY3kHcoQwb2LOFQYhLTJu7XsqoztPQMpJJu3ERfZUSrWF6RWLCKQA";

  return (
    <PayPalScriptProvider
      options={{
        clientId: clientId,
        currency: currency,
        intent: "capture",
      }}
    >
      <div className="w-full relative z-10">
        <PayPalButtons
          style={{
            layout: "vertical",
            color: "gold",
            shape: "rect",
            label: "pay",
            height: 48,
          }}
          createOrder={(data, actions) => {
            return actions.order.create({
              intent: "CAPTURE",
              purchase_units: [
                {
                  description: "WorkFree Market LV.01 Masterclass (Global Access)",
                  amount: {
                    currency_code: currency,
                    value: amount,
                  },
                },
              ],
            });
          }}
          onApprove={async (data, actions) => {
            if (actions.order) {
              const details = await actions.order.capture();
              onSuccess(details);
            }
          }}
          onError={(err) => {
            console.error("PayPal Payment Error:", err);
            if (onError) onError(err);
          }}
        />
      </div>
    </PayPalScriptProvider>
  );
}
