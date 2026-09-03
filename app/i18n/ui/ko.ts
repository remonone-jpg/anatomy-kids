import type { UiDictionary } from "../types";

export const ui: UiDictionary = {
  meta: {
    title: "Anatomy Atelier — 예술가처럼 배우는 해부학",
    description:
      "심장, 뇌, 폐, 간, 콩팥, 눈, 위, 장, 이자, 피부까지 — 의학적으로 정밀한 3D 장기를 인터랙티브 해부 아틀리에에서 살펴보세요.",
    ogTitle: "Anatomy Atelier — 예술가처럼 배우는 해부학",
    ogDescription: "의학적으로 정밀한 3D 표본으로 몸속을 직접 들여다봅니다.",
    imageAlt: "받침대 위에 떠 있는 해부학적 심장 표본과 Anatomy Atelier 로고",
  },
  brand: { tagline: "예술가처럼 배우는 해부학", home: "Anatomy Atelier 홈" },
  search: { placeholder: "장기나 주제 검색…" },
  language: { label: "언어", choose: "언어 선택" },
  library: {
    title: "장기 라이브러리", open: "장기 라이브러리 열기", close: "라이브러리 닫기", viewAll: "모든 장기 보기",
    quoteLine1: "배움은", quoteLine2: "궁금해하는 데서 시작됩니다.", quoteSign: "계속 탐색해 보세요!",
  },
  tools: {
    label: "3D 뷰어 도구", rotate: "회전", zoom: "확대", reset: "초기화",
  },
  viewer: {
    title: "{organ} 3D 뷰어",
    canvas: "조작 가능한 3D 해부 모델입니다. 끌어서 회전하고, 스크롤해 확대하며, 점을 클릭하면 그 구조에 대한 설명이 나옵니다.",
    tip: "도움말", tipDrag: "끌어서 회전", tipScroll: "스크롤해 확대",
    tipClick: "점을 클릭해 자세히 보기",
    loading: "{organ} 준비 중", autoRotate: "자동 회전",
    caption: "3D 표본 · 점을 클릭하세요", structures: "이 표본의 구조",
    pending: "{organ} 3D 모형은 준비 중이에요",
    pendingNote: "설명과 이야기는 옆에서 먼저 볼 수 있어요",
  },
  info: {
    kicker: "{organ}", keyFacts: "핵심 정보", size: "크기", weight: "무게", daily: "하루",
    location: "위치", bloodSupply: "혈액 공급", function: "기능",
    medical: "의학적 의의", didYouKnow: "알고 계셨나요", viewLesson: "조직 살펴보기",
    animate: "과정 보기", quiz: "찾기 놀이",
  },
  cards: {
    resources: "{organ} 학습 자료",
    microscopic: "현미경 소견", functionAnimation: "움직이는 과정",
    clinicalNotes: "임상 노트", whereItWorks: "작용하는 곳", commonConditions: "흔한 질환",
    exploreTissue: "조직 살펴보기", playAnimation: "과정 따라가기",
    seeAll: "전체 보기", seeSystem: "계통 보기",
    playAria: "{organ}이(가) 어떻게 움직이는지 따라가기", systemAria: "몸에서 {organ}의 위치 보기",
  },
  quiz: { find: "찾아보세요:", progress: "{total}문제 중 {current}번",
    correct: "정답", wrong: "아쉬워요", reveal: "여기가 {label}이에요", answer: "{label}이 초록색으로 표시돼 있어요",
    done: "퀴즈 완료", score: "{total}문제 중 {score}문제 정답", retry: "다시 풀기",
    exit: "퀴즈 끝내기", hint: "모델에서 해당하는 점을 클릭하세요",
  },
  modal: {
    guided: "안내 탐색", close: "닫기", continueExploring: "계속 탐색하기", motionTitle: "움직이는 {organ}",
    bodyTitle: "몸속의 {organ}", insideTitle: "{organ} 속으로",
    lessonBody:
      "빛나는 부분을 하나씩 따라가 보세요. 돌려 보면서 생김새와 하는 일을 함께 보면 오래 기억에 남습니다.",
    systemIntro: "{location}. {organ}이(가) 몸의 나머지 부분과 어떻게 이어지는지 따라가 보세요.",
    system: "계통", primaryRole: "주요 역할", bloodSupply: "혈액 공급",
  },
  walk: {
    title: "과정 따라가기",
    prev: "이전",
    next: "다음",
    close: "그만 보기",
    passage: "본문에서 보기",
  },
  tissue: {
    heading: "현미경으로 보면",
    passage: "본문에서 보기",
  },
  conditions: {
    listTitle: "{organ}의 흔한 질환",
    back: "목록으로",
    urgent: "응급",
    what: "어떤 병인가",
    symptoms: "주요 증상",
    causes: "왜 생기나",
    risk: "위험 요인",
    fixed: "바꿀 수 없는 것",
    modifiable: "줄일 수 있는 것",
    seeDoctor: "이럴 땐 진료를",
    note: "알아두면 좋은 것",
    noDetail: "자세한 설명은 준비 중입니다.",
    disclaimer:
      "이 내용은 교육 목적의 일반 정보입니다. 증상이 있거나 걱정된다면 의료진과 상의하세요.",
  },
};
