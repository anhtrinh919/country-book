export const meta = {
  name: "author-asia-pilot",
  description: "Author + fact-check the Asia pilot country records (data-only) for the World Country Book",
  phases: [
    { title: "Author", detail: "research + write each country record to schema (Sonnet)" },
    { title: "Fact-check", detail: "independent verify numbers/claims + tighten to fit (Sonnet)" },
  ],
};

/* Compact JSON Schema mirroring country.schema.json. Structured output enforces the
   FIXED counts + char limits, which is what keeps every spread overflow-safe by construction. */
const PHOTO = {
  type: "object", additionalProperties: false,
  required: ["src", "alt", "caption", "credit"],
  properties: {
    src: { type: "string", description: "EXACT Wikimedia Commons original URL: https://commons.wikimedia.org/wiki/Special:FilePath/<Filename.jpg> — landscape, famous clearly-centered subject." },
    alt: { type: "string" },
    caption: { type: "string", maxLength: 90, description: "Mono caption, lead with SUBJECT in caps." },
    credit: { type: "string", maxLength: 48 },
  },
};
const COUNTRY_SCHEMA = {
  type: "object", additionalProperties: false,
  required: ["name","nativeName","romaji","tagline","region","coords","fileNo","flag","lead","facts","islands","islandsLabel","sections","geo","animals","culture","history","wows","myths","words","photos"],
  properties: {
    name: { type: "string", maxLength: 14, description: "UPPERCASE common name." },
    nativeName: { type: "string", maxLength: 6, description: "Native-script glyph(s) for the emblem disc; if Latin/long, a short symbol or 2-letter code." },
    romaji: { type: "string", maxLength: 16, description: "Local/transliterated name, UPPERCASE." },
    tagline: { type: "string", maxLength: 28 },
    region: { type: "string", maxLength: 28 },
    coords: { type: "string", maxLength: 18, description: "Capital coords e.g. '21°N · 105°E'." },
    fileNo: { type: "string", maxLength: 3 },
    flag: {
      type: "object", additionalProperties: false,
      required: ["assetPath","title","note","keyColor","mastheadMotif"],
      properties: {
        assetPath: { type: "string", description: "Always '/flags/<iso>.svg'." },
        title: { type: "string", maxLength: 18 },
        note: { type: "string", maxLength: 44 },
        keyColor: { type: "string", description: "Flag dominant color hex, e.g. '#DA251D'." },
        mastheadMotif: { type: "string", enum: ["clipped-flag","geometric-emblem"] },
      },
    },
    lead: { type: "string", maxLength: 360, description: "Intro paragraph (drop-cap). ~55-65 words." },
    facts: {
      type: "array", minItems: 6, maxItems: 6,
      description: "EXACTLY 6, in order: Capital, People, Money, Language, Land area, Highest point.",
      items: { type: "object", additionalProperties: false, required: ["label","value","sub"],
        properties: { label: { type: "string", maxLength: 12 }, value: { type: "string", maxLength: 14 }, sub: { type: "string", maxLength: 34 } } },
    },
    islands: { type: "array", minItems: 3, maxItems: 5, items: { type: "string", maxLength: 12 } },
    islandsLabel: { type: "string", maxLength: 22, description: "Heading for the chip row, e.g. 'BIG REGIONS:' or 'MAIN CITIES:'." },
    sections: { type: "object", additionalProperties: false, required: ["geography","animals","culture","history","wows"],
      properties: { geography: { type: "string", maxLength: 30 }, animals: { type: "string", maxLength: 30 }, culture: { type: "string", maxLength: 30 }, history: { type: "string", maxLength: 30 }, wows: { type: "string", maxLength: 30 } } },
    geo: { type: "array", minItems: 2, maxItems: 2, items: { type: "string", maxLength: 320 } },
    animals: { type: "array", minItems: 2, maxItems: 2, items: { type: "string", maxLength: 300 } },
    culture: { type: "array", minItems: 2, maxItems: 2, items: { type: "string", maxLength: 330 } },
    history: { type: "array", minItems: 2, maxItems: 2, items: { type: "string", maxLength: 280 } },
    wows: { type: "array", minItems: 7, maxItems: 7, items: { type: "string", maxLength: 110 } },
    myths: { type: "array", minItems: 2, maxItems: 2, items: { type: "object", additionalProperties: false, required: ["myth","fact"], properties: { myth: { type: "string", maxLength: 60 }, fact: { type: "string", maxLength: 175 } } } },
    words: { type: "array", minItems: 5, maxItems: 5, items: { type: "object", additionalProperties: false, required: ["en","jp","say"], properties: { en: { type: "string", maxLength: 12 }, jp: { type: "string", maxLength: 12 }, say: { type: "string", maxLength: 18 } } } },
    photos: { type: "object", additionalProperties: false, required: ["landmark","animalA","animalB","hero"],
      properties: { landmark: PHOTO, animalA: PHOTO, animalB: PHOTO, hero: PHOTO } },
  },
};

