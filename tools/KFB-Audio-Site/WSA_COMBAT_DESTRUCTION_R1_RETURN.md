# Combat / destruction R1 + Racer delivery · RETURN · 2026-10-18

Status: IMPLEMENTED_AND_HOSTED_RUNTIME_CHECKED · HUMAN EAR OPEN (not HUMAN_ACCEPTED).
Repo georg-doc/kayfabizarro.
Racer branch audio/racer-gears-r1-2026-10-18, draft PR421, final head ceec5af4dd2ddffc42bd1691a4cd8fac890417c8.
Combat branch audio/combat-destruction-r1-2026-10-18, draft PR426, stacked on Racer; implementation d78d8d8d96b1fbc509fbc584b473cb0ee33a4e5a; evidence f2d3315062bb8ef888598c33c130b6818e7bfd60. The following Return commit contains this report; its own exact SHA is the branch/PR ref returned after write, not self-referential text.

## Delivered in the SAME Audio Site
https://kfb-audio.frizzlebob.chatgpt.site/#racer
https://kfb-audio.frizzlebob.chatgpt.site/#combat
Top shortcuts: Racer / Kampf. Racer has20s idle→three upshifts→braking/downshifts; Kampf has18event buttons, selected-event10× test and30s fight audition. No autoplay. Both recording links download audio-only proof; no chat embeds.

Project appgprj_6ac1c73dc28881919123106bd6d3e90e
Saved v19 / visible source0.9.0
Native source420353fd640abf14ed5b16fa08f2166c0bfc7fb7
Version appgprj_6ac1c73dc28881919123106bd6d3e90e~appgver_cc88c695b7188191abab088bb7981755
Deployment appgdep_6ad4c7465dcc8191bbc531c9c4ae4b9a · succeeded.
Exact hosted Chrome source and real private asset decodes verified. Audience remains existing owner-only custom policy; no sharing expansion.

## Runtime / sources
Same injected AudioContext, same owner RAF tick, PLAYER_CRITICAL Racer and WORLD_SFX Combat; no DOM/context/timer creation inside consumers.
Racer: four gears, RPM bands,50ms prepared loop blends,80–110ms ignition cuts, alternate backfires, Poisson crackles, limiter,26 processed files. See WSA_RACER_GEARS_R1_RETURN.md.
Combat:54 admitted variants,18 families ×3, replacing8 superseded versions;62original files audited/decoded. Physical donor composition (whoosh/body/material debris), no synthesized arcade impact fallback. Pitch±4%,gain±2dB,no immediate variant repeat;24source limit,70ms per-type debounce,ID dedupe, distance attenuation+low-pass, one short room reflection (not full diffuse reverb). Stop cancels sources/queue/pending starts. Optional experimental attack/body/tail uses independently selected energy excerpts from composite donors, honestly NOT independent recorded layers and not accepted. Default remains physical donor composition.
C07 finite fuse only (seam unverified); C18 whole chain only (never played per actual single domino). Missing exact impact/settle/travel sources deliberately NOT substituted.

Existing Combat-Arena cue owner f6a59ad15b9ffcf3164b0ab013f223962b63f61f and DestructionPOC pin c746a9567e0ea20a24b8969fe9130ac0756e7a7e mapped in dist/combat/CONSUMER.md. NO World adapter installed: World owner must expose actual launches/collisions/support/cascade facts. Launch/travel/impact/hop truth is not inferred from studio buttons.

