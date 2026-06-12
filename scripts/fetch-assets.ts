/* fetch-assets.ts — deterministic asset stage of the per-country pipeline.
   For each data/<iso>.json:
     • flag: download from flagcdn (reliable for every ISO) → public/flags/<iso>.svg
     • photos: resolve a REAL landscape Wikimedia Commons image per slot, then self-host:
         1. try the author-proposed exact Special:FilePath URL
         2. if that fails, search Commons by the caption's SUBJECT (the bit before "—")
            and pick the top landscape photo
       Download the ~2000px version → public/photos/<iso>-<slot>.jpg, rewrite src to the
       local path. On total failure, src "" → component shows the graceful fallback (logged).
     • record provenance in assets/attributions.json.

   Usage: tsx scripts/fetch-assets.ts            # all data files
          tsx scripts/fetch-assets.ts vn cn      # specific ISO codes
*/
import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync, readdirSync } from "node:fs";
import { execFileSync } from "node:child_process";

/* normalize a downloaded photo to ≤1800px wide (keeps disk + PDF size sane). macOS sips; no-op elsewhere. */
function downscale(out: string) {
  try {
    const w = parseInt(execFileSync("sips", ["-g", "pixelWidth", out], { encoding: "utf8" }).match(/pixelWidth:\s*(\d+)/)?.[1] || "0", 10);
    if (w > 1800) execFileSync("sips", ["--resampleWidth", "1800", out], { stdio: "ignore" });
  } catch { /* sips unavailable — leave original */ }
}

const SLOTS = ["landmark", "animalA", "animalB", "hero"] as const;
const FLAG_DIR = "public/flags";
const PHOTO_DIR = "public/photos";
const ATTR = "assets/attributions.json";
/* Wikimedia's UA policy 429s generic agents — a descriptive UA with a contact URL passes. */
const UA = "CountryBook/1.0 (https://github.com/countrybook; educational childrens atlas; non-commercial; contact@countrybook.example)";

/* ---- polite, rate-limited fetch ----
   Wikimedia 429s aggressively under rapid batch load. Throttle to ~3 req/s and
   retry on 429 with exponential backoff so large waves don't get blocked. */
const MIN_GAP_MS = 350;
let lastReqAt = 0;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function politeFetch(url: string, opts: RequestInit = {}, tries = 4): Promise<Response | null> {
  for (let attempt = 0; attempt < tries; attempt++) {
    const wait = lastReqAt + MIN_GAP_MS - Date.now();
    if (wait > 0) await sleep(wait);
    lastReqAt = Date.now();
    const ac = new AbortController();
    const killer = setTimeout(() => ac.abort(), 20000); // a hung socket must never block the run
    try {
      const r = await fetch(url, { ...opts, headers: { "User-Agent": UA, ...(opts.headers || {}) }, redirect: "follow", signal: ac.signal });
      if (r.status === 429 || r.status === 503) {
        await sleep(1500 * Math.pow(2, attempt)); // 1.5s, 3s, 6s, 12s
        continue;
      }
      return r;
    } catch {
      await sleep(800 * (attempt + 1));
    } finally {
      clearTimeout(killer);
    }
  }
  return null;
}

