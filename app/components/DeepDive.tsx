"use client";

import { useState } from "react";
import {
  Boxes, Cog, Hash, Sprout, Users, HelpCircle, ScrollText, PawPrint,
  ChevronDown, Volume2,
} from "lucide-react";
import type { DeepDive as DeepDiveEntry, DeepDiveCategory } from "../i18n/types";
import { speak } from "../lib/speech";

/**
 * The eight angles, in reading order: what it is, how it works, how much it
 * does, where it came from, who it works with, what people get wrong, how we
 * found out, and how other animals solved it.
 */
const ORDER: DeepDiveCategory[] = [
  "structure", "mechanism", "numbers", "development",
  "teamwork", "myths", "history", "animals",
];

const META: Record<DeepDiveCategory, { label: string; Icon: typeof Boxes }> = {
  structure:   { label: "구조", Icon: Boxes },
  mechanism:   { label: "작동 원리", Icon: Cog },
  numbers:     { label: "숫자로 보는 하루", Icon: Hash },
  development: { label: "태어나기 전과 후", Icon: Sprout },
  teamwork:    { label: "다른 장기와의 협업", Icon: Users },
  myths:       { label: "오해와 진실", Icon: HelpCircle },
  history:     { label: "발견의 역사", Icon: ScrollText },
  animals:     { label: "동물의 세계", Icon: PawPrint },
};

/**
 * The deep layer, folded away until asked for.
 *
 * Eight paragraphs shown at once read as one wall and get skipped; behind
 * headings they read as eight things you can choose between. Closed by
 * default so the panel above it stays the main thing.
 */
export function DeepDive({ entries, speechLang }: { entries: DeepDiveEntry[]; speechLang: string }) {
  const [open, setOpen] = useState<string | null>(null);

  // Document order is not guaranteed; the reading order is what matters.
  const sorted = [...entries].sort(
    (a, b) => ORDER.indexOf(a.category) - ORDER.indexOf(b.category),
  );
  if (sorted.length === 0) return null;

  return (
    <section className="deep-dive" aria-label="더 깊이 보기">
      <h2>더 깊이 보기</h2>
      {sorted.map((entry) => {
        const { label, Icon } = META[entry.category];
        const isOpen = open === entry.title;
        return (
          <article key={entry.title} className={isOpen ? "open" : ""}>
            <h3>
              <button type="button" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : entry.title)}>
                <Icon size={16} aria-hidden />
                <span className="deep-dive-label">{label}</span>
                <span className="deep-dive-title">{entry.title}</span>
                <ChevronDown size={16} aria-hidden className="deep-dive-chevron" />
              </button>
            </h3>
            {isOpen && (
              <div className="deep-dive-body">
                <p>{entry.body}</p>
                <button
                  type="button"
                  className="deep-dive-listen"
                  onClick={() => speak(`${entry.title}. ${entry.body}`, speechLang)}
                >
                  <Volume2 size={15} /> 들어보기
                </button>
              </div>
            )}
          </article>
        );
      })}
    </section>
  );
}
