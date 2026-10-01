import { CollapseStudies } from "./collapse-art.js";
import {
  BrokenDiamond,
  TextilePattern,
  ArticleMetadata,
  ArticleCard,
} from "./components.js";
const colors = [
  ["background-primary", "Snow", "#F7F8F8"],
  ["background-secondary", "Frost", "#EBEFF1"],
  ["surface", "Paper", "#FFFFFF"],
  ["text-primary", "Deep navy", "#202F3D"],
  ["text-secondary", "Slate", "#586874"],
  ["border", "Mist", "#CDD5DA"],
  ["accent-blue", "Northern blue", "#486A80"],
  ["accent-red", "Muted crimson", "#914B50"],
  ["accent-beige", "Linen", "#DDD4C4"],
  ["void", "Polar night", "#111C27"],
  ["collapse-purple", "Dusk", "#72667F"],
];
const sections = [
  ["typography", "Typography"],
  ["colors", "Color palette"],
  ["elements", "Elements"],
  ["patterns", "Motif & pattern"],
  ["layout", "Layout & spacing"],
];
function heading(number, title, note) {
  return `<div class="section-heading"><h2><span class="section-number">${number}</span>${title}</h2><span class="section-note">${note}</span></div>`;
}
document.querySelector("#app").innerHTML = `
<header class="site-header"><a href="/design-system" class="wordmark">${BrokenDiamond({ size: 28 })}<span>NORTHLINE</span></a><span class="header-description">A personal journal & research archive</span><a class="header-link" href="#foundations">Design system <span class="version">v1.0</span></a></header>
<main id="main"><section class="intro" id="foundations"><div class="intro-copy"><div class="eyebrow"><span class="small-line"></span> The foundations &nbsp; / &nbsp; 001</div><h1>A quiet framework<br>for northern thoughts<span class="period">.</span></h1><p>An identity shaped by open landscapes, thoughtful words,<br class="desktop-break"> and the beauty of things left unspoken.</p><div class="intro-tags"><span>Editorial by nature</span><i></i><span>Northern in spirit</span><i></i><span>Built to endure</span></div></div><div class="hero-mark" aria-hidden="true"><div class="mark-grid">${BrokenDiamond({ size: 122 })}<span class="grid-dot dot-one"></span><span class="grid-dot dot-two"></span></div><span class="mark-coordinate">FORM 01 &nbsp; — &nbsp; AN INTENTIONAL ABSENCE</span></div></section>
<nav class="section-nav" aria-label="Design system sections">${sections.map(([id, name], i) => `<a href="#${id}"><span>0${i + 1}</span>${name}</a>`).join("")}<span class="edition">FOUNDATION EDITION</span></nav>
<section id="typography" class="ds-section">${heading("01", "Typography", "A literary voice. A clear reading rhythm.")}<div class="type-layout"><div class="type-display"><span class="eyebrow">Georgia &nbsp; / &nbsp; Display serif</span><div class="giant-type">Aa<span class="type-star">*</span></div><p class="type-description">A familiar serif with an unhurried character.<br>For stories, observations, and considered ideas.</p><div class="alphabet">ABCDEFGHIJKLMNOPQRSTUVWXYZ<br>abcdefghijklmnopqrstuvwxyz &nbsp; 0123456789</div><div class="font-pair"><span class="eyebrow">The supporting voices</span><p><strong>System Sans</strong><span>Interface & wayfinding</span></p><p><strong class="mono">System Mono</strong><span>Data & code</span></p></div></div><div class="type-scale">
${[
  ["Display", "56 / 1.12", "display", "Where the north begins"],
  ["Heading 1", "40 / 1.2", "h1", "Notes from the edge"],
  ["Heading 2", "30 / 1.3", "h2", "The art of paying attention"],
  ["Heading 3", "23 / 1.4", "h3", "Small things, carefully kept"],
  [
    "Body",
    "18 / 1.75",
    "body",
    "There is a particular kind of clarity in the cold. The world grows quieter, and the smallest details begin to carry more meaning.",
  ],
  [
    "Caption",
    "13 / 1.5",
    "caption",
    "Fig. 01 — A study of light, distance, and stillness.",
  ],
  ["Metadata", "11 / 1.6", "metadata", "18 JANUARY 2026  /  6 MIN READ"],
  ["Navigation", "13 / 1.5", "navigation", "Journal     Research     About"],
  ["Code", "14 / 1.7", "code", 'const season = "winter";'],
  ["Quote", "24 / 1.55", "quote", "“Leave room for the unspoken.”"],
]
  .map(
    ([label, spec, cls, sample]) =>
      `<div class="type-row"><div class="type-label">${label}<span>${spec}</span></div><div class="sample-${cls}">${sample}</div></div>`,
  )
  .join("")}</div></div></section>
<section id="colors" class="ds-section">${heading("02", "Color palette", "Drawn from snow, stone, and the long blue hour.")}<div class="palette-intro"><p>Cool foundations. Measured accents.<br>A little warmth, only where it matters.</p><span class="micro">Select a swatch to copy its CSS token ↗</span></div><div class="swatch-grid">${colors.map(([token, name, hex], i) => `<button class="swatch" data-copy="--${token}: ${hex};" aria-label="Copy ${token}: ${hex}"><span class="swatch-color" style="--swatch:${hex}"><span class="swatch-index ${[3, 4, 6, 7, 9, 10].includes(i) ? "light" : ""}">${String(i + 1).padStart(2, "0")}</span>${i === 10 ? '<span class="reserved">Reserved</span>' : ""}</span><span class="swatch-label">${name}<span>${hex}</span></span><span class="swatch-token">--${token}</span></button>`).join("")}</div><p class="usage-note"><span class="crimson-dot"></span> Crimson is a punctuation mark, never a background. Dusk appears only when an ornament becomes uncertain.</p></section>
<section id="elements" class="ds-section">${heading("03", "Elements", "Small, useful, and quietly consistent.")}<div class="element-grid"><div class="specimen"><h3 class="eyebrow">Buttons & links</h3><div class="button-row"><a class="button primary" href="#layout">Explore the system <span>↗</span></a><button class="button secondary" id="copy-tokens">Copy tokens <span aria-hidden="true">⧉</span></button></div><div class="button-row"><a class="text-link" href="#typography">Continue reading <span>→</span></a><button class="button" disabled>Unavailable</button></div><p class="micro">Clear actions. Underlined links. Visible keyboard focus.</p></div><div class="specimen"><h3 class="eyebrow">Article metadata</h3>${ArticleMetadata()}<h3 class="sample-h3 metadata-title">A place for considered thoughts</h3><p class="micro">A quiet hierarchy of subject, date, and reading time.</p></div><div class="specimen quote-specimen"><h3 class="eyebrow">Blockquote</h3><blockquote><p>“In the quiet, we begin to notice<br>what was always there.”</p><cite>From the northern notebooks</cite></blockquote></div><div class="specimen"><div class="specimen-top"><h3 class="eyebrow">Code block</h3><button class="copy-code" data-copy='const journal = {\n  season: "winter",\n  pace: "unhurried"\n};' aria-label="Copy code example">Copy ⧉</button></div><pre><code><span class="code-key">const</span> journal = {
  season: <span class="code-string">"winter"</span>,
  pace: <span class="code-string">"unhurried"</span>
};</code></pre></div><div class="specimen"><h3 class="eyebrow">Editorial card</h3>${ArticleCard()}</div><div class="specimen"><h3 class="eyebrow">Image & caption</h3><figure><div class="landscape" role="img" aria-label="Abstract study of a pale winter horizon in blue-grey"><div class="horizon-far"></div><div class="horizon-near"></div><span>STUDY OF STILLNESS / 01</span></div><figcaption><span>Fig. 01</span> An imagined shoreline, in the quiet of winter.<span class="caption-credit">Original tonal study</span></figcaption></figure></div><div class="specimen full"><h3 class="eyebrow">Navigation</h3><nav class="nav-specimen" aria-label="Example journal navigation"><span class="wordmark">${BrokenDiamond()}<span>NORTHLINE</span></span><div role="tablist" aria-label="Sample navigation"><button role="tab" aria-selected="true" tabindex="0" data-nav="Journal">Journal</button><button role="tab" aria-selected="false" tabindex="-1" data-nav="Research">Research</button><button role="tab" aria-selected="false" tabindex="-1" data-nav="About">About</button></div><span class="micro nav-aside">Words from the north</span></nav><p id="nav-feedback" class="micro" role="tabpanel">Journal — personal observations and field notes.</p></div></div></section>
<section id="patterns" class="ds-section">${heading("04", "Motif & pattern", "An open form. A thread of continuity.")}<div class="motif-layout"><div class="motif-panel"><div class="motif-sizes">${[24, 48, 80].map((size) => `<div>${BrokenDiamond({ size })}<span>${size} px</span></div>`).join("")}</div><div class="motif-description"><h3>BrokenDiamond</h3><p>Four points, three edges. The missing segment leaves the form open — a small reminder that a thought need not be finished.</p><code>BrokenDiamond({ size: 24 })</code></div></div><div class="pattern-panel"><span class="eyebrow">A simple woven rhythm</span>${TextilePattern()}<p>A restrained geometric repeat, inspired by the structure of northern textiles. Use as a quiet boundary, with room to breathe.</p></div></div><div class="separator-examples"><div><span class="micro">Hairline</span><hr></div><div><span class="micro">Motif divider</span><div class="motif-divider"><span></span>${BrokenDiamond({ size: 18 })}<span></span></div></div></div></section>
<section id="layout" class="ds-section">${heading("05", "Layout & spacing", "Room to read. Space to think.")}<div class="spacing-intro"><p>A 4 px base, a generous rhythm.<br>Reading measure is kept to 65 characters.</p><div class="spacing-scale">${[4, 8, 12, 16, 24, 32, 48, 64, 96].map((n) => `<div><span style="height:${n}px"></span><code>${n}</code></div>`).join("")}</div></div><div class="responsive-heading"><div><h3>One voice, at every size.</h3><p class="micro">A live specimen of the same components across viewports.</p></div><div class="viewport-controls" role="group" aria-label="Preview viewport">${[
  ["desktop", "Desktop", "1200"],
  ["tablet", "Tablet", "768"],
  ["mobile", "Mobile", "375"],
]
  .map(
    ([mode, label, width], i) =>
      `<button data-viewport="${mode}" aria-pressed="${i === 0}">${label}<span>${width}</span></button>`,
  )
  .join(
    "",
  )}</div></div><div class="responsive-stage"><iframe title="Responsive journal component preview" src="/preview.html" id="responsive-preview"></iframe></div><p class="micro preview-caption">Specimen viewport: <span id="viewport-label">1200 px · desktop</span><span>Fluid type · flexible columns · consistent rhythm</span></p></section>
<aside class="closing-note">${BrokenDiamond({ size: 22 })}<p>The atmosphere lives in the fundamentals.<br><span>Good typography, honest materials, and enough space to be still.</span></p><span class="eyebrow">Nothing more is needed.</span></aside></main><footer><span>NORTHLINE <span class="footer-divider">/</span> Design system</span><span>Foundation edition · 2026</span><a href="#foundations">Back to the beginning ↑</a></footer><div id="toast" class="toast" role="status" aria-live="polite"></div>`;

