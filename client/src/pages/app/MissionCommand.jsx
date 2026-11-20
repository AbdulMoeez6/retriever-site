import { useNavigate } from "react-router-dom";
import { useApp } from "../../lib/store.jsx";
import { PIPELINE_STAGES } from "../../data/pilotData.js";
import Icon from "../../components/Icon.jsx";
import { btnPrimary, btnSecondary } from "../../components/ui.jsx";

/** Seven-step pilot workflow tracker. Steps tick from the record, not from clicks here. */
export function PilotWorkflow({ techId }) {
  const { pilotSteps } = useApp();
  const navigate = useNavigate();
  const steps = pilotSteps(techId);
  const done = steps.filter((s) => s.state === "done").length;
  const next = steps.find((s) => s.state !== "done");
  return (
    <section className="card p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold">Pilot workflow</h2>
        <span className="text-xs text-muted dark:text-slate-400">{done} of {steps.length} steps complete{next ? ` · next: ${next.label}` : " · all done"}</span>
      </div>
      <div className="progress mt-3"><span style={{ width: `${(done / steps.length) * 100}%` }} /></div>
      <ol className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        {steps.map((s, i) => {
          const isNext = next && s.id === next.id;
          return (
            <li key={s.id}>
              <button type="button" onClick={() => navigate(`/app/${s.route}`)}
                className={`flex h-full w-full items-start gap-2 rounded-lg border px-3 py-2 text-left transition-colors hover:border-navy/40 ${isNext ? "border-[#2F5BD3] bg-white shadow-sm dark:bg-white/5" : "border-line bg-soft/60 dark:border-slate-700 dark:bg-white/[.03]"}`}>
                <span className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border text-[11px] ${s.state === "done" ? "border-emerald-600 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400" : s.state === "active" ? "border-[#2F5BD3] text-[#2F5BD3]" : "border-line text-muted dark:border-slate-600"}`}>
                  {s.state === "done" ? <Icon name="check" className="size-3" strokeWidth={2.4} /> : i + 1}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm leading-snug">{s.label}</span>
                  <span className="block text-xs text-muted dark:text-slate-400">{s.detail}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function StartCard() {
  const navigate = useNavigate();
  return (
    <section className="card mx-auto w-full max-w-xl px-6 py-10 text-center">
      <span className="mx-auto grid size-11 place-items-center rounded-xl bg-[#E8EEFB] text-[#2F5BD3] dark:bg-white/10 dark:text-slate-200"><Icon name="spark" className="size-5" /></span>
      <h2 className="mt-4 text-lg font-semibold">Start with your Technology Profile</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted dark:text-slate-400">Nothing has been created for this technology yet. Create your Technology Profile, then answer the Readiness Questionnaire to generate your Innovation Index and funding matches.</p>
      <button type="button" onClick={() => navigate("/app/technology-profile")} className={`${btnPrimary} mt-6`}>Create Technology Profile <Icon name="arrow" /></button>
    </section>
  );
}

export default function MissionCommand() {
  const { hasTech, currentTech, ui, pipeline, questionnairePct, notifications, patchUi, docs } = useApp();
  const navigate = useNavigate();
  if (!hasTech) {
    return (
      <div className="flex flex-col gap-5">
        <StartCard />
        <PilotWorkflow techId={ui.techId} />
      </div>
    );
  }
  const t = currentTech();
  const opps = pipeline.filter((o) => o.techId === t.id);
  const qPct = questionnairePct(t.id);
  const levels = [["TRL", t.trl], ["MRL", t.mrl], ["IRL", t.irl]];
  // Sample Innovation Index: readiness levels weighted with questionnaire coverage.
  const index = Math.round((((t.trl || 0) + (t.mrl || 0) + (t.irl || 0)) / 27) * 60 + qPct * 0.4);
  const reviewed = docs.filter((d) => d.technologyId === t.id && d.reviewed).length;
  const goActivity = (n) => { if (n.techId) patchUi({ techId: n.techId }); navigate(`/app/${n.route}`); };

  return (
    <div className="flex flex-col gap-5">
      <section className="card grid gap-5 p-5 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <div className="text-xs text-muted dark:text-slate-400">{t.org} · Owner {t.owner}</div>
          <h2 className="mt-1 text-xl font-semibold tracking-tight">{t.name}</h2>
          <p className="mt-1 max-w-lg text-sm text-muted dark:text-slate-400">{t.summary}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" onClick={() => navigate("/app/readiness")} className={btnPrimary}>Open Readiness</button>
            <button type="button" onClick={() => navigate("/app/readiness-questionnaire")} className={btnSecondary}>Questionnaire · {qPct}%</button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <button type="button" onClick={() => navigate("/app/readiness-questionnaire")} className="rounded-lg border border-line p-3 text-left hover:border-navy/40 dark:border-slate-700">
            <div className="text-[11px] text-muted dark:text-slate-400">Innovation Index</div>
            <div className="mt-1 text-2xl font-semibold tabular-nums">{index}</div>
            <div className="text-[11px] text-muted dark:text-slate-400">of 100</div>
          </button>
          {levels.map(([k, v]) => (
            <button type="button" key={k} onClick={() => navigate("/app/readiness")} className="rounded-lg border border-line p-3 text-left hover:border-navy/40 dark:border-slate-700">
              <div className="text-[11px] text-muted dark:text-slate-400">{k}</div>
              <div className="mt-1 text-2xl font-semibold tabular-nums">{v ?? "—"}</div>
              <div className="text-[11px] text-muted dark:text-slate-400">of 9</div>
            </button>
          ))}
          <p className="col-span-2 text-[11px] text-muted dark:text-slate-400 sm:col-span-4">Levels come only from {reviewed} human-reviewed document{reviewed === 1 ? "" : "s"}. Sample scores.</p>
        </div>
      </section>

      <PilotWorkflow techId={t.id} />

      <div className="grid gap-4 xl:grid-cols-2">
        <section className="card p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Opportunity pipeline</h2>
            <button type="button" onClick={() => navigate("/app/opportunities")} className="text-xs text-muted underline-offset-2 hover:underline dark:text-slate-400">Open pipeline</button>
          </div>
          <div className="mt-4 grid grid-cols-5 gap-2">
            {PIPELINE_STAGES.map((st) => {
              const n = opps.filter((o) => o.stage === st).length;
              return (
                <button type="button" key={st} onClick={() => navigate("/app/opportunities")} className="rounded-lg border border-line p-2 text-left hover:border-navy/40 dark:border-slate-700">
                  <div className="font-mono text-[10px] uppercase tracking-wide text-muted dark:text-slate-400">{st}</div>
                  <div className="mt-1 text-xl font-semibold tabular-nums">{n}</div>
                </button>
              );
            })}
          </div>
        </section>
        <section className="card p-5">
          <h2 className="text-sm font-semibold">Recent activity</h2>
          <ul className="mt-3 grid gap-2">
            {notifications.slice(0, 3).map((n) => (
              <li key={n.id}>
                <button type="button" onClick={() => goActivity(n)} className="w-full rounded-md px-1 py-1 text-left hover:bg-soft/80 dark:hover:bg-white/5">
                  <div className="text-sm font-medium">{n.title}</div>
                  <div className="text-xs text-muted dark:text-slate-400">{n.body} · {n.time}</div>
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
