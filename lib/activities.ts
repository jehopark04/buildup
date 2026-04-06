import { defineActivityCatalog } from "@/lib/activities.validation";
import type { ActivityType, Grade, Level, Track } from "@/lib/profile";

export type ActivityCategory =
  | "교내 활동"
  | "대외활동"
  | "정부지원 프로그램"
  | "부트캠프"
  | "동아리"
  | "강의/학습 활동"
  | "공모전";

export type RecruitmentStatus = "open" | "upcoming" | "rolling";

export type ActivityEligibility = {
  minGrade?: Grade;
  maxGrade?: Grade;
  minLevel?: Level;
  maxLevel?: Level;
  maxAllowedTier?: "best" | "conditional" | "notNow";
  blocked?: boolean;
  notes?: string[];
};

export type Activity = {
  id: string;
  title: string;
  category: ActivityCategory;
  summary: string;
  details: string;
  cadence: string;
  estimatedTime: string;
  timeBasis: string;
  nextStep: string;
  sourceHint: string;
  sourceName: string;
  sourceUrl: string;
  recruitmentStatus: RecruitmentStatus;
  scheduleText: string;
  deadlineText?: string;
  // Manual verification date for this specific source link.
  lastVerifiedAt: string;
  isKauInternal: boolean;
  eligibility?: ActivityEligibility;
  tracks: Track[];
  grades: Grade[];
  levels: Level[];
  activityTypes: ActivityType[];
};

