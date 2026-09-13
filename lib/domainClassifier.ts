export type LegalDomainId =
  | "DOMESTIC_VIOLENCE"
  | "TENANT_RIGHTS"
  | "CONSUMER_PROTECTION"
  | "CYBER_CRIME"
  | "LABOUR_EMPLOYMENT"
  | "RTI"
  | "POLICE_FIR"
  | "OUT_OF_SCOPE";

export interface ClassificationResult {
  domain: LegalDomainId;
  confidence: number;
  isLegalIssue: boolean;
  domainName: string;
  hindiName: string;
  reason: string;
}

interface DomainRule {
  domain: LegalDomainId;
  name: string;
  hindiName: string;
  keywords: string[];
  phrases: string[];
}

const DOMAIN_RULES: DomainRule[] = [
  {
    domain: "DOMESTIC_VIOLENCE",
    name: "Domestic Violence & Women Safety",
    hindiName: "घरेलू हिंसा एवं महिला सुरक्षा",
    keywords: ["domestic violence", "husband", "wife", "in-laws", "beating", "dowry", "cruelty", "498a", "pwdva", "harassment at home", "marpeet", "dahej", "abuse", "stridhan", "maintenance 125"],
    phrases: ["husband is beating", "in laws harassing", "kicked out of house", "threatened by husband", "dowry demand"],
  },
  {
    domain: "TENANT_RIGHTS",
    name: "Tenant Rights & Eviction",
    hindiName: "किरायेदार अधिकार एवं बेदखली",
    keywords: ["tenant", "landlord", "eviction", "rent", "security deposit", "lease", "rent agreement", "kirayedar", "makan malik", "cut water", "cut electricity", "lock out", "deposit return"],
    phrases: ["landlord is asking to vacate", "landlord not returning deposit", "landlord cut electricity", "landlord threatening eviction", "rent increase"],
  },
  {
    domain: "CONSUMER_PROTECTION",
    name: "Consumer Protection & Defective Goods",
    hindiName: "उपभोक्ता संरक्षण एवं खराब उत्पाद",
    keywords: ["consumer", "defective", "refund", "warranty", "e-commerce", "flipkart", "amazon", "seller", "order cancel", "not delivered", "fraudulent product", "e-daakhil", "nch 1915", "unfair trade"],
    phrases: ["defective product received", "refusing to refund", "service deficiency", "misleading advertisement", "warranty claim denied"],
  },
  {
    domain: "CYBER_CRIME",
    name: "Cyber Crime & Digital Fraud",
    hindiName: "साइबर अपराध एवं डिजिटल धोखाधड़ी",
    keywords: ["cyber", "upi", "scam", "otp", "phishing", "hacked", "bank fraud", "unauthorized transaction", "blackmail online", "morphing", "sextortion", "apk scam", "1930", "telegram scam"],
    phrases: ["money deducted without otp", "upi scam", "fake call asking for otp", "online blackmail", "nude photo morphed"],
  },
  {
    domain: "LABOUR_EMPLOYMENT",
    name: "Labour & Employment Rights",
    hindiName: "श्रम अधिकार एवं रोजगार",
    keywords: ["salary", "unpaid wages", "boss", "employer", "termination", "fired", "posh", "sexual harassment at workplace", "severance", "pf", "gratuity", "resignation", "full and final", "f&f"],
    phrases: ["salary not credited", "company fired without notice", "unpaid salary for months", "hr not giving experience letter", "workplace harassment"],
  },
  {
    domain: "RTI",
    name: "Right to Information (RTI)",
    hindiName: "सूचना का अधिकार",
    keywords: ["rti", "right to information", "pio", "cpio", "public authority", "first appeal", "cic", "sic", "file noting", "government record", "rtionline"],
    phrases: ["how to file rti", "rti reply not received", "rti rejected", "first appeal under rti", "ask information from government"],
  },
  {
    domain: "POLICE_FIR",
    name: "Police Procedures & FIR",
    hindiName: "पुलिस प्रक्रिया एवं प्राथमिकी",
    keywords: ["fir", "police station", "sho", "zero fir", "bail", "anticipatory bail", "police complaint", "refusing fir", "police custody", "arrest warrant", "154 crpc", "173 bnss", "cognizable"],
    phrases: ["police refusing to write fir", "how to file fir", "police harassment", "arrest without warrant", "anticipatory bail process"],
  },
];

const OUT_OF_SCOPE_PATTERNS = [
  "weather", "forecast", "temperature", "rain today", "write a poem", "python code", "react code",
  "javascript", "solve math", "what is 2 + 2", "who is elon musk", "recipe for", "how to cook",
  "movie recommendation", "song lyrics", "cricket score", "ipl score", "football match"
];

export function classifyLegalDomain(query: string): ClassificationResult {
  const normalized = query.toLowerCase().trim();

  // 1. Check out of scope queries first
  const isOutOfScope = OUT_OF_SCOPE_PATTERNS.some((pattern) => normalized.includes(pattern));
  if (isOutOfScope) {
    return {
      domain: "OUT_OF_SCOPE",
      confidence: 0.95,
      isLegalIssue: false,
      domainName: "Out of Scope / Non-Legal Query",
      hindiName: "गैर-कानूनी प्रश्न",
      reason: "This query does not appear to involve Indian legal rights, procedures, or disputes.",
    };
  }

  // 2. Score against domain rules
  let bestDomain: LegalDomainId = "OUT_OF_SCOPE";
  let maxScore = 0;
  let bestName = "";
  let bestHindiName = "";

  for (const rule of DOMAIN_RULES) {
    let score = 0;

    // Check phrases (higher weight)
    for (const phrase of rule.phrases) {
      if (normalized.includes(phrase)) {
        score += 3;
      }
    }

    // Check keywords
    for (const kw of rule.keywords) {
      if (normalized.includes(kw)) {
        score += 1;
      }
    }

    if (score > maxScore) {
      maxScore = score;
      bestDomain = rule.domain;
      bestName = rule.name;
      bestHindiName = rule.hindiName;
    }
  }

  // Minimum threshold
  if (maxScore >= 1) {
    const confidence = Math.min(0.6 + maxScore * 0.1, 0.98);
    return {
      domain: bestDomain,
      confidence,
      isLegalIssue: true,
      domainName: bestName,
      hindiName: bestHindiName,
      reason: `Matched statutory keywords and context for ${bestName}.`,
    };
  }

  // Generic fallback if ambiguous
  return {
    domain: "OUT_OF_SCOPE",
    confidence: 0.4,
    isLegalIssue: false,
    domainName: "Unrecognized / General Query",
    hindiName: "अस्पष्ट प्रश्न",
    reason: "Could not map to a recognized Indian legal domain.",
  };
}
