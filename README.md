# Edge Knowledge Hunter

> **[Chinese Documentation](./README_CN.md)** | **English Documentation**

AI-powered edge knowledge mining system. Intelligently recommends high-value forums (Reddit, BlackHatWorld, GreyHatMafia, etc.) based on user needs, performs deep crawling with browser-use, visual recognition, and analyzes edge tactics, power users, and resources, outputting a single structured Markdown report.

## 🎯 Core Philosophy

> **💡 Knowledge Equity Initiative**
> This project encourages community contributions! You can create branches on Git to build domain-specific search expert skills (e.g., SEO Expert, Affiliate Hunter, Tool Digger), making edge knowledge accessible to more people.
>
> **🤝 How to Contribute PRs**:
> - 🌿 **Build Domain-Specific Branches** - Create specialized versions for specific domains (e.g., `seo-expert`, `affiliate-hunter`)
> - 🔧 **Optimize Existing Skill** - Improve tool versatility and robustness (anti-scraping strategies, error handling, performance optimization)
> - 📚 **Share Quality Forums** - Add deep-dive forums you use to `forum_database.json` with search strategies
> - 🤖 **Add Automation Capabilities** - Integrate scheduled tasks, push to Notion/Feishu/Slack and other collaboration tools
>
> Let's break information barriers and promote knowledge equity together! 🚀

### What is Edge Knowledge?

In the AI era, information that LLMs can easily understand or collect from the internet is considered common knowledge. Edge knowledge refers to scarce, industry know-how, and gray/black hat techniques that reach the boundaries of platform rules.

**Edge Knowledge Includes**:
- ✅ Black/White/Gray Hat SEO: PBN, Parasite SEO, Cloaking, Link Farms
- ✅ Tactical Tricks: Banned, risky, but effective methods
- ✅ Underground Tools: GSA SER, SEnuke, Xrumer, Scrapebox
- ✅ Real Data: Success rates, prices, risks, case numbers
- ✅ Controversial Tactics: High-voted replies, controversial discussions, practical sharing

**Does NOT Include**:
- ❌ White Hat Platitudes ("write good content and traffic will come")
- ❌ Official Documentation (Google SEO Guidelines)
- ❌ Mainstream Advice ("improve user experience")

### Three Characteristics of Edge Knowledge

1. **Freshness** - Recent information (post-2025)
2. **Scarcity** - Exclusive information (known in small circles)
3. **Credibility** - Trustworthy information (with data and cases)

## ✨ Core Capabilities

- 🎯 **Intent Extraction & Query Generalization** - Generalizes query directions and recommends high-quality forums
- 🧠 **User Preference Memory** - Remembers favorite forums and search habits
- 🔐 **Credential Management** - Automatically manages forum credentials, supports session reuse
- 🛡️ **Anti-Detection System** - Fixed fingerprints, random delays, session management to reduce account risk
- 🌐 **Smart Browser Crawling** - Uses browser-use skill, supports screenshots + visual recognition
- 🔍 **Deep Content Analysis** - Edge knowledge identification, power user identification, resource extraction
- 📊 **Single Report Output** - Named by date + topic, structured display

## 📦 Installation

Copy this skill to Claude Code's skills directory:

```bash
cp -r edge-knowledge-hunter ~/.claude/skills/
```

## ⚙️ Configuration Files

### 1. forum_database.json

The forum knowledge base containing forum information and search strategies.

**Structure**:
```json
{
  "categories": {
    "Q&A_Search": {
      "description": "Suitable for mining deep discussions and real user feedback in comment sections",
      "forums": [...]
    },
    "Edge_Knowledge_Search": {
      "description": "Suitable for mining gray/black hat techniques not found in mainstream channels",
      "forums": [...]
    },
    "Deep_Dive_Forums": {
      "description": "Deep content that others don't know about",
      "forums": [...]
    }
  },
  "search_strategies": {
    "Instagram_Growth": {
      "keywords": [...],
      "recommended_forums": [...],
      "focus": "Real feedback in comment sections and gray techniques"
    }
  }
}
```

**Usage**:
- The system automatically reads this file to recommend forums
- You can add new forums or search strategies
- Each forum includes: name, URL, rating, cost, target audience, tags

### 2. memory.json.template

Template for user preferences and crawling history. Copy to `memory.json` for first use:

