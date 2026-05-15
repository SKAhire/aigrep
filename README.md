# aigrep 🤖

> AI-powered web scraper for your terminal. Give it a URL and a plain English prompt — it does the rest.

![version](https://img.shields.io/badge/version-1.0.0-blue)
![node](https://img.shields.io/badge/node-%3E%3D18.0.0-green)
![license](https://img.shields.io/badge/license-MIT-yellow)

---

## What is aigrep?

`aigrep` lets you scrape any public webpage using natural language. No CSS selectors, no XPath, no code — just tell it what you want.

```bash
aigrep scrape "https://news.ycombinator.com" "get me all post titles and their links"
```

It fetches the page, cleans the HTML, sends it to your chosen AI model, and returns structured results as a table or JSON.

---

## How it works

![aigrep flow diagram](./flow.svg)

---

## Supported AI Providers

| Provider  | Models                                                         |
| --------- | -------------------------------------------------------------- |
| Anthropic | claude-opus-4-5, claude-sonnet-4-5, claude-haiku-4-5, and more |
| OpenAI    | gpt-4o, gpt-4o-mini, gpt-4-turbo, and more                     |
| Gemini    | gemini-2.5-flash, gemini-1.5-pro, and more                     |
| Groq      | llama-3.1-70b-versatile, mixtral-8x7b-32768, and more          |

You bring your own API key. aigrep never stores keys in plaintext — they are saved securely in your **OS keychain** (macOS Keychain, Windows Credential Manager, Linux libsecret).

---

## Requirements

- Node.js v18 or higher
- An API key from any supported provider
- A public URL to scrape (pages behind login are not supported)

---

## Installation

```bash
npm install -g aigrep
```

Verify the install:

```bash
aigrep --version
```

### Windows users

If `aigrep` is not recognized after install, add npm's global bin folder to your PATH:

1. Run `npm config get prefix` to find the path
2. Open **Environment Variables** from the Start menu
3. Under **User variables**, edit **Path** and add the path from step 1
4. Restart your terminal

---

## Setup

Run the config wizard once before using aigrep:

```bash
aigrep config
```

You will be asked to:

1. Select your AI provider
2. Enter your API key
3. Enter the model name you want to use

Your API key is saved securely to your OS keychain — never written to a file.

To update your config at any time, just run `aigrep config` again.

---

## Usage

### Basic scrape

```bash
aigrep scrape <url> "<prompt>"
```

### Examples

**Get news headlines:**

```bash
aigrep scrape "https://news.ycombinator.com" "get me all post titles and their links"
```

**Get job listings:**

```bash
aigrep scrape "https://weworkremotely.com" "get me all senior developer job listings with company name and location"
```

**Get quotes:**

```bash
aigrep scrape "https://quotes.toscrape.com" "get me all quotes and their authors"
```

**Scrape a JS-rendered site:**

```bash
aigrep scrape "https://github.com/trending" "get me all trending repos and their descriptions" --browser
```

**JSON output:**

```bash
aigrep scrape "https://news.ycombinator.com" "get me all post titles" -o json
```

**Save results to a file:**

```bash
aigrep scrape "https://news.ycombinator.com" "get me all post titles" -o json -s results.json
```

**Limit content size sent to AI:**

```bash
aigrep scrape "https://news.ycombinator.com" "get me all post titles" --max-chars 8000
```

---

## Options

| Option                  | Description                               | Default |
| ----------------------- | ----------------------------------------- | ------- |
| `-o, --output <format>` | Output format: `table` or `json`          | `table` |
| `-s, --save <filename>` | Save results to a file                    | —       |
| `--browser`             | Use Playwright for JS-rendered pages      | false   |
| `--max-chars <number>`  | Max characters of page content sent to AI | `15000` |

---

## Commands

| Command                          | Description                                   |
| -------------------------------- | --------------------------------------------- |
| `aigrep config`                  | Set up or update your AI provider and API key |
| `aigrep scrape <url> "<prompt>"` | Scrape a page with a natural language prompt  |
| `aigrep --version`               | Show the current version                      |
| `aigrep --help`                  | Show help                                     |

---

## Limitations

- **No auth support** — aigrep only works on public pages. Pages that redirect to a login screen are blocked automatically.
- **Bot protection** — Some sites use Cloudflare or similar protection that blocks scrapers even with `--browser`. aigrep cannot bypass these.
- **Static pages by default** — JavaScript-rendered content requires the `--browser` flag.
- **Token limits** — Very large pages are truncated to `--max-chars` before being sent to the AI. Adjust this if results seem incomplete.

---

## Security

API keys are stored using your operating system's native credential store via [keytar](https://github.com/atom/node-keytar):

- **macOS** → Keychain Access
- **Windows** → Credential Manager
- **Linux** → libsecret / GNOME Keyring

Keys are never written to disk in plaintext.

---

## Roadmap

- [x] Static page scraping via axios
- [x] JS-rendered pages via Playwright (`--browser`)
- [x] Anthropic, OpenAI, Gemini, Groq support
- [x] Table + JSON output
- [ ] Multi-page / pagination scraping
- [ ] Interactive mode — chat with a webpage
- [ ] Ollama (local models) expanded support

---

## License

MIT © 2026 aigrep

---

## Contributing

PRs and issues welcome. Please open an issue before submitting large changes.
