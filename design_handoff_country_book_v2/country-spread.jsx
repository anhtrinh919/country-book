/* country-spread.jsx — generalized Atlas/Explorer template.
   Renders ONE A3 spread (1588×1123) from a country data object `C`.
   Per-country palette + motif via C.theme / C.motif, applied through CSS vars
   so every continent reads as its own colour world. Export: CountrySpread. */

const AT = {
  disp: "'Bricolage Grotesque', system-ui, sans-serif",
  serif: "'Newsreader', Georgia, serif",
  mono: "'Spline Sans Mono', ui-monospace, monospace"
};
const PAGE = {
  position: "relative", width: 794, height: 1123, color: "var(--ink)", fontFamily: AT.serif,
  padding: "32px 46px 18px", overflow: "hidden",
  backgroundColor: "var(--paper)",
  backgroundImage: "radial-gradient(var(--dot) 1px, transparent 1.4px)",
  backgroundSize: "22px 22px"
};
const FLAG_BASE = "https://commons.wikimedia.org/wiki/Special:FilePath/";
const flagURL = (f) => FLAG_BASE + encodeURIComponent(f);

/* signature motif ribbon — a thin full-width decorative band per country */
function motifBg(type) {
  const a = "var(--accent)", b = "var(--accent2)";
  switch (type) {
    case "sun": return { height: 9, backgroundImage: `radial-gradient(circle, ${a} 0 2.4px, transparent 3px)`, backgroundSize: "16px 9px", backgroundRepeat: "repeat-x", backgroundPosition: "center" };
    case "chevron": return { height: 9, backgroundImage: `repeating-linear-gradient(135deg, ${a} 0 2px, transparent 2px 7px)` };
    case "tricolore": return { height: 9, backgroundImage: `repeating-linear-gradient(90deg, ${a} 0 15px, transparent 15px 22px, ${b} 22px 37px, transparent 37px 44px)` };
    case "papel": return { height: 11, backgroundImage: `linear-gradient(45deg, transparent 50%, ${a} 50%)`, backgroundSize: "12px 11px", backgroundRepeat: "repeat-x" };
    case "diamond": return { height: 10, backgroundImage: `repeating-linear-gradient(45deg, ${a} 0 5px, transparent 5px 10px), repeating-linear-gradient(-45deg, ${b} 0 5px, transparent 5px 10px)` };
    case "dots": return { height: 9, backgroundImage: `radial-gradient(circle, ${a} 0 2.4px, transparent 3px), radial-gradient(circle, ${b} 0 2.4px, transparent 3px)`, backgroundSize: "18px 9px", backgroundPosition: "0 center, 9px center", backgroundRepeat: "repeat-x" };
    default: return { height: 8, background: a };
  }
}
function Motif({ type }) {
  return <div style={{ ...motifBg(type), marginTop: 4, opacity: .9 }}></div>;
}

function Tick({ label, color, style }) {
  return <span style={{ fontFamily: AT.mono, fontSize: 10, letterSpacing: ".18em", color: color || "var(--faint)", textTransform: "uppercase", whiteSpace: "nowrap", ...style }}>{label}</span>;
}

function SecHead({ kicker, title }) {
  return (
    <div style={{ marginBottom: 7 }}>
      <Tick label={kicker} color="var(--accent)" style={{ display: "block" }} />
      <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
        <h3 style={{ fontFamily: AT.disp, fontWeight: 700, fontSize: 26, margin: "2px 0 0", lineHeight: 1, color: "var(--ink)", whiteSpace: "nowrap" }}>{title}</h3>
        <span style={{ flex: 1, height: 0, borderTop: "2px solid var(--accent)", transform: "translateY(-3px)" }}></span>
      </div>
    </div>);
}

function Prose({ paras, cols = 2, dropcap = false, size = 13.7, gap = 22, colBreak = false }) {
  return (
    <div style={{ columnCount: cols, columnGap: gap, columnRule: cols > 1 ? "1px solid var(--line)" : "none",
      fontFamily: AT.serif, fontSize: size, lineHeight: 1.42, color: "var(--ink)", textAlign: "justify", hyphens: "auto" }}>
      {paras.map((p, i) =>
        <p key={i} style={{ margin: "0 0 8px", breakBefore: colBreak && i > 0 ? "column" : "auto", breakInside: colBreak ? "avoid" : "auto" }}>
          {dropcap && i === 0 ?
            <><span style={{ float: "left", fontFamily: AT.disp, fontWeight: 800, fontSize: 46, lineHeight: .82, color: "var(--accent)", padding: "5px 8px 0 0" }}>{p[0]}</span>{p.slice(1)}</> :
            p}
        </p>
      )}
    </div>);
}

