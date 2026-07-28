"use client";

import { useState, useEffect, useRef } from "react";
import * as PortOne from "@portone/browser-sdk/v2";

interface Lecture {
  id: number;
  title: string;
  duration: string;
  filename: string;
  driveUrl?: string;
  bunnyVideoId?: string;
  summary: string;
  keyPoints: string[];
}

const LECTURES: Lecture[] = [
  {
    id: 1,
    title: "01강: 환경 세팅 마무리 — 애드인 폴더 등록과 신뢰할 수 있는 위치",
    duration: "04:39",
    filename: "Lecture_01.mp4",
    driveUrl: "https://drive.google.com/file/d/18wF4n2_E1xkf-_SA8OBDOT_atiT6FG0G/view?usp=drive_link",
    bunnyVideoId: "f464d3f6-2e1f-460b-a5a9-e6caf5c817c0",
    summary: "엑셀 개발 도구 탭 활성화, 매크로 보안 설정 해제 및 Microsoft AddIns 폴더(.xlam) 등록과 신뢰할 수 있는 위치 경로 설정을 진행합니다.",
    keyPoints: [
      "엑셀 개발 도구 탭 활성화 및 매크로 보안 설정 해제",
      "매크로 디렉토리(.xlam) 파일을 Microsoft AddIns 폴더에 등록",
      "신뢰할 수 있는 위치 경로 설정 및 즐겨찾기 고정",
    ],
  },
  {
    id: 2,
    title: "02강: 첫 자동화, 파일 여는 엑셀 매크로",
    duration: "08:20",
    filename: "Lecture_02.mp4",
    driveUrl: "https://drive.google.com/file/d/1OILzj22t9tqfGGObI7wUTXZuKexmAps7/view?usp=drive_link",
    bunnyVideoId: "73a3838c-f992-4195-83ae-6e2be38ce9d8",
    summary: "반복적으로 여는 업무 파일 경로를 복사하고, 생성형 AI(ChatGPT 등)를 활용하여 VBA 파일 열기 코드를 생성 및 테스트합니다.",
    keyPoints: [
      "반복적으로 여는 특정 업무 폴더/파일의 경로 복사",
      "생성형 AI(ChatGPT 등)를 활용한 VBA 파일 열기 코드 생성",
      "비주얼 베이직 편집기(Alt + F11)와 모듈 삽입 후 테스트 실행",
    ],
  },
  {
    id: 3,
    title: "03강: 이름이 핵심이다 — 매크로를 리본 메뉴에 심기",
    duration: "08:20",
    filename: "Lecture_03.mp4",
    driveUrl: "https://drive.google.com/file/d/1WsgiGEcj3hT3bQqQBN7PgVhua6zxhwxl/view?usp=drive_link",
    bunnyVideoId: "0b7ce959-06c0-4a03-9bb1-7778159feaf6",
    summary: "서브루틴 이름 규칙과 모듈 속성창 설정법을 익히고, 엑셀 상단 리본 메뉴에 커스텀 탭/그룹과 아이콘을 연결합니다.",
    keyPoints: [
      "서브루틴(Sub) 이름의 중요성과 유지보수를 위한 모듈 속성창 이름 변경",
      "엑셀 리본 메뉴 사용자 지정 (새 탭 및 새 그룹 생성)",
      "등록한 매크로에 아이콘(이모티콘)을 부여하고 상단 탭에 연동하기",
    ],
  },
  {
    id: 4,
    title: "04강: 데이터 구조를 AI에게 설명하는 법 — 헤더와 열 매핑 알려주기",
    duration: "08:20",
    filename: "Lecture_04.mp4",
    driveUrl: "https://drive.google.com/file/d/1ERAkv39bUEENU84bEboyRhUvIMhEiz9S/view?usp=drive_link",
    bunnyVideoId: "09d12072-d2fa-4e0e-bb97-fd8a4b8f480f",
    summary: "로우 데이터의 헤더 위치와 만기일·통화·금액 열 구조를 파악하고, AI에게 명확하게 집계 범위를 명령하는 프롬프트 작성법을 배웁니다.",
    keyPoints: [
      "실무 로우 데이터의 구조 파악 (헤더 행 위치 지정)",
      "만기일, 통화, 금액 등이 위치한 열(Column) 정보를 AI에게 명확히 전달하는 요령",
      "활성화된 시트 내에서 집계 범위를 지정하는 자연어 프롬프트 작성법",
    ],
  },
  {
    id: 5,
    title: "05강: 합산표 코드 받고 실행해보기",
    duration: "08:20",
    filename: "Lecture_05.mp4",
    driveUrl: "https://drive.google.com/file/d/1_GRqa9866tnjskM1z0sWoIROU8OIar3s/view?usp=drive_link",
    bunnyVideoId: "3542199e-0507-4f30-b836-0ef567d6e627",
    summary: "만기 월별·통화별 금액 합산표 생성 VBA 코드를 생성형 AI에게 요청하고, 모듈 붙여넣기 및 F5/F8 단계별 디버깅을 실행합니다.",
    keyPoints: [
      "만기 월별·통화별 금액 합산표 생성을 위한 VBA 코드 요청",
      "코드 복사 후 모듈에 붙여넣기 및 실행 (F5 / F8 디버깅)",
      "실행 결과 데이터 검증 및 오류 발생 시 대처 요령",
    ],
  },
  {
    id: 6,
    title: "06강: 합산표 매크로, 리본에 등록하기 — 실전 디버깅",
    duration: "08:20",
    filename: "Lecture_06.mp4",
    driveUrl: "https://drive.google.com/file/d/1NsCiH48wUlahexDx3iFpJ1FRrSmz1nxm/view?usp=drive_link",
    bunnyVideoId: "d218f0b3-5c71-4e12-84ea-861a6b4e65a9",
    summary: "작성한 매크로를 .xlam 추가 기능에 이관하여 리본 메뉴 버튼으로 등록하고, 디버그 오류 시 AI에게 캡처를 공유하여 리팩토링하는 기법입니다.",
    keyPoints: [
      "작성된 합산표 매크로를 .xlam 추가 기능 폴더에 최종 이관",
      "리본 메뉴에 데이터 가공용 그룹 및 버튼 추가",
      "디버그 오류 발생 시 AI에게 에러 화면을 공유하고 코드를 수정(리팩토링)하는 방법",
    ],
  },
  {
    id: 7,
    title: "07강: 한 번에 100개 PDF 만들기",
    duration: "08:20",
    filename: "Lecture_07.mp4",
    driveUrl: "https://drive.google.com/file/d/1CYEGZXmEyXx9MU9UUq-vy5AoyZC2lA0I/view?usp=drive_link",
    bunnyVideoId: "32eb76e2-486c-4c31-96e8-3d8a4df50587",
    summary: "거래처 목록이나 조건 키값을 자동으로 순회하여 수십~수백 개의 엑셀 보고서/청구서를 한 번에 PDF로 일괄 저장하는 매크로를 작성합니다.",
    keyPoints: [
      "거래처 키값 자동 변경 원리 (Loop 반복문 이해)",
      "다중 개별 거래처/시트를 한 번에 PDF 파일로 일괄 변환 저장",
      "폴더 자동 생성 및 파일명 규칙(거래처명_날짜.pdf) 적용",
    ],
  },
  {
    id: 8,
    title: "08강: 인쇄영역 디버깅과 완성",
    duration: "08:20",
    filename: "Lecture_08.mp4",
    driveUrl: "https://drive.google.com/file/d/1Dd6eE2HNdHd9GQ1OWpgZov0uTeV5GV3Q/view?usp=drive_link",
    bunnyVideoId: "7c08da41-06fc-42fd-8a41-eddc56c33758",
    summary: "페이지 레이아웃 인쇄 영역 자동 조절, 지정 폴더 저장 경로 세팅 및 파일명 덮어쓰기 방지 로직을 추가하여 PDF 매크로를 완성합니다.",
    keyPoints: [
      "페이지 레이아웃에서 인쇄 영역 해제 및 조절하기",
      "저장 폴더 경로 지정 및 파일명 덮어쓰기 방지 처리",
      "일괄 PDF 저장 매크로의 리본 메뉴 등록 및 최종 검증",
    ],
  },
  {
    id: 9,
    title: "09강: 원하는 값만 조회하기 — 인풋박스와 메시지 박스",
    duration: "08:20",
    filename: "Lecture_09.mp4",
    driveUrl: "https://drive.google.com/file/d/1Z7MTyDaBgT2bhxn_pSIFCfBNBFedv370/view?usp=drive_link",
    bunnyVideoId: "118f5f65-c81c-4441-bc7d-46497cd70278",
    summary: "사용자 조회를 위한 InputBox 대화상자와 MsgBox 알림창을 도입하여, 특정 폴더 파일을 직접 열지 않고 데이터를 빠르게 조회합니다.",
    keyPoints: [
      "사용자로부터 직접 날짜나 조건을 입력받는 InputBox 개념 도입",
      "특정 폴더의 파일을 열지 않고도 필요한 데이터만 추출해 MsgBox로 띄우기",
      "데이터 조회 자동화 매크로 작성 및 리본 메뉴 연동",
    ],
  },
  {
    id: 10,
    title: "10강: 다음 단계 예고 — 템플릿 매핑, 메일 자동화 개념 소개",
    duration: "08:20",
    filename: "Lecture_10.mp4",
    driveUrl: "https://drive.google.com/file/d/15Gt6LYITrFez6PDz7DVLMB7wzxItu3u4/view?usp=drive_link",
    bunnyVideoId: "60fb450a-2e5e-4c02-a60d-0abdd6b44033",
    summary: "매일 받는 로우 데이터의 고정 템플릿 자동 매핑, 아웃룩(Outlook) API 연동 PDF 청구서 메일 자동 전송 및 이벤트 기반 매크로의 발전 방향을 제시합니다.",
    keyPoints: [
      "매일 다운로드받는 로우 데이터를 고정 템플릿에 자동으로 매핑하는 심화 과정 안내",
      "아웃룩(Outlook) API 등을 연동하여 PDF 청구서를 이메일로 자동 전송하는 개념 소개",
      "이벤트 기반 매크로 및 업무 효율 극대화를 위한 최적화 팁 공유",
    ],
  },
];

