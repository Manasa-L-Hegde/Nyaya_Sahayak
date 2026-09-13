"use client";

import React from "react";
import { Leaf, X, Zap, Database, Server, Info, ShieldCheck } from "lucide-react";

interface GreenAIMetricsModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: "en" | "hi";
  stats?: {
    retrievalLatencyMs: number;
    tokensSavedEstimate: number;
  };
}

export const GreenAIMetricsModal: React.FC<GreenAIMetricsModalProps> = ({
  isOpen,
  onClose,
  language,
  stats = { retrievalLatencyMs: 2.4, tokensSavedEstimate: 1850 },
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="green-ai-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
    >
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-emerald-500/30 bg-card p-4 sm:p-6 shadow-2xl text-card-foreground">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          aria-label="Close Green AI Metrics Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-3 sm:mb-4 pr-8">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <Leaf className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <h3 id="green-ai-title" className="font-bold text-base sm:text-lg text-foreground">
              {language === "hi" ? "ग्रीन एआई (Green AI) आर्किटेक्चर" : "Green AI Architecture & Efficiency"}
            </h3>
            <p className="text-[11px] sm:text-xs text-muted-foreground">
              {language === "hi"
                ? "टोकन अनुकूलन एवं शून्य-क्लाउड डेटाबेस पदचिह्न"
                : "Token Optimization & Zero-Idle-Cloud Footprint"}
            </p>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 my-3 sm:my-4">
          <div className="p-3 sm:p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-1">
              <Zap className="w-3.5 h-3.5" />
              <span>{language === "hi" ? "खोज विलंबता" : "Retrieval Latency"}</span>
            </div>
            <p className="font-mono font-bold text-xl sm:text-2xl text-foreground">
              &lt; {stats.retrievalLatencyMs} ms
            </p>
            <p className="text-[10px] sm:text-[11px] text-muted-foreground mt-0.5">
              Sub-millisecond in-memory statutory search
            </p>
          </div>

          <div className="p-3 sm:p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-1">
              <Database className="w-3.5 h-3.5" />
              <span>{language === "hi" ? "बचाए गए टोकन" : "Tokens Saved / Call"}</span>
            </div>
            <p className="font-mono font-bold text-xl sm:text-2xl text-foreground">
              ~{stats.tokensSavedEstimate.toLocaleString()}
            </p>
            <p className="text-[10px] sm:text-[11px] text-muted-foreground mt-0.5">
              Per query vs brute-force multi-doc RAG
            </p>
          </div>
        </div>

        {/* Honest Labeling Caption */}
        <div className="p-2.5 sm:p-3 rounded-lg border border-border bg-muted/30 text-xs text-muted-foreground flex items-start gap-2 mb-3 sm:mb-4">
          <Info className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-[11px] sm:text-xs">
            <span className="font-semibold text-foreground">Honest Measurement Indicator:</span>{" "}
            <em>Illustrative estimate based on compact prompt token savings vs. typical 24/7 vector-DB inference.</em>
          </div>
        </div>

        {/* Principles list */}
        <div className="space-y-2 text-xs">
          <div className="flex items-start gap-2 p-2 sm:p-2.5 rounded-lg bg-card border border-border">
            <Server className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-foreground">Zero 24/7 Vector DB Cloud Waste</p>
              <p className="text-muted-foreground text-[11px] sm:text-xs">
                No persistent idle cloud GPUs or vector clusters running constantly. Uses an optimized in-memory micro-index under 200KB.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2 p-2 sm:p-2.5 rounded-lg bg-card border border-border">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-foreground">Compact Prompt Engineering</p>
              <p className="text-muted-foreground text-[11px] sm:text-xs">
                Precision statutory extraction supplies only relevant sections to Gemini 2.0 Flash rather than dumping entire multi-page law PDFs.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 sm:mt-5 text-right">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            {language === "hi" ? "समझ गया" : "Close"}
          </button>
        </div>
      </div>
    </div>
  );
};
