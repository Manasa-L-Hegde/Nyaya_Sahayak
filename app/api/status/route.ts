import { NextResponse } from "next/server";
import { isGeminiConfigured } from "@/lib/gemini";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "nodejs";

// In-memory status cache (2 minutes TTL) to prevent repeated outbound pings on every reload
let cachedStatus: any = null;
let lastCacheTimestamp = 0;
const CACHE_TTL_MS = 2 * 60 * 1000;

export async function GET() {
  const now = Date.now();
  if (cachedStatus && now - lastCacheTimestamp < CACHE_TTL_MS) {
    return NextResponse.json({ ...cachedStatus, cached: true });
  }

  const isKeyConfigured = isGeminiConfigured();
  const modelName = process.env.GEMINI_MODEL || "gemini-3.6-flash";

  if (!isKeyConfigured) {
    const res = {
      geminiConnected: false,
      geminiConfigured: false,
      model: modelName,
      environment: process.env.NODE_ENV || "development",
      statusMessage:
        process.env.NODE_ENV === "production"
          ? "WARNING: GEMINI_API_KEY missing in Vercel Environment Variables"
          : "Simulator Mode (Add GEMINI_API_KEY to .env.local for live Gemini API)",
    };
    cachedStatus = res;
    lastCacheTimestamp = now;
    return NextResponse.json(res);
  }

  // Key is configured — test actual live API connectivity to Google Gemini
  try {
    const apiKey = process.env.GEMINI_API_KEY!;
    const genAI = new GoogleGenerativeAI(apiKey);
    let activeModel = modelName;
    let probe;

    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      probe = await model.countTokens("ping");
    } catch (probeErr: any) {
      if (
        probeErr.message &&
        (probeErr.message.includes("404") || probeErr.message.includes("not found")) &&
        modelName !== "gemini-3.6-flash"
      ) {
        activeModel = "gemini-3.6-flash";
        const fallback = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });
        probe = await fallback.countTokens("ping");
      } else {
        throw probeErr;
      }
    }

    const res = {
      geminiConnected: true,
      geminiConfigured: true,
      model: activeModel,
      environment: process.env.NODE_ENV || "development",
      statusMessage: `Google Gemini Active & Connected (${activeModel})`,
    };
    cachedStatus = res;
    lastCacheTimestamp = now;
    return NextResponse.json(res);
  } catch (err: any) {
    console.warn("Gemini live API check failed:", err.message);
    const res = {
      geminiConnected: false,
      geminiConfigured: true,
      model: modelName,
      environment: process.env.NODE_ENV || "development",
      error: err.message,
      statusMessage: `API Key set, but Google Gemini connection failed: ${err.message}`,
    };
    cachedStatus = res;
    lastCacheTimestamp = now;
    return NextResponse.json(res);
  }
}
