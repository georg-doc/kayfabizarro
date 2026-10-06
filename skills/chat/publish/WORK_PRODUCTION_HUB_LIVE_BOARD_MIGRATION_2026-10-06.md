# Work / Sites · Production Hub Live Board Migration · 2026-10-06

Status: **ONE-TIME PUBLISH_ONLY INFRASTRUCTURE FIX**
Executor: **lowest-cost Sites-capable executor**
Existing Site:
`https://kfb-production-hub.frizzlebob.chatgpt.site/`
Existing Site project:
`appgprj_6ab7358322a8819183d2fa036b7b12f9`

## Outcome

Publish the existing accepted Paper/Dark Hub shell **once** with its new remote live-board loader.

This is specifically intended to eliminate future Work/Sites actions for ordinary Hub updates.

## Exact source

Shell owner branch:
`chatgpt-web/surface-consolidation-2026-10-04`

Read:
- `kfb-hub/index.html`
- `kfb-hub/current-board.json`

Canonical live data after migration:
`main/kfb-hub/current-board.json`

Operating contract:
`main/skills/chat/HUB_LIVE_BOARD_OPERATING_MODEL_2026-10-06.md`

## Do not

- redesign Paper/Dark;
- change cards/status text during publication;
- touch Open World;
- add Cloudflare;
- create a second Hub;
- copy live board data back into HTML;
- turn GitHub Issues into a second dashboard database.

## Acceptance

PASS only if:
1. existing Production Hub Site updated in place;
2. browser shows the revision currently stored in `main/kfb-hub/current-board.json`;
3. remote GitHub board populates P0/P1/parallel jobs;
4. remote GitHub board populates **briefing cards**, including Claude Design UFO;
5. local fallback remains available if remote fetch fails;
6. prove no-republish operation:
   - update a harmless board revision/note in GitHub main;
   - refresh Site without another Site deployment;
   - new value appears;
7. persist Site project/version/deployment/source identity.

After PASS:
routine Hub content update = **Web Chat GitHub write only**.

No merge. No Live promotion beyond updating the existing private Hub Site in place.
