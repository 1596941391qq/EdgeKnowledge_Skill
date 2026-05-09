# CDP 爬虫脚本集

> 依赖 Chrome 调试端口 9222
> 使用方式: node cdp-xxx.mjs [ws_url] [target_url] [output_file]

## 脚本清单

| 脚本 | 用途 |
|------|------|
| `cdp-crawler.mjs` | 通用页面爬取 |
| `cdp-extract-threads.mjs` | BHW/BBHF 帖子列表提取 |
| `cdp-bbhf-threads.mjs` | BBHF 专用帖子采集 |
| `cdp-extract-all.mjs` | 全站通用提取 |
| `cdp-buildersociety.mjs` | Builder Society 论坛采集 |
| `cdp-buildersociety-v2.mjs` | Builder Society v2 |
| `cdp-batch-bbhf.mjs` | BBHF 批量采集 |
| `bhw-crawler.mjs` | BlackHatWorld 基础爬取 |
| `bhw-crawler-v2.mjs` | BHW 改进版 |
| `bhw-detail-crawler.mjs` | BHW 详情页爬取 |
| `bhw-backlink-scrape.mjs` | BHW 外链资源提取 |
| `bhw-vendor-verify.mjs` | BHW 供应商验证 |
| `scrape-onehack.mjs` | OneHack 爬取 |

## 使用示例

```bash
# 获取可用 Chrome 调试页面列表
curl http://localhost:9222/json/list

# 运行帖子提取脚本
node cdp-extract-threads.mjs \
  "ws://localhost:9222/devtools/page/xxx" \
  "https://www.blackhatworld.com/seo/" \
  "output.html"
```

## CDP 连接 URL 格式

```
ws://localhost:9222/devtools/page/[页面ID]
```

获取页面列表:
```bash
curl http://localhost:9222/json/list | jq
```
