import { ACTION_STATUSES } from "../../data/sampleData.js";
import { useApp } from "../../lib/store.jsx";
import Icon from "../../components/Icon.jsx";
import { Avatar, PageHeader, StatusChip, btnPrimary } from "../../components/ui.jsx";

export default function ActionPlanning() {
  const { actions, techName, matchesQuery, patchUi, patchData } = useApp();
  const rows = actions.filter((a) => matchesQuery({ ...a, technology: techName(a.technologyId) }, ["title", "owner", "due", "status", "technology"]));
  const cycle = (id) => patchData((d) => ({
    actions: d.actions.map((a) => (a.id === id ? { ...a, status: ACTION_STATUSES[(ACTION_STATUSES.indexOf(a.status) + 1) % ACTION_STATUSES.length] } : a)),
  }));
  return (
    <div className="flex flex-col gap-5">
      <PageHeader title="Action planning" sub="Actions for the team to take on a technology record. Toggle a status to move it on.">
        <button type="button" onClick={() => patchUi({ modal: "action" })} className={btnPrimary}><Icon name="plus" /> Add action</button>
      </PageHeader>
      <ul className="card">
        {rows.length ? rows.map((a) => (
          <li key={a.id} className="flex items-center gap-3 border-b border-line px-4 py-3 last:border-0 dark:border-slate-800">
            <button type="button" onClick={() => cycle(a.id)} aria-label="Toggle status"
              className={`grid size-5 place-items-center rounded border text-xs transition-colors ${a.status === "Done" ? "border-emerald-600 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400" : "border-line dark:border-slate-600"}`}>{a.status === "Done" ? "✓" : ""}</button>
            <Avatar name={a.owner} size={32} />
            <div className="min-w-0 flex-1">
              <div className={`truncate text-sm font-medium ${a.status === "Done" ? "text-muted line-through" : ""}`}>{a.title}</div>
              <div className="text-xs text-muted dark:text-slate-400">{a.owner} · {techName(a.technologyId)} · Due {a.due}</div>
            </div>
            <button type="button" onClick={() => cycle(a.id)} className="shrink-0"><StatusChip status={a.status} /></button>
          </li>
        )) : <li className="px-4 py-8 text-center text-sm text-muted">No actions match this search.</li>}
      </ul>
    </div>
  );
}
