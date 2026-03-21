# Cloudflare Turnstile Bypass

A lightweight Node.js tool that automates retrieving Cloudflare Turnstile tokens using [Patchright](https://www.npmjs.com/package/patchright).
**Use responsibly — only on websites you own or have explicit permission to test.**

---

## ✨ Features

* 🚀 Launches a Chromium browser through Patchright
* 🔍 Detects and renders Cloudflare Turnstile challenges
* 🎟️ Retrieves valid Turnstile tokens automatically
* ⚙️ Fully configurable via environment variables

---

## 📦 Requirements

* **Node.js ≥ 20**
* **pnpm**, npm, or yarn
* **Chromium browser** installed on your system

---

## 🛠️ Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/jobians/cloudflare-turnstile-bypass.git
cd cloudflare-turnstile-bypass
pnpm install
```

---

## 🔧 Environment Variables

Create a `.env` file:

```env
TARGET_URL=https://example.com
CHROMIUM_PATH=/path/to/chromium
TURNSTILE_SITEKEY=your_turnstile_site_key
```

Explanation:

* **TARGET_URL** — page that includes Turnstile
* **CHROMIUM_PATH** — path to your Chromium/Chrome executable
* **TURNSTILE_SITEKEY** — Turnstile sitekey used by the page

---

## ▶️ Usage

Start the script:

```bash
pnpm start
```

Example output:

```
Launching Chromium browser...
Navigating to TARGET_URL...
Turnstile loaded successfully.
Turnstile token obtained: <token_here>
Closing browser...
Done.
```

---

## ⚠️ Security & Ethical Notice

This project is for **testing**, **research**, and **automation** on systems you are authorized to interact with.
Bypassing or automating security mechanisms on systems *without permission* is **illegal** and **unethical**.

---

## 💖 Support the Project

If you find this tool helpful and want to support development:

👉 **[Donate via crypto](https://cwallet.com/t/TE6A6KMV)**

Thank you for supporting open-source work! 🙏

---

## 📜 License

MIT License © 2025
Created by **[JOBIANSTECHIE](https://github.com/jobians)**