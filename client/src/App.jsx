import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Toast from "./components/Toast.jsx";
import AppLayout from "./components/AppLayout.jsx";
import Landing from "./pages/Landing.jsx";
import BookDemo from "./pages/BookDemo.jsx";
import SignIn from "./pages/SignIn.jsx";
import MissionCommand from "./pages/app/MissionCommand.jsx";
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
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<Navigate to="mission-command" replace />} />
          <Route path="mission-command" element={<MissionCommand />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toast />
    </>
  );
}
