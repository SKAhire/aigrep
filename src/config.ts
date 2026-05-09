import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { homedir } from "os";
import { join } from "path";

const CONFIG_DIR = join(homedir(), "./aigrep");
const CONFIG_FILE = join(CONFIG_DIR, "config.json");

export interface Config {
  provider: "anthropic" | "openai" | "gemini" | "groq";
  apiKey: string;
  model: string;
}

export function readConfig(): Config | null {
  if (!existsSync(CONFIG_FILE)) return null;
  const raw = readFileSync(CONFIG_FILE, "utf-8");
  return JSON.parse(raw) as Config;
}

export function writeConfig(config: Config): void {
  if (!existsSync(CONFIG_FILE)) {
    mkdirSync(CONFIG_DIR, { recursive: true });
  }

  writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
}