/* real raster image? check magic bytes (JPEG / PNG / WebP / GIF) */
function isRaster(buf: Buffer): boolean {
  if (buf.length < 12) return false;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return true; // JPEG
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return true; // PNG
  if (buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") return true; // WebP
  if (buf.toString("ascii", 0, 3) === "GIF") return true; // GIF
  return false;
}

function validImageOnDisk(out: string, minBytes = 15000): boolean {
  if (!existsSync(out) || statSync(out).size < minBytes) return false;
  return isRaster(readFileSync(out));
}

async function saveBinary(url: string, out: string, minBytes = 15000): Promise<boolean> {
  const r = await politeFetch(url);
  if (!r || !r.ok) return false;
  try {
    const buf = Buffer.from(await r.arrayBuffer());
    if (buf.length < minBytes) return false;
    if (!isRaster(buf)) return false; // reject HTML error pages / SVG placeholders
    writeFileSync(out, buf);
    return true;
  } catch { return false; }
}

/* SVG flags need their own (text) validation */
async function saveSvg(url: string, out: string): Promise<boolean> {
  const r = await politeFetch(url);
  if (!r || !r.ok) return false;
  try {
    const txt = await r.text();
    if (!/<svg[\s>]/i.test(txt) || txt.length < 80) return false;
    writeFileSync(out, txt);
    return true;
  } catch { return false; }
}

/* reject obviously-wrong images by filename (a car named "Great Wall", logos, maps…).
   Normalize _/- to spaces first — Wikimedia filenames are underscore-joined, so \b never
   fires inside "Great_Wall_Voleex_C20R" without this. */
const JUNK_RE = /\b(flag|coat|locator|logo|diagram|voleex|haval|automobile|sedan|stamp|banknote|coin|chart|graph|airstrip|airport|airfield|schwarze|sonne|obergruppen|swastika|nazi|pigments?|portrait|picture)\b|\bmap of\b/i;
const JUNK = { test: (s: string) => JUNK_RE.test(String(s).replace(/[_-]+/g, " ")) };

/* Wikipedia lead-image fallback: the canonical "main photo" of a named subject.
   Commons full-text search ranks badly (a search for "Great Wall" surfaces a car of that brand);
   the Wikipedia ARTICLE's own lead image is almost always the correct iconic shot. We search
   "<subject> <country>" so an ambiguous subject resolves to the right article (and skip
   disambiguation pages), then take that page's original lead image. */
async function resolveWikipedia(subject: string, country = ""): Promise<Array<{ url: string; orig: string }>> {
  const api = "https://en.wikipedia.org/w/api.php";
  const q = new URLSearchParams({
    action: "query", format: "json", redirects: "1",
    generator: "search", gsrsearch: `${subject} ${country}`.trim(), gsrlimit: "3", gsrnamespace: "0",
    prop: "pageimages|pageprops", piprop: "original", pilicense: "any",
  });
  try {
    const r = await politeFetch(`${api}?${q}`);
    if (!r || !r.ok) return [];
    const data: any = await r.json();
    const pages: any[] = Object.values(data?.query?.pages || {})
      .sort((a: any, b: any) => (a.index || 99) - (b.index || 99)); // search rank order
    // require the matched article title to share a real word with the subject, so
    // "ROSE-RINGED PARAKEET" can't drift to a "Common nightingale" seen in the same country.
    const keyWords = subject.toLowerCase().replace(/-/g, " ").split(/\s+/).filter((w) => w.length >= 4);
    const out: Array<{ url: string; orig: string }> = [];
    for (const p of pages) {
      if (p?.pageprops?.disambiguation !== undefined) continue; // skip "Great Wall (disambiguation)"
      const title = String(p.title || "").toLowerCase();
      if (keyWords.length && !keyWords.some((w) => title.includes(w))) continue; // off-topic drift
      const u = p?.original?.source;
      if (u && /\.(jpe?g|png)$/i.test(u) && !JUNK.test(u)) out.push({ url: u, orig: u });
    }
    return out;
  } catch { return []; }
}

/* Search Commons for landscape photos of `subject`; return ordered candidate URLs to try
   (thumb first for size, then the original full-res — originals load even where thumbs are blocked). */
async function resolveCommons(subject: string): Promise<Array<{ url: string; orig: string }>> {
  const api = "https://commons.wikimedia.org/w/api.php";
  const q = new URLSearchParams({
    action: "query", format: "json", generator: "search", gsrnamespace: "6",
    gsrsearch: `${subject} filetype:bitmap`, gsrlimit: "12",
    prop: "imageinfo", iiprop: "url|size|mime", iiurlwidth: "2000",
  });
  try {
    const r = await politeFetch(`${api}?${q}`);
    if (!r || !r.ok) return [];
    const data: any = await r.json();
    const pages: any[] = Object.values(data?.query?.pages || {});
    return pages
      .map((p) => p.imageinfo?.[0])
      .filter(Boolean)
      .filter((ii) => /jpe?g|png/i.test(ii.mime))
      .filter((ii) => ii.width >= 1200 && ii.width > ii.height) // landscape, big enough
      .filter((ii) => !JUNK.test(ii.url))
      .map((ii) => ({ url: ii.url, orig: ii.url })); // originals load reliably; thumbs are blocked here
  } catch { return []; }
}

/* The photo subject is authored as the leading ALL-CAPS phrase of the caption
   (e.g. "TAJ MAHAL, Agra — ..." → "TAJ MAHAL"). Collect leading tokens with no
   lowercase letter; fall back to the first few words. */
function leadingCaps(caption: string): string {
  // strip the description after the caption separator (em/en dash, or a SPACED hyphen) —
  // but NOT hyphens inside a name like "BAND-E AMIR" or "PORT-AU-PRINCE".
  const tokens = caption.replace(/\s+[—–-]\s+.*$|[—–].*$/, "").split(/\s+/);
  const caps: string[] = [];
  for (const t of tokens) {
    // keep intra-word hyphens — "KEEL-BILLED", "ONE-HORNED" must survive for the search to match.
    const word = t.replace(/[^\p{L}\p{N}'’-]/gu, "").replace(/^-+|-+$/g, "");
    if (!word) { if (caps.length) break; else continue; }
    if (/\p{Ll}/u.test(word)) break; // hit a lowercase word → subject ended
    caps.push(word);
  }
  const subject = caps.join(" ").trim();
  return subject || caption.split(/\s+/).slice(0, 3).join(" ");
}

async function main() {
  mkdirSync(FLAG_DIR, { recursive: true });
  mkdirSync(PHOTO_DIR, { recursive: true });
  mkdirSync("assets", { recursive: true });

  const args = process.argv.slice(2);
  const isos = args.length ? args : readdirSync("data").filter((f) => f.endsWith(".json")).map((f) => f.replace(/\.json$/, ""));

  /* FORCE=1 re-fetches even valid on-disk images; SLOTS=landmark,hero limits which slots are touched
     (used to repair only the ambiguity-prone place-name photos without disturbing good animal shots). */
  const FORCE = process.env.FORCE === "1";
  const slotFilter = (process.env.SLOTS || "").split(",").map((s) => s.trim()).filter(Boolean);

  const attributions: Record<string, any> = existsSync(ATTR) ? JSON.parse(readFileSync(ATTR, "utf8")) : {};
  const gaps: string[] = [];

  for (const iso of isos) {
    const path = `data/${iso}.json`;
    if (!existsSync(path)) { console.log(`skip ${iso} (no data file)`); continue; }
    const c = JSON.parse(readFileSync(path, "utf8"));

    // flag
    const flagOut = `${FLAG_DIR}/${iso}.svg`;
    if (!existsSync(flagOut) || statSync(flagOut).size < 100) {
      const ok = await saveSvg(`https://flagcdn.com/${iso}.svg`, flagOut);
      if (!ok) gaps.push(`${iso}: flag failed`);
    }
    c.flag.assetPath = `/flags/${iso}.svg`;

    // photos
    attributions[iso] = attributions[iso] || {};
    for (const slot of SLOTS) {
      if (slotFilter.length && !slotFilter.includes(slot)) continue;
      const p = c.photos?.[slot];
      if (!p) continue;
      const out = `${PHOTO_DIR}/${iso}-${slot}.jpg`;
      let ok = false;
      let provenance = attributions[iso]?.[slot]?.source || "";

      // 0) already have a valid image on disk → keep it (idempotent), UNLESS forced or its
      //    recorded source filename is junk (e.g. a "Great Wall" car wrongly matched earlier).
      const onDiskJunk = JUNK.test(provenance);
      if (validImageOnDisk(out) && !FORCE && !onDiskJunk) { ok = true; }

      // 1) author-proposed exact URL (skip if it points at known junk)
      if (!ok && p.src?.startsWith("http") && !JUNK.test(p.src)) { ok = await saveBinary(p.src, out); if (ok) provenance = p.src; }

      // 2) search by caption subject (the leading ALL-CAPS phrase), disambiguated by country:
      //    Wikipedia article lead image first (most accurate), then Commons full-text search.
      if (!ok) {
        const subject = leadingCaps(String(p.caption || p.alt || ""));
        const country = String(c.name || "").replace(/[^A-Za-z ]/g, "").trim();
        if (subject) {
          // country-qualified first (disambiguates places); then bare subject (a species name
          // like "rose-ringed parakeet" isn't country-specific and the country only dilutes it).
          const cands = [
            ...(await resolveWikipedia(subject, country)),
            ...(await resolveWikipedia(subject)),
            ...(await resolveCommons(`${subject} ${country}`)),
            ...(await resolveCommons(subject)),
          ];
          for (const cand of cands.slice(0, 5)) {
            if (JUNK.test(cand.url)) continue;
            ok = await saveBinary(cand.url, out);
            if (ok) { provenance = cand.orig; break; }
          }
        }
      }

      if (ok) {
        downscale(out);
        p.src = `/photos/${iso}-${slot}.jpg`;
        attributions[iso][slot] = { source: provenance, credit: p.credit || "Wikimedia Commons" };
      } else {
        p.src = "";
        gaps.push(`${iso}/${slot}: no photo (${String(p.caption || "").slice(0, 40)})`);
      }
    }

    writeFileSync(path, JSON.stringify(c, null, 2) + "\n");
    const got = SLOTS.filter((s) => c.photos?.[s]?.src).length;
    console.log(`processed ${iso}  flag=${existsSync(flagOut) ? "ok" : "MISS"}  photos=${got}/4`);
  }

  writeFileSync(ATTR, JSON.stringify(attributions, null, 2) + "\n");
  console.log(`\nattributions → ${ATTR}`);
  if (gaps.length) {
    console.log(`\n⚠ ${gaps.length} asset gap(s) → graceful fallback:`);
    for (const g of gaps) console.log("  - " + g);
  } else console.log("\n✓ all assets sourced");
}

main();
