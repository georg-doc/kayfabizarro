# FAILURE RECOVERY · WC1 PROCEDURAL PROPS P0B

Status: **CANDIDATE PRESERVED · SOURCE ISOLATION PASS · INTEGRATED CI GATE STOPPED AFTER TWO REPAIR PASSES**
Date: 2026-10-01

## Owner / slice

- Owner: existing KFB WorldBuilder / World Corridor 01
- Repo: `georg-doc/kayfabizarro`
- Branch: `chatgpt-web/wc1-procedural-props-p0-2026-10-01`
- Draft PR: #311
- Parent/base branch: `chatgpt-web/world-corridor-01-2026-10-01`
- Parent base head at slice start: `1eeba2c573c8ff764cc8151ac92b241811e8bab2`
- Frozen candidate head tested in Repair Pass 2: `94443824e6b13f38c611defd06dacedd7c6d0faa`

No merge, Stage or Live promotion occurred.

## Goal

Test whether Hivebound's asset-light pattern can give KFB cheap procedural background props without asking Claude to hand-design a large asset catalog.

Donor:
- `zernonia/hivebound@be10166e44f3d89db922ebb90671c10b89cd3e62`
- MIT
- pattern donor only.

Retained owners:
- WC1 / WB2 remain world/render owner;
- current Clay002 Global Clay Lite seam remains material owner;
- Track Core / Race / Ground unchanged;
- authored Residents / KayKit / FrizzleBob unchanged;
- no Nuxt/TresJS runtime imported;
- no second renderer.

## Candidate contents

### P0 · intentionally crude architecture proof
- `source-isolation.html`
- generated TUFT / ROCK / TREE
- deterministic seed
- merged geometry per family
- InstancedMesh
- per-instance tint

### P0B · corrected Hivebound soft-form grammar
- `source-isolation-soft.html`
- bent tapered soft tufts
- rounded pebble clusters
- flared lathe trunks
- overlapping smooth blob crowns

### Integrated diagnostic candidate
- `procedural-props-p0b.mjs`
- `integration-wc1-clay002.html`
- bounded `addDiagnosticObject/removeDiagnosticObject` seam added to the existing WC1 diagnostic host
- current Clay002 512 Global Clay Lite path reused

## Proven PASS evidence

### P0 source isolation
Run `36906220603`, job `110517315973`, SUCCESS.

- 3 families
- 48 instances
- 7 draw calls
- 6,826 triangles
- WebGL2
- 0 console errors
- 0 page errors

Artifact `11185175509`
digest `sha256:bce7d13e462951681a5d16d09369dc2743f36625a46c9aa11afbe2792dede3f0`

### P0B soft-form source isolation
Run `36907603447`, job `110521959500`, SUCCESS.

- 3 families
- 48 instances
- 7 draw calls
- 40,354 triangles
- WebGL2
- 0 console errors
- 0 page errors

Artifact `11185641597`
digest `sha256:4fe41f397f5d073fceed3cba63ebdcf899e1d663212fa54809cb5f9ba26a0813`

Visual review:
P0B is materially closer to Hivebound's actual smooth/cozy geometry grammar than P0. It is still not KFB visual acceptance.

## Integrated gate history

### Initial integration run
Head `eaf1fdce77d0119efb7ea9c614452d228f2882a0`
Run `36908404143`, job `110524661724`

P0/P0B isolation remained PASS.
Integration failed waiting 120 s for `window.__KFB_PROC_WC1.ready`.

At that point no product defect was proven.

### Repair Pass 1
Head `41cf46de07803c2b63a41a23ea2bf8b63a814acb`
Run `36910471186`, job `110531561900`

Progress markers were added, but the harness attempted a screenshot before writing the diagnostic JSON. The continuously-rendering WebGL screenshot timed out under SwiftShader.

Classification:
`QA_HARNESS_EVIDENCE_ORDER`.

### Repair Pass 2 · last allowed
Head `94443824e6b13f38c611defd06dacedd7c6d0faa`
Run `36911209819`, job `110534004159`

