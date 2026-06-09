# Edge Knowledge - 边缘知识 skill

> **中文文档** | **[English Documentation](./README.md)**

AI驱动的边缘知识挖掘系统。针对用户需求，从高价值论坛（Reddit、BlackHatWorld、GreyHatMafia 等）智能推荐 + browser-use 深度爬取 + 视觉识别 + 分析边缘技巧、骚人、资源，并输出单一结构化 Markdown 报告。

## 🎯 核心理念

> **💡 知识平权倡议**
> 本项目鼓励社区贡献！你可以在 Git 上开分支，打造不同领域的搜索专家 skill（如 SEO 专家、Affiliate 专家、工具挖掘专家等），让边缘知识触达更多人。
>
> **🤝 如何贡献 PR**：
> - 🌿 **搭建领域特化分支** - 创建针对特定领域的专家版本（如 `seo-expert`、`affiliate`）
> - 🔧 **优化原有 skill** - 提高工具的多功能性和鲁棒性（反爬策略、错误处理、性能优化）
> - 📚 **分享高质量论坛** - 在 `forum_database.json` 中添加你在用的深水论坛和搜索策略
> - 🤖 **增加自动化能力** - 添加定时任务、推送到 Notion/飞书/Slack 等协作工具的集成
>
> 让我们一起打破信息壁垒，促进知识平权！🚀

### 什么是边缘知识？

在AI时代中，LLM所能理解或者容易在internet收集到的信息属于通用知识，而带有稀缺性的，行业knowhow的，类似灰帽黑帽的reach规则本身的我称之为边缘知识。

**边缘知识包括**：
- ✅ 黑白灰帽SEO技巧：PBN、Parasite SEO、Cloaking、Link Farms
- ✅ 实战骚招：被禁的、有风险的、但有效的玩法
- ✅ 地下工具：GSA SER、SEnuke、Xrumer、Scrapebox
- ✅ 实战数据：成功率、价格、风险、案例数字
- ✅ 争议玩法：高赞回复、争议讨论、实战分享

**不包括**：
- ❌ 白帽鸡汤（"写好内容就有流量"）
- ❌ 官方文档（Google SEO 指南）
- ❌ 主流建议（"做好用户体验"）

### 边缘知识的三大特征

1. **时效性 (Freshness)** - 新鲜的信息（2025年后）
2. **稀缺性 (Scarcity)** - 独家的信息（小圈子知道）
3. **可信度 (Credibility)** - 可信的信息（有数据、案例）

## ✨ 核心能力

### V1: 基础能力
- 🎯 **意图提取与查询泛化** - 根据用户泛化查询方向及推荐高质量论坛
- 🧠 **用户偏好记忆** - 记住用户喜欢的论坛和搜索习惯
- 🔐 **账密管理** - 自动管理论坛账号密码，支持会话复用
- 🛡️ **防风控系统** - 固定指纹、随机延迟、会话管理，降低账号风险
- 🌐 **智能浏览器爬取** - 使用 browser-use 技能，支持截图+视觉识别
- 🔍 **深度内容分析** - 边缘知识识别、骚人识别、资源提取
- 📊 **单一报告输出** - 按日期+主题命名，结构化展示

### 🆕 V2: 猎人模式 (NEW!)

V2 新增激进的资源获取能力：

| 能力 | 说明 |
|------|------|
| **🎯 价值信号识别** | 6 种模式：回复解锁、隐藏内容、下载链接、提取码、附件、任务门槛 |
| **🤖 自动回复系统** | 25 条随机模板 (15 英文 + 10 中文)，自动语言检测 |
| **📦 资源下载器** | 下载所有文件类型 (.exe/.bat/.torrent)，保持完整性 |
| **🔗 深水区钻取** | 外链跟踪、作者追踪、评论区挖掘 |
| **🧵 工具集成** | Agent-Reach、gallery-dl、yt-dlp、Crawl4AI 就绪 |

### 🆕 V3: 新鲜度与置信度 (NEW!)

V2 能抓资源。V3 确保你抓到的东西**新鲜**且**可信**——因为边缘知识会衰减，而观点不是打法。

