import { FileTypeIcon, Icon } from "@/layouts/function-components/app/ui/Icon";
import {
  LevelRing,
  ReadinessChart,
} from "@/layouts/function-components/app/ui/charts";
import {
  Avatar,
  PageTitle,
  ReviewChip,
  StatusChip,
  btnPrimary,
} from "@/layouts/function-components/app/ui/primitives";
import { fitLabel, latestValue } from "@/lib/format";
import { useNavigate } from "@/lib/navigation";
import { useStore } from "@/lib/store";

export function ProfileDetail({ t: t2 }) {
  const { history, actions, docs, funding, ui, patchUi } = useStore(),
    a = useNavigate(),
    o = history[t2.id] || {
      TRL: [],
      MRL: [],
      IRL: [],
    },
    u = docs.filter((x) => x.technologyId === t2.id),
    p = funding.filter((x) => x.technologyId === t2.id),
    f = actions.filter((x) => x.technologyId === t2.id && x.status !== "Done"),
    E = ui.profileTab;
  let g;
  return (
    E === "Overview"
      ? (g = (
          <>
            <p className="text-sm text-muted dark:text-slate-400">
              {t2.summary}
            </p>
            <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-xs text-muted dark:text-slate-400">
                  Organization
                </dt>
                <dd className="mt-1 font-medium">{t2.org}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted dark:text-slate-400">
                  Owner
                </dt>
                <dd className="mt-1 flex items-center gap-2">
                  <Avatar name={t2.owner} size={24} /> {t2.owner}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted dark:text-slate-400">
                  Current levels
                </dt>
                <dd className="mt-1 font-mono text-xs">
                  {"TRL "}
                  {t2.trl ?? "—"}
                  {" · MRL "}
                  {t2.mrl ?? "—"}
                  {" · IRL "}
                  {t2.irl ?? "—"}
                </dd>
              </div>
            </dl>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-line px-3 py-3 dark:border-slate-800">
                <div className="text-xs text-muted dark:text-slate-400">
                  Readiness
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <LevelRing label="TRL" value={t2.trl} size={72} />
                  <LevelRing label="MRL" value={t2.mrl} size={72} />
                  <LevelRing label="IRL" value={t2.irl} size={72} />
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  patchUi({
                    profileTab: "Evidence",
                  })
                }
                className="rounded-lg border border-line px-3 py-3 text-left hover:bg-soft/80 dark:border-slate-800 dark:hover:bg-white/5"
              >
                <div className="text-xs text-muted dark:text-slate-400">
                  Evidence
                </div>
                <div className="mt-2 text-xl font-semibold tabular-nums">
                  {u.filter((x) => x.reviewed).length}
                  {" of "}
                  {u.length}
                </div>
                <div className="mt-1 text-xs text-muted dark:text-slate-400">
                  Human-reviewed documents
                </div>
              </button>
              <button
                type="button"
                onClick={() =>
                  patchUi({
                    profileTab: "Funding",
                  })
                }
                className="rounded-lg border border-line px-3 py-3 text-left hover:bg-soft/80 dark:border-slate-800 dark:hover:bg-white/5"
              >
                <div className="text-xs text-muted dark:text-slate-400">
                  Funding matches
                </div>
                <div className="mt-2 text-xl font-semibold tabular-nums">
                  {p.length}
                </div>
                <div className="mt-1 text-xs text-muted dark:text-slate-400">
                  Open matches to review
                </div>
              </button>
            </div>
            <div className="mt-6">
              <h3 className="text-sm font-medium">Next actions</h3>
              <ul className="mt-3 grid gap-2">
                {f.length ? (
                  f.map((x) => (
                    <li
                      key={x.id}
                      className="flex items-center gap-3 rounded-lg border border-line px-3 py-2 dark:border-slate-800"
                    >
                      <Avatar name={x.owner} size={24} />
                      <span className="flex-1 truncate text-sm">{x.title}</span>
                      <StatusChip status={x.status} />
                      <span className="text-xs text-muted dark:text-slate-400">
                        {x.due}
                      </span>
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-muted">No open actions.</li>
                )}
              </ul>
            </div>
          </>
        ))
      : E === "Readiness"
        ? (g = (
            <>
              <div className="grid justify-items-center gap-4 sm:grid-cols-3">
                <LevelRing label="TRL" value={latestValue(o.TRL)} size={100} />
                <LevelRing label="MRL" value={latestValue(o.MRL)} size={100} />
                <LevelRing label="IRL" value={latestValue(o.IRL)} size={100} />
              </div>
              <div className="mt-6">
                <ReadinessChart techId={t2.id} area height={180} />
              </div>
              <p className="mt-3 text-xs text-muted dark:text-slate-400">
                Only human-reviewed evidence counts.
              </p>
            </>
          ))
        : E === "Evidence"
          ? (g = (
              <ul className="grid gap-2">
                {u.length ? (
                  u.map((x) => (
                    <li key={x.id}>
                      <button
                        type="button"
                        onClick={() =>
                          patchUi({
                            drawer: {
                              type: "doc",
                              id: x.id,
                            },
                          })
                        }
                        className="card card-hover flex w-full items-center gap-3 p-3 text-left"
                      >
                        <FileTypeIcon type={x.type} />
                        <span className="flex-1 truncate text-sm font-medium">
                          {x.name}
                        </span>
                        {x.reviewer && <Avatar name={x.reviewer} size={24} />}
                        <ReviewChip reviewed={x.reviewed} />
                      </button>
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-muted">
                    No documents on this profile yet.
                  </li>
                )}
              </ul>
            ))
          : (g = (
              <ul className="grid gap-2">
                {p.length ? (
                  p.map((x) => (
                    <li key={x.id}>
                      <button
                        type="button"
                        onClick={() =>
                          patchUi({
                            drawer: {
                              type: "funding",
                              id: x.id,
                            },
                          })
                        }
                        className="card card-hover w-full p-3 text-left"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-medium">
                            {x.opportunity}
                          </span>
                          <StatusChip status={fitLabel(x.score)} />
                        </div>
                        <div className="mt-1 text-xs text-muted dark:text-slate-400">
                          {x.agency}
                          {" · "}
                          {x.deadline}
                        </div>
                      </button>
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-muted">
                    No funding matches for this technology.
                  </li>
                )}
              </ul>
            )),
    (
      <div
        className="flex flex-col gap-5"
        style={{
          animation: "page-in .3s ease-out",
        }}
      >
        <button
          type="button"
          onClick={() =>
            patchUi({
              profileFocus: null,
            })
          }
          className="inline-flex w-fit items-center gap-1 text-sm text-muted hover:text-ink dark:text-slate-400 dark:hover:text-white"
        >
          <Icon name="back" />
          {" All profiles"}
        </button>
        <section className="card p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <Avatar name={t2.owner} size={48} />
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">
                  {t2.name}
                </h1>
                <p className="mt-1 text-sm text-muted dark:text-slate-400">
                  {t2.org}
                  {" · "}
                  {t2.owner}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                (patchUi({
                  techId: t2.id,
                  profileFocus: null,
                }),
                  a("/app/readiness"));
              }}
              className={btnPrimary}
            >
              Open Readiness
            </button>
          </div>
          <div
            className="mt-5 flex gap-1 border-b border-line dark:border-slate-800"
            role="tablist"
          >
            {["Overview", "Readiness", "Evidence", "Funding"].map((x) => (
              <button
                key={x}
                type="button"
                role="tab"
                aria-selected={E === x}
                onClick={() =>
                  patchUi({
                    profileTab: x,
                  })
                }
                className={`-mb-px border-b-2 px-3 py-2 text-sm transition-colors ${E === x ? "border-navy font-medium text-ink dark:border-slate-200 dark:text-white" : "border-transparent text-muted hover:text-ink dark:text-slate-400 dark:hover:text-white"}`}
              >
                {x}
              </button>
            ))}
          </div>
          <div
            key={E}
            className="mt-5"
            style={{
              animation: "pop .25s ease-out",
            }}
          >
            {g}
          </div>
        </section>
      </div>
    )
  );
}

export function Profiles() {
  const { techs, matchesQuery, ui, patchUi } = useStore(),
    r = ui.profileFocus && techs.find((s) => s.id === ui.profileFocus);
  if (r) return <ProfileDetail t={r} />;
  const l = techs.filter((s) => matchesQuery(s, ["name", "org", "owner"]));
  return (
    <div className="flex flex-col gap-5">
      <PageTitle
        title="Technology profiles"
        sub="Profiles in this workspace, with the latest TRL, MRL and IRL on file."
      >
        <button
          type="button"
          onClick={() =>
            patchUi({
              modal: "profile",
            })
          }
          className={btnPrimary}
        >
          <Icon name="plus" />
          {" New profile"}
        </button>
      </PageTitle>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {l.length ? (
          l.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() =>
                patchUi({
                  profileFocus: s.id,
                  profileTab: "Overview",
                  techId: s.id,
                })
              }
              className="card card-hover p-5 text-left"
            >
              <div className="flex items-start gap-3">
                <Avatar name={s.owner} size={40} />
                <div className="min-w-0">
                  <div className="text-sm font-medium">{s.name}</div>
                  <div className="text-xs text-muted dark:text-slate-400">
                    {s.org}
                  </div>
                  <div className="mt-1 text-xs text-muted dark:text-slate-400">
                    {s.owner}
                  </div>
                </div>
              </div>
              <div className="mt-4 flex gap-3 text-xs text-muted dark:text-slate-400">
                <span>
                  {"TRL "}
                  {s.trl ?? "—"}
                </span>
                <span>
                  {"MRL "}
                  {s.mrl ?? "—"}
                </span>
                <span>
                  {"IRL "}
                  {s.irl ?? "—"}
                </span>
              </div>
            </button>
          ))
        ) : (
          <div className="text-sm text-muted">
            No profiles match this search.
          </div>
        )}
      </div>
    </div>
  );
}
