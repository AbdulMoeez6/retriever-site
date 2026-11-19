// Defensive browser helpers. The single-file preview may run from file://, inside an
// <iframe srcdoc> (location = about:srcdoc, e.g. SharePoint's viewer), or in a sandboxed
// frame without allow-same-origin, where storage throws SecurityError and URL-based
// routing cannot build URLs. Every helper here fails soft.

export const isBrowser = typeof window !== "undefined";

export function safeMatchMedia(query) {
  try { return !!(isBrowser && window.matchMedia && window.matchMedia(query).matches); } catch { return false; }
}

export function storageGet(key) {
  try { return window.localStorage.getItem(key); } catch { return null; }
}
export function storageSet(key, value) {
  try { window.localStorage.setItem(key, value); } catch { /* storage unavailable (sandbox) */ }
}

/** Current location.hash, or "" when it can't be read. */
export function safeHash() {
  try { return window.location.hash || ""; } catch { return ""; }
}

/**
 * True when URL-based (hash/browser) routing works here. React Router builds URLs with
 * new URL(path, location.origin or location.href), which throws in about:srcdoc,
 * and history.replaceState can throw in sandboxed frames.
 */
export function canUseUrlRouting() {
  if (!isBrowser) return false;
  try {
    const { protocol, origin, href } = window.location;
    if (protocol !== "file:" && protocol !== "http:" && protocol !== "https:") return false;
    new URL("/", origin !== "null" ? origin : href);
    window.history.replaceState(window.history.state, "", href);
    return true;
  } catch {
    return false;
  }
}

/** A link to the current page (used for the "share roadmap" copy link). */
export function pageUrl() {
  try { return window.location.href.split("#")[0]; } catch { return ""; }
}

/**
 * Sandboxed frames without "allow-forms" (e.g. some file viewers) block native form
 * submission before the submit event fires, so React's onSubmit never runs. No form here
 * ever posts anywhere, so we intercept submit clicks and Enter presses and dispatch a
 * plain (cancelable) submit event that React handles as usual.
 */
export function installFormSubmitShim() {
  if (!isBrowser) return;
  const fire = (form, e) => {
    if (!form) return;
    e.preventDefault();
    if (!form.noValidate && typeof form.reportValidity === "function" && !form.reportValidity()) return;
    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
  };
  document.addEventListener("click", (e) => {
    const btn = e.target instanceof Element ? e.target.closest("button, input[type=submit]") : null;
    if (!btn || btn.disabled) return;
    const type = (btn.getAttribute("type") || "submit").toLowerCase();
    if (type !== "submit") return;
    fire(btn.form, e);
  }, true);
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" || e.isComposing) return;
    const el = e.target;
    if (!(el instanceof HTMLInputElement) || !el.form) return;
    if (["checkbox", "radio", "button", "submit", "reset", "file"].includes(el.type)) return;
    fire(el.form, e);
  }, true);
}
