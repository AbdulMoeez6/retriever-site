import { FileTypeIcon } from "@/layouts/function-components/app/ui/Icon";
import {
  HistoryTable,
  LevelRing,
  ReadinessChart,
} from "@/layouts/function-components/app/ui/charts";
import {
  Avatar,
  PageTitle,
  ReviewChip,
  TechSelect,
  btnSecondary,
} from "@/layouts/function-components/app/ui/primitives";
import { latestValue } from "@/lib/format";
import { Link } from "@/lib/navigation";
import { useStore } from "@/lib/store";

export function Readiness() {
  const { currentTech, history, docs, ui, patchUi } = useStore(),
    l = currentTech(),
    s = history[l.id] || {
      TRL: [],
      MRL: [],
      IRL: [],
    },
    a = docs.filter((p) => p.technologyId === l.id && p.reviewed),
    o = docs.filter((p) => p.technologyId === l.id && !p.reviewed),
    u = a.concat(o);
  return (
    <div className="flex flex-col gap-5">
      <PageTitle
        title="Readiness"
        sub="TRL, MRL and IRL assessments for a technology. Only human-reviewed evidence counts."
      >
        <TechSelect />
        <button
          type="button"
          onClick={() =>
            patchUi({
              quickOpen: true,
            })
          }
          className={btnSecondary}
        >
          Five-question quick assessment
        </button>
      </PageTitle>
      <section className="card p-5">
        <div
          key={l.id}
          className="grid justify-items-center gap-6 sm:grid-cols-3"
        >
          <LevelRing label="TRL" value={latestValue(s.TRL)} />
          <LevelRing label="MRL" value={latestValue(s.MRL)} />
          <LevelRing label="IRL" value={latestValue(s.IRL)} />
        </div>
      </section>
      <section className="card p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-medium">Readiness history</h2>
            <p className="mt-1 text-xs text-muted dark:text-slate-400">
              Levels over time from saved assessments. Sample data only. TRL 1
              to 9.
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
          <ReadinessChart key={l.id} techId={l.id} height={152} />
        </div>
        <HistoryTable techId={l.id} />
      </section>
      <section className="card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-medium">Human-reviewed evidence</h2>
            <p className="mt-1 text-xs text-muted dark:text-slate-400">
              {a.length}
              {" of "}
              {u.length}
              {" documents for "}
              {l.name}
              {" count toward readiness."}
            </p>
          </div>
          <Link
            to="/app/evidence"
            className="text-sm text-muted underline-offset-2 hover:underline dark:text-slate-400"
          >
            Open Evidence
          </Link>
        </div>
        <div className="progress mt-3">
          <span
            style={{
              width: `${u.length ? (a.length / u.length) * 100 : 0}%`,
            }}
          />
        </div>
        <ul className="mt-4 grid gap-2 text-sm">
          {u.length ? (
            u.map((p) => (
              <li
                key={p.id}
                className="flex items-center gap-3 rounded-lg border border-line px-3 py-2 dark:border-slate-800"
              >
                <FileTypeIcon type={p.type} />
                <span className="flex-1 truncate">{p.name}</span>
                {p.reviewer && (
                  <span className="hidden sm:inline-flex">
                    <Avatar name={p.reviewer} size={22} />
                  </span>
                )}
                <span className="hidden text-xs text-muted dark:text-slate-400 sm:inline">
                  {p.reviewer || "Awaiting reviewer"}
                </span>
                <ReviewChip reviewed={!!p.reviewed} />
              </li>
            ))
          ) : (
            <li className="text-muted">No documents on file yet.</li>
          )}
        </ul>
      </section>
    </div>
  );
}
