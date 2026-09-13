import { NextRequest, NextResponse } from "next/server";
import { sanitizeAndInspectInput } from "@/lib/security";
import { checkRateLimit } from "@/lib/rateLimiter";
import { detectSafetyEmergency } from "@/lib/safetyDetector";
import { classifyLegalDomain, LegalDomainId } from "@/lib/domainClassifier";
import { evaluateClarificationNeeds } from "@/lib/clarificationEngine";
import { retrieveLegalContext } from "@/lib/knowledgeRetriever";
import { generateLegalGuidanceStream, isGeminiConfigured } from "@/lib/gemini";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    // 1. Extract IP & check Rate Limit
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "127.0.0.1";
    const rateCheck = checkRateLimit(ip);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: "RATE_LIMIT_EXCEEDED",
          message: `Too many requests. Please wait ${rateCheck.resetInSec} seconds before sending another message.`,
        },
        { status: 429 }
      );
    }

    // 2. Parse request body
    const body = await req.json();
    const {
      message,
      domain: existingDomain,
      clarifications = {},
      history = [],
      isClarificationAnswer = false,
      language = "en",
    } = body;

    // 3. Sanitize and check for prompt injection
    const sanitization = sanitizeAndInspectInput(message || "");
    if (!sanitization.isSafe) {
      return NextResponse.json({
        type: "SECURITY_BLOCKED",
        blockedReason: sanitization.blockedReason,
        isInjectionAttempt: sanitization.isInjectionAttempt,
        message: sanitization.blockedReason,
      });
    }

    const cleanMessage = sanitization.sanitizedText;

    // 4. Safety Triage (Instant priority check for emergency/danger)
    const safetyCheck = detectSafetyEmergency(cleanMessage);

    // 5. Domain Classification
    const currentDomain: LegalDomainId =
      existingDomain && existingDomain !== "OUT_OF_SCOPE"
        ? existingDomain
        : classifyLegalDomain(cleanMessage).domain;

    // 6. Handle Out-of-Scope queries gracefully
    if (currentDomain === "OUT_OF_SCOPE" && !safetyCheck.isEmergency) {
      return NextResponse.json({
        type: "OUT_OF_SCOPE",
        domain: "OUT_OF_SCOPE",
        domainName: "General / Non-Legal Query",
        message:
          language === "hi"
            ? "नमस्ते! मैं 'न्याय सहायक' हूँ — भारत के कानूनों, अधिकारों और कानूनी प्रक्रियाओं के लिए एक विशेष कानूनी सहायक। आपका प्रश्न सामान्य ज्ञान या गैर-कानूनी विषय प्रतीत होता है। कृपया किरायेदार विवाद, उपभोक्ता अधिकार, साइबर अपराध, घरेलू सुरक्षा, या पुलिस/एफआईआर से संबंधित कानूनी प्रश्न पूछें।"
            : "Hello! I am Nyaya Sahayak, a dedicated assistant for Indian legal rights, statutory remedies, and legal procedures. Your query appears to be outside Indian legal disputes or procedures. Please ask a question related to tenant rights, consumer protection, cyber fraud, domestic violence, employment issues, RTI, or police/FIR procedures.",
        safety: safetyCheck,
      });
    }

    // 7. Check if Clarification Questions are required before giving legal guidance
    if (!isClarificationAnswer) {
      const clarificationCheck = evaluateClarificationNeeds(currentDomain, cleanMessage, clarifications);
      if (clarificationCheck.needsClarification && clarificationCheck.questions.length > 0) {
        return NextResponse.json({
          type: "CLARIFICATION_REQUIRED",
          domain: currentDomain,
          safety: safetyCheck,
          questions: clarificationCheck.questions,
          message:
            language === "hi"
              ? "सटीक और लागू होने वाली कानूनी सलाह देने के लिए, कृपया नीचे दिए गए 1-3 महत्वपूर्ण प्रश्नों का चयन करें:"
              : "To provide accurate, context-specific legal guidance under Indian law, please clarify the following key details:",
        });
      }
    }

    // 8. Green AI Knowledge Base Retrieval
    const retrieval = retrieveLegalContext(currentDomain, cleanMessage);

    // 9. Build Token-Optimized System Prompt for Gemini
    const systemPrompt = `You are "Nyaya Sahayak", an authoritative, compassionate, and precise Indian AI Legal Assistance advisor.
CORE MANDATE:
1. Provide structured, practical, and actionable legal guidance based on Indian law.
2. Cite specific acts and sections provided in the context (e.g. Model Tenancy Act, Consumer Protection Act 2019, PWDVA 2005, IT Act 2000, BNS / BNSS / CrPC).
3. Do NOT provide vague generalities. Structure your output clearly into:
   - ## 1. Statutory Rights & Legal Provisions (cite sections accurately)
   - ## 2. Immediate Procedural Action Plan (Step-by-step roadmap)
   - ## 3. Filing Authorities & Portals (exact portals, e.g., e-Daakhil, cybercrime.gov.in, NCH 1915, DLSA)
   - ## 4. Important Timelines & Limitations
   - ## 5. Important Legal Disclaimer
4. Language: Respond in ${language === "hi" ? "Hindi (हिंदी)" : "clear, professional English"}.
5. DISCLAIMER: Always state that this guidance is informational and educational under Indian law and does not replace a licensed advocate. Free counsel can be accessed via NALSA (15100).
6. GREEN AI: Be concise, direct, and avoid bloated conversational filler.`;

    const userPrompt = `USER SITUATION:
"${cleanMessage}"

IDENTIFIED LEGAL DOMAIN: ${currentDomain}
CLARIFICATIONS PROVIDED BY USER:
${Object.entries(clarifications)
  .map(([k, v]) => `- ${k}: ${v}`)
  .join("\n") || "None"}

STATUTORY KNOWLEDGE CONTEXT:
Domain: ${retrieval.domainKnowledge?.name || currentDomain}
Key Statutes & Sections:
${retrieval.domainKnowledge?.keyStatutes.map((s) => `${s.act}: ${s.sections.join(", ")} - ${s.description}`).join("\n") || "General Indian law"}

Official Portals:
${retrieval.recommendedPortals.map((p) => `${p.name}: ${p.url}`).join("\n")}

Please provide structured, step-by-step guidance.`;

    // 10. Generate Streaming Guidance via Gemini 2.0 Flash
    const stream = await generateLegalGuidanceStream({
      systemPrompt,
      userPrompt,
      contextHistory: history.slice(-4),
    });

    // Create SSE encoder stream
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        // Send initial metadata chunk
        const initialMetadata = {
          type: "METADATA",
          domain: currentDomain,
          domainName: retrieval.domainKnowledge?.name || currentDomain,
          safety: safetyCheck,
          relevantSections: retrieval.relevantSections,
          portals: retrieval.recommendedPortals,
          draftTemplate: retrieval.draftTemplate,
          greenAIMetrics: retrieval.greenAIMetrics,
          geminiLive: isGeminiConfigured(),
        };

        controller.enqueue(encoder.encode(`data: ${JSON.stringify(initialMetadata)}\n\n`));

        try {
          for await (const chunk of stream) {
            const chunkText = chunk.text();
            if (chunkText) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ type: "TOKEN", token: chunkText })}\n\n`)
              );
            }
          }
        } catch (err: any) {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: "ERROR",
                error: err.message || "Streaming encountered an error",
              })}\n\n`
            )
          );
        } finally {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "DONE" })}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (error: any) {
    console.error("API Error in /api/chat:", error);
    return NextResponse.json(
      {
        error: "INTERNAL_ERROR",
        message: error.message || "An unexpected error occurred while processing your legal query.",
      },
      { status: 500 }
    );
  }
}
