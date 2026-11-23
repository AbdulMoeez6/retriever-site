import { Icon } from "@/layouts/function-components/app/ui/Icon";
import {
  PageTitle,
  StatusChip,
  btnSecondary,
  filterBtn,
} from "@/layouts/function-components/app/ui/primitives";
import { csvCell, fitLabel } from "@/lib/format";
import { useStore } from "@/lib/store";

export const FUNDING_COLS =
  "md:grid-cols-[1.4fr_1.2fr_7rem_3.5rem_6.5rem_7.5rem]";

export function Funding() {
  const { funding, techName, matchesQuery, ui, patchUi, toast } = useStore(),
    s = funding.filter((o) =>
      (ui.fundingType !== "All" && o.agencyType !== ui.fundingType) ||
      (ui.fundingFit !== "All" && fitLabel(o.score) !== ui.fundingFit)
        ? false
        : matchesQuery(
            {
              ...o,
              fit: fitLabel(o.score),
              technology: techName(o.technologyId),
            },
            [
              "opportunity",
              "agency",
              "deadline",
              "status",
              "fit",
              "technology",
              "agencyType",
            ],
          ),
    ),
    a = () => {
      const u = [
          [
            "Opportunity",
            "Agency",
            "Agency type",
            "Deadline",
            "Match score",
            "Fit",
            "Gaps",
            "Status",
          ].join(","),
        ].concat(
          s.map((f) =>
            [
              f.opportunity,
              f.agency,
              f.agencyType,
              f.deadline,
              f.score,
              fitLabel(f.score),
              f.gaps,
              f.status,
            ]
              .map(csvCell)
              .join(","),
          ),
        ),
        p = new Blob(
          [
            "\uFEFF" +
              u.join(`\r
`),
          ],
          {
            type: "text/csv;charset=utf-8",
          },
        );
      try {
        const f = document.createElement("a");
        ((f.href = URL.createObjectURL(p)),
          (f.download = "funding-matches-19-nov-2026.csv"),
          document.body.appendChild(f),
          f.click(),
          f.remove(),
          setTimeout(() => {
            try {
              URL.revokeObjectURL(f.href);
            } catch {}
          }, 500),
          toast("Funding matches exported (demo)"));
      } catch {
        toast(
          "Download isn't available in this viewer. Open the file in Chrome to export.",
        );
      }
    };
  return (
    <div className="flex flex-col gap-5">
      <PageTitle
        title="Funding matches"
        sub="Matches for this organization. Fit is a sample score band only."
      >
        <button type="button" onClick={a} className={btnSecondary}>
          <Icon name="download" />
          {" Export CSV"}
        </button>
      </PageTitle>
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap gap-2">
          <span className="self-center text-xs text-muted dark:text-slate-400">
            Agency type
          </span>
          {["All", "Government program", "Laboratory", "Innovation office"].map(
            (o) => (
              <button
                key={o}
                type="button"
                onClick={() =>
                  patchUi({
                    fundingType: o,
                  })
                }
                className={filterBtn(ui.fundingType === o)}
              >
                {o}
              </button>
            ),
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="self-center text-xs text-muted dark:text-slate-400">
            Fit
          </span>
          {["All", "Strong fit", "Good fit", "Fair fit"].map((o) => (
            <button
              key={o}
              type="button"
              onClick={() =>
                patchUi({
                  fundingFit: o,
                })
              }
              className={filterBtn(ui.fundingFit === o)}
            >
              {o}
            </button>
          ))}
        </div>
      </div>
      <div className="card overflow-hidden">
        <div
          className={`hidden border-b border-line bg-soft px-4 py-2 text-xs font-medium text-muted dark:border-slate-800 dark:bg-white/5 dark:text-slate-400 md:grid md:gap-4 ${FUNDING_COLS}`}
        >
          <span>Opportunity</span>
          <span>Agency</span>
          <span>Deadline</span>
          <span>Score</span>
          <span>Fit</span>
          <span>Status</span>
        </div>
        {s.length ? (
          s.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() =>
                patchUi({
                  drawer: {
                    type: "funding",
                    id: o.id,
                  },
                })
              }
              className={`row-hover grid w-full grid-cols-2 items-center gap-2 border-b border-line px-4 py-3 text-left last:border-0 dark:border-slate-800 md:gap-4 ${FUNDING_COLS}`}
            >
              <span className="text-sm font-medium">{o.opportunity}</span>
              <span className="text-sm text-muted dark:text-slate-400">
                {o.agency}
              </span>
              <span className="font-mono text-xs">{o.deadline}</span>
              <span className="font-mono text-xs">{o.score}</span>
              <span>
                <StatusChip status={fitLabel(o.score)} />
              </span>
              <span>
                <StatusChip status={o.status} />
              </span>
            </button>
          ))
        ) : (
          <div className="px-4 py-8 text-center text-sm text-muted">
            No funding matches for this filter.
          </div>
        )}
      </div>
    </div>
  );
}
