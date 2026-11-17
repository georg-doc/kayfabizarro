# Combat VFX R3 · unified host contract

17.11.2026 · WSA Combat-VFX → WS0 · implementation candidate, no quality acceptance.

Owner: private `georg-doc/KFB-Stunt-Car-Race`, branch `game/combat-vfx-aa-r3-20261117`. Original-donor checkpoint: `842204913cf917571b1fd9e19c5454db0be1e43a`. Authoring checkpoint: `667bcea1181f536ea7c7e7fb81af09e4f065b1b2`. This document describes the local runtime candidate after those checkpoints; its exact content/build/test head belongs in the final Return. It does not certify a running revision.

## Retained owners

| Concern | Existing owner / contract |
|---|---|
| Native weapon input, release, physics, target choice, damage | `src/modules/combatPlayer.r2.js`, existing release/flight modules, `combatTargets.js` and orchard |
| Native renderer and frame | existing R3F Three0.186.1 WebGL renderer, `M1Loop.jsx`, `M1CLOCK`, `M1INTERP` |
| Native camera | existing M1 camera; lab cameras are additional diagnostic views |
| Sound | `src/audio/kfbAudio.js` and existing combat cue plans; one shared AudioContext |
| Light | existing ground-FX channel / rig; AA submits floor-flash data, no new point lights |
| Body death | target-owned HP/reaction/death recipe → accepted q748 Knete-Schmelze |
| Environment destruction / cascades | existing target, area-damage and choreography owners |
| New presentation | Quarks layer and separate Effekseer playback through the supplied renderer; no gameplay authority |

The opt-in native selector is `fx=r2,combatAA=r3` (query or comma hash). Off retains the previous presentation route. Selecting a presentation mode never substitutes a new weapon model, target, damage rule or sound source.

## One renderer, one visual clock, one audio graph

`createCombatAAPresentation({object3d,preDraw,afterDraw,clock,groundFlash,...})` receives existing host facilities. It loads the Quarks presentation asynchronously and registers one `preDraw` callback. Physics/update calls feed camera and authoritative state; they must not advance particles for every unrendered simulation substep. The callback advances Quarks and Effekseer once with the host frame delta. Pause, hidden-tab behavior, time scale and reset must follow the host, rather than introducing elapsed-time catch-up.

The host must call `attachEffekseer(existingRenderer)` and verify its resolved result and `status().impact.state`. The native fixture `src/combat-aa/boot.js` explicitly calls `C.fxParts().combatAA.attachEffekseer(M.renderer())`; root reports a GPU-ready original-proof state there. The ordinary M1 game remains an external attachment port unless its actual host makes the same connection. Fixture attachment does not certify automatic attachment in normal gameplay; merely importing the adapter or seeing an effect on the separate workbench is insufficient.

Effekseer must draw after the intended world scene with that world's compatible color target, depth attachment, viewport and interpolated camera still active, before inappropriate HUD/postprocessing target changes. `M1INTERP.afterDraw` provides an integration point, not proof that a particular HDR/HUD ordering preserves those conditions. Validate the actual M1 path, including `feuerDraw`, camera roll and postprocessing. Do not clear depth, disable depth testing globally, create another canvas/renderer, or run a second RAF to solve occlusion. The adapter resets Three's state cache after the external draw.

Effekseer uses the separately named soundless JS runtime derivative. Its original JS/WASM are preserved. The derivative blocks exactly the documented three OpenAL initialization bindings; the effect has no audio references. No global AudioContext replacement is allowed. All shot/contact/bounce/cascade sound remains with existing `kfbAudio` event plans. Workbench recording may capture that graph; numerical audio activity alone is not a listening acceptance.

## Original and derived modes

Modes are `aa`, `originals`, `quarks-original`, `hit-original`. Clear existing instances when changing mode. Do not label an adapted effect “original.”

| Mode/source | Allowed changes / fixed boundary |
|---|---|
| Original Quarks muzzle | exact locked recipe/texture, source scale1; host placement/orientation/lifecycle only |
| Original Effekseer `hit_eff` | exact compiled source effect, source scale1, seed7; no derived tint, scale or surface retune |
| AA Quarks | separately identified editable `src/vendor/combat-aa-r3/quarks/combatAA.js` and generated host module; retuned profiles are derivatives |
| Effekseer surface derivative | official editor export; Big Flash Sprite Billboard0→Fixed2 only; own name/receipt; source effects unchanged |
| Effekseer ballistic derivative | separately named pistol recipe with explicit parameter delta; never overwrite the surface or original effect |

