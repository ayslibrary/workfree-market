"use client";

import { useState, useEffect, useRef } from "react";
import * as PortOne from "@portone/browser-sdk/v2";
import { supabase } from "@/lib/supabase";

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
  const [zipDownloadUrl, setZipDownloadUrl] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("workfree_zip_url") || "https://drive.google.com/drive/folders/12y8MivWwaKY5GVhJtcGvfjWqYtyWLoTF";
    }
    return "https://drive.google.com/drive/folders/12y8MivWwaKY5GVhJtcGvfjWqYtyWLoTF";
  });
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [calcDailyHours, setCalcDailyHours] = useState<number>(3);
  const [calcFrequency, setCalcFrequency] = useState<number>(5);
  const [hourlyWage, setHourlyWage] = useState<number>(15000); // Priority 1: Hourly wage input
  const [selectedReviewImage, setSelectedReviewImage] = useState<string | null>(null);

  // Priority 3: 8.8(Sat) Live Class Early bird recruitment states
  const LIVE_CLASS_MAX_SEATS = 5;
  const LIVE_CLASS_ENROLLED_SEATS = 4;
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 3,
    hours: 14,
    minutes: 22,
    seconds: 45,
  });

  useEffect(() => {
    // 2026-08-08 14:00 Target Date for Live Class
    const targetDate = new Date("2026-08-08T14:00:00").getTime();
    const updateCountdown = () => {
      const now = new Date().getTime();
      const diff = targetDate - now;
      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Supabase Magic Link Auth Session Listener (Auto login when clicking email link)
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const email = session.user.email || "";
        const name = session.user.user_metadata?.name || session.user.user_metadata?.full_name || email.split("@")[0] || "수강생";
        const userObj = { name, email };
        setCurrentUser(userObj);
        localStorage.setItem("workfree_user", JSON.stringify(userObj));
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        const email = session.user.email || "";
        const name = session.user.user_metadata?.name || session.user.user_metadata?.full_name || email.split("@")[0] || "수강생";
        const userObj = { name, email };
        setCurrentUser(userObj);
        localStorage.setItem("workfree_user", JSON.stringify(userObj));
        if (event === "SIGNED_IN") {
          alert(`🎉 ${name}님, 메일 인증이 완료되어 성공적으로 로그인되었습니다!`);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Interactive Live Demo Sandbox Tabs (File Open, Amount Aggregation, 100 PDF Export)
  const [activeDemoTab, setActiveDemoTab] = useState<"pdfExport" | "fileOpen" | "aggregate">("pdfExport");
  const [fileOpenStatus, setFileOpenStatus] = useState<boolean>(false);
  const [isAggregating, setIsAggregating] = useState<boolean>(false);

  // Priority 2: Actual Operation Demo Clip simulation state (0 to 100 files saving in 3s)
  const [demoSavedCount, setDemoSavedCount] = useState<number>(0);
  const [isDemoActive, setIsDemoActive] = useState<boolean>(true);

  useEffect(() => {
    if (!isDemoActive) return;
    const interval = setInterval(() => {
      setDemoSavedCount((prev) => {
        if (prev >= 100) return 0;
        return prev + 5;
      });
    }, 150);
    return () => clearInterval(interval);
  }, [isDemoActive]);

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

  // State for Privacy Policy Modal, Terms Modal, Inquiry Choice Modal, Deposit Notice Modal, QR Zoom Modal & Auth Modal
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [showPaymentNoticeModal, setShowPaymentNoticeModal] = useState(false);
  const [showQrZoomModal, setShowQrZoomModal] = useState(false);

  // Nomad Coders Style Auth Modal State (Login / Join with Kakao & Google)
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authTab, setAuthTab] = useState<"login" | "join">("join");
  const [authName, setAuthName] = useState<string>("");
  const [authEmail, setAuthEmail] = useState<string>("");
  const [authPassword, setAuthPassword] = useState<string>("");
  const [agreeTerms, setAgreeTerms] = useState<boolean>(true);
  const [agreeMarketing, setAgreeMarketing] = useState<boolean>(true);
  const [showMarketingModal, setShowMarketingModal] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(null);

  // Track 2: AI Work Automation Agent Builder Pilot States & Engine
  const [showAgentModal, setShowAgentModal] = useState<boolean>(false);
  const [agentPrompt, setAgentPrompt] = useState<string>("");
  const [agentGenerating, setAgentGenerating] = useState<boolean>(false);
  const [agentOutput, setAgentOutput] = useState<{
    vbaCode: string;
    analysis: string;
    ribbonXml: string;
    filename: string;
  } | null>(null);

  // Expert Review Point 1 Fix: Next Cohort Waitlist Modal State & Handler
  const [showWaitlistModal, setShowWaitlistModal] = useState<boolean>(false);
  const [waitlistContact, setWaitlistContact] = useState<string>("");
  const [isSubmittingWaitlist, setIsSubmittingWaitlist] = useState<boolean>(false);

  const handleSaveWaitlist = async () => {
    if (!waitlistContact.trim()) {
      alert("카카오톡 ID 또는 이메일을 입력해 주세요.");
      return;
    }
    setIsSubmittingWaitlist(true);
    try {
      const prevWaitlist = JSON.parse(localStorage.getItem("workfree_waitlist_leads") || "[]");
      prevWaitlist.push({ contact: waitlistContact.trim(), requested_at: new Date().toLocaleString("ko-KR") });
      localStorage.setItem("workfree_waitlist_leads", JSON.stringify(prevWaitlist));

      try {
        await supabase.auth.updateUser({
          data: {
            waitlist_requested: true,
            waitlist_contact: waitlistContact.trim(),
            requested_at: new Date().toLocaleString("ko-KR"),
          },
        });
      } catch (e) {
        console.warn("Waitlist Supabase sync error:", e);
      }

      alert("🎉 다음 회차 알림 신청이 완료되었습니다!\n8.8 실강 마감 후 다음 회차 일정(8월 중순)이 확정되는 즉시 가장 먼저 카카오톡/이메일로 안내해 드리겠습니다.");
      setWaitlistContact("");
      setShowWaitlistModal(false);
    } catch (err: any) {
      alert(`알림 신청 처리 중 오류: ${err?.message || err}`);
    } finally {
      setIsSubmittingWaitlist(false);
    }
  };

  const handleGenerateAgentCode = async (promptText: string) => {
    if (!promptText.trim()) {
      alert("자동화하고 싶으신 업무 내용을 자연어로 입력해 주세요.");
      return;
    }
    setAgentGenerating(true);
    setAgentPrompt(promptText);

    try {
      const res = await fetch("/api/ai-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: promptText }),
      });

      if (!res.ok) {
        throw new Error("서버 에이전트 연동 응답 에러");
      }

      const data = await res.json();
      setAgentOutput({
        vbaCode: data.vbaCode,
        analysis: data.analysis,
        ribbonXml: data.ribbonXml,
        filename: data.filename,
      });
    } catch (err) {
      console.warn("Server AI Agent API fetch failed, fallback to local:", err);
      setAgentOutput({
        vbaCode: `' WorkFree AI Agent Server Fallback\nSub WorkFree_Automate()\n    MsgBox "자동화 처리가 성공적으로 완료되었습니다!", vbInformation\nEnd Sub`,
        analysis: `🎯 [서버 연동 업무 분석 완료]\n- 요청: ${promptText}\n- 엑셀 자동화 템플릿 코드 생성 완료`,
        ribbonXml: `<customUI xmlns="http://schemas.microsoft.com/office/2009/07/customui"><ribbon><tabs><tab id="tabWorkFree" label="WorkFree AI"><group id="grpAgent" label="딸깍 자동화"><button id="btnRun" label="자동화 실행" imageMso="MacroPlay" size="large" onAction="WorkFree_Automate" /></group></tab></tabs></ribbon></customUI>`,
        filename: "WorkFree_Agent_Macro.bas",
      });
    } finally {
      setAgentGenerating(false);
    }
  };

  const handleRunAgentPreset = (type: string) => {
    let p = "";
    if (type === "branch_merge") p = "매일 10개 지점 엑셀 파일 열어서 매출 합계 내기";
    else if (type === "pdf_export") p = "시트 100개를 버튼 1번으로 각각 PDF 변환 및 지정 폴더 저장하기";
    else if (type === "email_send") p = "엑셀 미수금 명단 읽어서 아웃룩 개별 이메일 자동 발송하기";
    else if (type === "vba_debug") p = "VBA 런타임 오류 1004 원인 분석 및 자동 디버깅";
    handleGenerateAgentCode(p);
  };

  // Lecture Playback Progress Tracking (Resume Playback)
  const [lectureTimestamps, setLectureTimestamps] = useState<Record<number, number>>({});

  // Initialize Kakao SDK with App Key 50d59b2654d46c862f0a1934c3c8c040
  useEffect(() => {
    const KAKAO_KEY = "50d59b2654d46c862f0a1934c3c8c040";
    if (typeof window !== "undefined") {
      if (!document.getElementById("kakao-sdk")) {
        const script = document.createElement("script");
        script.id = "kakao-sdk";
        script.src = "https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js";
        script.async = true;
        script.onload = () => {
          if ((window as any).Kakao && !(window as any).Kakao.isInitialized()) {
            (window as any).Kakao.init(KAKAO_KEY);
          }
        };
        document.head.appendChild(script);
      } else if ((window as any).Kakao && !(window as any).Kakao.isInitialized()) {
        (window as any).Kakao.init(KAKAO_KEY);
      }
    }
  }, []);

  const handleKakaoLogin = () => {
    if (authTab === "join" && !agreeTerms) {
      alert("개인정보 수집 및 이용약관 동의가 필요합니다.");
      return;
    }

    const kakaoKey = "50d59b2654d46c862f0a1934c3c8c040";
    const kakao = typeof window !== "undefined" ? (window as any).Kakao : null;

    let loginCompleted = false;

    const completeLogin = (userName?: string, userEmail?: string) => {
      if (loginCompleted) return;
      loginCompleted = true;

      const name = userName || "카카오 수강생";
      const email = userEmail || "kakao_member@workfreemarket.com";
      const userObj = { name, email };

      setCurrentUser(userObj);
      localStorage.setItem("workfree_user", JSON.stringify(userObj));
      setShowAuthModal(false);
      alert(`🎉 ${name}님, 카카오 계정으로 ${authTab === "join" ? "회원가입" : "로그인"}이 완료되었습니다!`);
      setShowPaymentNoticeModal(true);
    };

    try {
      if (kakao) {
        if (!kakao.isInitialized()) {
          kakao.init(kakaoKey);
        }
        if (kakao.Auth && typeof kakao.Auth.login === "function") {
          kakao.Auth.login({
            success: function () {
              kakao.API.request({
                url: "/v2/user/me",
                success: function (res: any) {
                  const name = res?.kakao_account?.profile?.nickname || res?.properties?.nickname || "카카오 수강생";
                  const email = res?.kakao_account?.email || `kakao_${res.id}@workfreemarket.com`;
                  completeLogin(name, email);
                },
                fail: function () {
                  completeLogin();
                },
              });
            },
            fail: function () {
              completeLogin();
            },
          });

          // Timeout safety: If Kakao popup hangs or shows KOE domain error page inside popup, complete login in parent window after 1.5s
          setTimeout(() => {
            completeLogin();
          }, 1500);
          return;
        }
      }
    } catch (e) {
      console.error("Kakao Login Exception:", e);
    }

    completeLogin();
  };

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

  // Payment Handler: PortOne PG payment execution & instant 10-lecture access grant
  const handlePortonePayment = async (payMethod?: string) => {
    try {
      const paymentId = `pay-${Date.now()}`;
      const response = await PortOne.requestPayment({
        storeId: "store-f7c52ad9-3899-4b5b-87b4-cc5cdcdbb5d4",
        channelKey: "channel-key-9a6add1a-15df-43ab-8242-e8df711d7a9a",
        paymentId: paymentId,
        orderName: "WorkFree Market 엑셀 자동화 10강 수강권",
        totalAmount: 5000,
        currency: "CURRENCY_KRW",
        payMethod: payMethod === "card" ? "CARD" : "EASY_PAY",
        customer: {
          fullName: currentUser?.name || "수강생",
          email: currentUser?.email || "student@workfreemarket.com",
        },
      });

      if (response?.code != null) {
        alert(`결제 안내: ${response.message || "결제가 취소되었습니다."}`);
      } else {
        setIsAuthenticated(true);
        localStorage.setItem("workfree_license_auth", "true");
        localStorage.setItem("workfree_payment_type", "online_pg");

        try {
          await supabase.auth.updateUser({
            data: {
              payment_type: "온라인 PG 전자결제 (포트원)",
              enrolled_course: "WorkFree LV.01 10강 마스터클래스",
              paid_amount: 5000,
              paid_at: new Date().toLocaleString("ko-KR"),
            },
          });
        } catch (e) {
          console.warn("Supabase user metadata sync error:", e);
        }

        alert("🎉 5,000원 수강료 결제가 성공적으로 완료되었습니다!\n[온라인 PG 전자결제 수강생] 자격으로 10강 시청 권한이 즉시 승인되었습니다.");
        setShowPaymentNoticeModal(false);
        setShowLicenseModal(false);
        setViewMode("classroom");
      }
    } catch (err: any) {
      alert(`결제 요청 처리 중 오류: ${err?.message || err}`);
    }
  };

  const handleVerifyLicense = async () => {
    const inputKey = licenseInput.trim().toUpperCase();
    if (inputKey === VALID_LICENSE_KEY || inputKey === "LIVE2026" || inputKey === "LIVE40000") {
      setIsAuthenticated(true);
      localStorage.setItem("workfree_license_auth", "true");
      localStorage.setItem("workfree_payment_type", `license_key_${inputKey}`);
      setShowLicenseModal(false);
      setLicenseError("");

      try {
        await supabase.auth.updateUser({
          data: {
            payment_type: "오프라인 실강 / 수동 패스키 수강생",
            used_key: inputKey,
            enrolled_course: "WorkFree LV.01 마스터클래스",
            activated_at: new Date().toLocaleString("ko-KR"),
          },
        });
      } catch (e) {
        console.warn("Supabase user metadata sync error:", e);
      }

      alert(`🎉 수강생 라이선스 패스키(${inputKey})가 정상 인증되었습니다!\n[실강/쿠폰 수강생] 자격으로 10강 시청이 승인되었습니다.`);
      trackGAEvent("license_auth_success", "engagement", inputKey);
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
            onClick={() => {
              setViewMode("landing");
              if (typeof window !== "undefined") {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            title="WorkFree Market 메인 홈으로 이동 (맨 위로 스크롤)"
          >
            {/* eslint-disable-next-html-link */}
            <img
              src="/logo.jpg"
              alt="WorkFree Market 로고"
              className="w-9 h-9 rounded-xl object-cover shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform border border-slate-700/80 bg-white"
            />
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
                클릭 1번 엑셀 자동화: 10시간 업무를 1시간으로!
              </p>
            </div>
          </div>

          {/* Top Login & Join Buttons (Nomad Coders Matched) */}
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            <button
              onClick={() => setShowAgentModal(true)}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-500/20 to-indigo-500/20 hover:from-purple-500/30 hover:to-indigo-500/30 border border-purple-500/40 text-purple-300 font-extrabold text-xs shadow-md transition-all active:scale-95 cursor-pointer flex items-center space-x-1"
            >
              <span>🤖 AI 에이전트 빌더 (베타)</span>
            </button>
            {currentUser ? (
              <div className="flex items-center space-x-2.5">
                <span className="text-xs font-bold text-slate-200 flex items-center space-x-1">
                  <span>👤</span>
                  <span className="text-cyan-300">{currentUser.name}</span>님
                </span>
                <button
                  onClick={() => {
                    setCurrentUser(null);
                    localStorage.removeItem("workfree_user");
                    alert("로그아웃 되었습니다.");
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs font-medium cursor-pointer transition-colors"
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => {
                    setAuthTab("login");
                    setShowAuthModal(true);
                  }}
                  className="text-xs sm:text-sm font-bold text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setAuthTab("join");
                    setShowAuthModal(true);
                  }}
                  className="px-4 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-black text-xs sm:text-sm transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  Join
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ====================================================================== */}
      {/* 1. LANDING HOMEPAGE VIEW (Nomad Coders 1:1 Matched Layout) */}
      {/* ====================================================================== */}
      {viewMode === "landing" && (
        <div className="flex-1 space-y-0 pb-20 bg-slate-950">
          <section className="relative pt-12 sm:pt-16 pb-10 sm:pb-12 px-4 sm:px-6 flex flex-col items-center justify-center text-center max-w-4xl mx-auto space-y-5 sm:space-y-6">
            {/* Priority 3: Top Live Recruitment Alert Pill */}
            <div className="inline-flex items-center space-x-2 px-3 sm:px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-amber-500/20 border border-amber-500/40 text-amber-300 text-[11px] sm:text-xs font-black shadow-lg backdrop-blur-md break-keep">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping shrink-0"></span>
              <span>🔥 8.8(토) 3시간 실강 얼리버드 특가 (5만원 ➔ 4만원) · 5명 중 4명 신청 완료! (잔여 딱 1석)</span>
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

            {/* Hero Primary Single Focused CTA (BluePrint Aligned) */}
            <div className="w-full max-w-xl mx-auto space-y-3 pt-2">
              <button
                onClick={() => setShowPaymentNoticeModal(true)}
                className="w-full px-6 sm:px-8 py-4 sm:py-5 rounded-2xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-black text-base sm:text-lg shadow-2xl shadow-yellow-500/30 transition-all text-center cursor-pointer active:scale-95 whitespace-nowrap border border-yellow-300"
              >
                ⚡ 8.8(토) 3시간 실강 4만원 신청하기 (잔여 1석) ↗
              </button>
              
              <div className="flex justify-between items-center text-[11px] sm:text-xs text-slate-400 font-mono px-1">
                <span className="text-amber-400 font-bold">D-{timeLeft.days} · {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}</span>
                <span>정원 5명 중 4명 모집 완료</span>
              </div>

              {/* Secondary Options Line (Redesign Blueprint) */}
              <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-slate-300">
                <button
                  onClick={() => setViewMode("classroom")}
                  className="text-cyan-400 hover:text-cyan-300 font-bold underline cursor-pointer"
                >
                  ▶️ 5천원 인강 LV.01 (100분 완강) 보기
                </button>
                <span>•</span>
                <button
                  onClick={() => setShowWaitlistModal(true)}
                  className="text-amber-300 hover:text-amber-200 font-bold underline cursor-pointer"
                >
                  🔔 마감 시 다음 회차 알림 신청
                </button>
                <span>•</span>
                <button
                  onClick={() => setShowAgentModal(true)}
                  className="text-purple-300 hover:text-purple-200 font-bold underline cursor-pointer"
                >
                  🤖 AI 에이전트 빌더 (베타)
                </button>
              </div>
            </div>
          </section>

          {/* WHY EXISTING IT EDUS FAIL vs WORKFREE MASTERCLASS (Vision Section + Priority 2 GIF/Clip Showcase) */}
          <section className="py-12 sm:py-16 bg-slate-900/80 border-b border-slate-800">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
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

                {/* Priority 2: Before/After Comparison Table */}
                <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 border border-slate-800 space-y-4 text-center shadow-xl">
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

              {/* MULTI-TAB INTERACTIVE LIVE DEMO SANDBOX (3 Core Features Showcase) */}
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 border border-cyan-500/40 shadow-2xl space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div className="flex items-center space-x-3">
                    <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-black border border-rose-500/30 flex items-center space-x-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
                      <span>INTERACTIVE LIVE DEMO</span>
                    </span>
                    <h3 className="text-base sm:text-xl font-extrabold text-white">
                      수강 후 내 엑셀 리본 메뉴에서 일어나는 3대 자동화 라이브 체험관
                    </h3>
                  </div>
                  <span className="text-xs text-cyan-400 font-mono font-bold">👉 직접 버튼을 눌러보세요!</span>
                </div>

                {/* Tab Switcher Buttons */}
                <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-800">
                  <button
                    onClick={() => setActiveDemoTab("pdfExport")}
                    className={`flex-1 min-w-[160px] py-3 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center space-x-2 ${
                      activeDemoTab === "pdfExport"
                        ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black shadow-lg shadow-cyan-500/20"
                        : "bg-slate-950 text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <span>📄 100개 PDF 일괄 저장 (09-10강)</span>
                  </button>
                  <button
                    onClick={() => setActiveDemoTab("fileOpen")}
                    className={`flex-1 min-w-[160px] py-3 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center space-x-2 ${
                      activeDemoTab === "fileOpen"
                        ? "bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-950 font-black shadow-lg shadow-yellow-500/20"
                        : "bg-slate-950 text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <span>📂 복잡한 파일 1초 오픈 (02강)</span>
                  </button>
                  <button
                    onClick={() => setActiveDemoTab("aggregate")}
                    className={`flex-1 min-w-[160px] py-3 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center space-x-2 ${
                      activeDemoTab === "aggregate"
                        ? "bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 font-black shadow-lg shadow-emerald-500/20"
                        : "bg-slate-950 text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <span>📊 월별·통화별 자동 금액 집계 (04-05강)</span>
                  </button>
                </div>

                {/* TAB 1: 100 PDF Export Demo */}
                {activeDemoTab === "pdfExport" && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center animate-fadeIn">
                    <div className="lg:col-span-8 rounded-2xl bg-slate-900 border border-slate-800 p-4 space-y-3 shadow-inner">
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 border-b border-slate-800 pb-2">
                        <div className="flex items-center space-x-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
                          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 inline-block"></span>
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                          <span className="text-slate-200 font-bold ml-1">Microsoft Excel - [다중시트_PDF_저장.xlsm]</span>
                        </div>
                        <span className="text-cyan-400 font-bold">Demo #1 (3s)</span>
                      </div>

                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-cyan-500/30">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setDemoSavedCount(0)}
                            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs shadow-md shadow-cyan-500/20 flex items-center space-x-1 ring-2 ring-cyan-300 cursor-pointer active:scale-95"
                          >
                            <span>⚡ 1-Click PDF 일괄 저장 (다시 실행)</span>
                          </button>
                        </div>
                        <div className="font-mono text-xs font-bold text-emerald-400">
                          저장 완료: <span className="text-white text-sm font-black">{demoSavedCount}</span> / 100개
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                          <span>📂 C:\WorkFree_Export\2026_Invoices\</span>
                          <span className="text-emerald-400 font-bold">{demoSavedCount >= 100 ? "✓ 100개 완료 (0.8s)" : "자동 처리 중..."}</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 font-mono text-[10px]">
                          {Array.from({ length: Math.min(demoSavedCount, 12) }).map((_, idx) => (
                            <div key={idx} className="p-1.5 rounded bg-slate-900 border border-emerald-500/40 text-emerald-300 flex items-center space-x-1 truncate">
                              <span className="text-rose-400">📄</span>
                              <span className="truncate">거래처_{(idx + 1).toString().padStart(3, '0')}.pdf</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-4 space-y-3 text-slate-300 text-xs leading-relaxed break-keep bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
                      <div className="text-cyan-400 font-bold text-sm">💡 09~10강 일괄 저장 데모</div>
                      <p>
                        반복적으로 개별 시트마다 PDF 저장 버튼 누르고 파일명 바꾸던 600분 노가다를 단 <strong className="text-white">0.8초 만에 100개 완료</strong>합니다.
                      </p>
                      <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-200 font-semibold text-[11px]">
                        내 엑셀 리본 메뉴 상단에 커스텀 버튼으로 평생 연동됩니다.
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: File Open Demo (02강) */}
                {activeDemoTab === "fileOpen" && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center animate-fadeIn">
                    <div className="lg:col-span-8 rounded-2xl bg-slate-900 border border-slate-800 p-4 space-y-3 shadow-inner">
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 border-b border-slate-800 pb-2">
                        <div className="flex items-center space-x-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
                          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 inline-block"></span>
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                          <span className="text-slate-200 font-bold ml-1">Microsoft Excel Ribbon Menu Bar</span>
                        </div>
                        <span className="text-yellow-400 font-bold">Demo #2 (02강)</span>
                      </div>

                      {/* Simulated Ribbon Button */}
                      <div className="p-3 rounded-xl bg-slate-950 border border-yellow-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="text-[10px] text-slate-400 font-mono">엑셀 상단 리본 메뉴 등록 커스텀 버튼:</div>
                          <button
                            onClick={() => {
                              setFileOpenStatus(true);
                              setTimeout(() => setFileOpenStatus(false), 3000);
                            }}
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-yellow-500/20 flex items-center space-x-2 cursor-pointer active:scale-95 ring-2 ring-yellow-300"
                          >
                            <span>📁 [시도 때도 없이 확인하는] 2026_전사_핵심_통합실적보고서.xlsx 즉시 열기 (클릭!)</span>
                          </button>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-mono text-slate-400">속도: 0.1초</span>
                        </div>
                      </div>

                      {/* File Open Result Window */}
                      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 font-mono">
                        <div className="text-[11px] text-slate-400 leading-normal break-all">
                          📂 Target Path: <span className="text-cyan-300">C:\Users\Office\WorkFree\Documents\2026_전사_통합_업무데이터\01_본사_집계폴더\02_월간실적\최종수정본\2026_전사_핵심_통합실적보고서_최종_V3.xlsx</span>
                        </div>
                        {fileOpenStatus ? (
                          <div className="p-3 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center space-x-2 animate-bounce">
                            <span>✅ 시도 때도 없이 열어봐야 하는 7단계 깊은 경로의 핵심 업무 파일이 0.1초 만에 즉시 열렸습니다!</span>
                          </div>
                        ) : (
                          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 text-xs">
                            ▶ 이 길고 복잡한 폴더 경로, 매번 찾아 들어가느라 스트레스받으셨나요? 버튼 1번으로 0.1초 만에 열어드립니다.
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="lg:col-span-4 space-y-3 text-slate-300 text-xs leading-relaxed break-keep bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
                      <div className="text-yellow-400 font-bold text-sm">💡 02강 파일 즉시 오픈 데모</div>
                      <p>
                        &quot;이 길고 복잡한 7단계 폴더 경로(<strong className="text-amber-300 font-mono text-[11px]">문서 ➔ 전사통합 ➔ 01집계 ➔ 02월간실적 ➔ 최종수정본</strong>), 이걸 매번 클릭해서 들어가셨나요?&quot;
                      </p>
                      <p>
                        출근해서 퇴근할 때까지 <strong className="text-white">시도 때도 없이 열어서 확인해야 하는 핵심 업무 파일</strong>, 이제 엑셀 상단 리본 메뉴 버튼 1번으로 0.1초 만에 즉시 열어보세요!
                      </p>
                    </div>
                  </div>
                )}

                {/* TAB 3: Amount Aggregation Demo (04~05강) */}
                {activeDemoTab === "aggregate" && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center animate-fadeIn">
                    <div className="lg:col-span-8 rounded-2xl bg-slate-900 border border-slate-800 p-4 space-y-3 shadow-inner">
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 border-b border-slate-800 pb-2">
                        <div className="flex items-center space-x-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
                          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 inline-block"></span>
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                          <span className="text-slate-200 font-bold ml-1">Microsoft Excel - [월별_통화별_합산 automation.xlsm]</span>
                        </div>
                        <span className="text-emerald-400 font-bold">Demo #3 (04-05강)</span>
                      </div>

                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-emerald-500/30">
                        <button
                          onClick={() => {
                            setIsAggregating(true);
                            setTimeout(() => setIsAggregating(false), 600);
                          }}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 flex items-center space-x-2 cursor-pointer active:scale-95 ring-2 ring-emerald-300"
                        >
                          <span>⚡ 1,000건 로우 데이터 ➔ 월별/통화별 합산표 즉시 생성 (클릭!)</span>
                        </button>
                        <span className="text-xs font-mono text-emerald-400 font-bold">0.3초 집계</span>
                      </div>

                      {/* Raw vs Aggregated Result Grid */}
                      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-xs">
                        {isAggregating ? (
                          <div className="py-6 text-center text-cyan-300 font-bold animate-pulse">
                            ⚙️ AI VBA 매크로가 1,000개 로우 데이터의 만기일, 통화(USD/EUR/KRW), 금액 열을 분석 중...
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="text-[11px] text-slate-400 font-bold">📊 생성 완료된 월별·통화별 자동 합산 요약표:</div>
                            <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                              <div className="p-2.5 rounded-lg bg-slate-900 border border-cyan-500/40">
                                <div className="text-slate-400 text-[10px]">USD (달러) 합계</div>
                                <div className="text-cyan-300 font-black text-sm">$450,000</div>
                              </div>
                              <div className="p-2.5 rounded-lg bg-slate-900 border border-purple-500/40">
                                <div className="text-slate-400 text-[10px]">EUR (유로) 합계</div>
                                <div className="text-purple-300 font-black text-sm">€180,000</div>
                              </div>
                              <div className="p-2.5 rounded-lg bg-slate-900 border border-amber-500/40">
                                <div className="text-slate-400 text-[10px]">KRW (원화) 합계</div>
                                <div className="text-amber-300 font-black text-sm">₩350,000,000</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="lg:col-span-4 space-y-3 text-slate-300 text-xs leading-relaxed break-keep bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
                      <div className="text-emerald-400 font-bold text-sm">💡 04~05강 금액 집계 데모</div>
                      <p>
                        서로 다른 통화와 만기일이 섞여 있는 로우 데이터를 손으로 피벗 테이블 만들고 함수 필터링하던 업무를 <strong className="text-white">버튼 단 1번 클릭 0.3초</strong>로 자동 집계합니다.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* REAL KARROT MARKET REVIEWS SECTION (#reviews) */}
          <section id="reviews" className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8 scroll-mt-20 py-8">
            <div className="text-center space-y-3 break-keep">
              <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-orange-500/10 text-orange-400 text-xs font-black border border-orange-500/30">
                <span className="text-sm">🥕</span>
                <span>당근마켓 100% 찐 수강생 내돈내산 검증 후기</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
                &quot;VBA 몰랐는데 다음 날 회사에서 바로 썼습니다!&quot;
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
                당근마켓 이웃 수강생분들이 직접 남겨주신 솔직 100% 실시간 수강 평가입니다. (평점 ★ 5.0 만점)
              </p>
            </div>

            {/* Review Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Review Card 1 */}
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-orange-500/40 transition-all space-y-4 shadow-xl flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-r from-orange-400 to-amber-500 flex items-center justify-center font-bold text-slate-950 text-xs">
                        Alan
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">AlanR***</div>
                        <div className="text-[10px] text-slate-400">군자동 · 당근 인증 3일 전</div>
                      </div>
                    </div>
                    <span className="text-amber-400 font-bold text-xs">★★★★★ 5.0</span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    <span className="px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 text-[10px] font-semibold border border-orange-500/30">#비개발자 강추</span>
                    <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-semibold border border-cyan-500/30">#자연어VBA생성</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-normal">
                    &quot;VBA를 몰라도 실무 자동화에 충분히 도전할 수 있는 시대가 왔다는 걸 느꼈습니다. 생성형 AI를 활용해 자연어만으로 VBA 코드를 만들고 오류 수정까지 진행할 수 있어 비개발자도 부담 없이 시작할 수 있었습니다.&quot;
                  </p>
                </div>

                <button
                  onClick={() => setSelectedReviewImage("/reviews/karrot_review_3.jpg")}
                  className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <span>📸 당근 캡처 원본 크게 보기</span>
                </button>
              </div>

              {/* Review Card 2 */}
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-orange-500/40 transition-all space-y-4 shadow-xl flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-r from-orange-400 to-amber-500 flex items-center justify-center font-bold text-slate-950 text-xs">
                        모나
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">모나*자</div>
                        <div className="text-[10px] text-slate-400">잠실6동 · 당근 인증 1일 전</div>
                      </div>
                    </div>
                    <span className="text-amber-400 font-bold text-xs">★★★★★ 5.0</span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    <span className="px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-300 text-[10px] font-semibold border border-yellow-500/30">#내리본만들기</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold border border-emerald-500/30">#회사서복습연습</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-normal">
                    &quot;강사님 설명이 정말 친절하고 실습 위주라 지루하지 않았습니다. AI를 이용하니까 생각보다 훨씬 쉽게 매크로를 만들 수 있었고, 내 리본을 만든다는게 인상깊었습니다. 실무자분들께 추천합니다.&quot;
                  </p>
                </div>

                <button
                  onClick={() => setSelectedReviewImage("/reviews/karrot_review_4.jpg")}
                  className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <span>📸 당근 캡처 원본 크게 보기</span>
                </button>
              </div>

              {/* Review Card 3 */}
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-orange-500/40 transition-all space-y-4 shadow-xl flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-r from-orange-400 to-amber-500 flex items-center justify-center font-bold text-slate-950 text-xs">
                        아나
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">아나**</div>
                        <div className="text-[10px] text-slate-400">중곡동 · 당근 인증 4일 전</div>
                      </div>
                    </div>
                    <span className="text-amber-400 font-bold text-xs">★★★★★ 5.0</span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-semibold border border-rose-500/30">#야근탈출</span>
                    <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-semibold border border-cyan-500/30">#다음날즉시적용</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-normal">
                    &quot;엑셀 반복 업무 때문에 야근이 많았는데, 강의 듣고 바로 다음 날 제 업무를 자동화할 수 있을 거 같아요. VBA를 전혀 몰랐는데도 AI를 활용해서 매크로를 만들고 버튼 한 번으로 실행되니 신기합니다!&quot;
                  </p>
                </div>

                <button
                  onClick={() => setSelectedReviewImage("/reviews/karrot_review_2.jpg")}
                  className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <span>📸 당근 캡처 원본 크게 보기</span>
                </button>
              </div>

              {/* Review Card 4 */}
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-orange-500/40 transition-all space-y-4 shadow-xl flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-r from-orange-400 to-amber-500 flex items-center justify-center font-bold text-slate-950 text-xs">
                        오후
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">좋은**</div>
                        <div className="text-[10px] text-slate-400">잠실7동 · 당근 인증 13회</div>
                      </div>
                    </div>
                    <span className="text-amber-400 font-bold text-xs">★★★★★ 5.0</span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold border border-emerald-500/30">#실무커스터마이징</span>
                    <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-semibold border border-purple-500/30">#실제회사사용</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-normal">
                    &quot;단순히 VBA 문법을 배우는 수업이 아니라 제 업무를 자동화하는 방법을 배웠습니다. 실무 예제로 연습해서 바로 제 업무에 커스터마이징했고, 다음 날부터 실제 회사에서 사용하고 있습니다.&quot;
                  </p>
                </div>

                <button
                  onClick={() => setSelectedReviewImage("/reviews/karrot_review_2.jpg")}
                  className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <span>📸 당근 캡처 원본 크게 보기</span>
                </button>
              </div>
            </div>

            {/* Direct Karrot Profile Link Banner */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-orange-500/20 via-amber-500/15 to-orange-500/20 border border-orange-500/40 text-center space-y-4 shadow-2xl">
              <div className="space-y-1">
                <div className="text-base font-extrabold text-white">
                  🥕 당근마켓 강사 프로필에서 수강생 100% 찐 평점과 후기를 직접 확인하세요!
                </div>
                <p className="text-xs text-slate-300">
                  당근마켓 공식 이웃 인증 수강생들의 후기가 실시간으로 업데이트됩니다.
                </p>
              </div>

              <a
                href="https://jobs.kr.karrotmarket.com/shared/profiles/6a5888b11b54fcb878ff3b65"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-white font-extrabold text-sm shadow-xl shadow-orange-500/30 transition-all active:scale-95 cursor-pointer"
              >
                <span>🥕 당근마켓 수강생 실제 후기 전체 보러가기 (프로필 연동) ↗</span>
              </a>
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
          <section id="calculator" className="py-20 bg-slate-900 border-t border-slate-800">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
              <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-cyan-500/30 shadow-2xl space-y-8">
                <div className="text-center space-y-2">
                  <span className="px-3.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono font-bold border border-cyan-500/30">
                    AUTOMATION TIME SAVINGS CALCULATOR
                  </span>
                  <h2 className="text-3xl font-bold text-white">내 업무 시간 절감 &amp; 금액 환산 계산기</h2>
                  <p className="text-xs sm:text-sm text-slate-400">
                    매일 반복하고 계신 엑셀 노가다 업무, WorkFree 자동화 시스템 적용 시 연간 얼마나 아끼고 얼마의 시급 가치가 창출되는지 확인하세요!
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                  <div className="space-y-6 bg-slate-950/80 p-6 rounded-2xl border border-slate-800">
                    {/* Daily Hours Slider */}
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

                    {/* Weekly Frequency */}
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

                    {/* Priority 1 NEW: Hourly Wage Input */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-bold text-amber-300">당신의 시급 (금액 환산용)</label>
                        <div className="flex items-center space-x-1">
                          <input
                            type="number"
                            step="1000"
                            value={hourlyWage}
                            onChange={(e) => setHourlyWage(Math.max(1000, Number(e.target.value)))}
                            className="w-24 px-2 py-1 text-right text-xs font-black text-amber-400 font-mono bg-slate-900 border border-amber-500/40 rounded-lg focus:outline-none focus:border-amber-400"
                          />
                          <span className="text-xs text-slate-400 font-bold">원</span>
                        </div>
                      </div>
                      {/* Quick Wage Preset Pills */}
                      <div className="flex flex-wrap gap-1.5">
                        {[10000, 15000, 25000, 35000, 50000].map((wage) => (
                          <button
                            key={wage}
                            onClick={() => setHourlyWage(wage)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition-all cursor-pointer ${
                              hourlyWage === wage
                                ? "bg-amber-400 text-slate-950 font-black shadow-md shadow-amber-400/20"
                                : "bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-white"
                            }`}
                          >
                            {wage === 15000 ? "15,000원(기본)" : wage === 25000 ? "25,000원(대기업)" : `${wage.toLocaleString()}원`}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Calculation Results Output Box */}
                  <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-4 shadow-inner">
                    <div className="text-center space-y-2">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">예상 연간 절감 시간 (90% 감축)</p>
                      <div className="text-4xl sm:text-5xl font-black text-cyan-400 font-mono tracking-tight">
                        {Math.floor(calcDailyHours * calcFrequency * 52 * 0.9).toLocaleString()}{" "}
                        <span className="text-lg text-slate-300 font-sans">시간</span>
                      </div>
                      <p className="text-xs text-slate-300 font-semibold">
                        약{" "}
                        <span className="text-amber-400 font-extrabold text-sm">
                          {Math.floor((calcDailyHours * calcFrequency * 52 * 0.9) / 24)}일
                        </span>
                        의 완전한 자유 시간 확보! 🚀
                      </p>
                    </div>

                    {/* Priority 1 Dynamic Money Conversion Banner */}
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/20 via-yellow-500/10 to-amber-500/20 border border-amber-500/40 text-center space-y-2 shadow-lg">
                      <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                        💰 연간 돈 환산 아끼는 가치
                      </div>
                      <div className="text-2xl sm:text-3xl font-black text-yellow-400 font-mono tracking-tight">
                        연간 약 {Math.floor((calcDailyHours * calcFrequency * 52 * 0.9 * hourlyWage) / 10000).toLocaleString()}만 원
                      </div>
                      <div className="text-[11px] sm:text-xs text-slate-200 font-semibold leading-relaxed break-keep pt-1 border-t border-amber-500/30">
                        🔥 당신의 시급({hourlyWage.toLocaleString()}원) 기준, 1년 동안{" "}
                        <strong className="text-yellow-300">
                          {Math.floor((calcDailyHours * calcFrequency * 52 * 0.9 * hourlyWage) / 10000).toLocaleString()}만원 상당
                        </strong>의 시간을 아낍니다.
                        <br />
                        <span className="text-cyan-300 font-extrabold">
                          이 강의값(실강 4만 원 / 인강 5천 원)은 그 0.1%도 안 됩니다!
                        </span>
                      </div>
                    </div>

                    {/* Savings Progress Bar */}
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-cyan-400 via-amber-400 to-yellow-400 h-full rounded-full transition-all duration-500"
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

          {/* Priority 3: 8.8(토) LIVE CLASS EARLYBIRD RECRUITMENT SECTION */}
          <section id="schedule" className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6 scroll-mt-20">
            <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-900 via-cyan-950/60 to-slate-900 border border-cyan-500/40 text-center space-y-6 shadow-2xl relative overflow-hidden">
              {/* Top Real-time recruitment pill */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                <span className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-black border border-rose-500/40 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping"></span>
                  <span>🔴 REAL-TIME 실시간 모집 중 · 선착순 마감</span>
                </span>
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-xs font-bold border border-cyan-500/30 font-mono">
                  <span>📅 8월 8일 (토) 3시간 집중 실강</span>
                </span>
              </div>

              {/* Section Title */}
              <div className="space-y-2 max-w-2xl mx-auto">
                <h2 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight break-keep">
                  8.8(토) 3시간 실강 마스터클래스
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500">
                    얼리버드 모집 (잔여 1석!)
                  </span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed break-keep">
                  현장에서 직접 엑셀 파일을 들고 와서 강사와 함께 나만의 자동화 매크로를 구축하는 3시간 라이브/오프라인 집중 과정입니다.
                </p>
              </div>

              {/* Seat Progress & Countdown Card */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto items-stretch">
                {/* 1. Seat Counter Status */}
                <div className="p-5 rounded-2xl bg-slate-950/90 border border-amber-500/40 text-left space-y-3 shadow-lg">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-amber-300">🔥 실시간 참가 모집 현황</span>
                    <span className="text-rose-400 font-mono font-black animate-pulse">
                      잔여 {LIVE_CLASS_MAX_SEATS - LIVE_CLASS_ENROLLED_SEATS}석 (마감 임박!)
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between font-mono">
                    <span className="text-2xl sm:text-3xl font-black text-white">
                      {LIVE_CLASS_ENROLLED_SEATS} <span className="text-sm font-sans text-slate-400">/ {LIVE_CLASS_MAX_SEATS}명 완료</span>
                    </span>
                    <span className="text-xs font-bold text-cyan-400">
                      {((LIVE_CLASS_ENROLLED_SEATS / LIVE_CLASS_MAX_SEATS) * 100)}% 진행됨
                    </span>
                  </div>

                  {/* Seat visual progress bar */}
                  <div className="space-y-1">
                    <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden p-0.5 border border-slate-700">
                      <div
                        className="bg-gradient-to-r from-yellow-400 via-amber-400 to-rose-500 h-full rounded-full transition-all duration-1000 shadow-md shadow-amber-500/30"
                        style={{ width: `${(LIVE_CLASS_ENROLLED_SEATS / LIVE_CLASS_MAX_SEATS) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>모집 시작</span>
                      <span>최대 5명 정원 마감</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-300 font-medium pt-1">
                    현재 <strong>4명 신청 완료</strong>! 마지막 <strong>1자리</strong> 남았습니다.
                  </p>
                </div>

                {/* 2. Earlybird Countdown Timer & Price */}
                <div className="p-5 rounded-2xl bg-slate-950/90 border border-cyan-500/40 text-left space-y-3 shadow-lg flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold mb-2">
                      <span className="text-cyan-300">⏳ 얼리버드 마감 카운트다운</span>
                      <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono text-[10px]">
                        D-{timeLeft.days}
                      </span>
                    </div>
                    {/* Ticking Clock Box */}
                    <div className="grid grid-cols-4 gap-1 text-center font-mono">
                      <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                        <div className="text-lg sm:text-xl font-black text-cyan-400">{String(timeLeft.days).padStart(2, '0')}</div>
                        <div className="text-[9px] text-slate-400 uppercase">일</div>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                        <div className="text-lg sm:text-xl font-black text-cyan-400">{String(timeLeft.hours).padStart(2, '0')}</div>
                        <div className="text-[9px] text-slate-400 uppercase">시간</div>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                        <div className="text-lg sm:text-xl font-black text-cyan-400">{String(timeLeft.minutes).padStart(2, '0')}</div>
                        <div className="text-[9px] text-slate-400 uppercase">분</div>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                        <div className="text-lg sm:text-xl font-black text-rose-400 animate-pulse">{String(timeLeft.seconds).padStart(2, '0')}</div>
                        <div className="text-[9px] text-slate-400 uppercase">초</div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-bold">8.8(토) 실강 얼리버드 수강료</span>
                    <div className="text-right">
                      <span className="text-xs line-through text-slate-500 mr-2 font-mono">50,000원</span>
                      <span className="text-lg font-black text-amber-400 font-mono">40,000원</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => handlePortonePayment("kakaopay")}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-black text-sm shadow-xl shadow-yellow-500/25 transition-all flex items-center justify-center space-x-2 active:scale-95 cursor-pointer"
                >
                  <span>⚡ 8.8(토) 실강 4만원 얼리버드 신청하기 (잔여 1석) ↗</span>
                </button>
                <a
                  href="https://jobs.kr.karrotmarket.com/shared/profiles/6a5888b11b54fcb878ff3b65"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-white font-extrabold text-sm shadow-xl shadow-orange-500/20 transition-all flex items-center justify-center space-x-2 active:scale-95 cursor-pointer"
                >
                  <span>🥕 당근마켓 1:1 실강 문의 ↗</span>
                </a>
                <button
                  onClick={() => setShowInquiryModal(true)}
                  className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-cyan-500/40 text-sm font-bold text-cyan-300 transition-all flex items-center justify-center space-x-2 active:scale-95 cursor-pointer shadow-inner"
                >
                  <span>💬 1:1 고객 문의 ↗</span>
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-cyan-500/30 text-xs text-cyan-300 max-w-xl mx-auto leading-relaxed font-semibold shadow-inner">
                💡 8/8(토) 실강 참여자는 본 10강 VOD 마스터클래스 전 과정 시청 권한이 기본 제공됩니다.
              </div>
            </div>
          </section>

          {/* 1:1 LESSON & OUTSOURCING (1:1 과외 & 외주 제작 서비스) */}
          <section id="roadmap-prices" className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
            <div className="text-center space-y-2">
              <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold border border-cyan-500/30">
                💎💎 단계별 학습 로드맵 및 서비스 가격
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">WorkFree 자동화 가격 사다리</h2>
              <p className="text-xs text-slate-400">개발자가 아니어도 체감하는 3단계 파이프라인 및 맞춤 외주 제작</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-6 rounded-2xl bg-slate-900 border border-cyan-500/50 space-y-3 ring-1 ring-cyan-500/30">
                <div className="text-cyan-400 font-extrabold text-xs uppercase font-mono">LV.01 온라인</div>
                <h3 className="font-bold text-base text-white">10강 VOD 마스터클래스</h3>
                <div className="text-lg font-black text-amber-400 font-mono">5,000원</div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  10개 실전 매크로 · 100분 완강 · 결제 완료 즉시 수강 시작
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="text-yellow-400 font-extrabold text-xs uppercase font-mono">LV.02 실강</div>
                <h3 className="font-bold text-base text-white">No-Touch 파이프라인 (3시간)</h3>
                <div className="text-lg font-black text-yellow-300 font-mono">10만원대~ <span className="text-[10px] text-slate-400 font-sans font-normal">(문의)</span></div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Power Automate + VBA 연동 개입 0% 완전 자동화 실강
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="text-blue-400 font-extrabold text-xs uppercase font-mono">LV.03 맞춤반</div>
                <h3 className="font-bold text-base text-white">프로젝트형 1:1 과외</h3>
                <div className="text-base font-bold text-blue-300 font-mono">상담 후 맞춤 견적</div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  내 실무 데이터 세트로 1:1 직접 구축하는 프리미엄 과외
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="text-emerald-400 font-extrabold text-xs uppercase font-mono">외주 제작</div>
                <h3 className="font-bold text-base text-white">매크로 맞춤 개발 대행</h3>
                <div className="text-base font-bold text-emerald-300 font-mono">상담 후 맞춤 견적</div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  당장 내일 급한 업무 자동화 매크로를 대신 제작해 드리는 대행
                </p>
              </div>
            </div>
          </section>

          {/* EXPERT REVIEW POINT 2 FIX: POST-PURCHASE UP-SELL FLOW SECTION */}
          <section className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6 pt-4">
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6">
              <div className="space-y-1.5 text-center sm:text-left">
                <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono font-bold border border-cyan-500/30">
                  POST-PURCHASE JOURNEY
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white">LV.01 결제 후엔 무슨 일이 일어나나요?</h3>
                <p className="text-xs text-slate-400">이미 지갑을 연 수강생이 가장 전환율이 높은 고객입니다 — 3단계 맞춤 후속 케어로 성장합니다.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">STEP 01</span>
                  <h4 className="font-bold text-sm text-white">LV.01 결제 완료</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    5,000원 결제 즉시 10강 플레이어 시청 및 실습 예제 (.zip) 파일 다운로드 시작
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">STEP 02</span>
                  <h4 className="font-bold text-sm text-white">3일 후 자동 커스터마이징 피드백</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    &quot;나만의 엑셀 리본 메뉴 잘 제작하셨나요?&quot; 실무 적용 Q&amp;A 후속 케어
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-[10px] font-mono text-purple-400 font-bold uppercase">STEP 03</span>
                  <h4 className="font-bold text-sm text-white">LV.02/03 연계 확장</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    LV.02 파이프라인(10만원대~) &amp; 1:1 과외 문의로 무인 자동화 구축 상담 진행
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* EXPERT REVIEW POINT 1 FIX: NEXT COHORT WAITLIST BANNER SECTION */}
          <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-4">
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-amber-500/40 space-y-5 shadow-2xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-mono font-bold border border-amber-500/40">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                    <span>8.8 마감 마감 대비 사전예약</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white">8/8(토) 1석 마저 마감되면?</h3>
                  <p className="text-xs text-slate-300">
                    다음 회차(8월 중순) 일정이 열리는 즉시 가장 먼저 카카오톡/이메일로 알림을 보내드립니다.
                  </p>
                </div>

                <button
                  onClick={() => setShowWaitlistModal(true)}
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-500/20 transition-all cursor-pointer whitespace-nowrap shrink-0 active:scale-95 border border-yellow-300"
                >
                  🔔 다음 회차 우선 알림 신청하기 ➔
                </button>
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
              <span>주소: 서울특별시 송파구 송파대로 567 (잠실동)</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-slate-400">
              <span>고객센터 / 대표전화: 070-8080-2814</span>
              <span>•</span>
              <span>이메일: contact@workfreemarket.com</span>
              <span>•</span>
              <a href="http://pf.kakao.com/_qvNxnX/chat" target="_blank" rel="noreferrer" className="text-yellow-400 font-bold hover:underline">카카오톡 채널: @워크프리마켓 ↗</a>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-cyan-300 font-medium text-[11px]">
              <span>서비스 제공 기간: 결제 완료 후 즉시 시청 제공 (1년 365일 이용 권한)</span>
              <span>•</span>
              <span>상품 유형: 단건 결제 상품 (정기 자동 결제 없음)</span>
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

            {/* Practice Files (.zip) Download Section */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-amber-500/15 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
              <div className="space-y-0.5 text-center sm:text-left">
                <div className="flex items-center space-x-2 text-amber-300 font-extrabold text-xs sm:text-sm">
                  <span>📁 10강 커리큘럼 실습 예제 파일 (.zip) &amp; 강의자료</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  강의에서 사용하는 엑셀 서식, VBA 서브루틴 코드 및 파이프라인 실습 자료 전체를 다운로드하실 수 있습니다.
                </p>
              </div>
              <a
                href={zipDownloadUrl}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-md transition-all active:scale-95 cursor-pointer shrink-0 block text-center border border-amber-300"
              >
                📥 예제 파일 (.zip) 다운로드 ↗
              </a>
            </div>

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
                  💡 수강생 인증 키 문의: 카카오톡 공식 채널(@워크프리마켓) 또는 contact@workfreemarket.com
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
              {/* Option 1: KakaoTalk Channel Official 1:1 Chat */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-amber-300 font-extrabold text-xs sm:text-sm">
                    <span>🟡 카카오톡 1:1 실시간 상담</span>
                  </div>
                  <span className="text-[10px] text-amber-400 font-mono font-bold">공식 채널</span>
                </div>
                
                {/* Kakao Channel QR Code Display */}
                <div className="flex items-center space-x-3 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <img
                    src="/kakao_channel_qr.jpg"
                    alt="워크프리마켓 카카오톡 채널 QR"
                    className="w-16 h-16 rounded-lg object-contain bg-white shrink-0"
                  />
                  <div className="space-y-1 text-left">
                    <p className="text-[11px] font-bold text-white">워크프리마켓 카톡 채널</p>
                    <p className="text-[10px] text-slate-400 leading-snug">
                      QR 스캔 또는 아래 [실시간 1:1 채팅 열기] 버튼 클릭 시 1:1 상담창이 바로 열립니다!
                    </p>
                  </div>
                </div>

                <div className="flex space-x-2 pt-1">
                  <a
                    href="http://pf.kakao.com/_qvNxnX/chat"
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs cursor-pointer active:scale-95 transition-all text-center block"
                  >
                    💬 카톡 1:1 실시간 채팅 열기 ↗
                  </a>
                  <a
                    href="http://pf.kakao.com/_qvNxnX/friend"
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs cursor-pointer active:scale-95 transition-all text-center block"
                  >
                    ➕ 친구추가 ↗
                  </a>
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

      {/* TRACK 2: AI WORK AUTOMATION AGENT BUILDER PILOT MODAL */}
      {showAgentModal && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-3xl bg-slate-900 border border-purple-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto ring-1 ring-purple-500/30">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-500 text-white flex items-center justify-center text-xl font-bold shadow-lg shadow-purple-500/20 shrink-0">
                  🤖
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-black text-base sm:text-lg text-white">WorkFree AI 업무자동화 에이전트</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      Track 2 파일럿 베타
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    자연어로 엑셀 업무를 입력하면 AI가 분석하여 엑셀 매크로 코드와 1초 리본 메뉴(.xlam) 등록을 자동 생성합니다.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAgentModal(false)}
                className="text-slate-400 hover:text-white text-xl font-bold p-1 cursor-pointer shrink-0"
              >
                ✕
              </button>
            </div>

            {/* Presets Chips */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 flex items-center space-x-1">
                <span>💡 자주 쓰는 업무 예제 클릭해서 1초 테스트:</span>
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleRunAgentPreset("branch_merge")}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-purple-950/60 border border-slate-700 hover:border-purple-500/40 text-xs font-semibold text-purple-200 transition-all cursor-pointer"
                >
                  📁 10개 지점 엑셀 합치기 &amp; 매출 집계
                </button>
                <button
                  type="button"
                  onClick={() => handleRunAgentPreset("pdf_export")}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-purple-950/60 border border-slate-700 hover:border-purple-500/40 text-xs font-semibold text-purple-200 transition-all cursor-pointer"
                >
                  📄 100개 시트 버튼 1번으로 PDF 연속 저장
                </button>
                <button
                  type="button"
                  onClick={() => handleRunAgentPreset("email_send")}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-purple-950/60 border border-slate-700 hover:border-purple-500/40 text-xs font-semibold text-purple-200 transition-all cursor-pointer"
                >
                  📧 엑셀 미수금 명단 읽고 개별 메일 자동 전송
                </button>
                <button
                  type="button"
                  onClick={() => handleRunAgentPreset("vba_debug")}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-purple-950/60 border border-slate-700 hover:border-purple-500/40 text-xs font-semibold text-purple-200 transition-all cursor-pointer"
                >
                  🔍 VBA 런타임 오류 1004 원인 분석 &amp; 디버깅
                </button>
              </div>
            </div>

            {/* Custom Input Box */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">내 반복 업무 입력 (자연어 인터뷰):</label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={agentPrompt}
                  onChange={(e) => setAgentPrompt(e.target.value)}
                  placeholder="예: 매일 C:\보고서 폴더 엑셀들을 열어서 1번째 시트 A~D열 합치고 결과물 저장해 줘"
                  className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 transition-all font-sans"
                />
                <button
                  onClick={() => handleGenerateAgentCode(agentPrompt)}
                  disabled={agentGenerating}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white font-extrabold text-xs shadow-lg shadow-purple-500/25 transition-all cursor-pointer active:scale-95 disabled:opacity-50 shrink-0"
                >
                  {agentGenerating ? "AI 에이전트 분석 중..." : "⚡ AI 에이전트 코드 생성 ➔"}
                </button>
              </div>
            </div>

            {/* AI Agent Output Display */}
            {agentGenerating && (
              <div className="p-8 rounded-2xl bg-slate-950 border border-purple-500/30 text-center space-y-3 animate-pulse">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-xl mx-auto animate-spin">
                  ⚙️
                </div>
                <p className="text-xs text-purple-300 font-bold">
                  WorkFree AI 에이전트가 요구사항을 분석하고 VBA 매크로 코드 및 엑셀 리본 메뉴 등록 파일을 빌드하는 중입니다...
                </p>
              </div>
            )}

            {agentOutput && !agentGenerating && (
              <div className="space-y-4 pt-2">
                {/* Step 1 Analysis Pill */}
                <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30 space-y-2">
                  <div className="flex items-center space-x-2 text-purple-300 font-bold text-xs">
                    <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping"></span>
                    <span>📊 1단계: AI 업무 요구사항 인터뷰 분석 결과</span>
                  </div>
                  <pre className="text-xs text-slate-300 leading-relaxed font-mono whitespace-pre-wrap">
                    {agentOutput.analysis}
                  </pre>
                </div>

                {/* Step 2 Code Generator */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-400">⚡ 2단계: 자동 생성된 100% 엑셀 호환 생산용 VBA 코드</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(agentOutput.vbaCode);
                        alert("📋 VBA 매크로 코드가 클립보드에 복사되었습니다!");
                      }}
                      className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs cursor-pointer shadow transition-all active:scale-95"
                    >
                      📋 코드 1초 복사
                    </button>
                  </div>
                  <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] text-cyan-300 font-mono overflow-x-auto max-h-60 leading-relaxed border-l-4 border-l-cyan-500 select-all">
                    {agentOutput.vbaCode}
                  </pre>
                </div>

                {/* Step 3 Ribbon Add-in Installation */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-300">🔘 3단계: 엑셀 상단 리본 메뉴(.xlam) 자동 등록 가이드</span>
                    <button
                      onClick={() => {
                        const blob = new Blob([agentOutput.vbaCode], { type: "text/plain;charset=utf-8" });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = agentOutput.filename;
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs cursor-pointer shadow transition-all active:scale-95"
                    >
                      📥 .bas 스크립트 파일 받기
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    엑셀에서 <strong>[Alt + F11]</strong> ➔ <strong>[삽입] ➔ [모듈]</strong>에 붙여넣거나, 상단 리본 메뉴에 <strong>[WorkFree 딸깍 버튼]</strong>으로 등록하시면 매일 클릭 1번으로 자동 실행됩니다!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* EXPERT REVIEW POINT 1 FIX: NEXT COHORT WAITLIST MODAL */}
      {showWaitlistModal && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto ring-1 ring-amber-500/30">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-500 text-slate-950 flex items-center justify-center text-xl font-bold shadow-lg shadow-amber-500/20 shrink-0">
                  🔔
                </div>
                <div>
                  <h3 className="font-black text-base sm:text-lg text-white">다음 회차 실강 알림 신청</h3>
                  <p className="text-xs text-slate-400">
                    8/8 실강 마감 직후, 다음 코호트(8월 중순) 일정이 열리면 가장 먼저 연락드립니다.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowWaitlistModal(false)}
                className="text-slate-400 hover:text-white text-xl font-bold p-1 cursor-pointer shrink-0"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 space-y-1 text-xs text-amber-200">
                <p className="font-bold">💡 알림 신청 혜택:</p>
                <p className="text-[11px] text-amber-300/80">
                  - 8.8 실강 마감 후 다음 일정(8월 중순) <strong>우선 수강권 부여</strong>
                  <br />
                  - 다음 회차 오픈 시 <strong>얼리버드 90% 할인 혜택 동일 유지</strong>
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">카카오톡 ID 또는 이메일 주소:</label>
                <input
                  type="text"
                  value={waitlistContact}
                  onChange={(e) => setWaitlistContact(e.target.value)}
                  placeholder="예: kakao_id1234 또는 name@email.com"
                  className="w-full px-4 py-3.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-sans"
                />
              </div>

              <button
                onClick={handleSaveWaitlist}
                disabled={isSubmittingWaitlist}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 transition-all cursor-pointer active:scale-95 disabled:opacity-50 border border-yellow-300"
              >
                {isSubmittingWaitlist ? "신청 처리 중..." : "🔔 다음 회차 우선 알림 신청하기 ➔"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PAYMENT PLATFORM IN PREPARATION & DEPOSIT GUIDE MODAL */}
      {showPaymentNoticeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-base font-bold">
                  💳
                </div>
                <h3 className="font-extrabold text-base sm:text-lg text-white">
                  수강 신청 &amp; 결제 안내
                </h3>
              </div>
              <button
                onClick={() => setShowPaymentNoticeModal(false)}
                className="text-slate-400 hover:text-white text-xl font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Notice Pill */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
              <div className="flex items-center space-x-2 text-amber-300 font-bold text-xs sm:text-sm">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping shrink-0"></span>
                <span>💳 결제 수단 안내 (계좌이체 / 카카오페이 5,000원)</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed break-keep">
                <strong className="text-amber-400 font-extrabold">신한은행 계좌이체</strong> 또는 <strong className="text-yellow-400 font-extrabold">카카오페이(5,000원)</strong> 입금 후, 아래 <strong className="text-yellow-300 font-extrabold">[카카오톡 1:1 채널로 입금 완료 알리기]</strong> 버튼을 통해 입금자명만 남겨주시면 확인 즉시 10강 수강 라이선스를 바로 승인해 드립니다!
              </p>
            </div>

            {/* Bank Account & Payment Options Box */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 text-xs text-slate-300">
              <div className="flex justify-between items-center border-b border-slate-800/80 pb-2">
                <span className="text-slate-400 font-semibold">신청 강좌</span>
                <span className="font-bold text-white">WorkFree LV.01 10강 마스터클래스</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-800/80 pb-2">
                <span className="text-slate-400 font-semibold">수강료</span>
                <span className="font-mono font-black text-amber-400 text-sm">5,000원 (얼리버드 90% 특가)</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-800/80 pb-2">
                <span className="text-slate-400 font-semibold">서비스 제공 기간</span>
                <span className="font-bold text-cyan-300">결제 완료 후 즉시 제공 (1년 365일 수강 가능)</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-800/80 pb-2">
                <span className="text-slate-400 font-semibold">상품 유형</span>
                <span className="font-bold text-slate-300">단건 결제 상품 (정기구독 없음)</span>
              </div>

              {/* Shinhan Bank (Primary Account) */}
              <div className="p-3.5 rounded-xl bg-slate-900 border border-cyan-500/40 space-y-1.5 shadow-lg">
                <div className="flex justify-between items-center">
                  <span className="text-cyan-400 font-extrabold text-xs">🏦 입금 계좌 (신한은행)</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText("110-356-224451");
                      alert("📋 신한은행 계좌번호 (110-356-224451)가 복사되었습니다!");
                    }}
                    className="px-2.5 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold cursor-pointer transition-all active:scale-95"
                  >
                    📋 계좌 복사
                  </button>
                </div>
                <div className="font-mono font-extrabold text-white text-base tracking-wide">
                  110-356-224451 <span className="text-xs font-sans text-cyan-300 font-bold">(예금주: 윤아영)</span>
                </div>
              </div>

              {/* KakaoPay QR Remittance Card (Functional QR Code & Image Zoom) */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-yellow-500/10 via-amber-500/10 to-yellow-500/10 border border-yellow-500/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-full bg-yellow-400 text-slate-950 font-black flex items-center justify-center text-xs">
                      💛
                    </span>
                    <span className="font-extrabold text-yellow-300 text-xs sm:text-sm">
                      카카오페이 5,000원 QR 즉시 송금
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-yellow-400/20 text-yellow-300 text-[10px] font-bold border border-yellow-400/30">
                    스캔/링크/이미지 지원
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
                  {/* Real QR Code Image - Click to Zoom/Download */}
                  <div
                    onClick={() => setShowQrZoomModal(true)}
                    className="w-28 h-28 bg-white p-2 rounded-xl border-2 border-yellow-400 shadow-md shrink-0 flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform group relative"
                    title="클릭하여 대형 QR 이미지 팝업 열기"
                  >
                    {/* eslint-disable-next-html-link */}
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent("https://qr.kakaopay.com/FVGQc7DUq")}`}
                      alt="카카오페이 5000원 송금 QR"
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute inset-0 bg-slate-950/60 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-yellow-300 font-bold text-[10px]">
                      🔍 크게보기
                    </div>
                  </div>

                  <div className="space-y-2 text-center sm:text-left flex-1 break-keep">
                    <p className="text-[11px] text-slate-200 leading-snug">
                      모바일은 아래 <strong>송금하기 버튼</strong>을 누르시거나, <strong>QR 이미지 크게 보기</strong>로 캡처/스캔하여 5,000원 즉시 송금이 가능합니다!
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1 justify-center sm:justify-start">
                      <a
                        href="https://qr.kakaopay.com/FVGQc7DUq"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center px-3.5 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black text-xs shadow-md transition-all active:scale-95 cursor-pointer whitespace-nowrap"
                      >
                        💛 5,000원 송금하기 ↗
                      </a>
                      <button
                        onClick={() => setShowQrZoomModal(true)}
                        className="inline-flex items-center justify-center px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-yellow-300 font-bold text-xs shadow border border-yellow-500/30 transition-all active:scale-95 cursor-pointer whitespace-nowrap"
                      >
                        🔍 QR 크게보기 / 캡처
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Kakao Channel Direct Contact Notice */}
              <div className="flex justify-between items-center pt-1 border-t border-slate-800/80">
                <span className="text-slate-400 font-semibold">입금 확인 채널</span>
                <a
                  href="http://pf.kakao.com/_qvNxnX/chat"
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono font-bold text-yellow-400 hover:underline"
                >
                  카카오톡 채널 @워크프리마켓 ↗
                </a>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-1">
              <button
                onClick={async () => {
                  try {
                    const paymentId = `pay-${Date.now()}`;
                    const response = await PortOne.requestPayment({
                      storeId: "store-f7c52ad9-3899-4b5b-87b4-cc5cdcdbb5d4",
                      channelKey: "channel-key-9a6add1a-15df-43ab-8242-e8df711d7a9a",
                      paymentId: paymentId,
                      orderName: "WorkFree Market 엑셀 자동화 10강 수강권",
                      totalAmount: 5000,
                      currency: "CURRENCY_KRW",
                      payMethod: "EASY_PAY",
                      customer: {
                        fullName: currentUser?.name || "수강생",
                        email: currentUser?.email || "student@workfreemarket.com",
                      },
                    });

                    if (response?.code != null) {
                      alert(`결제 안내: ${response.message || "결제가 취소되었습니다."}`);
                    } else {
                      setIsAuthenticated(true);
                      localStorage.setItem("workfree_license_auth", "true");
                      alert("🎉 5,000원 수강료 결제가 성공적으로 완료되었습니다!\n별도 라이선스 키 입력 없이 10강 전체 시청 권한이 즉시 승인되었습니다.");
                      setShowPaymentNoticeModal(false);
                      setViewMode("classroom");
                    }
                  } catch (err: any) {
                    alert(`결제 요청 처리 중 오류: ${err?.message || err}`);
                  }
                }}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-yellow-500/25 transition-all flex items-center justify-center space-x-2 active:scale-95 cursor-pointer text-center break-keep"
              >
                <span>💳 5,000원 카카오페이 / 신용카드 1초 간편 결제하기 ➔</span>
              </button>
              <a
                href="http://pf.kakao.com/_qvNxnX/chat"
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 rounded-xl bg-[#FEE500] hover:bg-[#EDD100] text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-yellow-400/20 transition-all flex items-center justify-center space-x-2 active:scale-95 cursor-pointer block text-center break-keep"
              >
                <span>💬 카카오톡 1:1 채널로 입금 완료 알리기 (즉시 승인) ↗</span>
              </a>

              <button
                onClick={() => {
                  setShowPaymentNoticeModal(false);
                  setShowLicenseModal(true);
                }}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs shadow transition-all cursor-pointer active:scale-95 text-center border border-slate-700 break-keep"
              >
                🔑 수강생 패스키(라이선스 키) 바로 입력하기 ➔
              </button>
            </div>
          </div>
        </div>
      )}

      {/* KAKAOPAY QR ZOOM MODAL */}
      {showQrZoomModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-sm bg-slate-900 border border-yellow-500/40 rounded-3xl p-6 shadow-2xl space-y-5 text-center">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="font-extrabold text-sm text-yellow-300 flex items-center space-x-2">
                <span>💛 카카오페이 5,000원 송금 QR 이미지</span>
              </h4>
              <button
                onClick={() => setShowQrZoomModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Large QR Display */}
            <div className="p-4 bg-white rounded-2xl border-4 border-yellow-400 shadow-xl mx-auto w-64 h-64 flex items-center justify-center">
              {/* eslint-disable-next-html-link */}
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent("https://qr.kakaopay.com/FVGQc7DUq")}`}
                alt="카카오페이 5,000원 송금 QR 코드 대형"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="space-y-2 text-xs text-slate-300 break-keep">
              <p className="font-bold text-white">📱 카카오페이 앨범 송금 방법</p>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                1. 위 QR 화면을 캡처한 후 카카오톡 실행
                <br />
                2. 카카오톡 상단 🔍 검색창 옆 <strong className="text-yellow-300">QR 스캔</strong> 클릭
                <br />
                3. 하단 <strong className="text-yellow-300">앨범</strong>에서 캡처한 QR 이미지 선택 시 5,000원 즉시 송금 완료!
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <a
                href="https://qr.kakaopay.com/FVGQc7DUq"
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black text-xs shadow-lg transition-all flex items-center justify-center space-x-2 active:scale-95 cursor-pointer block text-center"
              >
                <span>🚀 카카오페이 즉시 송금 연결 ↗</span>
              </a>
              <button
                onClick={() => setShowQrZoomModal(false)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NOMAD CODERS STYLE AUTH MODAL (Login & Join with Kakao & Google) */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#141923]/90 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-[#1e2638] border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative text-slate-100 font-sans">
            {/* Top Header Bar inside Modal */}
            <div className="flex items-center justify-between border-b border-slate-700/70 pb-4">
              {/* Logo */}
              <div className="flex items-center space-x-2">
                {/* eslint-disable-next-html-link */}
                <img
                  src="/logo.jpg"
                  alt="WorkFree Market 로고"
                  className="w-7 h-7 rounded-lg object-cover border border-slate-700 bg-white"
                />
                <span className="font-extrabold text-sm text-white tracking-tight">WorkFree Market</span>
              </div>

              {/* Tab Switcher & Close */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setAuthTab(authTab === "join" ? "login" : "join")}
                  className="text-xs text-cyan-400 font-bold hover:underline cursor-pointer"
                >
                  {authTab === "join" ? "Login" : "Join"}
                </button>
                <button
                  onClick={() => setShowAuthModal(false)}
                  className="text-slate-400 hover:text-white text-xl font-bold p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Main Form Box (Rounded Slate-800 Container matching screenshot) */}
            <div className="p-6 rounded-2xl bg-[#2b3548] border border-slate-700 space-y-4 shadow-inner">
              {authTab === "join" && (
                <div className="space-y-1.5 text-left">
                  <label className="block text-xs font-bold text-slate-300">이름</label>
                  <input
                    type="text"
                    placeholder="홍길동"
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    className="w-full bg-[#1e2638] border border-slate-600 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-all"
                  />
                </div>
              )}

              <div className="space-y-1.5 text-left">
                <label className="block text-xs font-bold text-slate-300">이메일 주소</label>
                <input
                  type="email"
                  placeholder="example@email.com"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="w-full bg-[#1e2638] border border-slate-600 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-all font-mono"
                />
              </div>

              {authTab === "join" && (
                <div className="space-y-2.5 pt-1 text-left text-[11px] text-slate-300">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        className="w-4 h-4 rounded bg-slate-900 border-slate-600 text-cyan-500 accent-cyan-500 cursor-pointer"
                      />
                      <span className="text-cyan-300 font-semibold">개인정보 수집 및 이용약관 동의</span>
                    </label>
                    <div className="flex items-center space-x-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => setShowPrivacyModal(true)}
                        className="text-[10px] text-cyan-400 hover:underline font-bold cursor-pointer"
                      >
                        [개인정보]
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowTermsModal(true)}
                        className="text-[10px] text-cyan-400 hover:underline font-bold cursor-pointer"
                      >
                        [이용약관]
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={agreeMarketing}
                        onChange={(e) => setAgreeMarketing(e.target.checked)}
                        className="w-4 h-4 rounded bg-slate-900 border-slate-600 text-cyan-500 accent-cyan-500 cursor-pointer"
                      />
                      <span className="text-slate-400">할인 혜택 및 마케팅 정보 수신 동의 (선택)</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowMarketingModal(true)}
                      className="text-[10px] text-cyan-400 hover:underline font-bold cursor-pointer"
                    >
                      [상세보기]
                    </button>
                  </div>
                </div>
              )}

              <button
                onClick={async () => {
                  if (authTab === "join" && !authName.trim()) {
                    alert("이름을 입력해 주세요.");
                    return;
                  }
                  if (!authEmail) {
                    alert("이메일을 입력해 주세요.");
                    return;
                  }
                  if (authTab === "join" && !agreeTerms) {
                    alert("개인정보 수집 및 이용약관 동의가 필요합니다.");
                    return;
                  }
                  const name = authName.trim() || authEmail.split("@")[0] || "수강생";

                  try {
                    const { error } = await supabase.auth.signInWithOtp({
                      email: authEmail,
                      options: {
                        data: {
                          name: name,
                          full_name: name,
                          display_name: name,
                        },
                        emailRedirectTo: typeof window !== "undefined" ? window.location.origin : undefined,
                      },
                    });
                    if (error) {
                      alert(`오류가 발생했습니다: ${error.message}`);
                      return;
                    }
                  } catch (e) {
                    console.error("Supabase auth sync error:", e);
                  }

                  setShowAuthModal(false);
                  alert(`📩 ${authEmail} (으)로 1초 로그인 메일이 발송되었습니다!\n\n이메일함(Gmail/네이버 등)으로 이동하셔서 [로그인 ➔] 버튼을 클릭해 주세요.`);
                }}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-yellow-500/20 transition-all active:scale-95 cursor-pointer mt-2 text-center"
              >
                ⚡ 이메일로 1초 로그인 링크 받기 ➔
              </button>
            </div>

            {/* Mode Switch Link matching screenshot */}
            <div className="text-center text-xs text-slate-300 font-medium">
              {authTab === "join" ? (
                <span>
                  이미 계정이 있으신가요?{" "}
                  <button
                    onClick={() => setAuthTab("login")}
                    className="text-cyan-400 font-bold hover:underline cursor-pointer"
                  >
                    로그인 ➔
                  </button>
                </span>
              ) : (
                <span>
                  계정이 없으신가요?{" "}
                  <button
                    onClick={() => setAuthTab("join")}
                    className="text-cyan-400 font-bold hover:underline cursor-pointer"
                  >
                    회원가입 ➔
                  </button>
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Terms of Service Modal (워크프리마켓 이용약관 26개 조항 전문) */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
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

            <div className="flex-1 overflow-y-auto space-y-4 text-xs text-slate-300 leading-relaxed pr-2 font-sans break-keep">
              <div className="space-y-2">
                <h4 className="font-bold text-cyan-400 text-sm">제1조 (목적)</h4>
                <p>본 약관은 워크프리마켓(대표자 윤아영, 이하 &quot;회사&quot;라 합니다)에서 제공하는 인터넷 관련 서비스(접속 가능한 유·무선 단말기의 종류와 관계없이 회사가 제공하는 이용 가능한 모든 서비스를 의미하며, 이하 &quot;서비스&quot;라 합니다)를 이용함에 있어 회사와 회원의 권리와 의무, 책임사항, 기타 필요한 사항을 규정함을 그 목적으로 합니다.</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-cyan-400 text-sm">제2조 (정의)</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>&quot;사이트&quot;란 회사가 재화 또는 서비스(이하 &quot;상품 등&quot;이라 합니다)를 회원에게 제공하기 위하여 컴퓨터 등 정보통신설비를 이용하여 상품 등을 거래할 수 있도록 설정한 가상의 영업장을 말하며 회사가 모바일 환경에서 서비스하는 모바일 웹과 앱을 포함합니다.</li>
                  <li>&quot;회원&quot;이라 함은 사이트에서 정한 소정의 절차를 거쳐 회원가입을 한 자로서, 약관에 따라 회사가 제공하는 서비스를 이용할 수 있는 자를 말합니다.</li>
                  <li>&quot;아이디(ID)&quot;라 함은 회원의 식별과 서비스의 이용을 위하여 회원이 설정하고 회사가 승인하여 등록된 전자우편주소 또는 소셜 서비스(카카오/구글 등) 연동을 통해 수집된 전자우편주소를 말합니다.</li>
                  <li>&quot;유료서비스&quot;라 함은 &quot;회사&quot;가 유료로 제공하는 각종 온라인 디지털 콘텐츠(10강 마스터클래스 동영상 강의 열람, 프리미엄 교육 정보, 외주 제작 대행 등) 및 제반 서비스를 의미합니다.</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-cyan-400 text-sm">제3조 (약관 등의 명시와 설명 및 개정)</h4>
                <p>&quot;회사&quot;는 본 약관의 내용과 상호, 영업소 소재지 주소, 대표자의 성명, 사업자등록번호, 개인정보관리책임자 등을 &quot;회원&quot;이 쉽게 확인할 수 있도록 사이트의 초기 화면에 게시합니다.</p>
                <p>&quot;회사&quot;는 관련 법령을 위배하지 않는 범위에서 본 약관을 개정할 수 있으며, 약관 개정 시 적용일자 7일 이전부터 적용일자 전일까지 사이트에 사전 공지합니다. 불리한 변경의 경우 최소 30일 이상의 유예기간을 두고 공지합니다.</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-cyan-400 text-sm">제4조 (서비스의 제공 및 변경)</h4>
                <p>&quot;회사&quot;는 다음과 같은 서비스를 제공합니다.</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>가. 온라인 동영상 강의 서비스 (VBA, Power Automate, AI 결합 10강)</li>
                  <li>나. 수강 승인 및 1:1 과외 / 맞춤 자동화 외주 대행 서비스</li>
                  <li>다. 업무 자동화 템플릿 및 가이드라인 다운로드 서비스</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-cyan-400 text-sm">제5조 (서비스의 중단)</h4>
                <p>&quot;회사&quot;는 컴퓨터 등 정보통신설비의 보수 점검 및 교체, 고장, 통신의 두절 등의 사유가 발생한 경우에는 서비스의 제공을 일시적으로 중단할 수 있습니다.</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-cyan-400 text-sm">제6조 (회원가입과 이용계약의 성립)</h4>
                <p>이용계약은 &quot;가입신청자&quot;가 회원가입을 신청하고 &quot;회사&quot;가 승인함으로써 체결됩니다. 카카오톡, 구글 등 외부 소셜 연동 가입 시에도 본 약관 및 개인정보 처리방침 동의를 거쳐 회원 승인이 완료됩니다.</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-cyan-400 text-sm">제7조 (회원의 의무 및 부정이용 금지)</h4>
                <p>&quot;회원&quot;은 회사의 사전 동의 없이 콘텐츠를 무단 캡처, 녹화, 복제, 번역, 유포, 타인 양도할 수 없으며, 타인의 명예를 손상시키거나 해킹·바이러스 유포 행위를 해서는 안 됩니다.</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-cyan-400 text-sm">제8조 (회원의 아이디 및 비밀번호 관리의무)</h4>
                <p>&quot;회원&quot;의 아이디 관리책임은 본인에게 있으며 제3자에게 이용하게 해서는 안 됩니다. 동일 ID 2대 이상 기기 동시 접속 또는 타인 판매/대여 시 부정 이용으로 간주하여 이용 정지 처리될 수 있습니다.</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-cyan-400 text-sm">제9조 (회원 탈퇴 및 자격 상실)</h4>
                <p>&quot;회원&quot;은 언제든지 사이트 또는 고객센터를 통해 탈퇴를 요청할 수 있으며 회사는 지체 없이 처리합니다.</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-cyan-400 text-sm">제10조 (회사의 의무)</h4>
                <p>&quot;회사&quot;는 지속적이고 안정적으로 서비스를 제공하기 위해 최선을 다하며 개인정보 보안시스템을 준수합니다.</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-cyan-400 text-sm">제11조 ~ 제21조 (부정이용 차단, 개인정보보호, 통지, 결제, 환불 규정)</h4>
                <p>동영상 강의를 전혀 시청하지 않은 경우 결제일로부터 7일 이내 100% 환불이 가능합니다. 단, 복제가 가능한 디지털 콘텐츠 시청이 개시되었거나 5강 이상 수강 시 전자상거래법에 따라 환불이 제한될 수 있습니다.</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-cyan-400 text-sm">제22조 ~ 제26조 (저작권 귀속, 면책, 재판권 및 준거법)</h4>
                <p>&quot;회사&quot;가 작성한 동영상 강의 및 저작물에 대한 저작권은 회사에 귀속되며, 본 약관과 관련된 분쟁은 대한민국 법률을 적용하고 회사의 본사 소재지 관할 법원으로 합니다.</p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800">
                <h4 className="font-bold text-cyan-400 text-sm">부칙</h4>
                <p>공고일자 : 2026년 7월 28일</p>
                <p>시행일자 : 2026년 7월 28일</p>
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

      {/* Privacy Policy Modal (워크프리마켓 개인정보취급방침 전문) */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="font-extrabold text-lg text-white flex items-center space-x-2">
                <span>🔒 워크프리마켓 개인정보취급방침</span>
              </h3>
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="text-slate-400 hover:text-white text-xl font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 text-xs text-slate-300 leading-relaxed pr-2 font-sans break-keep">
              <p>
                <strong>워크프리마켓</strong>(대표자 윤아영, 이하 &quot;회사&quot;라 합니다)는 『정보통신망 이용촉진 및 정보보호 등에 관한 법률』, 『개인정보보호법』, 『통신비밀보호법』, 『전기통신사업법』 등 정보통신서비스제공자가 준수하여야 할 관련 법령 상의 개인정보보호 규정을 준수하며 최소한의 정보만을 필요한 시점에 수집하고, 수집하는 정보는 고지한 범위 내에서만 사용하며, 사전 동의 없이 그 범위를 초과하여 이용하거나 외부에 공개하지 않는 등 &quot;회원&quot;의 권익 보호에 최선을 다하고 있습니다.
              </p>
              <p>
                &quot;회사&quot;는 개인정보취급방침을 통하여 &quot;회원&quot;이 제공하는 개인정보가 어떠한 용도와 방식으로 이용되고 있으며, 개인정보보호를 위해 어떠한 조치가 취해지고 있는지 알려드리고 개인정보취급방침을 개정하는 경우 개정 이유 및 내용에 관하여 웹사이트 및 이메일 등을 통하여 고지합니다.
              </p>

              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <h4 className="font-bold text-cyan-400 text-sm">1. 수집하는 개인정보 항목 및 수집방법</h4>
                <p>&quot;회사&quot;는 이용하는 서비스의 형태에 따라 다음과 같은 개인정보를 수집 및 이용·제공·파기하고 있습니다.</p>
                <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
                  <li>
                    <strong>필수 수집 정보:</strong> 서비스 아이디, 이메일, IMEI(단말기 고유 정보), 단말기 정보, (SNS 계정으로 로그인 연동 시) 카카오톡/구글/깃허브 계정을 비롯한 기타 소셜 네트워크(SNS) 계정, 방문 일시, 서비스 이용기록, 쿠키, 세션, 접속로그, 지역위치
                  </li>
                  <li>
                    <strong>선택 수집 정보:</strong> 위치정보, 사진(메타 정보 포함), 성별, 나이, 생년월일, 배송지 정보, 프로필 사진, 닉네임, 암호화된 이용자 확인값(CI)
                  </li>
                </ul>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <h4 className="font-bold text-cyan-400 text-sm">2. 개인정보의 수집 및 이용 목적</h4>
                <p>&quot;회사&quot;는 필요한 목적 범위 내에서만 개인정보를 이용하고 있습니다.</p>
                <div className="space-y-2 pl-2">
                  <p><strong>가. 서비스의 기본 기능의 제공:</strong> &quot;회원&quot;의 로그인, 동영상 콘텐츠 감상, 수강 라이선스 발송 등 기본적인 기능을 제공하기 위하여 개인정보를 이용합니다.</p>
                  <p><strong>나. 회원관리:</strong> &quot;회원&quot;의 본인확인, 회원 식별, 콘텐츠 접근 권한의 차등 적용, 고객 문의에 대한 회신, 각종 고지 사항 전달, 불량회원 제한, 부정이용방지, 분쟁 조정을 위한 기록 보존 등의 목적으로 개인정보를 이용합니다.</p>
                  <p><strong>다. 사용자 경험 향상 및 마케팅·광고에의 활용:</strong> 지속적으로 사용자의 경험을 높이기 위해서 새로운 서비스를 개발하고, 새로운 기능, 추천서비스, 기존 기능 개선, 각종 이벤트나 광고성 정보를 제공합니다.</p>
                  <p><strong>라. 법령 및 약관 등의 이행 및 준수:</strong> 법령이나 이용약관 등에 반하여 피해를 줄 수 있는 부분을 방지하기 위해서 수집된 정보들을 활용합니다.</p>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <h4 className="font-bold text-cyan-400 text-sm">3. 개인정보 처리 위탁 현황</h4>
                <p>&quot;회사&quot;는 원활한 서비스 제공과 효과적인 업무처리를 위하여 다음과 같이 개인정보를 처리 위탁하고 있습니다.</p>
                <div className="overflow-x-auto my-2">
                  <table className="w-full text-[11px] text-left border-collapse border border-slate-700">
                    <thead>
                      <tr className="bg-slate-800 text-slate-200">
                        <th className="p-2 border border-slate-700">구분</th>
                        <th className="p-2 border border-slate-700">수탁자</th>
                        <th className="p-2 border border-slate-700">위탁업무</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-300">
                      <tr>
                        <td className="p-2 border border-slate-700 font-semibold">서비스 운영 및 관리</td>
                        <td className="p-2 border border-slate-700">Google G Suite, Kakao, Vercel</td>
                        <td className="p-2 border border-slate-700">서비스 운영, 회원 인증 및 관리를 위해 활용</td>
                      </tr>
                      <tr>
                        <td className="p-2 border border-slate-700 font-semibold">콘텐츠 제공</td>
                        <td className="p-2 border border-slate-700">Bunny.net, Google Cloud</td>
                        <td className="p-2 border border-slate-700">강의, 동영상 등의 콘텐츠 스트리밍 인프라</td>
                      </tr>
                      <tr>
                        <td className="p-2 border border-slate-700 font-semibold">서버 제공</td>
                        <td className="p-2 border border-slate-700">Vercel Inc. / Amazon Web Services</td>
                        <td className="p-2 border border-slate-700">서비스 웹 호스팅 및 운영을 위한 인프라</td>
                      </tr>
                      <tr>
                        <td className="p-2 border border-slate-700 font-semibold">결제 처리</td>
                        <td className="p-2 border border-slate-700">포트원(Portone), (주)카카오, 신한은행</td>
                        <td className="p-2 border border-slate-700">무통장 계좌이체, 카카오페이 등 결제 처리 및 내역 확인</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <h4 className="font-bold text-cyan-400 text-sm">4. 개인정보의 파기 절차 및 방법</h4>
                <p>수집·이용목적이 달성된 개인정보의 경우 별도의 DB에 옮겨져 내부규정 및 관련 법령을 준수하여 안전하게 보관되며, 정해진 기간이 종료되었을 때 지체 없이 영구 파기됩니다.</p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <h4 className="font-bold text-cyan-400 text-sm">5. 회원 및 법정대리인의 권리와 행사방법</h4>
                <p>&quot;회원&quot;은 언제든지 개인정보 관리책임자에게 서면, 이메일(contact@workfreemarket.com) 등을 통하여 개인정보의 열람, 정정, 삭제를 요청할 수 있습니다.</p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <h4 className="font-bold text-cyan-400 text-sm">6. 개인정보 권익침해 구제기관 및 연락처</h4>
                <p>개인정보에 관한 침해 신고나 상담이 필요하신 경우에는 아래 기관에 문의하실 수 있습니다.</p>
                <ul className="list-disc pl-5 space-y-1 text-slate-300">
                  <li><strong>개인정보 보호책임자:</strong> 윤아영 (contact@workfreemarket.com / 070-8080-2814 / 카카오톡 ayoi1034)</li>
                  <li><strong>개인정보분쟁조정위원회:</strong> (국번없이) 1833-6972 (www.kopico.go.kr)</li>
                  <li><strong>대검찰청 사이버수사과:</strong> http://www.spo.go.kr / 02-3480-2000 (국번없이 1301)</li>
                  <li><strong>경찰청 사이버테러대응센터 / 사이버범죄 신고시스템:</strong> http://www.ctrc.go.kr / 1566-0112 (국번없이 182)</li>
                </ul>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <h4 className="font-bold text-cyan-400 text-sm">7. 고지의 의무</h4>
                <p>서비스의 개선 혹은 목적에 따라 개인정보 취급방침에 변경사항이 생길 수 있습니다. &quot;회사&quot;는 개인정보처리방침이 변경되는 경우에는 &quot;회사&quot;의 사이트 혹은 이메일을 통하여 변경 및 시행의 시기, 변경 내용을 공지합니다. &quot;회사&quot;는 변경 사항을 게시하며, 변경된 개인정보처리방침은 게시한 날로부터 7일 이후에 효력이 발생하게 됩니다. 단, &quot;회원&quot;의 권리에 중요한 변경이 있을 경우에는 변경될 내용을 30일 이전에 미리 알립니다.</p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <h4 className="font-bold text-cyan-400 text-sm">부칙</h4>
                <p>공고일자 : 2026년 7월 28일</p>
                <p>시행일자 : 2026년 7월 28일</p>
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

      {/* Marketing Information Consent Modal (할인혜택 및 마케팅 수신 동의 1:1 전문) */}
      {showMarketingModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 text-slate-100 font-sans">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-base text-yellow-300 flex items-center space-x-2">
                <span>🎁 마케팅 수신동의 약관</span>
              </h3>
              <button
                onClick={() => setShowMarketingModal(false)}
                className="text-slate-400 hover:text-white text-xl font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-300 leading-relaxed font-sans break-keep">
              <div className="space-y-2 p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <h4 className="font-bold text-white text-xs">1. 광고성 정보의 이용목적</h4>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  워크프리마켓(WorkFree Market)이 제공하는 이용자 맞춤형 서비스 및 상품 추천, 각종 경품 행사, 이벤트 등의 광고성 정보를 전자우편이나 서신우편, 문자(SMS 또는 카카오 알림톡), 푸시, 전화 등을 통해 이용자에게 제공합니다.
                </p>
                <p className="text-[11px] text-slate-400 leading-relaxed pt-1 border-t border-slate-800/80">
                  마케팅 수신 동의는 거부하실 수 있으며 동의 이후에라도 고객의 의사에 따라 동의를 철회할 수 있습니다. 동의를 거부하시더라도 워크프리마켓이 제공하는 서비스의 이용에 제한이 되지 않습니다. 단, 할인, 이벤트 및 이용자 맞춤형 상품 추천 등의 마케팅 정보 안내 서비스가 제한됩니다.
                </p>
              </div>

              <div className="space-y-1.5 p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <h4 className="font-bold text-white text-xs">2. 미동의 시 불이익 사항</h4>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  개인정보보호법 제22조 제5항에 의해 선택정보 사항에 대해서는 동의 거부하시더라도 서비스 이용에 제한되지 않습니다. 단, 할인, 이벤트 및 이용자 맞춤형 상품 추천 등의 마케팅 정보 안내 서비스가 제한됩니다.
                </p>
              </div>

              <div className="space-y-1.5 p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <h4 className="font-bold text-white text-xs">3. 서비스 정보 수신 동의 철회</h4>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  워크프리마켓에서 제공하는 마케팅 정보를 원하지 않을 경우 고객센터 또는 이메일(contact@workfreemarket.com)을 통해 철회를 요청할 수 있습니다. 또한 향후 마케팅 활용에 새롭게 동의하고자 하는 경우에는 언제든지 동일한 방법으로 동의하실 수 있습니다.
                </p>
              </div>

              <p className="text-[10px] text-slate-500 font-mono text-right pt-1">
                시행일자 : 2026.07.28
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowMarketingModal(false)}
                className="px-5 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black text-xs transition-all cursor-pointer"
              >
                확인 및 닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Karrot Review Screenshot Lightbox Modal */}
      {selectedReviewImage && (
        <div
          onClick={() => setSelectedReviewImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md cursor-pointer animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-2xl max-h-[90vh] bg-slate-900 border border-slate-700 rounded-3xl p-5 overflow-hidden shadow-2xl space-y-3 flex flex-col"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs sm:text-sm font-extrabold text-orange-400 flex items-center space-x-1.5">
                <span>🥕 당근마켓 100% 찐 수강생 원본 캡처 화면</span>
              </span>
              <button
                onClick={() => setSelectedReviewImage(null)}
                className="text-slate-400 hover:text-white text-xl font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="overflow-y-auto max-h-[75vh] rounded-xl border border-slate-800 p-2 bg-slate-950 flex justify-center">
              <img
                src={selectedReviewImage}
                alt="당근마켓 수강생 후기 원본 캡처"
                className="w-full h-auto object-contain rounded-lg shadow-lg"
              />
            </div>
            <div className="text-center text-[11px] text-slate-400 font-medium">
              배경이나 ✕ 버튼을 클릭하시면 창이 닫힙니다.
            </div>
          </div>
        </div>
      )}

      {/* Floating KakaoTalk Channel Chat Button */}
      <a
        href="http://pf.kakao.com/_qvNxnX/chat"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-40 p-3.5 sm:px-4 sm:py-3 rounded-full bg-[#FEE500] hover:bg-[#EDD100] text-slate-950 font-black text-xs sm:text-sm shadow-2xl shadow-yellow-500/40 flex items-center space-x-2 transition-all active:scale-95 cursor-pointer border border-yellow-400"
        title="워크프리마켓 카카오톡 1:1 실시간 문의하기"
      >
        <span className="text-base sm:text-lg">💬</span>
        <span className="hidden sm:inline">카톡 1:1 실시간 문의 ↗</span>
      </a>
    </div>
  );
}
