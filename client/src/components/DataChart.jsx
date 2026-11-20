import { useEffect, useId, useRef, useState } from "react";
import { useApp } from "../lib/store.jsx";
import { Segmented, usePref, useShown } from "./ViewControls.jsx";
import { MONTHS, FRAMEWORKS } from "../data/sampleData.js";
import { PIPELINE_STAGES } from "../data/pilotData.js";
import { formatMoney } from "./ui.jsx";

const SHADES = ["#1B365D", "#3E5C86", "#6C86A8", "#9DB0C8", "#C9D4E2", "#2E5AAC"];
const TYPE_META = { line: ["Line", "chartLine"], area: ["Area", "chartArea"], bar: ["Bar", "chartBar"], donut: ["Donut", "donut"] };

/**
 * Small SVG chart with four types.
 * labels: x labels; series: [{ key, color, values: (number|null)[] }].
 * Donut uses the first series, one slice per label.
 */
function niceMax(v) {
  const p = Math.pow(10, Math.floor(Math.log10(v)));
  const m = [1, 2, 2.5, 5, 10].find((k) => k * p >= v);
  return m * p;
}

/** Tracks the rendered width so labels keep their real size. */
function useWidth(initial = 640) {
  const ref = useRef(null);
  const [w, setW] = useState(initial);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const read = () => { const x = Math.round(el.getBoundingClientRect().width); if (x > 0) setW(x); };
    read();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(read); ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, w];
}

