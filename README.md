# Northline — a personal journal

An editorial personal blog built on the original Northline design system. Node serves complete HTML pages, with local MDX content rendered through React on the server. Small browser scripts add filtering, mobile navigation, and clipboard controls. There is no client-side React bundle or external font request. A lightweight Collapse layer affects only selected decorative SVGs; reading content and navigation remain stable. See [Collapse documentation](docs/COLLAPSE.md) and [environmental storytelling maintenance notes](docs/ENVIRONMENT.md).

## Run

Requires Node 20.19 or newer.

```sh
npm install
npm run dev
```

Open http://localhost:3000. Use `npm start` for a server without file watching. Set `PORT` to choose another port. Restart the server after changing MDX content when using `npm start`.

Development effect QA: start with `npm run dev`, then press **Ctrl + Shift + K** (or **Cmd + Shift + K** on macOS). Restart an older running dev server once to pick up the new `--development` flag. The floating panel invokes the real effects, offers temporary debug exaggeration, and logs actual state changes. It is neither injected nor served by `npm start`, and `NODE_ENV=production` always disables it. See [QA instructions](docs/QA.md) and the [claim-by-claim verification table](docs/QA-VERIFICATION.md).

```sh
npm run check
npm test
```

Tests compile the actual MDX, exercise all routes, check internal links and anchors, verify rich article features, test server-side search and HTTP 404 responses, and check local math assets. Responsive layouts and interactions are also verified in the browser.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Field / editorial home |
| `/records` | Searchable writing index with category filtering |
| `/records/[slug]` | Article, contents, sources, footnotes, next record |
| `/projects` | Expeditions / project index |
| `/projects/[slug]` | Project question, approach, outputs, related records |
| `/archive` | Year → month → date → article |
| `/about` | Editable biography and cinematic Persona composition |
| `/design-system` | Preserved foundational design system |
| `/404` or any unknown route | Custom page with HTTP 404 status |

Navigation includes plain-language labels alongside FIELD, RECORDS, and EXPEDITIONS. All blog content and navigation work without JavaScript; filtering also works by submitting the search form. JavaScript adds instant results and a collapsible mobile menu.

## Personalise and write

Edit `src/site.js` to set your name, hero/Persona assets, and project information. The canonical Persona composition appears above the About biography using responsive image derivatives; its source is recorded in `assets/ART-DIRECTION.md` and crop/interaction maintenance in `docs/ENVIRONMENT.md`. The biography is in `src/pages.js` (`about`). Replace the clearly labelled sample biography, articles, and project descriptions before publishing; no personal history or credentials are assumed.

Create a file in `content/records/`. Its filename becomes the URL slug:

```mdx
---
title: "An observation"
number: "028"
date: "2026-09-28"
category: Notes
description: "A short description for the index and article header."
selected: false
---

Your opening paragraph.

## A section

Normal **Markdown**, inline `code`, and a footnote.[^one]

<Figure src="/assets/shoreline.svg" alt="Describe the image" caption="Fig. 01 — A caption." />

Inline mathematics: $x^2$. Display mathematics uses double dollar delimiters.

[^one]: A source or additional explanation.
```

Dates must be quoted `YYYY-MM-DD` strings. Reading time is calculated automatically; records and archive entries are sorted by date. Use H2/H3 inside articles because the page already supplies H1. `selected: true` includes a record on the home page. Add citations as ordinary source links or footnotes. Tables, fenced code, inline/display LaTeX, images, and captions are supported. The MDX compiler runs trusted local content; it is not an endpoint for untrusted submissions.

## Architecture

