/* japan-atlas.jsx — Atlas / Explorer field journal · text-rich edition
   A3 spread (1588×1123) = two A4 pages. ~1,000-word, 5–10 min read.
   Reads data/components from window. */
const { PHOTOS: PH, CREDIT: CR, JAPAN: JP, Flag } = window;

const AT = {
  paper: "#F0E6D1", paper2: "#E7D9BC", ink: "#2c2620", faint: "#8a7c63",
  red: "#B23A2E", sun: "#BC002D", sea: "#6f8f8a", line: "#c9ba9a",
  disp: "'Bricolage Grotesque', system-ui, sans-serif",
  serif: "'Newsreader', Georgia, serif",
  mono: "'Spline Sans Mono', ui-monospace, monospace"
};
const PAGE = {
  position: "relative", width: 794, height: 1123, color: AT.ink, fontFamily: AT.serif,
  padding: "32px 46px 18px", overflow: "hidden",
  backgroundColor: AT.paper,
  backgroundImage: `radial-gradient(${AT.faint}22 1px, transparent 1.4px)`,
  backgroundSize: "22px 22px"
};

function Tick({ label, style }) {
  return <span style={{ fontFamily: AT.mono, fontSize: 10, letterSpacing: ".18em", color: AT.faint, textTransform: "uppercase", whiteSpace: "nowrap", ...style }}>{label}</span>;
}

function SecHead({ kicker, title }) {
  return (
    <div style={{ marginBottom: 7 }}>
      <Tick label={kicker} style={{ color: AT.red, display: "block" }} />
      <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
        <h3 style={{ fontFamily: AT.disp, fontWeight: 700, fontSize: 26, margin: "2px 0 0", lineHeight: 1, color: AT.ink, whiteSpace: "nowrap" }}>{title}</h3>
        <span style={{ flex: 1, height: 0, borderTop: `1px solid ${AT.ink}`, transform: "translateY(-3px)" }}></span>
      </div>
    </div>);

}

function Prose({ paras, cols = 2, dropcap = false, size = 13.7, gap = 22, colBreak = false }) {
  return (
    <div style={{ columnCount: cols, columnGap: gap, columnRule: cols > 1 ? `1px solid ${AT.line}` : "none",
      fontFamily: AT.serif, fontSize: size, lineHeight: 1.42, color: AT.ink, textAlign: "justify", hyphens: "auto" }}>
      {paras.map((p, i) =>
      <p key={i} style={{ margin: "0 0 8px", breakBefore: colBreak && i > 0 ? "column" : "auto", breakInside: colBreak ? "avoid" : "auto" }}>
          {dropcap && i === 0 ?
        <><span style={{ float: "left", fontFamily: AT.disp, fontWeight: 700, fontSize: 46, lineHeight: .82, color: AT.red, padding: "5px 8px 0 0" }}>{p[0]}</span>{p.slice(1)}</> :
        p}
        </p>
      )}
    </div>);

}

function Compass({ size = 62 }) {
  const arm = (deg) => ({ position: "absolute", left: "50%", top: "50%", width: 1.5, height: size / 2 - 5,
    background: AT.faint, transformOrigin: "bottom center", transform: `translate(-50%,-100%) rotate(${deg}deg)`, opacity: .55 });
  return (
    <div style={{ width: size, height: size, position: "relative", borderRadius: "50%", flex: "0 0 auto",
      border: `1.5px solid ${AT.faint}`, background: "rgba(255,255,255,.25)" }}>
      <div style={{ position: "absolute", inset: 7, borderRadius: "50%", border: `1px dashed ${AT.faint}88` }}></div>
      {[0, 90, 180, 270].map((d) => <div key={d} style={arm(d)}></div>)}
      <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%) rotate(45deg)", width: 11, height: 11, background: AT.red }}></div>
      {[["N", "6%", "50%"], ["E", "50%", "92%"], ["S", "90%", "50%"], ["W", "50%", "4%"]].map(([t, top, left]) =>
      <span key={t} style={{ position: "absolute", top, left, transform: "translate(-50%,-50%)", fontFamily: AT.disp, fontWeight: 700, fontSize: 9, color: AT.ink }}>{t}</span>
      )}
    </div>);

}

