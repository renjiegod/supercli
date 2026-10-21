/** 项目质检入口：绑定条目的 GitHub 仓库，按需跳转，不伪造或预加载评分。 */
import { msg } from "./i18n";
import type { Entry } from "./catalog";
import { escapeHtml } from "./escape";
/** 只为可核验的 GitHub owner/repo 生成 Scorecard 报告路由。 */
export function scorecardUrl(item: Pick<Entry, "repo">): string | null {
  if (!item.repo || !/^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/.test(item.repo))
    return null;
  return `https://scorecard.webkubor.online/#/report/${item.repo.split("/").map(encodeURIComponent).join("/")}`;
}
/** 详情中的辅助决策入口；质量报告不混入热度排名。 */
export function scorecardMarkup(item: Entry): string {
  const url = scorecardUrl(item);
  if (!url) return "";
  return msg`<section class="quality-panel" aria-label="项目质检"><div><h3>安装之前，了解项目成熟度</h3><p>用 Scorecard 查看文档、发布、测试等九维度质检。报告针对整个仓库，不代表安全认证，也不参与本站排名。</p><span>检查对象：${escapeHtml(item.repo!)}</span></div><a class="button" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer" aria-label="用 Scorecard 质检 ${escapeHtml(item.name)}，在新标签页打开">项目质检<i data-lucide="arrow-up-right"></i></a></section>`;
}
