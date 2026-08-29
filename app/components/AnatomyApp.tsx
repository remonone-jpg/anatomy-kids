"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import gsap from "gsap";
import {
  ArrowRight,
  Baby,
  BookOpen,
  Bookmark,
  BrainCircuit,
  ChevronDown,
  CircleHelp,
  Compass,
  Crosshair,
  FileText,
  Globe,
  Heart,
  LibraryBig,
  Microscope,
  NotebookPen,
  Play,
  Search,
  Share2,
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
import { SystemView } from "./SystemView";
import { SystemQuiz } from "./SystemQuiz";
import type { OrganId } from "../lib/anatomy-data";
import type { LocaleConfig } from "../i18n/config";
import { locales } from "../i18n/config";
import { buildOrgans, indexOrgans, type Organ } from "../i18n/merge";
import { format, type Dictionary, type UiDictionary } from "../i18n/types";
import { applyKids, getBodySense, getKidsUi, getMoreFacts, kidsAvailable, KIDS_ORGAN_IDS } from "../i18n/kids";
import { getAllQuiz, getKidsQuiz, getOrganQuiz, kidsQuizAvailable, quizAvailable } from "../i18n/quiz";
import { conditionsAvailable, getConditions } from "../i18n/conditions";
import { getSystems, schoolAvailable } from "../i18n/school";
import { getAllSystemQuiz, getSystemQuiz, systemQuizAvailable } from "../i18n/quiz";
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
  labels: { kids: string; school: string; adult: string; aria: string };
  onChange: (next: Mode) => void;
}) {
  const options: Mode[] = ["kids", "school", "adult"];
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
          {option === "kids" && <Baby size={15} aria-hidden />}
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
  // `kidsOn` keeps exactly the meaning it had — kids mode, and the locale has
  // the copy for it. What changed is that its opposite is no longer "adult":
  // `adultOn` is. Everything only the grown-up view should carry hangs off
  // that instead, so school mode inherits the reading layout and none of the
  // clinical material.
  const kidsOn = mode === "kids" && kidsAvailable(locale.code);
  const schoolOn = mode === "school" && schoolAvailable(locale.code);
  const adultOn = !kidsOn && !schoolOn;

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
  // The map opens first for everyone: "where is it in me" is the question a
  // child asks, and a grown-up gets the same orientation for free.
  const [libraryView, setLibraryView] = useState<"body" | "list">("body");
  // Which stage the centre column shows. The panel falls back to the list while
  // the body is on the main stage: two copies of it would mean two WebGL
  // contexts holding the same twelve models.
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
  // Set by the viewer; lets a step turn the model without a re-render.
  const focusRef = useRef<(id: string | null) => void>(() => {});
  const [revealCategory, setRevealCategory] = useState<KnowledgeQuizItem["category"] | null>(null);
  const panelView = stage === "body" ? "list" : libraryView;
  const [quizActive, setQuizActive] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const prefetched = useRef(new Set<OrganId>());
  const organ = organById[organId];
  const reference = organById[organId === "heart" ? "brain" : "heart"];

  // Kids mode shows the five organs a child can point to on their own body.
  const listedOrgans = useMemo(
    () => (kidsOn ? KIDS_ORGAN_IDS.map((id) => organById[id]) : organs),
    [kidsOn, organs, organById],
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

  const bodySense = kidsOn ? getBodySense(locale.code, organId, childName) : null;
  // The tissue view and the walkthrough are built from deepDive entries, so
  // they exist exactly where that content does — adult mode, Korean.
  const microscope = !kidsOn ? organ.deepDive?.find((entry) => entry.category === "microscope") : undefined;
  const mechanism = !kidsOn ? organ.deepDive?.find((entry) => entry.category === "mechanism") : undefined;
  const walkable = Boolean(mechanism && t.walk);

  // Adult mode only, and only where the encyclopedia has been written.
  const conditionCopy = t.conditions;
  const conditionDetails =
    adultOn && conditionCopy && conditionsAvailable(locale.code) ? getConditions(locale.code, organId) : [];
  const moreFacts = kidsOn ? getMoreFacts(locale.code, organId, childName) : [];
  // Only school mode can have one open; the organ panel takes over when null.
  const activeSystem = schoolOn && systemId ? getSystems(locale.code).find((s) => s.id === systemId) : undefined;

  /** Everything a child would want read out for the organ on screen. */
  const readAloud = (target: Organ) => {
    const lines = [target.name, target.description, target.funFact, bodySense ?? ""];
    speak(lines.filter(Boolean).join(" "), speechLang);
  };

  const changeMode = (next: Mode) => {
    writeMode(next);
    setSystemId(null);
    setSystemQuiz(null);
    setRevealExam(null);
    stopSpeaking();
    setQuery("");
    setCompare(false);
    setQuizActive(false);
    // Each mode has its own quiz; leaving one open across the switch would
    // show a panel the other mode is not supposed to have.
    setKidsQuiz(false);
    setKnowledgeQuiz(false);
    // Kids mode has no clinical card at all, so it must not inherit its modal.
    setConditionView(null);
    setWalking(false);
    // The short list may not contain whatever adult organ was on screen, which
    // would leave the viewer showing something the library cannot select.
    if (next === "kids" && !KIDS_ORGAN_IDS.includes(organId)) setOrganId("heart");
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
        {!kidsOn && (
          <nav className="main-nav" aria-label={t.nav.aria}>
            {/* Chrome from the original design. None of these five are wired
                to anything, so they are marked disabled rather than left as
                buttons that silently do nothing when pressed. */}
            <button className="active" disabled><Compass size={17} /> {t.nav.explore}</button>
            <button disabled><BrainCircuit size={17} /> {t.nav.systems}</button>
            <button disabled><BookOpen size={17} /> {t.nav.lessons}</button>
            <button disabled><LibraryBig size={17} /> {t.nav.library}</button>
            <button disabled><NotebookPen size={17} /> {t.nav.notes}</button>
          </nav>
        )}
        {!kidsOn && (
          <label className="search-box">
            <Search size={17} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.search.placeholder} />
          </label>
        )}
        <LanguageSwitcher locale={locale} t={t} />
        {kidsCopy && (
          <ModeSwitch
            mode={mode}
            labels={{ kids: kidsCopy.modeKids, school: kidsCopy.modeSchool, adult: kidsCopy.modeAdult, aria: kidsCopy.modeLabel }}
            onChange={changeMode}
          />
        )}
        {kidsOn && kidsCopy && (
          <button type="button" className="child-name-change" onClick={clearChildName}>
            {kidsCopy.nameChange}
          </button>
        )}
        {!kidsOn && <button className="profile" aria-label={t.profile.open} disabled><span>MA</span><ChevronDown size={15} /></button>}
        <button className="mobile-library-trigger" onClick={() => setMobileLibrary(true)} aria-label={t.library.open}><LibraryBig size={20} /></button>
      </header>

      <div className="workspace">
        <aside className={`organ-library ${mobileLibrary ? "open" : ""}`}>
          <div className="panel-heading">
            <span>{panelView === "body" && kidsCopy ? kidsCopy.viewBody : t.library.title}</span>
            <button aria-label={t.library.close} className="mobile-close" onClick={() => setMobileLibrary(false)}><X size={17} /></button>
            {!kidsOn && <button aria-label={t.library.saved} disabled><Bookmark size={17} /></button>}
          </div>
          {kidsCopy && (
            <div className="library-tabs" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={panelView === "body"}
                className={panelView === "body" ? "active" : ""}
                onClick={() => { setLibraryView("body"); setStage("organ"); }}
              >
                <PersonStanding size={15} /> {kidsCopy.viewBody}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={panelView === "list"}
                className={panelView === "list" ? "active" : ""}
                onClick={() => setLibraryView("list")}
              >
                <LibraryBig size={15} /> {kidsCopy.listTab}
              </button>
            </div>
          )}
          {panelView === "body" && kidsCopy ? (
            <BodyScene organs={organById} activeId={organId} onSelect={selectOrgan} copy={kidsCopy} compact />
          ) : (
          <div className="organ-list">
            {filteredOrgans.map((item) => (
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
          )}
          {!kidsOn && panelView === "list" && <button className="view-all" onClick={() => setQuery("")}>{t.library.viewAll} <ArrowRight size={14} /></button>}
          <blockquote>
            <Sparkles size={18} />
            <p>{t.library.quoteLine1}<br />{t.library.quoteLine2}</p>
            <em>{t.library.quoteSign}</em>
          </blockquote>
        </aside>

        <div className="stage">
          {kidsCopy && (
            <div className="stage-tabs" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={stage === "organ"}
                className={stage === "organ" ? "active" : ""}
                onClick={() => setStage("organ")}
              >
                <Heart size={15} /> {kidsCopy.viewOrgan}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={stage === "body"}
                className={stage === "body" ? "active" : ""}
                onClick={() => setStage("body")}
              >
                <Scan size={15} /> {kidsCopy.viewBody}
              </button>
            </div>
          )}
          {stage === "body" && kidsCopy ? (
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
          {schoolOn && kidsCopy && (
            <div className="school-tabs" role="tablist" aria-label={kidsCopy.modeSchool}>
              <button
                type="button"
                role="tab"
                aria-selected={systemId !== null}
                className={systemId !== null ? "active" : ""}
                onClick={() => setSystemId(systemId ?? getSystems(locale.code)[0]?.id ?? null)}
              >
                {kidsCopy.schoolSystems}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={systemId === null}
                className={systemId === null ? "active" : ""}
                onClick={() => setSystemId(null)}
              >
                {kidsCopy.schoolOrgans}
              </button>
            </div>
          )}
          {schoolOn && kidsCopy && activeSystem && (
            <>
              <nav className="system-picker" aria-label={kidsCopy.schoolSystems}>
                {getSystems(locale.code).map((entry) => (
                  <button
                    key={entry.id}
                    type="button"
                    className={entry.id === activeSystem.id ? "on" : ""}
                    aria-pressed={entry.id === activeSystem.id}
                    onClick={() => setSystemId(entry.id)}
                  >
                    {entry.name}
                  </button>
                ))}
                {systemQuizAvailable(locale.code) && (
                  <button
                    type="button"
                    className="system-picker-quiz"
                    onClick={() => setSystemQuiz("mixed")}
                  >
                    {kidsCopy.systemQuiz.mixed}
                  </button>
                )}
              </nav>
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
          {kidsOn && kidsCopy && (
            <button className="listen-button" type="button" data-reveal onClick={() => readAloud(organ)}>
              <Volume2 size={19} /> {kidsCopy.listen}
            </button>
          )}
          {/* Turns the screen into something to do with their own body, which
              is how a child this age actually locates an organ. */}
          {kidsOn && kidsCopy && bodySense && (
            <div className="body-sense" data-reveal>
              <PersonStanding size={17} />
              <p><b>{kidsCopy.bodySenseTitle}</b>{bodySense}</p>
            </div>
          )}
          <div className="rule" />
          <h2 data-reveal>{t.info.keyFacts}</h2>
          <dl className="key-facts">
            <div data-reveal><dt><span>◇</span> {t.info.size}</dt><dd><Measure>{organ.size}</Measure></dd></div>
            {!kidsOn && <div data-reveal><dt><span>♙</span> {t.info.weight}</dt><dd><Measure>{organ.weight}</Measure></dd></div>}
            <div data-reveal><dt><span>⌁</span> {t.info.daily}</dt><dd><Measure>{organ.dailyFact}</Measure></dd></div>
            {!kidsOn && <div data-reveal><dt><span>⌖</span> {t.info.location}</dt><dd><Measure>{organ.location}</Measure></dd></div>}
            {!kidsOn && <div data-reveal><dt><span>❋</span> {t.info.bloodSupply}</dt><dd><Measure>{organ.bloodSupply}</Measure></dd></div>}
            <div data-reveal><dt><span>◈</span> {t.info.function}</dt><dd><Measure>{organ.function}</Measure></dd></div>
          </dl>
          {/* Clinical framing has nothing to offer a five-year-old, so kids mode
              drops the note rather than trying to simplify it. */}
          {adultOn && <div className="medical-note" data-reveal><Stethoscope size={16} /><p><b>{t.info.medical}</b>{organ.medical}</p></div>}
          <div className="fun-note" data-reveal><Sparkles size={15} /><p><b>{t.info.didYouKnow}</b>{organ.funFact}</p></div>
          {kidsOn && kidsCopy && moreFacts.length > 0 && (
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
          {knowledgeQuiz && adultOn && (
            <KnowledgeQuiz
              key={`${organId}-${stage}`}
              pool={stage === "body" ? getAllQuiz(locale.code) : getOrganQuiz(locale.code, organId)}
              size={stage === "body" ? 10 : 5}
              speechLang={speechLang}
              onOpenPassage={setRevealCategory}
              onClose={() => setKnowledgeQuiz(false)}
            />
          )}
          {adultOn && organ.stories && <Stories entries={organ.stories} speechLang={speechLang} />}
          {adultOn && organ.deepDive && (
            <DeepDive
              entries={organ.deepDive}
              speechLang={speechLang}
              // Questions drawn from the long reads have no deep-dive entry to
              // open, and the quiz already hides the button for them.
              reveal={revealCategory === "stories" ? null : revealCategory}
            />
          )}
          {!kidsOn && <button className="lesson-button" data-reveal onClick={() => setModal("lesson")}>{t.info.viewLesson} <ArrowRight size={16} /></button>}
          <div className="action-grid" data-reveal>
            <button onClick={() => (walkable ? setWalking(true) : setModal("animation"))}><Play size={15} /> {t.info.animate}</button>
            <button onClick={() => { setQuizActive(true); setModal(null); setKnowledgeQuiz(false); }}>
              <Crosshair size={15} /> {t.info.quiz}
            </button>
            {adultOn && quizAvailable(locale.code) && (
              <button onClick={() => { setKnowledgeQuiz(true); setQuizActive(false); setRevealCategory(null); }}>
                <CircleHelp size={15} /> 지식 퀴즈
              </button>
            )}
            {kidsOn && kidsCopy && kidsQuizAvailable(locale.code) && (
              <button onClick={() => { setKidsQuiz(true); setQuizActive(false); }}>
                <Sparkles size={15} /> {kidsCopy.kidsQuizButton}
              </button>
            )}
            {!kidsOn && <button onClick={() => setCompare(!compare)} className={compare ? "active" : ""}><Share2 size={15} /> {t.info.compare}</button>}
          </div>
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
        {!kidsOn && (
          <article>
            <header><div><em>{t.cards.microscopic}</em><h3>{organ.tissue}</h3></div><Microscope size={17} /></header>
            <div className="microscope-visual organ-card-image"><OrganArt organ={organ} kind="microscopic" alt="" /></div>
            <button onClick={() => setModal("lesson")}>{t.cards.exploreTissue} <ArrowRight size={14} /></button>
          </article>
        )}
        {!kidsOn && (
          <article>
            <header><div><em>{t.cards.compareOrgans}</em><h3>{organ.comparison}</h3></div><Share2 size={17} /></header>
            <div className="comparison-visual organ-card-image"><OrganArt organ={organ} kind="compare" alt="" /></div>
            <button onClick={() => setCompare(true)}>{t.cards.openComparison} <ArrowRight size={14} /></button>
          </article>
        )}
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
        {/* A list of the eight ways an organ can fail is the last thing a child
            should meet — and disease is outside the school syllabus too, so
            only the grown-up view carries this card. */}
        {adultOn && (
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
        )}
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
