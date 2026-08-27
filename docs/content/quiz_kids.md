# 몸속 어린이 퀴즈 100문항

일반 모드 지식퀴즈(3지선다 200문항)와 **완전히 별개**.
파일도 따로: `app/i18n/quiz/kids-ko.ts`

## 어린이용 설계 원칙 (일반 모드와 다른 점)

| | 일반 모드 | 어린이 모드 |
|---|---|---|
| 선택지 | 3개 | **2개** |
| 오답 | 그럴듯한 함정 | **명백히 틀린 것** |
| 목적 | 오해를 바로잡기 | **맞히는 재미 + 기억에 남기기** |
| 출처 | deepDive 20편 | **moreFacts 10개** |
| 해설 | 설명 위주 | **칭찬 + 한 줄** |
| 문장 | 서술체 | **~요체, 짧게** |

5세에게 3지선다 함정은 좌절만 줍니다. 2지선다에 오답을 명백히 틀린 것으로
두면, 본문을 들은 아이는 거의 다 맞히고 "나 아는구나"가 남습니다.
그게 어린이 퀴즈의 목표입니다.

`{child}` 치환 그대로 사용. 장기당 10문항 × 10장기 = 100문항.

## 스키마

```ts
export type KidsQuizItem = {
  id: string;
  organ: OrganId;
  question: string;
  options: [string, string];
  answer: 0 | 1;
  explain: string;   // 정답 후 한 줄. 칭찬 톤.
};
```

---

## 심장 (10)

```ts
export const kidsQuizHeart: KidsQuizItem[] = [
  { id:"kh1", organ:"heart", question:"심장은 어디에 있을까요?",
    options:["가슴 한가운데","발바닥"], answer:0,
    explain:"맞아요! 가슴 한가운데에서 살짝 왼쪽에 있어요." },
  { id:"kh2", organ:"heart", question:"심장이 하는 일은 무엇일까요?",
    options:["온몸에 피를 보내요","밥을 씹어요"], answer:0,
    explain:"딩동댕! 쉬지 않고 온몸 구석구석에 피를 보내줘요." },
  { id:"kh3", organ:"heart", question:"달리기를 하면 심장은 어떻게 될까요?",
    options:["빨라져요","멈춰요"], answer:0,
    explain:"맞아요! 잘 때는 느려지고 달릴 때는 빨라져요." },
  { id:"kh4", organ:"heart", question:"쿵쿵 소리는 무슨 소리일까요?",
    options:["심장 속 문이 닫히는 소리","뼈가 부딪히는 소리"], answer:0,
    explain:"정답! 심장 안에 문이 있고, 그 문이 닫힐 때 나는 소리예요." },
  { id:"kh5", organ:"heart", question:"생쥐의 심장은 {child}보다 어떨까요?",
    options:["훨씬 빨리 뛰어요","훨씬 천천히 뛰어요"], answer:0,
    explain:"맞아요! 1분에 오백 번도 넘게 뛴대요." },
  { id:"kh6", organ:"heart", question:"제일 큰 고래의 심장은 얼마나 클까요?",
    options:["범퍼카만 해요","동전만 해요"], answer:0,
    explain:"우와, 맞아요! 정말 커다래요." },
  { id:"kh7", organ:"heart", question:"문어는 심장이 몇 개일까요?",
    options:["세 개","반 개"], answer:0,
    explain:"신기하죠? 문어는 심장이 무려 세 개예요." },
  { id:"kh8", organ:"heart", question:"{child}의 심장은 언제부터 뛰었을까요?",
    options:["엄마 배 속에 있을 때부터","태어난 다음부터"], answer:0,
    explain:"맞아요! 엄마 배 속에서부터 벌써 쿵쿵 뛰고 있었어요." },
  { id:"kh9", organ:"heart", question:"심장은 얼마나 클까요?",
    options:["{child} 주먹만 해요","{child} 얼굴만 해요"], answer:0,
    explain:"맞아요! 주먹을 쥐어 보세요. 딱 그만큼이에요." },
  { id:"kh10", organ:"heart", question:"깜짝 놀라면 심장은?",
    options:["콩콩 빨라져요","잠들어요"], answer:0,
    explain:"맞아요! 몸이 얼른 움직일 준비를 하는 거예요." },
];
```

## 뇌 (10)

