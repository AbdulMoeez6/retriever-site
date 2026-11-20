import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Toast from "./components/Toast.jsx";
import AppLayout from "./components/AppLayout.jsx";
import Landing from "./pages/Landing.jsx";
import BookDemo from "./pages/BookDemo.jsx";
import SignIn from "./pages/SignIn.jsx";
import SharedRoadmap from "./pages/SharedRoadmap.jsx";
import MissionCommand from "./pages/app/MissionCommand.jsx";
import Readiness from "./pages/app/Readiness.jsx";
import OpportunityPipeline from "./pages/app/OpportunityPipeline.jsx";
import ReadinessGaps from "./pages/app/Opportunities.jsx";
import Evidence from "./pages/app/Evidence.jsx";
import Funding from "./pages/app/Funding.jsx";
import Roadmap from "./pages/app/Roadmap.jsx";
import ActionPlanning from "./pages/app/ActionPlanning.jsx";
import Profiles from "./pages/app/Profiles.jsx";
import TechnologyProfile from "./pages/app/TechnologyProfile.jsx";
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
          <Route path="readiness" element={<Readiness />} />
          <Route path="opportunities" element={<OpportunityPipeline />} />
          <Route path="readiness-gaps" element={<ReadinessGaps />} />
          <Route path="evidence" element={<Evidence />} />
          <Route path="funding" element={<Funding />} />
          <Route path="roadmap" element={<Roadmap />} />
          <Route path="action-planning" element={<ActionPlanning />} />
          <Route path="profiles" element={<Profiles />} />
          <Route path="technology-profile" element={<TechnologyProfile />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toast />
    </>
  );
}
