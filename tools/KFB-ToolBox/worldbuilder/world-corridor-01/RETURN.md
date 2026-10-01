# WorldBuilder · Floating-Island Corridor · Return

Status: **SOURCE CHECK-IN COMPLETE · INTEGRATION READY · RUNTIME NOT STARTED · NO STAGE**
Date: 2026-10-01

## Result

The two current Claude Design exports are now recoverable from the existing WorldBuilder owner instead of living only as inbox/session state:

- **Floating / Hex Islands + route-layout** accepted as an island/layout donor;
- **Skydome / EnvironmentHost** accepted as an environment donor.

The check-in does not promote either inbox folder into a new runtime owner.

## Existing owners retained

- **WorldBuilder / WB2** — scene document, terrain/surface authoring, object edit, save/reload and receiving host.
- **Track Core 0.12** — sole RouteRecipe → samples → frames → slots → checks owner.
- **Race / current drive runtime** — driving/contact/steering/drift/jump physics.
- **Ground** — walk movement owner.
- **Billboard scheduler / LOD** — billboard update cadence; baked/static image provider first.
- **EnvironmentHost v3** — candidate sky/weather layer called from the WorldBuilder host loop; no second renderer/timer/fog owner.

R2C island `buildTrack()` is retained only as route-layout/input evidence. It is not promoted to a second Track Core.

## Source identity

Repository: `georg-doc/kayfabizarro`  
Branch: `chatgpt-web/world-corridor-01-2026-10-01`  
Intake main source commit: `901328352530fb14c19391876b2cb28beffb48bd`  
Verified implementation/evidence head before this Return: `0cde75dee8b4a7c7fd3a2835ef945753a8832287`.

Source manifest:
`tools/KFB-ToolBox/worldbuilder/world-corridor-01/SOURCE.json`

## Actual checks

**13 / 13 source + owner checks PASS.**

Verified:
- both Claude cuts exist on current source commit;
- active island HTML and real ~84 kB island module exist;
- island Return explicitly preserves the unresolved GPU baseline;
- SKY3 manifest, EnvironmentHost v3, cloud v3 and spindle candidate resolve;
- exact accepted WB2 host source resolves;
- Track Core owner/head and `kfb.track-core/0.12` snapshot resolve;
- existing Billboard scheduler / provider seam resolves.

This is not a runtime/browser/GPU integration PASS.

## Performance evidence retained

Current island export reports that R2C has more batches than the earlier comparison and **does not have a reliable R2C GPU baseline yet**.

SKY3 isolated preview evidence shows cloud cost depends strongly on LOD:
- 4 clouds: about 2.4 ms in the v3 preview;
- 12 clouds: about 3.2 ms;
- 24 clouds: about 7.2 ms;
- 24 all-near: about 19.0 ms / 282k triangles.

These are donor-preview measurements only. They must be remeasured inside the actual corridor before an architectural decision.

## Runtime path now fixed

The productive sequence is:

1. exact island-source baseline;
2. Track Core adapter;
3. chunked track colliders + one vehicle;
4. cached/static billboards;
5. EnvironmentHost / cloud series;
6. representative near-island actor/assets;
7. streaming stress at 4 → 12 → 24 → 48 → 150 **logical** islands.

150 full-detail islands are explicitly not an acceptance target.

Track / Flight / Portal remains a product decision **after** measured combined performance, not before.

## Inbox lifecycle

The two source cuts stay in `_inbox/` for now as pinned provenance. Do not archive or delete them until their accepted modules have been rehomed and parity-proven inside the WorldBuilder owner.

## Public / Stage

Stage: **NONE**.  
No merge, Cloudflare deployment, public browser claim or Live promotion was performed.

## Unresolved

- R2C baseline on representative real GPU;
- island-layout → Track Core adapter;
- looping behavior under the real drive owner;
- exact Near / Mid / Far island budget;
- SKY3 cloud budget in the combined scene;
- billboard cost inside the combined scene;
- streaming unload/leak behavior after traversal.

## Exactly one next gate

**WC1-BASELINE:** rehome the exact current island source under the WorldBuilder owner, add only the tiny shared performance probe, and prove visual/source parity + baseline numbers. Do not add Track, vehicle, billboards or SKY3 before the baseline is recorded.
