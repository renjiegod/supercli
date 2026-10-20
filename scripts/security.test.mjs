/** 安全回归：不可信指标、仓库来源绑定与同步前的路径边界。 */
import test from "node:test";
import assert from "node:assert/strict";
import {
  mkdtemp,
  mkdir,
  writeFile,
  readFile,
  rm,
  symlink,
  access,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { catalog, metrics, stats } from "../src/catalog.ts";
import { detailMarkup } from "../src/html.ts";
import { validateCatalog, validateMetrics } from "./validation.mjs";
const entry = catalog.find((item) => item.repo);
const metric = stats(entry);
const snapshotFor = (value) => ({
  ...metrics,
  repositories: { [entry.id]: value },
});

test("detail renders external text and attribute values as inert HTML", () => {
  const attack = "\"><img src=x onerror=alert(1)>&'";
  const html = detailMarkup(
    {
      ...entry,
      name: attack,
      vendor: attack,
      description: attack,
      docs: `https://example.com/${attack}`,
      icon: attack,
      id: attack,
      install: attack,
      repo: attack,
    },
    { ...metric, language: attack, license: attack },
  );
  assert(!html.includes(attack));
  assert(!html.includes("<img src=x"));
  assert(!html.includes('src="/icons/"'));
  const escaped = "&quot;&gt;&lt;img src=x onerror=alert(1)&gt;&amp;&#39;";
  assert(html.includes(`<span>${escaped}</span>`));
  assert(html.includes(`许可证：${escaped}<br>`));
  assert(html.includes(`data-copy="${escaped}"`));
});

test("complete metrics contract rejects malformed fields and HTML metrics", () => {
  validateMetrics(metrics, catalog);
  for (const [field, value] of Object.entries({
    stars: -1,
    forks: 0.5,
    pushedAt: "bad date",
    archived: "false",
    language: {},
    license: 1,
  }))
    assert.throws(() =>
      validateMetrics(snapshotFor({ ...metric, [field]: value }), [entry]),
    );
  for (const field of Object.keys(metric)) {
    const incomplete = { ...metric };
    delete incomplete[field];
    assert.throws(() => validateMetrics(snapshotFor(incomplete), [entry]));
  }
  for (const field of ["language", "license"])
    assert.throws(() =>
      validateMetrics(
        snapshotFor({ ...metric, [field]: "<img src=x onerror=alert(1)>" }),
        [entry],
      ),
    );
  assert.throws(() =>
    validateMetrics({ ...snapshotFor(metric), fetchedAt: null }, [entry]),
  );
  assert.throws(() =>
    validateMetrics(snapshotFor({ ...metric, extra: true }), [entry]),
  );
  assert.throws(() => validateMetrics(snapshotFor(null), [entry]));
  assert.throws(() =>
    validateMetrics(snapshotFor(metric), [
      { ...entry, repo: "different/repository" },
    ]),
  );
  assert.throws(() =>
    validateMetrics({ ...metrics, repositories: {} }, catalog),
  );
});

test("catalog contract rejects duplicate ids, repositories and unsafe icons", () => {
  validateCatalog(catalog);
  assert.throws(() =>
    validateCatalog([entry, { ...entry, repo: "other/project" }]),
  );
  assert.throws(() =>
    validateCatalog([
      entry,
      { ...entry, id: "other", repo: entry.repo.toUpperCase() },
    ]),
  );
  assert.throws(() =>
    validateCatalog([{ ...entry, icon: "../../../outside.png" }]),
  );
});

async function fixture(run) {
  const root = await mkdtemp(join(tmpdir(), "supercli-security-"));
  const cwd = join(root, "work");
  await mkdir(join(cwd, "data"), { recursive: true });
  await mkdir(join(cwd, "public/icons"), { recursive: true });
  const sentinel = join(root, "network-called");
  const mock = join(root, "network.mjs");
  await writeFile(
    mock,
    `import { writeFileSync } from "node:fs";
    globalThis.fetch = async (url) => {
      writeFileSync(${JSON.stringify(sentinel)}, "called");
      return new Response(JSON.stringify({ stargazers_count: 1, forks_count: 0,
        pushed_at: "2026-10-20T00:00:00Z", archived: false, language: "Go",
        license: { spdx_id: "MIT" }, owner: { avatar_url: "https://example.com/avatar?x=1" } }));
    };`,
  );
  const sync = (rows) => {
    return writeFile(join(cwd, "data/catalog.json"), JSON.stringify(rows)).then(
      () =>
        spawnSync(
          process.execPath,
          [
            "--import",
            mock,
            fileURLToPath(new URL("./sync.mjs", import.meta.url)),
            "--icons",
          ],
          {
            cwd,
            encoding: "utf8",
            timeout: 10000,
            env: { ...process.env, GITHUB_TOKEN: "" },
          },
        ),
    );
  };
  try {
    await run({ root, cwd, sentinel, sync });
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

test("sync rejects malformed catalogs before fetch or writes, including traversal", async () => {
  await fixture(async ({ root, cwd, sentinel, sync }) => {
    for (const rows of [
      [{ ...entry, icon: "../../../outside.png" }],
      [entry, entry],
      [{ ...entry, docs: "javascript:alert(1)" }],
    ]) {
      const result = await sync(rows);
      assert.notEqual(result.status, 0, result.stdout);
      assert.match(result.stderr, /AssertionError/);
      await assert.rejects(access(sentinel));
      await assert.rejects(access(join(root, "outside.png")));
      await assert.rejects(access(join(cwd, "data/metrics.json")));
      await assert.rejects(access(join(cwd, "data/metrics.json.tmp")));
    }
  });
});

for (const link of ["public", "public/icons", `public/icons/${entry.icon}`]) {
  test(`sync rejects symlink ${link} before fetch or writes`, async () => {
    await fixture(async ({ root, cwd, sentinel, sync }) => {
      const outside = join(root, "outside");
      await mkdir(outside);
      await rm(join(cwd, link), { recursive: true, force: true });
      await symlink(outside, join(cwd, link));
      const result = await sync([entry]);
      assert.notEqual(result.status, 0);
      assert.match(result.stderr, /禁止符号链接/);
      await assert.rejects(access(sentinel));
      await assert.rejects(access(join(outside, entry.icon)));
      await assert.rejects(access(join(cwd, "data/metrics.json")));
    });
  });
}

test("sync accepts valid catalog without old metrics and produces validated snapshot", async () => {
  await fixture(async ({ cwd, sentinel, sync }) => {
    const result = await sync([entry]);
    assert.equal(result.status, 0, result.stderr);
    await access(sentinel);
    const snapshot = JSON.parse(
      await readFile(join(cwd, "data/metrics.json"), "utf8"),
    );
    validateMetrics(snapshot, [entry]);
    assert.equal(snapshot.repositories[entry.id].repo, entry.repo);
    await access(join(cwd, `public/icons/${entry.icon}`));
  });
});