| 能力 | 说明 |
|------|------|
| **🌐 GEO/AEO 边缘分类** | 前沿已经迁移。新增 `GEO_Edge_Search` 分类 + `GEO_AI_Visibility` 策略，瞄准最新鲜、最低饱和度的边缘：怎么被 ChatGPT/Perplexity/Gemini 引用、截流 AI Overview 流量、工程化 LLM 可见性——在打法成为共识之前 |
| **⏳ 新鲜度契约** | 每个信源现在带 `last_verified` / `activity_status` / `freshness_score`。陈旧信源池被降权，衰退的被标记重新验证（`reverify_after_days: 90`）。"新鲜度"不再是口号，而是机制 |
| **🎯 置信度打分** | `credibilityScoring` 把"可信"这个特征变成可计算的分数。具体数字、真实定价、案例证据得高分；纯观点被扣分。提取的知识在写入报告前先按证据强度排序 |

**V3 为什么重要：** 2024 年的金矿论坛，2026 年可能已经死了。一条"$30 CPA，14 天回本，3 个账号实测"的回复，比"我觉得应该可以"值钱得多。V3 把这两种判断编码进系统，让它不再把所有信号一视同仁。


## 🚀 快速安装

```bash
git clone https://github.com/1596941391qq/EdgeKnowledge_Skill.git
cd EdgeKnowledge_Skill
chmod +x install.sh
./install.sh
```

或将此 skill 复制到 Claude Code 的 skills 目录：

```bash
cp -r edge-knowledge ~/.claude/skills/
```


## 🔄 MCP 工具路由 (V2)

V2 内置**三层智能路由引擎**，自动为每个任务选择最优工具——成本优先 + 成功率保障。

### 工具层级

| 层级 | 工具 | 成本 | 最佳场景 |
|------|------|------|----------|
| **Tier 1** | `browser-use` | 免费（本地 Playwright） | 截图+视觉识别、点击/滚动/表单交互、JS懒加载、登录后访问 |
| **Tier 2** | `agent-browser` | 免费（Vercel CLI） | 重复性结构化提取、@e1/@e2 元素选择、脚本化多步操作 |
| **Tier 3** | `google-gemini-mcp` | API key（按token计费） | 绕过反爬阻断、批量URL分析（>10页）、复杂多模态理解 |

### 路由决策规则

```
IF captcha_detected AND captcha_type == "recaptcha_v2":
    → ai-captcha-bypass（GPT-4o 或 Gemini 2.5）→ 重试

IF cloudflare_blocked AND browser_use_failed:
    → google-gemini-mcp（Tier 3）

IF batch_analysis AND urls > 10:
    → google-gemini-mcp（并发分析）

IF visual_heavy AND needs_screenshot:
    → browser-use（Tier 1）

IF download_only:
    → gallery-dl / yt-dlp（不经浏览器）
```

### MCP Server 配置

所有 MCP Server 配置集中在 `mcp_config.json`：
- **`google-gemini-mcp`** — Gemini 2.5 深度搜索、URL 获取、多模态分析
- **`ai-captcha-bypass`** — GPT-4o / Gemini 驱动验证码求解（Selenium + Firefox）



## ⚙️ 配置文件说明

### 1. forum_database.json

论坛知识库，包含论坛信息和搜索策略。

**结构说明**:
```json
{
  "categories": {
    "问题型检索": {
      "description": "适合挖掘评论区深度讨论和真实用户反馈",
      "forums": [...]
    },
    "边缘知识检索": {
      "description": "适合挖掘主流渠道找不到的灰色/黑帽技巧",
      "forums": [...]
    },
    "高自由度深度论坛": {
      "description": "信息焦虑时想看点别人不知道的深度内容",
      "forums": [...]
    }
  },
  "search_strategies": {
    "INS刷流量刷粉丝": {
      "keywords": [...],
      "recommended_forums": [...],
      "focus": "评论区真实反馈和灰色技巧"
    }
  }
}
```

**使用方式**:
- 系统会自动读取此文件来推荐论坛
- 你可以添加新的论坛或搜索策略
- 每个论坛包含：名称、URL、评分、成本、适合人群、标签

