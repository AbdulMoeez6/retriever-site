import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../lib/store.jsx";
import Icon from "./Icon.jsx";
import { Avatar, SampleBadge } from "./ui.jsx";

/** Top bar: page title and subtitle, notifications, theme and account menu. */
export default function Topbar({ title, sub, badge }) {
  const { patchUi, notifications, theme, toggleTheme, profile } = useApp();
  const [open, setOpen] = useState(null); // "bell" | "user" | null
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setOpen(null); };
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(null); };
    window.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => { window.removeEventListener("keydown", onKey); document.removeEventListener("mousedown", onClick); };
  }, []);
  const go = (route) => { setOpen(null); navigate(`/app/${route}`); };
  const signOut = () => { setOpen(null); patchUi({ session: false, search: "" }); navigate("/"); };

  return (
    <header className="flex items-center gap-3 border-b border-line bg-white/80 px-6 py-3.5 dark:border-slate-800 dark:bg-transparent">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
          {badge && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-800 dark:bg-amber-500/15 dark:text-amber-300">{badge}</span>}
          <SampleBadge />
        </div>
        {sub && <p className="truncate text-xs text-muted dark:text-slate-400">{sub}</p>}
      </div>
      <div className="ms-auto flex items-center gap-2" ref={ref}>
        <div className="relative">
          <button type="button" onClick={() => setOpen((v) => (v === "bell" ? null : "bell"))} className="grid size-8 place-items-center rounded-lg border border-line bg-white hover:bg-soft dark:border-slate-700 dark:bg-transparent dark:hover:bg-white/10" aria-label="Notifications" aria-expanded={open === "bell"}><Icon name="bell" /></button>
          {open === "bell" && (
            <div className="card absolute right-0 z-30 mt-2 w-80 p-2" style={{ animation: "pop .2s ease-out" }}>
              <div className="px-2 py-1 text-xs font-medium text-muted dark:text-slate-400">Notifications</div>
              {notifications.map((n) => (
                <button type="button" key={n.id} onClick={() => { if (n.techId) patchUi({ techId: n.techId }); go(n.route); }}
                  className="block w-full rounded-md px-2 py-2 text-left hover:bg-soft dark:hover:bg-white/5">
                  <div className="text-sm font-medium">{n.title}</div>
                  <div className="text-xs text-muted dark:text-slate-400">{n.body}</div>
                  <div className="mt-0.5 text-[11px] text-muted dark:text-slate-500">{n.time}</div>
                </button>
              ))}
            </div>
          )}
        </div>
        <button type="button" onClick={toggleTheme} className="grid size-8 place-items-center rounded-lg hover:bg-soft dark:hover:bg-white/10" aria-label="Toggle colour theme">
          <Icon name={theme === "dark" ? "sun" : "moon"} />
        </button>
        <div className="relative">
          <button type="button" onClick={() => setOpen((v) => (v === "user" ? null : "user"))} aria-label="Account menu" aria-expanded={open === "user"} className="rounded-lg">
            <Avatar name={profile.name} size={32} />
          </button>
          {open === "user" && (
            <div className="card absolute right-0 z-30 mt-2 w-52 p-1 text-sm" style={{ animation: "pop .2s ease-out" }}>
              <div className="px-3 py-2"><div className="font-medium">{profile.name}</div><div className="truncate text-xs text-muted dark:text-slate-400">{profile.email}</div></div>
              <button type="button" onClick={() => go("team")} className="block w-full rounded-md px-3 py-2 text-left hover:bg-soft dark:hover:bg-white/5">Team</button>
              <button type="button" onClick={() => go("settings")} className="block w-full rounded-md px-3 py-2 text-left hover:bg-soft dark:hover:bg-white/5">Settings</button>
              <button type="button" onClick={signOut} className="block w-full rounded-md px-3 py-2 text-left hover:bg-soft dark:hover:bg-white/5">Log out</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
