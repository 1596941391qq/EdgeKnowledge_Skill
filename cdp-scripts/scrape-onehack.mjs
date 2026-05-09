/**
 * OneHack Forum Scraper via Chrome CDP
 *
 * 零风控抓取 OneHack 论坛 SEO 相关内容
 * 使用前需要先启动 Chrome 调试模式：
 *   chrome.exe --remote-debugging-port=9222
 *
 * 然后手动访问 https://onehack.us 并通过任何验证
 */

import puppeteer from 'puppeteer-core';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const CDP_PORT = 9222;
// OneHack 真实域名
const TARGET_FORUM = 'https://onehack.st';
// 输出到项目 lab 目录（使用绝对路径）
const OUTPUT_FILE = 'E:/AI-OPE~2/Packs/seo-strategy-pack/src/.openclaw/skills/seo-strategy/lab/onehack-2026-q1.md';

// SEO 相关关键词
const SEO_KEYWORDS = [
  'seo', 'black hat', 'blackhat', 'link building', 'backlink',
  'keyword', 'serp', 'ranking', 'penalty', 'pbn', 'private blog',
  'tier', 'web 2.0', 'social signal', 'crowd', 'parasite',
  '301', 'redirect', 'expired domain', 'auction domain',
  'gsa', 'scrapebox', 'xrumer', 'senuke', 'money robot',
  'indexing', 'google dance', 'algorithm', 'update', 'core update'
];

async function connectToChrome() {
  try {
    const browser = await puppeteer.connect({
      browserURL: `http://127.0.0.1:${CDP_PORT}`,
      defaultViewport: null
    });
    console.log('[OK] Connected to Chrome');
    return browser;
  } catch (error) {
    console.error('[FAIL] Cannot connect to Chrome on port', CDP_PORT);
    console.error('Please start Chrome with: chrome.exe --remote-debugging-port=9222');
    throw error;
  }
}

async function scrapeForumPage(page, url) {
  console.log(`[NAV] Navigating to ${url}`);
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

  // 等待内容加载
  await page.waitForSelector('body', { timeout: 10000 });

  // 提取帖子列表
  const posts = await page.evaluate(() => {
    const results = [];

    // 尝试多种论坛结构
    // XenForo / Discourse / vBulletin / custom

    // 通用帖子选择器
    const selectors = [
      '.topic-list-item',
      '.discussionListItem',
      '.threadbit',
      '[data-topic-id]',
      '.topic',
      'tr.topic',
      '.threads .thread',
      'article[data-post-id]',
      '.post-row',
      'tr[data-thread-id]',
      '.structItem--thread',
      '.topic-row'
    ];

    let threads = [];
    for (const sel of selectors) {
      threads = document.querySelectorAll(sel);
      if (threads.length > 0) break;
    }

    // 如果没找到标准结构，尝试通用链接提取
    if (threads.length === 0) {
      // 查找所有可能是帖子的链接
      const links = document.querySelectorAll('a[href*="/t/"], a[href*="/thread"], a[href*="topic"], a[href*="showthread"]');
      links.forEach(link => {
        const title = link.textContent.trim();
        const href = link.href;
        if (title && href && title.length > 5) {
          results.push({
            title,
            url: href,
            author: 'unknown',
            views: 0,
            replies: 0,
            lastActivity: null
          });
        }
      });
    } else {
      threads.forEach(thread => {
        try {
          const titleEl = thread.querySelector('a.title, .title a, h3 a, .topic-title a, a[href*="/t/"], a[href*="thread"]');
          const authorEl = thread.querySelector('.username, .author, .starter, .poster, a[href*="/u/"], .usernameLink');
          const viewsEl = thread.querySelector('.views, .view-count, .stats .views');
          const repliesEl = thread.querySelector('.replies, .reply-count, .stats .replies');
          const dateEl = thread.querySelector('.date, .time, .lastPost, .last-activity, time');

          if (titleEl) {
            results.push({
              title: titleEl.textContent.trim(),
              url: titleEl.href,
              author: authorEl ? authorEl.textContent.trim() : 'unknown',
              views: viewsEl ? parseInt(viewsEl.textContent.replace(/\D/g, '')) || 0 : 0,
              replies: repliesEl ? parseInt(repliesEl.textContent.replace(/\D/g, '')) || 0 : 0,
              lastActivity: dateEl ? dateEl.textContent.trim() : null
            });
          }
        } catch (e) {
          // 跳过解析错误的帖子
        }
      });
    }

    return results;
  });

  return posts;
}

