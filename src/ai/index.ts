import { Config } from "../config.js";
import { runAnthropic } from "./anthropic.js";
import { runOpenAI } from "./openai.js";
import { runGemini } from "./gemini.js";
import { runGroq } from "./groq.js";

export interface AIResponse {
  results: Record<string, string>[];
  summary: string;
}

export function buildSystemPrompt(pageTitle: string): string {
  return `You are an expert web scraping assistant. 
You will be given the text content of a webpage titled "${pageTitle}" and a user's extraction request.
Your job is to extract exactly what the user asks for and return it as valid JSON.

RULES:
- Always respond with ONLY a valid JSON object, no markdown, no backticks, no explanation
- The JSON must have this exact shape:
  {
    "results": [
      { "field1": "value", "field2": "value" },
      ...
    ],
    "summary": "A brief summary of what you found"
  }
- Use descriptive field names based on what you are extracting
- If nothing is found, return { "results": [], "summary": "No matching results found" }
- Never make up data that isn't on the page`;
}

export function buildUserPrompt(pageText: string, userPrompt: string): string {
  return `PAGE CONTENT:
${pageText}

EXTRACTION REQUEST:
${userPrompt}`;
}

export function parseAIResponse(rawText: string): AIResponse {
  try {
    const cleaned = rawText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(cleaned);

    if (!parsed.results || !Array.isArray(parsed.results)) {
      throw new Error("Invalid response shape");
    }

    return parsed as AIResponse;
  } catch (error) {
    return {
      results: [],
      summary: `Failed to parse AI response: ${rawText.slice(0, 100)}`,
    };
  }
}

export async function runAI(
  config: Config,
  pageText: string,
  pageTitle: string,
  userPrompt: string,
): Promise<AIResponse> {
  switch (config.provider) {
    case "anthropic":
      return runAnthropic(
        config.apiKey,
        config.model,
        pageText,
        pageTitle,
        userPrompt,
      );
    case "openai":
      return runOpenAI(
        config.apiKey,
        config.model,
        pageText,
        pageTitle,
        userPrompt,
      );
    case "gemini":
      return runGemini(
        config.apiKey,
        config.model,
        pageText,
        pageTitle,
        userPrompt,
      );
    case "groq":
      return runGroq(
        config.apiKey,
        config.model,
        pageText,
        pageTitle,
        userPrompt,
      );
    default:
      throw new Error(`Unsupported provider: ${config.provider}`);
  }
}
