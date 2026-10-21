/** 中英文本翻译；仅翻译代码中的静态片段，外部插值继续使用调用方的转义边界。 */
import english from "../data/ui.en.json" with { type: "json" };
/** 支持的页面语言。 */
export type Language = "zh" | "en";
const dictionary: Readonly<Record<string, string>> = english;
/** 翻译静态文字或 HTML 的文本与属性片段，保留边界空白和标签。 */
export function translate(text: string, language: Language): string {
  if (language === "zh") return text;
  return text.replace(/[^<>"\n]+/g, (part) => {
    const key = part.trim();
    const result = dictionary[key];
    if (result === undefined) return part;
    return (
      part.slice(0, part.indexOf(key)) +
      result +
      part.slice(part.indexOf(key) + key.length)
    );
  });
}
