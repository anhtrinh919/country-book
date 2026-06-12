/* Design tokens — copied verbatim from the approved handoff (README Design Tokens).
   Single source of truth for color, type families, and the page geometry. */

export const AT = {
  paper: "#F0E6D1",
  paper2: "#E7D9BC",
  ink: "#2c2620",
  faint: "#8a7c63",
  red: "#B23A2E",
  sun: "#BC002D", // per-country this is overridden by flag.keyColor
  sea: "#6f8f8a",
  line: "#c9ba9a",
  disp: "'Bricolage Grotesque', system-ui, sans-serif",
  serif: "var(--bodyfont, 'Bitter', Georgia, serif)",
  mono: "'Spline Sans Mono', ui-monospace, monospace",
} as const;

/* A3 landscape spread = two A4 portrait pages + 2px fold. */
export const SPREAD_W = 1588;
export const SPREAD_H = 1123;
export const PAGE_W = 794;
export const PAGE_H = 1123;

export const PAGE: React.CSSProperties = {
  position: "relative",
  width: PAGE_W,
  height: PAGE_H,
  color: AT.ink,
  fontFamily: AT.serif,
  padding: "32px 46px 18px",
  overflow: "hidden",
  backgroundColor: AT.paper,
  backgroundImage: `radial-gradient(${AT.faint}22 1px, transparent 1.4px)`,
  backgroundSize: "22px 22px",
};
