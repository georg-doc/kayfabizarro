# ATMO — 7 ElevenLabs-Prompts (tracks mode)
Stand: 2026-07-04 · für Georgs 11Labs-Credits · Ablage: `assets/atmo/tier-1.mp3` … `tier-7.mp3`

## Wie es zusammenspielt
Die App hat ab v1.3 eine prozedurale WebAudio-Atmo (synth mode, keine Assets).
Liegen **alle 7** MP3s unter `assets/atmo/`, schaltet die Engine automatisch auf
**tracks mode**: dein Loop läuft pro Tier (3s-Crossfade beim Tauchen), der Synth
bleibt als leiser Glue darunter. Fehlt auch nur eine Datei → Synth-Fallback,
nichts bricht. Surface nutzt tier-1 gedimmt.

## Bindende Specs (in JEDEN Prompt unten schon eingebacken)
- **Key: A minor, Drone-Root A** — alle 7 standalone generiert, aber durch den
  gemeinsamen Grundton crossfaden sie harmonisch.
- **Seamless loop**: Ende = Anfang, kein Intro/Outro, keine Fades.
- **Länge 90–120 s** · instrumental · kein Beat-Grid/Schlagzeug (tiefe Pulse ab
  Tier 5 erlaubt, unter ~45 BPM-Gefühl).
- Leises Bett, nicht Vordergrund-Musik: ruhige Dynamik, keine Drops.
- Export: MP3 320 kbps, Stereo.

## Die 7 Prompts (copy-paste, einer pro Generierung)

**tier-1.mp3 — Surface**
> Calm underwater ambient drone in A minor, sunlit shallow ocean mood. Warm soft pad on a low A root, gentle hydrophone water movement, tiny bright bubbles, one distant friendly sonar ping. Hopeful but slightly mysterious, like the first page of a strange documentary. Instrumental, no drums, no melody — a quiet ambient bed. 90–120 seconds, seamless loop: the ending must flow perfectly back into the beginning, no intro, no outro, no fade.

**tier-2.mp3 — Shallow Waters**
> Underwater ambient drone in A minor with a subtle retro 1980s documentary-synth flavor. Low sustained A drone, soft analog synth pad drifting slowly, faint submarine engine hum, occasional muffled sonar ping. Mood: "you watched one documentary and now everything feels connected" — curious, lightly ominous, still comfortable. Instrumental, no drums, quiet ambient bed. 90–120 seconds, seamless loop: end flows back into the start, no intro/outro, no fades.

**tier-3.mp3 — Thermocline**
> Cold deep-water ambient drone in A minor. Slow filtered swells over a low A root, the highs gradually closing off, soft creaks of a pressure hull, sparse muted sonar. Mood: the light is going, curiosity turns to unease. Very slow movement, instrumental, no percussion, quiet ambient bed. 90–120 seconds, seamless loop with no intro, no outro, no fades — the end must match the beginning exactly.

**tier-4.mp3 — Twilight Zone**
> Eerie underwater dark-ambient drone in A minor. Two low drones on A slowly beating against each other (slightly detuned), distant metallic groans, a far-off whale-like call pitched down, unresolved suspended harmonies that never settle. Mood: something is wrong with the water. Glacial pace, instrumental, no drums, quiet bed. 90–120 seconds, seamless loop: no intro, no outro, no fades, end cycles perfectly into the start.

**tier-5.mp3 — The Trench**
> Deep dread underwater drone in A minor with tritone color (A against D#). Heavy sub-bass swells on a low A root, breath-like filtered noise, very sparse deep sonar pings echoing long, faint pressure creaks. A slow sub pulse far below 45 BPM may breathe underneath — felt, not heard as rhythm. Mood: claustrophobic awe. Instrumental, quiet bed. 90–120 seconds, seamless loop, no intro/outro, no fades.

**tier-6.mp3 — Hallucination Depth**
> Psychedelic abyssal drone in A minor. Slowly rotating detuned tones on A beating at 2–3 Hz, hypnotic microtonal shimmer drifting between the ears, a deep slow sub pulse (well under 45 BPM, more tide than beat), warped distant echoes. Mood: disorienting, beautiful, slightly unhinged — the deep is looking back. Instrumental, no drums, quiet bed. 90–120 seconds, seamless loop: end must flow into the beginning, no intro, no outro, no fades.

**tier-7.mp3 — The Void**
> Near-static massive drone in A minor at the very bottom of the ocean. Extremely low A root (A0/A1 territory), glacial swells minutes-slow, faint inharmonic choir-like overtones appearing and dissolving, almost-silence between movements, one very rare, very deep sonar ping. Mood: the bottom of belief — reverent, empty, final. Instrumental, no percussion, very quiet bed. 90–120 seconds, seamless loop with no intro, no outro, no fades.

## Nach der Generierung
1. Loop-Check: Datei in Audacity/QuickTime 2× hintereinander abspielen — Übergang darf nicht knacken oder atmen.
2. Als `tier-N.mp3` nach `assets/atmo/` legen (alle 7, sonst bleibt Synth aktiv).
3. App neu laden, ♪ an, tauchen. Ducking bei FB-Voice ist automatisch.
4. Standalone-Build: MP3s werden mitgebundelt (+ ~10–15 MB) — bewusst entscheiden.