document
  .querySelector(".closing-note")
  .insertAdjacentHTML("beforebegin", CollapseStudies());
await import("./collapse.js");

let toastTimer;
async function copy(text) {
  try {
    await navigator.clipboard.writeText(text);
    announce("Copied to clipboard");
  } catch {
    announce("Clipboard unavailable. Select the token text to copy it.");
  }
}
function announce(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("visible"), 3000);
}
document
  .querySelectorAll("[data-copy]")
  .forEach((button) =>
    button.addEventListener("click", () => copy(button.dataset.copy)),
  );
document
  .querySelector("#copy-tokens")
  .addEventListener("click", () =>
    copy(
      ":root {\n" +
        colors.map(([token, , hex]) => `  --${token}: ${hex};`).join("\n") +
        "\n}",
    ),
  );
const tabs = [...document.querySelectorAll("[data-nav]")];
const tabCopy = {
  Journal: "personal observations and field notes.",
  Research: "reading notes, questions, and collected knowledge.",
  About: "the person and purpose behind the journal.",
};
function selectTab(tab) {
  tabs.forEach((item) => {
    item.setAttribute("aria-selected", String(item === tab));
    item.tabIndex = item === tab ? 0 : -1;
  });
  document.querySelector("#nav-feedback").textContent =
    `${tab.dataset.nav} — ${tabCopy[tab.dataset.nav]}`;
}
tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectTab(tab));
  tab.addEventListener("keydown", (event) => {
    let next;
    if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
    if (event.key === "ArrowLeft")
      next = (index + tabs.length - 1) % tabs.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = tabs.length - 1;
    if (next !== undefined) {
      event.preventDefault();
      selectTab(tabs[next]);
      tabs[next].focus();
    }
  });
});
let viewport = "desktop";
function resizePreview() {
  const widths = { desktop: 1200, tablet: 768, mobile: 375 };
  const frame = document.querySelector("#responsive-preview");
  const stage = frame.parentElement;
  const width = widths[viewport];
  const scale = Math.min(1, (stage.clientWidth - 32) / width);
  frame.style.width = width + "px";
  frame.style.height = (viewport === "mobile" ? 680 : 360) + "px";
  frame.style.transform = `scale(${scale})`;
  stage.style.height = (viewport === "mobile" ? 680 : 360) * scale + 32 + "px";
  document.querySelector("#viewport-label").textContent =
    `${width} px · ${viewport}`;
}
document.querySelectorAll("[data-viewport]").forEach((button) =>
  button.addEventListener("click", () => {
    viewport = button.dataset.viewport;
    document
      .querySelectorAll("[data-viewport]")
      .forEach((item) =>
        item.setAttribute("aria-pressed", String(item === button)),
      );
    resizePreview();
  }),
);
new ResizeObserver(resizePreview).observe(
  document.querySelector(".responsive-stage"),
);
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        document.querySelectorAll(".section-nav a").forEach((link) => {
          const active = link.hash === "#" + entry.target.id;
          link.classList.toggle("active", active);
          if (active) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      }
    });
  },
  { rootMargin: "-15% 0px -65% 0px" },
);
document
  .querySelectorAll(".ds-section")
  .forEach((section) => observer.observe(section));
