/* fetch-covers.ts — source one beautiful wide landscape image for the cover + each continent
   divider. Uses Wikipedia article lead images (reliable, iconic) via the descriptive UA that
   gets past Wikimedia's bot policy. Saves to public/covers/<slug>.jpg, downscaled to ≤2400px. */
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";

const UA = "CountryBook/1.0 (https://github.com/countrybook; educational childrens atlas; non-commercial; contact@countrybook.example)";
const DIR = "public/covers";

/* slug → ordered Wikipedia article titles to try (first with a landscape lead image wins) */
const COVERS: Record<string, string[]> = {
  world:           ["The Blue Marble", "Earth", "Pale Blue Dot"],
  asia:            ["Mount Everest", "Himalayas", "Annapurna"],
  africa:          ["Serengeti", "Serengeti National Park", "Mount Kilimanjaro"],
  europe:          ["Matterhorn", "Alps", "Hallstatt"],
  "north-america": ["Grand Canyon", "Monument Valley", "Yosemite National Park"],
  "south-america": ["Machu Picchu", "Torres del Paine National Park", "Angel Falls"],
  oceania:         ["Uluru", "Great Barrier Reef", "Bora Bora"],
};

async function leadImage(title: string): Promise<string | null> {
  const api = "https://en.wikipedia.org/w/api.php";
  const q = new URLSearchParams({ action: "query", format: "json", redirects: "1", titles: title, prop: "pageimages", piprop: "original", pilicense: "any" });
  try {
    const r = await fetch(`${api}?${q}`, { headers: { "User-Agent": UA } });
    if (!r.ok) return null;
    const data: any = await r.json();
    const p: any = Object.values(data?.query?.pages || {})[0];
    const u = p?.original?.source;
    return u && /\.(jpe?g|png)$/i.test(u) ? u : null;
  } catch { return null; }
}

async function download(url: string, out: string): Promise<boolean> {
  try {
    const r = await fetch(url, { headers: { "User-Agent": UA }, redirect: "follow" });
    if (!r.ok) return false;
    const buf = Buffer.from(await r.arrayBuffer());
    if (buf.length < 60000) return false;
    if (!(buf[0] === 0xff && buf[1] === 0xd8) && !(buf[0] === 0x89 && buf[1] === 0x50)) return false;
    writeFileSync(out, buf);
    return true;
  } catch { return false; }
}

function landscapeAndScale(out: string): boolean {
  try {
    const info = execFileSync("sips", ["-g", "pixelWidth", "-g", "pixelHeight", out], { encoding: "utf8" });
    const w = parseInt(info.match(/pixelWidth:\s*(\d+)/)?.[1] || "0", 10);
    const h = parseInt(info.match(/pixelHeight:\s*(\d+)/)?.[1] || "0", 10);
    if (w < 1400 || w <= h) return false; // need a wide landscape
    if (w > 2400) execFileSync("sips", ["--resampleWidth", "2400", out], { stdio: "ignore" });
    return true;
  } catch { return true; }
}

async function main() {
  mkdirSync(DIR, { recursive: true });
  const force = process.argv.includes("--force");
  for (const [slug, titles] of Object.entries(COVERS)) {
    const out = `${DIR}/${slug}.jpg`;
    if (existsSync(out) && !force) { console.log(`keep ${slug}`); continue; }
    let done = false;
    for (const t of titles) {
      const url = await leadImage(t);
      if (!url) continue;
      const ext = url.toLowerCase().endsWith(".png") ? "png" : "jpg";
      const tmp = `${DIR}/${slug}.${ext}`;
      if (await download(url, tmp)) {
        if (ext === "png") { try { execFileSync("sips", ["-s", "format", "jpeg", tmp, "--out", out], { stdio: "ignore" }); } catch {} }
        if (landscapeAndScale(out)) { console.log(`✓ ${slug} ← "${t}" (${url.split("/").pop()})`); done = true; break; }
      }
      await new Promise((r) => setTimeout(r, 300));
    }
    if (!done) console.log(`✗ ${slug} — no good landscape found`);
  }
}
main();
