import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "../components/ui.jsx";
import { useApp } from "../lib/store.jsx";

export default function SignIn() {
  const { patchUi, profile } = useApp();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const submit = (e) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    if (!f.get("email") || !f.get("password")) { setError("Enter a work email and password to continue."); return; }
    patchUi({ session: true });
    navigate("/app/mission-command");
  };
  return (
    <div className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-page px-4 text-ink dark:bg-[#0C1017] dark:text-slate-100">
      <div className="aurora aurora-soft" />
      <div className="dotgrid pointer-events-none absolute inset-0 opacity-50" />
      <div className="page-enter relative w-full max-w-md">
        <Link to="/" className="mb-8 inline-block"><Logo /></Link>
        <div className="card p-6">
          <h1 className="text-xl font-semibold">Sign in</h1>
          <p className="mt-1 text-sm text-muted dark:text-slate-400">Use any work email and password to enter the sample workspace.</p>
          <form onSubmit={submit} className="mt-5 grid gap-3" noValidate>
            <label className="grid gap-1 text-sm">Work email<input name="email" type="email" defaultValue={profile.email} required className="field" /></label>
            <label className="grid gap-1 text-sm">Password<input name="password" type="password" defaultValue="demo" required className="field" /></label>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button type="submit" className="btn-lift mt-2 rounded-lg bg-navy px-4 py-2.5 text-sm font-medium text-white hover:bg-navy-700">Sign in</button>
          </form>
        </div>
        <p className="mt-4 text-center text-sm text-muted dark:text-slate-400"><Link to="/book-demo" className="underline-offset-2 hover:underline">Book a demo</Link></p>
      </div>
    </div>
  );
}
