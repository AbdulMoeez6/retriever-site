import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, HashRouter, MemoryRouter } from "react-router-dom";
import { canUseUrlRouting, installFormSubmitShim, safeHash } from "./lib/env.js";
import "@fontsource/hanken-grotesk/400.css";
import "@fontsource/hanken-grotesk/500.css";
import "@fontsource/hanken-grotesk/600.css";
import "@fontsource/hanken-grotesk/700.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "./index.css";
import App from "./App.jsx";
import { AppProvider } from "./lib/store.jsx";

// Routing:
// - normal build: BrowserRouter (served by Express with a SPA fallback)
// - single-file preview opened from file://: HashRouter (#/book-demo, #/app/readiness, ...)
// - inside an <iframe srcdoc> or a sandboxed frame (e.g. SharePoint's viewer), where URLs
//   can't be built or history can't be written: MemoryRouter, so every link still navigates.
const HASH = import.meta.env.VITE_HASH_ROUTER === "1";
const urlRouting = canUseUrlRouting();

function pickRouter() {
  if (!HASH) return { Router: BrowserRouter, props: {} };
  if (urlRouting) return { Router: HashRouter, props: {} };
  const start = safeHash().replace(/^#/, "") || "/";
  return { Router: MemoryRouter, props: { initialEntries: [start.startsWith("/") ? start : "/"] } };
}
const { Router, props: routerProps } = pickRouter();

const tree = (
  <React.StrictMode>
    <Router {...routerProps}>
      <AppProvider>
        <App />
      </AppProvider>
    </Router>
  </React.StrictMode>
);

try { document.documentElement.classList.add("js"); } catch { /* ignore */ }
window.__retrieverBooted = true;
installFormSubmitShim();

// The preview file ships with the landing page prerendered inside #root, so it is readable
// before (or without) JavaScript. We render fresh with createRoot rather than hydrating:
// the result is identical, and it can't fail on a hydration mismatch in unusual hosts.
const container = document.getElementById("root");
container.textContent = "";
ReactDOM.createRoot(container).render(tree);
