# Handoff: World Country Book — A3 Country Spread Template

## Overview
A printable children's reference book for **smart ~7-year-olds**. Each country gets **one A3 landscape spread** (two A4 portrait pages side by side) in a warm **field‑journal / explorer** style. The Japan spread in this bundle is the **reference design and the template**: the goal is to roll the exact same layout out to **all ~195 countries** by swapping in per‑country **data + 4 photos + a flag**.

The spread is intentionally **data‑driven**: a single `Country` data object feeds a fixed layout. Rolling out a new country = author one data record, supply its assets, verify it fits. No bespoke layout work per country.

Reading length target: **~5–7 minutes** (~700–850 words of body copy after the latest trim).

## About the Design Files
The files in this bundle are **design references built in HTML/React (Babel inline JSX)** — a working prototype that shows the intended look, type, spacing and structure. **They are not production code to ship as‑is.** Recreate this design in the target codebase using its established framework and patterns (React/Next, Vue, Svelte, a static site generator, or a print/PDF pipeline). If no environment exists yet, pick the best fit — but note the **primary output is print** (A3 PDF), so a server‑side render → PDF path (e.g. Playwright/Chromium print, or React‑PDF) is ideal. Keep the components data‑driven exactly as documented here.

## Fidelity
**High‑fidelity.** Final colors, fonts, type scale, spacing, and layout are all specified below and should be reproduced precisely. The Japan content is final/approved copy and demonstrates the exact tone and length to match for every other country.

---

## The Page System

- **Spread size:** `1588 × 1123 px` = **A3 landscape at 96 dpi**. This is two A4 portrait pages (`794 × 1123` each) plus a `2px` center fold/gutter.
- **Each page (`794 × 1123`)** padding: `32px 46px 18px` (top, sides, bottom).
- **Page background:** paper `#F0E6D1` with a subtle dot grid — `radial-gradient(#8a7c6322 1px, transparent 1.4px)` at `background-size: 22px 22px`.
- **Fold line:** a 2px vertical strip, `linear-gradient(transparent, rgba(0,0,0,.22), transparent)`.
- **Viewport behavior (screen):** the spread is rendered at fixed `1588×1123` and **scaled to fit** the viewport via `transform: scale()` (letterboxed on `#26221d`). Recompute on resize; cap scale at ~1.2×.
- **Print:** `@page { size: 1588px 1123px; margin: 0 }`, remove the scale transform and shadow, white background. Prints as one A3 sheet per country.

### ⚠️ The hard constraint: every page MUST fit exactly
Both pages are `overflow: hidden` at `1123px` tall. Content must **never** clip. After authoring each country, verify:
```js
const pages = [...document.querySelector('#root').firstElementChild.children];
pages.map(p => p.scrollHeight - p.clientHeight); // must be [0, 0, 0]
```
If a country runs long/short, tune in this order: (1) trim copy to the character limits below, (2) adjust photo heights ±10–20px, (3) adjust section `margin-top` values. Do **not** shrink body text below the type scale (legibility floor for 7‑year‑olds).

---

## Layout — Left Page ("the country")

Top → bottom:

1. **Header bar** — flex space‑between, `border-bottom: 2px solid #2c2620`, `padding-bottom: 7px`.
   - Left: `World Country Book · File No. {fileNo}` (mono tick).
   - Right: `{coords}` (mono tick).
2. **Masthead** (flex, `gap: 20px`, `margin-top: 16px`):
   - **Emblem disc** `100×100`: red sun disc (`#BC002D`) with a faint conic sun‑ray halo behind it (`repeating-conic-gradient(#BC002D22 0 8deg, transparent 8deg 16deg)` masked to a radial fade). Centered native‑script glyph inside (`日本`), Bricolage 38/700 white.
   - **Title block**: `H1` country name (Bricolage 70/800, `line-height:.85`, `letter-spacing:-.02em`); then a nowrap row of `{romaji}` (mono 12, `.24em`, red `#B23A2E`) + `{tagline}` (serif italic 15, faint); then `{region}` mono tick.
3. **Lead + Data panel** — CSS grid `grid-template-columns: 1.35fr 1.08fr`, `gap: 20px`, `align-items: start`, `margin-top: 16px`. (Keep `data-comment-anchor` if present.)
   - **Left column:** lead paragraph (serif **15px**, `line-height:1.42`, justified, drop‑cap first letter Bricolage 46/700 red) **+ "Explorer's Log" ephemera** (see Components → Stamp) filling the remaining column height.
   - **Right column:** the **Data panel** (see Components → DataPanel) including the **flag**.
