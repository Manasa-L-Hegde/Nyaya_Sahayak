import { GoogleGenerativeAI } from "@google/generative-ai";
import { LegalDomainId } from "./domainClassifier";
import { isGeminiConfigured } from "./gemini";

export interface ExtractedDocumentFacts {
  documentType: string;
  parties: {
    issuerOrSender?: string;
    recipientOrSubject?: string;
  };
  dates: {
    documentDate?: string;
    deadlineOrEvictionDate?: string;
    incidentDate?: string;
  };
  noticePeriodDays?: string;
  amounts: {
    depositOrClaimAmount?: string;
    rentOrArrears?: string;
  };
  keyClausesOrAllegations: string[];
  summary: string;
  suggestedDomain: LegalDomainId;
  suggestedClarifications: Record<string, string>;
  isSimulatedFallback?: boolean;
}

export interface AnalyzeDocumentInput {
  base64Data: string;
  mimeType: string;
  fileName?: string;
  language?: "en" | "hi";
}

const DOCUMENT_EXTRACTION_PROMPT = `You are "Nyaya Sahayak", an AI legal document analysis assistant specializing in Indian legal documents (such as eviction notices, rent agreements, recovery demands, cyber complaints, consumer purchase invoices, police notices).

Analyze the provided image or PDF document. Extract all factual, statutory, and actionable data accurately.

Respond ONLY with a valid JSON object following this exact JSON schema:
{
  "documentType": "string (e.g. 'Eviction Notice under Transfer of Property Act', 'Residential Rent Agreement', 'Legal Demand Notice', 'Invoice / Purchase Order', 'Police Summons / Notice', 'Bank / UPI Fraud Alert')",
  "parties": {
    "issuerOrSender": "string or null",
    "recipientOrSubject": "string or null"
  },
  "dates": {
    "documentDate": "string or null",
    "deadlineOrEvictionDate": "string or null",
    "incidentDate": "string or null"
  },
  "noticePeriodDays": "string or null (e.g. '15 days', '30 days')",
  "amounts": {
    "depositOrClaimAmount": "string or null (e.g. '₹50,000')",
    "rentOrArrears": "string or null"
  },
  "keyClausesOrAllegations": ["list of strings highlighting key demands, allegations, or terms"],
  "summary": "Concise 2-3 sentence factual summary of what this document demands or establishes.",
  "suggestedDomain": "TENANT_RIGHTS | CONSUMER_PROTECTION | CYBER_CRIME | DOMESTIC_VIOLENCE | LABOUR_EMPLOYMENT | RTI | POLICE_FIR | OUT_OF_SCOPE",
  "suggestedClarifications": {
    "state_jurisdiction": "Delhi NCR | Maharashtra | Karnataka | Tamil Nadu | Telangana | Uttar Pradesh | Other State (infer if mentioned in document addresses)",
    "agreement_status": "Yes, registered agreement | Yes, notarized 11-month agreement | Expired agreement / continuing tenancy | Oral agreement (no written document)",
    "dispute_type": "Threatened eviction / locks changed | Refusal to refund security deposit | Disconnection of water/electricity | Arbitrary mid-tenure rent increase",
    "claim_amount": "string if found",
    "time_elapsed": "string if found"
  }
}

Important:
- If a field is not present in the document, use null or omit it.
- Never make up fictitious statutes or dates.
- Do not wrap the JSON in markdown code fences. Output raw JSON only.`;

