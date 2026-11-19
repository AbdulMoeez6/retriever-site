import { Link } from "react-router-dom";
import Icon from "../components/Icon.jsx";
import { Logo, SampleBadge, StatusChip } from "../components/ui.jsx";
import { useApp } from "../lib/store.jsx";

export default function SharedRoadmap() {
  const { roadmap, techName, theme, toggleTheme } = useApp();
  return (
    <div className="min-h-screen bg-page text-ink dark:bg-[#0C1017] dark:text-slate-100">
      <header className="border-b border-line bg-white/80 dark:border-slate-800 dark:bg-[#0C1017]/80">
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center gap-3 px-4">
          <Link to="/"><Logo /></Link>
          <span className="text-sm font-medium">Shared roadmap</span>
          <SampleBadge />
          <div className="ms-auto flex items-center gap-2">
            <button type="button" onClick={toggleTheme} className="grid size-8 place-items-center rounded-md hover:bg-soft dark:hover:bg-white/10" aria-label="Toggle colour theme"><Icon name={theme === "dark" ? "sun" : "moon"} /></button>
            <Link to="/signin" className="rounded-lg bg-navy px-3 py-1.5 text-sm font-medium text-white">Sign in</Link>
          </div>
        </div>
      </header>
      <main className="page-enter mx-auto w-full max-w-5xl px-4 py-8">
        <h1 className="text-2xl font-semibold">Shared roadmap</h1>
        <p className="mt-1 text-sm text-muted dark:text-slate-400">A read-only view of the roadmap. Sample data only.</p>
        <div className="card mt-6 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-soft text-left text-xs text-muted dark:bg-white/5 dark:text-slate-400"><tr><th className="px-4 py-2 font-medium">Item</th><th className="px-4 py-2 font-medium">Technology</th><th className="px-4 py-2 font-medium">Status</th></tr></thead>
            <tbody>
              {roadmap.map((r) => (
                <tr key={r.id} className="border-b border-line last:border-0 dark:border-slate-800">
                  <td className="px-4 py-3 font-medium">{r.title}</td>
                  <td className="px-4 py-3 text-muted dark:text-slate-400">{techName(r.technologyId)}</td>
                  <td className="px-4 py-3"><StatusChip status={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
