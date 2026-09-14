"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  CheckCircle2,
  Calendar,
  Users,
  IndianRupee,
  Clock,
  Edit3,
  Check,
  X,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  FileSearch,
} from "lucide-react";
import { ExtractedDocumentFacts } from "@/lib/documentAnalyzer";

interface DocumentReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (facts: ExtractedDocumentFacts) => void;
  facts: ExtractedDocumentFacts | null;
  fileName?: string;
  language?: "en" | "hi";
}

export const DocumentReviewModal: React.FC<DocumentReviewModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  facts,
  fileName,
  language = "en",
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedFacts, setEditedFacts] = useState<ExtractedDocumentFacts | null>(null);

  // Sync edited facts when incoming facts change
  React.useEffect(() => {
    if (facts) {
      setEditedFacts(JSON.parse(JSON.stringify(facts)));
      setIsEditing(false);
    }
  }, [facts]);

  if (!isOpen || !editedFacts) return null;

  const currentFacts = editedFacts;

  const handleFieldChange = (section: keyof ExtractedDocumentFacts, field: string, value: string) => {
    setEditedFacts((prev) => {
      if (!prev) return prev;
      if (section === "parties" || section === "dates" || section === "amounts") {
        return {
          ...prev,
          [section]: {
            ...(prev[section] as any),
            [field]: value,
          },
        };
      }
      return {
        ...prev,
        [section]: value,
      };
    });
  };

  const autoFilledCount = Object.keys(currentFacts.suggestedClarifications || {}).length;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-border bg-muted/40 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <FileSearch className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 id="modal-title" className="font-bold text-sm sm:text-base text-foreground">
                    {language === "hi"
                      ? "दस्तावेज़ विश्लेषण परिणाम"
                      : "Document Facts Extracted by Gemini AI"}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    Verified
                  </span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {fileName || "Legal document"} • {currentFacts.documentType}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className={`p-1.5 sm:px-2.5 sm:py-1 rounded-lg text-xs font-medium border transition-all duration-150 flex items-center gap-1 cursor-pointer ${
                  isEditing
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                    : "border-border bg-background hover:bg-muted text-foreground"
                }`}
                title="Edit extracted facts if anything was read incorrectly"
              >
                {isEditing ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Done Editing</span>
                  </>
                ) : (
                  <>
                    <Edit3 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Edit if wrong</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Scrollable Content Body */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
            {/* Summary Banner */}
            <div className="p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-800/50 text-indigo-950 dark:text-indigo-200">
              <div className="font-semibold text-xs text-indigo-700 dark:text-indigo-400 mb-1 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                <span>Core Document Summary</span>
              </div>
              {isEditing ? (
                <textarea
                  rows={2}
                  value={currentFacts.summary}
                  onChange={(e) => handleFieldChange("summary", "", e.target.value)}
                  className="w-full p-2 text-xs rounded-lg border border-indigo-300 dark:border-indigo-700 bg-background text-foreground"
                />
              ) : (
                <p className="leading-relaxed text-xs sm:text-sm">{currentFacts.summary}</p>
              )}
            </div>

            {/* Grid of Key Facts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Document Type & Domain */}
              <div className="p-3 rounded-xl border border-border bg-card">
                <div className="text-[11px] font-medium text-muted-foreground mb-1 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>Document Classification</span>
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    value={currentFacts.documentType}
                    onChange={(e) => handleFieldChange("documentType", "", e.target.value)}
                    className="w-full p-1.5 text-xs rounded border border-border bg-background text-foreground"
                  />
                ) : (
                  <div className="font-semibold text-foreground break-words">
                    {currentFacts.documentType}
                  </div>
                )}
                <div className="mt-1">
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-500/10 text-indigo-600 dark:text-indigo-300">
                    Domain: {currentFacts.suggestedDomain}
                  </span>
                </div>
              </div>

              {/* Notice Period & Timeline */}
              <div className="p-3 rounded-xl border border-border bg-card">
                <div className="text-[11px] font-medium text-muted-foreground mb-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  <span>Notice Period / Statutory Window</span>
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    value={currentFacts.noticePeriodDays || ""}
                    onChange={(e) => handleFieldChange("noticePeriodDays", "", e.target.value)}
                    placeholder="e.g. 15 days, 30 days"
                    className="w-full p-1.5 text-xs rounded border border-border bg-background text-foreground"
                  />
                ) : (
                  <div className="font-semibold text-foreground">
                    {currentFacts.noticePeriodDays || "Not specified in document"}
                  </div>
                )}
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  Deadline: {currentFacts.dates.deadlineOrEvictionDate || "Standard statutory"}
                </div>
              </div>

              {/* Parties Involved */}
              <div className="p-3 rounded-xl border border-border bg-card">
                <div className="text-[11px] font-medium text-muted-foreground mb-1 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-blue-500" />
                  <span>Parties Identified</span>
                </div>
                <div className="space-y-1">
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase">Issuer / Sender: </span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={currentFacts.parties.issuerOrSender || ""}
                        onChange={(e) => handleFieldChange("parties", "issuerOrSender", e.target.value)}
                        className="w-full p-1 text-xs rounded border border-border bg-background text-foreground mt-0.5"
                      />
                    ) : (
                      <span className="font-medium text-foreground">
                        {currentFacts.parties.issuerOrSender || "Unspecified"}
                      </span>
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase">Recipient: </span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={currentFacts.parties.recipientOrSubject || ""}
                        onChange={(e) => handleFieldChange("parties", "recipientOrSubject", e.target.value)}
                        className="w-full p-1 text-xs rounded border border-border bg-background text-foreground mt-0.5"
                      />
                    ) : (
                      <span className="font-medium text-foreground">
                        {currentFacts.parties.recipientOrSubject || "Client / You"}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Amounts & Financial Terms */}
              <div className="p-3 rounded-xl border border-border bg-card">
                <div className="text-[11px] font-medium text-muted-foreground mb-1 flex items-center gap-1.5">
                  <IndianRupee className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Financial Values & Claims</span>
                </div>
                <div className="space-y-1">
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase">Deposit / Disputed Amount: </span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={currentFacts.amounts.depositOrClaimAmount || ""}
                        onChange={(e) => handleFieldChange("amounts", "depositOrClaimAmount", e.target.value)}
                        className="w-full p-1 text-xs rounded border border-border bg-background text-foreground mt-0.5"
                      />
                    ) : (
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {currentFacts.amounts.depositOrClaimAmount || "None mentioned"}
                      </span>
                    )}
                  </div>
                  {currentFacts.amounts.rentOrArrears && (
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase">Rent / Arrears: </span>
                      {isEditing ? (
                        <input
                          type="text"
                          value={currentFacts.amounts.rentOrArrears || ""}
                          onChange={(e) => handleFieldChange("amounts", "rentOrArrears", e.target.value)}
                          className="w-full p-1 text-xs rounded border border-border bg-background text-foreground mt-0.5"
                        />
                      ) : (
                        <span className="font-medium text-foreground">
                          {currentFacts.amounts.rentOrArrears}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Key Clauses Extracted */}
            {currentFacts.keyClausesOrAllegations && currentFacts.keyClausesOrAllegations.length > 0 && (
              <div className="p-3 rounded-xl border border-border bg-muted/20">
                <div className="font-semibold text-xs text-foreground mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Key Clauses & Demands Found</span>
                </div>
                <ul className="space-y-1.5">
                  {currentFacts.keyClausesOrAllegations.map((clause, idx) => (
                    <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
                      <span className="leading-relaxed">{clause}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Auto-filled clarifying questions banner */}
            <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-xs text-emerald-800 dark:text-emerald-300">
                  {autoFilledCount > 0
                    ? `Auto-resolved ${autoFilledCount} clarifying question${autoFilledCount > 1 ? "s" : ""} automatically!`
                    : "Facts ready for legal advisory"}
                </p>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5">
                  Nyaya Sahayak will bypass questions already answered in this document and immediately focus on specific statutory remedies.
                </p>
                {autoFilledCount > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {Object.entries(currentFacts.suggestedClarifications).map(([k, v]) => (
                      <span
                        key={k}
                        className="px-2 py-0.5 rounded-md bg-white/70 dark:bg-emerald-950/60 border border-emerald-500/20 text-[10px] font-mono text-emerald-800 dark:text-emerald-300"
                      >
                        {k.replace(/_/g, " ")}: {v}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer Action Buttons */}
          <div className="px-4 sm:px-6 py-3 border-t border-border bg-muted/30 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer text-center"
            >
              Cancel / Discard
            </button>

            <button
              type="button"
              onClick={() => onConfirm(currentFacts)}
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 shadow-sm shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              <span>{language === "hi" ? "कानूनी सलाह शुरू करें" : "Proceed to Legal Advice"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
