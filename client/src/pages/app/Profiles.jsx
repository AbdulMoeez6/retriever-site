import { useNavigate } from "react-router-dom";
import { useApp } from "../../lib/store.jsx";
import { fitFromScore, lastLevel } from "../../lib/format.js";
import { HistoryChart, Ring } from "../../components/Charts.jsx";
import Icon, { FileIcon } from "../../components/Icon.jsx";
import { Avatar, PageHeader, ReviewChip, StatusChip, btnPrimary } from "../../components/ui.jsx";

function ProfileDetail({ t }) {
  const { history, actions, docs, funding, ui, patchUi } = useApp();
  const navigate = useNavigate();
  const hist = history[t.id] || { TRL: [], MRL: [], IRL: [] };
  const tdocs = docs.filter((d) => d.technologyId === t.id);
  const funds = funding.filter((f) => f.technologyId === t.id);
  const next = actions.filter((a) => a.technologyId === t.id && a.status !== "Done");
  const tab = ui.profileTab;
  let body;
  if (tab === "Overview") {
    body = (
      <>
        <p className="text-sm text-muted dark:text-slate-400">{t.summary}</p>
        <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-3">
          <div><dt className="text-xs text-muted dark:text-slate-400">Organization</dt><dd className="mt-1 font-medium">{t.org}</dd></div>
          <div><dt className="text-xs text-muted dark:text-slate-400">Owner</dt><dd className="mt-1 flex items-center gap-2"><Avatar name={t.owner} size={24} /> {t.owner}</dd></div>
          <div><dt className="text-xs text-muted dark:text-slate-400">Current levels</dt><dd className="mt-1 font-mono text-xs">TRL {t.trl ?? "—"} · MRL {t.mrl ?? "—"} · IRL {t.irl ?? "—"}</dd></div>
        </dl>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-line px-3 py-3 dark:border-slate-800">
            <div className="text-xs text-muted dark:text-slate-400">Readiness</div>
            <div className="mt-2 flex items-center gap-3"><Ring label="TRL" value={t.trl} size={72} /><Ring label="MRL" value={t.mrl} size={72} /><Ring label="IRL" value={t.irl} size={72} /></div>
          </div>
          <button type="button" onClick={() => patchUi({ profileTab: "Evidence" })} className="rounded-lg border border-line px-3 py-3 text-left hover:bg-soft/80 dark:border-slate-800 dark:hover:bg-white/5">
            <div className="text-xs text-muted dark:text-slate-400">Evidence</div>
            <div className="mt-2 text-xl font-semibold tabular-nums">{tdocs.filter((d) => d.reviewed).length} of {tdocs.length}</div>
            <div className="mt-1 text-xs text-muted dark:text-slate-400">Human-reviewed documents</div>
          </button>
          <button type="button" onClick={() => patchUi({ profileTab: "Funding" })} className="rounded-lg border border-line px-3 py-3 text-left hover:bg-soft/80 dark:border-slate-800 dark:hover:bg-white/5">
            <div className="text-xs text-muted dark:text-slate-400">Funding matches</div>
            <div className="mt-2 text-xl font-semibold tabular-nums">{funds.length}</div>
            <div className="mt-1 text-xs text-muted dark:text-slate-400">Open matches to review</div>
          </button>
        </div>
        <div className="mt-6">
          <h3 className="text-sm font-medium">Next actions</h3>
          <ul className="mt-3 grid gap-2">
            {next.length ? next.map((a) => (
              <li key={a.id} className="flex items-center gap-3 rounded-lg border border-line px-3 py-2 dark:border-slate-800"><Avatar name={a.owner} size={24} /><span className="flex-1 truncate text-sm">{a.title}</span><StatusChip status={a.status} /><span className="text-xs text-muted dark:text-slate-400">{a.due}</span></li>
            )) : <li className="text-sm text-muted">No open actions.</li>}
          </ul>
        </div>
      </>
    );
  } else if (tab === "Readiness") {
    body = (
      <>
        <div className="grid justify-items-center gap-4 sm:grid-cols-3"><Ring label="TRL" value={lastLevel(hist.TRL)} size={100} /><Ring label="MRL" value={lastLevel(hist.MRL)} size={100} /><Ring label="IRL" value={lastLevel(hist.IRL)} size={100} /></div>
        <div className="mt-6"><HistoryChart techId={t.id} area height={180} /></div>
        <p className="mt-3 text-xs text-muted dark:text-slate-400">Only human-reviewed evidence counts.</p>
      </>
    );
  } else if (tab === "Evidence") {
    body = (
      <ul className="grid gap-2">
        {tdocs.length ? tdocs.map((d) => (
          <li key={d.id}><button type="button" onClick={() => patchUi({ drawer: { type: "doc", id: d.id } })} className="card card-hover flex w-full items-center gap-3 p-3 text-left"><FileIcon type={d.type} /><span className="flex-1 truncate text-sm font-medium">{d.name}</span>{d.reviewer && <Avatar name={d.reviewer} size={24} />}<ReviewChip reviewed={d.reviewed} /></button></li>
        )) : <li className="text-sm text-muted">No documents on this profile yet.</li>}
      </ul>
    );
  } else {
    body = (
      <ul className="grid gap-2">
        {funds.length ? funds.map((f) => (
          <li key={f.id}><button type="button" onClick={() => patchUi({ drawer: { type: "funding", id: f.id } })} className="card card-hover w-full p-3 text-left"><div className="flex items-center justify-between gap-2"><span className="text-sm font-medium">{f.opportunity}</span><StatusChip status={fitFromScore(f.score)} /></div><div className="mt-1 text-xs text-muted dark:text-slate-400">{f.agency} · {f.deadline}</div></button></li>
        )) : <li className="text-sm text-muted">No funding matches for this technology.</li>}
      </ul>
    );
  }
  return (
    <div className="flex flex-col gap-5" style={{ animation: "page-in .3s ease-out" }}>
      <button type="button" onClick={() => patchUi({ profileFocus: null })} className="inline-flex w-fit items-center gap-1 text-sm text-muted hover:text-ink dark:text-slate-400 dark:hover:text-white"><Icon name="back" /> All profiles</button>
      <section className="card p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <Avatar name={t.owner} size={48} />
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">{t.name}</h1>
              <p className="mt-1 text-sm text-muted dark:text-slate-400">{t.org} · {t.owner}</p>
            </div>
          </div>
          <button type="button" onClick={() => { patchUi({ techId: t.id, profileFocus: null }); navigate("/app/readiness"); }} className={btnPrimary}>Open Readiness</button>
        </div>
        <div className="mt-5 flex gap-1 border-b border-line dark:border-slate-800" role="tablist">
          {["Overview", "Readiness", "Evidence", "Funding"].map((x) => (
            <button type="button" role="tab" aria-selected={tab === x} key={x} onClick={() => patchUi({ profileTab: x })}
              className={`-mb-px border-b-2 px-3 py-2 text-sm transition-colors ${tab === x ? "border-navy font-medium text-ink dark:border-slate-200 dark:text-white" : "border-transparent text-muted hover:text-ink dark:text-slate-400 dark:hover:text-white"}`}>{x}</button>
          ))}
        </div>
        <div key={tab} className="mt-5" style={{ animation: "pop .25s ease-out" }}>{body}</div>
      </section>
    </div>
  );
}

