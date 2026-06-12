export const meta = {
  name: "enrich-theme",
  description: "Add v2 palette (theme) + motif + langName to existing country records",
  phases: [{ title: "Theme", detail: "derive flag-palette + motif + langName per country (Sonnet)" }],
};

/* args = [{ iso, name }] */
let LIST = args;
if (typeof LIST === "string") { try { LIST = JSON.parse(LIST); } catch { LIST = []; } }
if (!Array.isArray(LIST)) LIST = [];

const THEME_SCHEMA = {
  type: "object", additionalProperties: false,
  required: ["motif", "langName", "theme"],
  properties: {
    motif: { type: "string", enum: ["sun", "chevron", "tricolore", "papel", "diamond", "dots"] },
    langName: { type: "string", maxLength: 16 },
    theme: {
      type: "object", additionalProperties: false,
      required: ["paper", "dot", "ink", "faint", "line", "accent", "accent2"],
      properties: {
        paper: { type: "string" }, dot: { type: "string" }, ink: { type: "string" },
        faint: { type: "string" }, line: { type: "string" }, accent: { type: "string" }, accent2: { type: "string" },
      },
    },
  },
};

const GUIDE = `
Produce a per-country PALETTE + motif + language label for a children's atlas spread, matching this warm "field-journal" design system.

THEME (7 hex colours) — keep the warm, low-chroma paper family; the two accents come from the country's FLAG:
- accent: the flag's PRIMARY/dominant colour (e.g. Japan #C0202E, Italy green #1E7A43, Brazil #159A4C). Used for spine, rules, drop-cap, stamp, WOW numbers.
- accent2: the flag's SECONDARY colour (or a tasteful complement if the flag is ~one colour). e.g. Japan #23406b, Brazil gold #E0A800.
- paper: a country-specific WARM tint of cream/parchment/sand/ochre — subtle, light, readable (e.g. Japan #F6EFE1, a desert country sandier #F3E7C8, a tropical one #F2ECD9). NOT white, NOT saturated.
- dot: the background dot-grid, ~2 steps darker than paper (e.g. #cdbfa6).
- ink: a dark warm near-black tuned to the paper (e.g. #2a2420).
- faint: muted brown-grey for captions (e.g. #8a7a5e).
- line: a light hairline tint between paper and dot (e.g. #dccfb4).
Reference (Japan): paper #F6EFE1, dot #cdbfa6, ink #2a2420, faint #8a7a5e, line #dccfb4, accent #C0202E, accent2 #23406b.

MOTIF — one of: sun, chevron, tricolore, papel, diamond, dots. Pick for CULTURAL fit, independent of colour:
- tricolore = flags/cultures with strong vertical/horizontal tricolour identity
- papel = Latin-American papel-picado feel
- sun = sun/rising-sun/solar symbolism
- diamond = bold geometric/lozenge cultures
- chevron = arrow/zigzag/desert
- dots = aboriginal/dot-art or playful island cultures
Every country gets a palette of its OWN — do not clone a neighbour's.

langName = the language to show in the phrasebook tick (e.g. "Japanese", "Aussie English", "Thai", "Arabic").
`;

phase("Theme");
const out = await pipeline(
  LIST,
  (c) => agent(
    `Country: ${c.name} (ISO ${c.iso}). Give its palette + motif + language label.
${GUIDE}
Return structured output only.`,
    { label: `theme:${c.iso}`, phase: "Theme", model: "sonnet", schema: THEME_SCHEMA }
  ).then((r) => r && ({ iso: c.iso, ...r }))
);

return out.filter(Boolean);
