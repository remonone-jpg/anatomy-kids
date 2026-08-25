"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Maximize2, RotateCcw, Scan } from "lucide-react";
import type { OrganId } from "../lib/anatomy-data";
import type { Organ } from "../i18n/merge";
import type { BodyViewer } from "../lib/three/body-viewer";
import type { KidsUiCopy } from "../i18n/kids/types";

/**
 * The whole body, in 3D, with every organ inside it at its real size and place.
 *
 * The viewer class is imported lazily for the same reason the organ viewer is:
 * three plus ten models is far too much to sit in the initial bundle for a
 * view the visitor may never open.
 */
export function BodyScene({
  organs,
  activeId,
  onSelect,
  copy,
  compact = false,
}: {
  organs: Record<OrganId, Organ>;
  activeId: OrganId;
  onSelect: (id: OrganId) => void;
  copy: KidsUiCopy;
  /** Sized for the side panel rather than the main stage. */
  compact?: boolean;
}) {
  const mountRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<BodyViewer | null>(null);
  const onSelectRef = useRef(onSelect);
  // Read once at construction; the viewer is not rebuilt when this changes.
  const compactRef = useRef(compact);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [hovered, setHovered] = useState<OrganId | null>(null);

  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    let cancelled = false;
    let viewer: BodyViewer | null = null;

    void import("../lib/three/body-viewer").then(({ BodyViewer: Viewer }) => {
      if (cancelled || !mountRef.current) return;
      viewer = new Viewer(
        mountRef.current,
        {
          onLoading: (isLoading, value) => {
            setLoading(isLoading);
            setProgress(value);
          },
          // Routed through a ref because the viewer captures its callbacks once.
          onPick: (id) => onSelectRef.current(id),
          onHover: setHovered,
        },
        { compact: compactRef.current },
      );
      viewerRef.current = viewer;
      void viewer.load();
    });

    return () => {
      cancelled = true;
      viewerRef.current = null;
      viewer?.dispose();
    };
  }, []);

  useEffect(() => {
    viewerRef.current?.setSelected(activeId);
  }, [activeId, loading]);

  const focus = useCallback(() => viewerRef.current?.focus(activeId), [activeId]);
  const reset = useCallback(() => viewerRef.current?.reset(), []);

  const label = hovered ? organs[hovered].name : organs[activeId].name;

  return (
    <section className={`body-scene ${compact ? "compact" : ""}`} aria-label={copy.bodyLabel}>
      <div ref={mountRef} className="body-scene-mount" />

      <div className="body-scene-tools">
        <button type="button" onClick={focus}><Scan size={17} /> <span>{copy.bodyFocus}</span></button>
        <button type="button" onClick={reset}><RotateCcw size={17} /> <span>{copy.bodyReset}</span></button>
      </div>

      <p className="body-scene-name" aria-live="polite">
        <b style={{ color: organs[hovered ?? activeId].accent }}>{label}</b>
      </p>
      <small className="body-scene-hint">{copy.bodyHint}</small>
      {/* CC BY-SA 4.0 requires the credit to travel with the work; see ATTRIBUTION.md. */}
      <small className="body-scene-credit">{copy.bodyCredit}</small>

      {loading && (
        <div className="model-loader" role="status" aria-live="polite">
          <div className="loader-orbit"><Maximize2 size={20} /></div>
          <strong>{copy.bodyLoading}</strong>
          <span>{Math.max(5, Math.round(progress * 100))}%</span>
        </div>
      )}
    </section>
  );
}