function Compass({ size = 56 }) {
  const arm = (deg) => ({ position: "absolute", left: "50%", top: "50%", width: 1.5, height: size / 2 - 5,
    background: "var(--faint)", transformOrigin: "bottom center", transform: `translate(-50%,-100%) rotate(${deg}deg)`, opacity: .55 });
  return (
    <div style={{ width: size, height: size, position: "relative", borderRadius: "50%", flex: "0 0 auto", border: "1.5px solid var(--faint)", background: "rgba(255,255,255,.25)" }}>
      <div style={{ position: "absolute", inset: 7, borderRadius: "50%", border: "1px dashed var(--faint)" }}></div>
      {[0, 90, 180, 270].map((d) => <div key={d} style={arm(d)}></div>)}
      <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%) rotate(45deg)", width: 11, height: 11, background: "var(--accent)" }}></div>
      {[["N", "6%", "50%"], ["E", "50%", "92%"], ["S", "90%", "50%"], ["W", "50%", "4%"]].map(([t, top, left]) =>
        <span key={t} style={{ position: "absolute", top, left, transform: "translate(-50%,-50%)", fontFamily: AT.disp, fontWeight: 700, fontSize: 9, color: "var(--ink)" }}>{t}</span>
      )}
    </div>);
}

function Roundel({ flag, size = 100 }) {
  return (
    <div style={{ position: "relative", width: size, height: size, flex: "0 0 auto" }}>
      <div style={{ position: "absolute", inset: -16, borderRadius: "50%", background: "repeating-conic-gradient(var(--accent) 0deg 7deg, transparent 7deg 14deg)", opacity: .22, WebkitMaskImage: "radial-gradient(circle,#000 42%,transparent 72%)", maskImage: "radial-gradient(circle,#000 42%,transparent 72%)" }}></div>
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", overflow: "hidden", border: "3px solid #fff", boxShadow: "0 4px 14px rgba(0,0,0,.18), 0 0 0 2px var(--accent)" }}>
        <img src={flagURL(flag)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      </div>
    </div>);
}

function PhotoSlot({ photo, h, rot = 0 }) {
  return (
    <div style={{ position: "relative", background: "#fff", padding: "8px 8px 0", borderRadius: 2, boxShadow: "0 8px 18px rgba(40,30,15,.22)", transform: `rotate(${rot}deg)` }}>
      <div style={{ position: "absolute", top: -9, left: 16, width: 56, height: 18, background: "rgba(214,196,150,.62)", transform: "rotate(-6deg)" }}></div>
      <div style={{ position: "absolute", top: -9, right: 16, width: 56, height: 18, background: "rgba(214,196,150,.62)", transform: "rotate(6deg)" }}></div>
      <div style={{ height: h, overflow: "hidden", background: "#e7ddc8", position: "relative", display: "grid", placeItems: "center" }}>
        {photo.src
          ? <img src={photo.src} alt={photo.alt} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          : <>
              <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(135deg, color-mix(in srgb, var(--accent) 16%, transparent) 0 9px, transparent 9px 18px)" }}></div>
              <div style={{ position: "relative", textAlign: "center", padding: "0 10px" }}>
                <div style={{ fontFamily: AT.mono, fontSize: 8, letterSpacing: ".24em", color: "var(--accent)", marginBottom: 3 }}>◇ PHOTO ◇</div>
                <div style={{ fontFamily: AT.mono, fontSize: 10.5, color: "var(--ink)", lineHeight: 1.3 }}>{photo.alt}</div>
              </div>
            </>}
      </div>
      <div style={{ fontFamily: AT.mono, fontSize: 10, color: "var(--ink)", padding: "6px 3px 6px", lineHeight: 1.32 }}>
        {photo.caption}{photo.credit && <div style={{ fontSize: 8.5, color: "var(--faint)", marginTop: 2 }}>{photo.credit}</div>}
      </div>
    </div>);
}

function Stamp({ C }) {
  return (
    <div style={{ width: 116, height: 116, borderRadius: "50%", border: "2.5px solid var(--accent)", color: "var(--accent)", transform: "rotate(-8deg)", display: "grid", placeItems: "center", textAlign: "center", flex: "0 0 auto", opacity: .92, boxShadow: "inset 0 0 0 4px var(--paper), inset 0 0 0 5.5px var(--accent)" }}>
      <div>
        <div style={{ fontFamily: AT.mono, fontSize: 7.5, letterSpacing: ".16em" }}>WORLD COUNTRY BOOK</div>
        <div style={{ fontFamily: AT.disp, fontWeight: 700, fontSize: 26, lineHeight: 1, margin: "3px 0 2px" }}>{C.stampGlyph || C.romaji}</div>
        <div style={{ fontFamily: AT.mono, fontSize: 7.5, letterSpacing: ".14em" }}>No. {C.fileNo}</div>
        <div style={{ fontFamily: AT.mono, fontSize: 7.5, letterSpacing: ".12em", marginTop: 3 }}>★ FACT-CHECKED ★</div>
      </div>
    </div>);
}

function DataPanel({ C }) {
  return (
    <div style={{ border: "1.5px solid var(--ink)", background: "rgba(255,255,255,.4)" }}>
      <div style={{ fontFamily: AT.mono, fontSize: 9.5, letterSpacing: ".2em", textTransform: "uppercase", color: "#fff", background: "var(--accent)", padding: "5px 14px" }}>Country Data · checked</div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 14px 9px", borderBottom: "1px dotted var(--line)" }}>
        <div style={{ width: 74, height: 49, borderRadius: 3, overflow: "hidden", border: "1px solid var(--line)", boxShadow: "0 4px 12px rgba(0,0,0,.12)", flex: "0 0 auto" }}>
          <img src={flagURL(C.flag.file)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        </div>
        <div>
          <div style={{ fontFamily: AT.mono, fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--faint)" }}>Flag</div>
          <div style={{ fontFamily: AT.disp, fontWeight: 700, fontSize: 16, lineHeight: 1.05 }}>{C.flag.title}</div>
          <div style={{ fontFamily: AT.serif, fontStyle: "italic", fontSize: 11, color: "var(--faint)" }}>{C.flag.note}</div>
        </div>
      </div>
      <div style={{ padding: "3px 14px 5px" }}>
        {C.facts.map((f, i) =>
          <div key={i} style={{ padding: "4px 0", borderBottom: i < C.facts.length - 1 ? "1px dotted var(--line)" : "none" }}>
            <div style={{ fontFamily: AT.mono, fontSize: 9.5, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--faint)" }}>{f.label}</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span style={{ fontFamily: AT.disp, fontWeight: 700, fontSize: 18, lineHeight: 1.1, whiteSpace: "nowrap" }}>{f.value}</span>
              <span style={{ fontFamily: AT.serif, fontStyle: "italic", fontSize: 11.5, color: "var(--faint)", marginLeft: "auto", textAlign: "right", lineHeight: 1.2 }}>{f.sub}</span>
            </div>
          </div>
        )}
      </div>
    </div>);
}

function EdgeSpine({ side }) {
  return <div style={{ position: "absolute", top: 0, bottom: 0, [side]: 0, width: 9, background: "var(--accent)" }}></div>;
}

function AtlasLeft({ C }) {
  return (
    <div style={PAGE}>
      <EdgeSpine side="left" />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: "2px solid var(--accent)", paddingBottom: 7 }}>
        <Tick label={`World Country Book · File No. ${C.fileNo}`} />
        <Tick label={C.coords} />
      </div>
      <Motif type={C.motif} />

      {/* masthead */}
      <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 12 }}>
        <Roundel flag={C.flag.file} size={100} />
        <div>
          <h1 style={{ fontFamily: AT.disp, fontWeight: 800, fontSize: C.titleSize || 70, margin: 0, lineHeight: .85, letterSpacing: "-.02em", color: "var(--ink)" }}>{C.name}</h1>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginTop: 5, whiteSpace: "nowrap" }}>
            <span style={{ fontFamily: AT.mono, fontSize: 12, letterSpacing: ".24em", color: "var(--accent)" }}>{C.romaji}</span>
            <span style={{ fontStyle: "italic", fontSize: 15, color: "var(--faint)" }}>{C.tagline}</span>
          </div>
          <Tick label={C.region} style={{ display: "block", marginTop: 4 }} />
        </div>
      </div>

      {/* lead + data panel */}
      <div style={{ display: "grid", gridTemplateColumns: "1.35fr 1.08fr", gap: 20, marginTop: 14, alignItems: "start" }}>
        <div>
          <Prose paras={[C.lead]} cols={1} dropcap size={15} />
          <div style={{ display: "flex", gap: 16, alignItems: "center", marginTop: 16 }}>
            <Stamp C={C} />
            <div>
              <Tick label="Explorer’s log" color="var(--accent)" style={{ display: "block" }} />
              <div style={{ fontFamily: AT.serif, fontStyle: "italic", fontSize: 14, lineHeight: 1.4, marginTop: 4, color: "var(--ink)" }}>{C.log}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 9 }}>
                {Array.from({ length: 9 }).map((_, i) =>
                  <span key={i} style={{ width: i === 0 ? 9 : 5, height: i === 0 ? 9 : 5, borderRadius: "50%", background: i === 0 ? "var(--accent)" : "var(--line)", flex: "0 0 auto" }}></span>
                )}
                <span style={{ fontFamily: AT.mono, fontSize: 9.5, letterSpacing: ".08em", color: "var(--faint)", marginLeft: 6 }}>STOP {String(C.stop).padStart(2, "0")} / 195</span>
              </div>
            </div>
          </div>
        </div>
        <DataPanel C={C} />
      </div>

      {/* geography */}
      <div style={{ marginTop: 14 }}>
        <SecHead kicker="Geography" title={C.sections.geography} />
        <Prose paras={C.geo} cols={2} colBreak />
        <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginTop: 7, alignItems: "center" }}>
          <span style={{ fontFamily: AT.mono, fontSize: 10, color: "var(--faint)", letterSpacing: ".1em" }}>{C.islandsLabel}</span>
          {C.islands.map((s) =>
            <span key={s} style={{ fontFamily: AT.disp, fontWeight: 700, fontSize: 12, color: "var(--ink)", border: "1.5px solid var(--accent)", background: "color-mix(in srgb, var(--accent) 12%, transparent)", padding: "2px 11px", borderRadius: 999 }}>{s}</span>
          )}
        </div>
      </div>

      {/* animals */}
      <div style={{ marginTop: 11 }}>
        <SecHead kicker="Animals & Nature" title={C.sections.animals} />
        <Prose paras={C.animals} cols={2} colBreak />
      </div>

      {/* photo strip */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 15, marginTop: 10 }}>
        <PhotoSlot photo={C.photos.landmark} h={126} rot={-1.4} />
        <PhotoSlot photo={C.photos.animalA} h={126} rot={1.2} />
        <PhotoSlot photo={C.photos.animalB} h={126} rot={-1} />
      </div>
    </div>);
}

