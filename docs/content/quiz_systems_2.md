# 초등 기관계 시험퀴즈 (2/2) — 배설 · 감각 · 연결

1/2과 동일 스키마·동일 유형 배분.
**이 문서로 7개 기관계 × 15문항 = 105문항 완성.**

---

## 5. 배설 기관 (15문항)

```ts
export const quizExcretion: SystemQuizItem[] = [
  { id:"x01", systemId:"excretion", type:"order", examPoint:"배설 기관의 순서",
    question:"오줌이 만들어져 몸 밖으로 나가는 순서로 옳은 것은?",
    options:["콩팥 → 방광 → 오줌관 → 요도","콩팥 → 오줌관 → 방광 → 요도","방광 → 콩팥 → 오줌관 → 요도","오줌관 → 콩팥 → 방광 → 요도"], answer:1,
    explain:"콩팥 → 오줌관 → 방광 → 요도. 오줌관을 빠뜨리기 쉬우니 주의하세요." },
  { id:"x02", systemId:"excretion", type:"classify", examPoint:"배설과 배출의 구분",
    question:"다음 중 배설에 해당하는 것은?",
    options:["대변","오줌","눈물","침"], answer:1,
    explain:"배설은 혈액 속 노폐물을 내보내는 것이에요. 대변은 소화되지 않은 찌꺼기라 배출이라고 구분합니다. 시험 단골 문제예요." },
  { id:"x03", systemId:"excretion", type:"match", examPoint:"오줌이 만들어지는 곳",
    question:"오줌을 만드는 기관은?",
    options:["방광","콩팥","오줌관","요도"], answer:1,
    explain:"콩팥이 혈액을 걸러 오줌을 만듭니다. 방광은 만드는 곳이 아니라 모아 두는 곳이에요." },
  { id:"x04", systemId:"excretion", type:"match",
    question:"오줌을 잠시 모아 두는 기관은?",
    options:["콩팥","오줌관","방광","요도"], answer:2,
    explain:"방광은 늘어났다 줄어들 수 있는 주머니예요. 어느 정도 차면 마렵다는 신호를 보냅니다." },
  { id:"x05", systemId:"excretion", type:"classify", examPoint:"콩팥의 위치와 모양",
    question:"콩팥의 위치와 모양으로 옳은 것은?",
    options:["배 앞쪽에 하나, 둥근 모양","등 쪽 허리 부근에 좌우 하나씩, 강낭콩 모양","가슴 한가운데 하나, 주먹 모양","배 아래쪽에 좌우 하나씩, 납작한 모양"], answer:1,
    explain:"등 쪽 허리 부근, 갈비뼈 아래 보호받는 자리에 좌우 하나씩 있습니다." },
  { id:"x06", systemId:"excretion", type:"experiment", examPoint:"거름 장치 실험의 대응",
    question:"거름 장치 실험에서 거름종이는 무엇에 해당할까요?",
    options:["콩팥","방광","혈관","오줌"], answer:0,
    explain:"거름종이 = 콩팥, 흐린 물 = 노폐물이 섞인 혈액, 걸러진 알갱이 = 노폐물입니다." },
  { id:"x07", systemId:"excretion", type:"cause",
    question:"오줌은 원래 무엇이었을까요?",
    options:["마신 물 그대로","혈액","침","땀"], answer:1,
    explain:"콩팥이 혈액을 걸러서 만든 것이 오줌이에요. 필요한 물과 영양분은 다시 흡수하고 나머지만 내보냅니다." },
  { id:"x08", systemId:"excretion", type:"cause",
    question:"아침에 눈 첫 오줌이 진한 까닭은?",
    options:["잠자는 동안 몸이 물을 아껴서","밤에 물을 많이 마셔서","콩팥이 잠들어서","방광이 커져서"], answer:0,
    explain:"뇌가 콩팥에게 물을 아끼라고 신호를 보내서 밤사이 오줌이 적게, 진하게 만들어집니다." },
  { id:"x09", systemId:"excretion", type:"cause",
    question:"물을 많이 마시면 화장실이 자주 마려운 까닭은?",
    options:["방광이 작아져서","콩팥이 남는 물을 내보내서","오줌관이 넓어져서","콩팥이 일을 멈춰서"], answer:1,
    explain:"콩팥은 몸속 물이 넉넉하면 여유분을 내보냅니다. 거르는 일뿐 아니라 조절하는 일도 해요." },
  { id:"x10", systemId:"excretion", type:"cause",
    question:"노폐물을 몸 밖으로 내보내지 않으면 어떻게 될까요?",
    options:["아무 문제 없다","혈액에 쌓여 몸에 해롭다","살이 찐다","힘이 세진다"], answer:1,
    explain:"세포는 쉬지 않고 노폐물을 내놓기 때문에 배설도 쉬지 않고 일어나야 합니다." },
  { id:"x11", systemId:"excretion", type:"classify", examPoint:"이산화탄소의 배출 경로",
    question:"이산화탄소는 어느 기관을 통해 몸 밖으로 나갈까요?",
    options:["콩팥","폐","큰창자","피부"], answer:1,
    explain:"이산화탄소도 노폐물이지만 콩팥이 아니라 폐로 나갑니다. 노폐물마다 나가는 문이 달라요." },
  { id:"x12", systemId:"excretion", type:"wrong",
    question:"배설 기관에 대한 설명으로 옳지 않은 것은?",
    options:["콩팥은 혈액을 걸러 오줌을 만든다","방광은 오줌을 모아 둔다","대변도 배설에 해당한다","콩팥은 몸속 물의 양도 조절한다"], answer:2,
    explain:"대변은 혈액을 거친 적이 없어서 배설이 아니라 배출입니다." },
  { id:"x13", systemId:"excretion", type:"cause",
    question:"콩팥이 두 개인 것의 장점은?",
    options:["오줌을 두 배로 만든다","하나가 일을 못 해도 나머지가 대신할 수 있다","물을 두 배로 마실 수 있다","혈액을 만든다"], answer:1,
    explain:"실제로 콩팥 하나만으로도 건강하게 살 수 있어요. 남은 하나가 커지면서 두 몫을 해냅니다." },
  { id:"x14", systemId:"excretion", type:"cause",
    question:"콩팥이 걸러 낸 것 중 대부분은 어떻게 될까요?",
    options:["전부 오줌으로 나간다","필요한 물과 영양분은 다시 흡수된다","땀으로 나간다","대변으로 나간다"], answer:1,
    explain:"하루 약 180L를 거르지만 오줌은 1~2L뿐입니다. 나머지 99%는 다시 흡수해요." },
  { id:"x15", systemId:"excretion", type:"cause", examPoint:"기관계 연결",
    question:"노폐물이 콩팥까지 어떻게 올까요?",
    options:["혈액에 실려 온다","소화관을 따라 온다","공기를 타고 온다","신경을 타고 온다"], answer:0,
    explain:"순환 기관이 노폐물을 콩팥까지 실어 오고, 걸러진 깨끗한 혈액은 다시 온몸을 돕니다." },
];
```

