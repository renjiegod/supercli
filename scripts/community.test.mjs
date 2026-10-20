/** 社区署名的回归：历史与推荐不能混淆，记录来源与覆盖必须可核验。 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { validateCommunity } from "./community-validation.mjs";
import {
  attributionMarkup,
  contributorCounts,
  recentEntries,
} from "../src/community.ts";
import { catalog } from "../src/catalog.ts";
const records = JSON.parse(
  readFileSync(new URL("../data/community.json", import.meta.url), "utf8"),
);
test("historical curation does not manufacture recommendations", () => {
  validateCommunity(records, catalog);
  const historical = [
    {
      ...records[0],
      curatedBy: "maintainer",
      recommendedBy: null,
      evidence: `https://github.com/webkubor/supercli/commit/${"a".repeat(40)}`,
    },
  ];
  assert.deepEqual(contributorCounts("recommendedBy", historical), []);
  assert.deepEqual(contributorCounts("curatedBy", historical), [
    { name: "maintainer", count: 1 },
  ]);
  assert.match(
    attributionMarkup({ id: historical[0].id }, historical),
    /收录维护/,
  );
  assert(
    !attributionMarkup({ id: historical[0].id }, historical).includes("推荐者"),
  );
  const incoming = {
    ...historical[0],
    id: "new",
    addedAt: "2026-10-21T00:00:00Z",
    recommendedBy: "alice",
    evidence: "https://github.com/webkubor/supercli/issues/12",
  };
  assert.equal(recentEntries(1, [...historical, incoming])[0].id, "new");
  assert.deepEqual(
    contributorCounts("recommendedBy", [...historical, incoming]),
    [{ name: "alice", count: 1 }],
  );
  assert.match(attributionMarkup({ id: "new" }, [incoming]), /推荐者/);
});
test("credit identities ignore case and anonymous submissions remain uncredited", () => {
  const base = { ...records[0], addedAt: "2026-10-20T00:00:00Z" };
  const rows = [
    { ...base, id: "z", recommendedBy: "Alice" },
    { ...base, id: "b", recommendedBy: "alice" },
    {
      ...base,
      id: "a",
      recommendedBy: null,
      evidence: "https://github.com/webkubor/supercli/issues/12",
    },
  ];
  assert.deepEqual(contributorCounts("recommendedBy", rows), [
    { name: "alice", count: 2 },
  ]);
  assert.deepEqual(
    recentEntries(3, rows).map((row) => row.id),
    ["a", "b", "z"],
  );
  assert(!attributionMarkup({ id: "a" }, rows).includes("推荐者"));
});

test("community records reject forged sources, invalid credits and incomplete coverage", () => {
  for (const changes of [
    { evidence: "https://evil.test/issues/1" },
    { recommendedBy: "alice" },
    { curatedBy: "<script>" },
    { addedAt: "2099-01-01T00:00:00Z" },
    { addedAt: "invalid" },
    { addedAt: "2026-02-30T00:00:00Z" },
    { extra: true },
  ]) {
    const rows = structuredClone(records);
    Object.assign(rows[0], changes);
    assert.throws(() => validateCommunity(rows, catalog));
  }
  assert.throws(() => validateCommunity(records.slice(1), catalog));
  assert.throws(() => validateCommunity([...records, records[0]], catalog));
  const accepted = structuredClone(records);
  Object.assign(accepted[0], {
    recommendedBy: "contributor",
    evidence: "https://github.com/webkubor/supercli/issues/12",
  });
  assert.doesNotThrow(() => validateCommunity(accepted, catalog));
});
