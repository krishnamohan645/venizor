"use client";
import { track } from "@/lib/track";
import { ArrowUpRight, Download } from "lucide-react";
import { LeadForm } from "./lead-form";

export function ResultFollowup({
  report,
  source,
}: {
  report: string;
  source: "scope" | "simulator";
}) {
  function download() {
    const url = URL.createObjectURL(
      new Blob([report], { type: "text/plain;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = `venizor-${source}-report.txt`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    track(source === "scope" ? "scope_wizard_complete" : "simulator_complete", {
      action: "download",
    });
  }
  return (
    <div className="result-followup">
      <p>
        Your result is available without sharing your email. This is an
        indicative planning aid, not a quote or a measured production benchmark.
      </p>
      <button type="button" className="pill-button light" onClick={download}>
        Download your report <Download size={16} />
      </button>
      <details>
        <summary>
          Want to discuss this result? <ArrowUpRight size={16} />
        </summary>
        <p>
          Share the report with us and add your goals. When online delivery is
          enabled, you can also request an email copy.
        </p>
        <LeadForm source={source} initialMessage={report} report={report} />
      </details>
    </div>
  );
}
