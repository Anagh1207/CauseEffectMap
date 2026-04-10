import { NextRequest, NextResponse } from "next/server";
import type { CauseMapData } from "@/lib/cause-map-types";
import { generateFallbackMapData } from "@/lib/generate-map-data";

// Lazy-import Gemini so missing package doesn't break the fallback path
async function tryGemini(problem: string): Promise<CauseMapData | null> {
  try {
    const { generateWithGemini } = await import("@/lib/gemini-generate");
    return await generateWithGemini(problem);
  } catch (err) {
    // Log full error for debugging
    console.error(`[CauseMap] Gemini error:`, err);
    const message = err instanceof Error ? err.message : String(err);
    console.warn(`[CauseMap] Gemini unavailable: ${message}. Using fallback.`);
    return null;
  }
}

// ─── POST /api/generate ───────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    // ── Parse & validate request body ──────────────────────────────────────
    let body: { problem?: string };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const problem = typeof body.problem === "string" ? body.problem.trim() : "";

    if (!problem) {
      return NextResponse.json(
        { error: "Missing required field: problem" },
        { status: 400 }
      );
    }

    if (problem.length > 500) {
      return NextResponse.json(
        { error: "Problem description too long (max 500 characters)" },
        { status: 400 }
      );
    }

    // ── Attempt AI generation, fall back gracefully ─────────────────────────
    const hasApiKey = !!process.env.GEMINI_API_KEY;

    let mapData: CauseMapData | null = null;
    let source: "gemini" | "fallback" = "fallback";

    if (hasApiKey) {
      mapData = await tryGemini(problem);
      if (mapData) source = "gemini";
    }

    if (!mapData) {
      mapData = generateFallbackMapData(problem);
    }

    // ── Return response with metadata header ────────────────────────────────
    return NextResponse.json(
      { ...mapData, _meta: { source } },
      {
        status: 200,
        headers: {
          "X-CauseMap-Source": source,
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    console.error("[CauseMap API] Unexpected error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// Disable caching for this route
export const dynamic = "force-dynamic";
