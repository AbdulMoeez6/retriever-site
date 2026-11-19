import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../../lib/store.jsx";
import { greeting } from "../../lib/format.js";
import KpiCard from "../../components/KpiCard.jsx";
import { HistoryChart, HistoryTable } from "../../components/Charts.jsx";
import TechSwitcher from "../../components/TechSwitcher.jsx";
import Icon from "../../components/Icon.jsx";
import { Avatar, PageHeader, StatusChip, btnPrimary, btnSecondary } from "../../components/ui.jsx";

export default function MissionCommand() {
  const { currentTech, kpis, history, docs, techs, funding, actions, notifications, profile, ui, patchUi, toast } = useApp();
  const navigate = useNavigate();
  const t = currentTech();
  const k = kpis();
  const hist = history[t.id] || { TRL: [] };
  const steps = [
    ["Create a technology profile", techs.length > 0],
    ["Upload a first evidence document", docs.some((d) => d.technologyId === t.id)],
    ["Run a first readiness assessment", (hist.TRL || []).some((v) => v != null)],
    ["Review funding matches", funding.length > 0],
    ["Invite a teammate", false],
  ];
  const doneCount = steps.filter((s) => s[1]).length;
  const nextActions = actions.filter((a) => a.status !== "Done").slice(0, 3);
  const kpiCards = [
    ["Technologies tracked", k.techs, "In this workspace", "profiles"],
    ["Average TRL", k.avgTrl, "Current levels on file", "readiness"],
    ["Assessments completed", k.assessments, "In this workspace", "readiness"],
    ["Funding matches", k.funding, "Open matches to review", "funding"],
  ];
  const goActivity = (n) => { if (n.techId) patchUi({ techId: n.techId }); navigate(`/app/${n.route}`); };

  return (
    <div className="flex flex-col gap-5">
      <PageHeader title={`${greeting()}, ${profile.name.split(" ")[0]}`} sub={`Thursday, 19 November 2026 · Mission Command for ${t.name}`}>
        <TechSwitcher />
        <button type="button" onClick={() => toast("Report prepared (demo)")} className={btnSecondary}><Icon name="download" /> Download report</button>
        <Link to="/app/readiness" className={btnPrimary}>Open Readiness</Link>
      </PageHeader>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {kpiCards.map(([l, v, s, route]) => <KpiCard key={l} label={l} value={v} sub={s} onClick={() => navigate(`/app/${route}`)} />)}
      </div>

      <section className="card p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-medium">Readiness over time</h2>
            <p className="mt-1 text-xs text-muted dark:text-slate-400">Only human-reviewed evidence counts. Empty points are shown as Not reviewed.</p>
          </div>
          <button type="button" onClick={() => patchUi({ historyOpen: !ui.historyOpen })} className="text-sm text-muted underline-offset-2 hover:underline dark:text-slate-400">{ui.historyOpen ? "Hide table" : "Show table"}</button>
        </div>
        <div className="mt-3"><HistoryChart key={t.id} techId={t.id} area height={168} /></div>
        <HistoryTable techId={t.id} />
      </section>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-1">
          {ui.checklistDismissed ? (
            <section className="card p-4 text-sm text-muted">Getting started is dismissed for this session.</section>
          ) : (
            <section className="card p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-sm font-medium">Getting started</h2>
                  <p className="mt-1 text-xs text-muted dark:text-slate-400">{doneCount} of {steps.length} steps complete. Steps tick from the record, not from clicks here.</p>
                </div>
                <button type="button" onClick={() => patchUi({ checklistDismissed: true })} className="text-sm text-muted hover:text-ink dark:hover:text-white">Dismiss</button>
              </div>
              <div className="progress mt-3"><span style={{ width: `${(doneCount / steps.length) * 100}%` }} /></div>
              <ul className="mt-4 grid gap-2">
                {steps.map(([label, done]) => (
                  <li key={label} className="flex items-center gap-2 text-sm">
                    <span className={`grid size-5 place-items-center rounded-full text-xs ${done ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400" : "bg-soft text-muted dark:bg-white/10"}`}>{done ? "✓" : ""}</span>{label}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
        <section className="card p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium">Next actions</h2>
            <Link to="/app/action-planning" className="text-xs text-muted underline-offset-2 hover:underline dark:text-slate-400">View all</Link>
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
        <section className="card p-4">
          <h2 className="text-sm font-medium">Recent activity</h2>
          <ul className="mt-3 grid gap-3">
            {notifications.slice(0, 3).map((n) => (
              <li key={n.id}>
                <button type="button" onClick={() => goActivity(n)} className="w-full rounded-md text-left hover:bg-soft/80 dark:hover:bg-white/5">
                  <div className="text-sm font-medium">{n.title}</div>
                  <div className="text-xs text-muted dark:text-slate-400">{n.body}</div>
                  <div className="mt-0.5 text-[11px] text-muted dark:text-slate-500">{n.time}</div>
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
