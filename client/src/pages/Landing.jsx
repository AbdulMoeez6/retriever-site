import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Icon from "../components/Icon.jsx";

export default function Landing() {
  return (
    <div className="hero-editorial min-h-screen text-ink dark:text-slate-100">
      <Navbar />
      <main className="page-enter">
        {/* Hero — calm, editorial, with a large softly faded Retriever watermark */}
        <section id="product" className="hero-editorial relative isolate overflow-hidden pb-24 pt-20 sm:pt-28">
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
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
