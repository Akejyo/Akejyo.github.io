import { PersonaArtwork } from "./persona-art.js";
import { BrokenDiamond } from "./components.js";
import { TextileBand, FootprintTrail } from "./folklore.js";
import { CollapseEffect } from "./collapse-art.js";
import {
  CressonControl,
  UncertainFootprints,
  SnowField,
  SnowAtmosphere,
} from "./story-art.js";
import { site, expeditions } from "./site.js";
import { recordCover } from "./record-cover.js";
export const escape = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ],
  );
export const date = (value) =>
  new Date(value + "T12:00:00Z").toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
const routes = [
  ["/", "FIELD", "Home"],
  ["/records", "RECORDS", "Writing"],
  ["/projects", "EXPEDITIONS", "Projects"],
  ["/archive", "ARCHIVE", "By date"],
  ["/about", "ABOUT", "The person"],
];
function navigation(current) {
  return routes
    .map(([url, label, plain]) => {
      const active =
        current === url || (url !== "/" && current.startsWith(url + "/"));
      return `<a href="${url}" ${active ? 'aria-current="page"' : ""}><span>${label}${active ? BrokenDiamond({ size: 11, className: "nav-symbol" }) : ""}</span><small>${plain}</small></a>`;
    })
    .join("");
}
export function shell({
  title,
  description = site.description,
  body,
  current = "/",
  kind = "",
  status = 200,
}) {
  return {
    status,
    html: `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#f7f8f8"><meta name="description" content="${escape(description)}"><title>${escape(title)} — Northline</title><link rel="icon" href="/assets/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/src/styles.css"><link rel="stylesheet" href="/src/blog.css"><link rel="stylesheet" href="/src/folklore.css"><link rel="stylesheet" href="/src/collapse.css"><script src="/src/story-arrival.js"></script><link rel="stylesheet" href="/src/story.css">${kind === "article" ? '<link rel="stylesheet" href="/vendor/katex/katex.min.css">' : ""}<script src="/src/blog.js" defer></script><script type="module" src="/src/collapse.js"></script><script type="module" src="/src/story.js"></script></head><body class="blog ${kind}"><div class="environment-memory" aria-hidden="true"></div><a class="skip-link" href="#main">Skip to content</a><header class="blog-header"><a href="/" class="wordmark" aria-label="Northline home">${BrokenDiamond({ size: 28 })}<span>NORTHLINE</span></a><button class="menu-toggle" aria-expanded="false" aria-controls="main-navigation">Menu <span aria-hidden="true">＋</span></button><nav id="main-navigation" aria-label="Main navigation">${navigation(current)}</nav></header>${body}<footer class="blog-footer"><div><a class="wordmark" href="/">${BrokenDiamond({ size: 20 })}NORTHLINE</a><p>A personal journal. An open-ended inquiry.</p></div><div><a href="/records">All writing</a><a href="/projects">Projects</a><a href="/about">About</a><a href="/design-system">Design system</a></div><span>© ${new Date().getFullYear()} ${escape(site.name)}<br>Made for a slower reading.</span>${CollapseEffect({ mode: "DISPLACEMENT", id: "footer-collapse", className: "footer-thread" })}${FootprintTrail()}</footer><div id="blog-status" class="toast" role="status" aria-live="polite"></div></body></html>`,
  };
}
function meta(post, { marked = false } = {}) {
  return `<div class="record-meta">${marked ? BrokenDiamond({ size: 12, className: "metadata-symbol" }) : ""}<span>${escape(post.category)}</span><span aria-hidden="true">·</span><time datetime="${post.date}">${date(post.date)}</time><span aria-hidden="true">·</span><span>${post.readingTime} min read</span></div>`;
}
export function recordRow(post, { compact = false, ghost = false } = {}) {
  const cover = ghost ? recordCover(post) : null;
  const image = cover
    ? `<span class="record-ghost" aria-hidden="true"><img src="${escape(cover.src)}" alt="" loading="lazy" decoding="async" style="object-fit:${cover.fit};object-position:${cover.position}" /></span>`
    : "";
  return `<article class="record-row ${compact ? "compact" : ""}${cover ? " has-ghost-cover" : ""}" data-record data-category="${escape(post.category)}" data-search="${escape((post.title + " " + post.description + " " + post.category).toLowerCase())}"><span class="record-number">RECORD / ${escape(post.number)}</span><div class="record-copy"><h2><a href="/records/${post.slug}">${escape(post.title)}</a></h2>${meta(post)}${image}<p>${escape(post.description)}</p></div><a class="read-link" href="/records/${post.slug}" aria-label="Read ${escape(post.title)}">READ <span aria-hidden="true">→</span></a></article>`;
}
function sectionTitle(kicker, title, link, label) {
  return `<div class="blog-section-heading"><div><span class="eyebrow">${BrokenDiamond({ size: 11, className: "section-symbol" })}${kicker}</span><h2>${title}</h2></div>${link ? `<a class="text-link" href="${link}">${label} <span aria-hidden="true">↗</span></a>` : ""}</div>`;
}
function projectRow(project) {
  return `<article class="expedition" id="${project.slug}"><div class="expedition-index">EXPEDITION ${project.number}<span class="project-status ${project.status.toLowerCase()}">${project.status}</span></div><div class="expedition-content"><h2><a href="/projects/${project.slug}">${project.title}</a></h2><dl><div><dt>STATUS</dt><dd>${project.status}</dd></div><div><dt>FIELD</dt><dd>${project.field}</dd></div><div><dt>LAST RECORD</dt><dd><time datetime="${project.record}">${date(project.record)}</time></dd></div></dl><p>${project.description}</p><a class="read-link" href="/projects/${project.slug}">OPEN EXPEDITION <span aria-hidden="true">→</span></a></div></article>`;
}
export function home(posts) {
  return shell({
    title: "Field",
    body: `<main id="main" class="blog-main home-main"><section class="field-hero"><img class="hero-environment" src="${site.heroImage}" alt="" aria-hidden="true" fetchpriority="high">${SnowAtmosphere()}<div class="hero-content"><div class="hero-byline">${BrokenDiamond({ size: 25 })}<span>${escape(site.name)}</span></div><p class="eyebrow">A personal journal & research archive</p><h1>Between what exists<br>and what has been<br><em>forgotten.</em></h1><p class="hero-subtitle">Research <span>·</span> Notes <span>·</span> Projects <span>·</span> Fragments</p><a class="button primary" href="/records">ENTER / EXPLORE <span aria-hidden="true">↗</span></a></div><div class="hero-bottom"><span>OBSERVE. COLLECT. RETURN.</span><a href="#recent">SCROLL TO THE RECORDS <span aria-hidden="true">↓</span></a><span>A STUDY IN ATTENTION / 01</span></div></section><div class="home-content"><section id="recent" class="blog-section">${sectionTitle("01 / The latest entries", "Recent records", "/records", "View all records")}${posts
      .slice(0, 3)
      .map((post) => recordRow(post, { compact: true }))
      .join(
        "",
      )}</section><section class="blog-section current-expedition">${CollapseEffect({ mode: "ABSENCE", id: "field-thread", className: "section-thread" })}${sectionTitle("02 / Work in progress", "Current expedition", "/projects", "All expeditions")}<div class="current-expedition-grid"><div class="expedition-image"><img src="/assets/shoreline.svg" alt="Original blue-grey study of a quiet northern shoreline" loading="lazy" width="1200" height="700"><span class="eyebrow">FIELD STUDY / AN IMAGINED SHORE</span></div><div><span class="eyebrow">EXPEDITION 01 <span class="active-inline">● ACTIVE</span></span><h3>${expeditions[0].title}</h3><p>${expeditions[0].description}</p><dl class="mini-details"><div><dt>FIELD</dt><dd>${expeditions[0].field}</dd></div><div><dt>LAST RECORD</dt><dd>${date(expeditions[0].record)}</dd></div></dl><a class="read-link" href="/projects/${expeditions[0].slug}">OPEN EXPEDITION <span aria-hidden="true">→</span></a></div></div></section><section class="blog-section">${sectionTitle("03 / A few places to begin", "Selected writing")}<div class="selected-writing">${posts
      .filter((post) => post.selected)
      .map(
        (post, i) =>
          `<article><span class="eyebrow">0${i + 1} / ${escape(post.category)}</span><h3><a href="/records/${post.slug}">${escape(post.title)}</a></h3><p>${escape(post.description)}</p><a class="text-link" href="/records/${post.slug}" aria-label="Read ${escape(post.title)}">Read the record →</a></article>`,
      )
      .join(
        "",
      )}</div></section><section class="short-about"><div>${BrokenDiamond({ size: 40 })}<span class="eyebrow">The person behind the pages</span></div><p>I’m ${escape(site.name)}. This is a place to think in public, keep useful questions, and make things slowly.</p><a class="text-link" href="/about">A little about me ↗</a></section><p class="sample-disclosure">Ride with things, let the mind roam.</p></div></main>`,
  });
}
export function records(posts, params = new URLSearchParams()) {
  const query = params.get("q") || "";
  const category = params.get("category") || "";
  const matches = (post) =>
    (post.title + " " + post.description + " " + post.category)
      .toLowerCase()
      .includes(query.trim().toLowerCase()) &&
    (!category || post.category === category);
  const count = posts.filter(matches).length;
  const categories = [...new Set(posts.map((post) => post.category))];
  return shell({
    title: "Records",
    current: "/records",
    body: `<main id="main" class="blog-main page-container"><header class="page-heading"><span class="eyebrow">RECORDS — WRITING</span><h1>Things worth keeping.</h1><p>Research, working notes, and small observations.<br>A collection in progress, arranged from newest to oldest.</p></header><form class="record-tools" action="/records" method="get" role="search"><label for="record-search">Search the records<input id="record-search" name="q" type="search" value="${escape(query)}" placeholder="A title, a thought, a subject…" autocomplete="off"></label><label for="category-filter">Browse by category<select id="category-filter" name="category"><option value="">All categories</option>${categories.map((category) => `<option ${params.get("category") === category ? "selected" : ""}>${escape(category)}</option>`).join("")}</select></label><button class="button secondary" type="submit">Search →</button></form><div class="list-heading"><span class="eyebrow">THE RECORDS</span><span id="record-count" class="micro" role="status">${count} ${count === 1 ? "record" : "records"}</span></div><div id="record-list">${posts.map((post) => (matches(post) ? recordRow(post, { ghost: true }) : recordRow(post, { ghost: true }).replace("<article ", "<article hidden "))).join("")}</div><div id="empty-records" ${count ? "hidden" : ""}><h2>No records found.</h2><p>Try a different word or return to all categories.</p><a class="button secondary" id="reset-search" href="/records">Clear search</a></div></main>`,
  });
}
export function article(post, posts) {
  const index = posts.indexOf(post);
  const next = posts[(index + 1) % posts.length];
  return shell({
    title: post.title,
    description: post.description,
    current: "/records",
    kind: "article",
    body: `<main id="main" class="blog-main"><div class="article-breadcrumb"><a href="/records">← All records</a><span>RECORD / ${escape(post.number)}</span></div><header class="article-heading"><span class="eyebrow">${escape(post.category)}</span><h1>${escape(post.title)}</h1><p class="article-deck">${escape(post.description)}</p>${meta(post, { marked: true })}<div class="article-author">By ${escape(post.author || site.name)}<span>${post.importedFrom ? "Original writing" : "Illustrative journal entry"}</span></div></header><div class="article-layout"><aside class="article-toc"><details open><summary>IN THIS RECORD</summary><nav aria-label="Table of contents">${post.headings.map((heading) => `<a href="#${heading.id}">${escape(heading.title)}</a>`).join("") || '<a href="#article-text">The note</a>'}</nav></details></aside><article class="prose" id="article-text">${post.html}<div class="article-end">${BrokenDiamond({ size: 25 })}<span>End of record / ${post.number}</span></div><div class="article-actions"><a class="text-link" href="/records">← All records</a><button class="copy-article button secondary">Copy article link ⧉</button></div><a class="next-record" href="/records/${next.slug}"><span class="eyebrow">READ NEXT</span><span>${escape(next.title)} <span aria-hidden="true">→</span></span></a></article></div></main>`,
  });
}
export function projects() {
  return shell({
    title: "Expeditions",
    current: "/projects",
    body: `<main id="main" class="blog-main page-container"><header class="page-heading"><span class="eyebrow">EXPEDITIONS — PROJECTS</span><h1>Following a question.</h1><p>Longer inquiries, small experiments, and things being made.<br>Some are moving. Some are waiting for the right season.</p></header><div class="project-legend"><span>ACTIVE — in progress</span><span>DORMANT — paused</span><span>COMPLETE — finished</span><span>LOST — discontinued</span></div>${expeditions.map(projectRow).join("")}</main>`,
  });
}
export function projectDetail(project, posts) {
  return shell({
    title: project.title,
    current: "/projects",
    body: `<main id="main" class="blog-main page-container"><div class="article-breadcrumb"><a href="/projects">← All expeditions</a><span>EXPEDITION ${project.number}</span></div><header class="page-heading project-detail-heading"><span class="eyebrow">${project.status} / ${project.field}</span><h1>${project.title}</h1><p>${project.description}</p></header><div class="project-brief"><section><h2>The question</h2><p>${project.question}</p></section><section><h2>The approach</h2><p>${project.method}</p></section><section><h2>What takes shape</h2><p>${project.output}</p></section></div><section class="blog-section">${sectionTitle("The working notebook", "Related records")}${project.posts
      .map((slug) => posts.find((post) => post.slug === slug))
      .filter(Boolean)
      .map((post) => recordRow(post))
      .join("")}</section></main>`,
  });
}
export function archive(posts) {
  const years = [...new Set(posts.map((post) => post.date.slice(0, 4)))];
  return shell({
    title: "Archive",
    current: "/archive",
    body: `<main id="main" class="blog-main page-container"><header class="page-heading"><span class="eyebrow">ARCHIVE — BY DATE</span><h1>A trace of time.</h1><p>Every record, in chronological order.<br>Nothing hidden. Nothing hurried.</p></header><div class="archive-edge-decoration">${CollapseEffect({ mode: "NONLINEARITY", id: "archive-edge", className: "archive-anomaly" })}</div><nav class="archive-years" aria-label="Jump to year">${years.map((year) => `<a href="#year-${year}">${year}</a>`).join("")}<span class="micro"><span aria-hidden="true"><span data-archive-counter>${posts.length}</span> records collected</span><span class="story-sr-only">${posts.length} records collected</span></span></nav>${years
      .map(
        (year) =>
          `<section class="archive-year" id="year-${year}"><h2>${year}</h2><div>${[
            ...new Set(
              posts
                .filter((post) => post.date.startsWith(year))
                .map((post) => post.date.slice(0, 7)),
            ),
          ]
            .map(
              (month) =>
                `<section class="archive-month"><h3>${new Date(month + "-01T12:00:00Z").toLocaleDateString("en-GB", { month: "long", timeZone: "UTC" })}</h3>${posts
                  .filter((post) => post.date.startsWith(month))
                  .map(
                    (post) =>
                      `<div class="archive-entry"><time datetime="${post.date}">${post.date.slice(8)}</time><a href="/records/${post.slug}">${escape(post.title)}</a><span>${escape(post.category)}</span></div>`,
                  )
                  .join("")}</section>`,
            )
            .join("")}</div></section>`,
      )
      .join("")}</main>`,
  });
}
export function about() {
  return shell({
    title: "About",
    current: "/about",
    body: `<main id="main" class="blog-main page-container"><header class="page-heading"><span class="eyebrow">ABOUT — THE PERSON</span><h1>Riding with things,<br>let the mind roam,</h1></header>${PersonaArtwork(site)}<div class="about-personal"><div class="about-copy"><h2>Hello, I’m ${escape(site.name)}.</h2><p>I keep this space for the things I want to understand a little better: how we remember places, how we organise knowledge, and how small tools can help us notice more.</p><p>Some days that takes the form of an essay. Other days it is a piece of code, an image, or a paragraph that does not yet belong anywhere. I like having a place where all of those can sit together.</p><h2>What you’ll find here</h2><p><a href="/records">Records</a> are individual pieces of writing. <a href="/projects">Expeditions</a> are projects that connect them over time. The <a href="/archive">archive</a> is the simplest way to see everything, without a recommendation telling you where to go next.</p><h2>Some of my friends</h2><ul><li><a href="https://zzzremake.github.io/site/" target="_blank">ZzzRemake</a></li><li><a href="https://www.cnblogs.com/IrisHyaline" target="_blank">IrisHyaline</a></li><li><a href="https://imomi263.github.io/" target="_blank">imomi263</a></li></ul></div><aside class="about-note"><span class="eyebrow">CURRENTLY THINKING ABOUT</span><p>Attention. Personal archives.<br>The usefulness of small things.</p></aside></div><div class="about-pattern">${CollapseEffect({ mode: "REPETITION", id: "about-weave" })}${CressonControl({ className: "about-cresson" })}</div></main>`,
  });
}
export function notFound() {
  return shell({
    title: "This place does not exist",
    current: "",
    status: 404,
    body: `<main id="main" class="blog-main not-found story-404">${SnowField()}${SnowAtmosphere()}<span class="error-number">04?</span><h1>THIS PLACE<br>DOES NOT EXIST.</h1><p>You are certain<br>something used to be here.</p><a class="button primary" href="/">RETURN <span aria-hidden="true">&rarr;</span></a>${UncertainFootprints()}</main>`,
  });
}
export function voidPage() {
  return {
    status: 200,
    html: `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>Northline &mdash; Void</title><link rel="stylesheet" href="/src/styles.css"><link rel="stylesheet" href="/src/collapse.css"><script src="/src/story-arrival.js"></script><link rel="stylesheet" href="/src/story.css"><script type="module" src="/src/story.js"></script></head><body class="void-page"><div class="environment-memory" aria-hidden="true"></div><main id="main" class="void-main">${SnowAtmosphere()}<h1 class="story-sr-only">Void</h1>${CressonControl()}<p>It was already here<br>before you arrived.</p>${UncertainFootprints()}</main></body></html>`,
  };
}
