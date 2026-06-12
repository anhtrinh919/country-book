/* BookPages — the connective-tissue page types that wrap the 201 country spreads
   into a real book: cover, personalized passport, continent dividers, and (lightweight)
   placeholders for the page types still to be authored. Every page renders at the same
   1588×1123 two-page-spread geometry as <CountrySpread> so the reader + PDF treat them
   uniformly. Field-journal tokens reused from tokens.ts; front/back matter use a warm
   neutral palette, dividers take a per-continent accent. */
import React from "react";
import { Link } from "react-router-dom";
import { AT, SPREAD_W, SPREAD_H } from "../tokens";
import { BY_CONTINENT, CONTINENT_ORDER, STOP_OF, TOTAL_STOPS, QUIZZES, JOURNEY, SPINE, type Continent } from "../../book.config";
import { useVisited, useVisits, visitedCountryCount, badgeDone, badgeTotal, badgesEarned, TOTAL_BADGES, visitedCountriesByRecency, CONTINENT_BADGES, THEME_BADGES, MILESTONE_BADGES, PAGE_OF_ISO, type Visits } from "../progress";
import { useProfile, rankFor, nextRank } from "../profile";
import { asset } from "../asset";
import { useLang } from "../LangContext";
import type { Lang } from "../lang";
import { getCountryLang } from "../data";
import { tContinent, tContinentShort, tRank, tThemeBadge, tMilestone, RECORDS_T, GLOSSARY_T, CONTINENT_META_T } from "../i18n";

const FONTS = { disp: AT.disp, serif: AT.serif, mono: AT.mono };

/* ── shared two-page spread frame (theme vars + fold) ── */
const PAGE_BASE: React.CSSProperties = {
  position: "relative", width: 794, height: SPREAD_H, color: "var(--ink)",
  fontFamily: FONTS.serif, padding: "44px 54px", overflow: "hidden",
  backgroundColor: "var(--paper)",
  backgroundImage: "radial-gradient(var(--dot) 1px, transparent 1.4px)",
  backgroundSize: "22px 22px",
};
const BOOK_VARS = {
  "--paper": AT.paper, "--dot": "#cdbfa6", "--ink": AT.ink, "--faint": AT.faint,
  "--line": AT.line, "--accent": AT.red, "--accent2": "#23406b",
} as React.CSSProperties;

export function Spread({ vars, left, right }: { vars?: React.CSSProperties; left: React.ReactNode; right: React.ReactNode }) {
  return (
    <div id="spread" style={{ display: "flex", width: SPREAD_W, height: SPREAD_H, background: "#000", ...BOOK_VARS, ...vars }}>
      <div style={PAGE_BASE}>{left}</div>
      <div style={{ width: 2, background: "linear-gradient(#0000,rgba(0,0,0,.22),#0000)" }} />
      <div style={PAGE_BASE}>{right}</div>
    </div>
  );
}

function Tick({ label, color = "var(--faint)", style }: { label: string; color?: string; style?: React.CSSProperties }) {
  return <span style={{ fontFamily: FONTS.mono, fontSize: 10, letterSpacing: ".18em", textTransform: "uppercase", color, ...style }}>{label}</span>;
}

/* compass rose used on cover + dividers */
function Compass({ size = 120, color = "var(--accent)" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block" }}>
      <circle cx="50" cy="50" r="47" fill="none" stroke={color} strokeWidth="1.4" />
      <circle cx="50" cy="50" r="38" fill="none" stroke={color} strokeWidth=".6" opacity=".5" />
      {Array.from({ length: 16 }).map((_, i) => {
        const a = (i * Math.PI) / 8, r1 = i % 4 === 0 ? 30 : 38, r2 = 47;
        return <line key={i} x1={50 + r1 * Math.sin(a)} y1={50 - r1 * Math.cos(a)} x2={50 + r2 * Math.sin(a)} y2={50 - r2 * Math.cos(a)} stroke={color} strokeWidth={i % 4 === 0 ? 1.2 : .5} />;
      })}
      <path d="M50 8 L57 50 L50 50 Z" fill={color} />
      <path d="M50 8 L43 50 L50 50 Z" fill={color} opacity=".45" />
      <path d="M50 92 L57 50 L50 50 Z" fill={color} opacity=".25" />
      <path d="M50 92 L43 50 L50 50 Z" fill={color} opacity=".4" />
      <circle cx="50" cy="50" r="3.4" fill="var(--paper)" stroke={color} strokeWidth="1.4" />
      <text x="50" y="22" textAnchor="middle" fontFamily={FONTS.disp} fontWeight="800" fontSize="7" fill="var(--paper)">N</text>
    </svg>
  );
}

/* ══════════════════ COVER ══════════════════ */
export function Cover() {
  const prof = useProfile();
  const { ui } = useLang();
  const SPACE = "#0a1622";
  return (
    <Spread
      left={
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: SPACE }}>
          <img src={asset("/covers/world.jpg")} alt="Earth from space" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 38%" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(10,22,34,.55) 0%, rgba(10,22,34,.12) 34%, rgba(10,22,34,.86) 100%)" }} />
          <div style={{ position: "absolute", inset: 0, padding: "44px 54px", display: "flex", flexDirection: "column", justifyContent: "space-between", color: "#fff" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Tick label={ui.cover.kicker} color="#fff" />
              <Tick label={`№ 001 / ${TOTAL_STOPS}`} color="rgba(255,255,255,.8)" />
            </div>
            <div>
              <div style={{ fontFamily: FONTS.mono, fontSize: 17, letterSpacing: ".34em", color: "#fff", marginBottom: 12, textShadow: "0 2px 10px rgba(0,0,0,.6)" }}>{ui.cover.anAtlasOf}</div>
              <h1 style={{ fontFamily: FONTS.disp, fontWeight: 800, fontSize: 138, lineHeight: .82, margin: 0, letterSpacing: "-.03em", color: "#fff", textShadow: "0 6px 30px rgba(0,0,0,.7)" }}>{ui.cover.title[0]}<br />{ui.cover.title[1]}<br />{ui.cover.title[2]}</h1>
              <div style={{ marginTop: 24, fontFamily: FONTS.serif, fontStyle: "italic", fontSize: 26, color: "rgba(255,255,255,.95)", textShadow: "0 2px 12px rgba(0,0,0,.7)" }}>
                {ui.cover.subtitle(TOTAL_STOPS)}
              </div>
            </div>
            <div style={{ borderTop: "2px solid rgba(255,255,255,.7)", paddingTop: 14, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontFamily: FONTS.disp, fontWeight: 700, fontSize: 22, textShadow: "0 2px 10px rgba(0,0,0,.6)" }}>{ui.cover.journeyStarts}</span>
              <Tick label={ui.cover.fieldEdition} color="rgba(255,255,255,.8)" />
            </div>
          </div>
        </div>
      }
      right={
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: `radial-gradient(120% 90% at 50% 18%, #15314c 0%, ${SPACE} 70%)` }}>
          <div style={{ position: "absolute", inset: 0, padding: "44px 54px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 40, color: "#fff" }}>
            <Compass size={150} color="rgba(255,255,255,.85)" />
            <div style={{ border: "2.5px solid rgba(255,255,255,.85)", borderRadius: 16, padding: "26px 44px", transform: "rotate(-2deg)", background: "rgba(255,255,255,.96)", boxShadow: "0 18px 44px rgba(0,0,0,.45)", textAlign: "center" }}>
              <div style={{ fontFamily: FONTS.mono, fontSize: 13, letterSpacing: ".2em", color: AT.faint, textTransform: "uppercase" }}>{ui.cover.belongsTo}</div>
              <div style={{ fontFamily: FONTS.disp, fontWeight: 800, fontSize: 72, lineHeight: 1, color: AT.red, margin: "10px 0 6px" }}>{prof.name}</div>
              <div style={{ fontFamily: FONTS.serif, fontStyle: "italic", fontSize: 22, color: AT.ink }}>{ui.cover.chiefExplorer(prof.age)}</div>
            </div>
            <div style={{ fontFamily: FONTS.serif, fontStyle: "italic", fontSize: 19, color: "rgba(255,255,255,.85)", textAlign: "center", maxWidth: 440 }}>
              “{ui.cover.quote}”
            </div>
          </div>
        </div>
      }
    />
  );
}

/* zero-state for the printed keepsake passport (fresh, unstamped) */
const EMPTY_SET: Set<number> = new Set();
const EMPTY_VISITS: Visits = {};

/* ══════════════════ EXPLORER PASSPORT (ported design — wired to live progress) ══════════════════ */
/* Identity comes from the profile store (any child can make it theirs in the reader); the RANK is
   earned from countries read; stamps/badges come from the progress store. Print → zero state (a
   fresh, unstamped passport for the keepsake book). */