function Stamp() {
  return (
    <div style={{ width: 116, height: 116, borderRadius: "50%", border: `2.5px solid ${AT.red}`,
      color: AT.red, transform: "rotate(-8deg)", display: "grid", placeItems: "center", textAlign: "center",
      flex: "0 0 auto", opacity: .9, boxShadow: `inset 0 0 0 4px ${AT.paper}, inset 0 0 0 5.5px ${AT.red}` }}>
      <div>
        <div style={{ fontFamily: AT.mono, fontSize: 7.5, letterSpacing: ".16em" }}>WORLD COUNTRY BOOK</div>
        <div style={{ fontFamily: AT.disp, fontWeight: 700, fontSize: 30, lineHeight: 1, margin: "3px 0 2px" }}>日本</div>
        <div style={{ fontFamily: AT.mono, fontSize: 7.5, letterSpacing: ".14em" }}>NIPPON · No. 081</div>
        <div style={{ fontFamily: AT.mono, fontSize: 7.5, letterSpacing: ".12em", marginTop: 3 }}>★ FACT-CHECKED ★</div>
      </div>
    </div>);

}

function Taped({ src, alt, h, cap, credit, rot = 0 }) {
  return (
    <div style={{ position: "relative", background: "#fff", padding: "8px 8px 0", borderRadius: 2,
      boxShadow: "0 8px 18px rgba(40,30,15,.22)", transform: `rotate(${rot}deg)` }}>
      <div style={{ position: "absolute", top: -9, left: 16, width: 56, height: 18, background: "rgba(214,196,150,.62)", transform: "rotate(-6deg)" }}></div>
      <div style={{ position: "absolute", top: -9, right: 16, width: 56, height: 18, background: "rgba(214,196,150,.62)", transform: "rotate(6deg)" }}></div>
      <div style={{ height: h, overflow: "hidden", background: "#ccc" }}>
        <img src={src} alt={alt} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      </div>
      <div style={{ fontFamily: AT.mono, fontSize: 10, color: AT.ink, padding: "6px 3px 6px", lineHeight: 1.32 }}>
        {cap}{credit && <div style={{ fontSize: 8.5, color: AT.faint, marginTop: 2 }}>{credit}</div>}
      </div>
    </div>);

}

