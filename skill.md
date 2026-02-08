---
name: Edge Knowledge
description: > 
  AI驱动的边缘知识挖掘系统。针对用户需求，从高价值论坛（Reddit、BlackHatWorld、GreyHatMafia 等）智能推荐 + browser-use 深度爬取 + 视觉识别 + 分析边缘技巧、骚人、资源，并输出单一结构化 Markdown 报告。
license: MIT  # 或 CC-BY-NC-SA 4.0
version: 1.0.0
author: 黑咖啡和冰月亮 (@weihackings)
tags: [forum-crawler, edge-knowledge, blackhat, affiliate, browser-automation, visual-analysis]
categories: [research, marketing-intelligence, gray-area]
---
# Edge Knowledge - 边缘知识

## 🎯 核心理念

### 什么是边缘知识？

在AI时代中，LLM所能理解或者容易在internet收集到的信息属于通用知识，而带有稀缺性的，行业knowhow的，类似灰帽黑帽的reach规则本身的我称之为边缘知识，我更关注这一部分

- ✅ **黑白灰帽SEO技巧**：PBN、Parasite SEO、Cloaking、Link Farms
- ✅ **实战骚招**：被禁的、有风险的、但有效的玩法
- ✅ **地下工具**：GSA SER、SEnuke、Xrumer、Scrapebox
- ✅ **实战数据**：成功率、价格、风险、案例数字
- ✅ **争议玩法**：高赞回复、争议讨论、实战分享

❌ **不是这些**：

- 白帽鸡汤（"写好内容就有流量"）
- 官方文档（Google SEO 指南）
- 主流建议（"做好用户体验"）

### 边缘知识的三大特征

1. **时效性 (Freshness)** - 新鲜的信息（2025年后）
2. **稀缺性 (Scarcity)** - 独家的信息（小圈子知道）
3. **可信度 (Credibility)** - 可信的信息（有数据、案例）

## 核心能力
- 🎯 **意图提取与查询泛化** - 根据用户泛化查询方向及推荐高质量论坛
- 🧠 **用户偏好记忆** - 记住用户喜欢的论坛和搜索习惯
- 🔐 **账密管理** - 自动管理论坛账号密码，支持会话复用
- 🛡️ **防风控系统** - 固定指纹、随机延迟、会话管理，降低账号风险
- 🌐 **智能浏览器爬取** - 使用 browser-use 技能，支持截图+视觉识别
- 🔍 **深度内容分析** - 边缘知识识别、骚人识别、资源提取
- 📊 **单一报告输出** - 按日期+主题命名，结构化展示



### 3. 使用流程

#### 场景 1：首次使用（无账号）
```
用户: 爬取 BestBlackHatForum 的 slender 用户帖子

Agent: 🔐 需要登录凭证
论坛 bestblackhatforum.com 需要登录才能访问内容。
请提供您的账号密码：
- 用户名:
- 密码:

用户: 用户名: 
      密码: 

Agent: ✅ 账号已保存！开始爬取...
```

#### 场景 2：会话有效（直接使用）
```
用户: 再爬一次 BestBlackHatForum

Agent: ✅ 会话有效，直接使用已保存的会话
开始爬取...
```

#### 场景 3：会话过期（自动重新登录）
```
用户: 爬取 BestBlackHatForum

Agent: ⚠️ 会话已过期，使用已保存的账号重新登录
登录成功！开始爬取...
```

#### 场景 4：达到登录上限（风险提醒）
```
用户: 爬取 BestBlackHatForum

Agent: ⚠️ 今日登录次数已达上限（3次）
建议明天再爬取，或使用其他账号
```

### 4. 防风控配置（memory.json）

```json
{
  "forumCredentials": {
    "bestblackhatforum.com": {
      "username": "",
      "password": "",
      "lastLogin": 1738598400000,
      "loginCount": 2,
      "cookies": [...],
      "localStorage": {...},
      "sessionValid": true
    }
  },
  "antiDetection": {
    "viewport": { "width": 1920, "height": 1080 },
    "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "timezone": "Asia/Shanghai",
    "locale": "en-US",
    "randomDelayRange": [5000, 30000],
    "maxLoginPerDay": 3,
    "reuseSession": true,
    "sessionExpiryHours": 24
  }
}
```

### 5. Claude 工具使用指令（必须执行）

**每次使用 edge-knowledge skill 时，必须按以下顺序执行：**

