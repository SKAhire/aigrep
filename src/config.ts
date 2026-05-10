import keytar from "keytar";

const SERVICE = "aigrep";

export type Provider = "anthropic" | "openai" | "gemini" | "groq";

export interface Config {
  provider: Provider;
  model: string;
  apiKey: string;
}

export async function saveConfig(config: Config): Promise<void> {
  await keytar.setPassword(SERVICE, "provider", config.provider);
  await keytar.setPassword(SERVICE, "model", config.model);
  await keytar.setPassword(SERVICE, "apiKey", config.apiKey);
}

export async function readConfig(): Promise<Config | null> {
  const provider = await keytar.getPassword(SERVICE, "provider");
  const model = await keytar.getPassword(SERVICE, "model");

  if (!provider || !model) return null;

  const apiKey = await keytar.getPassword(SERVICE, "apiKey");
  if (!apiKey) return null;

  return {
    provider: provider as Provider,
    model,
    apiKey,
  };
}

export async function clearConfig(): Promise<void> {
  await keytar.deletePassword(SERVICE, "provider");
  await keytar.deletePassword(SERVICE, "model");
  await keytar.deletePassword(SERVICE, "apiKey");
}
