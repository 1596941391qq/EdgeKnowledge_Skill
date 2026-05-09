import { WebSocket } from 'ws';
import fs from 'fs';

const WS_URL = 'ws://localhost:9223/devtools/page/C2D73F44676CB1361667F65B1AD862CD';

const THREADS = [
  'mix-seo-backlinks-do-follow-high-quality-backlink-manually-link-building-casino-gambling-adult-dating-all-niche-accept-flat-3.1771878',
  'ultra-boost-premium-links-for-any-niche-specialy-poker-casino-betting-judi-toto-thai-korean-indo-sites.1617971',
  'crowdo-links-still-da-best-in-2025-trusted-by-hundreds-of-bhw-members-up-to-92-da-sites-with-real-traffic-from-6-link-20-off.1062927',
  'high-authority-pbn-sidebars-da50-dr25-avg-long-term-network-aged-10-20-years-strong-indexing-stability-starting-3-link-flat-40.1772846',
  '20-off-get-id-casino-sidebar-pbn-backlinks-rank-your-casino-and-gambling-website-with-our-high-da-sidebar-backlinks.1632470',
  'casino-seo-boost-your-casino-site-with-powerful-pbn-sitewide-sidebar-backlinks-rank-fast.1712084',
  'premium-casino-guest-post-high-da-dr-super-fast-indexing-super-guest-posts-traffic-2k-sites-do-follow-links.1742485',
  'ranking-guaranteed-with-one-seller-strategy-real-authority-gnews-guest-posts-da80-dr80-200k-real-traffic-from-29-9-flat-60-off.1759270',
  'edu-links-formula-guest-posting-mix-links-mega-authority-contextual-all-niche-accepted-see-sample-results-20-off-reviews.1393549',
  'guest-posts-on-high-traffic-sites-10k-high-traffic-do-follow-backlinks-high-da-dr-links-casino-poker-gambling-site-accept.1762412',
  'break-seo-gravity-with-jetpack-backlinks-average-dr-70-dofoll0w-only-indexable-popular-websites-with-traffic-from-1-3-backlink.1775456',
  'zindexing-instant-indexing-60-seconds-24h-bulk-mode-up-to-99-99-success-rate-stop-paying-for-ghost-links-we-force-google.1777817',
  'buy-casino-pbn-backlinks-da-50-do-follow-backlinks-powerful-unique-ips-rank-with-pbn-backlinks-starting-20-only.1633328',
  'flat-35-off-10-high-quality-homepage-pbn-backlinks-casino-gambling-slot-toto-poker.1629050',
  'flat-75-sale-is-on-boost-serps-with-the-devils-diversified-seo-all-niches-rave-reviews-paid-indexers-da-60-traffic-10k-see-to-believe.1428541',
];

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
    setTimeout(() => reject(new Error('Timeout')), 45000);
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

  const results = [];
  for (const slug of THREADS) {
    const url = `https://www.blackhatworld.com/seo/${slug}/`;
    console.error(`\nNavigating: ${url}`);

    try {
      await send('Page.navigate', { url });
      await new Promise(r => setTimeout(r, 6000));

      const evalResult = await send('Runtime.evaluate', {
        expression: `(function() {
          var text = document.body.innerText.substring(0, 4000);
          var title = document.title || '';
          var url = window.location.href;
          var prices = text.match(/\\$[\\d,]+(?:\\/[a-z]+)?|starting.*?\\$[\\d]+|from.*?\\$[\\d]+|\\$[\\d]+\\s*-\\s*\\$[\\d]+/gi) || [];
          var da = text.match(/DA\\s*\\d+(?:\\/\\d+)?|Domain Authority\\s*\\d+/gi) || [];
          var dr = text.match(/DR\\s*\\d+|Domain Rating\\s*\\d+/gi) || [];
          var contact = text.match(/(?:Email|Telegram|Skype|WhatsApp|Contact|Website).{0,150}/gi) || [];
          var niches = text.match(/(?:casino|gambling|adult|dating|ecommerce|ai|saas|health|finance|crypto|poker|betting)/gi) || [];
          var replies = text.match(/(\\d+)\\s*Replies?/i) || [];
          var tags = text.match(/Tags[^\\n]*/i) || [];
          var out = {
            title: title.substring(0, 120),
            url: url,
            prices: [],
            da: [],
            dr: [],
            contact: [],
            niches: [],
            tags: tags[0] || '',
            snippet: text.substring(0, 800)
          };
          var seenP = {};
          for(var i=0; i<prices.length && out.prices.length<10; i++) {
            if(!seenP[prices[i]]){seenP[prices[i]]=true; out.prices.push(prices[i]);}
          }
          var seenD = {};
          for(var i=0; i<da.length && out.da.length<5; i++) {
            if(!seenD[da[i]]){seenD[da[i]]=true; out.da.push(da[i]);}
          }
          var seenR = {};
          for(var i=0; i<contact.length && out.contact.length<8; i++) {
            var c = contact[i].trim();
            if(!seenR[c]){seenR[c]=true; out.contact.push(c.substring(0,100));}
          }
          var seenN = {};
          for(var i=0; i<niches.length && out.niches.length<10; i++) {
            var n = niches[i].toLowerCase();
            if(!seenN[n]){seenN[n]=true; out.niches.push(n);}
          }
          return JSON.stringify(out);
        })()`
      });

      const data = JSON.parse(evalResult.result.value);
      results.push(data);
      console.error(`  -> OK: ${data.title.substring(0, 60)}`);
      console.error(`     Prices: ${data.prices.join(', ')}`);
      console.error(`     Niche: ${data.niches.join(', ')}`);
    } catch (e) {
      console.error(`Error: ${e.message}`);
    }
    await new Promise(r => setTimeout(r, 1000));
  }

  fs.writeFileSync('bhw-backlink-scrape.json', JSON.stringify(results, null, 2), 'utf8');
  console.error(`\nDone! Saved ${results.length} results`);

  ws.close();
}

main().catch(console.error);
