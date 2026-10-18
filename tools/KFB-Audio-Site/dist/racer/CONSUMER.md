# Racer / flight / hyperdrive · Audio consumer R1

The existing Audio owner injects its AudioContext and PLAYER_CRITICAL destination:

```js
const racer = await createRacer({audioContext: graph.ctx,
  destination: graph.buses.PLAYER_CRITICAL, assetBaseUrl: privateAssetRoot});
await racer.start();
racer.setTelemetry({speedKmh: 60, throttle: .8, brake: 0, mode: 'drive'});
// Optional authoritative gear 1–4 and rpm override studio auto-gears.
racer.emit({type: 'boost'}); // takeoff / charge / jump / exit
// Inside the EXISTING owner update:
racer.setMix(existingMixActivity); racer.tick();
racer.stop();
```

No World adapter is installed. No additional AudioContext, mixer, timer or MusicClock.
Four ratios 3.2/2.1/1.45/1, final 3.8, circumference 1.8 m; these are audition parameters, not inferred World physics.
85% of 6400 rpm shifts upward. 80–110 ms ignition cut. Neighbouring bands crossfade equal-power; ordinary playback rate ±10%.
L3 ×.93 and L4 ×1.35 are measurement-derived preparation candidates, NOT ear-approved. Untuned A/B retained.
Loop seam overlap: 50 ms baked equal-power; native BufferSource looping. S1/S2 are reference shots only.
O2 weak source excluded. Four O3 windows are donor excerpts, not independent generated takes.
Music/dialogue focus: −3 dB, soft; safety compressor + bounded soft ceiling. Existing semantic bus remains authoritative.

## Private source and licence

Originals: Dropbox `/CLAUDE/KFB_HUB/40_AUDIO/elevenlabs_r1/{racer_r1,flight_r1,hyperdrive_r1}`.
Each manifest entry has source SHA256, private Dropbox path, processing and output SHA256.
ElevenLabs commercial paid-plan assertion: WS0 binding brief, 2026-10-18. NOT CC0.
User decision: public code/manifests only. Processed Oggs reside only in the owner-private Site and private Dropbox archive.
No temporary download URLs or audio binaries belong in the public mirror.
MIT code donor notice in NOTICE.md; no donor audio and no GPL CarAudio imported.

## Gates

Native decode/runtime tests do not constitute human ear acceptance. Pitch coherence, harsh pops, seam perceptibility and comparative loudness remain an explicit ear gate.
No paid generation, merge, Live promotion or World changes.
