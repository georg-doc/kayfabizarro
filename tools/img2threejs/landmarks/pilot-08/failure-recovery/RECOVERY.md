# RECOVERY

Resume from GitHub state, not chat memory.

## Source/runtime

`georg-doc/kayfabizarro`  
PR #110 · draft/open  
Tested runtime: `aa28a743628699271c94c1911af23d0564c6f3cc`

Do not rebuild that runtime.

## Public candidate

Route:
https://kayfabizarro.pages.dev/kfb-hub/stage/img2threejs/tinyskies-osm-cohesion-v1/

Current status:
`PUBLIC_PROOF_FAILED · HUMAN_REVIEW_BLOCKED`

## First file to inspect

`kfb-hub/stage/img2threejs/tinyskies-osm-cohesion-v1/SOURCE.json`

Known exact blocker:
literal `\\n` after the JSON object.

## Recovery sequence

`START_HERE.md → POSTMORTEM.md → NEXT_GATE.md → current main/cloudflare-live refs → marker-only repair → public proof`.

If the marker-only gate fails again, do not touch the visual runtime; investigate publication routing independently.