function isSeoRelated(post) {
  const titleLower = post.title.toLowerCase();
  return SEO_KEYWORDS.some(kw => titleLower.includes(kw));
}

function formatAsMarkdown(posts, seoPosts) {
  const now = new Date().toISOString().split('T')[0];

  let md = `# OneHack Forum - SEO Content Mining

> 抓取时间: ${now}
> 来源: ${TARGET_FORUM}
> 筛选标准: SEO/黑帽/工具/教程

## 概览

- 总帖子数: ${posts.length}
- SEO 相关: ${seoPosts.length}

---

## SEO 相关帖子

| 标题 | 作者 | 浏览 | 回复 |
|------|------|------|------|
`;

  seoPosts.forEach(post => {
    const title = post.title.replace(/\|/g, '\\|').substring(0, 80);
    md += `| [${title}](${post.url}) | ${post.author} | ${post.views} | ${post.replies} |\n`;
  });

  md += `\n---\n\n## 全部帖子（前50）\n\n`;

  posts.slice(0, 50).forEach((post, i) => {
    md += `${i + 1}. **[${post.title}](${post.url})** - ${post.author}\n`;
  });

  md += `\n---\n\n## 抓取配置\n\n\`\`\`javascript\nconst SEO_KEYWORDS = ${JSON.stringify(SEO_KEYWORDS, null, 2)};\n\`\`\`\n`;

  return md;
}

async function main() {
  console.log('[START] OneHack Forum Scraper');

  const browser = await connectToChrome();
  const pages = await browser.pages();
  const page = pages[0] || await browser.newPage();

  // 收集帖子
  const allPosts = [];

  // 尝试多个可能的 SEO 相关页面
  const pagesToScrape = [
    // 先看论坛结构和分类
    `${TARGET_FORUM}/categories`,
    `${TARGET_FORUM}/c/black-hat-seo`,
    `${TARGET_FORUM}/c/seo-tools`,
    `${TARGET_FORUM}/c/tutorials`,
    `${TARGET_FORUM}/tag/seo`,
    `${TARGET_FORUM}/tag/blackhat`,
    `${TARGET_FORUM}/tag/backlink`,
    `${TARGET_FORUM}/search?q=seo`,
    TARGET_FORUM,
  ];

  for (const url of pagesToScrape) {
    try {
      const posts = await scrapeForumPage(page, url);
      console.log(`[DATA] Found ${posts.length} posts on ${url}`);

      // 去重
      posts.forEach(post => {
        if (!allPosts.find(p => p.url === post.url)) {
          allPosts.push(post);
        }
      });

      // 页面间隔
      await new Promise(r => setTimeout(r, 2000));
    } catch (error) {
      console.log(`[SKIP] ${url} - ${error.message}`);
    }
  }

  // 如果没找到特定板块，尝试首页
  if (allPosts.length === 0) {
    console.log('[FALLBACK] Trying homepage...');
    const posts = await scrapeForumPage(page, TARGET_FORUM);
    allPosts.push(...posts);
  }

  // 筛选 SEO 相关
  const seoPosts = allPosts.filter(isSeoRelated);
  console.log(`[FILTER] SEO related: ${seoPosts.length} / ${allPosts.length}`);

  // 生成 Markdown
  const markdown = formatAsMarkdown(allPosts, seoPosts);

  // 确保 lab 目录存在
  const labDir = path.dirname(OUTPUT_FILE);
  await fs.mkdir(labDir, { recursive: true });

  // 写入文件
  await fs.writeFile(OUTPUT_FILE, markdown, 'utf-8');
  console.log(`[DONE] Output: ${OUTPUT_FILE}`);

  // 断开连接（不关闭浏览器）
  browser.disconnect();
}

main().catch(console.error);
