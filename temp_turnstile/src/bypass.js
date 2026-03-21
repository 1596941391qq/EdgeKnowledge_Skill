import 'dotenv/config';
import { chromium } from 'patchright';

const TARGET_URL = process.env.TARGET_URL;
const BROWSER_PATH = process.env.CHROMIUM_PATH;
const TURNSTILE_SITEKEY = process.env.TURNSTILE_SITEKEY;

if (!BROWSER_PATH || !TARGET_URL || !TURNSTILE_SITEKEY) {
  throw new Error('Missing environment variables: BROWSER_PATH, TARGET_URL, or TURNSTILE_SITEKEY');
}

console.log('Launching browser...');

const browser = await chromium.launch({
  headless: false,
  executablePath: BROWSER_PATH
});

const context = await browser.newContext();
const page = await context.newPage();

console.log('Navigating to:', TARGET_URL);
await page.goto(TARGET_URL, { waitUntil: 'networkidle' });

console.log('Waiting for Turnstile script...');
try {
  await page.waitForFunction(
    () => window.turnstile && typeof window.turnstile.render === 'function'
  );
} catch {
  throw new Error(
    'Timed out waiting for Turnstile to load. Make sure the website includes the Cloudflare Turnstile script (https://challenges.cloudflare.com/turnstile/v0/api.js)'
  );
}

console.log('Executing Turnstile function...');
const handle = await page.waitForFunction((sitekey) => {
  return new Promise((resolve, reject) => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    try {
      const widgetId = window.turnstile.render(div, {
        sitekey,
        callback: resolve,
        'error-callback': reject
      });
      window.turnstile.execute(widgetId);
    } catch (err) {
      reject(err);
    }
  });
}, TURNSTILE_SITEKEY);

console.log('Retrieving token...');
const token = await handle.jsonValue();
console.log('Turnstile token:', token);

console.log('Closing browser...');
await browser.close();