# Edge Knowledge Hunter - 边缘知识猎人

AI驱动的边缘知识挖掘系统。针对用户需求，从高价值论坛（Reddit、BlackHatWorld、GreyHatMafia 等）智能推荐 + browser-use 深度爬取 + 视觉识别 + 分析边缘技巧、骚人、资源，并输出单一结构化 Markdown 报告。

## 🎯 核心理念

> **💡 知识平权倡议**
> 本项目鼓励社区贡献！你可以在 Git 上开分支，打造不同领域的搜索专家 skill（如 SEO 专家、Affiliate 专家、工具挖掘专家等），让边缘知识触达更多人。
>
> **🤝 如何贡献 PR**：
> - 🌿 **搭建领域特化分支** - 创建针对特定领域的专家版本（如 `seo-expert`、`affiliate-hunter`）
> - 🔧 **优化原有 skill** - 提高工具的多功能性和鲁棒性（反爬策略、错误处理、性能优化）
> - 📚 **分享高质量论坛** - 在 `forum_database.json` 中添加你在用的深水论坛和搜索策略
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

- 🎯 **意图提取与查询泛化** - 根据用户泛化查询方向及推荐高质量论坛
- 🧠 **用户偏好记忆** - 记住用户喜欢的论坛和搜索习惯
- 🔐 **账密管理** - 自动管理论坛账号密码，支持会话复用
- 🛡️ **防风控系统** - 固定指纹、随机延迟、会话管理，降低账号风险
- 🌐 **智能浏览器爬取** - 使用 browser-use 技能，支持截图+视觉识别
- 🔍 **深度内容分析** - 边缘知识识别、骚人识别、资源提取
- 📊 **单一报告输出** - 按日期+主题命名，结构化展示

## 📦 安装

将此 skill 复制到 Claude Code 的 skills 目录：

```bash
cp -r edge-knowledge-hunter ~/.claude/skills/
```

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

## 🚀 使用方法

### 基本用法

```
使用 edge-knowledge-hunter 挖掘高性价比的INS刷流量服务
```

### 工作流程

1. **阶段1：推荐论坛** - 系统根据你的需求推荐相关论坛
2. **阶段2：智能爬取** - 使用 browser-use 深度爬取论坛内容
3. **阶段3：内容分析** - 识别边缘知识、骚人、资源
4. **阶段4：生成报告** - 输出结构化 Markdown 报告

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
- browser-use skill
- Python 3.8+

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

黑咖啡和冰月亮 (@weihacking)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！
