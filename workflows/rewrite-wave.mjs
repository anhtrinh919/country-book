export const meta = {
  name: "rewrite-wave",
  description: "Rewrite English country text for a 7-year-old (Vietnamese stays as-is)",
  phases: [
    { title: "Rewrite", detail: "one Sonnet agent per batch rewrites data/<iso>.json", model: "sonnet" },
  ],
};

/* `args` = { isos: ["mm", "ke", ...], batch?: 10, note?: "extra instruction" } (or a JSON string of one). */
let A = args;
if (typeof A === "string") { try { A = JSON.parse(A); } catch { A = {}; } }
const ISOS = Array.isArray(A?.isos) ? A.isos : [];
const SIZE = A?.batch || 10;
const NOTE = A?.note ? `\n\nAlso: ${A.note}` : "";
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

const COMMON = (b) => `You work in /home/tuananh/dev/country-book. Read workflows/rewrite-style.md first and follow it exactly.
Edit only the files named below. Keep each file valid JSON with 2-space indent and non-ASCII characters as-is.
Change only these fields: ${FIELDS}. Every other field must stay byte-for-byte the same.
When done, run: npx tsx --test --test-reporter=spec src/content.test.ts
Other countries may still fail — ignore them. Fix every failure line that names one of your iso codes, then re-run.
Keep any helper scripts in your own folder, /tmp/rewrite-${b[0]}/, never a shared one.`;

const results = await parallel(BATCHES.map((b) => () => agent(
    `${COMMON(b)}

Task: rewrite the English text of these countries: ${files("data", b)}.
Work one country at a time: read the file, rewrite the fields, write it back.
For each myth, compare its answer with the lead, geo, animals, culture, history, wows, and facts. Replace any myth whose answer repeats them.${NOTE}`,
    { label: `en:${b.join(",")}`, phase: "Rewrite", model: "sonnet", schema: REPORT },
  ).then((en) => ({ batch: b, en }))));

return results.filter(Boolean);