function DataPanel() {
  return (
    <div style={{ border: `1.5px solid ${AT.ink}`, background: "rgba(255,255,255,.34)" }}>
      <div style={{ fontFamily: AT.mono, fontSize: 9.5, letterSpacing: ".2em", textTransform: "uppercase", color: "#fff", background: AT.ink, padding: "5px 14px" }}>Country Data · checked</div>
      {/* flag */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 14px 9px", borderBottom: `1px dotted ${AT.faint}88` }}>
        <Flag w={74} radius={3} ring={AT.line} />
        <div>
          <div style={{ fontFamily: AT.mono, fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", color: AT.faint }}>Flag</div>
          <div style={{ fontFamily: AT.disp, fontWeight: 700, fontSize: 16, lineHeight: 1.05 }}>The Hinomaru</div>
          <div style={{ fontFamily: AT.serif, fontStyle: "italic", fontSize: 11, color: AT.faint }}>a red sun on white · official since 1999</div>
        </div>
      </div>
      <div style={{ padding: "3px 14px 5px" }}>
        {JP.facts.map((f, i) =>
        <div key={i} style={{ padding: "4px 0", borderBottom: i < JP.facts.length - 1 ? `1px dotted ${AT.faint}88` : "none" }}>
            <div style={{ fontFamily: AT.mono, fontSize: 9.5, letterSpacing: ".1em", textTransform: "uppercase", color: AT.faint }}>{f.label}</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span style={{ fontFamily: AT.disp, fontWeight: 700, fontSize: 18, lineHeight: 1.1, whiteSpace: "nowrap" }}>{f.value}</span>
              <span style={{ fontFamily: AT.serif, fontStyle: "italic", fontSize: 11.5, color: AT.faint, marginLeft: "auto", textAlign: "right", lineHeight: 1.2 }}>{f.sub}</span>
            </div>
          </div>
        )}
      </div>
    </div>);

}

function AtlasLeft() {
  return (
    <div style={PAGE}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: `2px solid ${AT.ink}`, paddingBottom: 7 }}>
        <Tick label={`World Country Book · File No. ${JP.fileNo}`} />
        <Tick label={JP.coords} />
      </div>

      {/* hero */}
      <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 16 }}>
        <div style={{ position: "relative", width: 100, height: 100, flex: "0 0 auto" }}>
          <div style={{ position: "absolute", inset: -16, borderRadius: "50%", background: `repeating-conic-gradient(${AT.sun}22 0deg 8deg, transparent 8deg 16deg)`, WebkitMaskImage: "radial-gradient(circle,#000 42%,transparent 72%)", maskImage: "radial-gradient(circle,#000 42%,transparent 72%)" }}></div>
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: AT.sun }}></div>
          <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", fontFamily: AT.disp, fontWeight: 700, fontSize: 38, color: "#fff" }}>{JP.kana}</div>
        </div>
        <div>
          <h1 style={{ fontFamily: AT.disp, fontWeight: 800, fontSize: 70, margin: 0, lineHeight: .85, letterSpacing: "-.02em" }}>JAPAN</h1>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginTop: 5, whiteSpace: "nowrap" }}>
            <span style={{ fontFamily: AT.mono, fontSize: 12, letterSpacing: ".24em", color: AT.red }}>{JP.romaji}</span>
            <span style={{ fontStyle: "italic", fontSize: 15, color: AT.faint }}>{JP.tagline}</span>
          </div>
          <Tick label={JP.region} style={{ display: "block", marginTop: 4 }} />
        </div>
      </div>

      {/* lead + data panel */}
      <div style={{ display: "grid", gridTemplateColumns: "1.35fr 1.08fr", gap: 20, marginTop: 16, alignItems: "start" }}>
        <div>
          <Prose paras={[JP.lead]} cols={1} dropcap size={15} />
          {/* explorer's log — fills the column, ties into the 195-country series */}
          <div style={{ display: "flex", gap: 16, alignItems: "center", marginTop: 18 }}>
            <Stamp />
            <div>
              <Tick label="Explorer’s log" style={{ color: AT.red, display: "block" }} />
              <div style={{ fontFamily: AT.serif, fontStyle: "italic", fontSize: 14, lineHeight: 1.4, marginTop: 4, color: AT.ink }}>
                “First stop on our trip around the world — <strong style={{ fontStyle: "normal", fontWeight: 600 }}>194 countries</strong> still to go!”
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 9 }}>
                {Array.from({ length: 9 }).map((_, i) =>
                  <span key={i} style={{ width: i === 0 ? 9 : 5, height: i === 0 ? 9 : 5, borderRadius: "50%", background: i === 0 ? AT.red : `${AT.faint}66`, flex: "0 0 auto" }}></span>
                )}
                <span style={{ fontFamily: AT.mono, fontSize: 9.5, letterSpacing: ".08em", color: AT.faint, marginLeft: 6 }}>STOP 01 / 195</span>
              </div>
            </div>
          </div>
        </div>
        <DataPanel />
      </div>

      {/* geography */}
      <div style={{ marginTop: 16 }}>
        <SecHead kicker="Geography" title="A land of islands & fire" />
        <Prose paras={JP.geo} cols={2} colBreak />
        <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginTop: 7, alignItems: "center" }}>
          <span style={{ fontFamily: AT.mono, fontSize: 10, color: AT.faint, letterSpacing: ".1em" }}>FOUR BIG ISLANDS:</span>
          {JP.islands.map((s) =>
          <span key={s} style={{ fontFamily: AT.disp, fontWeight: 700, fontSize: 12, border: `1.5px solid ${AT.ink}`, padding: "2px 11px", borderRadius: 999 }}>{s}</span>
          )}
        </div>
      </div>

      {/* animals */}
      <div style={{ marginTop: 14 }}>
        <SecHead kicker="Animals & Nature" title="Bathing monkeys & bowing deer" />
        <Prose paras={JP.animals} cols={2} colBreak />
      </div>

      {/* photo strip */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 15, marginTop: 14 }}>
        <Taped src={PH.fuji} alt="Mount Fuji reflected in a lake" h={126} rot={-1.4} credit={CR.fuji}
        cap="MT FUJI — 3,776 m, the tallest peak and a sacred volcano." />
        <Taped src={PH.monkey} alt="Snow monkey in a hot spring" h={126} rot={1.2} credit={CR.monkey}
        cap="SNOW MONKEYS bathe in Nagano’s hot springs in winter." />
        <Taped src={PH.deer} alt="A sika deer in Nara Park" h={126} rot={-1} credit={CR.deer}
        cap="SIKA DEER in Nara bow to ask for crackers." />
      </div>
    </div>);

}

