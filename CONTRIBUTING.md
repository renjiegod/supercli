# 推荐工具，或一起维护目录

## 不改代码：填一张表单

[推荐一个 CLI](https://github.com/webkubor/supercli/issues/new?template=cli.yml)，填写名称、工具链接、用途和推荐理由即可。需要 GitHub 账号，由 GitHub 处理登录；SuperCLI 不读取你的私有仓库，也不需要个人 Token。

可以是亲自使用过的工具，也可以是发现的新项目，请如实描述。安装说明、厂商图标和来源分类由维护者核验补齐。不要提交凭据、个人配置或无法公开的内部工具。

[修正已有信息](https://github.com/webkubor/supercli/issues/new?template=correction.yml)也欢迎。

## 投稿会怎样处理

1. Issue 进入 **待核验**，维护者检查来源、是否重复及适用场景。
2. 信息不全时标为 **需补充信息**，在同一个 Issue 回复补充即可。
3. 通过后维护者整理目录、验证安装说明与图标、运行检查；合并 main 后自动发布。上线验证后标为 **已收录**，回复工具详情链接并关闭 Issue。

未收录的建议会说明原因；重复投稿链接到已有工具或讨论，不计作新的收录。状态由维护者手动更新，不启用自动审核或合并。没有承诺审核时限。

## 推荐者署名

表单可选择是否在网站展示 GitHub 用户名。只有明确同意时，维护者才填写推荐者字段，详情与贡献者列表链接你的公开主页；选择不署名时仅链接原投稿。原 Issue 本身仍是公开的。来源链接保留用于核验。后续更正或撤回网站署名，可以在原 Issue 提出。

历史首批条目展示“收录维护”，不会冒充社区推荐。工具原作者、推荐者与目录维护者是不同角色。

## 熟悉 Git：提交 PR

1. Fork 仓库，修改 `data/catalog.json`，填写官方仓库（非 GitHub 填 null）、用途、文档、经核验的安装命令和 `maintainerType`。定义见 [来源标记](docs/SOURCES.md)。上游仓库不能重复。
2. 图标放在 `public/icons/`，使用厂商或项目维护者的原资产，并在 `docs/ICONS.md` 标明来源。不要改变品牌几何。
3. 新条目需要 `data/community.json` 收录记录；PR 创建前可以准备字段，维护者合并前填最终 PR URL、实际收录时间和经确认的署名。不要猜 PR 编号或推荐者，详情见 [社区维护流程](docs/COMMUNITY.md)。
4. Node 24+、pnpm 12：`pnpm install --frozen-lockfile`；`node scripts/sync.mjs --gh --icons`、`pnpm sync:usage` 刷新快照，再运行 `pnpm build`。只使用可信的官方安装说明，不执行陌生投稿中的脚本。
5. 发起 PR，说明来源、用途和推荐理由。维护者在本地审查，手动合并，合并后自动发布；新收录与现有条目修正分别处理。
