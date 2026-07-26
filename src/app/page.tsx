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
    title: "01강: WorkFree Market 오리엔테이션 및 플랫폼 핵심 개요",
    duration: "10:00",
    filename: "Lecture_01.mp4",
    driveUrl: "https://drive.google.com/file/d/18wF4n2_E1xkf-_SA8OBDOT_atiT6FG0G/view?usp=drive_link",
    summary: "WorkFree Market 전체 강의의 비전과 10강으로 구성된 단기 마스터클래스 핵심 로드맵을 소개합니다.",
    keyPoints: ["강의 학습 목표 설정", "워크프리 시스템 3단계 이해", "수강생 완료 리포트 구성"],
    resources: [
      { name: "01강_강의교안_요약노트.pdf", type: "PDF" },
      { name: "WorkFree_Market_Roadmap.png", type: "IMAGE" },
    ],
  },
  {
    id: 2,
    title: "02강: 실전 워크플로우 구성 및 초기 환경 세팅",
    duration: "10:00",
    filename: "Lecture_02.mp4",
    driveUrl: "https://drive.google.com/file/d/1OILzj22t9tqfGGObI7wUTXZuKexmAps7/view?usp=drive_link",
    summary: "효율적인 작업을 위한 개발 환경 세팅 및 도구 설치 가이드입니다.",
    keyPoints: ["개발 및 자동화 환경 구성", "필수 필수 도구 설치", "폴더 구조 및 파일 관리 규칙"],
    resources: [{ name: "02강_환경세팅_체크리스트.pdf", type: "PDF" }],
  },
  {
    id: 3,
    title: "03강: 핵심 도구 활용 및 프로세스 최적화 기법",
    duration: "10:00",
    filename: "Lecture_03.mp4",
    driveUrl: "https://drive.google.com/file/d/1WsgiGEcj3hT3bQqQBN7PgVhua6zxhwxl/view?usp=drive_link",
    summary: "핵심 기능을 빠르게 익히고 반복 작업 시간을 80% 줄이는 프레임워크 테크닉입니다.",
    keyPoints: ["핵심 도구 100% 활용하기", "작업 속도 3배 향상 팁", "자주 발생하는 착오 방지"],
    resources: [{ name: "03강_단축키_및_치트시트.pdf", type: "PDF" }],
  },
  {
    id: 4,
    title: "04강: 효율성을 극대화하는 파이프라인 자동화",
    duration: "10:00",
    filename: "Lecture_04.mp4",
    driveUrl: "https://drive.google.com/file/d/1ERAkv39bUEENU84bEboyRhUvIMhEiz9S/view?usp=drive_link",
    summary: "수동 작업을 자동화로 전환하여 작업 시간과 오차를 최소화합니다.",
    keyPoints: ["스마트 파이프라인 설계", "조건별 자동 실행 세팅", "오류 모니터링 가이드"],
    resources: [{ name: "04강_자동화_템플릿.zip", type: "ZIP" }],
  },
  {
    id: 5,
    title: "05강: 실전 응용 케이스 분석 (Part 1)",
    duration: "10:00",
    filename: "Lecture_05.mp4",
    driveUrl: "https://drive.google.com/file/d/1_GRqa9866tnjskM1z0sWoIROU8OIar3s/view?usp=drive_link",
    summary: "실제 비즈니스 프로젝트에서 바로 사용 가능한 응용 케이스를 분석하고 구현합니다.",
    keyPoints: ["실전 케이스 실습 분석", "핵심 데이터 가공 전략", "결과물 품질 검증"],
    resources: [{ name: "05강_실습_소스코드.zip", type: "ZIP" }],
  },
  {
    id: 6,
    title: "06강: 실전 응용 케이스 분석 (Part 2)",
    duration: "10:00",
    filename: "Lecture_06.mp4",
    driveUrl: "https://drive.google.com/file/d/1NsCiH48wUlahexDx3iFpJ1FRrSmz1nxm/view?usp=drive_link",
    summary: "고급 파이프라인 구축 및 확장 가능한 아키텍처 패턴을 실습합니다.",
    keyPoints: ["고급 적용 사례 트러블슈팅", "확장 가능한 패턴 적용", "실시간 연동 체계 구축"],
    resources: [{ name: "06강_심화_케이스_가이드.pdf", type: "PDF" }],
  },
  {
    id: 7,
    title: "07강: 문제 해결 및 트러블슈팅 디버깅 가이드",
    duration: "10:00",
    filename: "Lecture_07.mp4",
    driveUrl: "https://drive.google.com/file/d/1CYEGZXmEyXx9MU9UUq-vy5AoyZC2lA0I/view?usp=drive_link",
    summary: "실행 중 발생할 수 있는 에러 유형과 신속한 원인 분석 및 해결 팁입니다.",
    keyPoints: ["에러 로그 분석 3단계", "자주 묻는 예외 상황 조치법", "안정성 확보 테크닉"],
    resources: [{ name: "07강_에러조치_매뉴얼.pdf", type: "PDF" }],
  },
  {
    id: 8,
    title: "08강: 서비스 런칭 및 운영 최적화 전략",
    duration: "10:00",
    filename: "Lecture_08.mp4",
    driveUrl: "https://drive.google.com/file/d/1Dd6eE2HNdHd9GQ1OWpgZov0uTeV5GV3Q/view?usp=drive_link",
    summary: "실제 도메인에 런칭하고 지속 가능한 운영 프로세스를 확립하는 전략을 설명합니다.",
    keyPoints: ["도메인 연결 및 SEO 기본", "성능 모니터링 체계", "고객/사용자 반응 수집"],
    resources: [{ name: "08강_런칭_체크리스트.pdf", type: "PDF" }],
  },
  {
    id: 9,
    title: "09강: 마스터클래스 핵심 개념 총정리",
    duration: "10:00",
    filename: "Lecture_09.mp4",
    driveUrl: "https://drive.google.com/file/d/1Z7MTyDaBgT2bhxn_pSIFCfBNBFedv370/view?usp=drive_link",
    summary: "1강부터 8강까지의 핵심 내용을 요약 정리하고 전체 흐름을 최종점검합니다.",
    keyPoints: ["전체 과목 핵심 요약", "핵심 포인트 복습", "수강 완료 테스트 검토"],
    resources: [{ name: "09강_최종_마스터_요약집.pdf", type: "PDF" }],
  },
  {
    id: 10,
    title: "10강: 프로젝트 완성 및 최종 비전 가이드",
    duration: "10:00",
    filename: "Lecture_10.mp4",
    driveUrl: "https://drive.google.com/file/d/15Gt6LYITrFez6PDz7DVLMB7wzxItu3u4/view?usp=drive_link",
    summary: "10강 마스터클래스를 마무리하며 향후 발전 방향과 수강 완료 후 다음 단계를 안내합니다.",
    keyPoints: ["최종 프로젝트 완료 수료", "다음 단계 심화 과정 안내", "커뮤니티 및 지속 지원"],
    resources: [{ name: "10강_수료증_및_커뮤니티_안내.pdf", type: "PDF" }],
  },
];

