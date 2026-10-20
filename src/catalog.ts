/** CLI 目录查询；路由：/；来源：人工收录清单与本地刷新快照。 */
import rawCatalog from "../data/catalog.json";
import rawMetrics from "../data/metrics.json";
import categories from "../data/categories.json";
/** 公开目录条目；非 GitHub CLI 使用官方文档，不虚构仓库。 */
export interface Entry {
  readonly id: string;
  readonly name: string;
  readonly vendor: string;
  readonly category: string;
  readonly repo: string | null;
  readonly description: string;
  readonly install: string | null;
  readonly docs: string;
  readonly icon: string;
  readonly locallyInstalled?: boolean;
}
/** 指标只表示仓库关注度，无可比数据的条目为 null。 */
export interface Metric {
  readonly repo: string;
  readonly stars: number;
  readonly forks: number;
  readonly pushedAt: string;
  readonly archived: boolean;
  readonly language: string | null;
  readonly license: string | null;
}
const catalog: readonly Entry[] = rawCatalog;
const metrics: {
  readonly fetchedAt: string;
  readonly repositories: Readonly<Record<string, Metric | null>>;
} = rawMetrics;
/** 读取指标，null 表示未计分。 */
export function stats(item: Entry): Metric | null {
  return metrics.repositories[item.id] ?? null;
}
/** 组合筛选与不可变排序；无指标条目始终放在数字榜单之后。 */
export function queryEntries(
  search: string,
  category: string,
  vendor: string,
  sort: string,
  localOnly = false,
): Entry[] {
  const query = search.trim().toLocaleLowerCase();
  return catalog
    .filter(
      (item) =>
        (!localOnly || item.locallyInstalled) &&
        (!category || item.category === category) &&
        (!vendor || item.vendor === vendor) &&
        [
          item.name,
          item.vendor,
          item.description,
          item.repo,
          item.install,
          categories[item.category as keyof typeof categories],
        ]
          .join(" ")
          .toLocaleLowerCase()
          .includes(query),
    )
    .toSorted((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      const left = stats(a);
      const right = stats(b);
      if (!left || !right)
        return Number(!!right) - Number(!!left) || a.name.localeCompare(b.name);
      if (sort === "updated")
        return (
          Date.parse(right.pushedAt) - Date.parse(left.pushedAt) ||
          a.name.localeCompare(b.name)
        );
      return right.stars - left.stars || a.name.localeCompare(b.name);
    });
}
export { catalog, categories, metrics };
