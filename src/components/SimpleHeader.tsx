'use client';

import Link from 'next/link';

export default function SimpleHeader() {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-1 md:space-x-2">
            <div className="w-7 h-7 md:w-8 md:h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-base md:text-lg font-bold">W</span>
            </div>
            <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              WorkFree
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center space-x-0.5 md:space-x-1">
            <Link
              href="/"
              className="px-1.5 md:px-3 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all"
            >
              🏠 <span className="hidden sm:inline">홈</span>
            </Link>
            <Link
              href="/request"
              className="px-1.5 md:px-3 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all"
            >
              ✨ <span className="hidden sm:inline">요청</span>
            </Link>
            <Link
              href="/requests"
              className="px-1.5 md:px-3 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all"
            >
              📋 <span className="hidden sm:inline">리스트</span>
            </Link>
            <Link
              href="/maker"
              className="px-1.5 md:px-3 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all"
            >
              🔧 <span className="hidden sm:inline">제작자</span>
            </Link>
            <Link
              href="/kits"
              className="px-1.5 md:px-3 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all"
            >
              🧩 <span className="hidden sm:inline">키트</span>
            </Link>
            <Link
              href="/pricing"
              className="px-1.5 md:px-3 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all"
            >
              💼 <span className="hidden sm:inline">요금제</span>
            </Link>
            <Link
              href="/admin"
              className="px-1.5 md:px-3 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all"
            >
              ⚙️ <span className="hidden lg:inline">Admin</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