- `src/styles.css`: semantic color tokens, typography roles, spacing scale, component styles, responsive rules.
- `src/blog.css`: blog layouts using the established tokens, with a 720px article reading column.
- `src/folklore.css` and `src/folklore.js`: sparse textile details, material textures, and normal footprints, added without changing page structure or typography.
- `src/components.js`: reusable original `BrokenDiamond`, `TextilePattern`, `ArticleMetadata`, and `ArticleCard` HTML/SVG renderers.
- `src/main.js`: specimen composition and interactions (copy tokens, navigation tabs, viewport controls).
- `src/pages.js`: shared blog shell, navigation, editorial lists, and route templates.
- `src/content.js`: MDX compilation, frontmatter, reading time, headings, and reusable `Figure` component.
- `src/blog.js`: progressive interaction layer.
- `src/collapse-art.js`, `src/collapse.css`, and `src/collapse.js`: original decorative SVGs, isolated visual states, and a visibility-aware rare-event scheduler.
- `src/site.js`: identity and expedition data.
- `content/records/`: 26 migrated articles plus six realistic sample articles, including a long research essay, short note, code, mathematics, and a three-image essay.
- `assets/`: the original generated arctic hero, subtle material SVGs, and original vector landscape studies. `npm run generate-art` regenerates only the earlier vector studies; it does not overwrite the new hero. See `assets/ART-DIRECTION.md` for the exact generation prompt and asset provenance.
- `server.js`: route handling, rendered HTML, allowlisted public assets, and real 404 responses.
- `preview.html`: isolated responsive component specimen, shown at 1200, 768, and 375 CSS pixels.

## Tokens and usage

Environmental motion and Collapse production values are documented in [COLLAPSE.md](docs/COLLAPSE.md) and [ENVIRONMENT.md](docs/ENVIRONMENT.md). The [rebalance report](docs/REBALANCE.md) lists every timing/intensity change with its reason and production verification evidence.

Snow `--background-primary` is the canvas; frost `--background-secondary` groups supporting material; white `--surface` lifts cards. Deep navy `--text-primary` carries reading text; slate `--text-secondary` supports captions and metadata. Mist `--border` is a decorative hairline, not a text color. Northern blue `--accent-blue` indicates links, focus, and quiet details. Crimson `--accent-red` is used sparingly. Linen `--accent-beige` supplies a warm quote rule. `--void` is the deepest neutral. `--collapse-purple` appears only in anomalous ornament states and the palette.

Georgia provides display, heading, body, and quote roles. System sans supplies navigation and captions; system monospace handles code, measurements, and metadata. Body text is 18px / 1.75, with a 65ch reading measure. Display and H1 sizes are fluid. Spacing is 4, 8, 12, 16, 24, 32, 48, 64, and 96px.

Hierarchy: tokens → type and geometry primitives → controls and editorial components → specimen sections → design-system page. The original open diamond has exactly three sides, with the upper-right edge intentionally absent. Decorative SVGs are hidden from assistive technology. Interactive elements have visible keyboard focus, native semantics, and state attributes. The sample navigation supports arrow keys, Home, and End.

The live viewport specimen scales down to fit the available preview space; the displayed width is its actual CSS viewport width, not the scaled physical size. Full-page responsive layouts also adapt at 1050, 760, and 520px.

The blog has dedicated mobile arrangements at 760px and 440px: expanded reading space, stacked lists, a keyboard-accessible menu, and locally scrollable code, tables, and equations. Images have meaningful alternative text; decorative SVGs are hidden from screen readers. Print styles remove navigation and article controls.

MDX uses the official [MDX compiler](https://mdxjs.com/packages/mdx/), with [remark-math and rehype-katex](https://github.com/remarkjs/remark-math) for server-rendered mathematics. KaTeX CSS and fonts are served locally.

Imported posts: see [the migration report](docs/POST-MIGRATION.md) for source-to-route mappings, conversions, validation and four missing source diagrams.
## GitHub Pages publishing

This repository is the canonical source for `Akejyo/Akejyo.github.io`. Run `npm run build` to generate the ignored `dist/` artifact, `npm run test:static` to verify it, and `npm run preview` to inspect the production site locally. Every push to `main` runs the checks and deploys through `.github/workflows/deploy.yml`. See [DEPLOYMENT.md](DEPLOYMENT.md) for the one-time GitHub settings and everyday publishing workflow.