export async function analyzeDocumentWithGemini(
  input: AnalyzeDocumentInput
): Promise<ExtractedDocumentFacts> {
  const { base64Data, mimeType, fileName = "uploaded-document", language = "en" } = input;

  // If Gemini is not configured, or running in local dev/offline mode without key, return intelligent fallback
  if (!isGeminiConfigured()) {
    return generateSimulatedDocumentFacts(fileName, mimeType, language);
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY!;
    const genAI = new GoogleGenerativeAI(apiKey);
    const requestedModel = process.env.GEMINI_MODEL || "gemini-3.6-flash";
    
    // Strip any leading data:url prefix if present
    const cleanBase64 = base64Data.includes(",") ? base64Data.split(",")[1] : base64Data;

    let result;
    try {
      const model = genAI.getGenerativeModel({ model: requestedModel });
      result = await model.generateContent([
        DOCUMENT_EXTRACTION_PROMPT,
        {
          inlineData: {
            data: cleanBase64,
            mimeType: mimeType || "image/jpeg",
          },
        },
      ]);
    } catch (modelErr: any) {
      if (modelErr.message && (modelErr.message.includes("404") || modelErr.message.includes("not found")) && requestedModel !== "gemini-3.6-flash") {
        console.warn(`Document analysis: model ${requestedModel} returned 404, retrying with gemini-3.6-flash...`);
        const fallbackModel = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });
        result = await fallbackModel.generateContent([
          DOCUMENT_EXTRACTION_PROMPT,
          {
            inlineData: {
              data: cleanBase64,
              mimeType: mimeType || "image/jpeg",
            },
          },
        ]);
      } else {
        throw modelErr;
      }
    }

    const responseText = result.response.text().trim();
    // Clean potential markdown blocks
    const jsonStr = responseText.replace(/^```json\s*/i, "").replace(/```$/i, "").trim();
    const parsed = JSON.parse(jsonStr) as ExtractedDocumentFacts;
    parsed.isSimulatedFallback = false;
    return parsed;
  } catch (err) {
    console.error("Gemini document analysis error, falling back to simulator:", err);
    return generateSimulatedDocumentFacts(fileName, mimeType, language);
  }
}

/**
 * High-fidelity fallback extractor for offline development, automated tests,
 * and environments without live GEMINI_API_KEY.
 */
