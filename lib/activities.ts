import type {
  ActivityType,
  Availability,
  Grade,
  Level,
  Track,
} from "@/lib/profile";

export type Activity = {
  id: string;
  title: string;
  category: "교내" | "대외";
  summary: string;
  details: string;
  cadence: string;
  nextStep: string;
  sourceHint: string;
  tracks: Track[];
  grades: Grade[];
  levels: Level[];
  availabilities: Availability[];
  activityTypes: ActivityType[];
};

export const activityCatalog: Activity[] = [
  {
    id: "campus-hackathon",
    title: "교내 해커톤 / 서비스 제작 행사",
    category: "교내",
    summary:
      "짧은 기간 안에 결과물을 만들어 포트폴리오와 협업 경험을 동시에 쌓기 좋습니다.",
    details:
      "해커톤은 완성도보다 끝까지 만들고 발표해 본 경험이 중요합니다. 특히 프론트엔드, 백엔드, 기획, 디자인 직무를 동시에 묶어보기에 좋아 초반 스토리 만들기에 유리합니다.",
    cadence: "학기 중 1~2회",
    nextStep: "학교 공지와 SW중심대학, 창업지원단 일정을 먼저 모아두세요.",
    sourceHint: "학교 홈페이지 공지, SW중심대학 사업단, 창업지원단",
    tracks: ["frontend", "backend", "product", "design", "ai"],
    grades: ["freshman", "sophomore", "junior", "senior"],
    levels: ["basic", "project", "ready"],
    availabilities: ["steady", "focused", "immersive"],
    activityTypes: ["hackathon"],
  },
  {
    id: "industry-project",
    title: "산학협력 프로젝트 / 캡스톤 연계",
    category: "교내",
    summary:
      "실제 문제를 다루는 경험을 만들기 좋아서 지원서와 면접에서 설명하기 편합니다.",
    details:
      "산학 프로젝트는 요구사항 정의부터 결과 발표까지 흐름이 길기 때문에 어느 정도 기본기가 있거나 프로젝트 경험이 있는 학생에게 특히 잘 맞습니다.",
    cadence: "학기 단위",
    nextStep: "캡스톤 공지와 산학협력단, 교수 연구실 모집을 같이 확인하세요.",
    sourceHint: "캡스톤 공지, 산학협력단, 교수 연구실 모집",
    tracks: ["frontend", "backend", "product", "design", "ai"],
    grades: ["junior", "senior"],
    levels: ["project", "ready"],
    availabilities: ["focused", "immersive"],
    activityTypes: ["project"],
  },
  {
    id: "major-club",
    title: "전공 학회 / 프로젝트 스터디",
    category: "교내",
    summary:
      "진입장벽이 낮고 꾸준히 결과물을 만들 수 있어서 초반 커리어 빌드업에 가장 안정적입니다.",
    details:
      "MVP 단계에서는 화려한 활동보다 지속성이 중요합니다. 학회나 스터디는 작은 단위로 기능을 만들고 피드백을 받기 좋아 초반에 습관과 결과물을 함께 만들 수 있습니다.",
    cadence: "상시 모집 또는 학기 초",
    nextStep:
      "학과 커뮤니티와 선배 네트워크, 에브리타임에서 활동 강도가 맞는 팀을 찾으세요.",
    sourceHint: "학과 커뮤니티, 선배 추천, 학생회 채널",
    tracks: ["frontend", "backend", "product", "design", "ai"],
    grades: ["freshman", "sophomore", "junior", "senior"],
    levels: ["explore", "basic", "project"],
    availabilities: ["light", "steady", "focused"],
    activityTypes: ["club"],
  },
  {
    id: "supporters",
    title: "대외 서포터즈 / 앰배서더",
    category: "대외",
    summary:
      "브랜딩, 운영, 커뮤니케이션 경험을 짧은 기간 안에 만들고 싶을 때 적합합니다.",
    details:
      "기획과 디자인 직무라면 운영 결과물이나 콘텐츠 산출물을 남기기 좋습니다. 활동 강도가 비교적 읽기 쉬워 시간 여유가 많지 않은 학생에게도 맞는 편입니다.",
    cadence: "월별 / 분기별 모집",
    nextStep:
      "희망 산업군 기업의 채널을 팔로우하고 지원 시즌을 캘린더에 고정하세요.",
    sourceHint: "기업 공식 채널, 링커리어, 캠퍼스픽",
    tracks: ["product", "design", "frontend"],
    grades: ["freshman", "sophomore", "junior", "senior"],
    levels: ["explore", "basic", "project"],
    availabilities: ["light", "steady"],
    activityTypes: ["supporters"],
  },
  {
    id: "contest",
    title: "공모전 / 아이디어톤",
    category: "대외",
    summary:
      "짧은 기간에 수상 이력과 문제 해결 경험을 함께 만들고 싶을 때 유효합니다.",
    details:
      "공모전은 많이 나가기보다 분야를 좁혀 반복 도전하는 편이 낫습니다. 이전 수상작과 심사 포인트를 분석해 두면 두 번째부터 효율이 올라갑니다.",
    cadence: "상시",
    nextStep:
      "관심 분야 두 개만 정해서 이전 수상작을 분석하고 유사 공모전을 추적하세요.",
    sourceHint: "씽굿, 링커리어, 분야별 협회/기관 공고",
    tracks: ["frontend", "backend", "product", "design", "ai"],
    grades: ["sophomore", "junior", "senior"],
    levels: ["basic", "project", "ready"],
    availabilities: ["steady", "focused", "immersive"],
    activityTypes: ["contest"],
  },
  {
    id: "opensource",
    title: "오픈소스 기여 / 기술 커뮤니티 활동",
    category: "대외",
    summary:
      "개발 직무라면 실무 감각과 공개 이력을 동시에 만들 수 있는 선택지입니다.",
    details:
      "처음부터 큰 기능을 고치려 하지 말고 문서 개선이나 작은 버그 수정부터 시작하는 편이 현실적입니다. 공개 기록이 남기 때문에 개발자 포트폴리오와 궁합이 좋습니다.",
    cadence: "상시",
    nextStep: "작은 문서 수정이나 이슈 재현부터 시작해 기여 히스토리를 남기세요.",
    sourceHint: "GitHub Issues, 기술 커뮤니티, 개발자 밋업",
    tracks: ["frontend", "backend", "ai"],
    grades: ["sophomore", "junior", "senior"],
    levels: ["project", "ready"],
    availabilities: ["light", "steady", "focused"],
    activityTypes: ["opensource"],
  },
  {
    id: "startup-club",
    title: "창업 동아리 / 액셀러레이팅 프로그램",
    category: "대외",
    summary:
      "서비스를 직접 만들고 검증하는 흐름을 익히기 좋아 여러 직무에 두루 유효합니다.",
    details:
      "문제를 정의하고 인터뷰하고 실험하는 과정이 전부 기록으로 남습니다. 다만 활동 강도가 높은 편이라 시간 여유가 있는지 먼저 계산해 보는 것이 좋습니다.",
    cadence: "분기별 모집",
    nextStep:
      "교내 창업동아리부터 시작하고, 이후 정부·민간 액셀러레이터로 확장하세요.",
    sourceHint: "창업지원단, K-Startup, 민간 액셀러레이터 모집",
    tracks: ["frontend", "backend", "product", "design", "ai"],
    grades: ["sophomore", "junior", "senior"],
    levels: ["project", "ready"],
    availabilities: ["focused", "immersive"],
    activityTypes: ["startup"],
  },
  {
    id: "global-program",
    title: "글로벌 교류 프로그램 / 국제 프로젝트",
    category: "대외",
    summary:
      "영어 커뮤니케이션과 협업 스토리를 확보하려는 경우 차별점이 강하게 남습니다.",
    details:
      "직무 스킬 자체보다 협업 맥락을 넓히는 데 의미가 큽니다. 특히 기획, 디자인, 개발 모두 국제 협업 사례를 남기면 이후 지원서에서 쓰임새가 좋습니다.",
    cadence: "학기별 모집",
    nextStep:
      "국제처, 해외대학 협력 프로그램, 청년 글로벌 프로그램을 함께 모니터링하세요.",
    sourceHint: "국제처, 교환·방문학생 공지, 정부 청년 글로벌 프로그램",
    tracks: ["frontend", "backend", "product", "design", "ai"],
    grades: ["freshman", "sophomore", "junior", "senior"],
    levels: ["explore", "basic", "project"],
    availabilities: ["steady", "focused"],
    activityTypes: ["global"],
  },
];

export function getActivityById(id: string) {
  return activityCatalog.find((activity) => activity.id === id) ?? null;
}
