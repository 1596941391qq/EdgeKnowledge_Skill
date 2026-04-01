# OpenCLI Bootstrap

This repository can now use OpenCLI as an additional browser control path alongside the existing browser-use and MCP routes.

## Prerequisites

1. Install and enable the Chrome extension named `Browser Bridge`
2. Ensure `npm` is available in PATH
3. Use PowerShell on Windows

## Entrypoints

```powershell
powershell -ExecutionPolicy Bypass -File scripts/setup-opencli.ps1
powershell -ExecutionPolicy Bypass -File scripts/test-opencli.ps1
powershell -ExecutionPolicy Bypass -File scripts/invoke-opencli.ps1 -RunDoctor google search "site:bestblackhatforum.com parasite seo" --limit 5 -f json
```

What they do:

- `scripts/setup-opencli.ps1` installs `@jackwener/opencli` globally, then runs `opencli doctor` and a browser-required smoke test
- `scripts/test-opencli.ps1` validates an existing installation without reinstalling
- `scripts/invoke-opencli.ps1` is the generic pass-through wrapper for real OpenCLI commands

## Phase Boundary

This phase adds setup, validation, and a generic invocation layer. It still does not replace existing browser-use, MCP, CAPTCHA, or Cloudflare bypass logic by default.
