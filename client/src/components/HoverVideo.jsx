import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { safeMatchMedia } from "../lib/env.js";

// Inlined (data:) videos are converted to blob URLs once, so playback, looping and
// seeking behave like a normal file in the single-file preview build.
const blobCache = new Map();
function playableSrc(src) {
  if (!src || !src.startsWith("data:")) return src;
  if (blobCache.has(src)) return blobCache.get(src);
  try {
    const comma = src.indexOf(",");
    const mime = src.slice(5, src.indexOf(";")) || "video/mp4";
    const bin = atob(src.slice(comma + 1));
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    if (typeof URL === "undefined" || typeof URL.createObjectURL !== "function") return src;
    const url = URL.createObjectURL(new Blob([bytes], { type: mime }));
    blobCache.set(src, url);
    return url;
  } catch {
    return src;
  }
}

const canHover = () =>
  safeMatchMedia("(hover: hover) and (pointer: fine)");

/**
 * Muted, inline product video that plays only on interaction:
 * - pointer devices: play on mouseenter, pause on mouseleave
 * - touch devices: tap toggles play / pause
 * Never autoplays and never plays on scroll.
 */
const HoverVideo = forwardRef(function HoverVideo(
  { src, poster, className = "", screenClassName = "", label, children, onMouseMove, onMouseLeave, onMouseEnter, ...rest },
  ref
) {
  const videoRef = useRef(null);
  // Set on the client only, so prerendered HTML never carries the (large) inlined video.
  const [videoSrc, setVideoSrc] = useState(undefined);
  useEffect(() => { setVideoSrc(playableSrc(src)); }, [src]);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true; v.defaultMuted = true; v.playsInline = true;
  }, []);

  const play = useCallback(() => {
    const v = videoRef.current; if (!v) return;
    v.muted = true;
    const p = v.play();
    if (p?.then) p.then(() => { setPlaying(true); setStarted(true); }).catch(() => {}); else { setPlaying(true); setStarted(true); }
  }, []);
  const pause = useCallback(() => {
    const v = videoRef.current; if (!v) return;
    v.pause(); setPlaying(false);
  }, []);

  return (
    <div
      ref={ref}
      className={`${className} ${playing ? "is-playing" : ""}`}
      data-demo-video=""
      role="button"
      tabIndex={0}
      aria-label={label ? `${label} — hover or tap to play` : "Product video — hover or tap to play"}
      aria-pressed={playing}
      onMouseEnter={(e) => { play(); onMouseEnter?.(e); }}
      onMouseLeave={(e) => { pause(); onMouseLeave?.(e); }}
      onMouseMove={onMouseMove}
      onClick={(e) => { if (canHover()) return; e.preventDefault(); (videoRef.current?.paused ? play : pause)(); }}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); (videoRef.current?.paused ? play : pause)(); } }}
      {...rest}
    >
      <div className={`glass-screen ${screenClassName}`}>
        {poster && <img src={poster} alt="" className="glass-poster" draggable="false" />}
        <video ref={videoRef} src={videoSrc} onError={() => { if (videoSrc && videoSrc !== src) setVideoSrc(src); }} muted playsInline loop preload="metadata" className={`glass-video ${started ? "is-on" : ""}`} />
        {children}
      </div>
    </div>
  );
});

export default HoverVideo;
