import type { DiagramLabel } from "./types";

/**
 * The excretory diagram labels its parts with bare numbers — it is the
 * language-neutral cut of the drawing — so the name here is doing work the
 * picture does not. What each number points at is recorded in
 * `docs/content/images-source/excretion_ids.py`.
 */
export const excretionLabels: DiagramLabel[] = [
  {
    id: "kidney",
    label: "1",
    name: "콩팥",
    organId: "kidneys",
    desc: "혈액 속 노폐물을 걸러 오줌을 만드는 기관이에요. 등 쪽 허리 부근에 좌우 하나씩, 모두 두 개가 있습니다. 그림에서는 오른쪽 하나만 가리키고 있어요. 강낭콩 모양이고 크기는 주먹보다 조금 작습니다.",
  },
  {
    id: "ureter",
    label: "2",
    name: "오줌관",
    desc: "콩팥에서 만든 오줌을 방광까지 내려보내는 가느다란 관이에요. 콩팥이 둘이니 오줌관도 좌우 하나씩 두 개입니다. 오줌이 저절로 흘러내리는 게 아니라 관의 근육이 조금씩 밀어 내려 줍니다. 요관이라고도 해요.",
  },
  {
    id: "bladder",
    label: "3",
    name: "방광",
    desc: "오줌을 잠시 모아 두는 주머니예요. 고무풍선처럼 늘어났다 줄어들 수 있어서 종이컵 두세 개 분량까지 담깁니다. 어느 정도 차면 뇌에 '마렵다'는 신호를 보내요.",
  },
  {
    id: "urethra",
    label: "4",
    name: "요도",
    desc: "방광에 모인 오줌이 몸 밖으로 나가는 마지막 길이에요. 평소에는 근육이 조여 닫혀 있다가, 화장실에서 힘을 빼면 열립니다. 그래서 오줌을 참을 수 있는 거예요.",
  },
];
