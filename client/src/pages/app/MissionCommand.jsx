import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../../lib/store.jsx";
import { greeting } from "../../lib/format.js";
import KpiCard from "../../components/KpiCard.jsx";
import { ChartCard, PIPELINE_GROUPS, READINESS_RANGES, pipelineSpec, readinessSpec } from "../../components/DataChart.jsx";
import TechSwitcher from "../../components/TechSwitcher.jsx";
import PilotWorkflow from "../../components/PilotWorkflow.jsx";
import Icon from "../../components/Icon.jsx";
import { Avatar, Mark, PageHeader, StatusChip, btnPrimary, btnSecondary, formatMoney } from "../../components/ui.jsx";

const DATE = "Friday, 20 November 2026";

function StartCard() {
  const navigate = useNavigate();
  return (
    <section className="card grid items-center gap-8 overflow-hidden p-8 md:grid-cols-[1.4fr_1fr]">
      <div>
        <div className="text-xs text-muted dark:text-slate-400">New technology</div>
        <h2 className="mt-1 text-xl font-semibold tracking-tight">Start with your Technology Profile</h2>
        <p className="mt-2 max-w-md text-sm text-muted dark:text-slate-400">Nothing has been created for this technology yet. Create the profile, then answer the Readiness Questionnaire to generate an Innovation Index and funding matches.</p>
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
  const { hasTech, currentTech, ui, history, pipeline, questionnairePct, actions, notifications, profile, patchUi, toast } = useApp();
  const navigate = useNavigate();
  const first = profile.name.split(" ")[0];
  const header = (techName) => (
    <PageHeader title={`${greeting()}, ${first}`} sub={`${DATE} · ${techName ? `Mission Command for ${techName}` : "No technology selected yet"}`}>
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
  const goActivity = (n) => { if (n.techId) patchUi({ techId: n.techId }); navigate(`/app/${n.route}`); };
  const kpis = [
    ["Innovation Index", index, "Sample score out of 100", "readiness-questionnaire"],
    ["Current TRL", t.trl ?? "—", `MRL ${t.mrl ?? "—"} · IRL ${t.irl ?? "—"}`, "readiness"],
    ["Opportunities", opps.length, `${opps.filter((o) => o.stage === "Awarded").length} awarded · ${opps.filter((o) => o.stage === "Drafting").length} drafting`, "opportunities"],
    ["Questionnaire", `${qPct}%`, "Answers saved as you go", "readiness-questionnaire"],
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
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="card p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium">Next actions</h2>
            <Link to="/app/action-plan" className="u-link text-xs text-muted dark:text-slate-400">View all</Link>
          </div>
          <ul className="mt-3 grid gap-3">
            {nextActions.map((a) => (
              <li key={a.id} className="flex items-start gap-3">
                <Avatar name={a.owner} size={28} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{a.title}</div>
                  <div className="text-xs text-muted dark:text-slate-400">{a.owner} · {a.due}</div>
                </div>
                <StatusChip status={a.status} />
              </li>
            ))}
          </ul>
        </section>
        <section className="card p-5">
          <h2 className="text-sm font-medium">Recent activity</h2>
          <ul className="mt-3 grid gap-2">
            {notifications.slice(0, 3).map((n) => (
              <li key={n.id}>
                <button type="button" onClick={() => goActivity(n)} className="group flex w-full items-start gap-3 rounded-md px-1 py-1 text-left hover:bg-soft/80 dark:hover:bg-white/5">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-navy/60" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium">{n.title}</span>
                    <span className="block text-xs text-muted dark:text-slate-400">{n.body} · {n.time}</span>
                  </span>
                  <Icon name="chevronRight" className="hover-reveal mt-1 size-4 text-muted" />
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
