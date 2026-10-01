# WC1 Procedural Props P0B · WC1 + Clay002 Integration Status

Status: **INITIAL INTEGRATION BROWSER FAIL · SOURCE ISOLATION STILL PASS · REPAIR PASS 1 OPEN**
Date: 2026-10-01
Owner: KFB WorldBuilder / World Corridor 01
Branch: `chatgpt-web/wc1-procedural-props-p0-2026-10-01`
Draft PR: #311
Failed tested head: `eaf1fdce77d0119efb7ea9c614452d228f2882a0`

## What passed

On the same workflow run:
- P0 source isolation PASS;
- P0B soft-form source isolation PASS;
- static syntax PASS.

The donor grammar and its isolated rendering remain proven.

## Initial integration failure

GitHub Actions:
- run `36908404143`
- job `110524661724`

Only failing step:
`Browser WC1 + Clay002 integration proof`

Observed:
`page.waitForFunction: Timeout 120000ms exceeded`

No assertion ran after readiness because `window.__KFB_PROC_WC1.ready` was never observed.

At this checkpoint this is **not proof of a procedural-prop defect** and **not proof of a Clay002 defect**. The current harness does not expose whether boot is slow under SwiftShader, an async dependency failed, or the integration page threw before setting ready.

## Repair Pass 1 boundary

Harness/diagnostic only:
- expose progress checkpoints;
- on timeout, always capture page errors, console errors, progress and screenshot;
- do not redesign props, retune Clay002, change WB2/Track/physics owners or add a second renderer.

If a concrete source/runtime defect is then proven, Repair Pass 2 may fix only that defect. If the same gate still cannot progress after Repair Pass 2, freeze/export per protocol.
