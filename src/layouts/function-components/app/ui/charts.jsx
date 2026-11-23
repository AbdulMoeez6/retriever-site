import { useState, useEffect, useId } from "react";
import { UsageMeter } from "@/layouts/function-components/app/screens/Settings";
import { useCountUp } from "@/layouts/function-components/app/ui/hooks";
import { prefersReducedMotion } from "@/lib/format";
import { LEVELS, MONTHS } from "@/lib/sample-data";
import { useStore } from "@/lib/store";

export function CountUp({ value, decimals = 0 }) {
  return <>{useCountUp(value, decimals)}</>;
}

export function KpiTile({ label, value, sub, onClick, compact = false }) {
  const l = String(value).includes(".") ? 1 : 0;
  return compact ? (
    <div className="card p-3">
      <div className="text-[11px] text-muted dark:text-slate-400">{label}</div>
      <div className="text-lg font-semibold tabular-nums">
        <CountUp value={value} decimals={l} />
      </div>
    </div>
  ) : (
    <button
      type="button"
      onClick={onClick}
      className="card card-hover p-4 text-left"
    >
      <div className="text-xs text-muted dark:text-slate-400">{label}</div>
      <div className="mt-1 text-2xl font-semibold tabular-nums">
        <CountUp value={value} decimals={l} />
      </div>
      {sub && (
        <div className="mt-1 text-[11px] text-muted dark:text-slate-400">
          {sub}
        </div>
      )}
    </button>
  );
}

export const SERIES = [
  {
    key: "TRL",
    color: "#1B365D",
  },
  {
    key: "MRL",
    color: "#5B7A9D",
  },
  {
    key: "IRL",
    color: "#8AA0B8",
  },
];

export function ReadinessChart({ techId, area = false, height = 220 }) {
  const { history, theme } = useStore(),
    l = history[techId] || {
      TRL: [],
      MRL: [],
      IRL: [],
    },
    s = useId().replace(/:/g, ""),
    a = 640,
    o = height,
    u = 28,
    p = 12,
    f = 16,
    E = 28,
    g = MONTHS.length,
    x = (d) => u + (d * (a - u - p)) / Math.max(g - 1, 1),
    Q = (d) => o - E - (d / 9) * (o - f - E),
    w = theme === "dark" ? "#2A3344" : "#E7EDF3",
    m = theme === "dark" ? "#8A94A6" : "#4B5465",
    c = " animate";
  return (
    <div>
      <div className="mb-2 flex flex-wrap gap-4">
        {SERIES.map((d) => (
          <span
            key={d.key}
            className="inline-flex items-center gap-1.5 text-xs text-muted dark:text-slate-400"
          >
            <span
              className="inline-block h-0.5 w-4"
              style={{
                background: d.color,
              }}
            />
            {d.key}
          </span>
        ))}
      </div>
      <svg
        viewBox={`0 0 ${a} ${o}`}
        className="w-full"
        style={{
          height: o,
        }}
        role="img"
        aria-label="Readiness levels over time"
      >
        <defs>
          {SERIES.map((d, B) => (
            <linearGradient
              key={d.key}
              id={`${s}${B}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor={d.color} stopOpacity="0.28" />
              <stop offset="100%" stopColor={d.color} stopOpacity="0.02" />
            </linearGradient>
          ))}
        </defs>
        {[1, 3, 5, 7, 9].map((d) => (
          <g key={d}>
            <line
              x1={u}
              x2={a - p}
              y1={Q(d)}
              y2={Q(d)}
              stroke={w}
              strokeWidth="1"
            />
            <text x="4" y={Q(d) + 3} fontSize="10" fill={m}>
              {d}
            </text>
          </g>
        ))}
        {SERIES.map((d, B) => {
          const I = l[d.key] || [],
            R = [];
          let C = [];
          return (
            I.forEach((y, T) => {
              y == null
                ? C.length && (R.push(C), (C = []))
                : C.push({
                    i: T,
                    v: y,
                  });
            }),
            C.length && R.push(C),
            R.map((y, T) => {
              const U = y
                  .map((ce, Os) => (Os ? "L" : "M") + x(ce.i) + " " + Q(ce.v))
                  .join(" "),
                EA = y[0],
                Ke = y[y.length - 1],
                Je = `${U} L ${x(Ke.i)} ${Q(0)} L ${x(EA.i)} ${Q(0)} Z`;
              return (
                <g key={`${d.key}-${T}`}>
                  {area && (
                    <path
                      className={`chart-area${c}`}
                      d={Je}
                      fill={`url(#${s}${B})`}
                    />
                  )}
                  <path
                    className={`chart-line${c}`}
                    pathLength="1"
                    d={U}
                    fill="none"
                    stroke={d.color}
                    strokeWidth="2"
                  />
                  {y.map((ce) => (
                    <circle
                      key={ce.i}
                      className={`chart-dot${c}`}
                      cx={x(ce.i)}
                      cy={Q(ce.v)}
                      r="3"
                      fill={d.color}
                    />
                  ))}
                </g>
              );
            })
          );
        })}
        {MONTHS.map((d, B) => (
          <text
            key={d}
            x={x(B)}
            y={o - 8}
            fontSize="11"
            textAnchor="middle"
            fill={m}
          >
            {d}
          </text>
        ))}
      </svg>
    </div>
  );
}

