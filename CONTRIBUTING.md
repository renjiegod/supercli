# 贡献一个 CLI

1. Fork 仓库，在 `data/catalog.json` 添加记录（复用已有字段结构）。
2. 填写官方仓库（非 GitHub 项目填 null）、中文用途、官方文档和一条经官方文档确认的安装命令；不提交 Token、Cookie 或个人配置。
3. 图标放在 `public/icons/<icon>.png 或 .svg`，从官方组织 / 项目维护者公开头像取得，并在 `docs/ICONS.md` 标明来源；保持厂商原图几何。
4. `pnpm install --frozen-lockfile`，运行 `pnpm sync -- --icons` 更新指标，再运行 `pnpm build`。
5. 发起 PR，说明用途、分类与官方来源；维护者本地审查后手动合并与发布。

需要 Node 24+、pnpm 12。GitHub API 限流时通过环境变量传入 `GITHUB_TOKEN`，不要把它写入文件。可用 `node scripts/sync.mjs --gh --icons` 复用本机已登录 gh。

只接纳可核验来源的 CLI，上游仓库不能重复；Stars 属于仓库，不声称代表 CLI 使用人数。首版不收重复镜像和未经证实的安装命令。

项目来源须填写 `maintainerType`（vendor / community），附维护方依据；定义与核验入口见 [来源标记](docs/SOURCES.md)。这不是质量或可信度评级。
