# 托管与发布

- Cloudflare 账号：owner 的 Webkubor@gmail.com 账号。
- Zone：supercli.site；腾讯云域名已切换至 grannbo.ns.cloudflare.com 与 ruben.ns.cloudflare.com。
- Cloudflare Pages 项目：supercli；生产分支：main。
- DNS：根域名 CNAME 指向 supercli.pages.dev，开启代理；Pages 已绑定 supercli.site。
- 创建时间：2026-10-20；NS 传播与 TLS 激活需要按实况回读，配置完成不等于全球缓存已刷新。

## 本地预览和人工发布

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm build
CLOUDFLARE_ACCOUNT_ID=916ebb1b9f240bf4c8826021dd161692 pnpm exec wrangler pages deploy dist --project-name supercli --branch main
```

Wrangler 使用本机 owner OAuth，不在仓库落密钥。Pages 的 wrangler.toml 不能包含 account_id，应通过环境变量指定。

GitHub Actions 仅保留 workflow_dispatch 手动入口，需要单独配置 Pages 专用 Token 才能使用；首期未向 GitHub 存储主账户 Token。不运行定时任务、自动 PR 审核或自动合并。

## 分支审核

main 已启用保护：至少一位审核者批准、CODEOWNERS 审核、后续提交撤销旧批准，禁止强推与删除。仓库 owner 保留管理员人工处理能力。没有必需的自动状态检查，所有校验由维护者本地运行。

## 凭据

主凭据保持原有策略。域名初始化采用 kyvault 保存的独立短期账号 Token，包含本账号 Zone 管理所需权限，2026-10-21 自动到期；令牌值不进入 Git、日志或发布环境。后续如需改域名，按 kyvault 和 Cloudflare 权限真源重新取得授权。