```ts
export const kidsQuizBrain: KidsQuizItem[] = [
  { id:"kb1", organ:"brain", question:"뇌를 만지면 어떤 느낌일까요?",
    options:["말랑말랑해요","돌처럼 딱딱해요"], answer:0,
    explain:"맞아요! 두부처럼 말랑말랑하답니다." },
  { id:"kb2", organ:"brain", question:"뇌는 무엇으로 거의 다 되어 있을까요?",
    options:["물","모래"], answer:0,
    explain:"맞아요! 뇌는 거의 다 물이에요." },
  { id:"kb3", organ:"brain", question:"뇌가 보내는 신호는 얼마나 빠를까요?",
    options:["제일 빠른 기차보다 빨라요","달팽이보다 느려요"], answer:0,
    explain:"쌩! 아주 빠르게 온몸에 신호를 보내요." },
  { id:"kb4", organ:"brain", question:"{child}가 자는 동안 뇌는 무얼 할까요?",
    options:["낮에 배운 걸 정리해요","같이 잠만 자요"], answer:0,
    explain:"맞아요! 그래서 잘 자면 더 잘 기억나요." },
  { id:"kb5", organ:"brain", question:"스스로 간지럽히면 어떨까요?",
    options:["간지럽지 않아요","제일 간지러워요"], answer:0,
    explain:"맞아요! 뇌가 미리 다 알고 있어서 그래요." },
  { id:"kb6", organ:"brain", question:"옆 사람이 하품하면?",
    options:["나도 하고 싶어져요","졸음이 달아나요"], answer:0,
    explain:"맞아요! 뇌는 따라쟁이예요." },
  { id:"kb7", organ:"brain", question:"뇌가 꼬글꼬글 주름진 이유는?",
    options:["좁은 머리에 많이 넣으려고 접었어요","주름이 예뻐서"], answer:0,
    explain:"맞아요! 종이를 접듯이 차곡차곡 접은 거예요." },
  { id:"kb8", organ:"brain", question:"왼손을 움직이라고 말하는 건 뇌의 어느 쪽일까요?",
    options:["오른쪽","왼쪽"], answer:0,
    explain:"신기하죠? 뇌는 서로 반대편을 맡고 있어요." },
  { id:"kb9", organ:"brain", question:"차가운 걸 빨리 먹으면 머리가 띵한 이유는?",
    options:["뇌가 차가움에 깜짝 놀라서","이가 시려서"], answer:0,
    explain:"맞아요! 천천히 먹으면 괜찮아져요." },
  { id:"kb10", organ:"brain", question:"{child}의 뇌가 제일 빨리 자란 때는?",
    options:["두 살 때까지","열 살 때부터"], answer:0,
    explain:"맞아요! 아기 때 쑥쑥 자랐어요." },
];
```

## 폐 (10)

```ts
export const kidsQuizLungs: KidsQuizItem[] = [
  { id:"kl1", organ:"lungs", question:"물에 동동 뜨는 장기는 무엇일까요?",
    options:["폐","뼈"], answer:0,
    explain:"맞아요! 공기가 가득해서 둥둥 떠요." },
  { id:"kl2", organ:"lungs", question:"딸꾹질은 왜 날까요?",
    options:["폐 아래 넓은 근육이 깜짝 놀라서","목이 간지러워서"], answer:0,
    explain:"맞아요! 그 근육이 움찔움찔하는 거예요." },
  { id:"kl3", organ:"lungs", question:"숨 참기 시합을 오래 하면?",
    options:["몸이 알아서 다시 숨 쉬게 해줘요","숨이 아주 멈춰요"], answer:0,
    explain:"맞아요! 몸이 {child}를 지켜줘요." },
  { id:"kl4", organ:"lungs", question:"오른쪽 폐는 방이 몇 개일까요?",
    options:["세 개","한 개"], answer:0,
    explain:"맞아요! 왼쪽은 두 개예요. 심장에게 자리를 양보했거든요." },
  { id:"kl5", organ:"lungs", question:"폐 속에 있는 작은 공기 방은 몇 개일까요?",
    options:["수억 개","딱 두 개"], answer:0,
    explain:"우와! 포도송이처럼 아주아주 많아요." },
  { id:"kl6", organ:"lungs", question:"추운 날 입김이 하얀 이유는?",
    options:["숨 속의 물이 작은 구름이 되어서","입에 눈이 들어가서"], answer:0,
    explain:"맞아요! {child}가 만든 작은 구름이에요." },
  { id:"kl7", organ:"lungs", question:"코로 숨을 쉬면 공기가 어떻게 될까요?",
    options:["따뜻해져서 들어가요","차가워져요"], answer:0,
    explain:"맞아요! 코가 미리 데워줘요." },
  { id:"kl8", organ:"lungs", question:"재채기는 무얼 하는 걸까요?",
    options:["코가 먼지를 내쫓아요","코가 인사해요"], answer:0,
    explain:"맞아요! 에취! 하고 먼지를 밖으로 보내요." },
  { id:"kl9", organ:"lungs", question:"하품을 왜 하는지 과학자들은?",
    options:["아직 다 몰라요","다 알아냈어요"], answer:0,
    explain:"신기하죠? 아직 비밀이 남아 있어요." },
  { id:"kl10", organ:"lungs", question:"노래를 길게 부를 수 있는 건?",
    options:["폐가 공기를 천천히 내보내 줘서","입이 커서"], answer:0,
    explain:"맞아요! 폐가 조금씩 아껴서 내보내요." },
];
```

