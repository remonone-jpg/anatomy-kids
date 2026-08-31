# crossSystem — 기관계 간 연결

교과서가 강조하는 "기관계는 서로 연결된다"를 화면에서 실제로 보여주는 기능.
라벨을 누르면 "다른 기관과도 이어져요" 항목이 뜨고,
누르면 그 기관계 화면으로 이동하며 지정된 라벨이 강조된다.

## 스키마

```ts
crossSystem?: {
  systemId: string;    // movement · digestion · respiration · circulation · excretion
  labelId?: string;    // 도착지에서 강조할 라벨 (선택)
  reason: string;      // 왜 이어지는지
};
```

## 선정 기준

1. **해부학적으로 실제로 맞닿거나 이어지는 것**
2. **한쪽이 다른 쪽의 일을 돕거나 보호하는 것**
3. 억지로 이으면 넣지 않음 — 없으면 생략

## 분량

| 도해 | 라벨 | crossSystem | 비율 |
|---|---|---|---|
| 뼈와 근육 | 28 | 22 | 79% |
| 소화 | 26 | 14 | 54% |
| 호흡 | 48 | 16 | 33% |
| 순환 | 48 | 18 | 38% |
| 배설 | 4 | 4 | 100% |
| **합계** | **154** | **74** | **48%** |

---

## 1. 뼈와 근육 (22개)

