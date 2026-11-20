import { useNavigate } from "react-router-dom";
import { useApp } from "../../lib/store.jsx";
import { exampleTrail } from "../../data/pilotData.js";
import Icon from "../../components/Icon.jsx";
import KpiCard from "../../components/KpiCard.jsx";
import TechSwitcher from "../../components/TechSwitcher.jsx";
import { CreateProfileBanner, PageHeader, btnPrimary, btnSecondary, formatMoney } from "../../components/ui.jsx";

const TRL_NAMES = ["Basic principles", "Concept formulated", "Proof of concept", "Lab validation", "Relevant environment validation", "Relevant environment demo", "Operational demo", "System qualified", "Mission proven"];

/** TRL 1–9 track: filled to the current level, target outlined, hover a segment for its name. */
function TrlTrack({ current, target }) {
  return (
    <div>
      <div className="grid grid-cols-9 gap-1.5">
        {TRL_NAMES.map((name, i) => {
          const n = i + 1;
          const filled = current != null && n <= current;
          const isCur = n === current;
          const inRange = target != null && current != null && n > current && n <= target;
          return (
            <div key={n} className="group relative">
              <div title={`TRL ${n} · ${name}`}
                className={`trl-seg bar-fill h-11 rounded-md ${filled ? "bg-navy dark:bg-slate-200" : inRange ? "border border-dashed border-accent bg-accent-soft dark:bg-white/5" : "bg-soft dark:bg-white/10"} ${isCur ? "ring-2 ring-navy/25 ring-offset-2 dark:ring-offset-[#161C27]" : ""}`}
                style={{ "--d": `${i * 60}ms` }} />
              <div className={`mt-2 text-center font-mono text-[11px] ${isCur ? "font-semibold text-navy dark:text-white" : "text-muted dark:text-slate-400"}`}>{n}</div>
              <div className="hover-reveal pointer-events-none absolute -top-9 left-1/2 z-10 w-max -translate-x-1/2 rounded-md bg-navy px-2 py-1 text-[11px] text-white shadow-raised">{name}</div>
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted dark:text-slate-400">
        <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-navy dark:bg-slate-200" /> Evidenced</span>
        <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-sm border border-dashed border-accent bg-accent-soft" /> Planned on this trail</span>
      </div>
    </div>
  );
}

export default function Commercialization() {
  const { hasTech, currentTech, trail, pipeline, patchData, patchUi, toast } = useApp();
  const navigate = useNavigate();
  const t = hasTech ? currentTech() : null;
  const record = t ? trail[t.id] : null;
  const phases = record ? record.phases : exampleTrail(t?.trl);
  const target = t && t.trl != null ? Math.min(9, t.trl + 2) : null;
  const matched = t ? pipeline.filter((o) => o.techId === t.id).reduce((a, o) => a + o.amount, 0) : 0;
  const toggle = (phaseId, itemId) => {
    if (!record) return;
    patchData((d) => ({
      trail: { ...d.trail, [t.id]: { ...d.trail[t.id], phases: d.trail[t.id].phases.map((p) => (p.id !== phaseId ? p : { ...p, items: p.items.map((i) => (i.id === itemId ? { ...i, done: !i.done } : i)) })) } },
    }));
  };
  const generate = () => {
    patchData((d) => ({ trail: { ...d.trail, [t.id]: { generated: "20 Nov 2026", phases: exampleTrail(t.trl) } } }));
    toast("Commercialization Trail generated (demo)");
  };
  const exportPdf = () => {
    let framed = true;
    try { framed = window.self !== window.top; } catch { framed = true; }
    if (framed) { toast("PDF export needs a full browser tab. Open the file in Chrome to export."); return; }
    try { window.print(); } catch { toast("Printing isn't available here."); }
  };

  return (
    <div className="flex flex-col gap-5">
      <PageHeader title="Commercialization Trail" sub={`A phased plan from evidence to deployment. ${record ? `Generated ${record.generated}` : "Not generated yet"} · Acme Labs.`}>
        <TechSwitcher />
        <button type="button" onClick={exportPdf} className={btnSecondary}><Icon name="download" /> Export PDF</button>
        <button type="button" onClick={() => patchUi({ modal: "share" })} className={btnPrimary}><Icon name="share" /> Share</button>
      </PageHeader>
      {!hasTech && <CreateProfileBanner text="Create your Technology Profile to generate a Commercialization Trail." />}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Current level" value={t?.trl != null ? `TRL ${t.trl}` : "—"} sub="From human-reviewed evidence" onClick={() => (hasTech ? navigate("/app/readiness") : patchUi({ modal: "readiness" }))} />
        <KpiCard label="Target level" value={target ? `TRL ${target}` : "—"} sub="Set in Strategic Goals" onClick={() => navigate("/app/readiness-questionnaire")} />
        <KpiCard label="Horizon" value={t ? "18 months" : "—"} sub="Now · Next · Later" onClick={() => navigate("/app/action-plan")} />
        <KpiCard label="Funding matched" value={matched ? formatMoney(matched) : "—"} sub="Across the pipeline (sample)" onClick={() => navigate("/app/opportunities")} />
      </div>

      <section className="card p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-medium">Readiness track</h2>
            <p className="mt-1 text-xs text-muted dark:text-slate-400">The current TRL comes only from documented evidence. Hover a level for its meaning.</p>
          </div>
          {t && !record && <button type="button" onClick={generate} className={btnPrimary}>Generate trail</button>}
        </div>
        <div className="mt-6"><TrlTrack current={t?.trl ?? null} target={target} /></div>
      </section>

      <section className="card p-5">
        <div className="flex items-baseline justify-between">
          <h2 className="text-sm font-medium">Trail phases</h2>
          <span className="text-xs text-muted dark:text-slate-400">{record ? "Tick an item when it is done" : "Example items"}</span>
        </div>
        <ol className="relative mt-5 grid gap-6 md:grid-cols-3">
          <span aria-hidden="true" className="absolute left-0 right-0 top-[7px] hidden h-px bg-line dark:bg-slate-700 md:block" />
          {phases.map((p, pi) => {
            const done = p.items.filter((i) => i.done).length;
            return (
              <li key={p.id} className="relative">
                <span className={`relative z-[1] block size-3.5 rounded-full border-2 ${pi === 0 ? "border-navy bg-navy" : "border-navy/40 bg-white dark:bg-[#161C27]"}`} />
                <div className="mt-3 text-xs text-muted dark:text-slate-400">{p.label} · {p.window}</div>
                <h3 className="mt-0.5 font-medium">{p.title}</h3>
                <div className="mt-2 flex items-center gap-2">
                  <span className="progress flex-1"><span style={{ width: `${(done / p.items.length) * 100}%` }} /></span>
                  <span className="font-mono text-[11px] text-muted dark:text-slate-400">{done}/{p.items.length}</span>
                </div>
                <ul className="mt-3 grid gap-1">
                  {p.items.map((i) => (
                    <li key={i.id}>
                      <button type="button" onClick={() => (record ? toggle(p.id, i.id) : toast(t ? "Generate the trail to track items" : "Create your Technology Profile first"))}
                        className={`flex w-full items-start gap-2.5 rounded-md px-1.5 py-1.5 text-left text-sm transition-colors hover:bg-soft dark:hover:bg-white/5 ${record ? "" : "text-muted dark:text-slate-400"}`}>
                        <span className={`mt-0.5 grid size-4 shrink-0 place-items-center rounded border transition-colors ${i.done ? "border-navy bg-navy text-white dark:border-slate-200 dark:bg-slate-200 dark:text-navy" : "border-line dark:border-slate-600"}`}>{i.done && <Icon name="check" className="check-pop size-3" strokeWidth={2.6} />}</span>
                        <span className={i.done ? "text-muted line-through decoration-navy/30" : ""}>{i.text}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ol>
        {t && <button type="button" onClick={() => navigate("/app/action-plan")} className={`${btnSecondary} nudge mt-6`}>Turn phases into actions <Icon name="arrow" /></button>}
      </section>
    </div>
  );
}