## 간 (10)

```ts
export const kidsQuizLiver: KidsQuizItem[] = [
  { id:"kv1", organ:"liver", question:"간은 한 번에 몇 가지 일을 할까요?",
    options:["오백 가지가 넘어요","딱 한 가지"], answer:0,
    explain:"우와! 몸속에서 제일 바쁜 일꾼이에요." },
  { id:"kv2", organ:"liver", question:"응가가 갈색인 이유는?",
    options:["간이 만든 물감 때문에","흙을 먹어서"], answer:0,
    explain:"맞아요! 간이 만든 색이랍니다." },
  { id:"kv3", organ:"liver", question:"간이 아야 하면 어떻게 될까요?",
    options:["스스로 다시 자라나요","영영 그대로예요"], answer:0,
    explain:"대단하죠? 간은 다시 자라는 힘이 있어요." },
  { id:"kv4", organ:"liver", question:"몸속 장기 중에서 제일 무거운 건?",
    options:["간","눈"], answer:0,
    explain:"맞아요! 간이 제일 무거워요." },
  { id:"kv5", organ:"liver", question:"간은 몸에서 어떤 역할도 할까요?",
    options:["몸을 데우는 난로","몸을 식히는 선풍기"], answer:0,
    explain:"맞아요! 일을 많이 해서 따끈따끈해요." },
  { id:"kv6", organ:"liver", question:"간은 어디에 숨어 있을까요?",
    options:["갈비뼈 뒤","무릎 속"], answer:0,
    explain:"맞아요! 뼈가 씩씩하게 지켜줘요." },
  { id:"kv7", organ:"liver", question:"간이 만드는 소화 물은 무슨 색일까요?",
    options:["초록빛","까만색"], answer:0,
    explain:"맞아요! 초록빛 물이에요." },
  { id:"kv8", organ:"liver", question:"간은 몸속에서 무엇도 될까요?",
    options:["힘나는 것들을 모아두는 창고","공기를 담는 풍선"], answer:0,
    explain:"맞아요! 필요할 때 꺼내 써요." },
  { id:"kv9", organ:"liver", question:"{child}가 아기였을 때 간은 무얼 했을까요?",
    options:["피를 만들었어요","잠만 잤어요"], answer:0,
    explain:"신기하죠? 배 속에서는 피 만드는 일도 했어요." },
  { id:"kv10", organ:"liver", question:"{child}가 자는 동안 간은?",
    options:["낮에 먹은 걸 정리해요","같이 쉬어요"], answer:0,
    explain:"맞아요! 밤에도 부지런히 일해요." },
];
```

## 콩팥 (10)

