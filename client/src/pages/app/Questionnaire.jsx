import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../lib/store.jsx";
import { QUESTIONNAIRE } from "../../data/pilotData.js";
import Icon from "../../components/Icon.jsx";
import TechSwitcher from "../../components/TechSwitcher.jsx";
import { ProgressRing } from "../../components/PilotWorkflow.jsx";
import { PageHeader, btnPrimary, btnSecondary } from "../../components/ui.jsx";

function QuestionnaireForm() {
  const { hasTech, ui, questionnaireFor, questionnairePct, patchData, toast } = useApp();
  const navigate = useNavigate();
  const techId = ui.techId;
  const q = questionnaireFor(techId);
  const firstOpen = Math.max(0, QUESTIONNAIRE.findIndex((s) => !q.completed.includes(s.id)));
  const [idx, setIdx] = useState(hasTech ? firstOpen : 0);
  const [saving, setSaving] = useState(false);
  const section = QUESTIONNAIRE[idx];
  const pct = hasTech ? questionnairePct(techId) : 0;
  const answered = section.fields.filter((f) => q.answers[f.id]).length;

  const write = (patch) => {
    if (!hasTech) return;
    patchData((d) => {
      const cur = d.questionnaire[techId] || { completed: [], answers: {} };
      return { questionnaire: { ...d.questionnaire, [techId]: { ...cur, ...patch(cur) } } };
    });
    setSaving(true);
    setTimeout(() => setSaving(false), 450);
  };
  const setAnswer = (id, value) => write((cur) => ({ answers: { ...cur.answers, [id]: value } }));
  const completeAndNext = () => {
    if (!hasTech) { navigate("/app/technology-profile"); return; }
    write((cur) => ({ completed: cur.completed.includes(section.id) ? cur.completed : [...cur.completed, section.id] }));
    if (idx < QUESTIONNAIRE.length - 1) setIdx(idx + 1);
    else toast("All 12 sections complete (demo)");
  };

  return (
    <div className="flex flex-col gap-5">
      <PageHeader title="Readiness Questionnaire" sub="12 sections · about 15 minutes · your answers are saved as you go.">
        <TechSwitcher />
        <button type="button" onClick={() => { toast("Answers saved (demo)"); navigate("/app/mission-command"); }} className={btnSecondary}>Save &amp; exit</button>
      </PageHeader>

      {!hasTech && (
        <div className="card flex flex-wrap items-center gap-3 p-4 text-sm">
          <div className="flex-1"><div className="font-medium">Create your Technology Profile first.</div><div className="text-muted dark:text-slate-400">Answers are saved to a technology, so the questionnaire starts once one exists.</div></div>
          <button type="button" onClick={() => navigate("/app/technology-profile")} className={btnPrimary}>Go to Technology Profile</button>
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-[17rem_1fr]">
        <aside className="card h-fit p-4">
          <div className="flex items-center gap-3">
            <ProgressRing value={q.completed.length} total={QUESTIONNAIRE.length} size={52} />
            <div>
              <div className="text-sm font-medium">{pct}% complete</div>
              <div className="flex items-center gap-1 text-xs text-muted dark:text-slate-400">
                {hasTech ? (saving ? "Saving…" : <><Icon name="check" className="size-3 text-emerald-600" /> Saved just now</>) : "Not started"}
              </div>
            </div>
          </div>
          <ol className="mt-4 grid gap-0.5 border-t border-line pt-3 dark:border-slate-800">
            {QUESTIONNAIRE.map((s, i) => {
              const done = q.completed.includes(s.id);
              const on = i === idx;
              return (
                <li key={s.id}>
                  <button type="button" onClick={() => setIdx(i)} className={`flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left text-sm transition-colors ${on ? "bg-soft font-medium dark:bg-white/10" : "text-muted hover:bg-soft/70 hover:text-ink dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white"}`}>
                    <span className={`grid size-5 shrink-0 place-items-center rounded-full text-[10px] transition-colors ${done ? "bg-navy text-white dark:bg-slate-200 dark:text-navy" : on ? "border-2 border-navy text-navy dark:border-slate-200 dark:text-slate-200" : "border border-line dark:border-slate-600"}`}>
                      {done ? <Icon name="check" className="size-3" strokeWidth={2.6} /> : i + 1}
                    </span>
                    <span className="flex-1 truncate">{s.title}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </aside>

        <section key={section.id} className="card tick-in p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="text-xs text-muted dark:text-slate-400">Section {idx + 1} of {QUESTIONNAIRE.length}</div>
              <h2 className="mt-0.5 text-xl font-semibold tracking-tight">{section.title}</h2>
              <p className="mt-2 max-w-xl text-sm text-muted dark:text-slate-400">{section.intro}</p>
            </div>
            <span className="rounded-full bg-soft px-2.5 py-1 font-mono text-[11px] text-muted dark:bg-white/10 dark:text-slate-300">{answered}/{section.fields.length} answered</span>
          </div>
          <div className="progress mt-5"><span style={{ width: `${pct}%` }} /></div>
          <div className="mt-6 grid max-w-2xl gap-5">
            {section.fields.map((f) => {
              const v = q.answers[f.id] || "";
              const common = { id: `q-${f.id}`, value: v, disabled: !hasTech, onChange: (e) => setAnswer(f.id, e.target.value), className: "field w-full text-sm disabled:opacity-60" };
              return (
                <div key={f.id} className="grid gap-1.5">
                  <label htmlFor={`q-${f.id}`} className="flex items-center gap-2 text-sm font-medium">{f.label}{v && <Icon name="check" className="tick-in size-3.5 text-emerald-600" />}</label>
                  {f.type === "textarea" ? <textarea rows={3} {...common} />
                    : f.type === "select" ? <select {...common}><option value="">Select an option…</option>{f.options.map((o) => <option key={o}>{o}</option>)}</select>
                    : <input {...common} />}
                  {f.help && <p className="text-xs text-muted dark:text-slate-400">{f.help}</p>}
                </div>
              );
            })}
          </div>
          <div className="mt-8 flex max-w-2xl justify-between">
            <button type="button" onClick={() => setIdx(Math.max(0, idx - 1))} disabled={idx === 0} className={`${btnSecondary} disabled:opacity-40`}>Back</button>
            <button type="button" onClick={completeAndNext} className={`${btnPrimary} nudge`}>{idx < QUESTIONNAIRE.length - 1 ? "Save and continue" : "Finish questionnaire"} <Icon name="arrow" /></button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default function Questionnaire() {
  const { ui } = useApp();
  return <QuestionnaireForm key={ui.techId} />;
}
