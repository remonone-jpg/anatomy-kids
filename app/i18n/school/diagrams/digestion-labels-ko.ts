import type { DiagramLabel } from "./types";

/** Notes for the digestive diagram, keyed to the `data-organ` stamped on each
 *  <text> by `docs/content/images-source/annotate.py`.
 *
 *  Two ids appear twice on purpose: 돌창자/(작은창자) and 잘록창자/(큰창자) are
 *  each one thing split across two lines, and a reader clicking either half
 *  means the same organ. */

export const digestionLabels: DiagramLabel[] = [

  // ─── organs에 있는 9개 (기존 role 사용) ───

  { id: "oral-cavity", label: "입안", name: "입",
    related: ["tongue", "salivary-glands", "pharynx"],
    desc: "이로 잘게 씹고 침과 섞어요. 소화가 시작되는 곳이에요." },

  { id: "esophagus", label: "식도", name: "식도",
    related: ["pharynx", "stomach"],
    desc: "입에서 위까지 음식을 내려보내는 통로. 근육이 물결처럼 움직여 밀어 줍니다." },

  { id: "stomach", label: "위", name: "위", organId: "stomach",
    related: ["esophagus", "duodenum"],
    desc: "음식을 잠시 저장하고 위액과 섞어 죽처럼 만들어요." },

  { id: "ileum", label: "돌창자", name: "작은창자", organId: "intestine",
    related: ["duodenum", "cecum", "colon"],
    desc: "음식을 완전히 소화하고 영양분을 흡수해요. 길이가 약 6m로 가장 길어요. 그림의 '돌창자'는 작은창자의 마지막 부분을 가리키는 이름이에요." },

  { id: "colon", label: "잘록창자", name: "큰창자", organId: "intestine",
    children: ["transverse-colon", "ascending-colon", "descending-colon"],
    related: ["ileum", "cecum", "rectum"],
    desc: "남은 것에서 물을 흡수하고 나머지를 내보낼 준비를 해요. 잘록창자는 큰창자의 가장 긴 부분이에요." },

  { id: "anus", label: "항문", name: "항문",
    related: ["rectum"],
    desc: "소화되지 않은 것을 몸 밖으로 내보내는 곳이에요." },

  { id: "liver", label: "간", name: "간", organId: "liver",
    related: ["gallbladder", "bile-duct"],
    desc: "소화를 돕는 쓸개즙을 만들어요. 흡수한 영양분을 저장하기도 합니다." },

  { id: "gallbladder", label: "쓸개", name: "쓸개",
    related: ["liver", "bile-duct"],
    desc: "간이 만든 쓸개즙을 모아 두었다가 필요할 때 내보내요." },

  { id: "pancreas", label: "이자", name: "이자", organId: "pancreas",
    related: ["pancreatic-duct", "duodenum"],
    desc: "소화를 돕는 이자액을 만들어 작은창자로 보내요." },

  // ─── 새로 쓴 17개 ───

  { id: "tongue", label: "혀", name: "혀",
    related: ["oral-cavity", "pharynx"],
    desc: "음식을 이 사이로 밀어 넣고 침과 골고루 섞어 줘요. 맛도 느끼고, 다 씹은 음식을 목구멍으로 넘기는 일도 합니다." },

  { id: "salivary-glands", label: "침샘", name: "침샘",
    children: ["parotid", "submandibular", "sublingual"],
    related: ["oral-cavity", "tongue"],
    desc: "침을 만들어 입안으로 내보내는 곳이에요. 하루에 우유갑 하나 반쯤 되는 침을 만들어요. 침에는 녹말을 분해하는 물질이 들어 있어서, 밥을 오래 씹으면 단맛이 나요." },

  { id: "parotid", label: "귀밑샘", name: "귀밑샘", beyond: true,
    related: ["salivary-glands", "submandibular"],
    desc: "침샘 셋 중에서 가장 큰 것으로, 귀 바로 앞쪽에 있어요. 볼거리에 걸리면 이 부분이 부어올라 볼이 빵빵해집니다." },

  { id: "submandibular", label: "턱밑샘", name: "턱밑샘", beyond: true,
    related: ["salivary-glands", "sublingual"],
    desc: "턱 아래쪽에 있는 침샘이에요. 평소에 나오는 침의 대부분을 이곳이 만듭니다. 신 것을 먹었을 때 턱 아래가 찡한 것이 이 샘 때문이에요." },

  { id: "sublingual", label: "혀밑샘", name: "혀밑샘", beyond: true,
    related: ["salivary-glands", "submandibular"],
    desc: "혀 아래에 있는 가장 작은 침샘이에요. 끈적한 침을 만들어 음식이 잘 넘어가게 도와줍니다." },

  { id: "pharynx", label: "인두", name: "인두", beyond: true,
    related: ["oral-cavity", "esophagus"],
    desc: "입과 코의 뒤쪽에서 식도와 기관으로 갈라지는 목구멍 부분이에요. 음식은 식도로, 공기는 기관으로 나뉘어 갑니다. 급하게 먹다 사레들리는 것은 이 갈림길에서 음식이 잘못 들어갔을 때예요." },

  { id: "duodenum", label: "샘창자", name: "샘창자", beyond: true,
    related: ["stomach", "bile-duct", "pancreatic-duct", "ileum"],
    desc: "작은창자가 시작되는 첫 부분이에요. 위에서 내려온 죽 같은 음식이 여기서 쓸개즙과 이자액을 만나 본격적으로 분해됩니다. 손가락 열두 개를 옆으로 늘어놓은 만큼 길다고 해서 십이지장이라고도 불러요." },

  { id: "bile-duct", label: "온쓸개관", name: "온쓸개관", beyond: true,
    related: ["gallbladder", "liver", "duodenum"],
    desc: "간과 쓸개에서 만든 쓸개즙이 샘창자로 내려가는 관이에요. 이자관과 만나 함께 샘창자로 들어갑니다. 이 관이 막히면 쓸개즙이 못 내려가 몸이 노랗게 되기도 해요." },

  { id: "pancreatic-duct", label: "이자관", name: "이자관", beyond: true,
    related: ["pancreas", "duodenum"],
    desc: "이자가 만든 이자액이 샘창자로 흘러가는 관이에요. 온쓸개관과 합쳐져서 하나의 입구로 들어갑니다." },

  { id: "transverse-colon", label: "가로잘록창자", name: "가로잘록창자", beyond: true,
    related: ["ascending-colon", "descending-colon"],
    desc: "큰창자에서 배를 가로질러 지나가는 부분이에요. 오른쪽에서 왼쪽으로 건너갑니다. 여기서 물을 흡수하는 일이 활발하게 일어나요." },

  { id: "ascending-colon", label: "오름잘록창자", name: "오름잘록창자", beyond: true,
    related: ["cecum", "transverse-colon"],
    desc: "큰창자에서 오른쪽 아래에서 위로 올라가는 부분이에요. 중력을 거슬러 올라가는데도 내용물이 잘 이동하는 것은 장 근육이 밀어 주기 때문입니다." },

  { id: "descending-colon", label: "내림잘록창자", name: "내림잘록창자", beyond: true,
    related: ["transverse-colon", "rectum"],
    desc: "큰창자에서 왼쪽으로 내려가는 부분이에요. 여기까지 오면 물이 많이 흡수되어 내용물이 제법 단단해집니다." },

  { id: "cecum", label: "막창자", name: "막창자", beyond: true,
    related: ["ileum", "appendix", "ascending-colon"],
    desc: "작은창자가 끝나고 큰창자가 시작되는 자리에 있는 주머니예요. 오른쪽 아랫배에 있습니다. 작은창자에서 넘어온 것이 잠시 머무는 곳이에요." },

  { id: "appendix", label: "막창자꼬리", name: "막창자꼬리", beyond: true,
    related: ["cecum"],
    desc: "막창자 끝에 손가락처럼 달린 작은 관이에요. 흔히 '맹장'이라고 부르는 것이 사실은 이 부분입니다. 오랫동안 쓸모없는 기관으로 여겨졌지만, 장에 사는 좋은 미생물들의 피난처 역할을 한다는 연구가 있어요." },

  { id: "rectum", label: "곧창자", name: "곧창자", beyond: true,
    related: ["descending-colon", "anus"],
    desc: "큰창자의 마지막 부분으로, 항문 바로 앞이에요. 여기에 내용물이 모이면 뇌에 신호를 보내 화장실에 가고 싶어집니다." },

  { id: "small-intestine-note", label: "(작은창자)", name: "작은창자", organId: "intestine",
    related: ["duodenum"],
    desc: "샘창자·빈창자·돌창자를 합쳐 작은창자라고 해요. 약 6~7m로 소화 기관 중 가장 길고, 영양분을 흡수하는 일을 맡습니다." },

  { id: "large-intestine-note", label: "(큰창자)", name: "큰창자", organId: "intestine",
    related: ["cecum", "rectum"],
    desc: "막창자·잘록창자·곧창자를 합쳐 큰창자라고 해요. 약 1.5m로 작은창자보다 짧지만 굵습니다. 물을 흡수하는 일을 맡아요." },
];
