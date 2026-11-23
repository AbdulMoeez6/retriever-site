// One toast at a time, bottom-right, hidden after 2.4s (same behaviour as the original site).
// Used by plain Astro page scripts and by the React workspace.

let toastEl = null;
let hideTimer = null;

export function showToast(message) {
  if (typeof document === "undefined") return;
  if (!toastEl) {
    toastEl = document.createElement("div");
    toastEl.className = "toast";
    toastEl.setAttribute("role", "status");
    toastEl.setAttribute("aria-live", "polite");
  }
  toastEl.textContent = message;
  // restart the entrance animation when a new message replaces an old one
  toastEl.style.animation = "none";
  void toastEl.offsetWidth;
  toastEl.style.animation = "";
  if (!toastEl.isConnected) document.body.appendChild(toastEl);
  clearTimeout(hideTimer);
  hideTimer = setTimeout(() => toastEl?.remove(), 2400);
}
