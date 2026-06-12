import React from "react";
import { HashRouter, Routes, Route, Navigate, useParams, useNavigate, Link } from "react-router-dom";
import CountrySpread from "./components/CountrySpread";
import { Cover, Passport, ContinentDivider, PlanetOverview, HowToRead, TableOfContents, Superlatives, Glossary, PassportComplete, BookIndex, PlaceholderSpread } from "./components/BookPages";
import { QuizStop, AnswerKey } from "./components/Quiz";
import { WorldMapTOC } from "./components/WorldMap";
import { QUIZZES } from "../book.config";
import { COUNTRIES, getCountry, getCountryLang, ISO_LIST } from "./data";
import { STOP_OF, TOTAL_STOPS, PERSON, LAYOUT_OF, SPINE, type Page } from "../book.config";
import { useVisited, toggleVisited, markVisited, resetProgress, visitedCountryCount } from "./progress";
import { useProfile, setProfile, hasOnboarded, COUNTRY_OPTIONS, type Profile } from "./profile";
import { LangContext } from "./LangContext";
import { getLang, setLang, type Lang } from "./lang";
import { LOCALES } from "./locale";

const SPREAD_W = 1588;
const SPREAD_H = 1123;

/* Fit-to-viewport host (screen reading). */
function Fit({ children }: { children: React.ReactNode }) {
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const fit = () => {
      const pad = 56;
      const s = Math.min((window.innerWidth - pad) / SPREAD_W, (window.innerHeight - pad) / SPREAD_H);
      if (ref.current) ref.current.style.transform = `scale(${Math.min(s, 1.2)})`;
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);
  return (
    <div style={{ position: "fixed", inset: 0, display: "grid", placeItems: "center", overflow: "auto", padding: 28 }}>
      <div ref={ref} style={{ transformOrigin: "center center", boxShadow: "0 30px 80px rgba(0,0,0,.5)" }}>{children}</div>
    </div>
  );
}

function SpreadView({ raw }: { raw?: boolean }) {
  const { iso = "jp" } = useParams();
  const prof = useProfile();
  const base = getCountry(iso);
  if (!base) return <div style={{ color: "#fff", padding: 40, fontFamily: "monospace" }}>No country: {iso}</div>;
  // layout is config-driven (rotated), overriding whatever the record carries
  const c = { ...base, layout: LAYOUT_OF[iso] ?? base.layout };
  const spread = <CountrySpread country={c} ctx={{ stop: STOP_OF[iso] ?? c.stop ?? 1, total: TOTAL_STOPS, explorerName: raw ? PERSON.name : prof.name }} />;
  if (raw) {
    /* natural-size, top-left, white bg — used by the overflow checker + PDF print */
    return <div id="spread" style={{ width: SPREAD_W, height: SPREAD_H, background: "#fff" }}>{spread}</div>;
  }
  return <Fit>{spread}</Fit>;
}

/* wraps a spread with a page-number footer (centered, in the fold) — shown in reader + PDF */
function SpineFrame({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div style={{ position: "relative", width: SPREAD_W2, height: SPREAD_H2 }}>
      {children}
      {n > 1 && (
        <div style={{ position: "absolute", bottom: 14, left: "50%", transform: "translateX(-50%)", fontFamily: "'Spline Sans Mono', monospace", fontSize: 13, letterSpacing: ".12em", color: "#2c2620", background: "rgba(240,230,209,.9)", padding: "2px 13px", borderRadius: 999, boxShadow: "0 1px 4px rgba(0,0,0,.12)", pointerEvents: "none", zIndex: 6 }}>
          {n}
        </div>
      )}
    </div>
  );
}

