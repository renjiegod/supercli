/** 投稿与快照的构建门禁：结构、重复、图标、数据覆盖与时间。 */
import { readFileSync, existsSync } from "node:fs";
import assert from "node:assert/strict";
import { validateCatalog, validateMetrics } from "./validation.mjs";
const read = (path) => JSON.parse(readFileSync(path, "utf8"));
const catalog = read("data/catalog.json");
const snapshot = read("data/metrics.json");
validateCatalog(catalog);
validateMetrics(snapshot, catalog);
for (const item of catalog)
  assert(existsSync(`public/icons/${item.icon}`), `缺少 ${item.icon} 图标`);
console.log(
  `Validated ${catalog.length} CLI entries, icons and repository snapshots.`,
);
