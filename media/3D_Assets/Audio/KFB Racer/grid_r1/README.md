# KFB Racer · ElevenLabs Motor-Set Grid R1 · V-378

Status: **PROMPT SOURCE / EXECUTABLE BATCH PREPARED · AUDIO NOT GENERATED** (2026-10-17).

One shared small chunky cartoon hot-rod engine for the vehicle grid; per-vehicle pitch adaptation belongs to later Race/Audio integration, **not** to these masters. Six 10-second seamless loop classes (01–05, 12) and six isolated 1–2-second one-shots (06–11). Four independently generated variants per class = **48 MP3 candidates**.

## Authoritative input
`SOURCE.json` records Georg's prompts verbatim; numeric one-shot durations are implementation choices inside his allowed 1–2-second range. `prompt_influence=0.85` is the operational choice for **high** (the API accepts a number between 0 and 1, not a literal "high"). Model `eleven_text_to_sound_v2`; format `mp3_44100_128`. API creates **one** MP3 per POST; do not invent a four-variations request argument.

## Generate (only with an authorized, secret API key)
From repo root, no third-party packages:

```sh
python3 tools/KFB-ToolBox/audio/racer_grid_r1/generate_elevenlabs.py
# dry-run, no key, no audio, no credits
export ELEVENLABS_API_KEY='...'
python3 tools/KFB-ToolBox/audio/racer_grid_r1/generate_elevenlabs.py --execute --max-calls 4
# listen/QA pilot before spending all 48 requests
python3 tools/KFB-ToolBox/audio/racer_grid_r1/generate_elevenlabs.py --execute --max-calls 48
# resumes verified existing files and finishes remaining candidates
```

Never commit the API key. Each successful response is saved atomically as `NN_label_v01.mp3` … `v04.mp3` and recorded in `GENERATION_MANIFEST.json` with SHA-256; a repeated invocation skips byte-verified files. **Failed/ambiguous paid POSTs are not retried automatically**, to avoid hidden duplicate charges. Upload the verified MP3s and manifest as a coherent asset package under this directory using the existing WS0 GitHub pipeline, or the Dropbox folder Georg designated. GitHub source/asset ownership is not changed.

## WS0 technical acceptance
For every generated file: verify duration, MP3 decode, peak/clipping, source SHA, actual mean pitch/RPM tendency and loop-boundary continuity (sample jump + short-window RMS/correlation/spectral comparison), listen for phase/periodicity/tonal jump and distinguish steady RPM from upward sweeps. One-shot tail and onset must fit 1–2 s. Pick a **coherent same-engine family** by ear, not solely by independent best scores. Prefer raw candidates first; do not silently edit, normalize, crossfade or promote to runtime. Compare against the protected pre-existing donor `media/3D_Assets/Audio/KFB Racer/Seamless_10–12_secon_#1-1789884544910.mp3` (human-preferred legacy V8 idle): this new R1 batch does not withdraw that historical human preference.

## Ownership
Existing Race physics/vehicle controls provide read-only telemetry; KFB Audio stays the sole playback/mixing AudioContext owner. This generator does not touch either runtime. No new public Stage route is needed for offline sound source preparation; WS0 to stage a playable isolated listening comparison only if a human selection gate warrants it.

API contract: https://elevenlabs.io/docs/api-reference/text-to-sound-effects/convert