const PASS_VARS = { "--accent2": "#2c6b66" } as React.CSSProperties;
const PPAGE: React.CSSProperties = {
  position: "relative", width: 794, height: SPREAD_H, color: "var(--ink)", fontFamily: FONTS.serif,
  padding: "32px 46px 20px", overflow: "hidden", backgroundColor: "var(--paper)",
  backgroundImage: "radial-gradient(var(--dot) 1px, transparent 1.4px)", backgroundSize: "22px 22px",
};
const MON = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
function fmtDate(ts: number): string { const d = new Date(ts); return `${String(d.getDate()).padStart(2, "0")} ${MON[d.getMonth()]}`; }
const flagPath = (iso: string) => asset(`/flags/${iso}.svg`);

function EdgeSpineP({ side }: { side: "left" | "right" }) {
  return <div style={{ position: "absolute", top: 0, bottom: 0, [side]: 0, width: 9, background: "var(--accent)" }} />;
}
function MotifP() {
  return <div style={{ height: 9, marginTop: 5, opacity: .9, backgroundImage: "radial-gradient(circle, var(--accent) 0 2.4px, transparent 3px), radial-gradient(circle, var(--accent2) 0 2.4px, transparent 3px)", backgroundSize: "18px 9px", backgroundPosition: "0 center, 9px center", backgroundRepeat: "repeat-x" }} />;
}
function PassHead({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div style={{ marginBottom: 9 }}>
      <Tick label={kicker} color="var(--accent)" style={{ display: "block" }} />
      <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
        <h3 style={{ fontFamily: FONTS.disp, fontWeight: 700, fontSize: 22, margin: "2px 0 0", lineHeight: 1, color: "var(--ink)", whiteSpace: "nowrap" }}>{title}</h3>
        <span style={{ flex: 1, height: 0, borderTop: "2px solid var(--accent)", transform: "translateY(-3px)" }} />
      </div>
    </div>
  );
}
function CompassMini({ size = 50 }: { size?: number }) {
  const arm = (deg: number): React.CSSProperties => ({ position: "absolute", left: "50%", top: "50%", width: 1.5, height: size / 2 - 5, background: "var(--faint)", transformOrigin: "bottom center", transform: `translate(-50%,-100%) rotate(${deg}deg)`, opacity: .55 });
  return (
    <div style={{ width: size, height: size, position: "relative", borderRadius: "50%", border: "1.5px solid var(--faint)", background: "rgba(255,255,255,.25)" }}>
      <div style={{ position: "absolute", inset: 7, borderRadius: "50%", border: "1px dashed var(--faint)" }} />
      {[0, 90, 180, 270].map((d) => <div key={d} style={arm(d)} />)}
      <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%) rotate(45deg)", width: 10, height: 10, background: "var(--accent)" }} />
    </div>
  );
}

/* emblem glyphs — CSS-only geometry */
function Glyph({ type, c = "var(--accent)", s = 26 }: { type: string; c?: string; s?: number }) {
  const box: React.CSSProperties = { width: s, height: s, position: "relative", display: "grid", placeItems: "center", flex: "0 0 auto" };
  const col: React.CSSProperties = { ...box, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" };
  const tri = (w: number, h: number): React.CSSProperties => ({ width: 0, height: 0, borderLeft: `${w / 2}px solid transparent`, borderRight: `${w / 2}px solid transparent`, borderBottom: `${h}px solid ${c}` });
  switch (type) {
    case "sun": return <div style={box}><div style={{ width: s * .68, height: s * .68, borderRadius: "50%", background: c }} /></div>;
    case "diamond": return <div style={box}><div style={{ width: s * .54, height: s * .54, background: c, transform: "rotate(45deg)" }} /></div>;
    case "star": return <div style={box}><div style={{ position: "absolute", width: s * .5, height: s * .5, background: c }} /><div style={{ position: "absolute", width: s * .5, height: s * .5, background: c, transform: "rotate(45deg)" }} /></div>;
    case "leaf": return <div style={box}><div style={{ width: s * .56, height: s * .56, background: c, borderRadius: "0 62% 0 62%", transform: "rotate(45deg)" }} /></div>;
    case "wave": return <div style={col}><div style={{ width: s * .72, height: s * .12, background: c, borderRadius: 99, marginBottom: s * .14 }} /><div style={{ width: s * .72, height: s * .12, background: c, borderRadius: 99 }} /></div>;
    case "peak": return <div style={box}><div style={tri(s * .82, s * .72)} /></div>;
    case "house": return <div style={col}><div style={tri(s * .66, s * .42)} /><div style={{ width: s * .42, height: s * .3, background: c }} /></div>;
    case "island": return <div style={col}><div style={{ width: s * .58, height: s * .29, background: c, borderRadius: `${s}px ${s}px 0 0` }} /><div style={{ width: s * .8, height: s * .1, background: c, borderRadius: 99, marginTop: s * .1 }} /></div>;
    case "dune": return <div style={col}><div style={{ display: "flex", alignItems: "flex-end" }}><div style={{ width: s * .42, height: s * .26, background: c, borderRadius: `${s}px ${s}px 0 0` }} /><div style={{ width: s * .5, height: s * .36, background: c, borderRadius: `${s}px ${s}px 0 0`, marginLeft: -s * .12 }} /></div><div style={{ width: s * .82, height: s * .09, background: c, borderRadius: 99, marginTop: s * .08 }} /></div>;
    case "savanna": return <div style={col}><div style={{ width: s * .42, height: s * .42, borderRadius: "50%", background: c }} /><div style={{ width: s * .8, height: s * .09, background: c, borderRadius: 99, marginTop: s * .12 }} /></div>;
    case "globe": return <div style={box}><div style={{ width: s * .68, height: s * .68, borderRadius: "50%", border: `2.5px solid ${c}`, position: "relative" }}><div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 2, background: c, transform: "translateX(-50%)" }} /><div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 2, background: c, transform: "translateY(-50%)" }} /></div></div>;
    case "dot": return <div style={box}><div style={{ width: s * .3, height: s * .3, borderRadius: "50%", background: c }} /></div>;
    default: return <div style={box}><div style={{ width: s * .5, height: s * .5, background: c }} /></div>;
  }
}

