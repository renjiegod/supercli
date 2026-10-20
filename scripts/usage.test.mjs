/** 下载与调用不可混淆：来源绑定、缺失值排序、错误刷新保留旧快照。 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFile, writeFile, mkdir, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { catalog, queryEntries, usage } from "../src/catalog.ts";
import { cardMetrics, detailMetrics } from "../src/tool-metrics.ts";
import { validateUsage, npmPackage } from "./usage-validation.mjs";
const item = catalog.find((entry) => entry.id === "wrangler");
const snapshot = () => ({
  fetchedAt: "2026-10-20T00:00:00Z",
  source: "npm downloads API",
  packages: {
    wrangler: {
      package: "wrangler",
      repo: item.repo,
      downloads: 0,
      start: "2026-09-19",
      end: "2026-10-18",
    },
  },
});
test("downloads accept real zero but reject source swaps, missing rows and bad windows", () => {
  assert.doesNotThrow(() => validateUsage(snapshot(), [item]));
  for (const changes of [
    { package: "other-package" },
    { repo: "other/repo" },
    { downloads: -1 },
    { downloads: 1.5 },
    { start: "2026-02-30" },
    { end: "2026-10-19" },
  ]) {
    const data = snapshot();
    Object.assign(data.packages.wrangler, changes);
    assert.throws(() => validateUsage(data, [item]));
  }
  assert.throws(() => validateUsage({ ...snapshot(), packages: {} }, [item]));
  assert.equal(npmPackage({ install: "npm install -g evil<script>" }), null);
});
test("download sorting preserves source and puts unavailable tools after available ones", () => {
  const before = JSON.stringify(catalog);
  const entries = queryEntries("", "", "", "downloads");
  for (let i = 1; i < entries.length; i++)
    assert(
      (usage(entries[i - 1])?.downloads ?? -1) >=
        (usage(entries[i])?.downloads ?? -1),
    );
  assert.equal(JSON.stringify(catalog), before);
  assert.equal(
    queryEntries("wrangler", "cloud", "Cloudflare", "downloads")[0].id,
    "wrangler",
  );
});
test("cards expose UTC+8 source update dates and distinguish unavailable download counts", () => {
  const html = cardMetrics(item);
  assert.match(html, /<time datetime=/);
  assert.match(html, /近30天下载/);
  assert.match(html, /api.npmjs.org/);
  const missing = catalog.find((entry) => entry.id === "gh");
  assert.match(cardMetrics(missing), /暂未接入/);
  assert.match(detailMetrics(item), /不等于 CLI 执行次数/);
});
test("failed npm refresh does not replace previous snapshot", async () => {
  const root = await mkdtemp(join(tmpdir(), "supercli-usage-"));
  try {
    await mkdir(join(root, "data"));
    await writeFile(join(root, "data/catalog.json"), JSON.stringify([item]));
    const old = JSON.stringify(snapshot());
    await writeFile(join(root, "data/usage.json"), old);
    const mock = join(root, "fetch.mjs");
    const good = snapshot().packages.wrangler;
    const responses = [
      { ok: false, status: 503 },
      { ok: true, status: 200, body: { ...good, package: "wrong" } },
      { ok: true, status: 200, body: { ...good, start: "2026-02-30" } },
      { ok: true, status: 200, body: { ...good, downloads: -1 } },
    ];
    for (const response of responses) {
      await writeFile(
        mock,
        `globalThis.fetch = async () => ({
        ok: ${response.ok}, status: ${response.status},
        json: async () => (${JSON.stringify(response.body ?? {})})
      });`,
      );
      const result = spawnSync(
        process.execPath,
        [
          "--import",
          mock,
          fileURLToPath(new URL("./sync-usage.mjs", import.meta.url)),
        ],
        { cwd: root, encoding: "utf8", timeout: 5000 },
      );
      assert.notEqual(result.status, 0);
      assert.equal(await readFile(join(root, "data/usage.json"), "utf8"), old);
    }
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
