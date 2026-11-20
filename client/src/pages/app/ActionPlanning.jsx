import { ACTION_STATUSES } from "../../data/sampleData.js";
import { useApp } from "../../lib/store.jsx";
import Icon from "../../components/Icon.jsx";
import { DataTable, useViewMode } from "../../components/ViewControls.jsx";
import { Avatar, PageHeader, StatusChip, btnPrimary } from "../../components/ui.jsx";

export default function ActionPlanning() {
  const { actions, techName, matchesQuery, patchUi, patchData } = useApp();
  const rows = actions.filter((a) => matchesQuery({ ...a, technology: techName(a.technologyId) }, ["title", "owner", "due", "status", "technology"]));
  const cycle = (id) => patchData((d) => ({
    actions: d.actions.map((a) => (a.id === id ? { ...a, status: ACTION_STATUSES[(ACTION_STATUSES.indexOf(a.status) + 1) % ACTION_STATUSES.length] } : a)),
  }));
  const [mode, viewToggle] = useViewMode("actions", ["table", "board"]);
  return (
    <div className="flex flex-col gap-5">
      <PageHeader title="Action plan" sub="">
        <button type="button" onClick={() => patchUi({ modal: "action" })} className={btnPrimary}><Icon name="plus" /> Add action</button>
      </PageHeader>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-medium">{rows.length} actions</h2>
        {viewToggle}
      </div>
      {mode === "board" ? (
        <div className="grid gap-3 md:grid-cols-3">
          {ACTION_STATUSES.map((st) => {
            const col = rows.filter((a) => a.status === st);
            return (
              <section key={st} className="rounded-xl bg-soft/70 p-2.5 dark:bg-white/[.03]">
                <h3 className="flex items-center justify-between px-1 pb-2 text-xs font-medium">{st}<span className="font-mono text-[11px] text-muted">{col.length}</span></h3>
                <ul className="grid gap-2">
                  {col.map((a) => (
                    <li key={`${a.id}-${a.status}`} className="card tick-in p-3">
                      <div className={`text-sm font-medium ${a.status === "Done" ? "text-muted line-through" : ""}`}>{a.title}</div>
                      <div className="mt-2 flex items-center justify-between gap-2 text-xs text-muted dark:text-slate-400">
                        <span className="flex items-center gap-2"><Avatar name={a.owner} size={22} />{a.due}</span>
                        <button type="button" onClick={() => cycle(a.id)} className="nudge inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 hover:bg-soft hover:text-ink dark:hover:bg-white/10">{a.status === "Done" ? "Reopen" : "Advance"} <Icon name="chevronRight" className="size-3.5" /></button>
                      </div>
                    </li>
                  ))}
                  {!col.length && <li className="rounded-lg border border-dashed border-line px-2 py-5 text-center text-xs text-muted dark:border-slate-700">Nothing here</li>}
                </ul>
              </section>
            );
          })}
        </div>
      ) : (
        <DataTable rows={rows} empty="No actions match this search."
          columns={[
            { label: "", className: "w-8", cell: (a) => (
              <button type="button" onClick={() => cycle(a.id)} aria-label="Toggle status"
                className={`grid size-5 place-items-center rounded border text-xs transition-colors ${a.status === "Done" ? "border-navy bg-navy text-white" : "border-line dark:border-slate-600"}`}>{a.status === "Done" ? <Icon name="check" className="check-pop size-3" strokeWidth={2.6} /> : ""}</button>) },
            { label: "Action", cell: (a) => <span className={`font-medium ${a.status === "Done" ? "text-muted line-through" : ""}`}>{a.title}</span> },
            { label: "Owner", cell: (a) => <span className="flex items-center gap-2 text-xs"><Avatar name={a.owner} size={24} />{a.owner}</span> },
            { label: "Technology", cell: (a) => <span className="text-xs text-muted dark:text-slate-400">{techName(a.technologyId)}</span> },
            { label: "Due", cell: (a) => <span className="font-mono text-xs">{a.due}</span> },
            { label: "Status", cell: (a) => <button type="button" onClick={() => cycle(a.id)}><StatusChip status={a.status} /></button> },
          ]} />
      )}
    </div>
  );
}
