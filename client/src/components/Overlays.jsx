import { pageUrl } from "../lib/env.js";
import { useNavigate } from "react-router-dom";
import { useApp } from "../lib/store.jsx";
import { fitFromScore, uid } from "../lib/format.js";
import Icon, { FileIcon } from "./Icon.jsx";
import { Avatar, ReviewChip, StatusChip, formatMoney } from "./ui.jsx";
import { PIPELINE_STAGES } from "../data/pilotData.js";

const CloseX = ({ onClick }) => (
  <button type="button" onClick={onClick} className="grid size-8 shrink-0 place-items-center rounded-md hover:bg-soft dark:hover:bg-white/10" aria-label="Close"><Icon name="x" /></button>
);

/** Side drawer for gaps, document preview and funding detail. */
export function Drawer() {
  const app = useApp();
  const { ui, patchUi, opportunities, docs, funding, gapsFor, techName } = app;
  const navigate = useNavigate();
  const d = ui.drawer;
  if (!d) return null;
  const close = () => patchUi({ drawer: null });
  const openReadiness = (tech) => { patchUi({ techId: tech, drawer: null, profileFocus: null }); navigate("/app/readiness"); };
  let body = null;

  if (d.type === "gaps") {
    const o = opportunities.find((x) => x.id === d.id); if (!o) return null;
    const gaps = gapsFor(o.id);
    body = (
      <>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xs text-muted dark:text-slate-400">Opportunity gaps</div>
            <h2 id="drawer-title" className="mt-1 text-lg font-semibold">{o.title}</h2>
            <p className="mt-1 text-sm text-muted dark:text-slate-400">{techName(o.technologyId)} · {o.program}</p>
          </div>
          <CloseX onClick={close} />
        </div>
        <p className="mt-4 text-sm">{o.note}</p>
        <ul className="mt-5 grid gap-2">
          {gaps.length ? gaps.map((g) => (
            <li key={g.id} className="card p-3"><div className="flex items-start justify-between gap-2"><span className="text-sm">{g.text}</span><StatusChip status={g.severity} /></div></li>
          )) : <li className="text-sm text-muted">No gaps on this opportunity.</li>}
        </ul>
        <div className="mt-8 flex flex-col gap-2">
          <button type="button" onClick={() => openReadiness(o.technologyId)} className="inline-flex h-10 items-center justify-center rounded-lg bg-navy px-4 text-sm font-medium text-white">Open IRL</button>
          <button type="button" onClick={() => openReadiness(o.technologyId)} className="h-10 rounded-lg border border-line text-sm dark:border-slate-700">Open Readiness</button>
          <button type="button" onClick={close} className="h-10 rounded-lg border border-line text-sm dark:border-slate-700">Close</button>
        </div>
      </>
    );
  } else if (d.type === "doc") {
    const doc = docs.find((x) => x.id === d.id); if (!doc) return null;
    body = (
      <>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="text-navy dark:text-slate-200"><FileIcon type={doc.type} /></span>
            <div>
              <h2 id="drawer-title" className="text-lg font-semibold">{doc.name}</h2>
              <p className="mt-1 text-sm text-muted dark:text-slate-400">{techName(doc.technologyId)}</p>
            </div>
          </div>
          <CloseX onClick={close} />
        </div>
        <div className="mt-4"><ReviewChip reviewed={doc.reviewed} /></div>
        <dl className="mt-5 grid gap-3 text-sm">
          <div><dt className="text-muted dark:text-slate-400">Reviewer</dt><dd className="mt-1 flex items-center gap-2">{doc.reviewer ? <><Avatar name={doc.reviewer} size={24} /> {doc.reviewer}</> : "Awaiting review"}</dd></div>
          <div><dt className="text-muted dark:text-slate-400">Uploaded</dt><dd className="mt-1 font-mono text-xs">{doc.uploaded}</dd></div>
        </dl>
        <div className="card mt-5 p-4 text-sm">{doc.excerpt}</div>
        <p className="mt-3 text-xs text-muted dark:text-slate-400">{doc.reviewed ? "This document is human-reviewed and counts toward readiness." : "This document does not count toward readiness until it is human-reviewed."}</p>
        <button type="button" onClick={close} className="mt-8 h-10 w-full rounded-lg border border-line text-sm dark:border-slate-700">Close</button>
      </>
    );
  } else if (d.type === "pipeline") {
    const o = app.pipeline.find((x) => x.id === d.id); if (!o) return null;
    const setStage = (stage) => { app.patchData((dd) => ({ pipeline: dd.pipeline.map((x) => (x.id === o.id ? { ...x, stage } : x)) })); app.toast(`Moved to ${stage}`); };
    body = (
      <>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xs text-muted dark:text-slate-400">Opportunity · {o.stage}</div>
            <h2 id="drawer-title" className="mt-1 text-lg font-semibold">{o.title}</h2>
            <p className="mt-1 text-sm text-muted dark:text-slate-400">{o.agency} · {o.program}</p>
          </div>
          <CloseX onClick={close} />
        </div>
        <div className="mt-4"><StatusChip status={o.fit} /></div>
        <dl className="mt-5 grid gap-3 text-sm">
          <div><dt className="text-muted dark:text-slate-400">Technology</dt><dd className="font-medium">{techName(o.techId)}</dd></div>
          <div><dt className="text-muted dark:text-slate-400">Award size (sample)</dt><dd className="font-mono text-xs">{formatMoney(o.amount)}</dd></div>
          <div><dt className="text-muted dark:text-slate-400">Date</dt><dd className="font-mono text-xs">{o.date}</dd></div>
        </dl>
        <label className="mt-5 grid gap-1 text-sm">Stage
          <select value={o.stage} onChange={(e) => setStage(e.target.value)} className="field">{PIPELINE_STAGES.map((st) => <option key={st}>{st}</option>)}</select>
        </label>
        <div className="mt-8 flex flex-col gap-2">
          <button type="button" onClick={() => { patchUi({ drawer: null, proposalFor: o.id, techId: o.techId }); navigate("/app/proposal-assistant"); }} className="h-10 rounded-lg bg-navy text-sm font-medium text-white">Draft in Proposal Assistant</button>
          <button type="button" onClick={() => { patchUi({ drawer: null, techId: o.techId }); navigate("/app/readiness-gaps"); }} className="h-10 rounded-lg border border-line text-sm dark:border-slate-700">Review readiness gaps</button>
          <button type="button" onClick={close} className="h-10 rounded-lg border border-line text-sm dark:border-slate-700">Close</button>
        </div>
      </>
    );
  } else if (d.type === "funding") {
    const f = funding.find((x) => x.id === d.id); if (!f) return null;
    body = (
      <>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xs text-muted dark:text-slate-400">Funding match</div>
            <h2 id="drawer-title" className="mt-1 text-lg font-semibold">{f.opportunity}</h2>
            <p className="mt-1 text-sm text-muted dark:text-slate-400">{f.agency}</p>
          </div>
          <CloseX onClick={close} />
        </div>
        <div className="mt-4 flex flex-wrap gap-2"><StatusChip status={fitFromScore(f.score)} /> <StatusChip status={f.status} /></div>
        <dl className="mt-5 grid gap-3 text-sm">
          <div><dt className="text-muted dark:text-slate-400">Technology</dt><dd className="font-medium">{techName(f.technologyId)}</dd></div>
          <div><dt className="text-muted dark:text-slate-400">Agency type</dt><dd className="font-medium">{f.agencyType}</dd></div>
          <div><dt className="text-muted dark:text-slate-400">Deadline</dt><dd className="font-mono text-xs">{f.deadline}</dd></div>
          <div><dt className="text-muted dark:text-slate-400">Match score</dt><dd className="font-mono text-xs">{f.score} · {fitFromScore(f.score)} (sample)</dd></div>
          <div><dt className="text-muted dark:text-slate-400">Gaps</dt><dd>{f.gaps}</dd></div>
        </dl>
        <p className="mt-4 text-sm">{f.note}</p>
        <div className="mt-8 flex flex-col gap-2">
          <button type="button" onClick={() => patchUi({ drawer: { type: "gaps", id: f.opportunityId }, selectedOpp: f.opportunityId })} className="h-10 rounded-lg bg-navy text-sm font-medium text-white">Review gaps</button>
          <button type="button" onClick={close} className="h-10 rounded-lg border border-line text-sm dark:border-slate-700">Close</button>
        </div>
      </>
    );
  }
  return (
    <>
      <div className="drawer-backdrop" onClick={close} />
      <aside className="drawer p-6" role="dialog" aria-modal="true" aria-labelledby="drawer-title">{body}</aside>
    </>
  );
}

