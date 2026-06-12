/* Language preference — stored in localStorage, survives reloads. */
export type Lang = "en" | "fr" | "vi"
const KEY = "cb-lang"

export function getLang(): Lang {
  if (typeof localStorage === "undefined") return "en"
  const v = localStorage.getItem(KEY)
  return v === "fr" || v === "vi" ? v : "en"
}

export function setLang(l: Lang): void {
  localStorage.setItem(KEY, l)
  window.dispatchEvent(new Event("cb-lang-change"))
}
