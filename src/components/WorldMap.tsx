/* WorldMap.tsx — the interactive Table-of-Contents map (the explorer's flagship page).
   A full A3 centerfold world map: every country in the book is tinted by continent and
   clickable → a popup shows its name + continent + flag + a "Go to page →" button that
   jumps to its spread. Micro-states too small to have a map shape are reachable from the
   flag strip along the bottom. In print this degrades to a labelled, tinted atlas map. */
import React from "react";
import { useNavigate } from "react-router-dom";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import worldTopo from "world-atlas/countries-110m.json";
import { AT, SPREAD_W, SPREAD_H } from "../tokens";
import { JOURNEY, BY_CONTINENT, CONTINENT_ORDER, STOP_OF, SPINE, type Continent } from "../../book.config";
import { COUNTRIES } from "../data";
import { asset } from "../asset";

const FONTS = { disp: AT.disp, serif: AT.serif, mono: AT.mono };

const CONTINENT_COLOR: Record<Continent, string> = {
  "Asia": "#B23A2E", "Africa": "#C97A1E", "Europe": "#2f6b8f",
  "North America": "#4a7c59", "South America": "#2b9e8f", "Oceania": "#7a5aa6",
};

/* spine page number (1-based) for each country */
const PAGE_OF_ISO: Record<string, number> = {};
SPINE.forEach((p, i) => { if (p.type === "country" && p.iso) PAGE_OF_ISO[p.iso] = i + 1; });

/* normalized world-atlas name → our iso */
const norm = (s: string) => s.toLowerCase().replace(/[^a-z]/g, "");
const NAME_OVERRIDE: Record<string, string> = {
  "bosniaandherz": "ba", "centralafricanrep": "cf", "demrepcongo": "cd", "dominicanrep": "do",
  "eqguinea": "gq", "macedonia": "mk", "papuanewguinea": "pg", "ssudan": "ss",
  "trinidadandtobago": "tt", "unitedarabemirates": "ae", "unitedkingdom": "gb", "unitedstatesofamerica": "us",
};
const NAME_TO_ISO: Record<string, string> = { ...NAME_OVERRIDE };
for (const c of JOURNEY) NAME_TO_ISO[norm(c.name)] = c.iso;
const isoOfGeo = (geoName: string): string | undefined => NAME_TO_ISO[norm(geoName)];

/* micro-states with no shape at 110m resolution — reachable from the flag strip */
const ON_MAP = new Set<string>();
{
  const topoNames = (worldTopo as any).objects.countries.geometries.map((g: any) => g.properties?.name).filter(Boolean);
  for (const n of topoNames) { const iso = isoOfGeo(n); if (iso) ON_MAP.add(iso); }
}
const TINY = JOURNEY.filter((c) => !ON_MAP.has(c.iso));

