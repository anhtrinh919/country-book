/* check-print-overflow.ts — overflow gate for the PRINTED book.
   The original check-overflow.ts only covers country /raw pages; this one loads EVERY spine page
   at /print/:n and asserts both A4 columns fit at 1123px with zero clipping — catching the front/
   back matter (cover, TOC, passport, dividers, quizzes, superlatives, glossary, index, …) that the
   PDF rasterizer would otherwise clip silently.

   Country pages use FitPage (the inner is transform-scaled, so we measure rendered height vs the
   available height, like check-overflow). Fixed pages just compare scrollHeight vs clientHeight.

   Usage:
     tsx scripts/check-print-overflow.ts            # all pages
     tsx scripts/check-print-overflow.ts 4 5 6      # specific page numbers
     SHOT=1 tsx scripts/check-print-overflow.ts     # screenshot any failures to .out/
*/
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { SPINE } from "../book.config";

const BASE = process.env.BASE ?? "http://localhost:5173/country-book";
const SHOT = process.env.SHOT === "1";

async function main() {
  const args = process.argv.slice(2).map(Number).filter((n) => n >= 1 && n <= SPINE.length);
  const nums = args.length ? args : SPINE.map((_, i) => i + 1);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1588, height: 1123 }, deviceScaleFactor: 1 });
  if (SHOT) mkdirSync(".out", { recursive: true });
  let failures = 0;

  for (const n of nums) {
    const sp = SPINE[n - 1];
    const label = sp.type === "country" ? sp.iso! : sp.type;
    try {
      await page.goto(`${BASE}/?p=${n}#/print/${n}`, { waitUntil: "networkidle", timeout: 25000 });
      await page.waitForSelector("#print-root", { timeout: 20000 });
      await page.evaluate(() => (document as any).fonts?.ready);
      await page.waitForTimeout(sp.type === "world-map-toc" ? 1300 : 350);
      await page.waitForLoadState("networkidle");

      const overflow = await page.evaluate(({ isCountry, fullBleed }) => {
        const root = document.querySelector("#print-root");
        if (!root) return [-1];
        const frame = root.firstElementChild!; // SpineFrame wrapper
        const spread = (frame.querySelector("#spread") as HTMLElement) || (frame.firstElementChild as HTMLElement);
        const cols = ([...spread.children] as HTMLElement[]).filter((el) => el.offsetWidth > 100);
        // full-bleed pages (the world map) position everything absolutely → measure the container itself
        const targets = fullBleed || !cols.length ? [spread] : cols;
        return targets.map((el) => {
          if (isCountry) {
            const inner = el.lastElementChild as HTMLElement | null; // the transform-scaled FitPage inner
            const cs = getComputedStyle(el);
            const avail = el.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
            if (!inner) return Math.max(0, el.scrollHeight - el.clientHeight);
            return Math.max(0, Math.round(inner.getBoundingClientRect().height - avail));
          }
          return Math.max(0, el.scrollHeight - el.clientHeight);
        });
      }, { isCountry: sp.type === "country", fullBleed: sp.type === "world-map-toc" });

      const ok = overflow.every((v) => v === 0);
      if (!ok) failures++;
      console.log(`${ok ? "PASS" : "FAIL"}  ${String(n).padStart(3)}  ${label.padEnd(16)} [${overflow.join(", ")}]`);
      if (SHOT && !ok) await page.locator("#print-root").screenshot({ path: `.out/p${String(n).padStart(3, "0")}-${label}.png` });
    } catch (e: any) {
      failures++;
      console.log(`ERR   ${String(n).padStart(3)}  ${label.padEnd(16)} ${String(e?.message || e).split("\n")[0]}`);
    }
  }

  await browser.close();
  console.log(`\n${nums.length - failures}/${nums.length} pages fit`);
  process.exit(failures > 0 ? 1 : 0);
}

main().catch((e) => { console.error(e); process.exit(2); });
