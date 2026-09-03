"use client";

import { useState } from "react";
import {
  ArrowRight,
  AudioLines,
  Bone,
  Brain,
  Candy,
  ChevronLeft,
  ChevronRight,
  CircleDot,
  Droplets,
  Dumbbell,
  Flower2,
  Hand,
  HeartPulse,
  RefreshCw,
  Sun,
  Utensils,
  Waves,
  Wind,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { OrganId } from "../lib/anatomy-data";
import type { ChartNode, SystemChart as Chart } from "../i18n/school/charts";

/**
 * The chart's icon set, by name.
 *
 * The five senses are all read as metaphors rather than as organs: lucide has
 * an eye and an ear but no nose and no tongue, and three drawings of organs
 * beside two of something else would look like two of them were forgotten.
 * What they have in common is the stimulus each one takes, so that is what
 * they show — light, sound, scent, taste, touch.
 */
const ICONS: Record<string, LucideIcon> = {
  // together
  utensils: Utensils,
  wind: Wind,
  heart: HeartPulse,
  cell: CircleDot,
  droplets: Droplets,
  brain: Brain,
  bone: Bone,
  // senses
  waves: Waves,
  light: Sun,
  sound: AudioLines,
  scent: Flower2,
  taste: Candy,
  touch: Hand,
  nerve: Zap,
  muscle: Dumbbell,
};

const fill = (template: string, values: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ""));

type Copy = {
  /** Shown in the shut drawer: what pressing a box will do. */
  hint: string;
  /** Stands in for writing that has not been written yet. */
  empty: string;
  goSystem: string;
  goOrgan: string;
  tryIt: string;
  prev: string;
  next: string;
  position: string;
};

/**
 * The stage for a system with no diagram.
 *
 * It borrows the diagram's card, drawer and pager on purpose: pressing a box
 * here should feel like pressing a label there, and the two systems that were
 * left out are the ones that most need to feel like the other five. What is
 * new is only the chart itself — rows of boxes with arrows between them, and
 * a bracket down both sides where the flow loops back on itself.
 */