/* render any SPINE page by its type — country spreads + connective-tissue pages */
function renderSpinePage(p: Page, print = false, explorerName: string = PERSON.name, lang = "en"): React.ReactNode {
  switch (p.type) {
    case "cover": return <Cover />;
    case "passport": return <Passport print={print} />;
    case "continent-divider": return <ContinentDivider continent={p.continent!} />;
    case "country": {
      const base = getCountryLang(p.iso!, lang);
      if (!base) return <PlaceholderSpread title={`Missing: ${p.iso}`} note="No data file for this country." />;
      const c = { ...base, layout: LAYOUT_OF[p.iso!] ?? base.layout };
      return <CountrySpread country={c} ctx={{ stop: STOP_OF[p.iso!] ?? 1, total: TOTAL_STOPS, explorerName }} />;
    }
    case "how-to-read": return <HowToRead />;
    case "toc": return <TableOfContents print={print} />;
    case "world-map-toc": return <WorldMapTOC print={print} />;
    case "planet-overview": return <PlanetOverview />;
    case "quiz": {
      const meta = QUIZZES.find((q) => q.id === p.quizId);
      return meta ? <QuizStop meta={meta} print={print} /> : <PlaceholderSpread title="Quiz Stop" note="Quiz not found." />;
    }
    case "answer-key": return <AnswerKey />;
    case "superlatives": return <Superlatives />;
    case "glossary": return <Glossary />;
    case "passport-complete": return <PassportComplete print={print} />;
    case "index": return <BookIndex />;
    default: return <PlaceholderSpread title={p.type} note="Page coming soon." />;
  }
}

/* natural-size print host for one spine page — used by the PDF builder (no nav, white bg) */
function PrintPage() {
  const { n = "1" } = useParams();
  const idx = Math.max(0, Math.min(SPINE.length - 1, parseInt(n, 10) - 1));
  return <div id="print-root" style={{ width: SPREAD_W2, height: SPREAD_H2, background: "#fff" }}><SpineFrame n={idx + 1}>{renderSpinePage(SPINE[idx], true, PERSON.name, "en")}</SpineFrame></div>;
}

function spineLabel(p: Page): string {
  if (p.type === "country") return COUNTRIES[p.iso!]?.name ?? p.iso!;
  if (p.type === "continent-divider") return `${p.continent} — divider`;
  if (p.type === "quiz") return `Quiz · ${p.continent}`;
  if (p.type === "toc") return "Contents";
  if (p.type === "world-map-toc") return "World Map";
  return p.type.replace(/-/g, " ");
}

const SPREAD_W2 = 1588, SPREAD_H2 = 1123, BAR_H = 60;
const MAP_PAGE = SPINE.findIndex((p) => p.type === "world-map-toc") + 1; // footer "Map" jump (shifts if front matter changes)

