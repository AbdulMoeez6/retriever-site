import { Outlet, useLocation } from "react-router-dom";
import { PAGE_META } from "../data/nav.js";
import { useApp } from "../lib/store.jsx";
import { useStaggerCards } from "../lib/motion.js";
import Sidebar from "./Sidebar.jsx";
import Topbar from "./Topbar.jsx";
import { Drawer, Modals } from "./Overlays.jsx";
import QuickAssessment from "./QuickAssessment.jsx";
import { ShellContext } from "./ui.jsx";

/** Dashboard shell: sidebar + rounded canvas with a titled top bar. */
export default function AppLayout() {
  const app = useApp();
  const { pathname } = useLocation();
  const key = pathname.split("/")[2] || "mission-command";
  const meta = PAGE_META[key] || PAGE_META["mission-command"];
  const sub = typeof meta.sub === "function" ? meta.sub(app) : meta.sub;
  const ref = useStaggerCards(pathname);
  return (
    <div className="h-screen overflow-hidden bg-soft text-ink dark:bg-[#090C12] dark:text-slate-100">
      <div className="flex h-full">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col py-3 pr-3">
          <div className="app-canvas flex min-h-0 flex-1 flex-col overflow-auto rounded-[1.1rem] border border-line bg-page dark:border-slate-800 dark:bg-[#0C1017]">
            <Topbar title={meta.title} sub={sub} badge={meta.badge} />
            <ShellContext.Provider value={true}>
              <div key={pathname} ref={ref} className="page-enter flex-1 p-6"><Outlet /></div>
            </ShellContext.Provider>
          </div>
        </div>
      </div>
      <Drawer />
      <Modals />
      <QuickAssessment />
    </div>
  );
}
