# 开源项目质检报告 · webkubor/supercli

**8.1 / 10** — 工程健康但分发薄弱

项目类型 `app` · 0 star · 生成于 2026-10-20 18:51

九维度标准来自 [project-maturity-audit](https://github.com/webkubor/scorecard/tree/main/skills/project-maturity-audit)：
评的不是「代码好不好」，是「陌生人会不会在 10 秒内 star、安装、信任它」。

## 记分卡

| 维度 | 得分 | | 最该补的一件事 |
|---|---:|---|---|
| 门面 | 8.5 | `█████████░` | 徽章 2 个（应 4-6 个：CI/license/版本/下载量） |
| 分发 | 6.5 | `███████░░░` | README 里找不到一条可以照抄的安装命令 |
| 发布工程 | 10（按可核实的 8 分归一化） | `██████████` | — |
| 质量护栏 | 8 | `████████░░` | — |
| 社区卫生 | 10 | `██████████` | — |
| 文档 | 9.5 | `██████████` | — |
| 安全 | 9 | `█████████░` | — |
| 度量 | 1.3（按可核实的 8 分归一化） | `█░░░░░░░░░` | 0 star —— 没有任何外部信号 |
| AI 可读性 | 10 | `██████████` | — |

## 整改清单

按维度得分升序 —— 排在前面的影响最大。

1. **[度量 1.3]** 0 star —— 没有任何外部信号
2. **[分发 6.5]** README 里找不到一条可以照抄的安装命令
3. **[门面 8.5]** 徽章 2 个（应 4-6 个：CI/license/版本/下载量）

## 逐维度证据

每条结论都有实际查到的东西支撑，没有「有待完善」这种没法行动的话。

### 门面 — 8.5/10

- ✅ description: "Discover CLI tools with transparent GitHub ranking"
- ✅ topics 8 个
- ✅ homepage: https://supercli.site
- ✅ README 含 3 张图
- ❌ 徽章 2 个（应 4-6 个：CI/license/版本/下载量）
- ⚠️ 自动判不了，需人工或 AI 判断：README 首屏 10 秒清晰度、Social Preview 是否已在 Settings 上传 2:1 图、logo 是否 1:1 透明底

### 分发 — 6.5/10

- ✅ package.json 标了 private，不走 registry
- ✅ 最近的 release 带 1 个可下载产物
- ✅ 有 homepage 可导流
- ❌ README 里找不到一条可以照抄的安装命令
- ⚠️ 自动判不了，需人工或 AI 判断：awesome-list / marketplace 收录情况、HN/Reddit/V2EX/掘金首发帖

### 发布工程 — 10/10

- ✅ 版本 tag 1 个，最新 v0.1.1
- ✅ GitHub Release 1 个，最新 v0.1.1
- ✅ 有 CHANGELOG
- ⚠️ 自动判不了，需人工或 AI 判断：Release 资产直链是否真的 200、仓库里有没有误提交 dist/build 产物、最近 Actions（Manual project checks）不属于可识别的构建/验证/发布流程 —— 这 2 分已从满分中剔除

### 质量护栏 — 8/10

- ✅ 有 test 脚本：tsx --test scripts/*.test.mjs
- ✅ 有 lint/typecheck 脚本
- ✅ 有 .github（CI 配置）
- ⚠️ 自动判不了，需人工或 AI 判断：测试是否真在 CI 里跑、commit message 是否守 conventional commits

### 社区卫生 — 10/10

- ✅ LICENSE: NOASSERTION
- ✅ 有 CONTRIBUTING
- ✅ 有 issue 模板
- ✅ 没有 open issue
- ✅ 几秒前有提交

### 文档 — 9.5/10

- ✅ README 1919 字符
- ✅ 有安装章节
- ✅ 有快速开始/使用章节
- ✅ 有 API/配置章节
- ✅ 有 FAQ/故障排查
- ⚠️ 自动判不了，需人工或 AI 判断：死链全量体检

### 安全 — 9/10

- ✅ 有 SECURITY.md
- ✅ 有 .gitignore
- ✅ 2 个运行时依赖
- ⚠️ 自动判不了，需人工或 AI 判断：git history 明文密钥扫描、npm audit / 等价依赖审计

### 度量 — 1.3/10

- ✅ 有 homepage，可挂埋点
- ❌ 0 star —— 没有任何外部信号
- ⚠️ 自动判不了，需人工或 AI 判断：npm 下载量趋势、官网埋点、近两周 traffic（需仓库 push 权限，公共质检读不到 —— 请自己在 Insights → Traffic 看）

### AI 可读性 — 10/10

- ✅ 有 AGENTS.md —— Copilot / Codex / Claude Code 进仓库会先读它
- ✅ 有 llms.txt —— LLM 内容清单
- ✅ 有 Copilot 定制指令（.github/copilot-instructions.md）
- ✅ 官网 robots.txt 放行 AI 爬虫（GPTBot / ClaudeBot / PerplexityBot / Google-Extended 等）
- ✅ 官网有 llms.txt（LLM 内容清单）

---

## 把这份报告交给 AI

复制整份报告，连同仓库一起给 Claude Code / Cursor / Copilot，然后说：

```
照这份质检报告改进这个仓库。从整改清单第 1 条开始，一次做一条，
每条改完告诉我动了哪些文件、为什么这么改。
标着「自动判不了」的几项，你读过 README 之后给我你的判断。
```

改完可以再跑一次质检对比分数 —— 质检历史会画出曲线。