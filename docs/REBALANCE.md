# Environmental balance: production change report

This is the authorized production rebalance following the historical QA audit. The same Collapse components, flower sequence, native transition handoff and page structure remain in use. Article content, typography, navigation, focus styles, and accessibility checks were retained.

## Before / after / why

| Value or behavior | Before | After | Why |
| --- | --- | --- | --- |
| First automatic event | 45–90s wall-clock timer, reset when eligibility disappeared | 4–7s **accumulated eligible visible time** | Make an ordinary encounter realistic, retaining exposure across scrolling. |
| Subsequent automatic events | 90–180s, reset on interruption | 15–30s accumulated eligible time | Keep later encounters less immediate. |
| Per-ornament cooldown | None | 30s from automatic event start | Prefer another eligible ornament; avoid repeating the same one. A lone ornament waits cooldown plus remaining exposure. |
| Interaction safety check | Check only at event dispatch | Pause exposure on selection/focus changes; recheck blocked interaction every 1s | Safety time cannot consume the exposure budget or cause a rapid retry loop. |
| Displacement | 2–5 screen px | 4–8 screen px | Readable at the actual 64px footer scale. |
| Static displacement fallback | 3 screen px (10.5 SVG units in footer) | 6 screen px (21 footer units) | Match the new midpoint without adding motion. |
| Absence mask | x=101, width 17 SVG units; 8.5px displayed | x=96, width 32 units; 16px displayed | A casually visible clean gap. |
| Repeat spacing | Fourth/fifth units shifted 9/5 SVG units | 15/8 units | Make incompatible spacing legible at normal size. |
| Repeat echo | 0.85-unit stroke, 0.35 opacity | 1.1-unit stroke, 0.5 opacity | Make the existing duplicate discernible. |
| Nonlinear relocation, including static fallback | 18 SVG units; 13.5px on Archive | 36 units; 27px on Archive | A perceptible spatial jump using the same 900ms disappearance/reappearance. |
| Snow population | Static grain; no moving flakes | 24 desktop, 12 mobile, zero on articles | Sparse depth rather than a screen-filling storm. Only Home hero, 404 and Void mount it. |
| Background snow | Static | 12 flakes; 2px; opacity 0.25; 30–36s cycles | Small, distant, slow layer. Mobile: six. |
| Midground snow | Static | Nine flakes; 3px; opacity 0.52; 18–24s | Readable drift within the first moments. Mobile: five. |
| Foreground snow | None | Three flakes; 6px; opacity 0.38; 1px blur; 10–14s | Rare faster, softer nearby movement. Mobile: one. |
| Snow travel / phase | None | 870px vertical; alternating 18–46px horizontal; negative phase offsets | Distinct depth and immediate activity without waiting for flakes to enter. |
| Fog | Static atmosphere | Faint radial layer (#e6edf218), 18px horizontal / 5px vertical over 36s, alternating | Slow ambient life independent of Collapse. |
| Reduced-motion snow | Static scene | Moving layers hidden; static snow grain at opacity 0.03 | Keep atmosphere with no decorative motion. |
| Landscape overscan | None | Static scale 1.015 | Cover edges during displacement; no scroll-linked parallax. |
| Normal transition | 140ms fade | 250ms fade | Perceptible, restrained navigation. |
| Rare residual geometry | 22px snow-grain strip at bottom=0 | 120px existing landscape/snow fragment at bottom=-12px | An environmental fragment visibly occupying the wrong place; no text/UI snapshot. |
| Rare persistence | +100ms; 240ms total | +450ms; 700ms total including fade | Let the new page appear while the old fragment remains. |
| Residual opacity | 0.025 | Normal remains 0.025; departing rare snapshot 0.5 | Keep ordinary pages quiet, make the actual anomaly readable. |
| Arrival-state cleanup | 500ms | 900ms | Do not clear the rare-state selector before its 700ms native animation finishes. |
| Level I environment displacement | 1px per axis | 4px per axis | Clearly perceptible spatial misregistration. |
| Level I decorative lines | 3 SVG units (scale-dependent) | 4 **screen** px, converted per SVG | Keep the effect visible on small ornaments. |
| Level I repeat echo | Same 0.35 as normal baseline | 0.7 | Coordinate existing repetition with absence and displacement. |
| Level I flower center / inner / outer opacity | 0.8 / 0.58 / 0.55 | 0.9 / 0.7 / 0.68 | Stronger but contained crimson/purple response. |
| Level I entry | Immediate offsets; slow hover-derived color changes | 700ms offsets/colors; ambient playback ramps to zero over 700ms | One coordinated atmospheric state. Binary masks still switch discretely. |
| Level I restoration | Immediate offsets; hover-derived settling | 1,000ms offsets/colors and ambient restart | Gradual return after the unchanged ten-second active state. Binary masks restore immediately. |
| Flower base color/ring settling | 2,400ms on hover-capable devices; immediate on touch | 1,000ms on all normal-motion devices | Existing short response states can visibly settle and restore. Reduced motion stays instantaneous. |
| Flower activation feedback entry | Inherited 2,400ms easing exceeded the 1,200ms state | 600ms entry; 1,200ms active response | Make intentional interaction readable before it ends. |
| Activation three | No distinct response | Rings shift 1.5× hover distance, about 3 screen px | Escalate the existing ring behavior without a progress display. |
| Activation four | No distinct response | Same ring offset; crimson center opacity 0.88 | Brief, restrained feedback before Level I. |
| Ambient rate coordination | No moving layer | 50ms playback-rate updates only during 700/1,000ms ramps | Smooth slowing without a permanent JavaScript animation loop. |

Unchanged: three automatic events per page; 50% visibility threshold; displacement duration 120–300ms and echo 0.08–0.2; nonlinear duration 900ms; flower pacing 450–4,000ms; fifth activation triggers Level I; Level I active for ten seconds with sixty further seconds of sequence cooldown; archive 4%, rare transition 3.5% from visit three; protected content, reduced-motion priority, no audio, no new dependencies, development-only QA gating.

## Production verification

- Production server (no development flag): Home had 24 real flakes, live CSS transforms and no QA panel. A normal Archive visit and scroll to the footer produced a 7px displacement with echo 0.12 automatically, without force controls.
- Production `/void`: five native button clicks produced quiet → listening → attending → answering → Level I. The active state subsequently cleared normally. Console reported no errors in this check.
- Mobile browser override: six background, five midground and one foreground flake; no horizontal overflow. Viewport override reset afterward.
- Development QA shows accumulated eligible time and current production transition values; it still calls the live production functions. Rare transition was exercised with exaggeration off through the real native anchor/navigation path.
- Tests cover fragmented exposure (visible → offscreen → visible → hidden → visible → interaction → event), cooldown alternate selection, cap, actual response classes, cancellation, ten-second restoration, ambient rate ramps, hidden/reduced-motion behavior, production asset serving and route mounts. Existing article, link, math, accessibility and QA isolation tests remain.

Use `npm run check` and `npm test`. Browser evidence is from Edge, not a cross-browser performance benchmark; operating-system reduced-motion settings were not modified. Reduced-motion handling is verified by controller tests and CSS guards. Native transition support remains browser-dependent.
