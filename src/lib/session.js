// Session storage keys for the sample workspace. Plain JS so Astro page scripts
// (e.g. sign-in) can update workspace state without loading React.

export const DATA_KEY = "retriever:data";
export const UI_KEY = "retriever:ui";

export function readStored(key) {
  try {
    const raw = window.sessionStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function writeStored(key, value) {
  try {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

/** Merge a patch into the stored workspace UI state (used by the sign-in page). */
export function patchStoredUi(patch) {
  writeStored(UI_KEY, { ...(readStored(UI_KEY) || {}), ...patch });
}
