// Workspace store: the same data and UI state the original single-page app kept in React context.
// Because each route is now its own static page, the state is kept in sessionStorage so that
// changes (added actions, documents, profiles, selected technology, filters...) survive navigation.
import { useMemo, useSyncExternalStore } from "react";
import { initialData, initialUi } from "@/lib/sample-data";
import { DATA_KEY, UI_KEY, readStored, writeStored } from "@/lib/session";
import { getTheme, subscribeTheme, toggleTheme } from "@/lib/theme";
import { showToast } from "@/lib/toast";

// Overlays are never restored on a fresh page load (the original closed them on route change).
const TRANSIENT_UI = ["drawer", "modal", "quickOpen", "navOpen"];

const serverState = {
  data: initialData(),
  ui: { ...initialUi, navOpen: false },
};
let state = null;
const listeners = new Set();

function load() {
  const ui = { ...initialUi, ...(readStored(UI_KEY) || {}) };
  Object.assign(ui, { drawer: null, modal: null, quickOpen: false, navOpen: false });
  return { data: { ...initialData(), ...(readStored(DATA_KEY) || {}) }, ui };
}

function persist() {
  const ui = { ...state.ui };
  for (const key of TRANSIENT_UI) delete ui[key];
  writeStored(DATA_KEY, state.data);
  writeStored(UI_KEY, ui);
}

export function getState() {
  if (typeof window === "undefined") return serverState;
  if (!state) state = load();
  return state;
}

function setState(next) {
  state = next;
  persist();
  listeners.forEach((listener) => listener());
}

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function patchUi(patch) {
  const current = getState();
  const next = typeof patch === "function" ? patch(current.ui) : patch;
  setState({ ...current, ui: { ...current.ui, ...next } });
}

export function patchData(update) {
  const current = getState();
  setState({ ...current, data: { ...current.data, ...update(current.data) } });
}

export function closeOverlays() {
  patchUi({ drawer: null, modal: null, quickOpen: false, navOpen: false });
}

export function useTheme() {
  return useSyncExternalStore(subscribeTheme, getTheme, () => "light");
}

function buildApi({ data, ui }, theme) {
  const techById = (id) =>
    data.techs.find((tech) => tech.id === id) || data.techs[0];
  return {
    ...data,
    ui,
    theme,
    toast: showToast,
    patchUi,
    patchData,
    toggleTheme,
    closeOverlays,
    techById,
    currentTech: () => techById(ui.techId),
    techName: (id) => data.techs.find((tech) => tech.id === id)?.name || "",
    gapsFor: (oppId) => data.gaps.filter((gap) => gap.opportunityId === oppId),
    fundingForOpp: (oppId) =>
      data.funding.find((match) => match.opportunityId === oppId),
    matchesQuery: (record, fields) => {
      const query = ui.search.trim().toLowerCase();
      return query
        ? fields.some((field) =>
            String(record[field] || "")
              .toLowerCase()
              .includes(query),
          )
        : true;
    },
    kpis: () => {
      const levels = data.techs
        .map((tech) => tech.trl)
        .filter((level) => level != null);
      const avg = levels.length
        ? levels.reduce((sum, level) => sum + level, 0) / levels.length
        : 0;
      return {
        techs: data.techs.length,
        avgTrl: avg.toFixed(1),
        assessments: data.usage.assessmentsUsed,
        funding: data.funding.length,
      };
    },
  };
}

export function useStore() {
  const snapshot = useSyncExternalStore(subscribe, getState, () => serverState);
  const theme = useTheme();
  return useMemo(() => buildApi(snapshot, theme), [snapshot, theme]);
}
