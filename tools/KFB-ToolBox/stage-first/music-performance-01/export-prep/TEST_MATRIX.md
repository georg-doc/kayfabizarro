# Export Prep R1 · Tests and evidence

Date: 2026-10-12
Status: **37/37 PASS**, GitHub Actions run **38278887068**, job **114911015201**, tested head `3ce484f638d4e2bb592797cb9b6fa8435b0ace46`. Node22 syntax PASS; same head inherited MUSIC-PERF QA run 38278887147 SUCCESS.

Execution: `node tools/KFB-ToolBox/stage-first/music-performance-01/export-prep/test/frame-plan.test.mjs`

Checks cover: real GLB/MP3/donor Git blob identity, original recipe, one audio owner, native beat/clip math, 240 sampled time addresses and end-exclusive 8s duration, repeated deterministic frames, hard rejection of altered source/approved actors.

**Not tested:** actual Three.js image pixels, visual source isolation, encoded MP4/WebM, audio mux/PTS, audiovisual lip sync, rendered output playback, GPT Site or Cloudflare Stage.

Historical MUSIC-PERF local/static/public tests are not rerun by this script; no new historical PASS claim.
