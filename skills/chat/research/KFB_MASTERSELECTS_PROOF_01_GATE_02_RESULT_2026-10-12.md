# GATE 02 RESULT — MASTERSELECTS_3D_RASTER_READBACK_ENV_PROOF_02

Date: 2026-10-12 · Executed immediately after Proof 01 · Same machine, same pin, same dev server.
Upstream pin: `Sportinger/MasterSelects` @ `db912a05028eada21d37ec76d5317a36de865af2` (v3.1.8)
KFB research head: `1128054cbcb7eac7e861a8d14ffd20533df0ac13` (unchanged, no writes)

## Question asked

Proof 01 left `GRAPH_SCENE` at UNKNOWN because the 3D raster readback was blank.
Gate 02 asked exactly one thing: **is that blank result an artifact of the Playwright/CDP-driven browser, or is it real?**

## Answer

**It is real. The hypothesis is refuted, and `GRAPH_SCENE` becomes FAIL for this environment.**

## A/B setup

| | Arm A | Arm B |
|---|---|---|
| Launch | Playwright 1.63 `chromium.launch({channel:'chrome'})` | Chrome binary launched directly |
| Flags | Playwright's full instrumented set, incl. `--enable-unsafe-swiftshader`, `--no-sandbox` | only `--remote-debugging-port`, `--user-data-dir`, `--no-first-run`, `--no-default-browser-check` |
| Chrome | 147 | 147.0.7727.102 |
| WebGPU adapter | `apple` / `metal-3` | `apple` / `metal-3` |
| WebGL renderer | ANGLE (Apple, ANGLE Metal Renderer: Apple M4) | ANGLE (Apple, ANGLE Metal Renderer: Apple M4) |

Both arms are hardware-accelerated. The `--enable-unsafe-swiftshader` flag in Arm A did **not** force software rendering —
it is a fallback enabler, and the adapter resolved to Metal in both arms. That candidate explanation is eliminated.

## Measurements (upstream's own golden-fixture tools, unmodified)

| Run | Browser | Fixture | t=0 | t=0.5 | t=1 | t=2 |
|---|---|---|---|---|---|---|
| A1 | Arm A | universal 3D/Gaussian/CAD | blank | — | blank | blank |
| B1 | Arm B | universal 3D/Gaussian/CAD | blank | — | blank | blank |
| B2 | Arm B | solid/text/image (2D) | blank | **luma 58.19** | **luma 58.19** | — |
| B3 | Arm B | universal 3D (recheck) | blank | — | blank | blank |
| B4 | Arm B | solid/text/image (2D) | blank | blank | blank | — |
| C1 | Arm B, fresh reload | solid/text/image (2D) | blank | **luma 58.19** | **luma 58.19** | — |
| C2 | Arm B, same session | universal 3D | blank | — | blank | blank |
| C3 | Arm B, same session | solid/text/image (2D) | blank | **luma 58.19** | blank | — |

Blank frames all carry the identical fingerprint hash `1f116dc5`; rendered 2D frames carry `7a5c08a9`.
Every fixture reported `failures: []` — these tools record observation data and do not assert non-blank,
so a "successful" run says nothing about whether anything was drawn.

## What this establishes

1. **The capture path works.** C1 is a positive control on a freshly reloaded renderer: the pure 2D fixture
   renders at `nonBlankRatio 1`, `meanLuma 58.19`, repeatably. The earlier Proof-01 conclusion that the
   measurement might be blind is disproved.
2. **3D content never rendered.** Across three independent runs in two differently launched browsers, the
   universal 3D/Gaussian/CAD fixture produced a blank frame at every sample time — including t=1 and t=2,
   where the 2D fixture is reliably non-blank.
3. **The 3D fixture blanks the whole composition.** That fixture contains a solid background, an image and
   text clips in addition to the mesh. Those same 2D element types render on their own, but produce nothing
   once the 3D/mesh content is present.
4. **The renderer degrades after a 3D run.** C3 shows the 2D fixture only partially recovering (t=0.5 renders,
   t=1 does not), and B4 shows it not recovering at all. The 3D/mesh pass leaves the renderer in a bad state.
5. **t=0 is never reliable**, even for 2D — content has not settled at exactly zero. This does not affect the
   verdict, which rests on t=1 and t=2.

## Verdict

`GRAPH_SCENE` = **FAIL** (was UNKNOWN).

Scope of the claim, stated precisely: on macOS 26.6.2 / Apple M4 / Chrome 147 with hardware WebGPU (Metal 3),
MasterSelects 3.1.8 at commit `db912a05` did not produce any visible 3D raster output, and its presence
suppressed otherwise-working 2D output. This is a reproducible result from the vendor's own verification tools,
not an inference from a failed manual interaction.

This is **not** a claim that the donor's 3D pipeline is broken for its author or on other hardware. It is a
claim that it could not be made to render here, which is the question KFB actually needed answered.

## Limits of this gate

- No OS-level screenshot was possible: `screencapture` returned "could not create image from display"
  (Screen Recording permission not granted to this process). All pixel evidence therefore comes from inside
  the browser — but the positive control (C1) makes that path trustworthy.
- Only Chrome was tested. Safari (WebKit) and Firefox were not.
- Only this one machine and OS build were tested. The result is environment-scoped by construction.
- Path-traced mode, export rendering and the hosted kernel remain untested.

## Consequence for the KFB donor decision

The parts of the donor that KFB can actually rely on are the ones Proof 01 confirmed: the agent-control
architecture — one state owner, a policy-gated tool surface, dry run, idempotency keys, entity-diff audit,
reversible operations and durable persistence. All of that was proven working.

The part KFB was interested in for scenelet/diarama shot authoring — the shared 3D scene — could not be
made to render on current Mac hardware. **ADAPT PATTERN remains the recommended route; the 3D capability
must not be assumed.** Treating MasterSelects as an EXTERNAL TOOL for 3D work would require re-testing on the
target machine first.

## Next gate

**MASTERSELECTS_3D_UPSTREAM_ISSUE_CONFIRMATION_03** — report the reproduction upstream (fixture names, hashes,
environment) and ask the author whether 3D is expected to work on Apple Silicon / Chrome 147, or raise it on a
second GPU/OS. One answer there decides whether the 3D angle is permanently closed for KFB or merely deferred.
This is a cheap external question, not an engineering slice.
