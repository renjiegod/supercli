/** 页面语言、双语文案与切换链接；路由：/、/en/ 及对应详情、标准与品牌页。 */
import { translate, type Language } from "./translations";
/** URL 是语言真源；不自动跳转，以便搜索引擎和用户稳定访问两种版本。 */
export const language: Language =
  typeof location !== "undefined" && location.pathname.startsWith("/en/")
    ? "en"
    : "zh";
/** 日期使用当前页面语言。 */
export const locale = language === "en" ? "en-US" : "zh-CN";
/** 翻译代码中的静态文案，不接收用户输入作为模板。 */
export const t = (text: string): string => translate(text, language);
/** 工具的可抓取静态页面路径。 */
export const toolPath = (id: string): string =>
  `${language === "en" ? "/en" : ""}/tools/${encodeURIComponent(id)}/`;
/** 只翻译静态模板片段；插值不再处理，避免修改名称、命令或已转义外部信息。 */
export function msg(
  strings: TemplateStringsArray,
  ...values: readonly unknown[]
): string {
  return strings.reduce(
    (result, part, index) =>
      result + t(part) + (index < values.length ? String(values[index]) : ""),
    "",
  );
}
/** 生成对应语言 URL，保留工具、筛选和锚点。 */
export function languageUrl(url: URL, target: Language): URL {
  const result = new URL(url);
  const path = result.pathname.replace(/^\/en(?=\/)/, "");
  result.pathname = target === "en" ? `/en${path}` : path;
  return result;
}
/** 设置可访问的语言切换链接；独立 URL 同时承担刷新后的偏好保存。 */
export function setupLanguage(): void {
  document
    .querySelectorAll<HTMLAnchorElement>("[data-language]")
    .forEach((link) => {
      const target = link.dataset.language === "en" ? "en" : "zh";
      link.href = languageUrl(new URL(location.href), target).href;
      // 点击前再读取最新筛选和详情 URL。
      link.addEventListener("click", () => {
        link.href = languageUrl(new URL(location.href), target).href;
      });
    });
}

/** 中英文数量标签，英文根据数量使用单复数。 */
export function countLabel(
  value: number,
  unit: "results" | "tools" | "checks",
): string {
  if (language === "zh")
    return `${value} ${unit === "checks" ? "项有记录" : unit === "tools" ? "个工具" : "个"}`;
  const label = unit === "checks" ? "recorded check" : "tool";
  return `${value} ${label}${value === 1 ? "" : "s"}`;
}
