/** 首页发现入口：使用目录真源，不展示虚构活动或安装结果。 */
import { resetCopyFeedback } from "./interaction-feedback";
import { catalog, stats } from "./catalog";
import { escapeHtml as escape } from "./html";
import type { Entry } from "./catalog";

export function setupDiscovery(
  open: (item: Entry) => void,
  copy: (item: Entry) => Promise<void>,
): void {
  const picks = ["wrangler", "gh", "rg"]
    .map((id) => catalog.find((item) => item.id === id))
    .filter((item): item is Entry => Boolean(item));
  const root = document.querySelector<HTMLElement>("#stage-tools")!;
  root.innerHTML = picks
    .map(
      (item, index) =>
        `<button class="stage-tool" aria-describedby="stage-caption stage-command" data-stage="${escape(item.id)}"><img src="/icons/${escape(item.icon)}" alt="" width="36" height="36"><span><strong>${escape(item.name)}</strong><small>${escape(item.vendor)}</small></span><span class="stage-stars">${stats(item)?.stars.toLocaleString("en") ?? "未计分"}<small>${stats(item) ? "GitHub Stars" : "官方来源"}</small></span><span class="stage-number">0${index + 1}</span></button>`,
    )
    .join("");
  let selected = picks[0];
  const copyButton = document.querySelector<HTMLButtonElement>("#stage-copy")!;
  function preview(item: Entry): void {
    resetCopyFeedback(copyButton);
    selected = item;
    document.querySelector("#stage-command")!.textContent =
      item.install ?? "请查看官方文档";
    document.querySelector("#stage-command-label")!.textContent =
      `${item.name} 安装命令`;
    copyButton.dataset.preview = item.id;
    copyButton.setAttribute("aria-label", `复制 ${item.name} 安装命令`);
    root
      .querySelectorAll<HTMLButtonElement>("[data-stage]")
      .forEach((button) => {
        button.classList.toggle("is-preview", button.dataset.stage === item.id);
      });
  }
  function previewFrom(event: Event): void {
    const id = (event.target as HTMLElement).closest<HTMLElement>(
      "[data-stage]",
    )?.dataset.stage;
    const item = picks.find((entry) => entry.id === id);
    if (item && item !== selected) preview(item);
  }
  root.addEventListener("pointerover", previewFrom);
  root.addEventListener("focusin", previewFrom);
  if (selected) preview(selected);
  root.addEventListener("click", (event) => {
    const id = (event.target as HTMLElement).closest<HTMLElement>(
      "[data-stage]",
    )?.dataset.stage;
    const item = picks.find((entry) => entry.id === id);
    if (item) {
      preview(item);
      open(item);
    }
  });
  document.querySelector("#stage-copy")!.addEventListener("click", () => {
    if (selected) void copy(selected);
  });
}

/** 详情使用 query 参数直达；保留筛选条件，关闭时移除详情状态。 */
export function setupDetailLinks(
  open: (item: Entry) => void,
  notify: (message: string) => void,
): void {
  const detail = document.querySelector<HTMLDialogElement>("#detail")!;
  const initial = new URLSearchParams(location.search).get("tool");
  const item = catalog.find((entry) => entry.id === initial);
  if (item) open(item);
  else if (initial) {
    const url = new URL(location.href);
    url.searchParams.delete("tool");
    history.replaceState(null, "", url);
    notify("这个工具尚未收录，可在目录中搜索或提交。");
  }
  detail.addEventListener("close", () => {
    const url = new URL(location.href);
    url.searchParams.delete("tool");
    history.replaceState(null, "", url);
  });
  document
    .querySelector("#detail-share")!
    .addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(location.href);
        notify("已复制工具详情链接");
      } catch {
        notify("无法访问剪贴板，请复制浏览器地址栏中的链接。");
      }
    });
}
