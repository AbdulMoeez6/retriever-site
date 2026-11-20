import { NavLink, useNavigate } from "react-router-dom";
import { NAV } from "../data/nav.js";
import { ORG } from "../data/pilotData.js";
import { useApp } from "../lib/store.jsx";
import Icon from "./Icon.jsx";
import { SidebarTechSwitcher } from "./TechSwitcher.jsx";
import { Avatar, Mark } from "./ui.jsx";

const itemClass = ({ isActive }) =>
  `flex w-full items-start gap-2.5 rounded-lg px-2.5 py-1.5 text-sm transition-colors ${isActive ? "bg-white font-medium text-ink shadow-sm ring-1 ring-line dark:bg-white/10 dark:text-white dark:ring-slate-700" : "text-ink/80 hover:bg-white/70 dark:text-slate-300 dark:hover:bg-white/5"}`;

export default function Sidebar() {
  const { profile, patchUi, hasTech } = useApp();
  const navigate = useNavigate();
  const signOut = () => { patchUi({ session: false, search: "", drawer: null, profileFocus: null }); navigate("/"); };
  // Readiness needs a technology; without one, explain in a modal instead of opening an empty page.
  const onItem = (e, id) => {
    if (id === "readiness" && !hasTech) { e.preventDefault(); patchUi({ modal: "readiness" }); }
  };

  return (
    <aside className="flex w-[15.5rem] shrink-0 flex-col overflow-hidden px-3 py-3">
      <button type="button" onClick={() => navigate("/app/mission-command")} className="mb-3 flex items-center gap-2.5 rounded-lg px-1 py-1 text-left hover:bg-white/60 dark:hover:bg-white/5">
        <Mark size={34} />
        <span className="min-w-0">
          <span className="block text-sm font-semibold leading-tight">White Lab Retriever</span>
          <span className="block font-mono text-[10px] font-medium tracking-[0.14em] text-[#2F5BD3] dark:text-[#9DB6F5]">INNOVATION OS</span>
        </span>
      </button>
      <SidebarTechSwitcher />
      <nav className="mt-3 flex-1 overflow-y-auto border-t border-line pt-3 dark:border-slate-800" aria-label="Workspace">
        {NAV.map((group, gi) => (
          <div key={gi}>
            {group.section && <div className="mt-4 px-2.5 pb-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted dark:text-slate-500">{group.section}</div>}
            <div className="grid gap-0.5">
              {group.items.map((item) => (
                <NavLink key={item.id} to={`/app/${item.id}`} className={itemClass} onClick={(e) => onItem(e, item.id)}>
                  <Icon name={item.icon} className="mt-0.5 size-4 shrink-0" />
                  <span className="min-w-0">
                    <span className="block leading-snug">{item.label}</span>
                    {item.sub && <span className="block text-[11px] font-normal leading-snug text-muted dark:text-slate-400">{item.sub}</span>}
                  </span>
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>
      <div className="mt-3 grid gap-0.5 border-t border-line pt-3 dark:border-slate-800">
        <button type="button" onClick={signOut} className={itemClass({ isActive: false })}><Icon name="signout" className="mt-0.5 size-4" /><span>Log out</span></button>
        <button type="button" onClick={() => navigate("/app/settings")} className="mt-1 flex w-full items-center gap-2.5 rounded-lg px-1.5 py-1.5 text-left hover:bg-white/60 dark:hover:bg-white/5" aria-label="Workspace settings">
          <Avatar name={profile.name} size={32} />
          <span className="min-w-0">
            <span className="flex items-center gap-1.5 text-sm font-medium">{ORG.name} <span className="rounded-full bg-[#EEF2FC] px-1.5 text-[10px] font-medium text-[#2F5BD3] dark:bg-white/10 dark:text-[#9DB6F5]">{ORG.plan}</span></span>
            <span className="block truncate text-xs text-muted dark:text-slate-400">{profile.name}</span>
          </span>
        </button>
      </div>
    </aside>
  );
}