`src/modules/combatOriginals.r3.js` is the lab orchestration adapter. `combatAAPresentation.r3.js` is the native presentation bridge; `combatAAEffekseer.r3.js` supplies native original/derived contact variants. These are host adapters, not additional runtime/gameplay owners. Package receipts distinguish unmodified source recipes from the soundless runtime derivative and host transforms.

The full14-file original Quarks roster in `SOURCE_LOCK.json` is closed and hash-verified at authoring checkpoint667bcea. The supplied `AA_SOURCE_DELTA.json` contains an earlier generated-file roster; use the runtime checkpoint's actual SHA manifest as the content authority. Regenerate and hash the final host bundle from the exact editable source; a stale bundle is not reproducibility evidence.

## Presentation API and authoritative feeds

```js
const p = createCombatAAPresentation(hostPorts)
await p.loading
await p.attachEffekseer(existingRenderer)

p.fire(origin, direction, {weapon, id, pose})
p.segment(id, actualSegmentStart, actualSegmentEnd, weapon)
p.hit(actualContact, surfaceNormal, material, {weapon, id})
p.projectile(id, actualPosition, actualDirection, {
  weapon, thrustPosition, thrustDirection,
  fusePosition, fuseDirection, fuseKind
})
p.endProjectile(id)
p.explosion(actualCenter, actualNormal, {weapon, id, material})
p.update(dt, {camera}) // feed camera/state; preDraw owns visual advancement
p.clear()
p.dispose()
```

Use `ready()`, `requested(weapon)`, `owns(weapon)`, `ownsProjectile(weapon,options)` and `ownsExplosion(weapon)` according to their actual return values. Quarks readiness does not imply Effekseer readiness. Failed/not-ready ports must expose status and preserve a deliberate existing fallback, rather than silently losing the primary contact. Ownership must suppress the matching old muzzle/tracer/primary contact layer exactly once; do not draw native reference and AA primaries together. Material/secondary choreography layers remain separate where intended.

Release origin and direction come from the actual selected model's world-space source anchor and release pose. The mutable `pose(outPosition,outDirection)` callback follows that anchor during the muzzle lifetime. Do not aim the visual tracer independently of the barrel. Tracer coverage ends at the nearest actual swept contact; never extend through a nearer wall or manufacture only the last portion of the flight. Presentation cannot create a hit, grant damage or emit a second shot sound.

Scattershot consumes the real `resolvePellets` result. The native owner or lab `volley.r3.js` chooses the nearest world/registered-target contact, groups pellets for one target reaction and calls `deliverHit` once per group with pellet receipts. Visual paths show the actual per-pellet endpoints. Do not turn a single synthetic center ray into an apparent volley, or deliver damage once per visual streak. The workbench volley additionally limits material contact sound selection; gameplay damage remains target-owned.

Rocket/grenade/bomb visuals consume actual native projectile snapshots. Position, direction, age, rest state, model scale/quaternion and source thrust/fuse points come from the existing flight owner. `projectiles.r3.js` is a workbench model presenter, not another ballistic integrator. Feed `projectile()` from those transforms; end IDs when physics removes/detonates them. A pin grenade has no invented burning fuse. Native `api.explosion()`/area-damage/cascade routing remains the sole authoritative detonation. AA can replace its primary presentation only when all required ports are ready; it cannot add another blast or restart the damage cascade.

Pool limits and dropped work are observable through `status()`. Clear on scene/reset/selection changes as appropriate; dispose removes callbacks, effect handles, model instances and owned resources. Do not dispose shared host renderer/audio/scene resources from the presentation adapter.

## Contact, material and body boundary

Adapted Effekseer contact places the surface-oriented source at `contact + normal*.025`, with local+Z rotated to the normalized outward normal. Big Flash Fixed2 uses the same tangent plane as the already-fixed source nodes. Keep real depth occlusion; do not replace this with a large floating offset. Ballistic pistol/rifle/spreadshot/gatling use the separate compact ballistic variant; blaster remains violet and uses the surface variant. Current scale/color are host adaptations and must stay explicitly recorded, not described as original source behavior.

Quarks supplies the selected material fragments, dust/smoke and surface aftermath. Stone, wood and metal need separately observable material responses. Body materials (`plastic`, `clay`, `flesh`) suppress the generic hard-surface Effekseer star and surface scorch. A material tint alone does not prove a material-specific impact.

`combatTargets.deliverHit` → registered source HP/reaction/death remains authoritative. On the genuine stage soldier, three actual shot contacts (blast counts2) initiate its existing death clip; numeric `damage` does not override this stage helper. `soldatEnde` starts q748 melt at the `liegt` marker using the real skinned holder, with the same color/ground/camera and shared `schmelzVorrat`. Ordinary nonlethal contacts retain their hit reaction. Creatures route their own death recipe's `onSchmelzen` into that pool. Do not start a parallel Goo/sprite/death implementation in VFX.

