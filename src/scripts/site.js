// Behaviour shared by every marketing page: header (mobile menu + sticky shadow),
// theme toggles, demo toasts and the quick-assessment launcher.
import { toggleTheme } from "@/lib/theme";
import { showToast } from "@/lib/toast";

window.__retrieverBooted = true;

// --- header: mobile menu (Pinwheel toggler) ---
const navToggle = document.getElementById("nav-toggle");
const navMenu = document.getElementById("nav-menu");
if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const open = navMenu.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
  navMenu.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      navMenu.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

// --- header: sticky shadow (Pinwheel behaviour) ---
const header = document.querySelector(".header");
if (header) {
  const onScroll = () => header.classList.toggle("header-sticky", window.scrollY > 0);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

// --- theme ---
document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
  button.addEventListener("click", toggleTheme);
});

// --- demo toasts (e.g. "Contact sales") ---
document.addEventListener("click", (event) => {
  const trigger = event.target.closest("[data-toast]");
  if (trigger) showToast(trigger.getAttribute("data-toast"));
});

// --- five-question quick assessment (rendered by the QuickAssessment island) ---
document.querySelectorAll("[data-quick-open]").forEach((button) => {
  button.addEventListener("click", () => window.dispatchEvent(new Event("retriever:quick-open")));
});
