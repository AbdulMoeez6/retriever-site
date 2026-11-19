import { useEffect, useState } from "react";

export const initials = (name) =>
  String(name || "").split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]).join("").toUpperCase() || "?";
export const greeting = () => {
  if (typeof window === "undefined") return "Good afternoon";
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
};
export const fitFromScore = (score) => (score >= 75 ? "Strong fit" : score >= 65 ? "Good fit" : "Fair fit");
export const lastLevel = (arr) => { const v = [...(arr || [])].reverse().find((x) => x != null); return v == null ? null : v; };
export const usagePct = (used, limit) => (!limit ? 0 : Math.round((used / limit) * 100));
export const uid = (p) => p + Math.random().toString(36).slice(2, 8);
const MON = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
export const isoToLabel = (iso) => `${iso.slice(8, 10)} ${MON[Number(iso.slice(5, 7)) - 1]} ${iso.slice(0, 4)}`;
export const escapeCsv = (value) => {
  let s = String(value == null ? "" : value);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  if (/[",\n]/.test(s)) s = '"' + s.replace(/"/g, '""') + '"';
  return s;
};

/** Greeting that matches the prerendered HTML on first render, then updates to the local time. */
export function useGreeting() {
  const [g, setG] = useState("Good afternoon");
  useEffect(() => { setG(greeting()); }, []);
  return g;
}
