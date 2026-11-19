import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import GlassVideo from "../components/GlassVideo.jsx";
import KpiCard from "../components/KpiCard.jsx";
import { HistoryChart } from "../components/Charts.jsx";
import Icon from "../components/Icon.jsx";
import { Mark } from "../components/ui.jsx";
import { useApp } from "../lib/store.jsx";
import { useGreeting } from "../lib/format.js";
import { ASSETS } from "../lib/assets.js";

export default function Landing() {
  const { currentTech, kpis, profile } = useApp();
  const t = currentTech();
  const k = kpis();
  const greet = useGreeting();

  return (
    <div className="hero-editorial min-h-screen text-ink dark:text-slate-100">
      <Navbar />
      <main className="page-enter">
        {/* Hero — calm, editorial, with a large softly faded Retriever watermark */}
        <section id="product" className="hero-editorial relative isolate overflow-hidden pb-24 pt-20 sm:pt-28">
          <div className="aurora" />
          <div className="dotgrid hero-dots pointer-events-none absolute inset-0" />
          <div aria-hidden="true" className="hero-mark" />
          <div aria-hidden="true" className="hero-fade-bottom" />
          <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-16 lg:grid-cols-[1.2fr_0.8fr] lg:gap-12 xl:gap-20">
              <div className="max-w-2xl">
                <h1 className="hero-title hero-rise text-balance text-[2.6rem] font-bold leading-[1.04] tracking-[-0.025em] sm:text-6xl lg:text-[4.25rem]" style={{ "--d": "80ms" }}>
                  Identify the opportunity. Validate the evidence. <span className="hero-accent">Advance the technology.</span>
                </h1>
                <p className="hero-rise mt-8 max-w-xl text-lg text-muted dark:text-slate-300 sm:text-xl" style={{ "--d": "160ms" }}>Retriever structures the evidence; your team makes the call.</p>
                <div className="hero-rise mt-12 flex flex-wrap items-center gap-3" style={{ "--d": "240ms" }}>
                  <Link to="/book-demo" className="btn-lift inline-flex h-12 items-center gap-2 rounded-lg bg-navy px-6 text-base font-medium text-white shadow-[0_10px_24px_-12px_rgba(27,54,93,0.7)] hover:bg-navy-700">Book a demo <Icon name="arrow" /></Link>
                </div>
                <p className="hero-rise mt-5 text-sm text-muted dark:text-slate-400" style={{ "--d": "300ms" }}>For tech transfer offices, government programs and defense primes.</p>
              </div>
              <div className="flex justify-center lg:justify-end lg:pr-4">
                <GlassVideo variant="device" src={ASSETS.readinessVideo} poster={ASSETS.readinessPoster}
                  label="Readiness walkthrough" className="w-[min(19rem,76vw)]" maxTilt={7} revealAfter={600} />
              </div>
            </div>

            {/* Dashboard preview */}
            <Link to="/signin" className="relative mx-auto mt-24 block w-full max-w-6xl text-left" aria-label="Open the Retriever dashboard preview">
              <div aria-hidden="true" className="absolute -top-8 left-1/2 -z-10 h-40 w-[85%] -translate-x-1/2 rounded-full bg-navy/20 blur-3xl lg:h-72" />
              <div className="relative overflow-hidden rounded-2xl border border-navy/15 bg-white p-2 shadow-raised ring-4 ring-navy/5 dark:border-slate-700 dark:bg-[#161C27]">
                <div className="overflow-hidden rounded-xl bg-page dark:bg-[#0C1017]">
                  <div className="flex min-h-[22rem]">
                    <aside className="hidden w-48 shrink-0 border-r border-line bg-soft p-3 text-xs dark:border-slate-800 dark:bg-[#121722] sm:block">
                      <div className="mb-4 flex items-center gap-2 font-semibold"><Mark size={20} /> Retriever</div>
                      <div className="rounded-md bg-white px-2 py-1.5 font-medium dark:bg-white/10">Mission Command</div>
                      <div className="mt-1 px-2 py-1.5 text-muted dark:text-slate-400">Readiness</div>
                      <div className="px-2 py-1.5 text-muted dark:text-slate-400">Opportunities</div>
                      <div className="px-2 py-1.5 text-muted dark:text-slate-400">Funding</div>
                    </aside>
                    <div className="flex-1 p-5">
                      <div className="text-lg font-semibold">{greet}, {profile.name.split(" ")[0]}</div>
                      <div className="mt-1 text-xs text-muted dark:text-slate-400">Mission Command · {t.name} · Sample data</div>
                      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                        <KpiCard compact label="Technologies" value={k.techs} />
                        <KpiCard compact label="Average TRL" value={k.avgTrl} />
                        <KpiCard compact label="Assessments" value={k.assessments} />
                        <KpiCard compact label="Funding matches" value={k.funding} />
                      </div>
                      <div className="card mt-3 p-4">
                        <div className="text-sm font-medium">Readiness over time</div>
                        <div className="mt-1 text-xs text-muted dark:text-slate-400">Only human-reviewed evidence counts. TRL 1 to 9.</div>
                        <HistoryChart techId={t.id} area height={150} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
