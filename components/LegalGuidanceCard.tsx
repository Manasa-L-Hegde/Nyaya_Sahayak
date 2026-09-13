"use client";

import React, { useState } from "react";
import { Copy, Check, Download, FileText, AlertCircle, ExternalLink } from "lucide-react";

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
}

export const LegalGuidanceCard: React.FC<LegalGuidanceCardProps> = ({
  domainName,
  sections = [],
  portals = [],
  draftTemplate,
  content,
  language,
  isStreaming = false,
}) => {
  const [activeTab, setActiveTab] = useState<"guidance" | "draft" | "portals">("guidance");
  const [copied, setCopied] = useState(false);
  const [draftCopied, setDraftCopied] = useState(false);

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

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-all duration-200 text-card-foreground overflow-hidden max-w-full">
      {/* Card Header & Tabs */}
      <div className="border-b border-border bg-muted/30 px-3 py-2.5 sm:px-6 sm:py-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 dark:bg-indigo-400 shrink-0 animate-pulse" />
          <span className="font-bold text-xs sm:text-sm text-foreground uppercase tracking-wide">
            {domainName}
          </span>
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
            <div className="flex justify-end mb-2">
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
