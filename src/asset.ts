/* asset.ts — resolve a public-folder path (e.g. "/photos/jp-hero.jpg", "/flags/jp.svg")
   against Vite's base URL, so images load correctly whether the site is served at the
   root in dev or under the /country-book/ sub-path on GitHub Pages. Full http(s) URLs and
   data URIs pass through untouched. */
export function asset(path: string | undefined | null): string {
  if (!path) return "";
  if (/^(https?:)?\/\//.test(path) || path.startsWith("data:")) return path;
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  return base + (path.startsWith("/") ? path : "/" + path);
}
