# KFB Animation · aktueller Arbeitsstand

Status date: 2026-10-03
This file is the plain-language KFB routing reference for the portable animation skill. Current GitHub project state still wins.

## Was ist der Stand?

The general animation method is available at `skills/kfb-cartoon-animation/SKILL.md`.

The last playable browser motion test failed Georg's human review. Although automated checks could load clips and move the actor, the result had wrong step length, visible wobble/jitter, poor arm clearance, dirty gait changes and an unconvincing jump.

That browser candidate is frozen as **failed evidence**. It is not the KFB locomotion baseline, not a playable MVP and must not be integrated into World, Travel, Combat or Residents.

There is currently **no human-accepted ActionFigure locomotion runtime**.

## Was bedeutet „Blender Baseline“?

It is a simple quality comparison before game integration:

- the real KayKit ActionFigure;
- the original KayKit Character Animations 1.1 clips;
- normal playback speed;
- a plain grid and consistent cameras;
- no game controller, no world, no Mixamo and no visual effects.

Blender shows whether the source animations themselves look clean on the actual character: feet, step length, arms, loop seam and jump poses. It does **not** build the game movement yet.

## Wer macht jetzt was?

**Next executor:** Coworker / Blender MCP.

**Task:** create the isolated native KayKit comparison package and classify each original clip as:

- keep;
- hold for repair;
- reject.

The output is a review scene/contact sheet plus a short table. No runtime integration is allowed in this pass.

## Was muss Georg tun?

Paste this one message into the Coworker / Blender MCP chat:

> Bitte führe den GitHub-Auftrag „KAYKIT-NATIVE-LOCOMOTION-BASELINE-01“ vollständig aus. Nutze die echte ActionFigure und ausschließlich die originalen KayKit Character Animations 1.1 bei normalem Tempo. Gib mir Bilder und eine leicht verständliche KEEP/HOLD/REJECT-Tabelle zurück. Kein Mixamo, kein Browser-Controller und keine Weltintegration.

Georg does not need to supply clip names, paths, measurements or repository identifiers.

## Was passiert danach?

1. Georg judges the native KayKit clips visually.
2. Blender cleans only the accepted family and prepares starts, stops, gait changes and jump sequencing.
3. Codex/WSA integrates that accepted family into one simple playable world test.
4. Only after walking/running works cleanly do Drive and Combat join the test.

## Binding source priority

For ActionFigure / Rig_Medium:

1. original KayKit Character Animations 1.1;
2. accepted native KayKit variants;
3. Mixamo / KFB Motion Library only for a proven missing role.

Mixamo may not overwrite an available and accepted native KayKit role.

Consumers must not create their own gait tables or animation state machines.

## Technischer Nachweis — nur für die ausführenden Chats

- Current prepared workflow: `skills/chat/workflows/KAYKIT_NATIVE_LOCOMOTION_BASELINE_01_2026-10-03/`
- Current prepared draft: PR `#344`, branch `coworker/kaykit-native-locomotion-baseline-01-2026-10-03`
- Read first: `START_HERE.md`, then `BRIEF_BLENDER_KAYKIT_NATIVE_BASELINE_01.md`
- Failed archived browser lineage: PR `#333`; mixed Ladder lineage: PR `#336`
- Canonical native mapping donor: `tools/KFB-ToolBox/kfb-lib/locomotion-profiles.v1.js`
- Later runtime consumer: current procedural World candidate, only after native motion acceptance
