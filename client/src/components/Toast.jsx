import { useApp } from "../lib/store.jsx";

export default function Toast() {
  const { toastMsg } = useApp();
  if (!toastMsg) return null;
  return <div className="toast" role="status" aria-live="polite">{toastMsg}</div>;
}
