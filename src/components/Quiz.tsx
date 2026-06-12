/* Quiz.tsx — quiz stops + the question generator they share with the back-of-book answer key.
   Questions are generated DETERMINISTICALLY from each quiz's covered countries (seeded by the
   quiz id), so the interactive spread, the printed spread, and the answer key always agree. */
import React from "react";
import { AT } from "../tokens";
import { COUNTRIES, getCountryLang } from "../data";
import { asset } from "../asset";
import { Spread } from "./BookPages";
import { QUIZZES, type QuizStop as QuizMeta } from "../../book.config";
import { useLang } from "../LangContext";
import { getUI, tContinent } from "../i18n";
import type { Lang } from "../lang";

const FONTS = { disp: AT.disp, serif: AT.serif, mono: AT.mono };

/* ── deterministic RNG (seed from quiz id) ── */
function hash(s: string): number { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function mulberry32(a: number) { return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function shuffle<T>(arr: T[], rng: () => number): T[] { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

/* subject = leading ALL-CAPS phrase before the em-dash (keeps intra-name hyphens) */
function subjectOf(caption: string): string {
  const head = (caption || "").replace(/\s+[—–-]\s+.*$|[—–].*$/, "");
  const caps: string[] = [];
  for (const t of head.split(/\s+/)) {
    const w = t.replace(/[^\p{L}\p{N}''-]/gu, "").replace(/^-+|-+$/g, "");
    if (!w) { if (caps.length) break; else continue; }
    if (/\p{Ll}/u.test(w)) break;
    caps.push(w);
  }
  return caps.join(" ").trim() || head.trim();
}
const titleCase = (s: string) => s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

export interface Question { kind: string; prompt: string; imageSrc?: string; options: string[]; answer: number; }

function fourOptions(correct: string, poolValues: string[], rng: () => number): { options: string[]; answer: number } {
  const distract = shuffle(poolValues.filter((v) => v && v !== correct), rng).slice(0, 3);
  const options = shuffle([correct, ...distract], rng);
  return { options, answer: options.indexOf(correct) };
}

export function generateQuiz(meta: QuizMeta, lang: Lang = "en"): Question[] {
  const ui = getUI(lang);
  const rng = mulberry32(hash(meta.id));
  const pool = meta.coversIso.filter((iso) => COUNTRIES[iso]);
  const names = pool.map((iso) => getCountryLang(iso, lang)?.name ?? COUNTRIES[iso].name);
  const caps = pool.map((iso) => getCountryLang(iso, lang)?.facts?.[0]?.value).filter(Boolean) as string[];
  const order = shuffle(pool, rng);
  const plan = ["flag", "capital", "animal", "landmark", "flag", "capital"];
  const qs: Question[] = [];
  for (let i = 0; i < plan.length && i < order.length; i++) {
    const iso = order[i]; const C = getCountryLang(iso, lang) ?? COUNTRIES[iso]; const kind = plan[i];
    if (kind === "flag") {
      qs.push({ kind, prompt: ui.quiz.flagPrompt, imageSrc: C.flag.assetPath, ...fourOptions(C.name, names, rng) });
    } else if (kind === "capital") {
      const cap = C.facts?.[0]?.value || "";
      qs.push({ kind, prompt: ui.quiz.capitalPrompt(titleCase(C.name)), ...fourOptions(cap, caps, rng) });
    } else if (kind === "animal") {
      const subj = subjectOf(C.photos?.animalA?.caption || C.photos?.animalB?.caption || "");
      qs.push({ kind, prompt: ui.quiz.animalPrompt(subj.toLowerCase()), imageSrc: C.photos?.animalA?.src, ...fourOptions(C.name, names, rng) });
    } else {
      const subj = subjectOf(C.photos?.landmark?.caption || "");
      qs.push({ kind, prompt: ui.quiz.landmarkPrompt(titleCase(subj)), imageSrc: C.photos?.landmark?.src, ...fourOptions(C.name, names, rng) });
    }
  }
  return qs;
}

/* ── one question card ── */
function QCard({ q, n, picked, onPick, print }: { q: Question; n: number; picked?: number; onPick?: (i: number) => void; print?: boolean }) {
  const { ui } = useLang();
  const answered = picked !== undefined;
  return (
    <div style={{ border: "1.5px solid var(--line)", background: "rgba(255,255,255,.5)", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontFamily: FONTS.disp, fontWeight: 800, fontSize: 17, color: "#fff", background: "var(--accent)", borderRadius: "50%", width: 30, height: 30, display: "grid", placeItems: "center", flex: "0 0 auto" }}>{n}</span>
        <span style={{ fontFamily: FONTS.mono, fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--faint)" }}>{ui.quiz.kind[q.kind]}</span>
      </div>
      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        {q.imageSrc && (
          <div style={{ width: q.kind === "flag" ? 104 : 124, height: q.kind === "flag" ? 70 : 86, flex: "0 0 auto", borderRadius: 4, overflow: "hidden", border: "1px solid var(--line)", boxShadow: "0 3px 9px rgba(0,0,0,.14)", background: "#e7ddc8" }}>
            <img src={asset(q.imageSrc)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
        )}
        <div style={{ fontFamily: FONTS.serif, fontWeight: 500, fontSize: 21, lineHeight: 1.25, color: "var(--ink)" }}>{q.prompt}</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {q.options.map((o, i) => {
          let bg = "rgba(255,255,255,.7)", bd = "var(--line)", col = "var(--ink)";
          if (answered) {
            if (i === q.answer) { bg = "#2e7d4f"; bd = "#2e7d4f"; col = "#fff"; }
            else if (i === picked) { bg = "#b23a2e"; bd = "#b23a2e"; col = "#fff"; }
          }
          return (
            <button key={i} disabled={print || answered} onClick={() => onPick?.(i)}
              style={{ textAlign: "left", display: "flex", gap: 10, alignItems: "center", border: `1.5px solid ${bd}`, background: bg, color: col, borderRadius: 8, padding: "11px 14px", font: "inherit", cursor: print || answered ? "default" : "pointer" }}>
              {print && <span style={{ width: 16, height: 16, borderRadius: "50%", border: "1.5px solid var(--faint)", flex: "0 0 auto" }} />}
              <span style={{ fontFamily: FONTS.mono, fontSize: 13, opacity: .7, fontWeight: 600 }}>{String.fromCharCode(65 + i)}</span>
              <span style={{ fontFamily: FONTS.disp, fontWeight: 600, fontSize: 17, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{titleCase(o)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function QuizStop({ meta, print }: { meta: QuizMeta; print?: boolean }) {
  const { lang, ui } = useLang();
  const qs = React.useMemo(() => generateQuiz(meta, lang), [meta.id, lang]);
  const [picks, setPicks] = React.useState<Record<number, number>>({});
  const score = Object.entries(picks).filter(([i, p]) => qs[+i].answer === p).length;
  const done = Object.keys(picks).length;
  const pick = (qi: number, oi: number) => setPicks((p) => (qi in p ? p : { ...p, [qi]: oi }));
  const half = Math.ceil(qs.length / 2);

  const Header = (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: "2px solid var(--accent)", paddingBottom: 9 }}>
      <div>
        <div style={{ fontFamily: FONTS.mono, fontSize: 13, letterSpacing: ".2em", color: "var(--accent)" }}>{ui.quiz.stopNo(String(meta.index).padStart(2, "0"))}</div>
        <div style={{ fontFamily: FONTS.disp, fontWeight: 800, fontSize: 44, lineHeight: .95 }}>{ui.quiz.challenge(tContinent(meta.continent, lang))}</div>
      </div>
      {print
        ? <span style={{ fontFamily: FONTS.mono, fontSize: 13, color: "var(--faint)" }}>{ui.quiz.answersBack}</span>
        : <span style={{ fontFamily: FONTS.disp, fontWeight: 800, fontSize: 20, color: "#fff", background: "var(--accent)", borderRadius: 999, padding: "9px 22px" }}>{ui.quiz.score(score, qs.length)}</span>}
    </div>
  );

  return (
    <Spread
      vars={{ "--accent": "#9c4a1e", "--paper": "#F4ECDA" } as React.CSSProperties}
      left={
        <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
          {Header}
          <div style={{ fontFamily: FONTS.serif, fontStyle: "italic", fontSize: 18, color: "var(--faint)", margin: "12px 0 16px" }}>
            {print ? ui.quiz.leadPrint : ui.quiz.lead}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 18, flex: 1, justifyContent: "space-between" }}>
            {qs.slice(0, half).map((q, i) => <QCard key={i} q={q} n={i + 1} picked={picks[i]} onPick={(o) => pick(i, o)} print={print} />)}
          </div>
        </div>
      }
      right={
        <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: "2px solid var(--accent)", paddingBottom: 9 }}>
            <span style={{ fontFamily: FONTS.disp, fontWeight: 800, fontSize: 22 }}>{ui.quiz.keepGoing}</span>
            <span style={{ fontFamily: FONTS.mono, fontSize: 10, letterSpacing: ".14em", color: "var(--faint)" }}>{ui.quiz.countriesTag(meta.coversIso.length)}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 18, flex: 1, marginTop: 12, justifyContent: "space-between" }}>
            {qs.slice(half).map((q, i) => <QCard key={i} q={q} n={half + i + 1} picked={picks[half + i]} onPick={(o) => pick(half + i, o)} print={print} />)}
          </div>
          {!print && done === qs.length && (
            <div style={{ marginTop: 12, textAlign: "center", fontFamily: FONTS.disp, fontWeight: 800, fontSize: 20, color: "var(--accent)" }}>
              {score === qs.length ? ui.quiz.perfect : score >= qs.length / 2 ? ui.quiz.great : ui.quiz.tryAgain}
            </div>
          )}
        </div>
      }
    />
  );
}

/* ── back-of-book answer key (all quizzes) ── */
export function AnswerKey() {
  const { lang, ui } = useLang();
  const all = QUIZZES.map((meta) => ({ meta, qs: generateQuiz(meta, lang) }));
  const half = Math.ceil(all.length / 2);
  const col = (slice: typeof all) => (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1, marginTop: 18 }}>
      {slice.map(({ meta, qs }) => (
        <div key={meta.id} style={{ breakInside: "avoid" }}>
          <div style={{ fontFamily: FONTS.disp, fontWeight: 800, fontSize: 20, color: "var(--accent)" }}>№{String(meta.index).padStart(2, "0")} · {tContinent(meta.continent, lang)}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "5px 18px", marginTop: 6 }}>
            {qs.map((q, i) => (
              <span key={i} style={{ fontFamily: FONTS.mono, fontSize: 15, color: "var(--ink)" }}>
                {i + 1}. <b>{String.fromCharCode(65 + q.answer)}</b> <span style={{ color: "var(--faint)" }}>{titleCase(q.options[q.answer]).slice(0, 16)}</span>
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
  const head = (title: string, sub: string) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: "2px solid var(--accent)", paddingBottom: 9 }}>
      <span style={{ fontFamily: FONTS.disp, fontWeight: 800, fontSize: 28 }}>{title}</span>
      <span style={{ fontFamily: FONTS.mono, fontSize: 10, letterSpacing: ".14em", color: "var(--faint)" }}>{sub}</span>
    </div>
  );
  return (
    <Spread
      left={<div style={{ height: "100%", display: "flex", flexDirection: "column" }}>{head(ui.quiz.answerKeyTitle, ui.quiz.howDidYouDo)}{col(all.slice(0, half))}</div>}
      right={<div style={{ height: "100%", display: "flex", flexDirection: "column" }}>{head(ui.quiz.answerKeyContinued, ui.quiz.quizzesTag(QUIZZES.length))}{col(all.slice(half))}</div>}
    />
  );
}
