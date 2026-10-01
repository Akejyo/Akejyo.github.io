# Development effect QA

Run `npm run dev`, then press **Ctrl + Shift + K** (Windows/Linux) or **Cmd + Shift + K** (macOS). Restart an already-running development server after updating the npm command. `npm start` never enables QA. `NODE_ENV=production` disables it even when `--development` is passed. The server returns 404 for QA JavaScript and CSS outside development; query parameters and local storage cannot enable it.

The floating panel can move left/right or minimize while leaving a test visible. Closing it disables exaggeration and removes footprint annotations. It remembers its open state and latest 200 log entries across development navigations. None of that storage is accessed by production QA code because no QA code is served there.

## Shared implementation, not a second effects engine

| Control | Actual implementation invoked |
| --- | --- |
| Force ABSENCE / REPETITION; NORMAL / ANOMALOUS | `CollapseController.setOrdinary()` and the existing `CollapseEffect` SVG mask/repeated geometry. These are static states, not new animations. |
| Force DISPLACEMENT / NONLINEARITY | The live singleton's `CollapseController.play()`, including its existing CSS animation and completion timer. |
| Trigger Next Event Now | `triggerNext()` through `triggerNow()`, the same event dispatcher used by the automatic timer. Manual invocation ignores focus on the QA button, but retains real visibility, reduced-motion, Level I, and three-event-cap checks. |
| Pause / Resume | The live scheduler's timer; no parallel scheduler. An event already running may finish. |
| Activation +1 | `activate()` and `FlowerSequence.interact()`. Real 450–4,000 ms pacing and cooldown still apply. |
| Force second-response / Force Level I | `secondResponse()` / `enterLevel()`, exactly the functions reached by the normal sequence. No sequence or cooldown is fabricated. |
| Reset sequence / cooldown | Separate resets of the real state. Level exit remains a separate control. |
| Level I Enter / Exit / comparison | Existing document state, masks, flower colors, background transforms, ten-second timer, and scheduler coordination. |
| Persona Cresson controls | Shared `activatePersona()`, `personaResponse()`, `enterLevel()` and `resetPersona()`; development-only hit-area and overlay alignment guides. |
| Force ? / Restore Count | `setArchive()`, also used by the production probability branch. Accessible count and article links are untouched. |
| Transition tests | Ordinary anchors call the production `prepareTransition()` path with an explicit next-test choice. Actual cross-document navigation, session handoff, CSS snapshots and native `ViewTransition.finished` are used. |
| Footprint inspection | Navigates to the real 404 or `/void`. Optional red annotations mark the missing slot and distant existing impression. No replacement footprint animation is rendered. |

If a mode is absent from the current page, the panel explicitly says so and uses the same exported `CollapseEffect()` factory in an isolated specimen. These specimens never enter the automatic scheduler. Flower, Persona and archive controls are disabled where the real component is absent; use the panel's route links to reach them.

Exaggeration is development-only: displacement 20 screen pixels, echo 0.5, nonlinear range 90 SVG units, larger mask gap, highlighted incompatible repeat, Level I background offset 20 px, and transition strip 160 px with 1,500 ms extra persistence. Existing durations for displacement, relocation and Level I are retained. Turn it off to compare the current production values. Reduced motion remains authoritative; it is never bypassed by a force control.

## Evidence and limitations

Event entries come from actual controller execution, CSS transition events, or native page-transition promises. They distinguish prepared, started, completed, cancelled, static and blocked states. A prepared navigation is not proof that a browser rendered a transition. Native completion duration includes browser lifecycle timing; configured ornament duration is recorded separately. Logging is passive and bounded. Production has no log subscriber, storage, panel polling, or debug stylesheet.

See [the claim-by-claim verification report](QA-VERIFICATION.md). That audit records the earlier baseline. See [the rebalance report](REBALANCE.md) for the subsequent authorized production changes. The scheduler panel now shows remaining eligible exposure, including when that budget is paused, and distinguishes ornament cooldown from offscreen waiting.
