import chalk from "chalk";
import ora from "ora";
import { fetchPage } from "../scraper/fetcher.js";
import { parsePage } from "../scraper/parser.js";
import { runAI } from "../ai/index.js";
import { renderTable } from "../output/table.js";
import { renderJson } from "../output/json.js";
import { Config } from "../config.js";

export interface ScrapeOptions {
  output: "table" | "json";
  save?: string;
  maxChars: string;
}

export async function scrapeCommand(
  url: string,
  prompt: string,
  options: ScrapeOptions,
  config: Config,
): Promise<void> {
  console.log(chalk.cyan(`\n  Target : ${url}`));
  console.log(chalk.cyan(`  Prompt : ${prompt}`));
  console.log(chalk.cyan(`  Model  : ${config.provider} / ${config.model}\n`));

  const fetchSpinner = ora("  Fetching page...").start();

  let fetchResult;

  try {
    fetchResult = await fetchPage(url);
    fetchSpinner.succeed(chalk.green(`  Fetched: ${fetchResult.title}`));
  } catch (error: any) {
    fetchSpinner.fail(chalk.red(`  ${error.message}`));
    process.exit(1);
  }

  const parseSpinner = ora("  Parsing content...").start();
  let parseResult;

  try {
    parseResult = parsePage(fetchResult.html, parseInt(options.maxChars));
    parseSpinner.succeed(
      chalk.green(
        `  Parsed ${parseResult.characterCount.toLocaleString()} characters`,
      ),
    );
  } catch (err: any) {
    parseSpinner.fail(chalk.red(`  Failed to parse page: ${err.message}`));
    process.exit(1);
  }

  const aiSpinner = ora(`  Sending to ${config.provider}...`).start();
  let aiResponse;

  try {
    aiResponse = await runAI(
      config,
      parseResult.text,
      fetchResult.title,
      prompt,
    );
    aiSpinner.succeed(chalk.green(`  AI extraction complete`));
  } catch (err: any) {
    aiSpinner.fail(chalk.red(`  AI error: ${err.message}`));
    process.exit(1);
  }

  console.log(chalk.cyan("\n  ─────────────────────────────────────────\n"));

  if (options.output === "json") {
    renderJson(aiResponse, options.save);
  } else {
    renderTable(aiResponse);

    if (options.save) {
      const { writeFileSync } = await import("fs");
      writeFileSync(options.save, JSON.stringify(aiResponse, null, 2), "utf-8");
      console.log(chalk.green(`  ✓ Saved to ${options.save}\n`));
    }
  }
}
