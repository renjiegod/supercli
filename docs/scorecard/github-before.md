# 开源项目质检报告 · webkubor/supercli

**4.5 / 10** — 能用但门面/发布有欠账

项目类型 `app` · 0 star · 生成于 2026-10-20 18:43

九维度标准来自 [project-maturity-audit](https://github.com/webkubor/scorecard/tree/main/skills/project-maturity-audit)：
评的不是「代码好不好」，是「陌生人会不会在 10 秒内 star、安装、信任它」。

## 记分卡

| 维度 | 得分 | | 最该补的一件事 |
|---|---:|---|---|
| 门面 | 6.5 | `███████░░░` | topics 只有 0 个（应 ≥6，这是被搜到的主要途径） |
| 分发 | 4 | `████░░░░░░` | README 里找不到一条可以照抄的安装命令 |
| 发布工程 | 3 | `███░░░░░░░` | 没有任何 tag —— 用户无法锁定版本 |
| 质量护栏 | 3 | `███░░░░░░░` | package.json 没有 test 脚本 |
| 社区卫生 | 10 | `██████████` | — |
| 文档 | 5 | `█████░░░░░` | README 没有快速开始 |
| 安全 | 6 | `██████░░░░` | 没有 SECURITY.md |
| 度量 | 1.3（按可核实的 8 分归一化） | `█░░░░░░░░░` | 0 star —— 没有任何外部信号 |
| AI 可读性 | 2 | `██░░░░░░░░` | 没有 AGENTS.md —— AI 助手没有仓库级行为准则（GitHub 2025 起原生支持） |

## 整改清单

按维度得分升序 —— 排在前面的影响最大。

1. **[度量 1.3]** 0 star —— 没有任何外部信号
2. **[AI 可读性 2]** 没有 AGENTS.md —— AI 助手没有仓库级行为准则（GitHub 2025 起原生支持）
3. **[AI 可读性 2]** 没有 llms.txt —— LLM 只能自己翻文件猜重点
4. **[AI 可读性 2]** 没有 Copilot 定制指令（.github/copilot-instructions.md）
5. **[AI 可读性 2]** 官网没有 llms.txt（或内容是空壳）
6. **[发布工程 3]** 没有任何 tag —— 用户无法锁定版本
7. **[发布工程 3]** 没有 GitHub Release
8. **[发布工程 3]** 没有 CI 运行记录
9. **[质量护栏 3]** package.json 没有 test 脚本
10. **[质量护栏 3]** 没有 lint/typecheck
11. **[分发 4]** README 里找不到一条可以照抄的安装命令
12. **[文档 5]** README 没有快速开始
13. **[文档 5]** 没有 API/配置参考
14. **[文档 5]** 没有 FAQ/故障排查
15. **[安全 6]** 没有 SECURITY.md
16. **[门面 6.5]** topics 只有 0 个（应 ≥6，这是被搜到的主要途径）
17. **[门面 6.5]** 徽章 2 个（应 4-6 个：CI/license/版本/下载量）

## 逐维度证据

每条结论都有实际查到的东西支撑，没有「有待完善」这种没法行动的话。

### 门面 — 6.5/10

- ✅ description: "Discover CLI tools with transparent GitHub ranking"
- ✅ homepage: https://supercli.site
- ✅ README 含 3 张图
- ❌ topics 只有 0 个（应 ≥6，这是被搜到的主要途径）
- ❌ 徽章 2 个（应 4-6 个：CI/license/版本/下载量）
- ⚠️ 自动判不了，需人工或 AI 判断：README 首屏 10 秒清晰度、Social Preview 是否已在 Settings 上传 2:1 图、logo 是否 1:1 透明底

### 分发 — 4/10

- ✅ package.json 标了 private，不走 registry
- ✅ 有 homepage 可导流
- ❌ README 里找不到一条可以照抄的安装命令
- ⚠️ 自动判不了，需人工或 AI 判断：awesome-list / marketplace 收录情况、HN/Reddit/V2EX/掘金首发帖

### 发布工程 — 3/10

- ✅ 有 CHANGELOG
- ❌ 没有任何 tag —— 用户无法锁定版本
- ❌ 没有 GitHub Release
- ❌ 没有 CI 运行记录
- ⚠️ 自动判不了，需人工或 AI 判断：Release 资产直链是否真的 200、仓库里有没有误提交 dist/build 产物

### 质量护栏 — 3/10

- ✅ 有 .github（CI 配置）
- ❌ package.json 没有 test 脚本
- ❌ 没有 lint/typecheck
- ⚠️ 自动判不了，需人工或 AI 判断：测试是否真在 CI 里跑、commit message 是否守 conventional commits

### 社区卫生 — 10/10

- ✅ LICENSE: NOASSERTION
- ✅ 有 CONTRIBUTING
- ✅ 有 issue 模板
- ✅ 没有 open issue
- ✅ 35 分钟前有提交

### 文档 — 5/10

- ✅ README 1471 字符
- ✅ 有安装章节
- ❌ README 没有快速开始
- ❌ 没有 API/配置参考
- ❌ 没有 FAQ/故障排查
- ⚠️ 自动判不了，需人工或 AI 判断：死链全量体检

### 安全 — 6/10

- ✅ 有 .gitignore
- ✅ 2 个运行时依赖
- ❌ 没有 SECURITY.md
- ⚠️ 自动判不了，需人工或 AI 判断：git history 明文密钥扫描、npm audit / 等价依赖审计

### 度量 — 1.3/10

- ✅ 有 homepage，可挂埋点
- ❌ 0 star —— 没有任何外部信号
- ⚠️ 自动判不了，需人工或 AI 判断：npm 下载量趋势、官网埋点、近两周 traffic（需仓库 push 权限，公共质检读不到 —— 请自己在 Insights → Traffic 看）

### AI 可读性 — 2/10

- ✅ 官网 robots.txt 放行 AI 爬虫（GPTBot / ClaudeBot / PerplexityBot / Google-Extended 等）
- ❌ 没有 AGENTS.md —— AI 助手没有仓库级行为准则（GitHub 2025 起原生支持）
- ❌ 没有 llms.txt —— LLM 只能自己翻文件猜重点
- ❌ 没有 Copilot 定制指令（.github/copilot-instructions.md）
- ❌ 官网没有 llms.txt（或内容是空壳）

---

## 把这份报告交给 AI

复制整份报告，连同仓库一起给 Claude Code / Cursor / Copilot，然后说：

```
照这份质检报告改进这个仓库。从整改清单第 1 条开始，一次做一条，
每条改完告诉我动了哪些文件、为什么这么改。
标着「自动判不了」的几项，你读过 README 之后给我你的判断。
```

改完可以再跑一次质检对比分数 —— 质检历史会画出曲线。

> 本报告由 [Scorecard 开源项目质检](https://scorecard.webkubor.online) 生成，任何公开仓库都能免费跑一次。
