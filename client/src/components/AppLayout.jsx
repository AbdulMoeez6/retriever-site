import { Outlet, useLocation } from "react-router-dom";
import { PAGE_META } from "../data/nav.js";
import { useStaggerCards } from "../lib/motion.js";
import Sidebar from "./Sidebar.jsx";
import Topbar from "./Topbar.jsx";
import { Drawer, Modals } from "./Overlays.jsx";
import QuickAssessment from "./QuickAssessment.jsx";


/** Dashboard shell: sidebar + rounded canvas with top bar. */
export default function AppLayout() {
  const { pathname } = useLocation();
  const key = pathname.split("/")[2] || "mission-command";
  const ref = useStaggerCards(pathname);
  return (
    <div className="h-screen overflow-hidden bg-soft text-ink dark:bg-[#090C12] dark:text-slate-100">
      <div className="flex h-full">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col py-3 pr-3">
          <div className="app-canvas flex min-h-0 flex-1 flex-col overflow-auto rounded-[1.1rem] border border-line bg-page dark:border-slate-800 dark:bg-[#0C1017]">
            <Topbar title={(PAGE_META[key] || PAGE_META["mission-command"]).title} />
            <div key={pathname} ref={ref} className="page-enter flex-1 p-6"><Outlet /></div>
          </div>
        </div>
      </div>
      <Drawer />
      <Modals />
      <QuickAssessment />
    </div>
  );
}
