# 网页质检报告 · https://supercli.site/

**7.2 / 9** — 可访问、需补 AI 端
*基础可用，但 AI 友好性还差一截*

站点类型 `webpage` · HTTP 200 · TTFB 113ms · 生成于 2026-10-20 10:51

九维标准独立于 scorecard 的 GitHub 仓库与 npm 包质检 —— 网页有自己的判据集：
评的不是"代码好不好"，是"站点对人类与 AI 助手是否都友好"。

## 记分卡

| 维度 | 得分 | | 最该补的一件事 |
|---|---:|---|---|
| 可访问性 | 9 | `█████████░` | — |
| SEO 基础 | 10 | `██████████` | — |
| 内容结构 | 9 | `█████████░` | — |
| AI 识别 | 6.7（按可核实的 7.5 分归一化） | `███████░░░` | 没有 schema.org JSON-LD 或没有 AI 友好的类型 |
| 爬虫根目录 | 4.5 | `█████░░░░░` | sitemap.xml 只有 1 个 URL —— 几乎等于没写，搜索引擎能抓的页面数被卡死 |
| 安全响应头 | 9 | `█████████░` | — |
| 性能 | 9 | `█████████░` | — |
| WebMCP 友好性 | 4（按可核实的 2.5 分归一化） | `████░░░░░░` | — |
| 内容质量 | 4 | `████░░░░░░` | 没有 Last-Modified 响应头 —— 缓存与新鲜度信号弱 |

## 整改清单

按维度得分升序 —— 排在前面的影响最大。

1. **[内容质量 4]** 没有 Last-Modified 响应头 —— 缓存与新鲜度信号弱
2. **[爬虫根目录 4.5]** sitemap.xml 只有 1 个 URL —— 几乎等于没写，搜索引擎能抓的页面数被卡死
3. **[爬虫根目录 4.5]** 没有 favicon.ico —— 浏览器标签页空白
4. **[爬虫根目录 4.5]** 没有 apple-touch-icon.png
5. **[AI 识别 6.7]** 没有 schema.org JSON-LD 或没有 AI 友好的类型

## 逐维度证据

每条结论都有实际查到的东西支撑，没有"有待完善"这种没法行动的话。

### 可访问性 — 9/9

- ✅ HTTPS
- ✅ HTTP 200
- ✅ 无重定向
- ✅ TTFB 113ms
- ⚠️ 自动判不了，需人工或 AI 判断：真实浏览体验（CDN 边缘节点的延迟本报告未算）

### SEO 基础 — 10/9

- ✅ title: "SuperCLI — 发现值得装进终端的工具…"（22 字符）
- ✅ meta description 存在
- ✅ 有 og:title
- ✅ 有 og:description
- ✅ 有 og:image: https://supercli.site/social-card.svg
- ✅ canonical 一致（https://supercli.site/）
- ✅ 有 viewport meta
- ✅ 有 twitter:card
- ⚠️ 自动判不了，需人工或 AI 判断：站内链接权重分配（PageRank 这类指标本报告不算）

### 内容结构 — 9/9

- ✅ h1 恰好 1 个
- ✅ h2 有 3 个 —— 结构清晰
- ✅ 标题层级无跳跃
- ✅ 8 个语义化标签（article / main / nav ...）
- ⚠️ 自动判不了，需人工或 AI 判断：关键内容是否在 main landmark 内（需可视化检查）

### AI 识别 — 6.7/9

- ✅ llms.txt 存在且为真 markdown（1413 字符）
- ✅ og:type = website
- ❌ 没有 schema.org JSON-LD 或没有 AI 友好的类型
- ⚠️ 自动判不了，需人工或 AI 判断：llms.txt 内容质量（引擎只判存在与格式，内容语义需人工）

### 爬虫根目录 — 4.5/9

- ✅ robots.txt 放行 AI 爬虫
- ✅ .well-known/security.txt 存在
- ✅ humans.txt 存在（站点人认领口）
- ❌ sitemap.xml 只有 1 个 URL —— 几乎等于没写，搜索引擎能抓的页面数被卡死
- ❌ 没有 favicon.ico —— 浏览器标签页空白
- ❌ 没有 apple-touch-icon.png
- ⚠️ 自动判不了，需人工或 AI 判断：sitemap.xml 是否覆盖全部 URL（XML 内部判断需遍历）

### 安全响应头 — 9/9

- ✅ 有 CSP
- ✅ 有 HSTS：max-age=31536000
- ✅ 有 X-Frame-Options 或 frame-ancestors
- ✅ Referrer-Policy: strict-origin-when-cross-origin
- ✅ X-Content-Type-Options: nosniff
- ✅ 有 Permissions-Policy
- ⚠️ 自动判不了，需人工或 AI 判断：CSP 是否真的有效（语法正确性需要专业工具）

### 性能 — 9/9

- ✅ 响应已压缩：br
- ✅ Cache-Control: public, max-age=0, must-revalidate
- ✅ TTFB 113ms
- ✅ 图片 1 张，无需现代格式
- ✅ HTML 主体 8 KB
- ⚠️ 自动判不了，需人工或 AI 判断：Lighthouse / WebPageTest 完整跑分（本报告只看原始指标）

### WebMCP 友好性 — 4/9

- ⚠️ 自动判不了，需人工或 AI 判断：MCP server 端点是否真的在线（需实际握手）、插件 manifest 的 schema 版本是否符合对应协议规范

### 内容质量 — 4/9

- ✅ 主文本 1011 字符
- ✅ 7 个链接
- ✅ html lang="zh-CN"
- ❌ 没有 Last-Modified 响应头 —— 缓存与新鲜度信号弱
- ⚠️ 自动判不了，需人工或 AI 判断：死链体检（需要遍历所有内链逐个 HEAD）、正文真实性（AI 生成内容占比需要专门的检测器）

---

## 把这份报告交给 AI

复制整份报告，连同站点一起给 Claude Code / Cursor / Copilot，然后说：

```
照这份质检报告改进这个站点。从整改清单第 1 条开始，一次做一条，
每条改完告诉我动了哪些文件、为什么这么改。
标着"自动判不了"的几项，你打开站点后给我你的结论。
```