# Scorecard 项目质检汇总

对象：webkubor/supercli 与 https://supercli.site/ 。工具：用户自己的 webkubor/scorecard，CLI 源码 48c5089，默认实例 https://scorecard.webkubor.online 。分别使用 github / page 两套引擎，整改后均带 --fresh，不混合计分。

| 目标 | 整改前 | 发布后 | 原始报告 |
| --- | ---: | ---: | --- |
| GitHub 仓库 | 4.5 | 8.1 | [前](github-before.md) / [后](github-after.md) |
| 正式网页 | 6.3 | 7.2 | [前](page-before.md) / [后](page-after.md) |

两路 JSON score 均按各自维度的 0–10 分取平均。网页 Markdown 原始模板错误写为 /9，此处保留其原始报告，不把 7.2 再换算。发布后采样时间为 2026-10-20 18:51（UTC+8）。

## 发布证据

- 代码：cb51b895fb7636cbe521cf535542b4f375f88281，已合入 main。
- 版本：[v0.1.1](https://github.com/webkubor/supercli/releases/tag/v0.1.1)，含静态产物 ZIP。
- [手动检查](https://github.com/webkubor/supercli/actions/runs/39410741253)：成功，14 项测试、类型、数据、构建、运行时依赖审计。
- CF Pages 部署：https://febf075b.supercli.pages.dev ，正式域名已生效。
- 正式站实测：90 条目录，详情打开及安装命令复制通过；390/768/1280/1600 四档无横向溢出或标题挤压，90 个图标无加载失败。
- 正式站未知路径为 404；llms.txt、security.txt 为文本；HSTS 生效。
- 浏览器高级点击曾遇坐标拦截，检查 DOM 命中元素后使用同一页面的原生 CDP 输入完成详情和复制验证，没有用程序化 DOM click 代替真实输入。

## 后续清单（非本次发布阻断）

负责人：webkubor；实施：后续执行 Agent。以下保留原始工具读数与人工核实的区别。

- [ ] P2：补充适合目录的 schema.org JSON-LD，让非执行 JS 的消费者更易理解站点。
- [ ] P2：生成真实 apple-touch-icon.png；可补兼容旧客户端的 favicon.ico，继续复用现有品牌几何。
- [ ] P2：后续补真实使用反馈与分发渠道。新项目 0 star 是采用信号，不代表代码不合格，不编造用户量或外部收录。
- [ ] P3：README 徽章可补真实版本与手动检查链接，保持信号真实，不堆装饰徽章。
- [ ] Scorecard 判据：README 已有 git clone + pnpm install --frozen-lockfile；当前安装正则要求 install 后有包名，不能识别项目依赖安装。不为评分添加错误的 npm 发包命令。
- [ ] Scorecard 判据：这是单页目录，目前只有根 URL；一个 sitemap URL 符合当前可访问页面数，不生成假的详情路由。
- [ ] Scorecard 判据：正式站已通过 link rel=icon 指向 /favicon.svg，并非“标签页空白”；引擎只检测 favicon.ico，需要识别实际声明。
- [ ] Scorecard 报告模板：网页分母误写为 9；应与 0–10 平均分口径一致。原始报告已保留。
- [ ] 缓存信号：站点已提供 ETag；Last-Modified 暂未提供，不用静态伪时间冒充真实更新日期。
- WebMCP 不属于当前产品范围，不创建虚假的 MCP/插件 manifest 来换分。

安全修复与独立复审记录见 [质检清单](../QUALITY_REVIEW.md)。PR 仍为人工审核和手动合并，基础检查只接受手动触发。
