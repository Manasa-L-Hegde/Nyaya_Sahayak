"use client";

import React from "react";
import { Scale, PhoneCall, Leaf, Sun, Moon } from "lucide-react";

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  language: "en" | "hi";
  setLanguage: (val: "en" | "hi") => void;
  onOpenGreenAI: () => void;
  onTriggerSOS: () => void;
  geminiConnected: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  setDarkMode,
  language,
  setLanguage,
  onOpenGreenAI,
  onTriggerSOS,
  geminiConnected,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-1.5">
        {/* Brand & Logo */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-800 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0">
            <Scale className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-bold text-sm sm:text-lg tracking-tight text-foreground whitespace-nowrap">
                Nyaya Sahayak
              </span>
              <span className="hidden xs:inline text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full font-medium bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                {language === "hi" ? "न्याय सहायक" : "Legal AI"}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground hidden md:block">
              {language === "hi"
                ? "भारत के लिए प्रासंगिक एवं संदर्भ-जागरूक कानूनी सहायक"
                : "Context-Aware AI Legal Assistance for India"}
            </p>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Live Gemini Connection Status Badge (Unmistakable) */}
          <div
            className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-semibold border transition-all ${
              geminiConnected
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400"
                : "bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-400"
            }`}
            title={
              geminiConnected
                ? "Google Gemini 2.0 Flash is actively connected via GEMINI_API_KEY"
                : "Simulator Mode: GEMINI_API_KEY is missing. Set key to activate live Gemini API."
            }
          >
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                geminiConnected ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
              }`}
            />
            <span className="whitespace-nowrap">
              {geminiConnected ? "Gemini Live" : "Simulator"}
            </span>
          </div>

          {/* Green AI Efficiency Badge */}
          <button
            onClick={onOpenGreenAI}
            type="button"
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            aria-label="View Green AI Efficiency Metrics"
          >
            <Leaf className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">Green AI</span>
          </button>

          {/* Emergency SOS Button */}
          <button
            onClick={onTriggerSOS}
            type="button"
            className="flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 transition-all shadow-sm shadow-rose-600/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
            aria-label="Emergency SOS Helplines"
          >
            <PhoneCall className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>SOS</span>
          </button>

          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === "en" ? "hi" : "en")}
            type="button"
            className="px-2 py-1 text-[11px] sm:text-xs font-semibold rounded-lg border border-border bg-card text-foreground hover:bg-accent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label={`Switch language to ${language === "en" ? "Hindi" : "English"}`}
          >
            {language === "en" ? "हिं" : "EN"}
          </button>

          {/* Dark/Light mode toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            type="button"
            className="p-1.5 sm:p-2 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-accent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? (
              <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
            ) : (
              <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-700" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
