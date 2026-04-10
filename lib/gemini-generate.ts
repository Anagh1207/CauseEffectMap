import { GoogleGenerativeAI } from "@google/generative-ai";
import type { CauseMapData } from "./cause-map-types";
import { buildMapData } from "./generate-map-data";

const MODEL_NAME = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";

// ─── Prompt builder ───────────────────────────────────────────────────────────

function buildPrompt(problem: string): string {
  return `You are an expert problem solver who helps people understand issues through clear, relatable cause-and-effect mapping.

Your task is to deconstruct a specific user-provided problem ("${problem}") into a practical, easy-to-understand cause-and-effect map. 

IMPORTANT: Focus on realistic, everyday practical scenarios. DO NOT use overly technical, academic, or complex jargon unless the user's problem specifically uses technical terms. Keep the language grounded, relatable, and immediately useful to a normal person.

DO NOT use generic reasons like "Bad luck" or "Human error." Instead, identify specific, real-world causes and effects that actually happen in the context of "${problem}".

Return ONLY a valid JSON object with this exact structure (no markdown, no explanation):
{
  "causes": [
    {
      "label": "Specific cause (max 6 words)",
      "description": "A clear, everyday explanation of why this happens in a practical scenario. (2-3 sentences)",
      "confidence": 85
    }
  ],
  "effects": [
    {
      "label": "Specific effect (max 6 words)",
      "description": "A clear explanation of the practical consequence or how this impacts daily life/operations. (2-3 sentences)",
      "confidence": 90
    }
  ]
}

Rules:
- Provide exactly 4 diverse and distinct causes and exactly 4 diverse and distinct effects.
- Labels MUST be descriptive and easy to understand (max 6 words).
- Descriptions MUST be grounded in practical reality, completely avoiding theoretical or highly technical mechanisms unless prompted.
- Confidence values must be integers between 60 and 98.
- Return ONLY the raw JSON object, do not wrap in markdown code blocks.`;
}

// ─── Response parser ──────────────────────────────────────────────────────────

interface GeminiResponse {
  causes: { label: string; description: string; confidence: number }[];
  effects: { label: string; description: string; confidence: number }[];
}

function parseGeminiResponse(text: string): GeminiResponse {
  // Strip markdown code fences if present
  const cleaned = text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```\s*$/, "")
    .trim();

  const parsed = JSON.parse(cleaned) as GeminiResponse;

  // Validate structure
  if (!Array.isArray(parsed.causes) || !Array.isArray(parsed.effects)) {
    throw new Error("Invalid response structure: missing causes or effects arrays");
  }
  if (parsed.causes.length === 0 || parsed.effects.length === 0) {
    throw new Error("Empty causes or effects array in response");
  }

  // Validate each node
  const validateNodes = (
    nodes: unknown[],
    name: string
  ) => {
    nodes.forEach((node, i) => {
      const n = node as { label?: unknown; description?: unknown; confidence?: unknown };
      if (typeof n.label !== "string" || n.label.trim() === "") {
        throw new Error(`${name}[${i}] missing label`);
      }
      if (typeof n.description !== "string" || n.description.trim() === "") {
        throw new Error(`${name}[${i}] missing description`);
      }
      if (typeof n.confidence !== "number") {
        n.confidence = 75; // default fallback
      }
    });
  };

  validateNodes(parsed.causes, "causes");
  validateNodes(parsed.effects, "effects");

  return parsed;
}

// ─── Main export ──────────────────────────────────────────────────────────────

export async function generateWithGemini(problem: string): Promise<CauseMapData> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY not configured");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const prompt = buildPrompt(problem);

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();

  const parsed = parseGeminiResponse(text);
  return buildMapData(problem, parsed.causes, parsed.effects);
}
