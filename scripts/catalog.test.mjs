/** 行为回归：组合筛选、不可变排序与空搜索。 */
import test from "node:test";
import assert from "node:assert/strict";
import { queryEntries, catalog, stats } from "../src/catalog.ts";
test("cloud provider search composes with category and vendor", () => {
  assert.deepEqual(
    queryEntries("API", "cloud", "腾讯云", "stars").map((x) => x.id),
    ["tccli"],
  );
  assert.equal(queryEntries("API", "terminal", "腾讯云", "stars").length, 0);
});
test("ranking uses snapshot stars descending without changing source", () => {
  const before = JSON.stringify(catalog);
  const result = queryEntries("", "", "", "stars");
  result.forEach((entry, i) => {
    if (i)
      assert(
        (stats(result[i - 1])?.stars ?? -1) >= (stats(entry)?.stars ?? -1),
      );
  });
  assert.equal(JSON.stringify(catalog), before);
});
test("search supports case folding, command names and no matches", () => {
  assert.equal(queryEntries("  WRANGLER ", "", "", "stars")[0].id, "wrangler");
  assert.equal(queryEntries("nonexistent-cli-xyz", "", "", "stars").length, 0);
});
test("locally installed filter excludes unverified local presence", () => {
  const result = queryEntries("", "", "", "stars", true);
  assert(result.length > 0 && result.every((item) => item.locallyInstalled));
});
test("non-GitHub tools have no fabricated stars and remain discoverable", () => {
  const entry = queryEntries("MiMo Code", "", "", "stars")[0];
  assert.equal(stats(entry), null);
  const result = queryEntries("", "", "", "stars");
  const firstUnranked = result.findIndex((item) => stats(item) === null);
  assert(result.slice(firstUnranked).every((item) => stats(item) === null));
});
