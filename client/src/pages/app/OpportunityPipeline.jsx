import { useApp } from "../../lib/store.jsx";
import { PIPELINE_STAGES } from "../../data/pilotData.js";
import Icon from "../../components/Icon.jsx";
import { CreateProfileBanner, StatusChip, Tabs, formatMoney } from "../../components/ui.jsx";
import Funding from "./Funding.jsx";

function OppCard({ o, onOpen, onMove }) {
  const i = PIPELINE_STAGES.indexOf(o.stage);
  return (
    <li className="card card-hover p-3">
      <button type="button" onClick={onOpen} className="block w-full text-left">
        <div className="text-sm font-medium leading-snug">{o.title}</div>
        <div className="mt-1 text-xs text-muted dark:text-slate-400">{o.agency} · {o.program}</div>
        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="font-mono text-xs">{formatMoney(o.amount)}</span>
          <StatusChip status={o.fit} />
        </div>
        <div className="mt-1 text-[11px] text-muted dark:text-slate-400">{o.date}</div>
      </button>
      <div className="mt-2 flex justify-between border-t border-line pt-2 dark:border-slate-700">
        <button type="button" disabled={i === 0} onClick={() => onMove(-1)} className="rounded px-1.5 text-xs text-muted hover:text-ink disabled:opacity-30 dark:hover:text-white" aria-label="Move back a stage"><Icon name="back" className="size-3.5" /></button>
        <button type="button" disabled={i === PIPELINE_STAGES.length - 1} onClick={() => onMove(1)} className="inline-flex items-center gap-1 rounded px-1.5 text-xs text-muted hover:text-ink disabled:opacity-30 dark:hover:text-white">
          {i < PIPELINE_STAGES.length - 1 ? `Move to ${PIPELINE_STAGES[i + 1]}` : "Awarded"} <Icon name="chevronRight" className="size-3.5" />
        </button>
      </div>
    </li>
  );
}

export default function OpportunityPipeline() {
  const { hasTech, ui, pipeline, patchUi, patchData, toast } = useApp();
  const opps = hasTech ? pipeline.filter((o) => o.techId === ui.techId) : [];
  const move = (id, dir) => {
    const o = pipeline.find((x) => x.id === id);
    if (!o) return;
    const stage = PIPELINE_STAGES[Math.min(PIPELINE_STAGES.length - 1, Math.max(0, PIPELINE_STAGES.indexOf(o.stage) + dir))];
    patchData((d) => ({ pipeline: d.pipeline.map((x) => (x.id === id ? { ...x, stage } : x)) }));
    toast(`${o.title} moved to ${stage}`);
  };
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs tabs={["Pipeline", "Funding matches"]} value={ui.oppTab} onChange={(v) => patchUi({ oppTab: v })} />
        {ui.oppTab === "Pipeline" && hasTech && <span className="text-xs text-muted dark:text-slate-400">{opps.length} opportunities · {formatMoney(opps.reduce((a, o) => a + o.amount, 0))} matched</span>}
      </div>
      {ui.oppTab === "Funding matches" ? <Funding /> : (
        <>
          {!hasTech && <CreateProfileBanner text="Create your Technology Profile to start matching funding opportunities." />}
          <div className="overflow-x-auto pb-2">
            <div className="grid min-w-[60rem] grid-cols-5 gap-3">
              {PIPELINE_STAGES.map((stage) => {
                const col = opps.filter((o) => o.stage === stage);
                return (
                  <section key={stage} className="rounded-xl border border-line bg-white/70 p-3 dark:border-slate-800 dark:bg-white/[.03]">
                    <div className="flex items-center justify-between">
                      <h2 className="font-mono text-[11px] uppercase tracking-[0.12em]">{stage}</h2>
                      <span className="grid min-w-5 place-items-center rounded-full border border-line px-1.5 text-[11px] dark:border-slate-700">{col.length}</span>
                    </div>
                    <ul className="mt-3 grid gap-2">
                      {col.length ? col.map((o) => (
                        <OppCard key={o.id} o={o} onOpen={() => patchUi({ drawer: { type: "pipeline", id: o.id } })} onMove={(dir) => move(o.id, dir)} />
                      )) : <li className="rounded-lg border border-dashed border-line px-2 py-5 text-center text-xs text-muted dark:border-slate-700 dark:text-slate-400">No opportunities here yet</li>}
                    </ul>
                  </section>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