---

## 6. 감각 기관 (15문항)

```ts
export const quizSenses: SystemQuizItem[] = [
  { id:"s01", systemId:"senses", type:"order", examPoint:"자극 전달 순서",
    question:"자극이 전달되어 반응하기까지의 순서로 옳은 것은?",
    options:["자극 → 감각 기관 → 신경 → 뇌 → 신경 → 운동 기관 → 반응","자극 → 뇌 → 감각 기관 → 신경 → 운동 기관 → 반응","자극 → 감각 기관 → 운동 기관 → 뇌 → 반응","자극 → 신경 → 감각 기관 → 뇌 → 운동 기관 → 반응"], answer:0,
    explain:"신경이 두 번 나옵니다. 뇌로 가는 길과 뇌에서 오는 길이에요. 이걸 빠뜨려서 틀리는 경우가 많습니다." },
  { id:"s02", systemId:"senses", type:"classify", examPoint:"감각 기관과 자극 짝짓기",
    question:"감각 기관과 받아들이는 자극을 잘못 짝지은 것은?",
    options:["눈 - 빛","귀 - 소리","코 - 맛","피부 - 온도"], answer:2,
    explain:"코는 냄새, 혀가 맛을 받아들입니다." },
  { id:"s03", systemId:"senses", type:"classify", examPoint:"귀의 두 가지 역할",
    question:"귀가 하는 일을 바르게 짝지은 것은?",
    options:["소리 듣기와 몸의 균형 잡기","소리 듣기와 냄새 맡기","몸의 균형과 맛 느끼기","소리 듣기만"], answer:0,
    explain:"귀 안쪽에 몸의 기울기와 회전을 감지하는 부분이 따로 있어요. 균형 역할을 자주 빠뜨립니다." },
  { id:"s04", systemId:"senses", type:"experiment", examPoint:"자 잡기 실험의 의미",
    question:"자 잡기 실험에서 자가 조금 떨어진 뒤에야 잡히는 까닭은?",
    options:["자가 너무 무거워서","자극이 전달되고 반응하기까지 시간이 걸려서","손이 느려서","눈이 나빠서"], answer:1,
    explain:"눈 → 신경 → 뇌 → 신경 → 근육까지 시간이 걸립니다. 아무리 빨라도 0이 될 수 없어요." },
  { id:"s05", systemId:"senses", type:"match", examPoint:"운동 기관",
    question:"뇌의 명령을 받아 실제로 움직이는 기관은?",
    options:["감각 기관","신경","운동 기관(뼈와 근육)","순환 기관"], answer:2,
    explain:"뇌가 판단하고 명령하면 뼈와 근육이 실제로 움직입니다." },
  { id:"s06", systemId:"senses", type:"cause",
    question:"코를 막으면 맛이 잘 느껴지지 않는 까닭은?",
    options:["혀가 마비돼서","우리가 느끼는 맛의 상당 부분이 냄새여서","입이 닫혀서","침이 안 나와서"], answer:1,
    explain:"혀는 다섯 가지 기본 맛만 구분하고, 딸기와 포도를 구별하는 것은 코가 합니다." },
  { id:"s07", systemId:"senses", type:"classify",
    question:"혀가 구분하는 기본 맛이 아닌 것은?",
    options:["단맛","짠맛","매운맛","쓴맛"], answer:2,
    explain:"기본 맛은 단맛·짠맛·신맛·쓴맛·감칠맛 다섯 가지예요. 매운맛은 맛이 아니라 통증에 가깝습니다." },
  { id:"s08", systemId:"senses", type:"cause",
    question:"빙글빙글 돌다 멈추면 어지러운 까닭은?",
    options:["눈이 흔들려서","귀 안쪽의 액체가 계속 돌고 있어서","뇌가 놀라서","심장이 빨라져서"], answer:1,
    explain:"몸은 멈췄는데 귀 안의 액체는 아직 돌고 있어서, 몸이 계속 돈다고 착각합니다." },
  { id:"s09", systemId:"senses", type:"cause",
    question:"손끝이 등보다 예민한 까닭은?",
    options:["피부가 얇아서","감각점이 촘촘해서","혈관이 많아서","털이 없어서"], answer:1,
    explain:"부위마다 감각점의 개수가 달라요. 클립 두 점 실험으로 확인할 수 있습니다." },
  { id:"s10", systemId:"senses", type:"wrong",
    question:"감각 기관에 대한 설명으로 옳지 않은 것은?",
    options:["감각 기관은 눈·귀·코·혀·피부다","감각 기관이 느낀 것은 뇌를 거쳐 판단된다","감각 기관이 직접 근육에 명령한다","피부는 닿음·아픔·온도를 느낀다"], answer:2,
    explain:"명령은 뇌가 내립니다. 감각 기관은 자극을 받아들여 전달할 뿐이에요." },
  { id:"s11", systemId:"senses", type:"cause",
    question:"깜깜한 방에서 아무것도 안 보이는 까닭은?",
    options:["눈이 감겨서","눈은 빛을 받아들이는 기관이라 빛이 없으면 일할 수 없어서","뇌가 잠들어서","눈물이 말라서"], answer:1,
    explain:"눈은 빛을 받아들이는 기관이에요. 받아들일 자극이 없으면 아무 일도 할 수 없습니다." },
  { id:"s12", systemId:"senses", type:"match",
    question:"자극과 명령을 전달하는 길을 무엇이라고 할까요?",
    options:["혈관","신경","근육","관절"], answer:1,
    explain:"신경이 온몸에 그물처럼 뻗어 있어 자극을 뇌로, 명령을 근육으로 전달합니다." },
  { id:"s13", systemId:"senses", type:"cause",
    question:"감각 기관이 필요한 까닭으로 가장 알맞은 것은?",
    options:["몸을 예쁘게 하려고","위험을 피하고 필요한 것을 찾으려고","체온을 유지하려고","영양분을 얻으려고"], answer:1,
    explain:"뜨거운 것에서 손을 떼는 것, 상한 냄새가 나는 음식을 피하는 것 모두 감각 기관 덕분이에요." },
  { id:"s14", systemId:"senses", type:"classify",
    question:"눈을 가리고 물건을 알아맞히는 실험에서 알 수 있는 것은?",
    options:["눈이 가장 쓸모없다","우리는 평소 시각에 크게 의존한다","코가 가장 예민하다","감각 기관은 하나면 충분하다"], answer:1,
    explain:"눈을 가리면 알아맞히기가 훨씬 어려워집니다. 하나가 막히면 다른 감각이 더 열심히 일해요." },
  { id:"s15", systemId:"senses", type:"cause",
    question:"연습을 하면 반응이 빨라지는 까닭은?",
    options:["신경이 굵어져서","자극을 받고 반응하는 과정에 익숙해져서","눈이 좋아져서","근육이 커져서"], answer:1,
    explain:"운동선수가 공을 잘 받는 것은 이 과정을 수없이 반복해 익숙해졌기 때문이에요." },
];
```

