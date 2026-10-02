document.documentElement.classList.add("has-js");
// A missing remote cover restores the ordinary editorial row, without placeholders.
document.querySelectorAll(".record-ghost img").forEach((image) => {
  const remove = () => {
    image.closest(".record-row")?.classList.remove("has-ghost-cover");
    image.closest(".record-ghost")?.remove();
  };
  image.addEventListener("error", remove, { once: true });
  if (image.complete && !image.naturalWidth) remove();
});
const menu = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#main-navigation");
menu?.addEventListener("click", () => {
  const open = menu.getAttribute("aria-expanded") !== "true";
  menu.setAttribute("aria-expanded", String(open));
  navigation.classList.toggle("is-open", open);
});
document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    menu?.getAttribute("aria-expanded") === "true"
  ) {
    menu.setAttribute("aria-expanded", "false");
    navigation.classList.remove("is-open");
    menu.focus();
  }
});
const search = document.querySelector("#record-search");
const category = document.querySelector("#category-filter");
function filterRecords(updateUrl = true) {
  const query = search.value.trim().toLowerCase();
  let count = 0;
  document.querySelectorAll("[data-record]").forEach((record) => {
    const show =
      record.dataset.search.includes(query) &&
      (!category.value || record.dataset.category === category.value);
    record.hidden = !show;
    if (show) count++;
  });
  document.querySelector("#record-count").textContent =
    `${count} ${count === 1 ? "record" : "records"}`;
  document.querySelector("#empty-records").hidden = count !== 0;
  if (updateUrl) {
    const params = new URLSearchParams();
    if (search.value.trim()) params.set("q", search.value.trim());
    if (category.value) params.set("category", category.value);
    history.replaceState(
      null,
      "",
      location.pathname + (params.size ? "?" + params.toString() : ""),
    );
  }
}
if (search) {
  const restore = () => {
    const params = new URLSearchParams(location.search);
    search.value = params.get("q") || "";
    category.value = params.get("category") || "";
    filterRecords(false);
  };
  restore();
  window.addEventListener("popstate", restore);
  search.addEventListener("input", () => filterRecords());
  category.addEventListener("change", () => filterRecords());
  search.form.addEventListener("submit", (event) => {
    event.preventDefault();
    filterRecords();
  });
  document.querySelector("#reset-search").addEventListener("click", (event) => {
    event.preventDefault();
    search.value = "";
    category.value = "";
    filterRecords();
    search.focus();
  });
}
let toastTimer;
async function copy(text) {
  const status = document.querySelector("#blog-status");
  try {
    await navigator.clipboard.writeText(text);
    status.textContent = "Copied to clipboard";
  } catch {
    status.textContent =
      "Clipboard unavailable. Select the text or address to copy it.";
  }
  status.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => status.classList.remove("visible"), 3000);
}
document
  .querySelector(".copy-article")
  ?.addEventListener("click", () => copy(location.origin + location.pathname));
document.querySelectorAll(".prose pre").forEach((pre) => {
  const button = document.createElement("button");
  button.className = "code-copy";
  button.textContent = "Copy code";
  button.addEventListener("click", () =>
    copy(pre.querySelector("code").textContent),
  );
  pre.before(button);
});