The accepted branch already contains the q748 melt. Current integration's q750 cube phase is not accepted: keep `schmelzwuerfel` off. Required flags are `endekaskade=r1,schmelz=r1` before import. A plain primitive mesh cannot stand in for the sampler's visible real `SkinnedMesh`. See `CANONICAL_MELT_INTEGRATION.md` for exact owner APIs and pinned comparison.

## Source models / release anchors

`src/combat-stage/weaponSources.r3.js` and `WEAPON_SOURCE_LOCK.json` are the model/anchor/hash roster. Private models remain private. Source isolation shows the actual model before its integration; a loaded URL alone does not prove donor design fidelity.

| Source family | Models / contract |
|---|---|
| Native K10 handheld | Pistol, Rifle, ActionFigure spreadshot, CombatMech minigun/Gatling, Sniper/railgun; original weapon cards, hand slot/mount and `KFB_Muzzle` |
| WSB Roboarm R2b | ElbowBoot, blaster, flamethrower, gatling, laser, pistol, railgun, rifle, rocket, spreadshot; source branch `assets/wsb-roboarm-r2b`@`e8f3667435198a259c2d2259e796ba00f561b145` |
| R2b carrier | existing heroic arm source and `KFB_Roboarm_Socket`, original materials, mount roll−132°; preserve the complete source design |
| R2b ports | `KFB_Muzzle`; flamethrower also `KFB_Pilot`; Gatling individual `KFB_Muzzle_0..3` ports where present |
| Rocket projectile | existing KFB Rocket r1e, original+Y axis, `KFB_Thrust_C`, native presentation scale/shape |
| Physical thrown props | private N32 HUD Grenade/Bomb, measured centers and `KFB_Fuse` on bomb; existing native throw carrier/card/clip remains distinct |
| Legacy smoke-bomb carrier | CC0 K10 smoke-bomb source, `KFB_Release` and measured fuse point; do not relabel it as the physical hand grenade |

The default basic roster is pistol, rifle, spreadshot, gatling, railgun, violet blaster, rocket, grenade and clownbomb. Model availability is not acceptance of model design, grip, firing direction, heat/spin animation or complete VFX. Source cards can retain HOLD/unfinished gates; expose them explicitly. Fire/laser source models do not imply those secondary effects are completed by this slice.

**Uzi is unavailable:** no verified Uzi-specific model/card in the inspected native/R2b roster. `UZI_SOURCE_R3.available=false`, with no fallback. Do not relabel rifle/pistol as Uzi or claim all basic weapons complete while that gate remains open.

## Required proof and status

The Combat island is a development workbench in the existing private World-Studio Site. Diagnostic views include source model, native-like game distance, muzzle, trajectory/contact, side/top and day/night. The lab game-distance camera is not a substitute for the actual M1 game-camera acceptance.

Final Return must pin exact game branch/head, editable source and bundle hashes, effect/model/sound roster, actual test commands/results, GPU evidence/camera/light/material, audio-context/listening evidence, performance scope, critic report and unresolved gates. C4's below8/10 result remains unaccepted; later candidate changes do not retroactively improve it. No self-score, aggregate-average workaround or Site deployment claim replaces each relevant category's minimum8/10 and actual native proof. No automatic merge/Live promotion.

Current owning Return to reconcile is `docs/pistol-gunshot-r1/RETURN.md`; `docs/combat-stage-r2/RETURN.md` repeats the prior product report. A new `docs/combat-aa-r3/RETURN.md` can carry the R3 exact receipt, with explicit supersession/link from the owning Return; do not leave conflicting current routes.

Next gate: root completes one frozen coherent runtime candidate, verifies it in the real game camera with original-versus-derived distinction and existing sound/targets, then obtains independent assessment. This contract alone is not a test, publish action or acceptance.

## Reproducible workbench pages

Tracked `src/combat-stage/index.html`/`combat.css` preserve the full experimental nine-weapon controls; `src/combat-originals/index.html` preserves the published original-only comparison. `build-combat-site.mjs` copies the selected entry's page and shared style before bundling. `KFB_COMBAT_ENTRY=src/combat-originals/boot.js` creates the lean original entry; default remains experimental Combat-stage entry. Start from the existing private Site checkout so retained World/Feuer routes and the source-pinned native proof film remain present. No static generated public donors, node_modules or private symlink are the canonical source.
