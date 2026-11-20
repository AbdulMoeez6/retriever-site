import { forwardRef, useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "../lib/motion.js";

// Inlined (data:) videos are converted to blob URLs once, so playback and looping
// behave like a normal file in the single-file build. If that fails, the data URI is used.
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

/**
 * Product video that autoplays muted and loops inline, with no interaction needed.
 * With prefers-reduced-motion, only the poster is shown.
 */
const DemoVideo = forwardRef(function DemoVideo({ src, poster, className = "", screenClassName = "", label, children }, ref) {
  const videoRef = useRef(null);
  // Set on the client only, so prerendered HTML never carries the (large) inlined video.
  const [videoSrc, setVideoSrc] = useState(undefined);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    setVideoSrc(playableSrc(src));
  }, [src]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !videoSrc) return;
    v.muted = true; v.defaultMuted = true; v.playsInline = true;
    const p = v.play();
    if (p?.catch) p.catch(() => {});
  }, [videoSrc]);

  return (
    <div ref={ref} className={`${className} ${started ? "is-playing" : ""}`} data-demo-video="" role="img" aria-label={label || "Product video"}>
      <div className={`glass-screen ${screenClassName}`}>
        {poster && <img src={poster} alt="" className="glass-poster" draggable="false" />}
        {videoSrc && (
          <video ref={videoRef} src={videoSrc} aria-hidden="true" autoPlay muted loop playsInline preload="auto"
            onPlaying={() => setStarted(true)}
            onError={() => { if (videoSrc !== src) setVideoSrc(src); }}
            className={`glass-video ${started ? "is-on" : ""}`} />
        )}
        {children}
      </div>
    </div>
  );
});

export default DemoVideo;
