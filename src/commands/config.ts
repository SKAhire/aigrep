import inquirer from "inquirer";
import chalk from "chalk";
import { saveConfig, readConfig, clearConfig, Provider } from "../config.js";

export async function configCommand(): Promise<void> {
  const existing = await readConfig();

  if (existing) {
    console.log(chalk.yellow("\n  ⚠ Existing config found:"));
    console.log(chalk.gray(`  Provider : ${existing.provider}`));
    console.log(chalk.gray(`  Model    : ${existing.model}\n`));

    const { overwrite } = await inquirer.prompt([
      {
        type: "confirm",
        name: "overwrite",
        message: "Do you want to update the existing config?",
        default: false,
      },
    ]);

    if (!overwrite) {
      console.log(chalk.gray("\n  No changes made. \n"));
      return;
    }

    await clearConfig();
    console.log(chalk.gray("  Old config cleared.\n"));
  }

  const { provider } = await inquirer.prompt([
    {
      type: "list",
      name: "provider",
      message: "Select your ai provider:",
      choices: [
        { name: "Anthropic", value: "anthropic" },
        { name: "OpenAI", value: "openai" },
        { name: "Gemini", value: "gemini" },
        { name: "Groq", value: "groq" },
      ],
    },
  ]);

  const { apiKey } = await inquirer.prompt([
    {
      type: "password",
      name: "apiKey",
      message: `Enter your ${provider} API key:`,
      mask: "*",
      validate: (input: string) => {
        if (!input || input.trim() === "") return "API key cannot be empty";
        return true;
      },
    },
  ]);

  const { model } = await inquirer.prompt([
    {
      type: "input",
      name: "model",
      message: `Enter the model name you want to use:`,
      validate: (input: string) => {
        if (!input || input.trim() === "") return "Model name cannot be empty";
        return true;
      },
    },
  ]);

  await saveConfig({ provider: provider as Provider, model, apiKey });

  console.log(
    chalk.green("\n  ✓ Config saved securely to your OS keychain!\n"),
  );
}