#### 步骤 1：读取 memory.json（必须第一步执行）
```
使用 Read 工具读取：/c/Users/24342/.claude/skills/edge-knowledge/memory.json
```

**检查内容**：
- `forumCredentials` - 查看是否有已保存的账号密码
- `crawledResources` - 查看哪些链接已经爬取过
- `antiDetection` - 获取防风控配置
- `userPreferences.favoriteForums` - 查看用户偏好的论坛

#### 步骤 2：检查是否需要登录
如果论坛需要登录（如 BestBlackHatForum），检查 `forumCredentials` 中是否有该论坛的账号：

**场景 A：有账号且会话有效**
```
✅ 检测到已保存的账号：weihacking
✅ 会话有效期：24小时
✅ 今日登录次数：2/3
✅ 直接使用已保存的会话
```

**场景 B：有账号但会话过期**
```
⚠️ 会话已过期（超过24小时）
✅ 使用已保存的账号重新登录
```

**场景 C：无账号**
```
🔐 需要登录凭证
论坛 bestblackhatforum.com 需要登录才能访问内容。
请提供您的账号密码：
- 用户名:
- 密码:
```

#### 步骤 3：保存账号密码（用户提供后）
使用 Edit 工具更新 memory.json：
```json
{
  "forumCredentials": {
    "bestblackhatforum.com": {
      "username": "用户提供的用户名",
      "password": "用户提供的密码",
      "lastLogin": 当前时间戳,
      "loginCount": 1,
      "cookies": null,
      "localStorage": null,
      "sessionValid": false
    }
  }
}
```

#### 步骤 4：爬取时应用防风控配置
从 memory.json 的 `antiDetection` 中读取配置，并在爬取脚本中应用：
- **固定 Viewport**: 1920x1080
- **固定 User-Agent**: Chrome 120
- **随机延迟**: 5-30秒
- **最大登录次数**: 3次/天

#### 步骤 5：检查是否已爬取
在爬取前，检查 `crawledResources` 数组，避免重复爬取：
```
如果 URL 在 crawledResources 中：
  ✅ 跳过该链接（已爬取过）
否则：
  🔄 开始爬取
```

#### 步骤 6：更新 crawledResources
爬取成功后，使用 Edit 工具更新 memory.json，添加新的资源：
```json
{
  "crawledResources": [
    {
      "url": "https://bestblackhatforum.com/Thread-...",
      "title": "帖子标题",
      "forum": "bestblackhatforum.com",
      "timestamp": 当前时间戳,
      "hash": "URL的MD5哈希"
    }
  ]
}
```

## 论坛知识库

### 你可以推荐这些论坛，或者根据用户的意图自动识别推荐其他“边缘知识”论坛

- **Reddit** (10/10) - 免费 - 价值藏在评论区里
- **BestBlackHatForum** (9.5/10) - 免费 - 推荐看slenderman的帖子

| 排名 | 论坛 | 评分 | 成本 | 适合人群 |
|------|------|------|------|----------|
| 1 | GreyHatMafia | 9.5/10 | 免费 | 所有人 |
| 2 | AffLIFT | 9.5/10 | $20/月 | Affiliate新手到进阶 |
| 3 | StackThatMoney | 9.5/10 | $99/月 | 专业Affiliate |
| 4 | SEO Isn't Dead | 9/10 | 免费 | SEO从业者 |
| 5 | iAmAffiliate | 9/10 | $50/月 | 高级Affiliate |
| 6 | BlackHatWorld | 8.5/10 | 免费 | 综合营销 |
| 7 | BossCourses | 8.5/10 | $35/课程 | 课程学习者 |
| 8 | WickedFire | 8/10 | 免费 | Affiliate新手 |
| 9 | Affiliate World | 8/10 | $99/月 | 高端Networking |
| 10 | Cracked.to | 7.5/10 | 免费 | 工具需求者 |
| 11 | OneHack | 7.5/10 | 免费 | 技术+营销 |
| 12 | Digital Point | 7/10 | 免费 | 新手入门 |
| 13 | Warrior Forum | 7/10 | 免费 | 产品调研 |
| 14 | Nulled.to | 7/10 | 免费 | 工具需求者 |



## 工作流程

### 阶段1：推荐论坛（意图驱动 + 泛化扩展）

