export const meta = {
  name: "rewrite-wave",
  description: "Rewrite country text for a 7-year-old (EN), then re-translate to Vietnamese",
  phases: [
    { title: "Rewrite", detail: "one Sonnet agent per batch rewrites data/<iso>.json", model: "sonnet" },
    { title: "Translate", detail: "one Sonnet agent per batch rewrites data-vi/<iso>.json from the new English", model: "sonnet" },
  ],
};

/* `args` = { isos: ["mm", "ke", ...], batch?: 10 } (or a JSON string of one). */
let A = args;
if (typeof A === "string") { try { A = JSON.parse(A); } catch { A = {}; } }
const ISOS = Array.isArray(A?.isos) ? A.isos : [];
const SIZE = A?.batch || 10;
const BATCHES = [];
for (let i = 0; i < ISOS.length; i += SIZE) BATCHES.push(ISOS.slice(i, i + SIZE));
log(`rewrite-wave: ${ISOS.length} countries in ${BATCHES.length} batches`);

const FIELDS = "tagline, sections (all 5), lead, geo, animals, culture, history, wows, myths";
const REPORT = {
  type: "object", additionalProperties: false, required: ["done", "mythsReplaced", "testClean", "notes"],
  properties: {
    done: { type: "array", items: { type: "string" }, description: "iso codes fully written" },
    mythsReplaced: { type: "integer", description: "how many myths you replaced with new ones" },
    testClean: { type: "boolean", description: "true if the test shows no failures for your iso codes" },
    notes: { type: "string", description: "anything you could not do, one line each" },
  },
};
const files = (dir, b) => b.map((i) => `${dir}/${i}.json`).join(", ");

const COMMON = `You work in /home/tuananh/dev/country-book. Read workflows/rewrite-style.md first and follow it exactly.
Edit only the files named below. Keep each file valid JSON with 2-space indent and non-ASCII characters as-is.
Change only these fields: ${FIELDS}. Every other field must stay byte-for-byte the same.
When done, run: npx tsx --test --test-reporter=spec src/content.test.ts
Other countries will still fail — ignore them. Fix every failure line that names one of your iso codes, then re-run.`;

const results = await pipeline(
  BATCHES,
  (b, _, i) => agent(
    `${COMMON}

Task: rewrite the English text of these countries: ${files("data", b)}.
Work one country at a time: read the file, rewrite the fields, write it back.
For each myth, compare its answer with the lead, geo, animals, culture, history, wows, and facts. Replace any myth whose answer repeats them.`,
    { label: `en:${b.join(",")}`, phase: "Rewrite", model: "sonnet", schema: REPORT },
  ),
  (en, b) => en && agent(
    `${COMMON}

Task: re-translate into Vietnamese. For each iso, read the new English in data/<iso>.json, then rewrite the same fields in data-vi/<iso>.json from it.
Files to edit: ${files("data-vi", b)}. Do not edit data/.
Follow the Vietnamese section of the style guide. Myth answers must not repeat the Vietnamese page text either (the test checks "vi/<iso>").`,
    { label: `vi:${b.join(",")}`, phase: "Translate", model: "sonnet", schema: REPORT },
  ).then((vi) => ({ batch: b, en, vi })),
);

return results.filter(Boolean);