```bash
cp memory.json.template memory.json
```

**Structure**:
```json
{
  "userPreferences": {
    "favoriteForums": ["BestBlackHatForum"],
    "domains": ["SEO", "Black Hat Techniques", "Traffic Arbitrage"],
    "lastUsedDomain": "Black Hat SEO"
  },
  "forumCredentials": {
    "bestblackhatforum.com": {
      "username": "",
      "password": "",
      "lastLogin": "",
      "loginCount": 1,
      "cookies": null,
      "localStorage": null,
      "sessionValid": true
    }
  },
  "crawledResources": [],
  "antiDetection": {
    "viewport": {"width": 1920, "height": 1080},
    "userAgent": "",
    "timezone": "",
    "locale": "",
    "randomDelayRange": [5000, 30000],
    "maxLoginPerDay": 3,
    "reuseSession": true,
    "sessionExpiryHours": 24
  }
}
```

**Fields Explanation**:
- `userPreferences`: Your favorite forums and domains
- `forumCredentials`: Forum login credentials (auto-saved when you provide them)
- `crawledResources`: History of crawled URLs (prevents duplicate crawling)
- `antiDetection`: Anti-detection configuration (viewport, delays, login limits)

**Privacy Note**: `memory.json` is in `.gitignore` and won't be committed to Git. Your credentials are safe locally.

## 🚀 Usage

### Basic Usage

```
Use edge-knowledge-hunter to mine cost-effective Instagram growth services
```

### Real-World Examples

Demonstrate the skill's edge knowledge tracking capabilities:

#### Example 1: Black Hat SEO Techniques
```
Use edge-knowledge-hunter to find the latest black hat SEO techniques for 2026
```
**What you'll get**:
- Latest PBN (Private Blog Network) strategies
- Parasite SEO tactics that still work
- Cloaking techniques to bypass Google detection
- Link farming methods and automation tools

#### Example 2: Affiliate Marketing Arbitrage
```
Use edge-knowledge-hunter to discover profitable affiliate traffic sources
```
**What you'll get**:
- Underground traffic sources with high ROI
- CPA networks that accept gray hat methods
- Media buying strategies from top affiliates
- Real case studies with actual numbers

#### Example 3: Social Media Growth Hacks
```
Use edge-knowledge-hunter to find Instagram automation tools that bypass detection
```
**What you'll get**:
- Automation bots that work in 2026
- SMM panels with real engagement
- Growth hacking scripts and techniques
- Risk assessment and detection avoidance

#### Example 4: Tool Discovery
```
Use edge-knowledge-hunter to find cracked SEO tools and automation software
```
**What you'll get**:
- Working cracks for premium SEO tools
- Automation scripts for scraping and posting
- Nulled WordPress plugins and themes
- Community reviews and safety ratings

### Workflow

1. **Stage 1: Forum Recommendation** - System recommends relevant forums based on your needs
2. **Stage 2: Smart Crawling** - Deep crawls forum content using browser-use
3. **Stage 3: Content Analysis** - Identifies edge knowledge, power users, resources
4. **Stage 4: Report Generation** - Outputs structured Markdown report

## 📚 Supported Forums (Partial List)

| Rank | Forum | Rating | Cost | Target Audience |
|------|-------|--------|------|-----------------|
| 1 | GreyHatMafia | 9.5/10 | Free | Everyone |
| 4 | SEO Isn't Dead | 9/10 | Free | SEO Practitioners |
| 6 | BlackHatWorld | 8.5/10 | Free | General Marketing |
| 7 | BestBlackHatForum | 9.5/10 | Free | Recommended: slenderman's posts |
| 8 | Reddit | 10/10 | Free | Value in comment sections |

## 📋 Report Example

Generated reports contain three-layer analysis:

### 1. Edge Knowledge Identification
```markdown
### Edge Knowledge #1: [Knowledge Title]
**Compressed Expression**: [One-sentence summary]
**Easy Explanation**: [Detailed explanation]
**Viewpoints**: @username: "viewpoint content"
**Risk**: [Potential risks]
**Cost**: [Time/money/learning cost]
**Source Link**: [Original link]
```

### 2. Power User Identification
```markdown
### Power User #1: @username
**Username**: username (forum name)
**High-Energy Viewpoints**: "viewpoint1", "viewpoint2"
**Link**: [User profile link]
```

