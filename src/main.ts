/** 目录页面交互：搜索、筛选、排序、详情、安装命令复制；路由：/。 */
import {
  createIcons,
  GitFork,
  Plus,
  ArrowDownRight,
  GitPullRequest,
  Search,
  Info,
  ArrowUpRight,
  Copy,
  Star,
  X,
  SearchX,
  Cloud,
  Sparkles,
  Terminal,
  Link,
} from "lucide";
const icons = {
  GitFork,
  Plus,
  ArrowDownRight,
  GitPullRequest,
  Search,
  Info,
  ArrowUpRight,
  Copy,
  Star,
  X,
  SearchX,
  Cloud,
  Sparkles,
  Terminal,
  Link,
};
import {
  catalog,
  categories,
  metrics,
  queryEntries,
  stats,
  type Entry,
} from "./catalog";
import { escapeHtml as escape, detailMarkup } from "./html";
import "./style.css";
import { setupDiscovery, setupDetailLinks } from "./discovery";
const root = document.querySelector<HTMLElement>("#catalog")!;
const search = document.querySelector<HTMLInputElement>("#search")!;
const vendor = document.querySelector<HTMLSelectElement>("#vendor")!;
const sort = document.querySelector<HTMLSelectElement>("#sort")!;
const detail = document.querySelector<HTMLDialogElement>("#detail")!;
let category = "";
let localOnly = false;
let toastTimer: ReturnType<typeof setTimeout>;
const iconify = () => createIcons({ icons });
const number = (n: number) =>
  Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
