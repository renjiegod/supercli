# SuperCLI 开发与审核

这是社区维护的 CLI 发现与排行静态站，使用 Vite + TypeScript，部署到 Cloudflare Pages。

## 本地命令

- Node 24+，pnpm 12.4。
- `pnpm install --frozen-lockfile` 安装依赖。
- `pnpm dev` 启动本地预览；`pnpm build` 执行类型、数据、测试检查并构建。
- `pnpm test` 跑行为及安全回归；`pnpm typecheck` 检查类型。
- `node scripts/sync.mjs --gh --icons` 手动刷新 GitHub 指标，需本机已登录 gh。

## 真源与边界

- `data/catalog.json`：收录条目的唯一真源；`data/categories.json`：分类。
- `data/metrics.json`：带 repo 来源绑定的 GitHub 快照；没有可比仓库的工具为 null，不能编造 Stars。
- 数据契约为 `data/*.schema.json`，验证入口 `scripts/validation.mjs`；同步必须先验证输入再联网或写盘。
- HTML 文本和属性须转义；图标写入须保留路径、符号链接和排他写入保护。
- 厂商图标来源见 `docs/ICONS.md`，保留原品牌几何，不用通用图标冒充厂商。
- `.local/`、凭据、个人安装路径与运行日志不提交。

## 审核与发布

PR 由维护者本地核验、人工批准、手动合并。不要添加自动审核、自动批准、自动合并或定时任务。

只发布已审查 main。工作流仅允许人工触发，具体运行与验收要求见 `docs/REVIEW.md`、`docs/DEPLOYMENT.md`。完成发布后必须验证真实页面和关键交互。
