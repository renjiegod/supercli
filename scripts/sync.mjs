/** 手动拉取 GitHub 官方指标；网络失败有界重试，完整成功后原子写入快照。 */
import { readFile, writeFile, rename, access, lstat } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { validateCatalog, validateMetrics } from "./validation.mjs";
const execute = promisify(execFile);
const catalog = JSON.parse(await readFile("data/catalog.json", "utf8"));
validateCatalog(catalog);
/** 任何联网前拒绝图标父目录及目标符号链接，避免校验后越界写盘。 */
async function validateIconPaths() {
  for (const path of [
    "public",
    "public/icons",
    ...catalog.map((item) => `public/icons/${item.icon}`),
  ]) {
    try {
      const info = await lstat(path);
      if (info.isSymbolicLink())
        throw new Error(`图标路径禁止符号链接: ${path}`);
      if ((path === "public" || path === "public/icons") && !info.isDirectory())
        throw new Error(`图标父路径不是目录: ${path}`);
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
  }
}
if (process.argv.includes("--icons")) await validateIconPaths();
const headers = {
  Accept: "application/vnd.github+json",
  "User-Agent": "SuperCLI-directory",
};
if (process.env.GITHUB_TOKEN)
  headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
async function repository(repo) {
  if (process.argv.includes("--gh")) {
    const { stdout } = await execute("gh", ["api", `repos/${repo}`], {
      timeout: 30000,
    });
    return JSON.parse(stdout);
  }
  const response = await fetch(`https://api.github.com/repos/${repo}`, {
    headers,
    signal: AbortSignal.timeout(20000),
  });
  if (!response.ok) throw new Error(`${repo}: GitHub ${response.status}`);
  return response.json();
}
async function withRetry(action, label) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      return await action();
    } catch (error) {
      if (attempt === 3) throw new Error(`${label}: ${error.message}`);
    }
  }
}
const iconDownloads = new Map();
function syncIcon(item, repo) {
  if (!process.argv.includes("--icons")) return;
  const path = `public/icons/${item.icon}`;
  if (!iconDownloads.has(path))
    iconDownloads.set(path, downloadIcon(path, item, repo));
  return iconDownloads.get(path);
}
async function downloadIcon(path, item, repo) {
  try {
    await access(path);
    return;
  } catch {
    /* 新图标需要拉取。 */
  }
  const response = await withRetry(
    () =>
      fetch(`${repo.owner.avatar_url}&s=96`, {
        signal: AbortSignal.timeout(20000),
      }),
    `Icon ${item.icon}`,
  );
  if (!response.ok) throw new Error(`Icon ${item.icon}: ${response.status}`);
  await writeFile(path, Buffer.from(await response.arrayBuffer()), {
    flag: "wx",
  });
}
async function syncItem(item) {
  if (!item.repo) return [item.id, null];
  const repo = await withRetry(() => repository(item.repo), item.repo);
  await syncIcon(item, repo);
  console.log(`${item.id}: ${repo.stargazers_count} stars`);
  return [
    item.id,
    {
      repo: item.repo,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      pushedAt: repo.pushed_at,
      archived: repo.archived,
      language: repo.language,
      license: repo.license?.spdx_id ?? null,
    },
  ];
}
const rows = [];
for (let index = 0; index < catalog.length; index += 4)
  rows.push(
    ...(await Promise.all(catalog.slice(index, index + 4).map(syncItem))),
  );
const snapshot = {
  fetchedAt: new Date().toISOString(),
  source: "GitHub REST API /repos/{owner}/{repo}",
  repositories: Object.fromEntries(rows),
};
validateMetrics(snapshot, catalog);
await writeFile(
  "data/metrics.json.tmp",
  JSON.stringify(snapshot, null, 2) + "\n",
);
await rename("data/metrics.json.tmp", "data/metrics.json");
