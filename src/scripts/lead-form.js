// Lead forms: the original Book-a-demo validation (messages on blur, all on submit, focus the
// first problem), then HubSpot submission + lead tracking when configured, then the success state.
import { trackLead } from "@/lib/analytics";
import { hubspotFormReady, submitToHubspot } from "@/lib/hubspot";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function setupLeadForm(root) {
  const form = root.querySelector("[data-lead-form]");
  if (!form || form.dataset.ready) return;
  form.dataset.ready = "1";

  const inputs = [...form.querySelectorAll("input[name]")];
  const chipGroup = form.querySelector("[data-chips]");
  const chips = chipGroup ? [...chipGroup.querySelectorAll("[data-chip]")] : [];
  const touched = {};
  let submitted = false;
  let chipValue = "";

  const errorEl = (el) => document.getElementById(`${el.id}-err`);
  const problemFor = (el) => {
    const value = el === chipGroup ? chipValue : el.value.trim();
    if (el.hasAttribute("data-required") && !value) return el.dataset.requiredError || "This field is required.";
    if (el.type === "email" && value && !EMAIL_RE.test(value))
      return el.dataset.invalidError || "That email doesn't look quite right.";
    return "";
  };
  const controls = () => (chipGroup ? [...inputs, chipGroup] : inputs);
  const keyOf = (el) => (el === chipGroup ? "__chips" : el.name);

  const render = () => {
    let first = null;
    for (const el of controls()) {
      const problem = problemFor(el);
      const shown = (touched[keyOf(el)] || submitted) && problem;
      const err = errorEl(el);
      err.textContent = shown || " ";
      err.classList.toggle("invisible", !shown);
      if (el !== chipGroup) el.setAttribute("aria-invalid", shown ? "true" : "false");
      if (problem && !first) first = el;
    }
    return first;
  };

  inputs.forEach((input) => {
    input.addEventListener("input", render);
    input.addEventListener("blur", () => {
      touched[input.name] = true;
      render();
    });
  });
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chipValue = chip.dataset.chip;
      touched.__chips = true;
      chips.forEach((c) => c.setAttribute("aria-checked", String(c === chip)));
      render();
    });
  });

  // Sample-mode note vs. real submission note
  const note = form.querySelector("[data-lead-note]");
  const live = () => hubspotFormReady(form.dataset.formKey);
  if (live() && note) note.textContent = "We’ll only use these details to follow up with you.";

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    submitted = true;
    const firstProblem = render();
    if (firstProblem) {
      firstProblem.focus();
      return;
    }

    const values = Object.fromEntries(inputs.map((input) => [input.name, input.value.trim()]));
    const button = form.querySelector("[data-lead-submit]");
    const errorBox = form.querySelector("[data-lead-error]");
    const formKey = form.dataset.formKey;

    if (live()) {
      const [firstname, ...rest] = (values.name || "").split(/\s+/);
      const messageParts = [form.dataset.context, chipGroup && chipValue ? `${chipGroup.dataset.chipsLabel}: ${chipValue}` : ""];
      const properties = {
        firstname,
        lastname: rest.join(" "),
        email: values.email,
        company: values.org,
        jobtitle: values.role,
        message: messageParts.filter(Boolean).join("\n"),
      };
      button.disabled = true;
      button.setAttribute("aria-busy", "true");
      errorBox.classList.add("hidden");
      try {
        await submitToHubspot(formKey, properties);
      } catch {
        errorBox.classList.remove("hidden");
        button.disabled = false;
        button.removeAttribute("aria-busy");
        return;
      }
    }
    trackLead(formKey);

    // success state (same wording as the original Book-a-demo page)
    const success = root.querySelector("[data-lead-success]");
    const firstName = (values.name || "").split(/\s+/)[0];
    success.querySelector("[data-success-heading]").textContent = success.dataset.successTitle.replace("{first}", firstName || "");
    const body = success.querySelector("[data-success-body]");
    const [before, after = ""] = success.dataset.successText.split("{email}");
    body.textContent = before;
    const email = document.createElement("span");
    email.className = "text-slate-200";
    email.textContent = values.email || "";
    body.append(email, after);
    if (chipGroup && chipValue && chipValue !== chipGroup.dataset.skipInSuccess) {
      const chosen = document.createElement("span");
      chosen.className = "text-slate-200";
      chosen.textContent = chipValue;
      body.append(" about ", chosen);
    }
    body.append(".");
    success.querySelector("[data-success-note]").hidden = live();
    form.hidden = true;
    success.hidden = false;
  });
}

document.querySelectorAll("[data-lead]").forEach(setupLeadForm);
