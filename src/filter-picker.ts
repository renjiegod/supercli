/** 目录筛选弹层：复用 select 数据，提供搜索、键盘导航、关闭与焦点恢复。 */
import { escapeHtml } from "./escape";
const descriptions: Record<string, string> = {
  stars: "按关联仓库的收藏数排列",
  updated: "作者或维护者最近推送优先",
  downloads: "npm 近 30 天下载次数，不代表调用量",
  name: "按工具名称的字母顺序浏览",
};
/** 将原生数据控件增强为可检索的按钮面板；筛选仍通过 change 事件进入页面状态。 */
export function setupFilterPicker(
  select: HTMLSelectElement,
  searchable: boolean,
): void {
  const host = select.closest<HTMLElement>(".select-label")!;
  const label = searchable ? "筛选厂商" : "排序方式";
  const panelId = `${select.id}-panel`;
  const button = document.createElement("button");
  button.type = "button";
  button.className = "picker-trigger";
  button.setAttribute("aria-expanded", "false");
  button.setAttribute("aria-controls", panelId);
  const panel = document.createElement("div");
  panel.id = panelId;
  panel.className = "picker-panel";
  panel.hidden = true;
  panel.setAttribute("role", "group");
  panel.setAttribute("aria-label", label);
  panel.innerHTML = `${searchable ? '<input class="picker-search" type="search" placeholder="搜索厂商…" aria-label="搜索厂商">' : '<p class="picker-heading">排序方式</p>'}<div class="picker-options"></div><p class="picker-empty" hidden>没有匹配的厂商，试试其他名称。</p>`;
  host.append(button, panel);
  select.hidden = true;
  const input = panel.querySelector<HTMLInputElement>("input");
  const list = panel.querySelector<HTMLElement>(".picker-options")!;
  function sync(): void {
    const selected = select.selectedOptions[0];
    button.innerHTML = `<span><small>${searchable ? "厂商" : "排序"}</small><strong>${escapeHtml(selected.textContent ?? "")}</strong></span><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>`;
    button.setAttribute("aria-label", `${label}：${selected.textContent}`);
    const query = input?.value.trim().toLocaleLowerCase() ?? "";
    const options = [...select.options].filter((option) =>
      option.text.toLocaleLowerCase().includes(query),
    );
    list.innerHTML = options
      .map(
        (option) =>
          `<button type="button" class="picker-option" data-value="${escapeHtml(option.value)}" aria-pressed="${option.selected}"><span><strong>${escapeHtml(option.text)}</strong>${!searchable ? `<small>${descriptions[option.value]}</small>` : ""}</span><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg></button>`,
      )
      .join("");
    panel.querySelector<HTMLElement>(".picker-empty")!.hidden =
      options.length > 0;
  }
  function close(restore = false): void {
    panel.hidden = true;
    button.setAttribute("aria-expanded", "false");
    if (restore) button.focus();
  }
  function positionPanel(): void {
    if (panel.hidden) return;
    panel.classList.remove("opens-up");
    const bounds = panel.getBoundingClientRect();
    if (
      bounds.bottom > window.innerHeight - 12 &&
      button.getBoundingClientRect().top > bounds.height + 12
    )
      panel.classList.add("opens-up");
  }
  function open(): void {
    if (input) input.value = "";
    sync();
    panel.hidden = false;
    positionPanel();
    button.setAttribute("aria-expanded", "true");
    (
      input ??
      list.querySelector<HTMLButtonElement>('[aria-pressed="true"]') ??
      list.querySelector<HTMLButtonElement>("button")
    )?.focus();
  }
  button.addEventListener("click", () => (panel.hidden ? open() : close(true)));
  button.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      event.stopPropagation();
      open();
    }
  });
  panel.addEventListener("click", (event) => {
    const option = (event.target as HTMLElement).closest<HTMLButtonElement>(
      "[data-value]",
    );
    if (!option) return;
    select.value = option.dataset.value!;
    select.dispatchEvent(new Event("change", { bubbles: true }));
    sync();
    close(true);
  });
  host.addEventListener("keydown", (event) => {
    if (panel.hidden) return;
    if (event.key === "Escape") {
      event.preventDefault();
      close(true);
      return;
    }
    const options = [...list.querySelectorAll<HTMLButtonElement>("button")];
    const current = options.indexOf(
      document.activeElement as HTMLButtonElement,
    );
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    if (event.target === input && event.key !== "ArrowDown") return;
    event.preventDefault();
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? options.length - 1
          : (current + (event.key === "ArrowDown" ? 1 : -1) + options.length) %
            options.length;
    options[next]?.focus();
  });
  host.addEventListener("focusout", (event) => {
    if (!host.contains(event.relatedTarget as Node | null)) close();
  });
  document.addEventListener("pointerdown", (event) => {
    if (!host.contains(event.target as Node)) close();
  });
  window.addEventListener("resize", positionPanel);
  window.visualViewport?.addEventListener("resize", positionPanel);
  document.addEventListener(
    "scroll",
    (event) => {
      if (!panel.contains(event.target as Node)) positionPanel();
    },
    true,
  );
  input?.addEventListener("input", sync);
  select.addEventListener("change", sync);
  sync();
}
