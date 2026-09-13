import { VERIFIED_HELPLINES, EmergencyHelpline } from "@/data/legalKnowledge";

export interface SafetyCheckResult {
  isEmergency: boolean;
  urgencyLevel: "CRITICAL_SAFETY" | "HIGH_URGENCY" | "STANDARD_LEGAL";
  threatType?: "DOMESTIC_VIOLENCE" | "PHYSICAL_ATTACK" | "CYBER_FINANCIAL_FRAUD" | "CHILD_ABUSE" | "SUICIDE_SELF_HARM";
  surfacedHelplines: EmergencyHelpline[];
  priorityMessage: string;
}

const CRITICAL_KEYWORDS = [
  "beating", "beaten", "hit me", "slapped", "locked in", "physical violence", "threat to kill", "kill me",
  "murder", "strangled", "burn me", "dowry torture", "suicide", "end my life", "rape", "molested",
  "assaulted", "bleeding", "in danger", "help me please", "save me", "husband is beating", "in-laws beating",
  "marpeet", "jaan se maarne", "band kar diya", "bachao"
];

const CYBER_FRAUD_KEYWORDS = [
  "upi fraud", "money deducted", "account debited", "otp shared", "bank scam", "phishing",
  "1930", "golden hour", "credit card hacked", "sim swap", "apk scam"
];

export function detectSafetyEmergency(query: string): SafetyCheckResult {
  const normalized = query.toLowerCase();

  // Check critical safety / physical threat / domestic violence first
  const hasCriticalKeyword = CRITICAL_KEYWORDS.some((kw) => normalized.includes(kw));

  if (hasCriticalKeyword) {
    return {
      isEmergency: true,
      urgencyLevel: "CRITICAL_SAFETY",
      threatType: "DOMESTIC_VIOLENCE",
      surfacedHelplines: [
        VERIFIED_HELPLINES.nationalEmergency, // 112
        VERIFIED_HELPLINES.womenHelpline, // 181
        VERIFIED_HELPLINES.ncwHelpline, // 7827170170
        VERIFIED_HELPLINES.womenPolice, // 1091
        VERIFIED_HELPLINES.legalAid, // 15100
      ],
      priorityMessage: "URGENT SAFETY ALERT: Your safety is the highest priority. If you or someone with you is in immediate physical danger, please contact the emergency helplines below immediately. Legal guidance is provided below, but emergency assistance should be sought first.",
    };
  }

  // Check urgent cyber fraud (Golden Hour)
  const hasCyberFraudKeyword = CYBER_FRAUD_KEYWORDS.some((kw) => normalized.includes(kw));
  if (hasCyberFraudKeyword) {
    return {
      isEmergency: true,
      urgencyLevel: "HIGH_URGENCY",
      threatType: "CYBER_FINANCIAL_FRAUD",
      surfacedHelplines: [
        VERIFIED_HELPLINES.cyberCrime, // 1930
        VERIFIED_HELPLINES.nationalEmergency, // 112
      ],
      priorityMessage: "GOLDEN HOUR CYBER ALERT: For financial cyber fraud, immediately dial 1930 and notify your bank to freeze transactions before money leaves intermediate beneficiary accounts.",
    };
  }

  return {
    isEmergency: false,
    urgencyLevel: "STANDARD_LEGAL",
    surfacedHelplines: [],
    priorityMessage: "",
  };
}
