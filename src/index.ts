#!/usr/bin/env node
import { program } from "commander";
import { showBanner } from "./ui/banner.js";
import { configCommand } from "./commands/config.js";
import { scrapeCommand } from "./commands/scrape.js";
import { readConfig } from "./config.js";
import chalk from "chalk";

showBanner();

program
  .name("aigrep")
  .description("AI-powered web scraper for your terminal")
  .version("1.0.0");

program
  .command("config")
  .description("Configure your AI provider and API key")
  .action(configCommand);

program
  .command("scrape")
  .description("Scrape a website using a natural language prompt")
  .argument("<url>", "URL of the website to scrape")
  .argument("<prompt>", "What you want to extract in plain English")
  .option("-o, --output <format>", "Output format: table | json", "table")
  .option("-s, --save <filename>", "Save results to a file")
  .option("--max-chars <number>", "Max characters to send to AI", "15000")
  .action(async (url, prompt, options) => {
    const config = await readConfig();
    if (!config) {
      console.error(
        chalk.red('\n  ✗ No config found. Run "aigrep config" first.\n'),
      );
      process.exit(1);
    }
    await scrapeCommand(url, prompt, options, config);
  });

program.parse();
