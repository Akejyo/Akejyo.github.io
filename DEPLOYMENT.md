# Publishing Akejyo.github.io

This project is the canonical source for **Akejyo/Akejyo.github.io**, published at **https://akejyo.github.io/**. Source, MDX, images and deployment configuration belong in this repository on `main`. There is no separate deployment repository or `gh-pages` branch.

## Detected stack

| Item | Configuration |
| --- | --- |
| Framework | Custom Node.js ES modules; MDX compiled with `@mdx-js/mdx`, rendered to HTML with React on the server/build machine; plain CSS/SVG/browser JS |
| Package manager | npm, with committed `package-lock.json` |
| CI Node version | 24; existing package supports Node >=20.19 |
| Articles | `content/records/*.mdx` |
| Images | `assets/`, including vendored article images in `assets/articles/` |
| Production build | `npm run build` |
| Static output | `dist/` (generated, gitignored, uploaded as a Pages artifact) |
| Local production preview | `npm run preview`, http://localhost:4173 |
| Development server | `npm run dev`, with development-only QA |

There was previously no static build: `server.js` rendered HTML on each request. `scripts/build.mjs` now calls the same page renderers ahead of time. GitHub Pages runs no Node server. There are no APIs, authentication, database writes or other runtime-server requirements. Records search/category filtering already runs in browser JavaScript and restores query parameters on refresh. Without JavaScript, the static Records page remains an accessible full index but cannot filter query parameters server-side.

## One-time GitHub settings

1. Create/use the new **Akejyo/Akejyo.github.io** repository. Use a public repository for GitHub Free. Do not reuse the retired repository as a separate deployment source.
2. Push this project's source to `main`, and set **Settings > General > Default branch** to `main` if necessary.
3. Under **Settings > Actions > General**, enable Actions and allow the official `actions/*` actions used in `.github/workflows/deploy.yml`. The workflow declares the required token permissions; no personal access token or deployment secret is needed.
4. Under **Settings > Pages > Build and deployment > Source**, select **GitHub Actions**. Do not select “Deploy from a branch.” Do not add another suggested workflow; this repository already has one.
5. Leave **Custom domain** empty and keep **Enforce HTTPS** enabled. The production site is the user-site root, not `/Akejyo.github.io/`.
6. Under **Settings > Environments > github-pages**, allow deployments from `main`. To publish automatically, do not require manual reviewers or a wait timer for this environment. GitHub may create this environment during the first workflow run.
7. Open **Actions > Deploy GitHub Pages > Run workflow**, choosing `main`, for the initial deployment after setting Pages to Actions. Later pushes run it automatically.

The configuration follows GitHub's [custom Pages workflow](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages) and [publishing-source settings](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

This workspace had no `.git` directory when deployment was configured. If it is still not initialized, run the following once, after creating the empty GitHub repository:

```sh
git init -b main
git add .
git commit -m "Set up personal site and Pages deployment"
git remote add origin https://github.com/Akejyo/Akejyo.github.io.git
git push -u origin main
```

If Git is already initialized, inspect `git remote -v` and point `origin` at this repository using `git remote set-url origin https://github.com/Akejyo/Akejyo.github.io.git` when needed. Do not force-push over unrelated repository history.

## Everyday publishing

Create or edit an article in `content/records/`. Store new images in `assets/` and reference them with root-relative URLs such as `/assets/articles/my-figure.png`. Keep existing required frontmatter: `title`, quoted ISO `date`, `category`, `description`, and a unique `number`. The filename supplies the article slug. Optional covers use `cover`, `coverFit` and `coverPosition`.

```sh
git add .
git commit -m "Publish a new record"
git push
```

Each push to `main` installs locked dependencies with `npm ci`, runs syntax and behavior checks, builds the static site, checks the artifact through a static HTTP server, uploads `dist/`, and deploys it with the official Pages actions. A failed check prevents deployment. Watch the run under Actions; its deployment link opens https://akejyo.github.io/.

Commit source images and the lockfile. Do not commit `dist/`, `node_modules/` or caches. No artifact commit or second branch is required. To revert a published change, revert its source commit and push to `main`.

## Local production verification

```sh
npm ci
npm run check
npm test
npm run build
npm run test:static
npm run preview
```

The build always uses the production renderers and an explicit browser-file allowlist, even when launched from a development shell. It does not copy `qa.js`, `qa.css`, `qa-arrival.js`, development metadata, article source files, private maintenance notes, or server code. The preview serves only `dist/`; `npm start` still runs the original dynamic server and is not the production-artifact preview.

Every route has its own HTML file: `/records/index.html`, `/about/index.html`, `/records/<slug>/index.html`, and so on. Direct visits to extensionless paths redirect to directory URLs with a trailing slash, then refresh normally. There is no SPA fallback. Unknown paths serve root `404.html` with HTTP 404. `/404/` and `/404.html` also provide explicit previews of that scene. `/void/` remains unlinked and `noindex`. Root-relative asset URLs work even on deeply nested 404s.

Snow, Collapse modes/scheduler, Cresson, Level I, Persona, Ghost Covers and native environmental transitions use the same browser modules and CSS as development. The rare-transition marker comparison tolerates Pages' trailing slash. Reduced-motion behavior remains in those same modules. Static artifact tests confirm local resources, module imports, image variants and KaTeX fonts resolve.

## Image provenance and existing missing content

208 existing remote images were copied verbatim into `assets/articles/`; `src/image-assets.js` maps their original URLs to local files without rewriting article prose or code. `docs/IMAGE-ASSETS.json` retains provenance. This makes builds independent of the retired site's image hosts. The old `image.path` cover metadata continues to work through that mapping. `scripts/vendor-images.mjs` is optional maintenance, not a CI or publishing step.

Four images were missing before this setup and could not be recovered from the original URL: `treewidth.png`, `steinerTree1.png`, `steinerTree2.png`, `steinerTree3.png` in `2022-12-12-6-1-parameterizedalgorithms.mdx`. They remain recorded as unresolved original references in the manifest; no replacement diagrams were invented. Restore the originals into `assets/` and update those four references when available. Some old absolute article citations also point to retired `/blog/posts/...` paths; they are legacy content, not generated routes, and have not been silently redirected to unrelated articles.

The first live deployment and GitHub-side settings must be confirmed on GitHub after pushing; a successful local build does not mean the hosted repository has already deployed.
