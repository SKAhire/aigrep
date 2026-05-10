import { program } from "commander";
import { showBanner } from "./ui/banner.js";
import { configCommand } from "./commands/config.js";

showBanner();
program
  .name("aigrep")
  .description("AI-powered web scraper for your terminal")
  .version("1.0.0");

program
  .command("config")
  .description("Configure your AI provider and API key")
  .action(configCommand);

program.parse();
