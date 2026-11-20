import { useState } from "react";
import { useApp } from "../../lib/store.jsx";
import Icon from "../../components/Icon.jsx";
import { PageHeader, btnSecondary, formatMoney } from "../../components/ui.jsx";
import TechSwitcher from "../../components/TechSwitcher.jsx";

// Fixed fill-in-the-blanks templates. Nothing is generated, stored or sent.
const SECTIONS = [
  { id: "summary", title: "Executive Summary", source: "Company overview, Technology description",
    build: ({ a, o, t }) => `${a.legalName || "Our organization"} respectfully submits this proposal in response to ${o ? `${o.title} (${o.agency}, ${o.program})` : "your target opportunity"}. ${a.techDescription || (t ? t.summary : "A technology in early development.")}` },
  { id: "approach", title: "Technical Approach", source: "Technology, Experimentation",
    build: ({ a, t }) => `Our technology is currently at ${t && t.trl != null ? `TRL ${t.trl}` : "an early stage of development"}. ${a.differentiator || "Formal testing has not yet been documented."} ${a.testSummary ? `Testing to date: ${a.testSummary}` : "Planned work will document results in a relevant environment."}` },
  { id: "readiness", title: "Readiness and Evidence", source: "Knowledge Base, Readiness",
    build: ({ t, reviewed }) => `${reviewed} human-reviewed document${reviewed === 1 ? "" : "s"} support the current readiness levels${t && t.trl != null ? ` (TRL ${t.trl} · MRL ${t.mrl ?? "—"} · IRL ${t.irl ?? "—"})` : ""}. Only reviewed evidence is cited.` },
  { id: "commercial", title: "Commercialization Plan", source: "Commercialization, Strategic Goals",
    build: ({ a }) => `Target market: ${a.market || "to be confirmed"}. Business model: ${a.businessModel || "to be confirmed"}. ${a.pilotCustomers ? `Customer validation: ${a.pilotCustomers}.` : ""}`.trim() },
];

export default function ProposalAssistant() {
  const { hasTech, ui, currentTech, pipeline, questionnaireFor, docs, patchUi, toast } = useApp();
  const t = hasTech ? currentTech() : null;
  const opps = t ? pipeline.filter((o) => o.techId === t.id) : [];
  const forId = opps.some((o) => o.id === ui.proposalFor) ? ui.proposalFor : "";
  const o = opps.find((x) => x.id === forId) || null;
  const a = t ? questionnaireFor(t.id).answers : {};
  const reviewed = t ? docs.filter((d) => d.technologyId === t.id && d.reviewed).length : 0;
  const ctx = { a, o, t, reviewed };
  const fresh = () => Object.fromEntries(SECTIONS.map((s) => [s.id, s.build(ctx)]));
  const [text, setText] = useState(fresh);
  const [key, setKey] = useState(`${ui.techId}:${forId}`);
  if (key !== `${ui.techId}:${forId}`) { setKey(`${ui.techId}:${forId}`); setText(fresh()); }

  const regenerate = (id) => { setText((x) => ({ ...x, [id]: SECTIONS.find((s) => s.id === id).build(ctx) })); toast("Section rebuilt from your answers"); };
  const exportDraft = () => {
    const body = SECTIONS.map((s) => `${s.title}\n\n${text[s.id]}\n`).join("\n");
    try {
      const blob = new Blob([body], { type: "text/plain;charset=utf-8" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob); link.download = "proposal-draft.txt";
      document.body.appendChild(link); link.click(); link.remove();
      setTimeout(() => { try { URL.revokeObjectURL(link.href); } catch { /* ignore */ } }, 500);
      toast("Draft exported (demo)");
    } catch {
      toast("Download isn't available in this viewer. Open the file in Chrome to export.");
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <PageHeader title={<span className="inline-flex flex-wrap items-center gap-2">Proposal assistant <span className="rounded-full border border-line px-2 py-0.5 text-xs font-medium text-muted dark:border-slate-700 dark:text-slate-400">Template preview</span></span>} sub="A starting outline from your questionnaire answers. Not saved.">
        <TechSwitcher />
        <button type="button" onClick={exportDraft} className={btnSecondary}><Icon name="download" /> Export draft</button>
      </PageHeader>
      <div className="flex max-w-3xl flex-col gap-5">
      <section className="card p-5">
        <label className="grid gap-1.5 text-sm font-medium">Drafting for
          <select value={forId} onChange={(e) => patchUi({ proposalFor: e.target.value })} className="field font-normal">
            <option value="">{opps.length ? "Generic outline" : "No matched opportunity yet, generic outline"}</option>
            {opps.map((x) => <option key={x.id} value={x.id}>{x.title} · {x.agency} · {formatMoney(x.amount)}</option>)}
          </select>
        </label>
      </section>
      <section className="card grid gap-6 p-5">
        {SECTIONS.map((s) => (
          <div key={s.id}>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium">{s.title}</h2>
              <button type="button" onClick={() => regenerate(s.id)} className="group inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium text-navy transition-colors hover:bg-soft dark:text-slate-200 dark:hover:bg-white/10"><Icon name="refresh" className="size-3.5 transition-transform duration-500 group-hover:rotate-180" /> Regenerate</button>
            </div>
            <textarea rows={4} value={text[s.id]} onChange={(e) => setText((x) => ({ ...x, [s.id]: e.target.value }))} className="field mt-2 w-full text-sm" />
            <p className="mt-1 font-mono text-[11px] text-muted dark:text-slate-400">Source: {s.source}</p>
          </div>
        ))}
      </section>
      </div>
    </div>
  );
}
