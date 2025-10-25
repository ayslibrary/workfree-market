"use client";

import { useState, useEffect } from "react";

interface RoulettePopupProps {
  onClose?: () => void;
  autoShow?: boolean;
}

export default function RoulettePopup({ onClose, autoShow = true }: RoulettePopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [showResultPopup, setShowResultPopup] = useState(false);
  const [selectedReward, setSelectedReward] = useState("");

  const rewards = [
    { text: "30 크레딧", emoji: "💎", color: "#6A5CFF" },
    { text: "키트 50% 할인", emoji: "🎟️", color: "#8B7AFF" },
    { text: "20 크레딧", emoji: "💰", color: "#FF9A7A" },
    { text: "베타 전용 뱃지", emoji: "🏆", color: "#AFA6FF" },
    { text: "15 크레딧", emoji: "✨", color: "#FFB39A" },
    { text: "VIP 얼리버드", emoji: "👑", color: "#9B8AFF" }
  ];

  useEffect(() => {
    if (autoShow) {
      const hasPlayed = localStorage.getItem("roulettePlayed");
      if (!hasPlayed) {
        setIsVisible(true);
      }
    } else {
      setIsVisible(true);
    }
  }, [autoShow]);

  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);

    // 랜덤 각도 계산 (10바퀴 + 랜덤)
    const randomIndex = Math.floor(Math.random() * rewards.length);
    const degreePerSection = 360 / rewards.length;
    const targetDegree = 3600 + (360 - (randomIndex * degreePerSection + degreePerSection / 2));
    
    setRotation(targetDegree);

    setTimeout(() => {
      setSelectedReward(`${rewards[randomIndex].emoji} ${rewards[randomIndex].text}`);
      setShowResultPopup(true);
      localStorage.setItem("roulettePlayed", "true");
      setIsSpinning(false);
    }, 4000);
  };

  const handleClose = () => {
    setIsVisible(false);
    setShowResultPopup(false);
    onClose?.();
  };

  const handleResultConfirm = () => {
    setShowResultPopup(false);
    setIsVisible(false);
    onClose?.();
  };

  if (!isVisible) return null;

  return (
    <>
      {/* 메인 룰렛 팝업 */}
      <div
        className="fixed inset-0 bg-black/70 flex justify-center items-center z-[1000] animate-fadeIn p-4"
        style={{
          animation: "fadeIn 0.3s ease"
        }}
      >
        <div className="bg-gradient-to-br from-[#f5f0ff] via-white to-[#FFF5F0] rounded-[20px] md:rounded-[30px] p-6 md:p-12 text-center max-w-[600px] w-full shadow-[0_8px_60px_rgba(106,92,255,0.3)] relative border-2 border-[#AFA6FF]">
          <h2 className="text-xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-3 bg-gradient-to-r from-[#6A5CFF] via-[#8B7AFF] to-[#FF9A7A] bg-clip-text text-transparent leading-tight">
            🎉 베타테스터<br className="md:hidden" /> 전용 혜택!
          </h2>
          <p className="text-[#1E1B33]/70 text-sm md:text-base lg:text-lg mb-6 md:mb-8 font-semibold">
            WorkFree 런칭 기념 • 룰렛 한 번만!
          </p>

          {/* 룰렛 컨테이너 */}
          <div className="relative flex justify-center items-center mb-6 md:mb-10">
            {/* 상단 화살표 (침) */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-30">
              <div className="w-0 h-0 border-l-[15px] md:border-l-[20px] border-l-transparent border-r-[15px] md:border-r-[20px] border-r-transparent border-t-[25px] md:border-t-[35px] border-t-[#FF9A7A] drop-shadow-lg"></div>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2.5 md:w-3 h-2.5 md:h-3 bg-[#FF9A7A] rounded-full -mt-1"></div>
            </div>

            {/* 룰렛 휠 */}
            <div className="relative">
              <svg
                className="w-[280px] h-[280px] sm:w-[340px] sm:h-[340px] md:w-[400px] md:h-[400px] lg:w-[450px] lg:h-[450px] transition-transform duration-[4000ms] ease-out"
                viewBox="0 0 200 200"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  filter: "drop-shadow(0 10px 30px rgba(0,0,0,0.2))"
                }}
              >
                {rewards.map((reward, index) => {
                  const angle = (360 / rewards.length) * index;
                  const nextAngle = (360 / rewards.length) * (index + 1);
                  const midAngle = (angle + nextAngle) / 2;
                  
                  // SVG path 생성
                  const startX = 100 + 95 * Math.cos((angle - 90) * Math.PI / 180);
                  const startY = 100 + 95 * Math.sin((angle - 90) * Math.PI / 180);
                  const endX = 100 + 95 * Math.cos((nextAngle - 90) * Math.PI / 180);
                  const endY = 100 + 95 * Math.sin((nextAngle - 90) * Math.PI / 180);

                  // 텍스트 위치
                  const textX = 100 + 60 * Math.cos((midAngle - 90) * Math.PI / 180);
                  const textY = 100 + 60 * Math.sin((midAngle - 90) * Math.PI / 180);

                  return (
                    <g key={index}>
                      <path
                        d={`M 100 100 L ${startX} ${startY} A 95 95 0 0 1 ${endX} ${endY} Z`}
                        fill={reward.color}
                        stroke="white"
                        strokeWidth="2"
                      />
                      <text
                        x={textX}
                        y={textY}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="white"
                        fontSize="8"
                        fontWeight="bold"
                        transform={`rotate(${midAngle}, ${textX}, ${textY})`}
                        style={{ textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}
                      >
                        <tspan x={textX} dy="-7">{reward.emoji}</tspan>
                        <tspan x={textX} dy="9" fontSize="6.5">{reward.text}</tspan>
                      </text>
                    </g>
                  );
                })}
                {/* 중앙 원 */}
                <circle cx="100" cy="100" r="20" fill="white" stroke="#6A5CFF" strokeWidth="4" />
                <text x="100" y="100" textAnchor="middle" dominantBaseline="middle" fill="#6A5CFF" fontSize="12" fontWeight="bold">
                  SPIN
                </text>
              </svg>
            </div>
          </div>

          {/* 버튼 */}
          <button
            onClick={handleSpin}
            disabled={isSpinning}
            className="bg-gradient-to-r from-[#6A5CFF] via-[#8B7AFF] to-[#FF9A7A] text-white border-none px-8 md:px-12 py-3.5 md:py-5 text-base md:text-xl rounded-full cursor-pointer font-bold hover:scale-105 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 w-full md:w-auto"
          >
            {isSpinning ? "🎡 돌리는 중..." : "🎡 룰렛 돌리기!"}
          </button>

          {/* 닫기 버튼 */}
          <button
            onClick={handleClose}
            className="absolute top-4 md:top-6 right-4 md:right-6 w-8 md:w-10 h-8 md:h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center text-gray-600 hover:text-gray-900 transition-all shadow-md text-sm md:text-base"
          >
            ✖
          </button>
        </div>
      </div>

      {/* 결과 팝업 */}
      {showResultPopup && (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-[1100] animate-fadeIn p-4">
          <div className="bg-gradient-to-br from-[#f5f0ff] to-white rounded-2xl md:rounded-3xl p-8 md:p-12 text-center max-w-[500px] w-full shadow-[0_10px_70px_rgba(106,92,255,0.4)] animate-scaleIn border-2 border-[#AFA6FF]">
            <div className="text-6xl md:text-8xl mb-4 md:mb-6 animate-bounce">🎉</div>
            <h3 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-[#6A5CFF] to-[#FF9A7A] bg-clip-text text-transparent">
              축하합니다!
            </h3>
            <div className="bg-gradient-to-r from-[#AFA6FF]/20 to-[#FF9A7A]/20 rounded-xl md:rounded-2xl p-6 md:p-8 mb-6 md:mb-8 border-2 border-[#6A5CFF]/30">
              <p className="text-xl md:text-3xl font-bold text-[#6A5CFF] break-keep">
                {selectedReward}
              </p>
              <p className="text-sm md:text-base text-[#1E1B33]/70 mt-3">
                당첨되셨어요!
              </p>
            </div>
            <p className="text-[#1E1B33]/70 mb-6 md:mb-8 text-sm md:text-lg leading-relaxed">
              회원가입 후<br />
              <span className="font-bold text-[#6A5CFF]">마이페이지</span>에서 확인하실 수 있습니다
            </p>
            <button
              onClick={handleResultConfirm}
              className="bg-gradient-to-r from-[#6A5CFF] via-[#8B7AFF] to-[#FF9A7A] text-white px-8 md:px-10 py-3.5 md:py-4 rounded-full font-bold text-base md:text-lg hover:scale-105 transition-all shadow-xl w-full"
            >
              확인하고 시작하기
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </>
  );
}

