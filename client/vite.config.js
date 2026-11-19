import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";

// `vite build`                          -> normal build in dist/ (served by Express)
// `vite build --mode singlefile`        -> classic IIFE bundle in dist-preview/ (inlined into one HTML by scripts/build-pages.mjs)
// `vite build --mode singlefile --ssr`  -> prerender bundle in dist-ssr/ (used by scripts/build-pages.mjs)

// In the single-file build, inline the <link> icons from index.html as data URIs too.
const inlineHtmlIcons = () => ({
  name: "inline-html-icons",
  transformIndexHtml: {
    order: "pre",
    handler: (html) =>
      html.replace(/href="\/src\/assets\/([^"]+\.png)"/g, (_m, file) =>
        `href="data:image/png;base64,${fs.readFileSync(path.resolve("src/assets", file)).toString("base64")}"`),
  },
});

export default defineConfig(({ mode, isSsrBuild }) => {
  const single = mode === "singlefile";
  const define = single ? { "import.meta.env.VITE_HASH_ROUTER": JSON.stringify("1") } : {};

  if (single && isSsrBuild) {
    return {
      base: "./",
      plugins: [react()],
      define,
      ssr: { noExternal: true },
      build: { outDir: "dist-ssr", assetsInlineLimit: 100_000_000, emptyOutDir: true, copyPublicDir: false },
    };
  }

  return {
    base: single ? "./" : "/",
    plugins: [react(), ...(single ? [inlineHtmlIcons()] : [])],
    define,
    server: { port: 5173, proxy: { "/api": "http://localhost:3001" } },
    build: single
      ? {
          outDir: "dist-preview",
          assetsInlineLimit: 100_000_000,
          cssCodeSplit: false,
          chunkSizeWarningLimit: 100_000,
          emptyOutDir: true,
          modulePreload: false,
          rollupOptions: { output: { format: "iife", inlineDynamicImports: true } },
        }
      : { outDir: "dist", assetsInlineLimit: 0 },
  };
});
