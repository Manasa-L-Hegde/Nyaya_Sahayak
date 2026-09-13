export interface SanitizationResult {
  sanitizedText: string;
  isSafe: boolean;
  blockedReason?: string;
  isInjectionAttempt: boolean;
}

const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior|above)\s+instructions/i,
  /disregard\s+(all\s+)?(previous|prior)\s+rules/i,
  /you\s+are\s+now\s+(DAN|unfiltered|jailbroken|an\s+unrestricted\s+ai)/i,
  /reveal\s+(your\s+)?(system\s+prompt|hidden\s+instructions|api\s+key)/i,
  /bypass\s+(all\s+)?(safety|guardrails|security)/i,
  /output\s+(the\s+)?(exact\s+)?system\s+instructions/i,
  /system\s+override\s*:\s*execute/i,
  /act\s+as\s+a\s+hacker/i,
];

export function sanitizeAndInspectInput(rawInput: string): SanitizationResult {
  if (!rawInput || typeof rawInput !== "string" || !rawInput.trim()) {
    return {
      sanitizedText: "",
      isSafe: false,
      blockedReason: "Query cannot be empty.",
      isInjectionAttempt: false,
    };
  }

  // Length limit (maximum 4000 characters)
  if (rawInput.length > 4000) {
    return {
      sanitizedText: rawInput.substring(0, 4000),
      isSafe: false,
      blockedReason: "Query exceeds the maximum allowable length of 4000 characters.",
      isInjectionAttempt: false,
    };
  }

  // Detect prompt injection attempts
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(rawInput)) {
      return {
        sanitizedText: rawInput,
        isSafe: false,
        blockedReason: "Security Alert: Detected attempt to override or inspect system instructions. The assistant operates strictly within its verified Indian legal advisory mandate.",
        isInjectionAttempt: true,
      };
    }
  }

  // Sanitize harmful HTML/script tags
  const sanitized = rawInput
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<[^>]+>/g, "")
    .trim();

  return {
    sanitizedText: sanitized,
    isSafe: true,
    isInjectionAttempt: false,
  };
}
