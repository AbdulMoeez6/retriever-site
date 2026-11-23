// Consent state and event tracking, shared by Astro page scripts and React islands.
// Every call is a no-op when a tool isn't configured or the visitor hasn't consented.
import integrations from "@/config/integrations.json";

export const CONSENT_KEY = "retriever-consent";
export const CONSENT_EVENT = "retriever:consent";

const { consent, ga4, hotjar, hubspot, pixels } = integrations;

export const configured = {
  ga4: Boolean(ga4.measurement_id),
  hotjar: Boolean(hotjar.site_id),
  hubspot: Boolean(hubspot.portal_id && hubspot.load_tracking_code),
  meta: Boolean(pixels.meta.pixel_id),
  linkedin: Boolean(pixels.linkedin.partner_id),
  pinterest: Boolean(pixels.pinterest.tag_id),
  tiktok: Boolean(pixels.tiktok.pixel_id),
  x: Boolean(pixels.x.pixel_id),
  reddit: Boolean(pixels.reddit.pixel_id),
};

export const usesAnalytics = configured.ga4 || configured.hotjar;
export const usesMarketing =
  configured.hubspot ||
  configured.meta ||
  configured.linkedin ||
  configured.pinterest ||
  configured.tiktok ||
  configured.x ||
  configured.reddit;

/** The banner only appears when consent is enabled and a cookie-setting tool is configured. */
export const needsConsent = consent.enabled && (usesAnalytics || usesMarketing);

const ALL = { analytics: true, marketing: true };

/** { analytics, marketing } booleans, or null if the visitor hasn't chosen yet. */
export function getConsent() {
  if (!needsConsent) return ALL;
  try {
    const saved = JSON.parse(window.localStorage.getItem(CONSENT_KEY) || "null");
    if (saved && typeof saved === "object") {
      return { analytics: Boolean(saved.analytics), marketing: Boolean(saved.marketing) };
    }
  } catch {}
  return null;
}

export function setConsent(choice) {
  const value = { analytics: Boolean(choice.analytics), marketing: Boolean(choice.marketing) };
  try {
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify(value));
  } catch {}
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
  return value;
}

function safely(fn) {
  try {
    fn();
  } catch {}
}

/** A custom event for GA4 (respects Consent Mode) and Hotjar (only loaded after consent). */
export function track(name, params = {}) {
  if (typeof window === "undefined") return;
  safely(() => typeof window.gtag === "function" && window.gtag("event", name, params));
  safely(() => typeof window.hj === "function" && window.hj("event", name));
}

/** A lead (form submitted): GA4 generate_lead plus each ad platform's lead/conversion event. */
export function trackLead(formKey) {
  if (typeof window === "undefined") return;
  track("generate_lead", { form: formKey });
  const w = window;
  safely(() => w.fbq && w.fbq("track", "Lead", { content_name: formKey }));
  safely(() => w.lintrk && pixels.linkedin.lead_conversion_id && w.lintrk("track", { conversion_id: Number(pixels.linkedin.lead_conversion_id) }));
  safely(() => w.pintrk && w.pintrk("track", "lead", { lead_type: formKey }));
  safely(() => w.ttq && w.ttq.track("SubmitForm", { content_name: formKey }));
  safely(() => w.twq && pixels.x.lead_event_id && w.twq("event", pixels.x.lead_event_id, {}));
  safely(() => w.rdt && w.rdt("track", "Lead"));
}
