import { WebSocket } from 'ws';
import fs from 'fs';

const WS_URL = process.argv[2] || 'ws://localhost:9222/devtools/page/398D4685E2951FA42530432850771128';
const OUTPUT_FILE = 'E:/AI-OPE~2/Packs/seo-strategy-pack/src/.openclaw/skills/seo-strategy/lab/bhw-crawl-page.html';

let ws;
let msgId = 1;

function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = msgId++;
    ws.send(JSON.stringify({ id, method, params }));
    const handler = (data) => {
      const msg = JSON.parse(data);
      if (msg.id === id) {
        ws.off('message', handler);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      }
    };
    ws.on('message', handler);
    setTimeout(() => reject(new Error('Timeout')), 60000);
  });
}

function extractBHWMarketplaceThreads(html) {
  const threads = [];
  // BHW Marketplace thread structure - XenForo structItem
  // Pattern matches thread rows with author, URL, title, and reply count
  const rowRegex = /<div[^>]*class="structItem[^>]*structItem--thread[^>]*"[^>]*data-author="([^"]+)"[^>]*>[\s\S]*?<a[^>]*href="\/(seo\/[^"]+)"[^>]*>([^<]+)<\/a>[\s\S]*?<dd[^>]*>(\d+)<\/dd>/gi;
  let match;
  while ((match = rowRegex.exec(html)) !== null) {
    // Filter out /unread suffix
    const url = `https://www.blackhatworld.com/${match[2]}`.replace(/\/unread$/, '');
    threads.push({
      author: match[1].trim(),
      url: url,
      title: match[3].trim(),
      replies: parseInt(match[4], 10)
    });
  }

  return threads;
}

async function crawlPage(url, label) {
  console.error(`Navigating to: ${url}`);
  await send('Page.navigate', { url });

  // Wait for page load
  await new Promise(resolve => setTimeout(resolve, 12000));

  const doc = await send('DOM.getDocument', { depth: -1 });
  const html = await send('DOM.getOuterHTML', { nodeId: doc.root.nodeId });
  const content = html.outerHTML;

  // Check for error page
  if (content.includes('data-template="error"')) {
    console.error(`Error page detected for ${url}`);
    return { threads: [], error: true };
  }

  // Save for debugging
  if (OUTPUT_FILE) {
    const safeLabel = label.replace(/[^a-z0-9-]/gi, '-').toLowerCase();
    fs.writeFileSync(OUTPUT_FILE.replace('.html', `-${safeLabel}.html`), content, 'utf8');
    console.error(`Saved HTML to: ${OUTPUT_FILE.replace('.html', `-${safeLabel}.html`)}`);
  }

  return { threads: extractBHWMarketplaceThreads(content), error: false };
}

async function main() {
  // Focus on SEO Link Building discussion forum (not marketplace) which is accessible
  const pages = [
    // SEO Link Building Discussion (forum id 43)
    { url: 'https://www.blackhatworld.com/forums/seo-link-building.43/page-2', section: 'SEO Link Building', page: 2 },
    { url: 'https://www.blackhatworld.com/forums/seo-link-building.43/page-3', section: 'SEO Link Building', page: 3 },
    { url: 'https://www.blackhatworld.com/forums/seo-link-building.43/page-4', section: 'SEO Link Building', page: 4 },
    { url: 'https://www.blackhatworld.com/forums/seo-link-building.43/page-5', section: 'SEO Link Building', page: 5 },
    // Link Building (forum id 44)
    { url: 'https://www.blackhatworld.com/forums/link-building.44/page-2', section: 'Link Building', page: 2 },
    { url: 'https://www.blackhatworld.com/forums/link-building.44/page-3', section: 'Link Building', page: 3 },
    { url: 'https://www.blackhatworld.com/forums/link-building.44/page-4', section: 'Link Building', page: 4 },
    { url: 'https://www.blackhatworld.com/forums/link-building.44/page-5', section: 'Link Building', page: 5 },
  ];

  ws = new WebSocket(WS_URL);

  await new Promise((resolve, reject) => {
    ws.on('open', resolve);
    ws.on('error', reject);
    setTimeout(() => reject(new Error('Connection timeout')), 10000);
  });

  console.error('Connected to CDP');

  const allThreads = [];

  for (const pageInfo of pages) {
    try {
      const result = await crawlPage(pageInfo.url, `${pageInfo.section.toLowerCase().replace(/ /g, '-')}-${pageInfo.page}`);

      if (result.error) {
        console.error(`Error loading ${pageInfo.url}`);
        continue;
      }

      const threads = result.threads;
      console.error(`Found ${threads.length} threads on ${pageInfo.section} page ${pageInfo.page}`);

      threads.forEach(t => {
        t.section = pageInfo.section;
        t.pageNum = pageInfo.page;
      });

      allThreads.push(...threads);

      // Output as JSON for processing
      console.log(JSON.stringify({ section: pageInfo.section, page: pageInfo.page, count: threads.length, threads }, null, 2));

      // Delay between pages
      await new Promise(resolve => setTimeout(resolve, 3000));
    } catch (err) {
      console.error(`Error on ${pageInfo.url}: ${err.message}`);
    }
  }

  // Save full results
  fs.writeFileSync('E:/AI-OPE~2/Packs/seo-strategy-pack/src/.openclaw/skills/seo-strategy/lab/bhw-crawl-results-v2.json', JSON.stringify(allThreads, null, 2), 'utf8');
  console.error(`Total threads: ${allThreads.length}`);
  console.error('Results saved to bhw-crawl-results-v2.json');

  ws.close();
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
