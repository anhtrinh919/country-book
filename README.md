# World Country Book

A personalised children's atlas — **201 countries**, six continents, one round-the-world trip — published as both an **interactive web reader** and a **printable A3 PDF book** from a single React codebase.

- **Live (web):** https://anhtrinh919.github.io/country-book/
- **Print:** `dist-pdf/book.pdf` (print-grade) and `dist-pdf/book-proof.pdf` (lighter, for sharing)

Each country gets its own A3 two-page spread in a warm "field-journal / explorer" style: flag, quick facts, field notes, seven WOW facts, a mini phrasebook, and photos. Around the countries sit a cover, a personalised Explorer Passport, a how-to-read guide, a Table of Contents, an interactive world map, continent dividers, 17 quiz stops, and back matter (answer key, world records, glossary, an A–Z index).

---

## Quick start

```bash
npm install
npm run dev          # http://localhost:5173/country-book/
```

The reader opens on the cover; on first visit an onboarding card personalises the book (name, age, home country) — saved in the browser. Each visitor gets their own passport and progress.

```bash
npm run build        # static site → dist/
npm run preview      # serve the built site locally
```

## The two outputs

| Output | Route | Built by |
|---|---|---|
| Interactive web reader | `/#/book/:n` | `npm run build` → `dist/` (deployed to GitHub Pages) |
| Printable A3 PDF | `/#/print/:n` (one spread per sheet, no chrome) | `npm run build:pdf*` → `dist-pdf/` |

Both render the **same React components** at the same 1588×1123 (A3 landscape) geometry. The print path strips the reader chrome and swaps interactive-only surfaces for paper-native ones (see [Print adaptations](#print-adaptations)).

## Building the PDF

The PDF builder rasterises each spine page (rendered at `/#/print/:n`) to a JPEG and embeds it as one A3 sheet. **The dev server must be running** (`npm run dev`) in another terminal.

```bash
npm run build:pdf         # print-grade  → dist-pdf/book.pdf       (~144 DPI, large)
npm run build:pdf:proof   # proof copy   → dist-pdf/book-proof.pdf (smaller, for sharing)
npm run build:pdf:all     # both, sequentially
```
Env knobs: `FROM`/`TO` (page range), `JPEG_Q` (quality), `BASE` (target origin), `PRESET=print|proof`.

## Quality gates (overflow = 0)

Every page must fit **exactly** at 1123px with zero clipping. Two Playwright gates enforce this (dev server must be running):

```bash
npm run check:overflow    # the 201 country spreads (/#/raw/:iso)
npm run check:print       # ALL 235 print pages (/#/print/:n) — front + back matter too
```
Both print `[0, 0]` per A4 column when a page fits. `SHOT=1` screenshots any failures to `.out/`.

## Project structure

```
book.config.ts            # the spine: page order, journey order, continents, quiz placement, STOP totals
data/<iso>.json           # one validated record per country (201 files)
src/
  App.tsx                 # router, BookReader (web chrome, responsive/mobile), PrintPage, renderSpinePage
  components/
    CountrySpread.tsx      # the 5-layout country spread (atlas/hero/modular/postcard/timeline) + FitPage auto-scale
    BookPages.tsx          # cover, passport, TableOfContents, dividers, planet overview, superlatives, glossary, index
    WorldMap.tsx           # interactive world-map TOC (react-simple-maps); labelled static map in print
    Quiz.tsx               # quiz stops + shared question generator + back-of-book AnswerKey
  progress.ts             # localStorage visit/badge tracking (web); zero/all states for print
  profile.ts              # explorer identity (name/age/home) + earned rank ladder
  asset.ts                # resolves /public asset paths against the Vite base (sub-path safe)
  tokens.ts               # design tokens (paper, ink, accent, fonts, A3 dimensions)
scripts/
  check-overflow.ts        # country-page overflow gate
  check-print-overflow.ts  # all-page print overflow gate
  build-pdf.ts             # rasterise → merge A3 PDF (print + proof presets)
public/{flags,covers,photos}/   # self-hosted assets
```

## Page system

- **Spread:** 1588×1123px = A3 landscape @96dpi = two A4 pages (794×1123) + a 2px centre fold.
- **Country spreads** use `FitPage`, which transform-scales content to fill each page uniformly (overflow stays 0).
- **Page numbers** are rendered into every page (`SpineFrame`), so they survive to print.
- Design tokens, type scale, and the field-journal voice are shared across every page type.

## Personalisation & progress (web)

- `profile.ts` stores the reader's identity; **rank is earned**, derived from how many countries they've read (Cadet → Scout → … → Master Explorer).
- `progress.ts` records visited pages (a page auto-marks "visited" after 120s, or via the footer toggle). Finishing a continent or a themed collection earns its badge; the Passport reflects it live.
- The printed book bakes in the default explorer (`PERSON` in `book.config.ts`).

## Print adaptations

Interactive surfaces that can't work on paper are replaced, not just disabled:

| Interactive (web) | Print |
|---|---|
| Clickable world map (jump-to-page) | Labelled static atlas map + a real **Table of Contents** (journey order, by continent, with page numbers) |
| Auto-stamping Explorer Passport | **Fill-in-by-hand keepsake** — blank "colour-in" stamp rings, write-in stat blanks, dashed flag slots |
| Tap-to-answer quizzes with live score | Circle-the-answer with `○` marks; results in the back **Answer Key** |
| Footer nav, onboarding, swipe/flip | Removed (paper uses printed page numbers + TOC + A–Z index) |

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds and publishes `dist/` to GitHub Pages. The site is served from the **`/country-book/` sub-path**, so:
- Vite `base` is set to `/country-book/` (keep the repo named `country-book`, or change both together).
- All `/public` asset paths go through `asset()` so they resolve under the sub-path.
- The app uses **hash routing** so deep links and refresh never 404 on Pages.

## Stack

Vite · React 18 · TypeScript · react-router (HashRouter) · react-simple-maps + world-atlas · Playwright (render/screenshot) · pdf-lib (PDF assembly). Notes: rasterised PDF pages have no selectable text or clickable links — fine for a printed book.
