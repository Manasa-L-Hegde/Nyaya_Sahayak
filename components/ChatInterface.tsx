"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Send,
  AlertCircle,
  RotateCcw,
  Scale,
  Loader2,
  RefreshCw,
  Info,
  Paperclip,
  FileText,
  Sparkles,
} from "lucide-react";
import { EmergencyBanner } from "./EmergencyBanner";
import { ClarificationCard } from "./ClarificationCard";
import { LegalGuidanceCard } from "./LegalGuidanceCard";
import { EmptyState } from "./EmptyState";
import { DocumentReviewModal } from "./DocumentReviewModal";
import { EmergencyHelpline } from "@/data/legalKnowledge";
import { ClarifyingQuestionItem } from "@/lib/clarificationEngine";
import { ExtractedDocumentFacts } from "@/lib/documentAnalyzer";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  domain?: string;
  domainName?: string;
  isStreaming?: boolean;
  type?: "guidance" | "clarification" | "emergency" | "out_of_scope" | "security_blocked" | "error";
  clarificationQuestions?: ClarifyingQuestionItem[];
  safetyHelplines?: EmergencyHelpline[];
  prioritySafetyMessage?: string;
  relevantSections?: string[];
  portals?: { name: string; url: string; description: string }[];
  draftTemplate?: { title: string; templateText: string };
  greenAIMetrics?: any;
  lastUserQuery?: string;
  userQueryForGuidance?: string;
  clarificationsForGuidance?: Record<string, string>;
  stateJurisdiction?: string;
  isFileUpload?: boolean;
  fileName?: string;
}