function ModalShell({ title, onClose, onSubmit, children, footer, sub }) {
  const Tag = onSubmit ? "form" : "div";
  return (
    <>
      <div className="modal-backdrop" onClick={onClose} />
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <Tag className="modal-panel p-6" onSubmit={onSubmit}>
          <div className="flex items-start justify-between">
            <div>
              <h2 id="modal-title" className="text-lg font-semibold">{title}</h2>
              {sub && <p className="mt-1 text-sm text-muted dark:text-slate-400">{sub}</p>}
            </div>
            <CloseX onClick={onClose} />
          </div>
          {children}
          <div className="mt-6 flex justify-end gap-2">{footer}</div>
        </Tag>
      </div>
    </>
  );
}

const Field = ({ label, children }) => <label className="grid gap-1 text-sm">{label}{children}</label>;
const Cancel = ({ onClick }) => <button type="button" onClick={onClick} className="rounded-lg border border-line px-4 py-2 text-sm dark:border-slate-700">Cancel</button>;
const Submit = ({ children }) => <button type="submit" className="rounded-lg bg-navy px-4 py-2 text-sm font-medium text-white hover:bg-navy-700">{children}</button>;

/** Add action / New profile / Upload document / Share roadmap modals. */
export function Modals() {
  const { ui, patchUi, patchData, techs, toast } = useApp();
  const navigate = useNavigate();
  const close = () => patchUi({ modal: null });
  if (!ui.modal) return null;

  if (ui.modal === "action") {
    const submit = (e) => {
      e.preventDefault();
      const f = new FormData(e.currentTarget);
      patchData((d) => ({ actions: [{ id: uid("p"), title: String(f.get("title")).trim(), technologyId: String(f.get("technologyId") || ui.techId), owner: String(f.get("owner")).trim(), due: String(f.get("due") || "TBC") || "TBC", status: "Open" }, ...d.actions] }));
      close(); toast("Action added (demo)");
    };
    return (
      <ModalShell title="Add action" onClose={close} onSubmit={submit} footer={<><Cancel onClick={close} /><Submit>Add action</Submit></>}>
        <div className="mt-5 grid gap-3">
          <Field label="Action"><input name="title" required className="field" /></Field>
          <Field label="Technology"><select name="technologyId" defaultValue={ui.techId} className="field">{techs.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select></Field>
          <Field label="Owner"><input name="owner" required className="field" /></Field>
          <Field label="Due"><input name="due" placeholder="10 Dec 2026" className="field" /></Field>
        </div>
      </ModalShell>
    );
  }
  if (ui.modal === "profile") {
    const submit = (e) => {
      e.preventDefault();
      const f = new FormData(e.currentTarget);
      const id = uid("t");
      const empty = [null, null, null, null, null, null];
      patchData((d) => ({
        techs: [...d.techs, { id, name: String(f.get("name")).trim(), org: String(f.get("org")).trim(), owner: String(f.get("owner")).trim(), trl: null, mrl: null, irl: null, summary: "Newly added sample profile." }],
        history: { ...d.history, [id]: { TRL: empty, MRL: empty, IRL: empty } },
      }));
      patchUi({ modal: null, techId: id }); toast("Profile added (demo)");
    };
    return (
      <ModalShell title="New technology profile" onClose={close} onSubmit={submit} footer={<><Cancel onClick={close} /><Submit>Add profile</Submit></>}>
        <div className="mt-5 grid gap-3">
          <Field label="Technology"><input name="name" required className="field" /></Field>
          <Field label="Organization"><input name="org" required className="field" /></Field>
          <Field label="Owner"><input name="owner" required className="field" /></Field>
        </div>
      </ModalShell>
    );
  }
  if (ui.modal === "readiness") {
    return (
      <ModalShell title="Readiness — TRL · MRL · IRL" onClose={close}
        footer={<button type="button" onClick={close} className="w-full rounded-lg border border-line px-4 py-2 text-sm dark:border-slate-700">Close</button>}>
        <p className="mt-2 text-sm text-muted dark:text-slate-400">Evidence-based readiness is assessed for a technology. Create your Technology Profile first. You don't need to finish the questionnaire to start adding evidence here.</p>
        <button type="button" onClick={() => { close(); navigate("/app/technology-profile"); }} className="mt-4 rounded-lg bg-navy px-4 py-2 text-sm font-medium text-white hover:bg-navy-700">Create Technology Profile</button>
      </ModalShell>
    );
  }
  if (ui.modal === "upload") {
    const submit = (e) => {
      e.preventDefault();
      const f = new FormData(e.currentTarget);
      patchData((d) => ({
        docs: [{ id: uid("d"), name: String(f.get("name")).trim(), type: "doc", technologyId: String(f.get("technologyId") || ui.techId), reviewed: false, reviewer: "", uploaded: "19 Nov 2026", excerpt: "Added in this sample workspace. It does not count toward readiness until it is human-reviewed." }, ...d.docs],
        usage: { ...d.usage, documentsUsed: d.usage.documentsUsed + 1 },
      }));
      close(); toast("Document added (demo). It does not count until it is human-reviewed.");
    };
    return (
      <ModalShell title="Upload document" sub="Added to this sample workspace only. It will not count toward readiness until it is human-reviewed." onClose={close} onSubmit={submit} footer={<><Cancel onClick={close} /><Submit>Add document</Submit></>}>
        <div className="mt-5 grid gap-3">
          <Field label="Document name"><input name="name" required className="field" /></Field>
          <Field label="Technology"><select name="technologyId" defaultValue={ui.techId} className="field">{techs.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select></Field>
        </div>
      </ModalShell>
    );
  }
  if (ui.modal === "share") {
    const link = import.meta.env.VITE_HASH_ROUTER === "1"
      ? `${/^(file|https?):/.test(pageUrl()) ? pageUrl() : ""}#/shared-roadmap`
      : `${pageUrl().replace(/^(https?:\/\/[^/]+).*$/, "$1")}/shared-roadmap`;
    const copy = () => { try { navigator.clipboard?.writeText(link)?.catch(() => {}); } catch { /* clipboard blocked */ } toast("Link copied (demo)"); };
    return (
      <ModalShell title="Share roadmap" sub="Anyone with this sample link can open a read-only view. Nothing is sent." onClose={close}
        footer={<>
          <button type="button" onClick={copy} className="inline-flex items-center gap-2 rounded-lg border border-line px-4 py-2 text-sm dark:border-slate-700"><Icon name="copy" /> Copy link</button>
          <button type="button" onClick={() => { close(); navigate("/shared-roadmap"); }} className="rounded-lg bg-navy px-4 py-2 text-sm font-medium text-white">Open shared view</button>
        </>}>
        <label className="mt-5 grid gap-1 text-sm">Sample link
          <input readOnly value={link} className="field font-mono text-xs" />
        </label>
      </ModalShell>
    );
  }
  return null;
}
