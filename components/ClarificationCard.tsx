"use client";

import React, { useState } from "react";
import { HelpCircle, ArrowRight } from "lucide-react";
import { ClarifyingQuestionItem } from "@/lib/clarificationEngine";

interface ClarificationCardProps {
  questions: ClarifyingQuestionItem[];
  onSubmit: (answers: Record<string, string>) => void;
  language: "en" | "hi";
  disabled?: boolean;
}

export const ClarificationCard: React.FC<ClarificationCardProps> = ({
  questions,
  onSubmit,
  language,
  disabled = false,
}) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [customInputs, setCustomInputs] = useState<Record<string, string>>({});

  const handleSelectOption = (questionId: string, option: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleCustomChange = (questionId: string, val: string) => {
    setCustomInputs((prev) => ({ ...prev, [questionId]: val }));
    setAnswers((prev) => ({ ...prev, [questionId]: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(answers).length > 0) {
      onSubmit(answers);
    }
  };

  return (
    <div className="my-3 sm:my-4 rounded-xl border border-indigo-500/30 bg-card p-3 sm:p-5 shadow-sm text-card-foreground max-w-full overflow-hidden">
      <div className="flex items-start gap-2.5 mb-3">
        <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5">
          <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
        </div>
        <div>
          <h3 className="font-bold text-xs sm:text-base text-foreground leading-snug">
            {language === "hi"
              ? "सटीक सलाह के लिए आवश्यक कानूनी विवरण"
              : "Key Context Needed for Accurate Legal Advisory"}
          </h3>
          <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">
            {language === "hi"
              ? "सटीक धाराएं और प्रक्रियाएं बताने के लिए कृपया 1–3 प्रश्नों का उत्तर दें:"
              : "Please answer these 1–3 questions to pinpoint the exact statutes and jurisdiction:"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 mt-3">
        {questions.map((q, idx) => {
          const selected = answers[q.id];
          return (
            <div
              key={q.id}
              className="p-3 rounded-lg border border-border bg-muted/40 transition-colors max-w-full overflow-hidden"
            >
              <div className="flex flex-wrap items-center justify-between gap-1 mb-1.5">
                <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                  Question {idx + 1} of {questions.length}
                </span>
                <span className="text-[10px] text-muted-foreground italic line-clamp-1">
                  {q.whyNeeded}
                </span>
              </div>

              <p className="text-xs sm:text-sm font-semibold text-foreground mb-2.5">
                {language === "hi" ? q.hindiQuestion : q.question}
              </p>

              {/* Interactive Pill Button Grid */}
              <div className="flex flex-wrap gap-1.5 mb-2">
                {q.options.map((opt) => {
                  const isSelected = selected === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      disabled={disabled}
                      onClick={() => handleSelectOption(q.id, opt)}
                      className={`text-xs px-2.5 py-1.5 rounded-lg font-medium border transition-all text-left break-words max-w-full ${
                        isSelected
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                          : "bg-background text-foreground border-border hover:border-indigo-400/50 hover:bg-accent"
                      } focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {/* Optional write-in answer */}
              <div className="mt-1.5">
                <input
                  type="text"
                  placeholder={language === "hi" ? "या अपना उत्तर यहाँ लिखें..." : "Or type specific detail here..."}
                  disabled={disabled}
                  value={customInputs[q.id] || ""}
                  onChange={(e) => handleCustomChange(q.id, e.target.value)}
                  className="w-full text-xs px-3 py-1.5 rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
          );
        })}

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-1">
          <span className="text-[11px] text-muted-foreground text-center sm:text-left">
            {Object.keys(answers).length} of {questions.length} answered
          </span>

          <button
            type="submit"
            disabled={disabled || Object.keys(answers).length === 0}
            className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm shadow-indigo-600/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <span>{language === "hi" ? "कानूनी सलाह प्राप्त करें" : "Generate Legal Guidance"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
};