```ts
skull:        { systemId:"respiration", labelId:"paranasal-sinuses",
  reason:"머리뼈 속은 꽉 찬 게 아니라 코곁굴이라는 빈 공간이 여러 개 있어요. 그 덕에 머리가 가벼워지고 목소리가 울립니다." }

cranium:      { systemId:"circulation", labelId:"internal-carotid",
  reason:"이 뼈가 감싼 뇌는 몸에서 피를 가장 많이 쓰는 기관이에요. 속목동맥이 머리뼈 밑을 뚫고 들어가 뇌에 피를 댑니다." }

mandible:     { systemId:"digestion", labelId:"oral-cavity",
  reason:"얼굴에서 유일하게 움직이는 이 뼈가 소화의 첫 단계를 맡아요. 이 뼈가 위아래로 움직여야 음식을 씹어 잘게 부술 수 있습니다." }

cervical:     { systemId:"respiration", labelId:"trachea",
  reason:"목뼈 바로 앞으로 기관이 지나갑니다. 목 앞을 만지면 잡히는 오돌토돌한 고리가 그것이고, 뒤쪽 딱딱한 것이 목뼈예요." }

clavicle:     { systemId:"circulation", labelId:"subclavian",
  reason:"빗장뼈 아래로 팔에 피를 보내는 굵은 혈관이 지나갑니다. 이름도 '빗장밑동맥'이라 이 뼈에서 따온 거예요." }

scapula:      { systemId:"circulation", labelId:"axillary",
  reason:"어깨뼈가 만드는 겨드랑이 공간으로 팔의 혈관과 신경이 지나갑니다. 팔을 오래 눌러 저리는 것도 이 통로 때문이에요." }

manubrium:    { systemId:"circulation", labelId:"heart",
  reason:"복장뼈 바로 뒤에 심장이 있어요. 심폐소생술에서 가슴을 누르는 것은 이 뼈를 통해 심장을 압박하는 것입니다." }

sternum:      { systemId:"circulation", labelId:"heart",
  reason:"복장뼈와 갈비뼈가 만든 새장 안에 심장이 들어 있어요. 뼈가 없으면 심장이 바깥 충격에 그대로 노출됩니다." }

ribs:         { systemId:"respiration", labelId:"diaphragm",
  reason:"갈비뼈는 허파를 보호할 뿐 아니라 숨 쉬는 일도 함께 합니다. 들이쉴 때 갈비뼈가 올라가고 가로막이 내려가면서 가슴 공간이 넓어져요." }

thoracic:     { systemId:"respiration", labelId:"right-lung",
  reason:"등뼈 12개에 갈비뼈가 하나씩 붙어 허파를 감쌉니다. 그래서 등뼈는 목뼈나 허리뼈보다 덜 움직여요." }

lumbar:       { systemId:"excretion", labelId:"kidney",
  reason:"허리뼈 양옆, 등 쪽에 콩팥이 하나씩 있습니다. 허리에 손을 얹었을 때 갈비뼈가 끝나는 지점 바로 아래가 그 자리예요." }

sacrum:       { systemId:"excretion", labelId:"bladder",
  reason:"엉치뼈와 골반이 대야 모양을 이루어 방광이 놓일 자리를 만듭니다. 오줌이 차면 이 공간 안에서 방광이 부풀어요." }

pelvis:       { systemId:"excretion", labelId:"bladder",
  reason:"골반은 방광과 창자를 아래에서 받쳐 주는 그릇이에요. 이 뼈가 없으면 배 속 장기들이 아래로 처집니다." }

spine:        { systemId:"circulation", labelId:"descending-aorta",
  reason:"척추 바로 앞으로 몸에서 가장 굵은 동맥이 내려갑니다. 뼈 기둥이 뒤에서 받쳐 주는 자리예요." }

femur:        { systemId:"circulation", labelId:"heart",
  reason:"넓적다리뼈 속 골수는 피를 만드는 공장입니다. 심장이 보내는 피의 재료가 여기서 만들어져요." }

patella:      { systemId:"circulation", labelId:"popliteal",
  reason:"무릎뼈 반대편, 무릎 뒤 오목한 곳으로 다리의 굵은 혈관이 지나갑니다. 무릎을 오래 굽히고 있으면 다리가 저린 이유예요." }

tibia:        { systemId:"circulation", labelId:"posterior-tibial",
  reason:"정강뼈 뒤쪽, 안쪽 복사뼈 뒤로 혈관이 지나가 맥박이 잡힙니다. 손목 말고도 맥박을 짚을 수 있는 자리예요." }

fibula:       { systemId:"circulation", labelId:"fibular",
  reason:"종아리뼈를 따라 같은 이름의 혈관이 나란히 내려갑니다. 뼈와 혈관이 짝을 이루어 붙은 이름이에요." }

humerus:      { systemId:"circulation", labelId:"brachial",
  reason:"위팔뼈 안쪽을 따라 위팔동맥이 지나갑니다. 혈압을 잴 때 팔에 감는 띠가 누르는 것이 바로 이 혈관이에요." }

radius:       { systemId:"circulation", labelId:"radial",
  reason:"노뼈를 따라 노동맥이 내려와 손목에서 맥박이 잡힙니다. 뼈와 혈관이 같은 이름을 쓰는 것도 나란히 있기 때문이에요." }

ulna:         { systemId:"circulation", labelId:"ulnar",
  reason:"자뼈를 따라 자동맥이 내려갑니다. 노동맥과 짝을 이루어 손에 피를 대요." }

metatarsals:  { systemId:"circulation", labelId:"dorsal-venous-arch",
  reason:"발등 뼈 위로 정맥이 활 모양으로 지나갑니다. 발등에 파르스름하게 비쳐 보이는 줄이 그것이에요." }
```

**안 넣은 6개** — carpals · metacarpals · phalanges-hand · coccyx · tarsals · phalanges-foot

---

## 2. 소화 (14개)