export default function Home() {
  // Navigation View State: "landing" (Homepage) vs "classroom" (10-Lecture Video Learning Platform)
  const [viewMode, setViewMode] = useState<"landing" | "classroom">("landing");
  const [currentLecture, setCurrentLecture] = useState<Lecture>(LECTURES[0]);
  const [completedLectures, setCompletedLectures] = useState<number[]>([]);
  const [showDeployModal, setShowDeployModal] = useState<boolean>(false);
  const [showDriveModal, setShowDriveModal] = useState<boolean>(false);
  const [showCertificateModal, setShowCertificateModal] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [driveLinks, setDriveLinks] = useState<Record<number, string>>({});
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [calcDailyHours, setCalcDailyHours] = useState<number>(3);
  const [calcFrequency, setCalcFrequency] = useState<number>(5);

  // License Lock States (resets on page refresh)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [licenseInput, setLicenseInput] = useState<string>("");
  const [licenseError, setLicenseError] = useState<string>("");
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(false);
  const [showLicenseModal, setShowLicenseModal] = useState<boolean>(false);
  const [showKeyInfo, setShowKeyInfo] = useState<boolean>(false);

  const [isMobileCurriculumOpen, setIsMobileCurriculumOpen] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [selectedPayMethod, setSelectedPayMethod] = useState<"kakaopay" | "tosspay" | "card" | "naverpay">("kakaopay");
  const VALID_LICENSE_KEY = "workfreemarketyaho";
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);

  const handleToggleFullscreen = () => {
    const elem = playerContainerRef.current || videoRef.current;
    if (elem) {
      if (document.fullscreenElement) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      } else {
        if (elem.requestFullscreen) {
          elem.requestFullscreen();
        } else if ((elem as any).webkitRequestFullscreen) {
          (elem as any).webkitRequestFullscreen();
        } else if ((elem as any).msRequestFullscreen) {
          (elem as any).msRequestFullscreen();
        }
      }
    }
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleStop = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const handleSeek = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime + seconds);
    }
  };

  // State for Privacy Policy Modal, Terms Modal & Inquiry Choice Modal
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showInquiryModal, setShowInquiryModal] = useState(false);

  // Lecture Playback Progress Tracking (Resume Playback)
  const [lectureTimestamps, setLectureTimestamps] = useState<Record<number, number>>({});

  // Load completion state and progress from localStorage
  useEffect(() => {
    const savedPaid = localStorage.getItem("workfree_paid_auth");
    if (savedPaid === "true") {
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem("workfree_license_auth");
    }

    const savedCompleted = localStorage.getItem("workfree_completed");
    if (savedCompleted) {
      try {
        setCompletedLectures(JSON.parse(savedCompleted));
      } catch (e) {
        console.error(e);
      }
    }

    const savedProgress = localStorage.getItem("workfree_lecture_progress");
    if (savedProgress) {
      try {
        setLectureTimestamps(JSON.parse(savedProgress));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        let currentTime = 0;
        if (typeof event.data === "string") {
          const parsed = JSON.parse(event.data);
          currentTime = Math.floor(parsed.data?.currentTime || parsed.data?.seconds || parsed.currentTime || 0);
        } else if (typeof event.data === "object" && event.data !== null) {
          currentTime = Math.floor(event.data.currentTime || event.data.seconds || event.data.time || 0);
        }

        if (currentTime > 3) {
          setLectureTimestamps((prev) => {
            const updated = { ...prev, [currentLecture.id]: currentTime };
            localStorage.setItem("workfree_lecture_progress", JSON.stringify(updated));
            return updated;
          });
        }
      } catch (e) {
        // ignore non-json messages
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [currentLecture.id]);

  const formatSeconds = (sec: number): string => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}분 ${s}초`;
  };

  const handleResetProgress = (lectureId: number) => {
    setLectureTimestamps((prev) => {
      const updated = { ...prev, [lectureId]: 0 };
      localStorage.setItem("workfree_lecture_progress", JSON.stringify(updated));
      return updated;
    });
  };

  const parseDurationSeconds = (durationStr: string): number => {
    const parts = durationStr.split(":").map(Number);
    if (parts.length === 2) {
      return parts[0] * 60 + parts[1];
    }
    return 500;
  };

  const getLectureProgressPercent = (lec: Lecture): number => {
    const savedTime = lectureTimestamps[lec.id] || 0;
    const totalSec = parseDurationSeconds(lec.duration);
    if (savedTime <= 3) return 0;
    const pct = Math.round((savedTime / totalSec) * 100);
    return Math.min(100, Math.max(1, pct));
  };

  const trackGAEvent = (action: string, category: string, label?: string) => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", action, {
        event_category: category,
        event_label: label,
      });
    }
  };

  const handlePortonePayment = async (provider = selectedPayMethod) => {
    const isMobile = typeof navigator !== "undefined" && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    try {
      setIsLoadingAuth(true);
      const paymentId = `workfree-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      const payParams: any = {
        storeId: process.env.NEXT_PUBLIC_PORTONE_STORE_ID || "store-f7c52ad9-3899-4b5b-87b4-cc5cdcdbb5d4",
        paymentId: paymentId,
        orderName: "WorkFree Market LV.01 10강 마스터클래스 수강권",
        totalAmount: 5000,
        currency: "CURRENCY_KRW",
        redirectUrl: typeof window !== "undefined" ? window.location.href : undefined,
      };

      if (provider === "kakaopay") {
        payParams.payMethod = "EASY_PAY";
        payParams.easyPay = { easyPayProvider: "EASY_PAY_PROVIDER_KAKAOPAY" };
      } else if (provider === "tosspay") {
        payParams.payMethod = "EASY_PAY";
        payParams.easyPay = { easyPayProvider: "EASY_PAY_PROVIDER_TOSSPAY" };
      } else if (provider === "naverpay") {
        payParams.payMethod = "EASY_PAY";
        payParams.easyPay = { easyPayProvider: "EASY_PAY_PROVIDER_NAVERPAY" };
      } else if (provider === "card") {
        payParams.payMethod = "CARD";
      }

      if (process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY) {
        payParams.channelKey = process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY;
      }

      const response = await PortOne.requestPayment(payParams);

      if (response && !response.code) {
        setIsAuthenticated(true);
        setShowLicenseModal(false);
        setShowKeyInfo(true);
        localStorage.setItem("workfree_license_auth", "true");
        localStorage.setItem("workfree_paid_auth", "true");
        alert("🎉 5,000원 결제가 성공적으로 완료되었습니다! 10강 전체 수강이 자동으로 승인되었습니다.");
        trackGAEvent("portone_payment_success", "conversion", "5000_krw");
      } else if (response && response.code) {
        if (response.message && !response.message.includes("취소")) {
          alert(`결제 안내: ${response.message}`);
        }
      }
    } catch (err: any) {
      console.error("PortOne payment error:", err);
      if (isMobile && provider === "kakaopay") {
        window.open("https://qr.kakaopay.com/FVGQc7DUq", "_blank");
      }
      setShowLicenseModal(true);
      setShowKeyInfo(true);
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const handleVerifyLicense = () => {
    if (licenseInput.trim() === VALID_LICENSE_KEY) {
      setIsAuthenticated(true);
      setShowLicenseModal(false);
      setLicenseError("");
      trackGAEvent("license_auth_success", "engagement", "workfree_key");
    } else {
      setLicenseError("올바르지 않은 수강 비번입니다. 강사에게 전달받은 수강 라이선스 키를 확인해 주세요.");
    }
  };

  const handleLogoutLicense = () => {
    if (confirm("수강 잠금 상태로 전환하시겠습니까? 다시 입장하려면 수강 비번을 입력해야 합니다.")) {
      setIsAuthenticated(false);
      localStorage.removeItem("workfree_license_auth");
    }
  };

  // Sync playback speed to video element
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed, currentLecture]);

  const toggleComplete = (id: number) => {
    const updated = completedLectures.includes(id)
      ? completedLectures.filter((item) => item !== id)
      : [...completedLectures, id];
    setCompletedLectures(updated);
    localStorage.setItem("workfree_completed", JSON.stringify(updated));

    if (updated.length === LECTURES.length) {
      setShowCertificateModal(true);
    }
  };

  const handlePrevLecture = () => {
    const currentIndex = LECTURES.findIndex((lec) => lec.id === currentLecture.id);
    if (currentIndex > 0) {
      setCurrentLecture(LECTURES[currentIndex - 1]);
    }
  };

  const handleNextLecture = () => {
    const currentIndex = LECTURES.findIndex((lec) => lec.id === currentLecture.id);
    if (currentIndex < LECTURES.length - 1) {
      setCurrentLecture(LECTURES[currentIndex + 1]);
    }
  };

  const handleSaveDriveLink = (lectureId: number, url: string) => {
    const updated = { ...driveLinks, [lectureId]: url };
    setDriveLinks(updated);
    localStorage.setItem("workfree_drive_links", JSON.stringify(updated));
  };

  const extractDriveId = (inputUrl: string): string | null => {
    if (!inputUrl) return null;
    const cleanUrl = inputUrl.trim();
    const match = cleanUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || 
                  cleanUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/) ||
                  cleanUrl.match(/^([a-zA-Z0-9_-]{25,50})$/);
    return match ? match[1] : null;
  };

  const currentDriveUrl = driveLinks[currentLecture.id] || currentLecture.driveUrl || "";
  const currentDriveId = extractDriveId(currentDriveUrl);

  const progressPercent = Math.round((completedLectures.length / LECTURES.length) * 100);

  const filteredLectures = LECTURES.filter(
    (lec) =>
      lec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lec.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Header Navbar (Logo Only - Click to Home) */}
      <header className="sticky top-0 z-[60] px-4 sm:px-6 py-3 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-xl">
        <div className="flex items-center justify-between max-w-7xl mx-auto w-full">
          {/* Logo & Main Title (Click goes to Home) */}
          <div
            className="flex items-center space-x-3 cursor-pointer group hover:opacity-90 transition-all"
            onClick={() => setViewMode("landing")}
            title="WorkFree Market 메인 홈으로 이동"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center font-extrabold text-white shadow-lg shadow-cyan-500/20 text-sm tracking-tighter group-hover:scale-105 transition-transform">
              WF
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-extrabold text-base tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  WorkFree Market
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  ai딸깍샘 클래스
                </span>
              </div>
              <p className="text-[11px] text-cyan-400 font-medium tracking-wide">
                클릭 1번 엑셀 자동화: 8시간 업무를 1시간으로!
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* ====================================================================== */}
      {/* 1. LANDING HOMEPAGE VIEW (Nomad Coders 1:1 Matched Layout) */}
      {/* ====================================================================== */}
      {viewMode === "landing" && (
        <div className="flex-1 space-y-0 pb-20 bg-slate-950">
          <section className="relative pt-12 sm:pt-16 pb-10 sm:pb-12 px-4 sm:px-6 flex flex-col items-center justify-center text-center max-w-4xl mx-auto space-y-5 sm:space-y-6">
            {/* Badge Pill */}
            <div className="inline-flex items-center space-x-2 px-3 sm:px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[11px] sm:text-xs font-bold shadow-md shadow-cyan-500/10 backdrop-blur-md break-keep">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shrink-0"></span>
              <span>⚡ 비개발자 실무자를 위한 최적의 업무 자동화 파이프라인</span>
            </div>

            {/* Main Title - Mobile Optimized & break-keep */}
            <h1
              className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-snug sm:leading-snug break-keep"
              style={{ textShadow: "rgba(0, 0, 0, 0.3) 1px 1px 4px" }}
            >
              10시간 걸리던 &apos;노가다&apos; 업무,
              <br />
              <span className="text-cyan-400">1시간으로</span> 줄여드립니다.
            </h1>

            {/* Subtitle - Mobile Optimized & break-keep */}
            <p className="text-xs sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed font-normal break-keep">
              단순 코딩 교육이 아닙니다. 엑셀 VBA부터 Power Automate, 그리고 AI 결합까지.
              <br className="hidden sm:inline" />
              당신이 자리를 비워도 스스로 돌아가는 &apos;업무 에이전트&apos;를 구축하는 여정입니다.
            </p>

            {/* Hero Action Buttons - Full width on mobile */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2 w-full sm:w-auto">
              <a
                href="#roadmap"
                className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs sm:text-base shadow-xl shadow-cyan-500/25 transition-all text-center cursor-pointer active:scale-95 whitespace-nowrap"
              >
                🚀 로드맵 확인하기 ➔
              </a>
              <a
                href="#calculator"
                className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-400 text-white font-bold text-xs sm:text-base shadow-xl transition-all text-center cursor-pointer active:scale-95 whitespace-nowrap"
              >
                ⏱️ 내 업무 시간 절감 계산 ➔
              </a>
              <button
                onClick={() => handlePortonePayment(selectedPayMethod)}
                className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-slate-950 font-black text-xs sm:text-base shadow-xl transition-all text-center cursor-pointer active:scale-95 whitespace-nowrap"
              >
                ⚡ 얼리버드 90% 특가 신청 (5,000원) ↗
              </button>
            </div>
          </section>

          {/* WHY EXISTING IT EDUS FAIL vs WORKFREE MASTERCLASS (Vision Section - Mobile Optimized) */}
          <section className="py-12 sm:py-16 bg-slate-900/80 border-b border-slate-800">
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 items-center">
                <div className="space-y-5 sm:space-y-6">
                  <span className="px-3.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono font-bold border border-cyan-500/30">
                    WHY WORKFREE MASTERCLASS
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white leading-snug break-keep">
                    왜 기존 IT 교육은<br />체감이 되지 않을까요?
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed break-keep">
                    대부분의 교육은 문법 위주의 학습에 치중합니다. 하지만 실무자에게 필요한 것은 &apos;내일 당장 엑셀 파일을 만지는 시간을 줄여주는 도구&apos;입니다.
                  </p>

                  <div className="space-y-3 pt-1 sm:pt-2">
                    <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-950/80 border border-rose-500/30 flex items-start space-x-3">
                      <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-[10px] sm:text-xs shrink-0 mt-0.5">✕</span>
                      <div className="break-keep">
                        <div className="text-xs font-bold text-rose-300">기존 IT 교육</div>
                        <div className="text-[11px] sm:text-xs text-slate-400 mt-0.5">실무와 동떨어진 문법 공부, 직접 내 업무에 적용하기 막막함</div>
                      </div>
                    </div>

                    <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/30 flex items-start space-x-3">
                      <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px] sm:text-xs shrink-0 mt-0.5">✓</span>
                      <div className="break-keep">
                        <div className="text-xs font-bold text-emerald-300">WorkFree 마스터클래스</div>
                        <div className="text-[11px] sm:text-xs text-slate-400 mt-0.5">자주 쓰는 10개 실전 코드로 즉각 도입 &amp; 나만의 리본 메뉴 파이프라인 구축</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 border border-slate-800 space-y-4 text-center">
                  <h3 className="font-bold text-white text-sm sm:text-base break-keep">자동화 단계별 업무 소요 시간 비교</h3>
                  <div className="space-y-2.5 sm:space-y-3 pt-1 text-xs">
                    <div className="p-3 sm:p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center break-keep">
                      <span className="text-slate-400 text-[11px] sm:text-xs">현재 (수동 노가다 작업)</span>
                      <span className="font-mono font-bold text-rose-400 text-xs sm:text-sm whitespace-nowrap">600분 (10시간)</span>
                    </div>
                    <div className="p-3 sm:p-3.5 rounded-xl bg-slate-900 border border-cyan-500/40 flex justify-between items-center break-keep">
                      <span className="text-cyan-300 font-bold text-[11px] sm:text-xs">LV.01 리본 매크로 적용</span>
                      <span className="font-mono font-bold text-cyan-400 text-xs sm:text-sm whitespace-nowrap">60분 (1시간)</span>
                    </div>
                    <div className="p-3 sm:p-3.5 rounded-xl bg-slate-900 border border-emerald-500/40 flex justify-between items-center break-keep">
                      <span className="text-emerald-300 font-bold text-[11px] sm:text-xs">LV.02/03 No-Touch 파이프라인</span>
                      <span className="font-mono font-bold text-emerald-400 text-xs sm:text-sm whitespace-nowrap">5분 (자동 구동)</span>
                    </div>
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 pt-1">※ 일일 10시간 반복 업무 기준 감축 시뮬레이션</p>
                </div>
              </div>
            </div>
          </section>

          {/* NOMAD FEATURED COURSES SECTION (Mobile Optimized) */}
          <section className="bg-slate-900/90 py-12 sm:py-16 border-y border-slate-800">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
              <div className="text-center space-y-1.5 sm:space-y-2 break-keep">
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Featured Class</h2>
                <h5 className="text-xs sm:text-sm text-slate-400">최신 업데이트된 신상 실무 자동화 마스터클래스</h5>
              </div>

              {/* Nomad Course Spotlight Card - Proportional Grid (5:7 ratio) */}
              <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center bg-slate-950/60 p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-800/80 shadow-2xl">
                {/* Course Image Frame with Neon Animated Border (5 cols) */}
                <div className="lg:col-span-5 relative group cursor-pointer" onClick={() => setViewMode("classroom")}>
                  <span className="absolute top-3 left-3 z-30 inline-block rounded-full bg-yellow-400/20 text-yellow-300 border border-yellow-500/40 px-3 py-0.5 text-[10px] sm:text-xs font-bold shadow">
                    초급
                  </span>

                  <div className="relative w-full rounded-2xl p-1 bg-gradient-to-r from-yellow-400 via-cyan-400 to-indigo-500 shadow-2xl transition-transform duration-300 group-hover:scale-[1.02]">
                    <div className="aspect-video w-full rounded-xl bg-slate-950 flex flex-col items-center justify-center p-4 text-center space-y-2 overflow-hidden">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300 text-xl sm:text-2xl font-bold">
                        ⚡
                      </div>
                      <div className="font-mono text-cyan-400 text-[10px] sm:text-[11px] font-bold tracking-wider">
                        WORKFREE MASTERCLASS
                      </div>
                    </div>
                  </div>

                  {/* Overlapping Info Card */}
                  <div className="relative -top-7 sm:-top-8 z-30 mx-auto w-11/12 rounded-xl bg-slate-800/95 border border-slate-700 p-3 text-center shadow-xl backdrop-blur-md space-y-0.5 break-keep">
                    <h3 className="text-sm sm:text-base font-bold text-white">Maker 마스터클래스</h3>
                    <h4 className="text-[10px] sm:text-[11px] text-slate-300">이제는 1인 업무 자동화의 시대입니다</h4>
                  </div>
                </div>

                {/* Course Details & Checklist (7 cols) */}
                <div className="lg:col-span-7 space-y-4 sm:space-y-5 text-slate-300 pl-0 lg:pl-2">
                  <div>
                    <h3 className="text-xl sm:text-3xl font-extrabold text-white mb-2.5 sm:mb-3 break-keep">WorkFree LV.01 마스터클래스</h3>

                    {/* Stacked Tech Icons */}
                    <div className="flex space-x-2 mb-3 sm:mb-4">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-slate-700 bg-slate-800 flex items-center justify-center text-[10px] sm:text-xs font-bold text-cyan-400 shadow">
                        XL
                      </div>
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-slate-700 bg-slate-800 flex items-center justify-center text-[10px] sm:text-xs font-bold text-blue-400 shadow">
                        VBA
                      </div>
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-slate-700 bg-slate-800 flex items-center justify-center text-[10px] sm:text-xs font-bold text-emerald-400 shadow">
                        AI
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs sm:text-sm break-keep">
                    <div className="flex items-center space-x-2">
                      <span className="text-cyan-400 font-bold text-sm sm:text-base shrink-0">✓</span>
                      <span>10개의 실전 커리큘럼 동영상 강의</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-cyan-400 font-bold text-sm sm:text-base shrink-0">✓</span>
                      <span>강의 총 분량 100분 완강 코스</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-cyan-400 font-bold text-sm sm:text-base shrink-0">✓</span>
                      <span>현시점 최신 AI(ChatGPT/Copilot)와 VBA로 나만의 리본 메뉴 만들기</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-cyan-400 font-bold text-sm sm:text-base shrink-0">✓</span>
                      <span>하루 8시간 노가다 데이터 가공 ➔ 1시간 클릭 자동화 완료</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => setViewMode("classroom")}
                      className="w-full sm:w-auto inline-flex items-center justify-center rounded-md bg-blue-600 hover:bg-blue-500 px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-lg transition-colors cursor-pointer active:scale-95 text-center whitespace-nowrap"
                    >
                      <span>자세히 보기 ➔</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* NOMAD ROADMAP TRACK CARDS SECTION (3-LEVEL MASTER ROADMAP - MOBILE UX OPTIMIZED) */}
          <section id="roadmap" className="py-12 sm:py-20 bg-slate-900/60 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
              <div className="text-center space-y-2 break-keep">
                <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono font-bold border border-cyan-500/30">
                  AUTOMATION LEARNING TRACKS
                </span>
                <h2 className="text-2xl sm:text-3xl font-medium text-white">WorkFree 학습 로드맵</h2>
                <h5 className="text-xs sm:text-lg text-slate-400 max-w-2xl mx-auto">
                  개발자가 아니어도 100% 체감하는 사무 자동화 파이프라인 3단계
                </h5>
              </div>

              {/* 3 Colored Course Track Cards Row - Mobile Responsive Heights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Level 1: Excel AI & Ribbon (ONLINE NOW) */}
                <div
                  className="relative overflow-hidden rounded-2xl p-5 sm:p-7 min-h-[380px] sm:h-[420px] shadow-xl flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1.5 border border-yellow-500/30"
                  style={{ backgroundColor: "rgb(252, 180, 61)" }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-slate-950/80 text-yellow-300 font-mono text-[10px] sm:text-xs font-extrabold border border-yellow-400/40 whitespace-nowrap">
                      LV.01 · 즉시 수강 가능 (100분 완강)
                    </span>
                    <div className="flex space-x-1 shrink-0">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-white bg-white text-slate-950 flex items-center justify-center text-[10px] sm:text-xs font-bold shadow">
                        XL
                      </div>
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-white bg-white text-slate-950 flex items-center justify-center text-[10px] sm:text-xs font-bold shadow">
                        VBA
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-slate-950 my-auto py-3 break-keep">
                    <h4 className="text-xl sm:text-2xl font-black">LV.01 엑셀 AI &amp; 리본 메뉴</h4>
                    <p className="text-[11px] sm:text-xs font-medium leading-relaxed">
                      <span>• 10개 실전 VBA 매크로 제작 (100분 완강)</span>
                      <br />
                      <span>• ERP 로우 데이터 가공 10시간 ➔ 1시간 감축</span>
                      <br />
                      <span>• AI(ChatGPT/Copilot)로 코드 생성 및 내 엑셀 리본 메뉴 아이콘 심기</span>
                      <br />
                      <span className="font-bold block mt-2 text-slate-900">#노가다탈출 #나만의리본메뉴 #1초클릭</span>
                    </p>
                  </div>

                  <div>
                    <button
                      onClick={() => setViewMode("classroom")}
                      className="w-full py-2.5 sm:py-3 rounded-xl bg-slate-950 hover:bg-slate-900 text-yellow-300 font-black text-[11px] sm:text-xs shadow-lg transition-all cursor-pointer active:scale-95 text-center break-keep"
                    >
                      🎓 1단계 100분 완강 클래스 들으러 가기 ➔
                    </button>
                  </div>
                </div>

                {/* Level 2: Power Automate No-Touch (LIVE CLASS INQUIRY) */}
                <div
                  className="relative overflow-hidden rounded-2xl p-5 sm:p-7 min-h-[380px] sm:h-[420px] shadow-xl flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1.5 border border-indigo-500/30"
                  style={{ backgroundColor: "rgb(115, 105, 243)" }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-slate-950/80 text-purple-300 font-mono text-[10px] sm:text-xs font-extrabold border border-purple-400/40 whitespace-nowrap">
                      LV.02 · 라이브 실강 신청
                    </span>
                    <div className="flex space-x-1 shrink-0">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-white bg-white text-slate-950 flex items-center justify-center text-[10px] sm:text-xs font-bold shadow">
                        PA
                      </div>
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-white bg-white text-slate-950 flex items-center justify-center text-[10px] sm:text-xs font-bold shadow">
                        FLOW
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-white my-auto py-3 break-keep">
                    <h4 className="text-xl sm:text-2xl font-black">LV.02 No-Touch 파이프라인</h4>
                    <p className="text-[11px] sm:text-xs font-medium leading-relaxed">
                      <span>• MS 365 무료 기본 앱 Power Automate 연동</span>
                      <br />
                      <span>• ERP 파일 자동 다운로드부터 LV.01 리본 매크로 자동 호출</span>
                      <br />
                      <span>• 개입 0% (Zero-Touch): 전처리 ➔ 메일/팀즈 자동 발송까지 트리거 연결</span>
                      <br />
                      <span className="font-bold block mt-2 text-purple-200">#ZeroTouch #파이프라인 #손안대는자동화</span>
                    </p>
                  </div>

                  <div>
                    <button
                      onClick={() => setShowInquiryModal(true)}
                      className="w-full py-2.5 sm:py-3 rounded-xl bg-slate-950/90 hover:bg-slate-900 text-purple-200 font-bold text-[11px] sm:text-xs shadow-lg transition-all cursor-pointer active:scale-95 text-center border border-purple-400/30 break-keep"
                    >
                      💬 라이브 실강 요청 문의 ↗
                    </button>
                  </div>
                </div>

                {/* Level 3: AI Agent & Hybrid Full Automation (1:1 TUTORING INQUIRY) */}
                <div
                  className="relative overflow-hidden rounded-2xl p-5 sm:p-7 min-h-[380px] sm:h-[420px] shadow-xl flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1.5 border border-cyan-500/30"
                  style={{ backgroundColor: "rgb(59, 191, 238)" }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-slate-950/80 text-cyan-300 font-mono text-[10px] sm:text-xs font-extrabold border border-cyan-400/40 whitespace-nowrap">
                      LV.03 · 1:1 맞춤 과외 문의
                    </span>
                    <div className="flex space-x-1 shrink-0">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-white bg-white text-slate-950 flex items-center justify-center text-[10px] sm:text-xs font-bold shadow">
                        AGY
                      </div>
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-white bg-white text-slate-950 flex items-center justify-center text-[10px] sm:text-xs font-bold shadow">
                        AI
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-slate-950 my-auto py-3 break-keep">
                    <h4 className="text-xl sm:text-2xl font-black">LV.03 AI 에이전트 하이브리드</h4>
                    <p className="text-[11px] sm:text-xs font-medium leading-relaxed">
                      <span>• Antigravity / Codex / Claude Co-work + PA + VBA 3종 결합</span>
                      <br />
                      <span>• 내가 없어도 24시간 스스로 굴러가는 자율형 업무 에이전트</span>
                      <br />
                      <span>• 3~4개 핵심 실무 예제 프로젝트 훈련으로 내 업무 완전 자동화</span>
                      <br />
                      <span className="font-bold block mt-2 text-slate-900">#AIAgent #엔드투엔드 #완전자율구동</span>
                    </p>
                  </div>

                  <div>
                    <button
                      onClick={() => setShowInquiryModal(true)}
                      className="w-full py-2.5 sm:py-3 rounded-xl bg-slate-950/90 hover:bg-slate-900 text-cyan-300 font-bold text-[11px] sm:text-xs shadow-lg transition-all cursor-pointer active:scale-95 text-center border border-cyan-400/30 break-keep"
                    >
                      🚀 1:1 과외 문의 ↗
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>



          {/* INTERACTIVE WORK SAVINGS CALCULATOR SECTION */}
          <section id="calculator" className="py-20 bg-slate-900 border-t border-slate-800">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
              <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-cyan-500/30 shadow-2xl space-y-8">
                <div className="text-center space-y-2">
                  <span className="px-3.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono font-bold border border-cyan-500/30">
                    AUTOMATION TIME SAVINGS CALCULATOR
                  </span>
                  <h2 className="text-3xl font-bold text-white">내 업무 시간 절감 계산기</h2>
                  <p className="text-xs sm:text-sm text-slate-400">
                    지금 매일 반복하고 계신 엑셀 노가다 업무, WorkFree 자동화 시스템을 적용하면 일년에 얼마나 아낄 수 있을까요?
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-bold text-slate-300">일일 반복 업무 시간</label>
                        <span className="text-sm font-black text-cyan-400 font-mono">{calcDailyHours}시간</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="8"
                        value={calcDailyHours}
                        onChange={(e) => setCalcDailyHours(Number(e.target.value))}
                        className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                      />
                      <div className="flex justify-between text-[10px] text-slate-500 mt-1.5 font-mono">
                        <span>1시간</span>
                        <span>4시간</span>
                        <span>8시간</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-2">주당 반복 횟수</label>
                      <div className="flex space-x-2">
                        {[1, 3, 5].map((freq) => (
                          <button
                            key={freq}
                            onClick={() => setCalcFrequency(freq)}
                            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              calcFrequency === freq
                                ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20 font-black"
                                : "bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700"
                            }`}
                          >
                            {freq === 5 ? "매일 (주 5회)" : `주 ${freq}회`}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-3 shadow-inner">
                    <p className="text-xs font-bold text-slate-400">예상 연간 절감 시간 (90% 감축)</p>
                    <div className="text-4xl sm:text-5xl font-black text-cyan-400 font-mono tracking-tight">
                      {Math.floor(calcDailyHours * calcFrequency * 52 * 0.9).toLocaleString()}{" "}
                      <span className="text-lg text-slate-300 font-sans">시간</span>
                    </div>
                    <p className="text-xs text-slate-300 font-semibold">
                      약{" "}
                      <span className="text-amber-400 font-extrabold text-sm">
                        {Math.floor((calcDailyHours * calcFrequency * 52 * 0.9) / 24)}일
                      </span>
                      의 자유 시간 확보! 🚀
                    </p>
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mt-3">
                      <div
                        className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(((calcDailyHours * calcFrequency * 52 * 0.9) / 1500) * 100, 100)}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* END-TO-END PIPELINE DIAGRAM SECTION */}
          <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
            <div className="text-center space-y-2">
              <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono font-bold border border-cyan-500/30">
                ZERO-TOUCH AUTOMATION FLOW
              </span>
              <h2 className="text-3xl font-bold text-white">완전 자동화 업무 파이프라인 시각화</h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
                ERP 다운로드부터 엑셀 가공, 메일 전송까지 나의 개입 없이 수직 실행되는 구조입니다.
              </p>
            </div>

            {/* Pipeline Step Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl items-center">
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-2">
                <div className="text-3xl">🏢</div>
                <div className="text-sm font-bold text-white">1. ERP / 웹 시스템</div>
                <div className="text-[11px] text-slate-400">데이터 자동 다운로드</div>
              </div>

              <div className="p-5 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 text-center space-y-2">
                <div className="text-3xl">⚙️</div>
                <div className="text-sm font-bold text-cyan-300">2. Power Automate</div>
                <div className="text-[11px] text-cyan-400 font-mono">이벤트 트리거 감지</div>
              </div>

              <div className="p-5 rounded-2xl bg-blue-950/40 border border-blue-500/40 text-center space-y-2">
                <div className="text-3xl">📊</div>
                <div className="text-sm font-bold text-blue-300">3. LV.01 VBA 매크로</div>
                <div className="text-[11px] text-blue-400">로우 데이터 자동 가공</div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-2">
                <div className="text-3xl">✉️</div>
                <div className="text-sm font-bold text-white">4. 이메일 / 팀즈</div>
                <div className="text-[11px] text-slate-400">결과 보고서 자동 발송</div>
              </div>
            </div>
          </section>
          <section id="schedule" className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6 scroll-mt-20">
            <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-slate-900 via-cyan-950/50 to-slate-900 border border-cyan-500/30 text-center space-y-4 shadow-2xl">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold border border-cyan-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>현강 진행 중</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                현강 진행 중 · 실강 참여 원할 시 문의
              </h2>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={handlePortonePayment}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-black text-sm shadow-xl shadow-yellow-500/20 transition-all flex items-center justify-center space-x-2 active:scale-95 cursor-pointer"
                >
                  <span>⚡ 얼리버드 90% 할인 특가 신청 ↗</span>
                </button>
                <a
                  href="https://jobs.kr.karrotmarket.com/shared/profiles/6a5888b11b54fcb878ff3b65"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-white font-extrabold text-sm shadow-xl shadow-orange-500/20 transition-all flex items-center justify-center space-x-2 active:scale-95 cursor-pointer"
                >
                  <span>🥕 당근마켓 실강 문의 ↗</span>
                </a>
                <button
                  onClick={() => setShowInquiryModal(true)}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-cyan-500/40 text-sm font-bold text-cyan-300 hover:text-cyan-200 transition-all flex items-center justify-center space-x-2 active:scale-95 cursor-pointer shadow-inner"
                >
                  <span>💬 1:1 고객 문의하기 (카톡 / 이메일) ↗</span>
                </button>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-cyan-500/30 text-xs text-cyan-300 max-w-lg mx-auto leading-relaxed font-semibold shadow-inner">
                💡 1단계는 본 온라인 10강 마스터클래스로 완강하시고, 2단계(LV.02)부터 실강(오프라인/라이브)에 참여하셔도 무방합니다.
              </div>
              <p className="text-xs text-slate-400 max-w-lg mx-auto leading-relaxed">
                오프라인 정모 및 실시간 라이브 클래스 참여 문의는 당근마켓 프로필이나 카카오톡 ID(ayoi1034)로 편하게 메시지 남겨주세요!
              </p>
            </div>
          </section>

          {/* 1:1 LESSON & OUTSOURCING (1:1 과외 & 외주 제작 서비스) */}
          <section className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
            <div className="text-center space-y-2">
              <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold border border-cyan-500/30">
                💎💎 수업 유형 및 외주 제작 안내
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">맞춤 과외 &amp; 자동화 대행 서비스</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="text-cyan-400 font-extrabold text-sm uppercase">교육반</div>
                <h3 className="font-bold text-lg text-white">2시간 집중 자동화 클래스</h3>
                <div className="text-base font-bold text-cyan-300">4만 원</div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  AI와 함께 나만의 매크로를 직접 제작해보는 기초 집중 교육
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 ring-1 ring-cyan-500/40">
                <div className="text-blue-400 font-extrabold text-sm uppercase">1:1 맞춤반</div>
                <h3 className="font-bold text-lg text-white">프로젝트형 1:1 과외</h3>
                <div className="text-base font-bold text-blue-300">별도 협의</div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  내 업무 데이터 세트를 가져와 1:1로 직접 자동화하는 맞춤형 프로젝트
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="text-emerald-400 font-extrabold text-sm uppercase">외주 제작</div>
                <h3 className="font-bold text-lg text-white">매크로 자동화 맞춤 제작</h3>
                <div className="text-base font-bold text-emerald-300">별도 협의</div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  당장 내일 급한 업무 자동화 매크로를 대신 개발해 드리는 대행 서비스
                </p>
              </div>
            </div>
          </section>

          {/* FOOTER & BUSINESS INFORMATION (전자상거래법 & PG 심사 100% 준수 사업자정보 표기) */}
          <footer className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 pb-16 text-xs text-slate-500 space-y-3 border-t border-slate-800/80">
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 font-semibold text-slate-300 text-sm">
              <span>상호명: 워크프리마켓 (WorkFree Market)</span>
              <span>•</span>
              <span>대표자: 윤아영</span>
              <span>•</span>
              <span>사업자등록번호: 310-46-01336</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-slate-400">
              <span>주소: 서울특별시 송파구 송파대로 567, 529동 509호(잠실동, 아파트)</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-slate-400">
              <span>고객센터 / 대표전화: 070-8080-2814</span>
              <span>•</span>
              <span>이메일: contact@workfreemarket.com</span>
              <span>•</span>
              <span>카카오톡 ID: ayoi1034</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-slate-400 text-[11px]">
              <span>개인정보관리책임자: 윤아영</span>
              <span>•</span>
              <span>호스팅서비스 제공자: Vercel Inc.</span>
              <span>•</span>
              <button
                onClick={() => setShowTermsModal(true)}
                className="text-slate-300 hover:text-white font-bold underline cursor-pointer"
              >
                이용약관
              </button>
              <span>•</span>
              <button
                onClick={() => setShowPrivacyModal(true)}
                className="text-cyan-400 hover:text-cyan-300 font-bold underline cursor-pointer"
              >
                개인정보처리방침
              </button>
            </div>
            <div className="pt-2 text-[11px] text-slate-600">
              Copyright © WorkFree (www.workfreemarket.com) All Rights Reserved. 본 사이트의 모든 동영상 강의 및 콘텐츠 무단 전재 및 재배포를 금합니다.
            </div>
          </footer>
        </div>
      )}

      {/* ====================================================================== */}
      {/* 2. CLASSROOM VIEW (10강 동영상 마스터클래스 온라인 수강실) */}
      {/* ====================================================================== */}
      {viewMode === "classroom" && (
        <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Left Column: Video Player & Lecture Details (8 cols) */}
          <section className="lg:col-span-8 p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6 overflow-y-auto lg:border-r border-slate-800/80">
            {/* Responsive 16:9 Video Player Container */}
            <div ref={playerContainerRef} className="relative w-full aspect-video rounded-xl sm:rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-2xl shadow-black/80 group">
              {!isAuthenticated ? (
                <div
                  onClick={() => setShowLicenseModal(true)}
                  className="w-full h-full flex flex-col items-center justify-center p-4 sm:p-6 text-center space-y-3 sm:space-y-4 bg-slate-950/95 backdrop-blur-md cursor-pointer group hover:bg-slate-950 transition-all border border-cyan-500/20 hover:border-cyan-500/50"
                >
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 border-2 border-cyan-400 flex items-center justify-center text-white text-xl sm:text-2xl shadow-xl shadow-cyan-500/30 group-hover:scale-110 transition-transform">
                    ▶
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm sm:text-base font-extrabold text-white">
                      🔑 수강생 라이선스 키 인증 후 동영상 재생하기
                    </p>
                    <p className="text-xs text-cyan-400 font-semibold">
                      클릭하여 비번 입력 및 수강 신청 안내 보기 ➔
                    </p>
                  </div>
                </div>
              ) : currentLecture.bunnyVideoId ? (
                <iframe
                  key={`bunny-${currentLecture.id}-${lectureTimestamps[currentLecture.id] || 0}`}
                  src={`https://iframe.mediadelivery.net/embed/714452/${currentLecture.bunnyVideoId}?autoplay=true&loop=false&muted=false&preload=true&responsive=true${(lectureTimestamps[currentLecture.id] || 0) > 3 ? `&t=${lectureTimestamps[currentLecture.id]}` : ""}`}
                  className="w-full h-full aspect-video border-0 bg-black"
                  allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen"
                  allowFullScreen
                ></iframe>
              ) : currentDriveId ? (
                <iframe
                  key={`drive-${currentDriveId}`}
                  src={`https://drive.google.com/file/d/${currentDriveId}/preview`}
                  className="w-full h-full aspect-video border-0 bg-black"
                  allow="autoplay; encrypted-media; fullscreen"
                  allowFullScreen
                ></iframe>
              ) : (
                <video
                  ref={videoRef}
                  key={currentLecture.id}
                  className="w-full h-full aspect-video object-contain bg-black"
                  controls
                  autoPlay
                  playsInline
                  preload="metadata"
                  src={`/lectures/${currentLecture.filename}`}
                >
                  <source src={`/lectures/${currentLecture.filename}`} type="video/mp4" />
                  브라우저가 동영상 재생을 지원하지 않습니다.
                </video>
              )}

              {/* Top Badge Overlay - Desktop / Tablet only */}
              <div className="hidden sm:flex absolute top-3 left-3 items-center space-x-2 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/60 text-xs font-semibold z-10">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-slate-200">
                  현재 재생 중: {currentLecture.title}
                </span>
              </div>
            </div>



            {/* Lecture Controls & Prev/Next Navigation */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                    강의 #{currentLecture.id}
                  </span>
                  <span className="text-[11px] sm:text-xs text-slate-400 font-medium">재생시간 {currentLecture.duration}</span>
                </div>
                <h2 className="text-base sm:text-xl font-bold text-white tracking-tight leading-snug">
                  {currentLecture.title}
                </h2>
              </div>

              <div className="flex flex-wrap items-center justify-between sm:justify-start gap-2.5 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800/80">
                {/* Prev / Next & Fullscreen Navigation Buttons */}
                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={handlePrevLecture}
                    disabled={currentLecture.id === 1}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold text-slate-200 transition-colors"
                  >
                    ◀ 이전
                  </button>
                  <button
                    onClick={handleNextLecture}
                    disabled={currentLecture.id === LECTURES.length}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold text-slate-200 transition-colors"
                  >
                    다음 ▶
                  </button>
                  {!currentDriveId && (
                    <button
                      onClick={handleToggleFullscreen}
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-cyan-400 border border-slate-700 transition-colors"
                      title="전체화면 / 크게보기"
                    >
                      🖥️ 전체화면
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Resume Playback Banner */}
            {(lectureTimestamps[currentLecture.id] || 0) > 3 && (
              <div className="p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-200 flex flex-col sm:flex-row items-center justify-between gap-2 shadow-lg">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shrink-0"></span>
                  <span>
                    ⏱️ <strong>이전 시청 위치 ({formatSeconds(lectureTimestamps[currentLecture.id] || 0)})</strong>에서 이어보기 중입니다.
                  </span>
                </div>
                <button
                  onClick={() => handleResetProgress(currentLecture.id)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-[11px] font-bold border border-slate-700 transition-all cursor-pointer shrink-0"
                >
                  🔄 처음부터 시청하기
                </button>
              </div>
            )}

            {/* Lecture Summary & Core Points Section */}
            <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                  📝 강의 요약 &amp; 학습 포인트
                </div>
              </div>

              <div className="space-y-4 text-sm leading-relaxed text-slate-300">
                <p className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/60 text-slate-300">
                  {currentLecture.summary}
                </p>
                <div>
                  <h4 className="font-bold text-xs text-cyan-400 uppercase tracking-wider mb-2">
                    주요 학습 체크포인트
                  </h4>
                  <ul className="space-y-2">
                    {currentLecture.keyPoints.map((point, idx) => (
                      <li key={idx} className="flex items-start space-x-2 text-xs">
                        <span className="text-cyan-500 font-bold mt-0.5">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Right Column: 10-Lecture Playlist Sidebar (4 cols) */}
          <section className="lg:col-span-4 p-3 sm:p-4 md:p-6 bg-slate-900/40 space-y-4 lg:overflow-y-auto lg:max-h-[calc(100vh-60px)] lg:sticky lg:top-[60px]">
            <div className="space-y-3 pb-3 border-b border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-white">테크트리 LV.01 10강 커리큘럼</h3>
                  <p className="text-[11px] sm:text-xs text-slate-400">총 10강 • 100분 완강 코스</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] sm:text-xs font-extrabold border border-cyan-500/30">
                  LV.01 수강 중
                </span>
              </div>

              {/* Search Bar for Curriculum */}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="🔍 강의 검색 (예: PDF, 인쇄, 매크로...)"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 transition-all"
              />
            </div>

            {/* Lecture List Accordion */}
            <div className="space-y-2.5">
              {filteredLectures.map((lec) => {
                const isCurrent = lec.id === currentLecture.id;
                const isDone = completedLectures.includes(lec.id);

                return (
                  <div
                    key={lec.id}
                    onClick={() => setCurrentLecture(lec)}
                    className={`p-3 sm:p-3.5 rounded-xl sm:rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between ${
                      isCurrent
                        ? "bg-gradient-to-r from-slate-900 to-slate-800/90 border-cyan-500/60 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/40"
                        : "bg-slate-900/60 hover:bg-slate-900 border-slate-800/80 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-start space-x-2.5 sm:space-x-3 overflow-hidden pr-2">
                      <div
                        className={`w-6 h-6 rounded-lg border flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5 ${
                          isCurrent
                            ? "bg-cyan-500/20 border-cyan-400 text-cyan-300"
                            : "bg-slate-950 border-slate-800 text-slate-400"
                        }`}
                      >
                        {lec.id < 10 ? `0${lec.id}` : lec.id}
                      </div>

                      <div className="overflow-hidden">
                        <div className="flex items-center space-x-1.5 mb-0.5">
                          <span
                            className={`text-[10px] sm:text-[11px] font-extrabold ${
                              isCurrent ? "text-cyan-400" : "text-slate-400"
                            }`}
                          >
                            {lec.id}강
                          </span>
                          {isCurrent && (
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                          )}
                        </div>
                        <h4
                          className={`text-xs font-bold leading-snug break-keep ${
                            isCurrent ? "text-white" : "text-slate-300"
                          }`}
                        >
                          {lec.title.replace(/^\d+강:\s*/, "")}
                        </h4>
                      </div>
                    </div>

                    <div className="flex flex-col items-end shrink-0 pl-2">
                      <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500">{lec.duration}</span>
                      {getLectureProgressPercent(lec) > 0 && (
                        <span
                          className={`text-[10px] font-mono font-extrabold px-1.5 py-0.5 rounded mt-1 border ${
                            getLectureProgressPercent(lec) >= 90
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                              : "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
                          }`}
                        >
                          {getLectureProgressPercent(lec) >= 90 ? "✓ 100%" : `${getLectureProgressPercent(lec)}%`}
                        </span>
                      )}
                      {isCurrent && getLectureProgressPercent(lec) === 0 && (
                        <span className="text-[9px] sm:text-[10px] font-bold text-cyan-400 tracking-wider uppercase mt-1">
                          재생 중
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </main>
      )}

      {/* ====================================================================== */}
      {/* 3. MODALS & OVERLAYS */}
      {/* ====================================================================== */}

      {/* Google Drive Video Links Management Modal */}
      {showDriveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white flex items-center space-x-2">
                <span>📁 구글 드라이브 동영상 연동 관리자</span>
              </h3>
              <button
                onClick={() => setShowDriveModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-500/20 text-xs text-cyan-200 space-y-1">
              <p className="font-bold">💡 구글 드라이브 공유 권한 설정 팁:</p>
              <p className="text-[11px] text-cyan-300/80">
                1. 구글 드라이브 영상 우클릭 ➔ <strong>[공유] ➔ [링크 공유]</strong>에서 권한을 <strong>&apos;링크가 있는 모든 사용자&apos;</strong>로 변경해 주세요.
                <br />
                2. 주소창의 공유 링크(<code className="text-white">https://drive.google.com/file/d/FILE_ID/view</code>)를 복사해서 아래 해당 강의란에 붙여넣으시면 자동 인식됩니다.
              </p>
            </div>

            {/* 10 Lectures Input List */}
            <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
              {LECTURES.map((lec) => {
                const currentVal = driveLinks[lec.id] || "";

                return (
                  <div key={lec.id} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-cyan-400">{lec.id}강: {lec.title}</span>
                      <span className="text-[10px] text-slate-500">기본 파일: {lec.filename}</span>
                    </div>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={currentVal}
                        onChange={(e) => handleSaveDriveLink(lec.id, e.target.value)}
                        placeholder="예: https://drive.google.com/file/d/12y8MivWwaKY5GVhJtcGvfjWqYtyWLoTF/view 또는 파일 ID"
                        className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/60 font-mono"
                      />
                      {currentVal && (
                        <button
                          onClick={() => handleSaveDriveLink(lec.id, "")}
                          className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs"
                        >
                          초기화
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-slate-800">
              <a
                href="https://drive.google.com/drive/folders/12y8MivWwaKY5GVhJtcGvfjWqYtyWLoTF"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-cyan-400 hover:underline font-semibold"
              >
                🔗 구글 드라이브 폴더 바로가기 ↗
              </a>
              <button
                onClick={() => setShowDriveModal(false)}
                className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-colors shadow-lg shadow-cyan-600/20 cursor-pointer"
              >
                설정 완료 및 창 닫기
              </button>
            </div>
          </div>
        </div>
      )}
      {/* 100% Completion Celebration Certificate Modal */}
      {showCertificateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl">
          <div className="w-full max-w-lg bg-slate-900 border border-emerald-500/40 rounded-3xl p-8 shadow-2xl shadow-emerald-500/20 text-center space-y-6">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-emerald-500/20 to-cyan-500/20 border border-emerald-500/40 flex items-center justify-center text-4xl shadow-xl shadow-emerald-500/20">
              🎉
            </div>
            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                10강 완강 축하합니다!
              </span>
              <h2 className="text-2xl font-black text-white">
                생성형 AI 엑셀 매크로 마스터 수료
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                축하합니다! 10개 강좌를 모두 수강하여 AI와 함께 엑셀 자동화 매크로를 작성하고 리본 메뉴를 구축할 수 있는 마스터 역량을 완성하셨습니다.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-cyan-300 space-y-1">
              <div>🎓 <strong>수강생 인증:</strong> WorkFree Market 마스터 클래스</div>
              <div>⚡ <strong>업무 효율:</strong> 주 40시간 ➔ 8시간 단축 완료</div>
            </div>
            <button
              onClick={() => setShowCertificateModal(false)}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/25 cursor-pointer"
            >
              확인 및 수강실로 돌아가기
            </button>
          </div>
        </div>
      )}

      {/* License Key & Portone Payment Authorization Modal */}
      {showLicenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="font-black text-lg text-white flex items-center space-x-2">
                <span>🔒 10강 마스터클래스 수강 신청 &amp; 수강생 인증</span>
              </h3>
              <button
                onClick={() => setShowLicenseModal(false)}
                className="text-slate-400 hover:text-white text-xl font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Option 1: Portone Online Direct Payment */}
            <div className="p-5 rounded-2xl bg-gradient-to-b from-amber-500/10 to-amber-500/5 border border-amber-500/30 space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  ⚡ 90% 얼리버드 특가
                </span>
                <span className="text-xs font-mono font-bold text-amber-400">정가 50,000원 ➔ 5,000원</span>
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-white">포트원(Portone) 전자결제 수강 신청</h4>
                <p className="text-xs text-slate-300 mt-1">
                  결제 완료 시 즉시 10강 전체 시청 권한이 자동 승인됩니다.
                </p>
              </div>

              {/* Payment Method Selector Tabs */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400">결제 수단 선택:</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedPayMethod("kakaopay")}
                    className={`py-2 px-3 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                      selectedPayMethod === "kakaopay"
                        ? "bg-yellow-400 text-slate-950 border-yellow-400 shadow-md shadow-yellow-400/20"
                        : "bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    🟡 카카오페이
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedPayMethod("tosspay")}
                    className={`py-2 px-3 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                      selectedPayMethod === "tosspay"
                        ? "bg-blue-500 text-white border-blue-500 shadow-md shadow-blue-500/20"
                        : "bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    🔵 토스페이
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedPayMethod("card")}
                    className={`py-2 px-3 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                      selectedPayMethod === "card"
                        ? "bg-cyan-500 text-slate-950 border-cyan-500 shadow-md shadow-cyan-500/20"
                        : "bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    💳 신용카드
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedPayMethod("naverpay")}
                    className={`py-2 px-3 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                      selectedPayMethod === "naverpay"
                        ? "bg-emerald-500 text-slate-950 border-emerald-500 shadow-md shadow-emerald-500/20"
                        : "bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    🟢 네이버페이
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handlePortonePayment(selectedPayMethod)}
                disabled={isLoadingAuth}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-yellow-500/20 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
              >
                {isLoadingAuth ? "결제 요청 처리 중..." : `💳 5,000원 결제하기 (${selectedPayMethod.toUpperCase()})`}
              </button>
            </div>

            {/* Divider */}
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-800"></div>
              <span className="flex-shrink mx-4 text-xs font-bold text-slate-500">또는 기존 수강생 키 입력</span>
              <div className="flex-grow border-t border-slate-800"></div>
            </div>

            {/* Option 2: Pre-issued License Key Input */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  🔑 수강생 라이선스 키 (비밀번호)
                </label>
                <div className="flex space-x-2">
                  <input
                    type="password"
                    value={licenseInput}
                    onChange={(e) => setLicenseInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleVerifyLicense();
                    }}
                    placeholder="수강생 승인 라이선스 키 입력"
                    className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyLicense}
                    className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold text-xs shadow-md shadow-cyan-500/20 cursor-pointer active:scale-95"
                  >
                    인증하기
                  </button>
                </div>
                {licenseError && (
                  <p className="text-xs text-rose-400 font-semibold mt-1.5">{licenseError}</p>
                )}
              </div>

              {showKeyInfo && (
                <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-[11px] text-cyan-300 leading-relaxed font-mono">
                  💡 수강생 인증 키 문의: 카카오톡 ID(ayoi1034) 또는 contact@workfreemarket.com
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setShowLicenseModal(false);
                  setShowInquiryModal(true);
                }}
                className="text-xs text-cyan-400 hover:underline font-semibold"
              >
                💬 1:1 고객 문의하기
              </button>
              <button
                type="button"
                onClick={() => setShowLicenseModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-all cursor-pointer"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Policy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="font-extrabold text-lg text-white flex items-center space-x-2">
                <span>⚖️ 워크프리마켓 개인정보처리방침</span>
              </h3>
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="text-slate-400 hover:text-white text-xl font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-4 text-xs text-slate-300 leading-relaxed pr-2 font-sans">
              <p><strong>워크프리마켓</strong>(이하 '회사'라 한다)는 개인정보보호법 제30조에 따라 정보주체(고객)의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리방침을 수립·공개합니다.</p>
              <div className="space-y-2">
                <h4 className="font-bold text-cyan-400 text-sm">제1조(개인정보의 수집 항목 및 수집 방법)</h4>
                <p>회사는 회원가입, 고객상담, 각종 서비스의 제공을 위해 아래와 같은 개인정보를 수집하고 있습니다.</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>필수 수집 항목:</strong> 이메일 주소, 이름, 휴대폰 번호(연락처), 결제 및 수강 인증 정보</li>
                  <li><strong>선택 수집 항목:</strong> 맞춤 서비스 문의 시 이용자가 직접 입력하는 텍스트 데이터 및 첨부 파일</li>
                  <li><strong>자동 수집 항목:</strong> 서비스 이용기록, 방문기록, IP 주소, 쿠키, 접속 지표</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-cyan-400 text-sm">제2조(개인정보의 처리 목적)</h4>
                <p>회사는 수집한 개인정보를 다음의 목적을 위해 처리합니다.</p>
                <ol className="list-decimal pl-5 space-y-1">
                  <li><strong>서비스 제공 및 수강 승인:</strong> 동영상 강의 마스터클래스 이용에 따른 본인 식별·인증, 수강 라이선스 승인, 요금 결제 및 정산</li>
                  <li><strong>고객 상담 및 고충 처리:</strong> 수강 신청 문의, 환불 및 기술 지원, 서비스 공지사항 전달</li>
                  <li><strong>신규 서비스 개발 및 마케팅:</strong> 신규 교육과정 안내, 맞춤형 서비스 제공 및 통계학적 분석</li>
                </ol>
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-cyan-400 text-sm">제3조(개인정보의 처리 및 보유 기간)</h4>
                <p>① 회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.</p>
                <p>② 관계 법령의 규정에 의하여 보존할 필요가 있는 경우 아래의 기간 동안 개인정보를 보존합니다.</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>계약 또는 청약철회, 대금결제, 재화 등의 공급기록: 5년 (전자상거래법)</li>
                  <li>소비자 불만 또는 분쟁처리에 관한 기록: 3년 (전자상거래법)</li>
                  <li>웹사이트 방문기록: 3개월 (통신비밀보호법)</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-cyan-400 text-sm">제4조(개인정보 처리업무의 위탁)</h4>
                <p>회사는 원활한 결제 서비스 제공 및 효과적인 업무 처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다.</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>수탁자(위탁받는 자):</strong> 포트원(Portone), ㈜카카오페이</li>
                  <li><strong>위탁하는 업무의 내용:</strong> 서비스 구매 및 이용에 따른 신용카드/카카오페이 전자결제 대행, 환불 처리, 결제 도용 방지</li>
                  <li><strong>위탁 기간:</strong> 회원 탈퇴 시 또는 위탁 계약 종료 시까지</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-cyan-400 text-sm">제5조(개인정보의 파기)</h4>
                <p>회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체 없이 전자적 기록을 복구 불가능한 방법으로 파기합니다.</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-cyan-400 text-sm">제6조(개인정보 보호책임자)</h4>
                <p>회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.</p>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <p>• <strong>성명 / 대표:</strong> 윤아영</p>
                  <p>• <strong>직책:</strong> 개인정보관리책임자</p>
                  <p>• <strong>연락처:</strong> 070-8080-2814</p>
                  <p>• <strong>이메일:</strong> contact@workfreemarket.com</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-cyan-400 text-sm">제7조(권익침해 구제방법)</h4>
                <p>정보주체는 아래의 기관에 대해 개인정보 침해에 대한 피해구제, 상담 등을 문의하실 수 있습니다.</p>
                <ul className="list-disc pl-5 space-y-1 text-slate-400">
                  <li>개인정보분쟁조정위원회: 1833-6972 (www.kopico.go.kr)</li>
                  <li>개인정보침해신고센터: 118 (privacy.kisa.or.kr)</li>
                  <li>대검찰청: 1301 (www.spo.go.kr)</li>
                  <li>경찰청: 182 (ecrm.cyber.go.kr)</li>
                </ul>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800">
                <h4 className="font-bold text-cyan-400 text-sm">제8조(개인정보 처리방침 변경)</h4>
                <p>이 개인정보 처리방침은 <strong>2026년 7월 27일</strong>부터 적용됩니다.</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all cursor-pointer"
              >
                확인 및 닫기
              </button>
            </div>
          </div>
        </div>
      )}
      {/* 1:1 Inquiry Choice Modal */}
      {showInquiryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-base sm:text-lg text-white flex items-center space-x-2">
                <span>💬 워크프리마켓 1:1 고객 문의</span>
              </h3>
              <button
                onClick={() => setShowInquiryModal(false)}
                className="text-slate-400 hover:text-white text-xl font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              원하시는 문의 방식을 선택해 주세요. 24시간 내 친절하고 상세하게 답변해 드립니다!
            </p>

            <div className="space-y-3 pt-1">
              {/* Option 1: KakaoTalk Inquiry */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-amber-300 font-extrabold text-xs sm:text-sm">
                    <span>🟡 카카오톡 1:1 실시간 문의</span>
                  </div>
                  <span className="text-[10px] text-amber-400/80 font-mono">ID: ayoi1034</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">
                  카카오톡 ID 검색창에서 <strong>ayoi1034</strong> 를 검색해 1:1 채팅 문의를 남겨주세요.
                </p>
                <div className="flex space-x-2 pt-1">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText("ayoi1034");
                      alert("📋 카카오톡 ID (ayoi1034)가 복사되었습니다! 카카오톡 친구추가에서 검색해 주세요.");
                      trackGAEvent("copy_kakaotalk_id", "engagement", "inquiry_modal");
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs cursor-pointer active:scale-95 transition-all text-center"
                  >
                    📋 카톡 ID 복사 (ayoi1034)
                  </button>
                </div>
              </div>

              {/* Option 2: Email Inquiry */}
              <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-cyan-300 font-extrabold text-xs sm:text-sm">
                    <span>✉️ 공식 이메일 문의</span>
                  </div>
                  <span className="text-[10px] text-cyan-400/80 font-mono">24h 접수</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug font-mono">
                  contact@workfreemarket.com
                </p>
                <div className="flex space-x-2 pt-1">
                  <a
                    href="mailto:contact@workfreemarket.com"
                    className="flex-1 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs cursor-pointer active:scale-95 transition-all text-center block"
                  >
                    ✉️ 이메일 보낼 프로그램 열기 ↗
                  </a>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText("contact@workfreemarket.com");
                      alert("📋 이메일 주소 (contact@workfreemarket.com)가 복사되었습니다!");
                      trackGAEvent("copy_email", "engagement", "inquiry_modal");
                    }}
                    className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs cursor-pointer active:scale-95 transition-all"
                  >
                    📋 복사
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowInquiryModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-all cursor-pointer"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Terms of Service Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="font-extrabold text-lg text-white flex items-center space-x-2">
                <span>📄 워크프리마켓 서비스 이용약관</span>
              </h3>
              <button
                onClick={() => setShowTermsModal(false)}
                className="text-slate-400 hover:text-white text-xl font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 text-xs text-slate-300 leading-relaxed pr-2 font-sans">
              <p>
                <strong>워크프리마켓</strong>(대표자 윤아영, 이하 &apos;회사&apos;라 함)이 운영하는 온라인 지식 교육 플랫폼(www.workfreemarket.com, 이하 &apos;사이트&apos;라 함)을 이용함에 있어 회사와 이용자의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.
              </p>

              <div className="space-y-2">
                <h4 className="font-bold text-cyan-400 text-sm">제1조 (목적 및 정의)</h4>
                <p>본 약관은 회사가 제공하는 엑셀 자동화 온라인 10강 마스터클래스 동영상 콘텐츠, 수강 라이선스 승인, 1:1 맞춤 교육 및 외주 대행 서비스(이하 &apos;서비스&apos;라 함)의 이용에 관한 사항을 다룹니다.</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>&apos;이용자&apos;:</strong> 사이트에 접속하여 본 약관에 따라 회사가 제공하는 서비스를 이용하는 자</li>
                  <li><strong>&apos;수강 라이선스 키&apos;:</strong> 온라인 동영상 강의 시청 권한을 부여하는 고유 인증 코드</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-cyan-400 text-sm">제2조 (약관의 효력 및 변경)</h4>
                <p>① 본 약관은 사이트 화면에 게시함으로써 효력이 발생합니다.</p>
                <p>② 회사는 전자상거래 등에서의 소비자보호에 관한 법률, 약관의 규제에 관한 법률 등 관련 법령을 위배하지 않는 범위에서 본 약관을 개정할 수 있습니다.</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-cyan-400 text-sm">제3조 (서비스의 제공 및 이용 승인)</h4>
                <p>① 회사는 수강생이 이용 요금(5,000원 얼리버드 특가 등)을 결제하거나 수강 승인을 마친 경우, 10강 동영상 마스터클래스 전 강좌 시청 권한을 즉시 승인합니다.</p>
                <p>② 시스템 점검, 서버 오류 등 불가피한 사유가 발생한 경우 서비스 제공이 일시 중단될 수 있으며, 회사는 이를 사전 또는 사후에 공지합니다.</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-cyan-400 text-sm">제4조 (결제 및 환불 규정)</h4>
                <p>① 서비스 결제는 포트원(Portone), ㈜카카오페이 등 회사가 제공하는 정식 전자결제 수단을 통해 이루어집니다.</p>
                <p>② <strong>청약철회 및 환불:</strong></p>
                <ul className="list-disc pl-5 space-y-1 text-slate-300">
                  <li><strong>동영상 강의를 전혀 시청하지 않은 경우:</strong> 결제일로부터 7일 이내 100% 전액 환불이 가능합니다.</li>
                  <li><strong>동영상 강의를 시청했거나 수강 승인이 완료된 경우:</strong> 전자상거래법 제17조 제2항에 따라 복제가 가능한 디지털 콘텐츠의 시청이 개시된 경우 환불이 제한될 수 있습니다.</li>
                </ul>
                <p>③ 환불 신청은 고객센터(070-8080-2814 또는 contact@workfreemarket.com)를 통해 접수 처리됩니다.</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-cyan-400 text-sm">제5조 (지식재산권의 보호)</h4>
                <p>① 회사가 작성한 본 사이트의 동영상 강의, 학습 자료, 매크로 코드, 디자인 및 상표에 대한 지식재산권은 회사에 귀속됩니다.</p>
                <p>② 이용자는 회사의 사전 승낙 없이 콘텐츠를 무단 캡처, 녹화, 복제, 유포, 재배포하거나 타인에게 수강 권한을 양도·판매할 수 없습니다. 이를 위반할 경우 관계 법령에 따라 민·형사상 책임을 질 수 있습니다.</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-cyan-400 text-sm">제6조 (개인정보 보호)</h4>
                <p>회사는 관련 법령이 정하는 바에 따라 이용자의 개인정보를 보호하기 위해 노력하며, 개인정보의 보호 및 사용에 대해서는 관련 법령 및 회사의 &apos;개인정보처리방침&apos;이 적용됩니다.</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-cyan-400 text-sm">제7조 (면책 조항 및 분쟁 해결)</h4>
                <p>① 회사는 천재지변, 인터넷 장애 등 불가항력적인 사유로 서비스를 제공할 수 없는 경우에는 책임이 면제됩니다.</p>
                <p>② 본 약관과 관련된 분쟁에 대해서는 대한민국 법률을 적용하며, 관할 법원은 회사의 본사 소재지 관할 법원으로 합니다.</p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800">
                <h4 className="font-bold text-cyan-400 text-sm">부칙</h4>
                <p>본 약관은 <strong>2026년 7월 27일</strong>부터 시행됩니다.</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowTermsModal(false)}
                className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all cursor-pointer"
              >
                확인 및 닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
