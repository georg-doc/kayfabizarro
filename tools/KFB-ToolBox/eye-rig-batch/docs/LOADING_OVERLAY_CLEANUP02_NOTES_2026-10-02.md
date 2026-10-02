# EyeRig Batch · Loading Overlay + Cleanup02 Notes · 2026-10-02

Status: **SOURCE FIX IMPLEMENTED · FOCUSED TEST PASS · STAGE PUBLICATION PENDING**

## Problem reported by Georg

The 3D actor appears loaded, but the central **Loading actor…** overlay can remain visible and block review.

## Root cause in current source

The actor loader already called `loading.hidden = true` on successful load. The authored CSS simultaneously defined `.loading-card { display:grid; ... }`.

The repair no longer relies on the browser's default `[hidden]` stylesheet winning that cascade.

## Repair

- added one `setLoading(show, detail)` owner;
- added `.loading-card[hidden], .loading-card.is-hidden { display:none!important; }`;
- success hides the overlay through both `hidden` and `is-hidden`;
- actor-load failure and top-level boot failure also hide the blocking overlay and keep the problem visible in status/report text instead;
- no EyeRig geometry, profile defaults, source actors, animation or consumer ownership changed.

## Cleanup02 problem visibility

Added source-pinned review data:
`data/cleanup02-review.v0.json`

The existing Medium/Large workbench now provides:

- **Cleanup notes** roster filter;
- selected-actor **EYE-CLEANUP-02** status panel;
- warning labels on affected roster actors.

Visible human-decision cases in the Medium roster:

1. Skeleton Warrior — NoEyes removes separate glowing-eye object + Glow material.
2. Skeleton Rogue — same.
3. Skeleton Mage — same.

Off-roster human-decision case:

4. Prototype Pete — Legacy; raised eye bumps were removed although the cleanup brief originally expected `none`.

Additional selected-actor notes cover Action Figure texture cleanup, Creepy asymmetry, Avian side-eye normals, Lorekeeper/Protagonist_A glasses and Monster patched-face per-eye color evidence.

This is review metadata only. It does not yet substitute Cleanup02 NoEyes derivatives into the EyeRig roster.

## Focused evidence

Source head tested:
`be5ca51377f4db4493b551bdb3d2e87457335b43`

Focused source/contract checks: **22/22 PASS**

Direct `setLoading()` behavior test with a synthetic DOM element: **8/8 PASS**

- show => `hidden=false`, no `is-hidden`, `aria-hidden=false`, detail updated;
- hide => `hidden=true`, `is-hidden` present, `aria-hidden=true`;
- authored CSS contains the explicit `display:none!important` rule.

`app.js` syntax parse after removing its import declarations: **PASS**.

The persisted Node static suite has been expanded with six new checks plus the new data-file presence check. The complete historical 95-check suite was **not rerun locally in this environment**, because the container has no GitHub network access and the repository is not materialized there. Prior 95/95 evidence remains historical baseline only, not a claim for this new head.

## Publication

No Cloudflare Stage publication or public-browser PASS is claimed by this document.

Fixed human route remains:
`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/eye-rig-batch/`
