# 초등 기관계 시험퀴즈 (1/2) — 뼈와 근육 · 소화 · 호흡 · 순환

기관계 7개 × 15문항 = **105문항**. 이 문서는 앞 4개(60문항).
전 문항이 각 기관계의 `exam`·`summary`·`flow`·`experiment`에서 출제되어,
읽은 학생은 맞힐 수 있고 틀리면 해당 섹션으로 돌아갑니다.

## 출제 유형 (실제 단원평가 형식)

| 유형 | 비중 | 예 |
|---|---|---|
| 순서 배열 | 3~4 | "소화 기관을 순서대로 나열한 것은?" |
| 구분·분류 | 3~4 | "음식이 지나가지 않는 기관은?" |
| 실험 대응 | 2 | "고무막은 무엇에 해당하는가?" |
| 원인·까닭 | 3 | "운동할 때 맥박이 빨라지는 까닭은?" |
| 옳지 않은 것 | 2 | 고학년 시험에 많은 유형 |
| 역할 짝짓기 | 1~2 | "쓸개즙을 만드는 기관은?" |

## 스키마

```ts
export type SystemQuizItem = {
  id: string;
  systemId: string;              // 어느 기관계
  examPoint?: string;            // 어느 exam 항목에서 나왔는지 (본문 연결용)
  type: "order" | "classify" | "experiment" | "cause" | "wrong" | "match";
  question: string;
  options: [string, string, string, string];   // 4지선다
  answer: 0 | 1 | 2 | 3;
  explain: string;
};
```

---

## 1. 뼈와 근육 (15문항)

