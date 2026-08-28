"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { CHILD_NAME_MAX, normaliseChildName } from "../i18n/kids";

/**
 * Asked once, the first time kids mode is switched on.
 *
 * Skipping is a first-class answer, not a way out — every sentence the name
 * appears in has a form that reads without one, so nothing is withheld from a
 * child whose grown-up would rather not type a name in.
 *
 * The value goes to `localStorage` and no further.
 */
export function ChildNamePrompt({
  copy,
  onSubmit,
  onSkip,
}: {
  copy: {
    nameAsk: string;
    namePlaceholder: string;
    nameStart: string;
    nameSkip: string;
    nameHint: string;
  };
  onSubmit: (name: string) => void;
  onSkip: () => void;
}) {
  const [value, setValue] = useState("");
  const name = normaliseChildName(value);

  return (
    <div className="modal-backdrop child-name-backdrop" role="presentation">
      <section className="child-name" role="dialog" aria-modal="true" aria-labelledby="child-name-title">
        <h2 id="child-name-title">{copy.nameAsk}</h2>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            // An empty box means the same as skipping.
            if (name) onSubmit(name);
            else onSkip();
          }}
        >
          <input
            type="text"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder={copy.namePlaceholder}
            maxLength={CHILD_NAME_MAX}
            autoComplete="off"
            autoFocus
            // Keeps the name out of the browser's own form history too.
            name="child-name"
            data-1p-ignore
          />
          <div className="child-name-actions">
            <button type="submit" className="primary">
              {copy.nameStart} <ArrowRight size={15} />
            </button>
            <button type="button" onClick={onSkip}>{copy.nameSkip}</button>
          </div>
        </form>
        <p className="child-name-hint">{copy.nameHint}</p>
      </section>
    </div>
  );
}
