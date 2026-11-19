import { ASSETS } from "../lib/assets.js";
import { initials } from "../lib/format.js";

export function Mark({ size = 28 }) {
  return (
    <img src={ASSETS.logoMark} alt="" width={size} height={size}
      className="shrink-0 rounded-full" style={{ width: size, height: size, objectFit: "cover" }} />
  );
}

export function Logo() {
  return (
    <span className="inline-flex items-center gap-2.5 font-semibold tracking-tight">
      <Mark size={32} />
      <span>Retriever</span>
    </span>
  );
}

export function Avatar({ name, size = 28 }) {
  const fs = size < 26 ? "text-[9px]" : "text-[11px]";
  return <span className={`avatar ${fs}`} style={{ width: size, height: size }}>{initials(name)}</span>;
}

const TONES = {
  success: ["bg-emerald-500/15 text-emerald-700 dark:text-emerald-400", "bg-emerald-600"],
  info: ["bg-sky-500/15 text-sky-800 dark:text-sky-300", "bg-sky-600"],
  warn: ["bg-amber-500/20 text-amber-800 dark:text-amber-300", "bg-amber-600"],
  danger: ["bg-rose-500/15 text-rose-700 dark:text-rose-300", "bg-rose-600"],
  navy: ["bg-navy/15 text-navy dark:bg-white/10 dark:text-slate-100", "bg-navy dark:bg-slate-200"],
  neutral: ["bg-slate-200/80 text-slate-700 dark:bg-white/10 dark:text-slate-300", "bg-slate-500"],
};

export function Chip({ label, tone = "neutral" }) {
  const [cls, dot] = TONES[tone] || TONES.neutral;
  return <span className={`chip ${cls}`}><span className={`chip-dot ${dot}`} />{label}</span>;
}

export function StatusChip({ status }) {
  let tone = "neutral";
  if (status === "Done" || status === "Strong fit") tone = "success";
  else if (status === "In progress" || status === "Open" || status === "Good fit") tone = "info";
  else if (status === "Closing soon" || status === "Fair fit" || status === "Medium") tone = "warn";
  else if (status === "High") tone = "danger";
  return <Chip label={status} tone={tone} />;
}

export const ReviewChip = ({ reviewed }) =>
  reviewed ? <Chip label="Human-reviewed" tone="success" /> : <Chip label="Not reviewed" tone="warn" />;

export function SampleBadge({ className = "" }) {
  return <span className={`rounded-full border border-line px-2 py-0.5 text-[11px] font-medium text-muted dark:border-slate-700 dark:text-slate-400 ${className}`}>Sample data</span>;
}

export function PageHeader({ title, sub, children }) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {sub && <p className="mt-1 text-sm text-muted dark:text-slate-400">{sub}</p>}
      </div>
      {children && <div className="flex flex-wrap items-end gap-3">{children}</div>}
    </div>
  );
}

export const btnPrimary = "btn-lift inline-flex h-9 items-center gap-2 rounded-lg bg-navy px-3 text-sm font-medium text-white hover:bg-navy-700";
export const btnSecondary = "btn-lift inline-flex h-9 items-center gap-2 rounded-lg border border-line bg-white px-3 text-sm hover:bg-soft dark:border-slate-700 dark:bg-[#161C27] dark:hover:bg-white/5";
export const filterBtn = (on) => `rounded-lg px-3 py-1.5 text-sm transition-colors ${on ? "bg-navy text-white" : "border border-line bg-white hover:bg-soft dark:border-slate-700 dark:bg-[#161C27]"}`;
