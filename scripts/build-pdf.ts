/* build-pdf.ts — print the FULL book spine to one merged A3 PDF.
   Each spine page renders at /print/<n> (natural 1588×1123, no nav), is captured as a
   quality-controlled JPEG, and embedded as one A3 landscape sheet. Rasterizing (vs Chromium's
   native page.pdf) gives a sane file size — full visual fidelity at a fraction of the bytes —
   without needing Ghostscript. Retries cover the occasional render timeout.

   Usage:
     tsx scripts/build-pdf.ts             # whole book
     FROM=6 TO=20 tsx scripts/build-pdf.ts
   Env: JPEG_Q (default 82). Output: dist-pdf/book.pdf
*/
import { chromium, type Page } from "playwright";
import { PDFDocument } from "pdf-lib";
import { mkdirSync, writeFileSync } from "node:fs";
import { SPINE } from "../book.config";

const BASE = process.env.BASE ?? "http://localhost:5173/country-book";
const OUT = "dist-pdf";
/* two outputs from the same render: a print-grade file for a print shop and a lighter proof for sharing */
const PRESETS = {
  print: { dsf: 2, q: 82, file: "book.pdf" },
  proof: { dsf: 1, q: 60, file: "book-proof.pdf" },
} as const;
const PRESET = (process.env.PRESET === "proof" ? "proof" : "print") as keyof typeof PRESETS;
const PR = PRESETS[PRESET];
const Q = process.env.JPEG_Q ? parseInt(process.env.JPEG_Q, 10) : PR.q;
const W = 1588, H = 1123;

async function shoot(page: Page, n: number, settle: number): Promise<Buffer | null> {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      // query-buster forces a full document reload (hash-only nav wouldn't); hash drives the route
      await page.goto(`${BASE}/?p=${n}#/print/${n}`, { waitUntil: "networkidle", timeout: 25000 });
      await page.waitForSelector("#print-root", { timeout: 20000 });
      await page.evaluate(() => (document as any).fonts?.ready);
      await page.waitForTimeout(settle);
      await page.waitForLoadState("networkidle");
      return await page.locator("#print-root").screenshot({ type: "jpeg", quality: Q });
    } catch { await page.waitForTimeout(500); }
  }
  return null;
}

async function main() {
  const total = SPINE.length;
  const from = process.env.FROM ? parseInt(process.env.FROM, 10) : 1;
  const to = process.env.TO ? parseInt(process.env.TO, 10) : total;

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: PR.dsf });
  mkdirSync(OUT, { recursive: true });
  const pdf = await PDFDocument.create();
  let fails: number[] = [];

  for (let n = from; n <= to; n++) {
    const sp = SPINE[n - 1];
    const label = sp.type === "country" ? sp.iso : sp.type;
    const jpg = await shoot(page, n, sp.type === "world-map-toc" ? 1300 : 350);
    if (!jpg) { fails.push(n); console.log(`  ✗ page ${n} (${label}) — gave up`); continue; }
    const img = await pdf.embedJpg(jpg);
    const pg = pdf.addPage([W, H]);
    pg.drawImage(img, { x: 0, y: 0, width: W, height: H });
    if (n % 20 === 0 || n === to) console.log(`  …${n}/${to} (${label})`);
  }

  const out = await pdf.save();
  writeFileSync(`${OUT}/${PR.file}`, out);
  await browser.close();
  console.log(`\n✓ ${OUT}/${PR.file} (${PRESET}) — ${pdf.getPageCount()} pages, ${(out.length / 1024 / 1024).toFixed(1)} MB${fails.length ? `, FAILED: ${fails.join(",")}` : ""}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
