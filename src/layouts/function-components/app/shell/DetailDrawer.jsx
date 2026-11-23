import { FileTypeIcon } from "@/layouts/function-components/app/ui/Icon";
import {
  Avatar,
  CloseButton,
  ReviewChip,
  StatusChip,
} from "@/layouts/function-components/app/ui/primitives";
import { fitLabel } from "@/lib/format";
import { useNavigate } from "@/lib/navigation";
import { useStore } from "@/lib/store";

export function DetailDrawer() {
  const A = useStore(),
    { ui, patchUi, opportunities, docs, funding, gapsFor, techName } = A,
    o = useNavigate(),
    u = ui.drawer;
  if (!u) return null;
  const p = () =>
      patchUi({
        drawer: null,
      }),
    f = (g) => {
      (patchUi({
        techId: g,
        drawer: null,
        profileFocus: null,
      }),
        o("/app/readiness"));
    };
  let E = null;
  if (u.type === "gaps") {
    const g = opportunities.find((Q) => Q.id === u.id);
    if (!g) return null;
    const x = gapsFor(g.id);
    E = (
      <>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xs text-muted dark:text-slate-400">
              Opportunity gaps
            </div>
            <h2 id="drawer-title" className="mt-1 text-lg font-semibold">
              {g.title}
            </h2>
            <p className="mt-1 text-sm text-muted dark:text-slate-400">
              {techName(g.technologyId)}
              {" · "}
              {g.program}
            </p>
          </div>
          <CloseButton onClick={p} />
        </div>
        <p className="mt-4 text-sm">{g.note}</p>
        <ul className="mt-5 grid gap-2">
          {x.length ? (
            x.map((Q) => (
              <li key={Q.id} className="card p-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-sm">{Q.text}</span>
                  <StatusChip status={Q.severity} />
                </div>
              </li>
            ))
          ) : (
            <li className="text-sm text-muted">No gaps on this opportunity.</li>
          )}
        </ul>
        <div className="mt-8 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => f(g.technologyId)}
            className="inline-flex h-10 items-center justify-center rounded-lg bg-navy px-4 text-sm font-medium text-white"
          >
            Open IRL
          </button>
          <button
            type="button"
            onClick={() => f(g.technologyId)}
            className="h-10 rounded-lg border border-line text-sm dark:border-slate-700"
          >
            Open Readiness
          </button>
          <button
            type="button"
            onClick={p}
            className="h-10 rounded-lg border border-line text-sm dark:border-slate-700"
          >
            Close
          </button>
        </div>
      </>
    );
  } else if (u.type === "doc") {
    const g = docs.find((x) => x.id === u.id);
    if (!g) return null;
    E = (
      <>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="text-navy dark:text-slate-200">
              <FileTypeIcon type={g.type} />
            </span>
            <div>
              <h2 id="drawer-title" className="text-lg font-semibold">
                {g.name}
              </h2>
              <p className="mt-1 text-sm text-muted dark:text-slate-400">
                {techName(g.technologyId)}
              </p>
            </div>
          </div>
          <CloseButton onClick={p} />
        </div>
        <div className="mt-4">
          <ReviewChip reviewed={g.reviewed} />
        </div>
        <dl className="mt-5 grid gap-3 text-sm">
          <div>
            <dt className="text-muted dark:text-slate-400">Reviewer</dt>
            <dd className="mt-1 flex items-center gap-2">
              {g.reviewer ? (
                <>
                  <Avatar name={g.reviewer} size={24} /> {g.reviewer}
                </>
              ) : (
                "Awaiting review"
              )}
            </dd>
          </div>
          <div>
            <dt className="text-muted dark:text-slate-400">Uploaded</dt>
            <dd className="mt-1 font-mono text-xs">{g.uploaded}</dd>
          </div>
        </dl>
        <div className="card mt-5 p-4 text-sm">{g.excerpt}</div>
        <p className="mt-3 text-xs text-muted dark:text-slate-400">
          {g.reviewed
            ? "This document is human-reviewed and counts toward readiness."
            : "This document does not count toward readiness until it is human-reviewed."}
        </p>
        <button
          type="button"
          onClick={p}
          className="mt-8 h-10 w-full rounded-lg border border-line text-sm dark:border-slate-700"
        >
          Close
        </button>
      </>
    );
  } else if (u.type === "funding") {
    const g = funding.find((x) => x.id === u.id);
    if (!g) return null;
    E = (
      <>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xs text-muted dark:text-slate-400">
              Funding match
            </div>
            <h2 id="drawer-title" className="mt-1 text-lg font-semibold">
              {g.opportunity}
            </h2>
            <p className="mt-1 text-sm text-muted dark:text-slate-400">
              {g.agency}
            </p>
          </div>
          <CloseButton onClick={p} />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <StatusChip status={fitLabel(g.score)} />{" "}
          <StatusChip status={g.status} />
        </div>
        <dl className="mt-5 grid gap-3 text-sm">
          <div>
            <dt className="text-muted dark:text-slate-400">Technology</dt>
            <dd className="font-medium">{techName(g.technologyId)}</dd>
          </div>
          <div>
            <dt className="text-muted dark:text-slate-400">Agency type</dt>
            <dd className="font-medium">{g.agencyType}</dd>
          </div>
          <div>
            <dt className="text-muted dark:text-slate-400">Deadline</dt>
            <dd className="font-mono text-xs">{g.deadline}</dd>
          </div>
          <div>
            <dt className="text-muted dark:text-slate-400">Match score</dt>
            <dd className="font-mono text-xs">
              {g.score}
              {" · "}
              {fitLabel(g.score)}
              {" (sample)"}
            </dd>
          </div>
          <div>
            <dt className="text-muted dark:text-slate-400">Gaps</dt>
            <dd>{g.gaps}</dd>
          </div>
        </dl>
        <p className="mt-4 text-sm">{g.note}</p>
        <div className="mt-8 flex flex-col gap-2">
          <button
            type="button"
            onClick={() =>
              patchUi({
                drawer: {
                  type: "gaps",
                  id: g.opportunityId,
                },
                selectedOpp: g.opportunityId,
              })
            }
            className="h-10 rounded-lg bg-navy text-sm font-medium text-white"
          >
            Review gaps
          </button>
          <button
            type="button"
            onClick={p}
            className="h-10 rounded-lg border border-line text-sm dark:border-slate-700"
          >
            Close
          </button>
        </div>
      </>
    );
  }
  return (
    <>
      <div className="drawer-backdrop" onClick={p} />
      <aside
        className="drawer p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
      >
        {E}
      </aside>
    </>
  );
}
