import { useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { DEMO_SLOTS } from "../data/nav.js";
import Icon from "../components/Icon.jsx";
import { Mark } from "../components/ui.jsx";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(v) {
  const e = {};
  if (!v.name.trim()) e.name = "Please enter your name.";
  if (!v.email.trim()) e.email = "Please enter your work email.";
  else if (!EMAIL_RE.test(v.email.trim())) e.email = "That email doesn't look quite right.";
  if (!v.org.trim()) e.org = "Please enter your organization.";
  if (!v.slot) e.slot = "Pick a time that suits you.";
  return e;
}

function Field({ id, label, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[13px] font-medium text-slate-300">{label}</label>
      {children}
      <p id={`${id}-err`} className={`bd-err mt-1.5 h-4 text-xs text-rose-300 ${error ? "" : "invisible"}`} aria-live="polite">{error || "\u00a0"}</p>
    </div>
  );
}

/**
 * Book a demo — a dedicated, minimal page.
 * Purely client-side: nothing is ever sent anywhere.
 */
export default function BookDemo() {
  const [params] = useSearchParams();
  const pilot = params.get("intent") === "pilot";
  const [values, setValues] = useState({ name: "", email: "", org: "", slot: "" });
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [done, setDone] = useState(false);
  const refs = { name: useRef(null), email: useRef(null), org: useRef(null), slot: useRef(null) };

  const errors = useMemo(() => validate(values), [values]);
  const show = (k) => (touched[k] || submitted) && errors[k];
  const set = (k) => (e) => setValues((v) => ({ ...v, [k]: e.target.value }));
  const blur = (k) => () => setTouched((t) => ({ ...t, [k]: true }));

  const onSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    const first = ["name", "email", "org", "slot"].find((k) => errors[k]);
    if (first) { refs[first].current?.focus?.(); return; }
    setDone(true); // Sample page: nothing is sent.
  };

  const copy = pilot
    ? { eyebrow: "Founding Partner Pilot", title: <>Request your <span className="text-[#9CC0EA]">pilot invite.</span></>, line: "The Founding Partner Pilot is invite only. Share a few details and we'll follow up.", cta: "Request invite" }
    : { eyebrow: "Book a demo", title: <>See Retriever on <span className="text-[#9CC0EA]">your technology.</span></>, line: "A short, guided walkthrough of evidence-gated readiness, opportunities and funding matches.", cta: "Book a demo" };

  const inputProps = (k, extra = {}) => ({
    id: `bd-${k}`, ref: refs[k], value: values[k], onChange: set(k), onBlur: blur(k),
    "aria-invalid": show(k) ? "true" : "false", "aria-describedby": `bd-${k}-err`, className: "bd-input", ...extra,
  });

  return (
    <div className="bd-page relative isolate flex min-h-screen flex-col overflow-hidden">
      <div className="bd-aurora" aria-hidden="true" />
      <div className="bd-grid" aria-hidden="true" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6 sm:px-8">
        <Link to="/" className="inline-flex items-center gap-2.5 font-semibold tracking-tight text-white" aria-label="Retriever home">
          <Mark size={30} /><span>Retriever</span>
        </Link>
        <Link to="/" className="group inline-flex items-center gap-1.5 text-sm text-slate-400 transition-colors hover:text-white">
          <span className="transition-transform group-hover:-translate-x-0.5"><Icon name="back" /></span> Back to site
        </Link>
      </header>

      <main className="relative z-10 mx-auto grid w-full max-w-6xl flex-1 items-center gap-14 px-6 pb-16 pt-4 sm:px-8 lg:grid-cols-[1fr_27rem] lg:gap-20 lg:pb-24">
        <section className="max-w-xl">
          <p className="bd-rise font-mono text-xs uppercase tracking-[0.18em] text-[#8FB2DC]" style={{ "--d": "0ms" }}>{copy.eyebrow}</p>
          <h1 className="bd-rise mt-5 text-balance text-[2.75rem] font-semibold leading-[1.04] tracking-[-0.03em] text-white sm:text-6xl" style={{ "--d": "70ms" }}>{copy.title}</h1>
          <p className="bd-rise mt-6 max-w-md text-lg leading-relaxed text-slate-300/90" style={{ "--d": "140ms" }}>{copy.line}</p>
          <ul className="bd-rise mt-10 grid gap-3 text-sm text-slate-400" style={{ "--d": "210ms" }}>
            {["Evidence-gated TRL, MRL and IRL", "Only human-reviewed evidence counts", "Your team makes the call"].map((t) => (
              <li key={t} className="flex items-center gap-3">
                <span className="grid size-5 place-items-center rounded-full bg-white/[0.06] ring-1 ring-white/10">
                  <svg viewBox="0 0 24 24" className="size-3 text-[#9CC0EA]" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12 4.5 4.5L19 7" /></svg>
                </span>{t}
              </li>
            ))}
          </ul>
        </section>

        <div className="relative">
        <div aria-hidden="true" className="pointer-events-none absolute -inset-10 -z-10 rounded-[3rem] bg-[radial-gradient(closest-side,rgba(90,150,225,0.28),transparent)] blur-2xl" />
        <section className="bd-card bd-rise p-7 sm:p-8" style={{ "--d": "160ms" }} aria-live="polite">
          {done ? (
            <div className="bd-success flex min-h-[25.6rem] flex-col items-center justify-center text-center">
              <svg width="72" height="72" viewBox="0 0 52 52" aria-hidden="true">
                <circle cx="26" cy="26" r="24" fill="rgba(156,192,234,0.08)" stroke="rgba(156,192,234,0.9)" strokeWidth="2" className="bd-check-ring" />
                <path d="M15 27l7 7 15-16" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="bd-check-tick" />
              </svg>
              <h2 className="mt-6 text-2xl font-semibold tracking-tight text-white">Thanks, {values.name.trim().split(/\s+/)[0]}.</h2>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-slate-400">
                We'll be in touch at <span className="text-slate-200">{values.email.trim()}</span>{values.slot !== "Suggest a time" ? <> about <span className="text-slate-200">{values.slot}</span></> : null}.
              </p>
              <p className="mt-6 text-xs text-slate-500">Nothing was sent from this sample page.</p>
              <Link to="/" className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-[#9CC0EA] hover:text-white">Back to Retriever <Icon name="arrow" /></Link>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate>
              <div className="grid gap-1">
                <Field id="bd-name" label="Full name" error={show("name")}>
                  <input {...inputProps("name", { autoComplete: "name", placeholder: "Jane Doe" })} />
                </Field>
                <Field id="bd-email" label="Work email" error={show("email")}>
                  <input {...inputProps("email", { type: "email", autoComplete: "email", placeholder: "jane@university.edu" })} />
                </Field>
                <Field id="bd-org" label="Organization" error={show("org")}>
                  <input {...inputProps("org", { autoComplete: "organization", placeholder: "Technology transfer office" })} />
                </Field>
                <div>
                  <div id="bd-slot-label" className="mb-2 block text-[13px] font-medium text-slate-300">Preferred time</div>
                  <div ref={refs.slot} tabIndex={-1} role="radiogroup" aria-labelledby="bd-slot-label" aria-describedby="bd-slot-err" className="flex flex-wrap gap-2 outline-none">
                    {DEMO_SLOTS.map((s) => (
                      <button type="button" key={s} role="radio" aria-checked={values.slot === s}
                        onClick={() => { setValues((v) => ({ ...v, slot: s })); setTouched((t) => ({ ...t, slot: true })); }}
                        className="bd-chip">{s}</button>
                    ))}
                  </div>
                  <p id="bd-slot-err" className={`bd-err mt-1.5 h-4 text-xs text-rose-300 ${show("slot") ? "" : "invisible"}`} aria-live="polite">{show("slot") || "\u00a0"}</p>
                </div>
              </div>
              <button type="submit" className="bd-btn mt-5">
                <span className="relative z-10 inline-flex items-center justify-center gap-2">{copy.cta} <Icon name="arrow" /></span>
              </button>
              <p className="mt-4 text-center text-xs text-slate-500">Sample page. Nothing you enter is sent anywhere.</p>
            </form>
          )}
        </section>
        </div>
      </main>
    </div>
  );
}
