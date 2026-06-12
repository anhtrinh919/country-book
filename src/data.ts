/* Country data loader — globs every data/<iso>.json at build time.
   Key = filename without extension (the ISO code), e.g. "jp". */
import type { Country } from "./types";

const modules = import.meta.glob<{ default: Country }>("../data/*.json", { eager: true });

export const COUNTRIES: Record<string, Country> = {};
for (const path in modules) {
  const iso = path.split("/").pop()!.replace(/\.json$/, "");
  COUNTRIES[iso] = modules[path].default;
}

export function getCountry(iso: string): Country | undefined {
  return COUNTRIES[iso];
}

export const ISO_LIST = Object.keys(COUNTRIES);
