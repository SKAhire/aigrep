import chalk from "chalk";
import { writeFileSync } from "fs";
import { AIResponse } from "../ai/index.js";

export function renderJson(response: AIResponse, saveFile?: string): void {
  const output = JSON.stringify(response, null, 2);

  console.log("\n" + chalk.green(output) + "\n");
  console.log(chalk.gray(`  ${response.summary}`));
  console.log(chalk.gray(`  ${response.results.length} result(s) found\n`));

  if (saveFile) {
    writeFileSync(saveFile, output, "utf-8");
    console.log(chalk.green(`  ✓ Saved to ${saveFile}\n`));
  }
}
