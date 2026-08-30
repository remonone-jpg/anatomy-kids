"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, Maximize2, Minus, Plus, RotateCcw, X } from "lucide-react";
import type { OrganId } from "../lib/anatomy-data";
import type { DiagramLabel } from "../i18n/school/diagrams";
import { asset } from "../lib/asset";

type Copy = {
  open: string;
  close: string;
  zoomIn: string;
  zoomOut: string;
  reset: string;
  hint: string;
  detail: string;
  beyond: string;
  loading: string;
};

/** A box in the SVG's own coordinates; panning and zooming move this, not the
 *  element, so a click lands where the reader thinks it did. */
type Box = { x: number; y: number; w: number; h: number };

const MIN_SCALE = 0.25;   // how far in the box may shrink — i.e. 4× zoom
const MAX_SCALE = 1;

function parseViewBox(svg: SVGSVGElement): Box {
  const raw = svg.getAttribute("viewBox");
  if (raw) {
    const [x, y, w, h] = raw.split(/[\s,]+/).map(Number);
    if ([x, y, w, h].every(Number.isFinite)) return { x, y, w, h };
  }
  const width = Number(svg.getAttribute("width")) || 1000;
  const height = Number(svg.getAttribute("height")) || 1000;
  return { x: 0, y: 0, w: width, h: height };
}

/**
 * The system diagram, opened full screen and made clickable.
 *
 * The file is fetched and inlined rather than shown through <img>: an image
 * document is sealed off, so nothing inside it can be clicked or styled. It is
 * fetched when the reader opens the panel rather than bundled — the
 * circulatory drawing alone is 700 kB.
 */