export function HistoryTable({ techId }) {
  const { history, ui } = useStore();
  if (!ui.historyOpen) return null;
  const n = history[techId] || {
    TRL: [],
    MRL: [],
    IRL: [],
  };
  return (
    <div className="mt-4 overflow-hidden rounded-lg border border-line dark:border-slate-700">
      <table className="w-full text-left text-sm">
        <thead className="bg-soft text-xs text-muted dark:bg-white/5 dark:text-slate-400">
          <tr>
            <th className="px-3 py-2 font-medium">Month</th>
            {LEVELS.map((r) => (
              <th key={r} className="px-3 py-2 font-medium">
                {r}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {MONTHS.map((r, l) => (
            <tr key={r} className="border-t border-line dark:border-slate-800">
              <UsageMeter className="px-3 py-2">
                {r}
                {" 2026"}
              </UsageMeter>
              {LEVELS.map((s) => {
                const a = (n[s] || [])[l];
                return (
                  <UsageMeter key={s} className="px-3 py-2 font-mono text-xs">
                    {a ?? "Not reviewed"}
                  </UsageMeter>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function LevelRing({ label, value, size = 112 }) {
  const { theme } = useStore(),
    r = 38,
    l = 2 * Math.PI * r,
    s = value == null ? 0 : Number(value),
    a = l - (Math.min(s, 9) / 9) * l,
    [o, u] = useState(() => (prefersReducedMotion() ? a : l));
  useEffect(() => {
    if (prefersReducedMotion()) {
      u(a);
      return;
    }
    const f = requestAnimationFrame(() => requestAnimationFrame(() => u(a)));
    return () => cancelAnimationFrame(f);
  }, [a]);
  const p = useCountUp(value ?? NaN, 0);
  return (
    <div className="grid justify-items-center gap-1">
      <svg
        width={size}
        height={size}
        viewBox="0 0 112 112"
        className="overflow-visible"
      >
        <circle
          cx="56"
          cy="56"
          r={r}
          fill="none"
          stroke={theme === "dark" ? "rgba(255,255,255,0.1)" : "#EEF3F8"}
          strokeWidth="8"
        />
        <circle
          cx="56"
          cy="56"
          r={r}
          fill="none"
          stroke={theme === "dark" ? "#E2E8F0" : "#1B365D"}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={l.toFixed(2)}
          strokeDashoffset={o}
          transform="rotate(-90 56 56)"
          className="ring-arc"
        />
        <text
          x="56"
          y="52"
          textAnchor="middle"
          fontSize="22"
          fontWeight="600"
          fill="currentColor"
        >
          {value == null ? "—" : p}
        </text>
        <text
          x="56"
          y="70"
          textAnchor="middle"
          fontSize="10"
          fill={theme === "dark" ? "#8A94A6" : "#4B5465"}
        >
          of 9
        </text>
      </svg>
      <div className="text-sm font-medium">{label}</div>
    </div>
  );
}
