export type KauShortcutLink = {
  title: string;
  description: string;
  url: string;
  group: "학생 활동" | "진로 / 현장" | "연구 / 산학";
};

export const kauShortcutLinks: KauShortcutLink[] = [
  {
    title: "AI융합대학 학생 참여 활동",
    description: "프로젝트, 대외활동, 내부 프로그램 공지를 가장 먼저 확인하는 기본 채널",
    url: "https://aisw.kau.ac.kr/pages/student_02.php?code=s7201",
    group: "학생 활동",
  },
  {
    title: "AI융합대학 대학 소식 / 공지",
    description: "학내 행사와 주요 공지를 한 번에 보는 페이지",
    url: "https://aisw.kau.ac.kr/pages/news.php",
    group: "학생 활동",
  },
  {
    title: "AI융합대학 인턴십 / 실무 연계",
    description: "인턴십과 현장실습은 학생 참여 활동 보드와 진로센터를 같이 보는 것이 효율적입니다.",
    url: "https://career.kau.ac.kr/",
    group: "진로 / 현장",
  },
  {
    title: "AI융합대학 산학협력 프로젝트",
    description: "학기형 프로젝트와 산학 연계 공고를 확인하는 산학협력단 채널",
    url: "https://research.kau.ac.kr/info/info_021.php",
    group: "연구 / 산학",
  },
  {
    title: "교수·연구실 안내",
    description: "학부연구생이나 연구실 참여를 고려할 때 가장 먼저 보는 페이지",
    url: "https://aisw.kau.ac.kr/pages/professor.php",
    group: "연구 / 산학",
  },
  {
    title: "산학협력단 사업공고",
    description: "산학·연구 과제성 공고를 묶어서 보는 공식 채널",
    url: "https://research.kau.ac.kr/info/info_021.php",
    group: "연구 / 산학",
  },
  {
    title: "대학일자리플러스센터",
    description: "현장실습, 인턴십, 진로 프로그램을 묶어서 보는 공식 진로 허브",
    url: "https://career.kau.ac.kr/",
    group: "진로 / 현장",
  },
];
