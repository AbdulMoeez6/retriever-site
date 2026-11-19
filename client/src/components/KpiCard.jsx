import { useCountUp } from "../lib/motion.js";

export function CountUp({ value, decimals = 0 }) {
  return <>{useCountUp(value, decimals)}</>;
}

export default function KpiCard({ label, value, sub, onClick, compact = false }) {
  const decimals = String(value).includes(".") ? 1 : 0;
  if (compact) {
    return (
      <div className="card p-3">
        <div className="text-[11px] text-muted dark:text-slate-400">{label}</div>
        <div className="text-lg font-semibold tabular-nums"><CountUp value={value} decimals={decimals} /></div>
      </div>
    );
  }
  return (
    <button type="button" onClick={onClick} className="card card-hover p-4 text-left">
      <div className="text-xs text-muted dark:text-slate-400">{label}</div>
      <div className="mt-1 text-2xl font-semibold tabular-nums"><CountUp value={value} decimals={decimals} /></div>
      {sub && <div className="mt-1 text-[11px] text-muted dark:text-slate-400">{sub}</div>}
    </button>
  );
}
