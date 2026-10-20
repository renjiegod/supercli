/** HTML 输出边界：所有外部文本及属性值转义，详情模板可独立回归。 */
import { categories, type Entry, type Metric } from "./catalog";
export const escapeHtml = (value: string): string =>
  value.replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ]!,
  );
const escape = escapeHtml;
const number = (value: number): string =>
  Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
/** 生成弹窗内容，指标字符串同投稿字段一样视为不可信文本。 */
export function detailMarkup(item: Entry, data: Metric | null): string {
  return `<img class="detail-icon" src="/icons/${escape(item.icon)}" alt="${escape(item.vendor)} 工具图标"><p class="eyebrow">${escape(item.vendor)} / ${escape(categories[item.category as keyof typeof categories])}</p><h2 id="detail-title">${escape(item.name)}</h2><p>${escape(item.description)}</p><div class="detail-stats"><span>${data ? number(data.stars) + " Stars" : "未计分"}</span><span>${escape(data?.language ?? "无可比 GitHub 指标")}</span><span>${data ? (data.archived ? "仓库已归档" : "仓库未归档") : "官方来源收录"}</span></div><h3>安装命令</h3><p class="install-note">复制后请先阅读官方文档，按你的系统与运行环境安装。</p><div class="install"><code>${escape(item.install ?? "请按官方文档安装；本站不提供未经核实的命令。")}</code>${item.install ? `<button class="button" data-copy="${escape(item.id)}">复制</button>` : ""}</div><div class="detail-links"><a class="button primary" href="${escape(item.docs)}" target="_blank" rel="noopener noreferrer">官方文档<i data-lucide="arrow-up-right"></i></a>${item.repo ? `<a class="button" href="https://github.com/${escape(item.repo)}" target="_blank" rel="noopener noreferrer">源码仓库</a>` : ""}</div><p class="detail-meta">仓库最近推送：${data ? new Date(data.pushedAt).toLocaleDateString("zh-CN") : "不适用"} · 许可证：${escape(data?.license ?? "见官方文档")}<br>图标来源：官方组织、维护者或标注出处的品牌资产，详见仓库 docs/ICONS.md。</p><a class="feedback" href="https://github.com/webkubor/supercli/issues/new?title=${escape(encodeURIComponent(`修正 ${item.name} 信息`))}" target="_blank" rel="noopener noreferrer">信息有误？提交修正</a>`;
}
