# Racer gears / Flight / Hyperdrive · source intake checkpoint · 2026-10-18

Status: SOURCE AUDIT ONLY. Runtime, RACER panel and 20-second demo NOT IMPLEMENTED or deployed yet. No artistic/human acceptance. Ordered after V-458, before Combat V-461.

Audio owner remains tools/KFB-Audio-Site. Base is completed Atmosphere PR420 head 0a9bfc90d143aaacaafe9fad5487b449cc1548fe; Site remains v18/source0.8.1, all media stopped. No World writes, new Site/context, merge, paid calls or additional public audio uploads.

Read current WS0 BRIEF_WSA_RACER_ENGINE_R1.md and BRIEF_WSA_AUDIO_UPDATE_R1.md on docs/kfb-decisions-register-2026-10-11. Source branch assets/kfb-elevenlabs-sfx-r1-2026-10-18 pinned 3dc8a12dd883bf1ca5f6bcbb15a22c1f0228ffb9. Downloaded and Git-blob-verified 22 existing source files: Racer14 / Flight4 / Hyperdrive4. Every file was actually decoded and measured, source SHA256 and onset/level data in source-audit.json. No sound copied into this delivery's public branch.

Important actual findings: O2 is excluded as WS0 directs (measured approximately −47 dBFS RMS, not called mathematically silent). L3 approximate pitch129 Hz (high confidence) vs L4≈107 Hz (moderate/high), while L1/L2 estimates have low confidence; no fabricated alignment claim. MP3 floating-point decoded sample overshoots above full scale, including O1/O2b and flight/hyperdrive sources; normalization/limiter and source listening are needed. Source estimates used 8kHz mono downsampling and are diagnostics, not final native-format true-peak certification.

MIT-only donor source src/lib/sim/vf26-audio.ts and complete LICENSE read from KhazP/rwanda-f1-2026-sim at b57d085750513e00e83f6e03f81d3dedea1f1eec. No CarAudio.ts/GPL file or donor audio imported. Intended port is equal-power neighbouring LoopGrid interpolation plus existing-owner injection, not another runtime owner.

## Storage seam requiring a choice

WS0 confirms Georg's paid plan, but current official ElevenCreative Terms, last updated 9 October2026, Exhibit4 §§2–3 distinguish production incorporation from isolated SFX/library redistribution. Primary https://elevenlabs.io/creative-terms; help-centre paid rights are explicitly subject to service-specific terms: https://help.elevenlabs.io/hc/en-us/articles/13313564601361-Can-I-publish-the-content-I-generate-on-the-platform . Applicable customer agreements, notices/effective dates and written exceptions may differ; this checkpoint makes no legal finding about files already on the source branch.

Conservative hold: no NEW public ElevenLabs binary copying or paid generation. User has been asked whether to use public Code+Manifest / private audio pending clarification, or supply a written exception permitting public standalone distribution. Existing source branch/history not rewritten. Local read-only measurements were safe to complete; implementation/publication/storage must now be aligned to the answer rather than silently expanding scope.

One next gate: resolve that storage choice/exception, then implement RPM/4gears/80–110ms ignition cut/50ms loop seam blends/Poisson crackles/limiter and a 20s existing-Site proof. After Racer, implement layered Combat/Destruction with shared ducking/limiters, not arcade tones. Up to60000-credit budget is held by WS0; gaps go as event/layer/prompt/seconds/variants requests, never direct generation from this task.