---

## 7. 기관계는 어떻게 연결될까 (15문항)

```ts
export const quizTogether: SystemQuizItem[] = [
  { id:"t01", systemId:"together", type:"cause", examPoint:"운동할 때 몸의 변화",
    question:"운동할 때 나타나는 몸의 변화가 아닌 것은?",
    options:["맥박이 빨라진다","호흡이 빨라진다","땀이 난다","체온이 크게 떨어진다"], answer:3,
    explain:"근육이 일하면서 열이 나기 때문에 체온이 오르고, 땀을 흘려 식힙니다." },
  { id:"t02", systemId:"together", type:"cause", examPoint:"운동할 때 몸의 변화",
    question:"운동할 때 맥박과 호흡이 함께 빨라지는 까닭은?",
    options:["근육이 에너지를 많이 써서 산소가 더 필요해서","몸이 뜨거워져서","땀이 나서","배가 고파서"], answer:0,
    explain:"산소를 더 들이려고 호흡이 빨라지고, 그 산소를 빨리 배달하려고 심장이 빨라집니다." },
  { id:"t03", systemId:"together", type:"match", examPoint:"영양분과 산소가 오는 곳",
    question:"영양분과 산소를 몸에 들여오는 기관을 바르게 짝지은 것은?",
    options:["영양분-호흡 기관, 산소-소화 기관","영양분-소화 기관, 산소-호흡 기관","둘 다 소화 기관","둘 다 순환 기관"], answer:1,
    explain:"소화 기관이 영양분을, 호흡 기관이 산소를 들여오고, 순환 기관이 둘 다 배달합니다." },
  { id:"t04", systemId:"together", type:"order", examPoint:"기관계의 흐름",
    question:"우리 몸에서 일어나는 일의 순서로 옳은 것은?",
    options:["들여오기 → 배달 → 쓰기 → 치우기 → 내보내기","배달 → 들여오기 → 쓰기 → 내보내기 → 치우기","쓰기 → 들여오기 → 배달 → 치우기 → 내보내기","들여오기 → 쓰기 → 배달 → 내보내기 → 치우기"], answer:0,
    explain:"들여오기(소화·호흡) → 배달(순환) → 쓰기(운동) → 치우기(순환) → 내보내기(호흡·배설)." },
  { id:"t05", systemId:"together", type:"classify", examPoint:"노폐물이 나가는 곳",
    question:"이산화탄소와 그 밖의 노폐물이 나가는 기관을 바르게 짝지은 것은?",
    options:["둘 다 콩팥","둘 다 폐","이산화탄소는 폐, 그 밖은 콩팥","이산화탄소는 콩팥, 그 밖은 폐"], answer:2,
    explain:"노폐물마다 나가는 문이 다릅니다. 자주 헷갈리는 부분이에요." },
  { id:"t06", systemId:"together", type:"cause",
    question:"한 기관이 일을 하지 못하면 어떻게 될까요?",
    options:["다른 기관들도 영향을 받는다","아무 문제 없다","그 기관만 쉰다","다른 기관이 두 배로 커진다"], answer:0,
    explain:"호흡 기관이 산소를 못 들여오면 순환 기관이 배달할 것이 없어지고, 근육도 움직일 수 없게 됩니다." },
  { id:"t07", systemId:"together", type:"cause",
    question:"운동할 때 땀이 나는 까닭은?",
    options:["물이 남아서","근육이 일하며 생긴 열을 식히려고","노폐물을 내보내려고","목이 말라서"], answer:1,
    explain:"땀이 마르면서 열을 가져가 몸을 식힙니다. 체온은 늘 일정하게 유지되어야 해요." },
  { id:"t08", systemId:"together", type:"match",
    question:"세포가 에너지를 만들 때 필요한 것을 바르게 짝지은 것은?",
    options:["영양분과 산소","물과 소금","산소와 이산화탄소","영양분과 노폐물"], answer:0,
    explain:"영양분과 산소로 에너지를 만들고, 그 과정에서 이산화탄소와 노폐물이 생깁니다." },
  { id:"t09", systemId:"together", type:"match",
    question:"소화 기관이 흡수한 영양분을 온몸에 배달하는 기관은?",
    options:["호흡 기관","순환 기관","배설 기관","운동 기관"], answer:1,
    explain:"순환 기관은 몸의 배달 회사예요. 영양분과 산소를 나르고 노폐물을 실어 옵니다." },
  { id:"t10", systemId:"together", type:"cause",
    question:"골고루 먹어야 하는 까닭은?",
    options:["영양소마다 하는 일이 달라서","맛이 좋아서","배가 덜 고파서","소화가 빨라서"], answer:0,
    explain:"탄수화물은 에너지를, 단백질은 몸을 만들고, 무기질과 비타민은 몸이 제대로 돌아가게 돕습니다." },
  { id:"t11", systemId:"together", type:"experiment",
    question:"운동 전후 몸의 변화를 알아보는 실험에서 확인할 수 있는 것은?",
    options:["한 기관만 반응한다","여러 기관계가 동시에 반응한다","운동해도 변화가 없다","호흡만 빨라진다"], answer:1,
    explain:"맥박·호흡·땀·얼굴색이 모두 달라집니다. 이 단원의 결론이에요." },
  { id:"t12", systemId:"together", type:"cause",
    question:"운동을 멈추고 쉬면 맥박과 호흡은 어떻게 될까요?",
    options:["계속 빨라진다","서서히 원래대로 돌아온다","즉시 원래대로 돌아온다","더 느려진다"], answer:1,
    explain:"얼마나 빨리 돌아오는지가 몸이 튼튼한 정도를 보여주는 지표 중 하나입니다." },
  { id:"t13", systemId:"together", type:"wrong",
    question:"우리 몸에 대한 설명으로 옳지 않은 것은?",
    options:["기관들은 서로 도우며 함께 일한다","순환 기관이 영양분과 산소를 배달한다","각 기관은 서로 상관없이 따로 일한다","운동하면 여러 기관이 동시에 반응한다"], answer:2,
    explain:"우리 몸은 여러 기관계가 하나로 움직이는 팀이에요. 이것이 이 단원의 결론입니다." },
  { id:"t14", systemId:"together", type:"cause",
    question:"잠을 자야 하는 까닭으로 알맞은 것은?",
    options:["몸을 정리하고 고치는 시간이라서","에너지를 아끼려고","밥을 안 먹으려고","키가 크지 않으려고"], answer:0,
    explain:"자는 동안 뇌는 낮에 배운 것을 정리하고, 몸은 손상된 곳을 고칩니다." },
  { id:"t15", systemId:"together", type:"cause", examPoint:"단원의 결론",
    question:"우리 몸의 기관들이 함께 일하는 궁극적인 목적은?",
    options:["몸을 크게 만들려고","몸속 세포들이 잘 살아가게 하려고","힘을 세게 하려고","오래 잠자려고"], answer:1,
    explain:"세포에게 필요한 것을 들여오고 배달하고 쓰고 치우는 흐름이 멈추지 않기 때문에 우리가 살아갈 수 있습니다." },
];
```

