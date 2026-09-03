import type { SystemChart } from "./types";

/**
 * 감각 기관 — 자극이 지나가는 길.
 *
 * 단원이 외우게 하는 순서가 그대로 세로줄입니다: 자극 → 감각 기관 → 신경 →
 * 뇌 → 신경 → 운동 기관. 신경이 두 번 나오는 것이 시험에서 가장 자주 틀리는
 * 곳이라, 아래로 내려가는 신경은 뇌 아래 화살표에 "명령"으로 적어 두 번째
 * 신경임을 드러냅니다.
 *
 * 다섯 감각 기관은 한 줄에 나란히 섭니다. 눈과 피부만 3D 장기 페이지가 있어
 * 이동이 붙고, 귀·코·혀는 모델이 없어 설명만 열립니다.
 *
 * `desc`/`descEasy`는 비워 둔 자리입니다. 채우는 방법은 charts/index.ts 참고.
 */
export const sensesChart: SystemChart = {
  rows: [
    {
      id: "stimulus",
      nodes: [
        {
          id: "stimulus",
          label: "바깥의 자극",
          kicker: "빛·소리·냄새·맛·닿음",
          desc: "",
          descEasy: "",
        },
      ],
    },
    {
      id: "organs",
      arrow: "몸에 닿는 자극",
      nodes: [
        { id: "eye", label: "눈", kicker: "빛", goOrgan: "eyeball", desc: "", descEasy: "" },
        { id: "ear", label: "귀", kicker: "소리·균형", desc: "", descEasy: "" },
        { id: "nose", label: "코", kicker: "냄새", desc: "", descEasy: "" },
        { id: "tongue", label: "혀", kicker: "맛", desc: "", descEasy: "" },
        { id: "skin", label: "피부", kicker: "닿음·아픔·온도", goOrgan: "skin", desc: "", descEasy: "" },
      ],
    },
    {
      id: "nerve-up",
      arrow: "전기 신호로 바뀌어",
      nodes: [
        {
          id: "nerve-up",
          label: "신경",
          kicker: "전하는 길",
          desc: "",
          descEasy: "",
        },
      ],
    },
    {
      id: "brain",
      nodes: [
        {
          id: "brain",
          label: "뇌",
          kicker: "알아차리고 정해요",
          goOrgan: "brain",
          desc: "",
          descEasy: "",
        },
      ],
    },
    {
      id: "muscle",
      /* 뇌에서 근육으로 가는 길도 신경입니다. 상자를 하나 더 세우는 대신
         화살표에 적었습니다 — 세로줄이 여섯 칸이 되면 한 화면에 안 들어오고,
         시험이 묻는 건 "신경이 두 번 나온다"는 사실이지 상자의 개수가
         아니어서요. 상자로 세우려면 이 줄 앞에 nodes 하나짜리 줄을 넣으면
         됩니다. */
      arrow: "뇌의 명령이 신경을 타고",
      arrowEasy: "뇌의 명령이 신경을 타고",
      nodes: [
        {
          id: "muscle",
          label: "근육",
          kicker: "몸이 움직여요",
          goSystem: "movement",
          desc: "",
          descEasy: "",
        },
      ],
    },
  ],
};
