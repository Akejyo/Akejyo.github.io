# Home particle integration

The right-hand captions follow the same selection: FIELD → Boundless Gift; RECORDS → Horizon Invitation; EXPEDITIONS → Dimensional Fluid; ARCHIVE → Old Fan; GALLERY → Golden Chalice; ABOUT → Hot Water Kettle. Edit text in `src/home-captions.js`. FarNorthRunes is self-hosted in `assets/fonts/` for decorative titles; the smaller repeated title and description use the original serif. Switching runs a 650ms leftward exit followed by a 650ms entry, with no text overlap. The background resizes over 650ms with its top edge fixed. It, cancels stale transitions on rapid selections, and switches instantly under reduced motion. On mobile the caption sits below the particle image.

The home hero uses Akejyo's `ParticleMorph` 1.3.0 module from https://github.com/Akejyo/Arknights_partical_animation, retrieved 2026-10-25. `src/particle-engine.js`, `particle-motion.js`, and `particle-sampling.js` are the upstream `src/index.js`, `motion.js`, and `sampling.js`; only the two local import paths were renamed for this site's flat client asset allowlist.

`src/home-particles.js` connects the existing navigation's hover and focus events to `show()`. FIELD uses HOME.png, EXPEDITIONS uses EXPEDITIONS.png, and the other labels use their matching supplied images. Images are copied from `E:\imgs\tmp` into `assets/particles/`. Clicking navigation still follows its original link. Touch users see the home image and normal navigation. The last preview remains until another navigation item is selected.

The renderer keeps the upstream morph and pointer physics, using navy particles against the existing pale home background. It runs only on Home, limits particle count to 12,000, pauses when hidden/offscreen, responds to reduced motion, and cleans up on page exit. A static image remains if JavaScript or Canvas is unavailable. The Explore link remains normal HTML.

`assets/avatar-icon.png` is a 64px derivative of the supplied AVATAR.png, used as the tab icon throughout the blog and design-system pages.
