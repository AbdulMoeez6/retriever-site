import { storageGet, storageSet } from "./env.js";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  seedTechs, seedHistory, seedDocs, seedOpps, seedGaps, seedFunding,
  seedRoadmap, seedActions, seedActivity, seedProfile, seedUsage,
} from "../data/sampleData.js";

const AppContext = createContext(null);

const initialData = () => ({
  techs: seedTechs(),
  history: seedHistory(),
  docs: seedDocs(),
  opportunities: seedOpps(),
  gaps: seedGaps(),
  funding: seedFunding(),
  roadmap: seedRoadmap(),
  actions: seedActions(),
  notifications: seedActivity(),
  profile: seedProfile(),
  usage: seedUsage(),
});

const initialUi = {
  session: false,
  search: "",
  techId: "t1",
  historyOpen: false,
  checklistDismissed: false,
  evidenceFilter: "All",
  fundingType: "All",
  fundingFit: "All",
  selectedOpp: "o1",
  profileTab: "Overview",
  profileFocus: null,
  // overlays
  drawer: null,
  modal: null, // "action" | "profile" | "upload" | "share"
  quickOpen: false,
};

export function AppProvider({ children }) {
  const [data, setData] = useState(initialData);
  const [ui, setUi] = useState(initialUi);
  // Light on first render (matches the prerendered HTML); the saved choice is applied right after mount.
  const [theme, setThemeState] = useState("light");
  const themeLoaded = useRef(false);
  const [toastMsg, setToastMsg] = useState(null);
  const toastTimer = useRef(null);

  useEffect(() => {
    if (!themeLoaded.current) {
      themeLoaded.current = true;
      let saved = null;
      saved = storageGet("retriever-theme");
      if (saved === "dark" && theme !== "dark") { setThemeState("dark"); return; }
    }
    document.documentElement.classList.toggle("dark", theme === "dark");
    storageSet("retriever-theme", theme);
  }, [theme]);

  const toast = useCallback((msg) => {
    setToastMsg(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(null), 2400);
  }, []);

  const patchUi = useCallback((p) => setUi((u) => ({ ...u, ...(typeof p === "function" ? p(u) : p) })), []);
  const patchData = useCallback((fn) => setData((d) => ({ ...d, ...fn(d) })), []);
  const toggleTheme = useCallback(() => setThemeState((t) => (t === "dark" ? "light" : "dark")), []);
  const closeOverlays = useCallback(() => patchUi({ drawer: null, modal: null, quickOpen: false }), [patchUi]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") closeOverlays(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeOverlays]);

  const helpers = useMemo(() => {
    const techById = (id) => data.techs.find((t) => t.id === id) || data.techs[0];
    return {
      techById,
      currentTech: () => techById(ui.techId),
      techName: (id) => data.techs.find((x) => x.id === id)?.name || "",
      gapsFor: (oppId) => data.gaps.filter((g) => g.opportunityId === oppId),
      fundingForOpp: (id) => data.funding.find((f) => f.opportunityId === id),
      matchesQuery: (row, fields) => {
        const q = ui.search.trim().toLowerCase();
        if (!q) return true;
        return fields.some((f) => String(row[f] || "").toLowerCase().includes(q));
      },
      kpis: () => {
        const trls = data.techs.map((t) => t.trl).filter((v) => v != null);
        const avg = trls.length ? trls.reduce((a, b) => a + b, 0) / trls.length : 0;
        return { techs: data.techs.length, avgTrl: avg.toFixed(1), assessments: data.usage.assessmentsUsed, funding: data.funding.length };
      },
    };
  }, [data, ui.techId, ui.search]);

  const value = { ...data, ui, theme, toastMsg, toast, patchUi, patchData, toggleTheme, closeOverlays, ...helpers };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => useContext(AppContext);