## Mix / actual tests
- Racer137/137 independent assertions PASS: source/output hashes, real26decodes,3up+3down/20s, cuts91.90–107.27ms, telemetry/bounds/stop/cancel.
- Combat395/395 independent assertions PASS:18×10events,variant/pitch/gain bounds,24voice cap,54source+54output hashes, real54decodes, clipfree peaks−19.656..−13.046dBFS, position/room,30host-driven cues,stop/dedupe/late-drop,selected demo distance/material.
- Ambience25/25 named tests PASS, including1800simulated seconds and combat duck regression. Footsteps511/511 assertions PASS; source/timing unchanged.
- Hosted Chrome:26Racer+54Combat decodes; one AudioContext; Racer3up+3down+auto-stop; full Combat30s completion; all18event buttons individually matched accepted latest event. Racer prop/jet/HD controls+5event buttons, acceleration/brake/tempo/A-B/S1/S2 controls operated; explicit Stop leaves0 sources. Music and speech focus cooperate with existing music/TTS owner.
- Racer/Combat duck−3dB under music/dialogue. Ambience target−6dB under actual Combat activity. Hosted measurement: host voice−5dB plus module−1dB =−6dB (fixture also tests−4.25+−1.75=−6); no replaced/doubled TTS duck.
- Real local Chrome audio-only captures decoded19.98s and30.00s. Peaks−14.414/−14.048dBFS,RMS−27.676/−36.889dBFS; no full-scale clipping. These are signal/proof metrics, NOT perceived loudness or artistic acceptance.
- Independent Critic found stale async panel completion could stop a newer start; both success/error paths repaired and re-reviewed CONTINUE. Guard CONTINUE. Optional game-dev unavailable once; repo-native test/decode fallback used.

Evidence: evidence/COMBAT_R1/{automated.json,hosted-demo.json,hosted-controls.json,ambience-regression.json,review-and-private-delivery.json}; Racer evidence/RACER_R1/. Local screenshots hosted.png retained privately, not uploaded into public branches.

## Storage / licences / gaps
Public delivery contains code, documentation, JSON/manifests only; no new audio/proof binaries, no temporary Dropbox URLs. Originals stay private in /CLAUDE/KFB_HUB/40_AUDIO/elevenlabs_r1/. Protected processed runtime copies only in existing owner-private Site.
Canonical private bundle /CLAUDE/KFB_HUB/40_AUDIO/elevenlabs_r1/WSA_AUDIO_RUNTIME_RACER_COMBAT_R1_2026-10-18.zip
Dropbox file id:KeQLaY5-IIAAAAAAAArRzg,2492009bytes,upload completed; SHA25618188600590ef8f7feabb4f6afc4bcc530f13cab951d3aa70377748e9cbf9b9c. Includes26+54 processed sounds and two Chrome proof clips.
Earlier Racer-only zip preserved as intake snapshot, superseded by combined canonical bundle. No raw source or history deletion.

Each admitted file has original Dropbox path/source SHA256/output SHA256/licence/processing. ElevenLabs paid-plan commercial status is WS0 assertion, NOT CC0/public-isolated-library permission. Existing inherited Dropbox sharing unchanged; owner-only Dropbox audience NOT independently proven. No NC/ND/unclear stock/TinySkies/Sonniss/400-Sounds copied. MIT Racer code attribution retained; no GPL/donor audio imported.
WS0 requests (no paid calls) in dist/combat/WS0_GAPS.json:12 gaps/54requested seconds/~2160credit planning estimate; isolated shield,bot alert/hurt,rocket travel,bomb throw,metal bend,glass,clay-ground,debris settle,single domino,leaf/fruit tails. Racer tyres/skids +single exhaust pops in evidence/RACER_R1/WS0_GAPS.json. WS0 alone decides/generates; no60k spending performed.

## Changed public files
Combat: dist/{audio-site.js,ambience/kfb-ambience.v1.mjs}; dist/combat/{engine.mjs,panel.mjs,manifest.json,CONSUMER.md,WS0_GAPS.json}; scripts/{prepare-combat.mjs,combat-independent-qa.mjs,ambience-qa.mjs}; evidence/COMBAT_R1/*.json; media/3D_Assets/Audio/KFB_Combat_Destruction_r1/LICENCES.json; WSA_COMBAT_DESTRUCTION_R1_RETURN.md; RETURN.md; CHANGELOG.md.
Racer files/manifest/Return are the preceding PR421, unchanged by Combat. Private-assets/ and proof media deliberately excluded from public commits.
No World/WB2/PR348,Hub/router,Cloudflare,new Site/context/mixer/MusicClock,merge or Live promotion. Same canonical URL; no central routing change needed.

Unresolved: human ear judgement (motor pitch/cozy balance/seams/pops,combat naturalness/loudness), independent missing layers,full diffuse room reverb if later needed,actual World adapter. Not claimed: all requested source layers covered or live gameplay integrated.
ONE NEXT GATE: Georg listens to20s Racer and30s Kampf on this existing private Site; after ear acceptance, WS1/Anschluss-Integrator maps actual returned World events through the documented tiny adapters.
