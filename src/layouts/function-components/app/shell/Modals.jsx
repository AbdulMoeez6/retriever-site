import { withBase } from "@/lib/utils/url";
import { Icon } from "@/layouts/function-components/app/ui/Icon";
import { CloseButton } from "@/layouts/function-components/app/ui/primitives";
import { makeId } from "@/lib/format";
import { Link, useNavigate } from "@/lib/navigation";
import { useStore } from "@/lib/store";

export function ModalShell({
  title,
  onClose,
  onSubmit,
  children,
  footer,
  sub,
}) {
  const Panel = onSubmit ? "form" : "div";
  return (
    <>
      <div className="modal-backdrop" onClick={onClose} />
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <Panel className="modal-panel p-6" onSubmit={onSubmit}>
          <div className="flex items-start justify-between">
            <div>
              <h2 id="modal-title" className="text-lg font-semibold">
                {title}
              </h2>
              {sub && (
                <p className="mt-1 text-sm text-muted dark:text-slate-400">
                  {sub}
                </p>
              )}
            </div>
            <CloseButton onClick={onClose} />
          </div>
          {children}
          <div className="mt-6 flex justify-end gap-2">{footer}</div>
        </Panel>
      </div>
    </>
  );
}

export const Field = ({ label, children }) => (
  <label className="grid gap-1 text-sm">
    {label}
    {children}
  </label>
);

export const CancelButton = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="rounded-lg border border-line px-4 py-2 text-sm dark:border-slate-700"
  >
    Cancel
  </button>
);

export const SubmitButton = ({ children }) => (
  <button
    type="submit"
    className="rounded-lg bg-navy px-4 py-2 text-sm font-medium text-white hover:bg-navy-700"
  >
    {children}
  </button>
);

export function Modals() {
  const { ui, patchUi, patchData, techs, toast } = useStore(),
    l = useNavigate(),
    s = () =>
      patchUi({
        modal: null,
      });
  if (!ui.modal) return null;
  if (ui.modal === "action") {
    const a = (o) => {
      o.preventDefault();
      const u = new FormData(o.currentTarget);
      (patchData((p) => ({
        actions: [
          {
            id: makeId("p"),
            title: String(u.get("title")).trim(),
            technologyId: String(u.get("technologyId") || ui.techId),
            owner: String(u.get("owner")).trim(),
            due: String(u.get("due") || "TBC") || "TBC",
            status: "Open",
          },
          ...p.actions,
        ],
      })),
        s(),
        toast("Action added (demo)"));
    };
    return (
      <ModalShell
        title="Add action"
        onClose={s}
        onSubmit={a}
        footer={
          <>
            <CancelButton onClick={s} />
            <SubmitButton>Add action</SubmitButton>
          </>
        }
      >
        <div className="mt-5 grid gap-3">
          <Field label="Action">
            <input name="title" required className="field" />
          </Field>
          <Field label="Technology">
            <select
              name="technologyId"
              defaultValue={ui.techId}
              className="field"
            >
              {techs.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Owner">
            <input name="owner" required className="field" />
          </Field>
          <Field label="Due">
            <input name="due" placeholder="10 Dec 2026" className="field" />
          </Field>
        </div>
      </ModalShell>
    );
  }
  if (ui.modal === "profile") {
    const a = (o) => {
      o.preventDefault();
      const u = new FormData(o.currentTarget),
        p = makeId("t"),
        f = [null, null, null, null, null, null];
      (patchData((E) => ({
        techs: [
          ...E.techs,
          {
            id: p,
            name: String(u.get("name")).trim(),
            org: String(u.get("org")).trim(),
            owner: String(u.get("owner")).trim(),
            trl: null,
            mrl: null,
            irl: null,
            summary: "Newly added sample profile.",
          },
        ],
        history: {
          ...E.history,
          [p]: {
            TRL: f,
            MRL: f,
            IRL: f,
          },
        },
      })),
        patchUi({
          modal: null,
          techId: p,
        }),
        toast("Profile added (demo)"));
    };
    return (
      <ModalShell
        title="New technology profile"
        onClose={s}
        onSubmit={a}
        footer={
          <>
            <CancelButton onClick={s} />
            <SubmitButton>Add profile</SubmitButton>
          </>
        }
      >
        <div className="mt-5 grid gap-3">
          <Field label="Technology">
            <input name="name" required className="field" />
          </Field>
          <Field label="Organization">
            <input name="org" required className="field" />
          </Field>
          <Field label="Owner">
            <input name="owner" required className="field" />
          </Field>
        </div>
      </ModalShell>
    );
  }
  if (ui.modal === "upload") {
    const a = (o) => {
      o.preventDefault();
      const u = new FormData(o.currentTarget);
      (patchData((p) => ({
        docs: [
          {
            id: makeId("d"),
            name: String(u.get("name")).trim(),
            type: "doc",
            technologyId: String(u.get("technologyId") || ui.techId),
            reviewed: false,
            reviewer: "",
            uploaded: "19 Nov 2026",
            excerpt:
              "Added in this sample workspace. It does not count toward readiness until it is human-reviewed.",
          },
          ...p.docs,
        ],
        usage: {
          ...p.usage,
          documentsUsed: p.usage.documentsUsed + 1,
        },
      })),
        s(),
        toast(
          "Document added (demo). It does not count until it is human-reviewed.",
        ));
    };
    return (
      <ModalShell
        title="Upload document"
        sub="Added to this sample workspace only. It will not count toward readiness until it is human-reviewed."
        onClose={s}
        onSubmit={a}
        footer={
          <>
            <CancelButton onClick={s} />
            <SubmitButton>Add document</SubmitButton>
          </>
        }
      >
        <div className="mt-5 grid gap-3">
          <Field label="Document name">
            <input name="name" required className="field" />
          </Field>
          <Field label="Technology">
            <select
              name="technologyId"
              defaultValue={ui.techId}
              className="field"
            >
              {techs.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </ModalShell>
    );
  }
  if (ui.modal === "share") {
    const a = `${window.location.origin}${withBase("/shared-roadmap")}`,
      o = () => {
        var u, p;
        try {
          (p =
            (u = navigator.clipboard) == null ? undefined : u.writeText(a)) ==
            null || p.catch(() => {});
        } catch {}
        toast("Link copied (demo)");
      };
    return (
      <ModalShell
        title="Share roadmap"
        sub="Anyone with this sample link can open a read-only view. Nothing is sent."
        onClose={s}
        footer={
          <>
            <button
              type="button"
              onClick={o}
              className="inline-flex items-center gap-2 rounded-lg border border-line px-4 py-2 text-sm dark:border-slate-700"
            >
              <Icon name="copy" />
              {" Copy link"}
            </button>
            <button
              type="button"
              onClick={() => {
                (s(), l("/shared-roadmap"));
              }}
              className="rounded-lg bg-navy px-4 py-2 text-sm font-medium text-white"
            >
              Open shared view
            </button>
          </>
        }
      >
        <label className="mt-5 grid gap-1 text-sm">
          Sample link
          <input readOnly value={a} className="field font-mono text-xs" />
        </label>
      </ModalShell>
    );
  }
  return null;
}
