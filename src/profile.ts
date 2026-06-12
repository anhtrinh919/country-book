/* profile.ts — the explorer's identity (name, age, nationality, home country).
   Defaults to Momo (the printed edition); in the interactive reader any child can make it their
   own via the onboarding card. The RANK is not stored — it's earned, derived from how many
   countries have been read. Persisted in localStorage. */
import React from "react";
import { PERSON, JOURNEY } from "../book.config";

const KEY = "cb-profile-v1";
const ONBOARD_KEY = "cb-onboarded-v1";

export interface Profile {
  name: string;
  age: number;
  nationality: string;
  homeCountry: string;
  homeIso: string;
}

export const DEFAULT_PROFILE: Profile = {
  name: PERSON.name,
  age: PERSON.age,
  nationality: "Vietnamese",
  homeCountry: "Vietnam",
  homeIso: PERSON.homeIso,
};

let profile: Profile = load();
const listeners = new Set<() => void>();

function load(): Profile {
  try { const r = localStorage.getItem(KEY); if (r) return { ...DEFAULT_PROFILE, ...(JSON.parse(r) as Partial<Profile>) }; }
  catch { /* ignore */ }
  return DEFAULT_PROFILE;
}

export function subscribe(cb: () => void) { listeners.add(cb); return () => { listeners.delete(cb); }; }
export function getProfile(): Profile { return profile; }
export function setProfile(p: Profile) {
  profile = p;
  try { localStorage.setItem(KEY, JSON.stringify(p)); localStorage.setItem(ONBOARD_KEY, "1"); } catch { /* ignore */ }
  listeners.forEach((l) => l());
}
export function hasOnboarded(): boolean { try { return localStorage.getItem(ONBOARD_KEY) === "1"; } catch { return true; } }
export function markOnboarded() { try { localStorage.setItem(ONBOARD_KEY, "1"); } catch { /* ignore */ } }

export function useProfile(): Profile { return React.useSyncExternalStore(subscribe, getProfile); }

/* home-country options for the onboarding picker */
export const COUNTRY_OPTIONS = [...JOURNEY].map((c) => ({ iso: c.iso, name: c.name })).sort((a, b) => a.name.localeCompare(b.name));

/* ── RANK — earned by countries read (not stored) ── */
const RANKS: Array<{ at: number; title: string }> = [
  { at: 0,   title: "Cadet Explorer" },
  { at: 3,   title: "Scout" },
  { at: 10,  title: "Pathfinder" },
  { at: 25,  title: "Navigator" },
  { at: 50,  title: "Voyager" },
  { at: 100, title: "Chief Explorer" },
  { at: 201, title: "Master Explorer" },
];
export function rankFor(countriesVisited: number): string {
  let r = RANKS[0].title;
  for (const x of RANKS) if (countriesVisited >= x.at) r = x.title;
  return r;
}
/* the next rank up + how many more countries to reach it (null if maxed) */
export function nextRank(countriesVisited: number): { title: string; at: number; remaining: number } | null {
  const nxt = RANKS.find((x) => x.at > countriesVisited);
  return nxt ? { title: nxt.title, at: nxt.at, remaining: nxt.at - countriesVisited } : null;
}
