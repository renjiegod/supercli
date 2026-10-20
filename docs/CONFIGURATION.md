# 配置参考

## 数据

`data/catalog.json` 每条包含 id、name、vendor、category、repo、description、install、docs、icon；locallyInstalled 是建站时的存在性证据。repo 与 install 可以为 null。icon 为 public/icons 中的 PNG/SVG 文件名，不能包含目录。

分类定义在 data/categories.json；完整契约见 data/catalog.schema.json。GitHub 指标包含对应 repo，换仓库后必须手动同步。完整指标契约见 data/metrics.schema.json。

## 构建与部署

本地端口由 vite.config.ts 指定，默认 5179。静态产物为 dist/。Pages 项目名和兼容日期位于 wrangler.toml；账号用 CLOUDFLARE_ACCOUNT_ID 环境变量指定。凭据使用本机 Wrangler OAuth 或专用 CI Secret，不写入文件。

此站无运行时后端 API。新增工具走数据文件与人工 PR 审核，不需要数据库配置。

## 查询参数

q 搜索；category 按分类 id 过滤；vendor 匹配厂商名；sort 支持 stars、updated、downloads、name；local=1 仅看维护者快照中的已安装工具。筛选条件可组合并分享链接。

## npm 下载快照

`pnpm sync:usage` 由维护者手动执行，从目录中精确匹配的 `npm install -g/-D <package>` 获取 npm 官方最近 30 个可用日的下载统计。保存到 `data/usage.json`；刷新失败保留旧快照。包名、仓库、日期窗口、非负整数和目录覆盖在构建时校验。

下载次数包含重复安装、依赖与 CI，不是用户数或 CLI 执行次数。当前覆盖 16 个 npm 工具；其他分发渠道未接入，不以零代替缺失值。卡片点击下载指标可查看同一日期区间的原始来源。

来源说明：https://github.com/npm/registry/blob/main/docs/download-counts.md
