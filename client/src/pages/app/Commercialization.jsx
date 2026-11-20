import { useNavigate } from "react-router-dom";
import { useApp } from "../../lib/store.jsx";
import { exampleTrail } from "../../data/pilotData.js";
import Icon from "../../components/Icon.jsx";
import { CreateProfileBanner, btnPrimary, btnSecondary, formatMoney } from "../../components/ui.jsx";

const PHASE_TONE = { now: "border-emerald-600", next: "border-[#2F5BD3]", later: "border-slate-300 dark:border-slate-600" };

function Ladder({ current, target }) {
  return (
    <ol className="grid gap-1.5" aria-label="TRL ladder">
      {[9, 8, 7, 6, 5, 4, 3, 2, 1].map((n) => {
        const on = n === current;
        const tgt = n === target;
        return (
          <li key={n} style={{ width: `${52 + n * 5.2}%` }}
            className={`rounded px-2 py-0.5 font-mono text-[11px] ${on ? "bg-[#2F5BD3] font-semibold text-white" : tgt ? "bg-white/90 text-navy ring-2 ring-[#7EA1F2]" : "bg-white/85 text-navy"}`}>
            TRL {n}{on ? " · current" : tgt ? " · target" : ""}
          </li>
        );
      })}
    </ol>
  );
}

export default function Commercialization() {
  const { hasTech, currentTech, ui, trail, pipeline, patchData, patchUi, toast } = useApp();
  const navigate = useNavigate();
  const t = hasTech ? currentTech() : null;
  const record = t ? trail[t.id] : null;
  const phases = record ? record.phases : exampleTrail(t?.trl);
  const target = t && t.trl != null ? Math.min(9, t.trl + 2) : null;
  const matched = t ? pipeline.filter((o) => o.techId === t.id).reduce((a, o) => a + o.amount, 0) : 0;
  const stats = [
    ["Current level", t?.trl != null ? `TRL ${t.trl}` : "—"],
    ["Target level", target ? `TRL ${target}` : "—"],
    ["Horizon", t ? "18 months" : "—"],
    ["Funding matched", t && matched ? formatMoney(matched) : "—"],
  ];
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
    <div className="flex max-w-5xl flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted dark:text-slate-400">{record ? `Generated ${record.generated}` : "Not generated yet"} · Acme Labs{t ? ` · ${t.name}` : ""}</p>
        <div className="flex gap-2">
          <button type="button" onClick={exportPdf} className={btnSecondary}><Icon name="download" /> Export PDF</button>
          <button type="button" onClick={() => patchUi({ modal: "share" })} className={btnPrimary}><Icon name="share" /> Share</button>
        </div>
      </div>
      {!hasTech && <CreateProfileBanner text="Create your Technology Profile to generate a Commercialization Trail." />}

      <section className="grid gap-8 rounded-2xl bg-[#0B1729] p-7 text-white shadow-raised md:grid-cols-[1.4fr_1fr]">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#9DB6F5]">Commercialization trail</div>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">Your Commercialization Trail</h2>
          <p className="mt-3 max-w-md text-sm text-slate-300">A phased plan built from your Readiness Questionnaire scores and matched funding. The current TRL comes only from documented evidence.</p>
          <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map(([k, v]) => (
              <div key={k}><dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-slate-400">{k}</dt><dd className="mt-1 text-lg font-semibold">{v}</dd></div>
            ))}
          </dl>
          {t && !record && <button type="button" onClick={generate} className="mt-6 rounded-lg bg-white px-4 py-2 text-sm font-medium text-navy">Generate trail</button>}
        </div>
        <Ladder current={t?.trl ?? null} target={target} />
      </section>

      <section>
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-semibold">Trail phases</h2>
          {!record && <span className="text-xs text-muted dark:text-slate-400">Example items</span>}
        </div>
        <div className="mt-3 grid gap-5 md:grid-cols-3">
          {phases.map((p) => (
            <div key={p.id} className={`border-t-2 pt-3 ${PHASE_TONE[p.id]}`}>
              <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted dark:text-slate-400">{p.label} · {p.window}</div>
              <h3 className="mt-1 font-semibold">{p.title}</h3>
              <ul className="mt-3 grid gap-2">
                {p.items.map((i) => (
                  <li key={i.id}>
                    <button type="button" onClick={() => (record ? toggle(p.id, i.id) : toast(t ? "Generate the trail to track items" : "Create your Technology Profile first"))}
                      className={`flex w-full items-start gap-2 text-left text-sm ${record ? "" : "text-muted dark:text-slate-400"}`}>
                      <span className={`mt-0.5 grid size-4 shrink-0 place-items-center rounded border ${i.done ? "border-emerald-600 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400" : "border-line dark:border-slate-600"}`}>{i.done && <Icon name="check" className="size-3" strokeWidth={2.6} />}</span>
                      <span className={i.done ? "line-through opacity-70" : ""}>{i.text}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
      {t && <button type="button" onClick={() => navigate("/app/action-plan")} className={`${btnSecondary} self-start`}>Turn phases into actions <Icon name="arrow" /></button>}
    </div>
  );
}
