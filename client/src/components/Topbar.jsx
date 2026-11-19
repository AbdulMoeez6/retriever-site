import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../lib/store.jsx";
import Icon from "./Icon.jsx";
import { SampleBadge } from "./ui.jsx";

export default function Topbar({ title }) {
  const { ui, patchUi, notifications, theme, toggleTheme } = useApp();
  const [bellOpen, setBellOpen] = useState(false);
  const searchRef = useRef(null);
  const bellRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); searchRef.current?.focus(); }
      if (e.key === "Escape") setBellOpen(false);
    };
    const onClick = (e) => { if (bellRef.current && !bellRef.current.contains(e.target)) setBellOpen(false); };
    window.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => { window.removeEventListener("keydown", onKey); document.removeEventListener("mousedown", onClick); };
  }, []);

  return (
    <header className="flex items-center gap-3 border-b border-line px-4 py-2.5 dark:border-slate-800">
      <div className="text-sm font-medium">{title}</div>
      <SampleBadge />
      <div className="ms-auto flex items-center gap-2">
        <label className="relative hidden sm:block">
          <span className="sr-only">Search</span>
          <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted"><Icon name="search" /></span>
          <input ref={searchRef} value={ui.search} onChange={(e) => patchUi({ search: e.target.value })} placeholder="Search…"
            className="h-8 w-56 rounded-lg border border-line bg-white pl-8 pr-10 text-sm outline-none focus:border-navy/50 focus:ring-2 focus:ring-navy/10 dark:border-slate-700 dark:bg-[#161C27]" />
          <kbd className="absolute right-2 top-1/2 -translate-y-1/2">K</kbd>
        </label>
        <div className="relative" ref={bellRef}>
          <button type="button" onClick={() => setBellOpen((v) => !v)} className="grid size-8 place-items-center rounded-md hover:bg-white dark:hover:bg-white/10" aria-label="Notifications" aria-expanded={bellOpen}><Icon name="bell" /></button>
          {bellOpen && (
            <div className="card absolute right-0 z-30 mt-2 w-80 p-2" style={{ animation: "pop .2s ease-out" }}>
              <div className="px-2 py-1 text-xs font-medium text-muted dark:text-slate-400">Notifications</div>
              {notifications.map((n) => (
                <button type="button" key={n.id} onClick={() => { setBellOpen(false); if (n.techId) patchUi({ techId: n.techId }); navigate(`/app/${n.route}`); }}
                  className="block w-full rounded-md px-2 py-2 text-left hover:bg-soft dark:hover:bg-white/5">
                  <div className="text-sm font-medium">{n.title}</div>
                  <div className="text-xs text-muted dark:text-slate-400">{n.body}</div>
                  <div className="mt-0.5 text-[11px] text-muted dark:text-slate-500">{n.time}</div>
                </button>
              ))}
            </div>
          )}
        </div>
        <button type="button" onClick={toggleTheme} className="grid size-8 place-items-center rounded-md hover:bg-white dark:hover:bg-white/10" aria-label="Toggle colour theme">
          <Icon name={theme === "dark" ? "sun" : "moon"} />
        </button>
      </div>
    </header>
  );
}
