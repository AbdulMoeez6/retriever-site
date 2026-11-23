// Light/dark theme shared by every page. The class is applied before first paint by the
// inline script in Base.astro / AppLayout.astro; this module handles toggling afterwards.
// Plain JS (no React) so marketing pages can use it without loading a framework.

export const THEME_KEY = "retriever-theme";
export const THEME_EVENT = "retriever:theme";

export function getTheme() {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function setTheme(theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  try {
    window.localStorage.setItem(THEME_KEY, theme);
  } catch {}
  window.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: theme }));
}

export function toggleTheme() {
  setTheme(getTheme() === "dark" ? "light" : "dark");
}

export function subscribeTheme(callback) {
  window.addEventListener(THEME_EVENT, callback);
  return () => window.removeEventListener(THEME_EVENT, callback);
}
