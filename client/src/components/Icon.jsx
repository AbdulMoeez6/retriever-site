// Inline SVG icons ported from the HTML template.
const P = {
  command: <><rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" /><rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" /></>,
  shield: <><path d="M12 3.2 19 5.6V12c0 4.2-2.8 7.1-7 9.1C7.8 19.1 5 16.2 5 12V5.6L12 3.2z" /><path d="m8.6 12 2.3 2.3 4.6-5" /></>,
  search: <><circle cx="11" cy="11" r="6.5" /><path d="M16.2 16.2 21 21" /></>,
  doc: <><path d="M7 3.5h7l5 5V20a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 20V5A1.5 1.5 0 0 1 7 3.5z" /><path d="M14 3.5V9h5.5M9 13h6M9 17h4" /></>,
  fund: <><path d="M4 19V6.5A1.5 1.5 0 0 1 5.5 5H20" /><path d="M4 16h14.5A1.5 1.5 0 0 0 20 14.5V5" /><path d="M8 12v4M12 9v7M16 11v5" /></>,
  map: <><path d="M8 5.5 3.5 7.5v12L8 17.5l8 2 4.5-2v-12L16 7.5 8 5.5z" /><path d="M8 5.5v12M16 7.5v12" /></>,
  plan: <><rect x="5" y="4" width="14" height="16" rx="2" /><path d="M9 3.5v3M15 3.5v3M8 11h8M8 15h5" /></>,
  people: <><circle cx="9" cy="8" r="2.4" /><path d="M4.8 18c.5-2.6 2.2-4 4.2-4s3.7 1.4 4.2 4" /><circle cx="16.2" cy="9" r="2" /><path d="M15 14.2c1.8.2 3.3 1.4 3.8 3.8" /></>,
  bell: <><path d="M6.4 9.2a5.6 5.6 0 0 1 11.2 0c0 5 2.1 6.4 2.1 6.4H4.3s2.1-1.4 2.1-6.4" /><path d="M9.6 18.6a2.4 2.4 0 0 0 4.8 0" /></>,
  sun: <><circle cx="12" cy="12" r="3.4" /><path d="M12 3v1.8M12 19.2V21M4.9 4.9l1.3 1.3M17.8 17.8l1.3 1.3M3 12h1.8M19.2 12H21M4.9 19.1l1.3-1.3M17.8 6.2l1.3-1.3" /></>,
  moon: <path d="M16.8 13.2A6.3 6.3 0 0 1 10.4 5 7 7 0 1 0 19 14.6a6.2 6.2 0 0 1-2.2-1.4z" />,
  gear: <><circle cx="12" cy="12" r="3" /><path d="M19.4 13.5a1.5 1.5 0 0 0 .3 1.7l.1.1a1.8 1.8 0 1 1-2.5 2.5l-.1-.1a1.5 1.5 0 0 0-1.7-.3 1.5 1.5 0 0 0-.9 1.4V19a1.8 1.8 0 1 1-3.6 0v-.1a1.5 1.5 0 0 0-1-1.4 1.5 1.5 0 0 0-1.7.3l-.1.1A1.8 1.8 0 1 1 4.2 15.3l.1-.1a1.5 1.5 0 0 0 .3-1.7 1.5 1.5 0 0 0-1.4-.9H3a1.8 1.8 0 1 1 0-3.6h.1a1.5 1.5 0 0 0 1.4-.9 1.5 1.5 0 0 0-.3-1.7l-.1-.1A1.8 1.8 0 1 1 6.6 4.2l.1.1a1.5 1.5 0 0 0 1.7.3H8.5A1.5 1.5 0 0 0 9.4 3.2V3a1.8 1.8 0 1 1 3.6 0v.1a1.5 1.5 0 0 0 .9 1.4 1.5 1.5 0 0 0 1.7-.3l.1-.1A1.8 1.8 0 1 1 19.8 6.6l-.1.1a1.5 1.5 0 0 0-.3 1.7V8.5c.2.5.8.9 1.4.9H21a1.8 1.8 0 1 1 0 3.6h-.1a1.5 1.5 0 0 0-1.4.9z" /></>,
  download: <path d="M12 4v10M8.5 11.5 12 15l3.5-3.5M5 19h14" />,
  x: <path d="M6 6l12 12M18 6 6 18" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  plus: <path d="M12 5v14M5 12h14" />,
  share: <><circle cx="18" cy="6" r="2.2" /><circle cx="6" cy="12" r="2.2" /><circle cx="18" cy="18" r="2.2" /><path d="M8 12.9 16 16.6M16 7.4 8 11.1" /></>,
  copy: <><rect x="8" y="8" width="11" height="11" rx="2" /><path d="M5 16V5.8A1.8 1.8 0 0 1 6.8 4H16" /></>,
  back: <path d="M15 6 9 12l6 6" />,
  signout: <path d="M10 6H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h4M14 12h8M19 8l3 4-3 4" />,
  play: <path d="M8 5.5v13l10.5-6.5L8 5.5z" fill="currentColor" stroke="none" />,
};

export default function Icon({ name, className = "size-4", strokeWidth = 1.8 }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} aria-hidden="true">
      {P[name]}
    </svg>
  );
}

export function FileIcon({ type }) {
  const common = { className: "size-5", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, "aria-hidden": true };
  if (type === "image") return <svg {...common}><rect x="4" y="5" width="16" height="14" rx="2" /><circle cx="9" cy="10" r="1.4" /><path d="m8 16 3-3 3 2 3-4 3 5" /></svg>;
  if (type === "sheet") return <svg {...common}><rect x="5" y="4" width="14" height="16" rx="2" /><path d="M5 9h14M10 4v16" /></svg>;
  if (type === "doc") return <svg {...common}><path d="M7 3.5h7l5 5V20a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 20V5A1.5 1.5 0 0 1 7 3.5z" /><path d="M14 3.5V9h5.5M9 13h6M9 17h4" /></svg>;
  return <svg {...common}><path d="M7 3.5h7l5 5V20a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 20V5A1.5 1.5 0 0 1 7 3.5z" /><path d="M14 3.5V9h5.5" /></svg>;
}
