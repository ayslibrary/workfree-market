'use client';

import { Toaster } from 'react-hot-toast';

export default function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        // 기본 옵션
        duration: 3000,
        style: {
          background: '#fff',
          color: '#1E1B33',
          padding: '16px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          fontSize: '14px',
          fontWeight: '500',
        },
        // 성공 토스트
        success: {
          duration: 3000,
          style: {
            background: '#10B981',
            color: '#fff',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#10B981',
          },
        },
        // 에러 토스트
        error: {
          duration: 4000,
          style: {
            background: '#EF4444',
            color: '#fff',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#EF4444',
          },
        },
        // 로딩 토스트
        loading: {
          style: {
            background: '#6A5CFF',
            color: '#fff',
          },
        },
      }}
    />
  );
}






