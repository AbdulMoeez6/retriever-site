import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../lib/store.jsx";
import { uid } from "../../lib/format.js";
import { FUNDING_STAGES, ORG, ORG_TYPES } from "../../data/pilotData.js";
import Icon, { FileIcon } from "../../components/Icon.jsx";
import { PageHeader, ReviewChip, btnPrimary, btnSecondary } from "../../components/ui.jsx";
import TechSwitcher from "../../components/TechSwitcher.jsx";

const STEPS = ["Profile", "Assessment", "Documents", "Analysis"];
const label = "grid gap-1.5 text-sm font-medium";

function Stepper({ step, setStep }) {
  return (
    <ol className="flex flex-wrap items-center gap-2">
      {STEPS.map((s, i) => (
        <li key={s} className="flex items-center gap-2">
          <button type="button" onClick={() => setStep(i)} className="flex items-center gap-2 text-sm">
            <span className={`grid size-6 place-items-center rounded-full border text-xs ${i === step ? "border-navy bg-navy text-white dark:border-slate-200 dark:bg-slate-200 dark:text-navy" : i < step ? "border-navy/40 text-navy dark:text-slate-200" : "border-line text-muted dark:border-slate-600"}`}>{i < step ? <Icon name="check" className="size-3" strokeWidth={2.4} /> : i + 1}</span>
            <span className={i === step ? "font-medium" : "text-muted dark:text-slate-400"}>{s}</span>
          </button>
          {i < STEPS.length - 1 && <span className="hidden h-px w-12 overflow-hidden bg-line sm:block dark:bg-slate-700"><span className="block h-full bg-navy transition-[width] duration-500 dark:bg-slate-300" style={{ width: i < step ? "100%" : "0%" }} /></span>}
        </li>
      ))}
    </ol>
  );
}