function AtlasRight({ C }) {
  return (
    <div style={PAGE}>
      <EdgeSpine side="right" />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: "2px solid var(--accent)", paddingBottom: 7 }}>
        <span style={{ fontFamily: AT.disp, fontWeight: 800, fontSize: 27, lineHeight: 1, color: "var(--ink)" }}>Field Notes</span>
        <Tick label="Culture · history · wonders" />
      </div>
      <Motif type={C.motif} />

      <div style={{ marginTop: 11 }}>
        <SecHead kicker="Culture & Daily Life" title={C.sections.culture} />
        <Prose paras={C.culture} cols={2} />
      </div>

      <div style={{ marginTop: 12 }}>
        <PhotoSlot photo={C.photos.hero} h={168} rot={-0.8} />
      </div>

      <div style={{ marginTop: 10 }}>
        <SecHead kicker="History & Landmarks" title={C.sections.history} />
        <Prose paras={C.history} cols={2} colBreak />
      </div>

      {/* myth/fact */}
      <div style={{ marginTop: 12, border: "1.5px solid var(--accent)", background: "color-mix(in srgb, var(--accent) 7%, #fff)", padding: "10px 15px" }}>
        <Tick label="Myth → Fact" color="var(--accent)" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginTop: 6 }}>
          {C.myths.map((m, i) =>
            <div key={i}>
              <div style={{ fontFamily: AT.serif, fontStyle: "italic", fontSize: 12.5, color: "var(--faint)", textDecoration: "line-through" }}>“{m.myth}”</div>
              <div style={{ fontFamily: AT.serif, fontSize: 13.3, lineHeight: 1.4, marginTop: 3 }}>{m.fact}</div>
            </div>
          )}
        </div>
      </div>

      {/* wow facts */}
      <div style={{ marginTop: 10 }}>
        <SecHead kicker="WOW Facts · all checked" title={C.sections.wows} />
        <div style={{ columnCount: 2, columnGap: 22, columnRule: "1px solid var(--line)" }}>
          {C.wows.map((w, i) =>
            <div key={i} style={{ display: "flex", gap: 9, breakInside: "avoid", marginBottom: 6 }}>
              <span style={{ fontFamily: AT.disp, fontWeight: 800, fontSize: 14, color: "var(--accent)", flex: "0 0 auto", width: 18 }}>{String(i + 1).padStart(2, "0")}</span>
              <span style={{ fontFamily: AT.serif, fontSize: 13, lineHeight: 1.34 }}>{w}</span>
            </div>
          )}
        </div>
      </div>

      {/* phrasebook */}
      <div style={{ marginTop: 10 }}>
        <Tick label={`Translation log · say it in ${C.langName}`} color="var(--accent)" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 10, marginTop: 6 }}>
          {C.words.map((w, i) =>
            <div key={i} style={{ borderTop: "2px solid var(--accent)", paddingTop: 5 }}>
              <div style={{ fontFamily: AT.mono, fontSize: 9, color: "var(--faint)", textTransform: "uppercase", letterSpacing: ".08em" }}>{w.en}</div>
              <div style={{ fontFamily: AT.disp, fontWeight: 700, fontSize: 16, color: "var(--ink)", lineHeight: 1.1 }}>{w.jp}</div>
              <div style={{ fontFamily: AT.mono, fontSize: 8.5, color: "var(--faint)" }}>{w.say}</div>
            </div>
          )}
        </div>
      </div>

      <div style={{ position: "absolute", right: 26, bottom: 8, opacity: .9 }}><Compass size={56} /></div>
    </div>);
}

