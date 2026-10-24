# Gallery

`/gallery` displays drawings first (one featured work, then a spacious two-column grid), followed by photographs in a responsive three/two/one-column grid. Images are contained, never cropped. Titles are neutral inventory labels until you edit them.

Photographs show 24 at a time with a Show more button and collection selector. All works remain available without JavaScript. Clicking an image opens the original when JavaScript is unavailable; otherwise it opens a native modal viewer with Previous/Next, arrow keys, Escape and restored keyboard focus. The viewer browses the currently visible collection. No Collapse effects are applied to artwork.

## Add or update work

Run this explicit local import (not part of the production build):

```powershell
node scripts/import-gallery.mjs E:\imgs\drawing E:\imgs\photo
```

The importer reads PNG, JPEG, WebP and AVIF files directly in those two folders. Keep filenames stable. It generates 900px thumbnails and at-most-2400px full-view WebP files in `assets/gallery/`, and a catalog in `src/gallery-inventory.json`. It corrects orientation and strips metadata such as GPS; originals are never modified. Generated IDs use type plus a hash of the filename. Files removed from the source folders disappear from the new inventory, but older asset copies are not automatically deleted.

Edit the `captions` object in `src/gallery-data.js` to add your titles, useful image descriptions and photo collections:

```js
const captions = {
  '/assets/gallery/photo-YOUR-ID.webp': {
    title: 'An evening by the water',
    alt: 'Describe the actual scene in this photograph.',
    album: 'Travel',
    location: 'Optional place',
    date: 'Optional date',
  },
};
```

Drawings also accept `medium`. The first drawing is featured. Reorder inventory entries to curate display order (a reimport resets order to filenames). Captions survive imports. Do not enter dates or locations unless they are known.

Commit `assets/gallery`, both catalog files, and any code changes. Normal GitHub Actions deployment copies these ready-made assets and generates `/gallery/index.html`; it does not access local source folders or import photos. Run `npm test`, `npm run build`, and `npm run test:static` before publishing.