function card(item: Entry, index: number): string {
  const metric = stats(item);
  const destination = item.repo ? `https://github.com/${item.repo}` : item.docs;
  return `<article class="card"><div class="card-top"><span class="rank">${sort.value === "stars" && !metric ? "—" : String(index + 1).padStart(2, "0")}</span><img class="vendor-icon" src="/icons/${escape(item.icon)}" alt="${escape(item.vendor)} 工具图标" width="40" height="40" loading="lazy"><span class="tag">${escape(categories[item.category as keyof typeof categories])}</span></div><button class="card-title" data-detail="${escape(item.id)}">${escape(item.name)}<i data-lucide="arrow-up-right"></i></button><p class="vendor-name">${escape(item.vendor)}</p><p class="description">${escape(item.description)}</p><div class="card-bottom"><a href="${escape(destination)}" target="_blank" rel="noopener noreferrer" aria-label="${escape(item.name)} 的官方来源"><i data-lucide="star"></i>${metric ? number(metric.stars) : "未计分"}<span>${metric ? "Stars" : "官方文档"}</span></a><button class="copy" data-copy="${escape(item.id)}" aria-label="复制 ${escape(item.name)} 安装命令"><i data-lucide="copy"></i>${item.install ? "安装" : "详情"}</button></div></article>`;
}
function render(): void {
  const items = queryEntries(
    search.value,
    category,
    vendor.value,
    sort.value,
    localOnly,
  );
  root.innerHTML = items.map(card).join("");
  document.querySelector("#result-count")!.textContent = `${items.length} 个`;
  document.querySelector<HTMLElement>("#empty")!.hidden = items.length > 0;
  document
    .querySelectorAll<HTMLButtonElement>("[data-category]")
    .forEach((button) =>
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.category === category),
      ),
    );
  const params = new URLSearchParams();
  const tool = new URLSearchParams(location.search).get("tool");
  if (tool) params.set("tool", tool);
  if (search.value) params.set("q", search.value);
  if (category) params.set("category", category);
  if (vendor.value) params.set("vendor", vendor.value);
  if (localOnly) params.set("local", "1");
  if (sort.value !== "stars") params.set("sort", sort.value);
  history.replaceState(
    null,
    "",
    `${location.pathname}${params.size ? `?${params}` : ""}${location.hash}`,
  );
  iconify();
}
function notify(message: string): void {
  const toast = document.querySelector<HTMLElement>("#toast")!;
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("visible"), 2600);
}
async function copyCommand(item: Entry): Promise<void> {
  if (!item.install) {
    showDetail(item);
    return;
  }
  try {
    await navigator.clipboard.writeText(item.install);
    notify(`已复制：${item.install}`);
  } catch {
    showDetail(item);
    notify("无法访问剪贴板，请在详情中手动复制安装命令。");
  }
}
function showDetail(item: Entry): void {
  const data = stats(item);
  document.querySelector("#detail-content")!.innerHTML = detailMarkup(
    item,
    data,
  );
  const url = new URL(location.href);
  url.searchParams.set("tool", item.id);
  history.replaceState(null, "", url);
  if (!detail.open) detail.showModal();
  iconify();
}
function initFilters(): void {
  document.querySelector("#category-total")!.textContent = String(
    Object.keys(categories).length,
  ).padStart(2, "0");
  document.querySelector("#total")!.textContent = String(
    catalog.length,
  ).padStart(2, "0");
  const time = new Date(metrics.fetchedAt);
  document.querySelector("#updated")!.textContent =
    `数据快照 ${time.toLocaleString("zh-CN", { timeZone: "Asia/Taipei", hour12: false })} UTC+8`;
  vendor.innerHTML += [...new Set(catalog.map((item) => item.vendor))]
    .toSorted()
    .map((name) => `<option>${escape(name)}</option>`)
    .join("");
  document.querySelector("#categories")!.innerHTML = [
    ["", "全部工具"],
    ...Object.entries(categories),
  ]
    .map(
      ([id, label]) =>
        `<button data-category="${escape(id)}" aria-pressed="${id === ""}">${escape(label)}<span>${catalog.filter((item) => !id || item.category === id).length}</span></button>`,
    )
    .join("");
  const params = new URLSearchParams(location.search);
  search.value = params.get("q") ?? "";
  category = params.get("category") ?? "";
  localOnly = params.get("local") === "1";
  document.querySelector<HTMLInputElement>("#local-only")!.checked = localOnly;
  if (!Object.hasOwn(categories, category)) category = "";
  vendor.value = params.get("vendor") ?? "";
  if (!vendor.value) vendor.value = "";
  sort.value = ["stars", "updated", "name"].includes(params.get("sort") ?? "")
    ? params.get("sort")!
    : "stars";
}
function setupEvents(): void {
  document.querySelector("#local-only")!.addEventListener("change", (event) => {
    localOnly = (event.target as HTMLInputElement).checked;
    render();
  });
  [search, vendor, sort].forEach((element) =>
    element.addEventListener(element === search ? "input" : "change", render),
  );
  document.addEventListener("click", (event) => {
    const target = (event.target as HTMLElement).closest<HTMLElement>("button");
    if (!target) return;
    if (target.dataset.category !== undefined) {
      category = target.dataset.category;
      render();
      if (target.classList.contains("use-case"))
        document
          .querySelector("#directory")!
          .scrollIntoView({ block: "start" });
    }
    const item = catalog.find(
      (entry) => entry.id === (target.dataset.detail ?? target.dataset.copy),
    );
    if (item && target.dataset.detail) showDetail(item);
    if (item && target.dataset.copy) void copyCommand(item);
    if (target.classList.contains("close")) target.closest("dialog")?.close();
  });
  document
    .querySelector("#method-open")!
    .addEventListener("click", () =>
      document.querySelector<HTMLDialogElement>("#method")!.showModal(),
    );
  document.querySelector("#reset")!.addEventListener("click", () => {
    search.value = "";
    vendor.value = "";
    category = "";
    localOnly = false;
    document.querySelector<HTMLInputElement>("#local-only")!.checked = false;
    render();
    search.focus();
  });
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "/" &&
      !["INPUT", "TEXTAREA", "SELECT"].includes(
        (event.target as HTMLElement).tagName,
      ) &&
      !document.querySelector("dialog[open]")
    ) {
      event.preventDefault();
      search.focus();
    }
  });
}
initFilters();
setupEvents();
render();

setupDiscovery(showDetail, copyCommand);
setupDetailLinks(showDetail, notify);
iconify();
