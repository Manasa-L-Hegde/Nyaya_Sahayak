import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rateLimiter";
import { analyzeDocumentWithGemini } from "@/lib/documentAnalyzer";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "127.0.0.1";
    const rateCheck = checkRateLimit(ip);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: "RATE_LIMIT_EXCEEDED",
          message: `Too many requests. Please wait ${rateCheck.resetInSec} seconds.`,
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { base64Data, mimeType, fileName, language = "en" } = body;

    if (!base64Data) {
      return NextResponse.json(
        { error: "INVALID_PAYLOAD", message: "No document data provided." },
        { status: 400 }
      );
    }

    // Validate mime type (images and pdfs)
    const allowedMimes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/jpg",
      "application/pdf",
    ];
    if (mimeType && !allowedMimes.includes(mimeType.toLowerCase())) {
      return NextResponse.json(
        {
          error: "UNSUPPORTED_MEDIA",
          message: "Please upload an image (JPG, PNG, WEBP) or PDF document.",
        },
        { status: 400 }
      );
    }

    // Size limit check (approx 8MB base64 limit)
    if (base64Data.length > 8 * 1024 * 1024) {
      return NextResponse.json(
        {
          error: "FILE_TOO_LARGE",
          message: "Uploaded document exceeds maximum size of 6MB. Please upload a smaller file.",
        },
        { status: 400 }
      );
    }

    const extracted = await analyzeDocumentWithGemini({
      base64Data,
      mimeType: mimeType || "image/jpeg",
      fileName: fileName || "document",
      language,
    });

    return NextResponse.json({
      success: true,
      data: extracted,
    });
  } catch (error: any) {
    console.error("Document analysis error:", error);
    return NextResponse.json(
      {
        error: "ANALYSIS_FAILED",
        message: error.message || "Failed to analyze document with multimodal AI.",
      },
      { status: 500 }
    );
  }
}
