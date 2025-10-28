'use client';

import { motion } from 'framer-motion';

interface CommuteBackgroundProps {
  currentStage: number;
  progressPercentage: number;
}

const STAGE_BACKGROUNDS = [
  {
    id: 'office',
    gradient: 'from-blue-50 via-white to-blue-50',
    overlay: 'bg-gradient-to-br from-blue-100/20 to-transparent',
    elements: ['🏢', '📊', '💼', '📈']
  },
  {
    id: 'cafe', 
    gradient: 'from-orange-50 via-amber-50 to-yellow-50',
    overlay: 'bg-gradient-to-br from-orange-100/20 to-transparent',
    elements: ['☕', '🍰', '📱', '💻']
  },
  {
    id: 'subway',
    gradient: 'from-purple-50 via-indigo-50 to-blue-50', 
    overlay: 'bg-gradient-to-br from-purple-100/20 to-transparent',
    elements: ['🚇', '📱', '📖', '🎧']
  },
  {
    id: 'home',
    gradient: 'from-pink-50 via-rose-50 to-purple-50',
    overlay: 'bg-gradient-to-br from-pink-100/20 to-transparent', 
    elements: ['🏠', '🛋️', '📺', '🐱']
  }
];

export default function CommuteBackground({ currentStage, progressPercentage }: CommuteBackgroundProps) {
  const currentBg = STAGE_BACKGROUNDS[Math.min(currentStage, STAGE_BACKGROUNDS.length - 1)];
  
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* 메인 배경 그라디언트 */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${currentBg.gradient}`}
        animate={{
          background: [
            'linear-gradient(135deg, #dbeafe 0%, #ffffff 50%, #dbeafe 100%)',
            'linear-gradient(135deg, #fed7aa 0%, #fef3c7 50%, #fef3c7 100%)',
            'linear-gradient(135deg, #e9d5ff 0%, #e0e7ff 50%, #dbeafe 100%)',
            'linear-gradient(135deg, #fce7f3 0%, #fdf2f8 50%, #e9d5ff 100%)'
          ][currentStage]
        }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
      
      {/* 오버레이 */}
      <div className={`absolute inset-0 ${currentBg.overlay}`} />
      
      {/* 떠다니는 요소들 */}
      <div className="absolute inset-0 overflow-hidden">
        {currentBg.elements.map((element, index) => (
          <motion.div
            key={`${currentStage}-${index}`}
            className="absolute text-4xl opacity-20 select-none"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              rotate: Math.random() * 360
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              rotate: Math.random() * 360,
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          >
            {element}
          </motion.div>
        ))}
      </div>
      
      {/* 시간대별 조명 효과 */}
      <motion.div
        className="absolute inset-0"
        animate={{
          opacity: currentStage === 0 ? 1 : currentStage === 1 ? 0.8 : currentStage === 2 ? 0.6 : 0.4
        }}
        transition={{ duration: 1 }}
      >
        <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-yellow-200/30 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-blue-200/30 to-transparent" />
      </motion.div>
    </div>
  );
}