```ts
// app/i18n/quiz/systems-ko.ts

export const quizMovement: SystemQuizItem[] = [
  { id:"m01", systemId:"movement", type:"classify", examPoint:"운동 기관이란",
    question:"운동 기관에 해당하는 것을 바르게 짝지은 것은?",
    options:["뼈와 근육","뼈와 관절","근육과 신경","뼈와 심장"], answer:0,
    explain:"운동 기관은 뼈와 근육을 함께 이르는 말입니다. 뼈만도 근육만도 아니에요." },
  { id:"m02", systemId:"movement", type:"wrong", examPoint:"뼈의 역할 세 가지",
    question:"뼈가 하는 일로 옳지 않은 것은?",
    options:["몸을 지탱한다","중요한 기관을 보호한다","근육이 붙을 자리가 된다","스스로 오므라들어 몸을 움직인다"], answer:3,
    explain:"오므라들어 움직이는 것은 근육이 하는 일이에요. 뼈는 근육이 당길 때 따라 움직입니다." },
  { id:"m03", systemId:"movement", type:"cause", examPoint:"근육은 당기기만 한다",
    question:"팔을 굽히는 근육과 펴는 근육이 따로 있어야 하는 까닭은?",
    options:["근육이 너무 무거워서","근육은 당기기만 하고 밀지 못해서","뼈가 두 개라서","관절이 하나뿐이라서"], answer:1,
    explain:"근육은 오므라들며 당기는 일만 합니다. 밀지 못하기 때문에 굽히는 근육과 펴는 근육이 짝을 이루어요." },
  { id:"m04", systemId:"movement", type:"experiment", examPoint:"모형 실험의 대응",
    question:"뼈와 근육 모형에서 비닐봉지는 무엇에 해당할까요?",
    options:["뼈","관절","근육","힘줄"], answer:2,
    explain:"종이 막대 = 뼈, 할핀 = 관절, 비닐봉지 = 근육입니다. 공기를 넣어 부풀리는 것이 근육이 오므라드는 것과 같아요." },
  { id:"m05", systemId:"movement", type:"cause", examPoint:"근육이 오므라들 때의 변화",
    question:"근육이 오므라들 때 일어나는 변화로 옳은 것은?",
    options:["짧아지고 굵어진다","길어지고 굵어진다","짧아지고 가늘어진다","길이와 굵기가 그대로다"], answer:0,
    explain:"팔을 굽히면 위팔 근육이 단단하고 볼록해지죠. 오므라들면 짧아지고 굵어집니다." },
  { id:"m06", systemId:"movement", type:"order", examPoint:"운동 기관의 작동",
    question:"몸이 움직이는 과정을 순서대로 바르게 나열한 것은?",
    options:["근육 오므라듦 → 뇌 명령 → 신경 전달 → 뼈 움직임","뇌 명령 → 신경 전달 → 근육 오므라듦 → 뼈 움직임","신경 전달 → 뇌 명령 → 뼈 움직임 → 근육 오므라듦","뼈 움직임 → 근육 오므라듦 → 뇌 명령 → 신경 전달"], answer:1,
    explain:"뇌가 명령하면 신경이 전달하고, 근육이 오므라들어 뼈를 당깁니다." },
  { id:"m07", systemId:"movement", type:"match",
    question:"뼈와 뼈가 만나 구부러지는 곳을 무엇이라고 할까요?",
    options:["힘줄","관절","골수","골격"], answer:1,
    explain:"관절이 있어서 몸을 구부릴 수 있어요. 뼈는 단단해서 휘지 않기 때문입니다." },
  { id:"m08", systemId:"movement", type:"classify", examPoint:"뼈의 개수",
    question:"뼈의 개수에 대한 설명으로 옳은 것은?",
    options:["아기가 어른보다 많다","어른이 아기보다 많다","아기와 어른이 같다","자라면서 계속 늘어난다"], answer:0,
    explain:"갓 태어난 아기는 약 300개, 어른은 약 206개입니다. 자라면서 여러 뼈가 붙어 하나가 되기 때문이에요." },
  { id:"m09", systemId:"movement", type:"match",
    question:"뇌를 감싸 보호하는 뼈는?",
    options:["갈비뼈","척추뼈","머리뼈","넓적다리뼈"], answer:2,
    explain:"머리뼈가 뇌를, 갈비뼈가 심장과 폐를 보호합니다." },
  { id:"m10", systemId:"movement", type:"match",
    question:"심장과 폐를 새장처럼 감싸 보호하는 뼈는?",
    options:["갈비뼈","머리뼈","척추뼈","팔뼈"], answer:0,
    explain:"갈비뼈는 좌우 12쌍, 모두 24개로 가슴을 감쌉니다. 호흡할 때 벌어졌다 좁아지기도 해요." },
  { id:"m11", systemId:"movement", type:"wrong",
    question:"뼈에 대한 설명으로 옳지 않은 것은?",
    options:["살아 있는 조직이라 자란다","부러지면 스스로 붙는다","골수에서 피를 만든다","죽은 조직이라 변하지 않는다"], answer:3,
    explain:"뼈는 살아 있어서 자라고 붙습니다. 게다가 뼈 속 골수에서는 피도 만들어요." },
  { id:"m12", systemId:"movement", type:"cause",
    question:"운동을 꾸준히 하면 근육이 커지는 까닭은?",
    options:["근육 세포의 개수가 늘어나서","손상된 근육을 고치면서 더 굵게 만들어서","뼈가 커지면서 근육도 늘어나서","지방이 근육으로 바뀌어서"], answer:1,
    explain:"근육을 쓰면 조금씩 손상되고, 몸이 고치면서 전보다 굵게 만듭니다. 반대로 안 쓰면 가늘어져요." },
  { id:"m13", systemId:"movement", type:"classify",
    question:"팔을 굽힐 때 근육의 상태로 옳은 것은?",
    options:["위팔 근육이 오므라들고 아래 근육은 늘어난다","위팔과 아래 근육이 모두 오므라든다","위팔 근육이 늘어나고 아래 근육이 오므라든다","두 근육 모두 늘어난다"], answer:0,
    explain:"한쪽이 오므라들면 반대쪽은 늘어납니다. 두 근육이 번갈아 일해요." },
  { id:"m14", systemId:"movement", type:"cause",
    question:"관절이 없다면 우리 몸은 어떻게 될까요?",
    options:["더 빨리 움직인다","몸을 구부릴 수 없다","근육이 사라진다","뼈가 부드러워진다"], answer:1,
    explain:"뼈는 단단해서 휘지 않습니다. 뼈와 뼈 사이에 움직일 수 있는 이음매인 관절이 있어야 구부러져요." },
  { id:"m15", systemId:"movement", type:"cause",
    question:"근육이 힘을 내려면 필요한 것을 바르게 짝지은 것은?",
    options:["영양분과 산소","물과 소금","영양분과 노폐물","산소와 이산화탄소"], answer:0,
    explain:"소화 기관이 들여온 영양분과 호흡 기관이 들여온 산소로 에너지를 만듭니다. 운동은 몸 전체가 함께하는 일이에요." },
];
```

