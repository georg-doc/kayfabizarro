# KFB KayKit Cartoon Performance Workshop R1
2026-10-20 | DESIGN PLAN ONLY | owner: existing KFB Animation/Motion skill, receiving implementation owner: existing Combat Arena | no Stage yet

## Goal
Improve existing KayKit Character Animations 1.1 Medium and Large for cartoon combat, interactive actions and cinematics. User estimates 139 Medium and ~100 Large motions; audit exact inventory before claiming counts.

## Current sources
- skills/kfb-cartoon-animation_v2.md redirects to skills/kfb-cartoon-animation/SKILL.md (canonical).
- skills/kfb-cartoon-animation/references/kfb-integration-current-ssot.md: Motion PR #344 native Medium baseline KEEP 21/HOLD 3/REJECT 0. Walk Walking_B; Run Running_A; Sprint Running_B; Jog speed/phase blend. Preserve these choices.
- tools/asset_registry/librarian/animation-sources.js: reuse existing asset search and KayKit local/shared/structural clip discovery. Structural matches alone do not guarantee compatibility.
- skills/chat/tool-nodes/animation-lab.md is UNVERIFIED; pin current implementation first.
- KFB Combat Arena owns Combat/gameplay and controller; animations do not supersede world movement, physics, collision or damage. WB2 PR #348 R4 STOP remains unaffected.

## Design contract
Semantic intent and authoritative motion facts select native animation; optional cartoon anticipation, impact, follow-through, recovery, additive acting, contact IK and blending enhance presentation. Do not build another state machine or asset catalog. Recovery must define interrupts, return pose and cleanup. Game timing prioritizes responsiveness; cinematic timing permits longer acting and holds.

## First bounded pilot
1. Read up-to-date Motion PR #344 and Combat Arena SSOT/Return and confirm source/branch/owner.
2. Locate one genuine KayKit Medium attack through KFB asset search; show original source actor and clip in isolation with provenance, rig and track bindings.
3. Create original / restrained cartoon / expressive cartoon A-B-C comparison.
4. Test anticipation, strike/contact, follow-through, interruption and recovery in the existing Combat Arena runtime only if the current owner authorizes that receiving slice.
5. Record visible clips, controller and event evidence and independent read-only artistic critique; make an explicit human decision only on a real visual difference.

Illustrative heavy-attack study only (NOT source timing): anticipation 0.14 s, strike 0.09 s, impact 0.05 s, follow-through 0.17 s, recovery 0.25 s. Calibrate to verified source and game needs.

Priority: P0 combat attacks/hit reaction/jump and landing; P1 pickups/interactions and movement starts/stops/pivots; P2 acting/emotes/cinematics. Missing clips marked HOLD, never fabricated.

## Execution split
Web chat can audit actual GitHub and Dropbox sources, rank verified candidates, prepare contact metadata, write timing/acting plans and test contracts, and persist additive reviews inexpensively.
Work/code instance needed for Blender editing, rig inspection and retarget/bake/export, interactive 3D playback and browser/game implementation tests. Do not move mere planning into Work.

Implementation requires one existing product writer, an independent tester/critic and production guard. After writes, check exact branch head and files; timeout is UNKNOWN. Formal human test links must be direct pages.dev routes linked from KFB Hub and visibly verified. No auto merge, main write or Live promotion.

## Planning Return
Repo georg-doc/kayfabizarro. Plan branch planning/kfb-kaykit-cartoon-performance-r1-2026-10-20 based on main c746a9567e0ea20a24b8969fe9130ac0756e7a7e. No PR.
Original clips visually inspected: 0. Rig bindings tested: 0. Blender/game/browser tests: 0. Independent reviews: 0. Public screenshots: 0. No runtime or Hub changes.
Open: exact inventory, current Animation Lab owner, current Combat receiving return, verified Medium attack donor.
ONE NEXT GATE: verify one original Medium attack clip in isolation and pin exact Combat receiving source/owner before authoring A-B-C cartoon variants.
