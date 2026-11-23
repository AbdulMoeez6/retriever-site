import { useState, useEffect, useRef } from "react";
import { Icon } from "@/layouts/function-components/app/ui/Icon";
import { SampleDataBadge } from "@/layouts/function-components/app/ui/primitives";
import { useNavigate } from "@/lib/navigation";
import { useStore } from "@/lib/store";

export function Topbar({ title }) {
  const { ui, patchUi, notifications, theme, toggleTheme } = useStore(),
    [s, a] = useState(false),
    o = useRef(null),
    u = useRef(null),
    p = useNavigate();
  return (
    useEffect(() => {
      const f = (g) => {
          var x;
          ((g.metaKey || g.ctrlKey) &&
            g.key.toLowerCase() === "k" &&
            (g.preventDefault(), (x = o.current) == null || x.focus()),
            g.key === "Escape" && a(false));
        },
        E = (g) => {
          u.current && !u.current.contains(g.target) && a(false);
        };
      return (
        window.addEventListener("keydown", f),
        document.addEventListener("mousedown", E),
        () => {
          (window.removeEventListener("keydown", f),
            document.removeEventListener("mousedown", E));
        }
      );
    }, []),
    (
      <header className="flex items-center gap-3 border-b border-line px-3 py-2.5 dark:border-slate-800 sm:px-4">
        <button
          type="button"
          onClick={() => patchUi({ navOpen: true })}
          className="grid size-8 place-items-center rounded-md hover:bg-white dark:hover:bg-white/10 lg:hidden"
          aria-label="Open navigation"
        >
          <Icon name="menu" />
        </button>
        <div className="text-sm font-medium">{title}</div>
        <SampleDataBadge className="hidden sm:inline" />
        <div className="ms-auto flex items-center gap-2">
          <label className="relative hidden sm:block">
            <span className="sr-only">Search</span>
            <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted">
              <Icon name="search" />
            </span>
            <input
              ref={o}
              value={ui.search}
              onChange={(f) =>
                patchUi({
                  search: f.target.value,
                })
              }
              placeholder="Search…"
              className="h-8 w-56 rounded-lg border border-line bg-white pl-8 pr-10 text-sm outline-none focus:border-navy/50 focus:ring-2 focus:ring-navy/10 dark:border-slate-700 dark:bg-[#161C27]"
            />
            <kbd className="absolute right-2 top-1/2 -translate-y-1/2">K</kbd>
          </label>
          <div className="relative" ref={u}>
            <button
              type="button"
              onClick={() => a((f) => !f)}
              className="grid size-8 place-items-center rounded-md hover:bg-white dark:hover:bg-white/10"
              aria-label="Notifications"
              aria-expanded={s}
            >
              <Icon name="bell" />
            </button>
            {s && (
              <div
                className="card absolute right-0 z-30 mt-2 w-[min(20rem,calc(100vw-2rem))] p-2"
                style={{
                  animation: "pop .2s ease-out",
                }}
              >
                <div className="px-2 py-1 text-xs font-medium text-muted dark:text-slate-400">
                  Notifications
                </div>
                {notifications.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => {
                      (a(false),
                        f.techId &&
                          patchUi({
                            techId: f.techId,
                          }),
                        p(`/app/${f.route}`));
                    }}
                    className="block w-full rounded-md px-2 py-2 text-left hover:bg-soft dark:hover:bg-white/5"
                  >
                    <div className="text-sm font-medium">{f.title}</div>
                    <div className="text-xs text-muted dark:text-slate-400">
                      {f.body}
                    </div>
                    <div className="mt-0.5 text-[11px] text-muted dark:text-slate-500">
                      {f.time}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className="grid size-8 place-items-center rounded-md hover:bg-white dark:hover:bg-white/10"
            aria-label="Toggle colour theme"
          >
            <Icon name={theme === "dark" ? "sun" : "moon"} />
          </button>
        </div>
      </header>
    )
  );
}