export function generateSimulatedDocumentFacts(
  fileName: string,
  mimeType: string,
  language: "en" | "hi" = "en"
): ExtractedDocumentFacts {
  const lowerName = fileName.toLowerCase();

  if (lowerName.includes("rent") || lowerName.includes("agreement") || lowerName.includes("lease")) {
    return {
      documentType: "Residential Rent Agreement",
      parties: {
        issuerOrSender: "Mr. R. K. Sharma (Landlord / Lessor)",
        recipientOrSubject: "Tenant / Lessee",
      },
      dates: {
        documentDate: "01-Oct-2023",
        deadlineOrEvictionDate: "31-Aug-2024",
      },
      noticePeriodDays: "30 days mandatory notice",
      amounts: {
        depositOrClaimAmount: "₹45,000 (Security Deposit paid)",
        rentOrArrears: "₹18,000/month",
      },
      keyClausesOrAllegations: [
        "Clause 6: Security deposit refundable within 7 days of peaceful handover.",
        "Clause 9: Landlord cannot disconnect electricity or water services under any pretext.",
        "Clause 14: One month written notice required prior to lease determination.",
      ],
      summary:
        language === "hi"
          ? "यह एक आवासीय किराया समझौता है जो ₹18,000 मासिक किराये और ₹45,000 सुरक्षा जमा का उल्लेख करता है। इसमें 30 दिनों का अनिवार्य नोटिस का प्रावधान है।"
          : "Residential rental agreement between landlord and tenant specifying ₹18,000/month rent, ₹45,000 security deposit, and a 30-day notice period before termination.",
      suggestedDomain: "TENANT_RIGHTS",
      suggestedClarifications: {
        agreement_status: "Yes, registered agreement",
        dispute_type: "Refusal to refund security deposit",
        state_jurisdiction: "Delhi NCR",
      },
      isSimulatedFallback: true,
    };
  }

  if (lowerName.includes("cyber") || lowerName.includes("fraud") || lowerName.includes("upi") || lowerName.includes("bank")) {
    return {
      documentType: "Bank Transaction / UPI Fraud Debit Statement",
      parties: {
        issuerOrSender: "Citizen Accountholder",
        recipientOrSubject: "Unknown Fraudulent Beneficiary / UPI ID",
      },
      dates: {
        documentDate: new Date().toLocaleDateString("en-IN"),
        incidentDate: "Recent (within last 24-48 hours)",
      },
      noticePeriodDays: "Golden Hour (<24 hrs) for bank fund freeze",
      amounts: {
        depositOrClaimAmount: "₹38,500 unauthorized UPI deduction",
        rentOrArrears: undefined,
      },
      keyClausesOrAllegations: [
        "Unauthorized IMPS/UPI debit without two-factor authentication consent.",
        "Phishing call pretending to be customer support.",
        "Transaction reference number and recipient VPA recorded.",
      ],
      summary:
        language === "hi"
          ? "अनधिकृत बैंक लेन-देन / यूपीआई धोखाधड़ी जिसमें ₹38,500 की अनधिकृत कटौती हुई। तत्काल 1930 पर शिकायत एवं बैंक में विवाद दर्ज करना आवश्यक है।"
          : "Financial cyber fraud transaction record indicating an unauthorized debit of ₹38,500. Immediate Golden-Hour freeze via 1930 and bank dispute is recommended.",
      suggestedDomain: "CYBER_CRIME",
      suggestedClarifications: {
        claim_amount: "₹38,500",
        time_elapsed: "Within last 24 hours (Golden Hour)",
      },
      isSimulatedFallback: true,
    };
  }

  if (lowerName.includes("consumer") || lowerName.includes("bill") || lowerName.includes("invoice") || lowerName.includes("flipkart") || lowerName.includes("amazon")) {
    return {
      documentType: "Tax Invoice & Product Delivery Receipt",
      parties: {
        issuerOrSender: "E-Commerce Merchant / Authorized Dealer",
        recipientOrSubject: "Consumer / Purchaser",
      },
      dates: {
        documentDate: "12-Jan-2024",
        deadlineOrEvictionDate: "Warranty active for 12 months",
      },
      noticePeriodDays: "15 days statutory grievance notice",
      amounts: {
        depositOrClaimAmount: "₹24,999 (Product Invoice Value)",
        rentOrArrears: undefined,
      },
      keyClausesOrAllegations: [
        "Product delivered in defective/non-functional condition.",
        "Merchant refused replacement or refund within statutory return window.",
        "Violation of Consumer Protection Act 2019 provisions on Unfair Trade Practices.",
      ],
      summary:
        language === "hi"
          ? "खरीद रसीद/चालान जिसमें ₹24,999 का दोषपूर्ण उत्पाद दर्शाया गया है। उपभोक्ता संरक्षण अधिनियम के तहत प्रतिस्थापन या धनवापसी का अधिकार बनता है।"
          : "Commercial purchase invoice for ₹24,999 where defective goods were delivered and seller refused refund, qualifying for Consumer Commission remedy.",
      suggestedDomain: "CONSUMER_PROTECTION",
      suggestedClarifications: {
        claim_amount: "Under ₹5 Lakhs (District Consumer Commission)",
        dispute_type: "Defective product / seller refusal to refund",
      },
      isSimulatedFallback: true,
    };
  }

  // Default: Legal Eviction / Demand Notice
  return {
    documentType: "Formal Notice to Vacate / Legal Notice under Section 106 TPA",
    parties: {
      issuerOrSender: "Landlord / Legal Counsel for Landlord",
      recipientOrSubject: "Tenant in Possession",
    },
    dates: {
      documentDate: "10-Feb-2024",
      deadlineOrEvictionDate: "Within 15 days of notice receipt",
    },
    noticePeriodDays: "15 days statutory period",
    amounts: {
      depositOrClaimAmount: "₹60,000 security deposit withheld",
      rentOrArrears: "₹25,000/month",
    },
    keyClausesOrAllegations: [
      "Demand for immediate handover of vacant physical possession.",
      "Threat of locking premises and forceful eviction upon expiry of notice.",
      "Disputed unilateral rent escalation and retention of security deposit.",
    ],
    summary:
      language === "hi"
        ? "मकान खाली करने का कानूनी नोटिस जिसमें 15 दिन की अवधि दी गई है। मॉडल टेनेंसी एक्ट एवं टीपीए 1882 के तहत बिना रेंट अथॉरिटी आदेश जबरन बेदखली अवैध है।"
        : "Formal eviction notice demanding premises be vacated within 15 days. Under Indian law (Model Tenancy Act & Section 106 TPA), forcible extra-judicial lockouts are illegal.",
    suggestedDomain: "TENANT_RIGHTS",
    suggestedClarifications: {
      state_jurisdiction: "Delhi NCR",
      agreement_status: "Yes, registered agreement",
      dispute_type: "Threatened eviction / locks changed",
    },
    isSimulatedFallback: true,
  };
}