```ts
export const kidsQuizKidneys: KidsQuizItem[] = [
  { id:"kk1", organ:"kidneys", question:"콩팥이 하는 일은?",
    options:["피를 걸러서 쉬야를 만들어요","밥을 씹어요"], answer:0,
    explain:"맞아요! 몸속 정수기 같아요." },
  { id:"kk2", organ:"kidneys", question:"콩팥이 하루에 거르는 물은 얼마나 될까요?",
    options:["욕조 하나를 채울 만큼","컵 한 잔"], answer:0,
    explain:"우와! 정말 많이 거르지요." },
  { id:"kk3", organ:"kidneys", question:"거른 물은 어떻게 될까요?",
    options:["거의 다 몸이 도로 가져가요","전부 버려요"], answer:0,
    explain:"맞아요! 아까우니까 다시 챙겨요." },
  { id:"kk4", organ:"kidneys", question:"쉬야는 원래 무엇이었을까요?",
    options:["피에서 나온 물","마신 주스"], answer:0,
    explain:"신기하죠? 콩팥이 피를 걸러서 만들어요." },
  { id:"kk5", organ:"kidneys", question:"물을 많이 마시면 쉬야는?",
    options:["맑아져요","까매져요"], answer:0,
    explain:"맞아요! 조금 마시면 진해진답니다." },
  { id:"kk6", organ:"kidneys", question:"콩팥은 몇 개일까요?",
    options:["두 개","다섯 개"], answer:0,
    explain:"맞아요! 하나만 있어도 씩씩하게 살 수 있어요." },
  { id:"kk7", organ:"kidneys", question:"콩팥은 어디에 있을까요?",
    options:["등 쪽","이마"], answer:0,
    explain:"맞아요! 폭신한 이불을 덮고 등 쪽에 있어요." },
  { id:"kk8", organ:"kidneys", question:"사막에서도 사는 낙타의 비결은?",
    options:["물을 아끼는 콩팥","물을 안 마셔도 되는 몸"], answer:0,
    explain:"맞아요! 낙타는 콩팥 대장이에요." },
  { id:"kk9", organ:"kidneys", question:"{child}의 피는 하루에 콩팥을 몇 번 지날까요?",
    options:["몇십 번씩","딱 한 번"], answer:0,
    explain:"맞아요! 계속계속 지나가면서 깨끗해져요." },
  { id:"kk10", organ:"kidneys", question:"쉬야가 노란 이유는?",
    options:["몸이 쓰고 남은 색소 때문에","바나나를 먹어서"], answer:0,
    explain:"맞아요! 색소가 섞여서 노랗게 보여요." },
];
```

## 눈 (10)

```ts
export const kidsQuizEyeball: KidsQuizItem[] = [
  { id:"ke1", organ:"eyeball", question:"갓 태어난 아기는 울 때 어떨까요?",
    options:["눈물 없이 울어요","눈물이 제일 많아요"], answer:0,
    explain:"신기하죠? 눈물은 조금 있다가 나와요." },
  { id:"ke2", organ:"eyeball", question:"{child}가 크는 동안 눈은?",
    options:["아주 조금만 자라요","몸만큼 쑥쑥 자라요"], answer:0,
    explain:"맞아요! 그래서 아기 눈이 커 보인답니다." },
  { id:"ke3", organ:"eyeball", question:"깜빡할 때마다 눈물은 무얼 할까요?",
    options:["눈을 싹싹 닦아줘요","눈을 간지럽혀요"], answer:0,
    explain:"맞아요! 작은 청소부예요." },
  { id:"ke4", organ:"eyeball", question:"양파를 썰면 왜 눈물이 날까요?",
    options:["눈이 매운 걸 얼른 씻어내려고","양파가 슬퍼서"], answer:0,
    explain:"맞아요! 눈이 스스로 지키는 거예요." },
  { id:"ke5", organ:"eyeball", question:"깜깜한 방에 들어가면?",
    options:["처음엔 안 보이다가 점점 보여요","계속 안 보여요"], answer:0,
    explain:"맞아요! 눈이 어둠에 익숙해지는 거예요." },
  { id:"ke6", organ:"eyeball", question:"어두우면 눈 가운데 까만 구멍은?",
    options:["커져요","없어져요"], answer:0,
    explain:"맞아요! 빛을 더 모으려고 커진답니다." },
  { id:"ke7", organ:"eyeball", question:"속눈썹이 하는 일은?",
    options:["먼지를 막아주는 커튼","눈을 예쁘게만 해요"], answer:0,
    explain:"맞아요! 작은 커튼이에요." },
  { id:"ke8", organ:"eyeball", question:"눈썹은 무얼 막아줄까요?",
    options:["이마에서 흐르는 땀","바람 소리"], answer:0,
    explain:"맞아요! 땀이 눈에 못 들어가게 해줘요." },
  { id:"ke9", organ:"eyeball", question:"물속에서 눈을 뜨면?",
    options:["뿌옇게 보여요","더 잘 보여요"], answer:0,
    explain:"맞아요! 눈은 공기에서 보도록 만들어졌거든요." },
  { id:"ke10", organ:"eyeball", question:"독수리는 높은 하늘에서 무얼 할 수 있을까요?",
    options:["작은 토끼를 찾아내요","아무것도 못 봐요"], answer:0,
    explain:"우와! 눈이 아주 좋아요." },
];
```

