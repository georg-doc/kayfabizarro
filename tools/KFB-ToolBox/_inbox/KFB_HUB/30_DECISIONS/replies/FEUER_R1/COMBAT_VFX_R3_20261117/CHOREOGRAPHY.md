# Combat VFX R3 · causal model and acceptance

Owner: WSA Combat-VFX → WS0. Experimental opt-in only. This document describes the implemented seams and the quality target separately; it is not an artistic pass.

A shot is one causal transaction: the source animation reaches its release marker, the actual source socket releases the shot, the native flight/sweep returns the material contact, and the existing target owns damage/reaction/death. Presentation consumes those receipts. A brighter picture must never create a second hit, hidden projectile, death recipe, audio context, renderer or independent animation clock.

## Perceptual hierarchy

1. **Cause**: a compact directional muzzle attack, short recoil, casing and source SFX, all at the release marker. No detached glowing ball and no circular smoke puff as the attack silhouette.
2. **Transfer**: a tapered directional exposure aligned to the actual release-to-contact path. Brightness travels toward the target; it must remain legible at game distance in daylight. It is presentation exposure, not a substitute collision ray.
3. **Consequence**: a short hot contact impulse, outward material fragments and a material-coloured powder/spark response. The impulse precedes the slower tail. Metal sparks, wood splinters, stone fragments and body reaction are distinct.
4. **Residue**: the surface keeps a bounded contact mark while light, debris and dust decay. A body keeps no stationary world decal or independent Goo; native q748 owns its melt/death chain.

The Bolter reference is judged by its directed release, long readable transfer and strong multi-form contact, not by copying its assets. The reference has no admitted asset licence. Original Quarks and Effekseer examples remain independently selectable at source scale1, unchanged, so source provenance cannot be inferred merely from a loaded texture.

## Weapon grammar

| Type | Release and transfer | Contact / existing cascade | Source status |
|---|---|---|---|
| Pistol | one native marker; short golden exposure | material impulse → fragments → dust/mark, or native body reaction/melt | verified handheld/model/card |
| Rifle | actual source aim; repeated release receipts, no synthetic extra shots | bounded repeated contacts and tails | verified handheld/model/card |
| Shotgun | one release; six actual native pellet rays and grouped damage | one main impulse per target plus subordinate pellet contacts | verified action-figure shotgun; no invented centre projectile on Stage |
| Gatling | source barrel axis; spin-up/held release/spin-down; heat from actual new shots | repeated contacts with bounded pool pressure | verified native minigun; source actor yaw preserved |
| Blaster | original purple R2b muzzle, purple transfer | derived energy contact on surfaces; body handoff to native melt | verified existing R2b; no replacement model |
| Railgun | narrow fast exposure from actual native muzzle | stronger compact contact; native damage stays unchanged | verified native sniper/railgun carrier |
| Rocket | original physical rocket; exact source thrust socket, sampled exhaust | primary explosion presentation consumes native explosion receipt; native blast/cascade unchanged | verified R2b launcher and rocket model |
| Hand grenade | existing Throw release and physical grenade; internal fuse | native fuse/bounce/blast chain; no burning wick on pin grenade | verified physical prop + existing throw carrier |
| Clown bomb | existing Throw release; actual KFB_Fuse source | native fuse/blast/clown cascade, bounded presentation | verified physical prop + existing throw carrier |
| Uzi / SMG | profile data exists only | no model substitution or relabelled pistol | unavailable verified model/card; explicit source gate |

The Stage is a workbench. It uses the existing event core and source carriers, but its provisional ammo/rates are not balance approval. Acceptance is the native Combat stage in the actual M1 camera. Side, muzzle, contact and top cameras diagnose seams; they cannot replace the game-camera gate. Day/night are both required.

## Time and ownership

The host preDraw clock advances visual systems once per actual draw. Physics updates only feed state. Derived one-shot particles expose their birth at age0 before aging; older particles continue with real elapsed time. Quarks map rebatching may revisit a system, so a derived-instance epoch guard prevents double advancement. Original recipes/runtime classes are untouched. Derived Effekseer births use its documented per-handle update API; global update(0) is not a pause in the admitted runtime.

Audio comes from `kfbAudio.js` and existing WS0 banks. A recording contains the existing mixer capture stream. Signal presence and one-context telemetry do not constitute an auditory quality score.

## Bounded review rule

Every relevant locked rubric category must score at least8 independently; no averaging. An unobserved category is NP and cannot pass. CPU tests, source hashes, shader compilation and successful deployment do not establish visual quality. After two non-improving repairs on the same seam, change strategy or preserve the failing seam and report the remaining authoring gate. Do not publish a failed candidate as accepted AA/AAA or merge/promote it to Live.
