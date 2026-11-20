import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Toast from "./components/Toast.jsx";
import AppLayout from "./components/AppLayout.jsx";
import Landing from "./pages/Landing.jsx";
import BookDemo from "./pages/BookDemo.jsx";
import SignIn from "./pages/SignIn.jsx";
import SharedRoadmap from "./pages/SharedRoadmap.jsx";
import MissionCommand from "./pages/app/MissionCommand.jsx";
import OpportunityPipeline from "./pages/app/OpportunityPipeline.jsx";
import Readiness from "./pages/app/Readiness.jsx";
import ReadinessGaps from "./pages/app/Opportunities.jsx";
import ActionPlanning from "./pages/app/ActionPlanning.jsx";
import KnowledgeBase from "./pages/app/KnowledgeBase.jsx";
import Commercialization from "./pages/app/Commercialization.jsx";
import TechnologyProfile from "./pages/app/TechnologyProfile.jsx";
import Team from "./pages/app/Team.jsx";
import Questionnaire from "./pages/app/Questionnaire.jsx";
import EvidenceReasoning from "./pages/app/EvidenceReasoning.jsx";
import ProposalAssistant from "./pages/app/ProposalAssistant.jsx";
import Settings from "./pages/app/Settings.jsx";
import { useApp } from "./lib/store.jsx";

function RouteEffects() {
  const { pathname } = useLocation();
  const { closeOverlays } = useApp();
  useEffect(() => { window.scrollTo(0, 0); closeOverlays(); }, [pathname, closeOverlays]);
  return null;
}

export default function App() {
  return (
    <>
      <RouteEffects />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/book-demo" element={<BookDemo />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/shared-roadmap" element={<SharedRoadmap />} />
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<Navigate to="mission-command" replace />} />
          <Route path="mission-command" element={<MissionCommand />} />
          <Route path="opportunities" element={<OpportunityPipeline />} />
          <Route path="readiness" element={<Readiness />} />
          <Route path="readiness-gaps" element={<ReadinessGaps />} />
          <Route path="action-plan" element={<ActionPlanning />} />
          <Route path="knowledge-base" element={<KnowledgeBase />} />
          <Route path="commercialization" element={<Commercialization />} />
          <Route path="technology-profile" element={<TechnologyProfile />} />
          <Route path="team" element={<Team />} />
          <Route path="readiness-questionnaire" element={<Questionnaire />} />
          <Route path="evidence-reasoning" element={<EvidenceReasoning />} />
          <Route path="proposal-assistant" element={<ProposalAssistant />} />
          <Route path="settings" element={<Settings />} />
          {/* Earlier dashboard routes now live under the new navigation. */}
          <Route path="evidence" element={<Navigate to="/app/knowledge-base" replace />} />
          <Route path="funding" element={<Navigate to="/app/opportunities" replace />} />
          <Route path="roadmap" element={<Navigate to="/app/commercialization" replace />} />
          <Route path="action-planning" element={<Navigate to="/app/action-plan" replace />} />
          <Route path="profiles" element={<Navigate to="/app/technology-profile" replace />} />
          <Route path="*" element={<Navigate to="/app/mission-command" replace />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toast />
    </>
  );
}
