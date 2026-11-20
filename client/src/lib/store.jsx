import { storageGet, storageSet } from "./env.js";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  seedTechs, seedHistory, seedDocs, seedOpps, seedGaps, seedFunding,
  seedRoadmap, seedActions, seedActivity, seedProfile, seedUsage,
} from "../data/sampleData.js";
import {
  WORKFLOW_STEPS, QUESTIONNAIRE, seedPipeline, seedTechProfiles, seedQuestionnaire, seedTrail, seedTeam, seedReasoning,
} from "../data/pilotData.js";

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
  pipeline: seedPipeline(),
  techProfiles: seedTechProfiles(),
  questionnaire: seedQuestionnaire(),
  trail: seedTrail(),
  team: seedTeam(),
  reasoning: seedReasoning(),
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
  oppTab: "Pipeline",
  kbTab: "Documents",
  proposalFor: "",
  profileStep: 0,
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
    const hasTech = ui.techId !== "none" && data.techs.some((t) => t.id === ui.techId);
    const questionnaireFor = (id) => data.questionnaire[id] || { completed: [], answers: {} };
    const questionnairePct = (id) => Math.round((questionnaireFor(id).completed.length / QUESTIONNAIRE.length) * 100);
    // Pilot workflow: each step's status is read from the record, never from clicks.
    const pilotSteps = (id) => {
      const live = hasTech && id === ui.techId;
      const t = data.techs.find((x) => x.id === id);
      const q = questionnaireFor(id).completed.length;
      const docCount = data.docs.filter((d) => d.technologyId === id).length;
      const opps = data.pipeline.filter((o) => o.techId === id).length;
      const oppIds = data.opportunities.filter((o) => o.technologyId === id).map((o) => o.id);
      const gapCount = data.gaps.filter((g) => oppIds.includes(g.opportunityId)).length;
      const acts = data.actions.filter((a) => a.technologyId === id);
      const status = {
        profile: live ? ["done", "Created"] : ["todo", "Not created"],
        questionnaire: !live ? ["todo", "Not started"] : q >= QUESTIONNAIRE.length ? ["done", "Complete"] : q ? ["active", `${q} of ${QUESTIONNAIRE.length} sections`] : ["todo", "Not started"],
        documents: !live ? ["todo", "—"] : docCount ? ["done", `${docCount} document${docCount === 1 ? "" : "s"}`] : ["todo", "None yet"],
        readiness: !live ? ["todo", "—"] : t && t.trl != null ? ["done", `TRL ${t.trl} · MRL ${t.mrl ?? "—"} · IRL ${t.irl ?? "—"}`] : ["todo", "Not assessed"],
        intelligence: !live ? ["todo", "—"] : opps ? ["done", `${opps} opportunit${opps === 1 ? "y" : "ies"}`] : ["todo", "None yet"],
        gaps: !live ? ["todo", "—"] : gapCount ? ["active", `${gapCount} open gap${gapCount === 1 ? "" : "s"}`] : opps ? ["done", "No open gaps"] : ["todo", "—"],
        actions: !live ? ["todo", "—"] : acts.length && acts.every((a) => a.status === "Done") ? ["done", "Complete"] : acts.length ? ["active", `${acts.filter((a) => a.status !== "Done").length} open`] : ["todo", "Not started"],
      };
      return WORKFLOW_STEPS.map((s) => ({ ...s, state: status[s.id][0], detail: status[s.id][1] }));
    };
    const techById = (id) => data.techs.find((t) => t.id === id) || data.techs[0];
    return {
      hasTech,
      questionnaireFor,
      questionnairePct,
      pilotSteps,
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
