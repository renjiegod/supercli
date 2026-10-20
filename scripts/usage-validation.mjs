/** npm 下载快照：包名必须来自人工核验安装命令，不能与调用次数混用。 */
import assert from "node:assert/strict";
export function npmPackage(item) {
  return (
    /^npm install -(?:g|D) ((?:@[a-z0-9][a-z0-9._-]*\/)?[a-z0-9][a-z0-9._-]*)$/.exec(
      item.install ?? "",
    )?.[1] ?? null
  );
}
const date = (value) =>
  typeof value === "string" &&
  /^\d{4}-\d{2}-\d{2}$/.test(value) &&
  Number.isFinite(Date.parse(value)) &&
  new Date(value).toISOString().slice(0, 10) === value;
export function validateUsage(snapshot, catalog) {
  assert(snapshot && typeof snapshot === "object", "下载快照必须为对象");
  assert(
    typeof snapshot.fetchedAt === "string" &&
      Number.isFinite(Date.parse(snapshot.fetchedAt)),
    "下载快照时间无效",
  );
  assert(snapshot.source === "npm downloads API", "下载来源无效");
  assert(
    snapshot.packages &&
      typeof snapshot.packages === "object" &&
      !Array.isArray(snapshot.packages),
    "下载数据必须为对象",
  );
  assert.deepEqual(
    Object.keys(snapshot.packages).sort(),
    catalog.map((item) => item.id).sort(),
    "下载快照须覆盖全部目录",
  );
  for (const item of catalog) {
    const data = snapshot.packages[item.id];
    if (data === null) continue;
    assert(data && typeof data === "object", `${item.id} 下载数据无效`);
    assert(
      npmPackage(item) && data.package === npmPackage(item),
      `${item.id} 下载包来源不匹配`,
    );
    assert(data.repo === item.repo, `${item.id} 下载仓库来源不匹配`);
    assert(
      Number.isSafeInteger(data.downloads) && data.downloads >= 0,
      `${item.id} 下载数无效`,
    );
    assert(date(data.start) && date(data.end), `${item.id} 下载日期无效`);
    assert(
      Date.parse(data.end) - Date.parse(data.start) === 29 * 86400000,
      `${item.id} 必须为30天窗口`,
    );
    assert(
      Date.parse(data.end) <= Date.parse(snapshot.fetchedAt),
      `${item.id} 下载日期晚于抓取时间`,
    );
  }
}