---

## 2. 소화 기관 (15문항)

```ts
export const quizDigestion: SystemQuizItem[] = [
  { id:"d01", systemId:"digestion", type:"order", examPoint:"소화 기관의 순서",
    question:"음식이 지나가는 소화 기관의 순서로 옳은 것은?",
    options:["입 → 위 → 식도 → 작은창자 → 큰창자 → 항문","입 → 식도 → 위 → 큰창자 → 작은창자 → 항문","입 → 식도 → 위 → 작은창자 → 큰창자 → 항문","입 → 식도 → 작은창자 → 위 → 큰창자 → 항문"], answer:2,
    explain:"입 → 식도 → 위 → 작은창자 → 큰창자 → 항문. 식도를 빠뜨리기 쉬우니 주의하세요." },
  { id:"d02", systemId:"digestion", type:"classify", examPoint:"지나가는 기관 / 돕는 기관",
    question:"음식이 직접 지나가지 않는 기관끼리 짝지은 것은?",
    options:["위와 작은창자","간과 이자","식도와 큰창자","입과 항문"], answer:1,
    explain:"간·쓸개·이자는 음식이 지나가지 않고 소화액만 보냅니다. 시험에 자주 나오는 구분이에요." },
  { id:"d03", systemId:"digestion", type:"match", examPoint:"각 소화액을 만드는 기관",
    question:"쓸개즙을 만드는 기관은?",
    options:["쓸개","간","이자","위"], answer:1,
    explain:"쓸개즙은 간이 만들고, 쓸개는 그것을 모아 두었다가 내보냅니다. 만드는 곳과 저장하는 곳이 달라요." },
  { id:"d04", systemId:"digestion", type:"classify", examPoint:"작은창자와 큰창자",
    question:"작은창자와 큰창자에 대한 설명으로 옳은 것은?",
    options:["작은창자가 큰창자보다 길다","큰창자가 작은창자보다 길다","길이가 거의 같다","작은창자가 더 굵다"], answer:0,
    explain:"작은창자는 약 6~7m, 큰창자는 약 1.5m입니다. 이름은 길이가 아니라 굵기 기준이에요." },
  { id:"d05", systemId:"digestion", type:"match", examPoint:"흡수가 일어나는 곳",
    question:"영양분이 주로 흡수되는 기관은?",
    options:["위","작은창자","큰창자","식도"], answer:1,
    explain:"영양분은 작은창자에서, 물은 큰창자에서 주로 흡수됩니다." },
  { id:"d06", systemId:"digestion", type:"cause", examPoint:"융모의 역할",
    question:"작은창자 안쪽에 융모가 있는 까닭은?",
    options:["음식을 잘게 부수려고","흡수할 면적을 넓히려고","음식을 밀어내려고","소화액을 만들려고"], answer:1,
    explain:"매끈한 관보다 돌기가 빽빽한 관이 훨씬 넓은 면을 갖습니다. 흡수를 잘하기 위한 구조예요." },
  { id:"d07", systemId:"digestion", type:"experiment",
    question:"밥을 오래 씹으면 단맛이 나는 까닭은?",
    options:["이가 밥을 데워서","침이 녹말을 분해해서","위액이 올라와서","밥알이 부서져서"], answer:1,
    explain:"침 속에 녹말을 분해하는 물질이 들어 있어요. 소화가 입에서부터 시작된다는 증거입니다." },
  { id:"d08", systemId:"digestion", type:"cause",
    question:"물구나무를 서서 음식을 먹으면 어떻게 될까요?",
    options:["음식이 도로 나온다","위로 잘 내려간다","식도에 멈춰 있다","입으로 다시 올라온다"], answer:1,
    explain:"음식은 중력이 아니라 식도 근육의 연동 운동으로 내려갑니다." },
  { id:"d09", systemId:"digestion", type:"match",
    question:"소화관 근육이 물결처럼 움직여 음식을 밀어 보내는 운동을 무엇이라고 할까요?",
    options:["연동 운동","호흡 운동","순환 운동","흡수 운동"], answer:0,
    explain:"식도부터 큰창자까지 이 운동으로 음식이 이동합니다." },
  { id:"d10", systemId:"digestion", type:"match",
    question:"큰창자가 주로 하는 일은?",
    options:["영양분 흡수","물 흡수","소화액 생산","음식 저장"], answer:1,
    explain:"남은 찌꺼기에서 물을 흡수합니다. 그래서 죽 같던 것이 점점 단단해져요." },
  { id:"d11", systemId:"digestion", type:"wrong",
    question:"소화에 대한 설명으로 옳지 않은 것은?",
    options:["음식을 흡수할 수 있을 만큼 작게 쪼개는 과정이다","소화는 입에서부터 시작된다","간은 음식이 지나가는 기관이다","위액은 강한 산성이다"], answer:2,
    explain:"간은 음식이 지나가지 않습니다. 쓸개즙을 만들어 보내며 소화를 도울 뿐이에요." },
  { id:"d12", systemId:"digestion", type:"cause",
    question:"위액은 강한 산인데도 위가 녹지 않는 까닭은?",
    options:["위벽이 뼈로 되어 있어서","끈끈한 점액이 벽을 덮고 있어서","위액이 약해져서","위가 계속 움직여서"], answer:1,
    explain:"점액층이 산과 벽 사이를 막아 줍니다. 이 층은 며칠마다 새것으로 갈려요." },
  { id:"d13", systemId:"digestion", type:"cause",
    question:"음식을 잘게 쪼개야 하는 까닭은?",
    options:["맛이 좋아져서","혈관 속으로 들어가야 온몸에 배달되니까","위가 작아서","빨리 먹으려고"], answer:1,
    explain:"혈관 벽에는 아주 작은 틈만 있어서 덩어리 상태로는 통과할 수 없어요." },
  { id:"d14", systemId:"digestion", type:"match",
    question:"이자가 만들어 작은창자로 보내는 소화액은?",
    options:["침","위액","쓸개즙","이자액"], answer:3,
    explain:"침=입, 위액=위, 쓸개즙=간, 이자액=이자. 각각 만드는 기관이 다릅니다." },
  { id:"d15", systemId:"digestion", type:"cause",
    question:"흡수된 영양분은 그다음 어떻게 될까요?",
    options:["순환 기관이 온몸으로 배달한다","배설 기관이 내보낸다","호흡 기관으로 간다","큰창자에 저장된다"], answer:0,
    explain:"작은창자에서 흡수한 영양분은 혈액에 실려 온몸의 세포로 배달됩니다." },
];
```

