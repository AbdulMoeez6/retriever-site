import { Icon } from "@/layouts/function-components/app/ui/Icon";
import {
  Chip,
  PageTitle,
  StatusChip,
  TechSelect,
  btnSecondary,
} from "@/layouts/function-components/app/ui/primitives";
import { formatIsoDate, prefersReducedMotion } from "@/lib/format";
import { useStore } from "@/lib/store";

export const ROADMAP_START = Date.parse("2026-11-01");

export const ROADMAP_END = Date.parse("2027-03-31");

export const roadmapPct = (A) =>
  Math.max(
    0,
    Math.min(
      100,
      ((Date.parse(A) - ROADMAP_START) / (ROADMAP_END - ROADMAP_START)) * 100,
    ),
  );

export function Roadmap() {
  const { roadmap, ui, patchUi, matchesQuery, techName } = useStore(),
    l = roadmap
      .filter((o) => o.technologyId === ui.techId)
      .filter((o) =>
        matchesQuery(
          {
            ...o,
            technology: techName(o.technologyId),
          },
          ["title", "status", "technology"],
        ),
      ),
    s = roadmap
      .filter((o) => o.milestone)
      .slice()
      .sort((o, u) => Date.parse(o.end) - Date.parse(u.end)),
    a = !prefersReducedMotion();
  return (
    <div className="flex flex-col gap-5">
      <PageTitle
        title="Roadmap"
        sub="Milestones and planned work for the selected technology, November 2026 to March 2027."
      >
        <TechSelect />
        <button
          type="button"
          onClick={() =>
            patchUi({
              modal: "share",
            })
          }
          className={btnSecondary}
        >
          <Icon name="share" />
          {" Share roadmap"}
        </button>
      </PageTitle>
      <section className="card p-5">
        <div className="mb-3 flex flex-wrap items-center gap-3 text-[11px] text-muted dark:text-slate-400">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-5 rounded-full bg-emerald-600/80" />
            Done
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-5 rounded-full bg-navy dark:bg-slate-200" />
            In progress
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-5 rounded-full bg-navy/40 dark:bg-slate-500" />
            Planned
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2 rotate-45 bg-navy dark:bg-white" />
            Milestone
          </span>
        </div>
        <div className="grid grid-cols-[18rem_1fr] gap-3 text-[11px] font-medium text-muted dark:text-slate-400">
          <div />
          <div className="grid grid-cols-5 text-center">
            <span>Nov 2026</span>
            <span>Dec</span>
            <span>Jan 2027</span>
            <span>Feb</span>
            <span>Mar</span>
          </div>
        </div>
        <div
          key={ui.techId}
          className="mt-2 divide-y divide-line dark:divide-slate-800"
        >
          {l.length ? (
            l.map((o, u) => {
              const p = roadmapPct(o.start),
                f = roadmapPct(o.end),
                E = Math.max(6, f - p);
              return (
                <div
                  key={o.id}
                  className="grid grid-cols-[18rem_1fr] items-center gap-3 py-2"
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">
                      {o.title}
                    </div>
                    <div className="mt-0.5 flex items-center gap-2">
                      <StatusChip status={o.status} />
                      {o.milestone && <Chip label="Milestone" tone="navy" />}
                    </div>
                  </div>
                  <div className="gantt-grid relative h-9 rounded-md bg-soft/70 dark:bg-white/5">
                    <div
                      className={`absolute top-2 h-5 origin-left rounded-full ${o.status === "Done" ? "bg-emerald-600/80 dark:bg-emerald-400/70" : o.status === "In progress" ? "bg-navy dark:bg-slate-200" : "bg-navy/40 dark:bg-slate-500"}`}
                      style={{
                        left: `${p}%`,
                        width: `${E}%`,
                        animation: a
                          ? `bar-grow .7s cubic-bezier(.2,.7,.2,1) ${u * 60}ms both`
                          : "none",
                      }}
                    />
                    {o.milestone && (
                      <span
                        className="absolute top-1.5 size-3 rotate-45 rounded-[2px] bg-navy dark:bg-white"
                        style={{
                          left: `calc(${f}% - 6px)`,
                        }}
                      />
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <p className="py-8 text-center text-sm text-muted">
              No roadmap items to show.
            </p>
          )}
        </div>
      </section>
      <section className="card p-5">
        <h2 className="text-sm font-medium">Upcoming milestones</h2>
        <p className="mt-1 text-xs text-muted dark:text-slate-400">
          Across the workspace. Sample data only.
        </p>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {s.map((o) => (
            <li
              key={o.id}
              className="flex items-start justify-between gap-3 rounded-lg border border-line px-3 py-2.5 dark:border-slate-800"
            >
              <div className="min-w-0">
                <div className="truncate text-sm font-medium">{o.title}</div>
                <div className="mt-0.5 text-xs text-muted dark:text-slate-400">
                  {techName(o.technologyId)}
                </div>
              </div>
              <div className="shrink-0 text-right">
                <div className="text-xs text-muted dark:text-slate-400">
                  {formatIsoDate(o.end)}
                </div>
                <div className="mt-1 flex justify-end">
                  <StatusChip status={o.status} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
