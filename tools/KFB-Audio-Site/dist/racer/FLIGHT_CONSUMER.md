# Flight / Crash R1 · additive consumer contract

The existing Audio owner still owns one injected AudioContext, semantic PLAYER_CRITICAL/WORLD_SFX destinations and its host tick. No World, input/physics, VFX or timing owner is introduced.

## Vehicle facts

```js
racer.setTelemetry({
  mode:'jetpack', // prop | jet | jetpack | turbine | antigrav; drive/hyperdrive retained
  speedKmh:72, throttle:.7, bank:-.5, vertical:.3,
  airbrake:0, engineOn:true, geared:false
});
// Only actual mechanically geared vehicles supply geared:true or authoritative gear/rpm.
// Existing update loop, not a new timer:
racer.setMix(existingMix); racer.tick();
```

Schub, positive climb load and absolute bank load alter smoothed existing source gains/rates; bank sign is retained as telemetry, not claimed as spatial physics. Airbrake increases aerodynamic wind only while moving. Engine-off fades motor layers but preserves glide wind. Ordinary pitch stays ±10%. Geared flight uses the two real P06 pops and existing ignition-cut semantics; gearless flight invents no shifts. Prop/jet/HD prior sources remain available. Boost alternates two real P04 takes.

Twelve propulsion sources: private Dropbox /CLAUDE/KFB_HUB/40_AUDIO/elevenlabs_r1/propulsion_r1_norm/. Eight loops use50ms baked equal-power seams; AntigravP05 trims.3s at each end to avoid the measured source fade. Source/outputSHA256, actual decoded durations, level cap and licence assertion in manifest.json / propulsion-source.json. Baseline26 Racer outputs are not rewritten. These are prepared candidates, not human ear acceptance.

## Actual destruction facts

```js
combat.emit({
  type:'destruction', id:'unique-support-contact-184', cascadeId:'collapse-A',
  phase:'contact', // impact | fracture | contact | settle
  material:'stone', position:{x:4,y:0,z:-8}, energy:.35
});
// Explosions only when the actual owner explicitly supplies explosive:true on impact.
```

One explosion per retained cascade (bounded64-cascade/512-fact retention; Stop resets it); two fractures maximum, at least150ms apart. Contacts cluster within a rolling150ms/Euclidean3m window; max10 per cascade and existing Combat-local24voice ceiling. Quiet contact/settle uses low-level tail excerpts from real C15/16/17 composites, NOT full explosions or independently recorded single contacts. Very weak contacts coalesce. IDs dedupe; map max64cascades/512facts. Unsupported materials / nonexplosive generic impacts report SOURCE_GAP, never substituted boom. No domino-chain recording per single domino.

The World owner sends authoritative launch/hit/material/support/cascade facts. Audio does NOT infer them from visual animations/trails, nor create further physical destruction. Supplied positions use the same coordinate frame as the existing context listener.

## Integrated audition, NOT World simulation

flight-sequence.mjs is a pure host-clock synthetic context/event fixture:30s start→acceleration→banking→climb→airbrake→two explicitly explosive staged hits→fractures→contacts→settle. It calls only the existing public Racer/Combat contracts. CurrentTime is injected; late cues drop, never replay as backlog. No track IDs/BPM/stem gains in fixture inputs. Stop cancels both consumers and pending panel starts. Mixed recording taps the existing final output node in the SAME context; no microphone, second mixer/context or audio runtime.

The new UI stays inside Racer, accessible at #flight; no World geometry or placeholder aircraft is presented as real game integration. The labelled phase strip is studio audition timing only. Existing music/TTS ducking and ambience combat duck remain owned by the original Audio Site.

## Remaining sources / continuation

Isolated nonexplosive crash bodies, very quiet independent clay/wood/stone contacts, settling-only tails and optional jetpack shutdown remain WS0 requests after stock matching. Existing derived tails are disclosed and not falsely marked missing-complete. No paid generation here; audio stays private, public code/manifests only.
Georg's instruction to continue is PROCEED PASS for the direction, not blanket sonic HUMAN_ACCEPTED. Future World integration belongs to its actual owner after source/event handoff.
