# WSA → WS0 · R4 ec7b057 · existing GPT Site v9 · 2026-10-27

## Outcome
**DELIVERY LIVE / bounded hosting checks PASS / gameplay performance and human audio acceptance OPEN.**
Same [KFB · WS1 Staging](https://kfb-ws1-staging.frizzlebob.chatgpt.site), Georg-only platform account, no second password. User's explicit GO for ec7b057 supersedes the older R3 preview-only gate for this named package. Audio Site, World source, audience and environment secrets unchanged. No new Site, Cloudflare project, merge or paid generation.

## Exact provenance
- Input repository: private `georg-doc/KFB-Stunt-Car-Race`; branch `site/mvp-r3-dist`; head `ec7b0579f98b0ab2be2ea51132344c8354eac308`. README calls this R4.
- 677/677 SHA256-listed files, **107,013,128 bytes**. Original manifest adds83,039B (678 files/107,096,167B on intake). Runtime site-build reports674files/102.1MiB, none above25MiB.
- Manifest SHA256 `a67dea26c7ec3afb26e15d0bc791f45214b969a1871be2e937c7916f826443df`.
- README identifies WS1 `9a95ea9` merged into WS0 `51c9cbe`. Actual build metadata `533c8dd41f9daba3428eaa9591c000af4689bcbb`; `51c9cbe39e3239e3d64f53e4f2c07b045f754ad3` is its direct child, adds only feature-check script, no game code delta.
- Site project `appgprj_6ad2ac305b788191af0bdfc68823a300`.
- **Live version9** `appgprj_6ad2ac305b788191af0bdfc68823a300~appgver_77afbeec137c8191a36d62e7ab801fd1`.
- Native private Site source repository `appgprj_6ad2ac305b788191af0bdfc68823a300`, branch `main` (Sites-managed); no new PR.
- Private Site source head `8e8e4d07816ac42f68ab656a457bb19889d67c08`, pushed/remote-head verified by official source helper; native saved-version provenance fetched afterwards.
- Deployment `appgdep_6ae11f69c74c81919de33dc5848ce83a`, **SUCCEEDED**,27Oct22:02:52UTC.
- Exact deployment archive118,005,760B /752files; SHA256 `9579ed34ebc6e1b87e5016f0ca2a65a111721fb62e1daca296cd4328f8e80617`. Framework output and retained former private files explain difference from delivery size.
- No new PR; no merge. Priorv8 retained as rollback.
- Public evidence checkpoint `df213da6ff4b8d51d45ae6196c74b295f971b624`, branch `docs/kfb-decisions-register-2026-10-11`, same repo `georg-doc/kayfabizarro`; evidence file fetched exactly.

## Receiving changes
All incoming package files retained byte-for-byte. Source delta from v8:571paths; bulk is staged private `public/game-package/**` (new package, H15 and HeyGen), not publicly reuploaded assets.
Hosting/test changes:
`build/sites-worker.ts`, `lib/game-entry-routing.mjs`, `lib/game-package.json`, `lib/mvp-delivery.mjs`, `scripts/stage-game-package.mjs`, `public/kfb-entry-default.js`, `tests/mvp-delivery.mjs`, `tests/v771-platform-only.mjs`, `tests/r4-entry.mjs`, `tests/r4-hosted.mjs`, `R4_EC7B057_CHECKPOINT.md`.
Support safe leading ./ manifest normalization, nested index resolution, /h15/ directory, MP4 MIME. Worker `basicAuth:false` retained, native customoneuser/zerogroups retained, envrevision1 unchanged. Existing secrets not used or changed.

Incoming bundle has legacy empty-hash `world=probe` and X gated by existing `mount=live`. A blocking receiving-entry script is prepended before the unchanged module. **Only emptyhash** becomes:
`#m1,harvest,look=terrain3,world=endless,hud=3d,palseed=803,mount=live`.
Every explicit hash/query preserved. README's explicit testhash without mountflag therefore still needs `,mount=live` for X; no game-source fix claimed. Root servedHTML is intentionally transformed; original inputindex hash remains exact.

Audio roots retained exactly: Raw GitHub first, jsDelivr fallback, pin `0aa844d54313205463c8387c9fb7f10bbd817461`. No host restriction on Raw GitHub found; direct audioindex200/CORS* and existing fixed-repo proxy200 verified. Supplied fetch wrapper can rewrite both origins onto /raw for fetch/Three; do not imply independent fallback transport is proven for every loader. Newer WS0 game/music commits after this packet are not included.

## Actual checklist
| Check | Result |
|---|---|
| Original intake SHA256 | **677/677 PASS**, independently repeated |
| Targeted source assertions | **57 PASS**:8platform-only +30delivery +14routing +5entry |
| Framework build | PASS |
| Local HTTP sweep | **680/680 PASS**:676 exact files, transformed rootHTML,2Range,1audioindexproxy |
| Hosted bounded probes | **16/16 PASS**; full JSON in evidence |
| Anonymous / and /raw |401, no Basic challenge |
| Anonymous /game-package/assets/hero-Cg69yYuF.glb |401 |
| Anonymous /game-package/ |401 |
| Anonymous /h15/index.html |401 |
| Anonymous /heygen/beseeltes_fahrzeug.mp4 |401 |
| Owner Chrome account sign-in |Actual account selector → game; no second password |
| Live revision |Root revisionheader exact ec7b057; README and8,590,884B index--AnGlIN9.js SHA exact |
| Naked address |Actual Chrome URL gets endless/HUD3D/palseed803/mountlive; terrain, rabbit, stage, HUD rendered |
| X summon → W drive → X exit |Live Chrome PASS, HUD12KM/H then speedHUD removed; no404 |
| Captured browser errors |0after startup and mount/drive/exit |
| Audio |Raw/index transport and UI checked; Chrome audio-playback indicator observed. Subjective listening NOT certified |
| fps |**11.1 mean browser-rAF FPS**,300frames,p95frame301.2ms;60target NOT MET in this sample |
| Café/dome/disco/travel complete traversal |NOT CERTIFIED |
| WS1 game suite75/80 |Historical supplied result, NOT rerun here |

The FPS sample included startup and concurrent local QA game plus many other user tabs; not engine-only telemetry or a controlled single-tab benchmark. Earlier local14.4fps and background-live9.6fps samples are also non-acceptance measurements. Own local server and temporary tabs were closed after verification; live game left open.

Initial hosted check13/16: assumed directoryaliases alwaysredirectroot and assumed H15 wireHTML byteidentity. Actual production ASSETS serves /game-package/200 and /game-package/index.html307to/game-package/ (working game); H15 delivered content exact except appended platform /cdn-cgi/challenge-platform script. Final test validates these exact behaviors, not a general hash exemption. Default correction applies naked root, not platform-direct /game-package/ with emptyhash. Explicit Drive links remain playable.
Initial generic test command omitted new revisionargument, failed historical v6default; corrected8/8PASS. One source-save aborted when a new testfile appeared during packaging; frozen clean source then packaged successfully. Initial GitHub refwrite returnedUNKNOWN against concurrently advanced WS0head; ref/file inspection proved evidence absent, rebuilt receipt on currenthead without force/merge, fetched exactfinalfile.

## Visible evidence / limits
Actual owner Chrome displayed terrain/rabbit/stone stage, 3DHUD, X vehicleHUD and English vehicle bubble. Screenshot stored privately in this session: `work/ec7-r4-live-v9.png` (not uploaded publicly). Existing English gameHUD coexists with German weather/settings labels; not claiming all UI translated.
Evidence: [R4 live v9 JSON](WSA_MVP_GPT_SITE_R1_PREPARE/R4_EC7B057_LIVE_V9_EVIDENCE_2026-10-27.json).
Public GitHub contains only report/evidence metadata, no private models or screenshot payload.

## One next gate
**WS0/Georg acceptance of this exact v9**, explicitly including a controlled single-game performance check and audible biome/music/vehicle review. Current result is a verified private delivery, not HUMAN_ACCEPTED or60fps certification. Route further game/performance fixes to actual World owner, then deliver a new pinned packet.