```ts
oral-cavity:  { systemId:"respiration", labelId:"pharynx",
  reason:"입안 뒤쪽에서 공기 길과 음식 길이 만납니다. 급하게 먹다 사레들리는 것이 이 갈림길에서 음식이 잘못 들어갔을 때예요." }

tongue:       { systemId:"respiration", labelId:"epiglottis",
  reason:"혀뿌리가 뒤로 밀리면 후두덮개가 눌려 닫힙니다. 혀가 음식을 넘기는 동작이 곧 기도를 막는 신호가 되는 거예요." }

pharynx:      { systemId:"respiration", labelId:"larynx",
  reason:"인두에서 공기는 후두로, 음식은 식도로 갈라집니다. 소화 기관과 호흡 기관이 통로를 나눠 쓰는 유일한 자리예요." }

esophagus:    { systemId:"respiration", labelId:"cartilage-rings",
  reason:"식도는 기관 바로 뒤에 붙어 있습니다. 기관의 연골 고리가 뒤쪽만 트인 C자인 것도, 음식이 지날 때 식도가 부풀 자리를 주기 위해서예요." }

stomach:      { systemId:"circulation", labelId:"celiac",
  reason:"복강동맥이 위에 피를 댑니다. 밥을 먹으면 이 길로 가는 피가 크게 늘어나고, 그만큼 다른 곳으로 갈 피가 줄어 식곤증이 와요." }

liver:        { systemId:"circulation", labelId:"portal-vein",
  reason:"장에서 흡수한 영양분은 심장으로 곧장 가지 않고 간문맥을 타고 간부터 들릅니다. 먹은 것이 무엇이든 간의 검사를 먼저 받는 구조예요." }

pancreas:     { systemId:"circulation", labelId:"splenic",
  reason:"지라동맥이 이자 뒤를 구불구불 지나갑니다. 이자가 만드는 인슐린도 관이 아니라 혈관을 타고 온몸으로 나가요." }

ileum:        { systemId:"circulation", labelId:"superior-mesenteric",
  reason:"작은창자가 흡수한 영양분은 위창자간막정맥에 실려 나갑니다. 흡수와 배달이 바로 이어지는 지점이에요." }

colon:        { systemId:"excretion", labelId:"kidney",
  reason:"큰창자는 물을 회수하고 콩팥은 물을 조절합니다. 설사로 물을 많이 잃으면 콩팥이 오줌을 줄여 균형을 맞춰요." }

rectum:       { systemId:"excretion", labelId:"bladder",
  reason:"곧창자와 방광은 골반 안에서 이웃해 있습니다. 둘 다 '차오르면 신호를 보내고 뇌가 답하는' 같은 방식으로 조절돼요." }

anus:         { systemId:"excretion", labelId:"urethra",
  reason:"항문과 요도는 조임근이 두 겹이라는 구조가 같습니다. 하나는 저절로 닫히고 하나는 마음대로 조절할 수 있어요." }

gallbladder:  { systemId:"circulation", labelId:"hepatic-vein",
  reason:"쓸개즙의 재료 중 하나는 낡은 적혈구가 분해되며 나온 색소입니다. 피가 수명을 다한 흔적이 소화액이 되는 셈이에요." }

mandible_note_replaced_by_oral: undefined

duodenum:     { systemId:"circulation", labelId:"celiac",
  reason:"샘창자 주변으로 복강동맥의 가지들이 지나갑니다. 소화액이 합류하는 자리라 피도 많이 필요해요." }

cecum:        { systemId:"circulation", labelId:"superior-mesenteric",
  reason:"막창자와 큰창자 앞부분에 위창자간막동맥이 피를 댑니다. 창자가 구불구불해도 어디에나 피가 닿도록 가지들이 그물을 이뤄요." }
```

★ `mandible_note_replaced_by_oral` 줄은 실수로 남은 것이니 **넣지 말 것.**
소화는 위 목록에서 그 줄을 뺀 **14개**입니다.

---

## 3. 호흡 (16개)