function AtlasRight() {
  return (
    <div style={PAGE}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: `2px solid ${AT.ink}`, paddingBottom: 7 }}>
        <span style={{ fontFamily: AT.disp, fontWeight: 800, fontSize: 27, lineHeight: 1 }}>Field Notes</span>
        <Tick label="Culture · history · wonders" />
      </div>

      {/* culture */}
      <div style={{ marginTop: 15 }}>
        <SecHead kicker="Culture & Daily Life" title="Blossoms, sushi & sumo" />
        <Prose paras={JP.culture} cols={2} />
      </div>

      {/* train photo */}
      <div style={{ marginTop: 13 }}>
        <Taped src={PH.train} alt="E5 Shinkansen bullet train" h={170} rot={-0.8} credit={CR.train}
        cap="THE SHINKANSEN — Japan’s Hayabusa “bullet train” runs at 320 km/h and is famous for arriving on time to the second." />
      </div>

      {/* history */}
      <div style={{ marginTop: 13 }}>
        <SecHead kicker="History & Landmarks" title="Samurai, ninja & emperors" />
        <Prose paras={JP.history} cols={2} colBreak />
      </div>

      {/* myth/fact */}
      <div style={{ marginTop: 12, border: `1.5px solid ${AT.red}`, background: "rgba(255,255,255,.32)", padding: "10px 15px" }}>
        <Tick label="Myth → Fact" style={{ color: AT.red }} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginTop: 6 }}>
          {JP.myths.map((m, i) =>
          <div key={i}>
              <div style={{ fontFamily: AT.serif, fontStyle: "italic", fontSize: 12.5, color: AT.faint, textDecoration: "line-through" }}>“{m.myth}”</div>
              <div style={{ fontFamily: AT.serif, fontSize: 13.3, lineHeight: 1.4, marginTop: 3 }}>{m.fact}</div>
            </div>
          )}
        </div>
      </div>

      {/* wow facts */}
      <div style={{ marginTop: 13 }}>
        <SecHead kicker="WOW Facts · all checked" title="Seven true surprises" />
        <div style={{ columnCount: 2, columnGap: 22, columnRule: `1px solid ${AT.line}` }}>
          {JP.wows.map((w, i) =>
          <div key={i} style={{ display: "flex", gap: 9, breakInside: "avoid", marginBottom: 6 }}>
              <span style={{ fontFamily: AT.disp, fontWeight: 800, fontSize: 14, color: AT.red, flex: "0 0 auto", width: 18 }}>{String(i + 1).padStart(2, "0")}</span>
              <span style={{ fontFamily: AT.serif, fontSize: 13, lineHeight: 1.34 }}>{w}</span>
            </div>
          )}
        </div>
      </div>

      {/* phrasebook */}
      <div style={{ marginTop: 12 }}>
        <Tick label="Translation log · say it in Japanese" style={{ color: AT.red }} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 10, marginTop: 6 }}>
          {JP.words.map((w, i) =>
          <div key={i} style={{ borderTop: `2px solid ${AT.ink}`, paddingTop: 5 }}>
              <div style={{ fontFamily: AT.mono, fontSize: 9, color: AT.faint, textTransform: "uppercase", letterSpacing: ".08em" }}>{w.en}</div>
              <div style={{ fontFamily: AT.disp, fontWeight: 700, fontSize: 16, color: AT.ink, lineHeight: 1.1 }}>{w.jp}</div>
              <div style={{ fontFamily: AT.mono, fontSize: 8.5, color: AT.faint }}>{w.say}</div>
            </div>
          )}
        </div>
      </div>

      <div style={{ position: "absolute", right: 26, bottom: 8, opacity: .9 }}><Compass size={56} /></div>
    </div>);

}

function AtlasSpread() {
  return (
    <div style={{ display: "flex", width: 1588, height: 1123, background: "#000" }}>
      <AtlasLeft />
      <div style={{ width: 2, background: "linear-gradient(#0000,rgba(0,0,0,.22),#0000)" }}></div>
      <AtlasRight />
    </div>);

}

Object.assign(window, { AtlasSpread });