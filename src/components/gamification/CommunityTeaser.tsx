'use client';

import React from 'react';
import { CommunityPost } from '@/types/gamification';

interface CommunityTeaserProps {
  posts: CommunityPost[];
  topUser?: {
    name: string;
    level: number;
    timeSaved: string;
  };
  onViewCommunity?: () => void;
}

export default function CommunityTeaser({ 
  posts, 
  topUser = { name: 'FriMaster', level: 8, timeSaved: '3시간 20분' }, 
  onViewCommunity 
}: CommunityTeaserProps) {
  const getCategoryIcon = (category: CommunityPost['category']) => {
    switch (category) {
      case 'general': return '💬';
      case 'tips': return '💡';
      case 'showcase': return '🎨';
      case 'question': return '❓';
      default: return '💬';
    }
  };
  
  const getCategoryName = (category: CommunityPost['category']) => {
    switch (category) {
      case 'general': return '일반';
      case 'tips': return '팁';
      case 'showcase': return '자랑';
      case 'question': return '질문';
      default: return '일반';
    }
  };
  
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMinutes < 60) return `${diffMinutes}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    if (diffDays < 7) return `${diffDays}일 전`;
    return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
  };
  
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <span className="text-2xl">🔥</span>
          <span>커뮤니티 하이라이트</span>
        </h2>
        <button
          onClick={onViewCommunity || (() => {})}
          className="text-indigo-600 text-sm font-medium hover:underline"
        >
          전체보기 →
        </button>
      </div>
      
      {/* 이번 주 자동화 장인 */}
      <div className="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
        <div className="flex items-center gap-3">
          <div className="text-3xl">🥇</div>
          <div className="flex-1">
            <div className="font-bold text-gray-800 mb-1">
              이번 주 자동화 장인
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">@{topUser.name}</span> (LV.{topUser.level}) · {topUser.timeSaved} 절약
            </div>
          </div>
          <div className="text-2xl">🏆</div>
        </div>
      </div>
      
      {/* HOT 스레드 */}
      <div className="space-y-3">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          <span className="text-lg">🔥</span>
          <span>HOT 스레드</span>
        </h3>
        
        {posts.length === 0 ? (
          <div className="text-center py-4">
            <div className="text-2xl mb-2">💬</div>
            <div className="text-gray-600 text-sm">아직 게시글이 없습니다</div>
          </div>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={onViewCommunity || (() => {})}
            >
              <div className="flex items-start gap-3">
                <div className="text-lg">
                  {getCategoryIcon(post.category)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-800 truncate">
                      {post.title}
                    </h4>
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">
                      HOT
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                    <span>@{post.userName}</span>
                    <span>LV.{post.userLevel}</span>
                    <span>{getCategoryName(post.category)}</span>
                    <span>{formatTimeAgo(post.createdAt)}</span>
                  </div>
                  
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                    {post.content}
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>👍 {post.likes}</span>
                    <span>💬 {post.comments}</span>
                    <span>👁️ {post.views}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* 참여 유도 */}
      <div className="mt-4 p-3 bg-indigo-50 rounded-lg">
        <div className="text-center">
          <div className="text-sm font-medium text-indigo-800 mb-1">
            💡 자동화 팁을 공유하고 크레딧을 받아보세요!
          </div>
          <div className="text-xs text-indigo-600">
            후기 작성 시 +3C, 팁 공유 시 +5C 보상
          </div>
        </div>
      </div>
    </div>
  );
}
