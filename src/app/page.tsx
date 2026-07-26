"use client";

import { useState, useEffect, useRef } from "react";

interface Lecture {
  id: number;
  title: string;
  duration: string;
  filename: string;
  driveUrl?: string;
  summary: string;
  keyPoints: string[];
  resources: { name: string; type: string }[];
}

const LECTURES: Lecture[] = [
  {
    id: 1,
    title: "01강: 환경 세팅 마무리 — 애드인 폴더 등록과 신뢰할 수 있는 위치",
    duration: "10:00",
    filename: "Lecture_01.mp4",
    driveUrl: "https://drive.google.com/file/d/18wF4n2_E1xkf-_SA8OBDOT_atiT6FG0G/view?usp=drive_link",
    summary: "엑셀 개발 도구 탭 활성화, 매크로 보안 설정 해제 및 Microsoft AddIns 폴더(.xlam) 등록과 신뢰할 수 있는 위치 경로 설정을 진행합니다.",
    keyPoints: [
      "엑셀 개발 도구 탭 활성화 및 매크로 보안 설정 해제",
      "매크로 디렉토리(.xlam) 파일을 Microsoft AddIns 폴더에 등록",
      "신뢰할 수 있는 위치 경로 설정 및 즐겨찾기 고정",
    ],
    resources: [
      { name: "01강_애드인_설정가이드.pdf", type: "PDF" },
      { name: "WorkFree_AddIn_Template.xlam", type: "XLAM" },
    ],
  },
  {
    id: 2,
    title: "02강: 첫 자동화, 파일 여는 엑셀 매크로",
    duration: "10:00",
    filename: "Lecture_02.mp4",
    driveUrl: "https://drive.google.com/file/d/1OILzj22t9tqfGGObI7wUTXZuKexmAps7/view?usp=drive_link",
    summary: "반복적으로 여는 업무 파일 경로를 복사하고, 생성형 AI(ChatGPT 등)를 활용하여 VBA 파일 열기 코드를 생성 및 테스트합니다.",
    keyPoints: [
      "반복적으로 여는 특정 업무 폴더/파일의 경로 복사",
      "생성형 AI(ChatGPT 등)를 활용한 VBA 파일 열기 코드 생성",
      "비주얼 베이직 편집기(Alt + F11)와 모듈 삽입 후 테스트 실행",
    ],
    resources: [{ name: "02강_파일오픈_프롬프트.txt", type: "TXT" }],
  },
  {
    id: 3,
    title: "03강: 이름이 핵심이다 — 매크로를 리본 메뉴에 심기",
    duration: "10:00",
    filename: "Lecture_03.mp4",
    driveUrl: "https://drive.google.com/file/d/1WsgiGEcj3hT3bQqQBN7PgVhua6zxhwxl/view?usp=drive_link",
    summary: "서브루틴 이름 규칙과 모듈 속성창 설정법을 익히고, 엑셀 상단 리본 메뉴에 커스텀 탭/그룹과 아이콘을 연결합니다.",
    keyPoints: [
      "서브루틴(Sub) 이름의 중요성과 유지보수를 위한 모듈 속성창 이름 변경",
      "엑셀 리본 메뉴 사용자 지정 (새 탭 및 새 그룹 생성)",
      "등록한 매크로에 아이콘(이모티콘)을 부여하고 상단 탭에 연동하기",
    ],
    resources: [{ name: "03강_리본메뉴_커스텀_가이드.pdf", type: "PDF" }],
  },
  {
    id: 4,
    title: "04강: 데이터 구조를 AI에게 설명하는 법 — 헤더와 열 매핑 알려주기",
    duration: "10:00",
    filename: "Lecture_04.mp4",
    driveUrl: "https://drive.google.com/file/d/1ERAkv39bUEENU84bEboyRhUvIMhEiz9S/view?usp=drive_link",
    summary: "로우 데이터의 헤더 위치와 만기일·통화·금액 열 구조를 파악하고, AI에게 명확하게 집계 범위를 명령하는 프롬프트 작성법을 배웁니다.",
    keyPoints: [
      "실무 로우 데이터의 구조 파악 (헤더 행 위치 지정)",
      "만기일, 통화, 금액 등이 위치한 열(Column) 정보를 AI에게 명확히 전달하는 요령",
      "활성화된 시트 내에서 집계 범위를 지정하는 자연어 프롬프트 작성법",
    ],
    resources: [{ name: "04강_헤더매핑_프롬프트_템플릿.zip", type: "ZIP" }],
  },
  {
    id: 5,
    title: "05강: 합산표 코드 받고 실행해보기",
    duration: "10:00",
    filename: "Lecture_05.mp4",
    driveUrl: "https://drive.google.com/file/d/1_GRqa9866tnjskM1z0sWoIROU8OIar3s/view?usp=drive_link",
    summary: "만기 월별·통화별 금액 합산표 생성 VBA 코드를 생성형 AI에게 요청하고, 모듈 붙여넣기 및 F5/F8 단계별 디버깅을 실행합니다.",
    keyPoints: [
      "만기 월별·통화별 금액 합산표 생성을 위한 VBA 코드 요청",
      "코드 복사 후 모듈에 붙여넣기 및 실행 (F5 / F8 디버깅)",
      "실행 결과 데이터 검증 및 오류 발생 시 대처 요령",
    ],
    resources: [{ name: "05강_합산표_샘플데이터.xlsx", type: "XLSX" }],
  },
  {
    id: 6,
    title: "06강: 합산표 매크로, 리본에 등록하기 — 실전 디버깅",
    duration: "10:00",
    filename: "Lecture_06.mp4",
    driveUrl: "https://drive.google.com/file/d/1NsCiH48wUlahexDx3iFpJ1FRrSmz1nxm/view?usp=drive_link",
    summary: "작성한 매크로를 .xlam 추가 기능에 이관하여 리본 메뉴 버튼으로 등록하고, 디버그 오류 시 AI에게 캡처를 공유하여 리팩토링하는 기법입니다.",
    keyPoints: [
      "작성된 합산표 매크로를 .xlam 추가 기능 폴더에 최종 이관",
      "리본 메뉴에 데이터 가공용 그룹 및 버튼 추가",
      "디버그 오류 발생 시 AI에게 에러 화면을 공유하고 코드를 수정(리팩토링)하는 방법",
    ],
    resources: [{ name: "06강_디버깅_체크리스트.pdf", type: "PDF" }],
  },
  {
    id: 7,
    title: "07강: 한 번에 100개 PDF 만들기",
    duration: "10:00",
    filename: "Lecture_07.mp4",
    driveUrl: "https://drive.google.com/file/d/1CYEGZXmEyXx9MU9UUq-vy5AoyZC2lA0I/view?usp=drive_link",
    summary: "거래처 키값 변경에 따른 템플릿 자동 반영 원리와 반복문(Loop) 구조를 활용해 수십 개의 시트를 일괄 PDF 저장하는 자동화를 구축합니다.",
    keyPoints: [
      "키값(거래처 번호 등)이 바뀔 때마다 템플릿 서식이 자동으로 반영되는 원리",
      "반복문 구조를 활용해 수많은 시트를 일괄 PDF로 변환 및 저장하는 자동화",
      "인쇄 영역 설정 오류 해결 및 결과물 확인",
    ],
    resources: [{ name: "07강_일괄PDF_소스코드.vba", type: "VBA" }],
  },
  {
    id: 8,
    title: "08강: 인쇄영역 디버깅과 완성",
    duration: "10:00",
    filename: "Lecture_08.mp4",
    driveUrl: "https://drive.google.com/file/d/1Dd6eE2HNdHd9GQ1OWpgZov0uTeV5GV3Q/view?usp=drive_link",
    summary: "페이지 레이아웃 인쇄 영역 자동 조절, 지정 폴더 저장 경로 세팅 및 파일명 덮어쓰기 방지 로직을 추가하여 PDF 매크로를 완성합니다.",
    keyPoints: [
      "페이지 레이아웃에서 인쇄 영역 해제 및 조절하기",
      "저장 폴더 경로 지정 및 파일명 덮어쓰기 방지 처리",
      "일괄 PDF 저장 매크로의 리본 메뉴 등록 및 최종 검증",
    ],
    resources: [{ name: "08강_PDF매크로_최종본.xlam", type: "XLAM" }],
  },
  {
    id: 9,
    title: "09강: 원하는 값만 조회하기 — 인풋박스와 메시지 박스",
    duration: "10:00",
    filename: "Lecture_09.mp4",
    driveUrl: "https://drive.google.com/file/d/1Z7MTyDaBgT2bhxn_pSIFCfBNBFedv370/view?usp=drive_link",
    summary: "사용자 조회를 위한 InputBox 대화상자와 MsgBox 알림창을 도입하여, 특정 폴더 파일을 직접 열지 않고 데이터를 빠르게 조회합니다.",
    keyPoints: [
      "사용자로부터 직접 날짜나 조건을 입력받는 InputBox 개념 도입",
      "특정 폴더의 파일을 열지 않고도 필요한 데이터만 추출해 MsgBox로 띄우기",
      "데이터 조회 자동화 매크로 작성 및 리본 메뉴 연동",
    ],
    resources: [{ name: "09강_인풋박스_조회매크로.pdf", type: "PDF" }],
  },
  {
    id: 10,
    title: "10강: 다음 단계 예고 — 템플릿 매핑, 메일 자동화 개념 소개",
    duration: "10:00",
    filename: "Lecture_10.mp4",
    driveUrl: "https://drive.google.com/file/d/15Gt6LYITrFez6PDz7DVLMB7wzxItu3u4/view?usp=drive_link",
    summary: "매일 받는 로우 데이터의 고정 템플릿 자동 매핑, 아웃룩(Outlook) API 연동 PDF 청구서 메일 자동 전송 및 이벤트 기반 매크로의 발전 방향을 제시합니다.",
    keyPoints: [
      "매일 다운로드받는 로우 데이터를 고정 템플릿에 자동으로 매핑하는 심화 과정 안내",
      "아웃룩(Outlook) API 등을 연동하여 PDF 청구서를 이메일로 자동 전송하는 개념 소개",
      "이벤트 기반 매크로 및 업무 효율 극대화를 위한 최적화 팁 공유",
    ],
    resources: [{ name: "10강_수료증_및_다음단계_로드맵.pdf", type: "PDF" }],
  },
];

