import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  fullScreen?: boolean;
  variant?: 'default' | 'purple' | 'gradient';
}

export default function LoadingSpinner({ 
  message = '로딩 중...', 
  fullScreen = true,
  variant = 'default'
}: LoadingSpinnerProps) {
  const getBackgroundClass = () => {
    switch (variant) {
      case 'purple':
        return 'bg-gradient-to-b from-white via-purple-50/30 to-white';
      case 'gradient':
        return 'bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900';
      default:
        return 'bg-white dark:bg-gray-900';
    }
  };

  const containerClass = fullScreen 
    ? `min-h-screen flex items-center justify-center ${getBackgroundClass()}`
    : 'flex items-center justify-center p-8';

  return (
    <div className={containerClass}>
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">{message}</p>
      </div>
    </div>
  );
}

