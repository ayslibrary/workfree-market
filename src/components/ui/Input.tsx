// WorkFree Brand Input 컴포넌트

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--midnight-navy)' }}>
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-4 py-3 
          border-2 transition-all duration-200
          outline-none
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error 
            ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' 
            : 'border-[var(--soft-lilac)] focus:border-[var(--main-violet)] focus:ring-2 focus:ring-[var(--main-violet)]/20'
          }
          ${className}
        `}
        style={{
          backgroundColor: 'var(--warm-white)',
          color: 'var(--midnight-navy)',
          borderRadius: 'var(--radius-button)',
        }}
        {...props}
      />
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}













