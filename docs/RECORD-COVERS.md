# Records ghost covers

Only `/records` opts into this visual index. Home, project lists, article content and coverless records retain their existing presentation. Covers are chosen exclusively from explicit metadata, never from the first body image.

```yaml
cover: /assets/my-diagram.png
coverFit: contain
coverPosition: center
```

`cover` accepts a URL string or `{ src: ... }` / `{ path: ... }`. Existing `image.path` frontmatter also works. For migrated posts only, legacy `/img/...` paths resolve against the original Chirpy image CDN, `https://raw.githubusercontent.com/Akejyo/imageForBlog/master`. Existing covers are now resolved through `src/image-assets.js` to committed local assets; the CDN URL is retained as provenance and a fallback for unmapped metadata. No generated placeholders are introduced. Set `cover: false` to suppress a legacy image. Local assets must use a path supported by the server asset allowlist.

`coverFit` defaults to `cover`; use `contain` for figures whose edges matter. `coverPosition` defaults to `center` and accepts one or two position keywords or percentages, such as `center top` or `50% 30%`.

Desktop images occupy 29% of the row at its right edge, fading horizontally into the page. Text reserves space and the image starts below the Read link. Mobile images become a 96 × 88px float beside the description: title, metadata and number retain full width. No border, radius, card background, shadow, row movement or image zoom is added.

Rest: opacity 0.44, saturation 0.58, contrast 0.9. Hover and keyboard focus within the row: opacity 0.84, saturation 0.92, mask width 112%, with 420ms gentle easing. Reduced motion removes transitions while retaining the focus state. Images are decorative, lazy-loaded, non-interactive and hidden from assistive technology. Failed images restore the ordinary coverless layout when JavaScript is available. Print omits covers. This component does not participate in Collapse.
