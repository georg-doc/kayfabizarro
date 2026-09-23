# KFB Production Desk · Auto-Sync v1

Status: **PREPARED · REUSE ASSET LIBRARIAN LIVE-REGISTRY PATTERN**

## Für Georg

Ja:
der Asset Librarian aktualisiert sich tatsächlich automatisch.

Er ist damit der richtige technische Donor für das Production Desk.

Ziel:
Das Desk soll neue/aktualisierte GitHub-Slices möglichst automatisch sehen, ohne dass Georg einen Chat daran erinnern muss.

## Proven donor pattern · Asset Librarian

Current GitHub mechanism:

### Source change
`.github/workflows/asset-registry.yml`

On relevant pushes to `main`:
- runs tests;
- rebuilds deterministic registry;
- validates;
- writes generated output to:
  `bot/asset-registry-update`;
- opens/updates reviewable bot PR when permitted;
- never writes generated output directly to `main`.

### Live consumer
`tools/asset_registry/librarian/state.js`

Live base:
`https://raw.githubusercontent.com/georg-doc/kayfabizarro/bot/asset-registry-update/registry/assets/v1`

### Polling
`tools/asset_registry/librarian/app.js`

The Librarian polls the live manifest every **90 seconds**.

If `manifest.sourceCommit` changed:
- reload registry;
- rerun current search if needed.

Therefore:
new generated asset uploads can appear in the Librarian without redeploying the app.

This is a proven KFB donor pattern.

## Proposed Production Desk architecture

Use the same pattern:

```
GitHub source changes
→ GitHub Action
→ deterministic production registry
→ bot/production-desk-update
→ manifest.json + state.json
→ Production Desk LIVE mode polls manifest
→ UI updates
```

No chat reminder required for normal same-repo changes.

## Generated output

Proposed:

`registry/production/v1/`

Files:

- `manifest.json`
- `lanes.json`
- `briefings.json`
- `reviews.json`
- `standards.json`
- `wsa.json`
- `problems.json`

Bot branch:

`bot/production-desk-update`

## Manifest

Example:

```json
{
  "schema":"kfb.production-registry/1",
  "sourceCommit":"...",
  "sourceCommitTime":"...",
  "generatedAt":"...",
  "counts":{
    "lanes":9,
    "humanReviews":3,
    "currentBriefings":12,
    "recoveryBriefings":2
  }
}
```

Desk displays:
- LIVE / CANONICAL;
- source commit;
- last generated time;
- stale warning.

## What triggers auto-refresh

Phase 1 · same kayfabizarro repo:

On push / PR changes affecting:

- `skills/chat/**`
- `tools/KFB-ToolBox/_handover/**`
- `tools/resident_atlas*/**`
- `registry/resources/v1/**`
- current project status/Return files;
- `kfb-hub/**` / `kfb-hub/index.html`;
- production-registry builder/config.

Exclude generated:
`registry/production/v1/**`

Also:
`workflow_dispatch`.

Do not trigger on every large binary/media change unless its status metadata changes.
Asset Librarian already owns raw asset discovery.

## Source discovery rule

Do not scan all Markdown and guess status.

Use explicit status records first:

1. Hybrid Handoff / current control files;
2. named current PR metadata;
3. project Returns;
4. explicit briefing registry/config;
5. durable review markers.

Historical docs remain reference-only.

## Current briefing config

Create a small source file:

`tools/production_desk/config.json`

It lists:
- current lane ids;
- owner repo/PR;
- current Return path;
- briefing path;
- priority;
- provider;
- external-repo flag.

The builder resolves current GitHub state around this explicit list.

No giant fuzzy repository crawler.

## Cross-repo reality

Travel and Racer are separate repositories.

The normal `GITHUB_TOKEN` of a workflow in `kayfabizarro` does not automatically grant arbitrary private cross-repo reads.

Therefore two supported designs:

### Option A · GitHub App / multi-repo token

Install/authorize one GitHub App or fine-grained token for:
- `kayfabizarro`
- `KFB-Travel-Globe`
- `KFB-Stunt-Car-Race`
- other named production repos later.

Store only as GitHub Actions secret.

Then the production-registry builder may fetch exact PR/Return state cross-repo.

Preferred long-term if Georg wants one automatic dashboard.

### Option B · repo → control-plane status dispatch

Each owner repo produces a compact:
`KFB_STATUS.json`

On meaningful owner change:
- repository workflow sends `repository_dispatch` to `kayfabizarro`;
- control registry rebuilds.

This preserves repo ownership and avoids broad read access in the Desk builder.

Requires a cross-repo GitHub credential/App for dispatch, but the payload is intentionally small.

### Until configured

External repo state is:
`LAST_KNOWN · VERIFY CURRENT`

Coworker connector refresh remains the safe manual bridge.

Never show stale Travel/Racer status as LIVE.

## Live Desk client

Analogous to Asset Librarian:

```js
const CANONICAL = './registry/production/v1';
const LIVE = 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/bot/production-desk-update/registry/production/v1';
```

Use:
`fetch(...,{cache:'no-store'})`

Poll suggestion:
60–90 seconds.

If new `sourceCommit`:
reload state.

No private credential in browser code.

## Briefing freshness

Every current briefing entry contains:

- `briefingId`;
- status;
- source path;
- source commit/blob;
- owner PR/head;
- generated/captured time;
- supersededBy.

Desk may offer:
`Copy current briefing`

Only when:
- status CURRENT / RECOVERY;
- source exists at expected revision.

Reference briefing:
prepend stale warning automatically.

## Human review freshness

Review registry contains:

- owner lane;
- exact source/runtime head;
- artifact filename;
- durable URL/location;
- direct-chat delivery flag;
- result PENDING / ACCEPT / TUNE / REJECT.

A human card disappears from NOW after ACCEPT/closed status.

## “What can I do now?” view

The Desk should translate status for a non-developer.

Four buckets:

### LOOK AT
Things Georg must judge.

### RUNNING
Coworker / Blender / Web currently building.

### CAN START IN PARALLEL
Prepared current briefs that do not block the active MVP.

### WAITING
HOLD / dependent / source missing.

No PR-number-first UI.

PR/head appears only in detail drawer.

## Slides / screenshots / visual proof

For visual lanes the registry may store:
- preview GIF/MP4;
- screenshot/contact-sheet;
- review HTML;
- Claude Design session/export reference.

Desk should show a small preview thumbnail where available.

Do not make screenshot proof replace an interactive 3D human gate.

## Phase plan

### PD1
Production registry builder for same-repo state + LIVE bot branch.

### PD2
Desk LIVE/CANONICAL mode + 60–90 s polling.

### PD3
Cross-repo Travel/Racer integration using GitHub App/token or status dispatch.

### PD4
Optional event-triggered Coworker/WSA check-in.

## DoD

Production Desk behaves like Asset Librarian:

- current same-repo production status updates after source change without site redeploy;
- source commit visibly changes;
- stale/fallback mode is explicit;
- generated branch is reviewable;
- no generated output writes directly to main;
- cross-repo status never pretends to be current without proof.
