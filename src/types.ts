/* Country record — mirrors design_handoff_country_book/country.schema.json.
   ajv validates the JSON against that schema; this type is the editor-time mirror. */

export interface Photo {
  src: string;
  alt: string;
  caption: string; // ≤90, lead with SUBJECT in caps
  credit: string; // ≤48
}

export interface Fact {
  label: string; // ≤12
  value: string; // ≤14, NOWRAP
  sub: string; // ≤34
}

export interface Myth {
  myth: string; // ≤60
  fact: string; // ≤175
}

export interface Word {
  en: string; // ≤12
  jp: string; // ≤12 — local-language word
  say: string; // ≤18 — pronunciation
}

export interface Flag {
  assetPath: string;
  title: string; // ≤18
  note: string; // ≤44
  keyColor?: string; // flag dominant color → emblem/sun token
  mastheadMotif?: "clipped-flag" | "geometric-emblem";
}

export interface Sections {
  geography: string;
  animals: string;
  culture: string;
  history: string;
  wows: string;
}

export type Layout = "atlas" | "hero" | "modular" | "postcard" | "timeline";
export type Motif = "sun" | "chevron" | "tricolore" | "papel" | "diamond" | "dots";

/* Per-country palette (CSS variables). accent/accent2 come from the flag;
   paper/dot/ink/faint/line are a warm field-journal tint tuned to the country. */
export interface Theme {
  paper: string;
  dot: string;
  ink: string;
  faint: string;
  line: string;
  accent: string;
  accent2: string;
}

export interface Country {
  name: string; // UPPERCASE, ≤14
  nativeName: string; // emblem glyph, ≤6
  romaji: string; // ≤16
  tagline: string; // ≤28
  region: string; // ≤28
  coords: string; // ≤18
  fileNo: string; // ≤3
  langName: string; // ≤16 — language shown in the phrasebook tick
  layout: Layout; // which template renders this country (rotated by the generator)
  motif: Motif; // signature ribbon, chosen for cultural fit
  theme: Theme; // per-country palette (flag-derived accents + warm tint)
  titleSize?: number; // optional masthead px override for long names
  flag: Flag;
  lead: string; // ≤360
  facts: Fact[]; // exactly 6
  islands: string[]; // 3–5
  islandsLabel?: string;
  sections: Sections;
  geo: string[]; // exactly 2
  animals: string[]; // exactly 2
  culture: string[]; // exactly 2
  history: string[]; // exactly 2
  wows: string[]; // exactly 7
  myths: Myth[]; // exactly 2
  words: Word[]; // exactly 5
  photos?: { landmark: Photo; animalA: Photo; animalB: Photo; hero: Photo };
  stop?: number; // position in the around-the-world series
}

/* Personalization + series config injected at render (not part of the country record). */
export interface SeriesCtx {
  stop: number; // this country's stop number
  total: number; // denominator (final country count)
  explorerName?: string; // son's name, if personalizing
}
