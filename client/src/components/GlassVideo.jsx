import DemoVideo from "./DemoVideo.jsx";
import { useReveal } from "../lib/motion.js";

/**
 * Glass frame around an autoplaying DemoVideo.
 * variant "device": portrait phone-style frame. variant "wide": landscape frame.
 * Fades in with a soft reveal; motion is disabled for prefers-reduced-motion.
 */
export default function GlassVideo({ variant = "wide", src, poster, label, className = "", delay = 0, revealAfter = null }) {
  const [revealRef, revealed] = useReveal({ threshold: 0.12, rootMargin: "0px", delay: revealAfter });
  const device = variant === "device";
  return (
    <div ref={revealRef} className={`glass-stage glass-reveal ${revealed ? "revealed" : ""} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      <div aria-hidden="true" className="glass-glow"
        style={device
          ? { inset: "6% -18% -4% -18%", background: "radial-gradient(ellipse at 50% 50%, rgba(27,54,93,0.42), rgba(80,140,210,0.18) 45%, transparent 72%)" }
          : { inset: "4% 6% -8% 6%", background: "radial-gradient(ellipse at 50% 50%, rgba(80,140,210,0.45), rgba(40,90,165,0.15) 50%, transparent 72%)" }} />
      <DemoVideo
        src={src}
        poster={poster}
        label={label}
        className={`glass-frame ${device ? "glass-device" : "glass-wide"}`}
        screenClassName={device ? "aspect-[9/16]" : "aspect-video"}
      >
        {device && <span className="device-notch" aria-hidden="true" />}
      </DemoVideo>
    </div>
  );
}