### 2. memory.json.template

用户偏好和爬取历史的模板文件。首次使用时复制为 `memory.json`：

```bash
cp memory.json.template memory.json
```

**结构说明**:
```json
{
  "userPreferences": {
    "favoriteForums": ["BestBlackHatForum"],
    "domains": ["SEO", "黑帽技术", "流量套利"],
    "lastUsedDomain": "黑帽SEO"
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

**字段说明**:
- `userPreferences`: 你喜欢的论坛和领域
- `forumCredentials`: 论坛登录凭证（当你提供账号密码时自动保存）
- `crawledResources`: 已爬取的 URL 历史（防止重复爬取）
- `antiDetection`: 防风控配置（视口、延迟、登录限制等）

**隐私说明**: `memory.json` 已在 `.gitignore` 中，不会被提交到 Git。你的账号密码安全地保存在本地。

### 3. value_patterns.json (V2)

猎人模式的价值信号识别模式库。

**识别模式**：
- `reply_unlock` - "回复可见隐藏内容"
- `hidden_content` - 隐藏内容 / 折叠区块
- `download_link` - Mega/百度盘/Google Drive 链接
- `extract_code` - "密码: xxx" / "提取码: xxx"
- `attachment` - "下载附件"
- `task_threshold` - "需要 X 帖子 / X 点赞才能查看"

### 4. platforms.json (V2)

平台专用下载配置。

**结构**：
```json
{
  "mega.nz": {
    "tool": "gallery-dl",
    "args": ["--no-mtime"],
    "maxConcurrent": 2
  },
  "youtube.com": {
    "tool": "yt-dlp",
    "args": ["-f", "best"]
  }
}
```

### 5. resources/ 目录 (V2)

资源存储目录结构：
```
resources/
├── downloads/      # 下载文件（按日期）
├── links/
│   ├── mega.json   # Mega 链接索引
│   ├── baidu.json  # 百度盘链接
│   └── gdrive.json # Google Drive 链接
├── codes/
│   └── passwords.json  # 提取码
└── index.json      # 统一资源索引
```

## 🚀 使用方法

### 基本用法

```
使用 edge-knowledge 挖掘高性价比的INS刷流量服务
```

### 实战示例

展示 skill 对边缘知识的追踪能力：

#### 示例 1：黑帽 SEO 技巧
```
使用 edge-knowledge 查找 2026 年最新的黑帽 SEO 技巧
```
**你将获得**：
- 最新的 PBN（私有博客网络）策略
- 仍然有效的寄生 SEO 战术
- 绕过 Google 检测的 Cloaking 技术
- Link Farm 方法和自动化工具

#### 示例 2：联盟营销套利
```
使用 edge-knowledge 发现高利润的联盟流量源
```
**你将获得**：
- 高 ROI 的地下流量源
- 接受灰帽方法的 CPA 网络
- 顶级 Affiliate 的媒体购买策略
- 带实际数字的真实案例研究

#### 示例 3：社交媒体增长黑客
```
使用 edge-knowledge 查找绕过检测的 Instagram 自动化工具
```
**你将获得**：
- 2026 年仍然有效的自动化机器人
- 提供真实互动的 SMM 面板
- 增长黑客脚本和技术
- 风险评估和检测规避方法

#### 示例 4：工具发现
```
使用 edge-knowledge 查找破解的 SEO 工具和自动化软件
```
**你将获得**：
- 高级 SEO 工具的可用破解版
- 用于抓取和发布的自动化脚本
- 破解的 WordPress 插件和主题
- 社区评价和安全评级

### 工作流程

1. **阶段1：推荐论坛** - 系统根据你的需求推荐相关论坛
2. **阶段2：智能爬取** - 使用 browser-use 深度爬取论坛内容
3. **阶段3：内容分析** - 识别边缘知识、骚人、资源
4. **阶段4：生成报告** - 输出结构化 Markdown 报告



## 🛠️ 内置工具模块

以下工具目录为边缘场景自动化提供支持：

| 目录 | 工具 | 用途 |
|------|------|------|
| `temp_captcha/` | [ai-captcha-bypass](https://github.com/aydinnyunus/ai-captcha-bypass) | GPT-4o / Gemini 驱动验证码求解（reCAPTCHA v2、文字、滑块、音频） |
| `temp_cf/` | Cloudflare Turnstile Bypass（DrissionPage） | DrissionPage + ChromiumPage CF Turnstile Token 提取器 |
| `temp_turnstile/` | [cloudflare-turnstile-bypass](https://github.com/jobians/cloudflare-turnstile-bypass) | Patchright + Node.js CF Turnstile 求解器 |
| `rules/access-control.md` | — | 权限边界与授权声明 |
| `mcp_config.json` | — | MCP Server 与工具路由集中配置 |

所有工具由路由引擎自动调用，无需手动配置。

## 📚 部分使用论坛

| 排名 | 论坛 | 评分 | 成本 | 适合人群 |
|------|------|------|------|----------|
| 1 | GreyHatMafia | 9.5/10 | 免费 | 所有人 |
| 4 | SEO Isn't Dead | 9/10 | 免费 | SEO从业者 |
| 6 | BlackHatWorld | 8.5/10 | 免费 | 综合营销 |
| 7 | BestBlackHatForum | 9.5/10 | 免费 | 推荐看slenderman的帖子 |
| 8 | Reddit | 10/10 | 免费 | 价值藏在评论区里 |

## 📋 报告示例

生成的报告包含三层分析：

### 1. 边缘知识识别
```markdown
### 边缘知识 #1: [知识标题]
**压缩表达**: [一句话总结]
**容易理解的解释**: [详细解释]
**观点罗列**: @用户名: "观点内容"
**风险**: [潜在风险]
**成本**: [时间/金钱/学习成本]
**来源链接**: [原始链接]
```

### 2. 骚人识别
```markdown
### 骚人 #1: @用户名
**用户名**: 用户名 (论坛名)
**高能观点**: "观点1", "观点2"
**链接**: [用户主页链接]
```

### 3. 资源提取
```markdown
### 资源 #1: [工具/服务名称]
**名称**: 工具名
**链接**: [工具链接]
**描述**: [功能描述]
**价格**: [价格信息]
**评价**: [用户评价摘要]
```

## 🔧 技术架构

### 依赖
- Claude Code CLI
- browser-use skill / agent-browser skill
- Python 3.8+

### 跨平台安装脚本
`install.sh` 自动识别 **macOS**、**Ubuntu/Debian**、**CentOS/RHEL**、**Arch Linux**，安装系统依赖、配置 Playwright、设置 MCP Server。

### V2 额外依赖
```bash
pip install gallery-dl yt-dlp crawl4ai
```

### 数据流
```
用户需求 → 读取 memory.json → 推荐论坛 → 用户确认 →
检查账密 → 应用防风控配置 → browser-use爬取 →
Claude分析 → 生成报告 → 更新 memory.json
```
### 参考截图

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2026/png/65208130/1770384664181-3508fcfa-012e-45b9-a3b3-43f343c4ad21.png)
<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2026/png/65208130/1770384830572-2db0ae2f-2b82-4077-bff1-8e04658d708a.png)<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2026/png/65208130/1770384935540-1488fc21-351a-4515-ad6f-0431e20ba6ec.png)

## ⚠️ 注意事项

1. **合法使用** - 仅用于学习研究，遵守论坛规则和当地法律
2. **账号安全** - 使用独立账号，避免使用主账号
3. **防风控** - 系统自动应用防风控策略，但仍需谨慎使用
4. **内容风险** - 边缘知识可能包含风险操作，请自行判断

## 📄 许可证

MIT License

## 👤 作者

黑咖啡和冰月亮 (@weihackings)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## ⭐ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=1596941391qq/EdgeKnowledge_Skill&type=Date)](https://star-history.com/#1596941391qq/EdgeKnowledge_Skill&Date)



## ❓ 常见问题

### Q1: 这个工具合法吗？
**A**: 本工具仅用于教育和研究目的。请始终遵守论坛服务条款和当地法律。使用风险自负。

### Q2: 我的账号会被封吗？
**A**: 工具包含防检测功能（随机延迟、会话复用、登录限制），但始终存在风险。我们建议：
- 使用专用账号，而非主账号
- 遵守 `maxLoginPerDay` 限制（默认：3次）
- 不要过于激进地爬取

### Q3: 我需要提供论坛凭证吗？
**A**: 仅对需要登录的论坛（如 BestBlackHatForum）需要。对于公开论坛（如 Reddit），无需凭证。你的凭证存储在本地 `memory.json` 中，永远不会提交到 Git。

### Q4: 如何添加自己的论坛？
**A**: 编辑 `forum_database.json` 并将你的论坛添加到适当的类别：
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

### Q5: 我可以创建领域特定分支吗？
**A**: 可以！Fork 仓库并创建像 `seo-expert` 或 `affiliate` 这样的分支。为你的领域定制 `forum_database.json` 和 `skill.md`。查看我们的[贡献指南](#-知识平权倡议)。

### Q6: 如何集成 Notion/飞书？
**A**: 这是一个社区贡献机会！你可以：
1. Fork 仓库
2. 添加集成代码以将报告推送到你的协作工具
3. 提交 PR 与你的集成

### Q7: 边缘知识和通用知识有什么区别？
**A**:
- **通用知识**：通过 Google/ChatGPT 容易找到的信息（例如："写好内容"）
- **边缘知识**：来自地下社区的稀缺、有风险或有争议的战术（例如："2026 年绕过 Google 惩罚的 PBN 网络"）

### Q8: 论坛数据库多久更新一次？
**A**: 社区驱动！提交 PR 以添加新论坛或更新评分。我们定期审查和合并高质量的贡献。

### Q9: 我可以用这个做白帽 SEO 吗？
**A**: 虽然工具专注于"边缘"知识，但你可以自定义 `forum_database.json` 以包含白帽论坛并相应调整搜索策略。

### Q10: 如何报告错误或请求功能？
**A**: 在 [GitHub Issues](https://github.com/1596941391qq/EdgeKnowledge_Skill/issues) 上开一个 issue，包含：
- 错误/功能的清晰描述
- 重现步骤（对于错误）
- 预期与实际行为
- 你的环境（操作系统、Claude Code 版本）

## 🗺️ V3 路线图 — 社区赛道

V3 交付了**机制层**（新鲜度字段、GEO 分类、置信度打分）。下面的**精炼层**才是真正的深水区，也最欢迎社区贡献。这些都是硬骨头、开放问题：

| 赛道 | 问题 | 贡献机会 |
|------|------|---------|
| **信源优先挖掘** | 关键词驱动的搜索会漏掉你不知道该找的知识。能不能让爬虫先吃透一个高信号信源，再让主题从发现里自然长出来？ | 一种先完整摄入信源、再涌现主题的模式，而非匹配预设关键词 |
| **空白驱动排期** | 下一步该挖什么？现在靠手动。系统能否检测哪里已有大量原料但没有成文产出，并优先处理？ | 一个 `gap-assessment` 流程，按原料密度排序"可立即聚合"的主题 |
| **增量去重** | 重爬一个信源会把所有东西重报一遍。它应该只吐出相比上次的净新增。 | 一个知识指纹库，让重复爬取只发增量，不发全量 |
| **溯源与矛盾检测** | 置信度打分只是起点。生产级验证意味着标注每条主张的溯源、交叉核对新鲜度、标记矛盾点而不增加报告噪音。 | 一个溯源层，给每条提取主张打标（一手 / 交叉验证 / 未验证）并暴露冲突 |
| **读者级输出** | 原始报告读起来像爬虫日志。终局是 wiki 级知识：聚合、交叉引用、来源脱敏、无大纲残桩。 | 一个后处理流程，把提取产物转成可独立阅读的知识文章 |

> 🤝 选一个赛道，开个分支（如 `source-first`、`incremental-dedup`），提 PR。这些就是区分"爬虫"和"知识引擎"的问题。