---

## 3. 호흡 기관 (15문항)

```ts
export const quizRespiration: SystemQuizItem[] = [
  { id:"r01", systemId:"respiration", type:"order", examPoint:"공기가 지나가는 순서",
    question:"공기가 지나가는 순서로 옳은 것은?",
    options:["코 → 기관지 → 기관 → 폐","코 → 기관 → 기관지 → 폐","기관 → 코 → 기관지 → 폐","코 → 폐 → 기관 → 기관지"], answer:1,
    explain:"코 → 기관 → 기관지 → 폐(폐포). 굵은 것이 먼저입니다. 기관은 하나, 기관지는 둘이에요." },
  { id:"r02", systemId:"respiration", type:"match", examPoint:"기체 교환이 일어나는 곳",
    question:"산소와 이산화탄소를 실제로 주고받는 곳은?",
    options:["기관","기관지","폐포","코"], answer:2,
    explain:"기관이나 기관지는 공기가 지나가는 길일 뿐이고, 교환은 폐포에서 일어납니다." },
  { id:"r03", systemId:"respiration", type:"order", examPoint:"숨을 들이마실 때의 변화",
    question:"숨을 들이마실 때 몸의 변화로 옳은 것은?",
    options:["가로막이 내려가고 갈비뼈가 올라간다","가로막이 올라가고 갈비뼈가 내려간다","가로막과 갈비뼈가 모두 내려간다","가로막과 갈비뼈가 모두 올라간다"], answer:0,
    explain:"가로막이 내려가고 갈비뼈가 올라가면 가슴 속 공간이 넓어져 공기가 들어옵니다. 내쉴 때는 정반대예요." },
  { id:"r04", systemId:"respiration", type:"experiment", examPoint:"숨 쉬기 모형의 대응",
    question:"숨 쉬기 모형에서 고무막은 무엇에 해당할까요?",
    options:["폐","기관","가로막","갈비뼈"], answer:2,
    explain:"페트병 = 가슴, 고무막 = 가로막, 풍선 = 폐, 빨대 = 기관입니다." },
  { id:"r05", systemId:"respiration", type:"experiment",
    question:"숨 쉬기 모형에서 고무막을 아래로 당기면 풍선은 어떻게 될까요?",
    options:["부푼다","쪼그라든다","터진다","변화가 없다"], answer:0,
    explain:"공간이 넓어지면 공기가 들어와 풍선이 부풉니다. 가로막이 내려가는 것과 같은 원리예요." },
  { id:"r06", systemId:"respiration", type:"wrong", examPoint:"폐는 스스로 움직이지 못한다",
    question:"호흡에 대한 설명으로 옳지 않은 것은?",
    options:["폐에는 스스로 움직일 근육이 없다","가로막과 갈비뼈가 숨을 쉬게 한다","폐가 스스로 공기를 빨아들인다","공간이 넓어지면 공기가 밀려 들어온다"], answer:2,
    explain:"폐는 빨아들이지 못합니다. 가슴 속 공간이 넓어져 공기가 저절로 밀려 들어오는 것이에요." },
  { id:"r07", systemId:"respiration", type:"cause",
    question:"코로 숨을 쉬는 것이 좋은 까닭은?",
    options:["공기를 더 많이 마실 수 있어서","먼지를 걸러 내고 공기를 따뜻하고 촉촉하게 해서","숨이 더 빨라져서","산소가 더 많아져서"], answer:1,
    explain:"코털과 점액이 먼지를 걸러 내고, 지나가는 동안 공기가 데워지고 촉촉해집니다." },
  { id:"r08", systemId:"respiration", type:"cause",
    question:"숨을 참으면 견디기 힘든 주된 까닭은?",
    options:["산소가 완전히 없어져서","이산화탄소가 쌓여서","폐가 아파서","심장이 멈춰서"], answer:1,
    explain:"몸은 산소가 줄어드는 것보다 이산화탄소가 늘어나는 것을 훨씬 민감하게 알아챕니다." },
  { id:"r09", systemId:"respiration", type:"cause",
    question:"폐포가 아주 많은 까닭은?",
    options:["공기를 많이 저장하려고","기체를 주고받을 면적을 넓히려고","폐를 가볍게 하려고","소리를 내려고"], answer:1,
    explain:"작은 주머니 수억 개로 나누면 면적이 어마어마하게 넓어집니다. 작은창자의 융모와 같은 원리예요." },
  { id:"r10", systemId:"respiration", type:"match",
    question:"폐 아래에 있는 넓은 근육으로, 오르내리며 숨을 쉬게 하는 것은?",
    options:["갈비뼈","가로막","기관지","폐포"], answer:1,
    explain:"횡격막이라고도 합니다. 딸꾹질은 이 근육이 갑자기 경련하는 것이에요." },
  { id:"r11", systemId:"respiration", type:"classify",
    question:"기관과 기관지의 개수를 바르게 짝지은 것은?",
    options:["기관 1개, 기관지 2갈래","기관 2개, 기관지 1갈래","둘 다 1개","둘 다 2개"], answer:0,
    explain:"기관은 하나이고, 좌우 두 갈래로 갈라진 것이 기관지입니다. 각각의 폐로 들어가요." },
  { id:"r12", systemId:"respiration", type:"cause",
    question:"운동할 때 숨이 가빠지는 까닭은?",
    options:["폐가 작아져서","근육이 산소를 많이 쓰고 이산화탄소도 많이 만들어서","가로막이 멈춰서","체온이 낮아져서"], answer:1,
    explain:"더 많은 산소를 들이고 이산화탄소를 빨리 내보내려고 숨을 자주, 깊게 쉬게 됩니다." },
  { id:"r13", systemId:"respiration", type:"cause",
    question:"차가운 유리에 입김을 불면 뿌옇게 되는 까닭은?",
    options:["내쉬는 숨에 물이 섞여 있어서","숨이 뜨거워서","이산화탄소 때문에","먼지 때문에"], answer:0,
    explain:"폐에서 나온 공기는 항상 촉촉합니다. 그 물기가 차가운 유리에 닿아 김이 서리는 거예요." },
  { id:"r14", systemId:"respiration", type:"cause",
    question:"내쉬는 숨에 남아 있는 산소에 대한 설명으로 옳은 것은?",
    options:["산소가 전혀 없다","들이마신 것과 똑같다","상당량이 남아 있다","이산화탄소만 있다"], answer:2,
    explain:"들이마신 공기의 산소가 약 21%인데 내쉰 숨에도 약 16%가 남습니다. 몸은 한 번에 일부만 써요." },
  { id:"r15", systemId:"respiration", type:"cause", examPoint:"호흡과 순환의 연결",
    question:"폐포에서 혈액으로 건너간 산소는 그다음 어떻게 될까요?",
    options:["순환 기관이 온몸으로 배달한다","다시 폐로 돌아온다","배설 기관이 내보낸다","소화 기관으로 간다"], answer:0,
    explain:"호흡 기관과 순환 기관은 늘 짝을 이루어 움직입니다. 그래서 운동하면 숨과 맥박이 함께 빨라져요." },
];
```

