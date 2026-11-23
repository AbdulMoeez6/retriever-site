// Live part of the homepage dashboard preview: greeting, KPI tiles and readiness chart,
// using the same components and sample data as the workspace.
import { KpiTile, ReadinessChart } from "@/layouts/function-components/app/ui/charts";
import { useGreeting } from "@/layouts/function-components/app/ui/hooks";
import { useStore } from "@/lib/store";

export default function DashboardPreview() {
  const { currentTech, kpis, profile } = useStore();
  const greeting = useGreeting();
  const tech = currentTech();
  const k = kpis();

  return (
    <div className="flex-1 p-4 leading-normal text-ink sm:p-5 dark:text-slate-100">
      <div className="text-lg font-semibold">
        {greeting}, {profile.name.split(" ")[0]}
      </div>
      <div className="mt-1 text-xs text-muted dark:text-slate-400">
        Mission Command · {tech.name} · Sample data
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <KpiTile compact label="Technologies" value={k.techs} />
        <KpiTile compact label="Average TRL" value={k.avgTrl} />
        <KpiTile compact label="Assessments" value={k.assessments} />
        <KpiTile compact label="Funding matches" value={k.funding} />
      </div>
      <div className="card mt-3 p-4">
        <div className="text-sm font-medium">Readiness over time</div>
        <div className="mt-1 text-xs text-muted dark:text-slate-400">
          Only human-reviewed evidence counts. TRL 1 to 9.
        </div>
        <ReadinessChart techId={tech.id} area height={150} />
      </div>
    </div>
  );
}
