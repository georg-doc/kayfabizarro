# WORK MIN · KFB ChatterBox v1

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
6. `skills/chat/workflows/KFB_CHATTERBOX_TRIPLET_CURATOR_2026-10-04/CHATTERBOX_LLM_DIALOG_LAB_EXTENSION_V1.md`

Mission: build **one private GPT Site** in the existing ToolBox slot `chatterbox-comic-vfx`: **KFB ChatterBox**. Triplet Curator is one module inside it.

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
- two-Resident live Dialogue Lab is required: deterministic baseline + L0 shared-agent + L1 same-model isolated Resident agents; L2 different-model Residents is optional until evidence justifies it;
- player can reply with a free Triplet or KayfaBINGO / KayfaBONGO / KayfaBOGGLE / BLÖDSINN;
- second LLM critic is non-speaking and must return voice-distinctness/repetition/Triplet/formatting findings plus non-destructive repair proposals;
- log sessions so strong generated Triplets/clusters can be promoted and bad semantic patterns can become durable negative tests/guardrails;
- reaction preview must bind existing What the FLUFF?! / Stay fluffy! / four-call reactions to existing body/Face/EyeRig/gaze/VFX-SFX owners;
- Stage must use real Resident Atlas 3D actors, free orbit + responsive viewport checks and bubble occlusion/safe-area tests;
- browser TTS is sufficient for first pass; reuse current Audio owner and mixer-owned ducking, no second AudioContext;
- GitHub remains authoritative curated persistence.

Do not create a second ChatterBox, memory owner, Quote Pool, Card registry, Bubble owner or ToolBox front door.

Publish exactly one GPT Site. Do not invent its URL. Do not reserve or publish a Cloudflare/pages.dev route for ChatterBox.

Return: exact Site URL/project/version/deployment, PR/head, actual tests, screenshots, review-import roundtrip, quote-ID proof, pair/SILENCE proof, L0-vs-L1 8–12-turn comparison, critic report, player-call intervention proof, TTS/ducking proof, real-3D Bubble/orbit proof, Bubble donor proof, unresolved items, one next gate. No merge / no Live promotion.
