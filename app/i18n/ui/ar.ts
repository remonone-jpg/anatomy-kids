import type { UiDictionary } from "../types";

export const ui: UiDictionary = {
  meta: {
    title: "Anatomy Atelier — تعلَّم التشريح كما يفعل الفنان",
    description:
      "استكشف أعضاءً ثلاثية الأبعاد بتفصيل طبي — القلب والدماغ والرئتان والكبد والكليتان والعين والأمعاء والبنكرياس والجلد — في مرسم تشريح تفاعلي.",
    ogTitle: "Anatomy Atelier — تعلَّم التشريح كما يفعل الفنان",
    ogDescription: "تعلَّم التشريح كما يفعل الفنان عبر عيّنات ثلاثية الأبعاد غنية بالتفاصيل الطبية.",
    imageAlt: "عيّنة قلب تشريحية تطفو فوق قاعدة، إلى جانب شعار Anatomy Atelier",
  },
  brand: { tagline: "تعلَّم التشريح كما يفعل الفنان", home: "الصفحة الرئيسية لـ Anatomy Atelier" },
  search: { placeholder: "ابحث عن عضو أو موضوع…" },
  language: { label: "اللغة", choose: "اختر لغة" },
  library: {
    title: "مكتبة الأعضاء", open: "فتح مكتبة الأعضاء", close: "إغلاق المكتبة", viewAll: "عرض كل الأعضاء",
    quoteLine1: "التعلّم", quoteLine2: "فعلٌ من أفعال الفضول.", quoteSign: "واصل الاستكشاف!",
  },
  tools: {
    label: "أدوات العارض ثلاثي الأبعاد", rotate: "تدوير", zoom: "تكبير", reset: "إعادة ضبط",
  },
  viewer: {
    title: "العارض التفاعلي: {organ}",
    canvas: "نموذج تشريحي ثلاثي الأبعاد تفاعلي. اسحب للتدوير، ومرّر للتكبير، وانقر على نقطة لقراءة وصف تلك البنية.",
    tip: "تلميح", tipDrag: "اسحب للتدوير", tipScroll: "مرّر للتكبير",
    tipClick: "انقر على نقطة لمعرفة المزيد",
    loading: "جارٍ تحضير {organ}", autoRotate: "تدوير تلقائي",
    caption: "عيّنة ثلاثية الأبعاد · انقر على نقطة", structures: "بنى هذه العيّنة",
  },
  info: {
    kicker: "{organ}", keyFacts: "حقائق أساسية", size: "الحجم", weight: "الوزن", daily: "يوميًا",
    location: "الموضع", bloodSupply: "التروية الدموية", function: "الوظيفة",
    medical: "الأهمية الطبية", didYouKnow: "هل تعلم", viewLesson: "عرض الدرس", quiz: "اختبار",
  },
  cards: {
    resources: "مصادر تعلّم: {organ}",
    microscopic: "منظر مجهري", functionAnimation: "Key parts",
    clinicalNotes: "ملاحظات سريرية", whereItWorks: "أين يعمل", commonConditions: "الأمراض الشائعة",
    exploreTissue: "استكشاف النسيج", playAnimation: "Go through them",
    seeAll: "عرض الكل", seeSystem: "عرض الجهاز",
    playAria: "Go through the key parts of the {organ}", systemAria: "شاهد موضع {organ} في الجسم",
  },
  quiz: { find: "حدِّد", progress: "{current} من {total}",
    correct: "صحيح", wrong: "ليس تمامًا", reveal: "هذا هو {label}", answer: "{label} معلَّم باللون الأخضر",
    done: "انتهى الاختبار", score: "{score} من {total} صحيحة", retry: "حاول مرة أخرى",
    exit: "إنهاء الاختبار", hint: "انقر على النقطة المقابلة في النموذج",
  },
  modal: {
    guided: "اكتشاف موجَّه", close: "إغلاق", continueExploring: "واصل الاستكشاف", motionTitle: "{organ} في حركة",
    bodyTitle: "{organ} في الجسم", insideTitle: "داخل {organ}",
    lessonBody:
      "تتبّع البنى المميّزة، وأدر العيّنة، واربط الشكل بالوظيفة. هذه الوقفة الدراسية القصيرة مصمّمة لبناء نموذج ذهني راسخ.",
    systemIntro: "{location}. تتبّع كيف يتصل {organ} ببقية الجسم.",
    system: "الجهاز", primaryRole: "الدور الأساسي", bloodSupply: "التروية الدموية",
  },
};
