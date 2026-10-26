import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";

// Round 2 voice rules (workflows/rewrite-style.md): short sentences, short pages, myths that teach something new.
const load = (dir: string) =>
  Object.fromEntries(
    readdirSync(dir).filter((f) => f.endsWith(".json")).map((f) => [f.slice(0, -5), JSON.parse(readFileSync(`${dir}/${f}`, "utf8"))]),
  );
const EN = load("data");
const VI = load("data-vi");

const body = (c: any): string[] => [c.lead, ...c.geo, ...c.animals, ...c.culture, ...c.history, ...c.wows];
const prose = (c: any): string[] => [...body(c), ...c.myths.flatMap((m: any) => [m.myth, m.fact])];
const words = (s: string) => s.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w));
// split after . ! ? only when a new sentence starts, so "5.5 m" and "St. Lucia" stay whole
const sentences = (s: string) => s.split(/(?<=[.!?])\s+(?=["“'(]?[\p{Lu}\p{N}])/u).filter((x) => words(x).length);
const grams = (s: string, n = 5) => {
  const w = words(s.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " "));
  return w.slice(0, Math.max(0, w.length - n + 1)).map((_, i) => w.slice(i, i + n).join(" "));
};
const mythRepeats = (c: any) => {
  const seen = new Set(body(c).flatMap((s) => grams(s)));
  return c.myths.filter((m: any) => grams(m.fact).some((g) => seen.has(g))).map((m: any) => m.myth);
};

const LIMITS: Record<string, number> = { tagline: 28, lead: 340, geo: 320, animals: 300, culture: 330, history: 280, wows: 110 };

test("English fields stay inside their length limits", () => {
  const bad: string[] = [];
  for (const [iso, c] of Object.entries(EN)) {
    for (const [k, max] of Object.entries(LIMITS))
      for (const s of [c[k]].flat()) if (s.length > max) bad.push(`${iso}.${k} ${s.length}>${max}`);
    for (const [k, s] of Object.entries(c.sections)) if ((s as string).length > 30) bad.push(`${iso}.sections.${k}`);
    for (const m of c.myths) if (m.myth.length > 60 || m.fact.length > 175) bad.push(`${iso}.myths`);
  }
  assert.ok(!bad.length, "\n" + bad.join("\n")); // full list, so no failure gets cut off
});

test("English sentences are short: average 11 words or less, none over 20", () => {
  const bad: string[] = [];
  for (const [iso, c] of Object.entries(EN)) {
    const ss = prose(c).flatMap(sentences);
    const avg = ss.reduce((n, s) => n + words(s).length, 0) / ss.length;
    if (avg > 11) bad.push(`${iso} avg ${avg.toFixed(1)}`);
    for (const s of ss) if (words(s).length > 20) bad.push(`${iso}: ${s}`);
  }
  assert.ok(!bad.length, "\n" + bad.join("\n")); // full list, so no failure gets cut off
});

test("each English country page has 380 words or less", () => {
  const bad = Object.entries(EN)
    .map(([iso, c]) => [iso, prose(c).flatMap(words).length] as const)
    .filter(([, n]) => n > 380);
  assert.ok(!bad.length, "\n" + bad.join("\n")); // full list, so no failure gets cut off
});

// Vietnamese text stays as-is this round (user's call), so only English is checked
test("no myth answer repeats a 5-word run from its own page", () => {
  const bad: string[] = [];
  for (const [iso, c] of Object.entries(EN)) for (const m of mythRepeats(c)) bad.push(`${iso}: ${m}`);
  assert.ok(!bad.length, "\n" + bad.join("\n")); // full list, so no failure gets cut off
});

test("Vietnamese has the same number of items as English", () => {
  const shape = (c: any) => [c.geo, c.animals, c.culture, c.history, c.wows, c.myths].map((a) => a.length).join(",");
  const bad = Object.keys(EN).filter((iso) => !VI[iso] || shape(VI[iso]) !== shape(EN[iso]));
  assert.ok(!bad.length, "\n" + bad.join("\n")); // full list, so no failure gets cut off
});
