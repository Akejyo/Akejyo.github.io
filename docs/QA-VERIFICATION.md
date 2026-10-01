# Collapse and environment verification

> Historical baseline: this audit predates the authorized production rebalance. Numeric values below describe that baseline, not current production. See [the rebalance report](REBALANCE.md) and current [Collapse](COLLAPSE.md) / [environment](ENVIRONMENT.md) notes for current values and validation.

Audit date: 2026-09-29. Scope: every functional claim in `COLLAPSE.md` and `ENVIRONMENT.md`. Production intensity and probabilities were not redesigned. The QA UI calls the live production controller instances; absent-mode specimens use the same exported SVG factory.

**Status meaning:** VERIFIED IMPLEMENTED means the mechanism is present, connected and supported by the evidence listed. DOCUMENTED BUT NOT FUNCTIONAL identifies an incorrect or disconnected claim. IMPLEMENTED BUT UNUSED would identify a component with no mount anywhere; none of the documented components fall into that category. Being absent from the current route is not being globally unused.

Evidence is explicitly distinguished: **browser** = real Edge page, actual QA controls and DOM/computed-style/event observations; **tests** = production controller execution with fake clocks or real HTTP servers; **source** = geometry, CSS and route inspection. This is not a performance benchmark or a promise of native View Transition support in every browser. Reduced-motion behavior was checked in controller tests and CSS; no operating-system motion setting was changed.

## COLLAPSE.md

