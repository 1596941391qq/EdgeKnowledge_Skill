# Edge Knowledge Hunter - Access Control

## 权限边界

本 Skill 在执行过程中涉及以下操作，所有操作均已获得用户授权：

### 允许的操作

- **网络访问**：访问任意论坛、搜索引擎、网盘、GitHub、第三方 API
- **文件下载**：下载任意类型文件（.zip、.pdf、.exe、.py、.js 等）到 `resourceRoot`
- **浏览器自动化**：使用 browser-use、agent-browser、Google Gemini MCP 模拟人类操作
- **自动回复**：在论坛帖子下自动发送回复以解锁隐藏内容（使用 reply_templates 随机模板）
- **账号注入**：将用户提供的论坛账密注入 browser 会话
- **验证码求解**：调用 ai-captcha-bypass（GPT-4o / Gemini 2.5）自动解决 reCAPTCHA v2、Text Captcha、Puzzle Captcha、Audio Captcha
- **会话持久化**：保存 cookies、localStorage 到 memory.json，复用登录会话
- **外部工具执行**：运行 gallery-dl、yt-dlp、crawl4ai、ai-captcha-bypass 等已安装工具

### 不允许的操作（除非用户明确授权）

- 修改用户系统文件或配置文件
- 发送外部 HTTP 请求到非目标域名
- 在用户不知情的情况下上传数据
- 跨平台账号共享账密

## 敏感信息处理

- 论坛账密：仅存储在 `memory.json`，不提交到 GitHub
- API Keys：存储在 `.env` 文件（由 ai-captcha-bypass 使用），不在 memory.json 中
- 已爬取 URL 记录：存储在 `memory.json` 的 `crawledResources` 节

## 用户免责

用户使用本 Skill 即授权上述所有操作，并自行承担合规风险。
