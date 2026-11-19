import { useApp } from "../lib/store.jsx";

export default function TechSwitcher() {
  const { techs, ui, patchUi } = useApp();
  return (
    <label className="grid gap-1 text-sm">
      <span className="text-xs text-muted dark:text-slate-400">Technology</span>
      <select value={ui.techId} onChange={(e) => patchUi({ techId: e.target.value })}
        className="h-9 min-w-[13rem] rounded-lg border border-line bg-white px-3 text-sm dark:border-slate-700 dark:bg-[#161C27]">
        {techs.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
      </select>
    </label>
  );
}
