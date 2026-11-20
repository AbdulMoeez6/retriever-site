import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Icon from "./Icon.jsx";
import { prefersReducedMotion, useReveal } from "../lib/motion.js";

/** Fades and slides its children in once they enter the viewport. Visible without JavaScript. */
export function Reveal({ as: Tag = "div", delay = 0, dir = "", className = "", children, ...rest }) {
  const [ref, revealed] = useReveal({ threshold: 0.15 });
  return (
    <Tag ref={ref} className={`sr ${dir ? `sr-${dir}` : ""} ${revealed ? "revealed" : ""} ${className}`} style={{ "--sr-d": `${delay}ms` }} {...rest}>
      {children}
    </Tag>
  );
}

/** Shows the final number in static HTML; counts up from zero the first time it scrolls into view. */
function CountUp({ end, suffix = "" }) {
  const [ref, revealed] = useReveal({ threshold: 0.4 });
  const [val, setVal] = useState(end);
  useEffect(() => {
    if (!revealed || prefersReducedMotion()) return;
    let raf; const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / 1100);
      setVal(Math.round(end * (1 - Math.pow(1 - t, 3))));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    setVal(0);
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [revealed, end]);
  return <span ref={ref} className="tabular-nums">{val}{suffix}</span>;
}

/** Moves the card spotlight with the pointer. */
const spotlight = (e) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
};

const FEATURES = [
  { icon: "command", eyebrow: "Mission Command", title: "One pilot workflow, seven clear steps",
    body: "From Technology Profile to Action Plan, every step shows what is done, what is next and what it rests on.",
    more: "Steps tick from the record, not from clicks: a step is done when the evidence behind it exists. Each technology keeps its own progress.", span: "lg:col-span-2", visual: "workflow" },
  { icon: "fund", eyebrow: "Opportunities", title: "A pipeline from match to award",
    body: "Funding matches move through Matched, Reviewing, Drafting, Submitted and Awarded.",
    more: "Each card carries the program, amount, deadline and fit, so the whole team sees where every opportunity stands.", visual: "pipeline" },
  { icon: "shield", eyebrow: "Readiness", title: "TRL, MRL and IRL, grounded in evidence",
    body: "Levels come from human-reviewed evidence only, with every score traceable to its source.",
    more: "A readiness gate keeps scoring closed until a Technology Profile exists, and each level shows the evidence still needed to move up.", visual: "ladder" },
  { icon: "doc", eyebrow: "Knowledge Base", title: "Documents and records in one place",
    body: "Test reports, patents and letters of support sit beside the opportunity records they back.",
    more: "Uploads are reviewed before they count, and readiness gaps and action plans link straight back to the documents." },
  { icon: "map", eyebrow: "Commercialization Trail", title: "A phased path to deployment",
    body: "Now, Next and Later phases connect today's level to the target level.",
    more: "Each phase holds concrete items you can tick off, and the trail can be turned into actions or shared as a PDF." },
  { icon: "target", eyebrow: "Readiness Questionnaire", title: "Twelve sections, saved as you go",
    body: "Company, technology, customer discovery, funding, manufacturing, risk and more.",
    more: "Progress is tracked per section, answers save automatically, and the answers feed the profile, the readiness view and proposals.", span: "lg:col-span-2", visual: "sections" },
  { icon: "people", eyebrow: "Team", title: "Clear roles for every seat",
    body: "Owners, admins and members, with an activity feed of who changed what.",
    more: "Invite colleagues by email, assign a role, and keep reviews and approvals with the people accountable for them." },
  { icon: "pen", eyebrow: "Proposal Assistant", title: "Proposal outlines from your own answers",
    body: "Executive summary, technical approach and readiness sections drafted from fixed templates.",
    more: "Every section cites the questionnaire answers it came from, so reviewers can check each statement before export.", span: "sm:col-span-2 lg:col-span-3", visual: "proposal" },
];

const STAGES = [["Matched", 34], ["Reviewing", 52], ["Drafting", 22], ["Submitted", 68], ["Awarded", 84]];

