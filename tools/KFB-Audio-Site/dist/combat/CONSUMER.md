# Combat / destruction R1 · consumer packet

Inject the existing AudioContext and WORLD_SFX. No World code is changed:

```js
const audio = await createCombat({audioContext: graph.ctx,
  destination: graph.buses.WORLD_SFX, assetBaseUrl: protectedAssets});
await audio.start();
audio.emit({type:'explosionSmall', id:'world-impact-123',
  position:{x:3,y:0,z:-6}, material:'wood', intensity:.7});
// Existing host update only:
audio.setMix(mixActivity); audio.tick();
audio.stop();
```

Existing Combat cues remain authoritative: KFB-Combat-Arena@f6a59ad15b9ffcf3164b0ab013f223962b63f61f modules/kfb-combat-cues.js.
Future tiny adapter mapping (NOT installed):

| Actual owner cue / transition | Audio outcome / gate |
| --- | --- |
| launch.{weapon} | blaster / rocketLaunch, once per accepted launch |
| impact.{energy}.{surface} | physical impact with true material; use explosion only for explosive energy |
| confirm.hit | hitConfirm near listener, only actual confirmed hit |
| aftermath.boom | explosionSmall/Large + supported material debris |
| hop.{surface} | existing footsteps landing owner; not a combat confirmation |
| travel.rocket / travel.ink | dedicated continuous source missing; no launch replay per trail puff |
| POC hooks.muzzle | blaster once per fired round, bounded source budget |
| POC hooks.rocket(hit) | explosion + actual material; null hit is expiry, not ground confirmation |
| damageCell 0→1 | partial damage; full destruction sounds NOT a generic fallback |
| detach state→2 | woodBreak / stoneBreak from actual material, dedupe cascade clusters |
| support cascade / ground bounce / toRubble | independent contact / settling sources missing; do not replay whole collapse per fragment |
| single domino contact | missing; C18 is whole chain, never per-contact fallback |

Original POC pin c746a9567e0ea20a24b8969fe9130ac0756e7a7e under tools/KFB-ToolBox/_inbox/KFB Seed World Mech Destruction POC 01/.
No new cue clock; host ticks only. Cue IDs deduped, 70 ms per-type debounce, 24 voice ceiling.
Pitch ±4%, gain ±2 dB, no immediately repeated variant per layer. Distance attenuation and low-pass; short room reflection, no synthetic arcade oscillator.
Standard composition uses actual composite bodies plus separate whoosh/material donors. Experimental attack/body/tail uses independently selected energy-derived excerpts of those same recordings, NOT independent recorded layers; explicit opt-in and ear gate.
C07 finite fuse only; no unverified looping. C18 whole chain only.
Music/dialogue: combat −3 dB. Existing ambience ducks −6 dB during accepted combat sound activity, smoothly; voice duck is compensated, not replaced.
54 selected real variants replace eight superseded originals. SHA and ElevenLabs paid-plan assertion in manifest; private audio ONLY in existing private Site and Dropbox. No public isolated audio distribution, no paid calls.

WS0_GAPS.json lists missing actual event/layer/prompt/duration/variant requests. It is a request list, not generation authority.
