'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: '/', label: '🏠 홈' },
    { href: '/about', label: '💡 소개' },
    { href: '/community', label: '💬 커뮤니티' },
    { href: '/kits', label: '🧩 키트' },
    { href: '/tools/blog-generator', label: '✍️ 블로그' },
    { href: '/request', label: '✨ 요청하기' },
  ];

  return (
    <nav 
      className="sticky top-0 z-50 shadow-md"
      style={{ backgroundColor: 'var(--midnight-navy)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold" style={{ color: 'var(--warm-white)' }}>
              WorkFree
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ 
              backgroundColor: 'var(--main-violet)', 
              color: 'var(--warm-white)' 
            }}>
              BETA
            </span>
          </Link>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 text-sm font-medium transition-all duration-200`}
                style={pathname === item.href ? {
                  backgroundColor: 'var(--main-violet)',
                  color: 'var(--warm-white)',
                  borderRadius: 'var(--radius-button)',
                } : {
                  color: 'var(--warm-white)',
                  borderRadius: 'var(--radius-button)',
                }}
                onMouseEnter={(e) => {
                  if (pathname !== item.href) {
                    e.currentTarget.style.backgroundColor = 'rgba(106, 92, 255, 0.2)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (pathname !== item.href) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                {item.label}
              </Link>
            ))}
            
            {/* CTA Button */}
            <Link
              href="/login"
              className="ml-4 px-4 py-2 font-semibold transition-all duration-200"
              style={{
                backgroundColor: 'var(--main-violet)',
                color: 'var(--warm-white)',
                borderRadius: 'var(--radius-button)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--soft-lilac)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(106, 92, 255, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--main-violet)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              🔐 로그인
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg transition-colors"
              style={{ color: 'var(--warm-white)' }}
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div 
            className="md:hidden py-4 space-y-2"
            style={{ borderTop: '1px solid rgba(175, 166, 255, 0.2)' }}
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2 text-sm font-medium transition-all"
                style={pathname === item.href ? {
                  backgroundColor: 'var(--main-violet)',
                  color: 'var(--warm-white)',
                  borderRadius: 'var(--radius-button)',
                } : {
                  color: 'var(--warm-white)',
                }}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block mx-4 px-4 py-2 text-center font-semibold"
              style={{
                backgroundColor: 'var(--main-violet)',
                color: 'var(--warm-white)',
                borderRadius: 'var(--radius-button)',
              }}
            >
              🔐 로그인
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

