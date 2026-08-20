"use client";

import type { OrganId } from "../lib/anatomy-data";
import type { Organ } from "../i18n/merge";
import {
  BODY_SILHOUETTE,
  BODY_VIEWBOX,
  bodyPlacements,
  OUTLINE_ORGAN,
  type BodyShape,
} from "../lib/body-map";

/**
 * Fills by default; `stroke` turns the path into a line, as for the intestine.
 *
 * Every paint is `currentColor` and every geometry value is an attribute, so a
 * group only ever needs to set `color` to restyle its whole organ. Setting
 * `fill`/`stroke` from CSS instead would also override `stroke-width`, which
 * would collapse the stroked limbs into hairlines.
 */
function Shape({ shape }: { shape: BodyShape }) {
  if (shape.kind === "ellipse") {
    return <ellipse cx={shape.cx} cy={shape.cy} rx={shape.rx} ry={shape.ry} fill="currentColor" />;
  }
  if (shape.stroke) {
    return (
      <path
        d={shape.d}
        fill="none"
        stroke="currentColor"
        strokeWidth={shape.stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    );
  }
  return <path d={shape.d} fill="currentColor" />;
}

/**
 * Groups are the tap targets. SVG shapes cannot live inside a <button>, so the
 * group carries the button role explicitly — which also means it has to handle
 * Enter and Space itself, since only real buttons get that for free.
 */
function Target({
  className,
  label,
  accent,
  onSelect,
  children,
}: {
  className: string;
  label: string;
  accent?: string;
  onSelect: () => void;
  children: React.ReactNode;
}) {
  return (
    <g
      className={className}
      role="button"
      tabIndex={0}
      aria-label={label}
      style={accent ? ({ color: accent } as React.CSSProperties) : undefined}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        onSelect();
      }}
    >
      <title>{label}</title>
      {children}
    </g>
  );
}

/**
 * One body with every organ on it, so a child can see what sits next to what
 * instead of meeting each organ on its own. Tapping anywhere on it selects
 * that organ, which is what makes it a navigation surface and not a diagram.
 */
export function BodyMap({
  organs,
  activeId,
  onSelect,
  label,
  hint,
}: {
  organs: Record<OrganId, Organ>;
  activeId: OrganId;
  onSelect: (id: OrganId) => void;
  label: string;
  hint: string;
}) {
  const active = organs[activeId];
  // Drawn last so it is never hidden under whatever overlaps it — the selected
  // organ is the one the child is looking for.
  const ordered = [...bodyPlacements].sort(
    (a, b) => Number(a.id === activeId) - Number(b.id === activeId),
  );

  return (
    <div className="body-map">
      <svg viewBox={BODY_VIEWBOX} role="group" aria-label={label}>
        <Target
          className={`body-outline ${activeId === OUTLINE_ORGAN ? "active" : ""}`}
          label={organs[OUTLINE_ORGAN].name}
          onSelect={() => onSelect(OUTLINE_ORGAN)}
        >
          {BODY_SILHOUETTE.map((shape, index) => (
            <Shape key={index} shape={shape} />
          ))}
        </Target>

        {ordered.map((placement) => {
          const organ = organs[placement.id];
          return (
            <Target
              key={placement.id}
              className={`body-organ body-organ--${placement.id} ${placement.id === activeId ? "active" : ""}`}
              label={organ.name}
              accent={organ.accent}
              onSelect={() => onSelect(placement.id)}
            >
              <g
                className="body-organ-shape"
                style={
                  placement.pulse
                    ? ({ transformOrigin: `${placement.pulse.x}px ${placement.pulse.y}px` } as React.CSSProperties)
                    : undefined
                }
              >
                {placement.shapes.map((shape, index) => (
                  <Shape key={index} shape={shape} />
                ))}
              </g>
            </Target>
          );
        })}
      </svg>

      <p className="body-map-caption">
        <b style={{ color: active.accent }}>{active.name}</b>
        <span>{active.poetic}</span>
      </p>
      <small className="body-map-hint">{hint}</small>
    </div>
  );
}
