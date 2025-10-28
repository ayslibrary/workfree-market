'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface MissionCompleteEffectProps {
  isVisible: boolean;
  onComplete: () => void;
  missionTitle: string;
  creditsEarned: number;
  timeSaved: number;
}

export default function MissionCompleteEffect({
  isVisible,
  onComplete,
  missionTitle,
  creditsEarned,
  timeSaved
}: MissionCompleteEffectProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShowConfetti(true);
      const timer = setTimeout(() => {
        setShowConfetti(false);
        onComplete();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* 컨페티 효과 */}
          {showConfetti && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(50)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-full"
                  initial={{
                    x: '50%',
                    y: '50%',
                    rotate: 0,
                    scale: 1
                  }}
                  animate={{
                    x: `${50 + (Math.random() - 0.5) * 200}%`,
                    y: `${50 + (Math.random() - 0.5) * 200}%`,
                    rotate: 360,
                    scale: 0
                  }}
                  transition={{
                    duration: 2,
                    delay: Math.random() * 0.5,
                    ease: "easeOut"
                  }}
                />
              ))}
            </div>
          )}

          {/* 메인 카드 */}
          <motion.div
            className="bg-white rounded-3xl p-8 max-w-md mx-4 text-center shadow-2xl"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            {/* 성공 아이콘 */}
            <motion.div
              className="text-6xl mb-4"
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 0.6,
                repeat: 2,
                ease: "easeInOut"
              }}
            >
              🎉
            </motion.div>

            {/* 제목 */}
            <motion.h2
              className="text-2xl font-bold text-gray-900 mb-2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              미션 완료!
            </motion.h2>

            {/* 미션명 */}
            <motion.p
              className="text-lg text-gray-600 mb-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {missionTitle}
            </motion.p>

            {/* 보상 정보 */}
            <motion.div
              className="space-y-3 mb-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center justify-center gap-2 text-green-600 font-semibold">
                <span>💰</span>
                <span>+{creditsEarned} 크레딧 획득!</span>
              </div>
              {timeSaved > 0 && (
                <div className="flex items-center justify-center gap-2 text-blue-600 font-semibold">
                  <span>⏰</span>
                  <span>{timeSaved}분 시간 절약!</span>
                </div>
              )}
            </motion.div>

            {/* 퇴근 진행 메시지 */}
            <motion.div
              className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4 mb-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-sm text-gray-700 font-medium">
                🐰 토끼가 한 걸음 더 퇴근에 가까워졌어요!
              </p>
            </motion.div>

            {/* 닫기 버튼 */}
            <motion.button
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all"
              onClick={onComplete}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              계속하기 →
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