4. **Geography** section — `SecHead` + 2‑column prose **with `colBreak`** (one paragraph per column) + an **island/region chip row** (`FOUR BIG ISLANDS:` label + chips).
5. **Animals & Nature** section — `SecHead` + 2‑column prose **with `colBreak`**.
6. **Photo strip** — 3‑column grid (`1fr 1fr 1fr`, `gap: 15px`), three `Taped` photos at `h=126`, each slightly rotated. (Default trio: signature landmark, signature animal, a second signature animal/scene.)

## Layout — Right Page ("Field Notes")

1. **Header bar** — `Field Notes` (Bricolage 27/800) + a mono tick (`Culture · history · wonders`).
2. **Culture & Daily Life** — `SecHead` + 2‑column prose (**natural flow, NOT colBreak** — must balance ~2 paragraphs).
3. **Hero photo** — one `Taped` photo at `h=170` (default: transport/iconic modern subject), full width, landscape.
4. **History & Landmarks** — `SecHead` + 2‑column prose **with `colBreak`**.
5. **Myth → Fact** box — `1.5px solid #B23A2E` border, faint fill; a red tick label; a 2‑column grid of exactly **2** myth/fact pairs (myth struck‑through + italic, fact in body serif).
6. **WOW Facts** — `SecHead` + 2‑column list of exactly **7** numbered items (red `01`–`07` + short fact).
7. **Translation log** — red tick label + a 5‑column grid of exactly **5** phrasebook entries (English label / native word / pronunciation).
8. **Compass** — decorative 56px compass rose, absolutely positioned bottom‑right.

---

## Design Tokens

