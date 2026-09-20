# KFB Racer · Engine Audio Pack

Status: **CURRENT AUDIO CANDIDATE SOURCE · WSA HANDOFF READY · NOT RUNTIME-INTEGRATED**  
Date: 2026-09-20  
Audio source home: `media/3D_Assets/Audio/KFB Racer/`  
Receiving implementation SSOT: `georg-doc/KFB-Stunt-Car-Race`

## Human decision preserved

Georg explicitly preferred the first Suno V8 idle render:

`Seamless_10–12_secon_#1-1789884544910.mp3`

Treat this as the **preferred V8 idle donor**. Do not replace it with the synthetic WAV or another Suno render without a new listening decision.

The remaining new renders are **candidates**. They are available for WSA listening/integration but are not individually marked HUMAN_ACCEPTED by this handoff.

## Layer contract

Race owns movement, physics, contact, speed, acceleration, boost, drift, jump/landing and gameplay truth.

Audio may read Race telemetry and render:

1. **IDLE / BED** — persistent engine identity.
2. **LOAD** — crossfade with speed/load; no gameplay authority.
3. **THROTTLE / REV** — short acceleration transient.
4. **WIND / SPEED** — separate future layer.
5. **EVENTS** — existing Boost/Drift/Re-grip/Jump/Land/Impact cues.

Do not make engine audio a second speed/physics owner.

## V8 family

### Preferred idle donor

- `Seamless_10–12_secon_#1-1789884544910.mp3` — **GEORG PREFERRED**
- `Seamless_10–12_secon_#2-1789884654695.mp3` — alternate Suno candidate
- `KFB_V8_Muscle_Idle_Loop_12s_48k.wav` — synthetic reference / comparison master

Suno prompt:

> Seamless 10–12 second loop of a tuned 1960s big-block cross-plane V8 at warm idle, around 700 RPM. Deep bass-heavy dual-exhaust burble, hot-cam lope, heavy uneven combustion pulses, subtle mechanical texture, powerful vintage muscle-car presence. Steady idle, no acceleration, no music, no drums, no ambience. Clean game-audio loop.

### Load

- `Seamless_10_second_l_#1-1789885228084.mp3`
- `Seamless_10_second_l_#3-1789885309613.mp3`
- `KFB_V8_Load_Loop_10s_48k.wav` — synthetic reference

Suno prompt:

> Seamless 10 second loop of a tuned 1960s big-block cross-plane V8 under steady road load, deep dual-exhaust growl, muscular hot-cam pulse, rich low mids, subtle mechanical vibration, constant RPM, no acceleration, no music, no ambience, clean game-audio loop.

### Rev / throttle transient

- `Vintage_tuned_big-bl_#1-1789885183009.mp3`
- `Vintage_tuned_big-bl_#2-1789885183009.mp3`
- `Vintage_tuned_big-bl_#3-1789885183010.mp3`
- `Vintage_tuned_big-bl_#4-1789885183010.mp3`
- `KFB_V8_Rev_Sweep_8s_48k.wav` — synthetic reference

Suno prompt:

> Vintage tuned big-block V8 rev from deep 750 RPM idle to an aggressive 5200 RPM roar, then clean throttle release. Heavy dual exhaust, hot-cam muscle-car character, realistic mechanical engine sound, dry close recording, no music, no crowd, game SFX.

## Steampunk sci-fi family

### Idle / bed

- `Seamless_12_second_s_#1-1789885344453.mp3`
- `Seamless_12_second_s_#2-1789885351951.mp3`
- `KFB_Steampunk_SciFi_Engine_Idle_Loop_12s_48k.wav` — synthetic reference

Suno prompt:

> Seamless 12 second steampunk sci-fi engine idle: huge slow pistons, deep pressure-chamber thump, brass flywheel rumble, clockwork ticks, restrained steam hiss, low electric dynamo hum and faint turbine resonance. Heavy believable machine, tactile and mechanical, no music, clean game-audio loop.

### Throttle / pressure build

- `Steampunk_sci-fi_eng_#1-1789885377561.mp3`
- `Steampunk_sci-fi_eng_#2-1789885374520.mp3`
- `Steampunk_sci-fi_eng_#3-1789885371241.mp3`
- `Steampunk_sci-fi_eng_#4-1789885366063.mp3`
- `KFB_Steampunk_SciFi_Engine_Throttle_8s_48k.wav` — synthetic reference

Suno prompt:

> Steampunk sci-fi engine accelerating under load: pistons speed up, pressure rises, brass machinery rattles, turbine and electric dynamo spool upward, controlled steam release at the end. Heavy physical machine, cinematic but believable, dry game SFX, no music.

## Suggested WSA integration

Use the current Race audio graph and one AudioContext.

Suggested first proof:

`preferred V8 idle bed + V8 load crossfade + rev transient`

Map only read-only telemetry:

- `speedNormalized`
- `longitudinalAcceleration`
- `boostActive`

Keep drift, jump, landing, impacts and wind as separate layers.

For a future vehicle profile switch, use the same adapter contract for `CAR_HEAVY_V8` and `MECH_FUTURE`; do not create separate runtime owners.

## Stage status

No new public Stage candidate is claimed by this source handoff.

Existing Race integration host for a later proof:

https://kayfabizarro.pages.dev/kfb-hub/stunt-race/track-environment-lab/?world=facility&seed=KFB-1842&audio=roadtrip-v2

That URL is **not evidence that this Engine Audio Pack is integrated**. WSA must produce a new exact-source browser/audio proof before promotion.