export function SystemChart({
  chart,
  title,
  subtitle,
  easy,
  copy,
  systemNames,
  onOpenSystem,
  onOpenOrgan,
}: {
  chart: Chart;
  title: string;
  subtitle?: string;
  easy?: boolean;
  copy: Copy;
  /** System id to its name, for naming where a box leads. */
  systemNames: Record<string, string>;
  onOpenSystem: (systemId: string) => void;
  onOpenOrgan: (id: OrganId) => void;
}) {
  const [pickedId, setPickedId] = useState<string | null>(null);

  /** The easy wording where the reader asked for it and it exists. */
  const say = (full?: string, plain?: string) => (easy && plain ? plain : full ?? "");

  // The pager walks every box in reading order, the aside included: it is the
  // way to be sure you saw all of them, and a box left out of the count is a
  // box the reader never learns is there.
  const flat = chart.rows.flatMap((row) => row.nodes);
  const picked = flat.find((node) => node.id === pickedId) ?? null;
  const at = picked ? flat.findIndex((node) => node.id === picked.id) : -1;
  const step = (delta: -1 | 1) => {
    const next = at < 0 ? (delta > 0 ? 0 : flat.length - 1) : at + delta;
    if (next < 0 || next >= flat.length) return;
    setPickedId(flat[next].id);
  };

  const main = chart.rows.filter((row) => !row.aside);
  const aside = chart.rows.filter((row) => row.aside);
  // Placed by row number so the loop bracket can span exactly the rows it
  // belongs to. Reading the index off the data keeps the two in step when a
  // row is added.
  const loopFrom = chart.loop ? main.findIndex((row) => row.id === chart.loop!.from) : -1;
  const loopTo = chart.loop ? main.findIndex((row) => row.id === chart.loop!.to) : -1;
  const loopSpan = loopFrom >= 0 && loopTo >= 0 ? `${loopFrom + 1} / ${loopTo + 2}` : undefined;

  const box = (node: ChartNode) => {
    const Icon = node.icon ? ICONS[node.icon] : undefined;
    return (
      <button
        type="button"
        key={node.id}
        className={`chart-node ${picked?.id === node.id ? "active" : ""}`}
        aria-pressed={picked?.id === node.id}
        style={node.accent ? ({ "--node-accent": node.accent } as React.CSSProperties) : undefined}
        onClick={() => setPickedId(picked?.id === node.id ? null : node.id)}
      >
        {Icon && <Icon className="chart-icon" size={19} aria-hidden />}
        <span className="chart-text">
          <b>{say(node.label, node.labelEasy)}</b>
          {node.kicker && <small>{say(node.kicker, node.kickerEasy)}</small>}
        </span>
        {(node.goSystem || node.goOrgan) && <ArrowRight className="chart-go" size={13} aria-hidden />}
      </button>
    );
  };

  return (
    <section className="diagram-viewer diagram-inline system-chart" aria-label={title}>
      <header className="diagram-bar">
        <div className="diagram-title">
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
      </header>

      <div className="diagram-body">
        <div className="chart-stage">
          <div className="chart-rows">
            {main.map((row, index) => (
              <div className="chart-row" key={row.id} style={{ gridRow: index + 1 }}>
                {/* Nothing points at the first row. The line is drawn rather
                    than suggested — a chevron floating in a gap left the boxes
                    looking like a list, which is the one thing this is not. */}
                {index > 0 && (
                  <span className="chart-arrow">
                    <i className="chart-line" aria-hidden />
                    {row.arrow && <em>{say(row.arrow, row.arrowEasy)}</em>}
                  </span>
                )}
                {/* A row of several that is followed by another row has to
                    gather before it can point: a stub under each box down to a
                    rail, and the arrow below carries all of them on. Derived
                    rather than declared — a row with one box has nothing to
                    gather, and the last row leads nowhere. */}
                <div
                  className={`chart-boxes ${row.nodes.length > 1 && index < main.length - 1 ? "gather" : ""}`}
                  data-count={row.nodes.length}
                >
                  {row.nodes.map(box)}
                </div>
              </div>
            ))}
            {chart.loop && loopSpan && (
              <>
                <span className="chart-loop chart-loop-left" style={{ gridRow: loopSpan }} aria-hidden />
                <span className="chart-loop chart-loop-right" style={{ gridRow: loopSpan }}>
                  <RefreshCw className="chart-loop-icon" size={13} aria-hidden />
                  <em>{say(chart.loop.label, chart.loop.labelEasy)}</em>
                </span>
              </>
            )}
          </div>

          {aside.length > 0 && (
            <div className="chart-aside">
              {chart.asideTitle && <h3>{chart.asideTitle}</h3>}
              {aside.map((row) => (
                <div className="chart-boxes" data-count={row.nodes.length} key={row.id}>
                  {row.nodes.map(box)}
                </div>
              ))}
            </div>
          )}
        </div>

        <aside className={`diagram-panel ${picked ? "open" : "shut"}`}>
          <div className="diagram-read" aria-live="polite">
            {picked ? (
              <>
                <div className="diagram-col diagram-col-read">
                  <h3>{say(picked.label, picked.labelEasy)}</h3>
                  {picked.kicker && (
                    <p className="diagram-badges">
                      <span className="diagram-badge diagram-badge-parent">
                        {say(picked.kicker, picked.kickerEasy)}
                      </span>
                    </p>
                  )}
                  {/* The seat the writing will take. Until it arrives the
                      drawer says so plainly rather than opening on nothing —
                      an empty panel reads as a fault. */}
                  {say(picked.desc, picked.descEasy) ? (
                    <p className="diagram-desc">{say(picked.desc, picked.descEasy)}</p>
                  ) : (
                    <p className="diagram-fallback">{copy.empty}</p>
                  )}
                  {picked.tryIt && (
                    <div className="diagram-try">
                      <h4><Hand size={14} aria-hidden /> {copy.tryIt}</h4>
                      <p>{say(picked.tryIt, picked.tryItEasy)}</p>
                    </div>
                  )}
                </div>

                <div className="diagram-col diagram-col-go">
                  {picked.goSystem && (
                    <div className="diagram-jump diagram-jump-cross">
                      <h4>{copy.goSystem}</h4>
                      <ul>
                        <li>
                          <button type="button" onClick={() => onOpenSystem(picked.goSystem as string)}>
                            {systemNames[picked.goSystem] ?? picked.goSystem}
                            <ArrowRight size={13} />
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                  {picked.goOrgan && (
                    <button
                      type="button"
                      className="diagram-detail"
                      onClick={() => onOpenOrgan(picked.goOrgan as OrganId)}
                    >
                      {copy.goOrgan} <ArrowRight size={15} />
                    </button>
                  )}
                </div>
              </>
            ) : (
              <p className="diagram-prompt">{copy.hint}</p>
            )}
          </div>

          <nav className="diagram-step">
            <button type="button" onClick={() => step(-1)} disabled={at <= 0} aria-label={copy.prev}>
              <ChevronLeft size={16} /> {copy.prev}
            </button>
            <span>{at >= 0 ? fill(copy.position, { total: flat.length, n: at + 1 }) : ""}</span>
            <button
              type="button"
              onClick={() => step(1)}
              disabled={at >= flat.length - 1}
              aria-label={copy.next}
            >
              {copy.next} <ChevronRight size={16} />
            </button>
          </nav>
        </aside>
      </div>
    </section>
  );
}
