import * as cheerio from "cheerio";

export interface ParseResult {
  text: string;
  characterCount: number;
}

const NOISE_SELECTOR = [
  "script",
  "style",
  "noscript",
  "iframe",
  "nav",
  "footer",
  "header",
  "aside",
  "advertisement",
  ".cookie-banner",
  ".popup",
  ".modal",
  "[aria-hidden='true']",
];

export function parsePage(html: string, maxChars: number = 15000): ParseResult {
  const $ = cheerio.load(html);

  NOISE_SELECTOR.forEach((selector) => {
    $(selector).remove();
  });

  const mainSelectors = [
    "main",
    "article",
    "#content",
    "#main",
    ".content",
    ".main",
    "body",
  ];

  let targetElement = null;

  for (const selector of mainSelectors) {
    if ($(selector).length > 0) {
      targetElement = $(selector);
      break;
    }
  }

  if (!targetElement) {
    targetElement = $("body");
  }

  // Extract and clean text
  let text = targetElement
    .text()
    .replace(/\t/g, " ") // tabs to spaces
    .replace(/\n{3,}/g, "\n\n") // max 2 consecutive newlines
    .replace(/[ ]{2,}/g, " ") // max 1 consecutive space
    .trim();

  // Truncate if too long
  if (text.length > maxChars) {
    text = text.slice(0, maxChars) + "\n\n[Content truncated...]";
  }

  return {
    text,
    characterCount: text.length,
  };
}