function BookReader() {
  const { n = "1" } = useParams();
  const nav = useNavigate();
  const idx = Math.max(0, Math.min(SPINE.length - 1, parseInt(n, 10) - 1));
  const page = SPINE[idx];
  const dir = React.useRef<1 | -1>(1);

  // language toggle (EN / VI)
  const { lang } = React.useContext(LangContext);

  // viewport tracking → responsive scale; narrow screens read one page at a time
  const [vp, setVp] = React.useState(() => ({ w: window.innerWidth, h: window.innerHeight }));
  React.useEffect(() => {
    const onR = () => setVp({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", onR);
    window.addEventListener("orientationchange", onR);
    return () => { window.removeEventListener("resize", onR); window.removeEventListener("orientationchange", onR); };
  }, []);
  const mobile = vp.w < 900;
  const [half, setHalf] = React.useState(0); // 0 = left page, 1 = right page (mobile single-page view)
  React.useEffect(() => { if (!mobile && half !== 0) setHalf(0); }, [mobile, half]);

  const atStart = idx <= 0 && (!mobile || half === 0);
  const atEnd = idx >= SPINE.length - 1 && (!mobile || half === 1);

  const go = React.useCallback((d: number) => {
    dir.current = d > 0 ? 1 : -1;
    if (mobile) {
      if (d > 0) {
        if (half === 0) { setHalf(1); return; }            // left → right page of same spread
        if (idx >= SPINE.length - 1) return;
        setHalf(0); nav(`/book/${idx + 2}`); return;       // right → next spread, left page
      } else {
        if (half === 1) { setHalf(0); return; }            // right → left page of same spread
        if (idx <= 0) return;
        setHalf(1); nav(`/book/${idx}`); return;           // left → previous spread, right page
      }
    }
    if ((d > 0 && idx >= SPINE.length - 1) || (d < 0 && idx <= 0)) return;
    nav(`/book/${idx + d + 1}`);
  }, [idx, nav, mobile, half]);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === "INPUT") return; // don't hijack keys while typing a page #
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); go(1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  // responsive scale: fit the whole spread (desktop) or a single page (mobile) into the viewport,
  // then size the wrapper to the SCALED dimensions so it always centers (transform alone doesn't
  // shrink the layout box, which is what pushed the spread off-centre / off-screen before).
  const PAGE_W = 794, FOLD = 2;
  const fitW = mobile ? PAGE_W : SPREAD_W2;
  const pad = mobile ? 0 : 24;
  const scale = Math.min((vp.w - pad) / fitW, (vp.h - BAR_H - pad) / SPREAD_H2, 1);
  const wrapW = fitW * scale, wrapH = SPREAD_H2 * scale;
  const innerTransform = mobile ? `scale(${scale}) translateX(${-half * (PAGE_W + FOLD)}px)` : `scale(${scale})`;

  // progress tracking — stay on a page 120s and it auto-marks as visited
  const visited = useVisited();
  const isVisited = visited.has(idx + 1);
  React.useEffect(() => {
    const t = setTimeout(() => markVisited(idx + 1), 120_000);
    return () => clearTimeout(t);
  }, [idx]);
  const [confirmReset, setConfirmReset] = React.useState(false);

  // identity / onboarding — any child can make the book their own (shows once on first open)
  const prof = useProfile();
  const [showOnboard, setShowOnboard] = React.useState(() => !hasOnboarded());

  // bottom bar hidden by default; any activity reveals it, then it auto-hides
  const [barShown, setBarShown] = React.useState(false);
  const [jump, setJump] = React.useState("");
  const goJump = () => {
    const t = parseInt(jump, 10);
    if (t >= 1 && t <= SPINE.length) { dir.current = t - 1 > idx ? 1 : -1; setHalf(0); nav(`/book/${t}`); }
    setJump("");
  };
  const hideTimer = React.useRef<ReturnType<typeof setTimeout>>();
  const reveal = React.useCallback(() => {
    setBarShown(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setBarShown(false), 2600);
  }, []);

  // swipe left/right (iPad / phone)
  const touch = React.useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = (e: React.TouchEvent) => { reveal(); const t = e.touches[0]; touch.current = { x: t.clientX, y: t.clientY }; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touch.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touch.current.x, dy = t.clientY - touch.current.y;
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.4) go(dx < 0 ? 1 : -1);
    touch.current = null;
  };

  // click zones are disabled on the interactive map/quiz pages so taps reach their controls
  const interactive = page.type === "world-map-toc" || page.type === "quiz";

  return (
    <div onMouseMove={reveal} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}
      style={{ position: "fixed", inset: 0, background: "#1c1915", overflow: "hidden", touchAction: "pan-y" }}>
      <style>{FLIP_KEYFRAMES}</style>
      <div style={{ position: "absolute", inset: 0, paddingBottom: BAR_H, display: "grid", placeItems: "center" }}>
        <div style={{ width: wrapW, height: wrapH, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, width: SPREAD_W2, height: SPREAD_H2, transform: innerTransform, transformOrigin: "top left" }}>
            <div key={`${idx}-${half}`} style={{ boxShadow: "0 30px 80px rgba(0,0,0,.55)", animation: `${dir.current > 0 ? "flipNext" : "flipPrev"} .42s cubic-bezier(.22,.61,.36,1)` }}>
              <SpineFrame n={idx + 1}>{renderSpinePage(page, false, prof.name, lang)}</SpineFrame>
            </div>
          </div>
        </div>
      </div>

      {/* click left / right to flip (content pages only) */}
      {!interactive && <>
        {!atStart && <ClickZone side="left" onClick={() => go(-1)} />}
        {!atEnd && <ClickZone side="right" onClick={() => go(1)} />}
      </>}

      {/* auto-hiding bottom bar (compact on mobile so nothing clips) */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: BAR_H, background: "rgba(21,18,15,.95)", borderTop: "1px solid #332c22", display: "flex", alignItems: "center", justifyContent: "space-between", gap: mobile ? 8 : 0, padding: mobile ? "0 12px" : "0 22px", color: "#E7D9BC", fontFamily: "'Spline Sans Mono', monospace", fontSize: mobile ? 12 : 13, transform: barShown ? "translateY(0)" : "translateY(100%)", transition: "transform .25s ease", zIndex: 20 }}>
        {mobile ? (
          <>
            <button onClick={() => go(-1)} disabled={atStart} style={navBtn(atStart)}>←</button>
            <button onClick={() => { reveal(); toggleVisited(idx + 1); }} title="Mark this page visited / not visited" style={chipBtn(isVisited)}>{isVisited ? "✓" : "○"}</button>
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 12, minWidth: 0, whiteSpace: "nowrap" }}>
              <span style={{ fontWeight: 700 }}>{idx + 1}<span style={{ opacity: .5 }}> / {SPINE.length}</span></span>
              <span title="Countries visited" style={{ color: "#7FB069" }}>🌍 {visitedCountryCount(visited)}</span>
            </div>
            <button onClick={() => { reveal(); setShowOnboard(true); }} title="Make this book yours — set name, age, home country" style={chipBtn(false)}>✎</button>
            <button onClick={() => go(1)} disabled={atEnd} style={navBtn(atEnd)}>→</button>
          </>
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button onClick={() => go(-1)} disabled={atStart} style={navBtn(atStart)}>← Prev</button>
              <button onClick={() => { reveal(); toggleVisited(idx + 1); }} title="Mark this page visited / not visited"
                style={chipBtn(isVisited)}>{isVisited ? "✓ Visited" : "Mark visited"}</button>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 13 }}>
              <Link to={`/book/${MAP_PAGE}`} style={{ color: "#B23A2E", textDecoration: "none" }}>Map</Link>
              <span style={{ opacity: .6 }}>·</span>
              <span style={{ fontWeight: 700 }}>{spineLabel(page)}</span>
              <span style={{ display: "flex", alignItems: "center", gap: 6, opacity: .85 }}>
                <span style={{ opacity: .6 }}>page</span>
                <input
                  value={jump}
                  onChange={(e) => { reveal(); setJump(e.target.value.replace(/[^0-9]/g, "")); }}
                  onFocus={reveal}
                  onKeyDown={(e) => { reveal(); if (e.key === "Enter") goJump(); }}
                  placeholder={String(idx + 1)}
                  aria-label="Go to page"
                  style={{ width: 52, textAlign: "center", background: "#0f0d0a", color: "#E7D9BC", border: "1px solid #4a3f30", borderRadius: 5, padding: "4px 6px", fontFamily: "inherit", fontSize: 13, outline: "none" }}
                />
                <span style={{ opacity: .5 }}>/ {SPINE.length}</span>
              </span>
              <span style={{ opacity: .6 }}>·</span>
              <span title="Countries visited" style={{ color: "#7FB069" }}>🌍 {visitedCountryCount(visited)}/{TOTAL_STOPS}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button onClick={() => { reveal(); setShowOnboard(true); }} title="Make this book yours — set name, age, home country"
                style={chipBtn(false)}>✎ {prof.name}</button>
              <button onClick={() => { reveal(); setConfirmReset(true); }} title="Reset all progress"
                style={chipBtn(false)}>Reset</button>
              {!IS_FR_BUILD && (
                <div style={{ display: "flex", gap: 2, border: "1px solid #4a3f30", borderRadius: 7, overflow: "hidden" }}>
                  {(["en", "vi"] as Lang[]).map((l) => (
                    <button key={l} onClick={() => { reveal(); setLang(l); }} title={l === "en" ? "English" : "Tiếng Việt"}
                      style={{ background: lang === l ? "#B23A2E" : "transparent", color: lang === l ? "#fff" : "#E7D9BC", border: "none", padding: "7px 10px", fontFamily: "'Spline Sans Mono', monospace", fontSize: 12, cursor: "pointer", letterSpacing: ".08em" }}>
                      {l.toUpperCase()}
                    </button>
                  ))}
                </div>
              )}
              <button onClick={() => go(1)} disabled={atEnd} style={navBtn(atEnd)}>Next →</button>
            </div>
          </>
        )}
      </div>

      {/* reset confirmation */}
      {confirmReset && (
        <div onClick={() => setConfirmReset(false)}
          style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.6)", display: "grid", placeItems: "center", zIndex: 40 }}>
          <div onClick={(e) => e.stopPropagation()}
            style={{ background: "#26221d", color: "#F0E6D1", border: "1px solid #4a3f30", borderRadius: 14, padding: "26px 30px", width: "min(380px, 92vw)", fontFamily: "'Spline Sans Mono', monospace", boxShadow: "0 24px 60px rgba(0,0,0,.6)" }}>
            <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 22, marginBottom: 8 }}>Reset all progress?</div>
            <p style={{ fontSize: 13.5, lineHeight: 1.5, opacity: .85, margin: "0 0 22px" }}>
              This clears every visited page and all collected stamps for {prof.name}. This can't be undone.
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
              <button onClick={() => setConfirmReset(false)} style={chipBtn(false)}>Cancel</button>
              <button onClick={() => { resetProgress(); setConfirmReset(false); }}
                style={{ ...navBtn(false), background: "#B23A2E" }}>Reset everything</button>
            </div>
          </div>
        </div>
      )}

      {showOnboard && <OnboardingModal onClose={() => setShowOnboard(false)} />}
    </div>
  );
}

