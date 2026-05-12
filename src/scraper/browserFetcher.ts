import { chromium } from "playwright";
import chalk from "chalk";

const BLOCKED_PATTERNS = [
  "/login",
  "/signin",
  "/sign-in",
  "/auth",
  "/account/login",
  "/users/sign_in",
];

const AUTH_KEYWORDS = [
  "sign in to continue",
  "please log in",
  "you must be logged in",
  "login required",
  "authentication required",
];

export interface FetchResult {
  html: string;
  finalUrl: string;
  title: string;
}

export async function fetchPageWithBrowser(url: string): Promise<FetchResult> {
  try {
    new URL(url);
  } catch (error) {
    throw new Error(`Invalid URL: ${url}`);
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  });

  const page = await context.newPage();

  try {
    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });

    await page.waitForTimeout(3000);

    const finalUrl = page.url();

    const isBlockedUrl = BLOCKED_PATTERNS.some((pattern) =>
      finalUrl.toLowerCase().includes(pattern),
    );

    if (isBlockedUrl) {
      throw new Error(
        `This page requires authentication (redirected to ${finalUrl}). aigrep only works on public pages.`,
      );
    }

    const html = await page.content();
    const title = await page.title();

    const lowerHtml = html.toLowerCase();
    const isBlockedContent = AUTH_KEYWORDS.some((keyword) =>
      lowerHtml.includes(keyword),
    );

    if (isBlockedContent) {
      console.log(
        chalk.yellow(
          "\n  ⚠ Warning: This page may require authentication. Results might be incomplete.\n",
        ),
      );
    }

    return { html, finalUrl, title };
  } catch (err: any) {
    if (err.message.includes("timeout")) {
      throw new Error("Page timed out — site took too long to load.");
    }
    throw err;
  } finally {
    await browser.close();
  }
}
