/** 构建产物验收：静态页面、语言标记、分享卡片与机器索引不可缺失。 */
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
const read = (path) => readFileSync(resolve("dist", path), "utf8");
const snapshot = JSON.parse(read("catalog.json"));
const paths = [...read("sitemap.xml").matchAll(/<loc>([^<]+)<\/loc>/g)].map(
  (match) => new URL(match[1]),
);
assert.equal(paths.length, (snapshot.tools.length + 3) * 2);
for (const url of paths) {
  const file =
    url.pathname === "/"
      ? "index.html"
      : url.pathname.endsWith("/")
        ? `${url.pathname.slice(1)}index.html`
        : url.pathname.endsWith(".html")
          ? url.pathname.slice(1)
          : `${url.pathname.slice(1)}.html`;
  const html = read(file);
  const lang = url.pathname.startsWith("/en/") ? "en" : "zh-CN";
  assert(html.includes(`<html lang="${lang}">`), file);
  assert(html.includes(`<link rel="canonical" href="${url.href}">`), file);
  assert.match(html, /hreflang="en"/);
  assert.match(html, /hreflang="zh-CN"/);
  assert.match(
    html,
    /name="twitter:image" content="https:\/\/supercli.site\/social-card.png"/,
  );
  for (const script of html.matchAll(
    /<script type="application\/ld\+json">(.*?)<\/script>/gs,
  )) {
    const data = JSON.parse(script[1]);
    assert.equal(data.url, url.href);
    assert.equal(data.inLanguage, lang);
  }
  for (const asset of html.matchAll(/(?:src|href)="(\/assets\/[^"?#]+)"/g))
    assert(existsSync(resolve("dist", asset[1].slice(1))), asset[1]);
}
assert.match(read("llms.txt"), /Machine-readable catalog/);
assert(!JSON.stringify(snapshot).includes("locallyInstalled"));
assert(
  readFileSync("dist/social-card.png")
    .subarray(0, 8)
    .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])),
);
console.log(
  `Validated ${paths.length} localized pages, linked assets, share metadata and public discovery indexes.`,
);
