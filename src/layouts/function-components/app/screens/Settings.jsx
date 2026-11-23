import { percent } from "@/lib/format";
import { Link, useNavigate } from "@/lib/navigation";
import { useStore } from "@/lib/store";

export function UsageMeter({ label, used, limit }) {
  const n = percent(used, limit),
    r = n >= 80;
  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between text-sm">
        <span>{label}</span>
        <span className="font-mono text-xs">
          {used}
          {" of "}
          {limit}
        </span>
      </div>
      <div className="progress">
        <span
          style={{
            width: `${Math.min(n, 100)}%`,
            ...(r
              ? {
                  background: "#B45309",
                }
              : {}),
          }}
        />
      </div>
      {r && used >= limit && (
        <p className="text-sm text-amber-800 dark:text-amber-300">
          {"This workspace has reached its "}
          {label.toLowerCase()}
          {" limit. "}
          <Link
            to="/book-demo?intent=pilot"
            className="underline underline-offset-2"
          >
            Contact
          </Link>
          {" the team to talk about a pilot."}
        </p>
      )}
      {r && used < limit && (
        <p className="text-sm text-amber-800 dark:text-amber-300">
          {"This workspace is at "}
          {n}
          {" percent of its "}
          {label.toLowerCase()}
          {" limit."}
        </p>
      )}
    </div>
  );
}

export function Settings() {
  const { usage, theme, toggleTheme, patchUi } = useStore(),
    r = useNavigate();
  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted dark:text-slate-400">
          Plan and usage for this organization. No prices are shown.
        </p>
      </div>
      <section className="card grid gap-5 p-5">
        <div>
          <div className="text-xs text-muted dark:text-slate-400">
            Current plan
          </div>
          <div className="mt-1 text-lg font-semibold">Founding pilot</div>
          <p className="mt-1 text-xs text-muted dark:text-slate-400">
            Invite only. Usage is shown as used of the limit, with no price.
          </p>
        </div>
        <UsageMeter
          label="Assessments"
          used={usage.assessmentsUsed}
          limit={usage.assessmentsLimit}
        />
        <UsageMeter
          label="Documents"
          used={usage.documentsUsed}
          limit={usage.documentsLimit}
        />
      </section>
      <div className="card flex items-center justify-between p-5">
        <div>
          <div className="text-sm font-medium">Appearance</div>
          <div className="text-xs text-muted dark:text-slate-400">
            Switch between light and dark.
          </div>
        </div>
        <button
          type="button"
          onClick={toggleTheme}
          className="rounded-lg border border-line px-3 py-1.5 text-sm dark:border-slate-700"
        >
          {theme === "dark" ? "Use light mode" : "Use dark mode"}
        </button>
      </div>
      <button
        type="button"
        onClick={() => {
          (patchUi({
            session: false,
            search: "",
          }),
            r("/"));
        }}
        className="rounded-lg border border-line px-4 py-2 text-sm dark:border-slate-700"
      >
        Sign out
      </button>
    </div>
  );
}
