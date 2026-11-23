// Book-a-demo form: same validation rules, messages and success state as the original page.
// Nothing is sent anywhere (sample page).

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const FIELDS = ["name", "email", "org", "slot"];

const root = document.querySelector("[data-book-demo]");
const form = root?.querySelector("[data-demo-form]");

if (root && form) {
  // ?intent=pilot → Founding Partner Pilot copy
  const pilot = new URLSearchParams(window.location.search).get("intent") === "pilot";
  if (pilot) {
    root.querySelectorAll("[data-variant]").forEach((el) => (el.hidden = el.dataset.variant !== "pilot"));
    form.querySelector("[data-cta]").textContent = window.__bookDemoCtas?.pilot ?? "Request invite";
  }

  const values = { name: "", email: "", org: "", slot: "" };
  const touched = {};
  let submitted = false;

  const validate = () => {
    const errors = {};
    if (!values.name.trim()) errors.name = "Please enter your name.";
    if (!values.email.trim()) errors.email = "Please enter your work email.";
    else if (!EMAIL_RE.test(values.email.trim())) errors.email = "That email doesn't look quite right.";
    if (!values.org.trim()) errors.org = "Please enter your organization.";
    if (!values.slot) errors.slot = "Pick a time that suits you.";
    return errors;
  };

  const render = () => {
    const errors = validate();
    for (const field of FIELDS) {
      const message = (touched[field] || submitted) && errors[field];
      const err = document.getElementById(`bd-${field}-err`);
      err.textContent = message || " ";
      err.classList.toggle("invisible", !message);
      if (field !== "slot") document.getElementById(`bd-${field}`).setAttribute("aria-invalid", message ? "true" : "false");
    }
    return errors;
  };

  for (const field of ["name", "email", "org"]) {
    const input = document.getElementById(`bd-${field}`);
    input.addEventListener("input", () => {
      values[field] = input.value;
      render();
    });
    input.addEventListener("blur", () => {
      touched[field] = true;
      render();
    });
  }

  const chips = form.querySelectorAll("[data-slot]");
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      values.slot = chip.dataset.slot;
      touched.slot = true;
      chips.forEach((c) => c.setAttribute("aria-checked", String(c === chip)));
      render();
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    submitted = true;
    const errors = render();
    const firstInvalid = FIELDS.find((field) => errors[field]);
    if (firstInvalid) {
      document.getElementById(`bd-${firstInvalid}`)?.focus();
      return;
    }
    const success = root.querySelector("[data-demo-success]");
    success.querySelector("[data-success-title]").textContent = `Thanks, ${values.name.trim().split(/\s+/)[0]}.`;
    const text = success.querySelector("[data-success-text]");
    text.textContent = "We'll be in touch at ";
    const email = document.createElement("span");
    email.className = "text-slate-200";
    email.textContent = values.email.trim();
    text.append(email);
    if (values.slot !== "Suggest a time") {
      const slot = document.createElement("span");
      slot.className = "text-slate-200";
      slot.textContent = values.slot;
      text.append(" about ", slot);
    }
    text.append(".");
    form.hidden = true;
    success.hidden = false;
  });
}
