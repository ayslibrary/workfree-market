"use client";

import { useState, useEffect, useRef } from "react";

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

  // License Lock States (resets on page refresh)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [licenseInput, setLicenseInput] = useState<string>("");
  const [licenseError, setLicenseError] = useState<string>("");
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(false);
  const [showLicenseModal, setShowLicenseModal] = useState<boolean>(false);
  const [showKeyInfo, setShowKeyInfo] = useState<boolean>(false);

  const [isMobileCurriculumOpen, setIsMobileCurriculumOpen] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
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

  // Lecture Playback Progress Tracking (Resume Playback)
  const [lectureTimestamps, setLectureTimestamps] = useState<Record<number, number>>({});

  // Load completion state and progress from localStorage (License auth resets on refresh)
  useEffect(() => {
    localStorage.removeItem("workfree_license_auth");

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
      {/* Top Header Navbar (Persistent Everywhere) */}
      <header className="sticky top-0 z-[60] px-4 sm:px-6 py-3 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 max-w-7xl mx-auto w-full">
          {/* Logo & Main Title */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setViewMode("landing")}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center font-extrabold text-white shadow-lg shadow-cyan-500/20 text-sm tracking-tighter">
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

          {/* Navigation View Switcher & Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={() => setViewMode("landing")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === "landing"
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
              }`}
            >
              🏠 클래스 소개 (홈)
            </button>
            <button
              onClick={() => setViewMode("classroom")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                viewMode === "classroom"
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
              }`}
            >
              <span>🎓 10강 마스터클래스 (강의실)</span>
            </button>

            {viewMode === "landing" && (
              <>
                <a
                  href="#curriculum"
                  className="hidden md:inline-block px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-cyan-300 border border-cyan-500/30 transition-all"
                >
                  📚 커리큘럼
                </a>
                <a
                  href="#techtree"
                  className="hidden md:inline-block px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-cyan-300 border border-cyan-500/30 transition-all"
                >
                  🗺️ 테크트리
                </a>
              </>
            )}

            {/* License Status Badge */}
            {isAuthenticated ? (
              <button
                onClick={handleLogoutLicense}
                className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30 transition-all cursor-pointer"
                title="클릭 시 수강인증 잠금 상태로 전환"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="hidden sm:inline">🔑 수강인증 완료</span>
                <span className="sm:hidden">🔑 인증됨</span>
              </button>
            ) : (
              <button
                onClick={() => setShowLicenseModal(true)}
                className="inline-flex items-center px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs font-semibold border border-amber-500/30 transition-all cursor-pointer"
                title="클릭하여 수강생 라이선스 키 입력"
              >
                <span className="hidden sm:inline">🔒 수강 미인증 (키 입력)</span>
                <span className="sm:hidden">🔒 미인증</span>
              </button>
            )}

            {/* End Header Actions */}
          </div>
        </div>
      </header>

      {/* ====================================================================== */}
      {/* 1. LANDING HOMEPAGE VIEW (소개 & 수강 신청 안내 랜딩페이지) */}
      {/* ====================================================================== */}
      {viewMode === "landing" && (
        <div className="flex-1 space-y-16 pb-20">
          {/* HERO BANNER SECTION */}
          <section className="relative overflow-hidden pt-12 pb-16 px-4 sm:px-6 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border-b border-slate-800/80">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
              <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-extrabold shadow-lg shadow-amber-500/10">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                <span>🔥 [커피 한 잔 파격 특가] LV.01 온라인 10강 전체 시청권: 단 5,000원!</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight sm:leading-tight">
                [ai딸깍샘] 클릭 1번으로 끝내는 엑셀 자동화:
                <br />
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  8시간 업무를 단 1시간으로!
                </span>
              </h1>

              <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
                매일 반복되는 엑셀 복사·붙여넣기 야근은 이제 그만!
                <br />
                VBA 코딩 문법을 몰라도 OK. AI와 함께 내 업무에 딱 맞는 매크로를 만들어 리본 메뉴에 심고 버튼 한 번으로 칼퇴하세요.
              </p>

              {/* Hero Call To Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                <button
                  onClick={() => setViewMode("classroom")}
                  className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-cyan-500/25 transition-all duration-200 cursor-pointer active:scale-95 flex items-center justify-center space-x-2"
                >
                  <span>🚀 LV.01 10강 강의 바로 보기</span>
                  <span className="text-cyan-200 font-bold">➔</span>
                </button>
                <a
                  href="https://qr.kakaopay.com/FVGQc7DUq"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => trackGAEvent("click_kakaopay_transfer", "conversion", "hero_button")}
                  className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-black text-sm sm:text-base shadow-xl shadow-yellow-500/20 transition-all text-center flex items-center justify-center space-x-2 cursor-pointer active:scale-95"
                >
                  <span>💳 5,000원 결제하기 (카카오페이 1초 송금) ↗</span>
                </a>
                <a
                  href="https://jobs.kr.karrotmarket.com/shared/profiles/6a5888b11b54fcb878ff3b65"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => trackGAEvent("click_karrot_inquiry", "conversion", "hero_button")}
                  className="w-full sm:w-auto px-5 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-amber-400 hover:text-amber-300 font-bold text-xs sm:text-sm border border-amber-500/30 transition-all text-center flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <span>🥕 당근마켓 문의 ↗</span>
                </a>
              </div>

              {/* Stats Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-10 max-w-3xl mx-auto">
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm text-center">
                  <div className="text-2xl font-black text-cyan-400">80% 감축</div>
                  <div className="text-xs text-slate-400 mt-1">주 40시간 ➔ 8시간 단축 노하우</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm text-center">
                  <div className="text-2xl font-black text-blue-400">총 9회 진행</div>
                  <div className="text-xs text-slate-400 mt-1">사내 4회 · 외부 5회 검증된 커리큘럼</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm text-center">
                  <div className="text-2xl font-black text-emerald-400">다음 날 즉시 적용</div>
                  <div className="text-xs text-slate-400 mt-1">비전공자도 따라하는 실습 중심</div>
                </div>
              </div>
            </div>
          </section>

          {/* RECOMMENDED FOR (강력 추천 대상) */}
          <section className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
            <div className="text-center space-y-2">
              <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold border border-cyan-500/30">
                ✨ TARGET AUDIENCE
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">이런 분께 강력 추천합니다!</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800/80 space-y-3 hover:border-cyan-500/40 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-xl font-bold">
                  💼
                </div>
                <h3 className="font-bold text-base text-white">매일 똑같은 엑셀 작업으로 야근하는 분</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  회계·재무, 인사, 총무, 영업관리, 구매·SCM, 경영지원 등 단순 반복 데이터 가공이 많은 모든 사무직
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800/80 space-y-3 hover:border-cyan-500/40 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 text-xl font-bold">
                  🤖
                </div>
                <h3 className="font-bold text-base text-white">VBA 매크로를 들어는 봤으나 시작하기 막막했던 분</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  코딩 문법 암기 없이, 생성형 AI(ChatGPT 등)를 내 개인 프로그래머처럼 부려먹는 기법 전수
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800/80 space-y-3 hover:border-cyan-500/40 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 text-xl font-bold">
                  ⏱️
                </div>
                <h3 className="font-bold text-base text-white">AI를 활용해 업무 시간을 획기적으로 줄이고 싶은 분</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  하루 8시간 잡고 있던 노가다 작업을 클릭 한 번으로 단 1시간 안에 깔끔히 마치는 자동화 루틴 구축
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800/80 space-y-3 hover:border-cyan-500/40 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xl font-bold">
                  🖱️
                </div>
                <h3 className="font-bold text-base text-white">복잡한 수식 대신 버튼 하나로 끝내고 싶은 분</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  엑셀 상단 '나만의 리본 메뉴'에 이모티콘 아이콘 버튼을 심어 누구든 누르기만 하면 실행되는 완성형 환경
                </p>
              </div>
            </div>
          </section>

          {/* TUTOR STORY & EXPERIENCE (수업 및 강사 소개) */}
          <section className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/90 border border-cyan-500/30 shadow-2xl space-y-8 relative overflow-hidden">
              <div className="space-y-4">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold border border-cyan-500/30">
                  <span>📘📘 강사 소개 &amp; 실무 노하우</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                  &quot;매일 엑셀 붙잡고 야근하시나요? 이제 클릭 1번으로 끝내세요.&quot;
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  전직 해외영업, 영업관리, SCM을 거쳐 현직 재무·회계 실무자인 저는 AI와 VBA를 활용해 주 40시간의 반복 업무를 8시간으로, 하루 8시간의 일을 단 1시간으로 단축하는 자동화 루틴을 구축했습니다.
                  <br /><br />
                  현재까지 <strong>9회의 강의(사내 4회, 외부 5회)</strong>를 통해 증명된 실무 노하우를 그대로 알려드립니다. 코딩 문법을 암기하는 강의가 아닙니다. AI와 함께 내 업무에 꼭 필요한 매크로를 만들고, &apos;나만의 리본 메뉴&apos;에 등록하여 클릭 한 번으로 끝내는 실무 환경을 만들어 드립니다. VBA를 몰라도 교육 다음 날부터 바로 실무 적용이 가능합니다.
                </p>
              </div>

              {/* History Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
                <div className="space-y-1">
                  <div className="text-sm font-bold text-cyan-400">🏆 사내 강의 4회 진행</div>
                  <div className="text-xs text-slate-400">실제 기업 실무 환경에 최적화된 AI 엑셀 자동화 교육</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-bold text-blue-400">🏆 외부 클래스 5회 진행</div>
                  <div className="text-xs text-slate-400">당근, 소모임 등을 통해 검증된 직장인 맞춤 자동화</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-bold text-emerald-400">⚡ 실무 성과 80% 개선</div>
                  <div className="text-xs text-slate-400">주 40시간 소요 업무 ➔ 8시간 단축</div>
                </div>
              </div>
            </div>
          </section>

          {/* 4-STEP CORE CURRICULUM OVERVIEW */}
          <section className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
            <div className="text-center space-y-2">
              <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold border border-cyan-500/30">
                📢📢 핵심 커리큘럼
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">4단계 실무 완벽 적용 로드맵</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="text-xs font-black text-cyan-400 uppercase tracking-wider">STEP 1</span>
                <h4 className="font-bold text-sm text-white">자동화 환경 세팅</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  클릭 1번을 위한 개발도구 설정, 보안 해제 및 AddIns 폴더 신뢰 경로 구축
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="text-xs font-black text-blue-400 uppercase tracking-wider">STEP 2</span>
                <h4 className="font-bold text-sm text-white">AI 매크로 만들기</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  자연어 업무 설명만으로 VBA 코드 자동 생성 및 오류 발생 시 AI 실시간 디버깅
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="text-xs font-black text-indigo-400 uppercase tracking-wider">STEP 3</span>
                <h4 className="font-bold text-sm text-white">나만의 리본 메뉴</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  엑셀 상단 전용 탭에 아이콘 버튼을 만들어 클릭 한 번으로 실행하는 자동화
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="text-xs font-black text-emerald-400 uppercase tracking-wider">STEP 4</span>
                <h4 className="font-bold text-sm text-white">실무 완벽 적용</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  PDF 일괄 변환, 조건 조회, 메일 발송 연동 등 내 실무에 직접 적용
                </p>
              </div>
            </div>

            {/* 10 Online Lectures Preview Banner */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-extrabold text-base text-white">🎬 온라인 10강 단기 마스터클래스 동영상 제공</h3>
                <p className="text-xs text-slate-400">환경 세팅부터 100개 PDF 생성, 인풋박스 조회, 메일 자동화까지 포함된 10강 세트</p>
              </div>
              <button
                onClick={() => setViewMode("classroom")}
                className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg transition-colors cursor-pointer shrink-0"
              >
                🎓 10강 수강실 입장하기 ➔
              </button>
            </div>
          </section>

          {/* DETAILED 10-LESSON CURRICULUM SECTION */}
          <section id="curriculum" className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8 scroll-mt-20">
            <div className="text-center space-y-3">
              <span className="px-3.5 py-1.5 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono font-bold border border-cyan-500/30 tracking-wider">
                10-LESSON DETAILED CURRICULUM
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                LV.01 온라인 10강 <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">상세 커리큘럼 &amp; 학습 포인트</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
                엑셀 환경 세팅부터 AI 매크로 작성, 리본 메뉴 심기, 100개 PDF 일괄 처리 및 인풋박스 데이터 조회까지 — 10개 강좌의 요약과 주요 체크포인트를 미리 확인하세요.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {LECTURES.map((lec) => (
                <div
                  key={lec.id}
                  className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/90 hover:border-cyan-500/50 transition-all space-y-3.5 flex flex-col justify-between group shadow-lg shadow-black/40 hover:shadow-cyan-500/10"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <span className="px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 text-xs font-bold border border-cyan-500/30 font-mono">
                          {lec.id < 10 ? `0${lec.id}강` : `${lec.id}강`}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-400">
                          ⏱️ {lec.duration}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setCurrentLecture(lec);
                          setViewMode("classroom");
                        }}
                        className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold text-[11px] sm:text-xs shadow-md shadow-cyan-500/20 transition-all cursor-pointer active:scale-95 flex items-center space-x-1.5 shrink-0"
                      >
                        <span>▶ 궁금하면 강의 바로 듣기</span>
                        <span className="text-cyan-200">➔</span>
                      </button>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-white leading-snug">
                      {lec.title}
                    </h3>

                    <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/60">
                      {lec.summary}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 space-y-2">
                    <div className="text-[11px] font-bold text-cyan-400 flex items-center space-x-1">
                      <span>📌 주요 학습 체크포인트</span>
                    </div>
                    <ul className="space-y-1.5 pl-0.5">
                      {lec.keyPoints.map((point, idx) => (
                        <li key={idx} className="flex items-start space-x-2 text-xs text-slate-300 leading-snug">
                          <span className="text-cyan-400 font-bold mt-0.5 shrink-0">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* OFFICE AUTOMATION TECH TREE (사무자동화 테크트리) SECTION */}
          <section id="techtree" className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8 scroll-mt-20">
            <div className="text-center space-y-3">
              <span className="px-3.5 py-1.5 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono font-bold border border-cyan-500/30 tracking-wider">
                OFFICE AUTOMATION ROADMAP
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                반복업무 제로를 향한 <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">사무자동화 테크트리</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
                VBA로 파일과 메일을 다루는 법부터, Power Automate로 사람 손을 완전히 떠나는 자동화까지 — 순서대로 밟아가는 5단계 실무 로드맵입니다.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs text-slate-400">
                <span className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-cyan-400"></span>
                  <span>VBA · 로컬 자동화 (LV.01~02)</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-blue-500"></span>
                  <span>Power Automate · 클라우드 자동화 (LV.03~04)</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-amber-400"></span>
                  <span>캡스톤 · 완전자동화 (LV.05)</span>
                </span>
              </div>
            </div>

            {/* Tech Tree Stage Cards List */}
            <div className="space-y-4 max-w-3xl mx-auto">
              {/* LV.01 (CURRENT ACTIVE CLASS) */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-cyan-950/30 to-slate-900 border-2 border-cyan-500/60 shadow-xl shadow-cyan-500/10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 px-4 py-1 rounded-bl-2xl bg-cyan-500 text-slate-950 font-black text-[10px] uppercase tracking-wider">
                  ▶ 현재 수강 중 (1단계)
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center font-mono font-black text-cyan-300 text-base shrink-0">
                    01
                  </div>
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-mono text-[10px] font-bold border border-cyan-500/30">
                        LV.01 · VBA 기초
                      </span>
                      <span className="text-xs font-bold text-emerald-400">온라인 10강 수강 가능</span>
                    </div>
                    <h3 className="text-lg font-bold text-white">반복작업 자동화 입문</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      AI로 VBA 코드를 만들고 고치는 법을 배웁니다. 엑셀 하나 안에서 반복되는 손작업을 없애는 첫 단계입니다.
                    </p>
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                      <div className="flex space-x-2">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-300">
                          Copilot 코드 생성
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-300">
                          에러 디버깅
                        </span>
                      </div>
                      <button
                        onClick={() => setViewMode("classroom")}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-extrabold text-xs shadow-md cursor-pointer hover:from-cyan-400 hover:to-blue-500 transition-all"
                      >
                        🎓 1단계 10강 마스터클래스 바로 수강 ➔
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* LEVEL 1 ONLINE / LEVEL 2 LIVE NOTICE BANNER */}
              <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-200 flex items-center space-x-3 shadow-lg my-2">
                <span className="text-base shrink-0">💡</span>
                <p className="leading-relaxed">
                  <strong className="text-cyan-400 font-bold">수강 관련 꿀팁:</strong> 1단계(LV.01)는 본 페이지의 온라인 10강 마스터클래스로 자유롭게 완강하시고, <strong>2단계(LV.02)부터 실강(오프라인/라이브)에 바로 참여하셔도 무방합니다!</strong>
                </p>
              </div>

              {/* LV.02 */}
              <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors opacity-90">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center font-mono font-bold text-slate-400 text-base shrink-0">
                    02
                  </div>
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-mono text-[10px] font-bold border border-cyan-500/30">
                        LV.02 · VBA 중급
                      </span>
                      <span className="text-[11px] text-slate-500 font-semibold">🔒 차기 클래스 준비 중</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-200">파일 · 메일 파이프라인 자동화</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      데이터 추출부터 양식 작성, 파일명 규칙 저장, 메일 발송까지 — 하나의 업무를 처음부터 끝까지 VBA로 잇습니다.
                    </p>
                    <div className="flex space-x-2 pt-1">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
                        Outlook 연동
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
                        엔드투엔드 매크로
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* LV.03 */}
              <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors opacity-90">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-950/40 border border-blue-800/40 flex items-center justify-center font-mono font-bold text-blue-400 text-base shrink-0">
                    03
                  </div>
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono text-[10px] font-bold border border-blue-500/30">
                        LV.03 · Power Automate 입문
                      </span>
                      <span className="text-[11px] text-slate-500 font-semibold">🔒 차기 클래스 준비 중</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-200">트리거 자동화 — 손 안 대는 자동화</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      실행 버튼 없이도 폴더 감시, 조건 분기, 알림까지 알아서 도는 흐름을 설계합니다. VBA와의 역할 차이를 여기서 체감합니다.
                    </p>
                    <div className="flex space-x-2 pt-1">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
                        이벤트 트리거
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
                        승인 흐름
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* LV.04 */}
              <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors opacity-90">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-950/40 border border-blue-800/40 flex items-center justify-center font-mono font-bold text-blue-400 text-base shrink-0">
                    04
                  </div>
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono text-[10px] font-bold border border-blue-500/30">
                        LV.04 · 하이브리드 연동
                      </span>
                      <span className="text-[11px] text-slate-500 font-semibold">🔒 차기 클래스 준비 중</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-200">VBA + Power Automate 결합 설계</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Power Automate가 감지·알림·승인을 맡고, VBA가 무거운 엑셀 가공을 맡는 역할 분담 구조를 직접 설계합니다.
                    </p>
                    <div className="flex space-x-2 pt-1">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
                        Office Script
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
                        역할 분담 설계
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* LV.05 CAPSTONE */}
              <div className="p-6 rounded-3xl bg-slate-900/80 border border-amber-500/30 relative overflow-hidden">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center font-mono font-bold text-amber-400 text-base shrink-0">
                    05
                  </div>
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-mono text-[10px] font-bold border border-amber-500/30">
                        LV.05 · 캡스톤
                      </span>
                      <span className="text-[11px] text-slate-500 font-semibold">🔒 차기 프로젝트 준비 중</span>
                    </div>
                    <h3 className="text-lg font-bold text-amber-200">완전자동화 프로젝트</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      실제 입금전처리 매크로 사례를 완전자동화로 재설계합니다. 수강생은 자신의 업무 하나를 골라 같은 구조로 직접 구현합니다.
                    </p>
                    <div className="flex space-x-2 pt-1">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-amber-400/80">
                        실무 사례 재설계
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-amber-400/80">
                        개인 프로젝트 완성
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* LIVE CLASS ENQUIRY BANNER */}
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
                <a
                  href="https://qr.kakaopay.com/FVGQc7DUq"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => trackGAEvent("click_kakaopay_transfer", "conversion", "banner_button")}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-black text-sm shadow-xl shadow-yellow-500/20 transition-all flex items-center justify-center space-x-2 active:scale-95 cursor-pointer"
                >
                  <span>🟡 카카오페이 5,000원 1초 송금 ↗</span>
                </a>
                <a
                  href="https://jobs.kr.karrotmarket.com/shared/profiles/6a5888b11b54fcb878ff3b65"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-white font-extrabold text-sm shadow-xl shadow-orange-500/20 transition-all flex items-center justify-center space-x-2 active:scale-95 cursor-pointer"
                >
                  <span>🥕 당근마켓 실강 문의 ↗</span>
                </a>
                <div className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-sm font-mono font-bold text-cyan-300 shadow-inner text-center">
                  💬 KAKAOTALK ID : <span className="text-white select-all">ayoi1034</span>
                </div>
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

          {/* FOOTER */}
          <footer className="max-w-5xl mx-auto px-4 sm:px-6 pt-12 text-center text-xs text-slate-500 space-y-2 border-t border-slate-800">
            <p className="font-semibold text-slate-400">WorkFree Market • ai딸깍샘</p>
            <p>www.workfreemarket.com • 클릭 1번으로 끝내는 엑셀 자동화 마스터클래스</p>
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

      {/* License Key Gatekeeper Modal Overlay */}
      {showLicenseModal && !isAuthenticated && (
        <div className="fixed top-[61px] inset-x-0 bottom-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-xl">
          <div className="w-full max-w-md bg-slate-900/95 border border-cyan-500/40 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl shadow-cyan-500/20 space-y-5 sm:space-y-6 text-center max-h-[92vh] overflow-y-auto relative">
            <button
              onClick={() => setShowLicenseModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg font-bold p-1 cursor-pointer transition-colors"
              title="닫기"
            >
              ✕
            </button>
            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-blue-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 text-xl sm:text-2xl shadow-lg shadow-cyan-500/20">
              🔒
            </div>

            <div className="space-y-2">
              <span className="px-3.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] sm:text-[11px] font-extrabold tracking-wide uppercase">
                🔥 5,000원 한정 파격 특가 이벤트
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                수강 라이선스 인증 &amp; 5,000원 결제
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                전달받으신 <strong>수강 라이선스 키</strong>를 입력해 주세요.
                <br />
                아직 수강 키가 없으신 경우 아래 <strong>[5,000원 결제하기]</strong> 버튼을 누르시면 1초 만에 카카오페이 송금으로 연결되며, 확인 후 키를 즉시 발급해 드립니다.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleVerifyLicense();
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <input
                  type="password"
                  value={licenseInput}
                  onChange={(e) => {
                    setLicenseInput(e.target.value);
                    setLicenseError("");
                  }}
                  placeholder="라이선스 비번 입력 (예: workfree1)"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 text-sm text-center text-white placeholder-slate-500 focus:outline-none transition-all font-mono tracking-wider"
                  autoFocus
                />
                {licenseError && (
                  <p className="text-xs text-rose-400 font-semibold animate-pulse">
                    ⚠️ {licenseError}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold text-xs shadow-lg shadow-cyan-500/25 transition-all duration-200 cursor-pointer active:scale-95"
              >
                🔑 수강 승인 및 클래스 입장
              </button>
            </form>

            {showKeyInfo && (
              <div className="p-4 rounded-2xl bg-emerald-950/70 border border-emerald-500/50 text-left space-y-2.5 shadow-xl shadow-emerald-500/10">
                <div className="flex items-center space-x-2 text-xs font-black text-emerald-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>🎉 5,000원 결제 송금 연결 완료!</span>
                </div>
                <p className="text-[11px] text-emerald-200/90 leading-relaxed">
                  카카오페이 송금 후 아래 라이선스 비번을 입력하시거나 <strong>[즉시 수강 승인]</strong> 버튼을 누르시면 10강 전체가 바로 열립니다!
                </p>
                <div className="p-3 bg-slate-950 rounded-xl border border-emerald-500/40 flex items-center justify-between font-mono font-bold text-xs sm:text-sm text-emerald-300">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-sans">수강 라이선스 키:</span>
                    <span className="text-white tracking-wider">workfreemarketyaho</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setLicenseInput(VALID_LICENSE_KEY);
                      setIsAuthenticated(true);
                      setShowLicenseModal(false);
                      trackGAEvent("auto_auth_success", "engagement", "modal_5k");
                    }}
                    className="px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs cursor-pointer shadow-md active:scale-95 transition-all"
                  >
                    🔑 즉시 수강 승인 ➔
                  </button>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-slate-800 space-y-2.5">
              <p className="text-[11px] font-bold text-amber-300">
                💳 특가 결제 &amp; 수강 신청:
              </p>
              <div className="space-y-2">
                <a
                  href="https://qr.kakaopay.com/FVGQc7DUq"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => {
                    setShowKeyInfo(true);
                    trackGAEvent("click_kakaopay_transfer", "conversion", "modal_5k");
                  }}
                  className="block w-full py-3.5 rounded-xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-yellow-500/20 transition-all text-center cursor-pointer active:scale-95"
                >
                  💳 5,000원 결제하기 (카카오페이 1초 송금) ↗
                </a>
                <a
                  href="https://jobs.kr.karrotmarket.com/shared/profiles/6a5888b11b54fcb878ff3b65"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => trackGAEvent("click_karrot_inquiry", "conversion", "modal_5k")}
                  className="block w-full py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-amber-400 font-bold text-xs border border-amber-500/30 transition-all text-center cursor-pointer"
                >
                  🥕 당근마켓 문의 ↗
                </a>
                <a
                  href="#schedule"
                  onClick={() => {
                    setShowLicenseModal(false);
                    trackGAEvent("click_kakaotalk_inquiry", "conversion", "modal_5k");
                  }}
                  className="block w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white font-semibold text-xs border border-slate-800 transition-all text-center cursor-pointer"
                >
                  💬 카카오톡 1:1 상담 (ayoi1034)
                </a>
              </div>
              <button
                onClick={() => setViewMode("landing")}
                className="text-[11px] text-slate-500 hover:text-slate-300 underline cursor-pointer pt-1"
              >
                🏠 강의 소개 페이지로 돌아가기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
