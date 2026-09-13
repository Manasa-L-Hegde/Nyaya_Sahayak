import { LEGAL_KNOWLEDGE_BASE, LegalDomainKnowledge } from "@/data/legalKnowledge";
import { LegalDomainId } from "./domainClassifier";

export interface ClarifyingQuestionItem {
  id: string;
  question: string;
  hindiQuestion: string;
  options: string[];
  whyNeeded: string;
}

export interface ClarificationCheckResult {
  needsClarification: boolean;
  questions: ClarifyingQuestionItem[];
  missingFactCount: number;
}

export function evaluateClarificationNeeds(
  domainId: LegalDomainId,
  userQuery: string,
  existingAnswers?: Record<string, string>
): ClarificationCheckResult {
  if (domainId === "OUT_OF_SCOPE") {
    return {
      needsClarification: false,
      questions: [],
      missingFactCount: 0,
    };
  }

  const domainKnowledge: LegalDomainKnowledge | undefined = LEGAL_KNOWLEDGE_BASE[domainId];
  if (!domainKnowledge || !domainKnowledge.criticalClarifyingQuestions) {
    return {
      needsClarification: false,
      questions: [],
      missingFactCount: 0,
    };
  }

  const queryLower = userQuery.toLowerCase();
  const unansweredQuestions: ClarifyingQuestionItem[] = [];

  for (const cq of domainKnowledge.criticalClarifyingQuestions) {
    // If user already answered in a previous turn, skip
    if (existingAnswers && existingAnswers[cq.id]) {
      continue;
    }

    // Heuristics: check if user query already clearly provided this fact
    let alreadyProvided = false;

    if (cq.id === "state_jurisdiction") {
      const states = ["delhi", "maharashtra", "mumbai", "karnataka", "bangalore", "bengaluru", "tamil nadu", "chennai", "telangana", "hyderabad", "up", "uttar pradesh", "punjab", "haryana", "kolkata", "west bengal"];
      if (states.some((s) => queryLower.includes(s))) {
        alreadyProvided = true;
      }
    } else if (cq.id === "agreement_status") {
      if (queryLower.includes("agreement signed") || queryLower.includes("registered agreement") || queryLower.includes("11 month lease") || queryLower.includes("no agreement")) {
        alreadyProvided = true;
      }
    } else if (cq.id === "time_elapsed") {
      if (queryLower.includes("today") || queryLower.includes("just now") || queryLower.includes("1 hour ago") || queryLower.includes("yesterday") || queryLower.includes("last week")) {
        alreadyProvided = true;
      }
    } else if (cq.id === "fir_status") {
      if (queryLower.includes("already filed fir") || queryLower.includes("police refused") || queryLower.includes("ncr filed")) {
        alreadyProvided = true;
      }
    } else if (cq.id === "claim_amount") {
      if (queryLower.includes("rs") || queryLower.includes("rupees") || queryLower.includes("inr") || queryLower.includes("lakh")) {
        alreadyProvided = true;
      }
    }

    if (!alreadyProvided) {
      unansweredQuestions.push(cq);
    }
  }

  // Pick top 1 to 3 targeted questions
  const selectedQuestions = unansweredQuestions.slice(0, 3);

  return {
    needsClarification: selectedQuestions.length > 0,
    questions: selectedQuestions,
    missingFactCount: selectedQuestions.length,
  };
}
