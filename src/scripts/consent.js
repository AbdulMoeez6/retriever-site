// Consent banner behaviour + loading the trackers the visitor agreed to.
import { getConsent, setConsent } from "@/lib/analytics";
import { applyConsent } from "@/lib/trackers";

const banner = document.getElementById("consent-banner");

if (banner) {
  const options = banner.querySelector("[data-consent-options]");
  const analyticsBox = banner.querySelector("[data-consent-analytics]");
  const marketingBox = banner.querySelector("[data-consent-marketing]");
  const save = banner.querySelector("[data-consent-save]");
  const customize = banner.querySelector("[data-consent-customize]");

  const show = (expanded = false) => {
    const current = getConsent() || { analytics: false, marketing: false };
    if (analyticsBox) analyticsBox.checked = current.analytics;
    if (marketingBox) marketingBox.checked = current.marketing;
    options.hidden = !expanded;
    save.hidden = !expanded;
    customize.hidden = expanded;
    banner.hidden = false;
  };
  const choose = (choice) => {
    applyConsent(setConsent(choice));
    banner.hidden = true;
  };

  banner.querySelector("[data-consent-accept]").addEventListener("click", () => choose({ analytics: true, marketing: true }));
  banner.querySelector("[data-consent-reject]").addEventListener("click", () => choose({ analytics: false, marketing: false }));
  customize.addEventListener("click", () => show(true));
  save.addEventListener("click", () =>
    choose({ analytics: Boolean(analyticsBox?.checked), marketing: Boolean(marketingBox?.checked) }),
  );
  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-consent-open]")) {
      event.preventDefault();
      show(true);
    }
  });

  const saved = getConsent();
  if (saved) applyConsent(saved);
  else show(false);
}
