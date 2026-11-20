import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../lib/store.jsx";
import { QUESTIONNAIRE } from "../../data/pilotData.js";
import Icon from "../../components/Icon.jsx";
import { Eyebrow, btnPrimary, btnSecondary } from "../../components/ui.jsx";

function QuestionnaireForm() {
  const { hasTech, ui, questionnaireFor, questionnairePct, patchData, toast } = useApp();
  const navigate = useNavigate();
  const techId = ui.techId;
  const q = questionnaireFor(techId);
  const firstOpen = Math.max(0, QUESTIONNAIRE.findIndex((s) => !q.completed.includes(s.id)));
  const [idx, setIdx] = useState(hasTech ? firstOpen : 0);
  const [savedAt, setSavedAt] = useState("Saved just now");
  const section = QUESTIONNAIRE[idx];
  const pct = hasTech ? questionnairePct(techId) : 0;

  const write = (patch) => {
    if (!hasTech) return;
    patchData((d) => {
      const cur = d.questionnaire[techId] || { completed: [], answers: {} };
      return { questionnaire: { ...d.questionnaire, [techId]: { ...cur, ...patch(cur) } } };
    });
    setSavedAt("Saving…");
    setTimeout(() => setSavedAt("Saved just now"), 450);
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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm font-medium">{section.title}</div>
        <div className="flex items-center gap-3">
          {hasTech && <span className="inline-flex items-center gap-1 font-mono text-[11px] text-emerald-700 dark:text-emerald-400"><Icon name="check" className="size-3.5" /> {savedAt}</span>}
          <span className="font-mono text-xs text-[#2F5BD3]">{pct}% complete</span>
          <button type="button" onClick={() => { toast("Answers saved (demo)"); navigate("/app/mission-command"); }} className={btnSecondary}>Save &amp; exit</button>
        </div>
      </div>
      <div className="progress"><span style={{ width: `${pct}%` }} /></div>

      {!hasTech && (
        <div className="card flex flex-wrap items-center gap-3 px-4 py-3 text-sm">
          <div className="flex-1"><div className="font-semibold">Create your Technology Profile first.</div><div className="text-muted dark:text-slate-400">Answers are saved to a technology, so the questionnaire starts once one exists.</div></div>
          <button type="button" onClick={() => navigate("/app/technology-profile")} className={btnPrimary}>Go to Technology Profile</button>
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-[14rem_1fr]">
        <ol className="grid h-fit gap-0.5">
          {QUESTIONNAIRE.map((s, i) => {
            const done = q.completed.includes(s.id);
            return (
              <li key={s.id}>
                <button type="button" onClick={() => setIdx(i)} className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm ${i === idx ? "bg-[#EEF2FC] font-medium dark:bg-white/10" : "text-muted hover:bg-white dark:text-slate-400 dark:hover:bg-white/5"}`}>
                  <span className={`grid size-5 shrink-0 place-items-center rounded-full border text-[10px] ${i === idx ? "border-[#2F5BD3] bg-[#2F5BD3] text-white" : done ? "border-emerald-600 text-emerald-700 dark:text-emerald-400" : "border-line dark:border-slate-600"}`}>
                    {done && i !== idx ? <Icon name="check" className="size-3" strokeWidth={2.6} /> : i + 1}
                  </span>
                  {s.title}
                </button>
              </li>
            );
          })}
        </ol>
        <section className="card max-w-2xl p-6">
          <div className="flex items-start gap-3">
            <span className="grid size-9 place-items-center rounded-lg bg-[#EEF2FC] text-[#2F5BD3] dark:bg-white/10"><Icon name="clipboard" /></span>
            <div><Eyebrow>Section {idx + 1} of {QUESTIONNAIRE.length}</Eyebrow><h2 className="text-xl font-semibold">{section.title}</h2></div>
          </div>
          <p className="mt-3 max-w-lg text-sm text-muted dark:text-slate-400">{section.intro}</p>
          <div className="mt-6 grid gap-5">
            {section.fields.map((f) => {
              const v = q.answers[f.id] || "";
              const common = { id: `q-${f.id}`, value: v, disabled: !hasTech, onChange: (e) => setAnswer(f.id, e.target.value), className: "field w-full disabled:opacity-60" };
              return (
                <div key={f.id} className="grid gap-1.5">
                  <label htmlFor={`q-${f.id}`} className="text-sm font-medium">{f.label}</label>
                  {f.type === "textarea" ? <textarea rows={3} {...common} />
                    : f.type === "select" ? <select {...common}><option value="">Select an option…</option>{f.options.map((o) => <option key={o}>{o}</option>)}</select>
                    : <input {...common} />}
                  {f.help && <p className="text-xs text-muted dark:text-slate-400">{f.help}</p>}
                </div>
              );
            })}
          </div>
          <div className="mt-6 flex justify-between">
            <button type="button" onClick={() => setIdx(Math.max(0, idx - 1))} disabled={idx === 0} className={`${btnSecondary} disabled:opacity-40`}>Back</button>
            <button type="button" onClick={completeAndNext} className={btnPrimary}>{idx < QUESTIONNAIRE.length - 1 ? "Save and continue" : "Finish questionnaire"} <Icon name="arrow" /></button>
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