### 3. Resource Extraction
```markdown
### Resource #1: [Tool/Service Name]
**Name**: Tool name
**Link**: [Tool link]
**Description**: [Feature description]
**Price**: [Price information]
**Review**: [User review summary]
```

## 🔧 Technical Architecture

### Dependencies
- Claude Code CLI
- browser-use skill
- Python 3.8+

### Data Flow
```
User Need → Read memory.json → Recommend Forums → User Confirms →
Check Credentials → Apply Anti-Detection Config → browser-use Crawl →
Claude Analysis → Generate Report → Update memory.json
```

### Reference Screenshots

![](https://cdn.nlark.com/yuque/0/2026/png/65208130/1770384664181-3508fcfa-012e-45b9-a3b3-43f343c4ad21.png)
![](https://cdn.nlark.com/yuque/0/2026/png/65208130/1770384830572-2db0ae2f-2b82-4077-bff1-8e04658d708a.png)
![](https://cdn.nlark.com/yuque/0/2026/png/65208130/1770384935540-1488fc21-351a-4515-ad6f-0431e20ba6ec.png)

## ⚠️ Important Notes

1. **Legal Use** - For educational and research purposes only, comply with forum rules and local laws
2. **Account Security** - Use dedicated accounts, avoid using your main accounts
3. **Anti-Detection** - System automatically applies anti-detection strategies, but use cautiously
4. **Content Risk** - Edge knowledge may contain risky operations, use your own judgment

## 📄 License

MIT License

## 👤 Author

黑咖啡和冰月亮 / Black Coffee & Ice Moon (@weihackings)

## 🤝 Contributing

Issues and Pull Requests are welcome!

## ⭐ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=1596941391qq/EdgeKnowledge_Skill&type=Date)](https://star-history.com/#1596941391qq/EdgeKnowledge_Skill&Date)



## ❓ FAQ

### Q1: Is this tool legal to use?
**A**: This tool is for educational and research purposes only. Always comply with forum terms of service and local laws. Use at your own risk.

### Q2: Will my account get banned?
**A**: The tool includes anti-detection features (random delays, session reuse, login limits), but there's always a risk. We recommend:
- Use dedicated accounts, not your main accounts
- Respect the `maxLoginPerDay` limit (default: 3)
- Don't crawl too aggressively

### Q3: Do I need to provide forum credentials?
**A**: Only for forums that require login (like BestBlackHatForum). For public forums (like Reddit), no credentials needed. Your credentials are stored locally in `memory.json` and never committed to Git.

### Q4: How do I add my own forums?
**A**: Edit `forum_database.json` and add your forum to the appropriate category:
```json
{
  "name": "YourForum",
  "url": "https://yourforum.com",
  "rating": 9.0,
  "cost": "Free",
  "target_audience": "Your Target Audience",
  "tags": ["tag1", "tag2"]
}
```

### Q5: Can I create domain-specific branches?
**A**: Yes! Fork the repo and create a branch like `seo-expert` or `affiliate-hunter`. Customize `forum_database.json` and `skill.md` for your domain. See our [contribution guidelines](#-knowledge-equity-initiative).

### Q6: How do I integrate with Notion/Feishu?
**A**: This is a community contribution opportunity! You can:
1. Fork the repo
2. Add integration code to push reports to your collaboration tool
3. Submit a PR with your integration

### Q7: What's the difference between edge knowledge and common knowledge?
**A**:
- **Common Knowledge**: Information easily found via Google/ChatGPT (e.g., "write good content")
- **Edge Knowledge**: Scarce, risky, or controversial tactics from underground communities (e.g., "PBN networks that bypass Google penalties in 2026")

### Q8: How often is the forum database updated?
**A**: Community-driven! Submit PRs to add new forums or update ratings. We review and merge quality contributions regularly.

### Q9: Can I use this for white hat SEO?
**A**: While the tool focuses on "edge" knowledge, you can customize `forum_database.json` to include white hat forums and adjust search strategies accordingly.

### Q10: How do I report bugs or request features?
**A**: Open an issue on [GitHub Issues](https://github.com/1596941391qq/EdgeKnowledge_Skill/issues) with:
- Clear description of the bug/feature
- Steps to reproduce (for bugs)
- Expected vs actual behavior
- Your environment (OS, Claude Code version)
