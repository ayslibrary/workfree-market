// WorkFree Brand Button 컴포넌트

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'google';
  isLoading?: boolean;
  children: React.ReactNode;
}

export function Button({ 
  variant = 'primary', 
  isLoading = false,
  children, 
  className = '', 
  disabled,
  ...props 
}: ButtonProps) {
  const baseStyles = 'w-full px-6 py-3 font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2';
  
  const variants = {
    // Main CTA - Main Violet background
    primary: 'bg-[var(--main-violet)] text-[var(--warm-white)] rounded-[var(--radius-button)] hover:bg-[var(--soft-lilac)] hover:shadow-[0_4px_12px_rgba(106,92,255,0.3)] hover:scale-[1.02]',
    
    // Secondary - Outline with Soft Lilac
    secondary: 'bg-transparent text-[var(--main-violet)] border-2 border-[var(--soft-lilac)] rounded-[var(--radius-button)] hover:bg-[var(--soft-lilac)] hover:text-[var(--warm-white)]',
    
    // Outline - Minimal style
    outline: 'border-2 border-[var(--soft-lilac)] text-[var(--midnight-navy)] rounded-[var(--radius-button)] hover:bg-[var(--soft-lilac)] hover:bg-opacity-20',
    
    // Google - Special case
    google: 'bg-[var(--warm-white)] border-2 border-[var(--soft-lilac)] text-[var(--midnight-navy)] rounded-[var(--radius-button)] hover:bg-[var(--soft-lilac)] hover:bg-opacity-10',
  };
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>처리 중...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}









