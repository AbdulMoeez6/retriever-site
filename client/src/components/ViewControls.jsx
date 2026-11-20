import { useState } from "react";
import { storageGet, storageSet } from "../lib/env.js";
import Icon from "./Icon.jsx";

// In-memory copy so choices survive page changes even where storage is blocked (sandboxed viewers).
const memory = new Map();

/** A view preference remembered on this device (fails soft where storage is blocked). */
export function usePref(key, initial, allowed) {
  const k = `retriever.view.${key}`;
  const [value, setValue] = useState(() => {
    const v = memory.has(k) ? memory.get(k) : storageGet(k);
    return v != null && (!allowed || allowed.includes(v)) ? v : initial;
  });
  const set = (v) => { setValue(v); memory.set(k, v); storageSet(k, v); };
  return [value, set];
}

/** Compact segmented control. Options: { value, label, icon }. Icon-only when `iconOnly`. */
export function Segmented({ options, value, onChange, label, iconOnly = false }) {
  return (
    <div role="group" aria-label={label} className="inline-flex items-center gap-0.5 rounded-lg border border-line bg-white p-0.5 dark:border-slate-700 dark:bg-[#161C27]">
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button key={o.value} type="button" aria-pressed={on} title={o.label} aria-label={iconOnly ? o.label : undefined} onClick={() => onChange(o.value)}
            className={`inline-flex h-7 items-center gap-1.5 rounded-md text-xs transition-colors duration-200 ${iconOnly ? "w-7 justify-center" : "px-2.5"} ${on ? "bg-navy text-white dark:bg-slate-200 dark:text-navy" : "text-muted hover:bg-soft hover:text-ink dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"}`}>
            {o.icon && <Icon name={o.icon} className="size-3.5" />}
            {!iconOnly && o.label}
          </button>
        );
      })}
    </div>
  );
}

const VIEW_META = { table: ["Table", "table"], cards: ["Cards", "cards"], board: ["Board", "board"] };

/** Table / Cards / Board switcher, remembered per page. */
export function useViewMode(key, modes, initial = modes[0]) {
  const [mode, setMode] = usePref(`${key}.mode`, initial, modes);
  const control = (
    <Segmented label="View" iconOnly value={mode} onChange={setMode}
      options={modes.map((m) => ({ value: m, label: VIEW_META[m][0], icon: VIEW_META[m][1] }))} />
  );
  return [mode, control];
}

/** Show or hide a section, remembered per page. */
export function useShown(key, initial = true) {
  const [v, set] = usePref(`${key}.shown`, initial ? "1" : "0", ["1", "0"]);
  const shown = v === "1";
  const toggle = (
    <button type="button" aria-pressed={!shown} title={shown ? "Hide" : "Show"} aria-label={shown ? "Hide" : "Show"} onClick={() => set(shown ? "0" : "1")}
      className="grid size-8 place-items-center rounded-lg border border-line bg-white text-muted transition-colors hover:bg-soft hover:text-ink dark:border-slate-700 dark:bg-[#161C27] dark:text-slate-400">
      <Icon name={shown ? "eye" : "eyeOff"} className="size-3.5" />
    </button>
  );
  return [shown, toggle];
}

/** Plain data table in the template style. Rows open with click or Enter when `onRow` is set. */
export function DataTable({ columns, rows, rowKey = (r) => r.id, onRow, empty = "Nothing here yet." }) {
  return (
    <div className="card tick-in overflow-x-auto">
      <table className="w-full min-w-[40rem] text-left text-sm">
        <thead className="border-b border-line bg-soft/70 text-xs text-muted dark:border-slate-800 dark:bg-white/5 dark:text-slate-400">
          <tr>{columns.map((c) => <th key={c.label} className={`px-4 py-2.5 font-medium ${c.className || ""}`}>{c.label}</th>)}</tr>
        </thead>
        <tbody>
          {rows.length ? rows.map((r) => (
            <tr key={rowKey(r)} tabIndex={onRow ? 0 : undefined} onClick={onRow ? () => onRow(r) : undefined}
              onKeyDown={onRow ? (e) => { if (e.key === "Enter") onRow(r); } : undefined}
              className={`border-b border-line last:border-0 dark:border-slate-800 ${onRow ? "row-hover cursor-pointer outline-none focus-visible:bg-soft" : ""}`}>
              {columns.map((c) => <td key={c.label} className={`px-4 py-3 align-middle ${c.className || ""}`}>{c.cell(r)}</td>)}
            </tr>
          )) : <tr><td colSpan={columns.length} className="px-4 py-8 text-center text-sm text-muted dark:text-slate-400">{empty}</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

/** Stops a click inside a clickable row from opening the row. */
export const stop = (fn) => (e) => { e.stopPropagation(); fn(e); };
