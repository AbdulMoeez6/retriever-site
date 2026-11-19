import { useApp } from "../../lib/store.jsx";
import { escapeCsv, fitFromScore } from "../../lib/format.js";
import Icon from "../../components/Icon.jsx";
import { PageHeader, StatusChip, btnSecondary, filterBtn } from "../../components/ui.jsx";

const COLS = "md:grid-cols-[1.4fr_1.2fr_7rem_3.5rem_6.5rem_7.5rem]";

export default function Funding() {
  const { funding, techName, matchesQuery, ui, patchUi, toast } = useApp();
  const rows = funding.filter((f) => {
    if (ui.fundingType !== "All" && f.agencyType !== ui.fundingType) return false;
    if (ui.fundingFit !== "All" && fitFromScore(f.score) !== ui.fundingFit) return false;
    return matchesQuery({ ...f, fit: fitFromScore(f.score), technology: techName(f.technologyId) }, ["opportunity", "agency", "deadline", "status", "fit", "technology", "agencyType"]);
  });
  const exportCsv = () => {
    const header = ["Opportunity", "Agency", "Agency type", "Deadline", "Match score", "Fit", "Gaps", "Status"];
    const lines = [header.join(",")].concat(rows.map((f) => [f.opportunity, f.agency, f.agencyType, f.deadline, f.score, fitFromScore(f.score), f.gaps, f.status].map(escapeCsv).join(",")));
    const blob = new Blob(["\ufeff" + lines.join("\r\n")], { type: "text/csv;charset=utf-8" });
    try {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob); a.download = "funding-matches-19-nov-2026.csv";
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => { try { URL.revokeObjectURL(a.href); } catch { /* ignore */ } }, 500);
      toast("Funding matches exported (demo)");
    } catch {
      toast("Download isn't available in this viewer. Open the file in Chrome to export.");
    }
  };
  return (
    <div className="flex flex-col gap-5">
      <PageHeader title="Funding matches" sub="Matches for this organization. Fit is a sample score band only.">
        <button type="button" onClick={exportCsv} className={btnSecondary}><Icon name="download" /> Export CSV</button>
      </PageHeader>
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap gap-2"><span className="self-center text-xs text-muted dark:text-slate-400">Agency type</span>
          {["All", "Government program", "Laboratory", "Innovation office"].map((f) => <button type="button" key={f} onClick={() => patchUi({ fundingType: f })} className={filterBtn(ui.fundingType === f)}>{f}</button>)}
        </div>
        <div className="flex flex-wrap gap-2"><span className="self-center text-xs text-muted dark:text-slate-400">Fit</span>
          {["All", "Strong fit", "Good fit", "Fair fit"].map((f) => <button type="button" key={f} onClick={() => patchUi({ fundingFit: f })} className={filterBtn(ui.fundingFit === f)}>{f}</button>)}
        </div>
      </div>
      <div className="card overflow-hidden">
        <div className={`hidden border-b border-line bg-soft px-4 py-2 text-xs font-medium text-muted dark:border-slate-800 dark:bg-white/5 dark:text-slate-400 md:grid md:gap-4 ${COLS}`}>
          <span>Opportunity</span><span>Agency</span><span>Deadline</span><span>Score</span><span>Fit</span><span>Status</span>
        </div>
        {rows.length ? rows.map((f) => (
          <button type="button" key={f.id} onClick={() => patchUi({ drawer: { type: "funding", id: f.id } })}
            className={`row-hover grid w-full grid-cols-2 items-center gap-2 border-b border-line px-4 py-3 text-left last:border-0 dark:border-slate-800 md:gap-4 ${COLS}`}>
            <span className="text-sm font-medium">{f.opportunity}</span>
            <span className="text-sm text-muted dark:text-slate-400">{f.agency}</span>
            <span className="font-mono text-xs">{f.deadline}</span>
            <span className="font-mono text-xs">{f.score}</span>
            <span><StatusChip status={fitFromScore(f.score)} /></span>
            <span><StatusChip status={f.status} /></span>
          </button>
        )) : <div className="px-4 py-8 text-center text-sm text-muted">No funding matches for this filter.</div>}
      </div>
    </div>
  );
}
