import { LEGAL_KNOWLEDGE_BASE, LegalDomainKnowledge } from "@/data/legalKnowledge";
import { LegalDomainId } from "./domainClassifier";

export interface RetrievalResult {
  domainKnowledge: LegalDomainKnowledge | null;
  relevantSections: string[];
  recommendedPortals: { name: string; url: string; description: string }[];
  draftTemplate?: { title: string; templateText: string };
  greenAIMetrics: {
    retrievalLatencyMs: number;
    tokensSavedEstimate: number;
    infraMode: "Zero-Cloud-DB (In-Memory Micro-Index)";
    labelNote: string;
  };
}

export function retrieveLegalContext(domain: LegalDomainId, query: string): RetrievalResult {
  const startTime = performance.now();

  if (domain === "OUT_OF_SCOPE" || !LEGAL_KNOWLEDGE_BASE[domain]) {
    const elapsed = Math.round((performance.now() - startTime) * 100) / 100;
    return {
      domainKnowledge: null,
      relevantSections: [],
      recommendedPortals: [],
      greenAIMetrics: {
        retrievalLatencyMs: elapsed,
        tokensSavedEstimate: 0,
        infraMode: "Zero-Cloud-DB (In-Memory Micro-Index)",
        labelNote: "Illustrative estimate based on compact prompt token savings vs. typical 24/7 vector-DB inference",
      },
    };
  }

  const knowledge = LEGAL_KNOWLEDGE_BASE[domain];
  const queryWords = query.toLowerCase().split(/\s+/);

  // Extract most relevant sections based on keyword matching
  const matchedSections: string[] = [];
  for (const statute of knowledge.keyStatutes) {
    for (const sec of statute.sections) {
      const secNormalized = sec.toLowerCase();
      if (queryWords.some((w) => w.length > 3 && secNormalized.includes(w))) {
        matchedSections.push(`${statute.act} - ${sec}`);
      }
    }
  }

  // If none explicitly matched query tokens, provide primary statutory sections
  if (matchedSections.length === 0) {
    knowledge.keyStatutes.forEach((st) => {
      matchedSections.push(`${st.act}: ${st.sections.slice(0, 3).join(", ")}`);
    });
  }

  const endTime = performance.now();
  const latencyMs = Math.round((endTime - startTime) * 100) / 100;

  // Green AI calculation:
  // Typical multi-doc RAG dumps 2,000-4,000 tokens of raw text into prompt.
  // Nyaya Sahayak retrieves concise, curated domain definitions and statutes, sending ~450 tokens.
  // Estimated token saving: ~1,850 tokens per interaction.
  const tokensSavedEstimate = 1850;

  return {
    domainKnowledge: knowledge,
    relevantSections: matchedSections,
    recommendedPortals: knowledge.officialPortals,
    draftTemplate: knowledge.draftTemplate,
    greenAIMetrics: {
      retrievalLatencyMs: latencyMs,
      tokensSavedEstimate,
      infraMode: "Zero-Cloud-DB (In-Memory Micro-Index)",
      labelNote: "Illustrative estimate based on compact prompt token savings vs. typical 24/7 vector-DB inference",
    },
  };
}