/* "Make this book yours" — name / age / nationality / home country.
   First-run shows it once; the footer ✎ button reopens it. Saving personalizes the cover,
   passport, Explorer's Log narrative, and the rank ladder for whichever child is reading. */
function OnboardingModal({ onClose }: { onClose: () => void }) {
  const prof = useProfile();
  const [name, setName] = React.useState(prof.name);
  const [age, setAge] = React.useState(String(prof.age));
  const [nationality, setNationality] = React.useState(prof.nationality);
  const [homeIso, setHomeIso] = React.useState(prof.homeIso);
  const home = COUNTRY_OPTIONS.find((c) => c.iso === homeIso);
  const valid = name.trim().length > 0 && !!home;
  const save = () => {
    if (!valid || !home) return;
    const next: Profile = {
      name: name.trim().slice(0, 14),
      age: Math.max(1, Math.min(120, parseInt(age, 10) || prof.age)),
      nationality: nationality.trim() || "Explorer",
      homeCountry: home.name,
      homeIso: home.iso,
    };
    setProfile(next);
    onClose();
  };
  const label: React.CSSProperties = { fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", opacity: .7, marginBottom: 5, display: "block" };
  const field: React.CSSProperties = { width: "100%", background: "#0f0d0a", color: "#F0E6D1", border: "1px solid #4a3f30", borderRadius: 7, padding: "9px 11px", fontFamily: "'Spline Sans Mono', monospace", fontSize: 14, outline: "none", boxSizing: "border-box" };
  return (
    <div onClick={onClose}
      style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.6)", display: "grid", placeItems: "center", zIndex: 50 }}>
      <div onClick={(e) => e.stopPropagation()}
        style={{ background: "#26221d", color: "#F0E6D1", border: "1px solid #4a3f30", borderRadius: 16, padding: "28px 32px", width: "min(440px, 92vw)", maxHeight: "88vh", overflowY: "auto", fontFamily: "'Spline Sans Mono', monospace", boxShadow: "0 28px 70px rgba(0,0,0,.65)" }}>
        <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 26, lineHeight: 1.05 }}>Make this book yours</div>
        <p style={{ fontSize: 13, lineHeight: 1.5, opacity: .8, margin: "8px 0 22px" }}>
          Tell us who's exploring. Your name appears on the cover and passport, and your journey starts at home.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr .8fr", gap: 16 }}>
          <div>
            <label style={label}>Your name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} maxLength={14} placeholder="e.g. Momo" style={field} autoFocus />
          </div>
          <div>
            <label style={label}>Age</label>
            <input value={age} onChange={(e) => setAge(e.target.value.replace(/[^0-9]/g, ""))} inputMode="numeric" maxLength={3} placeholder="7" style={field} />
          </div>
        </div>
        <div style={{ marginTop: 16 }}>
          <label style={label}>Nationality</label>
          <input value={nationality} onChange={(e) => setNationality(e.target.value)} maxLength={24} placeholder="e.g. Vietnamese" style={field} />
        </div>
        <div style={{ marginTop: 16 }}>
          <label style={label}>Home country — your journey starts here</label>
          <select value={homeIso} onChange={(e) => setHomeIso(e.target.value)} style={{ ...field, appearance: "auto" }}>
            {COUNTRY_OPTIONS.map((c) => <option key={c.iso} value={c.iso}>{c.name}</option>)}
          </select>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 26 }}>
          <button onClick={onClose} style={chipBtn(false)}>Cancel</button>
          <button onClick={save} disabled={!valid} style={{ ...navBtn(!valid) }}>Start exploring →</button>
        </div>
      </div>
    </div>
  );
}

