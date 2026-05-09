import { WebSocket } from 'ws';
import { writeFileSync } from 'fs';

const CDP_URL = 'ws://localhost:9222/devtools/page/A83CEA8F2BA4AEF8386A99C6738D819C';
const OUTPUT_FILE = 'E:/AI-OPE~2/Packs/seo-strategy-pack/src/.openclaw/skills/seo-strategy/lab/bhw-premium-services-details.md';

// Posts with replies > 300
const TARGET_POSTS = [
  { name: '.EDU LINKS FORMULA', replies: 964, url: 'https://www.blackhatworld.com/seo/edu-links-formula-guest-posting-mix-links-mega-authority-contextual-all-niche-accepted-see-sample-results-20-off-reviews.1393549/' },
  { name: 'CROWD LINKS Free Trial', replies: 857, url: 'https://www.blackhatworld.com/seo/free-trial-crowd-links-unique-niche-relevant-avg-dr-da-50-avg-forums-traffic-5000-from-5-link.1321546/' },
  { name: 'PR...X Digital PR', replies: 818, url: 'https://www.blackhatworld.com/seo/pr-x-worth-20-000-da-90-forbes-msn-yahoo-business-insider-20-top-tier-news-sites-see-sample-results-25-off-pr-links.1576468/' },
  { name: 'Digitaljournal / Barchart', replies: 759, url: 'https://www.blackhatworld.com/seo/35-barchart-3-million-traffic-15-digitaljournal-20-techbullion-15-bignewsnetwork-digital-pr-guest-posting-agency-growyourbrand-org.1638749/' },
  { name: 'X - All In One Mixed Links', replies: 680, url: 'https://www.blackhatworld.com/seo/x-flat-20-discount-all-in-one-mixed-links-press-release-guest-post-authority-links-da-50-90-all-niche-accepted-see-sample-results.1523966/' },
  { name: 'CLOUD STACKING BACKLINKS', replies: 644, url: 'https://www.blackhatworld.com/seo/cloud-stacking-backlinks-the-power-of-dr90-authority-discount-inside-rank-higher-aws-google-azure-scaleway-oracle.1565889/' },
  { name: 'CLOUD PBN LINKS', replies: 636, url: 'https://www.blackhatworld.com/seo/cloud-pbn-links-boost-your-rankings-dr90-authority-ultra-low-obl-1-niche-specific-topical-cloud-pbns.1640329/' },
  { name: 'GET SKYROCKET RANKING', replies: 614, url: 'https://www.blackhatworld.com/seo/get-skyrocket-ranking-manually-link-building-seo-packages-diversified-backlinks-all-niches-korean-thai-indo-start-45-only.1630208/' },
  { name: '301 Redirect Links', replies: 626, url: 'https://www.blackhatworld.com/seo/grab-high-quality-301-redirect-backlinks-from-wikipedia-bbc-forbes-huffpost-mashable-cnet-and-ny-times.1534225/' },
  { name: 'GAMECHANGER Ranking League', replies: 578, url: 'https://www.blackhatworld.com/seo/gamechanger-ranking-league-dominate-google-chatgpt-more-da-50-high-traffic-10k-guest-posts-5m-turnover-agency-blackfriday-80-off.1348819/' },
  { name: 'WOO...HOO Index Links', replies: 565, url: 'https://www.blackhatworld.com/seo/woo-hoo-25-sale-is-on-pro-diversify-index-links-see-sample-da-50-90-premium-sites-only-over-12-link-types-all-niche-accepted.1589623/' },
  { name: 'Nargil Premium Domains', replies: 557, url: 'https://www.blackhatworld.com/seo/nargils-premium-domains-for-money-sites-pbns-1000-satisfied-customers.833397/' },
  { name: 'ULTRA BOOST Casino', replies: 552, url: 'https://www.blackhatworld.com/seo/ultra-boost-premium-links-for-any-niche-specialy-poker-casino-betting-judi-toto-thai-korean-indo-sites.1617971/' },
  { name: '$2999 Worth Only $97', replies: 549, url: 'https://www.blackhatworld.com/seo/2999-worth-of-links-only-97-premium-forbes-bbc-ny-times-huffpost-healthline-more-da-90-301-redirect-backlinks.1548022/' },
  { name: '10 Homepage PBN Casino', replies: 543, url: 'https://www.blackhatworld.com/seo/flat-35-off-10-high-quality-homepage-pbn-backlinks-casino-gambling-slot-toto-poker.1629050/' },
  { name: 'Casino PBN Backlinks', replies: 509, url: 'https://www.blackhatworld.com/seo/buy-casino-pbn-backlinks-da-50-do-follow-backlinks-powerful-unique-ips-rank-with-pbn-backlinks-starting-20-only.1633328/' },
  { name: 'Casino Sidebar Blogroll', replies: 503, url: 'https://www.blackhatworld.com/seo/casino-sidebar-blogroll-back-links-da-30-plus-pbn-domains-increase-your-website-ranking-do-follow-backlinks.1661509/' },
  { name: 'Wikipedia Backlinks', replies: 493, url: 'https://www.blackhatworld.com/seo/grab-handpicked-wikipedia-backlinks-to-boost-online-visibility-unlock-the-power-of-sticky-high-da-90-links-for-seo-domination.1534224/' },
  { name: 'High-Quality EDU Guest Post', replies: 487, url: 'https://www.blackhatworld.com/seo/high-quality-edu-guest-post-backlinks-get-powerful-authority-links-for-seo-success.1689173/' },
  { name: 'X LINK INSERTION Niche Edit', replies: 436, url: 'https://www.blackhatworld.com/seo/x-link-insertion-nihce-edit-target-da-30-60-high-da-organic-traffic-all-niche-accepted-see-sample-results-45-off.1591166/' },
  { name: 'Buy Wikipedia', replies: 430, url: 'https://www.blackhatworld.com/seo/buy-wikipedia-backlinks-sticky-niche-relevant-link-fast-delivery-only-87.1548954/' },
  { name: 'Blowout Sale 70% OFF', replies: 421, url: 'https://www.blackhatworld.com/seo/blowout-sale-70-off-premium-guest-post-dr-pa-20-to-70-20k-traffic-site-only-15-link-real-outreach-guest-post.1696250/' },
];