/* ---- left-page parts ---- */
function Portrait({ name }: { name: string }) {
  return (
    <div style={{ position: "relative", background: "#fff", padding: "8px 8px 0", borderRadius: 2, boxShadow: "0 9px 20px rgba(40,30,15,.24)", transform: "rotate(-1.4deg)", flex: "0 0 auto" }}>
      <div style={{ position: "absolute", top: -9, left: 14, width: 50, height: 17, background: "rgba(214,196,150,.62)", transform: "rotate(-7deg)" }} />
      <div style={{ position: "absolute", top: -9, right: 14, width: 50, height: 17, background: "rgba(214,196,150,.62)", transform: "rotate(7deg)" }} />
      <div style={{ width: 126, height: 150, overflow: "hidden", background: "#e7ddc8", position: "relative", display: "grid", placeItems: "center" }}>
        <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(135deg, color-mix(in srgb, var(--accent) 14%, transparent) 0 9px, transparent 9px 18px)" }} />
        <div style={{ position: "relative", textAlign: "center" }}>
          <div style={{ fontFamily: FONTS.disp, fontWeight: 800, fontSize: 56, color: "var(--accent)", lineHeight: 1 }}>{name[0]}</div>
          <div style={{ fontFamily: FONTS.mono, fontSize: 8, letterSpacing: ".2em", color: "var(--accent)", marginTop: 6 }}>EXPLORER<br />PORTRAIT</div>
        </div>
      </div>
      <div style={{ fontFamily: FONTS.mono, fontSize: 8, letterSpacing: ".12em", color: "var(--faint)", textAlign: "center", padding: "5px 0 6px" }}>PHOTO · EARTH</div>
    </div>
  );
}
function Seal({ size = 116 }: { size?: number }) {
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", border: "2.5px solid var(--accent)", color: "var(--accent)", transform: "rotate(-8deg)", display: "grid", placeItems: "center", textAlign: "center", flex: "0 0 auto", opacity: .92, boxShadow: "inset 0 0 0 4px var(--paper), inset 0 0 0 5.5px var(--accent)" }}>
      <div>
        <div style={{ fontFamily: FONTS.mono, fontSize: 7.5, letterSpacing: ".16em" }}>★ OFFICIAL ★</div>
        <div style={{ fontFamily: FONTS.disp, fontWeight: 800, fontSize: 19, lineHeight: .95, margin: "4px 0 3px" }}>EXPLORER<br />SEAL</div>
        <div style={{ fontFamily: FONTS.mono, fontSize: 7.5, letterSpacing: ".12em" }}>PLANET EARTH</div>
      </div>
    </div>
  );
}
function RecordRow({ label, value, chip, wide }: { label: string; value: string; chip?: string; wide?: boolean }) {
  return (
    <div style={{ padding: "6px 14px", borderRight: !wide ? "1px dotted var(--line)" : "none", borderBottom: "1px dotted var(--line)", gridColumn: wide ? "1 / -1" : "auto" }}>
      <div style={{ fontFamily: FONTS.mono, fontSize: 9, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--faint)" }}>{label}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {chip && <span style={{ width: 22, height: 15, borderRadius: 2, overflow: "hidden", border: "1px solid var(--line)", flex: "0 0 auto" }}><img src={chip} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} /></span>}
        <span style={{ fontFamily: FONTS.disp, fontWeight: 700, fontSize: 17, lineHeight: 1.15, color: "var(--ink)", whiteSpace: "nowrap" }}>{value}</span>
      </div>
    </div>
  );
}
function StatTile({ value, total, label, frac, fillable }: { value: React.ReactNode; total?: React.ReactNode; label: string; frac: number; fillable?: boolean }) {
  return (
    <div style={{ border: "1.5px solid var(--line)", background: "rgba(255,255,255,.45)", padding: "9px 13px" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 5, whiteSpace: "nowrap" }}>
        {fillable
          ? <span style={{ display: "inline-block", width: 42, height: 20, borderBottom: "2px dashed var(--faint)" }} />
          : <span style={{ fontFamily: FONTS.disp, fontWeight: 800, fontSize: 26, lineHeight: 1, color: "var(--accent)" }}>{value}</span>}
        {total != null && <span style={{ fontFamily: FONTS.disp, fontWeight: 700, fontSize: 14, color: "var(--faint)" }}>/ {total}</span>}
      </div>
      <div style={{ fontFamily: FONTS.mono, fontSize: 9, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--faint)", margin: "5px 0 6px" }}>{label}</div>
      {fillable
        ? <div style={{ fontFamily: FONTS.mono, fontSize: 7.5, letterSpacing: ".08em", color: "var(--faint)" }}>WRITE IN AS YOU GO</div>
        : <div style={{ height: 5, background: "var(--line)", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${Math.max(frac * 100, 3)}%`, background: "var(--accent)" }} />
          </div>}
    </div>
  );
}

/* ---- right-page parts ---- */
function MiniStamp({ glyph, date, rot }: { glyph: string; date: string; rot: number }) {
  return (
    <div style={{ width: 60, height: 60, borderRadius: "50%", border: "1.5px dashed var(--accent)", color: "var(--accent)", transform: `rotate(${rot}deg)`, display: "grid", placeItems: "center", textAlign: "center", flex: "0 0 auto", opacity: .9 }}>
      <div>
        <div style={{ fontFamily: FONTS.disp, fontWeight: 800, fontSize: 15, lineHeight: 1 }}>{glyph}</div>
        <div style={{ fontFamily: FONTS.mono, fontSize: 6.5, letterSpacing: ".1em", marginTop: 2 }}>{date}</div>
      </div>
    </div>
  );
}
function InkStamp({ glyph, name, stop, date, started, fillable }: { glyph: string; name: string; stop: string; date: string; started: boolean; fillable?: boolean }) {
  if (fillable && !started) {
    return (
      <div style={{ width: 150, height: 150, borderRadius: "50%", border: "2.5px dashed var(--accent)", color: "var(--accent)", transform: "rotate(-7deg)", display: "grid", placeItems: "center", textAlign: "center", flex: "0 0 auto", boxSizing: "border-box", opacity: .85 }}>
        <div>
          <div style={{ fontFamily: FONTS.mono, fontSize: 8, letterSpacing: ".16em" }}>★ FIRST STAMP ★</div>
          <div style={{ fontFamily: FONTS.disp, fontWeight: 800, fontSize: 38, lineHeight: 1, margin: "6px 0 4px" }}>?</div>
          <div style={{ fontFamily: FONTS.disp, fontWeight: 700, fontSize: 13, letterSpacing: ".06em" }}>STAMP HERE</div>
          <div style={{ fontFamily: FONTS.mono, fontSize: 7.5, letterSpacing: ".1em", marginTop: 4 }}>WHEN YOU START</div>
        </div>
      </div>
    );
  }
  return (
    <div style={{ width: 150, height: 150, borderRadius: "50%", border: "2.5px solid var(--accent)", color: "var(--accent)", transform: "rotate(-7deg)", display: "grid", placeItems: "center", textAlign: "center", flex: "0 0 auto", boxShadow: "inset 0 0 0 5px var(--paper), inset 0 0 0 6.5px var(--accent)", opacity: started ? .95 : .5 }}>
      <div>
        <div style={{ fontFamily: FONTS.mono, fontSize: 8, letterSpacing: ".16em" }}>★ PLANET EARTH ★</div>
        <div style={{ fontFamily: FONTS.disp, fontWeight: 800, fontSize: 30, lineHeight: 1, margin: "5px 0 2px" }}>{glyph}</div>
        <div style={{ fontFamily: FONTS.disp, fontWeight: 700, fontSize: 15, letterSpacing: ".04em" }}>{name.toUpperCase()}</div>
        <div style={{ fontFamily: FONTS.mono, fontSize: 8, letterSpacing: ".12em", marginTop: 4 }}>{started ? `STOP ${stop} · ${date}` : "AWAITING FIRST STAMP"}</div>
        <div style={{ fontFamily: FONTS.mono, fontSize: 7.5, letterSpacing: ".1em", marginTop: 2 }}>{started ? "✓ VISITED" : "READY"}</div>
      </div>
    </div>
  );
}
type Latest = { glyph: string; name: string; stop: string; date: string } | null;
function Dashboard({ latest, recent, countriesVisited, totalPlaces, fillable }: { latest: Latest; recent: Array<{ glyph: string; date: string }>; countriesVisited: number; totalPlaces: number; fillable?: boolean }) {
  const { ui } = useLang();
  const d = ui.passport.dash;
  const frac = countriesVisited / totalPlaces;
  const started = countriesVisited > 0;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 18, alignItems: "center", border: "1.5px solid var(--line)", background: "rgba(255,255,255,.4)", padding: "14px 18px", marginTop: 12 }}>
      <div style={{ width: 168, display: "grid", placeItems: "center" }}>
        <InkStamp glyph={latest ? latest.glyph : "🌍"} name={latest ? latest.name : d.begin} stop={latest ? latest.stop : ""} date={latest ? latest.date : ""} started={started} fillable={fillable} />
      </div>
      <div>
        <Tick label={fillable ? d.journal : d.latest} color="var(--accent)" />
        <div style={{ fontFamily: FONTS.disp, fontWeight: 800, fontSize: 23, lineHeight: 1, color: "var(--ink)", margin: "3px 0 2px" }}>
          {fillable ? d.stampAsExplore : latest ? d.nameStop(latest.name, latest.stop) : d.noStamps}
        </div>
        <div style={{ fontFamily: FONTS.serif, fontStyle: "italic", fontSize: 13, color: "var(--faint)" }}>
          {fillable ? d.fillHint : latest ? d.stampedOn(latest.date) : d.openAny}
        </div>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginTop: 13 }}>
          <Tick label={d.countriesVisited} />
          {fillable
            ? <span style={{ display: "inline-block", width: 46, height: 16, borderBottom: "2px dashed var(--faint)" }} />
            : <span style={{ fontFamily: FONTS.disp, fontWeight: 800, fontSize: 18, color: "var(--accent)" }}>{countriesVisited} <span style={{ color: "var(--faint)", fontWeight: 700, fontSize: 13 }}>/ {totalPlaces}</span></span>}
        </div>
        <div style={{ height: 13, background: "var(--line)", borderRadius: 99, overflow: "hidden", marginTop: 5, backgroundImage: "repeating-linear-gradient(90deg, rgba(0,0,0,.06) 0 1px, transparent 1px 7px)" }}>
          <div style={{ height: "100%", width: `${Math.max(frac * 100, 2)}%`, background: "var(--accent)", borderRadius: 99 }} />
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 11, alignItems: "center" }}>
          {fillable
            ? <>
                {[0, 1, 2].map((i) => <MiniStamp key={i} glyph="?" date="▢ ▢" rot={i % 2 ? 6 : -8} />)}
                <div style={{ fontFamily: FONTS.serif, fontStyle: "italic", fontSize: 12.5, color: "var(--faint)", alignSelf: "center", lineHeight: 1.3 }}>{d.drawFav}</div>
              </>
            : <>
                {recent.map((s, i) => <MiniStamp key={i} glyph={s.glyph} date={s.date} rot={i % 2 ? 6 : -8} />)}
                <div style={{ fontFamily: FONTS.serif, fontStyle: "italic", fontSize: 12.5, color: "var(--faint)", alignSelf: "center", lineHeight: 1.3 }}>
                  {countriesVisited > recent.length + 1 ? d.andMore(countriesVisited - recent.length - 1) : started ? d.appearHere : d.gatherHere}
                </div>
              </>}
        </div>
      </div>
    </div>
  );
}
function ContinentBadge({ name, emblem, done, total, fillable }: { name: string; emblem: string; done: number; total: number; fillable?: boolean }) {
  const pct = total ? done / total : 0, complete = done >= total && total > 0;
  const blank = fillable && !complete; // a dashed "colour-in" slot for the printed keepsake
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 7 }}>
      <div style={{ width: 100, height: 100, borderRadius: "50%", boxSizing: "border-box", display: "grid", placeItems: "center", position: "relative",
        background: blank ? "var(--paper)" : `conic-gradient(var(--accent) ${pct * 360}deg, var(--line) 0deg)`,
        border: blank ? "2.5px dashed var(--accent)" : "none",
        boxShadow: complete ? "0 6px 16px rgba(178,58,46,.3)" : "none" }}>
        <div style={{ position: "absolute", inset: 5, borderRadius: "50%", background: complete ? "var(--accent)" : "var(--paper)", display: "grid", placeItems: "center", border: blank ? "none" : "1px solid var(--line)" }}>
          <div style={{ textAlign: "center" }}>
            <Glyph type={emblem} c={complete ? "#fff" : "var(--accent)"} s={26} />
            <div style={{ fontFamily: FONTS.mono, fontSize: 10, fontWeight: 600, color: complete ? "#fff" : "var(--faint)", marginTop: 3 }}>{blank ? `0/${total}` : `${done}/${total}`}</div>
          </div>
        </div>
      </div>
      <div style={{ fontFamily: FONTS.disp, fontWeight: 700, fontSize: 13, color: "var(--ink)", textAlign: "center", lineHeight: 1, whiteSpace: "nowrap" }}>{name}</div>
    </div>
  );
}
function CollectionStamp({ name, emblem, done, total, hint }: { name: string; emblem: string; done: number; total: number; hint: string }) {
  const earned = done >= total && total > 0;
  return (
    <div style={{ background: "#fff", padding: 5, border: "1px solid var(--line)", boxShadow: "0 3px 9px rgba(40,30,15,.12)" }}>
      <div style={{ border: `1.5px dashed ${earned ? "var(--accent)" : "var(--faint)"}`, padding: "9px 9px", background: earned ? "color-mix(in srgb, var(--accent) 10%, #fff)" : "rgba(247,240,225,.5)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <Glyph type={emblem} c={earned ? "var(--accent)" : "var(--faint)"} s={24} />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: FONTS.disp, fontWeight: 700, fontSize: 13, lineHeight: 1.05, color: "var(--ink)" }}>{name}</div>
            <div style={{ fontFamily: FONTS.mono, fontSize: 9, color: earned ? "var(--accent)" : "var(--faint)", marginTop: 2 }}>{done} / {total}{earned ? " · EARNED ✦" : ""}</div>
          </div>
        </div>
        <div style={{ fontFamily: FONTS.serif, fontStyle: "italic", fontSize: 10.5, color: "var(--faint)", lineHeight: 1.3, marginTop: 7 }}>{hint}</div>
      </div>
    </div>
  );
}
function MilestoneTrack({ countriesVisited, totalPlaces, milestones }: { countriesVisited: number; totalPlaces: number; milestones: Array<{ name: string; at: number }> }) {
  const frac = Math.min(countriesVisited / totalPlaces, 1);
  return (
    <div style={{ position: "relative", margin: "16px 8px 0" }}>
      <div style={{ position: "absolute", left: 60, right: 60, top: 12, height: 3, background: "var(--line)" }} />
      <div style={{ position: "absolute", left: 60, top: 12, height: 3, background: "var(--accent)", width: `calc((100% - 120px) * ${frac})` }} />
      <div style={{ display: "flex", justifyContent: "space-between", position: "relative" }}>
        {milestones.map((m, i) => {
          const reached = countriesVisited >= m.at;
          return (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 120 }}>
              <div style={{ width: 26, height: 26, borderRadius: "50%", background: reached ? "var(--accent)" : "var(--paper)", border: `2px solid ${reached ? "var(--accent)" : "var(--line)"}`, display: "grid", placeItems: "center", color: reached ? "#fff" : "var(--faint)", fontFamily: FONTS.disp, fontWeight: 800, fontSize: 12 }}>{reached ? "✓" : i + 1}</div>
              <div style={{ fontFamily: FONTS.disp, fontWeight: 700, fontSize: 12.5, color: "var(--ink)", marginTop: 7, textAlign: "center", lineHeight: 1, whiteSpace: "nowrap" }}>{m.name}</div>
              <div style={{ fontFamily: FONTS.mono, fontSize: 9, color: "var(--faint)", marginTop: 3 }}>{m.at} places</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* view-models from the live badge catalog (translated for display) */
function continentVMs(v: Set<number>, lang: Lang) {
  return CONTINENT_BADGES.map((b) => ({ name: b.continent ? tContinentShort(b.continent, lang) : (b.shortName || b.name), emblem: b.emblem, done: badgeDone(b, v), total: badgeTotal(b) }));
}
function collectionVMs(v: Set<number>, lang: Lang) {
  return THEME_BADGES.map((b) => { const t = tThemeBadge(b.id, lang); return { name: t?.name ?? b.name, emblem: b.emblem, hint: t?.hint ?? b.hint ?? "", done: badgeDone(b, v), total: badgeTotal(b) }; });
}
function milestoneVMs(lang: Lang) {
  return MILESTONE_BADGES.map((b) => ({ name: tMilestone(b.id, lang)?.name ?? b.name, at: b.needCount! }));
}

export function Passport({ print = false }: { print?: boolean }) {
  const liveV = useVisited(); const liveVs = useVisits(); const prof = useProfile();
  const { lang, ui } = useLang();
  const P = ui.passport;
  const v = print ? EMPTY_SET : liveV;
  const vs = print ? EMPTY_VISITS : liveVs;
  const visitedCountries = visitedCountriesByRecency(vs);
  const countriesVisited = visitedCountries.length;
  const pagesExplored = Object.keys(vs).length;
  const earned = badgesEarned(v);
  const rank = rankFor(countriesVisited);
  const rankLabel = tRank(rank, lang);
  const cname = (iso: string, fallback: string) => getCountryLang(iso, lang)?.name ?? fallback;
  const passportNo = `EXP·084·${prof.name.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8) || "EARTH"}`;
  const latest = visitedCountries[0]
    ? { glyph: visitedCountries[0].iso.toUpperCase(), name: cname(visitedCountries[0].iso, visitedCountries[0].name), stop: String(visitedCountries[0].stop).padStart(2, "0"), date: fmtDate(visitedCountries[0].ts) }
    : null;
  const recent = visitedCountries.slice(1, 4).map((c) => ({ glyph: c.iso.toUpperCase(), date: fmtDate(c.ts) }));
  const journeys = visitedCountries.slice(0, 8);
  const pledge = P.pledge;
  const mrz1 = `P<EARTH<${prof.name.toUpperCase().replace(/[^A-Z]/g, "")}<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<`.slice(0, 44);
  const mrz2 = `${passportNo.replace(/[^A-Z0-9]/g, "")}${prof.age}${prof.homeIso.toUpperCase()}<<${rank.toUpperCase().replace(/ /g, "<")}`.slice(0, 44).padEnd(44, "<");
  const next = nextRank(countriesVisited);

  return (
    <div id="spread" style={{ display: "flex", width: SPREAD_W, height: SPREAD_H, background: "#000", ...BOOK_VARS, ...PASS_VARS }}>
      {/* LEFT — identity / official record */}
      <div style={PPAGE}>
        <EdgeSpineP side="left" />
        <div style={{ position: "absolute", right: -70, bottom: 150, width: 280, height: 280, borderRadius: "50%", border: "2px solid var(--faint)", opacity: .1, pointerEvents: "none" }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "repeating-conic-gradient(from 0deg, transparent 0 28deg, var(--faint) 28deg 28.6deg)" }} />
          <div style={{ position: "absolute", left: 0, right: 0, top: "50%", height: 2, background: "var(--faint)" }} />
          <div style={{ position: "absolute", left: 0, right: 0, top: "30%", height: 1, background: "var(--faint)" }} />
          <div style={{ position: "absolute", left: 0, right: 0, top: "70%", height: 1, background: "var(--faint)" }} />
        </div>
        <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: "2px solid var(--accent)", paddingBottom: 7 }}>
            <span style={{ fontFamily: FONTS.disp, fontWeight: 800, fontSize: 30, lineHeight: 1, color: "var(--ink)" }}>{P.title}</span>
            <Tick label={P.typeTag} />
          </div>
          <MotifP />
          {/* masthead */}
          <div style={{ display: "flex", gap: 20, marginTop: 16, alignItems: "flex-start" }}>
            <Portrait name={prof.name} />
            <div style={{ flex: 1, paddingTop: 4, minWidth: 0 }}>
              <Tick label={rankLabel} color="var(--accent)" style={{ display: "block" }} />
              <h1 style={{ fontFamily: FONTS.disp, fontWeight: 800, fontSize: prof.name.length > 9 ? 52 : 70, margin: "2px 0 0", lineHeight: .82, letterSpacing: "-.02em", color: "var(--ink)" }}>{prof.name}</h1>
              <div style={{ fontFamily: FONTS.serif, fontStyle: "italic", fontSize: 14.5, color: "var(--faint)", marginTop: 8, lineHeight: 1.3 }}>{P.tagline}</div>
              <Tick label={P.memberSince(passportNo)} style={{ display: "block", marginTop: 9 }} />
            </div>
            <div style={{ marginTop: -2 }}><Seal /></div>
          </div>
          {/* official record */}
          <div style={{ marginTop: 16, border: "1.5px solid var(--ink)", background: "rgba(255,255,255,.42)" }}>
            <div style={{ fontFamily: FONTS.mono, fontSize: 9.5, letterSpacing: ".2em", textTransform: "uppercase", color: "#fff", background: "var(--accent)", padding: "5px 14px" }}>{P.officialRecord}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
              <RecordRow label={P.rec.passportNo} value={passportNo} />
              <RecordRow label={P.rec.dateIssued} value={P.rec.dateIssuedVal} />
              <RecordRow label={P.rec.nationality} value={prof.nationality} />
              <RecordRow label={P.rec.homeCountry} value={cname(prof.homeIso, prof.homeCountry)} chip={flagPath(prof.homeIso)} />
              <RecordRow label={P.rec.age} value={P.rec.ageVal(prof.age)} />
              <RecordRow label={P.rec.rank} value={rankLabel} />
              <RecordRow label={P.rec.mission} value={P.rec.missionVal(TOTAL_STOPS)} wide />
              <div style={{ padding: "6px 14px", gridColumn: "1 / -1" }}>
                <div style={{ fontFamily: FONTS.mono, fontSize: 9, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--faint)" }}>{P.rec.issuingAuthority}</div>
                <div style={{ fontFamily: FONTS.disp, fontWeight: 700, fontSize: 17, color: "var(--ink)" }}>{P.rec.authority}</div>
              </div>
            </div>
          </div>
          {/* stats */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginTop: 13 }}>
            <StatTile value={countriesVisited} total={TOTAL_STOPS} label={P.stat.countries} frac={countriesVisited / TOTAL_STOPS} fillable={print} />
            <StatTile value={earned} total={TOTAL_BADGES} label={P.stat.badges} frac={earned / TOTAL_BADGES} fillable={print} />
            <StatTile value={pagesExplored} label={P.stat.pages} frac={pagesExplored / SPINE.length} fillable={print} />
          </div>
          {/* pledge */}
          <div style={{ marginTop: 13, border: "1.5px solid var(--accent)", background: "color-mix(in srgb, var(--accent) 7%, #fff)", padding: "10px 16px" }}>
            <Tick label={P.pledgeTitle} color="var(--accent)" />
            <div style={{ fontFamily: FONTS.serif, fontStyle: "italic", fontSize: 14, lineHeight: 1.4, color: "var(--ink)", marginTop: 5 }}>{pledge}</div>
          </div>
          {/* recent journeys */}
          <div style={{ marginTop: 14 }}>
            <Tick label={print ? P.drawFlags : P.recentJourneys} color="var(--accent)" />
            {print ? (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 11, marginTop: 9 }}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} style={{ width: 50, height: 34, borderRadius: 3, border: "1.5px dashed var(--faint)", display: "grid", placeItems: "center" }}>
                    <span style={{ fontFamily: FONTS.mono, fontSize: 13, color: "var(--faint)", opacity: .6 }}>?</span>
                  </div>
                ))}
              </div>
            ) : journeys.length > 0 ? (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 11, marginTop: 9 }}>
                {journeys.map((j) => (
                  <div key={j.iso} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, width: 58 }}>
                    <div style={{ width: 50, height: 34, borderRadius: 3, overflow: "hidden", border: "1px solid var(--line)", boxShadow: "0 3px 8px rgba(40,30,15,.16)" }}>
                      <img src={flagPath(j.iso)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    </div>
                    <div style={{ fontFamily: FONTS.mono, fontSize: 7.5, letterSpacing: ".04em", color: "var(--faint)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 58, textAlign: "center" }}>{cname(j.iso, j.name).toUpperCase()}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ fontFamily: FONTS.serif, fontStyle: "italic", fontSize: 13.5, color: "var(--faint)", marginTop: 8 }}>{P.journeysEmpty}</div>
            )}
          </div>
          {/* signature + MRZ pinned to foot */}
          <div style={{ marginTop: "auto" }}>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 16, marginBottom: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: FONTS.serif, fontStyle: "italic", fontWeight: 500, fontSize: 30, color: "var(--ink)", lineHeight: 1, paddingLeft: 4 }}>{prof.name}</div>
                <div style={{ borderTop: "1.5px solid var(--ink)", marginTop: 4, paddingTop: 4 }}><Tick label={P.signature} /></div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: FONTS.serif, fontStyle: "italic", fontWeight: 500, fontSize: 20, color: "var(--ink)", lineHeight: 1, paddingLeft: 4 }}>2026</div>
                <div style={{ borderTop: "1.5px solid var(--ink)", marginTop: 4, paddingTop: 4 }}><Tick label={P.dateOfIssue} /></div>
              </div>
            </div>
            <div style={{ background: "rgba(255,255,255,.5)", borderTop: "1.5px solid var(--ink)", borderBottom: "1.5px solid var(--ink)", padding: "7px 14px" }}>
              <div style={{ fontFamily: FONTS.mono, fontSize: 13, letterSpacing: ".06em", color: "var(--ink)", whiteSpace: "nowrap", lineHeight: 1.5 }}>{mrz1}</div>
              <div style={{ fontFamily: FONTS.mono, fontSize: 13, letterSpacing: ".06em", color: "var(--ink)", whiteSpace: "nowrap", lineHeight: 1.5 }}>{mrz2}</div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ width: 2, background: "linear-gradient(#0000,rgba(0,0,0,.22),#0000)" }} />
      {/* RIGHT — stamps collected */}
      <div style={PPAGE}>
        <EdgeSpineP side="right" />
        <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: "2px solid var(--accent)", paddingBottom: 7 }}>
            <span style={{ fontFamily: FONTS.disp, fontWeight: 800, fontSize: 30, lineHeight: 1, color: "var(--ink)" }}>{P.stampsCollected}</span>
            <Tick label={print ? P.collectAll(TOTAL_BADGES) : P.badgesTag(earned, TOTAL_BADGES)} color="var(--accent)" />
          </div>
          <MotifP />
          <Dashboard latest={latest} recent={recent} countriesVisited={countriesVisited} totalPlaces={TOTAL_STOPS} fillable={print} />
          <div style={{ marginTop: 16 }}>
            <PassHead kicker={P.contKicker(print)} title={P.sixLands} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 8, justifyItems: "center" }}>
              {continentVMs(v, lang).map((b, i) => <ContinentBadge key={i} {...b} fillable={print} />)}
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <PassHead kicker={P.treasureKicker} title={P.eightHunts} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10 }}>
              {collectionVMs(v, lang).map((b, i) => <CollectionStamp key={i} {...b} />)}
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <PassHead kicker={P.mileKicker} title={P.allTheWay} />
            <MilestoneTrack countriesVisited={countriesVisited} totalPlaces={TOTAL_STOPS} milestones={milestoneVMs(lang)} />
          </div>
          {/* next-badge nudge (print: a how-to-play note) */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: "auto", border: "1.5px solid var(--accent2)", background: "color-mix(in srgb, var(--accent2) 9%, #fff)", padding: "11px 16px" }}>
            <div style={{ width: 42, height: 42, borderRadius: "50%", background: "var(--accent2)", color: "#fff", display: "grid", placeItems: "center", flex: "0 0 auto", fontFamily: FONTS.disp, fontWeight: 800, fontSize: 18 }}>{print ? "✶" : next ? next.remaining : "★"}</div>
            <div>
              <div style={{ fontFamily: FONTS.disp, fontWeight: 700, fontSize: 16, color: "var(--ink)", lineHeight: 1.05 }}>{print ? P.nudge.howToFill : next ? P.nudge.nextRank(tRank(next.title, lang)) : P.nudge.master}</div>
              <div style={{ fontFamily: FONTS.serif, fontStyle: "italic", fontSize: 13, color: "var(--faint)", marginTop: 2 }}>
                {print ? P.nudge.howToFillBody : next ? P.nudge.nextBody(next.remaining, next.at) : P.nudge.masterBody}
              </div>
            </div>
            <div style={{ marginLeft: "auto" }}><CompassMini size={44} /></div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════ CONTINENT DIVIDER ══════════════════ */
const CONTINENT_META: Record<Continent, { accent: string; tint: string; blurb: string; special: string }> = {
  "Asia":          { accent: "#B23A2E", tint: "#F4ECDC", blurb: "The biggest continent of all — home to more people than everywhere else combined.", special: "Tallest mountains, oldest cities, and the most languages on Earth." },
  "Africa":        { accent: "#C97A1E", tint: "#F5ECD8", blurb: "A giant land of deserts, rainforests, and the greatest wild animals anywhere.", special: "The longest river, the biggest desert, and where all humans first came from." },
  "Europe":        { accent: "#2f6b8f", tint: "#EAEFE9", blurb: "Small but packed — castles, fairy tales, and countries you can cross in an hour.", special: "Tiny nations, big history, and trains that zoom between them." },
  "North America": { accent: "#4a7c59", tint: "#EAF0E2", blurb: "From frozen Arctic to steamy jungle, with islands strung across warm seas.", special: "Canyons, volcanoes, and the wildest weather on the planet." },
  "South America": { accent: "#2b9e8f", tint: "#E6F0EA", blurb: "The Amazon, the Andes, and more kinds of creatures than you can count.", special: "The driest desert, the highest waterfall, and the longest mountain chain." },
  "Oceania":       { accent: "#7a5aa6", tint: "#EEEAF2", blurb: "Thousands of islands sprinkled across the world's biggest ocean.", special: "Coral reefs, kangaroos, and beaches that go on forever." },
};

const CONTINENT_SLUG: Record<Continent, string> = {
  "Asia": "asia", "Africa": "africa", "Europe": "europe",
  "North America": "north-america", "South America": "south-america", "Oceania": "oceania",
};

export function ContinentDivider({ continent }: { continent: Continent }) {
  const { lang, ui } = useLang();
  const meta = CONTINENT_META[continent];
  const metaT = CONTINENT_META_T[lang]?.[continent] ?? meta;
  const cname = tContinent(continent, lang);
  const list = BY_CONTINENT[continent];
  const idx = CONTINENT_ORDER.indexOf(continent) + 1;
  const firstStop = STOP_OF[list[0].iso];
  const lastStop = STOP_OF[list[list.length - 1].iso];
  const quizCount = QUIZZES.filter((q) => q.continent === continent).length;
  const titleSize = cname.length > 14 ? 62 : cname.length > 8 ? 86 : 116;
  const vars = { "--accent": meta.accent, "--paper": meta.tint } as React.CSSProperties;
  return (
    <Spread
      vars={vars}
      left={
        <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
          <img src={asset(`/covers/${CONTINENT_SLUG[continent]}.jpg`)} alt={continent} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(20,16,10,.28) 0%, rgba(20,16,10,.30) 42%, rgba(20,16,10,.82) 100%)" }} />
          <div style={{ position: "absolute", inset: 0, padding: "44px 54px", display: "flex", flexDirection: "column", justifyContent: "space-between", color: "#fff" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: FONTS.mono, fontSize: 11, letterSpacing: ".18em", textTransform: "uppercase", color: "#fff", background: "var(--accent)", padding: "4px 12px", borderRadius: 4 }}>{ui.divider.partOf(idx)}</span>
              <span style={{ fontFamily: FONTS.mono, fontSize: 11, letterSpacing: ".18em", textTransform: "uppercase", color: "rgba(255,255,255,.85)" }}>{ui.divider.stops(firstStop, lastStop)}</span>
            </div>
            <div>
              <div style={{ fontFamily: FONTS.mono, fontSize: 16, letterSpacing: ".3em", color: "#fff", textShadow: "0 2px 8px rgba(0,0,0,.5)" }}>{ui.divider.continentN(idx)}</div>
              <h1 style={{ fontFamily: FONTS.disp, fontWeight: 800, fontSize: titleSize, lineHeight: .9, margin: "8px 0 0", letterSpacing: "-.02em", textShadow: "0 4px 22px rgba(0,0,0,.55)" }}>{cname}</h1>
              <p style={{ fontFamily: FONTS.serif, fontSize: 24, lineHeight: 1.45, marginTop: 20, maxWidth: 600, textShadow: "0 2px 10px rgba(0,0,0,.6)" }}>{metaT.blurb}</p>
            </div>
            <div style={{ display: "flex", gap: 30 }}>
              {[[String(list.length), ui.divider.countries], [String(quizCount), quizCount === 1 ? ui.divider.quizStop : ui.divider.quizStops], [`#${idx}`, ui.divider.ofTrip]].map(([n, l]) => (
                <div key={l}>
                  <div style={{ fontFamily: FONTS.disp, fontWeight: 800, fontSize: 52, color: "#fff", lineHeight: 1, textShadow: "0 3px 14px rgba(0,0,0,.5)" }}>{n}</div>
                  <div style={{ fontFamily: FONTS.mono, fontSize: 12, letterSpacing: ".1em", textTransform: "uppercase", color: "rgba(255,255,255,.85)" }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      }
      right={
        <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid var(--accent)", paddingBottom: 10 }}>
            <span style={{ fontFamily: FONTS.disp, fontWeight: 800, fontSize: 28 }}>{ui.divider.countriesAhead}</span>
            <Compass size={46} />
          </div>
          <div style={{ fontFamily: FONTS.serif, fontStyle: "italic", fontSize: 18, color: "var(--accent)", margin: "12px 0 16px" }}>{metaT.special}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: `${list.length > 40 ? 9 : 14}px 26px`, alignContent: "start", flex: 1, overflow: "hidden" }}>
            {list.map((c) => (
              <div key={c.iso} style={{ display: "flex", alignItems: "center", gap: 11, breakInside: "avoid" }}>
                <span style={{ fontFamily: FONTS.mono, fontSize: 11, color: "var(--faint)", width: 30, flex: "0 0 auto" }}>{String(STOP_OF[c.iso]).padStart(3, "0")}</span>
                <img src={flagPath(c.iso)} alt="" style={{ width: 28, height: 19, objectFit: "cover", borderRadius: 2, border: "1px solid var(--line)", flex: "0 0 auto" }} />
                <span style={{ fontFamily: FONTS.disp, fontWeight: 600, fontSize: 17, color: "var(--ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{getCountryLang(c.iso, lang)?.name ?? c.name}</span>
              </div>
            ))}
          </div>
        </div>
      }
    />
  );
}

/* ══════════════════ PLACEHOLDER (page types not yet authored) ══════════════════ */
export function PlaceholderSpread({ title, note }: { title: string; note: string }) {
  return (
    <Spread
      left={
        <div style={{ height: "100%", display: "grid", placeItems: "center", textAlign: "center" }}>
          <div>
            <Compass size={120} />
            <h1 style={{ fontFamily: FONTS.disp, fontWeight: 800, fontSize: 40, marginTop: 20 }}>{title}</h1>
            <div style={{ fontFamily: FONTS.serif, fontStyle: "italic", fontSize: 18, color: "var(--faint)", marginTop: 8, maxWidth: 460 }}>{note}</div>
            <div style={{ fontFamily: FONTS.mono, fontSize: 11, letterSpacing: ".2em", color: "var(--accent)", marginTop: 18 }}>COMING IN THE NEXT BUILD</div>
          </div>
        </div>
      }
      right={<div style={{ height: "100%", display: "grid", placeItems: "center" }}><Tick label="this page is being made" /></div>}
    />
  );
}

/* ══════════════════ PLANET OVERVIEW ══════════════════ */
export function PlanetOverview() {
  const { lang, ui } = useLang();
  const totalCountries = TOTAL_STOPS;
  return (
    <Spread
      left={
        <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: "2px solid var(--accent)", paddingBottom: 10 }}>
            <span style={{ fontFamily: FONTS.disp, fontWeight: 800, fontSize: 28 }}>{ui.planet.title}</span>
            <Tick label={ui.planet.tag} color="var(--accent)" />
          </div>
          <p style={{ fontFamily: FONTS.serif, fontSize: 25, lineHeight: 1.5, marginTop: 20 }}>
            {ui.planet.lead(totalCountries)}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginTop: 24, flex: 1 }}>
            {ui.planet.stats.map(([n, l]) => (
              <div key={l} style={{ border: "1.5px solid var(--line)", background: "rgba(255,255,255,.5)", padding: "22px 24px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <div style={{ fontFamily: FONTS.disp, fontWeight: 800, fontSize: 54, color: "var(--accent)", lineHeight: 1 }}>{n}</div>
                <div style={{ fontFamily: FONTS.mono, fontSize: 14, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--faint)", marginTop: 8 }}>{l}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 18, fontFamily: FONTS.serif, fontStyle: "italic", fontSize: 17, color: "var(--faint)" }}>
            {ui.planet.oceansLine}
          </div>
        </div>
      }
      right={
        <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
          <span style={{ fontFamily: FONTS.disp, fontWeight: 800, fontSize: 32, borderBottom: "2px solid var(--accent)", paddingBottom: 10 }}>{ui.planet.sixTitle}</span>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", marginTop: 22, flex: 1 }}>
            {CONTINENT_ORDER.map((c, i) => {
              const list = BY_CONTINENT[c];
              const pct = Math.round((list.length / TOTAL_STOPS) * 100);
              return (
                <div key={c}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span style={{ fontFamily: FONTS.disp, fontWeight: 700, fontSize: 26 }}>{i + 1}. {tContinent(c, lang)}</span>
                    <span style={{ fontFamily: FONTS.mono, fontSize: 14, color: "var(--faint)" }}>{list.length} {ui.planet.countriesUnit}</span>
                  </div>
                  <div style={{ height: 16, background: "var(--line)", borderRadius: 8, overflow: "hidden", marginTop: 8 }}>
                    <div style={{ width: `${pct * 2.5}%`, maxWidth: "100%", height: "100%", background: "var(--accent)" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      }
    />
  );
}

/* ══════════════════ HOW TO READ ══════════════════ */
export function HowToRead() {
  const prof = useProfile();
  const { ui } = useLang();
  const parts = ui.howto.parts;
  return (
    <Spread
      left={
        <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: "2px solid var(--accent)", paddingBottom: 10 }}>
            <span style={{ fontFamily: FONTS.disp, fontWeight: 800, fontSize: 28 }}>{ui.howto.title}</span>
            <Tick label={ui.howto.guide} color="var(--accent)" />
          </div>
          <p style={{ fontFamily: FONTS.serif, fontSize: 23, lineHeight: 1.5, marginTop: 18 }}>
            {ui.howto.lead}
          </p>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 18, marginTop: 18, flex: 1 }}>
            {parts.map(([t, d], i) => (
              <div key={t} style={{ display: "flex", gap: 16, alignItems: "center", borderBottom: i < parts.length - 1 ? "1px dotted var(--line)" : "none", paddingBottom: 16 }}>
                <span style={{ fontFamily: FONTS.disp, fontWeight: 800, fontSize: 22, color: "#fff", background: "var(--accent)", borderRadius: "50%", width: 42, height: 42, display: "grid", placeItems: "center", flex: "0 0 auto" }}>{i + 1}</span>
                <div>
                  <div style={{ fontFamily: FONTS.disp, fontWeight: 700, fontSize: 25 }}>{t}</div>
                  <div style={{ fontFamily: FONTS.serif, fontSize: 19, color: "var(--faint)", lineHeight: 1.35 }}>{d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      }
      right={
        <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
          <span style={{ fontFamily: FONTS.disp, fontWeight: 800, fontSize: 32, borderBottom: "2px solid var(--accent)", paddingBottom: 10 }}>{ui.howto.quizzesTitle}</span>
          <p style={{ fontFamily: FONTS.serif, fontSize: 23, lineHeight: 1.5, marginTop: 20 }}>
            {ui.howto.quizzesLead}
          </p>
          <div style={{ border: "2px dashed var(--accent)", borderRadius: 12, padding: 28, marginTop: 26, background: "color-mix(in srgb, var(--accent) 6%, #fff)" }}>
            <div style={{ fontFamily: FONTS.disp, fontWeight: 800, fontSize: 26, color: "var(--accent)" }}>{ui.howto.stampsTitle}</div>
            <p style={{ fontFamily: FONTS.serif, fontSize: 20, lineHeight: 1.5, marginTop: 10 }}>
              {ui.howto.stampsBody(TOTAL_STOPS)}
            </p>
          </div>
          <div style={{ marginTop: "auto", fontFamily: FONTS.serif, fontStyle: "italic", fontSize: 20, color: "var(--faint)", textAlign: "center" }}>
            {ui.howto.ready(prof.name)}
          </div>
        </div>
      }
    />
  );
}

/* ══════════════════ SUPERLATIVES (world records) ══════════════════ */
const RECORDS: { title: string; holder: string; iso: string; fact: string }[] = [
  { title: "Biggest country", holder: "Russia", iso: "ru", fact: "17 million km² — spans 11 time zones." },
  { title: "Smallest country", holder: "Vatican City", iso: "va", fact: "Just 0.49 km² — smaller than many parks." },
  { title: "Most people", holder: "India", iso: "in", fact: "Over 1.4 billion people call it home." },
  { title: "Longest river", holder: "Egypt / Nile", iso: "eg", fact: "The Nile runs about 6,650 km." },
  { title: "Tallest mountain", holder: "Nepal / Everest", iso: "np", fact: "Everest reaches 8,849 m into the sky." },
  { title: "Driest desert", holder: "Chile / Atacama", iso: "cl", fact: "Some parts have never seen rain." },
  { title: "Most islands", holder: "Sweden", iso: "se", fact: "Around 270,000 islands dot its coast." },
  { title: "Hottest place", holder: "USA / Death Valley", iso: "us", fact: "Reached a scorching 56.7°C." },
  { title: "Largest rainforest", holder: "Brazil / Amazon", iso: "br", fact: "Home to 10% of all known species." },
  { title: "Highest waterfall", holder: "Venezuela / Angel Falls", iso: "ve", fact: "Water drops 979 m — that's huge!" },
];
export function Superlatives() {
  const { lang, ui } = useLang();
  const rows = RECORDS.map((r, i) => ({ iso: r.iso, ...(RECORDS_T[lang]?.[i] ?? { title: r.title, holder: r.holder, fact: r.fact }) }));
  const half = Math.ceil(rows.length / 2);
  const card = (r: typeof rows[number], key: number) => (
    <div key={key} style={{ display: "flex", gap: 18, alignItems: "center", border: "1.5px solid var(--line)", background: "rgba(255,255,255,.5)", padding: "18px 22px" }}>
      <img src={flagPath(r.iso)} alt="" style={{ width: 64, height: 43, objectFit: "cover", borderRadius: 3, border: "1px solid var(--line)", flex: "0 0 auto" }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: FONTS.mono, fontSize: 12, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--accent)" }}>{r.title}</div>
        <div style={{ fontFamily: FONTS.disp, fontWeight: 700, fontSize: 25, lineHeight: 1.05 }}>{r.holder}</div>
        <div style={{ fontFamily: FONTS.serif, fontSize: 17, color: "var(--faint)", lineHeight: 1.3, marginTop: 2 }}>{r.fact}</div>
      </div>
    </div>
  );
  const head = (t: string, s: string) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: "2px solid var(--accent)", paddingBottom: 10 }}>
      <span style={{ fontFamily: FONTS.disp, fontWeight: 800, fontSize: 32 }}>{t}</span><Tick label={s} color="var(--accent)" />
    </div>
  );
  return (
    <Spread
      left={<div style={{ height: "100%", display: "flex", flexDirection: "column" }}>{head(ui.superlatives.title, ui.superlatives.tag)}<div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", marginTop: 16, flex: 1 }}>{rows.slice(0, half).map((r, i) => card(r, i))}</div></div>}
      right={<div style={{ height: "100%", display: "flex", flexDirection: "column" }}>{head(ui.superlatives.titleR, ui.superlatives.tag)}<div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", marginTop: 16, flex: 1 }}>{rows.slice(half).map((r, i) => card(r, half + i))}</div></div>}
    />
  );
}

/* ══════════════════ GLOSSARY ══════════════════ */
const GLOSSARY: [string, string][] = [
  ["Continent", "One of Earth's 6 huge areas of land, like Asia or Africa."],
  ["Country", "A land with its own government, flag, and borders."],
  ["Capital", "The main city of a country, where its leaders work."],
  ["Currency", "The kind of money people use to buy things."],
  ["Population", "How many people live somewhere."],
  ["Equator", "An imaginary line around the middle of Earth."],
  ["Border", "The line where one country ends and another begins."],
  ["Native language", "The main language people grow up speaking."],
  ["Landmark", "A famous place people travel far to see."],
  ["Ocean", "One of the 5 giant bodies of salt water."],
  ["Peninsula", "Land with water on three sides."],
  ["Archipelago", "A group or chain of many islands."],
];
export function Glossary() {
  const { lang, ui } = useLang();
  const terms = GLOSSARY_T[lang] ?? GLOSSARY;
  const half = Math.ceil(terms.length / 2);
  const list = (slice: [string, string][]) => (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1, marginTop: 18 }}>
      {slice.map(([t, d]) => (
        <div key={t} style={{ borderBottom: "1px dotted var(--line)", paddingBottom: 16 }}>
          <span style={{ fontFamily: FONTS.disp, fontWeight: 800, fontSize: 32, color: "var(--accent)" }}>{t}</span>
          <div style={{ fontFamily: FONTS.serif, fontSize: 23, lineHeight: 1.4, marginTop: 6 }}>{d}</div>
        </div>
      ))}
    </div>
  );
  const head = (t: string) => <span style={{ fontFamily: FONTS.disp, fontWeight: 800, fontSize: 32, borderBottom: "2px solid var(--accent)", paddingBottom: 10, display: "block" }}>{t}</span>;
  return (
    <Spread
      left={<div style={{ height: "100%", display: "flex", flexDirection: "column" }}>{head(ui.glossary.titleL)}{list(terms.slice(0, half))}</div>}
      right={<div style={{ height: "100%", display: "flex", flexDirection: "column" }}>{head(ui.glossary.titleR)}{list(terms.slice(half))}</div>}
    />
  );
}

/* ══════════════════ PASSPORT COMPLETE (full trophy wall) ══════════════════ */
/* the back-matter celebration. Print → the keepsake "all collected" trophy wall; web → live progress. */
const ALL_VISITED: Set<number> = new Set();
SPINE.forEach((p, i) => { if (p.type === "country") ALL_VISITED.add(i + 1); });

export function PassportComplete({ print = false }: { print?: boolean }) {
  const liveV = useVisited();
  const { lang, ui } = useLang();
  const v = print ? ALL_VISITED : liveV;
  const countries = visitedCountryCount(v);
  const earned = badgesEarned(v);
  const prof = useProfile();
  const done = countries >= TOTAL_STOPS;
  return (
    <Spread
      left={
        <div style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center", alignItems: "center" }}>
          <Compass size={150} />
          <h1 style={{ fontFamily: FONTS.disp, fontWeight: 800, fontSize: done ? 70 : 56, margin: "24px 0 0", lineHeight: .95 }}>
            {done ? <>{ui.complete.youDidItPre}<br />{prof.name}!</> : <>{ui.complete.keepGoingPre}<br />{prof.name}!</>}
          </h1>
          <p style={{ fontFamily: FONTS.serif, fontStyle: "italic", fontSize: 24, color: "var(--faint)", marginTop: 18, maxWidth: 520 }}>
            {done ? ui.complete.doneBody(TOTAL_STOPS) : ui.complete.progBody(countries, TOTAL_STOPS)}
          </p>
          {/* big progress ring of countries */}
          <div style={{ display: "flex", gap: 16, marginTop: 26 }}>
            {[[String(countries), ui.complete.ofCountries(TOTAL_STOPS)], [String(earned), ui.complete.ofStamps(TOTAL_BADGES)]].map(([n, l]) => (
              <div key={l} style={{ border: "1.5px solid var(--accent)", borderRadius: 12, padding: "16px 24px", background: "color-mix(in srgb, var(--accent) 7%, #fff)" }}>
                <div style={{ fontFamily: FONTS.disp, fontWeight: 800, fontSize: 48, color: "var(--accent)", lineHeight: 1 }}>{n}</div>
                <div style={{ fontFamily: FONTS.mono, fontSize: 11, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--faint)", marginTop: 6 }}>{l}</div>
              </div>
            ))}
          </div>
          <div style={{ fontFamily: FONTS.mono, fontSize: 15, letterSpacing: ".25em", color: "var(--accent)", marginTop: 26 }}>
            {done ? ui.complete.master : `★ ${tRank(rankFor(countries), lang).toUpperCase()} ★`}
          </div>
        </div>
      }
      right={
        <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: "2px solid var(--accent)", paddingBottom: 10 }}>
            <span style={{ fontFamily: FONTS.disp, fontWeight: 800, fontSize: 30 }}>{ui.complete.stampWall}</span>
            <Tick label={ui.complete.earnedTag(earned, TOTAL_BADGES)} color="var(--accent)" />
          </div>
          <div style={{ fontFamily: FONTS.disp, fontWeight: 800, fontSize: 17, margin: "16px 0 0" }}>{ui.complete.continents}</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 8, marginTop: 12, justifyItems: "center" }}>
            {continentVMs(v, lang).map((b, i) => <ContinentBadge key={i} {...b} />)}
          </div>
          <div style={{ fontFamily: FONTS.disp, fontWeight: 800, fontSize: 17, margin: "18px 0 0" }}>{ui.complete.specialCollections}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10, marginTop: 12 }}>
            {collectionVMs(v, lang).map((b, i) => <CollectionStamp key={i} {...b} />)}
          </div>
          <div style={{ fontFamily: FONTS.disp, fontWeight: 800, fontSize: 17, margin: "18px 0 0" }}>{ui.complete.milestones}</div>
          <MilestoneTrack countriesVisited={countries} totalPlaces={TOTAL_STOPS} milestones={milestoneVMs(lang)} />
        </div>
      }
    />
  );
}

/* ══════════════════ INDEX ══════════════════ */
const PAGE_OF: Record<string, number> = {};
SPINE.forEach((p, i) => { if (p.type === "country" && p.iso) PAGE_OF[p.iso] = i + 1; });
export function BookIndex() {
  const { lang, ui } = useLang();
  type Entry = { iso: string; name: string };
  const sorted: Entry[] = JOURNEY.map((c) => ({ iso: c.iso, name: getCountryLang(c.iso, lang)?.name ?? c.name }))
    .sort((a, b) => a.name.localeCompare(b.name, lang));
  const perCol = Math.ceil(sorted.length / 6);
  const cols: Entry[][] = [];
  for (let i = 0; i < 6; i++) cols.push(sorted.slice(i * perCol, (i + 1) * perCol));
  const colEl = (slice: Entry[]) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 3.5 }}>
      {slice.map((c) => (
        <div key={c.iso} style={{ display: "flex", alignItems: "baseline", gap: 5, fontSize: 11.5 }}>
          <img src={flagPath(c.iso)} alt="" style={{ width: 15, height: 10, objectFit: "cover", borderRadius: 1.5, alignSelf: "center", flex: "0 0 auto" }} />
          <span style={{ fontFamily: FONTS.disp, fontWeight: 600, color: "var(--ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", flex: 1 }}>{titleCaseName(c.name)}</span>
          <span style={{ fontFamily: FONTS.mono, fontSize: 10, color: "var(--faint)" }}>{PAGE_OF[c.iso]}</span>
        </div>
      ))}
    </div>
  );
  const head = (t: string, s: string) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: "2px solid var(--accent)", paddingBottom: 10 }}>
      <span style={{ fontFamily: FONTS.disp, fontWeight: 800, fontSize: 28 }}>{t}</span><Tick label={s} color="var(--accent)" />
    </div>
  );
  return (
    <Spread
      left={<div style={{ height: "100%" }}>{head(ui.index.title, ui.index.az)}<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, marginTop: 14 }}>{cols.slice(0, 3).map((c, i) => <div key={i}>{colEl(c)}</div>)}</div></div>}
      right={<div style={{ height: "100%" }}>{head(ui.index.continued, ui.index.countries(TOTAL_STOPS))}<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, marginTop: 14 }}>{cols.slice(3).map((c, i) => <div key={i}>{colEl(c)}</div>)}</div></div>}
    />
  );
}
function titleCaseName(s: string): string { return s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()); }