```ts
nose:              { systemId:"digestion", labelId:"oral-cavity",
  reason:"코가 막히면 입으로 숨을 쉬게 됩니다. 그러면 입안이 말라 침이 줄고, 소화의 첫 단계도 영향을 받아요." }

pharynx:           { systemId:"digestion", labelId:"esophagus",
  reason:"인두에서 음식은 식도로, 공기는 후두로 갈라집니다. 두 기관계가 통로를 나눠 쓰는 유일한 자리예요." }

epiglottis:        { systemId:"digestion", labelId:"tongue",
  reason:"혀뿌리가 뒤로 밀리면 이 뚜껑이 눌려 닫힙니다. 삼키는 동작 하나가 기도를 막는 일까지 함께 해내는 거예요." }

esophagus:         { systemId:"digestion", labelId:"stomach",
  reason:"이 통로를 따라 음식이 위로 내려갑니다. 호흡 기관 그림에 나오는 것은 기관 바로 뒤에 붙어 있기 때문이에요." }

oral-cavity:       { systemId:"digestion", labelId:"salivary-glands",
  reason:"입은 공기 길이자 음식 길입니다. 침샘이 만든 침이 여기 모여 소화를 시작해요." }

larynx:            { systemId:"movement", labelId:"cervical",
  reason:"후두는 목뼈 앞에 놓여 있습니다. 목 앞을 만지면 딱딱한 연골이 잡히고, 그 뒤로 목뼈가 있어요." }

trachea:           { systemId:"movement", labelId:"cervical",
  reason:"기관이 목뼈 바로 앞을 지나갑니다. 목 앞의 오돌토돌한 고리가 기관이고, 뒤쪽 딱딱한 것이 목뼈예요." }

cartilage-rings:   { systemId:"digestion", labelId:"esophagus",
  reason:"C자 고리의 트인 쪽이 뒤를 향한 이유가 여기 있어요. 바로 뒤 식도가 음식이 지날 때 부풀 자리를 주기 위해서입니다." }

right-lung:        { systemId:"movement", labelId:"ribs",
  reason:"갈비뼈가 새장처럼 허파를 감싸 보호합니다. 그러면서 숨 쉴 때는 벌어졌다 좁아지며 호흡을 도와요." }

left-lung:         { systemId:"circulation", labelId:"heart",
  reason:"왼허파가 오른쪽보다 작은 것은 심장에 자리를 양보했기 때문이에요. 앞쪽이 심장 모양만큼 움푹 파여 있습니다." }

cardiac-notch:     { systemId:"circulation", labelId:"heart",
  reason:"이 패임 덕분에 심장 앞쪽 일부가 허파에 덮이지 않고 가슴벽에 바로 닿아요. 청진기로 심장 소리를 듣는 자리입니다." }

diaphragm:         { systemId:"movement", labelId:"ribs",
  reason:"가로막이 내려가고 갈비뼈가 올라가면서 가슴 공간이 넓어집니다. 근육 하나가 아니라 둘이 함께 숨을 만들어요." }

alveoli:           { systemId:"circulation", labelId:"pulmonary",
  reason:"허파꽈리에서 산소가 피로 건너가고 이산화탄소가 나옵니다. 호흡과 순환이 실제로 만나는 지점이에요." }

capillary-beds:    { systemId:"circulation", labelId:"pulmonary",
  reason:"허파꽈리를 감싼 이 그물이 허파동맥과 허파정맥을 잇습니다. 산소를 실은 피가 여기서 심장 쪽으로 방향을 바꿔요." }

pulmonary-artery:  { systemId:"circulation", labelId:"heart",
  reason:"심장 오른쪽에서 나와 허파로 오는 혈관이에요. 동맥인데 산소가 적은 피가 흐르는 것이 이 때문입니다." }

pulmonary-vein:    { systemId:"circulation", labelId:"heart",
  reason:"허파에서 산소를 실은 피가 심장 왼쪽으로 돌아갑니다. 그 피가 곧바로 온몸으로 나가요." }
```

---

## 4. 순환 (18개)

