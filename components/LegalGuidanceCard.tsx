"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Copy,
  Check,
  Download,
  FileText,
  AlertCircle,
  ExternalLink,
  MapPin,
  Sparkles,
  PhoneCall,
  CheckCircle2,
  FileDown,
} from "lucide-react";
import jsPDF from "jspdf";

interface Portal {
  name: string;
  url: string;
  description: string;
}

interface DraftTemplate {
  title: string;
  templateText: string;
}

interface LegalGuidanceCardProps {
  domainName: string;
  sections?: string[];
  portals?: Portal[];
  draftTemplate?: DraftTemplate;
  content: string;
  language: "en" | "hi";
  isStreaming?: boolean;
  userQuery?: string;
  clarifications?: Record<string, string>;
  stateJurisdiction?: string;
}

export const LegalGuidanceCard: React.FC<LegalGuidanceCardProps> = ({
  domainName,
  sections = [],
  portals = [],
  draftTemplate,
  content,
  language,
  isStreaming = false,
  userQuery = "",
  clarifications = {},
  stateJurisdiction,
}) => {
  const [activeTab, setActiveTab] = useState<"guidance" | "draft" | "portals" | "legalaid">("guidance");
  const [copied, setCopied] = useState(false);
  const [draftCopied, setDraftCopied] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // Derive State from props or clarifications
  const resolvedState =
    stateJurisdiction ||
    clarifications["state_jurisdiction"] ||
    clarifications["jurisdiction"] ||
    "";

  // Clean state name for Google Maps search
  const stateSearchQuery = resolvedState
    ? `${resolvedState.replace(/NCR/i, "").trim()} State Legal Services Authority`
    : "District Legal Services Authority near me";

  const mapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    stateSearchQuery
  )}`;

  const handleCopyContent = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyDraft = () => {
    if (draftTemplate) {
      navigator.clipboard.writeText(draftTemplate.templateText);
      setDraftCopied(true);
      setTimeout(() => setDraftCopied(false), 2000);
    }
  };

  const handleDownloadDraft = () => {
    if (!draftTemplate) return;
    const element = document.createElement("a");
    const file = new Blob([draftTemplate.templateText], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${draftTemplate.title.replace(/\s+/g, "_")}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Generate clean, printable PDF Case Summary via jsPDF
  const handleDownloadPdf = () => {
    try {
      setIsGeneratingPdf(true);
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 15;
      const contentWidth = pageWidth - margin * 2;
      let y = 18;

      // 1. Header Banner
      doc.setFillColor(30, 58, 138); // Dark Navy Blue
      doc.rect(margin, y, contentWidth, 18, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("NYAYA SAHAYAK - LEGAL CASE SUMMARY", margin + 4, y + 8);

      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text(
        `Generated on: ${new Date().toLocaleString("en-IN")} | Domain: ${domainName.toUpperCase()}`,
        margin + 4,
        y + 14
      );

      y += 24;

      // 2. Case Overview Box
      doc.setFillColor(243, 244, 246);
      doc.rect(margin, y, contentWidth, 22, "F");
      doc.setDrawColor(209, 213, 219);
      doc.rect(margin, y, contentWidth, 22, "S");

      doc.setTextColor(17, 24, 39);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text("CASE METADATA & JURISDICTION:", margin + 3, y + 5);

      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      const jurisdictionText = resolvedState || "All-India / Relevant State Jurisdiction";
      doc.text(`Identified Domain: ${domainName}`, margin + 3, y + 10);
      doc.text(`Jurisdiction: ${jurisdictionText}`, margin + 3, y + 14);
      doc.text(`Free Legal Aid Helpline: NALSA Toll-Free 15100 | National Emergency: 112`, margin + 3, y + 18);

      y += 28;

      // 3. User Issue & Clarifications
      if (userQuery || Object.keys(clarifications).length > 0) {
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(30, 58, 138);
        doc.text("1. USER GRIEVANCE & FACTUAL CONTEXT", margin, y);
        y += 5;

        if (userQuery) {
          doc.setFontSize(8);
          doc.setFont("helvetica", "italic");
          doc.setTextColor(55, 65, 81);
          const issueLines = doc.splitTextToSize(`Reported Issue: "${userQuery}"`, contentWidth);
          doc.text(issueLines, margin, y);
          y += issueLines.length * 4 + 2;
        }

        if (Object.keys(clarifications).length > 0) {
          doc.setFont("helvetica", "normal");
          doc.setFontSize(8);
          doc.setTextColor(55, 65, 81);
          doc.text("Clarifications Provided:", margin, y);
          y += 4;
          for (const [key, val] of Object.entries(clarifications)) {
            const cleanKey = key.replace(/_/g, " ");
            doc.text(`• ${cleanKey}: ${val}`, margin + 3, y);
            y += 4;
          }
          y += 2;
        }
      }

      // 4. Statutes Cited
      if (sections.length > 0) {
        if (y > 250) {
          doc.addPage();
          y = 18;
        }
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(30, 58, 138);
        doc.text("2. APPLICABLE STATUTES & LEGAL PROVISIONS", margin, y);
        y += 5;

        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(17, 24, 39);
        const secText = sections.join(" | ");
        const secLines = doc.splitTextToSize(secText, contentWidth);
        doc.text(secLines, margin, y);
        y += secLines.length * 4 + 4;
      }

      // 5. Guidance Content
      if (y > 250) {
        doc.addPage();
        y = 18;
      }
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(30, 58, 138);
      doc.text("3. STATUTORY ADVISORY & PROCEDURAL ROADMAP", margin, y);
      y += 6;

      // Strip markdown hashes and bold markers for clean PDF printing
      const cleanContent = content
        .replace(/^###?\s+/gm, "")
        .replace(/\*\*/g, "")
        .replace(/`([^`]+)`/g, "$1");

      const paragraphs = cleanContent.split("\n\n");

      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(31, 41, 55);

      for (const para of paragraphs) {
        const trimmed = para.trim();
        if (!trimmed) continue;

        const lines = doc.splitTextToSize(trimmed, contentWidth);
        if (y + lines.length * 4 > 275) {
          doc.addPage();
          y = 18;
        }
        doc.text(lines, margin, y);
        y += lines.length * 4 + 3;
      }

      // 6. Mandatory Disclaimer at end
      if (y > 260) {
        doc.addPage();
        y = 18;
      }
      y += 4;
      doc.setDrawColor(209, 213, 219);
      doc.line(margin, y, margin + contentWidth, y);
      y += 5;

      doc.setFontSize(7);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(107, 114, 128);
      const disclaimer =
        "Statutory Disclaimer: This case brief is prepared for informational and educational purposes under Indian law by Nyaya Sahayak. It does not replace formal legal counsel. For court filings or representation, please consult a licensed advocate or contact the National Legal Services Authority (NALSA) toll-free at 15100.";
      const disLines = doc.splitTextToSize(disclaimer, contentWidth);
      doc.text(disLines, margin, y);

      const fileName = `Nyaya_Sahayak_Summary_${domainName.replace(/\s+/g, "_")}_${Date.now()}.pdf`;
      doc.save(fileName);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const isCompleted = !isStreaming && content.length > 50;

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-all duration-200 text-card-foreground overflow-hidden max-w-full">
      {/* Celebratory Success Animation Banner when completed */}
      <AnimatePresence>
        {isCompleted && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-indigo-500/10 border-b border-emerald-500/20 px-3.5 sm:px-6 py-2 flex items-center justify-between gap-2"
          >
            <div className="flex items-center gap-2">
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-sm"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
              </motion.div>
              <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                {language === "hi"
                  ? "विधिक मार्गदर्शन तैयार है • नीचे दिए गए चरणों का पालन करें"
                  : "Guidance Complete • Actionable Procedural Steps Ready"}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 cursor-pointer shadow-sm shadow-indigo-600/20"
                title="Download printable case summary PDF"
              >
                <FileDown className="w-3 h-3" />
                <span>{isGeneratingPdf ? "Creating PDF..." : "Download Summary (PDF)"}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card Header & Tabs */}
      <div className="border-b border-border bg-muted/30 px-3 py-2.5 sm:px-6 sm:py-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div
            className={`w-2.5 h-2.5 rounded-full shrink-0 ${
              isStreaming ? "bg-indigo-600 animate-pulse" : "bg-emerald-500"
            }`}
          />
          <span className="font-bold text-xs sm:text-sm text-foreground uppercase tracking-wide">
            {domainName}
          </span>
          {resolvedState && (
            <span className="hidden sm:inline px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border border-indigo-500/20">
              {resolvedState}
            </span>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center gap-1 bg-background p-1 rounded-lg border border-border text-xs">
          <button
            onClick={() => setActiveTab("guidance")}
            className={`px-2.5 py-1 rounded-md font-medium transition-all duration-150 cursor-pointer hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
              activeTab === "guidance"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            {language === "hi" ? "मार्गदर्शन" : "Guidance"}
          </button>

          {draftTemplate && (
            <button
              onClick={() => setActiveTab("draft")}
              className={`px-2.5 py-1 rounded-md font-medium transition-all duration-150 cursor-pointer hover:scale-[1.02] active:scale-[0.98] flex items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                activeTab === "draft"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <FileText className="w-3 h-3" />
              <span>{language === "hi" ? "ड्राफ्ट नोटिस" : "Draft Notice"}</span>
            </button>
          )}

          {portals.length > 0 && (
            <button
              onClick={() => setActiveTab("portals")}
              className={`px-2.5 py-1 rounded-md font-medium transition-all duration-150 cursor-pointer hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                activeTab === "portals"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {language === "hi" ? "पोर्टल" : "Portals"}
            </button>
          )}

          {/* Legal Aid Locator Tab */}
          <button
            onClick={() => setActiveTab("legalaid")}
            className={`px-2.5 py-1 rounded-md font-medium transition-all duration-150 cursor-pointer hover:scale-[1.02] active:scale-[0.98] flex items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
              activeTab === "legalaid"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <MapPin className="w-3 h-3" />
            <span>{language === "hi" ? "विधिक सहायता" : "Legal Aid Near You"}</span>
          </button>
        </div>
      </div>

      {/* Relevant Statutes Bar */}
      {sections.length > 0 && (
        <div className="bg-indigo-50/50 dark:bg-indigo-950/20 px-3 sm:px-6 py-2 border-b border-indigo-100 dark:border-indigo-950/40 flex flex-wrap items-center gap-1.5 text-xs">
          <span className="font-semibold text-indigo-700 dark:text-indigo-300">
            {language === "hi" ? "संबंधित धाराएं:" : "Statutes Cited:"}
          </span>
          {sections.map((sec, i) => (
            <span
              key={i}
              className="px-2 py-0.5 rounded-md bg-white dark:bg-card border border-indigo-200 dark:border-indigo-800 text-indigo-800 dark:text-indigo-300 font-mono text-[11px] break-words hover:border-indigo-400 transition-colors cursor-default"
            >
              {sec}
            </span>
          ))}
        </div>
      )}

      {/* Main Tab Content */}
      <div className="p-3.5 sm:p-6">
        {activeTab === "guidance" && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs text-muted-foreground">
                {isStreaming ? (
                  <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-medium">
                    <Sparkles className="w-3 h-3 animate-spin" />
                    Synthesizing statutory guidance...
                  </span>
                ) : (
                  <span>Verified Indian Legal Framework</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadPdf}
                  disabled={isGeneratingPdf}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-all duration-150 p-1.5 rounded-lg hover:bg-muted cursor-pointer hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  title="Download Summary as PDF"
                >
                  <FileDown className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="font-medium hidden sm:inline">Download PDF</span>
                </button>

                <button
                  onClick={handleCopyContent}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-all duration-150 p-1.5 rounded-lg hover:bg-muted cursor-pointer hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  aria-label="Copy guidance to clipboard"
                  title="Copy full legal guidance to clipboard"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span className="font-medium">{copied ? "Copied" : "Copy"}</span>
                </button>
              </div>
            </div>

            <div
              className={`prose prose-sm dark:prose-invert max-w-none text-foreground whitespace-pre-wrap leading-relaxed text-xs sm:text-sm ${
                isStreaming ? "streaming-cursor" : ""
              }`}
            >
              {content}
            </div>
          </div>
        )}

        {activeTab === "draft" && draftTemplate && (
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border/50">
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-foreground">{draftTemplate.title}</h4>
                <p className="text-[11px] text-muted-foreground">
                  {language === "hi"
                    ? "इस नोटिस प्रारूप में अपने विवरण भरें और पंजीकृत डाक या ईमेल द्वारा भेजें।"
                    : "Fill in the bracketed placeholders [ ] with your specific details before serving."}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleCopyDraft}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-medium hover:bg-accent hover:scale-[1.03] active:scale-[0.97] transition-all duration-150 cursor-pointer shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  title="Copy notice draft template"
                >
                  {draftCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{draftCopied ? "Copied" : "Copy Template"}</span>
                </button>
                <button
                  onClick={handleDownloadDraft}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 hover:scale-[1.03] active:scale-[0.97] transition-all duration-150 cursor-pointer shadow-sm shadow-indigo-600/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  title="Download notice as plain text (.txt)"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .txt</span>
                </button>
              </div>
            </div>

            <pre className="p-3.5 sm:p-4 rounded-lg bg-muted/60 border border-border text-[11px] sm:text-xs font-mono whitespace-pre-wrap break-words max-w-full overflow-x-auto text-foreground leading-relaxed select-all">
              {draftTemplate.templateText}
            </pre>
          </div>
        )}

        {activeTab === "portals" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            {portals.map((portal, idx) => (
              <a
                key={idx}
                href={portal.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-3 sm:p-4 rounded-lg border border-border bg-muted/20 hover:border-indigo-500/50 hover:bg-muted/50 hover:-translate-y-0.5 hover:shadow-sm transition-all duration-200 block cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <div className="flex items-center justify-between mb-1">
                  <h5 className="font-semibold text-xs sm:text-sm text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {portal.name}
                  </h5>
                  <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                </div>
                <p className="text-[11px] sm:text-xs text-muted-foreground">{portal.description}</p>
                <span className="inline-block mt-2 font-mono text-[10px] sm:text-[11px] text-indigo-600 dark:text-indigo-400 break-all">
                  {portal.url.replace(/^https?:\/\//, "")}
                </span>
              </a>
            ))}
          </div>
        )}

        {/* Nearby Legal Aid Locator Content */}
        {activeTab === "legalaid" && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-indigo-500/30 bg-indigo-50/50 dark:bg-indigo-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-indigo-900 dark:text-indigo-200">
                  <MapPin className="w-4 h-4 text-indigo-600" />
                  <span>
                    {resolvedState
                      ? `${resolvedState} Legal Aid & Services Authority`
                      : "Locate Legal Services Authority Near You"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Under the Legal Services Authorities Act 1987, citizens with annual income below statutory caps, women, children, and custody victims are entitled to 100% free legal counsel.
                </p>
              </div>

              <a
                href={mapsSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 shrink-0 shadow-sm shadow-indigo-600/20 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <span>Find on Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl border border-border bg-card">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-semibold text-xs text-foreground">NALSA National Legal Aid</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600">
                    Toll-Free 24x7
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground mb-3">
                  National Legal Services Authority coordinates with all State (SLSA) and District (DLSA) authorities.
                </p>
                <div className="flex items-center gap-2">
                  <a
                    href="tel:15100"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors"
                  >
                    <PhoneCall className="w-3 h-3" />
                    <span>Call 15100</span>
                  </a>
                  <a
                    href="https://nalsa.gov.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    title="Visit official NALSA website"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-border bg-card">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-semibold text-xs text-foreground">District Legal Services Authority</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-600">
                    Court-Annexed
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground mb-3">
                  Located physically inside every District Court Complex across India for free advocate assignment.
                </p>
                <a
                  href={mapsSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 text-xs font-semibold hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors"
                >
                  <MapPin className="w-3 h-3" />
                  <span>Open Maps for {resolvedState || "Nearby DLSA"}</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mandatory Statutory Disclaimer Banner */}
      <div className="bg-muted/40 border-t border-border px-3.5 sm:px-6 py-2.5 text-[11px] sm:text-xs text-muted-foreground flex items-start gap-2">
        <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-foreground">Informational Advisory Disclaimer:</span>{" "}
          {language === "hi"
            ? "यह सहायता केवल सूचनात्मक उद्देश्यों के लिए भारतीय विधि के अनुसार प्रदान की गई है तथा यह किसी लाइसेंस प्राप्त अधिवक्ता की विधिक सलाह का स्थान नहीं लेती। निशुल्क विधिक सहायता के लिए NALSA (15100) पर संपर्क करें।"
            : "This guidance is generated for educational and informational purposes under Indian law and does not establish an attorney-client relationship. If your dispute requires court representation, please consult a licensed advocate or contact NALSA toll-free at 15100."}
        </div>
      </div>
    </div>
  );
};
