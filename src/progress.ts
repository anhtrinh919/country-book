/* progress.ts — the real "Explorer Passport" tracker.
   Each visited page stores a timestamp (so the passport can show the latest entry + recent
   journeys in order). A continent stamp is earned when every country page on that continent has
   been visited; thematic + milestone badges add fun ways to collect. Web-only: the printed PDF
   renders the same components against the zero/empty state (a fresh, unstamped passport). */
import React from "react";
import { SPINE, JOURNEY, BY_CONTINENT, CONTINENT_ORDER, STOP_OF, TOTAL_STOPS, type Continent } from "../book.config";

const KEY = "cb-progress-v2";
const LEGACY_KEY = "cb-progress-v1"; // old array-of-page-numbers format

/* page number (1-based) of each country, and the reverse, for mapping ISO ⇄ visited */
export const PAGE_OF_ISO: Record<string, number> = {};
export const ISO_OF_PAGE: Record<number, string> = {};
SPINE.forEach((p, i) => { if (p.type === "country" && p.iso) { PAGE_OF_ISO[p.iso] = i + 1; ISO_OF_PAGE[i + 1] = p.iso; } });

/* ── store: page number → epoch-ms first-visited ── */
export type Visits = Record<number, number>;
let visits: Visits = load();
let visitedSet: Set<number> = new Set(Object.keys(visits).map(Number));
const listeners = new Set<() => void>();

function load(): Visits {
  try {
    const r = localStorage.getItem(KEY);
    if (r) return JSON.parse(r) as Visits;
    const legacy = localStorage.getItem(LEGACY_KEY);
    if (legacy) { const out: Visits = {}; (JSON.parse(legacy) as number[]).forEach((n, i) => { out[n] = i + 1; }); return out; }
  } catch { /* ignore */ }
  return {};
}
function commit(next: Visits) { visits = next; visitedSet = new Set(Object.keys(visits).map(Number)); try { localStorage.setItem(KEY, JSON.stringify(visits)); } catch { /* ignore */ } listeners.forEach((l) => l()); }
function now(): number { return Date.now(); }

export function subscribe(cb: () => void) { listeners.add(cb); return () => { listeners.delete(cb); }; }
export function getVisits(): Visits { return visits; }
export function getVisited(): Set<number> { return visitedSet; }

export function markVisited(page: number) { if (visits[page] == null) commit({ ...visits, [page]: now() }); }
export function toggleVisited(page: number) {
  const next = { ...visits };
  if (next[page] != null) delete next[page]; else next[page] = now();
  commit(next);
}
export function resetProgress() { commit({}); }

/* React hooks */
export function useVisited(): Set<number> { return React.useSyncExternalStore(subscribe, getVisited); }
export function useVisits(): Visits { return React.useSyncExternalStore(subscribe, getVisits); }

/* ── badges ── */
export interface Badge {
  id: string;
  name: string;
  shortName?: string;  // fits the continent ring label
  blurb: string;
  hint?: string;       // one-line quest description (collections)
  emblem: string;      // Glyph type
  kind: "continent" | "theme" | "milestone";
  members: string[];   // ISO codes (empty for milestones)
  needCount?: number;  // milestone: collected when ≥ this many countries visited
  continent?: Continent;
}

const CONT_EMBLEM: Record<Continent, { emblem: string; short: string }> = {
  "Asia": { emblem: "sun", short: "Asia" },
  "Africa": { emblem: "savanna", short: "Africa" },
  "Europe": { emblem: "diamond", short: "Europe" },
  "North America": { emblem: "star", short: "N. America" },
  "South America": { emblem: "leaf", short: "S. America" },
  "Oceania": { emblem: "wave", short: "Oceania" },
};

