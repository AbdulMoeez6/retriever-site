import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../lib/store.jsx";
import Icon from "../../components/Icon.jsx";
import { PageHeader, btnPrimary, btnSecondary } from "../../components/ui.jsx";
import TechSwitcher from "../../components/TechSwitcher.jsx";

function Finding({ f, tone, docs, onDoc }) {
  const doc = f.docId ? docs.find((d) => d.id === f.docId) : null;
  return (
    <li className="tick-in flex gap-3 border-b border-line py-3 last:border-0 dark:border-slate-800">
      <span className={`mt-1.5 size-2 shrink-0 rounded-full ${tone}`} />
      <div className="min-w-0">
        <div className="text-sm">{f.text}</div>
        {doc ? <button type="button" onClick={() => onDoc(doc.id)} className="mt-1 font-mono text-[11px] u-link text-navy dark:text-slate-200">Source: {doc.name}</button>
          : <div className="mt-1 font-mono text-[11px] text-muted dark:text-slate-400">Source: {f.source}</div>}
      </div>
    </li>
  );
}

export default function EvidenceReasoning() {
  const { hasTech, ui, reasoning, docs, patchData, patchUi, toast, techName } = useApp();
  const navigate = useNavigate();
  const [running, setRunning] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  const result = hasTech ? reasoning[ui.techId] : null;

  const run = () => {
    if (!hasTech) return;
    setRunning(true);
    timer.current = setTimeout(() => {
      const techDocs = docs.filter((d) => d.technologyId === ui.techId);
      patchData((d) => ({ reasoning: { ...d.reasoning, [ui.techId]: d.reasoning[ui.techId] ? { ...d.reasoning[ui.techId], lastRun: "Just now" } : {
        lastRun: "Just now",
        strengths: techDocs.filter((x) => x.reviewed).map((x, i) => ({ id: `s${i}`, text: `${x.name} is human-reviewed and supports the claims it describes.`, docId: x.id })),
        gaps: techDocs.filter((x) => !x.reviewed).map((x, i) => ({ id: `g${i}`, text: `${x.name} is not yet human-reviewed, so it is left out of readiness.`, docId: x.id }))
          .concat([{ id: "gq", text: "Some questionnaire sections are unanswered, which limits the review.", source: "Readiness Questionnaire" }]),
      } } }));
      setRunning(false);
      toast("Review complete");
    }, 900);
  };

  return (
    <div className="flex flex-col gap-5">
      <PageHeader title="Evidence reasoning" sub="Qualitative findings, run only when you ask.">
        <TechSwitcher />
      </PageHeader>
      <section className="card flex flex-col gap-4 p-5 md:flex-row md:items-start md:justify-between">
        <div className="max-w-xl">
          <h2 className="text-sm font-medium">Qualitative review</h2>
          <p className="mt-2 text-sm text-muted dark:text-slate-400">Runs a qualitative review of your Readiness Questionnaire answers and uploaded documents, and lists strengths and gaps with the document each came from. It never changes your Innovation Index or your evidence-based TRL · MRL · IRL, and it only runs when you click the button.</p>
          {!hasTech && (
            <div className="mt-3 flex items-center gap-2 text-xs text-muted dark:text-slate-400">Create your Technology Profile first.
              <button type="button" onClick={() => navigate("/app/technology-profile")} className={btnSecondary}>Create Technology Profile</button>
            </div>
          )}
          {result && <p className="mt-3 font-mono text-[11px] text-muted dark:text-slate-400">{techName(ui.techId)} · last run {result.lastRun}</p>}
        </div>
        <button type="button" onClick={run} disabled={!hasTech || running} className={`${btnPrimary} shrink-0 disabled:opacity-50`}>
          <Icon name={running ? "refresh" : "lens"} className={`size-4 ${running ? "animate-spin" : ""}`} /> {running ? "Reviewing…" : "Run new review"}
        </button>
      </section>
      {result && (
        <div className="grid gap-5 md:grid-cols-2">
          <section className="card p-5"><h3 className="text-sm font-medium">Strengths</h3><ul className="mt-1">{result.strengths.map((f) => <Finding key={f.id} f={f} tone="bg-emerald-600" docs={docs} onDoc={(id) => patchUi({ drawer: { type: "doc", id } })} />)}</ul></section>
          <section className="card p-5"><h3 className="text-sm font-medium">Gaps</h3><ul className="mt-1">{result.gaps.map((f) => <Finding key={f.id} f={f} tone="bg-amber-500" docs={docs} onDoc={(id) => patchUi({ drawer: { type: "doc", id } })} />)}</ul></section>
        </div>
      )}
      {hasTech && !result && <p className="text-sm text-muted dark:text-slate-400">No review has been run for this technology yet.</p>}
    </div>
  );
}
