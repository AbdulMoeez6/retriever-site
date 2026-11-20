import { useApp } from "../../lib/store.jsx";
import { ORG, ROLES } from "../../data/pilotData.js";
import Icon from "../../components/Icon.jsx";
import { Avatar, Chip, PageHeader, btnPrimary } from "../../components/ui.jsx";

export default function Team() {
  const { team, patchUi, patchData, toast } = useApp();
  const used = team.members.length;
  const full = used >= ORG.seats;
  const setRole = (id, role) => {
    patchData((d) => ({ team: { ...d.team, members: d.team.members.map((m) => (m.id === id ? { ...m, role } : m)) } }));
    toast(`Role updated to ${role} (demo)`);
  };
  return (
    <div className="flex flex-col gap-5">
      <PageHeader title="Team" sub="People in the Acme Labs workspace, their roles and recent activity." />
      <div className="card flex flex-wrap items-center justify-between gap-3 p-4">
        <div className="w-64">
          <div className="flex justify-between text-xs text-muted dark:text-slate-400"><span>Seats</span><span className="font-mono">{used} of {ORG.seats} used</span></div>
          <div className="progress mt-1.5"><span style={{ width: `${(used / ORG.seats) * 100}%` }} /></div>
        </div>
        <button type="button" onClick={() => (full ? toast("All seats are in use. Remove an invite to add someone else.") : patchUi({ modal: "invite" }))} className={btnPrimary}><Icon name="plus" /> Invite teammate</button>
      </div>
      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <div className="flex flex-col gap-5">
          <section className="card">
            <h2 className="border-b border-line px-5 py-3 text-sm font-medium dark:border-slate-800">Team members</h2>
            <ul>
              {team.members.map((m) => (
                <li key={m.id} className="row-hover flex flex-wrap items-center gap-3 border-b border-line px-5 py-3 last:border-0 dark:border-slate-800">
                  <Avatar name={m.name} size={34} />
                  <div className="min-w-0 flex-1"><div className="text-sm font-medium">{m.name}</div><div className="truncate text-xs text-muted dark:text-slate-400">{m.email}</div></div>
                  {m.role === "Owner" ? <Chip label="Owner" tone="navy" /> : (
                    <select value={m.role} onChange={(e) => setRole(m.id, e.target.value)} aria-label={`Role for ${m.name}`} className="field py-1 text-xs">
                      {["Admin", "Member"].map((r) => <option key={r}>{r}</option>)}
                    </select>
                  )}
                  <Chip label={m.status} tone={m.status === "Active" ? "success" : "warn"} />
                  {m.status === "Invited" && (
                    <button type="button" onClick={() => { patchData((d) => ({ team: { ...d.team, members: d.team.members.filter((x) => x.id !== m.id) } })); toast("Invite withdrawn (demo)"); }} className="text-xs text-muted underline-offset-2 hover:underline dark:text-slate-400">Withdraw</button>
                  )}
                </li>
              ))}
            </ul>
          </section>
          <section className="card p-5">
            <h2 className="text-sm font-medium">Roles</h2>
            <dl className="mt-2">
              {ROLES.map((r) => (
                <div key={r.id} className="border-b border-line py-3 last:border-0 dark:border-slate-800">
                  <div className="flex justify-between text-sm"><dt className="font-medium">{r.id}</dt><span className="text-xs text-muted dark:text-slate-400">{r.scope}</span></div>
                  <dd className="mt-1 text-xs text-muted dark:text-slate-400">{r.body}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
        <section className="card h-fit p-5">
          <h2 className="text-sm font-medium">Activity</h2>
          <p className="text-xs text-muted dark:text-slate-400">Recent actions across this workspace</p>
          <ul className="mt-3">
            {team.activity.map((a) => (
              <li key={a.id} className="flex gap-2 border-b border-line py-3 last:border-0 dark:border-slate-800">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-navy/60" />
                <div><div className="text-sm"><span className="font-medium">{a.who}</span> {a.what}</div><div className="text-xs text-muted dark:text-slate-400">{a.when}</div></div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
