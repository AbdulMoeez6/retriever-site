import { withBase } from "@/lib/utils/url";
import { Icon } from "@/layouts/function-components/app/ui/Icon";
import { initials } from "@/lib/format";
import { useStore } from "@/lib/store";

export function LogoMark({ size = 28 }) {
  return (
    <img
      src={withBase("/images/logo-mark.png")}
      alt=""
      width={size}
      height={size}
      className="shrink-0 rounded-full"
      style={{
        width: size,
        height: size,
        objectFit: "cover",
      }}
    />
  );
}

export function Wordmark() {
  return (
    <span className="inline-flex items-center gap-2.5 font-semibold tracking-tight">
      <LogoMark size={32} />
      <span>Retriever</span>
    </span>
  );
}

export function Avatar({ name, size = 28 }) {
  const t = size < 26 ? "text-[9px]" : "text-[11px]";
  return (
    <span
      className={`avatar ${t}`}
      style={{
        width: size,
        height: size,
      }}
    >
      {initials(name)}
    </span>
  );
}

export const CHIP_TONES = {
  success: [
    "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
    "bg-emerald-600",
  ],
  info: ["bg-sky-500/15 text-sky-800 dark:text-sky-300", "bg-sky-600"],
  warn: ["bg-amber-500/20 text-amber-800 dark:text-amber-300", "bg-amber-600"],
  danger: ["bg-rose-500/15 text-rose-700 dark:text-rose-300", "bg-rose-600"],
  navy: [
    "bg-navy/15 text-navy dark:bg-white/10 dark:text-slate-100",
    "bg-navy dark:bg-slate-200",
  ],
  neutral: [
    "bg-slate-200/80 text-slate-700 dark:bg-white/10 dark:text-slate-300",
    "bg-slate-500",
  ],
};

export function Chip({ label, tone = "neutral" }) {
  const [t, n] = CHIP_TONES[tone] || CHIP_TONES.neutral;
  return (
    <span className={`chip ${t}`}>
      <span className={`chip-dot ${n}`} />
      {label}
    </span>
  );
}

export function StatusChip({ status }) {
  let e = "neutral";
  return (
    status === "Done" || status === "Strong fit"
      ? (e = "success")
      : status === "In progress" || status === "Open" || status === "Good fit"
        ? (e = "info")
        : status === "Closing soon" ||
            status === "Fair fit" ||
            status === "Medium"
          ? (e = "warn")
          : status === "High" && (e = "danger"),
    (<Chip label={status} tone={e} />)
  );
}

export const ReviewChip = ({ reviewed }) =>
  reviewed ? (
    <Chip label="Human-reviewed" tone="success" />
  ) : (
    <Chip label="Not reviewed" tone="warn" />
  );

export function SampleDataBadge({ className = "" }) {
  return (
    <span
      className={`rounded-full border border-line px-2 py-0.5 text-[11px] font-medium text-muted dark:border-slate-700 dark:text-slate-400 ${className}`}
    >
      Sample data
    </span>
  );
}

export function PageTitle({ title, sub, children }) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {sub && (
          <p className="mt-1 text-sm text-muted dark:text-slate-400">{sub}</p>
        )}
      </div>
      {children && (
        <div className="flex flex-wrap items-end gap-3">{children}</div>
      )}
    </div>
  );
}

export const btnPrimary =
  "btn-lift inline-flex h-9 items-center gap-2 rounded-lg bg-navy px-3 text-sm font-medium text-white hover:bg-navy-700";

export const btnSecondary =
  "btn-lift inline-flex h-9 items-center gap-2 rounded-lg border border-line bg-white px-3 text-sm hover:bg-soft dark:border-slate-700 dark:bg-[#161C27] dark:hover:bg-white/5";

export const filterBtn = (A) =>
  `rounded-lg px-3 py-1.5 text-sm transition-colors ${A ? "bg-navy text-white" : "border border-line bg-white hover:bg-soft dark:border-slate-700 dark:bg-[#161C27]"}`;

export const CloseButton = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="grid size-8 shrink-0 place-items-center rounded-md hover:bg-soft dark:hover:bg-white/10"
    aria-label="Close"
  >
    <Icon name="x" />
  </button>
);

export function TechSelect() {
  const { techs, ui, patchUi } = useStore();
  return (
    <label className="grid gap-1 text-sm">
      <span className="text-xs text-muted dark:text-slate-400">Technology</span>
      <select
        value={ui.techId}
        onChange={(n) =>
          patchUi({
            techId: n.target.value,
          })
        }
        className="h-9 min-w-[13rem] rounded-lg border border-line bg-white px-3 text-sm dark:border-slate-700 dark:bg-[#161C27]"
      >
        {techs.map((n) => (
          <option key={n.id} value={n.id}>
            {n.name}
          </option>
        ))}
      </select>
    </label>
  );
}
