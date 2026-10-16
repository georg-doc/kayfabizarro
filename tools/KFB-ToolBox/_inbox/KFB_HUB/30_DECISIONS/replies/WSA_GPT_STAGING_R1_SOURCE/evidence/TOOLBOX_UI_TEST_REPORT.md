# ToolBox UI adoption R1 · 17.10.2026

User instruction: use the existing KFB ToolBox Site design/UI for WS1 Staging. Existing private staging identity retained.

## Source

Current owner-private ToolBox Site v9, screen ToolBox Production-08, fetched through supported Sites service access. Source HTML and support.js were rendered in isolation. Actual source UI was observed before integration; model modules were not copied and the isolated donor reported them missing. Palette/fonts/control dimensions are recorded in toolbox-ui-donor.json. No copied placeholder actor or new game runtime.

## Changes

Replaced green marketing layout with exact warm ToolBox UI tokens, Space Grotesk + IBM Plex Mono, 48px top bar, segmented scene tabs, compact controls, right-hand 300px inspector, status dot/footer and narrow-screen stacked layout. Kept only useful staging actions. Stage automatically opens after first qualified build; subsequent checks preserve a running game. Selecting an archive starts the same available scene from that exact bundle. Adapter toolbar occupies a separate row so original WS1 comparison controls remain accessible.

Unchanged server synchronization/archive and unchanged WS1 source bundle. Owner-private audience retained; no game Live promotion or Cloudflare change.

## Actual evidence

- Existing contract suite16/16 PASS; existing synthetic archive suite22/22 PASS.
- Sites production build PASS after final CSS change.
- Browser local: initial stage auto-open, exact M1 hash, exact Lineup hash, archive pane shows two real builds, older archive opens SHA7bb0b904..., restore latest SHA8c5bd157... disables current car as intended, inspector hides/reopens.
- Desktop source-comparison screenshot: matching warm panel #efece6, compact topbar/tabs/inspector; actual WS1 stage, characters and card render in iframe.
- Mobile390x844: viewport390 and document scrollWidth390; no horizontal overflow; computed font Space Grotesk and panel token #efece6. Inspector stacks below the game.
- Desktop and mobile screenshot files saved in local evidence. Hosted HTTP/deployment evidence follows in owning Return.

## Browser access limit

User reports being signed in to Chrome. Two documented attempts to access existing Chrome tabs both timed out in Emulation.setFocusEmulationEnabled. Native Chrome fallback did not open the installed application. This browser-control seam is quarantined; no login, cookie, permission or access-policy workaround was used. Donor fetched via supported Sites service access; UI tested in local in-app browser. Authenticated hosted Chrome scene verification and observation of the next real WS1 push remain open.
