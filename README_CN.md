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
cp -r edge-knowledge ~/.claude/skills/
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
