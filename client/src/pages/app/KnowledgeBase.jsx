import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../lib/store.jsx";
import { uid } from "../../lib/format.js";
import Icon, { FileIcon } from "../../components/Icon.jsx";
import { Avatar, ReviewChip, StatusChip, Tabs, btnSecondary, formatMoney } from "../../components/ui.jsx";

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
    <div className="flex max-w-4xl flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs tabs={["Documents", "Opportunity records"]} value={ui.kbTab} onChange={(v) => patchUi({ kbTab: v })} />
        {hasTech && <span className="text-xs text-muted dark:text-slate-400">{techDocs.length} documents · {records.length} records · {gapCount} readiness gaps</span>}
      </div>

      {ui.kbTab === "Documents" ? (
        <>
          <section className="card p-6">
            <h2 className="text-lg font-semibold">Give your score something to stand on</h2>
            <p className="mt-1 text-sm text-muted dark:text-slate-400">Optional, but every document you add sharpens your score and your funding match.</p>
            <div className="mt-4 rounded-lg border border-amber-300/70 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
              <div className="flex items-center gap-2 font-semibold"><Icon name="shield" /> Controlled pilot, read before uploading</div>
              <ul className="mt-2 list-disc space-y-1 pl-9">{NOTICE.map((n) => <li key={n}>{n}</li>)}</ul>
            </div>
            <div onDragOver={(e) => { e.preventDefault(); setOver(true); }} onDragLeave={() => setOver(false)}
              onDrop={(e) => { e.preventDefault(); setOver(false); addFiles(e.dataTransfer?.files); }}
              className={`mt-5 grid place-items-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors ${over ? "border-[#2F5BD3] bg-[#EEF2FC] dark:bg-white/5" : "border-line dark:border-slate-700"}`}>
              <Icon name="upload" className="size-7 text-[#2F5BD3]" />
              <div className="mt-3 font-medium">Drag and drop files here</div>
              <div className="mt-1 text-xs text-muted dark:text-slate-400">PDF, DOCX, or PPTX, up to 25MB each</div>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <button type="button" onClick={browse} className={btnSecondary}>Browse files</button>
                <button type="button" onClick={() => (hasTech ? patchUi({ modal: "upload" }) : patchUi({ modal: "readiness" }))} className={btnSecondary}>Add by name</button>
              </div>
              <input ref={inputRef} type="file" accept=".pdf,.docx,.pptx" multiple hidden onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }} />
            </div>
          </section>
          <section className="card overflow-hidden">
            <div className="border-b border-line px-4 py-3 text-sm font-semibold dark:border-slate-800">Documents{hasTech ? ` · ${techName(ui.techId)}` : ""}</div>
            {techDocs.length ? techDocs.map((d) => (
              <button type="button" key={d.id} onClick={() => patchUi({ drawer: { type: "doc", id: d.id } })}
                className="row-hover grid w-full grid-cols-[auto_1fr_auto] items-center gap-3 border-b border-line px-4 py-3 text-left last:border-0 dark:border-slate-800 sm:grid-cols-[auto_1fr_auto_auto]">
                <span className="text-navy dark:text-slate-200"><FileIcon type={d.type} /></span>
                <span className="truncate text-sm font-medium">{d.name}</span>
                <span className="hidden items-center gap-2 text-xs text-muted sm:flex dark:text-slate-400">{d.reviewer && <Avatar name={d.reviewer} size={22} />}{d.reviewer || "Awaiting review"}</span>
                <ReviewChip reviewed={d.reviewed} />
              </button>
            )) : <div className="px-4 py-8 text-center text-sm text-muted dark:text-slate-400">No documents yet.</div>}
          </section>
        </>
      ) : (
        <section className="card overflow-hidden">
          <div className="border-b border-line px-4 py-3 text-sm font-semibold dark:border-slate-800">Opportunity records</div>
          {records.length ? records.map((o) => (
            <button type="button" key={o.id} onClick={() => patchUi({ drawer: { type: "pipeline", id: o.id } })}
              className="row-hover flex w-full flex-wrap items-center gap-3 border-b border-line px-4 py-3 text-left last:border-0 dark:border-slate-800">
              <span className="min-w-0 flex-1"><span className="block text-sm font-medium">{o.title}</span><span className="block text-xs text-muted dark:text-slate-400">{o.agency} · {o.program} · {o.date}</span></span>
              <span className="font-mono text-xs">{formatMoney(o.amount)}</span>
              <StatusChip status={o.stage} />
            </button>
          )) : <div className="px-4 py-8 text-center text-sm text-muted dark:text-slate-400">No opportunity records yet. <button type="button" onClick={() => navigate("/app/opportunities")} className="underline underline-offset-2">Open Opportunities</button></div>}
        </section>
      )}
    </div>
  );
}