let ws;
let msgId = 1;
const results = [];

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
    setTimeout(() => reject(new Error('Timeout after 45s')), 45000);
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function navigateTo(url) {
  try {
    await send('Page.navigate', { url });
    await sleep(5000);

    // Execute JS to extract clean text content
    const extracted = await send('Runtime.evaluate', {
      expression: `
        (function() {
          const result = {
            title: document.title,
            firstPost: '',
            prices: [],
            contacts: { skype: [], telegram: [], email: [], website: [] },
            reviews: []
          };

          // Get first post content (thread starter)
          const firstPost = document.querySelector('.message-threadStarterPost .bbWrapper, .message--post:first-child .bbWrapper, article.message-threadStarterPost .bbWrapper');
          if (firstPost) {
            result.firstPost = firstPost.innerText.slice(0, 1000);
          } else {
            // Fallback: get first .bbWrapper
            const anyPost = document.querySelector('.bbWrapper');
            if (anyPost) result.firstPost = anyPost.innerText.slice(0, 1000);
          }

          // Extract prices from first post
          const text = result.firstPost;
          const priceRegex = /\\$[\\d,.]+|€[\\d,.]+|£[\\d,.]+|\\b\\d+\\s*(USD|EUR)\\b/gi;
          const prices = text.match(priceRegex);
          if (prices) result.prices = [...new Set(prices)].slice(0, 10);

          // Extract contacts from first post
          const skypeMatch = text.match(/skype[:\\s]*@?([a-zA-Z0-9._-]+)/gi);
          if (skypeMatch) result.contacts.skype = skypeMatch;

          const telegramMatch = text.match(/telegram[:\\s]*@?([a-zA-Z0-9_]{5,32})|@[a-zA-Z0-9_]{5,32}/gi);
          if (telegramMatch) result.contacts.telegram = [...new Set(telegramMatch)].filter(t => !t.includes('@blackhatworld'));

          const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}/g);
          if (emailMatch) result.contacts.email = emailMatch.filter(e => !e.includes('blackhatworld.com'));

          const urlMatch = text.match(/https?:\\/\\/(?!blackhatworld\\.com)[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}/g);
          if (urlMatch) result.contacts.website = [...new Set(urlMatch)].filter(u => !u.includes('google') && !u.includes('facebook') && !u.includes('youtube')).slice(0, 5);

          // Get some review snippets from replies
          const replyPosts = document.querySelectorAll('.message--post:not(.message-threadStarterPost) .bbWrapper');
          const reviewKeywords = ['great', 'excellent', 'amazing', 'recommend', 'ordered', 'delivered', 'rankings', 'results', 'quality'];
          replyPosts.forEach((post, i) => {
            if (i >= 3 || result.reviews.length >= 5) return;
            const content = post.innerText.slice(0, 200);
            if (reviewKeywords.some(kw => content.toLowerCase().includes(kw))) {
              result.reviews.push(content.replace(/\\n/g, ' ').trim());
            }
          });

          return result;
        })()
      `,
      returnByValue: true
    });

    return extracted.result ? extracted.result.value : null;

  } catch (err) {
    console.error(`Navigation error: ${err.message}`);
    return null;
  }
}