export default function Profiles() {
  const { techs, matchesQuery, ui, patchUi } = useApp();
  const focus = ui.profileFocus && techs.find((x) => x.id === ui.profileFocus);
  if (focus) return <ProfileDetail t={focus} />;
  const list = techs.filter((t) => matchesQuery(t, ["name", "org", "owner"]));
  return (
    <div className="flex flex-col gap-5">
      <PageHeader title="Technology profiles" sub="Profiles in this workspace, with the latest TRL, MRL and IRL on file.">
        <button type="button" onClick={() => patchUi({ modal: "profile" })} className={btnPrimary}><Icon name="plus" /> New profile</button>
      </PageHeader>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {list.length ? list.map((t) => (
          <button type="button" key={t.id} onClick={() => patchUi({ profileFocus: t.id, profileTab: "Overview", techId: t.id })} className="card card-hover p-5 text-left">
            <div className="flex items-start gap-3">
              <Avatar name={t.owner} size={40} />
              <div className="min-w-0">
                <div className="text-sm font-medium">{t.name}</div>
                <div className="text-xs text-muted dark:text-slate-400">{t.org}</div>
                <div className="mt-1 text-xs text-muted dark:text-slate-400">{t.owner}</div>
              </div>
            </div>
            <div className="mt-4 flex gap-3 text-xs text-muted dark:text-slate-400">
              <span>TRL {t.trl ?? "—"}</span><span>MRL {t.mrl ?? "—"}</span><span>IRL {t.irl ?? "—"}</span>
            </div>
          </button>
        )) : <div className="text-sm text-muted">No profiles match this search.</div>}
      </div>
    </div>
  );
}
