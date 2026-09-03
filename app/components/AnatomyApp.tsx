"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import gsap from "gsap";
import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  ChevronDown,
  CircleHelp,
  Crosshair,
  FileText,
  Globe,
  Heart,
  LibraryBig,
  Microscope,
  Play,
  Search,
  PersonStanding,
  Scan,
  Sparkles,
  Stethoscope,
  Volume2,
  X,
} from "lucide-react";
import { OrganViewer } from "./OrganViewer";
import { BodyScene } from "./BodyScene";
import { MoreFacts } from "./MoreFacts";
import { Stories } from "./Stories";
import { DeepDive } from "./DeepDive";
import { KnowledgeQuiz } from "./KnowledgeQuiz";
import { KidsQuiz } from "./KidsQuiz";
import { ConditionsModal } from "./Conditions";
import { Walkthrough } from "./Walkthrough";
import { ChildNamePrompt } from "./ChildNamePrompt";
import { SystemView, SystemOrgans } from "./SystemView";
import { SystemQuiz } from "./SystemQuiz";
import { DiagramViewer } from "./DiagramViewer";
import type { OrganId } from "../lib/anatomy-data";
import type { LocaleConfig } from "../i18n/config";
import { locales } from "../i18n/config";
import { buildOrgans, indexOrgans, type Organ } from "../i18n/merge";
import { format, type Dictionary, type UiDictionary } from "../i18n/types";
import { applyKids, getBodySense, getKidsUi, getMoreFacts, kidsAvailable } from "../i18n/kids";
import { getAllQuiz, getKidsQuiz, getOrganQuiz } from "../i18n/quiz";
import { conditionsAvailable, getConditions } from "../i18n/conditions";
import { getSystems, schoolAvailable } from "../i18n/school";
import { getAllSystemQuiz, getSystemQuiz, systemQuizAvailable } from "../i18n/quiz";
import { getDiagramLabels, getRelatedHeading } from "../i18n/school/diagrams";
import type { KnowledgeQuizItem } from "../i18n/types";
import { speak, stopSpeaking } from "../lib/speech";
import { readMode, serverMode, subscribeMode, writeMode, type Mode } from "../lib/mode";
import {
  clearChildName,
  readChildAsked,
  readChildName,
  serverChildAsked,
  serverChildName,
  subscribeChildName,
  writeChildName,
} from "../lib/child-name";
import { asset } from "../lib/asset";

type Modal = "lesson" | "animation" | "system" | null;

/**
 * How many questions the knowledge quiz draws from its bank in one sitting —
 * five about the organ on screen, ten when the whole body is. Named because
 * the quiz card prints the number, and a card promising a different count
 * from the one the quiz deals out is worse than no card.
 */
const KNOWLEDGE_QUIZ_SIZE = 5;
const BODY_QUIZ_SIZE = 10;

/**
 * Renders an organ illustration, or its accent glyph for organs that ship as a
 * 3D model without the painted asset set. Keeps every image slot filled instead
 * of leaving a broken `<img>` behind.
 */
function OrganArt({
  organ,
  // Named `kind` rather than `asset` so it does not shadow the path helper.
  kind,
  alt,
  size,
}: {
  organ: Organ;
  kind: "thumb" | "organ" | "microscopic" | "compare" | "location";
  alt: string;
  size?: number;
}) {
  if (!organ.illustrated) {
    // An empty alt means a surrounding control already names this, so the
    // glyph should be skipped rather than announced with no label.
    const labelling = alt ? { role: "img", "aria-label": alt } : { "aria-hidden": true };
    return (
      <span className="art-fallback" style={{ "--art-accent": organ.accent } as React.CSSProperties} {...labelling}>
        {organ.icon}
      </span>
    );
  }
  return (
    <img
      key={`${organ.id}-${kind}`}
      src={asset(`/anatomy/${organ.id}/${kind}.webp`)}
      alt={alt}
      width={size}
      height={size}
      loading={kind === "thumb" ? "eager" : "lazy"}
      decoding="async"
    />
  );
}


/**
 * Measurements like "250–350 g" begin with a digit, which Unicode treats as
 * neutral — inside an RTL paragraph the range gets visually reversed. Digits
 * are not "strong" characters, so `unicode-bidi: plaintext` cannot rescue it;
 * the run has to be isolated as LTR explicitly.
 */
