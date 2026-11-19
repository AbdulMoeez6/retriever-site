import { useEffect, useId, useState } from "react";
import { MONTHS, FRAMEWORKS } from "../data/sampleData.js";
import { useApp } from "../lib/store.jsx";
import { prefersReducedMotion, useCountUp } from "../lib/motion.js";

const SERIES = [
  { key: "TRL", color: "#1B365D" },
  { key: "MRL", color: "#5B7A9D" },
  { key: "IRL", color: "#8AA0B8" },
];

/** Lightweight SVG line/area chart with a draw-in animation. */
export function HistoryChart({ techId, area = false, height = 220 }) {
  const { history, theme } = useApp();
  const hist = history[techId] || { TRL: [], MRL: [], IRL: [] };
  const gid = useId().replace(/:/g, "");
  const animate = true; // CSS turns the draw-in off for prefers-reduced-motion
  const w = 640, h = height;
  const padL = 28, padR = 12, padT = 16, padB = 28;
  const n = MONTHS.length;
  const xAt = (i) => padL + (i * (w - padL - padR)) / Math.max(n - 1, 1);
  const yAt = (v) => (h - padB) - (v / 9) * (h - padT - padB);
  const gridColor = theme === "dark" ? "#2A3344" : "#E7EDF3";
  const labelColor = theme === "dark" ? "#8A94A6" : "#4B5465";
  const a = animate ? " animate" : "";

  return (
    <div>
      <div className="mb-2 flex flex-wrap gap-4">
        {SERIES.map((s) => (
          <span key={s.key} className="inline-flex items-center gap-1.5 text-xs text-muted dark:text-slate-400">
            <span className="inline-block h-0.5 w-4" style={{ background: s.color }} />{s.key}
          </span>
        ))}
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: h }} role="img" aria-label="Readiness levels over time">
        <defs>
          {SERIES.map((s, i) => (
            <linearGradient key={s.key} id={`${gid}${i}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={s.color} stopOpacity="0.28" />
              <stop offset="100%" stopColor={s.color} stopOpacity="0.02" />
            </linearGradient>
          ))}
        </defs>
        {[1, 3, 5, 7, 9].map((v) => (
          <g key={v}>
            <line x1={padL} x2={w - padR} y1={yAt(v)} y2={yAt(v)} stroke={gridColor} strokeWidth="1" />
            <text x="4" y={yAt(v) + 3} fontSize="10" fill={labelColor}>{v}</text>
          </g>
        ))}
        {SERIES.map((s, si) => {
          const arr = hist[s.key] || [];
          const segs = []; let cur = [];
          arr.forEach((v, i) => { if (v == null) { if (cur.length) { segs.push(cur); cur = []; } } else cur.push({ i, v }); });
          if (cur.length) segs.push(cur);
          return segs.map((seg, gi) => {
            const dLine = seg.map((p, i) => (i ? "L" : "M") + xAt(p.i) + " " + yAt(p.v)).join(" ");
            const first = seg[0], last = seg[seg.length - 1];
            const dArea = `${dLine} L ${xAt(last.i)} ${yAt(0)} L ${xAt(first.i)} ${yAt(0)} Z`;
            return (
              <g key={`${s.key}-${gi}`}>
                {area && <path className={`chart-area${a}`} d={dArea} fill={`url(#${gid}${si})`} />}
                <path className={`chart-line${a}`} pathLength="1" d={dLine} fill="none" stroke={s.color} strokeWidth="2" />
                {seg.map((p) => <circle key={p.i} className={`chart-dot${a}`} cx={xAt(p.i)} cy={yAt(p.v)} r="3" fill={s.color} />)}
              </g>
            );
          });
        })}
        {MONTHS.map((m, i) => <text key={m} x={xAt(i)} y={h - 8} fontSize="11" textAnchor="middle" fill={labelColor}>{m}</text>)}
      </svg>
    </div>
  );
}

export function HistoryTable({ techId }) {
  const { history, ui } = useApp();
  if (!ui.historyOpen) return null;
  const hist = history[techId] || { TRL: [], MRL: [], IRL: [] };
  return (
    <div className="mt-4 overflow-hidden rounded-lg border border-line dark:border-slate-700">
      <table className="w-full text-left text-sm">
        <thead className="bg-soft text-xs text-muted dark:bg-white/5 dark:text-slate-400">
          <tr><th className="px-3 py-2 font-medium">Month</th>{FRAMEWORKS.map((f) => <th key={f} className="px-3 py-2 font-medium">{f}</th>)}</tr>
        </thead>
        <tbody>
          {MONTHS.map((m, i) => (
            <tr key={m} className="border-t border-line dark:border-slate-800">
              <td className="px-3 py-2">{m} 2026</td>
              {FRAMEWORKS.map((f) => { const v = (hist[f] || [])[i]; return <td key={f} className="px-3 py-2 font-mono text-xs">{v == null ? "Not reviewed" : v}</td>; })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Readiness ring (1–9) with arc draw-in and count-up. */
export function Ring({ label, value, size = 112 }) {
  const { theme } = useApp();
  const r = 38, c = 2 * Math.PI * r;
  const v = value == null ? 0 : Number(value);
  const target = c - (Math.min(v, 9) / 9) * c;
  const [offset, setOffset] = useState(() => (prefersReducedMotion() ? target : c));
  useEffect(() => {
    if (prefersReducedMotion()) { setOffset(target); return; }
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setOffset(target)));
    return () => cancelAnimationFrame(id);
  }, [target]);
  const display = useCountUp(value == null ? NaN : value, 0);
  return (
    <div className="grid justify-items-center gap-1">
      <svg width={size} height={size} viewBox="0 0 112 112" className="overflow-visible">
        <circle cx="56" cy="56" r={r} fill="none" stroke={theme === "dark" ? "rgba(255,255,255,0.1)" : "#EEF3F8"} strokeWidth="8" />
        <circle cx="56" cy="56" r={r} fill="none" stroke={theme === "dark" ? "#E2E8F0" : "#1B365D"} strokeWidth="8" strokeLinecap="round"
          strokeDasharray={c.toFixed(2)} strokeDashoffset={offset} transform="rotate(-90 56 56)" className="ring-arc" />
        <text x="56" y="52" textAnchor="middle" fontSize="22" fontWeight="600" fill="currentColor">{value == null ? "—" : display}</text>
        <text x="56" y="70" textAnchor="middle" fontSize="10" fill={theme === "dark" ? "#8A94A6" : "#4B5465"}>of 9</text>
      </svg>
      <div className="text-sm font-medium">{label}</div>
    </div>
  );
}
