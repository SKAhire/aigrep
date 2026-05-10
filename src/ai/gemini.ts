import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  AIResponse,
  buildSystemPrompt,
  buildUserPrompt,
  parseAIResponse,
} from "./index.js";

export async function runGemini(
  apiKey: string,
  model: string,
  pageText: string,
  pageTitle: string,
  userPrompt: string,
): Promise<AIResponse> {
  const client = new GoogleGenerativeAI(apiKey);
  const geminiModel = client.getGenerativeModel({
    model,
    systemInstruction: buildSystemPrompt(pageTitle),
  });

  const response = await geminiModel.generateContent(
    buildUserPrompt(pageText, userPrompt),
  );

  const rawText = response.response.text();
  return parseAIResponse(rawText);
}
