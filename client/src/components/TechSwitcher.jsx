import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../lib/store.jsx";
import Icon from "./Icon.jsx";

/** Sidebar technology switcher. "Start a new technology" shows the empty pilot state. */
export function SidebarTechSwitcher() {
  const { techs, ui, patchUi, hasTech, techName } = useApp();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    const onDown = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);
  const pick = (id) => { setOpen(false); patchUi({ techId: id, profileStep: 0 }); };
  return (
    <div className="relative" ref={ref}>
      <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-haspopup="listbox"
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-line bg-white px-3 py-2 text-left text-sm font-medium shadow-sm dark:border-slate-700 dark:bg-[#161C27]">
        <span className="truncate">{hasTech ? techName(ui.techId) : "No technology yet"}</span>
        <Icon name="chevron" className="size-4 shrink-0 text-muted" />
      </button>
      {open && (
        <div className="card absolute left-0 right-0 z-30 mt-1 p-1 text-sm" role="listbox" style={{ animation: "pop .2s ease-out" }}>
          {techs.map((t) => (
            <button type="button" role="option" aria-selected={t.id === ui.techId} key={t.id} onClick={() => pick(t.id)}
              className={`flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left hover:bg-soft dark:hover:bg-white/5 ${t.id === ui.techId ? "font-medium" : ""}`}>
              <span className="truncate">{t.name}</span>{t.id === ui.techId && <Icon name="check" className="size-3.5" />}
            </button>
          ))}
          <div className="my-1 border-t border-line dark:border-slate-700" />
          <button type="button" onClick={() => { pick("none"); navigate("/app/mission-command"); }} className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-muted hover:bg-soft dark:text-slate-400 dark:hover:bg-white/5">
            <Icon name="plus" className="size-3.5" /> Start a new technology
          </button>
        </div>
      )}
    </div>
  );
}

export default function TechSwitcher() {
  const { techs, ui, patchUi } = useApp();
  return (
    <label className="grid gap-1 text-sm">
      <span className="text-xs text-muted dark:text-slate-400">Technology</span>
      <select value={ui.techId} onChange={(e) => patchUi({ techId: e.target.value })}
        className="h-9 min-w-[13rem] rounded-lg border border-line bg-white px-3 text-sm dark:border-slate-700 dark:bg-[#161C27]">
        {ui.techId === "none" && <option value="none">No technology yet</option>}
        {techs.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
      </select>
    </label>
  );
}
