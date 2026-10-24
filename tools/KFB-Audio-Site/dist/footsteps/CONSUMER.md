# Footsteps · game consumer seam

Audio owns source selection, shaping, gain and playback. Game owns real contacts, support, gait, surface and cue time. No World runtime is changed by this Audio slice.

```js
import {createFootstepConsumer} from './footsteps/consumer.mjs';
const steps = await createFootstepConsumer({
  audioContext: existingAudioContext,
  destination: existingBuses.PLAYER_CRITICAL,
  defaultSurface: 'wood'
});
steps.start(); // existing host already resumed by its user gesture
steps.setSurface('foley-carpet'); // same stable ids as the Site selection
steps.emit({type:'footstep', id:'contact-471', at:existingAudioContext.currentTime,
  foot:'l', grounded:true, moving:true});
steps.stop();
```

One support contact produces one sample. Four numbered files are alternative takes, NOT four gait speeds, L/R assignments or a four-step loop. No immediate repeated take. ±3% pitch and only ±0.18 dB random level variation. Repeated cue ids are ignored. No step while stationary/airborne. Cue timestamps belong to the injected context; use the host's existing contact/audio scheduling adapter for device-output latency. This module creates neither a context nor a timer/clock and imports no DOM, WB2 or Site UI.

Available walking ids: wood (default), carpet-wood (processed Wood experiment), sand, stone, wet-clay, foley-carpet, foley-concrete, foley-gravel, foley-vinyl, digital-grass, digital-gravel, digital-snow, digital-wood.

Separate accent: emit({type:'creak',id:'floor-creak-3',at:existingAudioContext.currentTime}). The one creak file is deliberately NOT a footstep variant. Landing is not inferred from animation and is not newly implemented by this adapter.

Package the sibling audio.mjs, sample-shape.mjs, contact-core.mjs, both source manifests and required assets with this module. The Chequered Ink receipt in LICENCES.md must travel with game incorporation; these assets are not CC0 and must not be sold or redistributed unchanged as your own asset pack. Do not interpret this seam as an installed/verified World integration.
