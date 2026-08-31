import type { DiagramLabel } from "./types";

/**
 * The original labels its parts with bare numbers — it is the language-neutral
 * cut of the drawing — and those numbers are replaced with these names when
 * the file is built. Which number turned into which name, and how that was
 * settled, is recorded in `docs/content/images-source/excretion_terms.py`.
 */
export const excretionLabels: DiagramLabel[] = [
  {
    id: "kidney",
    label: "콩팥",
    name: "콩팥",
    organId: "kidneys",
    related: ["ureter"],
    desc: "혈액 속 노폐물을 걸러 오줌을 만드는 기관이에요. 등 쪽 허리 부근에 좌우 하나씩 있고, 그림에서는 오른쪽 하나만 가리키고 있습니다. 콩팥 하나에는 네프론이라는 아주 작은 여과 장치가 백만 개쯤 들어 있어요. 심장이 내보내는 피의 5분의 1이 넘게 이곳으로 오는데, 피를 거르는 일에 그만큼 많은 양이 필요하기 때문입니다. 오른쪽 콩팥이 왼쪽보다 조금 아래 있는데, 위쪽에 간이 자리를 차지하고 있어서예요.",
  },
  {
    id: "ureter",
    label: "오줌관",
    name: "오줌관",
    related: ["kidney", "bladder"],
    desc: "콩팥에서 만든 오줌을 방광까지 내려보내는 가느다란 관이에요. 길이는 25센티미터쯤 되고 굵기는 볼펜 심 정도입니다. 오줌이 저절로 흘러내리는 게 아니라, 관의 근육이 물결처럼 오므라들며 조금씩 밀어 내려요. 그래서 누워 있어도 물구나무를 서도 오줌은 방광으로 갑니다. 방광으로 들어가는 자리가 비스듬히 뚫려 있어서, 방광이 차오르면 그 압력에 입구가 눌려 닫히고 오줌이 거꾸로 올라가지 못해요.",
  },
  {
    id: "bladder",
    label: "방광",
    name: "방광",
    related: ["ureter", "urethra"],
    desc: "오줌을 잠시 모아 두는 주머니예요. 벽이 주름져 있어서 비었을 때는 쪼그라들어 있다가 차오르면 풍선처럼 펴집니다. 종이컵 두세 개 분량까지 담기고, 절반쯤 찼을 때 처음 신호가 옵니다. 그 신호는 방광 벽이 늘어나는 것을 감지해서 보내는 거예요. 그런데 뇌가 '아직 안 돼'라고 답하면 신호가 잠시 잦아듭니다. 오줌을 참을 수 있는 것이 이 대화 덕분이에요.",
  },
  {
    id: "urethra",
    label: "요도",
    name: "요도",
    related: ["bladder"],
    desc: "방광에 모인 오줌이 몸 밖으로 나가는 마지막 길이에요. 이 통로에는 조임근이 두 겹 있습니다. 안쪽 것은 우리 뜻과 상관없이 저절로 닫혀 있고, 바깥쪽 것은 마음대로 조였다 풀 수 있어요. 아기가 처음에 오줌을 못 가리는 것은 바깥쪽 조임근을 조절하는 법을 아직 못 배웠기 때문입니다. 여성의 요도는 4센티미터 정도로 짧고 남성은 20센티미터쯤 되는데, 짧을수록 바깥 세균이 방광까지 올라가기 쉬워요.",
  },
];
