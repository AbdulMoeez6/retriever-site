// Sends a lead to a HubSpot form through the Forms Submission API (v3, unauthenticated).
// Needs hubspot.portal_id and a form GUID for the form key in src/config/integrations.json.
// Docs: https://developers.hubspot.com/docs/api/marketing/forms (Submit data to a form)
import integrations from "@/config/integrations.json";

const { hubspot } = integrations;

export function hubspotFormReady(formKey) {
  return Boolean(hubspot.portal_id && hubspot.forms?.[formKey]);
}

function readCookie(name) {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : "";
}

/**
 * @param {string} formKey key in integrations.hubspot.forms
 * @param {Record<string,string>} properties HubSpot contact property name -> value
 */
export async function submitToHubspot(formKey, properties) {
  const host = hubspot.region === "eu1" ? "api-eu1.hsforms.com" : "api.hsforms.com";
  const url = `https://${host}/submissions/v3/integration/submit/${hubspot.portal_id}/${hubspot.forms[formKey]}`;
  const fields = Object.entries(properties)
    .filter(([, value]) => value != null && String(value).trim() !== "")
    .map(([name, value]) => ({ objectTypeId: "0-1", name, value: String(value).trim() }));
  const context = { pageUri: window.location.href, pageName: document.title };
  const hutk = readCookie("hubspotutk"); // links the lead to the visitor once HubSpot tracking is allowed
  if (hutk) context.hutk = hutk;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fields, context }),
  });
  if (!response.ok) throw new Error(`HubSpot responded ${response.status}`);
}
