/** Vite 双语静态输出与开发路由，共用同一页面生成器。 */
import { discoveryIndex, llmsIndex } from "./discovery-index.ts";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import type { Plugin } from "vite";
import {
  localizedPage,
  localizedPath,
  pagePaths,
  pageSource,
  sitemap,
} from "./localized-pages.ts";
/** 在构建后生成可独立抓取的 HTML，开发期提供相同路由。 */
export function localizedPages(): Plugin {
  return {
    name: "supercli-localized-pages",
    enforce: "post",
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        const pathname = new URL(request.url ?? "/", "http://localhost")
          .pathname;
        const discovery =
          pathname === "/catalog.json"
            ? discoveryIndex()
            : pathname === "/llms.txt"
              ? llmsIndex()
              : pathname === "/sitemap.xml"
                ? sitemap()
                : null;
        if (discovery) {
          response.setHeader(
            "Content-Type",
            pathname.endsWith(".json")
              ? "application/json; charset=utf-8"
              : pathname.endsWith(".xml")
                ? "application/xml; charset=utf-8"
                : "text/plain; charset=utf-8",
          );
          response.end(discovery);
          return;
        }
        const language = pathname.startsWith("/en/") ? "en" : "zh";
        const path = pathname.replace(/^\/en(?=\/)/, "");
        const source = pageSource(path);
        if (!source) {
          next();
          return;
        }
        try {
          const template = await readFile(
            resolve(server.config.root, source),
            "utf8",
          );
          const html = await server.transformIndexHtml(
            `/${source}`,
            localizedPage(template, path, language),
          );
          response.setHeader("Content-Type", "text/html; charset=utf-8");
          response.end(html);
        } catch (error) {
          next(error);
        }
      });
    },
    generateBundle(_, bundle) {
      this.emitFile({
        type: "asset",
        fileName: "catalog.json",
        source: discoveryIndex(),
      });
      this.emitFile({
        type: "asset",
        fileName: "llms.txt",
        source: llmsIndex(),
      });
      const templates = Object.fromEntries(
        ["index.html", "standards.html", "brand.html"].map((name) => {
          const asset = bundle[name];
          if (!asset || asset.type !== "asset")
            throw new Error(`Missing built template: ${name}`);
          return [name, String(asset.source)];
        }),
      );
      for (const path of pagePaths)
        for (const language of ["zh", "en"] as const) {
          const source = pageSource(path)!;
          const url = localizedPath(path, language);
          const fileName =
            url === "/"
              ? "index.html"
              : url.endsWith("/")
                ? `${url.slice(1)}index.html`
                : url.endsWith(".html")
                  ? url.slice(1)
                  : `${url.slice(1)}.html`;
          const html = localizedPage(templates[source], path, language);
          if (bundle[fileName]?.type === "asset")
            bundle[fileName].source = html;
          else this.emitFile({ type: "asset", fileName, source: html });
        }
      this.emitFile({
        type: "asset",
        fileName: "sitemap.xml",
        source: sitemap(),
      });
    },
  };
}
