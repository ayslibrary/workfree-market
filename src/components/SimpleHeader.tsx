'use client';

import Link from 'next/link';

export default function SimpleHeader() {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg font-bold">W</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              WorkFree
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center space-x-1">
            <Link
              href="/"
              className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all"
            >
              🏠 홈
            </Link>
            <Link
              href="/request"
              className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all"
            >
              ✨ 요청하기
            </Link>
            <Link
              href="/requests"
              className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all"
            >
              📋 요청 리스트
            </Link>
            <Link
              href="/maker"
              className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all"
            >
              🔧 제작자
            </Link>
            <Link
              href="/kits"
              className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all"
            >
              🧩 키트
            </Link>
            <Link
              href="/pricing"
              className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all"
            >
              💼 요금제
            </Link>
            <Link
              href="/admin"
              className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all"
            >
              ⚙️ Admin
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

