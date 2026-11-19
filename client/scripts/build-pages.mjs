// Builds the GitHub Pages site: one self-contained index.html at the repository root.
// It opens from file:// and from a sub-path such as https://<org>.github.io/retriever-site/.
//  1. client bundle (single file, classic IIFE script, everything inlined)
//  2. prerender bundle, used to render the landing page into #root at build time
//  3. post-process: classic <script> at the end of <body>, prerendered HTML in #root
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const clientDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const run = (cmd) => execSync(cmd, { cwd: clientDir, stdio: "inherit" });

run("npx vite build --mode singlefile");
run("npx vite build --mode singlefile --ssr src/entry-server.jsx");

let html = fs.readFileSync(path.join(clientDir, "dist-preview/index.html"), "utf8");

// Inline the stylesheet, and pull the app script out of <head> (it becomes a classic script at the end of <body>).
const distDir = path.join(clientDir, "dist-preview");
const readAsset = (href) => fs.readFileSync(path.join(distDir, href.replace(/^\.\//, "")), "utf8");
html = html.replace(/<link rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g, (_m, href) => `<style>${readAsset(href)}</style>`);
const m = html.match(/<script type="module"[^>]*src="([^"]+)"[^>]*><\/script>/);
if (!m) throw new Error("App script tag not found");
const appJs = readAsset(m[1]);
html = html.replace(m[0], "");
if (/<script[^>]+src=|<link[^>]+rel="(stylesheet|modulepreload)"/.test(html)) throw new Error("External asset left in HTML");

// Prerender the landing page into #root.
const { render } = await import(pathToFileURL(path.join(clientDir, "dist-ssr/entry-server.js")).href);
const appHtml = render("/");
if (!html.includes('<div id="root"></div>')) throw new Error("#root not found");
html = html.replace('<div id="root"></div>', () => `<div id="root" data-prerendered="/">${appHtml}</div>`);

// Escape any "</script" inside the bundle, then append as a classic script before </body>.
const safeJs = appJs.replace(/<\/script/gi, "<\\/script");
const idx = html.lastIndexOf("</body>");
html = html.slice(0, idx) + `<script>${safeJs}</script>\n` + html.slice(idx);

const out = path.resolve(clientDir, "..", "index.html");
fs.writeFileSync(out, html);
console.log(`Wrote ${out} (${(fs.statSync(out).size / 1024 / 1024).toFixed(2)} MB)`);
