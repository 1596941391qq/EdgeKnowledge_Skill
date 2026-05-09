import { WebSocket } from 'ws';
import fs from 'fs';

const WS_URL = process.argv[2] || 'ws://localhost:9222/devtools/page/DBF0F169A40327E9F128D87ED2F1A9E5';

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

async function main() {
  ws = new WebSocket(WS_URL);

  await new Promise((resolve, reject) => {
    ws.on('open', resolve);
    ws.on('error', reject);
    setTimeout(() => reject(new Error('Connection timeout')), 10000);
  });

  console.error('Connected to CDP');

  const categories = [
    { title: 'Search', url: 'https://www.buildersociety.com/forums/search.31/' },
    { title: 'Marketing', url: 'https://www.buildersociety.com/forums/marketing.32/' }
  ];

  const allThreads = [];

  for (const cat of categories) {
    console.error(`\nNavigating to: ${cat.url}`);
    await send('Page.navigate', { url: cat.url });
    await new Promise(r => setTimeout(r, 5000));

    const result = await send('Runtime.evaluate', {
      expression: `
        JSON.stringify(
          Array.from(document.querySelectorAll('.structItem--thread')).map(item => {
            const titleEl = item.querySelector('.structItem-title a');
            const authorEl = item.querySelector('.structItem-parts .username');
            const metaCell = item.querySelector('.structItem-cell--meta');
            const pairs = metaCell?.querySelectorAll('.pairs--justified dd') || [];
            const dateEl = item.querySelector('.structItem-startDate time');

            return {
              title: titleEl?.textContent?.trim() || '',
              url: titleEl?.href || '',
              author: authorEl?.textContent?.trim() || '',
              replies: pairs[0]?.textContent?.trim() || '0',
              views: pairs[1]?.textContent?.trim() || '0',
              date: dateEl?.getAttribute('datetime') || '',
              category: '${cat.title}'
            };
          }).filter(t => t.title)
        )
      `,
      returnByValue: true
    });

    const threads = JSON.parse(result.result?.value || '[]');
    console.error(`Found ${threads.length} threads in ${cat.title}`);
    threads.slice(0, 5).forEach(t => console.error(`  - [${t.replies} replies] ${t.title}`));
    allThreads.push(...threads);
  }

  console.error(`\nTotal: ${allThreads.length} threads`);
  fs.writeFileSync('./buildersociety-data/threads.json', JSON.stringify(allThreads, null, 2));

  // Generate markdown
  const date = new Date().toISOString().split('T')[0];
  let md = `# Builder Society SEO Content Scraping

**Scrape Date:** ${date}
**Source:** https://www.buildersociety.com/

## SEO-Related Forum Sections

- [Search](https://www.buildersociety.com/forums/search.31/) - Search engine optimization
- [Marketing](https://www.buildersociety.com/forums/marketing.32/) - Advertising and social media

## Threads (${allThreads.length} total)

`;

  const sorted = [...allThreads].sort((a, b) => {
    const aRep = parseInt(a.replies?.replace(/[^0-9]/g, '') || '0');
    const bRep = parseInt(b.replies?.replace(/[^0-9]/g, '') || '0');
    return bRep - aRep;
  });

  sorted.forEach(t => {
    md += `### [${t.title}](${t.url})
- **Author:** ${t.author}
- **Replies:** ${t.replies} | **Views:** ${t.views}
- **Category:** ${t.category}
- **Date:** ${t.date}

`;
  });

  md += `## Key SEO Topics

- Google Algorithm Updates (2024-2025)
- AI Overviews impact on traffic
- Link exchange and building strategies
- HCU (Helpful Content Update) recovery
- Site reputation abuse penalties
- Technical SEO (breadcrumbs, indexing, sitemaps)
- EMD (Exact Match Domain) strategies
`;

  fs.writeFileSync('Packs/seo-strategy-pack/src/.openclaw/skills/seo-strategy/lab/buildersociety-2026-q1.md', md);
  console.error('Generated markdown report');
  ws.close();
}

main().catch(e => console.error('Error:', e.message));
