import { useApp } from "../lib/store.jsx";

/** Technology picker for page headers. "Start a new technology" shows the empty pilot state. */
export default function TechSwitcher() {
  const { techs, ui, patchUi } = useApp();
  return (
    <label className="grid gap-1 text-sm">
      <span className="text-xs text-muted dark:text-slate-400">Technology</span>
      <select value={ui.techId} onChange={(e) => patchUi({ techId: e.target.value, profileStep: 0 })}
        className="h-9 min-w-[13rem] rounded-lg border border-line bg-white px-3 text-sm transition-colors hover:border-navy/40 dark:border-slate-700 dark:bg-[#161C27]">
        {techs.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
        <option value="none">{ui.techId === "none" ? "No technology yet" : "+ Start a new technology"}</option>
      </select>
    </label>
  );
}