/* ============================ shared section helpers ============================ */
function IslandChips({ C }) {
  return (
    <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginTop: 7, alignItems: "center" }}>
      <span style={{ fontFamily: AT.mono, fontSize: 10, color: "var(--faint)", letterSpacing: ".1em" }}>{C.islandsLabel}</span>
      {C.islands.map((s) =>
        <span key={s} style={{ fontFamily: AT.disp, fontWeight: 700, fontSize: 12, color: "var(--ink)", border: "1.5px solid var(--accent)", background: "color-mix(in srgb, var(--accent) 12%, transparent)", padding: "2px 11px", borderRadius: 999 }}>{s}</span>
      )}
    </div>);
}
function MythBox({ C, style }) {
  return (
    <div style={{ border: "1.5px solid var(--accent)", background: "color-mix(in srgb, var(--accent) 7%, #fff)", padding: "10px 15px", ...style }}>
      <Tick label="Myth → Fact" color="var(--accent)" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginTop: 6 }}>
        {C.myths.map((m, i) =>
          <div key={i}>
            <div style={{ fontFamily: AT.serif, fontStyle: "italic", fontSize: 12.5, color: "var(--faint)", textDecoration: "line-through" }}>“{m.myth}”</div>
            <div style={{ fontFamily: AT.serif, fontSize: 13.3, lineHeight: 1.4, marginTop: 3 }}>{m.fact}</div>
          </div>
        )}
      </div>
    </div>);
}
function WowList({ C }) {
  return (
    <div style={{ columnCount: 2, columnGap: 22, columnRule: "1px solid var(--line)" }}>
      {C.wows.map((w, i) =>
        <div key={i} style={{ display: "flex", gap: 9, breakInside: "avoid", marginBottom: 6 }}>
          <span style={{ fontFamily: AT.disp, fontWeight: 800, fontSize: 14, color: "var(--accent)", flex: "0 0 auto", width: 18 }}>{String(i + 1).padStart(2, "0")}</span>
          <span style={{ fontFamily: AT.serif, fontSize: 13, lineHeight: 1.34 }}>{w}</span>
        </div>
      )}
    </div>);
}
function Phrasebook({ C }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 10, marginTop: 6 }}>
      {C.words.map((w, i) =>
        <div key={i} style={{ borderTop: "2px solid var(--accent)", paddingTop: 5 }}>
          <div style={{ fontFamily: AT.mono, fontSize: 9, color: "var(--faint)", textTransform: "uppercase", letterSpacing: ".08em" }}>{w.en}</div>
          <div style={{ fontFamily: AT.disp, fontWeight: 700, fontSize: 16, color: "var(--ink)", lineHeight: 1.1 }}>{w.jp}</div>
          <div style={{ fontFamily: AT.mono, fontSize: 8.5, color: "var(--faint)" }}>{w.say}</div>
        </div>
      )}
    </div>);
}
function PhotoBody({ photo }) {
  if (photo.src) return <img src={photo.src} alt={photo.alt} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />;
  return (
    <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
      <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(135deg, color-mix(in srgb, var(--accent) 16%, transparent) 0 9px, transparent 9px 18px)" }}></div>
      <div style={{ position: "relative", textAlign: "center", padding: "0 10px" }}>
        <div style={{ fontFamily: AT.mono, fontSize: 8, letterSpacing: ".24em", color: "var(--accent)", marginBottom: 3 }}>◇ PHOTO ◇</div>
        <div style={{ fontFamily: AT.mono, fontSize: 10.5, color: "var(--ink)", lineHeight: 1.3 }}>{photo.alt}</div>
      </div>
    </div>);
}
function PhotoBox({ photo, h }) {
  return <div style={{ height: h, position: "relative", overflow: "hidden", background: "#e7ddc8" }}><PhotoBody photo={photo} /></div>;
}
function Card({ label, children, style }) {
  return (
    <div style={{ border: "1.5px solid var(--line)", background: "rgba(255,255,255,.45)", overflow: "hidden", ...style }}>
      {label && <div style={{ fontFamily: AT.mono, fontSize: 8.5, letterSpacing: ".18em", textTransform: "uppercase", color: "#fff", background: "var(--accent)", padding: "4px 12px" }}>{label}</div>}
      <div style={{ padding: label ? "9px 13px" : "13px" }}>{children}</div>
    </div>);
}