## 장 (10)

```ts
export const kidsQuizIntestine: KidsQuizItem[] = [
  { id:"ki1", organ:"intestine", question:"배 속에는 무엇이 살고 있을까요?",
    options:["눈에 안 보이는 작은 친구들","작은 물고기"], answer:0,
    explain:"맞아요! 아주 많은 친구들이 살아요." },
  { id:"ki2", organ:"intestine", question:"그 작은 친구들이 하는 일은?",
    options:["밥 소화를 도와줘요","잠만 자요"], answer:0,
    explain:"맞아요! {child}를 도와주는 고마운 친구들이에요." },
  { id:"ki3", organ:"intestine", question:"방귀는 무엇일까요?",
    options:["작은 친구들이 만든 바람","{child}가 삼킨 구름"], answer:0,
    explain:"맞아요! 친구들이 일하면서 나오는 바람이에요." },
  { id:"ki4", organ:"intestine", question:"장을 쭉 펴면 얼마나 길까요?",
    options:["자동차보다 길어요","연필보다 짧아요"], answer:0,
    explain:"우와! 배 속에 꼬불꼬불 접혀 있어요." },
  { id:"ki5", organ:"intestine", question:"물구나무를 서서 먹으면 음식은?",
    options:["갈 길로 잘 가요","도로 나와요"], answer:0,
    explain:"맞아요! 장이 꾹꾹 밀어주거든요." },
  { id:"ki6", organ:"intestine", question:"옥수수를 먹으면 응가에?",
    options:["노란 옥수수가 보여요","아무것도 안 보여요"], answer:0,
    explain:"맞아요! 껍질은 소화가 안 되거든요." },
  { id:"ki7", organ:"intestine", question:"큰창자가 하는 일은?",
    options:["물을 아껴서 도로 가져가요","공기를 넣어줘요"], answer:0,
    explain:"맞아요! 그래서 응가가 알맞게 단단해져요." },
  { id:"ki8", organ:"intestine", question:"배 속 작은 친구들은 사람마다?",
    options:["다 달라요","똑같아요"], answer:0,
    explain:"맞아요! 지문처럼 {child}만의 친구들이에요." },
  { id:"ki9", organ:"intestine", question:"밥 먹고 응가가 마려운 이유는?",
    options:["장이 자리를 만들려고 움직여서","밥이 벌써 응가가 되어서"], answer:0,
    explain:"맞아요! 새 손님이 온다고 정리하는 거예요." },
  { id:"ki10", organ:"intestine", question:"{child}가 채소를 먹으면 작은 친구들은?",
    options:["아주 신나요","도망가요"], answer:0,
    explain:"맞아요! 채소를 제일 좋아한대요." },
];
```

## 이자 (10)

```ts
export const kidsQuizPancreas: KidsQuizItem[] = [
  { id:"kp1", organ:"pancreas", question:"이자가 만드는 '녹이는 물'은 언제 힘이 켜질까요?",
    options:["배 속에 가서","만들어질 때 바로"], answer:0,
    explain:"맞아요! 그래서 이자는 자기를 안 녹여요." },
  { id:"kp2", organ:"pancreas", question:"달콤한 걸 먹으면 이자는?",
    options:["제일 바빠져요","쉬어요"], answer:0,
    explain:"맞아요! 열심히 일한답니다." },
  { id:"kp3", organ:"pancreas", question:"이자의 다른 이름은?",
    options:["췌장","심장"], answer:0,
    explain:"맞아요! 이름이 두 개예요." },
  { id:"kp4", organ:"pancreas", question:"이자는 어떻게 생겼을까요?",
    options:["올챙이처럼","동그란 공처럼"], answer:0,
    explain:"맞아요! 머리, 몸통, 꼬리가 있어요." },
  { id:"kp5", organ:"pancreas", question:"밥을 먹으면 이자는 무얼 할까요?",
    options:["녹이는 물을 장으로 보내요","문을 닫아요"], answer:0,
    explain:"맞아요! 출발! 하고 보낸답니다." },
  { id:"kp6", organ:"pancreas", question:"이자는 어디에 있을까요?",
    options:["위 뒤에 누워 있어요","목 안에 있어요"], answer:0,
    explain:"맞아요! 꼭꼭 숨어 있어서 잘 안 만져져요." },
  { id:"kp7", organ:"pancreas", question:"강아지와 생선도 이자가 있을까요?",
    options:["있어요","없어요"], answer:0,
    explain:"맞아요! 밥 먹는 동물은 다 필요하거든요." },
  { id:"kp8", organ:"pancreas", question:"이자가 하루에 만드는 물은?",
    options:["우유갑 하나 반쯤","숟가락 하나쯤"], answer:0,
    explain:"우와! 생각보다 많지요." },
  { id:"kp9", organ:"pancreas", question:"이자는 어떤 일꾼일까요?",
    options:["꼭꼭 숨은 일꾼","제일 눈에 띄는 일꾼"], answer:0,
    explain:"맞아요! 옛날 사람들도 한참 뒤에야 알아냈대요." },
  { id:"kp10", organ:"pancreas", question:"단 걸 먹으면 이자는 몸에게 뭐라고 할까요?",
    options:["골고루 나눠 줘!","다 버려!"], answer:0,
    explain:"맞아요! 몸 구석구석에 나눠주라고 알려줘요." },
];
```