function ProfileWizard() {
  const app = useApp();
  const { hasTech, currentTech, techProfiles, patchUi, patchData, toast, docs, questionnairePct, pipeline } = app;
  const navigate = useNavigate();
  const t = hasTech ? currentTech() : null;
  const saved = (t && techProfiles[t.id]) || {};
  const step = app.ui.profileStep || 0;
  const setStep = (v) => patchUi((u) => ({ profileStep: typeof v === "function" ? v(u.profileStep || 0) : v }));
  const [form, setForm] = useState(() => ({
    orgName: saved.orgName || ORG.name, website: saved.website || "", techName: t ? t.name : "",
    orgType: saved.orgType || "startup", fundingStage: saved.fundingStage || FUNDING_STAGES[0], summary: saved.summary || (t ? t.summary : ""),
  }));
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target ? e.target.value : e }));
  const id = t ? t.id : null;
  const techDocs = id ? docs.filter((d) => d.technologyId === id) : [];

  const saveProfile = () => {
    const name = form.techName.trim();
    if (!name) { toast("Add a technology name to continue"); return false; }
    let techId = id;
    if (!techId) {
      techId = uid("t");
      const empty = [null, null, null, null, null, null];
      patchData((d) => ({
        techs: [...d.techs, { id: techId, name, org: form.orgName || ORG.name, owner: app.profile.name, trl: null, mrl: null, irl: null, summary: form.summary || "New technology profile." }],
        history: { ...d.history, [techId]: { TRL: empty, MRL: empty, IRL: empty } },
        techProfiles: { ...d.techProfiles, [techId]: { ...form } },
      }));
      patchUi({ techId, profileStep: 1 });
      toast("Technology Profile created (demo)");
    } else {
      patchData((d) => ({
        techs: d.techs.map((x) => (x.id === techId ? { ...x, name, summary: form.summary || x.summary } : x)),
        techProfiles: { ...d.techProfiles, [techId]: { ...form } },
      }));
      toast("Profile saved (demo)");
    }
    return true;
  };
  const next = () => {
    if (step === 0) { const wasNew = !id; if (!saveProfile()) return; if (wasNew) return; }
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
  };

  return (
    <div className="flex flex-col gap-5">
      <PageHeader title="Technology profile" sub={`Step ${step + 1} of 4 · ${["Tell us about your organization", "Answer the Readiness Questionnaire", "Add supporting documents", "Review what is on record"][step]}`}>
        <TechSwitcher />
      </PageHeader>
      <div className="flex max-w-3xl flex-col gap-5">
      <Stepper step={step} setStep={(i) => (i === 0 || hasTech ? setStep(i) : toast("Save the profile first"))} />

      {step === 0 && (
        <section className="card p-6">
          <h2 className="text-base font-medium">Basic information</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className={label}>Organization name<input value={form.orgName} onChange={set("orgName")} className="field font-normal" /></label>
            <label className={label}>Website<input value={form.website} onChange={set("website")} placeholder="yourcompany.com" className="field font-normal" /></label>
            <label className={`${label} sm:col-span-2`}>Technology name<input value={form.techName} onChange={set("techName")} placeholder="e.g. Compact sensor suite" className="field font-normal" /></label>
          </div>
          <div className="mt-5 text-sm font-medium">Organization type</div>
          <div className="mt-2 grid gap-3 sm:grid-cols-3">
            {ORG_TYPES.map((o) => (
              <button type="button" key={o.id} onClick={() => setForm((f) => ({ ...f, orgType: o.id }))} aria-pressed={form.orgType === o.id}
                className={`rounded-lg border p-3 text-left transition-all duration-200 ${form.orgType === o.id ? "border-navy bg-navy/[.04] shadow-sm dark:border-slate-300 dark:bg-white/10" : "border-line hover:-translate-y-0.5 hover:border-navy/40 dark:border-slate-700"}`}>
                <span className={`grid size-8 place-items-center rounded-md transition-colors ${form.orgType === o.id ? "bg-navy text-white" : "bg-soft text-navy dark:bg-white/10 dark:text-slate-200"}`}><Icon name={o.icon} className="size-4" /></span>
                <div className="mt-2 text-sm font-medium">{o.label}</div>
                <div className="text-xs text-muted dark:text-slate-400">{o.sub}</div>
              </button>
            ))}
          </div>
          <label className={`${label} mt-5`}><span>Funding stage <span className="font-normal text-muted dark:text-slate-400">(optional, you can also set this later in the assessment)</span></span>
            <select value={form.fundingStage} onChange={set("fundingStage")} className="field font-normal">{FUNDING_STAGES.map((f) => <option key={f}>{f}</option>)}</select>
          </label>
          <label className={`${label} mt-4`}>Short description<textarea rows={3} value={form.summary} onChange={set("summary")} className="field font-normal" /></label>
        </section>
      )}

      {step === 1 && (
        <section className="card p-6">
          <h2 className="text-base font-medium">Assessment</h2>
          <p className="mt-1 text-sm text-muted dark:text-slate-400">The Readiness Questionnaire has 12 sections and takes about 15 minutes. Answers save as you go.</p>
          <div className="mt-5 flex items-center justify-between text-sm"><span>Questionnaire progress</span><span className="font-mono text-xs">{questionnairePct(id)}%</span></div>
          <div className="progress mt-2"><span style={{ width: `${questionnairePct(id)}%` }} /></div>
          <div className="mt-5 flex flex-wrap gap-2">
            <button type="button" onClick={() => navigate("/app/readiness-questionnaire")} className={btnPrimary}>Open Readiness Questionnaire</button>
            <button type="button" onClick={() => patchUi({ quickOpen: true })} className={btnSecondary}>Five-question quick check</button>
          </div>
        </section>
      )}

      {step === 2 && (
        <section className="card p-6">
          <h2 className="text-base font-medium">Documents</h2>
          <p className="mt-1 text-sm text-muted dark:text-slate-400">Only human-reviewed documents count toward readiness.</p>
          <ul className="mt-4 grid gap-2">
            {techDocs.length ? techDocs.map((d) => (
              <li key={d.id}><button type="button" onClick={() => patchUi({ drawer: { type: "doc", id: d.id } })} className="flex w-full items-center gap-3 rounded-lg border border-line px-3 py-2 text-left hover:border-navy/40 dark:border-slate-700">
                <span className="text-navy dark:text-slate-200"><FileIcon type={d.type} /></span><span className="flex-1 text-sm">{d.name}</span><ReviewChip reviewed={d.reviewed} />
              </button></li>
            )) : <li className="text-sm text-muted dark:text-slate-400">No documents yet.</li>}
          </ul>
          <div className="mt-5 flex flex-wrap gap-2">
            <button type="button" onClick={() => patchUi({ modal: "upload" })} className={btnPrimary}><Icon name="upload" /> Add document</button>
            <button type="button" onClick={() => navigate("/app/knowledge-base")} className={btnSecondary}>Open Knowledge Base</button>
          </div>
        </section>
      )}

      {step === 3 && t && (
        <section className="card p-6">
          <h2 className="text-base font-medium">Analysis</h2>
          <p className="mt-1 text-sm text-muted dark:text-slate-400">A summary of what is on record for {t.name}. Your team makes the call.</p>
          <dl className="mt-5 grid gap-3 sm:grid-cols-4">
            {[["TRL", t.trl ?? "—"], ["MRL", t.mrl ?? "—"], ["IRL", t.irl ?? "—"], ["Opportunities", pipeline.filter((o) => o.techId === t.id).length]].map(([k, v]) => (
              <div key={k} className="rounded-lg border border-line p-3 dark:border-slate-700"><dt className="text-xs text-muted dark:text-slate-400">{k}</dt><dd className="mt-1 text-xl font-semibold">{v}</dd></div>
            ))}
          </dl>
          <div className="mt-5 flex flex-wrap gap-2">
            <button type="button" onClick={() => navigate("/app/mission-command")} className={btnPrimary}>Open Mission Command</button>
            <button type="button" onClick={() => navigate("/app/commercialization")} className={btnSecondary}>View Commercialization Trail</button>
          </div>
        </section>
      )}

      <div className="flex justify-between">
        <button type="button" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0} className={`${btnSecondary} disabled:opacity-40`}>Back</button>
        {step < STEPS.length - 1
          ? <button type="button" onClick={next} className={btnPrimary}>{step === 0 ? (hasTech ? "Save and continue" : "Create and continue") : "Continue"} <Icon name="arrow" /></button>
          : <button type="button" onClick={() => navigate("/app/mission-command")} className={btnPrimary}>Finish</button>}
      </div>
      </div>
    </div>
  );
}

export default function TechnologyProfile() {
  const { ui } = useApp();
  return <ProfileWizard key={ui.techId} />;
}
