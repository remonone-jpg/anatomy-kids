"use client";

import { useCallback, useMemo, useState, useSyncExternalStore } from "react";
import { Check, X, BookOpen, RotateCcw, CircleHelp } from "lucide-react";
import type { KnowledgeQuizItem } from "../i18n/types";
import { speak } from "../lib/speech";

/** Fisher–Yates, same as the label quiz and the kids facts. */
function shuffle<T>(items: T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Options move with their index so the correct answer survives the shuffle. */
function shuffleOptions(item: KnowledgeQuizItem) {
  const order = shuffle([0, 1, 2]);
  return {
    options: order.map((i) => item.options[i]),
    answer: order.indexOf(item.answer),
  };
}

type Round = { item: KnowledgeQuizItem; options: string[]; answer: number }[];

export function KnowledgeQuiz({
  pool,
  size,
  speechLang,
  onOpenPassage,
  onClose,
}: {
  pool: KnowledgeQuizItem[];
  size: number;
  speechLang: string;
  /** Opens the deep-dive entry a question came from. */
  onOpenPassage: (category: KnowledgeQuizItem["category"]) => void;
  onClose: () => void;
}) {
  // Shuffling is client-only. Calling Math.random() during render gives the
  // server one round and the browser another, and React tears the tree down
  // over the mismatch — the same trap the kids facts hit.
  const onClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const [seed, setSeed] = useState(0);
  const round: Round = useMemo(() => {
    const picked = onClient ? shuffle(pool).slice(0, size) : pool.slice(0, size);
    return picked.map((item) =>
      onClient ? { item, ...shuffleOptions(item) } : { item, options: item.options, answer: item.answer },
    );
    // `seed` deals a fresh round on replay.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pool, size, onClient, seed]);

  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const current = round[step];
  const finished = step >= round.length;

  const choose = useCallback(
    (index: number) => {
      if (picked !== null) return;
      setPicked(index);
      const right = index === current.answer;
      if (right) setScore((s) => s + 1);
      speak(right ? `정답입니다. ${current.item.explain}` : `아쉬워요. ${current.item.explain}`, speechLang);
    },
    [picked, current, speechLang],
  );

  const next = useCallback(() => {
    setPicked(null);
    setStep((s) => s + 1);
  }, []);

  const restart = useCallback(() => {
    setSeed((s) => s + 1);
    setStep(0);
    setPicked(null);
    setScore(0);
  }, []);

  if (round.length === 0) return null;

  if (finished) {
    return (
      <section className="knowledge-quiz" aria-label="지식 퀴즈 결과">
        <header>
          <b><CircleHelp size={15} aria-hidden /> 지식 퀴즈</b>
          <button type="button" className="quiz-close" onClick={onClose} aria-label="퀴즈 닫기"><X size={16} /></button>
        </header>
        <p className="quiz-score">
          {round.length}문제 중 <strong>{score}</strong>문제 맞혔어요
        </p>
        <div className="quiz-actions">
          <button type="button" className="primary" onClick={restart}><RotateCcw size={15} /> 다시 풀기</button>
          <button type="button" onClick={onClose}>그만하기</button>
        </div>
      </section>
    );
  }

  return (
    <section className="knowledge-quiz" aria-label="지식 퀴즈">
      <header>
        <b><CircleHelp size={15} aria-hidden /> 지식 퀴즈</b>
        <span className="quiz-progress">{step + 1} / {round.length}</span>
        <button type="button" className="quiz-close" onClick={onClose} aria-label="퀴즈 닫기"><X size={16} /></button>
      </header>

      <p className="quiz-question">{current.item.question}</p>

      <ol className="quiz-options">
        {current.options.map((option, index) => {
          const state =
            picked === null ? "" : index === current.answer ? "right" : index === picked ? "wrong" : "dim";
          return (
            <li key={option}>
              <button type="button" className={state} onClick={() => choose(index)} disabled={picked !== null}>
                {picked !== null && index === current.answer && <Check size={15} aria-hidden />}
                {picked !== null && index === picked && index !== current.answer && <X size={15} aria-hidden />}
                <span>{option}</span>
              </button>
            </li>
          );
        })}
      </ol>

      {picked !== null && (
        <div className="quiz-explain">
          <p>{current.item.explain}</p>
          <div className="quiz-actions">
            {current.item.category !== "stories" && (
              <button type="button" onClick={() => onOpenPassage(current.item.category)}>
                <BookOpen size={15} /> 본문에서 보기
              </button>
            )}
            <button type="button" className="primary" onClick={next}>
              {step + 1 === round.length ? "결과 보기" : "다음 문제"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