/* ============================ HERO layout ============================ */
function HeroBanner({ C }) {
  return (
    <div style={{ borderRadius: 2, overflow: "hidden", boxShadow: "0 10px 24px rgba(40,30,15,.22)", marginTop: 10 }}>
      <PhotoBox photo={C.photos.landmark} h={186} />
      <div style={{ background: "var(--accent)", color: "#fff", padding: "11px 20px", display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", overflow: "hidden", border: "2px solid #fff", flex: "0 0 auto" }}>
          <img src={flagURL(C.flag.file)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <div>
          <h1 style={{ fontFamily: AT.disp, fontWeight: 800, fontSize: C.titleSize ? C.titleSize - 4 : 52, lineHeight: .85, margin: 0, letterSpacing: "-.02em" }}>{C.name}</h1>
          <div style={{ fontFamily: AT.mono, fontSize: 11, letterSpacing: ".18em", marginTop: 4, opacity: .92 }}>{C.romaji} · {C.tagline.toUpperCase()}</div>
        </div>
      </div>
    </div>);
}
function FactsRibbon({ C }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", border: "1.5px solid var(--ink)", marginTop: 12, background: "rgba(255,255,255,.4)" }}>
      {C.facts.map((f, i) =>
        <div key={i} style={{ padding: "7px 13px", borderRight: i % 3 < 2 ? "1px dotted var(--line)" : "none", borderTop: i > 2 ? "1px dotted var(--line)" : "none" }}>
          <div style={{ fontFamily: AT.mono, fontSize: 8.5, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--faint)" }}>{f.label}</div>
          <div style={{ fontFamily: AT.disp, fontWeight: 700, fontSize: 15, lineHeight: 1.1, whiteSpace: "nowrap", color: "var(--ink)" }}>{f.value}</div>
        </div>
      )}
    </div>);
}
function HeroLeft({ C }) {
  return (
    <div style={PAGE}>
      <EdgeSpine side="left" />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: "2px solid var(--accent)", paddingBottom: 7 }}>
        <Tick label={`World Country Book · File No. ${C.fileNo}`} />
        <Tick label={C.coords} />
      </div>
      <HeroBanner C={C} />
      <FactsRibbon C={C} />
      <div style={{ marginTop: 12 }}><Prose paras={[C.lead]} cols={2} dropcap /></div>
      <div style={{ marginTop: 12 }}>
        <SecHead kicker="Geography" title={C.sections.geography} />
        <Prose paras={C.geo} cols={2} colBreak />
        <IslandChips C={C} />
      </div>
      <div style={{ marginTop: 11 }}>
        <SecHead kicker="Animals & Nature" title={C.sections.animals} />
        <Prose paras={C.animals} cols={2} colBreak />
      </div>
    </div>);
}
function HeroRight({ C }) {
  return (
    <div style={PAGE}>
      <EdgeSpine side="right" />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: "2px solid var(--accent)", paddingBottom: 7 }}>
        <span style={{ fontFamily: AT.disp, fontWeight: 800, fontSize: 27, lineHeight: 1, color: "var(--ink)" }}>Field Notes</span>
        <Tick label="Culture · history · wonders" />
      </div>
      <Motif type={C.motif} />
      <div style={{ marginTop: 12 }}>
        <SecHead kicker="Culture & Daily Life" title={C.sections.culture} />
        <Prose paras={C.culture} cols={2} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 12 }}>
        <PhotoSlot photo={C.photos.animalA} h={120} rot={-1.2} />
        <PhotoSlot photo={C.photos.animalB} h={120} rot={1.2} />
      </div>
      <div style={{ marginTop: 12 }}>
        <SecHead kicker="History & Landmarks" title={C.sections.history} />
        <Prose paras={C.history} cols={2} colBreak />
      </div>
      <MythBox C={C} style={{ marginTop: 12 }} />
      <div style={{ marginTop: 11 }}>
        <SecHead kicker="WOW Facts · all checked" title={C.sections.wows} />
        <WowList C={C} />
      </div>
      <div style={{ marginTop: 10 }}>
        <Tick label={`Translation log · say it in ${C.langName}`} color="var(--accent)" />
        <Phrasebook C={C} />
      </div>
      <div style={{ position: "absolute", right: 26, bottom: 8, opacity: .9 }}><Compass size={56} /></div>
    </div>);
}

