export function matchesMedia(A) {
  try {
    return !!(typeof window !== "undefined" && window.matchMedia && window.matchMedia(A).matches);
  } catch {
    return false;
  }
}

export const prefersReducedMotion = () =>
  matchesMedia("(prefers-reduced-motion: reduce)");

export const initials = (A) =>
  String(A || "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((e) => e[0])
    .join("")
    .toUpperCase() || "?";

export const greetingForNow = () => {
  if (typeof window > "u") return "Good afternoon";
  const A = new Date().getHours();
  return A < 12 ? "Good morning" : A < 18 ? "Good afternoon" : "Good evening";
};

export const fitLabel = (A) =>
  A >= 75 ? "Strong fit" : A >= 65 ? "Good fit" : "Fair fit";

export const latestValue = (A) => {
  const e = [...(A || [])].reverse().find((t) => t != null);
  return e ?? null;
};

export const percent = (A, e) => (e ? Math.round((A / e) * 100) : 0);

export const makeId = (A) => A + Math.random().toString(36).slice(2, 8);

export const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const formatIsoDate = (A) =>
  `${A.slice(8, 10)} ${MONTH_NAMES[Number(A.slice(5, 7)) - 1]} ${A.slice(0, 4)}`;

export const csvCell = (A) => {
  let e = String(A ?? "");
  return (
    /^[=+\-@]/.test(e) && (e = "'" + e),
    /[",\n]/.test(e) && (e = '"' + e.replace(/"/g, '""') + '"'),
    e
  );
};
