import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { NAV } from "../data/nav.js";
import { useApp } from "../lib/store.jsx";
import Icon from "./Icon.jsx";
import { Avatar, Mark } from "./ui.jsx";

const itemClass = ({ isActive }) =>
  `flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors ${isActive ? "bg-white font-medium shadow-sm dark:bg-white/10" : "text-muted hover:bg-white/70 dark:text-slate-300 dark:hover:bg-white/5"}`;

export default function Sidebar() {
  const { profile, patchUi } = useApp();
  const [userOpen, setUserOpen] = useState(false);
  const navigate = useNavigate();
  const signOut = () => { patchUi({ session: false, search: "", drawer: null, profileFocus: null }); navigate("/"); };

  return (
    <aside className="flex w-[15.5rem] shrink-0 flex-col px-3 py-3">
      <button type="button" onClick={() => setUserOpen((v) => !v)} className="mb-4 flex items-center gap-2 rounded-lg px-1 py-1 text-left hover:bg-white/60 dark:hover:bg-white/5">
        <Mark size={28} />
        <span className="min-w-0">
          <span className="block text-sm font-semibold leading-tight">Retriever</span>
          <span className="block text-xs text-muted dark:text-slate-400">Operations</span>
        </span>
      </button>
      <nav className="flex-1 overflow-auto" aria-label="Workspace">
        {NAV.map((group, gi) => (
          <div key={gi}>
            {group.section && <div className="mt-4 px-2 pb-1 text-[11px] uppercase tracking-wide text-muted dark:text-slate-500">{group.section}</div>}
            <div className="grid gap-0.5">
              {group.items.map((item) => (
                <NavLink key={item.id} to={`/app/${item.id}`} className={itemClass} onClick={() => item.id === "profiles" && patchUi({ profileFocus: null })}>
                  <Icon name={item.icon} /><span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>
      <div className="mt-4 grid gap-0.5">
        <NavLink to="/app/settings" className={itemClass}><Icon name="gear" /><span>Settings</span></NavLink>
        <button type="button" onClick={signOut} className={itemClass({ isActive: false })}><Icon name="signout" /><span>Sign out</span></button>
      </div>
      <div className="relative mt-3">
        <button type="button" onClick={() => setUserOpen((v) => !v)} className="flex w-full items-center gap-2 rounded-lg px-1 py-1 text-left hover:bg-white/60 dark:hover:bg-white/5">
          <Avatar name={profile.name} size={32} />
          <span className="min-w-0">
            <span className="block truncate text-sm font-medium">{profile.name}</span>
            <span className="block truncate text-xs text-muted dark:text-slate-400">{profile.email}</span>
          </span>
        </button>
        {userOpen && (
          <div className="card absolute bottom-12 left-0 right-0 p-1 text-sm">
            <button type="button" onClick={() => { setUserOpen(false); navigate("/app/settings"); }} className="block w-full rounded-md px-3 py-2 text-left hover:bg-soft dark:hover:bg-white/5">Settings</button>
            <button type="button" onClick={signOut} className="block w-full rounded-md px-3 py-2 text-left hover:bg-soft dark:hover:bg-white/5">Sign out</button>
          </div>
        )}
      </div>
    </aside>
  );
}
