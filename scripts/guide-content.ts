/** 场景内容契约：工具事实引用目录，选型建议与官方资料分别呈现。 */
import { validateGuides } from "./guide-validation.ts";
import rawGuides from "../data/guides.json" with { type: "json" };
import type { Language } from "../src/translations.ts";
/** 双语编辑内容，禁止用 HTML 作为内容字段。 */
export interface GuideText {
  readonly zh: string;
  readonly en: string;
}
/** 场景中的工具建议，不改变目录条目或专项核验记录。 */
export interface GuideTool {
  readonly id: string;
  readonly task: GuideText;
  readonly fit: GuideText;
  readonly requirements: GuideText;
  readonly caveat: GuideText;
  readonly sources: readonly string[];
}
/** 独立可引用的场景指南。 */
export interface Guide {
  readonly slug: string;
  readonly category: string;
  readonly reviewedAt: string;
  readonly title: GuideText;
  readonly summary: GuideText;
  readonly answer: GuideText;
  readonly boundary: GuideText;
  readonly steps: readonly GuideText[];
  readonly tools: readonly GuideTool[];
}
/** 场景文案唯一来源。 */
export const guides: readonly Guide[] = rawGuides;
/** 读取当前语言内容。 */
export const guideText = (text: GuideText, language: Language): string =>
  text[language];
/** 仅为实际存在的场景返回内容。 */
export const guideFor = (path: string): Guide | undefined =>
  guides.find((guide) => path === `/guides/${guide.slug}/`);

validateGuides(guides);