## 피부 (10)

```ts
export const kidsQuizSkin: KidsQuizItem[] = [
  { id:"ks1", organ:"skin", question:"{child}의 손가락 지문은?",
    options:["세상에 딱 하나뿐이에요","친구랑 똑같아요"], answer:0,
    explain:"맞아요! {child}만의 특별한 무늬예요." },
  { id:"ks2", organ:"skin", question:"피부는 얼마 만에 겉이 새것으로 바뀔까요?",
    options:["한 달쯤","십 년쯤"], answer:0,
    explain:"맞아요! 계속 새 옷으로 갈아입어요." },
  { id:"ks3", organ:"skin", question:"추울 때 소름이 돋는 이유는?",
    options:["피부가 털을 세우려고 해서","벌레가 지나가서"], answer:0,
    explain:"맞아요! 오돌토돌 올라온답니다." },
  { id:"ks4", organ:"skin", question:"피부가 제일 두꺼운 곳은?",
    options:["발바닥","눈꺼풀"], answer:0,
    explain:"맞아요! 매일 많이 밟고 다니니까요." },
  { id:"ks5", organ:"skin", question:"피부가 제일 얇은 곳은?",
    options:["눈꺼풀","발바닥"], answer:0,
    explain:"맞아요! 아주 얇고 부드러워요." },
  { id:"ks6", organ:"skin", question:"땀이 나는 이유는?",
    options:["몸을 식히려고","목이 말라서"], answer:0,
    explain:"맞아요! 물이 마르면서 시원해져요." },
  { id:"ks7", organ:"skin", question:"상처에 딱지가 앉으면?",
    options:["피부가 공사 중이에요","피부가 아파해요"], answer:0,
    explain:"맞아요! 딱지는 공사장 지붕이에요. 떼면 안 돼요." },
  { id:"ks8", organ:"skin", question:"입술이 빨간 이유는?",
    options:["피부가 얇아서 피가 비쳐요","빨간 물을 발라서"], answer:0,
    explain:"맞아요! 살짝 비쳐 보이는 거예요." },
  { id:"ks9", organ:"skin", question:"손바닥과 발바닥에는?",
    options:["털이 안 나요","털이 제일 많아요"], answer:0,
    explain:"맞아요! 만져 보세요, 매끈하죠?" },
  { id:"ks10", organ:"skin", question:"간지럼을 제일 잘 타는 곳은?",
    options:["발바닥이랑 겨드랑이","팔꿈치"], answer:0,
    explain:"맞아요! {child}도 그렇지요?" },
];
```

## 위 (10)

