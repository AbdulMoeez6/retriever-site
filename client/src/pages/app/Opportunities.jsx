import { useNavigate } from "react-router-dom";
import { useApp } from "../../lib/store.jsx";
import { fitFromScore } from "../../lib/format.js";
import { Chip, PageHeader, StatusChip } from "../../components/ui.jsx";

export default function Opportunities() {
  const { opportunities, gapsFor, fundingForOpp, techName, matchesQuery, ui, patchUi } = useApp();
  const navigate = useNavigate();
  const list = opportunities.filter((o) => {
    const fund = fundingForOpp(o.id);
    return matchesQuery({ ...o, technology: techName(o.technologyId), fit: fund ? fitFromScore(fund.score) : "" }, ["title", "program", "technology", "note", "fit"]);
  });
  const selected = list.find((o) => o.id === ui.selectedOpp) || list[0];
  const gaps = selected ? gapsFor(selected.id) : [];
  const openReadiness = (tech) => { patchUi({ techId: tech }); navigate("/app/readiness"); };

  return (
    <div className="flex flex-col gap-5">
      <PageHeader title="Knowledge opportunities" sub="A list of gaps to work on. Match tags are sample scores from funding matches." />
      <div className="grid gap-5 lg:grid-cols-[1fr_22rem]">
        <div className="grid content-start gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {list.length ? list.map((o) => {
            const n = gapsFor(o.id).length;
            const fund = fundingForOpp(o.id);
            const active = selected && selected.id === o.id;
            return (
              <button type="button" key={o.id} onClick={() => patchUi({ selectedOpp: o.id })} className={`card card-hover w-full p-4 text-left ${active ? "!border-navy/40 ring-1 ring-navy/20 dark:!border-slate-400" : ""}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="text-sm font-medium">{o.title}</div>
                  {fund && <Chip label={`${fitFromScore(fund.score)} · ${fund.score}`} tone={fund.score >= 75 ? "success" : fund.score >= 65 ? "info" : "warn"} />}
                </div>
                <div className="mt-1 text-xs text-muted dark:text-slate-400">{techName(o.technologyId)} · {o.program}</div>
                <div className="mt-3 flex items-center justify-between text-xs text-muted dark:text-slate-400"><span>{n} gap{n === 1 ? "" : "s"} to work on</span><span>{o.agencyType}</span></div>
              </button>
            );
          }) : <div className="text-sm text-muted">No opportunities match this search.</div>}
        </div>
        <aside className="card h-fit p-5">
          {selected ? (
            <div key={selected.id} style={{ animation: "pop .25s ease-out" }}>
              <h2 className="text-sm font-medium">Gaps for {selected.title}</h2>
              <p className="mt-1 text-xs text-muted dark:text-slate-400">{selected.note}</p>
              <ul className="mt-4 grid gap-2">
                {gaps.length ? gaps.map((g) => (
                  <li key={g.id} className="rounded-lg border border-line p-3 dark:border-slate-800"><div className="flex items-start justify-between gap-2"><span className="text-sm">{g.text}</span><StatusChip status={g.severity} /></div></li>
                )) : <li className="text-sm text-muted">No gaps on this opportunity.</li>}
              </ul>
              <div className="mt-5 flex flex-wrap gap-2">
                <button type="button" onClick={() => patchUi({ drawer: { type: "gaps", id: selected.id } })} className="rounded-lg border border-line px-3 py-1.5 text-sm dark:border-slate-700">Review gaps</button>
                <button type="button" onClick={() => openReadiness(selected.technologyId)} className="rounded-lg border border-line px-3 py-1.5 text-sm dark:border-slate-700">Open IRL</button>
                <button type="button" onClick={() => openReadiness(selected.technologyId)} className="rounded-lg bg-navy px-3 py-1.5 text-sm font-medium text-white">Open Readiness</button>
              </div>
            </div>
          ) : <p className="text-sm text-muted">Select an opportunity to see its gaps.</p>}
        </aside>
      </div>
    </div>
  );
}
