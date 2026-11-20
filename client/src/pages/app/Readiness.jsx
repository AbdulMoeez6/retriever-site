import { Link } from "react-router-dom";
import { useApp } from "../../lib/store.jsx";
import { lastLevel } from "../../lib/format.js";
import { Ring } from "../../components/Charts.jsx";
import { ChartCard, READINESS_RANGES, readinessSpec } from "../../components/DataChart.jsx";
import TechSwitcher from "../../components/TechSwitcher.jsx";
import { FileIcon } from "../../components/Icon.jsx";
import { Avatar, PageHeader, ReviewChip, btnSecondary } from "../../components/ui.jsx";

export default function Readiness() {
  const { currentTech, history, docs, ui, patchUi, hasTech } = useApp();
  if (!hasTech) {
    return (
      <section className="card mx-auto w-full max-w-xl p-6 text-center">
        <h2 className="text-lg font-semibold">Readiness — TRL · MRL · IRL</h2>
        <p className="mt-2 text-sm text-muted dark:text-slate-400">Evidence-based readiness is assessed for a technology. Create your Technology Profile first.</p>
        <button type="button" onClick={() => patchUi({ modal: "readiness" })} className="mt-5 rounded-lg bg-navy px-4 py-2 text-sm font-medium text-white">Get started</button>
      </section>
    );
  }
  const t = currentTech();
  const hist = history[t.id] || { TRL: [], MRL: [], IRL: [] };
  const reviewed = docs.filter((d) => d.technologyId === t.id && d.reviewed);
  const pending = docs.filter((d) => d.technologyId === t.id && !d.reviewed);
  const all = reviewed.concat(pending);
  return (
    <div className="flex flex-col gap-5">
      <PageHeader title="Readiness" sub="Only human-reviewed evidence counts.">
        <TechSwitcher />
        <button type="button" onClick={() => patchUi({ quickOpen: true })} className={btnSecondary}>Five-question quick assessment</button>
      </PageHeader>
      <section className="card p-5">
        <div key={t.id} className="grid justify-items-center gap-6 sm:grid-cols-3">
          <Ring label="TRL" value={lastLevel(hist.TRL)} />
          <Ring label="MRL" value={lastLevel(hist.MRL)} />
          <Ring label="IRL" value={lastLevel(hist.IRL)} />
        </div>
      </section>
      <ChartCard id="readiness.history" title="Readiness history" types={["line", "area", "bar"]} ranges={READINESS_RANGES} withTable
        build={({ range }) => readinessSpec(hist, range)} />
      <section className="card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-medium">Human-reviewed evidence</h2>
            <p className="mt-1 text-xs text-muted dark:text-slate-400">{reviewed.length} of {all.length} documents for {t.name} count toward readiness.</p>
          </div>
          <Link to="/app/knowledge-base" className="text-sm text-muted underline-offset-2 hover:underline dark:text-slate-400">Open Knowledge Base</Link>
        </div>
        <div className="progress mt-3"><span style={{ width: `${all.length ? (reviewed.length / all.length) * 100 : 0}%` }} /></div>
        <ul className="mt-4 grid gap-2 text-sm">
          {all.length ? all.map((d) => (
            <li key={d.id} className="flex items-center gap-3 rounded-lg border border-line px-3 py-2 dark:border-slate-800">
              <FileIcon type={d.type} />
              <span className="flex-1 truncate">{d.name}</span>
              {d.reviewer && <span className="hidden sm:inline-flex"><Avatar name={d.reviewer} size={22} /></span>}
              <span className="hidden text-xs text-muted dark:text-slate-400 sm:inline">{d.reviewer || "Awaiting reviewer"}</span>
              <ReviewChip reviewed={!!d.reviewed} />
            </li>
          )) : <li className="text-muted">No documents on file yet.</li>}
        </ul>
      </section>
    </div>
  );
}