```ts
export const kidsQuizStomach: KidsQuizItem[] = [
  { id:"kt1", organ:"stomach", question:"위는 무얼 하는 곳일까요?",
    options:["음식을 주물러 죽처럼 만들어요","숨을 쉬어요"], answer:0,
    explain:"맞아요! 말랑한 주머니가 조물조물 해줘요." },
  { id:"kt2", organ:"stomach", question:"위 속 물은 얼마나 힘셀까요?",
    options:["쇠못도 녹일 만큼","물처럼 순해요"], answer:0,
    explain:"우와! 그런데 위는 끈끈한 옷을 입고 있어서 끄떡없어요." },
  { id:"kt3", organ:"stomach", question:"밥을 먹으면 위는?",
    options:["쭉쭉 늘어나요","작아져요"], answer:0,
    explain:"맞아요! 비었을 땐 주먹만 해요." },
  { id:"kt4", organ:"stomach", question:"트림은 무엇일까요?",
    options:["같이 삼킨 공기가 나오는 거예요","밥이 나오는 거예요"], answer:0,
    explain:"맞아요! 꺼억! 하고 공기가 도로 나와요." },
  { id:"kt5", organ:"stomach", question:"소는 위가 몇 개일까요?",
    options:["네 개","반 개"], answer:0,
    explain:"신기하죠? {child}는 하나로 충분해요." },
  { id:"kt6", organ:"stomach", question:"갓 태어난 아기의 위는 얼마나 클까요?",
    options:["체리 한 알만 해요","사과만 해요"], answer:0,
    explain:"맞아요! 그래서 조금씩 자주 먹는답니다." },
  { id:"kt7", organ:"stomach", question:"긴장하면 배가 살살 아픈 이유는?",
    options:["위도 같이 긴장해서","밥을 안 먹어서"], answer:0,
    explain:"맞아요! 마음과 배는 이어져 있어요." },
  { id:"kt8", organ:"stomach", question:"뜨거운 것도 차가운 것도 위에 들어가면?",
    options:["몸 온도에 맞춰져요","그대로예요"], answer:0,
    explain:"맞아요! 위가 알맞게 맞춰준답니다." },
  { id:"kt9", organ:"stomach", question:"음식이 목을 지나 위까지 가는 데 걸리는 시간은?",
    options:["몇 초","하루"], answer:0,
    explain:"맞아요! 미끄럼틀 타듯 쑥 내려가요." },
  { id:"kt10", organ:"stomach", question:"{child}가 밥을 잘 씹어주면 위는?",
    options:["훨씬 편하게 일해요","더 힘들어요"], answer:0,
    explain:"맞아요! 꼭꼭 씹어 먹으면 위가 고마워해요." },
];
```

---

## 통합

```ts
export const kidsQuizKo: KidsQuizItem[] = [
  ...kidsQuizHeart, ...kidsQuizBrain, ...kidsQuizLungs,
  ...kidsQuizLiver, ...kidsQuizKidneys, ...kidsQuizEyeball,
  ...kidsQuizIntestine, ...kidsQuizPancreas, ...kidsQuizSkin,
  ...kidsQuizStomach,
]; // 총 100문항
```

## Claude Code 프롬프트

```
어린이 모드 퀴즈 100문항 추가.
docs/content/quiz_kids.md 기준.

[중요] 일반 모드 지식퀴즈(quiz/ko.ts, 200문항)와 완전히 별개.
파일을 반드시 분리할 것.

[스키마]
1. types.ts 에 KidsQuizItem 추가 (문서 그대로, 2지선다)

[콘텐츠]
2. app/i18n/quiz/kids-ko.ts 신규 생성 (문서의 100문항)
3. 다른 언어는 빈 배열 스텁만

[UI — 어린이 모드]
4. 기존 "찾기 놀이"(핫스팟 퀴즈)는 그대로 둘 것
5. 어린이 모드 퀴즈 버튼을 두 갈래로:
   - "찾기 놀이" (기존)
   - "맞혀 볼까요?" (신규)
6. 신규 퀴즈 동작:
   - 현재 보는 장기의 10문항 중 무작위 5문항
   - 2지선다, 버튼을 크고 시원하게 (아이 손가락 기준)
   - 선택 즉시 정답 공개 + explain
   - ★정답이면 밝은 효과(색·간단한 애니메이션), 오답이어도
     야단치는 톤 금지. explain을 보여주고 넘어가게 할 것
   - TTS(들어보기)를 질문과 explain 모두에 적용
   - 5문항 끝나면 "{child}, 5개 중 O개 맞혔어요!" + [또 할래요]
   - 셔플은 기존 Fisher-Yates. ★렌더 중 호출 금지
     (useSyncExternalStore 방식 유지 — 하이드레이션 이슈)
7. {child} 치환이 질문·선택지·explain 전부에 적용되는지 확인
8. 일반 모드에는 이 퀴즈를 노출하지 않음

[검증]
9. 장기별 10문항 · 총 100 · id 중복 0 · answer 인덱스 범위 확인
   표로 출력

커밋 파일별 명시 (git add -A 금지).
```
