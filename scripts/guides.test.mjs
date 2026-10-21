/** 场景指南回归：双语可发现性、证据边界、路由和内容注入防护。 */
import { escapeHtml } from "../src/escape.ts";
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { guides } from "./guide-content.ts";
import { validateGuides } from "./guide-validation.ts";
import { guideMarkup } from "./guide-markup.ts";
import {
  localizedPage,
  pagePaths,
  pageSource,
  sitemap,
} from "./localized-pages.ts";
import { discoveryIndex, llmsIndex } from "./discovery-index.ts";
const template = readFileSync(
  new URL("../guides.html", import.meta.url),
  "utf8",
);

test("all scenarios produce bilingual static guides linked to tools, sources and sibling pages", () => {
  assert.equal(guides.length, 3);
  for (const guide of guides)
    for (const language of ["zh", "en"]) {
      const path = `/guides/${guide.slug}/`;
      const prefix = language === "en" ? "/en" : "";
      const html = localizedPage(template, path, language);
      assert.equal(pageSource(path), "guides.html");
      assert(pagePaths.includes(path));
      assert(sitemap().includes(`https://supercli.site${prefix}${path}`));
      assert(html.includes(`<h1>${guide.title[language]}</h1>`));
      assert(
        html.includes(
          `rel="canonical" href="https://supercli.site${prefix}${path}"`,
        ),
      );
      assert(
        html.includes(`href="${prefix}${path}" data-language="${language}"`),
      );
      assert(
        html.includes(
          language === "en"
            ? "not independent installation tests"
            : "不代表本站已完成独立安装实测",
        ),
      );
      for (const tool of guide.tools) {
        assert(html.includes(`href="${prefix}/tools/${tool.id}/"`));
        assert(html.includes(escapeHtml(tool.caveat[language])));
        for (const source of tool.sources)
          assert(html.includes(`href="${source}"`));
      }
      for (const other of guides.filter((item) => item.slug !== guide.slug))
        assert(html.includes(`href="${prefix}/guides/${other.slug}/"`));
      const structured = JSON.parse(
        html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1],
      );
      assert.equal(structured["@type"], "Article");
      assert.equal(structured.headline, guide.title[language]);
      assert.equal(structured.about.length, guide.tools.length);
      assert(structured.citation.length >= guide.tools.length);
    }
  for (const language of ["zh", "en"]) {
    const home = localizedPage(
      readFileSync(new URL("../index.html", import.meta.url), "utf8"),
      "/",
      language,
    );
    for (const guide of guides)
      assert(
        home.includes(
          `href="${language === "en" ? "/en" : ""}/guides/${guide.slug}/"`,
        ),
      );
  }
  assert.equal(JSON.parse(discoveryIndex()).guides.length, 3);
  for (const guide of guides)
    assert(llmsIndex().includes(`/en/guides/${guide.slug}/`));
});

test("guide validation rejects missing translations, invalid routes and unsafe or misbound sources", () => {
  const original = guides[0];
  for (const changed of [
    { ...original, slug: "../escape" },
    { ...original, title: { ...original.title, en: "" } },
    {
      ...original,
      tools: [
        { ...original.tools[0], id: "unknown" },
        ...original.tools.slice(1),
      ],
    },
    {
      ...original,
      tools: original.tools.map((tool) => ({
        ...tool,
        sources: ["javascript:alert(1)"],
      })),
    },
    {
      ...original,
      tools: original.tools.map((tool) => ({
        ...tool,
        sources: ["https://example.com/docs"],
      })),
    },
    {
      ...original,
      tools: original.tools.map((tool) => ({
        ...tool,
        sources: ["https://github.com/other/project"],
      })),
    },
  ])
    assert.throws(() => validateGuides([changed]));
  assert.throws(() => validateGuides([original, original]));
});

test("editorial text is escaped without turning notes into executable markup", () => {
  const attack = "<img src=x onerror=alert(1)>";
  const original = guides[0];
  const html = guideMarkup(
    { ...original, answer: { zh: attack, en: attack } },
    "en",
  );
  assert(!html.includes(attack));
  assert(html.includes("&lt;img src=x onerror=alert(1)&gt;"));
});
