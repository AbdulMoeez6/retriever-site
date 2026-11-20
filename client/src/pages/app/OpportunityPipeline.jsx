import { useApp } from "../../lib/store.jsx";
import { PIPELINE_STAGES } from "../../data/pilotData.js";
import Icon from "../../components/Icon.jsx";
import TechSwitcher from "../../components/TechSwitcher.jsx";
import { CreateProfileBanner, PageHeader, ShellContext, StatusChip, Tabs, formatMoney } from "../../components/ui.jsx";
import Funding from "./Funding.jsx";
import { ChartCard, PIPELINE_GROUPS, pipelineSpec } from "../../components/DataChart.jsx";

const STAGE_SHADE = (i) => `rgba(27,54,93,${0.28 + i * 0.18})`;

function OppCard({ o, onOpen, onMove }) {
  const i = PIPELINE_STAGES.indexOf(o.stage);
  const last = i === PIPELINE_STAGES.length - 1;
  return (
    <li className="group card card-hover tick-in p-3.5">
      <button type="button" onClick={onOpen} className="block w-full text-left">
        <div className="text-sm font-medium leading-snug">{o.title}</div>
        <div className="mt-1 text-xs text-muted dark:text-slate-400">{o.agency} · {o.program}</div>
        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="font-mono text-xs">{formatMoney(o.amount)}</span>
          <StatusChip status={o.fit} />
        </div>
        <div className="mt-1 text-[11px] text-muted dark:text-slate-400">{o.date}</div>
      </button>
      <div className="mt-3 flex items-center justify-between border-t border-line pt-2 dark:border-slate-700">
        <button type="button" disabled={i === 0} onClick={() => onMove(-1)} className="hover-reveal grid size-6 place-items-center rounded-md text-muted hover:bg-soft disabled:invisible dark:hover:bg-white/10" aria-label="Move back a stage"><Icon name="back" className="size-3.5" /></button>
        {last ? <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400">Awarded</span> : (
          <button type="button" onClick={() => onMove(1)} className="nudge inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs text-muted transition-colors hover:bg-soft hover:text-ink dark:hover:bg-white/10 dark:hover:text-white">
            Move to {PIPELINE_STAGES[i + 1]} <Icon name="chevronRight" className="size-3.5" />
          </button>
        )}
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
      <PageHeader title="Opportunities" sub="Funding matches, tracked from match to award. Move a card as the work moves.">
        <TechSwitcher />
        <Tabs tabs={["Pipeline", "Funding matches"]} value={ui.oppTab} onChange={(v) => patchUi({ oppTab: v })} />
      </PageHeader>
      {ui.oppTab === "Funding matches" ? <ShellContext.Provider value={true}><Funding /></ShellContext.Provider> : (
        <>
          {!hasTech && <CreateProfileBanner text="Create your Technology Profile to start matching funding opportunities." />}
          <ChartCard id="opp.value" title="Pipeline value" types={["bar", "donut"]} groups={PIPELINE_GROUPS} height={170}
            build={({ group }) => pipelineSpec(opps, group)} />
          <div className="overflow-x-auto pb-2">
            <div className="grid min-w-[62rem] grid-cols-5 gap-3">
              {PIPELINE_STAGES.map((stage, si) => {
                const col = opps.filter((o) => o.stage === stage);
                return (
                  <section key={stage} className="rounded-xl bg-soft/70 p-2.5 dark:bg-white/[.03]">
                    <div className="flex items-center justify-between px-1 pb-2">
                      <h2 className="flex items-center gap-2 text-xs font-medium"><span className="size-2 rounded-full" style={{ background: STAGE_SHADE(si) }} />{stage}</h2>
                      <span className="font-mono text-[11px] text-muted dark:text-slate-400">{col.length} · {col.length ? formatMoney(col.reduce((a, o) => a + o.amount, 0)) : "—"}</span>
                    </div>
                    <ul className="grid gap-2">
                      {col.length ? col.map((o) => (
                        <OppCard key={`${o.id}-${o.stage}`} o={o} onOpen={() => patchUi({ drawer: { type: "pipeline", id: o.id } })} onMove={(dir) => move(o.id, dir)} />
                      )) : <li className="rounded-lg border border-dashed border-line px-2 py-6 text-center text-xs text-muted dark:border-slate-700 dark:text-slate-400">No opportunities here yet</li>}
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