function chipBtn(active: boolean): React.CSSProperties {
  return { background: active ? "#2f5233" : "transparent", color: active ? "#cfe8c4" : "#E7D9BC", border: `1px solid ${active ? "#3f6e45" : "#4a3f30"}`, borderRadius: 7, padding: "7px 13px", fontFamily: "'Spline Sans Mono', monospace", fontSize: 12, cursor: "pointer" };
}

const FLIP_KEYFRAMES = `
@keyframes flipNext { from { opacity: .25; transform: translateX(46px) } to { opacity: 1; transform: none } }
@keyframes flipPrev { from { opacity: .25; transform: translateX(-46px) } to { opacity: 1; transform: none } }`;

/* transparent edge tap-target with a chevron that fades in on hover */
function ClickZone({ side, onClick }: { side: "left" | "right"; onClick: () => void }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ position: "absolute", top: 0, bottom: 60, [side]: 0, width: "30%", cursor: "pointer", zIndex: 10, display: "grid", placeItems: "center" }}>
      <div style={{ fontFamily: "system-ui", fontSize: 44, color: "#E7D9BC", opacity: hover ? 0.5 : 0, transition: "opacity .2s", userSelect: "none" }}>
        {side === "left" ? "‹" : "›"}
      </div>
    </div>
  );
}

