/** 工具用途的英文展示副本；目录与核验快照保持原文绑定，不修改收录事实。 */
import english from "../data/catalog.en.json";
import original from "../data/catalog.json";
import { language } from "./i18n";
const descriptions: Readonly<Record<string, string>> = english;
/** 仅翻译匹配当前目录的说明，未知或改动后的外部说明保留原文并继续转义。 */
export function description(item: {
  readonly id: string;
  readonly description: string;
}): string {
  const known = original.find((row) => row.id === item.id);
  return language === "en" && known?.description === item.description
    ? (descriptions[item.id] ?? item.description)
    : item.description;
}