export function DiagramViewer({
  src,
  alt,
  labels,
  copy,
  onOpenOrgan,
  onClose,
}: {
  src: string;
  alt: string;
  labels: DiagramLabel[];
  copy: Copy;
  onOpenOrgan: (id: OrganId) => void;
  onClose: () => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const homeRef = useRef<Box | null>(null);
  const [markup, setMarkup] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const [picked, setPicked] = useState<DiagramLabel | null>(null);

  useEffect(() => {
    let live = true;
    fetch(asset(src))
      .then((r) => (r.ok ? r.text() : Promise.reject(new Error(String(r.status)))))
      .then((text) => {
        if (!live) return;
        // Our own file from the repo, but stripping scripts costs nothing and
        // means a swapped-in diagram can never bring code with it.
        setMarkup(text.replace(/<script\b[\s\S]*?<\/script>/gi, ""));
      })
      .catch(() => live && setFailed(true));
    return () => {
      live = false;
    };
  }, [src]);

  // Wire the inlined SVG once it is in the DOM.
  useEffect(() => {
    const host = hostRef.current;
    if (!markup || !host) return;
    const svg = host.querySelector("svg");
    if (!svg) return;
    svgRef.current = svg;
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", alt);
    // Captured once: this effect re-runs whenever the parent re-renders, and
    // re-reading here would make the current zoom the new home.
    if (!homeRef.current) homeRef.current = parseViewBox(svg);

    const byId = new Map(labels.map((l) => [l.id, l]));
    const targets = Array.from(svg.querySelectorAll<SVGTextElement>("text[data-organ]"));
    const cleanups: (() => void)[] = [];
    for (const node of targets) {
      const entry = byId.get(node.dataset.organ ?? "");
      if (!entry) continue;
      node.classList.add("diagram-hit");
      node.setAttribute("tabindex", "0");
      node.setAttribute("role", "button");
      node.setAttribute("aria-label", entry.name);
      const choose = () => setPicked(entry);
      const key = (event: KeyboardEvent) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          choose();
        }
      };
      node.addEventListener("click", choose);
      node.addEventListener("keydown", key);
      cleanups.push(() => {
        node.removeEventListener("click", choose);
        node.removeEventListener("keydown", key);
      });
    }
    return () => cleanups.forEach((fn) => fn());
  }, [markup, labels, alt]);

  const setBox = useCallback((next: Box) => {
    const svg = svgRef.current;
    if (!svg) return;
    const values = [next.x, next.y, next.w, next.h];
    // A single bad number makes the browser drop the whole attribute, which
    // reads as "nothing happened" rather than as an error.
    if (!values.every(Number.isFinite) || next.w <= 0 || next.h <= 0) return;
    svg.setAttribute("viewBox", values.join(" "));
  }, []);

  const zoom = useCallback(
    (direction: 1 | -1) => {
      const svg = svgRef.current;
      const home = homeRef.current;
      if (!svg || !home) return;
      const box = parseViewBox(svg);
      const scale = box.w / home.w;
      const next = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale * (direction > 0 ? 0.8 : 1.25)));
      const w = home.w * next;
      const h = home.h * next;
      // Zoom about the middle of what is currently shown.
      setBox({ x: box.x + (box.w - w) / 2, y: box.y + (box.h - h) / 2, w, h });
    },
    [setBox],
  );

  const home = useCallback(() => {
    if (homeRef.current) setBox(homeRef.current);
  }, [setBox]);

  // Drag to pan, in SVG units so the movement matches the pointer exactly.
  const drag = useRef<{ x: number; y: number; box: Box } | null>(null);
  const onPointerDown = (event: React.PointerEvent) => {
    const svg = svgRef.current;
    if (!svg) return;
    if ((event.target as Element).closest("text[data-organ]")) return;   // let the label take it
    drag.current = { x: event.clientX, y: event.clientY, box: parseViewBox(svg) };
    try {
      (event.currentTarget as Element).setPointerCapture(event.pointerId);
    } catch {
      // No live pointer — dragging still works without capture.
    }
  };
  const onPointerMove = (event: React.PointerEvent) => {
    const svg = svgRef.current;
    const start = drag.current;
    if (!svg || !start) return;
    const rect = svg.getBoundingClientRect();
    const dx = ((event.clientX - start.x) / rect.width) * start.box.w;
    const dy = ((event.clientY - start.y) / rect.height) * start.box.h;
    setBox({ ...start.box, x: start.box.x - dx, y: start.box.y - dy });
  };
  const endDrag = () => {
    drag.current = null;
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="modal-backdrop diagram-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="diagram-viewer"
        role="dialog"
        aria-modal="true"
        aria-label={alt}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header>
          <span className="diagram-hint">{copy.hint}</span>
          <div className="diagram-tools">
            <button type="button" onClick={() => zoom(1)} aria-label={copy.zoomIn}><Plus size={16} /></button>
            <button type="button" onClick={() => zoom(-1)} aria-label={copy.zoomOut}><Minus size={16} /></button>
            <button type="button" onClick={home} aria-label={copy.reset}><RotateCcw size={16} /></button>
          </div>
          <button type="button" className="modal-close" onClick={onClose} aria-label={copy.close}>
            <X size={18} />
          </button>
        </header>

        {/* Two branches rather than one element with both children and
            `dangerouslySetInnerHTML`: passing both lets React manage the
            children and wipe the injected markup on the next render, taking
            the click handlers with it. */}
        {markup ? (
          <div
            className="diagram-stage"
            ref={hostRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            dangerouslySetInnerHTML={{ __html: markup }}
          />
        ) : (
          <div className="diagram-stage">
            <p className="diagram-loading">{failed ? alt : copy.loading}</p>
          </div>
        )}

        {picked && (
          <aside className="diagram-note" aria-live="polite">
            <b>{picked.name}</b>
            {picked.beyond && <em className="diagram-beyond">{copy.beyond}</em>}
            <p>{picked.desc}</p>
            {picked.organId && (
              <button type="button" onClick={() => onOpenOrgan(picked.organId as OrganId)}>
                {copy.detail} <ArrowRight size={14} />
              </button>
            )}
          </aside>
        )}
      </section>
    </div>
  );
}

/** The card in the reading panel that opens the viewer. */
export function DiagramCard({
  src,
  alt,
  label,
  onOpen,
}: {
  src: string;
  alt: string;
  label: string;
  onOpen: () => void;
}) {
  return (
    <figure className="system-figure">
      <button type="button" className="system-figure-open" onClick={onOpen}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset(src)} alt={alt} loading="lazy" />
        <span><Maximize2 size={14} /> {label}</span>
      </button>
    </figure>
  );
}