export function WorldMapTOC({ print }: { print?: boolean }) {
  const nav = useNavigate();
  const [sel, setSel] = React.useState<string | null>(null);
  const goto = (iso: string) => { const n = PAGE_OF_ISO[iso]; if (n && !print) nav(`/book/${n}`); };

  const C = sel ? COUNTRIES[sel] : null;
  const cont = sel ? JOURNEY.find((c) => c.iso === sel)?.continent : null;

  return (
    <div id="spread" style={{ position: "relative", width: SPREAD_W, height: SPREAD_H, background: AT.paper, backgroundImage: "radial-gradient(#cdbfa6 1px, transparent 1.4px)", backgroundSize: "22px 22px", overflow: "hidden", fontFamily: FONTS.serif, color: AT.ink }}>
      {/* header */}
      <div style={{ position: "absolute", top: 30, left: 54, right: 54, display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: `2px solid ${AT.red}`, paddingBottom: 8, zIndex: 3 }}>
        <div>
          <div style={{ fontFamily: FONTS.mono, fontSize: 12, letterSpacing: ".28em", color: AT.red }}>{print ? "MAP OF THE WORLD" : "THE WORLD MAP"}</div>
          <div style={{ fontFamily: FONTS.disp, fontWeight: 800, fontSize: 40, lineHeight: .95 }}>The Whole World, One Map</div>
        </div>
        <div style={{ fontFamily: FONTS.serif, fontStyle: "italic", fontSize: 15, color: AT.faint, textAlign: "right" }}>
          {print ? "Every country, coloured by continent." : "Tap any country to jump to its page →"}
        </div>
      </div>

      {/* legend */}
      <div style={{ position: "absolute", top: 96, left: 54, display: "flex", gap: 14, flexWrap: "wrap", zIndex: 3 }}>
        {CONTINENT_ORDER.map((k) => (
          <span key={k} style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: FONTS.mono, fontSize: 10, color: AT.ink }}>
            <span style={{ width: 12, height: 12, borderRadius: 3, background: CONTINENT_COLOR[k] }} /> {k} · {BY_CONTINENT[k].length}
          </span>
        ))}
      </div>

      {/* the map */}
      <div style={{ position: "absolute", top: 124, left: 54, right: 54, bottom: 126 }}>
        <ComposableMap projection="geoNaturalEarth1" projectionConfig={{ scale: 322, center: [10, 10] }} width={SPREAD_W - 108} height={873} style={{ width: "100%", height: "100%" }}>
          <Geographies geography={worldTopo}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const iso = isoOfGeo(geo.properties.name);
                const inBook = iso && PAGE_OF_ISO[iso] !== undefined;
                const continent = iso ? JOURNEY.find((c) => c.iso === iso)?.continent : null;
                const base = inBook && continent ? CONTINENT_COLOR[continent] : "#d8ccb2";
                const isSel = iso === sel;
                return (
                  <Geography key={geo.rsmKey} geography={geo}
                    onClick={() => inBook && setSel(iso!)}
                    style={{
                      default: { fill: isSel ? AT.ink : base, stroke: AT.paper, strokeWidth: 0.5, outline: "none", opacity: inBook ? 0.92 : 0.5 },
                      hover: { fill: inBook ? AT.ink : base, stroke: AT.paper, strokeWidth: 0.5, outline: "none", cursor: inBook ? "pointer" : "default" },
                      pressed: { fill: AT.ink, outline: "none" },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
        {/* faint ocean labels for orientation (helps the printed map read as an atlas) */}
        {([
          ["PACIFIC OCEAN", "7%", "46%"],
          ["ATLANTIC OCEAN", "41%", "60%"],
          ["INDIAN OCEAN", "66%", "67%"],
          ["PACIFIC OCEAN", "91%", "46%"],
        ] as const).map(([label, left, top], i) => (
          <div key={i} style={{ position: "absolute", left, top, transform: "translate(-50%,-50%)", fontFamily: FONTS.mono, fontSize: 10, letterSpacing: ".18em", color: AT.faint, opacity: .55, pointerEvents: "none", whiteSpace: "nowrap" }}>{label}</div>
        ))}
      </div>

      {/* fold line */}
      <div style={{ position: "absolute", top: 0, bottom: 0, left: SPREAD_W / 2 - 1, width: 2, background: "linear-gradient(#0000,rgba(0,0,0,.14),#0000)", zIndex: 2 }} />

      {/* selected-country popup */}
      {C && cont && (
        <div style={{ position: "absolute", top: 150, right: 60, width: 300, background: "#fff", border: `2px solid ${CONTINENT_COLOR[cont]}`, borderRadius: 12, boxShadow: "0 16px 40px rgba(0,0,0,.28)", padding: 18, zIndex: 5 }}>
          <button onClick={() => setSel(null)} style={{ position: "absolute", top: 8, right: 10, border: "none", background: "none", fontSize: 18, color: AT.faint, cursor: "pointer" }}>×</button>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 64, height: 43, borderRadius: 4, overflow: "hidden", border: "1px solid var(--line)", boxShadow: "0 3px 9px rgba(0,0,0,.16)" }}>
              <img src={asset(C.flag.assetPath)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div>
              <div style={{ fontFamily: FONTS.disp, fontWeight: 800, fontSize: 24, lineHeight: 1 }}>{C.name}</div>
              <div style={{ fontFamily: FONTS.mono, fontSize: 10, letterSpacing: ".1em", color: CONTINENT_COLOR[cont], marginTop: 3 }}>{cont.toUpperCase()} · STOP {STOP_OF[sel!]}</div>
            </div>
          </div>
          <div style={{ fontFamily: FONTS.serif, fontStyle: "italic", fontSize: 13, color: AT.faint, margin: "10px 0 12px" }}>{C.tagline}</div>
          <button onClick={() => goto(sel!)} style={{ width: "100%", background: CONTINENT_COLOR[cont], color: "#fff", border: "none", borderRadius: 8, padding: "10px 0", fontFamily: FONTS.disp, fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
            Go to page {PAGE_OF_ISO[sel!]} →
          </button>
        </div>
      )}

      {/* tiny nations strip */}
      <div style={{ position: "absolute", left: 54, right: 54, bottom: 22, zIndex: 3 }}>
        <div style={{ fontFamily: FONTS.mono, fontSize: 9.5, letterSpacing: ".14em", color: AT.faint, marginBottom: 6 }}>SMALL ISLANDS &amp; MICRO-NATIONS — {print ? "find them in the index" : "tap a flag"}</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 10px" }}>
          {TINY.map((c) => {
            const inner = (
              <>
                <img src={asset(`/flags/${c.iso}.svg`)} alt="" style={{ width: 18, height: 12, objectFit: "cover", borderRadius: 2 }} />
                <span style={{ fontFamily: FONTS.disp, fontWeight: 600, fontSize: 10.5, color: AT.ink }}>{c.name}</span>
                {print && <span style={{ fontFamily: FONTS.mono, fontSize: 9, color: AT.red }}>{PAGE_OF_ISO[c.iso]}</span>}
              </>
            );
            const style = { display: "flex", alignItems: "center", gap: 5, border: `1px solid ${AT.line}`, background: "rgba(255,255,255,.6)", borderRadius: 5, padding: "2px 7px 2px 3px" } as React.CSSProperties;
            return print
              ? <div key={c.iso} style={style}>{inner}</div>
              : <button key={c.iso} onClick={() => setSel(c.iso)} style={{ ...style, cursor: "pointer" }}>{inner}</button>;
          })}
        </div>
      </div>
    </div>
  );
}
