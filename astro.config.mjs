import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, fontProviders } from "astro/config";
import config from "./src/config/config.json";
import theme from "./src/config/theme.json";

// Helper to parse font string format: "FontName:wght@400;500;600;700"
function parseFontString(fontStr) {
  const [name, weightPart] = fontStr.split(":");
  let weights = [400];
  if (weightPart) {
    const weightMatch = weightPart.match(/wght@?([\d;]+)/);
    if (weightMatch) weights = weightMatch[1].split(";").map((w) => parseInt(w, 10));
  }
  return { name: name.replace(/\+/g, " "), weights };
}

// Build fonts configuration from theme.json (same approach as Pinwheel)
const fontsConfig = Object.entries(theme.fonts.font_family)
  .filter(([key]) => !key.includes("_type"))
  .map(([key, fontStr]) => {
    const { name, weights } = parseFontString(fontStr);
    return {
      name,
      cssVariable: `--font-${key}`,
      provider: fontProviders.google(),
      weights,
      display: "swap",
      fallbacks: [theme.fonts.font_family[`${key}_type`] || "sans-serif"],
    };
  });

// https://astro.build/config
export default defineConfig({
  site: config.site.base_url,
  base: config.site.base_path,
  trailingSlash: config.site.trailing_slash ? "always" : "never",
  vite: { plugins: [tailwindcss()] },
  fonts: fontsConfig,
  // The original app redirected /app to its first screen
  redirects: {
    "/app": "/app/mission-command",
  },
  integrations: [
    react(),
    sitemap({
      // The workspace and share view are sample, sign-in areas
      filter: (page) => !page.includes("/app/") && !page.includes("/shared-roadmap"),
    }),
  ],
});
