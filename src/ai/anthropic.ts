import Anthropic from "@anthropic-ai/sdk";
import {
  AIResponse,
  buildSystemPrompt,
  buildUserPrompt,
  parseAIResponse,
} from "./index.js";

export async function runAnthropic(
  apiKey: string,
  model: string,
  pageText: string,
  pageTitle: string,
  userPrompt: string,
): Promise<AIResponse> {
  const client = new Anthropic({ apiKey });

  const response = await client.messages.create({
    model,
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: buildUserPrompt(pageText, userPrompt),
      },
    ],
    system: buildSystemPrompt(pageTitle),
  });

  const rawText = response.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("");

  return parseAIResponse(rawText);
}
