import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";

// the spread wraps each myth in its own quote marks, so the data must not carry them too
test("no myth is already wrapped in quote marks", () => {
  const wrapped: string[] = [];
  for (const dir of ["data", "data-vi"])
    for (const f of readdirSync(dir).filter((f) => f.endsWith(".json")))
      for (const m of JSON.parse(readFileSync(`${dir}/${f}`, "utf8")).myths ?? [])
        if (/^["“].*["”]$/.test(m.myth.trim())) wrapped.push(`${dir}/${f}`);
  assert.deepEqual(wrapped, []);
});
