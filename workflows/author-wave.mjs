export const meta = {
  name: "author-wave",
  description: "Author + fact-check a wave of country records (data-only) for the World Country Book",
  phases: [
    { title: "Author", detail: "research + write each country record to schema (Sonnet)" },
    { title: "Fact-check", detail: "independent verify numbers/claims + tighten to fit (Sonnet)" },
  ],
};

/* `args` = array of { iso, name, capital, region } (or a JSON string of one). */
let LIST = args;
if (typeof LIST === "string") { try { LIST = JSON.parse(LIST); } catch { LIST = []; } }
if (LIST && !Array.isArray(LIST) && Array.isArray(LIST.list)) LIST = LIST.list;
if (!Array.isArray(LIST)) LIST = [];
log(`author-wave: ${LIST.length} countries (argsType=${typeof args})`);

const PHOTO = {
  type: "object", additionalProperties: false, required: ["src", "alt", "caption", "credit"],
  properties: {
    src: { type: "string", description: "EXACT Wikimedia Commons original URL: https://commons.wikimedia.org/wiki/Special:FilePath/<Filename.jpg> — landscape, famous clearly-centered subject." },
    alt: { type: "string" },
    caption: { type: "string", maxLength: 90, description: "Mono caption, MUST lead with the SUBJECT in CAPS, e.g. 'TAJ MAHAL — ...'." },
    credit: { type: "string", maxLength: 48 },
  },
};
const COUNTRY_SCHEMA = {
  type: "object", additionalProperties: false,
  required: ["name","nativeName","romaji","tagline","region","coords","fileNo","langName","motif","theme","flag","lead","facts","islands","islandsLabel","sections","geo","animals","culture","history","wows","myths","words","photos"],
  properties: {
    name: { type: "string", maxLength: 14, description: "UPPERCASE common name." }, nativeName: { type: "string", maxLength: 6 },
    romaji: { type: "string", maxLength: 16 }, tagline: { type: "string", maxLength: 28 },
    region: { type: "string", maxLength: 28 }, coords: { type: "string", maxLength: 18 }, fileNo: { type: "string", maxLength: 3 },
    langName: { type: "string", maxLength: 16, description: "Language shown in the phrasebook tick, e.g. 'Thai', 'Arabic'." },
    motif: { type: "string", enum: ["sun","chevron","tricolore","papel","diamond","dots"], description: "Signature ribbon chosen for cultural fit." },
    theme: { type: "object", additionalProperties: false, required: ["paper","dot","ink","faint","line","accent","accent2"],
      description: "Per-country palette. accent/accent2 from the FLAG; paper/dot/ink/faint/line a warm field-journal tint.",
      properties: { paper: { type: "string" }, dot: { type: "string" }, ink: { type: "string" }, faint: { type: "string" }, line: { type: "string" }, accent: { type: "string" }, accent2: { type: "string" } } },
    flag: { type: "object", additionalProperties: false, required: ["assetPath","title","note","keyColor","mastheadMotif"],
      properties: { assetPath: { type: "string" }, title: { type: "string", maxLength: 18 }, note: { type: "string", maxLength: 44 }, keyColor: { type: "string" }, mastheadMotif: { type: "string", enum: ["clipped-flag","geometric-emblem"] } } },
    lead: { type: "string", maxLength: 340 },
    facts: { type: "array", minItems: 6, maxItems: 6, items: { type: "object", additionalProperties: false, required: ["label","value","sub"], properties: { label: { type: "string", maxLength: 12 }, value: { type: "string", maxLength: 14 }, sub: { type: "string", maxLength: 34 } } } },
    islands: { type: "array", minItems: 3, maxItems: 5, items: { type: "string", maxLength: 12 } },
    islandsLabel: { type: "string", maxLength: 22 },
    sections: { type: "object", additionalProperties: false, required: ["geography","animals","culture","history","wows"], properties: { geography: { type: "string", maxLength: 30 }, animals: { type: "string", maxLength: 30 }, culture: { type: "string", maxLength: 30 }, history: { type: "string", maxLength: 30 }, wows: { type: "string", maxLength: 30 } } },
    geo: { type: "array", minItems: 2, maxItems: 2, items: { type: "string", maxLength: 320 } },
    animals: { type: "array", minItems: 2, maxItems: 2, items: { type: "string", maxLength: 300 } },
    culture: { type: "array", minItems: 2, maxItems: 2, items: { type: "string", maxLength: 330 } },
    history: { type: "array", minItems: 2, maxItems: 2, items: { type: "string", maxLength: 280 } },
    wows: { type: "array", minItems: 7, maxItems: 7, items: { type: "string", maxLength: 110 } },
    myths: { type: "array", minItems: 2, maxItems: 2, items: { type: "object", additionalProperties: false, required: ["myth","fact"], properties: { myth: { type: "string", maxLength: 60 }, fact: { type: "string", maxLength: 175 } } } },
    words: { type: "array", minItems: 5, maxItems: 5, items: { type: "object", additionalProperties: false, required: ["en","jp","say"], properties: { en: { type: "string", maxLength: 12 }, jp: { type: "string", maxLength: 12 }, say: { type: "string", maxLength: 18 } } } },
    photos: { type: "object", additionalProperties: false, required: ["landmark","animalA","animalB","hero"], properties: { landmark: PHOTO, animalA: PHOTO, animalB: PHOTO, hero: PHOTO } },
  },
};