系统**动态从用户查询中提取核心意图**，然后泛化扩展成多个搜索点/导航方向，确保覆盖主流 → 边缘 → 免费/高性价比 → 风险/黑灰产的全谱系。——必须先执行此阶段！ 如果用户查询太泛（如“2026 赚钱”“副业推荐”），先询问：“你想挖掘哪类边缘知识？如刷粉服务、信息差套利、黑帽 affiliate、SMM panel 等？请具体一点。”

**重要：无论用户如何表述“使用 edge-knowledge 挖掘XX”，你都必须先完成阶段1的全流程（意图提取 → 泛化扩展 → 推荐论坛列表 → 输出给用户确认），不得直接跳到爬取或报告生成。** **在输出推荐论坛列表后，必须停下来询问用户：“这些方向对吗？想重点爬哪些论坛/关键词？（可指定额外）”** **只有用户回复确认或指定调整后，才进入阶段2。**

#### 核心流程（Agent 必须执行）
1. **意图提取**（15–30 秒思考）：
   - 核心主题：（e.g. INS刷流量刷粉丝服务）
   - 关键修饰：高性价比、高好评、真实、免费、风险低、黑帽/灰产技巧等
   - 隐含需求：服务推荐、实战案例、评论反馈、替代方案、工具/脚本、风险警示
   - 泛化关键词：INS流量、Instagram growth、刷粉、买粉丝、organic growth、黑帽增长、affiliate INS 等（中英混用）

2. **意图泛化扩展**（自动生成 4–8 个搜索变体）：
   - 示例（用户查询：高性价比高好评的INS刷流量刷粉丝服务）：
   
        \- 维度1：高性价比 / 高好评服务推荐     关键词示例： "high quality INS followers service" "best cheap Instagram growth panel" "real reviews INS followers buy"
   
        \- 维度2：真实用户反馈 / 风险低 / 掉粉率低     关键词示例： "INS followers real review" "low drop Instagram growth service" "legit cheap followers feedback"

        \- 维度3：灰产 / 黑帽替代技巧     关键词示例： "INS followers blackhat method" "Instagram growth gray hat" "buy real followers blackhatworld"
   
        \- 维度4：免费 / 有机增长替代方案     关键词示例： "free Instagram growth hacks" "organic followers 2025" "no paid panel INS growth"
   
        \- 维度5：工具 / 自动化脚本 / panel 资源（可选，如果用户意图偏工具）     关键词示例： "Instagram automation tool free" "SMM panel cheap" "INS followers bot review"
   
        **注意**：这些维度用于指导推荐论坛。只选 2–3 个最匹配用户意图的维度使用。
   
3. **自动匹配论坛 + 优先级**：
   - 根据意图强度，优先推荐对应论坛（从知识库的三大类中拉）：
     - 高性价比/好评/真实反馈 → Reddit (r/socialmedia, r/InstagramMarketing 等) + BlackHatWorld 评论区
     - 黑帽/灰产技巧 → BlackHatWorld、GreyHatMafia、Nulled.to
     - 联盟/实战案例 → AffLIFT、StackThatMoney、iAmAffiliate
     - 免费工具/资源 → OneHack、Cracked.to、BossCourses
   - 默认推荐 3–5 个论坛，按相关度 + 活跃度排序（可记忆用户偏好调整）

4. **输出给用户**（确认阶段）：
   - 列出提取的意图 + 泛化搜索点示例
   
   - 推荐论坛列表（带理由）
   
   - 询问：“这些方向对吗？想重点爬哪些论坛/关键词？（可指定额外）”
   
     
### 额外采集提示（阶段1 必须询问用户是否需要）
有些高价值论坛的核心内容（高赞回复、完整案例、工具链接、slenderman 等大佬私帖）可能被反爬、付费墙或登录限制挡住，单纯 browser-use 爬公开页面容易只抓到水帖。

我可以帮你尝试以下方式来提升挖掘深度，你告诉我需要哪些（可多选）：

1. **使用付费/低成本 API 或 MCP（Marketplace Crawler Proxy）**  
   - 如 ScrapingBee、Bright Data、ZenRows、Oxylabs 等付费代理 + headless browser API（绕 Cloudflare、指纹检测）  
   - 或免费/低成本的 2Captcha / Anti-Captcha 解决验证码  
   → 需要我帮你推荐具体服务商 + 价格区间 + 如何接入吗？

2. **模拟登录采集**  
   - 如果你有论坛账号，我可以指导你提供 cookie 或登录流程（通过 browser-use 注入 cookie 绕过登录墙）  
   → 你有账号吗？愿意提供 cookie 吗？（注意隐私风险，我不会保存）

