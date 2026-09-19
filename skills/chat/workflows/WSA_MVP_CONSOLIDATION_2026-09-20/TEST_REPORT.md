# TEST REPORT · WSA MVP Consolidation · 2026-09-20

Status: **24/24 READBACK / CONTRACT CHECKS PASS**

Branch under test:
`orchestration/wsa-mvp-consolidation-2026-09-20`

This is a repository/state audit for the orchestration handoff and Stage navigator. It is **not** an integrated game-runtime browser test and **not** a public Cloudflare verification of the new consolidation route.

## Checks

### Handoff / data
- START_HERE carries current handoff status: PASS
- `STATUS_MATRIX.json` parses: PASS
- `SOURCE.json` parses: PASS
- exactly 7 core MVP input lanes: PASS
- Stage role = navigator only; runtimeOwner=false: PASS
- Stage status explicitly not public-verified: PASS
- human target is direct `kayfabizarro.pages.dev`: PASS

### Stage links / boundaries
- KFB Hub backlink: PASS
- Stage backlink: PASS
- Travel/TinySkies route present: PASS
- TinySkies × OSM × Grotesque route present: PASS
- Race HUD v3 route present: PASS
- KCL-M1 route present: PASS
- Resident Clown route present: PASS
- EyeRig route present: PASS
- no Live-promotion claim: PASS
- `GAME_DEV_CLI_UNAVAILABLE · OPTIONAL FALLBACK USED` recorded: PASS

### Stable PR head readback
- `georg-doc/kayfabizarro#110` = `8033e64d2638740fe2c9133216d42c56c306a4aa`: PASS
- `georg-doc/kayfabizarro#107` = `fc49a336af57adb6317b74211b3318d004d96de5`: PASS
- `georg-doc/kayfabizarro#104` = `af2827b60ced330e57bf4a7f553ad30dbf45b205`: PASS
- `georg-doc/KFB-Stunt-Car-Race#28` = `8918471bf6c5e3fa1b945109fd37019df600cad6`: PASS
- `georg-doc/KFB-Combat-Arena#5` = `6bd36e7a2da090d240ab520de9c280ac73fe12cb`: PASS

### Active Travel lane
- PR #30 still uses branch `wsa/tinyskies-terrain-donor-isolation-2026-09-19`: PASS
- stable tested evidence head `80cfaa685cdfcdeab7cbd52f2cea6fb16bd8d4f4` still retained in PR body: PASS
- current head at final readback: `ee240a72cfa2305a77a1a083636f567d1fb9d482`

Travel moved multiple times during the first audit; the handoff therefore treats the branch head as a live cursor and the evidence head as the durable tested pin.

## External gate audit

These results were re-read before this report:

- TinySkies public run `35474894951`: **FAIL before browser**, deployment marker wait failed.
- HUD v3 public run `35470815300`: **FAIL before browser**, Playwright install failed.
- Combat CA2 exact-head run `35463139401`: **PASS** for npm test + build + re-home verify.
- OSM/Grotesque source/browser run `35471501769`: **PASS**.
- OSM/Grotesque public attempt `35471646709`: marker parse failure after the JSON object; two public repair attempts already consumed.

## Not tested here

- no integrated Travel + Race + Resident + Combat runtime;
- no new consolidated Cloudflare deployment;
- no current-session visual opening of the direct pages.dev routes;
- no physical-device QA;
- no Georg visual acceptance;
- no GDS sealed package/run evidence.

## Next test gate

WSA performs the first local multi-repo assembly from the pinned/current owners, then publishes one fixed consolidation Stage candidate and runs browser/freeplay there before any merge or Live promotion.
