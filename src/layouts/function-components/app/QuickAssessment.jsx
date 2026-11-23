import { useState } from "react";
import { Icon } from "@/layouts/function-components/app/ui/Icon";
import { track } from "@/lib/analytics";
import { Link } from "@/lib/navigation";
import { QUICK_QUESTIONS } from "@/lib/sample-data";
import { useStore } from "@/lib/store";

export function QuickAssessment() {
  const { ui, patchUi, toast } = useStore(),
    [n, r] = useState(0),
    [l, s] = useState({});
  if (!ui.quickOpen) return null;
  const a = () => {
      (patchUi({
        quickOpen: false,
      }),
        r(0),
        s({}));
    },
    o = QUICK_QUESTIONS.length,
    u = n >= o,
    p = QUICK_QUESTIONS[n],
    f = (p && l[p.id]) || "",
    E = (Math.min(n, o) / o) * 100;
  return (
    <>
      <div className="modal-backdrop" onClick={a} />
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-title"
      >
        <div className="modal-panel p-6">
          <div className="flex items-start justify-between">
            <div className="text-sm font-medium">
              Five-question quick assessment
            </div>
            <button
              type="button"
              onClick={a}
              className="grid size-8 place-items-center rounded-md hover:bg-soft dark:hover:bg-white/10"
              aria-label="Close"
            >
              <Icon name="x" />
            </button>
          </div>
          <div className="mt-4">
            {u ? (
              <div
                style={{
                  animation: "pop .25s ease-out",
                }}
              >
                <h2 id="quick-title" className="text-xl font-semibold">
                  Quick assessment
                </h2>
                <div className="progress mt-3">
                  <span
                    style={{
                      width: "100%",
                    }}
                  />
                </div>
                <p className="mt-3 text-sm text-muted dark:text-slate-400">
                  This is a sample walkthrough only. A full readiness assessment
                  uses TRL, MRL and IRL, and only human-reviewed evidence
                  counts.
                </p>
                <div className="mt-4">
                  {QUICK_QUESTIONS.map((g) => (
                    <div
                      key={g.id}
                      className="flex items-center justify-between gap-4 border-b border-line py-2 text-sm last:border-0 dark:border-slate-800"
                    >
                      <span>{g.text}</span>
                      <span className="font-medium">{l[g.id] || "—"}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex flex-wrap justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      (r(0), s({}));
                    }}
                    className="rounded-lg border border-line px-4 py-2 text-sm dark:border-slate-700"
                  >
                    Start again
                  </button>
                  <Link
                    to="/book-demo"
                    onClick={a}
                    className="rounded-lg bg-navy px-4 py-2 text-sm font-medium text-white"
                  >
                    Book a demo
                  </Link>
                </div>
              </div>
            ) : (
              <div
                key={n}
                style={{
                  animation: "pop .25s ease-out",
                }}
              >
                <p className="text-xs font-medium uppercase tracking-wide text-muted dark:text-slate-400">
                  {"Question "}
                  {n + 1}
                  {" of "}
                  {o}
                </p>
                <div className="progress mt-3">
                  <span
                    style={{
                      width: `${E}%`,
                    }}
                  />
                </div>
                <h2 id="quick-title" className="mt-4 text-xl font-semibold">
                  {p.text}
                </h2>
                <div className="mt-6 flex flex-wrap gap-2">
                  {["Yes", "No", "Not sure"].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() =>
                        s((x) => ({
                          ...x,
                          [p.id]: g,
                        }))
                      }
                      className={`rounded-lg px-4 py-2 text-sm transition-colors ${f === g ? "bg-navy text-white" : "border border-line hover:border-navy/40 dark:border-slate-700"}`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
                <div className="mt-8 flex justify-between">
                  <button
                    type="button"
                    disabled={n === 0}
                    onClick={() => r((g) => Math.max(0, g - 1))}
                    className="inline-flex items-center gap-1 rounded-lg border border-line px-4 py-2 text-sm disabled:opacity-50 dark:border-slate-700"
                  >
                    <Icon name="back" />
                    {" Back"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!f) return toast("Choose an answer to continue");
                      if (n === o - 1) track("quick_assessment_complete");
                      r((g) => g + 1);
                    }}
                    className={`rounded-lg bg-navy px-4 py-2 text-sm font-medium text-white ${f ? "" : "opacity-50"}`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