/* thematic collections — interesting groupings beyond geography-by-continent */
const RAW_THEMES: Array<Omit<Badge, "kind">> = [
  { id: "home",   name: "Home & Neighbours", blurb: "Vietnam and the lands next door",          emblem: "house",   hint: "Visit your own country and the lands next door.", members: ["vn", "cn", "la", "kh", "th"] },
  { id: "island", name: "Island Hoppers",    blurb: "Nations made of islands",                  emblem: "island",  hint: "Collect ten island nations across the seas.",     members: ["jp", "ph", "id", "gb", "is", "nz", "mg", "cu", "lk", "mv"] },
  { id: "roof",   name: "Roof of the World", blurb: "Home to the highest mountains",            emblem: "peak",    hint: "Reach the highest mountain countries.",           members: ["np", "bt", "in", "pk", "cn"] },
  { id: "desert", name: "Desert Wanderers",  blurb: "Lands of vast sand and sun",               emblem: "dune",    hint: "Cross the great deserts of the planet.",          members: ["eg", "ly", "dz", "ma", "sd", "sa", "ae"] },
  { id: "safari", name: "Safari Lands",      blurb: "Where the big wild animals roam",          emblem: "savanna", hint: "Meet the big animals of the wild lands.",         members: ["ke", "tz", "za", "bw", "na", "ug"] },
  { id: "tiny",   name: "Tiny Treasures",    blurb: "The smallest countries of all",            emblem: "dot",     hint: "Find the smallest countries of all.",             members: ["va", "mc", "sm", "li", "nr", "tv", "mt"] },
  { id: "giants", name: "Mega Lands",        blurb: "The biggest countries on Earth",           emblem: "globe",   hint: "Explore the largest countries on Earth.",         members: ["ru", "ca", "cn", "us", "br", "au"] },
  { id: "amazon", name: "Amazon & Andes",    blurb: "Rainforests and the longest mountains",    emblem: "leaf",    hint: "Trek lands of jungle and high peaks.",            members: ["br", "pe", "co", "ec", "bo", "cl", "ve"] },
];

const MILESTONES: Array<Omit<Badge, "kind" | "members" | "emblem">> = [
  { id: "m5",   name: "First Steps",     blurb: "Visit your first 5 countries", needCount: 5 },
  { id: "m25",  name: "Pathfinder",      blurb: "Visit 25 countries", needCount: 25 },
  { id: "m100", name: "Halfway Around",  blurb: "Visit 100 countries", needCount: 100 },
  { id: "m201", name: "Master Explorer", blurb: `Visit all ${TOTAL_STOPS} countries`, needCount: TOTAL_STOPS },
];

export const CONTINENT_BADGES: Badge[] = CONTINENT_ORDER.map((c) => ({
  id: `cont-${c}`, name: c, shortName: CONT_EMBLEM[c].short, blurb: `Every country in ${c}`,
  emblem: CONT_EMBLEM[c].emblem, kind: "continent", members: BY_CONTINENT[c].map((x) => x.iso), continent: c,
}));

/* only keep theme members that actually exist in the book */
export const THEME_BADGES: Badge[] = RAW_THEMES.map((t) => ({
  ...t, kind: "theme" as const, members: t.members.filter((iso) => PAGE_OF_ISO[iso] !== undefined),
}));

export const MILESTONE_BADGES: Badge[] = MILESTONES.map((m) => ({ ...m, kind: "milestone" as const, emblem: "globe", members: [] }));

/* ── selectors ── */
export function visitedCountryCount(v: Set<number>): number {
  return JOURNEY.reduce((n, c) => n + (v.has(PAGE_OF_ISO[c.iso]) ? 1 : 0), 0);
}
export function isBadgeCollected(b: Badge, v: Set<number>): boolean {
  if (b.needCount) return visitedCountryCount(v) >= b.needCount;
  return b.members.length > 0 && b.members.every((iso) => v.has(PAGE_OF_ISO[iso]));
}
export function badgeDone(b: Badge, v: Set<number>): number {
  if (b.needCount) return Math.min(visitedCountryCount(v), b.needCount);
  return b.members.filter((iso) => v.has(PAGE_OF_ISO[iso])).length;
}
export function badgeTotal(b: Badge): number { return b.needCount ?? b.members.length; }
export function continentProgress(c: Continent, v: Set<number>): { done: number; total: number } {
  const list = BY_CONTINENT[c];
  return { done: list.reduce((n, x) => n + (v.has(PAGE_OF_ISO[x.iso]) ? 1 : 0), 0), total: list.length };
}
export function badgesEarned(v: Set<number>): number {
  return [...CONTINENT_BADGES, ...THEME_BADGES, ...MILESTONE_BADGES].filter((b) => isBadgeCollected(b, v)).length;
}
export const TOTAL_BADGES = CONTINENT_BADGES.length + THEME_BADGES.length + MILESTONE_BADGES.length;

/* visited COUNTRIES ordered most-recent-first (by stored timestamp) */
export interface VisitedCountry { iso: string; name: string; stop: number; ts: number; }
export function visitedCountriesByRecency(vs: Visits): VisitedCountry[] {
  const out: VisitedCountry[] = [];
  for (const [pageStr, ts] of Object.entries(vs)) {
    const iso = ISO_OF_PAGE[Number(pageStr)];
    if (!iso) continue;
    const m = JOURNEY.find((c) => c.iso === iso);
    if (m) out.push({ iso, name: m.name, stop: STOP_OF[iso] ?? 0, ts });
  }
  return out.sort((a, b) => b.ts - a.ts);
}
