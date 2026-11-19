// Retriever template — minimal Express server (PERN-ready).
// Serves the built React client from ../client/dist and exposes /api/health.
// Runs without a database. Nothing from the demo forms is ever sent here.
import express from "express";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = Number(process.env.PORT) || 3001;
const DIST = path.resolve(__dirname, "../client/dist");

app.disable("x-powered-by");
app.use(express.json());

/* ------------------------------------------------------------------
 * PostgreSQL placeholder (the "P" in PERN).
 * When you're ready for a database:
 *   1. cd server && npm install pg
 *   2. set DATABASE_URL to your PostgreSQL connection string (never commit it)
 *   3. uncomment the block below and use `pool.query(...)` in your routes.
 *
 * import pg from "pg";
 * const pool = process.env.DATABASE_URL
 *   ? new pg.Pool({ connectionString: process.env.DATABASE_URL })
 *   : null;
 *
 * app.get("/api/db-health", async (_req, res) => {
 *   if (!pool) return res.json({ db: "not configured" });
 *   try { await pool.query("select 1"); res.json({ db: "ok" }); }
 *   catch (err) { res.status(500).json({ db: "error", message: err.message }); }
 * });
 * ------------------------------------------------------------------ */

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "retriever-template",
    database: process.env.DATABASE_URL ? "configured (placeholder, not connected)" : "not configured",
    time: new Date().toISOString(),
  });
});

app.use("/api", (_req, res) => res.status(404).json({ error: "Not found" }));

if (fs.existsSync(DIST)) {
  app.use(express.static(DIST, { index: false, maxAge: "1h" }));
  // SPA fallback so React Router can handle deep links like /book-demo or /app/funding.
  app.get("*", (_req, res) => res.sendFile(path.join(DIST, "index.html")));
} else {
  app.get("*", (_req, res) =>
    res
      .status(503)
      .type("text")
      .send("Client not built yet. Run `npm run build` from the project root, then `npm start`.")
  );
}

app.listen(PORT, () => {
  console.log(`Retriever server listening on http://localhost:${PORT}`);
});
