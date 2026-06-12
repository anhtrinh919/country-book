/* book.config.ts — the book constitution (machine-readable spine).
   Single source of truth for: the ordered country journey, continent groups,
   quiz placement, personalization, and the full page sequence used by both the
   interactive site and the PDF builder. */

import manifest from "./book.manifest.json";

export interface ManifestEntry {
  iso: string;
  name: string;
  continent: Continent;
  capital: string;
  region: string;
}

export type Continent = "Asia" | "Africa" | "Europe" | "North America" | "South America" | "Oceania";

export const CONTINENT_ORDER: Continent[] = ["Asia", "Africa", "Europe", "North America", "South America", "Oceania"];

/* Personalization (Momo, 7, Vietnam — journey starts at home). */
export const PERSON = {
  name: "Momo",
  age: 7,
  homeIso: "vn",
} as const;

export const JOURNEY: ManifestEntry[] = manifest as ManifestEntry[];

/* Each country's stop number in the round-the-world series = 1-based journey index. */
export const STOP_OF: Record<string, number> = {};
JOURNEY.forEach((c, i) => { STOP_OF[c.iso] = i + 1; });

/* STOP denominator = number of country spreads. */
export const TOTAL_STOPS = JOURNEY.length;

/* ---------- Layout rotation ----------
   Round-robin the 5 layouts in journey order so consecutive spreads (and neighbours
   within a region) never share a layout, and no continent is uniform. The generator
   owns layout; palette/motif come from the flag/culture (authored per country). */
export type Layout = "atlas" | "hero" | "modular" | "postcard" | "timeline";
const LAYOUT_CYCLE: Layout[] = ["atlas", "hero", "modular", "postcard", "timeline"];
export const LAYOUT_OF: Record<string, Layout> = {};
JOURNEY.forEach((c, i) => { LAYOUT_OF[c.iso] = LAYOUT_CYCLE[i % LAYOUT_CYCLE.length]; });

/* Countries grouped by continent, preserving journey order. */
export const BY_CONTINENT: Record<Continent, ManifestEntry[]> = {
  "Asia": [], "Africa": [], "Europe": [], "North America": [], "South America": [], "Oceania": [],
};
for (const c of JOURNEY) BY_CONTINENT[c.continent].push(c);

/* ---------- Quiz placement ----------
   One quiz every ~12 countries, and always at the end of a continent (so a quiz
   never spans two continents). Each quiz covers the countries since the previous one. */
const QUIZ_EVERY = 12;

export interface QuizStop {
  id: string;            // e.g. "quiz-asia-1"
  continent: Continent;
  afterIso: string;      // appears immediately after this country's spread
  coversIso: string[];   // the countries this quiz draws questions from
  index: number;         // 1-based quiz number across the whole book
}

export const QUIZZES: QuizStop[] = (() => {
  const out: QuizStop[] = [];
  let sinceQuiz: ManifestEntry[] = [];
  let perContinentCount: Record<string, number> = {};
  for (let i = 0; i < JOURNEY.length; i++) {
    const c = JOURNEY[i];
    const next = JOURNEY[i + 1];
    sinceQuiz.push(c);
    const continentEnds = !next || next.continent !== c.continent;
    const hitCadence = sinceQuiz.length >= QUIZ_EVERY;
    // cut a quiz at cadence, or at a continent end if it'd cover a worthwhile chunk
    if (hitCadence || (continentEnds && sinceQuiz.length >= 5)) {
      perContinentCount[c.continent] = (perContinentCount[c.continent] || 0) + 1;
      out.push({
        id: `quiz-${c.continent.toLowerCase().replace(/\s+/g, "-")}-${perContinentCount[c.continent]}`,
        continent: c.continent,
        afterIso: c.iso,
        coversIso: sinceQuiz.map((x) => x.iso),
        index: out.length + 1,
      });
      sinceQuiz = [];
    }
  }
  return out;
})();

/* ---------- Full book spine ----------
   The ordered list of every page in the book, used by site nav + PDF assembly. */
export type PageType =
  | "cover" | "passport" | "how-to-read" | "toc" | "world-map-toc" | "planet-overview"
  | "continent-divider" | "country" | "quiz"
  | "answer-key" | "superlatives" | "glossary" | "passport-complete" | "index";

export interface Page {
  type: PageType;
  iso?: string;        // for country pages
  continent?: Continent; // for dividers / quizzes
  quizId?: string;     // for quiz pages
}

export const SPINE: Page[] = (() => {
  const pages: Page[] = [
    { type: "cover" },
    { type: "passport" },
    { type: "how-to-read" },
    { type: "toc" },
    { type: "world-map-toc" },
    { type: "planet-overview" },
  ];
  const quizByAfter: Record<string, QuizStop[]> = {};
  for (const q of QUIZZES) (quizByAfter[q.afterIso] ||= []).push(q);

  let lastContinent: Continent | null = null;
  for (const c of JOURNEY) {
    if (c.continent !== lastContinent) {
      pages.push({ type: "continent-divider", continent: c.continent });
      lastContinent = c.continent;
    }
    pages.push({ type: "country", iso: c.iso });
    for (const q of quizByAfter[c.iso] || []) pages.push({ type: "quiz", continent: q.continent, quizId: q.id });
  }

  pages.push(
    { type: "answer-key" },
    { type: "superlatives" },
    { type: "glossary" },
    { type: "passport-complete" },
    { type: "index" },
  );
  return pages;
})();