/* ══════════════════ TABLE OF CONTENTS (journey order, by continent) ══════════════════ */
/* The printed book's front navigation: every country in trip order with its page number, grouped
   by continent. On screen each row is tappable; in print it's plain. Complements the A–Z BookIndex
   at the back (different ordering — both are standard atlas features). */
const DIVIDER_PAGE: Partial<Record<Continent, number>> = {};
SPINE.forEach((p, i) => { if (p.type === "continent-divider" && p.continent && DIVIDER_PAGE[p.continent] == null) DIVIDER_PAGE[p.continent] = i + 1; });

/* split the 6 continents into two roughly equal halves (by country count) for the two pages */
function tocSplit(): [Continent[], Continent[]] {
  const half = JOURNEY.length / 2;
  const left: Continent[] = [], right: Continent[] = [];
  let acc = 0;
  for (const c of CONTINENT_ORDER) {
    if (acc < half) { left.push(c); acc += BY_CONTINENT[c].length; } else right.push(c);
  }
  return [left, right];
}

export function TableOfContents({ print = false }: { print?: boolean }) {
  const { lang, ui } = useLang();
  const [leftConts, rightConts] = tocSplit();

  const row = (iso: string, name: string) => {
    const page = PAGE_OF_ISO[iso];
    const inner = (
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, padding: "1.6px 0", breakInside: "avoid" }}>
        <span style={{ fontFamily: FONTS.mono, fontSize: 9.5, color: "var(--faint)", width: 24, flex: "0 0 auto" }}>{String(STOP_OF[iso]).padStart(3, "0")}</span>
        <img src={flagPath(iso)} alt="" style={{ width: 16, height: 11, objectFit: "cover", borderRadius: 1.5, border: "1px solid var(--line)", flex: "0 0 auto" }} />
        <span style={{ fontFamily: FONTS.disp, fontWeight: 600, color: "var(--ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", flex: 1 }}>{titleCaseName(name)}</span>
        <span style={{ fontFamily: FONTS.mono, fontSize: 10.5, color: "var(--accent)", flex: "0 0 auto" }}>{page}</span>
      </div>
    );
    return print
      ? <div key={iso}>{inner}</div>
      : <Link key={iso} to={`/book/${page}`} style={{ textDecoration: "none", color: "inherit", display: "block" }}>{inner}</Link>;
  };

  const cols = (conts: Continent[]) => (
    <div style={{ columnCount: 3, columnGap: 22, marginTop: 12 }}>
      {conts.flatMap((c, ci) => [
        <div key={`h-${c}`} style={{ breakInside: "avoid", breakAfter: "avoid", display: "flex", alignItems: "baseline", justifyContent: "space-between", borderBottom: "1.5px solid var(--accent)", margin: ci === 0 ? "0 0 4px" : "11px 0 4px", paddingBottom: 2 }}>
          <span style={{ fontFamily: FONTS.disp, fontWeight: 800, fontSize: 15, color: "var(--accent)" }}>{tContinent(c, lang)}</span>
          <span style={{ fontFamily: FONTS.mono, fontSize: 9, color: "var(--faint)" }}>p.{DIVIDER_PAGE[c]} · {BY_CONTINENT[c].length}</span>
        </div>,
        ...BY_CONTINENT[c].map((country) => row(country.iso, getCountryLang(country.iso, lang)?.name ?? country.name)),
      ])}
    </div>
  );

  const head = (t: string, s: string) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: "2px solid var(--accent)", paddingBottom: 10 }}>
      <span style={{ fontFamily: FONTS.disp, fontWeight: 800, fontSize: 28 }}>{t}</span><Tick label={s} color="var(--accent)" />
    </div>
  );

  return (
    <Spread
      left={<div style={{ height: "100%", display: "flex", flexDirection: "column" }}>{head(ui.toc.title, ui.toc.sub(print))}{cols(leftConts)}</div>}
      right={<div style={{ height: "100%", display: "flex", flexDirection: "column" }}>{head(ui.toc.continued, ui.toc.countries(TOTAL_STOPS))}{cols(rightConts)}</div>}
    />
  );
}
