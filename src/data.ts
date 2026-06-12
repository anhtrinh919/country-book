/* Country data loader — eager-loads all language variants at build time.
   Falls back to English for any ISO not yet authored in fr/vi. */
import type { Country } from "./types";

const modules_en = import.meta.glob<{ default: Country }>("../data/*.json",    { eager: true });
const modules_fr = import.meta.glob<{ default: Country }>("../data-fr/*.json", { eager: true });
const modules_vi = import.meta.glob<{ default: Country }>("../data-vi/*.json", { eager: true });

function build(modules: Record<string, { default: Country }>) {
  const out: Record<string, Country> = {};
  for (const path in modules) {
    const iso = path.split("/").pop()!.replace(/\.json$/, "");
    out[iso] = modules[path].default;
  }
  return out;
}

const BY_LANG: Record<string, Record<string, Country>> = {
  en: build(modules_en),
  fr: build(modules_fr),
  vi: build(modules_vi),
};

/* Primary set — English for the main build, French for the fr build. */
const PRIMARY = import.meta.env.VITE_LANG === "fr" ? "fr" : "en";
export const COUNTRIES = BY_LANG[PRIMARY] ?? BY_LANG.en;

export function getCountry(iso: string): Country | undefined {
  return COUNTRIES[iso];
}

/* Language-aware lookup — falls back to English when translation not yet available. */
export function getCountryLang(iso: string, lang: string): Country | undefined {
  return (BY_LANG[lang] ?? {})[iso] ?? COUNTRIES[iso];
}

export const ISO_LIST = Object.keys(COUNTRIES);
