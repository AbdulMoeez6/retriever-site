// Read-only roadmap table for the shared view (/shared-roadmap).
// Reads the workspace session so roadmap changes made in the workspace are reflected.
import { StatusChip } from "@/layouts/function-components/app/ui/primitives";
import { useStore } from "@/lib/store";

export default function SharedRoadmap() {
  const { roadmap, techName } = useStore();
  return (
    <div className="card overflow-x-auto leading-normal text-ink dark:text-slate-100">
      <table className="w-full min-w-[32rem] text-sm">
        <thead className="bg-soft text-left text-xs text-muted dark:bg-white/5 dark:text-slate-400">
          <tr>
            <th scope="col" className="px-4 py-2 font-medium">Item</th>
            <th scope="col" className="px-4 py-2 font-medium">Technology</th>
            <th scope="col" className="px-4 py-2 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {roadmap.map((item) => (
            <tr key={item.id} className="border-b border-line last:border-0 dark:border-slate-800">
              <td className="px-4 py-3 font-medium">{item.title}</td>
              <td className="px-4 py-3 text-muted dark:text-slate-400">{techName(item.technologyId)}</td>
              <td className="px-4 py-3">
                <StatusChip status={item.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
