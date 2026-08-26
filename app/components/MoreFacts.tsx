"use client";

import { useCallback, useMemo, useState } from "react";
import { Sparkles, RotateCcw, Volume2 } from "lucide-react";
import type { KidsUiCopy } from "../i18n/kids/types";
import { speak } from "../lib/speech";

/** Fisher–Yates. A fresh order every session, so the tenth fact is not always
 *  the one nobody reaches. */
function shuffle(items: string[]): string[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Ten extra facts, handed over one at a time.
 *
 * A list of ten is a wall to a five-year-old and gets skipped whole. One line
 * with a button under it is a thing you can keep pressing, and the dots show
 * there is an end to reach.
 */
export function MoreFacts({
  facts,
  copy,
  speechLang,
}: {
  facts: string[];
  copy: KidsUiCopy;
  speechLang: string;
}) {
  // The caller mounts this with a `key` per organ, so switching organs remounts
  // it and the round restarts on its own — no effect resetting state.
  const order = useMemo(() => shuffle(facts), [facts]);
  const [index, setIndex] = useState(0);

  const current = order[index];
  const done = index >= order.length - 1;

  const advance = useCallback(() => {
    const next = index + 1;
    if (next >= order.length) return;
    setIndex(next);
    speak(order[next], speechLang);
  }, [index, order, speechLang]);

  const restart = useCallback(() => {
    setIndex(0);
    speak(order[0], speechLang);
  }, [order, speechLang]);

  if (order.length === 0) return null;

  return (
    <section className="more-facts" aria-label={copy.moreFactsTitle}>
      <header>
        <Sparkles size={15} aria-hidden />
        <b>{copy.moreFactsTitle}</b>
        <ol className="more-facts-dots" aria-hidden>
          {order.map((fact, i) => (
            <li key={fact} className={i < index ? "seen" : i === index ? "now" : ""} />
          ))}
        </ol>
      </header>

      <p aria-live="polite">{current}</p>

      <div className="more-facts-actions">
        <button type="button" onClick={() => speak(current, speechLang)}>
          <Volume2 size={16} /> {copy.listen}
        </button>
        {done ? (
          <button type="button" className="primary" onClick={restart}>
            <RotateCcw size={16} /> {copy.moreFactsRestart}
          </button>
        ) : (
          <button type="button" className="primary" onClick={advance}>
            <Sparkles size={16} /> {copy.moreFactsButton}
          </button>
        )}
      </div>
    </section>
  );
}
