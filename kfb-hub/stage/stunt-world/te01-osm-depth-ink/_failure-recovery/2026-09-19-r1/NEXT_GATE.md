# NEXT GATE

## One gate only

Open the actual Cloudflare Pages project for `kayfabizarro.pages.dev` and prove all three facts in one inspection:

1. the authoritative production branch/ref;
2. the latest deployment/build that Cloudflare believes is current;
3. whether that deployment contains `cloudflare-live@66bd1707173e250f5410b5da90a7472863d1c825` or why it does not.

Then perform **one** platform-side deployment/repair and verify that:

`https://kayfabizarro.pages.dev/kfb-hub/stage/stunt-world/te01-osm-depth-ink/DEPLOYMENT.json`

returns `testedRuntimeCommit = 666d3e43314cb43f0286c93442c335dcb60167d8`.

Only after that marker passes may the existing public browser proof be rerun.

Do not change Race runtime, Ink settings, Ground/Landuse values, Hub design or the public-proof assertions before this control-plane gate is resolved.
