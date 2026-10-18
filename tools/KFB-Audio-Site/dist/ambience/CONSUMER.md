# kfb-ambience.v1 · WS1 consumer packet · V-458

Audio-owned, DOM-free, no World imports, no timers, no context or MusicClock creation. The Site panel is only an audition client. WS1 maps actual biome/card-zone/diorama and weather truth later; no World installation in this slice.

```js
import {createAmbience} from './kfb-ambience.v1.mjs';
const ambience = await createAmbience({
  audioContext: existingAudioContext,
  destinations: {GLOBAL_BED: existingGlobalBedBus, LOCAL_AMBIENCE: existingLocalAmbienceBus},
  assetBaseUrl: new URL('./ambience/', existingAudioAssetRoot),
  onWind: ({value,at}) => existingVisualWind.set(value,at)
});
await ambience.setContext({biome:'pond',timeOfDay:'evening',weather:'rain-light',wind:0.35});
await ambience.start();
ambience.setWaterEmitters([{id:'stream-near-house',kind:'river',position:{x:12,y:0,z:-8}}]);
// Call from the EXISTING host update, not a new clock:
ambience.setMix({musicActive, soundbedActive, dialogueActive, hostVoiceDuckDb});
ambience.tick();
// Same event and AudioContext time that trigger the VISUAL flash:
ambience.emit({type:'lightning',id:uniqueFlashId,at:flashAudioContextTime,distanceM:1029,azimuth:0.5});
// 1029 / 343 = 3 seconds to the sound arrival. Never thunder first.
ambience.stop(); // cancels all pending voices, including delayed thunder
```

Presets: `meadow`, `jungle`, `beach`, `forest`, `pond`; times `morning/day/evening/night`; weather `clear/rain-light/rain-heavy/thunderstorm/snow/storm`. Wind input 0–1. Runtime publishes the **same slow gust envelope value** used for the wind gain to the visual callback, 4 Hz; host keeps visual smoothing. Studio sky is a timing fixture, not a replacement Tiny Skies module. Tiny Skies sound assets are never imported.

Listener position/orientation belongs to the existing context listener; water coordinates and animal positions are in the same metre-based space. Inverse-distance HRTF; water gets a distance-dependent low-pass. Move an emitter by replacing its array; old voices fade out. For beach add `kind:'beach'`; `waterfall` is also supported.

Mix policy: desired total ambience attenuation −5 dB under audible music/soundbed or active dialogue. If the existing bus already ducks −4.25 dB for voice, module adds only −0.75 dB, NOT another −5. Host must provide actual already-applied voice duck in dB. Attack 180 ms, release 1.2 s. Do not pass a music selection as “audible” when playback is silent. The Site samples the existing SCORE bus, not a second music runtime. Snow applies 900 Hz low-pass to this module only; a World adapter can separately request its existing owner’s global snow filter — this module never hijacks music/footsteps.

Beds: 32–40 s excerpts, 8 s overlap, random offsets, alternating variants; slow ±10% drift every 12–25 s. Rain: equal-power light/heavy gains over 3 s, 4 s segment overlaps. Fauna: shifted exponential intervals with 5 s minimum gap, no same immediate variant, pitch .97–1.03, randomized room placement. Pool hazard rates/minute at day: birds 5/3/.7/3/2 by biome; night multiplies birds .03 and crickets/frogs 1.6. Heavy weather reduces fauna to .25. Minimum gap makes actual mean rate lower than the raw hazard rate. 24 voice cap; host pauses drop backlog rather than burst. No species-identification guarantee.

Open source/ear gates: jungle-night authenticity, fir/coastal-specific birds, monkeys/distant wildlife, dry thunder alternatives; two jungle excerpts overlap. These are explicit gaps, not synthetic placeholders or HUMAN_ACCEPTED content.
