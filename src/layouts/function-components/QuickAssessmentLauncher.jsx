// Mounts the workspace's five-question quick assessment on marketing pages.
// Any element with [data-quick-open] opens it (see scripts/site.js).
import { useEffect } from "react";
import { QuickAssessment } from "@/layouts/function-components/app/QuickAssessment";
import { closeOverlays, patchUi } from "@/lib/store";

export default function QuickAssessmentLauncher() {
  useEffect(() => {
    const open = () => patchUi({ quickOpen: true });
    const onKey = (event) => event.key === "Escape" && closeOverlays();
    window.addEventListener("retriever:quick-open", open);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("retriever:quick-open", open);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return <QuickAssessment />;
}