---

## 4. 순환 기관 (15문항)

```ts
export const quizCirculation: SystemQuizItem[] = [
  { id:"c01", systemId:"circulation", type:"order", examPoint:"피가 도는 순서",
    question:"피가 도는 순서로 옳은 것은?",
    options:["온몸 → 왼심방 → 왼심실 → 폐 → 오른심방 → 오른심실 → 온몸","온몸 → 오른심방 → 오른심실 → 폐 → 왼심방 → 왼심실 → 온몸","온몸 → 오른심실 → 오른심방 → 폐 → 왼심실 → 왼심방 → 온몸","폐 → 오른심방 → 오른심실 → 온몸 → 왼심방 → 왼심실 → 폐"], answer:1,
    explain:"온몸을 돈 피는 오른쪽으로 들어와 폐로 가고, 산소를 실은 뒤 왼쪽으로 돌아와 온몸으로 나갑니다. 오른쪽이 먼저예요." },
  { id:"c02", systemId:"circulation", type:"classify", examPoint:"순환 기관의 구성",
    question:"순환 기관을 이루는 것끼리 바르게 짝지은 것은?",
    options:["심장, 혈관, 혈액","심장, 폐, 혈액","심장, 혈관, 콩팥","혈관, 혈액, 폐"], answer:0,
    explain:"심장은 펌프, 혈관은 길, 혈액은 짐차 역할을 합니다." },
  { id:"c03", systemId:"circulation", type:"classify", examPoint:"심방과 심실 구분",
    question:"심방과 심실에 대한 설명으로 옳은 것은?",
    options:["심방은 아래, 심실은 위에 있다","심방은 피를 받고 심실은 내보낸다","심방이 심실보다 벽이 두껍다","심방과 심실은 각각 하나씩이다"], answer:1,
    explain:"심방은 위에서 받는 방, 심실은 아래에서 내보내는 방입니다. 각각 두 개씩이에요." },
  { id:"c04", systemId:"circulation", type:"classify", examPoint:"동맥과 정맥 구분",
    question:"동맥과 정맥을 구분하는 기준으로 옳은 것은?",
    options:["산소가 많으면 동맥, 적으면 정맥","심장에서 나가면 동맥, 들어오면 정맥","굵으면 동맥, 가늘면 정맥","위쪽이 동맥, 아래쪽이 정맥"], answer:1,
    explain:"산소의 많고 적음이 아니라 흐르는 방향으로 나눕니다. 폐동맥에는 산소가 적은 피가 흘러요. 자주 틀리는 문제입니다." },
  { id:"c05", systemId:"circulation", type:"match", examPoint:"물질 교환이 일어나는 곳",
    question:"산소와 영양분을 실제로 주고받는 혈관은?",
    options:["동맥","정맥","모세혈관","대동맥"], answer:2,
    explain:"모세혈관은 벽이 한 겹이라 물질이 오갈 수 있습니다. 동맥이나 정맥에서는 교환이 일어나지 않아요." },
  { id:"c06", systemId:"circulation", type:"experiment", examPoint:"주입기 실험의 대응",
    question:"주입기 실험에서 붉은 색소 물은 무엇에 해당할까요?",
    options:["심장","혈관","혈액","산소"], answer:2,
    explain:"주입기 = 심장, 관 = 혈관, 붉은 물 = 혈액입니다. 빠르게 누르는 것은 심장이 빨리 뛰는 것과 같아요." },
  { id:"c07", systemId:"circulation", type:"experiment",
    question:"주입기를 빠르게 누를수록 붉은 물은 어떻게 될까요?",
    options:["더 빨리 많이 이동한다","더 느리게 이동한다","이동하지 않는다","거꾸로 흐른다"], answer:0,
    explain:"심장이 빨리 뛸수록 피가 더 빨리 많이 이동한다는 것을 보여줍니다. 운동할 때 심장이 빨라지는 이유예요." },
  { id:"c08", systemId:"circulation", type:"classify", examPoint:"혈액의 구성",
    question:"산소를 실어 나르는 혈액 성분은?",
    options:["적혈구","백혈구","혈소판","혈장"], answer:0,
    explain:"적혈구=산소 운반, 백혈구=세균과 싸움, 혈소판=피 멎게 함, 혈장=액체 부분." },
  { id:"c09", systemId:"circulation", type:"match",
    question:"상처가 났을 때 피를 굳게 해 멎게 하는 성분은?",
    options:["적혈구","백혈구","혈소판","혈장"], answer:2,
    explain:"혈소판이 상처 부위에서 피를 굳게 합니다." },
  { id:"c10", systemId:"circulation", type:"match", examPoint:"판막의 역할",
    question:"판막이 하는 일은?",
    options:["피를 만든다","피가 거꾸로 흐르지 못하게 막는다","피를 걸러 낸다","산소를 넣어 준다"], answer:1,
    explain:"방과 방 사이의 문 역할입니다. 이 문이 닫힐 때 나는 소리가 '쿵쿵'이에요." },
  { id:"c11", systemId:"circulation", type:"cause",
    question:"왼심실 벽이 가장 두꺼운 까닭은?",
    options:["피를 가장 많이 담아서","가장 먼 곳까지 피를 보내야 해서","가장 자주 뛰어서","산소가 많아서"], answer:1,
    explain:"오른심실은 바로 옆 폐까지만 보내면 되지만, 왼심실은 발끝과 머리끝까지 밀어 올려야 합니다." },
  { id:"c12", systemId:"circulation", type:"cause",
    question:"동맥의 벽이 정맥보다 두꺼운 까닭은?",
    options:["산소가 많아서","심장이 세게 밀어낸 피의 압력을 견뎌야 해서","더 길어서","피가 더 많이 흘러서"], answer:1,
    explain:"동맥은 압력이 높아 벽이 두껍고 탄력이 있습니다. 정맥은 압력이 낮은 대신 판막이 있어요." },
  { id:"c13", systemId:"circulation", type:"cause",
    question:"운동할 때 맥박이 빨라지는 까닭은?",
    options:["체온이 올라가서","근육이 산소를 더 많이 써서","땀이 나서","숨이 차서"], answer:1,
    explain:"근육이 산소를 많이 쓰면 몸이 더 빨리 보내라는 신호를 보냅니다. 출력이 네 배까지 올라가요." },
  { id:"c14", systemId:"circulation", type:"wrong",
    question:"순환 기관에 대한 설명으로 옳지 않은 것은?",
    options:["심장은 스스로 뛴다","맥박은 심장이 피를 밀어낼 때 동맥이 함께 뛰는 것이다","모세혈관은 동맥과 정맥을 잇는다","혈액은 심장에서만 만들어진다"], answer:3,
    explain:"혈액은 심장이 아니라 뼈 속 골수에서 만들어집니다. 심장은 피를 보내는 펌프예요." },
  { id:"c15", systemId:"circulation", type:"cause", examPoint:"기관계 연결",
    question:"순환 기관이 하는 일로 옳은 것은?",
    options:["영양분과 산소를 온몸에 배달하고 노폐물을 실어 온다","음식을 소화한다","산소를 만든다","노폐물을 걸러 낸다"], answer:0,
    explain:"소화 기관과 호흡 기관이 들여온 것을 배달하고, 세포가 만든 노폐물을 폐와 콩팥으로 가져다줍니다." },
];
```

---

## 다음 문서

배설 기관 / 감각 기관 / 기관계의 연결 — 45문항
