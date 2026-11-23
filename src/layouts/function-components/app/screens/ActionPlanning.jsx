import { Icon } from "@/layouts/function-components/app/ui/Icon";
import {
  Avatar,
  PageTitle,
  StatusChip,
  btnPrimary,
} from "@/layouts/function-components/app/ui/primitives";
import { ACTION_STATUSES } from "@/lib/sample-data";
import { useStore } from "@/lib/store";

export function ActionPlanning() {
  const { actions, techName, matchesQuery, patchUi, patchData } = useStore(),
    l = actions.filter((a) =>
      matchesQuery(
        {
          ...a,
          technology: techName(a.technologyId),
        },
        ["title", "owner", "due", "status", "technology"],
      ),
    ),
    s = (a) =>
      patchData((o) => ({
        actions: o.actions.map((u) =>
          u.id === a
            ? {
                ...u,
                status:
                  ACTION_STATUSES[
                    (ACTION_STATUSES.indexOf(u.status) + 1) %
                      ACTION_STATUSES.length
                  ],
              }
            : u,
        ),
      }));
  return (
    <div className="flex flex-col gap-5">
      <PageTitle
        title="Action planning"
        sub="Actions for the team to take on a technology record. Toggle a status to move it on."
      >
        <button
          type="button"
          onClick={() =>
            patchUi({
              modal: "action",
            })
          }
          className={btnPrimary}
        >
          <Icon name="plus" />
          {" Add action"}
        </button>
      </PageTitle>
      <ul className="card">
        {l.length ? (
          l.map((a) => (
            <li
              key={a.id}
              className="flex items-center gap-3 border-b border-line px-4 py-3 last:border-0 dark:border-slate-800"
            >
              <button
                type="button"
                onClick={() => s(a.id)}
                aria-label="Toggle status"
                className={`grid size-5 place-items-center rounded border text-xs transition-colors ${a.status === "Done" ? "border-emerald-600 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400" : "border-line dark:border-slate-600"}`}
              >
                {a.status === "Done" ? "✓" : ""}
              </button>
              <Avatar name={a.owner} size={32} />
              <div className="min-w-0 flex-1">
                <div
                  className={`truncate text-sm font-medium ${a.status === "Done" ? "text-muted line-through" : ""}`}
                >
                  {a.title}
                </div>
                <div className="text-xs text-muted dark:text-slate-400">
                  {a.owner}
                  {" · "}
                  {techName(a.technologyId)}
                  {" · Due "}
                  {a.due}
                </div>
              </div>
              <button
                type="button"
                onClick={() => s(a.id)}
                className="shrink-0"
              >
                <StatusChip status={a.status} />
              </button>
            </li>
          ))
        ) : (
          <li className="px-4 py-8 text-center text-sm text-muted">
            No actions match this search.
          </li>
        )}
      </ul>
    </div>
  );
}
