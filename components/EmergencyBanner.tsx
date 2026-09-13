"use client";

import React from "react";
import { AlertTriangle, Phone, ShieldAlert, X, ExternalLink } from "lucide-react";
import { EmergencyHelpline, VERIFIED_HELPLINES } from "@/data/legalKnowledge";

interface EmergencyBannerProps {
  helplines?: EmergencyHelpline[];
  priorityMessage?: string;
  onClose?: () => void;
  language: "en" | "hi";
}

export const EmergencyBanner: React.FC<EmergencyBannerProps> = ({
  helplines = [
    VERIFIED_HELPLINES.nationalEmergency,
    VERIFIED_HELPLINES.womenHelpline,
    VERIFIED_HELPLINES.cyberCrime,
    VERIFIED_HELPLINES.womenPolice,
    VERIFIED_HELPLINES.legalAid,
  ],
  priorityMessage,
  onClose,
  language,
}) => {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="my-4 rounded-xl border-2 border-rose-600/80 bg-rose-950/20 dark:bg-rose-950/40 p-4 sm:p-5 shadow-lg shadow-rose-900/10 text-card-foreground"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-rose-600 text-white shrink-0 mt-0.5">
            <ShieldAlert className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-base sm:text-lg text-rose-700 dark:text-rose-400">
                {language === "hi" ? "आपातकालीन सुरक्षा एवं सहायता हेल्पलाइन" : "PRIORITY EMERGENCY SAFETY HELPLINES"}
              </h2>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-600 text-white">
                24x7 Live
              </span>
            </div>
            <p className="text-xs sm:text-sm text-foreground/90 mt-1">
              {priorityMessage ||
                (language === "hi"
                  ? "यदि आप या आपका कोई परिजन किसी तत्काल खतरे या संकट में है, तो पहले आपातकालीन सहायता लें:"
                  : "If you or someone around you is in immediate physical danger, distress, or financial fraud, please dial the verified helplines below immediately:")}
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-rose-500/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
            aria-label="Dismiss emergency banner"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Helplines Grid */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {helplines.map((line) => (
          <div
            key={line.number}
            className="flex items-center justify-between p-3 rounded-lg border border-rose-500/30 bg-card/90 hover:border-rose-500 transition-all shadow-sm"
          >
            <div className="pr-2">
              <div className="flex items-center gap-1.5">
                <span className="font-mono font-black text-lg text-rose-600 dark:text-rose-400">
                  {line.number}
                </span>
                {line.is24x7 && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 font-semibold">
                    24x7
                  </span>
                )}
              </div>
              <p className="text-xs font-semibold text-foreground line-clamp-1">{line.name}</p>
              <p className="text-[11px] text-muted-foreground line-clamp-1">{line.authority}</p>
            </div>

            <a
              href={`tel:${line.number}`}
              className="flex items-center justify-center w-10 h-10 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold transition-transform active:scale-95 shadow-md shadow-rose-600/30 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
              aria-label={`Call ${line.name} on ${line.number}`}
            >
              <Phone className="w-4 h-4" />
            </a>
          </div>
        ))}
      </div>

      <div className="mt-3 pt-3 border-t border-rose-500/20 flex items-center justify-between text-[11px] text-muted-foreground">
        <span>Numbers verified against Ministry of Home Affairs (ERSS 112) & MWCD (181).</span>
        <span className="font-medium text-rose-600 dark:text-rose-400">Toll-Free Across All Indian States & UTs</span>
      </div>
    </div>
  );
};
