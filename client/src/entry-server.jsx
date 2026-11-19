// Prerender entry for the single-file preview: renders a route to static HTML at build time.
import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import App from "./App.jsx";
import { AppProvider } from "./lib/store.jsx";

export function render(url = "/") {
  return renderToString(
    <React.StrictMode>
      <StaticRouter location={url}>
        <AppProvider>
          <App />
        </AppProvider>
      </StaticRouter>
    </React.StrictMode>
  );
}