3. **搜索 Telegram / Discord / 私人群组 / 镜像站**  
   - 很多论坛大佬会把核心内容转帖到 Telegram 频道、Discord 服务器或镜像论坛  
   → 需要我用 web_search / x_keyword_search 找相关群组/频道链接吗？

4. **直接搜索已泄露/归档内容**  
   - 用 Wayback Machine、archive.today、Google cache 找历史版本（绕当前反爬）  
   - 或搜索“slenderman BlackHatWorld 2025 泄露”“INS刷粉服务 完整线程 txt”  
   → 要我优先搜这些归档/泄露资源吗？

5. **用户手动提供入口**  
   - 如果你已经知道具体线程 URL 或关键词，我可以直接从那里开始爬取，避免盲目搜索  
   → 你有想重点挖的帖子链接吗？

请回复告诉我你想用哪些方式（例如“1+3”或“帮我搜 Telegram 群”），或者直接说“先用默认 browser-use 爬公开页面也行”。  
确认后我们再进入阶段2。

### 爬取量约束（防止 token 爆炸 & 效率优先）
为了避免上下文过载和 token 爆炸，本 Skill 强制执行以下上限（Agent 必须严格遵守）：

- **推荐论坛数量**：默认 3–5 个（阶段1 确认后最多不超过 5 个）
- **每个论坛爬取帖子数**：最多前 10–15 个相关帖子（优先高赞/最新/相关度排序）
- **每个帖子收集评论数**：前 10–20 条高赞/最新评论（优先 upvotes > 50 或作者知名如 slenderman）
- **browser-use 操作步数**：每个论坛总操作不超过 15 步（open → screenshot → state → click → scroll → screenshot → extract 等）
- **总截图数量**：整个流程不超过 10–15 张（每论坛 2–3 张关键图：概览 + 1–2 个核心帖子评论区）
- **JSON 提取规模**：总 posts 数量不超过 30–50 条（超过时自动截断，只保留最高价值 30 条）
- **分析输出限制**：
  - 边缘知识：最多提取 10–15 条（优先新鲜度高、稀缺性强、有数据支撑的）
  - 骚人：最多识别 5–8 个（优先高能观点多、活跃度高的用户）
  - 资源：最多提取 10–15 个（优先链接有效、评价积极/负面明确的）

**超限处理**：
- 如果爬取量已接近上限，Agent 必须停止进一步展开，并提示用户：“已达到爬取上限（X 个帖子/Y 个评论），是否继续深入某个具体帖子？或结束生成报告？”

- 优先级排序：始终按相关度 > 时效性（2025年后） > 稀缺性 > 可信度 截断低价值内容

  
### 阶段2：智能爬取（使用 browser-use）

**用户确认论坛后，你必须严格限定爬取范围在用户确认的 3–5 个论坛内。**
**严禁在阶段2 直接使用 web_search 进行全局/广义搜索！**

用户确认后，你应该：

1. 使用 browser-use 技能打开每个论坛
2. 截图页面，使用视觉识别理解页面结构
3. 提取帖子列表
4. 点击进入帖子，提取内容
5. 收集评论（前10条高赞评论）

---

**🛡️ 反爬技术：最小解决路径**

1. **优先访问公开页面**
   - 从首页开始，而不是直接访问需要登录的板块
   - 例如：`https://www.blackhatworld.com/` 而不是 `https://www.blackhatworld.com/forums/123/`

2. **使用真实的 User-Agent**
   - 不要使用默认的 `HeadlessChrome` 标识
   - 使用最新的 Chrome/Firefox User-Agent

3. **模拟人类行为**
   - 随机延迟（2-4秒）
   - 随机鼠标移动
   - 滚动页面

4. **处理动态加载**
   - 等待 `networkidle` 而不是 `load`
   - 使用 `page.wait_for_selector()` 等待元素加载

5. **保存截图**
   - 每次爬取都保存截图，方便调试
   - 使用 `full_page=True` 保存完整页面



**爬取流程**：

本 Skill 强依赖多层信息获取工具，设计时已考虑 Brave Search 速率限制（默认 1 req/s）和论坛反爬特性。所有搜索/提取流程必须严格遵守以下规范，避免限流、token 爆炸或低质量结论。