function Visual({ kind }) {
  if (kind === "workflow") {
    const steps = ["Profile", "Questionnaire", "Documents", "Readiness", "Opportunities", "Gaps", "Action plan"];
    return (
      <div className="mt-6 flex items-center gap-1.5" aria-hidden="true">
        {steps.map((s, i) => (
          <div key={s} className="flex flex-1 flex-col items-center gap-2">
            <span className={`lf-node grid size-7 place-items-center rounded-full border text-[10px] font-medium ${i < 4 ? "border-navy bg-navy text-white" : i === 4 ? "border-accent bg-accent-soft text-navy" : "border-line bg-white text-muted"}`} style={{ "--i": i }}>
              {i < 4 ? <Icon name="check" className="size-3" strokeWidth={2.6} /> : i + 1}
            </span>
            <span className="hidden text-[10px] text-muted sm:block">{s}</span>
          </div>
        ))}
      </div>
    );
  }
  if (kind === "pipeline") {
    return (
      <div className="mt-6 grid gap-1.5" aria-hidden="true">
        {STAGES.map(([s, w], i) => (
          <div key={s} className="flex items-center gap-2 text-[10px] text-muted">
            <span className="w-14">{s}</span>
            <span className="meter h-1.5 flex-1 rounded-full bg-soft"><span className="rounded-full bg-navy" style={{ "--w": `${w}%`, "--i": i, opacity: 0.45 + i * 0.13 }} /></span>
          </div>
        ))}
      </div>
    );
  }
  if (kind === "ladder") {
    return (
      <div className="mt-6 flex h-16 items-end gap-1" aria-hidden="true">
        {Array.from({ length: 9 }, (_, i) => (
          <span key={i} className={`lf-col flex-1 rounded-sm ${i < 6 ? "bg-navy" : i < 8 ? "border border-dashed border-accent/60 bg-accent-soft" : "bg-soft"}`} style={{ height: `${22 + i * 9}%`, "--i": i }} />
        ))}
      </div>
    );
  }
  if (kind === "sections") {
    const names = ["Company", "Technology", "Customer discovery", "Government", "Funding", "Commercialization", "Manufacturing", "Experimentation", "Partnerships", "Risk", "Strategic goals", "Support"];
    return (
      <div className="mt-6 flex flex-wrap gap-1.5" aria-hidden="true">
        {names.map((n, i) => (
          <span key={n} className={`lf-node rounded-full border px-2.5 py-1 text-[10px] ${i < 7 ? "border-navy bg-navy text-white" : i === 7 ? "border-accent bg-accent-soft text-navy" : "border-line bg-white text-muted"}`} style={{ "--i": i }}>{n}</span>
        ))}
      </div>
    );
  }
  if (kind === "proposal") {
    return (
      <div className="mt-6 grid gap-2 sm:grid-cols-3" aria-hidden="true">
        {["Executive summary", "Technical approach", "Readiness and evidence"].map((s, i) => (
          <div key={s} className="rounded-lg border border-line bg-white p-3">
            <div className="text-[11px] font-medium">{s}</div>
            <div className="mt-2 grid gap-1"><span className="meter h-1 rounded bg-soft"><span className="bg-navy/25" style={{ "--w": "92%", "--i": i }} /></span><span className="meter h-1 rounded bg-soft"><span className="bg-navy/25" style={{ "--w": "70%", "--i": i + 1 }} /></span></div>
            <div className="mt-2 font-mono text-[9px] text-muted">Source · Questionnaire</div>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

function FeatureCard({ f, i }) {
  return (
    <Reveal delay={(i % 3) * 90} className={f.span || ""}>
      <article tabIndex={0} onMouseMove={spotlight} className="feat-card flex h-full flex-col outline-none focus-visible:ring-2 focus-visible:ring-navy/30">
        <div className="flex items-center gap-3">
          <span className="feat-icon grid size-9 place-items-center rounded-lg bg-soft text-navy"><Icon name={f.icon} /></span>
          <span className="text-xs font-medium uppercase tracking-[0.12em] text-muted">{f.eyebrow}</span>
        </div>
        <h3 className="mt-4 text-lg font-semibold tracking-tight">{f.title}</h3>
        <p className="mt-1.5 text-sm text-muted">{f.body}</p>
        <div className="feat-more"><div><p className="border-l-2 border-accent/50 pl-3 text-sm text-ink/80">{f.more}</p></div></div>
        <div className="feat-cue mt-3 text-xs text-muted">Hover for detail</div>
        {f.visual && <div className="mt-auto">{<Visual kind={f.visual} />}</div>}
      </article>
    </Reveal>
  );
}

const LEVELS = [
  { k: "TRL", name: "Technology readiness", v: 6, note: "Prototype demonstrated in a relevant environment." },
  { k: "MRL", name: "Manufacturing readiness", v: 4, note: "Capability to produce in a laboratory environment." },
  { k: "IRL", name: "Integration readiness", v: 5, note: "Interfaces defined and verified with the host system." },
];

export default function LandingFeatures() {
  return (
    <>
      {/* Capabilities bento */}
      <section id="platform" className="relative mx-auto w-full max-w-7xl px-4 pb-8 pt-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <div className="text-xs font-medium uppercase tracking-[0.16em] text-muted">The platform</div>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">One workspace from first match to award</h2>
          <p className="mt-4 text-muted">Every view rests on the same record: the profile, the questionnaire, the documents and the evidence your team has reviewed.</p>
        </Reveal>
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => <FeatureCard key={f.eyebrow} f={f} i={i} />)}
        </div>
      </section>

      {/* Evidence-based readiness */}
      <section id="readiness" className="relative mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal dir="left">
            <div className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Evidence-based readiness</div>
            <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">Readiness you can defend, level by level</h2>
            <p className="mt-4 max-w-lg text-muted">Retriever scores technology, manufacturing and integration readiness only from evidence a person has reviewed. Each level names its source and the evidence still needed to move up.</p>
            <ul className="mt-6 grid gap-3 text-sm">
              {["Human-reviewed evidence only", "Every score traceable to a document", "Gaps turned into a dated action plan"].map((t, i) => (
                <Reveal as="li" key={t} delay={120 + i * 90} className="flex items-center gap-3">
                  <span className="grid size-5 place-items-center rounded-full bg-navy text-white"><Icon name="check" className="size-3" strokeWidth={2.6} /></span>{t}
                </Reveal>
              ))}
            </ul>
            <Link to="/book-demo" className="u-link nudge mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-navy">See it with your own technology <Icon name="arrow" /></Link>
          </Reveal>
          <div className="grid gap-4">
            {LEVELS.map((l, i) => (
              <Reveal key={l.k} dir="right" delay={i * 110}>
                <div onMouseMove={spotlight} className="feat-card p-5">
                  <div className="flex items-baseline justify-between gap-4">
                    <div><span className="font-mono text-xs text-muted">{l.k}</span><div className="text-sm font-medium">{l.name}</div></div>
                    <div className="text-3xl font-semibold tracking-tight text-navy"><CountUp end={l.v} /><span className="text-base font-normal text-muted"> / 9</span></div>
                  </div>
                  <div className="mt-4 grid grid-cols-9 gap-1">
                    {Array.from({ length: 9 }, (_, j) => (
                      <span key={j} className={`lf-seg h-2 rounded-full ${j < l.v ? "bg-navy" : "bg-soft"}`} style={{ "--i": j }} />
                    ))}
                  </div>
                  <div className="feat-more"><div><p className="text-sm text-muted">Sample · {l.note}</p></div></div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

/** Closing band inside the dark showcase. */
export function LandingClosing() {
  return (
    <Reveal className="mx-auto mt-20 max-w-3xl text-center">
      <div className="grid grid-cols-3 gap-4 text-white/90">
        {[["12", "questionnaire sections"], ["7", "pilot workflow steps"], ["3", "readiness scales"]].map(([n, l]) => (
          <div key={l}><div className="text-4xl font-semibold tracking-tight text-white"><CountUp end={Number(n)} /></div><div className="mt-1 text-xs text-white/60">{l}</div></div>
        ))}
      </div>
      <p className="mt-14 text-balance text-2xl font-semibold tracking-tight text-white sm:text-3xl">Retriever structures the evidence; your team makes the call.</p>
      <Link to="/book-demo" className="nudge btn-lift mt-8 inline-flex h-12 items-center gap-2 rounded-lg bg-white px-6 text-base font-medium text-navy hover:bg-white/90">Book a demo <Icon name="arrow" /></Link>
    </Reveal>
  );
}
