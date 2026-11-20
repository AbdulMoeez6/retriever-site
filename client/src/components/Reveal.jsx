import { useReveal } from "../lib/motion.js";

/** Gentle fade-and-rise once the element scrolls into view. Visible without JavaScript and under reduced motion. */
export default function Reveal({ as: Tag = "div", delay = 0, className = "", children }) {
  const [ref, revealed] = useReveal({ threshold: 0.2 });
  return <Tag ref={ref} className={`sr ${revealed ? "revealed" : ""} ${className}`} style={{ "--sr-d": `${delay}ms` }}>{children}</Tag>;
}
