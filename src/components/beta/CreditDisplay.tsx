// 크레딧 표시 컴포넌트

import { formatCredits, estimateUsage } from '@/types/beta-onboarding';

interface CreditDisplayProps {
  amount: number;
  showValue?: boolean; // (X만원 상당) 표시 여부
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function CreditDisplay({
  amount,
  showValue = true,
  showIcon = true,
  size = 'md',
  className = '',
}: CreditDisplayProps) {
  const credits = formatCredits(amount);

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg font-semibold',
  };

  return (
    <span className={`${sizeClasses[size]} ${className}`}>
      {showIcon && '💎 '}
      {showValue ? credits.withValue : credits.formatted}
    </span>
  );
}

interface CreditBalanceCardProps {
  balance: number;
  earned?: number;
  spent?: number;
  showEstimates?: boolean;
}

export function CreditBalanceCard({
  balance,
  earned,
  spent,
  showEstimates = true,
}: CreditBalanceCardProps) {
  const credits = formatCredits(balance);
  const estimates = estimateUsage(balance);

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border-2 border-indigo-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">💎 내 크레딧</h3>
        {earned !== undefined && spent !== undefined && (
          <div className="text-xs text-gray-600">
            획득 {earned}개 · 사용 {spent}개
          </div>
        )}
      </div>

      <div className="mb-6">
        <div className="text-3xl font-bold text-indigo-600 mb-1">
          {credits.formatted}
        </div>
        <div className="text-sm text-gray-600">{credits.valueOnly}</div>
      </div>

      {showEstimates && balance > 0 && (
        <>
          <div className="text-sm font-semibold text-gray-700 mb-3">
            이걸로 할 수 있어요:
          </div>
          <div className="space-y-2">
            {estimates.map((estimate) => (
              <div
                key={estimate.toolName}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-gray-700">
                  {estimate.icon} {estimate.toolName}
                </span>
                <span className="font-semibold text-indigo-600">
                  {estimate.count}개
                </span>
              </div>
            ))}
          </div>
        </>
      )}

      {balance === 0 && (
        <div className="text-center py-4 text-gray-500">
          <div className="text-2xl mb-2">🎯</div>
          <div className="text-sm">미션을 완료하고 크레딧을 받아보세요!</div>
        </div>
      )}
    </div>
  );
}

interface CreditRewardPopupProps {
  amount: number;
  reason: string;
  onClose: () => void;
}

export function CreditRewardPopup({
  amount,
  reason,
  onClose,
}: CreditRewardPopupProps) {
  const credits = formatCredits(amount);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center animate-bounce-in">
        <div className="text-6xl mb-4">🎉</div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{reason}</h3>
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 mb-6">
          <div className="text-sm text-gray-600 mb-2">획득 크레딧</div>
          <div className="text-3xl font-bold text-indigo-600 mb-1">
            💎 {credits.formatted}
          </div>
          <div className="text-sm text-gray-600">{credits.valueOnly}</div>
        </div>

        <div className="text-sm text-gray-600 mb-6">
          이걸로 할 수 있어요:
          <div className="mt-3 space-y-1">
            {estimateUsage(amount).slice(0, 2).map((est) => (
              <div key={est.toolName} className="text-indigo-600 font-semibold">
                {est.icon} {est.toolName} {est.count}개
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all"
        >
          확인
        </button>
      </div>
    </div>
  );
}

interface CreditUsageConfirmProps {
  toolName: string;
  creditCost: number;
  currentBalance: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export function CreditUsageConfirm({
  toolName,
  creditCost,
  currentBalance,
  onConfirm,
  onCancel,
}: CreditUsageConfirmProps) {
  const cost = formatCredits(creditCost);
  const remaining = formatCredits(currentBalance - creditCost);
  const canAfford = currentBalance >= creditCost;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">{toolName}</h3>

        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">사용 크레딧</span>
            <span className="font-semibold text-red-600">
              -{cost.formatted}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">현재 잔액</span>
            <span className="font-semibold text-gray-900">
              {formatCredits(currentBalance).formatted}
            </span>
          </div>
          <div className="border-t pt-3 flex items-center justify-between">
            <span className="text-gray-900 font-semibold">사용 후 잔액</span>
            <span className="font-bold text-indigo-600">
              {remaining.formatted}
            </span>
          </div>
        </div>

        {canAfford ? (
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all"
            >
              취소
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all"
            >
              사용하기
            </button>
          </div>
        ) : (
          <>
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-4 text-center">
              <div className="text-red-600 font-semibold">
                💔 크레딧이 부족해요
              </div>
              <div className="text-sm text-red-500 mt-1">
                {creditCost - currentBalance}개가 더 필요해요
              </div>
            </div>
            <button
              onClick={onCancel}
              className="w-full bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all"
            >
              닫기
            </button>
          </>
        )}
      </div>
    </div>
  );
}

