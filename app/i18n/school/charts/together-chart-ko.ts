import type { SystemChart } from "./types";

/**
 * 몸의 통합 — 물질이 도는 고리.
 *
 * 들여오는 둘이 위에 나란히 서고, 순환이 받아 세포로 보내고, 세포가 쓰고 남긴
 * 것을 순환이 다시 실어 배설로 내려보냅니다. 세포에서 순환으로 되돌아가는 길은
 * 세로 화살표로 그릴 수 없어 양옆 괄호로 돕니다.
 *
 * 감각과 뇌·운동은 고리에 넣지 않고 곁에 두었습니다. 이 둘은 물질을 주고받는
 * 것이 아니라 판단하고 움직이는 짝이라, 고리에 끼워 넣으면 없는 선을 그리는
 * 셈이 됩니다. 단원의 "무엇으로" 여섯 항목은 그대로 살아 있습니다 — 넷은
 * 고리에, 둘은 곁에.
 *
 * `desc`/`descEasy`는 비워 둔 자리입니다. 채우는 방법은 charts/index.ts 참고.
 */
export const togetherChart: SystemChart = {
  asideTitle: "고리 곁에서 — 판단하고 움직이는 짝",
  loop: {
    from: "carry",
    to: "use",
    label: "쓰고 남은 찌꺼기를 순환이 다시 실어 와요",
    labelEasy: "쓰고 남은 찌꺼기를 다시 실어 와요",
  },
  rows: [
    {
      id: "in",
      nodes: [
        {
          id: "digestion",
          accent: "#cf7d63",
          icon: "utensils",
          label: "소화 기관",
          kicker: "영양분을 들여와요",
          goSystem: "digestion",
          desc: "",
          descEasy: "",
        },
        {
          id: "respiration",
          accent: "#7fa8c4",
          icon: "wind",
          label: "호흡 기관",
          kicker: "산소를 들여와요",
          goSystem: "respiration",
          desc: "",
          descEasy: "",
        },
      ],
    },
    {
      id: "carry",
      arrow: "몸 안으로 들어온 영양분과 산소",
      arrowEasy: "들어온 영양분과 산소",
      nodes: [
        {
          id: "circulation",
          accent: "#d06f74",
          icon: "heart",
          label: "순환 기관",
          kicker: "온몸으로 실어 날라요",
          goSystem: "circulation",
          desc: "",
          descEasy: "",
        },
      ],
    },
    {
      id: "use",
      arrow: "피를 타고 배달",
      nodes: [
        {
          id: "cells",
          accent: "#2f2a27",
          icon: "cell",
          label: "온몸의 세포",
          kicker: "받아 쓰고 찌꺼기를 내요",
          desc: "",
          descEasy: "",
        },
      ],
    },
    {
      id: "out",
      arrow: "걸러야 할 찌꺼기",
      nodes: [
        {
          id: "excretion",
          accent: "#86a97f",
          icon: "droplets",
          label: "배설 기관",
          kicker: "몸 밖으로 내보내요",
          goSystem: "excretion",
          desc: "",
          descEasy: "",
        },
      ],
    },
    {
      id: "beside",
      aside: true,
      nodes: [
        {
          id: "senses",
          accent: "#a98cc4",
          icon: "brain",
          label: "감각 기관과 뇌",
          kicker: "알아차리고 정해요",
          goSystem: "senses",
          desc: "",
          descEasy: "",
        },
        {
          id: "movement",
          accent: "#c98a5b",
          icon: "bone",
          label: "운동 기관",
          kicker: "실제로 움직여요",
          goSystem: "movement",
          desc: "",
          descEasy: "",
        },
      ],
    },
  ],
};
