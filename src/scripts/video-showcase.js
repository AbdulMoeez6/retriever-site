// Product video showcases: scroll reveal, pointer tilt, hover/tap/keyboard playback.
import { track } from "@/lib/analytics";
import { matchesMedia, prefersReducedMotion } from "@/lib/format";

const canHover = () => matchesMedia("(hover: hover) and (pointer: fine)");

function setupReveal(stage) {
  const reveal = () => stage.classList.add("revealed");
  if (prefersReducedMotion()) return reveal();

  const delay = Number(stage.dataset.revealAfter);
  const timers = [];
  let observer;
  const cleanup = () => {
    observer?.disconnect();
    timers.forEach(clearTimeout);
    window.removeEventListener("scroll", check, { capture: true });
    window.removeEventListener("resize", check);
  };
  const done = () => {
    reveal();
    cleanup();
  };
  function check() {
    const rect = stage.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    if (rect.top < vh * 0.92 && rect.bottom > vh * 0.08) done();
  }
  if (Number.isFinite(delay) && stage.dataset.revealAfter) timers.push(setTimeout(done, delay));
  if ("IntersectionObserver" in window) {
    observer = new IntersectionObserver((entries) => entries.some((e) => e.isIntersecting) && done(), {
      threshold: 0.12,
    });
    observer.observe(stage);
  }
  window.addEventListener("scroll", check, { passive: true, capture: true });
  window.addEventListener("resize", check);
  timers.push(setTimeout(check, 50));
}

function setupPlayer(stage) {
  const frame = stage.querySelector("[data-demo-video]");
  const video = stage.querySelector("video");
  const label = stage.querySelector("[data-play-label]");
  const maxTilt = Number(stage.dataset.maxTilt) || 6;
  if (!frame || !video) return;

  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  if (matchesMedia("(hover: none)") && label) label.textContent = "Tap to play";

  const setPlaying = (playing) => {
    frame.classList.toggle("is-playing", playing);
    frame.setAttribute("aria-pressed", String(playing));
  };
  const play = () => {
    video.muted = true;
    const result = video.play();
    const onPlay = () => {
      setPlaying(true);
      if (!video.classList.contains("is-on")) track("video_play", { video: frame.getAttribute("aria-label") });
      video.classList.add("is-on");
    };
    if (result?.then) result.then(onPlay).catch(() => {});
    else onPlay();
  };
  const pause = () => {
    video.pause();
    setPlaying(false);
  };
  const toggle = () => (video.paused ? play() : pause());

  let frameReq = 0;
  const resetTilt = () => {
    cancelAnimationFrame(frameReq);
    frame.classList.remove("is-tilting");
    frame.style.setProperty("--rx", "0deg");
    frame.style.setProperty("--ry", "0deg");
    frame.style.setProperty("--mx", "50%");
    frame.style.setProperty("--my", "30%");
  };

  frame.addEventListener("mouseenter", play);
  frame.addEventListener("mouseleave", () => {
    pause();
    resetTilt();
  });
  frame.addEventListener("mousemove", (event) => {
    if (prefersReducedMotion()) return;
    const rect = frame.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    cancelAnimationFrame(frameReq);
    frameReq = requestAnimationFrame(() => {
      frame.classList.add("is-tilting");
      frame.style.setProperty("--ry", `${((x - 0.5) * 2 * maxTilt).toFixed(2)}deg`);
      frame.style.setProperty("--rx", `${((0.5 - y) * 2 * maxTilt * 0.7).toFixed(2)}deg`);
      frame.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
      frame.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
    });
  });
  frame.addEventListener("click", (event) => {
    if (canHover()) return;
    event.preventDefault();
    toggle();
  });
  frame.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggle();
    }
  });
}

document.querySelectorAll("[data-video-showcase]").forEach((stage) => {
  setupReveal(stage);
  setupPlayer(stage);
});
