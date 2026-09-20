# RETURN · KFB Hub UI v2 acceptance + ToolBox v2 promotion

Date: 2026-09-21
Owner: KFB Production Hub / ToolBox router

## Human decision

Georg explicitly accepted:
`https://kayfabizarro.pages.dev/kfb-hub/stage/hub-ui-v2/`

Decision:
**use/check in the Hub UI v2 design**.

The old PR #141 is not merged directly because it diverged from newer Hub content. Its accepted presentation is ported onto the current Hub data instead.

## Promotion content

- canonical KFB Hub receives Paper/Dark, hash routes and Stage/Live visual previews;
- ToolBox gets a prominent top-level Hub link;
- ToolBox Home receives the same Paper/Dark editorial grammar;
- ToolBox route/previews are reconciled against the actual Cloudflare publication tree;
- I1A WorldSurface status is added as technical-leading / human-gate-open, not human accepted.

## ToolBox audit

6 public previews · 5 missing/blocked · 6 source/integration gates.

Important corrections:
- Resident Atlas, direct Dungeon S13.2, direct Hex S11 and 2D Animation Studio do not currently have the claimed exact files on `cloudflare-live`;
- KCC remains PUBLIC BLOCKED;
- Vehicle Deformer v2 and KayKit Ranged Calibration do have current public Stage files and are surfaced.

## Next gate

Publish the exact merged Hub + ToolBox files to `cloudflare-live`, open:
- `https://kayfabizarro.pages.dev/kfb-hub/`
- `https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/`

and verify the expected v2 markers before calling the promotion public.

## Promotion checkpoint

- accepted UI implementation merged to main: `dfbbb733b37a3923e4e5a80ff99f9f91209f3aaa`
- exact Hub/ToolBox publication files written to `cloudflare-live@cbbae810e6ddb8f282e702d0897bed8566361327`
- publication-branch readback: PASS
- direct pages.dev verification from this session: PENDING because the available HTTP viewer cannot access the host.

Human test URLs remain:
- `https://kayfabizarro.pages.dev/kfb-hub/`
- `https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/`

Do not label the new revision PUBLIC_VERIFIED until those exact URLs show the v2 markers.


## Status consistency refresh · 2026-09-21

After the initial v2 promotion, the canonical Hub still contained two stale routing strings: the already-accepted Hub UI v2 human gate and the original 15-card ToolBox review copy. A bounded refresh removes those stale states without redesigning either surface.

Current ToolBox routing truth:
- 17 cards total;
- 6 exact public previews;
- 5 missing/blocked routes;
- 6 source/integration gates;
- prominent direct ToolBox link in the canonical Hub header and fallback;
- direct ToolBox v2 card in the KFB Stage router.

Source checks: **18/18 PASS** at implementation checkpoint `ff3b71a386f370da80b2a19cfc242ec9c0a7b00a`.

Public pages.dev verification remains separate; do not infer it from GitHub publication-branch state.


## Final status refresh publication seal

- status-refresh PR: **#153**
- merged to main: `dfaafac070747f9543b5eb5a635e2aaa74e57b83`
- publication branch write: `cloudflare-live@c2185ed4a59bbae0c3610cb35155af1ccb542c00`
- exact public files read back from publication branch and matched to main blobs: **PASS**
- public HTTP/browser verification in this session: **PENDING / TOOL ACCESS BLOCKED**

Public routes to verify externally:
- `https://kayfabizarro.pages.dev/kfb-hub/`
- `https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/`

Expected visible markers:
- canonical Hub: Paper/Dark toggle + prominent ToolBox link + no stale Hub UI v2 review todo;
- ToolBox: `HUB v2 · SOURCE-FIRST ROUTER`, 17 cards, 6 public previews, 5 route gaps/blocked, 6 source/integration gates.