interface ChatInterfaceProps {
  language: "en" | "hi";
  sosTriggered: boolean;
  onDismissSOS: () => void;
  onUpdateGreenAIStats: (stats: { retrievalLatencyMs: number; tokensSavedEstimate: number }) => void;
  geminiConnected?: boolean;
  onLiveConnectionConfirmed?: (live: boolean) => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  language,
  sosTriggered,
  onDismissSOS,
  onUpdateGreenAIStats,
  geminiConnected = false,
  onLiveConnectionConfirmed,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeDomain, setActiveDomain] = useState<string | undefined>(undefined);
  const [clarificationAnswers, setClarificationAnswers] = useState<Record<string, string>>({});
  const [screenReaderAnnouncement, setScreenReaderAnnouncement] = useState("");

  // Document upload states
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);
  const [extractedFacts, setExtractedFacts] = useState<ExtractedDocumentFacts | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, isUploadingDoc]);

  // Handle Document Upload & Multimodal Analysis
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input so user can re-upload if desired
    e.target.value = "";

    setUploadedFileName(file.name);
    setIsUploadingDoc(true);
    setScreenReaderAnnouncement("Analyzing legal document with Gemini Multimodal AI...");

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result as string;

        try {
          const res = await fetch("/api/analyze-document", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              base64Data,
              mimeType: file.type,
              fileName: file.name,
              language,
            }),
          });

          if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.message || "Failed to analyze uploaded document.");
          }

          const { data } = await res.json();
          setExtractedFacts(data);
          setIsReviewModalOpen(true);
          setScreenReaderAnnouncement("Document facts extracted. Opening review modal.");
        } catch (err: any) {
          const errorMsg: ChatMessage = {
            id: "err-upload-" + Date.now(),
            role: "assistant",
            content: `Document analysis failed: ${err.message || "Please check file format and try again."}`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            type: "error",
          };
          setMessages((prev) => [...prev, errorMsg]);
        } finally {
          setIsUploadingDoc(false);
        }
      };

      reader.onerror = () => {
        setIsUploadingDoc(false);
        alert("Failed to read file.");
      };

      reader.readAsDataURL(file);
    } catch (err) {
      setIsUploadingDoc(false);
    }
  };

  // When user confirms facts in DocumentReviewModal
  const handleConfirmExtractedFacts = (facts: ExtractedDocumentFacts) => {
    setIsReviewModalOpen(false);

    // Merge auto-extracted clarifications
    const mergedAnswers = {
      ...clarificationAnswers,
      ...facts.suggestedClarifications,
    };
    setClarificationAnswers(mergedAnswers);

    if (facts.suggestedDomain && facts.suggestedDomain !== "OUT_OF_SCOPE") {
      setActiveDomain(facts.suggestedDomain);
    }

    const timeString = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userDocSummaryMsg: ChatMessage = {
      id: "usr-doc-" + Date.now(),
      role: "user",
      content: `Uploaded Document: ${facts.documentType}\n• Summary: ${facts.summary}\n• Parties: ${facts.parties.issuerOrSender || "Issuer"} ➔ ${facts.parties.recipientOrSubject || "Client"}\n• Timeline: ${facts.noticePeriodDays || "Statutory notice window"}`,
      timestamp: timeString,
      isFileUpload: true,
      fileName: uploadedFileName,
    };

    setMessages((prev) => [...prev, userDocSummaryMsg]);

    // Send query with pre-filled context
    const query = `Based on my uploaded ${facts.documentType}: "${facts.summary}". Please advise on my rights, legal steps, and remedies under Indian law.`;
    handleSendMessage(query, mergedAnswers, facts.suggestedDomain);
  };

  const handleSendMessage = async (
    textToSend?: string,
    answersToPass?: Record<string, string>,
    domainToPass?: string
  ) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMessageId = "msg-" + Date.now();
    const timeString = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    // If sending standard user query (not via clarification submit or doc confirm)
    if (!answersToPass) {
      const userMsg: ChatMessage = {
        id: userMessageId,
        role: "user",
        content: query,
        timestamp: timeString,
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
    }

    setIsLoading(true);
    const initialAnnouncement =
      language === "hi"
        ? "न्याय सहायक उत्तर तैयार कर रहा है..."
        : "Nyaya Sahayak is analyzing your legal query...";
    setScreenReaderAnnouncement(initialAnnouncement);

    const currentClarifications = answersToPass || clarificationAnswers;
    const currentDomain = domainToPass || activeDomain;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          domain: currentDomain,
          clarifications: currentClarifications,
          isClarificationAnswer: Boolean(answersToPass),
          language,
        }),
      });

      if (!response.ok) {
        let errText = "Failed to fetch response";
        try {
          const errorData = await response.json();
          errText = errorData.message || errText;
        } catch (_) {}
        throw new Error(errText);
      }

      const contentType = response.headers.get("content-type") || "";

      // Handle non-streaming JSON (clarifications, security blocked, out-of-scope)
      if (contentType.includes("application/json")) {
        const json = await response.json();

        if (json.type === "SECURITY_BLOCKED") {
          const blockMsg: ChatMessage = {
            id: "resp-" + Date.now(),
            role: "assistant",
            content: json.message,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            type: "security_blocked",
          };
          setMessages((prev) => [...prev, blockMsg]);
          setScreenReaderAnnouncement(json.message);
        } else if (json.type === "OUT_OF_SCOPE") {
          const outMsg: ChatMessage = {
            id: "resp-" + Date.now(),
            role: "assistant",
            content: json.message,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            type: "out_of_scope",
          };
          setMessages((prev) => [...prev, outMsg]);
          setScreenReaderAnnouncement(json.message);
        } else if (json.type === "CLARIFICATION_REQUIRED") {
          setActiveDomain(json.domain);
          const clarMsg: ChatMessage = {
            id: "resp-" + Date.now(),
            role: "assistant",
            content: json.message,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            type: "clarification",
            clarificationQuestions: json.questions,
            safetyHelplines: json.safety?.isEmergency ? json.safety.surfacedHelplines : undefined,
            prioritySafetyMessage: json.safety?.priorityMessage,
          };
          setMessages((prev) => [...prev, clarMsg]);
          setScreenReaderAnnouncement("Clarification questions received. Please answer the options.");
        }
        setIsLoading(false);
        return;
      }

      // Handle Streaming SSE for final guidance
      const reader = response.body?.getReader();
      if (!reader) throw new Error("Streaming connection was interrupted.");

      const decoder = new TextDecoder();
      const assistantMsgId = "resp-" + Date.now();

      const initialAssistantMsg: ChatMessage = {
        id: assistantMsgId,
        role: "assistant",
        content: "",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        type: "guidance",
        isStreaming: true,
        userQueryForGuidance: query,
        clarificationsForGuidance: currentClarifications,
        stateJurisdiction: currentClarifications["state_jurisdiction"],
      };

      setMessages((prev) => [...prev, initialAssistantMsg]);

      let accumulatedContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const textChunk = decoder.decode(value, { stream: true });
        const lines = textChunk.split("\n\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const dataStr = line.replace("data: ", "").trim();
            if (!dataStr) continue;

            try {
              const parsed = JSON.parse(dataStr);

              if (parsed.type === "METADATA") {
                if (parsed.geminiLive && onLiveConnectionConfirmed) {
                  onLiveConnectionConfirmed(true);
                }
                if (parsed.greenAIMetrics) {
                  onUpdateGreenAIStats({
                    retrievalLatencyMs: parsed.greenAIMetrics.retrievalLatencyMs,
                    tokensSavedEstimate: parsed.greenAIMetrics.tokensSavedEstimate,
                  });
                }
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMsgId
                      ? {
                          ...msg,
                          domain: parsed.domain,
                          domainName: parsed.domainName,
                          safetyHelplines: parsed.safety?.isEmergency
                            ? parsed.safety.surfacedHelplines
                            : undefined,
                          prioritySafetyMessage: parsed.safety?.priorityMessage,
                          relevantSections: parsed.relevantSections,
                          portals: parsed.portals,
                          draftTemplate: parsed.draftTemplate,
                          greenAIMetrics: parsed.greenAIMetrics,
                        }
                      : msg
                  )
                );
              } else if (parsed.type === "TOKEN") {
                accumulatedContent += parsed.token;
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMsgId
                      ? { ...msg, content: accumulatedContent }
                      : msg
                  )
                );
              } else if (parsed.type === "DONE") {
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMsgId
                      ? { ...msg, isStreaming: false }
                      : msg
                  )
                );
                setScreenReaderAnnouncement("Legal guidance response successfully loaded.");
              } else if (parsed.type === "ERROR") {
                accumulatedContent += `\n\n*Notice: ${parsed.error}*`;
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMsgId
                      ? { ...msg, content: accumulatedContent, isStreaming: false }
                      : msg
                  )
                );
              }
            } catch (e) {
              // Non-fatal chunk parsing boundary
            }
          }
        }
      }
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: "err-" + Date.now(),
        role: "assistant",
        content:
          err.message ||
          "Something went wrong reaching the assistant — please check connection and try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        type: "error",
        lastUserQuery: query,
      };
      setMessages((prev) => [...prev, errorMsg]);
      setScreenReaderAnnouncement("Error processing legal query. A retry button is available.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClarificationSubmit = (answers: Record<string, string>) => {
    setClarificationAnswers((prev) => ({ ...prev, ...answers }));
    const answersSummary = Object.entries(answers)
      .map(([k, v]) => `${k.replace(/_/g, " ")}: ${v}`)
      .join(" | ");

    const userClarificationMsg: ChatMessage = {
      id: "usr-clarify-" + Date.now(),
      role: "user",
      content: `Provided Context: ${answersSummary}`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userClarificationMsg]);
    handleSendMessage("Proceed with legal guidance based on provided context.", answers);
  };

  const handleClearChat = () => {
    setMessages([]);
    setActiveDomain(undefined);
    setClarificationAnswers({});
  };

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] max-w-5xl mx-auto w-full px-2.5 sm:px-6">
      {/* Screen Reader Live Announcement */}
      <div aria-live="polite" className="sr-only">
        {screenReaderAnnouncement}
      </div>

      {/* Simulator Notice Banner */}
      {!geminiConnected && (
        <div className="my-2 p-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-300 text-xs flex items-center justify-between gap-2 shrink-0 shadow-sm">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Offline Simulator Active:</strong> Responses run locally. To enable live Google
              Gemini 2.0 Flash calls, configure{" "}
              <code className="font-mono text-[11px] bg-background/50 px-1 py-0.5 rounded">
                GEMINI_API_KEY
              </code>
              .
            </span>
          </div>
        </div>
      )}

      {/* Emergency SOS Banner */}
      {sosTriggered && (
        <EmergencyBanner
          language={language}
          onClose={onDismissSOS}
          priorityMessage={
            language === "hi"
              ? "आपातकालीन स्थिति में तुरंत पुलिस (112) या महिला हेल्पलाइन (181) डायल करें:"
              : "Emergency triggered: Dial 112 for Police dispatch, 181 for Women in distress, or 1930 for Cyber financial fraud."
          }
        />
      )}

      {/* Document Review Modal */}
      <DocumentReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onConfirm={handleConfirmExtractedFacts}
        facts={extractedFacts}
        fileName={uploadedFileName}
        language={language}
      />

      {/* Hidden File Input for Document Upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/jpg,application/pdf"
        className="hidden"
        onChange={handleFileUpload}
        aria-label="Upload legal document image or PDF"
      />

      {/* Chat Messages Container */}
      <div
        className="flex-1 overflow-y-auto py-3 sm:py-4 space-y-3 sm:space-y-4 focus:outline-none"
        tabIndex={0}
        aria-label="Conversation History"
      >
        {messages.length === 0 ? (
          <EmptyState onSelectPrompt={(p) => handleSendMessage(p)} language={language} />
        ) : (
          messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="space-y-2.5"
            >
              {/* Emergency Helplines Card at top of message if triggered */}
              {msg.safetyHelplines && msg.safetyHelplines.length > 0 && (
                <EmergencyBanner
                  helplines={msg.safetyHelplines}
                  priorityMessage={msg.prioritySafetyMessage}
                  language={language}
                />
              )}

              {/* Message Bubble Container */}
              <div
                className={`flex gap-2 sm:gap-3 ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-1">
                    <Scale className="w-3.5 h-3.5 sm:w-4 sm:h-4" aria-hidden="true" />
                  </div>
                )}

                <div
                  className={`max-w-[90%] sm:max-w-[80%] md:max-w-[75%] rounded-2xl p-3 sm:p-4 shadow-sm text-xs sm:text-sm ${
                    msg.role === "user"
                      ? "bg-indigo-600 text-white rounded-br-none"
                      : "bg-card border border-border text-card-foreground rounded-bl-none"
                  }`}
                >
                  {/* Context Header for Assistant */}
                  {msg.role === "assistant" && (
                    <div className="flex items-center justify-between gap-2 mb-2 pb-1 border-b border-border/50 text-[11px] text-muted-foreground">
                      <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                        Nyaya Sahayak
                      </span>
                      <span>{msg.timestamp}</span>
                    </div>
                  )}

                  {/* Render based on message type */}
                  {msg.type === "clarification" ? (
                    <div>
                      <p className="mb-2.5 font-medium text-foreground">{msg.content}</p>
                      {msg.clarificationQuestions && (
                        <ClarificationCard
                          questions={msg.clarificationQuestions}
                          onSubmit={handleClarificationSubmit}
                          language={language}
                          disabled={isLoading}
                        />
                      )}
                    </div>
                  ) : msg.type === "guidance" && msg.content ? (
                    <LegalGuidanceCard
                      domainName={msg.domainName || msg.domain || "Legal Guidance"}
                      sections={msg.relevantSections}
                      portals={msg.portals}
                      draftTemplate={msg.draftTemplate}
                      content={msg.content}
                      language={language}
                      isStreaming={msg.isStreaming}
                      userQuery={msg.userQueryForGuidance}
                      clarifications={msg.clarificationsForGuidance}
                      stateJurisdiction={msg.stateJurisdiction}
                    />
                  ) : msg.type === "error" ? (
                    <div className="p-3 sm:p-4 rounded-xl border border-rose-500/30 bg-rose-500/5 text-rose-700 dark:text-rose-400">
                      <div className="flex items-center gap-1.5 font-semibold text-xs sm:text-sm mb-1.5">
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>Connection / Assistant Notice</span>
                      </div>
                      <p className="text-xs leading-relaxed">{msg.content}</p>
                      {msg.lastUserQuery && (
                        <button
                          onClick={() => handleSendMessage(msg.lastUserQuery)}
                          className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 hover:scale-[1.03] active:scale-[0.97] transition-all duration-150 cursor-pointer shadow-sm shadow-rose-600/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Try Again</span>
                        </button>
                      )}
                    </div>
                  ) : (
                    <div>
                      {msg.isFileUpload && (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/20 text-white text-[11px] font-semibold mb-2">
                          <FileText className="w-3.5 h-3.5" />
                          <span>Document Uploaded: {msg.fileName}</span>
                        </div>
                      )}
                      <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                    </div>
                  )}

                  {/* Timestamp for user message */}
                  {msg.role === "user" && (
                    <div className="text-[10px] text-indigo-200 text-right mt-1">
                      {msg.timestamp}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}

        {/* Shimmering Skeleton Loader while retrieving/generating */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-2 sm:gap-3 justify-start py-1.5"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-1">
              <Scale className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
            </div>

            <div className="max-w-[90%] sm:max-w-[80%] md:max-w-[75%] w-full rounded-2xl rounded-bl-none p-3.5 sm:p-4 bg-card border border-border space-y-3 shadow-sm">
              {/* Shimmer header */}
              <div className="flex items-center justify-between">
                <div className="h-4 w-32 bg-indigo-500/15 rounded animate-pulse" />
                <div className="h-3 w-16 bg-muted rounded animate-pulse" />
              </div>

              {/* Shimmer pills for statutes */}
              <div className="flex gap-1.5">
                <div className="h-5 w-24 bg-indigo-500/10 rounded-md animate-pulse" />
                <div className="h-5 w-28 bg-indigo-500/10 rounded-md animate-pulse" />
                <div className="h-5 w-20 bg-indigo-500/10 rounded-md animate-pulse" />
              </div>

              {/* Shimmer content lines */}
              <div className="space-y-2 pt-1">
                <div className="h-3.5 w-4/5 bg-muted rounded animate-pulse" />
                <div className="h-3 w-full bg-muted/70 rounded animate-pulse" />
                <div className="h-3 w-11/12 bg-muted/70 rounded animate-pulse" />
                <div className="h-3 w-3/4 bg-muted/60 rounded animate-pulse" />
              </div>

              <div className="pt-2 flex items-center gap-2 text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>
                  {language === "hi"
                    ? "कानूनी धाराओं एवं संदर्भ का विश्लेषण हो रहा है..."
                    : "Synthesizing statutory citations & procedural roadmap..."}
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Document analyzing indicator */}
        {isUploadingDoc && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2.5 p-3 rounded-xl border border-indigo-500/30 bg-indigo-50/50 dark:bg-indigo-950/20 text-xs text-indigo-900 dark:text-indigo-200"
          >
            <Loader2 className="w-4 h-4 animate-spin text-indigo-600 shrink-0" />
            <span>
              Reading & extracting key legal facts from <strong>{uploadedFileName}</strong> with Gemini
              multimodal AI...
            </span>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="sticky bottom-0 pt-1.5 pb-3 sm:pb-4 bg-background/95 backdrop-blur shrink-0 border-t border-border/40">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="relative flex items-center rounded-2xl border border-border bg-card shadow-sm p-1.5 sm:p-2 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all duration-200"
        >
          {/* Upload Button (📎) */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading || isUploadingDoc}
            className="p-1.5 sm:p-2 rounded-xl text-muted-foreground hover:text-indigo-600 hover:bg-indigo-500/10 hover:scale-105 active:scale-95 transition-all duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 shrink-0"
            title="Upload photo or PDF of notice, agreement, or bill"
            aria-label="Upload legal document"
          >
            <Paperclip className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </button>

          <textarea
            ref={inputRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder={
              language === "hi"
                ? "अपनी कानूनी समस्या लिखें या नोटिस/समझौता अपलोड करें (📎)..."
                : "Describe your legal issue or attach notice/agreement (📎)..."
            }
            className="flex-1 resize-none bg-transparent px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none max-h-28"
            disabled={isLoading || isUploadingDoc}
            aria-label="Legal issue description"
          />

          <div className="flex items-center gap-1 shrink-0">
            {messages.length > 0 && (
              <button
                type="button"
                onClick={handleClearChat}
                className="p-1.5 sm:p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted hover:scale-105 active:scale-95 transition-all duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                title="Reset Conversation"
                aria-label="Reset Conversation"
              >
                <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            )}

            <button
              type="submit"
              disabled={!input.trim() || isLoading || isUploadingDoc}
              className="p-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-150 shadow-sm shadow-indigo-600/30 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              aria-label="Send query"
              title="Send legal issue query"
            >
              <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </form>

        <div className="mt-1.5 flex items-center justify-between px-1 text-[10px] sm:text-[11px] text-muted-foreground">
          <span>
            {language === "hi"
              ? "विधिक सहायता सूचनात्मक है • आपातकाल में 112 डायल करें"
              : "Attach photo/PDF notice with 📎 • Dial 112 for immediate emergencies"}
          </span>
          <span className="hidden sm:inline">
            Press <strong>Enter</strong> to send
          </span>
        </div>
      </div>
    </div>
  );
};
