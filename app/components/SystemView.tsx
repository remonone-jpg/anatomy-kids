"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  FlaskConical,
  GraduationCap,
  Hash,
  Link2,
  ListOrdered,
  Sparkles,
  Volume2,
} from "lucide-react";
import type { OrganId } from "../lib/anatomy-data";
import type { SystemContent } from "../i18n/school";
import { speak } from "../lib/speech";

type Copy = {
  madeOf: string;
  order: string;
  terms: string;
  experiment: string;
  prepare: string;
  steps: string;
  result: string;
  meaning: string;
  why: string;
  numbers: string;
  tryIt: string;
  connection: string;
  summary: string;
  exam: string;
  listen: string;
  goal: string;
  quizPaper: string;
};

/** Declared out here rather than inside the view: a component built during
 *  render is a new component every time, and loses its state with it. */
function Listen({ text, label, lang }: { text: string; label: string; lang: string }) {
  return (
    <button type="button" className="system-listen" onClick={() => speak(text, lang)}>
      <Volume2 size={14} /> {label}
    </button>
  );
}

/**
 * What the system is made of.
 *
 * Exported because it has two homes and only ever one at a time. A system with
 * a diagram shows this in the reading column, beside the picture. The two with
 * no diagram — senses, together — show it on the stage instead, where naming
 * the parts is the closest thing to pointing at them.
 */
