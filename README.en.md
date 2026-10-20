<h1 align="center">SuperCLI</h1>
<p align="center"><strong>Find your next favorite command-line tool. Maintained through community pull requests.</strong></p>

[中文](README.md) · [Website](https://supercli.site) · [Contribute](CONTRIBUTING.md)

Discover 90 CLI tools across cloud platforms, AI agents, development, terminal productivity, and data utilities. Search by purpose or vendor, inspect upstream repository stars, and copy installation commands.

## Run locally

Requires Node 24+ and pnpm 12.

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm build
```

## Contribute

Edit `data/catalog.json`, add the official organization avatar under `public/icons`, document its source in `docs/ICONS.md`, refresh GitHub metrics with `pnpm sync`, and open a PR. Maintainers review contributions before merging. Maintainers review locally, merge manually, and publish when ready. No automated review, auto-merge, or scheduled refresh is enabled.

Ranking uses total GitHub repository stars and explicitly labels the snapshot time. Monorepo stars describe the entire repository, not individual CLI usage. All third-party names and trademarks belong to their owners. This is an independent community directory.

MIT for original code. See [research](docs/RESEARCH.md) and [license](LICENSE).
