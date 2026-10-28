# Cascade Sphere: Bell Defense KISS (WS0 R1, 2026-10-28)
**Research/design candidate, not approved R3 scope or gameplay.** Existing WS0 Game Feel PR #435; current binding R3 brief V-962/V-968 on docs/kfb-decisions-register-2026-10-11. Private Cascade POC branch is separately planned in georg-doc/KFB-Stunt-Car-Race, never altered here. Preserve R3 2–4 minute first run, 24 test cases, two-pass budget, host contract R3F v1.2 and one cascade-core state owner.

## One landmark, one scalar, one AOE
One Köln-inspired bell tower at an OSM-validated sink node: spatial landmark, enemy target, signal and defensive pulse. Exactly one authoritative integer `bell.integrity` (0–100) in existing cascade-core. Valid enemy Black Goo/Fluff contact lowers it, a valid friendly Fluff supply/repair event restores it. Uniquely dedupe contacts and arrival receipts. Avoid inferring real-world bronze fractures from cartoon packets: damage is fictional Goo contamination of bell/striker.

Draft balance: contact -10; valid repair +15; pulse every four simulation seconds. Derived power for health fraction h: if h=0 then 0 else 0.25+0.75*h. Derived relative radius: if h=0 then 0 else 0.70+0.30*h. **Sound strength is feedback only**: when weak, lower gain/brightness/tail while retaining distinctive source pitch. Bell audio must NOT own game ticks, hit detection or graph routing. No new audio bus/AudioContext/clock.

One pulsing 3D/GPU world-space wave with six display sectors for the established D6 Story Modes; actual six color assignments remain WS0-owned and OPEN. This is one AOE hit rule, not six new physics or damage classes. Enemy logical packets get one effect per valid pulse; an InstancedMesh boid crowd is presentation, not 100 separate game stores. Visual feedback and repair options must work muted and in reduced motion. A supply route plus a player action prevent integrity-loss softlock.

## A 120–180 second optional encounter
1. Recognize the bell and two routes (safe supply lane and hostile direct lane).
2. A Black Goo boid reaches the hitbox, integrity drops; toll becomes muffled and AOE radius contracts.
3. FrizzleBob can protect with existing Fluff Gatling, or activate an existing switch to route friendly Fluff toward the tower and repair it.
4. Second wave: preserve integrity above zero and deliver the planned supply to win; loss/restart deterministic. All transitions occur in cascade-core; skin/audio are read-only subscribers.

## Sources / KISS guards
Cologne Cathedral official Petersglocke or "Dicker Pitter": strike note c0, 24t, diameter 3.22m, https://www.koelner-dom.de/erleben/petersglocke . The musical pitch is a research reference, NOT a license for sound recording or 3D mesh. Existing Bell PR #458 R7 still needs real CC0/PD recording bytes and true 3D donor isolation. No pseudo-3D SVG visual or object anthropomorphism. Existing audio cue first; new ElevenLabs only after Georg GO.

Optional game object is host ModuleHost v1.2 compliant: create/update/dispose, one R3F renderer, host events and one cascade-core. Game pulse radius is NOT spatial sound propagation. One existing named POI/hitbox, not a new World/Portal owner. Use current OSM/Platformer source and original R3 player. Do not modify the R3 brief, private POC or current MVP.

**One next existing review seam:** WS0 decides within its scheduled source/design review whether this is a **replacement for one defended sink objective** or a **post-golden optional level variant**, without adding mandatory R3 scope.
