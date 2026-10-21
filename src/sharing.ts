/** X 分享只打开用户可编辑的发布页，不自动发送；路由：目录首页与工具详情。 */
import { language } from "./i18n";
/** 生成无第三方脚本的 X Web Intent，参数统一编码。 */
export function xShareUrl(url: string, text: string): string {
  const intent = new URL("https://twitter.com/intent/tweet");
  intent.search = new URLSearchParams({ url, text }).toString();
  return intent.href;
}
/** 工具分享使用静态可抓取的独立页面；目录保留当前筛选条件。 */
export function sharePageUrl(current: URL, tool?: string): URL {
  const result = new URL(current);
  if (tool) {
    result.pathname = `${language === "en" ? "/en" : ""}/tools/${encodeURIComponent(tool)}/`;
    result.search = "";
    result.hash = "";
  }
  return result;
}
/** 同步当前筛选与工具详情，不依赖分享按钮先获得焦点。 */
export function updateSharing(): void {
  const current = new URL(location.href);
  document
    .querySelectorAll<HTMLAnchorElement>("[data-share-x]")
    .forEach((link) => {
      const tool =
        link.dataset.shareX === "tool"
          ? (current.searchParams.get("tool") ??
            current.pathname.match(/\/tools\/([^/]+)\//)?.[1])
          : undefined;
      const title = tool
        ? (document.querySelector("#detail-title")?.textContent ?? "SuperCLI")
        : document.title;
      link.href = xShareUrl(
        sharePageUrl(current, tool ?? undefined).href,
        title,
      );
    });
}
/** 点击时重新读取最新 URL；用户在 X 发布页自行确认发送。 */
export function setupSharing(): void {
  document
    .querySelectorAll<HTMLAnchorElement>("[data-share-x]")
    .forEach((link) => {
      link.addEventListener("click", updateSharing);
      link.addEventListener("focus", updateSharing);
    });
  updateSharing();
}
