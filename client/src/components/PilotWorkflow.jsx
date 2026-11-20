import { useNavigate } from "react-router-dom";
import { useApp } from "../lib/store.jsx";
import Icon from "./Icon.jsx";
import { btnPrimary } from "./ui.jsx";

/** Small progress ring, e.g. "4 of 7". */
export function ProgressRing({ value, total, size = 64, label }) {
  const r = 26, c = 2 * Math.PI * r;
  const pct = total ? value / total : 0;
  return (
    <div className="grid justify-items-center">
      <svg width={size} height={size} viewBox="0 0 64 64" aria-label={label || `${value} of ${total}`}>
        <circle cx="32" cy="32" r={r} fill="none" className="stroke-soft dark:stroke-white/10" strokeWidth="6" />
        <circle cx="32" cy="32" r={r} fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" className="ring-arc text-navy dark:text-slate-200"
          strokeDasharray={c.toFixed(2)} strokeDashoffset={(c - pct * c).toFixed(2)} transform="rotate(-90 32 32)" />
        <text x="32" y="36" textAnchor="middle" fontSize="13" fontWeight="600" fill="currentColor">{value}/{total}</text>
      </svg>
    </div>
  );
}

/** Seven-step pilot workflow. Steps tick from the record, never from clicks here. */
export default function PilotWorkflow({ techId }) {
  const { pilotSteps } = useApp();
  const navigate = useNavigate();
  const steps = pilotSteps(techId);
  const done = steps.filter((s) => s.state === "done").length;
  const next = steps.find((s) => s.state !== "done");
  return (
    <section className="card p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-sm font-medium">Pilot workflow</h2>
          <p className="mt-1 text-xs text-muted dark:text-slate-400">Seven steps from profile to action plan. Steps tick from the record, not from clicks here.</p>
        </div>
        <ProgressRing value={done} total={steps.length} size={56} label={`${done} of ${steps.length} steps complete`} />
      </div>
      <ol className="mt-5 grid grid-cols-2 gap-y-5 sm:grid-cols-4 xl:grid-cols-7">
        {steps.map((s, i) => {
          const isNext = next && s.id === next.id;
          const linkDone = s.state === "done" && steps[i + 1]?.state === "done";
          return (
            <li key={s.id} className="relative">
              {i < steps.length - 1 && (
                <span aria-hidden="true" className="absolute left-1/2 top-4 hidden h-0.5 w-full -translate-y-1/2 bg-line dark:bg-slate-700 xl:block">
                  <span className="block h-full bg-navy transition-[width] duration-700 dark:bg-slate-300" style={{ width: linkDone ? "100%" : "0%" }} />
                </span>
              )}
              <button type="button" onClick={() => navigate(`/app/${s.route}`)} className="step-btn relative flex w-full flex-col items-center gap-2 px-1 text-center">
                <span className={`step-node grid size-8 place-items-center rounded-full text-xs font-medium ${
                  s.state === "done" ? "bg-navy text-white dark:bg-slate-200 dark:text-navy"
                    : isNext ? "pulse-ring border-2 border-accent bg-white text-accent dark:bg-[#161C27]"
                    : s.state === "active" ? "border-2 border-navy/40 bg-white text-navy dark:bg-[#161C27] dark:text-slate-200"
                    : "border border-line bg-white text-muted dark:border-slate-600 dark:bg-[#161C27]"}`}>
                  {s.state === "done" ? <Icon name="check" className="check-pop size-4" strokeWidth={2.4} /> : i + 1}
                </span>
                <span className="text-xs font-medium leading-snug">{s.label}</span>
                <span className="text-[11px] leading-tight text-muted dark:text-slate-400">{s.detail}</span>
              </button>
            </li>
          );
        })}
      </ol>
      {next && (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-soft px-4 py-3 dark:bg-white/5">
          <p className="text-sm"><span className="text-muted dark:text-slate-400">Next step · </span><span className="font-medium">{next.label}</span> <span className="text-xs text-muted dark:text-slate-400">({next.detail})</span></p>
          <button type="button" onClick={() => navigate(`/app/${next.route}`)} className={`${btnPrimary} nudge`}>Continue <Icon name="arrow" /></button>
        </div>
      )}
    </section>
  );
}
