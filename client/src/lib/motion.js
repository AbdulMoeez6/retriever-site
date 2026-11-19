import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { safeMatchMedia } from "./env.js";

// useLayoutEffect on the client (runs before paint), useEffect during prerender.
export const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export const prefersReducedMotion = () =>
  safeMatchMedia("(prefers-reduced-motion: reduce)");

/** Animate a number from 0 to `end` with an ease-out curve. */
export function useCountUp(end, decimals = 0, duration = 700) {
  const target = Number(end);
  // Start at the final value so prerendered / no-JS HTML shows real numbers; animate from 0 on the client.
  const [val, setVal] = useState(target);
  useIsoLayoutEffect(() => {
    if (isNaN(target)) return;
    if (prefersReducedMotion()) { setVal(target); return; }
    setVal(0);
    let raf; const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      setVal(target * (1 - Math.pow(1 - t, 3)));
      if (t < 1) raf = requestAnimationFrame(tick); else setVal(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  if (isNaN(target)) return end;
  return decimals ? val.toFixed(decimals) : String(Math.round(val));
}

/**
 * Adds `revealed` when the element enters the viewport.
 * `delay` (ms): reveal automatically after this delay regardless of position (used for the hero).
 * Falls back to a scroll/resize position check if IntersectionObserver never fires.
 */
export function useReveal({ threshold = 0.12, rootMargin = "0px", delay = null } = {}) {
  const ref = useRef(null);
  // Always false on first render (matches the prerendered HTML). Without JS, CSS keeps frames visible.
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    if (revealed) return;
    if (prefersReducedMotion()) { setRevealed(true); return; }
    const el = ref.current;
    if (!el) return;
    let done = false;
    const reveal = () => { if (!done) { done = true; setRevealed(true); } };
    const timers = [];
    if (delay != null) timers.push(setTimeout(reveal, delay));
    const inView = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      return r.top < vh * 0.92 && r.bottom > vh * 0.08;
    };
    const onScroll = () => { if (inView()) reveal(); };
    let io;
    if (typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver((entries) => { if (entries.some((en) => en.isIntersecting)) reveal(); }, { threshold, rootMargin });
      io.observe(el);
    }
    window.addEventListener("scroll", onScroll, { passive: true, capture: true });
    window.addEventListener("resize", onScroll);
    timers.push(setTimeout(onScroll, 50));
    return () => {
      io?.disconnect();
      timers.forEach(clearTimeout);
      window.removeEventListener("scroll", onScroll, { capture: true });
      window.removeEventListener("resize", onScroll);
    };
  }, [revealed, threshold, rootMargin, delay]);
  return [ref, revealed];
}

/** On mount (route change), staggers every .card inside the container. */
export function useStaggerCards(dep) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current || prefersReducedMotion()) return;
    const cards = ref.current.querySelectorAll(".card");
    cards.forEach((el, i) => {
      el.classList.remove("stagger-in");
      el.style.setProperty("--stagger", Math.min(i * 45, 360) + "ms");
      void el.offsetWidth;
      el.classList.add("stagger-in");
      const done = () => { el.classList.remove("stagger-in"); el.removeEventListener("animationend", done); };
      el.addEventListener("animationend", done);
    });
  }, [dep]);
  return ref;
}
