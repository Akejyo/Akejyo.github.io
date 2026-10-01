# Collapse

An additive ornament layer. The article styles, navigation structure, MDX, and page layouts are unchanged.

## Components and placement

`src/collapse-art.js` exports `CollapseEffect({ mode, id, className })` and `CressonFlower()`. Each effect requires a unique lowercase ID. Components generate only original SVG geometry: they deliberately do not accept content or children.

| Mode | Live placement | Treatment |
| --- | --- | --- |
| ABSENCE | Home expedition separator | SVG mask removes a clean segment of the weave. |
| DISPLACEMENT | Small footer thread | 4–8 screen pixels for 120–300 ms; original echo remains at 0.08–0.2 opacity. |
| REPETITION | About bottom ornament | Fourth/fifth stitches shift 15/8 SVG units; incompatible diamond has 1.1-unit stroke and 0.5 opacity. |
| NONLINEARITY | Archive edge above year navigation | Seed fades out, relocates 36 SVG units (27 screen pixels at its 90px display width), and reappears; 900ms total. |

The original CressonFlower appears on About, the hidden `/void` page, and its design-system specimen. Desaturated asymmetric petals enclose an eye-shaped opening, interrupted concentric rings, a dark void, and a restrained blue highlight. Hover slowly reveals crimson and purple; rings shift slightly without rotation. BrokenDiamond remains the common cultural motif.

## Timing and accessibility

`src/collapse.js` uses one timer scheduler, not a rendering loop. The first event requires 4–7 seconds of accumulated eligible exposure; subsequent events require 15–30 seconds. Leaving view preserves the remaining budget: two seconds visible plus three seconds later count as five, without a fresh random draw. Only at least half-visible animated ornaments outside protected content and specimens participate. Scrolling itself does not pause the timer.

Each automatically used ornament has a 30-second cooldown. Other visible ornaments remain eligible; when none are available the exposure budget pauses until the earliest cooldown ends. Thus a lone footer waits its cooldown **plus** the subsequent exposure budget. A visit still permits at most three automatic events. Hidden pages, reduced motion, Level I, selection, and focus on links/controls do not count. Interaction changes pause/resume accounting; a one-second safety recheck handles lingering focus. Offscreen/hidden ornaments cancel running events. Page lifecycle and disposal clear work without losing the exposure budget on a resumable page.

The Home absence mask removes 32 SVG units (16 screen pixels at the 112px display width), starting at x=96. No erasure or torn edge is introduced. Absence and repetition remain static authored variants, not extra scheduled animations.

Reduced motion supplies static displacement and relocation variants, with no flower transitions. Preference changes cancel live animations immediately. Missing and repeated weave variants are already static. All decorative SVGs are hidden from assistive technology and excluded from keyboard focus. Review buttons use native focus and state semantics.

No content, links, navigation, controls, or article containers are Collapse animation targets. A runtime guard rejects SVGs inside those containers and SVGs containing text or embedded content. Without JavaScript, the blog remains functional and there are no scheduled anomalies; CSS flower hover feedback still works. Print hides the entire layer.

## Review

Open `/design-system#collapse-studies` for ordinary/anomalous comparisons, single-event previews, and a static-variant toggle. These controls exist only in the specimen. The system preference takes priority over the toggle.

Run `npm run check` and `npm test`. Fake-clock controller tests verify exposure accumulation, hidden and interaction pauses, cooldown selection, event limits, screen-space displacement, cancellation, reduced motion, and protected content. Integration tests still exercise production routes, links, MDX, search, and math assets. Development QA calls these same controllers and shows the remaining exposure budget. See [before/after values and evidence](REBALANCE.md).

The environmental layer adds deliberate flower interaction and coordinates Level I with this scheduler. See [maintenance notes](ENVIRONMENT.md).
