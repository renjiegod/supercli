# 双语、SEO 与 GEO

本站提供独立中文 `/` 与英文 `/en/`，标准和品牌页也有对应语言版本。语言 URL 保留筛选、排序和当前工具；不按浏览器语言强制重定向。

## 当前实现

- `data/catalog.json` 保持收录事实真源；`data/catalog.en.json` 按稳定 ID 提供英文说明。新增工具必须同时补齐英文说明，测试检查完整性。
- `data/ui.en.json` 翻译界面静态片段；模板插值不进入翻译过程，继续保留外部信息的 HTML 转义。核验记录保持原文绑定，展示翻译不改变核验结论。
- 构建输出双语目录、标准、品牌与独立工具页；正文、标题、摘要、canonical、双向 hreflang、JSON-LD 均在静态 HTML 中。目录运行后仍保留真正的工具链接，支持爬取与新标签页打开。
- 每个工具有 `/tools/<id>/` 和 `/en/tools/<id>/`，X 分享及详情复制使用这些链接。筛选 URL 的 canonical 指向对应语言主页面。
- X 分享打开可编辑的发布页，由用户确认发送。Open Graph / Twitter 元信息使用 1200×630 PNG，来自仓库已有品牌 SVG。
- `/sitemap.xml` 自动生成全部双语页面；`/catalog.json` 提供双语用途、原始来源、核验范围和数据快照时间；`/llms.txt` 提供补充检索入口。机器索引不导出本机安装状态。
- `pnpm build` 校验全部静态路径、语言标记、canonical、分享元信息、JSON-LD、图片与脚本资产。

## 后续优先级与验收

1. owner 发起的改动验收后直接合入 main；社区外部投稿经人工审核后合并。部署后验证线上双语页面、工具分享页、PNG、站点地图、robots.txt 与机器索引均可访问，且 Cloudflare 未拦截爬虫。本地构建成功不代表已上线。
2. Google Search Console 域名验证与站点地图提交已完成，结果见下方记录。后续抽查中英文首页和工具页的抓取、canonical 与索引状态；站点地图读取成功不等于网页已被索引。
3. 使用真实任务意图补充内容：按工具逐条核对平台、依赖、账号及费用前提，公开出处与核验时间，再制作有依据的比较和场景页面。避免批量生成无来源页面。
4. 记录上线基线，观察 Search Console 的曝光、点击、查询、国家和语言页面分布。GEO 使用固定问题集抽查答案是否引用本站、引用哪个工具页、内容是否准确；区分“可抓取”和“已被引用”。

## Search Console 提交记录

2026-10-21（Asia/Taipei）完成以下操作：

- 资源：`sc-domain:supercli.site`，覆盖整个域名；Google 界面确认“已完成所有权验证”。
- 验证方式：域名提供商 DNS TXT。在 Cloudflare 新增独立的 Google 验证记录，已从权威 DNS 与 Google 公共 DNS 回读；保持该记录以维持验证状态，验证值不写入仓库。
- 已提交：`https://supercli.site/sitemap.xml`。Google 界面确认“已成功提交站点地图”，列表显示状态“成功”、已发现网页 **188**、已发现视频 **0**；提交与上次读取日期均为 2026-10-21。
- `robots.txt` 已声明该站点地图，线上 XML 返回 200，包含 188 个双语网址。
- 当前索引与效果报告提示“正在处理数据，请过 1 天左右再来查看”；尚未确认网页索引数量、搜索曝光或 AI 引用效果。

回读入口：[Search Console 站点地图](https://search.google.com/search-console/sitemaps?resource_id=sc-domain%3Asupercli.site)。后续内容更新由构建自动刷新同一站点地图地址，无需因每次新增工具而重复添加资源。

Google 的 AI Overviews / AI Mode 沿用 SEO 基础要求，不要求专用 AI 文件或特殊结构化标记；`llms.txt` 仅是补充发现入口，不作为排名或 AI 引用承诺。结构化数据应与可见正文一致。

参考：[Google 多语言版本规范](https://developers.google.com/search/docs/specialty/international/localized-versions)、[Google AI 功能与站点规范](https://developers.google.com/search/docs/appearance/ai-features)。
