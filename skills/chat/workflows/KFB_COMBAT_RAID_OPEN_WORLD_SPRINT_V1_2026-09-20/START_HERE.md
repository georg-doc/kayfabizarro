# KFB Combat Arena · Raid + Open-World Combat sprint

Status: PLANNING / staged integration
Date: 2026-09-20
Owner: Combat Arena runtime lead
Current planning source: https://github.com/georg-doc/KFB-Combat-Arena/pull/6
Public arena surface: https://kayfabizarro.pages.dev/kfb-hub/stage/combat/

## Goal

Turn the existing Combat Arena into a controlled actor and combat proving ground, then connect it to World/Travel through a portal/entry seam. The arena remains the combat owner. Open World owns only discovery, entry and return — never a second weapon, enemy or health runtime.

## Current truth

Combat PR #6 is an open planning package, not a gameplay/runtime change. It preserves the current runtime and prepares:
- FrizzleBob Driver Graft as default candidate;
- GothGirl and Legacy FrizzleBob as initial alternatives;
- KayKit Medium adapters and existing three-enemy lifecycle;
- a separate ranged-weapon/muzzle calibration gate.

The EyeRig ToolBox has accepted Large profiles for Monstrosity, Black Knight, Demon Lord and Orc Brute, while Medium and Legacy require their own profiles and acceptance. A profile is not a promise of combat readiness.

## Sprint sequence

### Sprint 0 — reconcile sources (one short task)

Confirm current Arena head, PR #6 head, current EyeRig batch data and direct Stage routes. Record the one runtime owner for player, weapon, enemy lifecycle, animation mixer and audio. No code change.

### Sprint 1 — actor profiles and eyes

- Make Driver Graft, GothGirl and Legacy selectable before a run.
- Admit each KayKit Medium/Large/Legacy actor only after source, ground contact, EyeRig, clip, cleanup and attachment checks.
- Use the existing EyeRig batch tool for legacy intake. Do not bake eyes into source GLBs or invent parallel face rigs.
- Unproven actors stay locked with a reason.

### Sprint 2 — ranged combat proof

For Driver Graft and GothGirl separately prove grip, aim, muzzle world position, release frame, recoil, return-to-locomotion and audio/VFX ownership. The existing frozen pitch/transform gate must be resolved with measured external-transform evidence, not trial-and-error rotation patches.

### Sprint 3 — KayKit enemy adapter proof

Keep the present three-enemy lifecycle. Add two real KayKit enemy adapters one at a time. Prove actor spawn/despawn, hit response, EyeRig lifecycle, animation, target switching and cleanup. No silent fallback enemy.

### Sprint 4 — melee and RPG fittings

Only after ranged combat is accepted: choose one measured melee weapon seam, then add hit timing, reach, recovery, feedback and one attachment contract. RPG weapon variation is data-driven after the first real fitting, not a catalogue mock-up.

### Sprint 5 — raid + open-world portal

World/Travel places a visible portal/door/prop and sends a small entry record: actor id, safe return location and optional challenge seed. Arena loads the run and returns a result record. No shared scene graph, duplicate controls or cross-runtime physics. The first “raid” is an Arena encounter reached through this portal; Dungeon coupling follows later.

## Web/Claude split

Web/Claude tasks may inventory exact actors, make static selection/scene studies and produce source-preserving exports. The WSA/Combat lead alone changes actor lifecycle, player controls, weapons, muzzle pose, damage and enemy lifecycle.

## Definition of playable

A player can choose an approved actor, enter an Arena run, see correct eyes/attachments/animation, complete one ranged encounter against approved enemies, exit through the return seam, and revisit with no duplicate mixers/audio/actors.

## Gates

- Direct Cloudflare Stage proof for each independently testable slice.
- Technical checks, browser evidence and Georg’s freeplay/visual acceptance remain separate.
- No merge or Live promotion is automatic.
- After two repair passes on a visual or source gate: preserve/export, do not pile on a third patch.
