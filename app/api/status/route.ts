import { NextResponse } from "next/server";
import { isGeminiConfigured } from "@/lib/gemini";

export async function GET() {
  const configured = isGeminiConfigured();
  return NextResponse.json({
    geminiConfigured: configured,
    model: process.env.GEMINI_MODEL || "gemini-2.0-flash",
    environment: process.env.NODE_ENV || "development",
    statusMessage: configured
      ? "Google Gemini 2.0 Flash Active & Connected"
      : process.env.NODE_ENV === "production"
      ? "WARNING: GEMINI_API_KEY missing in Vercel Environment Variables"
      : "Local Dev Simulator (Add GEMINI_API_KEY to .env.local for live API)",
  });
}
