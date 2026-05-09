import { program } from "commander";
import { showBanner } from "./ui/banner";

showBanner();
program
  .name("aigrep")
  .description("AI-powered web scraper for your terminal")
  .version("1.0.0");

program.parse();
