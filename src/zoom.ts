/* Reader zoom: z = scale, x/y = screen offset of the zoomed spread (transform: translate(x,y) scale(z), origin = centre). */
export type Zoom = { z: number; x: number; y: number };
type Pt = { x: number; y: number };

/* Zoom by `factor` so the spot under `p` stays under `p`. `c` is the spread's untransformed centre on screen. */
export function zoomAt(s: Zoom, factor: number, p: Pt, c: Pt): Zoom {
  const z = Math.max(0.5, Math.min(3, s.z * factor));
  if (z <= 1) return { z, x: 0, y: 0 }; // fits the screen → recentre
  const k = z / s.z;
  return { z, x: (p.x - c.x) * (1 - k) + k * s.x, y: (p.y - c.y) * (1 - k) + k * s.y };
}
