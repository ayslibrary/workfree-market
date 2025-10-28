'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface TimeSavingsVisualizationProps {
  timeSaved: number;
  dailyGoal: number;
  weeklyGoal: number;
}

export default function TimeSavingsVisualization({ 
  timeSaved, 
  dailyGoal, 
  weeklyGoal 
}: TimeSavingsVisualizationProps) {
  const [animatedTime, setAnimatedTime] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (timeSaved > 0) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setAnimatedTime(timeSaved);
        setIsAnimating(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [timeSaved]);

  const dailyProgress = Math.min((timeSaved / dailyGoal) * 100, 100);
  const weeklyProgress = Math.min((timeSaved / weeklyGoal) * 100, 100);

  const getTimeVisualization = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours === 0) {
      return `${mins}분`;
    } else if (mins === 0) {
      return `${hours}시간`;
    } else {
      return `${hours}시간 ${mins}분`;
    }
  };

  const getMotivationalMessage = (progress: number) => {
    if (progress >= 100) return "🎉 목표 달성! 퇴근 준비 완료!";
    if (progress >= 75) return "🔥 거의 다 왔어요! 조금만 더!";
    if (progress >= 50) return "💪 절반 달성! 계속 화이팅!";
    if (progress >= 25) return "🚀 좋은 시작이에요!";
    return "⏰ 오늘의 시간 절약을 시작해보세요!";
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg mx-4 sm:mx-0">
      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">
        ⏰ 오늘의 시간 절약 현황
      </h3>

      {/* 메인 시간 표시 */}
      <div className="text-center mb-6 sm:mb-8">
        <motion.div
          className="text-4xl sm:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2"
          animate={{ scale: isAnimating ? [1, 1.1, 1] : 1 }}
          transition={{ duration: 0.5 }}
        >
          {getTimeVisualization(animatedTime)}
        </motion.div>
        <p className="text-gray-600 text-lg">
          오늘 절약한 시간
        </p>
        <motion.p
          className="text-sm text-gray-500 mt-2"
          animate={{ opacity: isAnimating ? [0.5, 1, 0.5] : 1 }}
          transition={{ duration: 0.5, repeat: isAnimating ? Infinity : 0 }}
        >
          {getMotivationalMessage(dailyProgress)}
        </motion.p>
      </div>

      {/* 일일 목표 진행률 */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">일일 목표</span>
          <span className="text-sm text-gray-500">
            {getTimeVisualization(timeSaved)} / {getTimeVisualization(dailyGoal)}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${dailyProgress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
        <div className="text-xs text-gray-500 mt-1 text-right">
          {Math.round(dailyProgress)}% 완료
        </div>
      </div>

      {/* 주간 목표 진행률 */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">주간 목표</span>
          <span className="text-sm text-gray-500">
            {getTimeVisualization(timeSaved)} / {getTimeVisualization(weeklyGoal)}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <motion.div
            className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${weeklyProgress}%` }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          />
        </div>
        <div className="text-xs text-gray-500 mt-1 text-right">
          {Math.round(weeklyProgress)}% 완료
        </div>
      </div>

      {/* 시간 절약 효과 시각화 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-4 bg-blue-50 rounded-xl">
          <div className="text-2xl mb-2">☕</div>
          <div className="text-sm font-semibold text-blue-700">
            {Math.floor(timeSaved / 15)}잔의 커피
          </div>
          <div className="text-xs text-blue-600">
            마실 수 있는 시간
          </div>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-xl">
          <div className="text-2xl mb-2">🚶‍♂️</div>
          <div className="text-sm font-semibold text-green-700">
            {Math.floor(timeSaved / 30)}번의 산책
          </div>
          <div className="text-xs text-green-600">
            즐길 수 있는 시간
          </div>
        </div>
      </div>

      {/* 퇴근까지 남은 시간 */}
      {dailyProgress < 100 && (
        <motion.div
          className="mt-6 p-4 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-sm text-orange-800 font-medium">
            🎯 퇴근까지 {getTimeVisualization(dailyGoal - timeSaved)} 더 절약하면 목표 달성!
          </p>
        </motion.div>
      )}

      {/* 목표 달성 축하 */}
      {dailyProgress >= 100 && (
        <motion.div
          className="mt-6 p-4 bg-gradient-to-r from-green-100 to-blue-100 rounded-xl text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-sm text-green-800 font-medium">
            🎉 일일 목표 달성! 퇴근 준비 완료!
          </p>
        </motion.div>
      )}
    </div>
  );
}