### 可用工具简述
- `browser` / `browser-use`：浏览器交互（JS 渲染、需要点击/分页/懒加载/表格/验证码绕过）。**本 Skill 首选工具**，支持截图 + 视觉识别 + 智能点击。
- `agent-browser`（Vercel agent-browser 或 SawyerHood/dev-browser 等兼容 Skill/CLI）：备用/增强版浏览器自动化。支持引用式元素选择（@e1/@e2）、snapshot -i（只取可交互元素，省 90%+ 上下文）、多步脚本化操作。适合重复性强或需要结构化提取的场景。

用户确认论坛后，你**必须严格限定爬取范围在用户确认的 3–5 个论坛内**。  
**严禁使用 web_search 进行任何搜索！**（已移除此工具，避免无效全局搜和跑偏）

爬取方式：**必须用 browser-use / agent-browser 模拟人类操作**，包括打开首页、表单搜索、点击帖子、滚动评论等。

#### 通用爬取流程（所有论坛必须执行）
1. browser-use open [论坛首页或搜索页 URL]
2. browser-use screenshot overview.png
3. browser-use state  # 检查页面结构、输入框、按钮
4. 如果有搜索表单：
   - browser-use type "[关键词，如 AI money making 2026]" --selector "input[name=keywords]" 或类似
   - browser-use click --selector "button[type=submit]" 或搜索图标
   - browser-use wait 3000  # 等待结果加载
5. browser-use screenshot results.png
6. 提取帖子列表（extract text --selector ".thread-title" 或类似）
7. 点击进入高价值帖子（click <index> 或 @eX）
8. 滚动加载评论（scroll down 多次）
9. browser-use screenshot post_comments.png
10. 提取内容/评论（get html 或 extract text --selector ".post-content"）
11. 收集前 10–20 条高赞/最新评论

#### 不同论坛的爬法示例
- **BlackHatWorld**：
  - 首页：https://www.blackhatworld.com/forums/
  - 搜索页：https://www.blackhatworld.com/search/
  - 输入框 selector：#QuickSearchQuery 或 .search-input
  - 提交：click .search-submit 或 Enter 键模拟
  - 帖子标题 selector：.thread-title

- **BestBlackHatForum (BBHF)**：
  - 搜索页：https://bestblackhatforum.com/search.php
  - 输入框：input[name=keywords]
  - 提交：button[type=submit] 或 .search-button
  - 结果页帖子：.thread-title 或 .forum-thread

- **Reddit 子版（如 r/socialmedia）**：
  - 搜索页：https://www.reddit.com/r/socialmedia/search/
  - 输入框：#search-input 或直接在首页搜索栏
  - 结果：.Post 或 .search-result

- **Warrior Forum / AffLIFT / GreyHatMafia**：
  - 先 open 首页 → 找搜索图标或 /search 路径
  - type 关键词 → click submit
  - 如果卡登录墙：报告原因，引导用户提供 cookie

#### 失败处理规则（必须执行）
- 如果  失败（403、Cloudflare、验证码、登录墙、内容为空、水帖多）：
  1. 立即截图失败页面
  2. 报告具体原因：“论坛 [名称] 搜索/爬取失败，原因：[验证码/登录墙/反爬/无结果]。公开内容价值低。”
  3. 引导回阶段1 额外采集方式：“建议使用付费 API 代理（如 ScrapingBee）、提供 cookie 登录，或搜索 Telegram/Discord 群组补充。需要我帮你推荐哪种？”
  4. **不继续爬该论坛**，直接跳下一个确认论坛，或结束当前流程。

遵守以上规范，能最大限度避免无效爬取、token 浪费和低质量输出。



### 阶段3：内容分析

将爬取的内容整理成JSON格式：

```json
{
  "posts": [
    {
      "title": "帖子标题",
      "author": "作者名",
      "url": "帖子链接",
      "content": "正文内容",
      "comments": [
        {
          "author": "评论者",
          "content": "评论内容",
          "upvotes": 123
        }
      ]
    }
  ]
}
```

然后进行三层分析：

#### 1. 边缘知识识别——必须严格执行三层分析！

 **无论主题多泛，你都必须先把爬取内容整理成 JSON，然后输出以下三种结构化分析，严禁使用其他格式！** - 必须输出边缘知识识别（10–15 条以内） - 必须输出骚人识别（5–8 个以内） - 必须输出资源提取（10–15 个以内） - **如果爬取内容不足以产生边缘/骚/资源分析，立即回复：“当前论坛公开内容价值低，无法提取边缘知识。请确认是否使用额外采集方式（API/登录/Telegram）？”** - **报告中必须包含原始来源链接、用户名、帖子标题，否则视为无效输出。**

