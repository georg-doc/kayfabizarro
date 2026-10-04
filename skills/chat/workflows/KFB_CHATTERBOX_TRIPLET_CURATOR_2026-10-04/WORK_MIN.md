# WORK MIN · KFB ChatterBox / Triplet Curator v1

Use **Sites-capable Work**. Do not redesign the architecture.

Repo: `georg-doc/kayfabizarro`  
Draft PR: **#357**  
Branch: `planning/chatterbox-triplet-curator-site-2026-10-04`

Read only:
1. `skills/chat/START_HERE.md`
2. `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`
3. `skills/chat/workflows/KFB_CHATTERBOX_TRIPLET_CURATOR_2026-10-04/START_HERE.md`
4. `skills/chat/workflows/KFB_CHATTERBOX_TRIPLET_CURATOR_2026-10-04/SITE_IMPLEMENTATION_PACKET.json`
5. `skills/chat/workflows/KFB_CHATTERBOX_TRIPLET_CURATOR_2026-10-04/WORK_ONE_SHOT_BRIEF.md`

Mission: build **one private GPT Site** in the existing ToolBox slot `chatterbox-comic-vfx`: **KFB ChatterBox / Triplet Curator**.

Mandatory:
- reuse `S1_RESIDENT_PREP_2026-10-04/KFB_TRIPLET_POOL_REVIEW_STAGE_v1.html` as the UI/workflow donor; show it in isolation first;
- import its existing `kfb.triplet-pool-review/1` export without losing KEEP/CUT/CHANGE decisions;
- load exact 20-item seed;
- Lean Cards read-only;
- use existing PR #305 semantic kernel, no fork;
- quote bridge = PR #354 stable quote IDs only, no copied quote canon;
- **HUMAN FAIL correction:** the current Claude Design scene used cut-out character figures instead of the real 3D Resident models. Do not use those cutouts as character/scene donors.
- Pair/Scene/Bubble preview must use the actual Resident Atlas 3D actors/sets/rigs already proven in PR #310.
- **Eye presentation default:** after source isolation, hide/replace stock/source eyes and mount the existing EyeRig v6 owner on every shown Resident. Use persisted profiles where available; otherwise source-derived EyeRig + `PROFILE_TUNE`. No stock-eye fallback.
- Claude Design may contribute only bubble/VFX/layout/timing ideas that can be isolated independently from the cut-out figures; prove that bubble source in isolation before integrating it;
- Web Chat batch import/export must work without Work;
- GitHub remains authoritative curated persistence.

Do not create a second ChatterBox, memory owner, Quote Pool, Card registry, Bubble owner or ToolBox front door.

Publish GPT Site first. Do not invent its URL. Cloudflare mirror only if actually required.

Return: exact Site URL/project/version/deployment, PR/head, actual tests, screenshots, review-import roundtrip, quote-ID proof, pair/SILENCE proof, Bubble donor proof, unresolved items, one next gate. No merge / no Live promotion.
