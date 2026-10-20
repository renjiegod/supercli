/** 社区收录记录必须覆盖目录，署名绑定真实投稿出处，历史记录不冒充推荐。 */
import assert from "node:assert/strict";
export function validateCommunity(records, catalog) {
  assert(Array.isArray(records), "收录记录必须是数组");
  const keys = ["id", "addedAt", "curatedBy", "recommendedBy", "evidence"];
  const username = /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/;
  const commit =
    /^https:\/\/github\.com\/webkubor\/supercli\/commit\/[a-f0-9]{40}$/;
  const submission =
    /^https:\/\/github\.com\/webkubor\/supercli\/(issues|pull)\/[1-9]\d*$/;
  for (const row of records) {
    assert(row && typeof row === "object", "无效收录记录");
    assert.deepEqual(Object.keys(row).sort(), [...keys].sort(), "收录字段不符");
    assert(typeof row.id === "string");
    assert(
      typeof row.addedAt === "string" &&
        /^\d{4}-\d{2}-\d{2}T/.test(row.addedAt),
    );
    assert(
      Number.isFinite(Date.parse(row.addedAt)) &&
        Date.parse(row.addedAt) <= Date.now(),
      "无效或未来收录时间",
    );
    const day = row.addedAt.slice(0, 10);
    const parsedDay = new Date(`${day}T00:00:00Z`);
    assert(
      Number.isFinite(parsedDay.getTime()) &&
        parsedDay.toISOString().slice(0, 10) === day,
      "无效日历日期",
    );
    assert(
      typeof row.curatedBy === "string" && username.test(row.curatedBy),
      "无效维护者",
    );
    assert(
      row.recommendedBy === null ||
        (typeof row.recommendedBy === "string" &&
          username.test(row.recommendedBy)),
      "无效推荐者",
    );
    assert(
      typeof row.evidence === "string" &&
        (commit.test(row.evidence) || submission.test(row.evidence)),
      "缺少本站收录依据",
    );
    assert(
      row.recommendedBy === null || submission.test(row.evidence),
      "推荐者必须有 Issue 或 PR 依据",
    );
  }
  assert.deepEqual(
    records.map((row) => row.id).sort(),
    catalog.map((row) => row.id).sort(),
    "收录记录缺失、重复或包含未知工具",
  );
}
