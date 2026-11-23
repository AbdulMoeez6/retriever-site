// Site-relative URLs that respect Astro's `base` (e.g. GitHub Pages serves the site under /retriever-site/).
const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

/** "/pricing" -> "/retriever-site/pricing". External, hash and relative URLs are returned unchanged. */
export function withBase(path) {
  if (typeof path !== "string" || !path.startsWith("/") || path.startsWith("//")) return path;
  if (BASE && (path === BASE || path.startsWith(BASE + "/"))) return path;
  return BASE + path;
}

/** Current pathname without the base prefix and trailing slash ("/retriever-site/pricing/" -> "/pricing"). */
export function pathWithoutBase(pathname) {
  let path = pathname;
  if (BASE && path.startsWith(BASE)) path = path.slice(BASE.length);
  return path.replace(/\/$/, "") || "/";
}