function Measure({ children }: { children: string }) {
  return <bdi dir={/^[\d(]/.test(children.trim()) ? "ltr" : "auto"}>{children}</bdi>;
}

/**
 * Switches language by swapping the leading path segment, so the current
 * document is preserved rather than bouncing through the root redirect.
 *
 * The native <select> is stretched transparently over the whole pill rather
 * than sitting inline. A <label> only *focuses* a select when clicked — it does
 * not open it — so anything outside the select's own box (the globe, the
 * chevron, the padding) would otherwise be a dead zone. Overlaying it means a
 * click anywhere on the control opens the picker, while the visible row
 * underneath stays fully styleable.
 */
function LanguageSwitcher({ locale, t }: { locale: LocaleConfig; t: UiDictionary }) {
  return (
    <div className="language-switcher" title={t.language.label}>
      <Globe size={16} aria-hidden />
      <span className="language-current">{locale.nativeName}</span>
      <ChevronDown size={14} aria-hidden />
      <select
        aria-label={t.language.choose}
        value={locale.code}
        onChange={(event) => {
          window.location.pathname = `/${event.target.value}`;
        }}
      >
        {locales.map((entry) => (
          <option key={entry.code} value={entry.code} lang={entry.code}>
            {entry.nativeName}
          </option>
        ))}
      </select>
    </div>
  );
}

/** Grown-up control, so it stays a plain labelled switch rather than a toy. */
function ModeSwitch({
  mode,
  labels,
  onChange,
}: {
  mode: Mode;
  labels: { easy: string; detailed: string; aria: string };
  onChange: (next: Mode) => void;
}) {
  const options: Mode[] = ["easy", "detailed"];
  return (
    <div className="mode-switch" role="group" aria-label={labels.aria}>
      {options.map((option) => (
        <button
          key={option}
          type="button"
          className={mode === option ? "on" : ""}
          aria-pressed={mode === option}
          onClick={() => onChange(option)}
        >
          {labels[option]}
        </button>
      ))}
    </div>
  );
}

export function AnatomyApp({ locale, dictionary }: { locale: LocaleConfig; dictionary: Dictionary }) {
  // This build exists for a five-year-old, so kids mode starts on.
  const mode = useSyncExternalStore(subscribeMode, readMode, serverMode);
  const kidsCopy = getKidsUi(locale.code);
  // Storage is a client-only store; reading it during a render would give the
  // server one name and the browser another.
  const childName = useSyncExternalStore(subscribeChildName, readChildName, serverChildName);
  const childAsked = useSyncExternalStore(subscribeChildName, readChildAsked, serverChildAsked);
  // Which writing to show. Everything is present in both readings; this
  // only decides whether a passage is shown in its plain rewrite, and
  // which of the two wordings the shared UI strings use.
  const kidsOn = mode === "easy" && kidsAvailable(locale.code);
  // The organ systems are no longer a mode of their own; both readings get
  // them wherever the locale has them.
  const schoolOn = schoolAvailable(locale.code);

  // BCP-47 for speech synthesis; `intl` is stored in the underscore form.
  const speechLang = locale.intl.replace("_", "-");

  const activeDictionary = useMemo(
    () => (kidsOn ? applyKids(dictionary, locale.code, childName) : dictionary),
    [kidsOn, dictionary, locale.code, childName],
  );
  const t = activeDictionary.ui;
  const organs = useMemo(() => buildOrgans(activeDictionary.organs), [activeDictionary.organs]);
  const organById = useMemo(() => indexOrgans(organs), [organs]);

  const [organId, setOrganId] = useState<OrganId>("heart");
  const [autoRotate, setAutoRotate] = useState(true);
  const [compare, setCompare] = useState(false);
  const [modal, setModal] = useState<Modal>(null);
  const [query, setQuery] = useState("");
  const [mobileLibrary, setMobileLibrary] = useState(false);
  /**
   * Which stage the centre column shows.
   *
   * There used to be a second copy of the body map in the side panel, and a
   * derived `panelView` that forced the panel to the list whenever the map
   * was on the main stage — otherwise two WebGL contexts would hold the same
   * ten models. The map now lives on the main stage only, so the rule it
   * enforced is structural rather than something to remember.
   */
  const [stage, setStage] = useState<"organ" | "body">("organ");
  // The knowledge quiz lives beside the reading panels, not over the 3D stage
  // — the label quiz already owns that space.
  const [knowledgeQuiz, setKnowledgeQuiz] = useState(false);
  const [kidsQuiz, setKidsQuiz] = useState(false);
  // null = closed. A string opens that condition directly, "" opens the list.
  const [conditionView, setConditionView] = useState<string | null>(null);
  const [walking, setWalking] = useState(false);
  // School mode has two views. A system id opens the systems layer; null is
  // the organ view, which reuses the existing screen.
  const [systemId, setSystemId] = useState<string | null>(null);
  // "paper" is one system's fifteen; "mixed" samples the whole unit.
  const [systemQuiz, setSystemQuiz] = useState<"paper" | "mixed" | null>(null);
  const [revealExam, setRevealExam] = useState<string | null>(null);
  // Which label to open on arrival, when a diagram sends the reader to
  // another system. Cleared as soon as that diagram is closed.
  const [diagramLabel, setDiagramLabel] = useState<string | null>(null);
  // Set by the viewer; lets a step turn the model without a re-render.
  const focusRef = useRef<(id: string | null) => void>(() => {});
  const [revealCategory, setRevealCategory] = useState<KnowledgeQuizItem["category"] | null>(null);
  const [quizActive, setQuizActive] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const prefetched = useRef(new Set<OrganId>());

  /**
   * Scrolls one of the reading panel's blocks into view.
   *
   * The panel is its own scroll container, so this moves the panel rather
   * than the page. The wait is what the deep dive already learned: a block
   * that a click has only just decided to show does not exist yet on the
   * frame the click happens in.
   */
  const scrollToBlock = (selector: string) => {
    window.setTimeout(() => {
      contentRef.current?.querySelector(selector)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
  };

  /**
   * Leaves the systems layer if it is open, and says whether it had to.
   *
   * The systems view replaces the whole reading panel, so the three content
   * entries that live in that panel have nothing to scroll to while it is up.
   * They come back to the organ rather than going grey: a menu whose items
   * stop working is harder to read than one that always does something.
   */
  const backToOrgan = () => {
    if (systemId === null) return false;
    setSystemId(null);
    setSystemQuiz(null);
    setRevealExam(null);
    return true;
  };
  const organ = organById[organId];
  const reference = organById[organId === "heart" ? "brain" : "heart"];

  // Kids mode shows the five organs a child can point to on their own body.
  const listedOrgans = useMemo(
    () => organs,
    [organs],
  );
  const filteredOrgans = useMemo(
    () =>
      listedOrgans.filter((item) =>
        `${item.name} ${item.system}`.toLocaleLowerCase(locale.code).includes(query.toLocaleLowerCase(locale.code)),
      ),
    [listedOrgans, query, locale.code],
  );

  // Speech outlives the component otherwise — it belongs to the browser, not
  // to React, so navigating away would leave a sentence still being read.
  useEffect(() => stopSpeaking, []);

  useEffect(() => {
    if (!contentRef.current) return;
    gsap.fromTo(contentRef.current.querySelectorAll("[data-reveal]"),
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.48, stagger: 0.035, ease: "power2.out", overwrite: true },
    );
  }, [organId]);

  /**
   * Both readings show these, but only the easy one calls the reader by name.
   *
   * Several of these lines are written as "{child}가 자는 동안 뇌는…", and
   * passing the name through in the detailed reading had it addressing one
   * particular five-year-old in the middle of the grown-up text. Passing
   * `null` is not a loss: every one of those lines already carries a neutral
   * wording for readers who never entered a name ("우리가 자는 동안…").
   */
  const named = kidsOn ? childName : null;
  const bodySense = getBodySense(locale.code, organId, named);
  // The tissue view and the walkthrough are built from deepDive entries, so
  // they exist exactly where that content does — Korean.
  const microscope = organ.deepDive?.find((entry) => entry.category === "microscope");
  const mechanism = organ.deepDive?.find((entry) => entry.category === "mechanism");
  const walkable = Boolean(mechanism && t.walk);

  // Only where the encyclopedia has been written.
  const conditionCopy = t.conditions;
  const conditionDetails =
    conditionCopy && conditionsAvailable(locale.code) ? getConditions(locale.code, organId) : [];
  const moreFacts = getMoreFacts(locale.code, organId, named);
  // Only school mode can have one open; the organ panel takes over when null.
  const activeSystem = schoolOn && systemId ? getSystems(locale.code).find((s) => s.id === systemId) : undefined;

  /**
   * What the quiz card says, or `null` where there is no quiz to offer.
   *
   * The headline counts what pressing the button actually gives, not how big
   * the collection is: the easy quiz asks this organ's whole set, the
   * detailed one draws a handful from a larger bank. Promising two hundred
   * questions and handing over five would be a small lie printed in the
   * biggest type on the card, so the bank size goes in the line underneath.
   */
  const quizCard = useMemo(() => {
    const copy = t.cards;
    if (!copy.quizLabel || !copy.quizFormat || !copy.quizBank || !copy.quizStart) return null;
    const pool = kidsOn ? getKidsQuiz(locale.code, organId, childName) : getOrganQuiz(locale.code, organId);
    if (pool.length === 0) return null;
    const asked = kidsOn ? pool.length : Math.min(KNOWLEDGE_QUIZ_SIZE, pool.length);
    const choices = pool[0].options.length;
    return {
      label: copy.quizLabel,
      format: format(copy.quizFormat, { count: String(asked), choices: String(choices) }),
      note: format(copy.quizBank, { organ: organ.name, total: String(pool.length) }),
      start: copy.quizStart,
    };
  }, [t.cards, kidsOn, locale.code, organId, childName, organ.name]);

  /** Everything a child would want read out for the organ on screen. */
  const readAloud = (target: Organ) => {
    const lines = [target.name, target.description, target.funFact, bodySense ?? ""];
    speak(lines.filter(Boolean).join(" "), speechLang);
  };

  /**
   * Switching between the two readings keeps the screen exactly as it is.
   *
   * That is the whole point of the switch: the same item, said two ways. A
   * reader compares them by flipping back and forth, and every panel this
   * used to close was a panel they had to find again to finish comparing.
   *
   * It once closed all of them for a reason that no longer holds. When there
   * were three modes, the systems layer belonged to some of them and not
   * others, so a switch could leave the viewer on a screen the new mode did
   * not have. `schoolOn` no longer looks at the mode — both readings carry
   * the systems layer, the diagrams, the clinical card and the rest — so
   * there is nothing to be stranded on.
   */
  const changeMode = (next: Mode) => {
    writeMode(next);
    // The voice is mid-sentence in wording that is about to be replaced.
    stopSpeaking();
    // The two organ quizzes are the panels that still belong to one reading
    // each. Left open, either would vanish on the way across and reappear on
    // the way back. Everything else on screen is carried by both.
    setKidsQuiz(false);
    setKnowledgeQuiz(false);
  };

  const selectOrgan = (id: OrganId) => {
    if (organById[id].illustrated) {
      ["organ", "microscopic", "compare", "location"].forEach((kind) => {
        const image = new Image();
        image.src = asset(`/anatomy/${id}/${kind}.webp`);
      });
    }
    setOrganId(id);
    setMobileLibrary(false);
    setCompare(false);
    setQuizActive(false);
    // The open condition belongs to the organ being left behind.
    setConditionView(null);
    setWalking(false);
    // Naming the organ out loud is the whole point for a child who cannot read
    // the heading they just tapped.
    if (kidsOn) speak(organById[id].name, speechLang);
    else stopSpeaking();
  };

  // Warms the model in the HTTP cache while the pointer is still travelling,
  // so the switch usually renders without a visible loading pass.
  const prefetchOrgan = (id: OrganId) => {
    const model = organById[id].model;
    if (id === organId || !model || prefetched.current.has(id)) return;
    prefetched.current.add(id);
    void fetch(asset(model), { priority: "low" } as RequestInit).catch(() => {});
  };

  return (
    <main className={`app-shell ${kidsOn ? "kids" : ""}`}>
      <header className="topbar">
        <button className="brand" type="button" onClick={() => selectOrgan("heart")} aria-label={t.brand.home}>
          <strong>Anatomy Atelier<sup>✦</sup></strong>
          <em>{t.brand.tagline}</em>
        </button>
        {/* The five nav buttons, the profile avatar and the bookmark button
            were chrome from the original design, wired to nothing. Disabling
            them only made the header say the app has features it does not.
            What sits here instead is the one thing that was missing: which of
            the three views you are looking at. It used to be split between a
            pair of tabs floating over the stage and another pair inside the
            reading panel, with a third pair in the side panel repeating one of
            the labels for a different purpose. */}
        {kidsCopy && (
          <div className="view-switch" role="tablist" aria-label={kidsCopy.viewSwitch}>
            {/* Pressed state is derived, never stored. `systemId` is cleared
                from five other places — a diagram jumping to another system,
                the quiz, the organ links — and a stored flag would drift out
                of step with every one of them. */}
            <button
              type="button"
              role="tab"
              aria-selected={systemId === null && stage === "organ"}
              className={systemId === null && stage === "organ" ? "active" : ""}
              onClick={() => { setSystemId(null); setStage("organ"); }}
            >
              <Heart size={15} aria-hidden /> <span>{kidsCopy.viewOrgan}</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={systemId === null && stage === "body"}
              className={systemId === null && stage === "body" ? "active" : ""}
              onClick={() => { setSystemId(null); setStage("body"); }}
            >
              <Scan size={15} aria-hidden /> <span>{kidsCopy.viewBody}</span>
            </button>
            {schoolOn && (
              <button
                type="button"
                role="tab"
                aria-selected={systemId !== null}
                className={systemId !== null ? "active" : ""}
                onClick={() => setSystemId(systemId ?? getSystems(locale.code)[0]?.id ?? null)}
              >
                <BrainCircuit size={15} aria-hidden /> <span>{kidsCopy.viewSystems}</span>
              </button>
            )}
          </div>
        )}
        <label className="search-box">
          <Search size={17} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.search.placeholder} />
        </label>
        <LanguageSwitcher locale={locale} t={t} />
        {kidsCopy && (
          <ModeSwitch
            mode={mode}
            labels={{ easy: kidsCopy.modeEasy, detailed: kidsCopy.modeDetailed, aria: kidsCopy.modeLabel }}
            onChange={changeMode}
          />
        )}
        {kidsOn && kidsCopy && (
          <button type="button" className="child-name-change" onClick={clearChildName}>
            {kidsCopy.nameChange}
          </button>
        )}
        <button className="mobile-library-trigger" onClick={() => setMobileLibrary(true)} aria-label={t.library.open}><LibraryBig size={20} /></button>
      </header>

      {/* A row of its own rather than four more pills in the header. The header
          answers "where am I"; this answers "what do I want to read", and the
          two questions deserve to be told apart. It also sits directly above
          the panel it acts on, which is where the relationship shows. */}
      {kidsCopy && (
        /* Two of the four carry a mark, and only because the thing they open
           is a piece of state this component already holds. The other two open
           something that is simply further down the same panel: the deep dive
           keeps `openEntry` to itself, and a story is only ever "open" in the
           sense that it is on screen. Lifting one and watching the scrollbar
           for the other would be inventing an answer to make the row look
           uniform, and a mark that means "you pressed this a moment ago"
           teaches the wrong thing about what it means. */
        <nav className="content-nav" aria-label={kidsCopy.contentNav}>
          <button
            type="button"
            onClick={() => {
              const left = backToOrgan();
              // Re-arming through null is what makes a second press work: the
              // deep dive ignores a `reveal` it has already honoured.
              setRevealCategory(null);
              window.setTimeout(() => setRevealCategory("structure"), left ? 80 : 0);
            }}
          >
            <Microscope size={17} aria-hidden /> <span>{kidsCopy.navDeepDive}</span>
          </button>
          <button
            type="button"
            onClick={() => { backToOrgan(); scrollToBlock(".stories"); }}
          >
            <BookOpen size={17} aria-hidden /> <span>{kidsCopy.navStories}</span>
          </button>
          {/* The one entry that stays where it is: each layer has its own
              question bank, so this opens whichever belongs to the screen.
              Three banks, one mark — whichever is up, this is what opened it. */}
          <button
            type="button"
            className={kidsQuiz || knowledgeQuiz || systemQuiz !== null ? "active" : ""}
            onClick={() => {
              setQuizActive(false);
              if (systemId !== null) { setSystemQuiz("paper"); return; }
              if (kidsOn) { setKnowledgeQuiz(false); setKidsQuiz(true); scrollToBlock(".kids-quiz"); }
              else { setKidsQuiz(false); setKnowledgeQuiz(true); setRevealCategory(null); scrollToBlock(".knowledge-quiz"); }
            }}
          >
            <CircleHelp size={17} aria-hidden /> <span>{kidsCopy.navQuiz}</span>
          </button>
          {conditionCopy && conditionDetails.length > 0 && (
            <button
              type="button"
              className={conditionView !== null ? "active" : ""}
              onClick={() => { backToOrgan(); setConditionView(""); }}
            >
              <FileText size={17} aria-hidden /> <span>{kidsCopy.navConditions}</span>
            </button>
          )}
        </nav>
      )}

      {/* The systems layer gets a taller box than the organ views. All five
          diagrams are portrait — 1.04 to 1.93 tall for every one wide — so
          height is the only dimension that makes the figure bigger, and the
          760px ceiling that suits a 3D model was throwing away whatever the
          screen had beyond it. */}
      <div className={`workspace ${activeSystem ? "workspace-systems" : ""}`}>
        <aside className={`organ-library ${mobileLibrary ? "open" : ""}`}>
          <div className="panel-heading">
            <span>{activeSystem && kidsCopy ? kidsCopy.schoolSystems : t.library.title}</span>
            <button aria-label={t.library.close} className="mobile-close" onClick={() => setMobileLibrary(false)}><X size={17} /></button>
          </div>
          {/* The panel used to offer the body map as a second tab. Choosing
              which view to look at is the header's job now, and the map only
              ever belonged on the main stage: two of them meant two WebGL
              contexts holding the same ten models. This is the organ list
              and nothing else. */}
          <div className="organ-list">
            {/* Reading a system, this column lists systems. The seven pills
                that used to sit on top of the reading panel said the same
                thing in a worse place — a chooser belongs beside the other
                chooser, not above the thing it chose. The search box is left
                alone: it searches organs, and it still does. */}
            {activeSystem
              ? getSystems(locale.code).map((entry) => (
                  <button
                    type="button"
                    key={entry.id}
                    className={`organ-item system-item ${entry.id === activeSystem.id ? "active" : ""}`}
                    aria-pressed={entry.id === activeSystem.id}
                    onClick={() => { setSystemId(entry.id); setDiagramLabel(null); }}
                  >
                    {/* No artwork for a system, and a borrowed organ thumb
                        would name the wrong thing. A dot carries the colour
                        the list already sorts by. */}
                    <span className="organ-glyph system-dot" aria-hidden />
                    <span><b>{entry.name}</b><small>{entry.oneLine}</small></span>
                    {entry.id === activeSystem.id && <Heart className="favorite" size={14} fill="currentColor" />}
                  </button>
                ))
              : filteredOrgans.map((item) => (
              <button
                type="button"
                key={item.id}
                className={`organ-item ${organId === item.id ? "active" : ""}`}
                onClick={() => selectOrgan(item.id)}
                onPointerEnter={() => prefetchOrgan(item.id)}
                onFocus={() => prefetchOrgan(item.id)}
                style={{ "--item-accent": item.accent } as React.CSSProperties}
              >
                <span className="organ-glyph">
                  <OrganArt organ={item} kind="thumb" alt="" size={47} />
                </span>
                {/* A child gets more from "쿵! 쿵! 쿵!" than from "심혈관계". */}
                <span><b>{item.name}</b><small>{kidsOn ? item.poetic : item.system}</small></span>
                {organId === item.id && <Heart className="favorite" size={14} fill="currentColor" />}
              </button>
            ))}
          </div>
          {/* "모든 장기 보기" clears the organ search. With systems listed
              there is no search to clear and nothing it would reveal. */}
          {!activeSystem && (
            <button className="view-all" onClick={() => setQuery("")}>{t.library.viewAll} <ArrowRight size={14} /></button>
          )}
          <blockquote>
            <Sparkles size={18} />
            <p>{t.library.quoteLine1}<br />{t.library.quoteLine2}</p>
            <em>{t.library.quoteSign}</em>
          </blockquote>
        </aside>

        <div className="stage">
          {/* Three siblings, one at a time, and the order of the tests is the
              rule: a system is a place of its own, so it wins over `stage`,
              which only ever chose between the two organ views. No fourth
              `stage` value — `systemId` already says this, and two flags
              meaning one thing is how the old `panelView` drifted. Exactly one
              of these mounts, so at most one WebGL context is ever alive. */}
          {activeSystem && kidsCopy ? (
            activeSystem.image ? (
              <DiagramViewer
                // Remount per system: the drawing, the pan and the chosen
                // label all belong to one figure and none of them survive a
                // swap intact.
                key={activeSystem.id}
                src={activeSystem.image.src}
                alt={activeSystem.image.alt}
                title={activeSystem.name}
                subtitle={activeSystem.oneLine}
                labels={getDiagramLabels(locale.code, activeSystem.id)}
                relatedHeading={getRelatedHeading(locale.code, activeSystem.id)}
                easy={mode === "easy"}
                initialLabel={diagramLabel ?? undefined}
                systemNames={Object.fromEntries(getSystems(locale.code).map((s) => [s.id, s.name]))}
                copy={{ ...kidsCopy.diagram, readingFallback: kidsCopy.readingFallback }}
                onOpenSystem={(id, labelId) => {
                  setSystemId(id);
                  setDiagramLabel(labelId ?? null);
                }}
                onOpenOrgan={(id) => {
                  setSystemId(null);
                  setSystemQuiz(null);
                  setRevealExam(null);
                  selectOrgan(id);
                }}
              />
            ) : (
              /* Senses and together have no drawing. Naming the parts is the
                 nearest thing to pointing at them, so the list that would
                 otherwise sit in the reading column stands here instead. No 3D
                 stand-in: that would put a second context beside the one the
                 organ view already holds. */
              <div className="system-stage">
                <header className="diagram-bar">
                  <div className="diagram-title">
                    <h2>{activeSystem.name}</h2>
                    <p>{activeSystem.oneLine}</p>
                  </div>
                </header>
                <div className="system-stage-body">
                  <SystemOrgans
                    system={activeSystem}
                    heading={kidsCopy.system.madeOf}
                    easy={mode === "easy"}
                    onOpenOrgan={(id) => {
                      setSystemId(null);
                      setSystemQuiz(null);
                      setRevealExam(null);
                      selectOrgan(id);
                    }}
                  />
                </div>
              </div>
            )
          ) : stage === "body" && kidsCopy ? (
            <BodyScene organs={organById} activeId={organId} onSelect={selectOrgan} copy={kidsCopy} />
          ) : (
            <OrganViewer
              organ={organ}
              t={t}
              autoRotate={autoRotate}
              onAutoRotate={setAutoRotate}
              compare={compare}
              onCompare={() => setCompare(!compare)}
              quizActive={quizActive}
              onQuizExit={() => setQuizActive(false)}
              kids={kidsOn}
              speechLang={speechLang}
              focusRef={focusRef}
            />
          )}
          {walking && mechanism && t.walk && (
            <Walkthrough
              key={organId}
              mechanism={mechanism}
              hotspots={organ.hotspots}
              copy={t.walk}
              // An organ with no model has nothing to turn; the steps still read.
              onFocus={organ.model ? (id) => focusRef.current(id) : null}
              onOpenPassage={() => {
                setWalking(false);
                setRevealCategory("mechanism");
              }}
              onClose={() => setWalking(false)}
            />
          )}
        </div>

        <aside className="info-panel" ref={contentRef}>
          {/* The seven pills moved to the left column, beside the organ list
              they replace. 섞어 풀기 stayed: it is not a choice of what to
              read but an action on all seven, and putting it eighth in a row
              of seven made it look like the eighth system. */}
          {schoolOn && kidsCopy && activeSystem && (
            <>
              {systemQuizAvailable(locale.code) && !systemQuiz && (
                <nav className="system-picker" aria-label={kidsCopy.schoolSystems}>
                  <button
                    type="button"
                    className="system-picker-quiz"
                    onClick={() => setSystemQuiz("mixed")}
                  >
                    {kidsCopy.systemQuiz.mixed}
                  </button>
                </nav>
              )}
              {systemQuiz && systemQuizAvailable(locale.code) ? (
                <SystemQuiz
                  key={`${activeSystem.id}-${systemQuiz}`}
                  pool={systemQuiz === "mixed" ? getAllSystemQuiz(locale.code) : getSystemQuiz(locale.code, activeSystem.id)}
                  size={systemQuiz === "mixed" ? 30 : "all"}
                  copy={kidsCopy.systemQuiz}
                  onOpenPassage={(item) => {
                    setSystemQuiz(null);
                    setSystemId(item.systemId);
                    // A point the data does not actually carry falls back to
                    // the exam box, which is what a question with no
                    // `examPoint` does anyway.
                    setRevealExam(item.examPoint ?? "");
                  }}
                  onClose={() => setSystemQuiz(null)}
                />
              ) : (
                <SystemView
                  key={activeSystem.id}
                  system={activeSystem}
                  copy={{ ...kidsCopy.system }}
                  easy={mode === "easy"}
                  speechLang={speechLang}
                  revealExam={revealExam}
                  onStartQuiz={() => setSystemQuiz("paper")}
                  onOpenOrgan={(id) => {
                    setSystemId(null);
                    setSystemQuiz(null);
                    setRevealExam(null);
                    selectOrgan(id);
                  }}
                />
              )}
            </>
          )}
          {/* The systems layer replaces the organ panel rather than sitting
              above it; both want the whole reading column. */}
          {!activeSystem && (
          <>
          <div className="info-kicker" data-reveal><Heart size={13} fill="currentColor" /> {format(t.info.kicker, { organ: organ.name })}</div>
          <div className="info-title-row" data-reveal>
            <div><h1>{organ.name}</h1><em>{organ.poetic}</em></div>
            <span className="specimen-stamp">
              <OrganArt organ={organ} kind="organ" alt="" size={92} />
            </span>
          </div>
          <p className="description" data-reveal>{organ.description}</p>
          {kidsCopy && (
            <button className="listen-button" type="button" data-reveal onClick={() => readAloud(organ)}>
              <Volume2 size={19} /> {kidsCopy.listen}
            </button>
          )}
          {/* Turns the screen into something to do with their own body, which
              is how a child this age actually locates an organ. */}
          {kidsCopy && bodySense && (
            <div className="body-sense" data-reveal>
              <PersonStanding size={17} />
              <p><b>{kidsCopy.bodySenseTitle}</b>{bodySense}</p>
            </div>
          )}
          <div className="rule" />
          <h2 data-reveal>{t.info.keyFacts}</h2>
          <dl className="key-facts">
            <div data-reveal><dt><span>◇</span> {t.info.size}</dt><dd><Measure>{organ.size}</Measure></dd></div>
            <div data-reveal><dt><span>♙</span> {t.info.weight}</dt><dd><Measure>{organ.weight}</Measure></dd></div>
            <div data-reveal><dt><span>⌁</span> {t.info.daily}</dt><dd><Measure>{organ.dailyFact}</Measure></dd></div>
            <div data-reveal><dt><span>⌖</span> {t.info.location}</dt><dd><Measure>{organ.location}</Measure></dd></div>
            <div data-reveal><dt><span>❋</span> {t.info.bloodSupply}</dt><dd><Measure>{organ.bloodSupply}</Measure></dd></div>
            <div data-reveal><dt><span>◈</span> {t.info.function}</dt><dd><Measure>{organ.function}</Measure></dd></div>
          </dl>
          {/* Clinical framing has nothing to offer a five-year-old, so kids mode
              drops the note rather than trying to simplify it. */}
          <div className="medical-note" data-reveal><Stethoscope size={16} /><p><b>{t.info.medical}</b>{organ.medical}</p></div>
          <div className="fun-note" data-reveal><Sparkles size={15} /><p><b>{t.info.didYouKnow}</b>{organ.funFact}</p></div>
          {kidsCopy && moreFacts.length > 0 && (
            <MoreFacts key={organId} facts={moreFacts} copy={kidsCopy} speechLang={speechLang} />
          )}
          {/* Long-form reading is for the grown-up view. In kids mode it is not
              hidden behind a control — it is simply not there. */}
          {/* The whole-body stage draws from every organ; a single organ on the
              stage asks only about itself. */}
          {kidsQuiz && kidsOn && kidsCopy && (
            <KidsQuiz
              key={organId}
              pool={getKidsQuiz(locale.code, organId, childName)}
            childName={childName}
              speechLang={speechLang}
              copy={{
                title: kidsCopy.kidsQuizTitle,
                again: kidsCopy.kidsQuizAgain,
                listen: kidsCopy.listen,
                wrong: kidsCopy.kidsQuizWrong,
              }}
              onClose={() => setKidsQuiz(false)}
            />
          )}
          {knowledgeQuiz && !kidsOn && (
            <KnowledgeQuiz
              key={`${organId}-${stage}`}
              pool={stage === "body" ? getAllQuiz(locale.code) : getOrganQuiz(locale.code, organId)}
              size={stage === "body" ? BODY_QUIZ_SIZE : KNOWLEDGE_QUIZ_SIZE}
              speechLang={speechLang}
              onOpenPassage={setRevealCategory}
              onClose={() => setKnowledgeQuiz(false)}
            />
          )}
          {organ.stories && <Stories entries={organ.stories} speechLang={speechLang} easy={mode === "easy"} />}
          {organ.deepDive && (
            <DeepDive
              entries={organ.deepDive}
              speechLang={speechLang}
              easy={mode === "easy"}
              // Questions drawn from the long reads have no deep-dive entry to
              // open, and the quiz already hides the button for them.
              reveal={revealCategory === "stories" ? null : revealCategory}
            />
          )}
          {/* The row of buttons that used to sit here — 조직 살펴보기, 과정
              보기, 찾기 놀이, the two quizzes and 비교 — is gone. Every one of
              them had a card below saying the same thing, and the two sets
              overlapped on screen. The cards won: they can show what they
              lead to, which a row of six identical pills cannot. */}
          </>
          )}
        </aside>
      </div>

      {compare && (
        <section className="compare-strip" aria-label={t.compare.title}>
          <div className="compare-organ"><OrganArt organ={organ} kind="thumb" alt="" /><span>{t.compare.comparing}</span><strong>{organ.name}</strong><small>{organ.system}</small></div>
          <b>{t.compare.vs}</b>
          <div className="compare-organ"><OrganArt organ={reference} kind="thumb" alt="" /><span>{t.compare.reference}</span><strong>{reference.name}</strong><small>{reference.system}</small></div>
          <dl><div><dt>{t.compare.primaryRole}</dt><dd><Measure>{organ.function}</Measure></dd></div><div><dt>{t.compare.scale}</dt><dd><Measure>{organ.size}</Measure></dd></div></dl>
          <button onClick={() => setCompare(false)} aria-label={t.compare.close}><X size={16} /></button>
        </section>
      )}

      <section className="learning-cards" aria-label={format(t.cards.resources, { organ: organ.name })}>
        <article className="curiosity-card">
          <span>✿</span><p>{t.library.quoteLine1}<br />{t.library.quoteLine2}</p><em>{t.library.quoteSign}</em>
        </article>
        <article>
          <header><div><em>{t.cards.microscopic}</em><h3>{organ.tissue}</h3></div><Microscope size={17} /></header>
          <div className="microscope-visual organ-card-image"><OrganArt organ={organ} kind="microscopic" alt="" /></div>
          <button onClick={() => setModal("lesson")}>{t.cards.exploreTissue} <ArrowRight size={14} /></button>
        </article>
        <article>
          <header><div><em>{t.cards.functionAnimation}</em><h3>{organ.function}</h3></div><Play size={17} /></header>
          {/* The artwork itself is the control, so the play badge inside it is
              decorative rather than a nested button. */}
          <button
            type="button"
            className="function-visual organ-card-image"
            onClick={() => (walkable ? setWalking(true) : setModal("animation"))}
            aria-label={format(t.cards.playAria, { organ: organ.name })}
          >
            <OrganArt organ={organ} kind="organ" alt="" />
            <i className="function-pulse" />
            <span className="play-badge"><Play size={18} fill="currentColor" /></span>
          </button>
          <button onClick={() => (walkable ? setWalking(true) : setModal("animation"))}>{t.cards.playAnimation} <ArrowRight size={14} /></button>
        </article>
        {/* Two ways of being asked, on one card because both are guessing:
            find the part on the model, or answer questions about it. There is
            no artwork — the count and the shape of the questions is what a
            reader wants to know before starting, and a picture of the organ
            would say nothing the card above it has not already said.
            Korean-only, like the question banks themselves. */}
        {quizCard && (
          <article className="quiz-card">
            <header><div><em>{quizCard.label}</em><h3>{quizCard.format}</h3></div><CircleHelp size={17} /></header>
            <p className="quiz-card-note">{quizCard.note}</p>
            <div className="quiz-card-actions">
              <button onClick={() => { setQuizActive(true); setModal(null); setKnowledgeQuiz(false); setKidsQuiz(false); }}>
                <Crosshair size={14} /> {t.info.quiz}
              </button>
              <button
                className="primary"
                onClick={() => {
                  setQuizActive(false);
                  if (kidsOn) setKidsQuiz(true);
                  else { setKnowledgeQuiz(true); setRevealCategory(null); }
                }}
              >
                {quizCard.start} <ArrowRight size={14} />
              </button>
            </div>
          </article>
        )}
        {/* A list of the eight ways an organ can fail is the last thing a child
            should meet — and disease is outside the school syllabus too, so
            only the grown-up view carries this card. */}
        <article>
          <header><div><em>{t.cards.clinicalNotes}</em><h3>{t.cards.commonConditions}</h3></div><FileText size={17} /></header>
          <ul className="condition-names">
            {organ.conditions.map((condition) => {
              const entry = conditionDetails.find((item) => item.name === condition);
              // Only the ones with an article behind them are clickable, so
              // the affordance never promises a page that isn't there.
              return entry ? (
                <li key={condition}>
                  <button type="button" onClick={() => setConditionView(condition)}>
                    {condition}
                    {/* The dot's label joins the button's own text, so a screen reader
                      already hears "관상동맥질환 응급" — naming the condition here
                      too would say it twice. */}
                  {entry.urgent && <em className="urgent-dot" aria-label={conditionCopy?.urgent} />}
                    <ArrowRight size={13} />
                  </button>
                </li>
              ) : (
                <li key={condition}>{condition}</li>
              );
            })}
          </ul>
          <button onClick={() => (conditionDetails.length > 0 ? setConditionView("") : setModal("lesson"))}>
            {t.cards.seeAll} <ArrowRight size={14} />
          </button>
        </article>
        <article className="system-card">
          <header><div><em>{t.cards.whereItWorks}</em><h3>{kidsOn ? organ.name : organ.system}</h3></div><BrainCircuit size={17} /></header>
          <button
            type="button"
            className="system-visual organ-card-image"
            onClick={() => setModal("system")}
            aria-label={format(t.cards.systemAria, { organ: organ.name })}
          >
            <OrganArt organ={organ} kind="location" alt="" />
          </button>
          <button onClick={() => setModal("system")}>{t.cards.seeSystem} <ArrowRight size={14} /></button>
        </article>
      </section>

      {modal && (
        <LearningModal
          type={modal}
          organ={organ}
          t={t}
          kids={kidsOn}
          speechLang={speechLang}
          microscope={microscope}
          onOpenPassage={() => {
            setModal(null);
            setRevealCategory("microscope");
          }}
          onClose={() => setModal(null)}
        />
      )}
      {conditionView !== null && conditionCopy && conditionDetails.length > 0 && (
        <ConditionsModal
          organName={organ.name}
          names={organ.conditions}
          details={conditionDetails}
          copy={conditionCopy}
          easy={mode === "easy"}
          closeLabel={t.modal.close}
          initial={conditionView === "" ? null : conditionView}
          onClose={() => setConditionView(null)}
        />
      )}
      {kidsOn && kidsCopy && !childAsked && (
        <ChildNamePrompt
          copy={kidsCopy}
          onSubmit={(name) => writeChildName(name)}
          onSkip={() => writeChildName(null)}
        />
      )}
      {mobileLibrary && <button className="drawer-backdrop" aria-label={t.library.close} onClick={() => setMobileLibrary(false)} />}
    </main>
  );
}

const MODAL_ICON: Record<Exclude<Modal, null>, string> = {
  animation: "▶",
  system: "⌖",
  lesson: "✦",
};

function LearningModal({
  type,
  organ,
  t,
  kids,
  speechLang,
  microscope,
  onOpenPassage,
  onClose,
}: {
  type: Exclude<Modal, null>;
  organ: Organ;
  t: UiDictionary;
  kids: boolean;
  speechLang: string;
  /** The organ's microscope passage, where one has been written. */
  microscope: { title: string; body: string } | undefined;
  onOpenPassage: () => void;
  onClose: () => void;
}) {
  const vars = { organ: organ.name, location: organ.location };
  const title =
    type === "lesson" && microscope && t.tissue ? t.tissue.heading
    : type === "animation" ? format(t.modal.motionTitle, vars)
    // Avoids gluing onto `system`, whose wording varies per organ, and stays
    // grammatical for the plural organs too.
    : type === "system" ? format(t.modal.bodyTitle, vars)
    : format(t.modal.insideTitle, vars);

  // Reads the panel out as it opens. Kids mode only ever opens a modal from a
  // tap, so the browser's gesture requirement for speech is already satisfied.
  useEffect(() => {
    if (!kids) return;
    const body = type === "system" ? format(t.modal.systemIntro, vars) : t.modal.lessonBody;
    speak(`${title}. ${body}`, speechLang);
    // Reading once per opening is the intent; `vars` is rebuilt every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kids, type, title, speechLang]);

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className={`learning-modal ${type === "system" ? "wide" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} aria-label={t.modal.close}><X size={18} /></button>
        <span className="modal-icon">{MODAL_ICON[type]}</span>
        <em>{t.modal.guided}</em>
        <h2 id="modal-title">{title}</h2>
        {type === "system" ? (
          <>
            <p>{format(t.modal.systemIntro, vars)}</p>
            {/* Shown whole rather than cropped into the circular demo — the
                point of this view is the figure and its vessels. */}
            <figure className="modal-figure">
              <OrganArt organ={organ} kind="location" alt="" />
            </figure>
            <dl className="modal-facts">
              {/* "심혈관계" and "좌·우 심장동맥" are names, not explanations —
                  a child gets nothing from either, so only the role remains. */}
              {!kids && <div><dt>{t.modal.system}</dt><dd>{organ.system}</dd></div>}
              <div><dt>{t.modal.primaryRole}</dt><dd><Measure>{organ.function}</Measure></dd></div>
              {!kids && <div><dt>{t.modal.bloodSupply}</dt><dd><Measure>{organ.bloodSupply}</Measure></dd></div>}
            </dl>
            <button className="lesson-button" onClick={onClose}>{t.modal.continueExploring} <ArrowRight size={16} /></button>
          </>
        ) : type === "lesson" && microscope && t.tissue ? (
          <>
            <div className="modal-demo"><OrganArt organ={organ} kind="microscopic" alt="" /></div>
            <p className="tissue-name">{organ.tissue}</p>
            <div className="tissue-passage">
              <h3>{microscope.title}</h3>
              <p>{microscope.body}</p>
            </div>
            <button className="lesson-button" onClick={onOpenPassage}>{t.tissue.passage} <ArrowRight size={16} /></button>
          </>
        ) : (
          <>
            {/* Kids mode, and locales with no deepDive content, keep the
                original invitation to poke at the model. */}
            <p>{t.modal.lessonBody}</p>
            <div className={`modal-demo ${type === "animation" ? "moving" : ""}`}><OrganArt organ={organ} kind="organ" alt="" /></div>
            <button className="lesson-button" onClick={onClose}>{t.modal.continueExploring} <ArrowRight size={16} /></button>
          </>
        )}
      </section>
    </div>
  );
}
