import { useState } from "react";
import { Icon } from "@/layouts/function-components/app/ui/Icon";
import {
  Avatar,
  LogoMark,
} from "@/layouts/function-components/app/ui/primitives";
import { NavLink, useNavigate } from "@/lib/navigation";
import { useStore } from "@/lib/store";

export const NAV_SECTIONS = [
  {
    section: null,
    items: [
      {
        id: "mission-command",
        label: "Mission Command",
        icon: "command",
      },
      {
        id: "readiness",
        label: "Readiness",
        icon: "shield",
      },
    ],
  },
  {
    section: "Workspace",
    items: [
      {
        id: "opportunities",
        label: "Opportunities",
        icon: "search",
      },
      {
        id: "evidence",
        label: "Evidence",
        icon: "doc",
      },
      {
        id: "funding",
        label: "Funding",
        icon: "fund",
      },
      {
        id: "roadmap",
        label: "Roadmap",
        icon: "map",
      },
      {
        id: "action-planning",
        label: "Action planning",
        icon: "plan",
      },
      {
        id: "profiles",
        label: "Profiles",
        icon: "people",
      },
    ],
  },
];

export const navItemClass = ({ isActive }) =>
  `flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors ${isActive ? "bg-white font-medium shadow-sm dark:bg-white/10" : "text-muted hover:bg-white/70 dark:text-slate-300 dark:hover:bg-white/5"}`;

export function Sidebar() {
  const { profile, patchUi } = useStore(),
    [t, n] = useState(false),
    r = useNavigate(),
    l = () => {
      (patchUi({
        session: false,
        search: "",
        drawer: null,
        profileFocus: null,
      }),
        r("/"));
    };
  return (
    <aside className="flex h-full w-[15.5rem] shrink-0 flex-col px-3 py-3">
      <button
        type="button"
        onClick={() => n((s) => !s)}
        className="mb-4 flex items-center gap-2 rounded-lg px-1 py-1 text-left hover:bg-white/60 dark:hover:bg-white/5"
      >
        <LogoMark size={28} />
        <span className="min-w-0">
          <span className="block text-sm font-semibold leading-tight">
            Retriever
          </span>
          <span className="block text-xs text-muted dark:text-slate-400">
            Operations
          </span>
        </span>
      </button>
      <nav className="flex-1 overflow-auto" aria-label="Workspace">
        {NAV_SECTIONS.map((s, a) => (
          <div key={a}>
            {s.section && (
              <div className="mt-4 px-2 pb-1 text-[11px] uppercase tracking-wide text-muted dark:text-slate-500">
                {s.section}
              </div>
            )}
            <div className="grid gap-0.5">
              {s.items.map((o) => (
                <NavLink
                  key={o.id}
                  to={`/app/${o.id}`}
                  className={navItemClass}
                  onClick={() =>
                    o.id === "profiles" &&
                    patchUi({
                      profileFocus: null,
                    })
                  }
                >
                  <Icon name={o.icon} />
                  <span>{o.label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>
      <div className="mt-4 grid gap-0.5">
        <NavLink to="/app/settings" className={navItemClass}>
          <Icon name="gear" />
          <span>Settings</span>
        </NavLink>
        <button
          type="button"
          onClick={l}
          className={navItemClass({
            isActive: false,
          })}
        >
          <Icon name="signout" />
          <span>Sign out</span>
        </button>
      </div>
      <div className="relative mt-3">
        <button
          type="button"
          onClick={() => n((s) => !s)}
          className="flex w-full items-center gap-2 rounded-lg px-1 py-1 text-left hover:bg-white/60 dark:hover:bg-white/5"
        >
          <Avatar name={profile.name} size={32} />
          <span className="min-w-0">
            <span className="block truncate text-sm font-medium">
              {profile.name}
            </span>
            <span className="block truncate text-xs text-muted dark:text-slate-400">
              {profile.email}
            </span>
          </span>
        </button>
        {t && (
          <div className="card absolute bottom-12 left-0 right-0 p-1 text-sm">
            <button
              type="button"
              onClick={() => {
                (n(false), r("/app/settings"));
              }}
              className="block w-full rounded-md px-3 py-2 text-left hover:bg-soft dark:hover:bg-white/5"
            >
              Settings
            </button>
            <button
              type="button"
              onClick={l}
              className="block w-full rounded-md px-3 py-2 text-left hover:bg-soft dark:hover:bg-white/5"
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
