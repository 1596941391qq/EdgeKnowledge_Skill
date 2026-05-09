import { WebSocket } from 'ws';
import fs from 'fs';

const WS_URL = process.argv[2];
const BASE_URL = process.argv[3];
const START_PAGE = parseInt(process.argv[4]) || 1;
const END_PAGE = parseInt(process.argv[5]) || 5;
const OUTPUT_FILE = process.argv[6];

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

function extractBBHFThreads(html) {
  const threads = [];
  // Match: href="Thread-..." then class="subject_old/new" then id="tid_xxx"
  // HTML order: href -> class -> id (based on actual BBHF structure)
  const regex = /<a[^>]*href="(Thread-[^"]+)"[^>]*class="[^"]*subject_(?:old|new)[^"]*"[^>]*id="tid_(\d+)"[^>]*>(?:<span[^>]*>)?([^<]+)</gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    threads.push({
      title: match[3].trim(),
      url: `https://bestblackhatforum.com/${match[1]}`,
      thread_id: match[2]
    });
  }
  return threads;
}

async function main() {
  ws = new WebSocket(WS_URL);

  await new Promise((resolve, reject) => {
    ws.on('open', resolve);
    ws.on('error', reject);
    setTimeout(() => reject(new Error('Connection timeout')), 10000);
  });

  console.error(`Connected to CDP`);
  let existingThreads = [];

  // Load existing data if output file exists (append mode)
  if (OUTPUT_FILE && fs.existsSync(OUTPUT_FILE)) {
    try {
      existingThreads = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'));
      console.error(`Loaded ${existingThreads.length} existing threads from ${OUTPUT_FILE}`);
    } catch (e) {
      console.error(`Failed to parse existing file, starting fresh: ${e.message}`);
      existingThreads = [];
    }
  }

  const allThreads = [...existingThreads];

  for (let page = START_PAGE; page <= END_PAGE; page++) {
    const url = page === 1 ? BASE_URL : `${BASE_URL}?page=${page}`;
    console.error(`Fetching page ${page}: ${url}`);

    try {
      await send('Page.navigate', { url });
      await new Promise(resolve => setTimeout(resolve, 10000));

      const doc = await send('DOM.getDocument', { depth: -1 });
      const html = await send('DOM.getOuterHTML', { nodeId: doc.root.nodeId });
      const content = html.outerHTML;

      const threads = extractBBHFThreads(content);
      console.error(`Found ${threads.length} threads on page ${page}`);
      allThreads.push(...threads);
    } catch (err) {
      console.error(`Error on page ${page}: ${err.message}`);
    }
  }

  // Remove duplicates
  const uniqueThreads = [...new Map(allThreads.map(t => [t.thread_id, t])).values()];

  if (OUTPUT_FILE) {
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(uniqueThreads, null, 2), 'utf8');
    console.error(`Saved ${uniqueThreads.length} unique threads to: ${OUTPUT_FILE}`);
  }

  console.log(JSON.stringify(uniqueThreads, null, 2));
  ws.close();
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