function formatMarkdown(allDetails) {
  let md = `# BHW Premium Services Details (Replies > 300)

> Scraped: ${new Date().toISOString().split('T')[0]}
> Source: BlackHatWorld Marketplace
> Criteria: Reply count > 300 (high engagement threads)

---

`;

  for (const detail of allDetails) {
    md += `## ${detail.name}\n`;
    md += `> Replies: ${detail.replies} | [Thread](${detail.url})\n\n`;

    if (detail.error) {
      md += `**Error:** ${detail.error}\n\n---\n\n`;
      continue;
    }

    if (detail.prices && detail.prices.length > 0) {
      md += `### Pricing\n`;
      detail.prices.forEach(p => md += `- ${p}\n`);
      md += '\n';
    }

    const hasContacts = detail.contacts && (
      (detail.contacts.website && detail.contacts.website.length > 0) ||
      (detail.contacts.skype && detail.contacts.skype.length > 0) ||
      (detail.contacts.telegram && detail.contacts.telegram.length > 0) ||
      (detail.contacts.email && detail.contacts.email.length > 0)
    );

    if (hasContacts) {
      md += `### Contact\n`;
      if (detail.contacts.website && detail.contacts.website.length > 0) {
        md += `**Website:**\n`;
        detail.contacts.website.forEach(w => md += `- ${w}\n`);
      }
      if (detail.contacts.skype && detail.contacts.skype.length > 0) {
        md += `**Skype:** ${detail.contacts.skype.join(', ')}\n`;
      }
      if (detail.contacts.telegram && detail.contacts.telegram.length > 0) {
        md += `**Telegram:** ${detail.contacts.telegram.join(', ')}\n`;
      }
      if (detail.contacts.email && detail.contacts.email.length > 0) {
        md += `**Email:** ${detail.contacts.email.join(', ')}\n`;
      }
      md += '\n';
    }

    if (detail.firstPost) {
      md += `### Service Description\n${detail.firstPost}\n\n`;
    }

    if (detail.reviews && detail.reviews.length > 0) {
      md += `### User Reviews\n`;
      detail.reviews.forEach(r => md += `- "${r.slice(0, 150)}..."\n`);
      md += '\n';
    }

    md += '---\n\n';
  }

  return md;
}

async function main() {
  console.error('Connecting to Chrome CDP...');

  ws = new WebSocket(CDP_URL);

  await new Promise((resolve, reject) => {
    ws.on('open', resolve);
    ws.on('error', reject);
    setTimeout(() => reject(new Error('Connection timeout')), 10000);
  });

  // Enable Runtime API
  await send('Runtime.enable');

  console.error('Connected. Starting crawl...');

  for (let i = 0; i < TARGET_POSTS.length; i++) {
    const post = TARGET_POSTS[i];
    console.error(`[${i + 1}/${TARGET_POSTS.length}] Crawling: ${post.name} (${post.replies} replies)`);

    try {
      const details = await navigateTo(post.url);

      if (details) {
        details.name = post.name;
        details.url = post.url;
        details.replies = post.replies;
        results.push(details);
        console.error(`  -> Prices: ${details.prices?.length || 0}, Reviews: ${details.reviews?.length || 0}`);
      } else {
        results.push({
          name: post.name,
          url: post.url,
          replies: post.replies,
          error: 'Failed to extract content'
        });
        console.error(`  -> FAILED to extract`);
      }

      await sleep(1500 + Math.random() * 1500);

    } catch (err) {
      console.error(`  -> Error: ${err.message}`);
      results.push({
        name: post.name,
        url: post.url,
        replies: post.replies,
        error: err.message
      });
    }
  }

  ws.close();

  const markdown = formatMarkdown(results);
  writeFileSync(OUTPUT_FILE, markdown, 'utf8');

  console.error(`\nDone! Output saved to: ${OUTPUT_FILE}`);
  console.error(`Total services scraped: ${results.length}`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
