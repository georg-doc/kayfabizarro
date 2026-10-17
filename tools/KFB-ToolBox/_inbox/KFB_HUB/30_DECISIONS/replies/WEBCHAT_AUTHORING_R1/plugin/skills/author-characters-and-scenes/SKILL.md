---
name: author-characters-and-scenes
description: Develop or revise KFB character sheets, scenelets and diorama concepts with Georg in normal web chat, using current GitHub sources and explicit GitHub change proposals. Use for new characters, character updates, relationships, scene beats or diorama composition; not for songs alone or model generation.
---

# Figures and scenes in the existing KFB Triplets plugin

This is an additional authoring skill of **KFB Triplets**, not a new tool, Site, database or runtime. Work in ordinary web chat using the connected GitHub tools. No Work, terminal, local executor or code-generation requirement for routine content edits. GitHub access still must actually exist; a skill does not grant it. If unavailable, retain the draft in chat and clearly say UNSAVED. Do not send Georg to copy files or create a new Work job as the normal path.

## Route the request
- Character, scenelet, diorama, relationship or background story: this skill.
- Spoken card takes: sibling compose-card-performance, unchanged source vocabulary rules.
- Song / Writer's Room / songLines: sibling writers-room-song and its own contract.
- Mixed request: first a versioned character/scene proposal, then pass its source refs and status as context to the existing performance skill. A fictional sheet cannot override printed card text.
- Appearance controls/body/eyes/brows/mouth: link the same character ID to the existing ToolBox-Studio; no guessed tuning values, raw GLBs or new renderer.
- A scenelet is a small authored situation (who wants what, friction, beats, outcomes). A diorama is its spatial composition (why actors/props belong together). This skill authors descriptions and verified references, not new 3D assets or executable game logic.

## Read only the relevant current truth
Repo georg-doc/kayfabizarro. Register branch docs/kfb-decisions-register-2026-10-11.
Root tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/replies/.
Read current GitHub START_HERE.md, CHAT_GITHUB_KFB_STAGE_WORKFLOW.md, FRESH_CHAT_SLICE_PROTOCOL.md; this feature's WEBCHAT_AUTHORING_R1/CONTRACT.md and current WSA_WEBCHAT_AUTHORING_R1_RETURN.md when present; FIGURES_R1/CHARACTER_SCHEMA_R1.md, FIGURE_SCHEMA_R1.md, CHARACTER_SOURCES.md; KNOWN_FAILURES Tier 0 plus [Figure]/[Georg-facing].
Fetch the register head, exact relevant character and figure cards, and linked evidence. Resolve aliases/mishearings from actual identity fields, not guessed IDs. Show Georg confirmed facts, proposals, gaps and conflicting sources in plain German. Do not dump internal routing IDs into the normal conversation.
The newest Georg instruction requires proposal branches. It supersedes V-416's interim direct-register-write rule for this workflow. Never write the register/main merely because an older brief permits it.

## Collaborate before persisting
Start with the requested change and at most a few useful questions; continue source research independently. Preserve {v,src,status} per character leaf: SOURCE for verified source, DESIGN for your idea, PREFILL for heuristic fill, todo/null for missing facts. GEORG only for values Georg explicitly supplied or explicitly adopted. "Save this proposal" alone does not approve every suggestion as canon. Do not turn agent ideas into GEORG or mark the figure approved.
Keep conflicts[] and previous sourced alternatives visible. On a displaced value append its exact path, old value/src/status, reason and new proposal reference to conflicts[]; never silently erase evidence.
New characters require an explicit user request. Begin from the current character schema, not a renamed copy of another character's biography. With no delivered figure card, appearance.figureRef stays {v:null,src:...,status:"todo"} with a visible todo; do not fabricate a card/body/rig. Never create the four missing legacy sheets on your own initiative.
Memory fields describe authored relationship templates only, never personal player saves, live encounters or private memories. Appearance refs, existing source pins and runtime ownership remain intact.

## Scenelet and diorama authoring
Read references/scenes.md. Reuse verified existing scenes/assets by pinned references; do not treat a discovered asset URL as visual proof. Explain the causal scene: character wants, relationship, contradiction, affordances, 3–7 beats, possible outcomes, and what the player may do. Spatial composition includes a focal action, actor/prop relations and open production needs. No generic decoration substituted for a source object.
Use the editorial kfb.authoring-scene/1 contract only. It is a concept document, NOT a kfb.world/1, resident-set, performance or executable scene. Existing accepted runtime documents remain owned by their existing modules. Unknown asset/clip/light refs are null/todo, not invented identifiers.
Tier 0: figures through their figure cards with KFB EyeRig and clay; light only through the stage-light module. No rim/back light, sheen <=0.05. Do not render a known incomplete card or bypass the currently locked Personae 3D. Visual generation/Blender/paid calls require their own scoped production workflow; normal text updates do not.

## Save a reviewable proposal
User can say "als Änderungsvorschlag speichern"; then perform the GitHub work yourself, not an export-only response.
Read references/github-proposals.md for the exact atomic workflow and collision/timeout rules. Allowed targets:
- existing/new FIGURES_R1/characters/<id>.character.json for explicit character work;
- WEBCHAT_AUTHORING_R1/scenelets/<id>.scenelet.json;
- WEBCHAT_AUTHORING_R1/dioramas/<id>.diorama.json;
- WEBCHAT_AUTHORING_R1/proposals/<proposalId>.proposal.json receipt.
Never write figure-card tuning, source assets, runtime scripts, main, register or merge via this skill.
A proposal keeps the complete changed document on its own branch plus the receipt with baseCommit/baseBlobs, author intent, before/after changes and unresolved conflicts. Validate syntax, leaf statuses, IDs, exact paths, references and protected fields with the equivalent checklist; shipped checker is optional developer QA, never a required local execution step for webchat.
After real write and exact branch/file readback, provide a short German summary, GitHub diff/branch link and the Asset Library proposal-preview link. State whether existing/absent figure cards prevent 3D. Never claim the regular Site changed just because a proposal was saved.
Review/merge stays WS0. No automatic merge. Once WS0 takes it into the register, ordinary GitHub refresh shows the accepted content without a Site code deployment. New unsupported visuals/runtime behavior remain a separate production task.

## Finish
Return what changed, what is still a proposal, where it is saved, and what WS0 decides next. If a write times out: UNKNOWN, inspect the deterministic branch and receipt, then reconcile; never repeat blindly. Preserve current Site and plugin identities.

