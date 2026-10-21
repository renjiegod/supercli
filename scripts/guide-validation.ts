/** 场景内容构建门禁：拒绝重复路由、缺失翻译、未知工具和非官方来源。 */
import Ajv from "ajv";
import catalog from "../data/catalog.json" with { type: "json" };
import categories from "../data/categories.json" with { type: "json" };
import schema from "../data/guides.schema.json" with { type: "json" };
import type { Guide } from "./guide-content.ts";
const shape = new Ajv({ allErrors: true }).compile<readonly Guide[]>(schema);
const hosts = new Set([
  "learn.chatgpt.com",
  "developers.openai.com",
  "code.claude.com",
  "geminicli.com",
  "developers.cloudflare.com",
  "vercel.com",
  "supabase.com",
  "github.com",
]);
function validateSources(
  sources: readonly string[],
  repo: string | null,
): void {
  for (const source of sources) {
    const url = new URL(source);
    if (
      url.protocol !== "https:" ||
      url.username ||
      url.password ||
      !hosts.has(url.hostname)
    )
      throw new Error("Guide sources must use official HTTPS URLs");
    if (
      url.hostname === "github.com" &&
      url.pathname.replace(/\/$/, "") !== `/${repo}`
    )
      throw new Error("Guide repository source does not match catalog");
  }
}
function validateTools(guide: Guide): void {
  if (new Set(guide.tools.map((tool) => tool.id)).size !== guide.tools.length)
    throw new Error("Duplicate guide tools");
  for (const tool of guide.tools) {
    const item = catalog.find(
      (item) => item.id === tool.id && item.category === guide.category,
    );
    if (!item) throw new Error("Unknown guide tool");
    validateSources(tool.sources, item.repo);
  }
}
/** 在渲染与公开索引生成前校验完整内容；失败时中止构建。 */
export function validateGuides(
  candidates: unknown,
): asserts candidates is readonly Guide[] {
  if (!shape(candidates))
    throw new Error(`Invalid guide content: ${JSON.stringify(shape.errors)}`);
  if (new Set(candidates.map((guide) => guide.slug)).size !== candidates.length)
    throw new Error("Duplicate guide path");
  for (const guide of candidates) {
    if (!Object.hasOwn(categories, guide.category))
      throw new Error("Invalid guide category");
    if (
      new Date(guide.reviewedAt).toISOString().slice(0, 10) !== guide.reviewedAt
    )
      throw new Error("Invalid guide review date");
    validateTools(guide);
  }
}