| Documented claim | Status | Verification / qualification |
| --- | --- | --- |
| Additive ornament layer; article styles, navigation, MDX and page layout retained | VERIFIED IMPLEMENTED | Existing content/route integration tests pass. This task did not edit article CSS, MDX, page templates or normal navigation. QA styles and markup are development-only. |
| `CollapseEffect({mode,id,className})` and `CressonFlower()` exports | VERIFIED IMPLEMENTED | `collapse-art.js`; live page mounts plus QA component specimens use these factories. |
| Unique lowercase IDs; only owned geometry, no children/content input | VERIFIED IMPLEMENTED | Factory validates lowercase ID syntax; caller supplies uniqueness. Distinct route/specimen IDs inspected. Runtime guard rejects text/embedded content and protected ancestors. |
| ABSENCE on Home expedition separator, clean SVG-mask gap | VERIFIED IMPLEMENTED | `field-thread` is mounted by `home()`. Mask has a white field and black 17-unit gap. Browser verified ordinary/anomalous specimen comparison and enlarged mask. This is static geometry. |
| DISPLACEMENT on small footer thread | VERIFIED IMPLEMENTED | Browser forced `footer-collapse`, not a substitute element; real start/completion log observed. |
| 2–5 screen pixels, 120–300 ms, echo 0.08–0.2 | VERIFIED IMPLEMENTED | Tests verify scaled SVG conversion and unchanged defaults. Browser recorded 162-ms production event and 256-ms debug event. Debug measured 70 SVG units at 64/224 scale = 20 screen pixels, echo 0.5; disabling restores defaults. |
| REPETITION on About bottom ornament | VERIFIED IMPLEMENTED | `about-weave` mounted; shifted fourth/fifth units and incompatible second diamond inspected in browser. Debug highlights this existing geometry. |
| NONLINEARITY on Archive edge above year navigation | VERIFIED IMPLEMENTED | Browser invoked real `archive-edge`, observed `--collapse-from:18px; --collapse-to:0px`. Same 900-ms keyframes hide the shape while relocating. Tests verify both settled destinations. |
| Flower on About, `/void`, and design-system specimen | VERIFIED IMPLEMENTED | Route/source inspection and browser `/void` show the intended mounts. No flower in global navigation or footer. |
| Desaturated petals, eye opening, broken rings, dark void and cold highlight | VERIFIED IMPLEMENTED | Original SVG paths and CSS inspected; browser renders the existing emblem. |
| Hover introduces crimson/purple and small ring shift, no continuous rotation | VERIFIED IMPLEMENTED | CSS transitions are 2,400 ms, ring translation approximately 2 screen pixels; no rotating keyframes. Actual flower CSS transition events logged. |
| BrokenDiamond more common than CressonFlower | VERIFIED IMPLEMENTED | Shared header/footer, metadata and section marks use BrokenDiamond; flower stays in three rare placements including specimen. |
| One automatic scheduler, no frame loop/WebGL | VERIFIED IMPLEMENTED | One pending automatic timeout in `CollapseController`; animation completion uses a separate short timeout. No requestAnimationFrame, scroll listener or WebGL. QA-only status polling is separate and absent in production. |
| First event 45–90 s; later 90–180 s; maximum three | VERIFIED IMPLEMENTED | Fake-clock tests validate ranges/cap. Browser panel reads the actual deadline and event count; scheduler manual trigger increased actual count to one. |
| At least half-visible decorations only | VERIFIED IMPLEMENTED | IntersectionObserver threshold 0.5; browser state changed from no eligible elements to `footer-collapse` after scrolling. QA specimens are excluded. |
| Selection/focused controls postpone automatic events | VERIFIED IMPLEMENTED | Actual dispatcher checks active control and selection before starting. It skips a scheduled attempt, not an event already in progress. QA “Trigger Next” explicitly ignores focus on its own button only. |
| Off-screen/hidden/lifecycle/disposal cancellation | VERIFIED IMPLEMENTED | Tests cover off-screen removal, visibility cancellation, page departure, disposal, and preventing restart during Level I cleanup. |
| Reduced motion supplies static displacement and relocation | VERIFIED IMPLEMENTED | Production controller tests return static states; CSS disables animation and supplies static transform/echo. Force controls respect this preference. |
| Reduced-motion flower has no transitions; preference changes cancel motion | VERIFIED IMPLEMENTED | CSS `animation:none` / `transition:none`; live media-query listener cancels automatic effects. Tested with a real controller and mocked media change. |
| Missing and repeated weave already static | VERIFIED IMPLEMENTED | No timers or keyframes for these modes. Force controls switch the same ordinary/anomalous classes. |
| Decorative SVGs hidden from screen readers and keyboard focus | VERIFIED IMPLEMENTED | Factory attributes `aria-hidden="true" focusable="false"`; article/route tests and source inspection. Flower interaction is a separately labeled native button. |
| Review controls have native semantics and visible focus | VERIFIED IMPLEMENTED | Existing buttons and `aria-pressed`; browser QA keyboard shortcut/focus and native buttons exercised. |
| Content, links, navigation and controls are never Collapse targets | VERIFIED IMPLEMENTED | Protected-ancestor/content guard tests pass. Actual article HTML contains no story/Collapse target inside its prose. Native whole-page fades are ordinary navigation transitions, not decorative distortion. |
| Blog works without JavaScript | VERIFIED IMPLEMENTED | Complete server-rendered pages, ordinary links and server search tested over HTTP without a browser script engine. |
| All ornaments remain static without JavaScript | **DOCUMENTED BUT NOT FUNCTIONAL** | Too broad: scheduled displacement/relocation require JS, but `.cresson-flower:hover` CSS transitions still execute without JS. No JS-required gate exists for that hover behavior. Left unchanged. |
| Print hides Collapse layer | VERIFIED IMPLEMENTED | Existing print rule hides `.collapse-effect`, `.cresson-flower`, `.collapse-lab`; story/QA print rules hide their controls/overlays. Verified in source, not through a print-dialog rendering. |
| `/design-system#collapse-studies` ordinary comparisons, one-event and static controls | VERIFIED IMPLEMENTED | Existing handlers now call the same shared methods; component/route inspection. Production still limits these review controls to the specimen; the new panel is development-only. |
| System motion preference overrides specimen toggle | VERIFIED IMPLEMENTED | `isStatic()` is OS reduced motion OR specimen static mode; CSS also enforces reduced motion. |
| Check/test commands, actual MDX, routes, links, search and math checks | VERIFIED IMPLEMENTED | `npm run check` and `npm test` pass; 21 tests include existing integration coverage and new controller/gating tests. |
| Environment's deliberate Level I coordinates with scheduler | VERIFIED IMPLEMENTED | Shared `collapselevelchange` event; actual browser Level I masks/background plus tests confirm automatic scheduler pause and restoration. |

