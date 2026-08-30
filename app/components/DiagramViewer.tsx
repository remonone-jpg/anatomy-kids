"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowRight, ChevronLeft, ChevronRight, Hand, Maximize2, Minus, Plus, RotateCcw, X,
} from "lucide-react";
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
  contains: string;
  belongsTo: string;
  tryIt: string;
  related: string;
  position: string;
  prev: string;
  next: string;
};

const fill = (template: string, values: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (whole, key) => String(values[key] ?? whole));

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
  title,
  labels,
  relatedHeading,
  copy,
  onOpenOrgan,
  onClose,
}: {
  src: string;
  alt: string;
  /** Shown in the title bar, so the reader knows which system is open. */
  title: string;
  labels: DiagramLabel[];
  /** Overrides the generic heading for the nearby-labels list. */
  relatedHeading?: string;
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
    // Revalidate rather than trust the disk copy: the diagrams are edited in
    // place and keep their filename, so a stale hit shows last week's labels.
    fetch(asset(src), { cache: "no-cache" })
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

  // Put the markup in ourselves, and only when it actually changes.
  const [mounted, setMounted] = useState(0);
  useEffect(() => {
    const host = hostRef.current;
    if (!markup || !host) return;
    host.innerHTML = markup;
    setMounted((n) => n + 1);
    return () => {
      host.innerHTML = "";
    };
  }, [markup]);

  // Wire the labels. Safe to re-run: it removes its own listeners first.
  useEffect(() => {
    const host = hostRef.current;
    if (!mounted || !host) return;
    const svg = host.querySelector("svg");
    if (!svg) return;
    svgRef.current = svg;
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", alt);
    // A file that carries its own width/height keeps that size whatever the
    // stylesheet says, and a tall one then hangs out of the card. Dropping
    // them leaves the viewBox in charge, which is what scales the drawing to
    // whatever box it is given.
    svg.removeAttribute("width");
    svg.removeAttribute("height");
    // Inkscape writes overflow="visible" on some exports, which lets the
    // drawing paint outside its own viewport — the figure then keeps its
    // natural size and hangs off the bottom of the card instead of scaling
    // into it. It writes it in both places, and a style declaration beats the
    // presentation attribute, so removing only the attribute fixes the files
    // that carry one and misses the files that carry both.
    svg.removeAttribute("overflow");
    svg.style.removeProperty("overflow");
    if (!svg.getAttribute("preserveAspectRatio")) {
      svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    }
    // Captured once: this effect re-runs whenever the parent re-renders, and
    // re-reading here would make the current zoom the new home.
    if (!homeRef.current) homeRef.current = parseViewBox(svg);

    const byId = new Map(labels.map((l) => [l.id, l]));
    // Usually the <text> itself. Where a label is a single digit it is a <g>
    // wrapping the digit and an invisible square, because a glyph that small
    // is not a target a fingertip can hit. Either way the id sits on exactly
    // one element, so a label is never two tab stops.
    const targets = Array.from(svg.querySelectorAll<SVGGraphicsElement>("[data-organ]"));
    const cleanups: (() => void)[] = [];
    for (const node of targets) {
      const entry = byId.get(node.dataset.organ ?? "");
      if (!entry) continue;
      node.classList.add("diagram-hit");
      // Named as holding parts before anything is clicked, so the grouping is
      // visible in the drawing rather than only after the reader finds it.
      if (entry.children?.length) node.classList.add("diagram-parent");
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
    // The skeleton draws a pale bar down the side of each group it names. The
    // original tints them so faintly they read as nothing; the stylesheet
    // deepens them, and this is the hook it needs.
    svg.querySelectorAll('[id$="BlueBar"]').forEach((bar) => {
      bar.classList.add("diagram-group-bar");
    });

    // The respiratory drawing groups its labels inside hard black rectangles
    // and lays a white card behind each group. Both are the author's, and both
    // are louder than anything in the other diagrams — the boxes are drawn as
    // heavily as the anatomy, and a white card on a cream page reads as a
    // stain. Neither is removed: the boxes are what say 코·코안·코선반·코안뜰
    // are one group, and some cards are the only thing keeping the artwork off
    // the letters. They are picked out by shape and repainted by the
    // stylesheet, so the file itself is untouched.
    //
    // A card with nothing but leader lines under it can simply go; one with
    // artwork under it becomes the page colour, which hides it just as well
    // while still holding the drawing away from the words.
    const shapes = Array.from(svg.querySelectorAll<SVGGraphicsElement>("path,polygon"));
    const size = (node: SVGGraphicsElement) => {
      try {
        const b = node.getBBox();
        return b.width > 0 ? b : null;
      } catch {
        return null;
      }
    };
    const paintOf = (node: SVGGraphicsElement, prop: "fill" | "stroke") =>
      (node.style[prop] || node.getAttribute(prop) || "").trim().toLowerCase();
    const isWhite = (v: string) => /^(#fff|#ffffff|white|rgb\(255,\s*255,\s*255\))$/.test(v);
    const isBlack = (v: string) => /^(#000|#000000|black|rgb\(0,\s*0,\s*0\))$/.test(v);

    for (const node of shapes) {
      const box = size(node);
      if (!box) continue;
      const d = node.getAttribute("d") ?? "";
      // One closed run of straight lines. The single-subpath test matters: the
      // excretory diagram draws all four of its leader lines as one path, and
      // without it that path is a big straight closed black shape too.
      const straight =
        !/[csqta]/i.test(d) && /z\s*$/i.test(d.trim()) && (d.match(/[Mm]/g) ?? []).length === 1;
      if (straight && isBlack(paintOf(node, "stroke")) && box.width >= 100 && box.height >= 25) {
        node.classList.add("diagram-frame");
        continue;
      }
      if (
        isWhite(paintOf(node, "fill")) &&
        box.width >= 60 && box.width <= 220 &&
        box.height >= 15 && box.height <= 40
      ) {
        // Anything filled underneath means the card is doing work.
        const covered = shapes.some((other) => {
          if (other === node) return false;
          const paint = paintOf(other, "fill");
          if (!paint || paint === "none" || isWhite(paint)) return false;
          const o = size(other);
          return (
            !!o && o.x < box.x + box.width && box.x < o.x + o.width &&
            o.y < box.y + box.height && box.y < o.y + o.height
          );
        });
        node.classList.add(covered ? "diagram-chip-keep" : "diagram-chip-drop");
      }
    }

    // Two of the four drawings paint their own white page behind the artwork.
    // On a cream card that reads as a photograph pasted on rather than a
    // picture belonging to the page, and it is the only thing making the four
    // look like different things. Matched by covering the whole canvas rather
    // than by id, since neither file names it the same way.
    const box = parseViewBox(svg);
    svg.querySelectorAll<SVGRectElement>("rect").forEach((rect) => {
      const wide = Math.abs(rect.width.baseVal.value - box.w) < 2;
      const tall = Math.abs(rect.height.baseVal.value - box.h) < 2;
      const white = /^(#fff(fff)?|white|rgb\(255,\s*255,\s*255\))$/i.test(
        rect.style.fill || rect.getAttribute("fill") || "",
      );
      if (wide && tall && white) rect.style.fill = "transparent";
    });
    return () => cleanups.forEach((fn) => fn());
  }, [mounted, labels, alt]);

  // Light the chosen label, and anything it contains along with it: reading
  // 척추뼈 should show which five labels are the parts being talked about.
  useEffect(() => {
    const host = hostRef.current;
    if (!mounted || !host || !picked) return;
    const lit: Element[] = [];
    for (const id of [picked.id, ...(picked.children ?? [])]) {
      const node = host.querySelector(`[data-organ="${CSS.escape(id)}"]`);
      if (!node) continue;
      node.classList.add(id === picked.id ? "diagram-active" : "diagram-within");
      lit.push(node);
    }
    return () => lit.forEach((n) => n.classList.remove("diagram-active", "diagram-within"));
  }, [picked, mounted]);

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
    if ((event.target as Element).closest("[data-organ]")) return;   // let the label take it
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

  // Reading the labels in order. Hunting for the next one in the drawing is
  // the hard part — 자뼈 and 노뼈 are thirteen units apart — so the panel also
  // walks the list. It stops at both ends rather than wrapping: "28개 중
  // 28번째" with a dead 다음 button is how a reader knows they saw everything.
  const at = picked ? labels.findIndex((l) => l.id === picked.id) : -1;
  const step = useCallback(
    (delta: -1 | 1) => {
      if (!labels.length) return;
      const next = at < 0 ? (delta > 0 ? 0 : labels.length - 1) : at + delta;
      if (next < 0 || next >= labels.length) return;
      setPicked(labels[next]);
    },
    [at, labels],
  );

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      // Let the arrows do their usual job inside a control.
      const target = event.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return;
      if (event.key === "ArrowRight") { event.preventDefault(); step(1); }
      if (event.key === "ArrowLeft") { event.preventDefault(); step(-1); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, step]);

  const parent = picked ? labels.find((l) => l.children?.includes(picked.id)) : undefined;
  const jump = (id: string) => {
    const found = labels.find((l) => l.id === id);
    if (found) setPicked(found);
  };

  return (
    <div className="modal-backdrop diagram-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="diagram-viewer"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="diagram-bar">
          <h2>{title}</h2>
          <div className="diagram-tools">
            <button type="button" onClick={() => zoom(1)} aria-label={copy.zoomIn} title={copy.zoomIn}><Plus size={17} /></button>
            <button type="button" onClick={() => zoom(-1)} aria-label={copy.zoomOut} title={copy.zoomOut}><Minus size={17} /></button>
            <button type="button" onClick={home} aria-label={copy.reset} title={copy.reset}><RotateCcw size={17} /></button>
            <button type="button" onClick={onClose} aria-label={copy.close} title={copy.close}><X size={18} /></button>
          </div>
        </header>

        <div className="diagram-body">
          <div
            className="diagram-stage"
            ref={hostRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
          />
          {!markup && <p className="diagram-loading">{failed ? alt : copy.loading}</p>}

          <aside className="diagram-panel">
            <div className="diagram-read" aria-live="polite">
              {picked ? (
                <>
                  <h3>{picked.name}</h3>
                  {(parent || picked.beyond) && (
                    <p className="diagram-badges">
                      {parent && (
                        <span className="diagram-badge diagram-badge-parent">
                          {fill(copy.belongsTo, { name: parent.name })}
                        </span>
                      )}
                      {picked.beyond && (
                        <span className="diagram-badge diagram-badge-beyond">{copy.beyond}</span>
                      )}
                    </p>
                  )}
                  <p className="diagram-desc">{picked.desc}</p>

                  {picked.tryIt && (
                    <div className="diagram-try">
                      <h4><Hand size={14} aria-hidden /> {copy.tryIt}</h4>
                      <p>{picked.tryIt}</p>
                    </div>
                  )}

                  {[
                    { key: "within", head: copy.contains, ids: picked.children },
                    {
                      key: "near",
                      head: relatedHeading ?? copy.related,
                      // A part of this label is already listed above it. Left
                      // in, 척추뼈 would show the same five names twice.
                      ids: picked.related?.filter((id) => !picked.children?.includes(id)),
                    },
                  ].map(({ key, head, ids }) =>
                    ids?.length ? (
                      <div key={key} className={`diagram-jump diagram-jump-${key}`}>
                        <h4>{head}</h4>
                        <ul>
                          {ids.map((id) => {
                            const other = labels.find((l) => l.id === id);
                            return other ? (
                              <li key={id}>
                                <button type="button" onClick={() => jump(id)}>{other.name}</button>
                              </li>
                            ) : null;
                          })}
                        </ul>
                      </div>
                    ) : null,
                  )}

                  {picked.organId && (
                    <button
                      type="button"
                      className="diagram-detail"
                      onClick={() => onOpenOrgan(picked.organId as OrganId)}
                    >
                      {copy.detail} <ArrowRight size={15} />
                    </button>
                  )}
                </>
              ) : (
                <p className="diagram-prompt">{copy.hint}</p>
              )}
            </div>

            <nav className="diagram-step">
              <button
                type="button"
                onClick={() => step(-1)}
                disabled={at <= 0}
                aria-label={copy.prev}
              >
                <ChevronLeft size={16} /> {copy.prev}
              </button>
              <span>
                {at >= 0
                  ? fill(copy.position, { total: labels.length, n: at + 1 })
                  : fill(copy.position, { total: labels.length, n: 0 })}
              </span>
              <button
                type="button"
                onClick={() => step(1)}
                disabled={at >= labels.length - 1}
                aria-label={copy.next}
              >
                {copy.next} <ChevronRight size={16} />
              </button>
            </nav>
          </aside>
        </div>
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
