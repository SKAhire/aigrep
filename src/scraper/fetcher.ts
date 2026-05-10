import axios from "axios";
import chalk from "chalk";

const BLOCK_PATTERNS = [
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

export async function fetchPage(url: string): Promise<FetchResult> {
  try {
    new URL(url);
  } catch (error) {
    throw new Error(`Invalid URL: ${url}`);
  }

  let response;

  try {
    response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
      maxRedirects: 5,
      timeout: 15000,
    });
  } catch (err: any) {
    if (err.code === "ECONNREFUSED")
      throw new Error("Connection refused — is the URL correct?");
    if (err.code === "ETIMEDOUT")
      throw new Error("Request timed out — site took too long to respond.");
    if (err.response?.status === 403)
      throw new Error("403 Forbidden — site is blocking scrapers.");
    if (err.response?.status === 404)
      throw new Error("404 Not Found — page does not exist.");
    throw new Error(`Failed to fetch page: ${err.message}`);
  }

  const finalUrl: string = response.request?.res?.responseUrl || url;
  const html: string = response.data;

  const isBlockedUrl = BLOCK_PATTERNS.some((pattern) =>
    finalUrl.toLocaleLowerCase().includes(pattern),
  );

  if (isBlockedUrl) {
    throw new Error(
      `This page requires authentication (redirected to ${finalUrl}). aigrep only works on public pages.`,
    );
  }

  const isBlockedContent = AUTH_KEYWORDS.some((keyword) =>
    html.toLocaleLowerCase().includes(keyword),
  );

  if (isBlockedContent) {
    console.log(
      chalk.yellow(
        "\n  ⚠ Warning: This page may require authentication. Results might be incomplete.\n",
      ),
    );
  }

  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : "Unknown Page";

  return { html, finalUrl, title };
}
