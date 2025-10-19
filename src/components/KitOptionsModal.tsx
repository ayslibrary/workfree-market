"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface KitOption {
  id: string;
  name: string;
  description: string;
  price: number;
}

interface KitOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  kitName: string;
  basePrice: number;
  options: KitOption[];
}

export default function KitOptionsModal({
  isOpen,
  onClose,
  kitName,
  basePrice,
  options,
}: KitOptionsModalProps) {
  const router = useRouter();
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  if (!isOpen) return null;

  const toggleOption = (optionId: string) => {
    setSelectedOptions((prev) =>
      prev.includes(optionId)
        ? prev.filter((id) => id !== optionId)
        : [...prev, optionId]
    );
  };

  const calculateTotal = () => {
    let total = basePrice;
    selectedOptions.forEach((optionId) => {
      const option = options.find((opt) => opt.id === optionId);
      if (option) total += option.price;
    });
    return total;
  };

  const handlePayment = () => {
    // 베타 테스트 알림
    alert("🎉 베타테스트 기간으로 무료입니다!\n\n지금 바로 무료로 다운로드하실 수 있습니다.");
    
    // 베타 페이지로 이동
    router.push("/beta");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center rounded-t-2xl">
          <div>
            <h2 className="text-2xl font-bold text-purple-600">{kitName}</h2>
            <p className="text-sm text-gray-600 mt-1">옵션 선택</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-center text-gray-600 text-sm">
            기본 기능은 저렴하게, 필요한 기능은 옵션으로 추가하세요 ⚙️
          </p>

          <div className="space-y-3">
            {options.map((option) => (
              <label
                key={option.id}
                className="flex items-start justify-between p-4 border-2 border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-all hover:border-purple-300"
              >
                <div className="flex-1 pr-3">
                  <p className="font-semibold text-gray-900">{option.name}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {option.description}
                  </p>
                  <p className="text-sm font-medium text-purple-600 mt-2">
                    +₩{option.price.toLocaleString()}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={selectedOptions.includes(option.id)}
                  onChange={() => toggleOption(option.id)}
                  className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500 mt-1"
                />
              </label>
            ))}
          </div>

          <div className="pt-4 border-t border-gray-200 space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>기본 키트</span>
              <span>₩{basePrice.toLocaleString()}</span>
            </div>
            {selectedOptions.length > 0 && (
              <div className="flex justify-between text-sm text-gray-600">
                <span>추가 옵션 ({selectedOptions.length}개)</span>
                <span>
                  +₩
                  {(calculateTotal() - basePrice).toLocaleString()}
                </span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
              <span>총 합계</span>
              <span className="text-purple-600">
                ₩{calculateTotal().toLocaleString()}
              </span>
            </div>
          </div>

          <button
            onClick={handlePayment}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:scale-[1.02] transition-all"
          >
            결제하기
          </button>

          <button
            onClick={onClose}
            className="w-full bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}

