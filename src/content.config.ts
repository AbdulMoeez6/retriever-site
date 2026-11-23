import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import { z } from "astro/zod";

const button = z.object({ label: z.string(), link: z.string() });

// Homepage (Pinwheel pattern: page sections defined in frontmatter)
const homepageCollection = defineCollection({
  loader: glob({ pattern: "**/-*.{md,mdx}", base: "src/content/homepage" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    banner: z.object({
      title: z.string(),
      title_accent: z.string(),
      content: z.string(),
      audience: z.string(),
      button,
      quick_assessment_label: z.string(),
      video: z.object({ src: z.string(), poster: z.string(), label: z.string() }),
    }),
    preview: z.object({ link: z.string(), aria_label: z.string() }),
    videos: z.object({
      title: z.string(),
      video: z.object({ src: z.string(), poster: z.string(), label: z.string() }),
    }),
  }),
});

// Pricing (Pinwheel pricing collection, Retriever tiers)
const pricingCollection = defineCollection({
  loader: glob({ pattern: "**/-*.{md,mdx}", base: "src/content/pricing" }),
  schema: z.object({
    title: z.string(),
    meta_title: z.string().optional(),
    description: z.string(),
    badge: z.string(),
    contact_toast: z.string(),
    pricing_card: z.array(
      z.object({
        title: z.string(),
        designed_for: z.string(),
        monthly: z.object({ value: z.string(), unit: z.string() }),
        annual: z.object({ value: z.string(), unit: z.string() }),
        features: z.array(z.string()),
        button_label: z.string(),
      }),
    ),
    pilot: z.object({
      title: z.string(),
      badge: z.string(),
      price: z.string(),
      unit: z.string(),
      details: z.array(z.object({ label: z.string(), value: z.string() })),
      button,
    }),
    disclaimer: z.string(),
  }),
});

export const collections = {
  homepage: homepageCollection,
  pricing: pricingCollection,
};
