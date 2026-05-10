import Table from "cli-table3";
import chalk from "chalk";
import { AIResponse } from "../ai/index.js";

export function renderTable(response: AIResponse): void {
  if (response.results.length === 0) {
    console.log(chalk.yellow("\n  No results found.\n"));
    return;
  }
  const headers = Object.keys(response.results[0]);

  const table = new Table({
    head: headers.map((h) => chalk.cyan(h)),
    style: {
      head: [],
      border: ["gray"],
    },
    wordWrap: true,
    colWidths: headers.map(() => Math.floor(80 / headers.length)),
  });

  response.results.forEach((row) => {
    table.push(headers.map((h) => row[h] ?? ""));
  });

  console.log("\n" + table.toString());
  console.log(chalk.gray(`\n  ${response.summary}`));
  console.log(chalk.gray(`  ${response.results.length} result(s) found\n`));
}