## ENVIRONMENT.md

| Documented claim | Status | Verification / qualification |
| --- | --- | --- |
| Maintenance explanations not served publicly | VERIFIED IMPLEMENTED | Server allowlist does not expose markdown/docs. QA explanations are injected only in development. |
| 404 snow field, distant conifers and six barefoot impressions | VERIFIED IMPLEMENTED | Browser rendered the real scene; `SnowField()` and `UncertainFootprints()` generate the geometry, six groups verified in tests. |
| Missing left step near center, distant continuation | VERIFIED IMPLEMENTED | Normal cadence is 40 SVG units; left slot around y=182 omitted; continuation at y=18 follows y=142. QA annotations overlay these actual positions without replacing the trail. |
| True HTTP 404 and normal Return link | VERIFIED IMPLEMENTED | Real server tests assert 404; browser shows Return arrow and unchanged ordinary anchor. |
| `/void`: HTTP 200, noindex, absent from navigation | VERIFIED IMPLEMENTED | Real HTTP and route tests; only development panel exposes a direct inspection link. |
| `/void`: one flower, dark landscape, faint footprints and two-line text | VERIFIED IMPLEMENTED | Browser inspected `.void-main`, actual flower and requested text. Source confirms existing landscape under dark overlay. A visually hidden H1 supplies page structure. |
| Browser Back remains normal | VERIFIED IMPLEMENTED | No navigation prevention or custom history is installed; ordinary full-document links. Source verified. |
| Flower is a native accessible button with focus state | VERIFIED IMPLEMENTED | Browser accessibility tree identifies “Cresson flower”; `story-art.js` button + `story.css` focus outline. |
| Five interactions spaced 450–4,000 ms, rapid/slow reset | VERIFIED IMPLEMENTED | Actual `FlowerSequence` tests cover paced success, rapid clicks and long gaps. QA Activation +1 uses this method without falsifying time. |
| First quiet; second gives 1.2-second response | VERIFIED IMPLEMENTED | Browser activation count one then real second-response class; tests confirm 1,200-ms activation. Existing CSS may ease back afterward; 1.2 s describes the active class, not complete visual settling. |
| Level I lasts ten seconds, sixty-second cooldown afterward | VERIFIED IMPLEMENTED | Browser log: start 02:29:03, completion 02:29:13; sequence tests enforce cooldown until activation +70 s. Cooldown is per document, not a cross-page lock. QA forcing Level I bypasses sequence eligibility by calling the same reaction function. |
| No explanatory label, score, sound or message | VERIFIED IMPLEMENTED | Production markup has no state announcement/score/audio; development diagnostics deliberately do. |
| Snow remains still during Level I | VERIFIED IMPLEMENTED | Snow is static before, during and after Level I. The pause declaration has no moving snow animation to freeze. This is not a hidden particle system. |
| Automatic Collapse pauses during Level I | VERIFIED IMPLEMENTED | Browser scheduler state and controller tests; short events cancel on entry and scheduling resumes on exit when eligible. |
| Only textile segments, decorative lines, flower and backgrounds change | VERIFIED IMPLEMENTED | Browser computed existing repeated-weave mask and flower state; source selectors target only ornament/background elements. |
| Background displacement one pixel; reduced motion suppresses it | VERIFIED IMPLEMENTED | Browser normal-intensity matrix `(1,0,0,1,1,-1)` versus QA `(1,0,0,1,20,-20)`. Reduced-motion CSS overrides transforms; not an OS-level visual test. |
| Hidden tabs/departures restore normal state immediately | VERIFIED IMPLEMENTED | Tests assert state/class removal and timer cleanup. Existing 2,400-ms flower CSS transitions can visually settle after class removal while a page is visible; the claim concerns controller state. |
| Article content never transformed | VERIFIED IMPLEMENTED | Article integration guard tests and scoped selectors. Background pseudo-element changes do not transform the body/content tree. |
| Archive: third-visit eligibility, 4% chance of `?` | VERIFIED IMPLEMENTED | Actual condition is `visits >= 3` (includes third visit). Probability helper and source verified; QA invokes the same setter without rerolling or fabricating articles. |
| Correct accessible count and every article remain intact | VERIFIED IMPLEMENTED | Browser forced `?` while accessible text stayed “6 records collected” and all six archive links remained; Restore Count restored real captured count. |
| Normal supported transition is a 140-ms fade | VERIFIED IMPLEMENTED | Existing root snapshot CSS is 140 ms; browser logged actual native start/completion after normal navigation. End-to-end native promise durations may include capture/lifecycle overhead. |
| Rare transition retains 22px snow strip for 100 ms extra | VERIFIED IMPLEMENTED | Existing named `.environment-memory` snapshot, height22px, old-snapshot animation140ms with100ms delay. Browser exercised real rare navigation and native completion. QA uses same snapshot at160px/+1500ms; incoming DOM confirmed both debug values and native completion. |
| Session marker before paint, one use, ten-second expiry | VERIFIED IMPLEMENTED | Existing synchronous `story-arrival.js`; VM tests cover consumption, matching URL, expiry, and reduced-motion rejection. QA's early observer listens before pagereveal, so it does not miss native completion. |
| No intercepted/delayed links; fallback ordinary navigation | VERIFIED IMPLEMENTED | Production handler prepares marker only; no preventDefault or timer-delayed location change. Test controls are normal anchors using the same preparation function. |
| Reduced motion disables transition animation | VERIFIED IMPLEMENTED | Existing media query sets view-transition animation to none; marker creation/consumption also honor preference. QA does not override it. |
| Capped local visit counter and one-navigation session marker | VERIFIED IMPLEMENTED | Production counter capped10,000; marker contains destination/time only. QA uses separate namespaced session entries exclusively in development. |
| No analytics/cookies/tracking/audio/dependencies; storage denial harmless | VERIFIED IMPLEMENTED | No new package added; source has no external transmissions or audio; storage access guarded and denial tested. |
| Documented module responsibilities and scheduler integration | VERIFIED IMPLEMENTED | Original modules remain responsible for geometry, CSS and behavior; passive events/shared methods added. No second animation engine. |
| Tests cover timing, reset, storage, route isolation and real404 | VERIFIED IMPLEMENTED | All 21 tests pass, including three real server configurations proving that production cannot serve QA assets. |

