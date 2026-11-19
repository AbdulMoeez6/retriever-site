import { useApp } from "../../lib/store.jsx";
import Icon, { FileIcon } from "../../components/Icon.jsx";
import { Avatar, PageHeader, ReviewChip, btnPrimary, filterBtn } from "../../components/ui.jsx";

export default function Evidence() {
  const { docs, techName, matchesQuery, ui, patchUi } = useApp();
  const rows = docs.filter((d) => {
    if (ui.evidenceFilter === "Reviewed" && !d.reviewed) return false;
    if (ui.evidenceFilter === "Not reviewed" && d.reviewed) return false;
    return matchesQuery({ ...d, technology: techName(d.technologyId), status: d.reviewed ? "Human-reviewed" : "Not reviewed" }, ["name", "technology", "status", "reviewer"]);
  });
  return (
    <div className="flex flex-col gap-5">
      <PageHeader title="Evidence" sub="Documents attached to a technology. Only human-reviewed evidence counts toward readiness.">
        <button type="button" onClick={() => patchUi({ modal: "upload" })} className={btnPrimary}><Icon name="plus" /> Upload document</button>
      </PageHeader>
      <div className="flex flex-wrap gap-2">
        {["All", "Reviewed", "Not reviewed"].map((f) => <button type="button" key={f} onClick={() => patchUi({ evidenceFilter: f })} className={filterBtn(ui.evidenceFilter === f)}>{f}</button>)}
      </div>
      <div className="card overflow-hidden">
        {rows.length ? rows.map((d) => (
          <button type="button" key={d.id} onClick={() => patchUi({ drawer: { type: "doc", id: d.id } })}
            className="row-hover grid w-full grid-cols-[auto_1fr_auto] items-center gap-3 border-b border-line px-4 py-3 text-left last:border-0 dark:border-slate-800 sm:grid-cols-[auto_1.2fr_1fr_auto_auto]">
            <span className="text-navy dark:text-slate-200"><FileIcon type={d.type} /></span>
            <span className="min-w-0"><span className="block truncate text-sm font-medium">{d.name}</span><span className="block truncate text-xs text-muted sm:hidden">{techName(d.technologyId)}</span></span>
            <span className="hidden truncate text-sm text-muted dark:text-slate-400 sm:block">{techName(d.technologyId)}</span>
            <span className="hidden items-center gap-2 sm:flex">{d.reviewer && <Avatar name={d.reviewer} size={24} />}<span className="text-xs text-muted dark:text-slate-400">{d.reviewer || "Awaiting review"}</span></span>
            <span className="flex items-center gap-2"><ReviewChip reviewed={d.reviewed} /><span className="hidden font-mono text-[11px] text-muted dark:text-slate-400 lg:inline">{d.uploaded}</span></span>
          </button>
        )) : <div className="px-4 py-8 text-center text-sm text-muted">No documents match this filter.</div>}
      </div>
    </div>
  );
}