const TONE = `
TONE & STYLE — match the approved Japan reference EXACTLY:
- Audience: a smart, curious 7-year-old. Friendly, concrete, vivid — one clear image per fact. British-ish spelling fine.
- No filler, no "data slop". Every number sanity-checked and current; population WITH a census/estimate year in the 'sub'.
- IMPORTANT — keep prose CONCISE so the page fits: aim for the SHORTER end of each field (write like Japan's calibrated copy, not max-length). geo/animals/history ≈ 250-300 chars each; culture ≈ 280-320; lead ≈ 300.
- facts order FIXED: [Capital, People, Money, Language, Land area, Highest point]. 'value' renders NOWRAP — keep very short.
- sections.* = playful per-country SecHead titles (≤30 chars), like "A land of islands & fire".
- nativeName = native-script glyph(s) for the emblem (≤6 chars); if Latin/long, use the 2-letter ISO (e.g. "VN"). romaji = local/transliterated name in CAPS.
- islands[] = 3-5 major regions/states/cities; relabel islandsLabel to fit (e.g. "BIG REGIONS:", "MAIN CITIES:", "MAIN ISLANDS:").
- geo/animals/history are colBreak (2 balanced paragraphs); culture is natural 2-col flow (2 balanced paragraphs).
- wows: EXACTLY 7 one-sentence verifiable surprises. myths: EXACTLY 2 real popular myths gently corrected.
- words: 5 phrasebook entries in the country's main language (en label / local word / simple pronunciation).
- flag.assetPath = "/flags/<iso>.svg". flag.keyColor = flag's dominant hex. mastheadMotif = "geometric-emblem".
- photos: 4 LANDSCAPE Wikimedia Commons images (landmark, animalA, animalB, hero=iconic modern/transport scene), subject clearly centered; caption leads with SUBJECT in CAPS. Pick the most iconic, commonly-photographed subjects.
- Respect EVERY maxLength. Never overflow — tighten wording instead.

PALETTE & MOTIF (NEW):
- langName = the language for the phrasebook tick (e.g. "Thai", "Arabic", "Aussie English").
- motif = ONE of [sun, chevron, tricolore, papel, diamond, dots], chosen for the country's visual culture (tricolore=strong tricolour flags, papel=Latin-American, sun=solar/star symbolism, diamond=bold geometric, chevron=desert/zigzag, dots=aboriginal/island/playful).
- theme = 7 warm hex colours. accent = the flag's DOMINANT colour; accent2 = the flag's SECOND colour (or a tasteful complement). paper = a light country-specific warm cream/sand/parchment tint (NOT white, NOT saturated); dot = ~2 steps darker than paper; ink = dark warm near-black; faint = muted brown-grey; line = light hairline between paper and dot.
  Reference (Japan): paper #F6EFE1, dot #cdbfa6, ink #2a2420, faint #8a7a5e, line #dccfb4, accent #C0202E, accent2 #23406b.
`;

phase("Author");
const records = await pipeline(
  LIST,
  (c) => agent(
    `Author the complete World Country Book data record for ${c.name} (ISO "${c.iso}", capital ${c.capital}, ${c.region}).
${TONE}
Return the full record as structured output. Be accurate and verifiable. flag.assetPath MUST be "/flags/${c.iso}.svg".`,
    { label: `author:${c.iso}`, phase: "Author", model: "sonnet", schema: COUNTRY_SCHEMA }
  ),
  (rec, c) => rec && agent(
    `Independent fact-check of this children's-atlas record for ${c.name}:
${JSON.stringify(rec)}

Verify & FIX: capital, current population (real year in 'sub'), currency, main language, land area, highest point, the 2 myths (real popular myths + correct facts), all 7 wows (true & verifiable). Keep the friendly 7-year-old tone, keep prose concise (Japan-length, NOT max), respect every char limit, keep facts order [Capital, People, Money, Language, Land area, Highest point], keep flag.assetPath "/flags/${c.iso}.svg".
Return the corrected full record as structured output.`,
    { label: `check:${c.iso}`, phase: "Fact-check", model: "sonnet", schema: COUNTRY_SCHEMA }
  ).then((fixed) => ({ iso: c.iso, record: fixed || rec }))
);

return records.filter(Boolean);