/* ============================ MODULAR layout ============================ */
function ModularLeft({ C }) {
  return (
    <div style={PAGE}>
      <EdgeSpine side="left" />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: "2px solid var(--accent)", paddingBottom: 7 }}>
        <Tick label={`World Country Book · File No. ${C.fileNo}`} />
        <Tick label={C.coords} />
      </div>
      <Motif type={C.motif} />
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 10, border: "1.5px solid var(--line)", background: "rgba(255,255,255,.45)", padding: "12px 16px" }}>
        <Roundel flag={C.flag.file} size={84} />
        <div>
          <h1 style={{ fontFamily: AT.disp, fontWeight: 800, fontSize: C.titleSize ? C.titleSize - 8 : 56, lineHeight: .85, margin: 0, letterSpacing: "-.02em", color: "var(--ink)" }}>{C.name}</h1>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 4, whiteSpace: "nowrap" }}>
            <span style={{ fontFamily: AT.mono, fontSize: 11, letterSpacing: ".22em", color: "var(--accent)" }}>{C.romaji}</span>
            <span style={{ fontStyle: "italic", fontSize: 14, color: "var(--faint)" }}>{C.tagline}</span>
          </div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1.04fr 1fr", gap: 12, marginTop: 12, alignItems: "start" }}>
        <DataPanel C={C} />
        <Card label="Welcome">
          <Prose paras={[C.lead]} cols={1} dropcap size={13.2} />
        </Card>
      </div>
      <Card label="Geography" style={{ marginTop: 12 }}>
        <Prose paras={C.geo} cols={2} colBreak />
        <IslandChips C={C} />
      </Card>
      <Card label="Animals & Nature" style={{ marginTop: 11 }}>
        <Prose paras={C.animals} cols={2} colBreak />
      </Card>
    </div>);
}
function ModularRight({ C }) {
  return (
    <div style={PAGE}>
      <EdgeSpine side="right" />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: "2px solid var(--accent)", paddingBottom: 7 }}>
        <span style={{ fontFamily: AT.disp, fontWeight: 800, fontSize: 27, lineHeight: 1, color: "var(--ink)" }}>Field Notes</span>
        <Tick label="Culture · history · wonders" />
      </div>
      <Motif type={C.motif} />
      <Card label="Culture & Daily Life" style={{ marginTop: 11 }}>
        <Prose paras={C.culture} cols={2} />
      </Card>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 11 }}>
        {[C.photos.landmark, C.photos.animalA, C.photos.hero].map((p, i) =>
          <div key={i} style={{ border: "1.5px solid var(--line)", background: "#fff", padding: 5 }}>
            <PhotoBox photo={p} h={92} />
            <div style={{ fontFamily: AT.mono, fontSize: 8.5, color: "var(--ink)", padding: "5px 2px 2px", lineHeight: 1.25 }}>{p.alt}</div>
          </div>
        )}
      </div>
      <Card label="History & Landmarks" style={{ marginTop: 11 }}>
        <Prose paras={C.history} cols={2} colBreak />
      </Card>
      <MythBox C={C} style={{ marginTop: 11 }} />
      <Card label="WOW Facts · all checked" style={{ marginTop: 11 }}>
        <WowList C={C} />
      </Card>
      <div style={{ marginTop: 11 }}>
        <Tick label={`Translation log · say it in ${C.langName}`} color="var(--accent)" />
        <Phrasebook C={C} />
      </div>
      <div style={{ position: "absolute", right: 26, bottom: 8, opacity: .9 }}><Compass size={56} /></div>
    </div>);
}