```markdown
### 边缘知识 #1: [知识标题]

**压缩表达**: [一句话总结]

**容易理解的解释**: [详细解释]

**观点罗列**:
- @用户名: "观点内容"

**风险**: [潜在风险]

**成本**: [时间/金钱/学习成本]

**来源链接**: [原始链接]
```

#### 2. 骚人识别

```markdown
### 骚人 #1: @用户名

**用户名**: 用户名 (论坛名)

**高能观点**:
- "观点1"
- "观点2"

**链接**: [用户主页链接]
```

#### 3. 资源提取

```markdown
### 资源 #1: [工具/服务名称]

**名称**: 工具名

**链接**: [工具链接]

**描述**: [功能描述]

**价格**: [价格信息]

**评价**: [用户评价摘要]
```

### 阶段4：生成报告

\- 输出格式**必须**包含三层分析的完整 Markdown 结构（边缘知识、骚人、资源） - 报告开头必须写：“本报告基于 [论坛列表] 的深度爬取，仅提取边缘/灰产/稀缺知识” - 严禁输出主流鸡汤、白帽建议、权威文档等通用资源 - 如果分析结果太“白”，必须说明：“当前公开内容多为水帖，未挖到高价值边缘知识，建议升级采集方式。”

- 文件名格式：`YYYYMMDD_主题.md`
- 例如：`20260203_INS营销流量骚招.md`

## 使用示例

### 用户请求
```
使用 edge-knowledge 挖掘高性价比高好评的INS刷流量刷粉丝服务
```

### 你的响应流程

1. **推荐论坛**
```
我为您推荐以下论坛来挖掘INS营销相关的边缘知识：

1. **Reddit r/socialmedia**
   - 社交媒体营销讨论
   - 活跃度: high

2. **BlackHatWorld**
   - 黑灰帽营销技巧
   - 活跃度: high

...

您想爬取这些论坛吗？
```

2. **用户确认后，开始爬取**
```
好的，我现在使用 browser-use 技能开始爬取这些论坛...
```

3. **使用 browser-use 爬取**
- 打开每个论坛
- 截图页面
- 提取帖子
- 收集评论

4. **分析内容**
- 识别边缘知识
- 识别骚人
- 提取资源

5. **生成报告**
```
✅ 报告已生成：20260203_INS营销流量骚招.md

共发现：
- 12个边缘知识
- 8个骚人
- 15个工具/服务资源
```
### 记忆系统（memory_manager）
- 必须在阶段1 开始前加载 memory.json
- 如果 favoriteForums 不为空，优先推荐这些论坛，并说明“根据你的历史偏好”
- 爬取前检查 crawledResources，避免重复爬已记录的 URL
- 每次爬取成功后，更新 crawledResources（添加新线程 URL + hash + timestamp）
- 用户多次偏好某个论坛后，自动添加到 favoriteForums

## 技术架构

### 依赖的 Claude 工具

本 Skill 使用以下 Claude 工具：

- **Read** - 读取 memory.json、查看已爬取的资源
- **Edit** - 更新 memory.json（保存账密、更新 crawledResources）
- **Write** - 创建 Python 爬虫脚本、生成最终报告
- **Bash** - 运行 browser-use 命令
- **browser-use skill** - 智能浏览器自动化（首选）

### 数据流
```
用户需求 → 读取 memory.json → 推荐论坛 → 用户确认 →
检查账密 → 应用防风控配置 → browser-use爬取 →
Claude分析 → 生成报告 → 更新 memory.json
```

## 注意事项

1. **使用 browser-use 而不是简单爬虫**
   - 可以处理动态加载的内容
   - 可以绕过反爬虫机制
   - 可以使用截图+视觉识别理解页面

2. **记忆系统**
   - 记住用户喜欢的论坛
   - 避免重复爬取相同资源

3. **报告格式**
   - 单一Markdown文档，无论多长的文档，你只需要生成一个，不需要生成另外的摘要文档
   - 按日期+主题命名
   - 结构化展示（边缘知识、骚人、资源）

4. **不要生成多余文档**
   - 只生成最终报告
   - 不要生成README、总结等文档
   - 报告必须以“三层分析”为核心

5. **Windows 兼容性问题**
   - 使用 WSL（Windows Subsystem for Linux）