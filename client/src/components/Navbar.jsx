import { Link, useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../lib/store.jsx";
import Icon from "./Icon.jsx";
import { Logo } from "./ui.jsx";

export default function Navbar() {
  const { theme, toggleTheme } = useApp();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const navClass = (on) => `rounded-md px-3 py-2 text-sm transition-colors ${on ? "font-medium text-ink dark:text-white" : "text-muted hover:text-ink dark:text-slate-400 dark:hover:text-white"}`;

  const scrollProduct = () => {
    const go = () => document.getElementById("product")?.scrollIntoView({ behavior: "smooth" });
    if (pathname !== "/") { navigate("/"); setTimeout(go, 60); } else go();
  };

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-white/85 backdrop-blur-xl dark:border-slate-800 dark:bg-[#0C1017]/85">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-8 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="rounded-md" aria-label="Retriever home"><Logo /></Link>
        <nav className="hidden items-center gap-0.5 md:flex" aria-label="Main">
          <button type="button" onClick={scrollProduct} className={navClass(false)}>Product</button>
        </nav>
        <div className="ms-auto flex items-center gap-2">
          <span className="hidden rounded-full border border-line px-2 py-0.5 text-[11px] font-medium text-muted dark:border-slate-700 dark:text-slate-400 lg:inline">Sample data</span>
          <button type="button" onClick={toggleTheme} className="grid size-9 place-items-center rounded-md text-muted hover:bg-soft dark:text-slate-400 dark:hover:bg-white/10" aria-label="Toggle colour theme">
            <Icon name={theme === "dark" ? "sun" : "moon"} />
          </button>
          <Link to="/signin" className="hidden rounded-md px-3 py-2 text-sm text-ink dark:text-slate-100 sm:inline">Sign in</Link>
          <Link to="/book-demo" className="btn-lift rounded-lg bg-navy px-4 py-2 text-sm font-medium text-white hover:bg-navy-700">Book a demo</Link>
        </div>
      </div>
    </header>
  );
}
