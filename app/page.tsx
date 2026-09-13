"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { ChatInterface } from "@/components/ChatInterface";
import { GreenAIMetricsModal } from "@/components/GreenAIMetricsModal";

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState<"en" | "hi">("en");
  const [isGreenAIOpen, setIsGreenAIOpen] = useState(false);
  const [sosTriggered, setSosTriggered] = useState(false);
  const [geminiConnected, setGeminiConnected] = useState(false);
  const [greenAIStats, setGreenAIStats] = useState({
    retrievalLatencyMs: 1.8,
    tokensSavedEstimate: 1850,
  });

  // Dark mode effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Check Gemini live status
  useEffect(() => {
    fetch("/api/status")
      .then((res) => res.json())
      .then((data) => {
        setGeminiConnected(data.geminiConfigured);
      })
      .catch(() => {
        setGeminiConnected(false);
      });
  }, []);

  return (
    <main className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-200">
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        language={language}
        setLanguage={setLanguage}
        onOpenGreenAI={() => setIsGreenAIOpen(true)}
        onTriggerSOS={() => setSosTriggered(true)}
        geminiConnected={geminiConnected}
      />

      <div className="flex-1 flex flex-col">
        <ChatInterface
          language={language}
          sosTriggered={sosTriggered}
          onDismissSOS={() => setSosTriggered(false)}
          onUpdateGreenAIStats={(stats) => setGreenAIStats(stats)}
          geminiConnected={geminiConnected}
        />
      </div>

      <GreenAIMetricsModal
        isOpen={isGreenAIOpen}
        onClose={() => setIsGreenAIOpen(false)}
        language={language}
        stats={greenAIStats}
      />
    </main>
  );
}