### Color
| Token | Hex | Use |
|---|---|---|
| paper | `#F0E6D1` | page background |
| paper2 | `#E7D9BC` | (reserved) deeper paper |
| ink | `#2c2620` | primary text, rules, dark panel header |
| faint | `#8a7c63` | captions, subs, kickers, dot grid |
| red | `#B23A2E` | accents, kickers, stamp, drop‑cap, WOW numbers, myth border |
| sun | `#BC002D` | flag disc + emblem (this is the **Hinomaru red**; per country this becomes the flag's key color) |
| sea | `#6f8f8a` | low‑chroma secondary accent (optional) |
| line | `#c9ba9a` | column rules, photo frame edge, chip/flag border |

### Type
- **Display:** `Bricolage Grotesque` (700, 800) — masthead, section titles, values, chips, stamp, phrasebook words.
- **Body serif:** `Newsreader` (400, 500; italic 400) — all prose, subs, myth/fact.
- **Mono labels:** `Spline Sans Mono` (400–600) — kickers, ticks, captions, coords, pronunciations.
- Load via Google Fonts. Body copy is **justified** with `hyphens: auto`.

### Type scale (px)
| Element | Font / weight | Size | Notes |
|---|---|---|---|
| Masthead H1 (country) | Bricolage 800 | **70** | line‑height .85; ≤~9 chars at 70px, shrink for longer names |
| Emblem glyph (native) | Bricolage 700 | 38 | white, inside disc |
| romaji | Mono | 12 | `.24em` tracking, red |
| tagline | Serif italic | 15 | faint |
| ticks / kickers / coords | Mono | 10 | `.18em` tracking, uppercase |
| Field Notes header | Bricolage 800 | 27 | |
| Section title (`SecHead`) | Bricolage 700 | **26** | **`white-space: nowrap`** → keep ≤ ~30 chars |
| Lead paragraph | Serif | **15** | drop‑cap 46px red |
| Body prose | Serif | **13.7** | line‑height 1.42, 2 cols, `gap:22`, `column-rule:1px #c9ba9a` |
| Data label | Mono | 9.5 | uppercase, faint |
| Data value | Bricolage 700 | **18** | **`white-space: nowrap`** |
| Data sub | Serif italic | 11.5 | faint, right‑aligned |
| Island/region chip | Bricolage 700 | 12 | 1.5px ink border, radius 999, pad `2px 11px` |
| Stamp | Mono 7.5 + Bricolage 30 (glyph) | — | rotate ‑8°, double red ring |
| Explorer log note | Serif italic | 14 | line‑height 1.4 |
| Photo caption | Mono | 10 | line‑height 1.32; credit 8.5 faint |
| Myth (struck) | Serif italic | 12.5 | line‑through, faint |
| Fact | Serif | 13.3 | line‑height 1.4 |
| WOW number | Bricolage 800 | 14 | red, width 18 |
| WOW text | Serif | 13 | line‑height 1.34 |
| Phrasebook EN | Mono | 9 | uppercase faint |
| Phrasebook word | Bricolage 700 | 16 | |
| Phrasebook pronunciation | Mono | 8.5 | faint |

### Spacing / shape
- Section `margin-top`: left page `16 / 14`; right page `15 / 13 / 13 / 12 / 13 / 12`. `SecHead` `margin-bottom: 7`.
- Photo frame: white card, `padding: 8px 8px 0`, `border-radius: 2`, `box-shadow: 0 8px 18px rgba(40,30,15,.22)`, rotated ±0.8–1.4°, with two translucent "tape" strips (`rgba(214,196,150,.62)`) at top corners. Image inside is `object-fit: cover`.
- Panels/boxes: `1.5px` solid border; fills `rgba(255,255,255,.32–.34)`.

---

## Data Schema (drives everything)

Each country is one record. See `country.schema.json` (JSON Schema with limits) and `data.japan.json` (the filled, approved example). Character limits below are **targets that reliably fit**; the overflow=0 check is the final authority.

| Field | Type | Count | Char limit (each) | Notes |
|---|---|---|---|---|
| `name` | string | 1 | ≤ ~9 (at 70px) | display name, UPPERCASE; auto‑shrink font for longer |
| `nativeName` | string | 1 | 1–3 glyphs ideal | shown in emblem disc; if long/Latin, may repeat `name` or omit |
| `romaji` | string | 1 | ≤ 16 | local/transliterated name |
| `tagline` | string | 1 | ≤ 28 | nickname; nowrap with romaji |
| `region` | string | 1 | ≤ 28 | e.g. "East Asia · Pacific Ocean" |
| `coords` | string | 1 | — | `"36°N · 138°E"` |
| `fileNo` | string | 1 | 2–3 | display index (sequential or ISO‑3166 numeric) |
| `flag` | asset ref | 1 | — | see **Flags** below |
| `lead` | string | 1 | ≤ 360 (~60 words) | intro paragraph, drop‑cap |
| `facts` | object[] | **exactly 6** | label ≤12 · value ≤14 · sub ≤34 | Capital, People, Money, Language, Land area, Highest point. **value is nowrap** |
| `islands` | string[] | 3–5 | ≤ 12 | major regions/states/islands; relabel the heading per country |
| `geo` | string[] | **exactly 2** | ≤ 320 | colBreak (1 per column) — keep the two roughly equal |
| `animals` | string[] | **exactly 2** | ≤ 300 | colBreak |
| `culture` | string[] | **exactly 2** | ≤ 330 | natural 2‑col flow — keep balanced |
| `history` | string[] | **exactly 2** | ≤ 280 | colBreak |
| `wows` | string[] | **exactly 7** | ≤ 110 | one‑sentence "WOW" facts, all fact‑checked |
| `myths` | {myth, fact}[] | **exactly 2** | myth ≤60 · fact ≤175 | the myth‑busting feature (see below) |
| `words` | {en, jp, say}[] | **exactly 5** | en ≤12 · jp ≤12 · say ≤18 | mini phrasebook |
| `sections` titles | — | — | ≤ 30 (nowrap) | the 6 `SecHead` titles are per‑country flavor copy |

**Tone rules (match Japan):** friendly, concrete, second‑person‑lite, British‑ish spelling is fine; one vivid image per fact; numbers always sanity‑checked; no filler. Counts above are **fixed** (6 facts, 2+2+2+2 prose paragraphs, 7 wows, 2 myths, 5 words) so every spread has identical rhythm.

### Editorial requirements (keep in every country)
- **Myth‑busting feature** is mandatory — find 2 popular myths and gently correct them. It's the book's signature trust‑builder.
- **WOW facts** must be verifiable from encyclopedia / official tourism / government sources. No "data slop."
- Always confirm **capital, flag details, current population (with year), language, currency** from reliable sources before publishing.
- Refresh population each printing; cite census year in the `sub`.

---

## Images / Photos

**Count & placement:** 4 photos per spread — 3 in the left photo strip (`h=126`, landscape), 1 hero on the right (`h=170`, landscape).

**Requirements:**
- **Landscape orientation**, subject **clearly visible and centered** (the box crops with `object-fit: cover`). Avoid portrait images in wide frames — they crop to unrecognizable slivers. Choose a clear subject (e.g. a single animal close‑up, not a wide scene).
- **Licensing:** Creative Commons / public domain. Each photo carries a small **credit** caption.
- **Resolution:** ≥ ~1600px on the long edge.

**Sourcing gotcha (Wikimedia Commons — learned the hard way):** when hotlinking via `https://commons.wikimedia.org/wiki/Special:FilePath/<FILENAME>`:
- Use the **original file URL (no `?width=` param)** — thumbnail/scaled requests were blocked in our sandbox and failed to load; **originals load reliably**.
- Lowercase `.jpg` files worked; some uppercase `.JPG` files failed to resolve — prefer `.jpg`.
- For production, **download and self‑host** the assets (don't rely on hotlinking) and keep an attributions file.

**Default subject pattern per country:** [signature natural landmark], [signature animal #1], [signature animal #2 or cultural scene] for the left strip; [iconic transport/architecture/modern scene] for the right hero. (Japan: Mt Fuji, snow monkey, Nara deer; Shinkansen.)

---

## Flags

Japan's flag is a trivial geometric case (white field + red disc) and is drawn in pure CSS by the `Flag` component, and echoed as the masthead emblem disc. **Most countries' flags are not geometric‑trivial** (stripes, stars, crests). For rollout:

- **Data panel flag slot:** use a **real flag asset** — an SVG from a maintained set (e.g. `flag-icons`, or Wikimedia's public‑domain SVG flags) rendered in the same framed box (`~74px` wide, `radius 3`, `1px #c9ba9a` border). Do **not** hand‑draw complex flags as bespoke SVG.
- **Masthead emblem disc:** keep the circular emblem motif, but per country either (a) clip the flag into the circle, or (b) derive a simple geometric motif from the flag's key element + use the flag's dominant color for `sun`/`red` tokens. Pick one approach and apply consistently. (For Japan we used the rising‑sun disc — a natural fit; document each country's choice in its data.)
- Add a `flag.assetPath` + optional `flag.note` (e.g. "a red sun on white · official since 1999") to the schema.

---

## Components Inventory (recreate these)

- **`Tick`** — mono uppercase label, `.18em` tracking, nowrap (kickers, coords, header bits).
- **`SecHead`** — red kicker + Bricolage 26 title (**nowrap**) + a hairline rule that fills remaining width.
- **`Prose`** — justified serif columns. Props: `cols` (1/2), `dropcap`, `size`, `colBreak` (force one paragraph per column for 2‑para sections; **off** for culture so it balances).
- **`DataPanel`** — bordered box: dark mono header → **flag block** (flag + "The Hinomaru" + note) → 6 fact rows (mono label / Bricolage nowrap value / italic right‑aligned sub, dotted dividers).
- **`Taped`** — rotated white photo card with tape strips + mono caption + credit. `object-fit: cover`.
- **`Stamp`** — circular red "rubber stamp" (`116px`, double ring, rotate ‑8°) reading `WORLD COUNTRY BOOK / {nativeGlyph} / {romaji} · No.{fileNo} / ★ FACT‑CHECKED ★`. Part of the Explorer's Log block.
- **`Compass`** — small decorative compass rose (circle + 4 ticks + red diamond + N/E/S/W).
- **`Flag`** — CSS Hinomaru (white card + red disc). **Replace/augment with real flag assets for non‑trivial flags.**
- **`Sun`** — decorative disc + conic ray halo (masthead emblem; generalize per flag).
- **Explorer's Log** — `Stamp` + italic narrative line ("First stop on our trip around the world — N countries still to go!") + a dotted progress trail ("STOP {n} / 195"). Update `n` per country; great cross‑series continuity device.

---

## Assets
- **Fonts:** Google Fonts — Bricolage Grotesque, Newsreader, Spline Sans Mono.
- **Photos:** 4 Creative‑Commons photos per country (see Images). Japan used Wikimedia Commons originals (Mt Fuji, Jigokudani snow monkey, E5 Shinkansen, Nara sika deer). Self‑host + attribute in production.
- **Flags:** real SVG flag set (recommend `flag-icons` or Wikimedia PD SVGs).
- **No raster icons** — all motifs (emblem disc, sun rays, compass, stamp, chips) are CSS/geometry.

## Files in this bundle
- `Japan Country Book.html` — the spread host (fonts, fit‑to‑viewport scaling, print CSS, mounts the React app).
- `japan-shared.jsx` — the **data record** (`JAPAN`) + shared primitives (`Flag`, `Sun`, `PHOTOS`, `CREDIT`). This is the model for one country's data + asset map.
- `japan-atlas.jsx` — the full **Atlas/Explorer layout** (all components above + `AtlasLeft`, `AtlasRight`, `AtlasSpread`). This is the template to generalize.
- `country.schema.json` — JSON Schema for a country record, with field counts and character limits.
- `data.japan.json` — Japan's data as clean JSON (the example payload for the rollout pipeline).

## Recommended rollout shape
1. Lift `japan-atlas.jsx` into a single reusable `CountrySpread` component in the target stack, parameterized by a `Country` object.
2. Author one JSON record per country against `country.schema.json` (the schema enforces counts/limits).
3. Pipeline: validate record → fetch/clip flag SVG → place 4 self‑hosted CC photos → render → **assert overflow=0 on both pages** → export A3 PDF.
4. Editorial pass per country: facts checked against sources, 2 myths chosen, population year current.
