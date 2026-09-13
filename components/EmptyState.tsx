"use client";

import React from "react";
import { Home, ShoppingBag, ShieldCheck, HeartHandshake, Briefcase, FileSearch, ShieldAlert } from "lucide-react";

interface EmptyStateProps {
  onSelectPrompt: (prompt: string) => void;
  language: "en" | "hi";
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onSelectPrompt, language }) => {
  const examplePrompts = [
    {
      domain: "Tenant Rights",
      hindiDomain: "किरायेदार अधिकार",
      icon: Home,
      promptEn: "My landlord cut off water and electricity and is threatening to throw my stuff out without notice. What can I do?",
      promptHi: "मेरे मकान मालिक ने बिना नोटिस पानी-बिजली काट दी है और सामान बाहर फेंकने की धमकी दे रहा है।",
      color: "border-blue-500/20 hover:border-blue-500/50 bg-blue-500/5",
    },
    {
      domain: "Cyber Fraud",
      hindiDomain: "साइबर धोखाधड़ी",
      icon: ShieldCheck,
      promptEn: "I lost ₹45,000 in a UPI fraud scam 1 hour ago. How do I recover my money during the Golden Hour?",
      promptHi: "1 घंटे पहले यूपीआई फ्रॉड में मेरे 45,000 रुपये कट गए। पैसे वापस पाने के लिए गोल्डन ऑवर में क्या करूँ?",
      color: "border-purple-500/20 hover:border-purple-500/50 bg-purple-500/5",
    },
    {
      domain: "Consumer Protection",
      hindiDomain: "उपभोक्ता अधिकार",
      icon: ShoppingBag,
      promptEn: "Received a broken laptop from an e-commerce platform and the seller is refusing to process my refund.",
      promptHi: "ऑनलाइन साइट से खराब लैपटॉप मिला और विक्रेता रिफंड देने से मना कर रहा है। e-Daakhil पर कैसे शिकायत करूँ?",
      color: "border-emerald-500/20 hover:border-emerald-500/50 bg-emerald-500/5",
    },
    {
      domain: "Domestic Safety",
      hindiDomain: "महिला सुरक्षा / PWDVA",
      icon: ShieldAlert,
      promptEn: "My husband is violent and threatening to lock me out of the house. How can I get a Protection Order?",
      promptHi: "पति हिंसा कर रहा है और घर से निकालने की धमकी दे रहा है। सुरक्षा आदेश (Section 18) कैसे मिलेगा?",
      color: "border-rose-500/20 hover:border-rose-500/50 bg-rose-500/5",
    },
    {
      domain: "Labour & Wages",
      hindiDomain: "वेतन व नौकरी",
      icon: Briefcase,
      promptEn: "My employer fired me without notice and has not released 2 months of salary and my experience letter.",
      promptHi: "कंपनी ने बिना नोटिस निकाल दिया और 2 महीने का बकाया वेतन व F&F नहीं दे रहे हैं।",
      color: "border-amber-500/20 hover:border-amber-500/50 bg-amber-500/5",
    },
    {
      domain: "RTI & Governance",
      hindiDomain: "सूचना का अधिकार",
      icon: FileSearch,
      promptEn: "I filed an RTI application 35 days ago but received no response from the PIO. How do I file a First Appeal?",
      promptHi: "35 दिन पहले आरटीआई लगाई थी पर कोई जवाब नहीं मिला। प्रथम अपील (First Appeal) कैसे दाखिल करूँ?",
      color: "border-indigo-500/20 hover:border-indigo-500/50 bg-indigo-500/5",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto my-auto py-8 text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 text-xs font-semibold mb-4 border border-indigo-500/20">
        <span>⚖️ Context-Aware Indian Legal Intelligence</span>
      </div>

      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-3">
        {language === "hi" ? "आपकी कानूनी समस्या क्या है?" : "How can Nyaya Sahayak assist you today?"}
      </h2>

      <p className="text-sm text-muted-foreground max-w-xl mx-auto mb-8">
        {language === "hi"
          ? "अपनी भाषा में कानूनी समस्या बताएं। सहायक स्थिति को समझकर 1-3 महत्वपूर्ण प्रश्न पूछेगा और सटीक धाराएं, सरकारी पोर्टल एवं नोटिस ड्राफ्ट तैयार करेगा।"
          : "Describe your dispute in plain words. The assistant triages safety, asks targeted clarifying questions based on context, and delivers structured guidance with cited statutes and draft notices."}
      </p>

      {/* Suggested Prompts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
        {examplePrompts.map((item, idx) => {
          const Icon = item.icon;
          const promptText = language === "hi" ? item.promptHi : item.promptEn;
          return (
            <button
              key={idx}
              onClick={() => onSelectPrompt(promptText)}
              className={`p-4 rounded-xl border transition-all text-left group hover:scale-[1.01] active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${item.color}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                <span className="text-xs font-bold text-foreground">
                  {language === "hi" ? item.hindiDomain : item.domain}
                </span>
              </div>
              <p className="text-xs text-muted-foreground group-hover:text-foreground/90 transition-colors line-clamp-2">
                "{promptText}"
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
