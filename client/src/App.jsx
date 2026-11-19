import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Landing from "./pages/Landing.jsx";
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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
