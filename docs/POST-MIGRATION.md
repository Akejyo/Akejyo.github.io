# Imported posts

Copied 26 articles from `E:\Akejyo.github.io\_posts` into `content/records`, alongside the six existing sample records (32 total). The original repository was not modified.

The machine-readable [manifest](POST-MIGRATION.json) maps every source filename to its new route/filename, preserves source and output SHA-256 hashes, and lists all 25 copied local images. Imported assets use content-hash filenames under `assets/imported` to avoid collisions and satisfy the server's asset allowlist.

## Conversion

- Preserved titles, original publication dates, categories, tags, writing, code blocks and mathematical expressions. Dates use quoted `YYYY-MM-DD`; the last original category becomes the blog's singular `category`.
- Added unique record numbers, prose-derived descriptions, `selected: false`, original author `Akejyo`, and `importedFrom` provenance. Existing sample posts were retained without overwriting them. Original posts display their author and “Original writing” rather than the sample-entry label.
- Converted Markdown to MDX with syntax-aware serialization: prose braces and generic-looking angle brackets are escaped; code remains fenced and unchanged apart from CRLF-to-LF normalization. Every code block is compared before and after conversion.
- Demoted original top-level headings so the blog's article title remains the single H1. Converted HTML images to responsive Markdown images; removed legacy `zoom` styling and Jekyll excerpt separators. Preserved underlined prose.
- Repaired Windows image paths and replaced available image references with copied assets. Existing remote images remain remote when no corresponding local asset exists.
- Repaired nested `$` delimiters in the parameterized-algorithms article and wrapped Chinese math punctuation with `\text{}`. All imported formulas render without KaTeX error spans.

## Missing source assets

Four VuePress-style image references in `2022-12-12-6.1-ParameterizedAlgorithms.md` have no matching files in the source repository:

- `treewidth.png`
- `steinerTree1.png`
- `steinerTree2.png`
- `steinerTree3.png`

Their destinations are retained as absolute URLs on `https://akejyo.github.io/`. Their remote availability is not verified; they are not fabricated or silently replaced. Supply these diagrams locally to make that article fully self-contained. Other external image URLs also retain their existing hosting dependency.

## Validation and reruns

`npm test` compiles/renders all 32 records, checks all article routes and local assets, verifies imported metadata, code-block counts, KaTeX output, archive totals and author labels, and retains the accessibility/environment regression tests. `npm run check` checks application syntax.

The migration utility is `node scripts/import-posts.mjs "E:\Akejyo.github.io\_posts"`. It uses the Markdown tooling already installed with MDX. It compiles and renders every converted body before writing posts and refuses to overwrite an existing or subsequently edited article. A rerun of unchanged imported files preserves assigned record numbers. Treat the manifest as the migration baseline, not as a requirement to keep posts immutable.
