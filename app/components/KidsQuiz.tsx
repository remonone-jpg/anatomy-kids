"use client";

import { useCallback, useMemo, useState, useSyncExternalStore } from "react";
import { Sparkles, RotateCcw, Volume2, X } from "lucide-react";
import type { KidsQuizItem } from "../i18n/types";
import { CHILD_NAME } from "../i18n/kids/types";
import { speak } from "../lib/speech";

/** Fisher–Yates, same as everywhere else in the app. */
function shuffle<T>(items: T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** The index travels with the options so the answer survives the shuffle. */
function shuffleOptions(item: KidsQuizItem) {
  const flip = Math.random() < 0.5;
  return flip
    ? { options: [item.options[1], item.options[0]] as [string, string], answer: (1 - item.answer) as 0 | 1 }
    : { options: item.options, answer: item.answer };
}

const ROUND = 5;

export function KidsQuiz({
  pool,
  speechLang,
  copy,
  onClose,
}: {
  pool: KidsQuizItem[];
  speechLang: string;
  copy: { title: string; again: string; listen: string; wrong: string[] };
  onClose: () => void;
}) {
  // Client-only, as everywhere: Math.random() during render gives the server
  // one round and the browser another, and hydration tears the tree down.
  const onClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const [seed, setSeed] = useState(0);
  const round = useMemo(() => {
    const picked = onClient ? shuffle(pool).slice(0, ROUND) : pool.slice(0, ROUND);
    return picked.map((item) =>
      onClient ? { item, ...shuffleOptions(item) } : { item, options: item.options, answer: item.answer },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pool, onClient, seed]);

  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [lead, setLead] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const current = round[step];
  const finished = step >= round.length;

  const choose = useCallback(
    (index: number) => {
      if (picked !== null) return;
      setPicked(index);

      const right = index === current.answer;
      if (right) setScore((s) => s + 1);

      // The explanation is written in a praising tone, so on a wrong pick it
      // would read as if the child had got it right. A line in front says
      // which one it was — sorry, not scolding. Drawn here in the click
      // handler, never during render, so hydration stays put.
      const line = right ? null : (copy.wrong[Math.floor(Math.random() * copy.wrong.length)] ?? null);
      setLead(line);
      speak(line ? `${line} ${current.item.explain}` : current.item.explain, speechLang);
    },
    [picked, current, speechLang, copy.wrong],
  );

  const next = useCallback(() => {
    setPicked(null);
    setLead(null);
    setStep((s) => s + 1);
  }, []);

  const restart = useCallback(() => {
    setSeed((s) => s + 1);
    setStep(0);
    setPicked(null);
    setLead(null);
    setScore(0);
  }, []);

  if (round.length === 0) return null;

  if (finished) {
    return (
      <section className="kids-quiz done" aria-label={copy.title}>
        <p className="kids-quiz-score">
          {CHILD_NAME}, {round.length}개 중 <strong>{score}개</strong> 맞혔어요!
        </p>
        <div className="kids-quiz-actions">
          <button type="button" className="primary" onClick={restart}>
            <RotateCcw size={17} /> {copy.again}
          </button>
          <button type="button" onClick={onClose}>그만할래요</button>
        </div>
      </section>
    );
  }

  return (
    <section className="kids-quiz" aria-label={copy.title}>
      <header>
        <b><Sparkles size={15} aria-hidden /> {copy.title}</b>
        <ol className="kids-quiz-dots" aria-hidden>
          {round.map((entry, i) => (
            <li key={entry.item.id} className={i < step ? "seen" : i === step ? "now" : ""} />
          ))}
        </ol>
        <button type="button" className="quiz-close" onClick={onClose} aria-label="그만하기"><X size={16} /></button>
      </header>

      <p className="kids-quiz-question" aria-live="polite">{current.item.question}</p>
      <button
        type="button"
        className="kids-quiz-listen"
        onClick={() => speak(current.item.question, speechLang)}
      >
        <Volume2 size={16} /> {copy.listen}
      </button>

      <ol className="kids-quiz-options">
        {current.options.map((option, index) => {
          const state =
            picked === null ? "" : index === current.answer ? "right" : index === picked ? "picked" : "";
          return (
            <li key={option}>
              <button type="button" className={state} onClick={() => choose(index)} disabled={picked !== null}>
                {option}
              </button>
            </li>
          );
        })}
      </ol>

      {picked !== null && (
        <div className="kids-quiz-explain">
          <p>
            {lead && <span className="kids-quiz-lead">{lead} </span>}
            {current.item.explain}
          </p>
          <div className="kids-quiz-actions">
            <button
              type="button"
              onClick={() => speak(lead ? `${lead} ${current.item.explain}` : current.item.explain, speechLang)}
            >
              <Volume2 size={16} /> {copy.listen}
            </button>
            <button type="button" className="primary" onClick={next}>
              {step + 1 === round.length ? "다 했어요!" : "다음 문제"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
