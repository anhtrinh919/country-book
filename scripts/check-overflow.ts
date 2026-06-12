/* check-overflow.ts — the machine gate.
   Loads each /raw/<iso> spread at 1588×1123 and asserts both A4 pages fit exactly
   (scrollHeight - clientHeight === 0). Optionally screenshots. Exits non-zero on any overflow.

   Usage:
     tsx scripts/check-overflow.ts            # all loaded countries
     tsx scripts/check-overflow.ts jp eg      # specific ISO codes
     SHOT=1 tsx scripts/check-overflow.ts jp  # also save PNG to .out/<iso>.png
*/
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const BASE = process.env.BASE ?? "http://localhost:5173/country-book";
const SHOT = process.env.SHOT === "1";

async function main() {
  const args = process.argv.slice(2);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1588, height: 1123 }, deviceScaleFactor: 2 });

  // discover the country list from the dev index if no args given
  let isos = args;
  if (isos.length === 0) {
    await page.goto(`${BASE}/#/dev`, { waitUntil: "networkidle" });
    isos = await page.$$eval('a[href^="#/raw/"]', (els) => els.map((e) => (e as HTMLAnchorElement).getAttribute("href")!.replace("#/raw/", "")));
  }

  if (SHOT) mkdirSync(".out", { recursive: true });
  let failures = 0;

  for (const iso of isos) {
    try {
      await page.goto(`${BASE}/?iso=${iso}#/raw/${iso}`, { waitUntil: "networkidle" });
      await page.waitForSelector("#spread", { timeout: 15000 });
      // wait for fonts + images so heights are final
      await page.evaluate(() => (document as any).fonts?.ready);
      await page.waitForLoadState("networkidle");

      const overflow = await page.evaluate(() => {
        const root = document.querySelector("#spread")!.firstElementChild!;
        const pages = [...root.children].filter((el) => (el as HTMLElement).offsetWidth > 100); // skip 2px fold
        // FitPage scales its inner with transform to fit; transform doesn't affect scrollHeight,
        // so measure the inner's RENDERED (post-transform) height against the page's available
        // height. >0 means it actually clips (the scale floor was hit); 0 means it fits.
        return pages.map((p) => {
          const el = p as HTMLElement;
          // the scaled inner is the last child (the EdgeSpine red bar is the first child)
          const inner = el.lastElementChild as HTMLElement | null;
          const cs = getComputedStyle(el);
          const avail = el.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
          if (!inner) return el.scrollHeight - el.clientHeight;
          const rendered = inner.getBoundingClientRect().height;
          return Math.max(0, Math.round(rendered - avail));
        });
      });

      const ok = overflow.every((v) => v === 0);
      if (!ok) failures++;
      console.log(`${ok ? "PASS" : "FAIL"}  ${iso.padEnd(6)} overflow=[${overflow.join(", ")}]`);

      if (SHOT) await page.locator("#spread").screenshot({ path: `.out/${iso}.png` });
    } catch (e: any) {
      failures++;
      console.log(`ERR   ${iso.padEnd(6)} ${e?.name || "error"}: ${String(e?.message || e).split("\n")[0]}`);
    }
  }

  await browser.close();
  console.log(`\n${isos.length - failures}/${isos.length} passed`);
  process.exit(failures > 0 ? 1 : 0);
}

main().catch((e) => { console.error(e); process.exit(2); });
