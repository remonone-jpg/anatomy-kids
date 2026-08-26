"use client";

import { useState } from "react";
import {
  Boxes, Cog, Hash, Sprout, Users, HelpCircle, ScrollText, PawPrint,
  Clock, Activity, Apple, Hourglass, Microscope, GitBranch, Rocket,
  CloudSun, Languages, MessageSquareQuote, FlaskConical, Waves,
  ChevronDown, Volume2,
} from "lucide-react";
import type { DeepDive as DeepDiveEntry, DeepDiveCategory } from "../i18n/types";
import { speak } from "../lib/speech";

/**
 * Reading order, fixed by hand rather than by category name.
 *
 * It runs outward: what the thing is, then how it behaves through a day and a
 * life, then how it sits among other organs, then how we came to know about it
 * and what people say. An organ that has only the original eight simply skips
 * the rest — the order holds either way.
 */
const ORDER: DeepDiveCategory[] = [
  "structure", "mechanism", "microscope", "numbers", "rhythm",
  "exercise", "food", "senses", "teamwork", "development", "aging",
  "evolution", "weather", "space", "myths", "history", "etymology",
  "culture", "animals", "research",
];

const META: Record<DeepDiveCategory, { label: string; Icon: typeof Boxes }> = {
  structure:   { label: "구조", Icon: Boxes },
  mechanism:   { label: "작동 원리", Icon: Cog },
  microscope:  { label: "현미경으로 보면", Icon: Microscope },
  numbers:     { label: "숫자로 보는 하루", Icon: Hash },
  rhythm:      { label: "하루의 리듬", Icon: Clock },
  exercise:    { label: "움직일 때", Icon: Activity },
  food:        { label: "먹는 것과의 관계", Icon: Apple },
  senses:      { label: "느껴지는 신호", Icon: Waves },
  teamwork:    { label: "다른 장기와의 협업", Icon: Users },
  development: { label: "태어나기 전과 후", Icon: Sprout },
  aging:       { label: "자라고 나이 들며", Icon: Hourglass },
  evolution:   { label: "진화의 흔적", Icon: GitBranch },
  weather:     { label: "계절과 날씨", Icon: CloudSun },
  space:       { label: "우주에서는", Icon: Rocket },
  myths:       { label: "오해와 진실", Icon: HelpCircle },
  history:     { label: "발견의 역사", Icon: ScrollText },
  etymology:   { label: "이름의 유래", Icon: Languages },
  culture:     { label: "말 속에 남은 흔적", Icon: MessageSquareQuote },
  animals:     { label: "동물의 세계", Icon: PawPrint },
  research:    { label: "지금 연구 중", Icon: FlaskConical },
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
