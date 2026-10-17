# KFB known failures · tiered (V-393, as amended 17.10.)

Principle: **guard in code before guarding in text.** The best rule is one that a module or figure card enforces by itself. Briefs therefore include only **tier 0 plus the one matching block**. Never the whole list.

## Tier 0 · always, in every brief (three lines)
1. Figures only ever come from their **figure card**: KFB eye rig + clay. The card says what may be removed (V-391).
2. Light and shadow only ever come from the **stage light module**. Never build them yourself (V-392).
3. Known failure seen again → **stop and report to WS0**. One local attempt at most.

## Tier 1 · one block per job type (WS0 copies only the matching block into the brief)
**[Figure]**: Remove only the original eyes; mouth, teeth and brows stay. Figure sheen ≤ 0.05. Never use a raw KayKit/Meshy GLB as an actor.
**[Stage/light]**: No rim light, no back light, no private light tricks (unlit card, own tone curve, self-lit face). Bias is never a fixed number. Parts sitting in each other get contact AO.
**[Motion/tests]**: Run walk and drive tests at ≥ 50 fps **and** throttled to 30 fps. Landing comes from ground contact, not from the animation.
**[Audio/generation]**: Credit budget before every generation, 1 variant first. API keys never in a repo, log or chat.
**[Georg-facing]**: Clean images with no overlays. Use only the names of the five places, no internal tool names.

## Tier 2 · reference (do not put it in briefs; WS0 looks things up here)
| # | Failure | Since | Block |
|---|---|---|---|
| F1 | Figure without KFB eye rig | V-200/201/214, mummies 17.10. | Tier 0 |
| F2 | Wrong part removed (Orc teeth/mouth) | — | Figure |
| F3 | Proof without clay | V-346 | Tier 0 |
| F4 | Bright seam/halo (rim, back light, sheen) | V-382, WSB 17.10. | Stage/light |
| F5 | Light gap under feet/props (fixed bias) | WSB 17.10. | Stage/light |
| F6 | Each stage builds its own light | — | Tier 0 |
| F7 | Private light tricks per layer | V-385 | Stage/light |
| F8 | Raw KayKit GLB as actor | V-219 | Figure |
| F9 | Overlays covering the subject | V-383 | Georg-facing |
| F10 | Tests below 50 fps counted as PASS | V-138 | Motion/tests |
| F11 | Credits with no cap | V-388 | Audio/generation |
| F12 | Internal tool names shown to Georg | V-390 | Georg-facing |
