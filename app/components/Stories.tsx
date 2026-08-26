"use client";

import { BookOpen, Volume2 } from "lucide-react";
import { speak } from "../lib/speech";

/** Longer reads for the grown-up view. Open by default — unlike the deep dive,
 *  these are the point of the panel rather than an extra layer under it. */
export function Stories({
  entries,
  speechLang,
}: {
  entries: { title: string; body: string }[];
  speechLang: string;
}) {
  if (entries.length === 0) return null;
  return (
    <section className="stories" aria-label="이야기">
      <h2><BookOpen size={16} aria-hidden /> 이야기</h2>
      {entries.map((entry) => (
        <article key={entry.title}>
          <h3>{entry.title}</h3>
          <p>{entry.body}</p>
          <button type="button" onClick={() => speak(`${entry.title}. ${entry.body}`, speechLang)}>
            <Volume2 size={15} /> 들어보기
          </button>
        </article>
      ))}
    </section>
  );
}
