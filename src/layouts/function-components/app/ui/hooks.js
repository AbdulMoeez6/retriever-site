import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { greetingForNow, prefersReducedMotion } from "@/lib/format";

export const useIsoLayoutEffect =
  typeof window < "u" ? useLayoutEffect : useEffect;

export function useCountUp(A, e = 0, t = 700) {
  const n = Number(A),
    [r, l] = useState(n);
  return (
    useIsoLayoutEffect(() => {
      if (isNaN(n)) return;
      if (prefersReducedMotion()) {
        l(n);
        return;
      }
      l(0);
      let s;
      const a = performance.now(),
        o = (u) => {
          const p = Math.min(1, (u - a) / t);
          (l(n * (1 - Math.pow(1 - p, 3))),
            p < 1 ? (s = requestAnimationFrame(o)) : l(n));
        };
      return ((s = requestAnimationFrame(o)), () => cancelAnimationFrame(s));
    }, [n, t]),
    isNaN(n) ? A : e ? r.toFixed(e) : String(Math.round(r))
  );
}

export function useStaggerCards(A) {
  const e = useRef(null);
  return (
    useEffect(() => {
      if (!e.current || prefersReducedMotion()) return;
      e.current.querySelectorAll(".card").forEach((n, r) => {
        (n.classList.remove("stagger-in"),
          n.style.setProperty("--stagger", Math.min(r * 45, 360) + "ms"),
          n.offsetWidth,
          n.classList.add("stagger-in"));
        const l = () => {
          (n.classList.remove("stagger-in"),
            n.removeEventListener("animationend", l));
        };
        n.addEventListener("animationend", l);
      });
    }, [A]),
    e
  );
}

export function useGreeting() {
  const [A, e] = useState("Good afternoon");
  return (
    useEffect(() => {
      e(greetingForNow());
    }, []),
    A
  );
}
