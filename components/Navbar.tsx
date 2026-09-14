"use client";

import React from "react";
import { Scale, PhoneCall, Leaf, Sun, Moon } from "lucide-react";

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  language: "en" | "hi";
  setLanguage: (lang: "en" | "hi") => void;
  onOpenGreenAI: () => void;
  onTriggerSOS: () => void;
  geminiConnected?: boolean;
  modelName?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  setDarkMode,
  language,
  setLanguage,
  onOpenGreenAI,
  onTriggerSOS,
  geminiConnected = false,
  modelName,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left branding */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-800 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0 transition-transform duration-200 hover:scale-105 cursor-pointer">
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
          {/* Live Gemini Connection Status Badge */}
          <div
            className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-semibold border transition-all duration-200 hover:scale-[1.02] cursor-default ${
              geminiConnected
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400"
                : "bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-400"
            }`}
            title={
              geminiConnected
                ? `Google ${modelName || "Gemini"} is actively verified and connected via GEMINI_API_KEY`
                : "Simulator Mode: GEMINI_API_KEY is missing or unreachable. Set key in environment to activate live API."
            }
          >
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                geminiConnected ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
              }`}
            />
            <span className="whitespace-nowrap font-medium">
              {geminiConnected ? "Gemini Live" : "Simulator"}
            </span>
          </div>

          {/* Green AI Efficiency Badge */}
          <button
            onClick={onOpenGreenAI}
            type="button"
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 hover:scale-[1.03] active:scale-[0.97] transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            title="View Green AI Token Optimization & Micro-Index Metrics"
            aria-label="View Green AI Efficiency Metrics"
          >
            <Leaf className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">Green AI</span>
          </button>

          {/* Emergency SOS Button */}
          <button
            onClick={onTriggerSOS}
            type="button"
            className="flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 hover:scale-[1.03] active:scale-[0.97] transition-all duration-200 shadow-sm shadow-rose-600/30 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
            title="Trigger Instant Priority Emergency Helplines (112, 181, 1930, 1091)"
            aria-label="Emergency SOS Helplines"
          >
            <PhoneCall className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-bounce" />
            <span>SOS</span>
          </button>

          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === "en" ? "hi" : "en")}
            type="button"
            className="px-2 py-1 text-[11px] sm:text-xs font-semibold rounded-lg border border-border bg-card text-foreground hover:bg-accent hover:border-indigo-400/50 hover:scale-[1.03] active:scale-[0.97] transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            title={language === "en" ? "Switch to Hindi (हिंदी)" : "अंग्रेजी में बदलें (Switch to English)"}
            aria-label={`Switch language to ${language === "en" ? "Hindi" : "English"}`}
          >
            {language === "en" ? "हिं" : "EN"}
          </button>

          {/* Dark/Light mode toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            type="button"
            className="p-1.5 sm:p-2 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-accent hover:border-indigo-400/50 hover:scale-[1.03] active:scale-[0.97] transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
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
