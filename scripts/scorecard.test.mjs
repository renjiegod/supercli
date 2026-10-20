/** 质检深链接必须绑定当前仓库，缺失或异常来源不生成入口。 */
import test from "node:test";
import assert from "node:assert/strict";
import { scorecardUrl, scorecardMarkup } from "../src/scorecard.ts";
import { catalog } from "../src/catalog.ts";
test("Scorecard links bind the current GitHub repository and reject invalid targets", () => {
  const item = catalog.find((item) => item.id === "wrangler");
  assert.equal(
    scorecardUrl(item),
    "https://scorecard.webkubor.online/#/report/cloudflare/workers-sdk",
  );
  assert.match(scorecardMarkup(item), /整个仓库/);
  assert.match(scorecardMarkup(item), /noopener noreferrer/);
  for (const repo of [
    null,
    "https://evil.test/a",
    "owner/repo?redirect=x",
    "owner/<script>",
  ]) {
    assert.equal(scorecardUrl({ repo }), null);
    assert.equal(scorecardMarkup({ ...item, repo }), "");
  }
  assert(
    !scorecardMarkup({
      ...item,
      name: "<img src=x onerror=alert(1)>",
    }).includes("<img"),
  );
});
