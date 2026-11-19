import { useEffect, useRef, useState } from "react";
import { safeMatchMedia } from "../lib/env.js";
import HoverVideo from "./HoverVideo.jsx";
import Icon from "./Icon.jsx";
import { prefersReducedMotion, useReveal } from "../lib/motion.js";

/**
 * Premium glass frame around a HoverVideo.
 * variant "device": portrait phone-style frame (hero).
 * variant "wide": landscape frame (showcase).
 * Fades/scales in with a blur-to-sharp reveal, tilts gently toward the pointer,
 * and has a shimmering glass edge. All motion is disabled for prefers-reduced-motion.
 */
export default function GlassVideo({ variant = "wide", src, poster, label, className = "", maxTilt = 6, delay = 0, revealAfter = null }) {
  const [revealRef, revealed] = useReveal({ threshold: 0.12, rootMargin: "0px", delay: revealAfter });
  const frameRef = useRef(null);
  const [hint, setHint] = useState("Hover to play");
  useEffect(() => { if (safeMatchMedia("(hover: none)")) setHint("Tap to play"); }, []);
  const raf = useRef(0);

  const onMove = (e) => {
    if (prefersReducedMotion()) return;
    const el = frameRef.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      el.classList.add("is-tilting");
      el.style.setProperty("--ry", `${((px - 0.5) * 2 * maxTilt).toFixed(2)}deg`);
      el.style.setProperty("--rx", `${((0.5 - py) * 2 * maxTilt * 0.7).toFixed(2)}deg`);
      el.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
      el.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
    });
  };
  const onLeave = () => {
    const el = frameRef.current; if (!el) return;
    cancelAnimationFrame(raf.current);
    el.classList.remove("is-tilting");
    el.style.setProperty("--rx", "0deg"); el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--mx", "50%"); el.style.setProperty("--my", "30%");
  };

  const device = variant === "device";
  return (
    <div ref={revealRef} className={`glass-stage glass-reveal ${revealed ? "revealed" : ""} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      <div aria-hidden="true" className="glass-glow"
        style={device
          ? { inset: "6% -18% -4% -18%", background: "radial-gradient(ellipse at 50% 50%, rgba(27,54,93,0.42), rgba(80,140,210,0.18) 45%, transparent 72%)" }
          : { inset: "4% 6% -8% 6%", background: "radial-gradient(ellipse at 50% 50%, rgba(80,140,210,0.45), rgba(40,90,165,0.15) 50%, transparent 72%)" }} />
      <HoverVideo
        ref={frameRef}
        src={src}
        poster={poster}
        label={label}
        className={`glass-frame ${device ? "glass-device" : "glass-wide"}`}
        screenClassName={device ? "aspect-[9/16]" : "aspect-video"}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
      >
        {device && <span className="device-notch" aria-hidden="true" />}
        <span className="play-hint" aria-hidden="true"><Icon name="play" className="size-3" /> {hint}</span>
      </HoverVideo>
    </div>
  );
}
