import { useEffect } from "react";
import { QuickAssessment } from "@/layouts/function-components/app/QuickAssessment";
import { ActionPlanning } from "@/layouts/function-components/app/screens/ActionPlanning";
import { Evidence } from "@/layouts/function-components/app/screens/Evidence";
import { Funding } from "@/layouts/function-components/app/screens/Funding";
import { MissionCommand } from "@/layouts/function-components/app/screens/MissionCommand";
import { Opportunities } from "@/layouts/function-components/app/screens/Opportunities";
import { Profiles } from "@/layouts/function-components/app/screens/Profiles";
import { Readiness } from "@/layouts/function-components/app/screens/Readiness";
import { Roadmap } from "@/layouts/function-components/app/screens/Roadmap";
import { Settings } from "@/layouts/function-components/app/screens/Settings";
import { DetailDrawer } from "@/layouts/function-components/app/shell/DetailDrawer";
import { Modals } from "@/layouts/function-components/app/shell/Modals";
import { NAV_SECTIONS, Sidebar } from "@/layouts/function-components/app/shell/Sidebar";
import { Topbar } from "@/layouts/function-components/app/shell/Topbar";
import { useStaggerCards } from "@/layouts/function-components/app/ui/hooks";
import { useStore } from "@/lib/store";

export const SCREEN_TITLES = Object.fromEntries(
  NAV_SECTIONS.flatMap((section) => section.items)
    .map((item) => [item.id, item.label])
    .concat([["settings", "Settings"]]),
);

const SCREENS = {
  "mission-command": MissionCommand,
  readiness: Readiness,
  opportunities: Opportunities,
  evidence: Evidence,
  funding: Funding,
  roadmap: Roadmap,
  "action-planning": ActionPlanning,
  profiles: Profiles,
  settings: Settings,
};

/** Workspace frame: sidebar, top bar, the current screen, and the shared drawer/modals. */
export default function AppShell({ screen = "mission-command" }) {
  const { ui, patchUi, closeOverlays } = useStore();
  const contentRef = useStaggerCards(screen);
  const Screen = SCREENS[screen] || MissionCommand;

  // Escape closes any open drawer, modal or quick assessment (as in the original app)
  useEffect(() => {
    const onKey = (event) => event.key === "Escape" && closeOverlays();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeOverlays]);

  return (
    <div className="h-dvh overflow-hidden bg-soft leading-normal text-ink dark:bg-[#090C12] dark:text-slate-100">
      <div className="flex h-full">
        {/* Sidebar: fixed column on large screens, slide-over panel on smaller ones */}
        <div
          className={`fixed inset-y-0 left-0 z-[65] bg-soft transition-transform duration-300 dark:bg-[#090C12] lg:static lg:z-auto lg:translate-x-0 ${ui.navOpen ? "translate-x-0 shadow-raised" : "-translate-x-full"}`}
        >
          <Sidebar />
        </div>
        {ui.navOpen && (
          <div className="drawer-backdrop lg:hidden" onClick={() => patchUi({ navOpen: false })} />
        )}
        <div className="flex min-w-0 flex-1 flex-col p-2 sm:p-3 lg:pl-0">
          <div className="app-canvas flex min-h-0 flex-1 flex-col overflow-auto rounded-[1.1rem] border border-line bg-page dark:border-slate-800 dark:bg-[#0C1017]">
            <Topbar title={SCREEN_TITLES[screen] || "Mission Command"} />
            <main ref={contentRef} className="page-enter flex-1 p-4 sm:p-6">
              <Screen />
            </main>
          </div>
        </div>
      </div>
      <DetailDrawer />
      <Modals />
      <QuickAssessment />
    </div>
  );
}
