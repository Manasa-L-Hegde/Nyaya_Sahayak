"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { HelpCircle, ArrowRight, CheckCircle2 } from "lucide-react";
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

  const answeredCount = Object.keys(answers).length;
  const progressPercent = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="my-3 sm:my-4 rounded-xl border border-indigo-500/30 bg-card p-3.5 sm:p-5 shadow-sm hover:shadow-md transition-all duration-200 text-card-foreground max-w-full overflow-hidden"
    >
      <div className="flex items-start justify-between gap-2.5 mb-3">
        <div className="flex items-start gap-2.5">
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

        {/* Stepper badge indicator */}
        <div className="hidden sm:flex items-center gap-1.5 shrink-0 bg-muted/60 px-2.5 py-1 rounded-full text-xs font-semibold text-indigo-600 dark:text-indigo-400 border border-border">
          <span>{answeredCount}</span>
          <span>/</span>
          <span>{questions.length} Answered</span>
        </div>
      </div>

      {/* Animated Framer Motion Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-[11px] font-medium text-muted-foreground mb-1.5">
          <span className="flex items-center gap-1">
            <span>Jurisdiction & Statutory Alignment</span>
            {answeredCount === questions.length && (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 inline ml-1" />
            )}
          </span>
          <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">
            {Math.round(progressPercent)}%
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 via-primary to-indigo-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          />
        </div>

        {/* Question Step Pills */}
        <div className="flex items-center gap-2 mt-2">
          {questions.map((q, idx) => {
            const isDone = Boolean(answers[q.id]);
            return (
              <div
                key={q.id}
                className={`flex-1 flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-semibold border transition-all duration-200 ${
                  isDone
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300"
                    : idx === answeredCount
                    ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-600 dark:text-indigo-300 ring-1 ring-indigo-500/30"
                    : "bg-muted/30 border-border text-muted-foreground"
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] shrink-0 ${
                    isDone
                      ? "bg-emerald-600 text-white"
                      : idx === answeredCount
                      ? "bg-indigo-600 text-white"
                      : "bg-muted-foreground/30 text-foreground"
                  }`}
                >
                  {isDone ? "✓" : idx + 1}
                </span>
                <span className="truncate">Step {idx + 1}</span>
              </div>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {questions.map((q, idx) => {
          const selected = answers[q.id];
          const isDone = Boolean(selected);

          return (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`p-3 rounded-lg border transition-all duration-200 max-w-full overflow-hidden ${
                isDone
                  ? "border-emerald-500/30 bg-emerald-500/[0.02]"
                  : "border-border bg-muted/40 hover:bg-muted/60"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-1 mb-1.5">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-[11px] font-bold ${
                      isDone
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-indigo-600 dark:text-indigo-400"
                    }`}
                  >
                    Question {idx + 1} of {questions.length}
                  </span>
                  {isDone && (
                    <span className="text-[10px] font-medium text-emerald-600 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                      Answered
                    </span>
                  )}
                </div>
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
                      className={`text-xs px-2.5 py-1.5 rounded-lg font-medium border transition-all duration-150 text-left break-words max-w-full cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${
                        isSelected
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-600/20 ring-2 ring-indigo-500/30"
                          : "bg-background text-foreground border-border hover:border-indigo-400/60 hover:bg-accent"
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
                  className="w-full text-xs px-3 py-1.5 rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-150"
                />
              </div>
            </motion.div>
          );
        })}

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-2">
          <span className="text-[11px] text-muted-foreground text-center sm:text-left font-medium">
            {answeredCount} of {questions.length} answered
          </span>

          <button
            type="submit"
            disabled={disabled || answeredCount === 0}
            className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-150 shadow-sm shadow-indigo-600/20 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <span>{language === "hi" ? "कानूनी सलाह प्राप्त करें" : "Generate Legal Guidance"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </motion.div>
  );
};