## Findings left unchanged

1. **DOCUMENTED BUT NOT FUNCTIONAL:** blanket no-JavaScript static-ornament wording, because CSS flower hover transitions are independent of JavaScript.
2. No documented component is **IMPLEMENTED BUT UNUSED**. All four Collapse modes, the flower, snow field, normal footer footprints and uncertain footprint trail have mounts. Some effects are naturally absent on a given page; the panel reports this honestly.
3. Timing labels describe active controller states. Existing CSS easing can finish later, and native transition promises include browser overhead. The QA log makes those differences visible without changing production durations.
4. “Snow stillness” is already the baseline. The audit found no snow-particle animation, and none was added to make that state look more dramatic.

Persona update: the superseded portrait eligibility/dwell/eye rows have been removed. The new Persona Cresson shares the production sequence and Level I controller; see `ENVIRONMENT.md` and the current Persona tests.

Persona verification (current implementation): desktop full composition, tablet layout and mobile 4:5 crop inspected in the browser. Mobile selected the 640px crop; tablet selected the 960px full composition. Keyboard Enter completed all five production activations, both flower targets received the response classes, Level I started and restored after ten seconds. QA alignment, hit area, forced response, Level I and reset were exercised. Reduced-motion controller paths and static CSS overrides are covered by automated checks; an OS-level reduced-motion visual session was not performed. All 31 tests and syntax checks pass.
