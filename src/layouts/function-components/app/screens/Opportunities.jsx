import {
  Chip,
  PageTitle,
  StatusChip,
} from "@/layouts/function-components/app/ui/primitives";
import { fitLabel } from "@/lib/format";
import { useNavigate } from "@/lib/navigation";
import { useStore } from "@/lib/store";

export function Opportunities() {
  const {
      opportunities,
      gapsFor,
      fundingForOpp,
      techName,
      matchesQuery,
      ui,
      patchUi,
    } = useStore(),
    a = useNavigate(),
    o = opportunities.filter((E) => {
      const g = fundingForOpp(E.id);
      return matchesQuery(
        {
          ...E,
          technology: techName(E.technologyId),
          fit: g ? fitLabel(g.score) : "",
        },
        ["title", "program", "technology", "note", "fit"],
      );
    }),
    u = o.find((E) => E.id === ui.selectedOpp) || o[0],
    p = u ? gapsFor(u.id) : [],
    f = (E) => {
      (patchUi({
        techId: E,
      }),
        a("/app/readiness"));
    };
  return (
    <div className="flex flex-col gap-5">
      <PageTitle
        title="Knowledge opportunities"
        sub="A list of gaps to work on. Match tags are sample scores from funding matches."
      />
      <div className="grid gap-5 lg:grid-cols-[1fr_22rem]">
        <div className="grid content-start gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {o.length ? (
            o.map((E) => {
              const g = gapsFor(E.id).length,
                x = fundingForOpp(E.id),
                Q = u && u.id === E.id;
              return (
                <button
                  key={E.id}
                  type="button"
                  onClick={() =>
                    patchUi({
                      selectedOpp: E.id,
                    })
                  }
                  className={`card card-hover w-full p-4 text-left ${Q ? "!border-navy/40 ring-1 ring-navy/20 dark:!border-slate-400" : ""}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-sm font-medium">{E.title}</div>
                    {x && (
                      <Chip
                        label={`${fitLabel(x.score)} · ${x.score}`}
                        tone={
                          x.score >= 75
                            ? "success"
                            : x.score >= 65
                              ? "info"
                              : "warn"
                        }
                      />
                    )}
                  </div>
                  <div className="mt-1 text-xs text-muted dark:text-slate-400">
                    {techName(E.technologyId)}
                    {" · "}
                    {E.program}
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-muted dark:text-slate-400">
                    <span>
                      {g}
                      {" gap"}
                      {g === 1 ? "" : "s"}
                      {" to work on"}
                    </span>
                    <span>{E.agencyType}</span>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="text-sm text-muted">
              No opportunities match this search.
            </div>
          )}
        </div>
        <aside className="card h-fit p-5">
          {u ? (
            <div
              key={u.id}
              style={{
                animation: "pop .25s ease-out",
              }}
            >
              <h2 className="text-sm font-medium">
                {"Gaps for "}
                {u.title}
              </h2>
              <p className="mt-1 text-xs text-muted dark:text-slate-400">
                {u.note}
              </p>
              <ul className="mt-4 grid gap-2">
                {p.length ? (
                  p.map((E) => (
                    <li
                      key={E.id}
                      className="rounded-lg border border-line p-3 dark:border-slate-800"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-sm">{E.text}</span>
                        <StatusChip status={E.severity} />
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-muted">
                    No gaps on this opportunity.
                  </li>
                )}
              </ul>
              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() =>
                    patchUi({
                      drawer: {
                        type: "gaps",
                        id: u.id,
                      },
                    })
                  }
                  className="rounded-lg border border-line px-3 py-1.5 text-sm dark:border-slate-700"
                >
                  Review gaps
                </button>
                <button
                  type="button"
                  onClick={() => f(u.technologyId)}
                  className="rounded-lg border border-line px-3 py-1.5 text-sm dark:border-slate-700"
                >
                  Open IRL
                </button>
                <button
                  type="button"
                  onClick={() => f(u.technologyId)}
                  className="rounded-lg bg-navy px-3 py-1.5 text-sm font-medium text-white"
                >
                  Open Readiness
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted">
              Select an opportunity to see its gaps.
            </p>
          )}
        </aside>
      </div>
    </div>
  );
}
