"use client";

import { BookOpen } from "lucide-react";

/** Longer reads for the grown-up view. Open by default — unlike the deep dive,
 *  these are the point of the panel rather than an extra layer under it. */
export function Stories({
  entries,
  easy,
}: {
  entries: { title: string; body: string; bodyEasy?: string }[];
  /** The easy reading. Titles have no plain twin; only the body changes. */
  easy?: boolean;
}) {
  if (entries.length === 0) return null;
  return (
    <section className="stories" aria-label="이야기">
      <h2><BookOpen size={16} aria-hidden /> 이야기</h2>
      {entries.map((entry) => (
        <article key={entry.title}>
          <h3>{entry.title}</h3>
          <p>{easy && entry.bodyEasy ? entry.bodyEasy : entry.body}</p>
        </article>
      ))}
    </section>
  );
}