export function DataChart({ type = "line", labels, series, yMax, yTicks, format = (v) => v, height = 200 }) {
  const { theme } = useApp();
  const [boxRef, boxW] = useWidth();
  const gid = useId().replace(/:/g, "");
  const grid = theme === "dark" ? "#2A3344" : "#E7EDF3";
  const ink = theme === "dark" ? "#8A94A6" : "#4B5465";

  if (type === "donut") {
    const vals = (series[0]?.values || []).map((v) => v || 0);
    const total = vals.reduce((a, b) => a + b, 0) || 1;
    const r = 52, c = 2 * Math.PI * r;
    let acc = 0;
    return (
      <div ref={boxRef} className="flex flex-wrap items-center gap-8">
        <svg viewBox="0 0 140 140" className="size-40 shrink-0" role="img" aria-label="Donut chart">
          <circle cx="70" cy="70" r={r} fill="none" stroke={theme === "dark" ? "rgba(255,255,255,.08)" : "#EEF3F8"} strokeWidth="18" />
          {vals.map((v, i) => {
            const len = (v / total) * c;
            const el = v ? <circle key={i} className="donut-seg" cx="70" cy="70" r={r} fill="none" stroke={SHADES[i % SHADES.length]} strokeWidth="18"
              strokeDasharray={`${Math.max(len - 2, 0.01)} ${c}`} strokeDashoffset={-acc} transform="rotate(-90 70 70)" style={{ "--i": i }}><title>{`${labels[i]} · ${format(v)}`}</title></circle> : null;
            acc += len; return el;
          })}
          <text x="70" y="68" textAnchor="middle" fontSize="18" fontWeight="600" fill="currentColor">{format(vals.reduce((a, b) => a + b, 0))}</text>
          <text x="70" y="84" textAnchor="middle" fontSize="9" fill={ink}>total</text>
        </svg>
        <ul className="grid min-w-[10rem] flex-1 gap-2 text-xs">
          {labels.map((l, i) => (
            <li key={l} className="flex items-center gap-2">
              <span className="size-2.5 rounded-sm" style={{ background: SHADES[i % SHADES.length] }} />
              <span className="flex-1 text-muted dark:text-slate-400">{l}</span>
              <span className="font-mono">{vals[i] ? format(vals[i]) : "—"}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const w = Math.max(boxW, 240), h = height, padL = 42, padR = 10, padT = 12, padB = 26;
  const all = series.flatMap((s) => s.values).filter((v) => v != null);
  const max = yMax || niceMax(Math.max(1, ...all));
  const ticks = yTicks || [0, max / 2, max];
  const n = labels.length;
  const band = (w - padL - padR) / Math.max(n, 1);
  const xAt = (i) => (type === "bar" ? padL + band * (i + 0.5) : padL + (i * (w - padL - padR)) / Math.max(n - 1, 1));
  const yAt = (v) => h - padB - (v / max) * (h - padT - padB);
  const showLegend = series.length > 1;

  return (
    <div ref={boxRef}>
      {showLegend && (
        <div className="mb-2 flex flex-wrap gap-4">
          {series.map((s) => <span key={s.key} className="inline-flex items-center gap-1.5 text-xs text-muted dark:text-slate-400"><span className="inline-block h-2 w-2 rounded-sm" style={{ background: s.color }} />{s.key}</span>)}
        </div>
      )}
      <svg key={type} viewBox={`0 0 ${w} ${h}`} width={w} height={h} className="block max-w-full" role="img" aria-label={`${TYPE_META[type][0]} chart`}>
        <defs>
          {series.map((s, i) => (
            <linearGradient key={s.key} id={`${gid}${i}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={s.color} stopOpacity="0.26" /><stop offset="100%" stopColor={s.color} stopOpacity="0.02" />
            </linearGradient>
          ))}
        </defs>
        {ticks.map((v) => (
          <g key={v}>
            <line x1={padL} x2={w - padR} y1={yAt(v)} y2={yAt(v)} stroke={grid} />
            <text x={padL - 6} y={yAt(v) + 3} fontSize="10" textAnchor="end" fill={ink}>{format(Math.round(v * 10) / 10)}</text>
          </g>
        ))}
        {type === "bar" ? labels.map((l, i) => {
          const bw = Math.min(26, (band * 0.7) / series.length);
          const x0 = xAt(i) - (bw * series.length) / 2;
          return series.map((s, si) => {
            const v = s.values[i];
            if (v == null) return null;
            return <rect key={`${l}-${s.key}`} className="col-fill" x={x0 + si * bw + 1} y={yAt(v)} width={bw - 2} height={Math.max(yAt(0) - yAt(v), 0)} rx="3" fill={s.color} style={{ "--d": `${i * 50}ms` }}><title>{`${l} · ${s.key} · ${format(v)}`}</title></rect>;
          });
        }) : series.map((s, si) => {
          const segs = []; let cur = [];
          s.values.forEach((v, i) => { if (v == null) { if (cur.length) segs.push(cur); cur = []; } else cur.push({ i, v }); });
          if (cur.length) segs.push(cur);
          return segs.map((seg, gi) => {
            const d = seg.map((p, k) => `${k ? "L" : "M"}${xAt(p.i)} ${yAt(p.v)}`).join(" ");
            const area = `${d} L${xAt(seg[seg.length - 1].i)} ${yAt(0)} L${xAt(seg[0].i)} ${yAt(0)} Z`;
            return (
              <g key={`${s.key}${gi}`}>
                {type === "area" && <path className="chart-area animate" d={area} fill={`url(#${gid}${si})`} />}
                <path className="chart-line animate" pathLength="1" d={d} fill="none" stroke={s.color} strokeWidth="2" />
                {seg.map((p) => <circle key={p.i} className="chart-dot animate" cx={xAt(p.i)} cy={yAt(p.v)} r="3" fill={s.color}><title>{`${labels[p.i]} · ${s.key} · ${format(p.v)}`}</title></circle>)}
              </g>
            );
          });
        })}
        {labels.map((l, i) => <text key={l} x={xAt(i)} y={h - 8} fontSize="11" textAnchor="middle" fill={ink}>{l}</text>)}
      </svg>
    </div>
  );
}

/**
 * Card with a chart and a minimal control bar: grouping, range, chart type, chart/table and show/hide.
 * `build({ type, range, group })` returns { labels, series, yMax, yTicks, format, table }.
 */
export function ChartCard({ id, title, types = ["line", "bar"], ranges, groups, withTable = false, height = 190, build, action, className = "" }) {
  const [type, setType] = usePref(`${id}.type`, types[0], types);
  const [range, setRange] = usePref(`${id}.range`, ranges ? ranges[ranges.length - 1].value : "", ranges?.map((r) => r.value));
  const [group, setGroup] = usePref(`${id}.group`, groups ? groups[0].value : "", groups?.map((g) => g.value));
  const [view, setView] = usePref(`${id}.view`, "chart", ["chart", "table"]);
  const [shown, shownToggle] = useShown(id);
  const spec = build({ type, range, group });
  const tableOn = withTable && view === "table";
  return (
    <section className={`card p-5 ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-medium">{title}</h2>
          {action}
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {shown && groups && <Segmented label="Group by" value={group} onChange={setGroup} options={groups} />}
          {shown && ranges && <Segmented label="Range" value={range} onChange={setRange} options={ranges} />}
          {shown && !tableOn && <Segmented label="Chart type" iconOnly value={type} onChange={setType} options={types.map((t) => ({ value: t, label: TYPE_META[t][0], icon: TYPE_META[t][1] }))} />}
          {shown && withTable && <Segmented label="Chart or table" iconOnly value={view} onChange={setView} options={[{ value: "chart", label: "Chart", icon: "chartFrame" }, { value: "table", label: "Table", icon: "table" }]} />}
          {shownToggle}
        </div>
      </div>
      {shown && (
        <div className="mt-4 tick-in" key={`${type}-${range}-${group}-${view}`}>
          {tableOn ? spec.table : <DataChart type={type} height={height} {...spec} />}
        </div>
      )}
    </section>
  );
}

/* ---------- Ready-made chart specs ---------- */

const LEVEL_COLORS = { TRL: "#1B365D", MRL: "#6C86A8", IRL: "#2E5AAC" };
export const READINESS_RANGES = [{ value: "90", label: "90d" }, { value: "all", label: "All" }];

/** TRL / MRL / IRL history by month, with an optional 90-day window and a table view. */
export function readinessSpec(hist, range) {
  const from = range === "90" ? MONTHS.length - 3 : 0;
  const labels = MONTHS.slice(from);
  const series = FRAMEWORKS.map((f) => ({ key: f, color: LEVEL_COLORS[f], values: (hist[f] || []).slice(from, MONTHS.length) }));
  const table = (
    <div className="overflow-hidden rounded-lg border border-line dark:border-slate-700">
      <table className="w-full text-left text-sm">
        <thead className="bg-soft text-xs text-muted dark:bg-white/5 dark:text-slate-400"><tr><th className="px-3 py-2 font-medium">Month</th>{FRAMEWORKS.map((f) => <th key={f} className="px-3 py-2 font-medium">{f}</th>)}</tr></thead>
        <tbody>{labels.map((m, i) => (
          <tr key={m} className="border-t border-line dark:border-slate-800"><td className="px-3 py-2">{m} 2026</td>{series.map((s) => <td key={s.key} className="px-3 py-2 font-mono text-xs">{s.values[i] == null ? "Not reviewed" : s.values[i]}</td>)}</tr>
        ))}</tbody>
      </table>
    </div>
  );
  return { labels, series, yMax: 9, yTicks: [1, 3, 5, 7, 9], table };
}

export const PIPELINE_GROUPS = [{ value: "stage", label: "Stage" }, { value: "agency", label: "Agency" }];
const short = (s) => (s.length > 16 ? `${s.slice(0, 15)}…` : s);

/** Matched value grouped by pipeline stage or by agency. */
export function pipelineSpec(opps, group) {
  const keys = group === "agency" ? [...new Set(opps.map((o) => o.agency))] : PIPELINE_STAGES;
  const field = group === "agency" ? "agency" : "stage";
  const values = keys.map((k) => opps.filter((o) => o[field] === k).reduce((a, o) => a + o.amount, 0));
  return { labels: keys.map(group === "agency" ? short : (k) => k), series: [{ key: "Value", color: "#1B365D", values }], format: formatMoney, yTicks: undefined };
}
