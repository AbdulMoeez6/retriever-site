import { Icon } from "@/layouts/function-components/app/ui/Icon";
import {
  HistoryTable,
  KpiTile,
  ReadinessChart,
} from "@/layouts/function-components/app/ui/charts";
import {
  Avatar,
  PageTitle,
  StatusChip,
  TechSelect,
  btnPrimary,
  btnSecondary,
} from "@/layouts/function-components/app/ui/primitives";
import { greetingForNow } from "@/lib/format";
import { Link, useNavigate } from "@/lib/navigation";
import { useStore } from "@/lib/store";

export function MissionCommand() {
  const {
      currentTech,
      kpis,
      history,
      docs,
      techs,
      funding,
      actions,
      notifications,
      profile,
      ui,
      patchUi,
      toast,
    } = useStore(),
    E = useNavigate(),
    g = currentTech(),
    x = kpis(),
    Q = history[g.id] || {
      TRL: [],
    },
    w = [
      ["Create a technology profile", techs.length > 0],
      [
        "Upload a first evidence document",
        docs.some((I) => I.technologyId === g.id),
      ],
      [
        "Run a first readiness assessment",
        (Q.TRL || []).some((I) => I != null),
      ],
      ["Review funding matches", funding.length > 0],
      ["Invite a teammate", false],
    ],
    m = w.filter((I) => I[1]).length,
    c = actions.filter((I) => I.status !== "Done").slice(0, 3),
    d = [
      ["Technologies tracked", x.techs, "In this workspace", "profiles"],
      ["Average TRL", x.avgTrl, "Current levels on file", "readiness"],
      [
        "Assessments completed",
        x.assessments,
        "In this workspace",
        "readiness",
      ],
      ["Funding matches", x.funding, "Open matches to review", "funding"],
    ],
    B = (I) => {
      (I.techId &&
        patchUi({
          techId: I.techId,
        }),
        E(`/app/${I.route}`));
    };
  return (
    <div className="flex flex-col gap-5">
      <PageTitle
        title={`${greetingForNow()}, ${profile.name.split(" ")[0]}`}
        sub={`Thursday, 19 November 2026 · Mission Command for ${g.name}`}
      >
        <TechSelect />
        <button
          type="button"
          onClick={() => toast("Report prepared (demo)")}
          className={btnSecondary}
        >
          <Icon name="download" />
          {" Download report"}
        </button>
        <Link to="/app/readiness" className={btnPrimary}>
          Open Readiness
        </Link>
      </PageTitle>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {d.map(([I, R, C, y]) => (
          <KpiTile
            key={I}
            label={I}
            value={R}
            sub={C}
            onClick={() => E(`/app/${y}`)}
          />
        ))}
      </div>
      <section className="card p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-medium">Readiness over time</h2>
            <p className="mt-1 text-xs text-muted dark:text-slate-400">
              Only human-reviewed evidence counts. Empty points are shown as Not
              reviewed.
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              patchUi({
                historyOpen: !ui.historyOpen,
              })
            }
            className="text-sm text-muted underline-offset-2 hover:underline dark:text-slate-400"
          >
            {ui.historyOpen ? "Hide table" : "Show table"}
          </button>
        </div>
        <div className="mt-3">
          <ReadinessChart key={g.id} techId={g.id} area height={168} />
        </div>
        <HistoryTable techId={g.id} />
      </section>
      <div className="grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-1">
          {ui.checklistDismissed ? (
            <section className="card p-4 text-sm text-muted">
              Getting started is dismissed for this session.
            </section>
          ) : (
            <section className="card p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-sm font-medium">Getting started</h2>
                  <p className="mt-1 text-xs text-muted dark:text-slate-400">
                    {m}
                    {" of "}
                    {w.length}
                    {
                      " steps complete. Steps tick from the record, not from clicks here."
                    }
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    patchUi({
                      checklistDismissed: true,
                    })
                  }
                  className="text-sm text-muted hover:text-ink dark:hover:text-white"
                >
                  Dismiss
                </button>
              </div>
              <div className="progress mt-3">
                <span
                  style={{
                    width: `${(m / w.length) * 100}%`,
                  }}
                />
              </div>
              <ul className="mt-4 grid gap-2">
                {w.map(([I, R]) => (
                  <li key={I} className="flex items-center gap-2 text-sm">
                    <span
                      className={`grid size-5 place-items-center rounded-full text-xs ${R ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400" : "bg-soft text-muted dark:bg-white/10"}`}
                    >
                      {R ? "✓" : ""}
                    </span>
                    {I}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
        <section className="card p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium">Next actions</h2>
            <Link
              to="/app/action-planning"
              className="text-xs text-muted underline-offset-2 hover:underline dark:text-slate-400"
            >
              View all
            </Link>
          </div>
          <ul className="mt-3 grid gap-3">
            {c.map((I) => (
              <li key={I.id} className="flex items-start gap-3">
                <Avatar name={I.owner} size={28} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{I.title}</div>
                  <div className="text-xs text-muted dark:text-slate-400">
                    {I.owner}
                    {" · "}
                    {I.due}
                  </div>
                </div>
                <StatusChip status={I.status} />
              </li>
            ))}
          </ul>
        </section>
        <section className="card p-4">
          <h2 className="text-sm font-medium">Recent activity</h2>
          <ul className="mt-3 grid gap-3">
            {notifications.slice(0, 3).map((I) => (
              <li key={I.id}>
                <button
                  type="button"
                  onClick={() => B(I)}
                  className="w-full rounded-md text-left hover:bg-soft/80 dark:hover:bg-white/5"
                >
                  <div className="text-sm font-medium">{I.title}</div>
                  <div className="text-xs text-muted dark:text-slate-400">
                    {I.body}
                  </div>
                  <div className="mt-0.5 text-[11px] text-muted dark:text-slate-500">
                    {I.time}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
