import { FileTypeIcon, Icon } from "@/layouts/function-components/app/ui/Icon";
import {
  Avatar,
  PageTitle,
  ReviewChip,
  btnPrimary,
  filterBtn,
} from "@/layouts/function-components/app/ui/primitives";
import { useStore } from "@/lib/store";

export function Evidence() {
  const { docs, techName, matchesQuery, ui, patchUi } = useStore(),
    l = docs.filter((s) =>
      (ui.evidenceFilter === "Reviewed" && !s.reviewed) ||
      (ui.evidenceFilter === "Not reviewed" && s.reviewed)
        ? false
        : matchesQuery(
            {
              ...s,
              technology: techName(s.technologyId),
              status: s.reviewed ? "Human-reviewed" : "Not reviewed",
            },
            ["name", "technology", "status", "reviewer"],
          ),
    );
  return (
    <div className="flex flex-col gap-5">
      <PageTitle
        title="Evidence"
        sub="Documents attached to a technology. Only human-reviewed evidence counts toward readiness."
      >
        <button
          type="button"
          onClick={() =>
            patchUi({
              modal: "upload",
            })
          }
          className={btnPrimary}
        >
          <Icon name="plus" />
          {" Upload document"}
        </button>
      </PageTitle>
      <div className="flex flex-wrap gap-2">
        {["All", "Reviewed", "Not reviewed"].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() =>
              patchUi({
                evidenceFilter: s,
              })
            }
            className={filterBtn(ui.evidenceFilter === s)}
          >
            {s}
          </button>
        ))}
      </div>
      <div className="card overflow-hidden">
        {l.length ? (
          l.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() =>
                patchUi({
                  drawer: {
                    type: "doc",
                    id: s.id,
                  },
                })
              }
              className="row-hover grid w-full grid-cols-[auto_1fr_auto] items-center gap-3 border-b border-line px-4 py-3 text-left last:border-0 dark:border-slate-800 sm:grid-cols-[auto_1.2fr_1fr_auto_auto]"
            >
              <span className="text-navy dark:text-slate-200">
                <FileTypeIcon type={s.type} />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium">
                  {s.name}
                </span>
                <span className="block truncate text-xs text-muted sm:hidden">
                  {techName(s.technologyId)}
                </span>
              </span>
              <span className="hidden truncate text-sm text-muted dark:text-slate-400 sm:block">
                {techName(s.technologyId)}
              </span>
              <span className="hidden items-center gap-2 sm:flex">
                {s.reviewer && <Avatar name={s.reviewer} size={24} />}
                <span className="text-xs text-muted dark:text-slate-400">
                  {s.reviewer || "Awaiting review"}
                </span>
              </span>
              <span className="flex items-center gap-2">
                <ReviewChip reviewed={s.reviewed} />
                <span className="hidden font-mono text-[11px] text-muted dark:text-slate-400 lg:inline">
                  {s.uploaded}
                </span>
              </span>
            </button>
          ))
        ) : (
          <div className="px-4 py-8 text-center text-sm text-muted">
            No documents match this filter.
          </div>
        )}
      </div>
    </div>
  );
}
