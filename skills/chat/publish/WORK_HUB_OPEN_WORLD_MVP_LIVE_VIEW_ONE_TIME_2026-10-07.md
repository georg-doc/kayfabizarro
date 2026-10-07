# Work / WSA · Production Hub · Open World MVP Living View · ONE-TIME Site Migration · 2026-10-07

Status: **READY · SAME RECOVERY-WSA RUN · ONE SITE PUBLISH ONLY**
Owner: **existing KFB Production Hub**
Human owner: **Georg**
Purpose: add one permanent live Open World MVP view to the existing Hub so later matrix updates require no Work/Sites run.

## Existing Site — do not replace

URL:
`https://kfb-production-hub.frizzlebob.chatgpt.site/`

Project:
`appgprj_6ab7358322a8819183d2fa036b7b12f9`

Last accepted shell evidence from Issue #364:
- accepted Hub v2 shell restored in place;
- Site version **10**;
- deployment `appgdep_6ac56373eee4819190c3f7c2f3e0cbdd`;
- Site source commit `1013041360cc9c5cdb1990b4db81fab4e6c28236`;
- accepted donor blob `1fb367c70412d18ef9b0802c3feb2019357be525`;
- desktop/mobile controls, theme, Pocket Inbox, Resident overlay, live data and live CSS were PASS.

**Load the exact current Site/project first.**
Do not reconstruct it from repository `kfb-hub/index.html`, an old Site export or an old donor.

## Add exactly one internal view

Target:
`https://kfb-production-hub.frizzlebob.chatgpt.site/?view=open-world-mvp`

The view presents the Open World MVP Living Doc:
- binary MVP status;
- all required rows;
- explicit non-blockers;
- status/category filters;
- search;
- architecture/system overview;
- row detail with current state, donor, donor role, owner, evidence, proof and effort.

Reference interaction/content implementation:
`skills/chat/recovery/OPEN_WORLD_MVP_LIVING_DOC_2026-10-07.html`
on Draft PR #373.

Do not iframe or route to Cloudflare.

## Live data

Stable feed:
`https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/kfb-hub/live/open-world-mvp.json`

Fetch:
- on view load;
- on explicit refresh/reload if the Hub provides one;
- `cache: no-store`.

Use a deployed local fallback snapshot only if the live fetch fails.

Show freshness/revision so Georg can see which live-data version he is viewing.

## Preserve the Hub

Do not regress or remove:
- Heute / Briefings / Projekte / Entscheidungen / Archiv;
- ToolBox;
- WorldBuilder;
- Resident/Actor control and overlay;
- Paper/Dark;
- freshness/reload;
- search;
- Pocket Inbox;
- Decisions workflow;
- existing live-board loader;
- existing live-CSS loader;
- all browser-local state.

No redesign.

## One-time publish

Publish **in place** to the existing Production Hub project.

No second Site.
No Open World product Site.
No Cloudflare/pages.dev publication.

Record:
- exact Site project;
- new Site version;
- deployment;
- source revision;
- direct desktop/mobile proof for `?view=open-world-mvp`;
- console/network errors.

## Hard acceptance · prove no future Work is needed

After the one Site publish:

1. note Site version/deployment;
2. modify only `main/kfb-hub/live/open-world-mvp.json` with a harmless truthful revision/updatedAt change;
3. do **not** republish the Site;
4. refresh `https://kfb-production-hub.frizzlebob.chatgpt.site/?view=open-world-mvp`;
5. visibly confirm the new JSON revision/data is displayed;
6. confirm Site version/deployment is unchanged;
7. leave the JSON at truthful current Recovery Audit state.

PASS condition:

**future routine MVP matrix/status updates = Web Chat/ChefWSA → GitHub main JSON → Hub refresh.**

No further Work/Sites run for:
- requirement status;
- donor/owner;
- evidence/proof;
- counts;
- product status;
- explanatory copy carried by the live feed.

A later Work/Sites run is justified only by a genuine Hub structure/behavior change.

## Return

Primary Georg-facing result:
- Living Doc is now inside the existing Hub;
- exact Hub URL;
- whether JSON-only refresh is proven;
- whether any genuine remaining Site issue exists.

Technical appendix:
- project/version/deployment/source;
- tests/evidence;
- live-feed revision;
- exact no-republish proof.

Do not claim Open World MVP PASS from this control-surface publish.