export const activityCatalog: Activity[] = defineActivityCatalog([
  {
    id: "kau-student-activity-board",
    title: "항공대 AI융합대학 학생 참여 활동 보드",
    category: "교내 활동",
    summary:
      "학내 프로젝트, 해커톤, 동아리, 대외 프로그램까지 AI융합대학 학생 대상 활동 공지가 모이는 기본 채널입니다.",
    details:
      "어떤 활동을 먼저 볼지 모를 때 가장 먼저 확인해야 하는 항공대 내부 보드입니다. 직무별로 다양한 학생 참여 공지가 올라와서 프론트엔드, 백엔드, AI, 기획, 디자인 모두의 기본 출발점이 됩니다.",
    cadence: "수시 업데이트",
    estimatedTime: "공고별 상이",
    timeBasis:
      "AI융합대학 학생 참여 활동 게시판은 개별 공고마다 운영 기간과 요구 수준이 다르게 안내됩니다.",
    nextStep:
      "최근 공지 2~3개를 먼저 읽고, 지금 학년과 수준에서 바로 도전 가능한 공고를 북마크하세요.",
    sourceHint: "AI융합대학 학생 참여 활동 게시판",
    sourceName: "한국항공대학교 AI융합대학 학생 참여 활동",
    sourceUrl: "http://aisw.kau.ac.kr/pages/student_02.php?code=s7201",
    recruitmentStatus: "rolling",
    scheduleText: "학기 중과 방학 시즌 모두 수시 공지",
    lastVerifiedAt: "2026-03-30",
    isKauInternal: true,
    tracks: ["frontend", "backend", "product", "design", "ai"],
    grades: ["freshman", "sophomore", "junior", "senior"],
    levels: ["explore", "basic", "project", "ready"],
    activityTypes: ["project", "club", "contest"],
  },
  {
    id: "kau-industry-collaboration-project",
    title: "항공대 산학협력 프로젝트",
    category: "교내 활동",
    summary:
      "기업 과제나 산학 주제를 바탕으로 학기 단위 결과물을 만드는 교내 실전형 프로젝트 카드입니다.",
    details:
      "지원 직무와 직접 연결되는 산출물을 만들기 좋고, 백엔드·프론트엔드·AI 직무에서는 포트폴리오와 면접 설명 포인트를 만들기 좋습니다. 학기 프로젝트 성격이라 기초만 있는 단계보다는 프로젝트 경험 이후가 효율적입니다.",
    cadence: "학기 단위 모집",
    estimatedTime: "학기 단위, 공고별 상이",
    timeBasis:
      "항공대 산학협력단 및 AI융합대학 관련 공지는 학기 단위 프로젝트 공고 형식으로 운영됩니다.",
    nextStep:
      "학기 시작 전후 산학협력단과 AI융합대학 공지를 같이 확인하고, 요구 기술 스택을 먼저 체크하세요.",
    sourceHint: "AI융합대학 공지, 산학협력단 사업공고",
    sourceName: "한국항공대학교 산학협력단 사업공고",
    sourceUrl: "https://research.kau.ac.kr/info/info_021.php",
    recruitmentStatus: "rolling",
    scheduleText: "학기 시작 전후 공고 확인 권장",
    lastVerifiedAt: "2026-03-30",
    isKauInternal: true,
    tracks: ["frontend", "backend", "product", "ai"],
    grades: ["junior", "senior"],
    levels: ["project", "ready"],
    activityTypes: ["project"],
  },
  {
    id: "kau-internship-channel",
    title: "항공대 인턴십 / 현장실습 연결 채널",
    category: "교내 활동",
    summary:
      "학교 공지와 대학일자리플러스센터를 통해 현장실습, 인턴십, 실무 연계 프로그램을 확인하는 실전 전환형 카드입니다.",
    details:
      "졸업 전 실무 경험을 붙이고 싶은 3학년 후반 이후 학생에게 특히 중요합니다. 개발 직무는 프로젝트 경험 이후, 기획 직무는 문서와 협업 경험이 어느 정도 쌓인 뒤에 보는 편이 효율적입니다.",
    cadence: "수시 공고",
    estimatedTime: "공고별 상이",
    timeBasis:
      "대학일자리플러스센터와 교내 인턴십 공지는 프로그램별 기간이 각각 다르게 안내됩니다.",
    nextStep:
      "대학일자리플러스센터 공지와 AI융합대학 학생 참여 활동 보드를 함께 체크하세요.",
    sourceHint: "대학일자리플러스센터, 학생 참여 활동 보드",
    sourceName: "한국항공대학교 대학일자리플러스센터",
    sourceUrl: "https://career.kau.ac.kr/",
    recruitmentStatus: "rolling",
    scheduleText: "현장실습·인턴 공고 수시 확인",
    lastVerifiedAt: "2026-03-30",
    isKauInternal: true,
    tracks: ["frontend", "backend", "product", "design", "ai"],
    grades: ["junior", "senior"],
    levels: ["project", "ready"],
    activityTypes: ["project"],
  },
  {
    id: "kau-project-x",
    title: "항공대 프로젝트X / 교내 실전 프로젝트",
    category: "교내 활동",
    summary:
      "작은 팀 단위로 서비스나 시스템을 실제로 만들어보는 교내 프로젝트형 활동입니다.",
    details:
      "프로젝트 경험이 아직 많지 않은 학생이 결과물을 처음 쌓아보기 좋습니다. 프론트엔드, 백엔드, 기획, 디자인이 함께 움직이는 경우가 많아 협업 포트폴리오를 만들기 쉽습니다.",
    cadence: "학기별 또는 방학 프로젝트형",
    estimatedTime: "공고별 상이",
    timeBasis:
      "학생 참여 활동 보드에 올라오는 프로젝트형 공고는 학기별 또는 방학형으로 운영 기간이 각각 다르게 안내됩니다.",
    nextStep:
      "학생 참여 활동 보드에서 프로젝트형 공지를 추려보고, 이전 기수 산출물이 있다면 먼저 확인하세요.",
    sourceHint: "AI융합대학 학생 참여 활동 게시판",
    sourceName: "한국항공대학교 AI융합대학 학생 참여 활동",
    sourceUrl: "http://aisw.kau.ac.kr/pages/student_02.php?code=s7201",
    recruitmentStatus: "rolling",
    scheduleText: "학기 중·방학 프로젝트 공고 확인",
    lastVerifiedAt: "2026-03-30",
    isKauInternal: true,
    tracks: ["frontend", "backend", "product", "design"],
    grades: ["sophomore", "junior", "senior"],
    levels: ["basic", "project", "ready"],
    activityTypes: ["project", "club"],
  },
  {
    id: "kau-undergraduate-research",
    title: "항공대 학부연구생 / 연구실 참여",
    category: "교내 활동",
    summary:
      "교수 연구실 단위로 문제를 깊게 파고들며 연구·개발 경험을 쌓는 장기형 카드입니다.",
    details:
      "백엔드 시스템, AI 모델링, 데이터 분석처럼 깊이 있는 주제를 다루고 싶은 학생에게 잘 맞습니다. 기초 단계보다는 프로젝트 경험이 조금 쌓인 뒤에 들어가는 편이 효율적입니다.",
    cadence: "교수·연구실별 수시 문의",
    estimatedTime: "학기 단위 이상",
    timeBasis:
      "연구실 참여는 특정 기수제보다 학기 단위 또는 장기 참여 형태로 운영되는 경우가 많습니다.",
    nextStep:
      "교수진·연구실 페이지를 먼저 보고 관심 분야 연구실을 좁힌 뒤 메일 문의를 준비하세요.",
    sourceHint: "AI융합대학 교수진 및 연구실 안내",
    sourceName: "한국항공대학교 AI융합대학 교수진",
    sourceUrl: "http://aisw.kau.ac.kr/pages/professor.php",
    recruitmentStatus: "rolling",
    scheduleText: "연구실별 수시 문의, 학기 시작 전후 확인 권장",
    lastVerifiedAt: "2026-03-30",
    isKauInternal: true,
    tracks: ["backend", "ai"],
    grades: ["junior", "senior"],
    levels: ["project", "ready"],
    activityTypes: ["project", "opensource"],
  },
  {
    id: "oss-contribution-academy",
    title: "오픈소스 컨트리뷰션 아카데미",
    category: "정부지원 프로그램",
    summary:
      "멘토와 함께 공개 저장소에 기여 이력을 남기는 프로그램이라 개발 직무 포트폴리오로 연결하기 좋습니다.",
    details:
      "문서 수정 수준을 넘어 실제 오픈소스 프로젝트 흐름을 경험할 수 있습니다. 프론트엔드·백엔드·AI 직무에서 공개 이력을 만들고 싶은 경우 특히 잘 맞습니다.",
    cadence: "연례 기수형",
    estimatedTime: "참여형 약 13주",
    timeBasis:
      "공개SW 포털 자료 기준 오픈소스 컨트리뷰션 아카데미 참여형 프로그램은 약 13주 과정입니다.",
    nextStep:
      "관심 분야 프로젝트와 언어를 먼저 좁히고, 차기 모집 공고를 기다리면서 GitHub 활동 이력을 정리하세요.",
    sourceHint: "오픈소스 포털 컨트리뷰션 아카데미 소개",
    sourceName: "오픈소스 포털 컨트리뷰션 아카데미",
    sourceUrl: "https://www.oss.kr/pages/3",
    recruitmentStatus: "upcoming",
    scheduleText: "차기 기수 모집 공지 대기",
    deadlineText: "공개SW 포털 차기 공고 확인",
    lastVerifiedAt: "2026-03-30",
    isKauInternal: false,
    tracks: ["frontend", "backend", "ai"],
    grades: ["sophomore", "junior", "senior"],
    levels: ["basic", "project", "ready"],
    activityTypes: ["government", "opensource"],
  },
  {
    id: "boostcamp-web-mobile",
    title: "부스트캠프 웹·모바일",
    category: "부트캠프",
    summary:
      "웹과 모바일 서비스 개발 역량을 실전형 문제 해결 중심으로 올리는 장기 몰입형 프로그램입니다.",
    details:
      "프론트엔드나 백엔드 전환 직전 단계에서 실전 감각과 협업 밀도를 크게 높이기 좋습니다. 학기 병행보다는 전환 시점이나 몰입 가능한 기간에 보는 카드입니다.",
    cadence: "연례 또는 기수형 모집",
    estimatedTime: "약 7개월, 풀타임",
    timeBasis:
      "부스트캠프 웹·모바일 모집 안내 기준 챌린지와 멤버십 포함 약 7개월 일정으로 안내됩니다.",
    nextStep:
      "직무를 프론트엔드/백엔드로 더 좁힌 뒤 차기 모집 가이드를 보면서 선행 과제 수준을 확인하세요.",
    sourceHint: "부스트캠프 웹·모바일 모집 안내",
    sourceName: "부스트캠프 웹·모바일 가이드",
    sourceUrl: "https://boostcamp.connect.or.kr/guide_wm.html",
    recruitmentStatus: "upcoming",
    scheduleText: "차기 기수 가이드 확인",
    deadlineText: "가이드 페이지 내 차기 공지 확인",
    lastVerifiedAt: "2026-03-30",
    isKauInternal: false,
    tracks: ["frontend", "backend"],
    grades: ["junior", "senior"],
    levels: ["project", "ready"],
    activityTypes: ["bootcamp"],
  },
  {
    id: "boostcamp-ai-tech",
    title: "부스트캠프 AI Tech",
    category: "정부지원 프로그램",
    summary:
      "AI 모델링부터 실전 프로젝트까지 이어지는 몰입형 교육이라 AI 직무 준비에 강도가 높은 편입니다.",
    details:
      "기초 입문보다 프로젝트 경험 이후 단계에서 효율이 올라갑니다. 백엔드와 AI 직무가 함께 필요한 ML 서비스형 포트폴리오를 만들 때도 유효합니다.",
    cadence: "연례 또는 기수형 모집",
    estimatedTime: "약 6개월, 월~금 10:00~19:00",
    timeBasis:
      "부스트캠프 AI Tech 모집 안내 기준 교육 기간은 약 6개월이며 코어타임은 월~금 10시부터 19시까지입니다.",
    nextStep:
      "모집 가이드의 커리큘럼과 사전 과제를 먼저 확인하고, 풀타임 참여 가능 여부를 먼저 판단하세요.",
    sourceHint: "부스트캠프 AI Tech 모집 안내",
    sourceName: "부스트캠프 AI Tech 가이드",
    sourceUrl: "https://boostcamp.connect.or.kr/guide_ai.html",
    recruitmentStatus: "upcoming",
    scheduleText: "차기 기수 가이드 확인",
    deadlineText: "가이드 페이지 내 차기 공지 확인",
    lastVerifiedAt: "2026-03-30",
    isKauInternal: false,
    tracks: ["backend", "ai"],
    grades: ["junior", "senior"],
    levels: ["project", "ready"],
    activityTypes: ["government", "bootcamp"],
  },
  {
    id: "ssafy",
    title: "SSAFY",
    category: "부트캠프",
    summary:
      "1년 단위 집중 교육과 프로젝트 경험을 통해 개발 직무 전환을 노리는 대표적인 장기형 카드입니다.",
    details:
      "입문 단계 학생도 지원은 가능하지만, 현재 학년과 수준이 맞지 않으면 비용 대비 효율이 떨어질 수 있습니다. 졸업 직전 전환 카드로 보는 편이 일반적으로 맞습니다.",
    cadence: "기수형 모집",
    estimatedTime: "12개월, 총 1,725시간",
    timeBasis:
      "SSAFY 공식 교육 소개 기준 교육 기간은 12개월이며 총 1,725시간 집중 교육으로 안내됩니다.",
    nextStep:
      "입과 시점과 졸업 계획이 맞는지 먼저 체크하고, 차기 모집 공지에서 선발 일정과 교육 시작일을 확인하세요.",
    sourceHint: "SSAFY 공식 프로그램 안내",
    sourceName: "SSAFY 교육 프로그램",
    sourceUrl: "https://www.ssafy.com/ksp/jsp/swp/swpMain.jsp",
    recruitmentStatus: "upcoming",
    scheduleText: "차기 기수 모집 일정 확인",
    deadlineText: "SSAFY 공식 모집 공지 확인",
    lastVerifiedAt: "2026-03-30",
    isKauInternal: false,
    tracks: ["frontend", "backend", "ai"],
    grades: ["senior"],
    levels: ["basic", "project", "ready"],
    activityTypes: ["bootcamp"],
  },
  {
    id: "sopt-makers",
    title: "SOPT makers",
    category: "동아리",
    summary:
      "실제 사용자가 있는 서비스를 계속 운영·개선하며 제품 경험을 쌓는 서비스형 동아리 카드입니다.",
    details:
      "기획, 디자인, 개발이 함께 움직이기 때문에 프론트엔드, 백엔드, PM, 디자인 직무 모두에 의미가 있습니다. 단순 스터디보다 제품 경험 밀도가 높아 프로젝트 경험 이후에 더 잘 맞습니다.",
    cadence: "기수형 모집",
    estimatedTime: "23주",
    timeBasis:
      "SOPT makers 모집 페이지 기준 한 기수 활동 기간은 총 23주입니다.",
    nextStep:
      "지원 직군과 포트폴리오 요구사항을 먼저 확인하고, 이전 기수 서비스 사례를 살펴보세요.",
    sourceHint: "SOPT makers 모집 페이지",
    sourceName: "SOPT makers 모집",
    sourceUrl: "https://makers.sopt.org/recruit",
    recruitmentStatus: "upcoming",
    scheduleText: "차기 기수 모집 공지 대기",
    deadlineText: "SOPT makers 모집 페이지 확인",
    lastVerifiedAt: "2026-03-30",
    isKauInternal: false,
    tracks: ["frontend", "backend", "product", "design"],
    grades: ["sophomore", "junior", "senior"],
    levels: ["project", "ready"],
    activityTypes: ["club"],
  },
  {
    id: "kmooc-ai-hri",
    title: "K-MOOC 인공지능 HRI",
    category: "강의/학습 활동",
    summary:
      "AI 쪽 감을 먼저 잡아보고 싶은 학생에게 맞는 공개 강좌형 학습 카드입니다.",
    details:
      "아직 탐색 단계이거나 기초 학습 중인 학생이 부담을 크게 늘리지 않고 AI 분야 이해도를 올리는 데 적합합니다. AI 직무 외에도 백엔드에서 ML 서비스 쪽을 보고 있다면 기초 다지기용으로 유효합니다.",
    cadence: "온라인 수강 가능 기간 내 학습",
    estimatedTime: "15주, 학습인정 45시간",
    timeBasis:
      "K-MOOC 강좌 상세 기준 해당 과정은 15주, 학습인정시간 45시간으로 안내됩니다.",
    nextStep:
      "학기 루틴에 무리 없이 넣을 수 있는지 먼저 보고, 이수 기준과 수강 기간을 확인하세요.",
    sourceHint: "K-MOOC 강좌 상세 페이지",
    sourceName: "K-MOOC 인공지능 HRI",
    sourceUrl: "https://www.kmooc.kr/view/course/detail/7534",
    recruitmentStatus: "rolling",
    scheduleText: "수강 가능 기간 내 학습 진행",
    lastVerifiedAt: "2026-03-30",
    isKauInternal: false,
    tracks: ["backend", "ai"],
    grades: ["freshman", "sophomore", "junior", "senior"],
    levels: ["explore", "basic", "project"],
    activityTypes: ["course"],
  },
  {
    id: "kmooc-information-design",
    title: "K-MOOC 실전 인포메이션디자인",
    category: "강의/학습 활동",
    summary:
      "정보 구조와 시각화 감각을 천천히 쌓을 수 있어 디자인과 기획 직무 초반 단계에 잘 맞는 학습 카드입니다.",
    details:
      "디자인 전공이 아니어도 인터페이스와 정보 전달 구조를 이해하는 데 도움이 됩니다. 기획 / PM 직무에서도 화면 구조와 정보 설계 감각을 쌓는 기초 카드로 활용할 수 있습니다.",
    cadence: "온라인 수강 가능 기간 내 학습",
    estimatedTime: "15주, 학습인정 45시간 30분",
    timeBasis:
      "K-MOOC 강좌 상세 기준 실전 인포메이션디자인은 15주, 학습인정 45시간 30분으로 안내됩니다.",
    nextStep:
      "강의만 듣고 끝내지 말고, 개인 작업물이나 기존 프로젝트 화면에 바로 적용해 보세요.",
    sourceHint: "K-MOOC 강좌 상세 페이지",
    sourceName: "K-MOOC 실전 인포메이션디자인",
    sourceUrl: "https://www.kmooc.kr/view/course/detail/16998",
    recruitmentStatus: "rolling",
    scheduleText: "수강 가능 기간 내 학습 진행",
    lastVerifiedAt: "2026-03-30",
    isKauInternal: false,
    tracks: ["product", "design"],
    grades: ["freshman", "sophomore", "junior", "senior"],
    levels: ["explore", "basic", "project"],
    activityTypes: ["course"],
  },
  {
    id: "public-data-startup-competition",
    title: "공공데이터 활용 창업경진대회",
    category: "공모전",
    summary:
      "공공데이터를 활용해 문제를 정의하고 서비스 아이디어나 시제품을 만드는 공모전형 카드입니다.",
    details:
      "데이터 활용, 제품 기획, 서비스 구현을 한 번에 묶을 수 있어 백엔드, AI, PM 직무에 특히 좋습니다. 프로젝트 경험이 조금 있는 뒤에 나가는 편이 결과물 완성도가 높습니다.",
    cadence: "연례 운영",
    estimatedTime: "예선 기준 약 3~4개월",
    timeBasis:
      "공공데이터포털 공고 기준 예선은 여름 시즌까지 진행되고 이후 통합 본선 일정이 이어집니다.",
    nextStep:
      "이전 수상작과 데이터셋을 먼저 보고, 문제 정의 문장과 MVP 범위를 아주 작게 잡아보세요.",
    sourceHint: "공공데이터포털 창업경진대회 공고",
    sourceName: "공공데이터 활용 창업경진대회",
    sourceUrl: "https://www.data.go.kr/suc/startup.do",
    recruitmentStatus: "upcoming",
    scheduleText: "차기 연례 공고 확인",
    deadlineText: "공공데이터포털 공고 확인",
    lastVerifiedAt: "2026-03-30",
    isKauInternal: false,
    tracks: ["backend", "product", "ai"],
    grades: ["sophomore", "junior", "senior"],
    levels: ["basic", "project", "ready"],
    activityTypes: ["contest", "project"],
  },
  {
    id: "opensource-dev-competition",
    title: "오픈소스 개발자대회",
    category: "공모전",
    summary:
      "공개SW 기반으로 아이디어나 개발 결과물을 제출하는 형태라 개발형 포트폴리오와 연결하기 좋습니다.",
    details:
      "일반 아이디어 공모전보다 기술 설명이 가능하다는 점이 강점입니다. 프론트엔드, 백엔드, AI 직무에서 공개 저장소 경험과 함께 묶어내면 설득력이 커집니다.",
    cadence: "연례 운영",
    estimatedTime: "접수 기준 약 6주",
    timeBasis:
      "공개SW 개발자대회 접수 페이지 기준 참가 접수는 통상 수주 단위로 진행됩니다.",
    nextStep:
      "개인으로 갈지 팀으로 갈지 먼저 정하고, 산출물 형식과 제출 요건부터 확인하세요.",
    sourceHint: "오픈소스 포털 개발자대회 소개",
    sourceName: "오픈소스 개발자대회",
    sourceUrl: "https://www.oss.kr/pages/2",
    recruitmentStatus: "upcoming",
    scheduleText: "차기 대회 공지 확인",
    deadlineText: "공개SW 포털 대회 공고 확인",
    lastVerifiedAt: "2026-03-30",
    isKauInternal: false,
    tracks: ["frontend", "backend", "ai"],
    grades: ["sophomore", "junior", "senior"],
    levels: ["project", "ready"],
    activityTypes: ["contest", "opensource"],
  },
]);

export function getActivityById(id: string) {
  return activityCatalog.find((activity) => activity.id === id) ?? null;
}

export function getRecruitmentStatusLabel(status: RecruitmentStatus) {
  if (status === "open") {
    return "모집 중";
  }

  if (status === "upcoming") {
    return "곧 열릴 예정";
  }

  return "상시 확인";
}

export function getRecruitmentStatusPriority(status: RecruitmentStatus) {
  if (status === "open") {
    return 2;
  }

  if (status === "upcoming") {
    return 1;
  }

  return 0;
}

export function formatVerifiedDate(value: string) {
  return value.replaceAll("-", ".");
}