export function SystemOrgans({
  system,
  heading,
  easy,
  onOpenOrgan,
}: {
  system: SystemContent;
  heading: string;
  easy?: boolean;
  onOpenOrgan: (id: OrganId) => void;
}) {
  return (
    <section className="system-section">
      <h3><Sparkles size={15} aria-hidden /> {heading}</h3>
      <ul className="system-organs">
        {system.organs.map((organ) => {
          const body = (
            <>
              <b>{organ.name}</b>
              <small>{easy && organ.roleEasy ? organ.roleEasy : organ.role}</small>
            </>
          );
          // Only the organs this site already has a page for are links; the
          // rest — blood vessels, bladder, ears — simply read.
          return (
            <li key={organ.name}>
              {organ.organId ? (
                <button type="button" onClick={() => onOpenOrgan(organ.organId as OrganId)}>
                  <span>{body}</span>
                  <ArrowRight size={14} />
                </button>
              ) : (
                <span className="plain">{body}</span>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/**
 * One organ system, laid out the way the chapter is taught.
 *
 * Read aloud is deliberately partial — the introduction, the answers to "why",
 * what the experiment stands for, and how the system joins the others. Those
 * are the passages a child re-reads; tables and checklists are for the eye.
 */
export function SystemView({
  system,
  copy,
  easy,
  speechLang,
  onOpenOrgan,
  revealExam,
  onStartQuiz,
}: {
  system: SystemContent;
  copy: Copy;
  /** The easy reading. Every passage falls back to its full version where no
   *  plain one has been written, so a partly-filled system still reads. */
  easy?: boolean;
  speechLang: string;
  onOpenOrgan: (id: OrganId) => void;
  /** An `exam` point to scroll to, sent by the quiz's "본문에서 보기". */
  revealExam?: string | null;
  onStartQuiz: () => void;
}) {
  const [openFlow, setOpenFlow] = useState<number | null>(0);
  const [openWhy, setOpenWhy] = useState<number | null>(null);
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const examRef = useRef<HTMLElement>(null);

  /** The easy wording when the reader asked for it and it exists, the full one
   *  otherwise. Every passage below goes through this. */
  const say = (full: string, plain?: string) => (easy && plain ? plain : full);
  const intro = say(system.intro, system.introEasy);
  const connection = say(system.connection, system.connectionEasy);
  // Whole or nothing — see the note on `summaryEasy`. A per-line fallback
  // would misalign the moment one system is written and another is not.
  const summary = easy && system.summaryEasy ? system.summaryEasy : system.summary;

  // Scrolling is not state, so an effect is the right place for it. A point
  // the quiz could not resolve simply brings the exam box into view, which is
  // the same thing a question with no `examPoint` does.
  useEffect(() => {
    if (!revealExam) return;
    const box = examRef.current;
    if (!box) return;
    const target =
      Array.from(box.querySelectorAll("li")).find((li) => li.querySelector("b")?.textContent === revealExam) ?? box;
    target.scrollIntoView({ behavior: "smooth", block: "center" });
    target.classList.add("flash");
    const timer = window.setTimeout(() => target.classList.remove("flash"), 1600);
    return () => window.clearTimeout(timer);
  }, [revealExam]);

  return (
    <article className="system-view">
      {/* The name and the one-liner moved to the stage's title bar, above the
          picture they belong to. Repeating them here would put the same two
          lines twice on one screen, side by side. */}
      <p className="system-curriculum"><GraduationCap size={13} aria-hidden /> {system.curriculum}</p>
      <p className="system-intro">{intro}</p>
      <Listen text={intro} label={copy.listen} lang={speechLang} />

      {/* Only when the stage has a diagram to show instead. Senses and
          together have no drawing, so the parts list is what stands on the
          stage for them and would otherwise appear twice. */}
      {system.image && (
        <SystemOrgans system={system} heading={copy.madeOf} easy={easy} onOpenOrgan={onOpenOrgan} />
      )}

      <section className="system-section">
        <h3><ListOrdered size={15} aria-hidden /> {copy.order}</h3>
        <ol className="system-flow">
          {system.flow.map((entry, i) => (
            <li key={entry.step} className={openFlow === i ? "open" : ""}>
              <button type="button" onClick={() => setOpenFlow(openFlow === i ? null : i)}>
                <em>{i + 1}</em>
                <b>{entry.step}</b>
                <ChevronDown size={15} />
              </button>
              {openFlow === i && <p>{say(entry.detail, entry.detailEasy)}</p>}
            </li>
          ))}
        </ol>
      </section>

      <section className="system-section">
        <h3><BookOpen size={15} aria-hidden /> {copy.terms}</h3>
        <dl className="system-terms">
          {system.terms.map((term) => (
            <div key={term.word}>
              <dt>{term.word}</dt>
              <dd>{say(term.mean, term.meanEasy)}</dd>
            </div>
          ))}
        </dl>
      </section>

      {system.experiment.map((exp) => {
        const result = say(exp.result, exp.easy?.result);
        const meaning = say(exp.meaning, exp.easy?.meaning);
        return (
        <section className="system-section system-experiment" key={exp.title}>
          <h3><FlaskConical size={15} aria-hidden /> {copy.experiment}</h3>
          <b className="experiment-title">{exp.title}</b>
          <p className="experiment-goal"><em>{copy.goal}</em> {exp.goal}</p>
          <div className="experiment-grid">
            <div>
              <h4>{copy.prepare}</h4>
              <ul>{exp.prepare.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
            <div>
              <h4>{copy.steps}</h4>
              <ol>{exp.steps.map((item) => <li key={item}>{item}</li>)}</ol>
            </div>
          </div>
          <p className="experiment-result"><em>{copy.result}</em> {result}</p>
          {/* Which part of the model stands for which part of the body. This
              is what the exam asks, so it is the loudest block in the card. */}
          <div className="experiment-meaning">
            <h4>{copy.meaning}</h4>
            <p>{meaning}</p>
            <Listen text={meaning} label={copy.listen} lang={speechLang} />
          </div>
        </section>
        );
      })}

      <section className="system-section">
        <h3>{copy.why}</h3>
        <ul className="system-why">
          {system.whyQuestions.map((entry, i) => (
            <li key={entry.q} className={openWhy === i ? "open" : ""}>
              <button type="button" onClick={() => setOpenWhy(openWhy === i ? null : i)}>
                <b>{entry.q}</b>
                <ChevronDown size={15} />
              </button>
              {openWhy === i && (
                <div>
                  <p>{say(entry.a, entry.aEasy)}</p>
                  <Listen text={say(entry.a, entry.aEasy)} label={copy.listen} lang={speechLang} />
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="system-section">
        <h3><Hash size={15} aria-hidden /> {copy.numbers}</h3>
        <ul className="system-numbers">
          {system.numbers.map((n) => (
            <li key={n.label}>
              <span>{n.label}</span>
              <b>{n.value}</b>
              <small>{n.compare}</small>
            </li>
          ))}
        </ul>
      </section>

      <section className="system-section">
        <h3>{copy.tryIt}</h3>
        <ul className="system-tryit">
          {system.tryIt.map((t) => (
            <li key={t.title}>
              <b>{t.title}</b>
              <p>{t.how}</p>
              <small>{say(t.what, t.whatEasy)}</small>
            </li>
          ))}
        </ul>
      </section>

      <section className="system-section system-connection">
        <h3><Link2 size={15} aria-hidden /> {copy.connection}</h3>
        <p>{connection}</p>
        <Listen text={connection} label={copy.listen} lang={speechLang} />
      </section>

      <section className="system-section">
        <h3>{copy.summary}</h3>
        <ul className="system-summary">
          {summary.map((line, i) => (
            <li key={line}>
              <button
                type="button"
                className={checked.has(i) ? "done" : ""}
                aria-pressed={checked.has(i)}
                onClick={() =>
                  setChecked((prev) => {
                    const next = new Set(prev);
                    if (next.has(i)) next.delete(i);
                    else next.add(i);
                    return next;
                  })
                }
              >
                <CheckCircle2 size={16} />
                <span>{line}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* The reason this layer exists, so it gets the strongest box on screen. */}
      <section className="system-exam" ref={examRef}>
        <h3>{copy.exam}</h3>
        <ul>
          {system.exam.map((entry) => (
            <li key={entry.point}>
              <b>{entry.point}</b>
              <p>{say(entry.note, entry.noteEasy)}</p>
            </li>
          ))}
        </ul>
      </section>

      <button type="button" className="system-quiz-start" onClick={onStartQuiz}>
        <GraduationCap size={16} /> {copy.quizPaper}
      </button>
    </article>
  );
}
