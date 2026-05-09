import { WebSocket } from 'ws';
import fs from 'fs';

const WS_URL = process.argv[2] || 'ws://localhost:9222/devtools/page/9DD5762483389599C323F97858C24D16';
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

function extractBHWThreads(html) {
  const threads = [];
  // BHW XenForo structure - marketplace threads
  // Pattern: <div class="structItem structItem--thread..."><div class="structItem-title">...<a href="/seo/..." class="" data-tp-primary="on">Title</a>
  const rowRegex = /<div[^>]*class="structItem[^>]*structItem--thread[^>]*"[^>]*data-author="([^"]+)"[^>]*>[\s\S]*?<a[^>]*href="\/(seo\/[^"]+)"[^>]*class="[^"]*"[^>]*data-tp-primary[^>]*>([^<]+)<\/a>[\s\S]*?<dl[^>]*class="pairs pairs--justified structItem-minor"[^>]*>[\s\S]*?<dd>(\d+)<\/dd>/gi;
  let match;
  while ((match = rowRegex.exec(html)) !== null) {
    threads.push({
      author: match[1].trim(),
      url: `https://www.blackhatworld.com/${match[2]}`,
      title: match[3].trim(),
      replies: parseInt(match[4], 10)
    });
  }

  // Fallback: simpler regex if above fails
  if (threads.length === 0) {
    const simpleRegex = /<a[^>]*href="\/(seo\/[^"]+)"[^>]*>([^<]{10,})<\/a>/gi;
    while ((match = simpleRegex.exec(html)) !== null) {
      if (!match[1].includes('/unread')) {
        threads.push({
          url: `https://www.blackhatworld.com/${match[1]}`,
          title: match[2].trim()
        });
      }
    }
  }

  return threads;
}

async function crawlPage(url, pageNum) {
  console.error(`Navigating to: ${url}`);
  await send('Page.navigate', { url });

  // Wait for page load
  await new Promise(resolve => setTimeout(resolve, 15000));

  const doc = await send('DOM.getDocument', { depth: -1 });
  const html = await send('DOM.getOuterHTML', { nodeId: doc.root.nodeId });
  const content = html.outerHTML;

  // Save for debugging
  if (OUTPUT_FILE) {
    fs.writeFileSync(OUTPUT_FILE.replace('.html', `-p${pageNum}.html`), content, 'utf8');
    console.error(`Saved HTML to: ${OUTPUT_FILE.replace('.html', `-p${pageNum}.html`)}`);
  }

  return extractBHWThreads(content);
}

async function main() {
  const pages = [
    // SEO Link Building
    { url: 'https://www.blackhatworld.com/forums/seo-link-building.74/page-2', section: 'SEO Link Building', page: 2 },
    { url: 'https://www.blackhatworld.com/forums/seo-link-building.74/page-3', section: 'SEO Link Building', page: 3 },
    { url: 'https://www.blackhatworld.com/forums/seo-link-building.74/page-4', section: 'SEO Link Building', page: 4 },
    { url: 'https://www.blackhatworld.com/forums/seo-link-building.74/page-5', section: 'SEO Link Building', page: 5 },
    // SEO Packages
    { url: 'https://www.blackhatworld.com/forums/seo-packages.93/page-2', section: 'SEO Packages', page: 2 },
    { url: 'https://www.blackhatworld.com/forums/seo-packages.93/page-3', section: 'SEO Packages', page: 3 },
    { url: 'https://www.blackhatworld.com/forums/seo-packages.93/page-4', section: 'SEO Packages', page: 4 },
    { url: 'https://www.blackhatworld.com/forums/seo-packages.93/page-5', section: 'SEO Packages', page: 5 },
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
      const threads = await crawlPage(pageInfo.url, `${pageInfo.section.toLowerCase().replace(/ /g, '-')}-${pageInfo.page}`);
      console.error(`Found ${threads.length} threads on ${pageInfo.section} page ${pageInfo.page}`);

      threads.forEach(t => {
        t.section = pageInfo.section;
        t.pageNum = pageInfo.page;
      });

      allThreads.push(...threads);

      // Output as JSON for processing
      console.log(JSON.stringify({ section: pageInfo.section, page: pageInfo.page, threads }, null, 2));

      // Delay between pages
      await new Promise(resolve => setTimeout(resolve, 3000));
    } catch (err) {
      console.error(`Error on ${pageInfo.url}: ${err.message}`);
    }
  }

  // Save full results
  fs.writeFileSync('E:/AI-OPE~2/Packs/seo-strategy-pack/src/.openclaw/skills/seo-strategy/lab/bhw-crawl-results.json', JSON.stringify(allThreads, null, 2), 'utf8');
  console.error(`Total threads: ${allThreads.length}`);
  console.error('Results saved to bhw-crawl-results.json');

  ws.close();
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