function navBtn(disabled: boolean): React.CSSProperties {
  return { background: disabled ? "#241f19" : "#B23A2E", color: disabled ? "#5a5043" : "#fff", border: "none", borderRadius: 7, padding: "9px 18px", fontFamily: "'Spline Sans Mono', monospace", fontSize: 13, cursor: disabled ? "default" : "pointer" };
}

function Index() {
  return (
    <div style={{ minHeight: "100vh", background: "#26221d", color: "#F0E6D1", fontFamily: "system-ui", padding: 40 }}>
      <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>World Country Book — dev index</h1>
      <p>{ISO_LIST.length} country spread(s) loaded · {SPINE.length}-page book.</p>
      <p><Link to="/book/1" style={{ color: "#fff", background: "#B23A2E", padding: "10px 20px", borderRadius: 8, textDecoration: "none", fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700 }}>📖 Read the book →</Link></p>
      <ul>
        {ISO_LIST.map((iso) => (
          <li key={iso}><Link to={`/spread/${iso}`} style={{ color: "#B23A2E" }}>{COUNTRIES[iso].name}</Link> · <Link to={`/raw/${iso}`} style={{ color: "#8a7c63" }}>raw</Link></li>
        ))}
      </ul>
    </div>
  );
}

const IS_FR_BUILD = import.meta.env.VITE_LANG === "fr";
const IS_YOUNG_BUILD = import.meta.env.VITE_YOUNG === "1";

export default function App() {
  const [lang, setLangState] = React.useState<Lang>(IS_FR_BUILD ? "fr" : getLang);
  React.useEffect(() => {
    if (IS_FR_BUILD) return;
    const handler = () => setLangState(getLang());
    window.addEventListener("cb-lang-change", handler);
    return () => window.removeEventListener("cb-lang-change", handler);
  }, []);
  const locale = LOCALES[lang] ?? LOCALES.en;

  return (
    <LangContext.Provider value={{ lang, locale, young: IS_YOUNG_BUILD }}>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/book/1" replace />} />
          <Route path="/dev" element={<Index />} />
          <Route path="/book" element={<BookReader />} />
          <Route path="/book/:n" element={<BookReader />} />
          <Route path="/print/:n" element={<PrintPage />} />
          <Route path="/spread/:iso" element={<SpreadView />} />
          <Route path="/raw/:iso" element={<SpreadView raw />} />
        </Routes>
      </HashRouter>
    </LangContext.Provider>
  );
}
