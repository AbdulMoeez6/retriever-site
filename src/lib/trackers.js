// Loaders for third-party trackers, run only after the visitor consents to their category.
// Each follows the vendor's standard base code; each runs at most once per page.
import integrations from "@/config/integrations.json";
import { configured } from "@/lib/analytics";

const { hotjar, hubspot, pixels } = integrations;
const loaded = new Set();

function once(name, fn) {
  if (loaded.has(name)) return;
  loaded.add(name);
  try {
    fn();
  } catch {}
}

function addScript(src, attrs = {}) {
  const script = document.createElement("script");
  script.async = true;
  script.src = src;
  Object.entries(attrs).forEach(([key, value]) => script.setAttribute(key, value));
  document.head.appendChild(script);
}

// ---------- analytics ----------

function loadHotjar() {
  once("hotjar", () => {
    const w = window;
    w.hj = w.hj || function () { (w.hj.q = w.hj.q || []).push(arguments); };
    w._hjSettings = { hjid: Number(hotjar.site_id), hjsv: Number(hotjar.snippet_version) || 6 };
    addScript(`https://static.hotjar.com/c/hotjar-${w._hjSettings.hjid}.js?sv=${w._hjSettings.hjsv}`);
  });
}

// ---------- marketing ----------

function loadHubspot() {
  once("hubspot", () => {
    const host = hubspot.region === "eu1" ? "js-eu1.hs-scripts.com" : "js.hs-scripts.com";
    addScript(`https://${host}/${hubspot.portal_id}.js`, { id: "hs-script-loader", defer: "" });
  });
}

function loadMeta() {
  once("meta", () => {
    const w = window;
    if (!w.fbq) {
      const n = (w.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      });
      if (!w._fbq) w._fbq = n;
      n.push = n;
      n.loaded = true;
      n.version = "2.0";
      n.queue = [];
      addScript("https://connect.facebook.net/en_US/fbevents.js");
    }
    w.fbq("init", pixels.meta.pixel_id);
    w.fbq("track", "PageView");
  });
}

function loadLinkedIn() {
  once("linkedin", () => {
    const w = window;
    w._linkedin_partner_id = pixels.linkedin.partner_id;
    w._linkedin_data_partner_ids = w._linkedin_data_partner_ids || [];
    w._linkedin_data_partner_ids.push(pixels.linkedin.partner_id);
    if (!w.lintrk) {
      w.lintrk = function (a, b) { w.lintrk.q.push([a, b]); };
      w.lintrk.q = [];
    }
    addScript("https://snap.licdn.com/li.lms-analytics/insight.min.js");
  });
}

function loadPinterest() {
  once("pinterest", () => {
    const w = window;
    if (!w.pintrk) {
      w.pintrk = function () { w.pintrk.queue.push(Array.prototype.slice.call(arguments)); };
      w.pintrk.queue = [];
      w.pintrk.version = "3.0";
      addScript("https://s.pinimg.com/ct/core.js");
    }
    w.pintrk("load", pixels.pinterest.tag_id);
    w.pintrk("page");
  });
}

function loadTikTok() {
  once("tiktok", () => {
    const w = window;
    w.TiktokAnalyticsObject = "ttq";
    const ttq = (w.ttq = w.ttq || []);
    ttq.methods = ["page", "track", "identify", "instances", "debug", "on", "off", "once", "ready", "alias", "group", "enableCookie", "disableCookie", "holdConsent", "revokeConsent", "grantConsent"];
    ttq.setAndDefer = (target, method) => {
      target[method] = function () { target.push([method].concat(Array.prototype.slice.call(arguments, 0))); };
    };
    ttq.methods.forEach((method) => ttq.setAndDefer(ttq, method));
    ttq.instance = (id) => {
      const instance = ttq._i[id] || [];
      ttq.methods.forEach((method) => ttq.setAndDefer(instance, method));
      return instance;
    };
    ttq.load = (id, options) => {
      const src = "https://analytics.tiktok.com/i18n/pixel/events.js";
      ttq._i = ttq._i || {};
      ttq._i[id] = [];
      ttq._i[id]._u = src;
      ttq._t = ttq._t || {};
      ttq._t[id] = +new Date();
      ttq._o = ttq._o || {};
      ttq._o[id] = options || {};
      addScript(`${src}?sdkid=${id}&lib=ttq`);
    };
    ttq.load(pixels.tiktok.pixel_id);
    ttq.page();
  });
}

function loadX() {
  once("x", () => {
    const w = window;
    if (!w.twq) {
      const s = (w.twq = function () { s.exe ? s.exe.apply(s, arguments) : s.queue.push(arguments); });
      s.version = "1.1";
      s.queue = [];
      addScript("https://static.ads-twitter.com/uwt.js");
    }
    w.twq("config", pixels.x.pixel_id);
  });
}

function loadReddit() {
  once("reddit", () => {
    const w = window;
    if (!w.rdt) {
      const p = (w.rdt = function () { p.sendEvent ? p.sendEvent.apply(p, arguments) : p.callQueue.push(arguments); });
      p.callQueue = [];
      addScript("https://www.redditstatic.com/ads/pixel.js");
    }
    w.rdt("init", pixels.reddit.pixel_id);
    w.rdt("track", "PageVisit");
  });
}

/** Load whatever the visitor has agreed to. GA4 itself is loaded in <head> under Consent Mode. */
export function applyConsent({ analytics, marketing }) {
  if (typeof window.gtag === "function") {
    window.gtag("consent", "update", {
      analytics_storage: analytics ? "granted" : "denied",
      ad_storage: marketing ? "granted" : "denied",
      ad_user_data: marketing ? "granted" : "denied",
      ad_personalization: marketing ? "granted" : "denied",
    });
  }
  if (analytics && configured.hotjar) loadHotjar();
  if (marketing) {
    if (configured.hubspot) loadHubspot();
    if (configured.meta) loadMeta();
    if (configured.linkedin) loadLinkedIn();
    if (configured.pinterest) loadPinterest();
    if (configured.tiktok) loadTikTok();
    if (configured.x) loadX();
    if (configured.reddit) loadReddit();
  }
}
