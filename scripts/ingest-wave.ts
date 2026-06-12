/* ingest-wave.ts — write authored country records from a workflow output file into data/<iso>.json.
   Usage: tsx scripts/ingest-wave.ts <workflow-output-file.json>
   The workflow returns { result: [ { iso, record }, ... ] }. We unescape HTML entities the
   author may have emitted and write one clean data file per country. */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const unescape = (str: string) => str
  .replace(/&amp;/g, "&").replace(/&#39;/g, "'").replace(/&apos;/g, "'")
  .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"');

function main() {
  const file = process.argv[2];
  if (!file) { console.error("usage: tsx scripts/ingest-wave.ts <output-file>"); process.exit(1); }
  const parsed = JSON.parse(readFileSync(file, "utf8"));
  const arr = Array.isArray(parsed) ? parsed : parsed.result;
  if (!Array.isArray(arr)) { console.error("no result array in", file); process.exit(1); }

  mkdirSync("data", { recursive: true });
  let n = 0;
  for (const item of arr) {
    if (!item?.iso || !item?.record) continue;
    const rec = JSON.parse(unescape(JSON.stringify(item.record)));
    if (typeof rec.name === "string") rec.name = rec.name.toUpperCase(); // masthead is always UPPERCASE
    writeFileSync(`data/${item.iso}.json`, JSON.stringify(rec, null, 2) + "\n");
    console.log(`wrote data/${item.iso}.json  ${rec.name}  facts=${rec.facts?.length} wows=${rec.wows?.length} myths=${rec.myths?.length} words=${rec.words?.length}`);
    n++;
  }
  console.log(`\n${n} records ingested`);
}

main();