Artifact `11186513330`
digest `sha256:8395f3a3e4f2d495ed685eb020105e948b85a5f6a66bafbcafce20a7fa2bc096`

Diagnostic result:
- P0 source isolation PASS;
- P0B source isolation PASS;
- WC1 boot completed;
- Clay002 activation completed;
- procedural prop mount completed;
- last progress marker: `prop-mount-done` at ~38.4 s;
- mounted eligibility result on Burg: 0 tufts / 7 pebbles / 11 trees / 29 mesh instances;
- no page error;
- one unclassified HTTP 404 console message;
- readiness did not complete because the test then waited for 16 rendered frames to calculate base/with-props frame deltas.

## Observed failure

The integrated candidate reaches WC1 + Clay002 + P0B prop mount, but the GitHub software-WebGL environment cannot complete the post-mount frame-wait measurement inside the gate.

The strict placement recipe also finds no eligible tuft cells on the current Burg island and fewer pebble/tree cells than the nominal source-isolation sample.

## Proven cause vs hypothesis

PROVEN:
- the procedural prop module imports;
- WC1 boots far enough to return its API;
- Clay002 is applied before mount;
- the current WC1 diagnostic mount seam accepts the P0B group;
- prop placement code completes without a page exception;
- the final CI block occurs after `prop-mount-done`;
- the gate is waiting on frame-driven delta measurement under SwiftShader;
- Burg eligibility under the current strict filters is 0/7/11, not 16/12/12.

NOT PROVEN:
- representative M1 Max cost of the integrated props;
- final visible KFB fit inside WC1;
- whether the single HTTP 404 is relevant; it did not prevent boot/Clay/mount;
- the correct production density/placement grammar;
- any reason to replace current authored hero assets.

## Stop rule

Two repair passes on the same integrated browser gate are exhausted.

DO NOT:
- add a third CI harness variation;
- relax SwiftShader frame thresholds and call it integration PASS;
- tune prop shapes from headless CI;
- retune Clay002 in this stopped slice;
- merge PR #311 as a finished WorldBuilder feature;
- publish Stage merely to rescue the CI gate.

## Salvage map

KEEP:
- Hivebound donor analysis and exact pin;
- P0/P0B generators;
- P0B soft-form grammar;
- isolated PASS screenshots/evidence;
- deterministic family/InstancedMesh pattern;
- bounded WC1 diagnostic mount seam;
- integrated page with progress markers;
- Repair Pass 2 diagnostic JSON.

QUARANTINE:
- CI frame-driven post-mount delta measurement;
- current Burg placement counts as production defaults;
- current unclassified 404 until a future consumer gate needs it.

DEFER:
- KFB style-adapter matrix;
- additional prop families;
- production placement grammar;
- representative local performance;
- any WorldBuilder adoption decision.

## Related workflow donor note

`henrik-thevibe/Claude-Mascot-Style-Gallery@0c7f2de521dd49eb402b01db9e6b9cb4c6d0c603` is recorded separately as a workflow donor:
fixed engine/rig + narrow style adapters + automated grid/pose/solo comparison surfaces.

This suggests a later KFB approach where Claude iterates style adapters/parameters against fixed generated prop families rather than hand-authoring every object.

## Exactly one next gate

**FRESH SLICE · LOCAL VISIBLE WC1 P0B PROOF**

Start from frozen candidate head `94443824e6b13f38c611defd06dacedd7c6d0faa`.

Create one representative local-Chrome review package using the already successful KFB local-GPU pattern:
1. preserve the exact WC1 + Clay002 + P0B source;
2. avoid frame-count acceptance in hosted SwiftShader;
3. expose immediate mount facts plus a bounded local Measure / Copy JSON action;
4. show the actual Burg view with props in visible Chrome on representative hardware;
5. measure visual fit and frame delta locally;
6. only after that decide whether a reusable KFB procedural style-adapter matrix is worth building.

No Stage is required for that local hardware gate.
