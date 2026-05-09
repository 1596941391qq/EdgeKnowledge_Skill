import { WebSocket } from 'ws';
import fs from 'fs';

const WS_URL = process.argv[2] || 'ws://localhost:9222/devtools/page/DBF0F169A40327E9F128D87ED2F1A9E5';
const OUTPUT_DIR = process.argv[3] || './buildersociety-data';

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

async function getPageHTML() {
  const doc = await send('DOM.getDocument', { depth: -1 });
  const html = await send('DOM.getOuterHTML', { nodeId: doc.root.nodeId });
  return html.outerHTML;
}

async function navigateTo(url) {
  console.error(`Navigating to: ${url}`);
  await send('Page.navigate', { url });
  await new Promise(resolve => setTimeout(resolve, 5000));
}

async function evaluateJS(expression) {
  const result = await send('Runtime.evaluate', {
    expression,
    returnByValue: true
  });
  return result.result?.value;
}

async function main() {
  ws = new WebSocket(WS_URL);

  await new Promise((resolve, reject) => {
    ws.on('open', resolve);
    ws.on('error', reject);
    setTimeout(() => reject(new Error('Connection timeout')), 10000);
  });

  console.error('Connected to Builder Society CDP');

  // Create output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Step 1: Get forum categories from homepage
  console.error('\n=== Step 1: Analyzing forum structure ===');
  const categories = await evaluateJS(`
    JSON.stringify(
      Array.from(document.querySelectorAll('.node--forum, .block-container .node')).map(node => {
        const titleEl = node.querySelector('.node-title a, h3 a');
        const descEl = node.querySelector('.node-description, .node-desc');
        const link = titleEl?.href || '';
        return {
          title: titleEl?.textContent?.trim() || '',
          url: link,
          description: descEl?.textContent?.trim() || ''
        };
      }).filter(c => c.title)
    )
  `);

  const categoryList = JSON.parse(categories || '[]');
  console.error(`Found ${categoryList.length} forum sections`);

  // SEO-related keywords
  const seoKeywords = ['seo', 'search', 'link', 'content', 'marketing', 'traffic', 'rank', 'google', 'optimization', 'technical'];

  const seoCategories = categoryList.filter(cat => {
    const text = (cat.title + ' ' + cat.description).toLowerCase();
    return seoKeywords.some(kw => text.includes(kw));
  });

  console.error(`\nSEO-related sections found: ${seoCategories.length}`);
  seoCategories.forEach(c => console.error(`  - ${c.title}: ${c.url}`));

  // Save categories
  fs.writeFileSync(`${OUTPUT_DIR}/categories.json`, JSON.stringify(categoryList, null, 2));

  // Step 2: Scrape SEO sections
  const allThreads = [];

  for (const cat of seoCategories) {
    if (!cat.url) continue;

    console.error(`\n=== Scraping: ${cat.title} ===`);
    await navigateTo(cat.url);

    // Wait extra for XenForo
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Extract threads using XenForo structure (Builder Society variant)
    const threads = await evaluateJS(`
      JSON.stringify(
        Array.from(document.querySelectorAll('.structItem--thread')).map(item => {
          const titleEl = item.querySelector('.structItem-title a');
          const authorEl = item.querySelector('.structItem-parts .username');
          const metaCell = item.querySelector('.structItem-cell--meta');
          const pairs = metaCell?.querySelectorAll('.pairs--justified dd') || [];
          const dateEl = item.querySelector('.structItem-startDate time');
          const prefixEl = item.querySelector('.label-prefix, .prefix');

          return {
            title: titleEl?.textContent?.trim() || '',
            url: titleEl?.href || '',
            author: authorEl?.textContent?.trim() || '',
            replies: pairs[0]?.textContent?.trim() || '0',
            views: pairs[1]?.textContent?.trim() || '0',
            date: dateEl?.getAttribute('datetime') || dateEl?.textContent?.trim() || '',
            prefix: prefixEl?.textContent?.trim() || '',
            category: '${cat.title.replace(/'/g, "\\'")}'
          };
        }).filter(t => t.title)
      )
    `);

    const threadList = JSON.parse(threads || '[]');
    console.error(`  Found ${threadList.length} threads`);

    threadList.forEach(t => {
      console.error(`    - [${t.replies} replies] ${t.title}`);
    });

    allThreads.push(...threadList);

    // Small delay between pages
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Step 3: If no SEO categories found, try homepage popular threads
  if (allThreads.length === 0) {
    console.error('\n=== Trying homepage for popular threads ===');
    await navigateTo('https://www.buildersociety.com/');

    const homeThreads = await evaluateJS(`
      JSON.stringify(
        Array.from(document.querySelectorAll('.structItem--thread')).map(item => {
          const titleEl = item.querySelector('.structItem-title a');
          const authorEl = item.querySelector('.structItem-parts .username');
          const metaCell = item.querySelector('.structItem-cell--meta');
          const pairs = metaCell?.querySelectorAll('.pairs--justified dd') || [];
          const dateEl = item.querySelector('.structItem-startDate time');
          const prefixEl = item.querySelector('.label-prefix, .prefix');

          return {
            title: titleEl?.textContent?.trim() || '',
            url: titleEl?.href || '',
            author: authorEl?.textContent?.trim() || '',
            replies: pairs[0]?.textContent?.trim() || '0',
            views: pairs[1]?.textContent?.trim() || '0',
            date: dateEl?.getAttribute('datetime') || dateEl?.textContent?.trim() || '',
            prefix: prefixEl?.textContent?.trim() || ''
          };
        }).filter(t => t.title)
      )
    `);

    const threadList = JSON.parse(homeThreads || '[]');
    console.error(`Found ${threadList.length} threads on homepage`);
    allThreads.push(...threadList);
  }

  // Save results
  fs.writeFileSync(`${OUTPUT_DIR}/threads.json`, JSON.stringify(allThreads, null, 2));
  console.error(`\n=== Saved ${allThreads.length} threads to ${OUTPUT_DIR}/threads.json ===`);

  // Generate markdown report
  const mdContent = generateMarkdown(allThreads, seoCategories);
  const mdPath = 'Packs/seo-strategy-pack/src/.openclaw/skills/seo-strategy/lab/buildersociety-2026-q1.md';
  fs.writeFileSync(mdPath, mdContent);
  console.error(`Generated: ${mdPath}`);

  ws.close();
}

function generateMarkdown(threads, categories) {
  const date = new Date().toISOString().split('T')[0];

  let md = `# Builder Society SEO Content Scraping

**Scrape Date:** ${date}
**Source:** https://www.buildersociety.com/

## SEO-Related Forum Sections

`;

  if (categories.length > 0) {
    categories.forEach(c => {
      md += `- [${c.title}](${c.url}) - ${c.description}\n`;
    });
  } else {
    md += `_No explicit SEO sections found; showing popular threads._\n`;
  }

  md += `\n## Threads (${threads.length} total)\n\n`;

  // Sort by replies
  const sorted = [...threads].sort((a, b) => {
    const aRep = parseInt(a.replies?.replace(/[^0-9]/g, '') || '0');
    const bRep = parseInt(b.replies?.replace(/[^0-9]/g, '') || '0');
    return bRep - aRep;
  });

  sorted.forEach(t => {
    md += `### [${t.title}](${t.url})\n`;
    md += `- **Author:** ${t.author}\n`;
    md += `- **Replies:** ${t.replies} | **Views:** ${t.views}\n`;
    if (t.prefix) md += `- **Prefix:** ${t.prefix}\n`;
    if (t.category) md += `- **Category:** ${t.category}\n`;
    if (t.date) md += `- **Date:** ${t.date}\n`;
    md += `\n`;
  });

  md += `## Key SEO Topics Found\n\n`;
  md += `_Analyze threads for link building, content marketing, and technical SEO patterns._\n`;

  return md;
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
