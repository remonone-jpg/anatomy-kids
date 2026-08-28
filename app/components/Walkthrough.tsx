"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, X } from "lucide-react";
import type { Hotspot } from "../i18n/merge";
import type { DeepDive, UiDictionary } from "../i18n/types";

type Copy = NonNullable<UiDictionary["walk"]>;

/** A step is either the opening overview or one structure of the organ. */
type Step = { kind: "overview"; title: string; body: string } | { kind: "part"; hotspot: Hotspot };

/**
 * Docked over the viewer rather than shown in a modal — the whole point is
 * watching the model turn to each structure as the text describes it, and a
 * full-screen backdrop would hide exactly that.
 */
export function Walkthrough({
  mechanism,
  hotspots,
  copy,
  /** Null when the organ has no model; the steps then run as text only. */
  onFocus,
  onOpenPassage,
  onClose,
}: {
  mechanism: DeepDive;
  hotspots: Hotspot[];
  copy: Copy;
  onFocus: ((id: string | null) => void) | null;
  onOpenPassage: () => void;
  onClose: () => void;
}) {
  const steps: Step[] = [
    { kind: "overview", title: mechanism.title, body: mechanism.body },
    ...hotspots.map((hotspot) => ({ kind: "part" as const, hotspot })),
  ];
  const [index, setIndex] = useState(0);
  const step = steps[index];

  // Driving the model is a side effect of which step is showing, so it belongs
  // here rather than in the click handlers — arrow keys move steps too.
  useEffect(() => {
    if (!onFocus) return;
    onFocus(step.kind === "part" ? step.hotspot.id : null);
  }, [step, onFocus]);

  // Releases the model when the walkthrough closes, so the next thing the user
  // does starts from the resting view.
  useEffect(() => () => onFocus?.(null), [onFocus]);

  const last = index === steps.length - 1;

  return (
    <div className="walkthrough" role="region" aria-label={copy.title}>
      <header>
        <em>{copy.title}</em>
        <ol className="walk-pips" aria-hidden>
          {steps.map((entry, i) => (
            <li
              key={entry.kind === "overview" ? "overview" : entry.hotspot.id}
              className={i === index ? "now" : i < index ? "seen" : ""}
            />
          ))}
        </ol>
        <span className="walk-count">{index + 1} / {steps.length}</span>
        <button type="button" onClick={onClose} aria-label={copy.close}><X size={15} /></button>
      </header>

      {step.kind === "overview" ? (
        <div className="walk-body">
          <b>{step.title}</b>
          <p>{step.body}</p>
        </div>
      ) : (
        <div className="walk-body">
          <b style={{ color: step.hotspot.color }}>{step.hotspot.label}</b>
          <p>{step.hotspot.detail}</p>
        </div>
      )}

      <footer>
        <button type="button" onClick={() => setIndex((i) => i - 1)} disabled={index === 0}>
          <ArrowLeft size={14} /> {copy.prev}
        </button>
        {last ? (
          <button type="button" className="primary" onClick={onOpenPassage}>
            <BookOpen size={14} /> {copy.passage}
          </button>
        ) : (
          <button type="button" className="primary" onClick={() => setIndex((i) => i + 1)}>
            {copy.next} <ArrowRight size={14} />
          </button>
        )}
      </footer>
    </div>
  );
}
