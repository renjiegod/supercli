/** 核验记录绑定当前目录字段；内容变更必须复核或撤下旧记录，未实测不能造实测标签。 */
import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import Ajv from "ajv";
const validate = new Ajv({ allErrors: true }).compile(
  JSON.parse(
    readFileSync(
      new URL("../data/reviews.schema.json", import.meta.url),
      "utf8",
    ),
  ),
);
export function validateReviews(records, catalog) {
  assert(validate(records), JSON.stringify(validate.errors));
  assert.equal(
    new Set(records.map((row) => row.id)).size,
    records.length,
    "重复核验记录",
  );
  for (const row of records) {
    const item = catalog.find((item) => item.id === row.id);
    assert(item, "核验记录包含未知工具");
    for (const key of [
      "repo",
      "docs",
      "install",
      "name",
      "vendor",
      "maintainerType",
      "description",
    ])
      assert.equal(
        row[key],
        item[key],
        `${row.id} ${key}已变更，需复核或撤下旧核验记录`,
      );
    assert(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(
        row.reviewedAt,
      ),
      "无效核验时间格式",
    );
    assert(
      Number.isFinite(Date.parse(row.reviewedAt)) &&
        Date.parse(row.reviewedAt) <= Date.now(),
      "无效或未来核验时间",
    );
    const day = new Date(row.reviewedAt.slice(0, 10) + "T00:00:00Z");
    assert(
      Number.isFinite(day.getTime()) &&
        day.toISOString().slice(0, 10) === row.reviewedAt.slice(0, 10),
      "无效核验日期",
    );
    assert.equal(
      new Set(row.checks.map((check) => check.kind)).size,
      row.checks.length,
      "重复核验项目",
    );
    for (const check of row.checks) {
      const url = new URL(check.reference);
      assert(
        url.protocol === "https:" && !url.username && !url.password,
        "无效依据链接",
      );
      if (check.method === "execution") {
        assert(item.install, "没有安装方式，不应声明安装实测");
        assert(
          check.environment.trim() && check.version.trim(),
          "实测环境与版本不能为空白",
        );
      }
    }
  }
}
