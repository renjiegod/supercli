# v0.2.0 设计与交互验收

2026-10-20，本地预览 http://127.0.0.1:5180/，Ego TaskSpace 17。

## 设计流程与交付

方向比较和品牌规则见 DESIGN.md；页面路径、交互与状态矩阵见 EXPERIENCE.md。选择蓝白编辑式目录，统一厂商与个人维护者工具的发现入口。品牌页是真实构建入口，不是图片原型；首页、分类、详情与贡献入口全部连接实际内容。

交付主标记、单色标记、组合字标 SVG，替换 favicon 与分享卡图形；不修改厂商自身品牌资产。小图标在 16 / 24 / 32px 展示，可从品牌页下载源文件。

## 功能与响应式

| 检查                         | 结果                                                                     |
| ---------------------------- | ------------------------------------------------------------------------ |
| 首页 390 / 768 / 1280 / 1600 | 1 / 2 / 3 / 4 列，无横向溢出，所有卡片标题宽度 ≥ 80px                    |
| 品牌页四阶视口               | 无横向溢出，组件与页面流程自然折列                                       |
| 真实首屏工具                 | Wrangler / GitHub CLI / ripgrep，来自 catalog 与 metrics，无虚构 PR 活动 |
| 用途入口                     | 云平台点击后选中 cloud，显示 13 项并滚动到目录                           |
| 空结果 / 重置                | 无匹配显示空态；重置恢复 90 项并聚焦搜索                                 |
| 详情直达                     | `?tool=wrangler&category=cloud` 自动打开 Wrangler                        |
| 关闭详情                     | Escape 与关闭按钮关闭；删除 tool，保留 category                          |
| 未知详情                     | 删除无效 tool，保留 q，提示尚未收录                                      |
| 剪贴板失败                   | 浏览器内故障注入后真实点击，打开详情、显示完整命令与手动复制提示         |
| 手机详情 / 排行说明          | 真实点击打开，无内部横向溢出                                             |
| 品牌反馈与输入               | 反馈明确标注演示；特殊字符作为文本显示                                   |
| 减弱动效                     | 模拟 prefers-reduced-motion，重播与详情运行位移动画均为 0                |
| 运行时                       | agent-eyes errors.log 无错误，浏览器未捕获 error / exception             |

## 工程与视觉

- `pnpm build`：类型、90 条数据、14 项原有回归、双 HTML 构建全部通过。
- contrast-guard：21 组全部通过，包含新用途入口与深色复制按钮；最低比值 4.52:1。
- 独立评审 passed=true，无安全或逻辑阻塞项；采纳建议，首屏标明 Wrangler 安装命令。
- CSS 模块均不超过 300 行；不新增字体、动效框架或组件库依赖。
- 视觉计量 before / after：前四字号覆盖率 95.5% / 95.2%，字体族 2 / 2，动效时长组合 2 / 3。无意靠增加动效覆盖率刷分，动效重点解释交互。
- 本地 vlm 首屏审查无截断；其关于导航不对齐的意见与 DOM 对齐及截图左边界一致的证据不符，未盲改。品牌页复审未发现明确视觉硬伤。
- 截图：home-desktop.png、home-mobile.png、brand-identity.png。量化原始数据：ui-before.json、ui-after.json。

## 边界

本轮未增加账号、投票、自动审核、自动合并与定时任务；未虚构列表加载态。弹窗使用原生即时退出，没有为了退场动画延迟焦点回归。组合字标使用系统 sans 字体回退；图形本身为完整矢量。

线上 Scorecard 与部署验收在发布后补记，分别报告仓库与网页分数，不混算。

## 发布与线上回读

- 代码：c083d5f，annotated tag v0.2.0；GitHub release 附静态站点 ZIP。
- Cloudflare Pages 部署：https://e1bfbc70.supercli.pages.dev；正式域名 https://supercli.site/。
- 正式首页四阶视口复验：无溢出，1/2/3/4 列，标题宽度均 ≥80px；90 条目录与新版首屏正常。
- 正式品牌页四阶视口复验：无溢出，品牌蓝 computedStyle 为 rgb(0,47,167)。GitHub CLI 详情真实点击打开、Escape 关闭，品牌页演示可操作。
- 未知路径仍为 HTTP 404；已加载图片中没有损坏图片。
- Cloudflare 注入的第三方 insights beacon 被现有 `script-src self` 阻止；产品自有模块与 CSS 正常加载，无产品 JS 异常。未为非核心统计放宽 CSP。
- 本地 5179 主检出已更新到发布代码；5180 设计 worktree 预览在交付后停止。

## 用户自建 Scorecard

使用 `/Users/webkubor/dev/agent-infra/scorecard/bin/scorecard.mjs` 的 `--fresh` 复测正式域名。网页分数 **7.2/10**，原始 Markdown 见 scorecard-page.md；沿用引擎原始结果，不进行二次折算。引擎 Markdown 的“/9”为其原有呈现问题，JSON score 为 0–10 分。

仓库 fresh 复测先连接失败，重试后 90 秒超时，**本轮没有新的仓库分数**。不把上一版结果冒充本轮结果。

网页剩余项包括 apple-touch-icon、favicon.ico、JSON-LD 与新鲜度响应头。引擎认为 sitemap 两条 URL 过少，但本站真实入口就是首页与品牌页，不为分数生成虚假页面；已有可正常加载的 SVG favicon，“标签页空白”不符合浏览器实况。WebMCP 不是本静态目录的功能范围。

## 流程记录

`cs land --no-cleanup` 完成主干合入。合入时自动飞书通知返回 Bot Not Enabled，已记入 cs retro；发布、站点与 GitHub release 不受影响。
