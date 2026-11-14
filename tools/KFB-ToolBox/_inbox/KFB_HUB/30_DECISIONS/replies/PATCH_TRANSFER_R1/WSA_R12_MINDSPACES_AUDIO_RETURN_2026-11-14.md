# WSA → WS0 · Mindspaces Audio R2 · 14.11.2026

Audio proposal + audible standalone reference. No merge, no changes to Stage gameplay. Card Dungeon R0 is next after this audio review, not secretly included.

- Draft PR: https://github.com/georg-doc/KFB-Stunt-Car-Race/pull/128
- Branch `wsa/mindspace-audio-r2-host-20261114`, source `47510a4d84198cf1c6188348337c2482d0db1e00`, based exactly on approved `58b070e6f3c63a444841b5390ea3fac9e337247c`.
- Target branch has since advanced to `d3e8cdf06ec143246c4f26a196ee9f8942a19a60`; GitHub reports not mergeable. WS0/WS1 must reconcile shared audio files. No force push, rebase or merge done over the agreed pin.
- Owner-private Site: https://kfb-infiniterooms.frizzlebob.chatgpt.site/?qa=1 ; Site source `4af4764bb92ded80a0f75382b7171a121aad0b26`. WebGL/Rapier/kfbAudio only on root route; `/patch-wall/` still isolates original WebGPU/AVBD/Patch audio.
- Offline files on `assets/private@00332b9fbdfd534d156694637b26b64ea9139418`, `40_AUDIO/mindspace_binaural_r1/`: lossless FLAC, SPSQ presets, official SynapSeq4.43.1 provenance, measured WAV metadata. Each FLAC decodes exactly to the generated WAV PCM. No tone generation in runtime.

## Connections1–3

`cueMap.js`: existing ten KS/NA recordings registered. `mixer.js`: real persistent dry stereo mind bus, before master/limiter, no reverb or panner. `kfbAudio.js` and small tested `mindspaceRouting.r2.js`: mind media attachment, room music send through existing convolution, independent room-bed attenuation, release with null; unknown buses throw. Selected music send honors user music volume and ducking. Optional HRTF only for real positioned objects. Default global behavior is retained unless explicit room-consumer flags are supplied.

The room-only consumer loads native music/bank/concrete footsteps, not outdoor/racer/combat. Native catalogue @aa267b8 and thematic tags at58b are immutable inputs; no second mood taxonomy.14 native private-song files match canonical song-pin Git blobs;12 have catalogue+theme matches and form the available native mindscape subset. Native list export now accepts an optional list filter before deduplication. The real native playlist is bounded too, so automatic song-end cannot return to uncatalogued Mindscape titles. First room uses best native thematic match; later room entries request session-unplayed native weighted selections.

## Evidence

`mindspace-r2.webm`:50.06s with sound, real portal traversal in both directions, high foyer using canyon hall, three side rooms using forest hall. Three foundations: Glossy Melancholy, Sax and Trumpet Call, Porch Roll. Two KS/NA loops; portal cues actually started on both crossings; seven native concrete steps; one running AudioContext; no audio errors. Headphone checkbox switches to dry stereo binaural WAV; default speakers use isochrone WAV of the same offline render family.

First clip was −45.7 LUFS, rejected as too quiet. Repaired final clip −32.6 LUFS, true peak −17.6 dBTP, no clipping. Quiet ambience mix, not hearing-approved by WSA: Georg must listen. The two source WAVs peak around−20dBFS before layer/mix gain.

M1 Max32GB/120Hz cap, foreground: median8.3ms, p95 around9.1–9.3ms, hostCPU p95~1.8ms. Native audio frame ~0.124ms average/0.3ms p95, observed transient max5.3ms. No Mac-mini acceptance, GPU-time isolation or claim of zero spikes.27GiB disk free after work.

Checks:21 new contract/routing tests;51 existing room tests;53/53 legacy mixer rule checks in fixture-free mode; production Vite build. Shared private-copy gate is NOT green here: normal legacy fixture attempts to write `~/kfb-ws1/.kfb-audio-cache/index.json` and receives EPERM. I did not request access or modify that shared WS1 cache. Source-specific changes and seam list are in PR128.

## Open, explicitly

1. Georg's hearing acceptance (headphones and speakers).
2. Song-Video priority is tested at the control seam, but there is no Song-Video viewer in this prototype route yet.
3. Strict whole-session no-repeat across autonomous track-end selections remains a follow-up; native shuffle avoids recent repeats, room-entry selector excludes already requested foundations.
4. Existing forest/canyon impulses are reused, not newly measured gallery/vault acoustics. No new vault geometry, FB actor or Escher locomotion was built. Those geometry/actor gates are not called passed.
5. WS0/WS1 reconcile PR128 onto the advanced target and run private-packaging gate before merge.

Georg's next choice: listen to the existing private Site via “Raumton einschalten”; use “Kopfhörer · binaural” only for the headphone audition. After audio acceptance, proceed with Card Dungeon R0 in the confirmed WebGL host.


GitHub-Rückgabe: https://github.com/georg-doc/KFB-Stunt-Car-Race/pull/49#issuecomment-6868711629
Shared folder: /Users/georgv.westphalen/Dropbox/CLAUDE/KFB Combat Arena/WSA_Patch_Transfer_R1_2026-11-13/R12_Mindspaces_Audio_R2_2026-11-14