export default function Home() {
  const [currentLecture, setCurrentLecture] = useState<Lecture>(LECTURES[0]);
  const [completedLectures, setCompletedLectures] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<"summary" | "notes" | "resources">("summary");
  const [userNote, setUserNote] = useState<string>("");
  const [showDeployModal, setShowDeployModal] = useState<boolean>(false);
  const [showDriveModal, setShowDriveModal] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [driveLinks, setDriveLinks] = useState<Record<number, string>>({});
  const videoRef = useRef<HTMLVideoElement>(null);

  // Load drive links and completion state from localStorage
  useEffect(() => {
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
      <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-3.5 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-cyan-500/20">
              WF
            </div>
            <div>
              <h1 className="font-extrabold text-base tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                WorkFree Market
              </h1>
              <p className="text-[11px] text-cyan-400 font-medium tracking-wide">
                www.workfreemarket.com • 10분 단기 마스터클래스
              </p>
            </div>
          </div>
        </div>

        {/* Course Progress & Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <div className="flex flex-col items-end pr-2">
            <div className="flex items-center space-x-2 text-xs font-semibold">
              <span className="text-slate-400">전체 수강률:</span>
              <span className="text-cyan-400 font-bold text-sm">{progressPercent}%</span>
              <span className="text-slate-500">({completedLectures.length}/10 완료)</span>
            </div>
            <div className="w-44 h-2 bg-slate-800 rounded-full overflow-hidden mt-1 border border-slate-700/50">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          {/* Google Drive Video Connect Button */}
          <button
            onClick={() => setShowDriveModal(true)}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-cyan-300 border border-cyan-500/30 transition-all duration-200 cursor-pointer active:scale-95 shadow-md"
          >
            <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h10a4 4 0 004-4M3 15a4 4 0 014-4h10a4 4 0 014 4M3 15V9a4 4 0 014-4h10a4 4 0 014 4v6" />
            </svg>
            <span>📁 구글드라이브 영상 연동</span>
          </button>

          {/* Vercel & Domain Deploy Button */}
          <button
            onClick={() => setShowDeployModal(true)}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-xs font-semibold text-white shadow-md shadow-blue-600/25 transition-all duration-200 cursor-pointer active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
            <span>도메인(www.workfreemarket.com) 배포</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* Left Column: Video Player & Lecture Details (8 cols) */}
        <section className="lg:col-span-8 p-4 md:p-6 space-y-6 overflow-y-auto border-r border-slate-800/80">
          {/* Video Player Container */}
          <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl shadow-black/80 group">
            {currentDriveId ? (
              <iframe
                key={`drive-${currentDriveId}`}
                src={`https://drive.google.com/file/d/${currentDriveId}/preview`}
                className="w-full aspect-video border-0 bg-black"
                allow="autoplay; encrypted-media; fullscreen"
                allowFullScreen
              ></iframe>
            ) : (
              <video
                ref={videoRef}
                key={currentLecture.id}
                className="w-full aspect-video object-contain bg-black"
                controls
                autoPlay
                preload="metadata"
                src={`/lectures/${currentLecture.filename}`}
              >
                <source src={`/lectures/${currentLecture.filename}`} type="video/mp4" />
                브라우저가 동영상 재생을 지원하지 않습니다.
              </video>
            )}

            {/* Top Badge Overlay */}
            <div className="absolute top-4 left-4 flex items-center space-x-2 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/60 text-xs font-semibold z-10">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-slate-200">
                현재 재생 중: {currentLecture.title} {currentDriveId && "(Google Drive 재생)"}
              </span>
            </div>
          </div>

          {/* Lecture Info & Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
            <div>
              <div className="flex items-center space-x-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  강의 #{currentLecture.id}
                </span>
                <span className="text-xs text-slate-400 font-medium">재생시간 10:00</span>
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">{currentLecture.title}</h2>
            </div>

            <div className="flex items-center space-x-3">
              {/* Playback Speed Switcher */}
              <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs">
                {[1.0, 1.25, 1.5, 2.0].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => setPlaybackSpeed(speed)}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
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
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-semibold text-xs transition-all duration-200 cursor-pointer ${
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

          {/* Bottom Tabs (Summary, Notes, Resources) */}
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-6 space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
              <button
                onClick={() => setActiveTab("summary")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "summary"
                    ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                📝 강의 요약 & 핵심 포인트
              </button>
              <button
                onClick={() => setActiveTab("notes")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "notes"
                    ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                ✏️ 개인 수강 메모
              </button>
              <button
                onClick={() => setActiveTab("resources")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "resources"
                    ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                📎 수강 자료 ({currentLecture.resources.length})
              </button>
            </div>

            {/* Tab 1: Summary */}
            {activeTab === "summary" && (
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
            )}

            {/* Tab 2: Personal Notes */}
            {activeTab === "notes" && (
              <div className="space-y-3">
                <textarea
                  value={userNote}
                  onChange={(e) => setUserNote(e.target.value)}
                  placeholder="이 강좌에 대해 기억해야 할 점이나 메모를 자유롭게 남겨보세요..."
                  className="w-full h-32 p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/60 transition-colors"
                ></textarea>
                <div className="flex justify-end">
                  <button
                    onClick={() => alert("메모가 성공적으로 저장되었습니다!")}
                    className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-colors"
                  >
                    메모 저장하기
                  </button>
                </div>
              </div>
            )}

            {/* Tab 3: Resources */}
            {activeTab === "resources" && (
              <div className="space-y-2">
                {currentLecture.resources.map((res, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-400 text-[10px] font-extrabold uppercase">
                        {res.type}
                      </span>
                      <span className="text-xs font-semibold text-slate-200">{res.name}</span>
                    </div>
                    <button
                      onClick={() => alert(`${res.name} 다운로드를 시작합니다.`)}
                      className="text-xs text-cyan-400 font-medium hover:underline cursor-pointer"
                    >
                      다운로드 ↓
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Right Column: 10-Lecture Playlist Sidebar (4 cols) */}
        <section className="lg:col-span-4 p-4 md:p-6 bg-slate-900/40 space-y-4 overflow-y-auto max-h-[calc(100vh-60px)] sticky top-[60px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-base text-white">강의 교육 과정 커리큘럼</h3>
              <p className="text-xs text-slate-400">총 10강 • 100분 완강 코스</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-slate-800 text-cyan-400 text-xs font-extrabold border border-slate-700">
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
                  className={`p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between ${
                    isCurrent
                      ? "bg-gradient-to-r from-slate-900 to-slate-800/90 border-cyan-500/60 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/40"
                      : "bg-slate-900/60 hover:bg-slate-900 border-slate-800/80 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-start space-x-3 overflow-hidden pr-2">
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
                          className={`text-[11px] font-extrabold ${
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
                        className={`text-xs font-bold leading-tight truncate ${
                          isCurrent ? "text-white" : "text-slate-300"
                        }`}
                      >
                        {lec.title.replace(/^\d+강:\s*/, "")}
                      </h4>
                    </div>
                  </div>

                  <div className="flex flex-col items-end shrink-0 pl-2">
                    <span className="text-[11px] font-semibold text-slate-500">{lec.duration}</span>
                    {isCurrent && (
                      <span className="text-[10px] font-bold text-cyan-400 tracking-wider uppercase mt-1">
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
    </div>
  );
}