/* ============================ POSTCARD layout ============================ */
function PostcardMast({ C }) {
  return (
    <div style={{ background: "var(--accent)", color: "#fff", padding: "14px 22px", display: "flex", alignItems: "center", gap: 18, marginTop: 10, boxShadow: "0 8px 20px rgba(40,30,15,.2)" }}>
      <div style={{ width: 66, height: 66, borderRadius: "50%", overflow: "hidden", border: "3px solid #fff", flex: "0 0 auto" }}>
        <img src={flagURL(C.flag.file)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div>
        <h1 style={{ fontFamily: AT.disp, fontWeight: 800, fontSize: C.titleSize ? C.titleSize - 6 : 58, lineHeight: .85, margin: 0, letterSpacing: "-.02em" }}>{C.name}</h1>
        <div style={{ fontFamily: AT.mono, fontSize: 10.5, letterSpacing: ".16em", marginTop: 5, opacity: .92 }}>{C.romaji} · {C.tagline.toUpperCase()} · {C.region.toUpperCase()}</div>
      </div>
    </div>);
}
function StampPhoto({ photo, h, rot = 0 }) {
  return (
    <div style={{ position: "relative", transform: `rotate(${rot}deg)` }}>
      <div style={{ background: "#fff", padding: 6, border: "1px solid var(--line)", boxShadow: "0 6px 16px rgba(40,30,15,.2)" }}>
        <div style={{ border: "2px dotted var(--faint)", padding: 3 }}>
          <div style={{ height: h, position: "relative", overflow: "hidden", background: "#e7ddc8" }}><PhotoBody photo={photo} /></div>
        </div>
        <div style={{ fontFamily: AT.mono, fontSize: 8.5, color: "var(--ink)", padding: "5px 2px 1px", lineHeight: 1.25 }}>{photo.alt}</div>
      </div>
      <div style={{ position: "absolute", top: -10, right: -8, width: 40, height: 40, borderRadius: "50%", border: "1.5px dashed var(--accent)", color: "var(--accent)", transform: "rotate(-12deg)", display: "grid", placeItems: "center", background: "color-mix(in srgb, var(--paper) 78%, transparent)" }}>
        <div style={{ fontFamily: AT.mono, fontSize: 6, letterSpacing: ".08em", textAlign: "center", lineHeight: 1.1 }}>AIR<br />MAIL</div>
      </div>
    </div>);
}
function PostcardLeft({ C }) {
  return (
    <div style={PAGE}>
      <EdgeSpine side="left" />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: "2px solid var(--accent)", paddingBottom: 7 }}>
        <Tick label={`World Country Book · File No. ${C.fileNo}`} /><Tick label={C.coords} />
      </div>
      <Motif type={C.motif} />
      <PostcardMast C={C} />
      <div style={{ marginTop: 12 }}><Prose paras={[C.lead]} cols={2} dropcap /></div>
      <FactsRibbon C={C} />
      <div style={{ marginTop: 12 }}><SecHead kicker="Geography" title={C.sections.geography} /><Prose paras={C.geo} cols={2} colBreak /><IslandChips C={C} /></div>
      <div style={{ marginTop: 11 }}><SecHead kicker="Animals & Nature" title={C.sections.animals} /><Prose paras={C.animals} cols={2} colBreak /></div>
    </div>);
}
function PostcardRight({ C }) {
  return (
    <div style={PAGE}>
      <EdgeSpine side="right" />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: "2px solid var(--accent)", paddingBottom: 7 }}>
        <span style={{ fontFamily: AT.disp, fontWeight: 800, fontSize: 27, lineHeight: 1, color: "var(--ink)" }}>Field Notes</span>
        <Tick label="Postcards · culture · wonders" />
      </div>
      <Motif type={C.motif} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginTop: 16 }}>
        <StampPhoto photo={C.photos.landmark} h={94} rot={-1.6} />
        <StampPhoto photo={C.photos.animalA} h={94} rot={1.4} />
        <StampPhoto photo={C.photos.hero} h={94} rot={-1} />
      </div>
      <div style={{ marginTop: 16 }}><SecHead kicker="Culture & Daily Life" title={C.sections.culture} /><Prose paras={C.culture} cols={2} /></div>
      <div style={{ marginTop: 11 }}><SecHead kicker="History & Landmarks" title={C.sections.history} /><Prose paras={C.history} cols={2} colBreak /></div>
      <MythBox C={C} style={{ marginTop: 11 }} />
      <div style={{ marginTop: 11 }}><SecHead kicker="WOW Facts · all checked" title={C.sections.wows} /><WowList C={C} /></div>
      <div style={{ marginTop: 10 }}><Tick label={`Translation log · say it in ${C.langName}`} color="var(--accent)" /><Phrasebook C={C} /></div>
      <div style={{ position: "absolute", right: 26, bottom: 8, opacity: .9 }}><Compass size={56} /></div>
    </div>);
}

