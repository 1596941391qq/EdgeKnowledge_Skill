import { WebSocket } from 'ws';
import fs from 'fs';

const WS_URL = process.argv[2];
const TARGET_URL = process.argv[3];
const OUTPUT_FILE = process.argv[4];

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
    setTimeout(() => reject(new Error('Timeout')), 90000);
  });
}

async function main() {
  ws = new WebSocket(WS_URL);

  await new Promise((resolve, reject) => {
    ws.on('open', resolve);
    ws.on('error', reject);
    setTimeout(() => reject(new Error('Connection timeout')), 10000);
  });

  console.error(`Connected to CDP`);
  console.error(`Navigating to: ${TARGET_URL}`);

  await send('Page.navigate', { url: TARGET_URL });
  await new Promise(resolve => setTimeout(resolve, 10000));

  // Get page content
  const doc = await send('DOM.getDocument', { depth: -1 });
  const html = await send('DOM.getOuterHTML', { nodeId: doc.root.nodeId });

  if (OUTPUT_FILE) {
    fs.writeFileSync(OUTPUT_FILE, html.outerHTML, 'utf8');
    console.error(`Saved HTML to: ${OUTPUT_FILE}`);
  }

  // Extract thread data - BBHF MyBB structure
  const result = await send('Runtime.evaluate', {
    expression: `
      JSON.stringify(
        Array.from(document.querySelectorAll('tr.forumdisplay_regular')).map(row => {
          const linkEl = row.querySelector('a.subject_old, a.subject_new');
          const spanEl = linkEl?.querySelector('span');
          const repliesEl = row.querySelectorAll('td')[3];
          const viewsEl = row.querySelectorAll('td')[4];
          const lastPostEl = row.querySelectorAll('td')[5];

          return {
            title: spanEl?.textContent?.trim() || linkEl?.textContent?.trim() || '',
            url: linkEl?.href || '',
            thread_id: linkEl?.id?.replace('tid_', '') || '',
            replies: repliesEl?.textContent?.trim() || '',
            views: viewsEl?.textContent?.trim() || '',
            last_post: lastPostEl?.textContent?.trim() || ''
          };
        }).filter(t => t.title && t.url)
      )
    `,
    returnByValue: true
  });

  if (result.result && result.result.value) {
    console.log(result.result.value);
  } else {
    console.log('[]');
  }

  ws.close();
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
