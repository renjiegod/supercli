/** 维护者手动刷新 npm 下载量；失败不覆盖上一份快照。 */
import { readFile, writeFile, rename, lstat, unlink } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import assert from "node:assert/strict";
import { validateCatalog } from "./validation.mjs";
import { npmPackage, validateUsage } from "./usage-validation.mjs";
const catalog = JSON.parse(await readFile("data/catalog.json", "utf8"));
validateCatalog(catalog);
assert(!(await lstat("data")).isSymbolicLink(), "data 不能是符号链接");
async function download(item) {
  const name = npmPackage(item);
  if (!name) return [item.id, null];
  const response = await fetch(
    `https://api.npmjs.org/downloads/point/last-month/${encodeURIComponent(name)}`,
    { signal: AbortSignal.timeout(20000) },
  );
  if (response.status === 404) return [item.id, null];
  if (!response.ok) throw new Error(`npm ${name}: ${response.status}`);
  const data = await response.json();
  assert(data.package === name, `${item.id} npm 返回包名不匹配`);
  console.log(
    `${item.id}: ${data.downloads} npm downloads (${data.start} / ${data.end})`,
  );
  return [
    item.id,
    {
      package: name,
      repo: item.repo,
      downloads: data.downloads,
      start: data.start,
      end: data.end,
    },
  ];
}
const rows = [];
for (let index = 0; index < catalog.length; index += 4)
  rows.push(
    ...(await Promise.all(catalog.slice(index, index + 4).map(download))),
  );
const snapshot = {
  fetchedAt: new Date().toISOString(),
  source: "npm downloads API",
  packages: Object.fromEntries(rows),
};
validateUsage(snapshot, catalog);
const temporary = `data/.usage-${randomUUID()}.tmp`;
try {
  await writeFile(temporary, JSON.stringify(snapshot, null, 2) + "\n", {
    flag: "wx",
  });
  await rename(temporary, "data/usage.json");
} finally {
  await unlink(temporary).catch((error) => {
    if (error.code !== "ENOENT") throw error;
  });
}
