import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../lib/store.jsx";
import { uid } from "../../lib/format.js";
import Icon, { FileIcon } from "../../components/Icon.jsx";
import { Avatar, PageHeader, ReviewChip, StatusChip, Tabs, btnSecondary, formatMoney } from "../../components/ui.jsx";
import TechSwitcher from "../../components/TechSwitcher.jsx";
import { DataTable, useViewMode } from "../../components/ViewControls.jsx";

const NOTICE = [
  "Do not use Retriever for classified information.",
  "Do not upload CUI, export-controlled or other restricted information unless your organization has specifically approved this environment for that data.",
  "Retriever does not currently claim any government compliance authorization.",
];
const ACCEPT = /\.(pdf|docx|pptx)$/i;
const typeOf = (name) => (/\.pdf$/i.test(name) ? "pdf" : "doc");

export default function KnowledgeBase() {
  const { hasTech, ui, docs, pipeline, gapsFor, opportunities, patchUi, patchData, toast, techName } = useApp();
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [over, setOver] = useState(false);
  const techDocs = hasTech ? docs.filter((d) => d.technologyId === ui.techId) : [];
  const records = hasTech ? pipeline.filter((o) => o.techId === ui.techId) : [];
  const gapCount = hasTech ? opportunities.filter((o) => o.technologyId === ui.techId).reduce((n, o) => n + gapsFor(o.id).length, 0) : 0;

  const [docMode, docToggle] = useViewMode("kb.documents", ["table", "cards"]);
  const [recMode, recToggle] = useViewMode("kb.records", ["table", "cards"]);
  const openDoc = (id) => patchUi({ drawer: { type: "doc", id } });
  const openRec = (id) => patchUi({ drawer: { type: "pipeline", id } });
  const addFiles = (list) => {
    if (!hasTech) { patchUi({ modal: "readiness" }); return; }
    const files = Array.from(list || []);
    const ok = files.filter((f) => ACCEPT.test(f.name) && f.size <= 25 * 1024 * 1024);
    if (!ok.length) { toast("Use PDF, DOCX or PPTX files up to 25MB"); return; }
    patchData((d) => ({
      docs: [...ok.map((f) => ({ id: uid("d"), name: f.name, type: typeOf(f.name), technologyId: ui.techId, reviewed: false, reviewer: "", uploaded: "20 Nov 2026", excerpt: "Added in this sample workspace. The file stays in your browser and does not count toward readiness until it is human-reviewed." })), ...d.docs],
      usage: { ...d.usage, documentsUsed: d.usage.documentsUsed + ok.length },
    }));
    toast(`${ok.length} document${ok.length === 1 ? "" : "s"} added (demo). Awaiting human review.`);
  };
  const browse = () => { try { inputRef.current?.click(); } catch { patchUi({ modal: "upload" }); } };

  return (
    <div className="flex flex-col gap-5">
      <PageHeader title="Knowledge Base" sub={hasTech ? `Documents, opportunity records, readiness gaps and action plans · ${techDocs.length} documents · ${records.length} records · ${gapCount} readiness gaps` : "Documents, opportunity records, readiness gaps and action plans."}>
        <TechSwitcher />
        <Tabs tabs={["Documents", "Opportunity records"]} value={ui.kbTab} onChange={(v) => patchUi({ kbTab: v })} />
      </PageHeader>

      {ui.kbTab === "Documents" ? (
        <>
          <section className="card p-6">
            <h2 className="text-base font-medium">Give your score something to stand on</h2>
            <p className="mt-1 text-sm text-muted dark:text-slate-400">Optional, but every document you add sharpens your score and your funding match.</p>
            <div className="mt-4 rounded-lg border border-line bg-soft/70 p-4 text-sm dark:border-slate-700 dark:bg-white/5">
              <div className="flex items-center gap-2 font-medium text-navy dark:text-slate-100"><Icon name="shield" /> Controlled pilot, read before uploading</div>
              <ul className="mt-2 list-disc space-y-1 pl-9 text-muted dark:text-slate-400">{NOTICE.map((n) => <li key={n}>{n}</li>)}</ul>
            </div>
            <div onDragOver={(e) => { e.preventDefault(); setOver(true); }} onDragLeave={() => setOver(false)}
              onDrop={(e) => { e.preventDefault(); setOver(false); addFiles(e.dataTransfer?.files); }}
              className={`group mt-5 grid place-items-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition-all duration-300 ${over ? "scale-[1.01] border-navy/50 bg-navy/[.04] dark:bg-white/5" : "border-line hover:border-navy/30 hover:bg-soft/50 dark:border-slate-700"}`}>
              <span className="grid size-12 place-items-center rounded-full bg-soft text-navy transition-transform duration-300 group-hover:-translate-y-1 dark:bg-white/10 dark:text-slate-200"><Icon name="upload" className="size-5" /></span>
              <div className="mt-3 font-medium">Drag and drop files here</div>
              <div className="mt-1 text-xs text-muted dark:text-slate-400">PDF, DOCX, or PPTX, up to 25MB each</div>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <button type="button" onClick={browse} className={btnSecondary}>Browse files</button>
                <button type="button" onClick={() => (hasTech ? patchUi({ modal: "upload" }) : patchUi({ modal: "readiness" }))} className={btnSecondary}>Add by name</button>
              </div>
              <input ref={inputRef} type="file" accept=".pdf,.docx,.pptx" multiple hidden onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }} />
            </div>
          </section>
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-medium">Documents{hasTech ? ` · ${techDocs.length}` : ""}</h2>
            {docToggle}
          </div>
          {docMode === "cards" ? (
            <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {techDocs.length ? techDocs.map((d) => (
                <li key={d.id}>
                  <button type="button" onClick={() => openDoc(d.id)} className="card card-hover tick-in flex h-full w-full flex-col gap-3 p-4 text-left">
                    <span className="flex items-center gap-2 text-navy dark:text-slate-200"><FileIcon type={d.type} /><span className="truncate text-sm font-medium text-ink dark:text-white">{d.name}</span></span>
                    <span className="mt-auto flex items-center justify-between gap-2 text-xs text-muted dark:text-slate-400"><span className="truncate">{d.reviewer || "Awaiting review"}</span><ReviewChip reviewed={d.reviewed} /></span>
                  </button>
                </li>
              )) : <li className="text-sm text-muted">No documents yet.</li>}
            </ul>
          ) : (
            <DataTable rows={techDocs} onRow={(d) => openDoc(d.id)} empty="No documents yet."
              columns={[
                { label: "Document", cell: (d) => <span className="flex items-center gap-2"><span className="text-navy dark:text-slate-200"><FileIcon type={d.type} /></span><span className="font-medium">{d.name}</span></span> },
                { label: "Reviewer", cell: (d) => <span className="flex items-center gap-2 text-xs text-muted dark:text-slate-400">{d.reviewer && <Avatar name={d.reviewer} size={22} />}{d.reviewer || "Awaiting review"}</span> },
                { label: "Uploaded", cell: (d) => <span className="font-mono text-xs">{d.uploaded || "—"}</span> },
                { label: "Status", cell: (d) => <ReviewChip reviewed={d.reviewed} /> },
              ]} />
          )}
        </>
      ) : (
        <>
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-medium">Opportunity records{hasTech ? ` · ${records.length}` : ""}</h2>
            {recToggle}
          </div>
          {recMode === "cards" ? (
            <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {records.length ? records.map((o) => (
                <li key={o.id}>
                  <button type="button" onClick={() => openRec(o.id)} className="card card-hover tick-in block h-full w-full p-4 text-left">
                    <div className="text-sm font-medium">{o.title}</div>
                    <div className="mt-1 text-xs text-muted dark:text-slate-400">{o.agency}</div>
                    <div className="mt-3 flex items-center justify-between"><span className="font-mono text-xs">{formatMoney(o.amount)}</span><StatusChip status={o.stage} /></div>
                  </button>
                </li>
              )) : <li className="text-sm text-muted">No opportunity records yet. <button type="button" onClick={() => navigate("/app/opportunities")} className="underline underline-offset-2">Open Opportunities</button></li>}
            </ul>
          ) : (
            <DataTable rows={records} onRow={(o) => openRec(o.id)} empty="No opportunity records yet."
              columns={[
                { label: "Opportunity", cell: (o) => <span className="font-medium">{o.title}</span> },
                { label: "Agency", cell: (o) => <span className="text-muted dark:text-slate-400">{o.agency}</span> },
                { label: "Program", cell: (o) => <span className="text-xs text-muted dark:text-slate-400">{o.program}</span> },
                { label: "Amount", cell: (o) => <span className="font-mono text-xs">{formatMoney(o.amount)}</span> },
                { label: "Stage", cell: (o) => <StatusChip status={o.stage} /> },
              ]} />
          )}
        </>
      )}
    </div>
  );
}
