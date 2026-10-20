/** 投稿与快照的构建门禁：结构、重复、图标、数据覆盖与时间。 */
import { readFileSync, existsSync } from "node:fs";
import assert from "node:assert/strict";
import Ajv from "ajv";
const read = (path) => JSON.parse(readFileSync(path, "utf8"));
const catalog = read("data/catalog.json");
const snapshot = read("data/metrics.json");
const validate = new Ajv({ allErrors: true }).compile(
  read("data/catalog.schema.json"),
);
assert(validate(catalog), JSON.stringify(validate.errors));
for (const field of ["id", "repo"])
  assert.equal(
    new Set(
      catalog
        .filter((item) => item[field] !== null)
        .map((item) => item[field].toLowerCase()),
    ).size,
    catalog.filter((item) => item[field] !== null).length,
    `重复 ${field}`,
  );
assert(Number.isFinite(Date.parse(snapshot.fetchedAt)), "快照时间无效");
for (const item of catalog) {
  assert(existsSync(`public/icons/${item.icon}`), `缺少 ${item.icon} 图标`);
  const metric = snapshot.repositories[item.id];
  if (!item.repo) {
    assert.equal(metric, null, `${item.id} 不应伪造指标`);
    continue;
  }
  assert(metric, `缺少 ${item.id} 指标，请运行 pnpm sync`);
  assert(
    Number.isInteger(metric.stars) && metric.stars >= 0,
    `${item.id} Stars 无效`,
  );
  assert(
    Number.isFinite(Date.parse(metric.pushedAt)),
    `${item.id} 推送时间无效`,
  );
}
console.log(
  `Validated ${catalog.length} CLI entries, icons and repository snapshots.`,
);