export default function Home() {
  const [currentLecture, setCurrentLecture] = useState<Lecture>(LECTURES[0]);
  const [completedLectures, setCompletedLectures] = useState<number[]>([]);
  const [showDeployModal, setShowDeployModal] = useState<boolean>(false);
  const [showDriveModal, setShowDriveModal] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [driveLinks, setDriveLinks] = useState<Record<number, string>>({});
  
  // License Lock States
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [licenseInput, setLicenseInput] = useState<string>("");
  const [licenseError, setLicenseError] = useState<string>("");
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);

  const VALID_LICENSE_KEY = "workfreemarketyaho";
  const videoRef = useRef<HTMLVideoElement>(null);

  // Load drive links, completion state, and license auth from localStorage
  useEffect(() => {
    const authStatus = localStorage.getItem("workfree_license_auth");
    if (authStatus === "true") {
      setIsAuthenticated(true);
    }
    setIsLoadingAuth(false);

    const savedCompleted = localStorage.getItem("workfree_completed");
    if (savedCompleted) {
      try {
        setCompletedLectures(JSON.parse(savedCompleted));
      } catch (e) {
        console.error(e);
      }
    }

    const savedDrive = localStorage.getItem("workfree_drive_links");
    if (savedDrive) {
      try {
        setDriveLinks(JSON.parse(savedDrive));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleVerifyLicense = () => {
    if (licenseInput.trim() === VALID_LICENSE_KEY) {
      setIsAuthenticated(true);
      setLicenseError("");
      localStorage.setItem("workfree_license_auth", "true");
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
  };

  const handleSaveDriveLink = (lectureId: number, url: string) => {
    const updated = { ...driveLinks, [lectureId]: url };
    setDriveLinks(updated);
    localStorage.setItem("workfree_drive_links", JSON.stringify(updated));
  };

  const extractDriveId = (inputUrl: string): string | null => {
    if (!inputUrl) return null;
    const cleanUrl = inputUrl.trim();
    // Matches /file/d/ID/ or ?id=ID or raw ID
    const match = cleanUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || 
                  cleanUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/) ||
                  cleanUrl.match(/^([a-zA-Z0-9_-]{25,50})$/);
    return match ? match[1] : null;
  };

  const currentDriveUrl = driveLinks[currentLecture.id] || currentLecture.driveUrl || "";
  const currentDriveId = extractDriveId(currentDriveUrl);

  const progressPercent = Math.round((completedLectures.length / LECTURES.length) * 100);

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Top Header Navbar */}
      <header className="sticky top-0 z-30 px-4 sm:px-6 py-3 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          {/* Logo & Title */}
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-cyan-500/20 text-xs sm:text-base">
              WF
            </div>
            <div>
              <h1 className="font-extrabold text-sm sm:text-base tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                WorkFree Market
              </h1>
              <p className="text-[10px] sm:text-[11px] text-cyan-400 font-medium tracking-wide">
                AI 엑셀 매크로 마스터클래스
              </p>
            </div>
          </div>

          {/* Action Buttons & License Status */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* License Status Badge */}
            {isAuthenticated ? (
              <button
                onClick={handleLogoutLicense}
                className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-[11px] sm:text-xs font-semibold border border-emerald-500/30 transition-all cursor-pointer"
                title="클릭 시 수강인증 잠금 상태로 전환"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>🔑 수강인증 완료</span>
              </button>
            ) : (
              <span className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-400 text-[11px] sm:text-xs font-semibold border border-amber-500/30">
                🔒 수강 미인증
              </span>
            )}

            {/* Google Drive Connect */}
            <button
              onClick={() => setShowDriveModal(true)}
              className="flex items-center space-x-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-[11px] sm:text-xs font-semibold text-cyan-300 border border-cyan-500/30 transition-all cursor-pointer active:scale-95"
            >
              <svg className="w-3.5 h-3.5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h10a4 4 0 004-4M3 15a4 4 0 014-4h10a4 4 0 014 4M3 15V9a4 4 0 014-4h10a4 4 0 014 4v6" />
              </svg>
              <span className="hidden sm:inline">📁 구글드라이브 영상 연동</span>
              <span className="sm:hidden">📁 연동</span>
            </button>

            {/* Vercel & Domain Deploy Button */}
            <button
              onClick={() => setShowDeployModal(true)}
              className="hidden md:flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-xs font-semibold text-white shadow-md shadow-blue-600/25 transition-all cursor-pointer active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              <span>도메인 배포</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* Left Column: Video Player & Lecture Details (8 cols) */}
        <section className="lg:col-span-8 p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6 overflow-y-auto lg:border-r border-slate-800/80">
          {/* Responsive 16:9 Video Player Container */}
          <div className="relative w-full aspect-video rounded-xl sm:rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-2xl shadow-black/80 group">
            {currentDriveId ? (
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
                현재 재생 중: {currentLecture.title} {currentDriveId && "(Google Drive 재생)"}
              </span>
            </div>
          </div>

          {/* Lecture Info & Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  강의 #{currentLecture.id}
                </span>
                <span className="text-[11px] sm:text-xs text-slate-400 font-medium">재생시간 10:00</span>
              </div>
              <h2 className="text-base sm:text-xl font-bold text-white tracking-tight leading-snug">
                {currentLecture.title}
              </h2>
            </div>

            <div className="flex flex-wrap items-center justify-between sm:justify-start gap-2.5 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800/80">
              {/* Playback Speed Switcher */}
              <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-[11px] sm:text-xs">
                {[1.0, 1.25, 1.5, 2.0].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => setPlaybackSpeed(speed)}
                    className={`px-2 sm:px-2.5 py-1 rounded-lg font-medium transition-all ${
                      playbackSpeed === speed
                        ? "bg-blue-600 text-white font-bold"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>

              {/* Complete Toggle Button */}
              <button
                onClick={() => toggleComplete(currentLecture.id)}
                className={`flex items-center justify-center space-x-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl font-semibold text-xs transition-all duration-200 cursor-pointer ${
                  completedLectures.includes(currentLecture.id)
                    ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-600/30"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
                <span>
                  {completedLectures.includes(currentLecture.id) ? "수강 완료됨" : "수강 완료로 표시"}
                </span>
              </button>
            </div>
          </div>

          {/* Lecture Summary & Core Points Section */}
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-6 space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
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
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-sm sm:text-base text-white">강의 교육 과정 커리큘럼</h3>
              <p className="text-[11px] sm:text-xs text-slate-400">총 10강 • 100분 완강 코스</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-slate-800 text-cyan-400 text-[10px] sm:text-xs font-extrabold border border-slate-700">
              10강 세트
            </span>
          </div>

          {/* Lecture List Accordion */}
          <div className="space-y-2.5">
            {LECTURES.map((lec) => {
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
                    {/* Checkbox / Play Icon */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleComplete(lec.id);
                      }}
                      className="mt-0.5 shrink-0"
                    >
                      {isDone ? (
                        <div className="w-5 h-5 rounded-md bg-emerald-500 flex items-center justify-center text-slate-950 font-bold text-xs shadow-md">
                          ✓
                        </div>
                      ) : (
                        <div
                          className={`w-5 h-5 rounded-md border flex items-center justify-center text-[10px] font-bold ${
                            isCurrent
                              ? "border-cyan-400 text-cyan-400"
                              : "border-slate-700 text-slate-500 hover:border-slate-500"
                          }`}
                        >
                          {lec.id}
                        </div>
                      )}
                    </button>

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
                    {isCurrent && (
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

      {/* Vercel & Domain Setup Modal */}
      {showDeployModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-white font-bold text-sm border border-slate-700">
                  ▲
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    www.workfreemarket.com 도메인 배포 가이드
                  </h3>
                  <p className="text-xs text-slate-400">Vercel 무료 배포 및 도메인 CNAME 연동 절차</p>
                </div>
              </div>
              <button
                onClick={() => setShowDeployModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-300">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <h4 className="font-bold text-sm text-cyan-400">1단계: Vercel 배포 실행</h4>
                <p>터미널에서 아래 명령어를 입력하여 이 웹 프로젝트를 Vercel에 무료로 배포합니다:</p>
                <pre className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 font-mono text-cyan-300 text-xs">
                  npx vercel
                </pre>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <h4 className="font-bold text-sm text-cyan-400">
                  2단계: www.workfreemarket.com 도메인 추가
                </h4>
                <p>
                  Vercel 대시보드 프로젝트 설정의 <strong>[Settings] → [Domains]</strong>에서{" "}
                  <code className="text-emerald-400 font-mono">www.workfreemarket.com</code> 도메인을 입력하고 등록합니다.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <h4 className="font-bold text-sm text-cyan-400">3단계: DNS 레코드 세팅 (가비아 / 카페24 / Cloudflare)</h4>
                <p>도메인 구매 사이트의 DNS 설정에 아래 값을 추가합니다:</p>
                <div className="grid grid-cols-2 gap-2 font-mono text-[11px] bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-slate-500">타입:</span> CNAME
                    <br />
                    <span className="text-slate-500">이름:</span> www
                    <br />
                    <span className="text-slate-500">값:</span> cname.vercel-dns.com
                  </div>
                  <div>
                    <span className="text-slate-500">타입:</span> A
                    <br />
                    <span className="text-slate-500">이름:</span> @
                    <br />
                    <span className="text-slate-500">값:</span> 76.76.21.21
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowDeployModal(false)}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors"
              >
                확인 완료
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Google Drive Video Links Management Modal */}
      {showDriveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-base">
                  📁
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    구글 드라이브 동영상 연동 관리
                  </h3>
                  <p className="text-xs text-slate-400">
                    구글 드라이브 폴더의 10개 강의 영상 공유 링크/파일 ID를 등록하면 웹사이트에서 바로 스트리밍 시청이 가능합니다.
                  </p>
                </div>
              </div>
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
                className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-colors shadow-lg shadow-cyan-600/20"
              >
                설정 완료 및 창 닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* License Key Gatekeeper Modal Overlay */}
      {!isAuthenticated && !isLoadingAuth && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/95 backdrop-blur-xl">
          <div className="w-full max-w-md bg-slate-900/90 border border-cyan-500/30 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl shadow-cyan-500/10 space-y-5 sm:space-y-6 text-center max-h-[92vh] overflow-y-auto">
            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-blue-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 text-xl sm:text-2xl shadow-lg shadow-cyan-500/20">
              🔒
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-[10px] sm:text-[11px] font-bold tracking-wide uppercase">
                WorkFree Market 수강생 전용
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                수강생 전용 라이선스 인증
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                본 클래스는 실시간 강의 수강생 전용 마스터클래스입니다.
                <br />
                전달받으신 <strong>수강 라이선스 비번</strong>을 입력해 주세요.
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
                  placeholder="라이선스 비번 입력"
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

            <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-500">
              라이선스 비번 문의: 강사 안내 메시지 / 카카오톡
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

