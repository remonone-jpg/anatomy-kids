import type { DiagramLabel } from "./types";

/** Notes for the circulatory diagram, keyed to the `data-organ` stamped on each
 *  <text> by `docs/content/images-source/annotate.py`.
 *
 *  The two legend lines ("a. = 동맥", "v. = 정맥") carry no id: they explain the
 *  drawing's shorthand rather than naming a vessel, so there is nothing to
 *  open. */

export const circulationLabels: DiagramLabel[] = [

  // ─── 심장과 큰 혈관 ───

  { id: "heart", label: "심장", name: "심장", organId: "heart",
    desc: "온몸으로 피를 밀어 보내는 펌프예요. 이 그림의 모든 혈관이 심장에서 시작해 심장으로 돌아옵니다." },

  { id: "aorta", label: "대동맥", name: "대동맥", beyond: true,
    desc: "심장이 온몸으로 피를 내보내는 가장 큰 동맥이에요. 굵기가 어른 엄지손가락만 하고, 심장에서 나와 활처럼 휘었다가 아래로 내려갑니다." },

  { id: "arcuate", label: "활동맥", name: "활동맥",
    desc: "발등을 가로질러 활 모양으로 휘어진 동맥이에요. 앞정강동맥이 발등으로 내려와 이어진 것으로, 여기서 발가락으로 가는 가지들이 갈라져 나갑니다. 발등정맥활과 짝을 이루는 동맥 쪽 통로예요." },

  { id: "descending-aorta", label: "내림대동맥", name: "내림대동맥", beyond: true,
    desc: "대동맥이 활을 그린 뒤 등을 따라 아래로 내려가는 부분이에요. 가슴과 배의 여러 장기로 가지를 뻗습니다." },

  { id: "svc", label: "위대정맥", name: "위대정맥", beyond: true,
    desc: "머리와 두 팔에서 돌아온 피를 모아 심장으로 보내는 굵은 정맥이에요. 몸 위쪽의 피가 전부 여기로 모입니다." },

  { id: "ivc", label: "아래대정맥", name: "아래대정맥", beyond: true,
    desc: "배와 두 다리에서 돌아온 피를 모아 심장으로 보내는 몸에서 가장 굵은 정맥이에요. 몸 아래쪽의 피가 전부 여기로 모입니다." },

  { id: "pulmonary", label: "허파동맥·정맥", name: "허파동맥과 허파정맥", organId: "lungs", beyond: true,
    desc: "심장과 폐를 잇는 혈관이에요. 특이한 점이 있어요. 허파동맥에는 산소가 적은 피가, 허파정맥에는 산소가 많은 피가 흐릅니다. 동맥과 정맥은 산소가 아니라 흐르는 방향으로 나누기 때문이에요." },

  { id: "coronary", label: "심장동맥·정맥", name: "심장동맥과 심장정맥", organId: "heart", beyond: true,
    desc: "심장 자신에게 피를 대는 혈관이에요. 심장 겉을 왕관처럼 두르고 있어서 관상동맥이라고도 합니다. 심장도 근육이라 스스로 산소를 받아야 뛸 수 있어요." },

  // ─── 머리와 목 ───

  { id: "common-carotid", label: "온목동맥", name: "온목동맥", beyond: true,
  desc: "머리로 피를 보내는 굵은 동맥이에요. 위로 올라가다 속목동맥과 바깥목동맥으로 갈라져요.",
  tryIt: "목 옆에 손가락 두 개를 살짝 대 보세요. 맥박이 잡혀요." },

 { id: "internal-carotid", label: "속목동맥", name: "속목동맥", beyond: true,
    desc: "머리뼈 안으로 들어가 뇌에 피를 대는 동맥이에요. 뇌는 몸에서 가장 많은 피를 쓰는 기관이라 이 혈관이 매우 중요합니다." },

  { id: "external-carotid", label: "바깥목동맥", name: "바깥목동맥", beyond: true,
    desc: "얼굴과 머리 바깥쪽에 피를 대는 동맥이에요. 두피, 얼굴 근육, 혀 같은 곳으로 갑니다." },

  { id: "vertebral", label: "척추동맥", name: "척추동맥", beyond: true,
    desc: "목뼈 속의 구멍을 따라 올라가 뇌 뒤쪽에 피를 대는 동맥이에요. 뼈 안을 통과하기 때문에 잘 보호됩니다." },

  { id: "basilar", label: "뇌바닥동맥", name: "뇌바닥동맥", beyond: true,
    desc: "좌우 척추동맥이 머리뼈 안에서 하나로 합쳐진 동맥이에요. 뇌줄기와 소뇌에 피를 댑니다." },

  { id: "internal-jugular", label: "속목정맥", name: "속목정맥", beyond: true,
    desc: "뇌에서 나온 피를 모아 심장으로 내려보내는 굵은 정맥이에요. 목 안쪽 깊은 곳에서 온목동맥과 나란히 지나갑니다." },

  { id: "external-jugular", label: "바깥목정맥", name: "바깥목정맥", beyond: true,
    desc: "얼굴과 머리 바깥쪽의 피를 모으는 정맥이에요. 목 옆 피부 가까이 지나가서, 힘을 주거나 누우면 도드라져 보이기도 합니다." },

  { id: "venous-sinus", label: "정맥굴", name: "정맥굴", beyond: true,
    desc: "뇌를 감싼 막 사이에 있는 넓은 통로예요. 보통 정맥과 달리 관이 아니라 막 사이의 빈 공간이라, 굴이라는 이름이 붙었습니다. 뇌의 피가 여기 모였다가 목으로 빠져나가요." },

  // ─── 팔 ───

  { id: "subclavian", label: "빗장밑동맥·정맥", name: "빗장밑동맥과 빗장밑정맥", beyond: true,
    desc: "빗장뼈(쇄골) 아래를 지나 팔로 가는 혈관이에요. 이름 그대로 빗장뼈 밑을 통과합니다. 여기서부터 팔의 혈관이 시작돼요." },

  { id: "axillary", label: "겨드랑동맥·정맥", name: "겨드랑동맥과 겨드랑정맥", beyond: true,
    desc: "겨드랑이를 지나는 혈관이에요. 빗장밑혈관이 겨드랑이에 들어서면서 이름이 바뀝니다. 혈관은 지나는 자리에 따라 이름이 달라져요." },

  { id: "brachial", label: "위팔동맥·정맥", name: "위팔동맥과 위팔정맥", beyond: true,
    desc: "위팔 안쪽을 지나는 혈관이에요. 혈압을 잴 때 팔에 감는 띠가 누르는 것이 바로 이 동맥입니다." },

  { id: "radial", label: "노동맥", name: "노동맥", beyond: true,
  desc: "아래팔의 엄지손가락 쪽을 지나는 동맥이에요. '노'는 아래팔 바깥쪽 뼈의 이름이에요.",
  tryIt: "손목 안쪽 엄지 쪽에 손가락을 대 보세요. 맥박이 느껴집니다." },

 { id: "ulnar", label: "자동맥", name: "자동맥", beyond: true,
    desc: "아래팔의 새끼손가락 쪽을 지나는 동맥이에요. 노동맥과 짝을 이루어 손에 피를 댑니다. '자'는 아래팔 안쪽 뼈의 이름이에요." },

  { id: "cephalic", label: "노쪽피부정맥", name: "노쪽피부정맥", beyond: true,
    desc: "팔 바깥쪽 피부 가까이 지나는 정맥이에요. 팔을 늘어뜨리면 손등에서 위팔까지 파르스름하게 비쳐 보이는 줄이 이것입니다." },

  { id: "basilic", label: "자쪽피부정맥", name: "자쪽피부정맥", beyond: true,
    desc: "팔 안쪽 피부 가까이 지나는 정맥이에요. 노쪽피부정맥과 반대편에서 짝을 이룹니다." },

  { id: "median-cubital", label: "팔오금중간정맥", name: "팔오금중간정맥", beyond: true,
    desc: "팔꿈치 안쪽에서 두 피부정맥을 이어 주는 짧은 정맥이에요. 피부 가까이 있고 굵어서, 병원에서 피를 뽑을 때 바늘을 꽂는 자리가 바로 여기입니다." },

  { id: "digital-artery", label: "손가락동맥", name: "손가락동맥", beyond: true,
    desc: "손가락 양옆을 따라 지나는 가는 동맥이에요. 손가락 끝까지 산소를 배달합니다. 손을 베였을 때 피가 잘 나는 것도 이 혈관이 촘촘하기 때문이에요." },

  { id: "palmar-digital-vein", label: "손바닥쪽손가락정맥", name: "손바닥쪽손가락정맥", beyond: true,
    desc: "손가락에서 피를 모아 손바닥 쪽으로 돌려보내는 정맥이에요. 손끝의 피가 심장으로 돌아가는 첫 구간입니다." },

  // ─── 배 ───

  { id: "celiac", label: "복강동맥", name: "복강동맥", beyond: true,
    desc: "대동맥에서 갈라져 나와 위·간·지라에 피를 대는 짧고 굵은 동맥이에요. 배 위쪽 장기들이 여기서 피를 받습니다." },

  { id: "superior-mesenteric", label: "위창자간막동맥·정맥", name: "위창자간막동맥과 정맥", organId: "intestine", beyond: true,
    desc: "작은창자와 큰창자의 앞부분에 피를 대는 혈관이에요. 창자를 감싼 막(창자간막) 속을 부챗살처럼 뻗어 갑니다. 밥을 먹으면 여기로 가는 피가 크게 늘어나요." },

  { id: "splenic", label: "지라동맥·정맥", name: "지라동맥과 지라정맥", beyond: true,
    desc: "지라(비장)에 피를 대고 받는 혈관이에요. 지라는 왼쪽 갈비뼈 아래에 있는 주먹만 한 장기로, 낡은 적혈구를 걸러 내고 면역을 돕습니다." },

  { id: "renal", label: "콩팥동맥·정맥", name: "콩팥동맥과 콩팥정맥", organId: "kidneys", beyond: true,
    desc: "콩팥으로 피를 보내고 받아 오는 혈관이에요. 심장이 내보내는 피의 5분의 1이 넘게 이 길로 갑니다. 콩팥이 피를 걸러야 하니 그만큼 많이 필요해요." },

  { id: "hepatic-vein", label: "간정맥", name: "간정맥", organId: "liver", beyond: true,
    desc: "간에서 일을 마친 피가 아래대정맥으로 빠져나가는 정맥이에요. 간을 통과한 피는 여기를 거쳐 심장으로 돌아갑니다." },

  { id: "portal-vein", label: "간문맥", name: "간문맥", organId: "liver", beyond: true,
    desc: "장에서 영양분을 흡수한 피를 간으로 실어 나르는 특별한 정맥이에요. 보통 정맥은 심장으로 가는데, 이것만은 간으로 갑니다. 먹은 것이 무엇이든 간의 검사를 먼저 받게 하는 구조예요." },

  { id: "gonadal", label: "생식샘동맥·정맥", name: "생식샘동맥과 정맥", beyond: true,
    desc: "생식 기관에 피를 대고 받는 혈관이에요. 대동맥에서 곧바로 갈라져 나올 만큼 중요하게 다뤄집니다." },

  // ─── 다리 ───

  { id: "common-iliac", label: "온엉덩동맥·정맥", name: "온엉덩동맥과 온엉덩정맥", beyond: true,
    desc: "대동맥이 배꼽 아래쯤에서 좌우 둘로 갈라진 혈관이에요. 여기서부터 몸이 왼쪽 다리용과 오른쪽 다리용으로 나뉩니다." },

  { id: "internal-iliac", label: "속엉덩동맥·정맥", name: "속엉덩동맥과 정맥", beyond: true,
    desc: "골반 안쪽 장기들에 피를 대는 혈관이에요. 방광이나 생식 기관처럼 골반 속에 있는 것들이 여기서 피를 받습니다." },

  { id: "external-iliac", label: "바깥엉덩동맥·정맥", name: "바깥엉덩동맥과 정맥", beyond: true,
    desc: "골반을 지나 다리로 내려가는 혈관이에요. 사타구니를 통과하면서 넙다리혈관으로 이름이 바뀝니다." },

  { id: "common-femoral", label: "온넙다리동맥·정맥", name: "온넙다리동맥과 정맥", beyond: true,
    desc: "사타구니 부근의 굵은 혈관이에요. 여기서 깊은 가지와 얕은 가지로 갈라집니다. 피부에서 가까워 응급 상황에 눌러 지혈하는 자리이기도 해요." },

  { id: "femoral", label: "넙다리동맥·정맥", name: "넙다리동맥과 넙다리정맥", beyond: true,
    desc: "허벅지를 따라 내려가는 혈관이에요. 다리는 몸에서 가장 큰 근육이 모인 곳이라 굵은 혈관이 필요합니다." },

  { id: "deep-femoral", label: "깊은넙다리동맥·정맥", name: "깊은넙다리동맥과 정맥", beyond: true,
    desc: "허벅지 깊은 곳의 근육에 피를 대는 혈관이에요. 겉이 아니라 뼈 가까이 지나가서 '깊은'이라는 이름이 붙었습니다." },

  { id: "popliteal", label: "오금동맥·정맥", name: "오금동맥과 오금정맥", beyond: true,
    desc: "무릎 뒤 오목한 곳을 지나는 혈관이에요. 오금은 무릎 뒤쪽을 뜻하는 순우리말입니다. 여기서 종아리로 가는 가지들이 갈라져요." },

  { id: "anterior-tibial", label: "앞정강동맥·정맥", name: "앞정강동맥과 정맥", beyond: true,
    desc: "정강이 앞쪽을 따라 내려가는 혈관이에요. 발등까지 이어져 발가락에 피를 댑니다." },

  { id: "posterior-tibial", label: "뒤정강동맥·정맥", name: "뒤정강동맥과 정맥", beyond: true,
  desc: "종아리 뒤쪽을 따라 내려가는 혈관이에요. 안쪽 복사뼈 뒤에서 맥박을 짚을 수 있습니다.",
  tryIt: "안쪽 복사뼈 뒤를 살짝 만져 보세요. 여기서도 맥박이 잡혀요." },

 { id: "fibular", label: "종아리동맥·정맥", name: "종아리동맥과 정맥", beyond: true,
    desc: "종아리 바깥쪽 뼈를 따라 내려가는 혈관이에요. 뒤정강혈관과 짝을 이루어 종아리 근육에 피를 댑니다." },

  { id: "great-saphenous", label: "큰두렁정맥", name: "큰두렁정맥", beyond: true,
    desc: "발등에서 시작해 다리 안쪽을 따라 사타구니까지 올라가는, 몸에서 가장 긴 정맥이에요. 피부 바로 아래를 지나갑니다. 튼튼해서 심장 수술 때 막힌 혈관을 대신할 관으로 쓰이기도 해요." },

  { id: "small-saphenous", label: "작은두렁정맥", name: "작은두렁정맥", beyond: true,
    desc: "종아리 뒤쪽을 따라 무릎 뒤까지 올라가는 정맥이에요. 큰두렁정맥과 짝을 이룹니다. 두렁은 논밭 사이의 길을 뜻하는 우리말이에요." },

  { id: "dorsal-venous-arch", label: "발등정맥활", name: "발등정맥활", beyond: true,
    desc: "발등에서 활 모양으로 휘어진 정맥이에요. 발가락에서 온 피가 여기 모여 다리 위쪽으로 올라갑니다. 발등에 파르스름하게 비쳐 보이는 줄이 이것이에요." },

  { id: "dorsal-digital-artery", label: "발등쪽발가락동맥", name: "발등쪽발가락동맥", beyond: true,
    desc: "발가락 사이를 따라 지나며 발가락에 피를 대는 가는 동맥이에요. 심장에서 가장 먼 곳까지 산소를 배달하는 마지막 구간입니다." },

  { id: "dorsal-digital-vein", label: "발등쪽발가락정맥", name: "발등쪽발가락정맥", beyond: true,
    desc: "발가락에서 피를 모아 발등정맥활로 보내는 정맥이에요. 몸에서 가장 먼 곳의 피가 심장으로 돌아가기 시작하는 지점입니다." },
];