---

## 통합

```ts
export const systemQuizKo: SystemQuizItem[] = [
  ...quizMovement,     // 뼈와 근육 15
  ...quizDigestion,    // 소화 15
  ...quizRespiration,  // 호흡 15
  ...quizCirculation,  // 순환 15
  ...quizExcretion,    // 배설 15
  ...quizSenses,       // 감각 15
  ...quizTogether,     // 연결 15
]; // 총 105문항
```

## 유형 분포

| 유형 | 문항 수 |
|---|---|
| 순서 배열 (order) | 7 |
| 구분·분류 (classify) | 20 |
| 실험 대응 (experiment) | 9 |
| 원인·까닭 (cause) | 44 |
| 옳지 않은 것 (wrong) | 6 |
| 역할 짝짓기 (match) | 19 |
| **합계** | **105** |

---

## Claude Code 프롬프트

```
초등 모드에 기관계 시험퀴즈 105문항 추가.
docs/content/quiz_systems_1.md, quiz_systems_2.md 기준.

[중요] 기존 퀴즈 3종과 완전히 별개. 파일을 분리할 것.
 - 어린이 퀴즈 quiz/kids-ko.ts (2지선다 100문항)
 - 지식 퀴즈 quiz/ko.ts (3지선다 200문항, 어른 전용)
 - 기관계 퀴즈 quiz/systems-ko.ts (4지선다 105문항, 초등 전용) ← 신규

[스키마]
1. types.ts 에 SystemQuizItem 추가 (문서 그대로, 4지선다)

[콘텐츠]
2. app/i18n/quiz/systems-ko.ts 신규 생성
   기관계별 배열 7개 + 통합 systemQuizKo (105문항)
3. 다른 언어는 빈 배열 스텁만

[UI]
4. 기관계 화면 하단에 "문제 풀기" 버튼 추가
5. 두 가지 방식:
   - 한 기관계 15문항 전부 풀기 (단원평가 형식)
   - 7개 기관계 통합 30문항 무작위 (단원 전체 대비)
6. 4지선다, 선택 즉시 정답 공개 + explain
7. explain 아래 "본문에서 보기" → examPoint가 있으면 해당 exam 항목으로,
   없으면 그 기관계 화면 상단으로 이동
8. 회차 끝 점수 화면 + [틀린 것만 다시 풀기] [처음부터] [그만하기]
   ★"틀린 것만 다시 풀기"가 시험 대비의 핵심 기능
9. 셔플은 지금까지와 같은 방식
   (렌더 중 호출 금지, 선택지 셔플 시 answer 인덱스 동반 이동)
10. 초등 모드 전용. 어린이·어른 모드에 노출하지 말 것

[검증]
11. 기관계별 15문항 · 총 105 · id 중복 0 · answer 인덱스 범위(0~3)
    · 선택지 4개 확인해서 표로
12. "본문에서 보기"가 examPoint 있는 문항에서 실제로 해당 항목을
    여는지 확인
13. 어린이·어른 모드 DOM에 기관계 퀴즈가 없는지

커밋 파일별 명시 (git add -A 금지).
```