```ts
heart:             { systemId:"movement", labelId:"sternum",
  reason:"복장뼈와 갈비뼈가 만든 새장 안에 심장이 들어 있어요. 뼈가 없으면 심장이 바깥 충격에 그대로 노출됩니다." }

pulmonary:         { systemId:"respiration", labelId:"alveoli",
  reason:"이 혈관이 심장과 허파를 잇습니다. 허파꽈리에서 산소를 싣고 이산화탄소를 내려놓아요." }

coronary:          { systemId:"movement", labelId:"sternum",
  reason:"심장 겉을 두른 이 혈관은 복장뼈 바로 뒤에 있습니다. 심폐소생술에서 가슴을 누르는 것도 이 자리예요." }

descending-aorta:  { systemId:"movement", labelId:"spine",
  reason:"척추 바로 앞을 따라 내려갑니다. 뼈 기둥이 뒤에서 받쳐 주어 몸에서 가장 잘 보호받는 혈관이에요." }

common-carotid:    { systemId:"movement", labelId:"cervical",
  reason:"목뼈 옆을 지나 머리로 올라갑니다. 목 옆에 손가락을 대면 맥박이 잡히는 자리예요." }

vertebral:         { systemId:"movement", labelId:"cervical",
  reason:"목뼈마다 옆으로 뚫린 구멍이 이어져 터널을 이루고, 이 동맥이 그 안을 지나갑니다. 뼈가 혈관을 감싸 보호하는 셈이에요." }

subclavian:        { systemId:"movement", labelId:"clavicle",
  reason:"빗장뼈 아래를 지나서 붙은 이름이에요. 빗장뼈와 첫 번째 갈비뼈 사이 좁은 틈을 통과합니다." }

axillary:          { systemId:"movement", labelId:"scapula",
  reason:"어깨뼈가 만드는 겨드랑이 공간을 지나갑니다. 팔을 오래 눌러 저린 것도 여기가 눌렸기 때문이에요." }

brachial:          { systemId:"movement", labelId:"humerus",
  reason:"위팔뼈 안쪽을 따라 내려갑니다. 혈압을 잴 때 팔에 감는 띠가 누르는 것이 이 혈관이에요." }

radial:            { systemId:"movement", labelId:"radius",
  reason:"노뼈를 따라 내려와 손목에서 맥박이 잡힙니다. 뼈 바로 위를 얕게 지나가서 손가락으로 누르기 좋아요." }

ulnar:             { systemId:"movement", labelId:"ulna",
  reason:"자뼈를 따라 내려갑니다. 뼈와 혈관이 같은 이름을 쓰는 것도 나란히 붙어 있기 때문이에요." }

celiac:            { systemId:"digestion", labelId:"stomach",
  reason:"위·간·지라에 피를 대는 혈관이에요. 밥을 먹으면 이 길로 가는 피가 크게 늘어납니다." }

superior-mesenteric: { systemId:"digestion", labelId:"ileum",
  reason:"작은창자와 큰창자 앞부분에 피를 댑니다. 흡수한 영양분을 실어 나르는 것도 이 혈관이에요." }

portal-vein:       { systemId:"digestion", labelId:"liver",
  reason:"장에서 영양분을 흡수한 피를 간으로 실어 나릅니다. 먹은 것이 무엇이든 간의 검사를 먼저 받게 하는 구조예요." }

renal:             { systemId:"excretion", labelId:"kidney",
  reason:"콩팥으로 피를 보내고 받아 옵니다. 심장이 내보내는 피의 5분의 1이 넘게 이 길로 가요." }

popliteal:         { systemId:"movement", labelId:"patella",
  reason:"무릎 뒤 오목한 곳을 지나갑니다. 무릎을 오래 굽히면 이 혈관이 눌려 다리가 저려요." }

posterior-tibial:  { systemId:"movement", labelId:"tibia",
  reason:"정강뼈 뒤쪽을 따라 내려가 안쪽 복사뼈 뒤에서 맥박이 잡힙니다. 손목 말고도 맥박을 짚을 수 있는 자리예요." }

dorsal-venous-arch:{ systemId:"movement", labelId:"metatarsals",
  reason:"발등 뼈 위로 활 모양으로 지나갑니다. 발등에 파르스름하게 비쳐 보이는 줄이 이것이에요." }
```

---

## 5. 배설 (4개)

```ts
kidney:   { systemId:"circulation", labelId:"renal",
  reason:"콩팥은 피를 거르는 기관이라 콩팥동맥으로 엄청난 양의 피를 받습니다. 심장이 내보내는 피의 5분의 1이 넘어요." }

ureter:   { systemId:"movement", labelId:"lumbar",
  reason:"오줌관이 허리뼈 앞을 따라 내려갑니다. 콩팥에서 방광까지 가는 길이 척추와 나란해요." }

bladder:  { systemId:"movement", labelId:"pelvis",
  reason:"골반이 대야처럼 방광을 아래에서 받쳐 줍니다. 오줌이 차면 이 공간 안에서 방광이 부풀어요." }

urethra:  { systemId:"digestion", labelId:"anus",
  reason:"요도와 항문은 조임근이 두 겹이라는 구조가 같습니다. 하나는 저절로 닫히고 하나는 마음대로 조절할 수 있어요." }
```

---

## 확인 요청

1. 참조하는 `systemId`와 `labelId`가 전부 실존하는지 먼저 검사
2. 없는 것이 있으면 알려줄 것 — 지어내지 말고
3. 특히 `celiac` · `splenic` · `superior-mesenteric` · `renal` · `portal-vein` 은
   순환 도해에 있는 id인지 확인 필요

## 선행 작업

`picked` 초기화 버그를 먼저 고쳐야 함.
기관계를 바꿔도 이전 라벨을 들고 있어 "48개 중 0번째"가 나오는 문제.
