import type { DiagramLabel } from "./types";

/**
 * The original is a multilingual Commons file — every label a <switch> holding
 * four languages — and it labels the alveolar inset as thoroughly as the body,
 * which is why it carries 222 <text> elements for these 48 labels.
 *
 * 허파꽈리방 is the one to watch: the English reads "Atrium", but it is a part
 * of the alveolus, not a chamber of the heart.
 */
export const respirationLabels: DiagramLabel[] = [
  { id: "nose", label: "코", name: "코", related: ["nasal-cavity", "nasal-vestibule", "paranasal-sinuses"],
    desc: "공기가 드나드는 입구예요. 들어온 공기를 데우고 촉촉하게 만들고 먼지를 걸러 냅니다. 입으로 숨 쉴 때보다 코로 쉴 때 목이 덜 칼칼한 이유예요.",
    tryIt: "한쪽 콧구멍을 막고 숨을 쉬어 보세요. 양쪽이 번갈아 잘 통하는 걸 느낄 수 있어요." },

  { id: "nasal-cavity", label: "코안", name: "코안", related: ["nose", "nasal-conchae", "pharynx"],
    desc: "콧구멍 안쪽의 넓은 공간이에요. 벽이 점막으로 덮여 있어 늘 촉촉하고, 여기를 지나는 동안 공기가 몸 온도에 가깝게 데워집니다." },

  { id: "nasal-conchae", label: "코선반", name: "코선반", related: ["nasal-cavity"],
    desc: "코안 벽에 선반처럼 튀어나온 뼈예요. 세 겹으로 되어 있어서 공기가 지나가는 길을 구불구불하게 만듭니다. 그만큼 공기가 점막에 많이 닿아 잘 데워지고 촉촉해져요." },

  { id: "nasal-vestibule", label: "코안뜰", name: "코안뜰", related: ["nose", "nasal-cavity"],
    desc: "콧구멍 바로 안쪽이에요. 여기에 코털이 나 있어서 큰 먼지를 1차로 걸러 냅니다." },

  { id: "paranasal-sinuses", label: "코곁굴", name: "코곁굴", related: ["frontal-sinus", "sphenoid-sinus", "nasal-cavity"],
    desc: "머리뼈 속에 빈 공간으로 있는 굴이에요. 머리를 가볍게 하고 목소리를 울리게 합니다. 감기에 걸리면 여기에 콧물이 차서 머리가 무거워져요." },

  { id: "frontal-sinus", label: "이마굴", name: "이마굴", related: ["paranasal-sinuses", "sphenoid-sinus"],
    desc: "이마 안쪽에 있는 굴이에요. 코곁굴 중 하나입니다. 감기 때 이마가 지끈거리는 것이 여기 때문일 수 있어요." },

  { id: "sphenoid-sinus", label: "나비굴", name: "나비굴", related: ["paranasal-sinuses", "frontal-sinus"],
    desc: "머리뼈 깊숙한 곳, 나비 모양 뼈 속에 있는 굴이에요. 코곁굴 중 가장 안쪽에 있습니다." },

  { id: "pharynx", label: "인두", name: "인두", related: ["nasal-cavity", "oral-cavity", "larynx", "esophagus"],
    desc: "코와 입 뒤쪽에서 만나는 목구멍이에요. 여기서 공기는 후두로, 음식은 식도로 갈라집니다. 급하게 먹다 사레들리는 것은 이 갈림길에서 음식이 잘못 들어갔을 때예요." },

  { id: "larynx", label: "후두", name: "후두", related: ["pharynx", "epiglottis", "vocal-folds", "trachea"],
    desc: "목 앞쪽에 있는 공기 통로예요. 안에 성대가 있어서 소리를 냅니다. 목젖처럼 튀어나온 부분이 후두의 연골이에요." },

  { id: "epiglottis", label: "후두덮개", name: "후두덮개", related: ["larynx", "pharynx", "esophagus"],
    desc: "후두 입구에 달린 뚜껑이에요. 음식을 삼킬 때 자동으로 닫혀서 기관으로 들어가는 것을 막습니다. 이 뚜껑이 늦게 닫히면 사레가 들려요." },

  { id: "thyroid-cartilage", label: "방패연골", name: "방패연골", related: ["larynx", "cricoid-cartilage", "vocal-folds"],
    desc: "후두 앞을 방패처럼 감싼 연골이에요. 목 앞으로 튀어나온 부분이 이것이고, 사춘기 이후 남성에게서 더 도드라집니다.",
    tryIt: "목 앞 가운데를 만지며 침을 삼켜 보세요. 딱딱한 것이 위아래로 움직여요." },

  { id: "cricoid-cartilage", label: "반지연골", name: "반지연골", related: ["larynx", "thyroid-cartilage", "trachea"],
    desc: "방패연골 아래에 반지처럼 둥글게 이어진 연골이에요. 기관에서 유일하게 앞뒤가 완전히 둘러싸인 고리입니다." },

  { id: "vocal-folds", label: "성대주름", name: "성대주름", related: ["larynx", "thyroid-cartilage"],
    desc: "후두 안에 있는 두 겹의 주름이에요. 공기가 지나가며 떨리면 소리가 납니다. 팽팽하게 당기면 높은 소리, 느슨하면 낮은 소리가 나요." },

  { id: "oral-cavity", label: "입안", name: "입안", related: ["pharynx", "nasal-cavity"],
    desc: "코가 막혔을 때 공기가 드나드는 곳이에요. 다만 코와 달리 먼지를 거르거나 공기를 데우지 못합니다." },

  { id: "esophagus", label: "식도", name: "식도", related: ["pharynx", "trachea"],
    desc: "음식이 위로 내려가는 통로예요. 호흡 기관은 아니지만 인두에서 기관과 나란히 갈라지기 때문에 이 그림에 함께 나옵니다. 기관 바로 뒤에 있어요." },

  { id: "trachea", label: "기관", name: "기관", related: ["larynx", "carina", "main-bronchi", "cartilage-rings"],
    desc: "목에서 가슴으로 내려가는 굵은 공기 길이에요. 하나뿐입니다. 안쪽에 섬모라는 작은 털이 있어 먼지를 목구멍 쪽으로 밀어 올립니다." },

  { id: "carina", label: "기관갈림", name: "기관갈림", related: ["trachea", "main-bronchi"],
    desc: "기관이 좌우 두 갈래로 갈라지는 지점이에요. 여기가 유난히 예민해서, 이물질이 닿으면 강한 기침이 납니다." },

  { id: "main-bronchi", label: "주기관지", name: "주기관지", related: ["trachea", "carina", "lobar-bronchus"],
    desc: "기관에서 갈라져 각각의 허파로 들어가는 두 갈래예요. 오른쪽이 더 굵고 가파르게 내려가서, 잘못 삼킨 것이 오른쪽으로 들어가는 경우가 더 많습니다." },

  { id: "lobar-bronchus", label: "엽기관지", name: "엽기관지", related: ["main-bronchi", "superior-bronchus", "middle-bronchus", "inferior-bronchus"],
    desc: "주기관지가 허파 안에서 각 엽으로 갈라진 가지예요. 오른허파는 세 갈래, 왼허파는 두 갈래입니다." },

  { id: "superior-bronchus", label: "위엽 기관지", name: "위엽 기관지", related: ["lobar-bronchus", "right-superior-lobe"],
    desc: "허파 위엽으로 들어가는 기관지예요. 그림에서 초록색으로 표시된 가지입니다." },

  { id: "middle-bronchus", label: "중간엽 기관지", name: "중간엽 기관지", related: ["lobar-bronchus", "right-middle-lobe"],
    desc: "오른허파 중간엽으로 들어가는 기관지예요. 왼허파에는 중간엽이 없어서 이 가지도 없습니다." },

  { id: "inferior-bronchus", label: "아래엽 기관지", name: "아래엽 기관지", related: ["lobar-bronchus", "right-inferior-lobe"],
    desc: "허파 아래엽으로 들어가는 기관지예요. 그림에서 파란색으로 표시된 가지입니다." },

  { id: "lingular-bronchi", label: "혀구역 기관지", name: "혀구역 기관지", related: ["lingula", "left-superior-lobe"],
    desc: "왼허파의 혀처럼 늘어진 부분으로 들어가는 기관지예요. 오른허파의 중간엽에 해당하는 자리입니다." },

  { id: "cartilage-rings", label: "기관·기관지 연골고리", name: "기관·기관지 연골고리", related: ["trachea", "main-bronchi"],
    desc: "기관과 기관지를 감싼 C자 모양 연골이에요. 이 고리가 있어서 숨을 세게 들이쉬어도 관이 찌그러지지 않습니다. 뒤쪽이 트인 C자인 이유는 바로 뒤 식도가 음식이 지날 때 부풀 자리를 주기 위해서예요.",
    tryIt: "목 앞 기관을 살살 만져 보세요. 오돌토돌한 고리가 하나씩 잡힙니다." },

  { id: "right-lung", label: "오른허파", name: "오른허파", related: ["left-lung", "right-superior-lobe", "right-middle-lobe", "right-inferior-lobe"],
    desc: "오른쪽 가슴의 허파예요. 엽이 세 개라 왼허파보다 크고 무겁습니다." },

  { id: "left-lung", label: "왼허파", name: "왼허파", related: ["right-lung", "left-superior-lobe", "left-inferior-lobe", "cardiac-notch"],
    desc: "왼쪽 가슴의 허파예요. 심장이 왼쪽으로 치우쳐 있어서 자리를 양보하느라 엽이 두 개뿐이고 오른쪽보다 작습니다." },

  { id: "right-superior-lobe", label: "오른위엽", name: "오른위엽", related: ["right-lung", "right-middle-lobe", "horizontal-fissure"],
    desc: "오른허파의 맨 위 부분이에요. 아래로 수평틈새를 경계로 중간엽과 나뉩니다." },

  { id: "left-superior-lobe", label: "왼위엽", name: "왼위엽", related: ["left-lung", "left-inferior-lobe", "lingula", "left-apex"],
    desc: "왼허파의 위쪽 부분이에요. 아래쪽에 혀처럼 늘어진 부분이 붙어 있습니다." },

  { id: "right-middle-lobe", label: "오른중간엽", name: "오른중간엽", related: ["right-lung", "right-superior-lobe", "right-inferior-lobe"],
    desc: "오른허파에만 있는 가운데 부분이에요. 셋 중 가장 작습니다. 왼허파에는 이 엽이 없어요." },

  { id: "right-inferior-lobe", label: "오른아래엽", name: "오른아래엽", related: ["right-lung", "right-middle-lobe", "right-oblique-fissure"],
    desc: "오른허파의 맨 아래 부분이에요. 셋 중 가장 크고, 가로막 바로 위에 놓입니다." },

  { id: "left-inferior-lobe", label: "왼아래엽", name: "왼아래엽", related: ["left-lung", "left-superior-lobe", "left-oblique-fissure"],
    desc: "왼허파의 아래 부분이에요. 왼허파는 이 엽과 위엽 둘로만 나뉩니다." },

  { id: "horizontal-fissure", label: "수평틈새", name: "수평틈새", related: ["right-superior-lobe", "right-middle-lobe", "right-oblique-fissure"],
    desc: "오른허파에서 위엽과 중간엽을 가르는 가로 방향의 틈이에요. 오른허파에만 있습니다." },

  { id: "right-oblique-fissure", label: "오른빗틈새", name: "오른빗틈새", related: ["right-lung", "horizontal-fissure", "left-oblique-fissure"],
    desc: "오른허파에서 아래엽을 가르는 비스듬한 틈이에요. 수평틈새와 함께 오른허파를 세 부분으로 나눕니다." },

  { id: "left-oblique-fissure", label: "왼빗틈새", name: "왼빗틈새", related: ["left-lung", "right-oblique-fissure"],
    desc: "왼허파를 위엽과 아래엽으로 가르는 비스듬한 틈이에요. 왼허파에는 이 틈 하나뿐입니다." },

  { id: "cardiac-notch", label: "심장패임", name: "심장패임", related: ["left-lung", "lingula"],
    desc: "왼허파 앞쪽이 심장 자리만큼 움푹 파인 곳이에요. 심장이 왼쪽으로 치우쳐 있어서 허파가 자리를 비켜 준 흔적입니다." },

  { id: "lingula", label: "허파혀", name: "허파혀", related: ["left-lung", "cardiac-notch", "lingular-bronchi"],
    desc: "왼허파에서 심장패임 아래로 혀처럼 늘어진 부분이에요. 오른허파의 중간엽에 해당하는 자리입니다." },

  { id: "left-apex", label: "왼허파꼭대기", name: "허파꼭대기", related: ["left-lung", "left-superior-lobe"],
    desc: "허파의 맨 위 끝이에요. 빗장뼈보다 조금 위까지 올라가 있어서, 목 아래쪽까지 허파가 뻗어 있는 셈입니다." },

  { id: "diaphragm", label: "가로막", name: "가로막", related: ["right-lung", "left-lung"],
    desc: "허파 아래에 있는 넓은 근육이에요. 이 근육이 내려가면 가슴 속 공간이 넓어져 공기가 들어오고, 올라가면 나갑니다. 폐는 스스로 움직이지 못하고 이 근육이 숨을 쉬게 해요. 딸꾹질은 이 근육이 갑자기 경련하는 것입니다.",
    tryIt: "한 손은 가슴에, 다른 손은 배에 얹고 깊게 숨을 쉬어 보세요. 배가 나오는 게 가로막이 내려가는 신호예요." },

  { id: "alveoli", label: "허파꽈리", name: "허파꽈리", related: ["alveolar-sacs", "alveolar-duct", "capillary-beds", "alveolar-atrium"],
    desc: "기관지 끝에 포도송이처럼 달린 작은 공기주머니예요. 양쪽 허파에 3~5억 개가 있고, 여기서 산소가 피로 건너가고 이산화탄소가 나옵니다. 방이 많을수록 교환할 면이 넓어지는 구조예요." },

  { id: "alveolar-sacs", label: "허파꽈리주머니", name: "허파꽈리주머니", related: ["alveoli", "alveolar-duct"],
    desc: "허파꽈리 여러 개가 포도송이처럼 모여 있는 덩어리예요. 하나의 관 끝에 여러 방이 달린 모양입니다." },

  { id: "alveolar-duct", label: "허파꽈리관", name: "허파꽈리관", related: ["alveolar-sacs", "alveoli", "alveolar-atrium"],
    desc: "기관지가 마지막으로 가늘어져 허파꽈리로 이어지는 관이에요. 공기가 지나는 길의 끝부분입니다." },

  { id: "alveolar-atrium", label: "허파꽈리방", name: "허파꽈리방", related: ["alveolar-duct", "alveolar-sacs", "alveoli"],
    desc: "허파꽈리관과 허파꽈리주머니 사이의 작은 공간이에요. 이름이 심장의 심방과 같지만 전혀 다른 것으로, 여기서는 허파꽈리 구조의 일부입니다." },

  { id: "capillary-beds", label: "모세혈관그물", name: "모세혈관그물", related: ["alveoli", "pulmonary-artery", "pulmonary-vein"],
    desc: "허파꽈리를 그물처럼 감싼 아주 가는 혈관이에요. 벽이 한 겹뿐이라 산소와 이산화탄소가 쉽게 오갑니다. 허파꽈리와 이 혈관 사이 벽의 두께는 1마이크로미터가 되지 않아요." },

  { id: "pulmonary-artery", label: "허파동맥", name: "허파동맥", related: ["capillary-beds", "pulmonary-vein", "alveoli"],
    desc: "심장에서 허파로 피를 보내는 혈관이에요. 특이하게 산소가 적은 피가 흐릅니다. 동맥과 정맥은 산소가 아니라 흐르는 방향으로 나누기 때문이에요." },

  { id: "pulmonary-vein", label: "허파정맥", name: "허파정맥", related: ["capillary-beds", "pulmonary-artery", "alveoli"],
    desc: "허파에서 산소를 실은 피가 심장으로 돌아가는 혈관이에요. 정맥인데 산소가 많은 피가 흐르는 유일한 경우입니다." },

  { id: "connective-tissue", label: "결합조직", name: "결합조직", related: ["alveoli", "alveolar-sacs"],
    desc: "허파꽈리들 사이를 채워 서로 붙잡아 주는 조직이에요. 탄력이 있어서 숨을 내쉴 때 허파가 원래대로 돌아오게 돕습니다." },

  { id: "mucous-gland", label: "점액샘", name: "점액샘", related: ["mucosal-lining", "alveolar-duct"],
    desc: "끈끈한 점액을 만들어 내보내는 작은 샘이에요. 이 점액이 먼지와 세균을 붙잡습니다." },

  { id: "mucosal-lining", label: "점막", name: "점막", related: ["mucous-gland", "alveolar-duct"],
    desc: "기도 안쪽을 덮은 촉촉한 막이에요. 위에 얇은 점액층이 떠 있고, 그 아래 섬모가 물결치며 먼지를 밖으로 밀어냅니다." },
];
