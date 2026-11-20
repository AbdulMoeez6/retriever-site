import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../../lib/store.jsx";
import { greeting } from "../../lib/format.js";
import KpiCard from "../../components/KpiCard.jsx";
import { ChartCard, PIPELINE_GROUPS, READINESS_RANGES, pipelineSpec, readinessSpec } from "../../components/DataChart.jsx";
import TechSwitcher from "../../components/TechSwitcher.jsx";
import PilotWorkflow from "../../components/PilotWorkflow.jsx";
import Icon from "../../components/Icon.jsx";
import { Avatar, Mark, PageHeader, btnPrimary, btnSecondary } from "../../components/ui.jsx";

const DATE = "Friday, 20 November 2026";

function StartCard() {
  const navigate = useNavigate();
  return (
    <section className="card grid items-center gap-8 overflow-hidden p-8 md:grid-cols-[1.4fr_1fr]">
      <div>
        <div className="text-xs text-muted dark:text-slate-400">New technology</div>
        <h2 className="mt-1 text-xl font-semibold tracking-tight">Start with your Technology Profile</h2>
        <p className="mt-2 max-w-md text-sm text-muted dark:text-slate-400">Create the profile, then answer the Readiness Questionnaire.</p>
        <div className="mt-6 flex flex-wrap gap-2">
          <button type="button" onClick={() => navigate("/app/technology-profile")} className={`${btnPrimary} nudge`}>Create Technology Profile <Icon name="arrow" /></button>
          <button type="button" onClick={() => navigate("/app/readiness-questionnaire")} className={btnSecondary}>Preview the questionnaire</button>
        </div>
      </div>
      <div className="relative mx-auto grid size-44 place-items-center">
        <span className="absolute inset-0 rounded-full border border-dashed border-navy/20" />
        <span className="absolute inset-6 rounded-full border border-navy/10 bg-soft dark:bg-white/5" />
        <span className="relative opacity-90"><Mark size={72} /></span>
      </div>
    </section>
  );
}

export default function MissionCommand() {
  const { hasTech, currentTech, ui, history, pipeline, questionnairePct, actions, profile, patchUi, toast } = useApp();
  const navigate = useNavigate();
  const first = profile.name.split(" ")[0];
  const header = (techName) => (
    <PageHeader title={`${greeting()}, ${first}`} sub={DATE}>
      <TechSwitcher />
      <button type="button" onClick={() => toast("Report prepared (demo)")} className={btnSecondary}><Icon name="download" /> Download report</button>
      <button type="button" onClick={() => (hasTech ? navigate("/app/readiness") : patchUi({ modal: "readiness" }))} className={btnPrimary}>Open Readiness</button>
    </PageHeader>
  );
  if (!hasTech) {
    return (
      <div className="flex flex-col gap-5">
        {header(null)}
        <StartCard />
        <PilotWorkflow techId={ui.techId} />
      </div>
    );
  }
  const t = currentTech();
  const opps = pipeline.filter((o) => o.techId === t.id);
  const qPct = questionnairePct(t.id);
  // Sample Innovation Index: readiness levels weighted with questionnaire coverage.
  const index = Math.round((((t.trl || 0) + (t.mrl || 0) + (t.irl || 0)) / 27) * 60 + qPct * 0.4);
  const nextActions = actions.filter((a) => a.status !== "Done").slice(0, 3);
  const kpis = [
    ["Innovation Index", index, "out of 100 (sample)", "readiness-questionnaire"],
    ["Current TRL", t.trl ?? "—", `MRL ${t.mrl ?? "—"} · IRL ${t.irl ?? "—"}`, "readiness"],
    ["Opportunities", opps.length, `${opps.filter((o) => o.stage === "Awarded").length} awarded`, "opportunities"],
    ["Questionnaire", `${qPct}%`, "complete", "readiness-questionnaire"],
  ];

  return (
    <div className="flex flex-col gap-5">
      {header(t.name)}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map(([l, v, s, route]) => <KpiCard key={l} label={l} value={v} sub={s} onClick={() => navigate(`/app/${route}`)} />)}
      </div>
      <PilotWorkflow techId={t.id} />
      <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <ChartCard id="mc.readiness" title="Readiness over time" types={["line", "area", "bar"]} ranges={READINESS_RANGES} withTable
          build={({ range }) => readinessSpec(history[t.id] || {}, range)} />
        <ChartCard id="mc.pipeline" title="Opportunity pipeline" types={["bar", "donut"]} groups={PIPELINE_GROUPS} height={190}
          build={({ group }) => pipelineSpec(opps, group)} />
      </div>
      <section className="card p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium">Next actions</h2>
          <Link to="/app/action-plan" className="u-link text-xs text-muted dark:text-slate-400">View all</Link>
        </div>
        <ul className="mt-3 grid gap-x-8 gap-y-3 md:grid-cols-3">
          {nextActions.map((a) => (
            <li key={a.id} className="flex items-start gap-3">
              <Avatar name={a.owner} size={28} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{a.title}</div>
                <div className="text-xs text-muted dark:text-slate-400">{a.owner} · {a.due}</div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
