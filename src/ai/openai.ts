import OpenAI from "openai";
import {
  AIResponse,
  buildSystemPrompt,
  buildUserPrompt,
  parseAIResponse,
} from "./index.js";

export async function runOpenAI(
  apiKey: string,
  model: string,
  pageText: string,
  pageTitle: string,
  userPrompt: string,
): Promise<AIResponse> {
  const client = new OpenAI({ apiKey });

  const response = await client.chat.completions.create({
    model,
    max_tokens: 4096,
    messages: [
      {
        role: "system",
        content: buildSystemPrompt(pageTitle),
      },
      {
        role: "user",
        content: buildUserPrompt(pageText, userPrompt),
      },
    ],
  });

  const rawText = response.choices[0]?.message?.content || "";
  return parseAIResponse(rawText);
}
