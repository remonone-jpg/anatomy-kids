"use client";

import { useCallback, useMemo, useState, useSyncExternalStore } from "react";
import { BookOpen, Check, GraduationCap, RotateCcw, Undo2, X } from "lucide-react";
import type { SystemQuizItem } from "../i18n/types";

/** Fisher–Yates, as everywhere else. */
function shuffle<T>(items: T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** The answer index travels with the options, so shuffling cannot lose it. */
function shuffleOptions(item: SystemQuizItem) {
  const order = shuffle([0, 1, 2, 3]);
  return {
    options: order.map((i) => item.options[i]),
    answer: order.indexOf(item.answer),
  };
}

type Copy = {
  title: string;
  paper: string;
  mixed: string;
  passage: string;
  next: string;
  finish: string;
  scoreTitle: string;
  score: string;
  retryWrong: string;
  restart: string;
  close: string;
  progress: string;
  allRight: string;
};

/**
 * Exam practice for one system, or across all seven.
 *
 * The point of the whole thing is the retry: sitting a paper and being told
 * "11 out of 15" teaches nothing on its own, and the four questions that were
 * missed are the only ones worth doing again.
 */
export function SystemQuiz({
  pool,
  size,
  copy,
  onOpenPassage,
  onClose,
}: {
  pool: SystemQuizItem[];
  /** A system's whole paper, or a sample when revising the unit. */
  size: number | "all";
  copy: Copy;
  onOpenPassage: (item: SystemQuizItem) => void;
  onClose: () => void;
}) {
  // Client-only, as everywhere: Math.random() during render gives the server
  // one paper and the browser another, and hydration tears the tree down.
  const onClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const [seed, setSeed] = useState(0);
  /** Set when retrying: only these questions are asked. */
  const [only, setOnly] = useState<SystemQuizItem[] | null>(null);

  const round = useMemo(() => {
    const source = only ?? pool;
    const picked = onClient
      ? shuffle(source).slice(0, size === "all" ? source.length : size)
      : source.slice(0, size === "all" ? source.length : size);
    return picked.map((item) =>
      onClient ? { item, ...shuffleOptions(item) } : { item, options: [...item.options], answer: item.answer },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pool, size, only, onClient, seed]);

  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [wrong, setWrong] = useState<SystemQuizItem[]>([]);
  const [score, setScore] = useState(0);

  const current = round[step];
  const finished = step >= round.length;

  const choose = useCallback(
    (index: number) => {
      if (picked !== null) return;
      setPicked(index);
      if (index === current.answer) setScore((s) => s + 1);
      else setWrong((list) => [...list, current.item]);
    },
    [picked, current],
  );

  const next = useCallback(() => {
    setPicked(null);
    setStep((s) => s + 1);
  }, []);

  const start = useCallback((subset: SystemQuizItem[] | null) => {
    setOnly(subset);
    setSeed((s) => s + 1);
    setStep(0);
    setPicked(null);
    setScore(0);
    setWrong([]);
  }, []);

  if (round.length === 0) return null;

  if (finished) {
    return (
      <section className="system-quiz done" aria-label={copy.scoreTitle}>
        <h3>{copy.scoreTitle}</h3>
        <p className="system-quiz-score">
          {round.length}문제 중 <strong>{score}문제</strong> 맞혔어요
        </p>
        {wrong.length > 0 ? (
          <p className="system-quiz-wrong-count">틀린 문제 {wrong.length}개</p>
        ) : (
          <p className="system-quiz-wrong-count all-right">{copy.allRight}</p>
        )}
        <div className="system-quiz-actions">
          {/* The reason the score screen exists. */}
          {wrong.length > 0 && (
            <button type="button" className="primary" onClick={() => start(wrong)}>
              <Undo2 size={15} /> {copy.retryWrong}
            </button>
          )}
          <button type="button" onClick={() => start(null)}>
            <RotateCcw size={15} /> {copy.restart}
          </button>
          <button type="button" onClick={onClose}>{copy.close}</button>
        </div>
      </section>
    );
  }

  return (
    <section className="system-quiz" aria-label={copy.title}>
      <header>
        <b><GraduationCap size={15} aria-hidden /> {copy.title}</b>
        <span className="system-quiz-progress">
          {step + 1} / {round.length}
        </span>
        <button type="button" className="quiz-close" onClick={onClose} aria-label={copy.close}>
          <X size={16} />
        </button>
      </header>

      <p className="system-quiz-question">{current.item.question}</p>

      <ol className="system-quiz-options">
        {current.options.map((option, index) => {
          const state =
            picked === null
              ? ""
              : index === current.answer
                ? "right"
                : index === picked
                  ? "picked"
                  : "";
          return (
            <li key={option}>
              <button type="button" className={state} onClick={() => choose(index)} disabled={picked !== null}>
                <em>{["①", "②", "③", "④"][index]}</em>
                <span>{option}</span>
                {state === "right" && <Check size={16} />}
                {state === "picked" && <X size={16} />}
              </button>
            </li>
          );
        })}
      </ol>

      {picked !== null && (
        <div className="system-quiz-explain">
          <p>{current.item.explain}</p>
          <div className="system-quiz-actions">
            <button type="button" onClick={() => onOpenPassage(current.item)}>
              <BookOpen size={15} /> {copy.passage}
            </button>
            <button type="button" className="primary" onClick={next}>
              {step + 1 === round.length ? copy.finish : copy.next}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
