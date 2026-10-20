# 配置参考

## 数据

`data/catalog.json` 每条包含 id、name、vendor、category、repo、description、install、docs、icon；locallyInstalled 是建站时的存在性证据。repo 与 install 可以为 null。icon 为 public/icons 中的 PNG/SVG 文件名，不能包含目录。

分类定义在 data/categories.json；完整契约见 data/catalog.schema.json。GitHub 指标包含对应 repo，换仓库后必须手动同步。完整指标契约见 data/metrics.schema.json。

## 构建与部署

本地端口由 vite.config.ts 指定，默认 5179。静态产物为 dist/。Pages 项目名和兼容日期位于 wrangler.toml；账号用 CLOUDFLARE_ACCOUNT_ID 环境变量指定。凭据使用本机 Wrangler OAuth 或专用 CI Secret，不写入文件。

此站无运行时后端 API。新增工具走数据文件与人工 PR 审核，不需要数据库配置。

## 查询参数

q 搜索；category 按分类 id 过滤；vendor 匹配厂商名；sort 支持 stars、updated、name；local=1 仅看维护者快照中的已安装工具。筛选条件可组合并分享链接。
