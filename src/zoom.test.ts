import { test } from "node:test";
import assert from "node:assert/strict";
import { zoomAt } from "./zoom";

const c = { x: 100, y: 100 }; // zoom wrapper centre on screen

test("zoom in keeps the pointed spot still", () => {
  assert.deepEqual(zoomAt({ z: 1, x: 0, y: 0 }, 2, { x: 300, y: 200 }, c), { z: 2, x: -200, y: -100 });
});

test("zoom out keeps the pointed spot still", () => {
  assert.deepEqual(zoomAt({ z: 2, x: -200, y: -100 }, 0.75, { x: 300, y: 200 }, c), { z: 1.5, x: -100, y: -50 });
});

test("zoom is clamped to 0.5–3", () => {
  assert.equal(zoomAt({ z: 2.9, x: 0, y: 0 }, 2, c, c).z, 3);
  assert.equal(zoomAt({ z: 0.6, x: 0, y: 0 }, 0.5, c, c).z, 0.5);
});

test("at zoom 1 or less the page recentres", () => {
  assert.deepEqual(zoomAt({ z: 1.5, x: -100, y: -50 }, 0.5, { x: 300, y: 200 }, c), { z: 0.75, x: 0, y: 0 });
});