/* ============================ TIMELINE layout ============================ */
function TLEntry({ n, kicker, title, children, last }) {
  return (
    <div style={{ position: "relative", paddingLeft: 28, marginLeft: 9, borderLeft: last ? "2px solid transparent" : "2px solid var(--accent)", paddingBottom: last ? 0 : 13 }}>
      <div style={{ position: "absolute", left: -12, top: -3, width: 23, height: 23, borderRadius: "50%", background: "var(--accent)", color: "#fff", display: "grid", placeItems: "center", fontFamily: AT.disp, fontWeight: 800, fontSize: 11 }}>{n}</div>
      <Tick label={kicker} color="var(--accent)" style={{ display: "block" }} />
      <h3 style={{ fontFamily: AT.disp, fontWeight: 700, fontSize: 22, margin: "1px 0 0", lineHeight: 1, color: "var(--ink)" }}>{title}</h3>
      <div style={{ marginTop: 5 }}>{children}</div>
    </div>);
}
function TimelineLeft({ C }) {
  return (
    <div style={PAGE}>
      <EdgeSpine side="left" />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: "2px solid var(--accent)", paddingBottom: 7 }}>
        <Tick label={`World Country Book · File No. ${C.fileNo}`} /><Tick label={C.coords} />
      </div>
      <Motif type={C.motif} />
      <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 12 }}>
        <Roundel flag={C.flag.file} size={90} />
        <div>
          <h1 style={{ fontFamily: AT.disp, fontWeight: 800, fontSize: C.titleSize || 64, lineHeight: .85, margin: 0, letterSpacing: "-.02em", color: "var(--ink)" }}>{C.name}</h1>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 4, whiteSpace: "nowrap" }}>
            <span style={{ fontFamily: AT.mono, fontSize: 11, letterSpacing: ".22em", color: "var(--accent)" }}>{C.romaji}</span>
            <span style={{ fontStyle: "italic", fontSize: 14, color: "var(--faint)" }}>{C.tagline}</span>
          </div>
          <Tick label={C.region} style={{ display: "block", marginTop: 3 }} />
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1.35fr 1.08fr", gap: 20, marginTop: 13, alignItems: "start" }}>
        <Prose paras={[C.lead]} cols={1} dropcap size={14} />
        <DataPanel C={C} />
      </div>
      <div style={{ marginTop: 13 }}>
        <TLEntry n="1" kicker="Geography" title={C.sections.geography}><Prose paras={C.geo} cols={2} colBreak /><IslandChips C={C} /></TLEntry>
        <TLEntry n="2" kicker="Animals & Nature" title={C.sections.animals} last><Prose paras={C.animals} cols={2} colBreak /></TLEntry>
      </div>
    </div>);
}
function TimelineRight({ C }) {
  return (
    <div style={PAGE}>
      <EdgeSpine side="right" />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: "2px solid var(--accent)", paddingBottom: 7 }}>
        <span style={{ fontFamily: AT.disp, fontWeight: 800, fontSize: 27, lineHeight: 1, color: "var(--ink)" }}>Field Notes</span>
        <Tick label="A journey through the country" />
      </div>
      <Motif type={C.motif} />
      <div style={{ marginTop: 13 }}>
        <TLEntry n="3" kicker="Culture & Daily Life" title={C.sections.culture}><Prose paras={C.culture} cols={2} /></TLEntry>
        <TLEntry n="4" kicker="History & Landmarks" title={C.sections.history}><Prose paras={C.history} cols={2} colBreak /></TLEntry>
        <TLEntry n="5" kicker="WOW Facts · all checked" title={C.sections.wows} last><WowList C={C} /></TLEntry>
      </div>
      <div style={{ marginTop: 12 }}><PhotoSlot photo={C.photos.hero} h={132} rot={-0.6} /></div>
      <MythBox C={C} style={{ marginTop: 11 }} />
      <div style={{ marginTop: 10 }}><Tick label={`Translation log · say it in ${C.langName}`} color="var(--accent)" /><Phrasebook C={C} /></div>
      <div style={{ position: "absolute", right: 26, bottom: 8, opacity: .9 }}><Compass size={56} /></div>
    </div>);
}

/* ============================ dispatcher ============================ */
const LAYOUTS = {
  atlas: [AtlasLeft, AtlasRight],
  hero: [HeroLeft, HeroRight],
  modular: [ModularLeft, ModularRight],
  postcard: [PostcardLeft, PostcardRight],
  timeline: [TimelineLeft, TimelineRight]
};
function CountrySpread({ C }) {
  const t = C.theme;
  const vars = {
    "--paper": t.paper, "--dot": t.dot, "--ink": t.ink, "--faint": t.faint,
    "--line": t.line, "--accent": t.accent, "--accent2": t.accent2
  };
  const [Lft, Rgt] = LAYOUTS[C.layout] || LAYOUTS.atlas;
  return (
    <div style={{ display: "flex", width: 1588, height: 1123, background: "#000", ...vars }}>
      <Lft C={C} />
      <div style={{ width: 2, background: "linear-gradient(#0000,rgba(0,0,0,.22),#0000)" }}></div>
      <Rgt C={C} />
    </div>);
}

Object.assign(window, { CountrySpread });
