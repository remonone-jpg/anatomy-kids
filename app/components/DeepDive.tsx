"use client";

import { useEffect, useState } from "react";
import {
  Boxes, Cog, Hash, Sprout, Users, HelpCircle, ScrollText, PawPrint,
  Clock, Activity, Apple, Hourglass, Microscope, GitBranch, Rocket,
  CloudSun, Languages, MessageSquareQuote, FlaskConical, Waves,
  ChevronDown, Volume2,
} from "lucide-react";
import type { DeepDive as DeepDiveEntry, DeepDiveCategory } from "../i18n/types";
import { speak } from "../lib/speech";

/**
 * Twenty headings in one column is a scroll, not a menu. Grouped, the panel
 * opens as five choices and the reader picks a direction first.
 *
 * The groups run outward: what the thing is, how it behaves through a day and
 * a life, how it sits among the other organs, how it meets the world outside
 * the body, and what people have come to say about it. An organ carrying fewer
 * categories simply shows fewer rows — and a group with nothing in it does not
 * appear at all.
 */
const GROUPS: { title: string; categories: DeepDiveCategory[] }[] = [
  { title: "무엇인가", categories: ["structure", "mechanism", "microscope", "numbers"] },
  { title: "어떻게 움직이나", categories: ["rhythm", "exercise", "food", "senses"] },
  { title: "몸속에서", categories: ["teamwork", "development", "aging", "evolution"] },
  // Weather,space and other animals are all about what lies outside this body.
  { title: "바깥 세상과", categories: ["weather", "space", "animals"] },
  { title: "사람들이 아는 것", categories: ["myths", "history", "etymology", "culture", "research"] },
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
export function DeepDive({
  entries,
  speechLang,
  reveal,
}: {
  entries: DeepDiveEntry[];
  speechLang: string;
  /** A category the quiz asked to show. Opens its group and its entry. */
  reveal?: DeepDiveEntry["category"] | null;
}) {
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [openEntry, setOpenEntry] = useState<string | null>(null);

  // The quiz names a category and this pane catches up with it. Adjusting
  // state during render on a changed prop is the sanctioned shape for this;
  // doing it in an effect costs an extra render and the linter says so.
  const [honoured, setHonoured] = useState<string | null>(null);
  if (reveal && reveal !== honoured) {
    const entry = entries.find((e) => e.category === reveal);
    const group = GROUPS.find((g) => g.categories.includes(reveal));
    setHonoured(reveal);
    if (entry && group) {
      setOpenGroup(group.title);
      setOpenEntry(entry.title);
    }
  }

  // Scrolling is a real side effect, and it has to wait for the group to
  // render its children before the target exists.
  useEffect(() => {
    if (!reveal) return;
    const id = window.setTimeout(() => {
      document.querySelector(`[data-deep-dive="${reveal}"]`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 60);
    return () => window.clearTimeout(id);
  }, [reveal]);

  const byCategory = new Map(entries.map((e) => [e.category, e]));
  // Groups with nothing behind them are dropped, so an organ carrying only
  // some categories never shows an empty heading.
  const groups = GROUPS
    .map((g) => ({ title: g.title, items: g.categories.map((c) => byCategory.get(c)).filter(Boolean) as DeepDiveEntry[] }))
    .filter((g) => g.items.length > 0);

  if (groups.length === 0) return null;

  return (
    <section className="deep-dive" aria-label="더 깊이 보기">
      <h2>더 깊이 보기</h2>
      {groups.map((group) => {
        const groupOpen = openGroup === group.title;
        return (
          <div key={group.title} className={`deep-dive-group ${groupOpen ? "open" : ""}`}>
            <h3>
              <button
                type="button"
                aria-expanded={groupOpen}
                onClick={() => {
                  setOpenGroup(groupOpen ? null : group.title);
                  setOpenEntry(null);
                }}
              >
                <span className="deep-dive-group-title">{group.title}</span>
                <span className="deep-dive-count">{group.items.length}</span>
                <ChevronDown size={16} aria-hidden className="deep-dive-chevron" />
              </button>
            </h3>

            {groupOpen && (
              <div className="deep-dive-items">
                {group.items.map((entry) => {
                  const { label, Icon } = META[entry.category];
                  const isOpen = openEntry === entry.title;
                  return (
                    <article key={entry.title} data-deep-dive={entry.category} className={isOpen ? "open" : ""}>
                      <h4>
                        <button
                          type="button"
                          aria-expanded={isOpen}
                          onClick={() => setOpenEntry(isOpen ? null : entry.title)}
                        >
                          <Icon size={16} aria-hidden />
                          <span className="deep-dive-label">{label}</span>
                          <span className="deep-dive-title">{entry.title}</span>
                          <ChevronDown size={16} aria-hidden className="deep-dive-chevron" />
                        </button>
                      </h4>
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
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
}