const PILOT = [
  { iso: "vn", name: "Vietnam", capital: "Hanoi", note: "HOME COUNTRY — first stop. Latin name; emblem can be the gold star ★." },
  { iso: "cn", name: "China", capital: "Beijing", note: "Native glyph 中国. Huge, ancient; pandas, Great Wall." },
  { iso: "in", name: "India", capital: "New Delhi", note: "Native glyph भारत (Devanagari). Tigers, Taj Mahal, very populous." },
  { iso: "ae", name: "United Arab Emirates", capital: "Abu Dhabi", note: "name field must be short e.g. 'UAE'. Arabic glyph. Desert, Burj Khalifa, falcons, camels." },
  { iso: "mn", name: "Mongolia", capital: "Ulaanbaatar", note: "Native glyph Cyrillic Монгол or Soyombo. Steppe, eagles, Genghis Khan, horses." },
];

const TONE = `
TONE & STYLE (match the approved Japan reference exactly):
- Audience: a smart, curious 7-year-old. Friendly, concrete, vivid — one clear image per fact. British-ish spelling fine.
- No filler, no "data slop". Every number sanity-checked and current (population WITH census year in the 'sub').
- facts order is FIXED: [Capital, People, Money, Language, Land area, Highest point].
- 'value' fields render NOWRAP — keep them short (e.g. "Yen ¥", "1.4 billion", "377,975 km²").
- sections.* are playful per-country SecHead titles (≤30 chars, nowrap), like Japan's "A land of islands & fire".
- islands[] = 3-5 major regions/states/cities; relabel islandsLabel to fit (e.g. "BIG REGIONS:", "MAIN CITIES:").
- geo/animals/history use colBreak (2 balanced paragraphs); culture is natural 2-col flow (2 balanced paragraphs).
- wows: EXACTLY 7 one-sentence verifiable "WOW" facts.
- myths: EXACTLY 2 popular myths gently corrected — the book's signature trust-builder. Choose real, well-known myths.
- words: 5 phrasebook entries in the country's main language (en label / local word / simple pronunciation).
- flag.assetPath = "/flags/<iso>.svg". flag.keyColor = the flag's dominant hex. mastheadMotif = "geometric-emblem".
- photos: 4 LANDSCAPE Wikimedia Commons images, subject clearly centered: landmark (signature natural/built landmark),
  animalA + animalB (signature animals), hero (iconic modern/transport/architecture scene). Use EXACT Special:FilePath
  URLs for real, famous, well-photographed subjects (these are best-effort; pick the most iconic, commonly-photographed ones).
- Respect EVERY maxLength. If something is too long, tighten the wording — never overflow.
`;

phase("Author");
const records = await pipeline(
  PILOT,
  (c) => agent(
    `Author the complete World Country Book data record for ${c.name} (ISO "${c.iso}", capital ${c.capital}).
Country-specific note: ${c.note}
${TONE}
Return the full record as structured output. Be accurate and verifiable.`,
    { label: `author:${c.iso}`, phase: "Author", model: "sonnet", schema: COUNTRY_SCHEMA }
  ),
  (rec, c) => rec && agent(
    `You are an independent fact-checker for a children's atlas. Here is a drafted record for ${c.name}:
${JSON.stringify(rec)}

Verify and FIX: capital, current population (with a real census/estimate year in 'sub'), currency, main language, land area, highest point, the 2 myths (must be real popular myths + correct facts), and all 7 wows (must be true & verifiable). Keep the friendly 7-year-old tone and RESPECT every char limit. Keep facts order [Capital, People, Money, Language, Land area, Highest point]. Keep flag.assetPath "/flags/${c.iso}.svg".
Return the corrected full record as structured output.`,
    { label: `check:${c.iso}`, phase: "Fact-check", model: "sonnet", schema: COUNTRY_SCHEMA }
  ).then((fixed) => ({ iso: c.iso, record: fixed || rec }))
);

return records.filter(Boolean);
