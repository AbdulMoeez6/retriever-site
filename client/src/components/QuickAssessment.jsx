import { useState } from "react";
import { Link } from "react-router-dom";
import { QUICK_QUESTIONS } from "../data/sampleData.js";
import { useApp } from "../lib/store.jsx";
import Icon from "./Icon.jsx";

/** Five-question quick assessment modal (sample walkthrough). */
export default function QuickAssessment() {
  const { ui, patchUi, toast } = useApp();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  if (!ui.quickOpen) return null;
  const close = () => { patchUi({ quickOpen: false }); setStep(0); setAnswers({}); };
  const total = QUICK_QUESTIONS.length;
  const done = step >= total;
  const q = QUICK_QUESTIONS[step];
  const chosen = q ? answers[q.id] || "" : "";
  const progress = (Math.min(step, total) / total) * 100;

  return (
    <>
      <div className="modal-backdrop" onClick={close} />
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="quick-title">
        <div className="modal-panel p-6">
          <div className="flex items-start justify-between">
            <div className="text-sm font-medium">Five-question quick assessment</div>
            <button type="button" onClick={close} className="grid size-8 place-items-center rounded-md hover:bg-soft dark:hover:bg-white/10" aria-label="Close"><Icon name="x" /></button>
          </div>
          <div className="mt-4">
            {!done ? (
              <div key={step} style={{ animation: "pop .25s ease-out" }}>
                <p className="text-xs font-medium uppercase tracking-wide text-muted dark:text-slate-400">Question {step + 1} of {total}</p>
                <div className="progress mt-3"><span style={{ width: `${progress}%` }} /></div>
                <h2 id="quick-title" className="mt-4 text-xl font-semibold">{q.text}</h2>
                <div className="mt-6 flex flex-wrap gap-2">
                  {["Yes", "No", "Not sure"].map((a) => (
                    <button type="button" key={a} onClick={() => setAnswers((s) => ({ ...s, [q.id]: a }))}
                      className={`rounded-lg px-4 py-2 text-sm transition-colors ${chosen === a ? "bg-navy text-white" : "border border-line hover:border-navy/40 dark:border-slate-700"}`}>{a}</button>
                  ))}
                </div>
                <div className="mt-8 flex justify-between">
                  <button type="button" disabled={step === 0} onClick={() => setStep((s) => Math.max(0, s - 1))} className="inline-flex items-center gap-1 rounded-lg border border-line px-4 py-2 text-sm disabled:opacity-50 dark:border-slate-700"><Icon name="back" /> Back</button>
                  <button type="button" onClick={() => (chosen ? setStep((s) => s + 1) : toast("Choose an answer to continue"))} className={`rounded-lg bg-navy px-4 py-2 text-sm font-medium text-white ${chosen ? "" : "opacity-50"}`}>Next</button>
                </div>
              </div>
            ) : (
              <div style={{ animation: "pop .25s ease-out" }}>
                <h2 id="quick-title" className="text-xl font-semibold">Quick assessment</h2>
                <div className="progress mt-3"><span style={{ width: "100%" }} /></div>
                <p className="mt-3 text-sm text-muted dark:text-slate-400">This is a sample walkthrough only. A full readiness assessment uses TRL, MRL and IRL, and only human-reviewed evidence counts.</p>
                <div className="mt-4">
                  {QUICK_QUESTIONS.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-4 border-b border-line py-2 text-sm last:border-0 dark:border-slate-800">
                      <span>{item.text}</span><span className="font-medium">{answers[item.id] || "—"}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex flex-wrap justify-end gap-2">
                  <button type="button" onClick={() => { setStep(0); setAnswers({}); }} className="rounded-lg border border-line px-4 py-2 text-sm dark:border-slate-700">Start again</button>
                  <Link to="/book-demo" onClick={close} className="rounded-lg bg-navy px-4 py-2 text-sm font-medium text-white">Book a demo</Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
