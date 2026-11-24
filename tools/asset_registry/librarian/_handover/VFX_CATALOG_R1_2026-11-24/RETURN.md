# VFX-Katalog R1 — WSA candidate for WS0

The reader supports the documented kfb.vfx-katalog/1 and /2 envelopes. WS0 updated the canonical path to R2 during implementation; the source schema is also retained in the copied reference. New R2 fields appear as literal extra rows and are searchable.

The existing FX tab reuses its resource search, filters, cards and detail drawer for the WS0 catalogue. Scope selection distinguishes all FX, VFX catalogue effects, existing registry FX and donors. No second registry or separate site is introduced.

## Owner source and refresh

Only `tools/asset_registry/librarian/live/vfx-katalog.r1.json` supplies VFX data. The reader requests its raw GitHub `main` URL with `cache: no-store`, without credentials. The adjacent canonical file and the browser’s last valid copy provide quiet fallback. No owner data is written or transformed into `fx.jsonl` or the resource builder. Fields with unknown names remain literal text. References are candidate-only and copy source standard or selected preset values.

## Local acceptance evidence

- 237 effects, 12 donors; status filters: 20 im Spiel / 72 vendored ungenutzt / 145 nur extern. The added donors are `rehan-game-vfx` (26 effects) and `00gamedevs` (84 effects).
- Existing 10 `fx.jsonl` rows remain in the same workspace.
- Search, donor/type/status filters, typed details, donor API and global parameters, real clipboard handoff: PASS.
- Actual immutable git.patch.gg previews and cdn.patch.gg covers load: PASS.
- Mobile width 390 px and drawer: PASS.
- Offline and unsafe-feed fallback: PASS; no console errors or runtime exceptions in the VFX acceptance run.
- Data refresh: `2026-11-24` → `2026-11-24.refresh-proof` on reload with the same build. This is a browser-intercepted response at the exact main URL, not a modification to WS0’s JSON or evidence of a deployed-site refresh. Source SHA-256 remained `95f9c57d5beb40a4f237ca2955ba78ea193cb2c889a5f9f379e545b45f6dd4e4`.
- VFX data/unit checks and 58 existing Python checks: PASS (Python 3.12).
- Existing browser suites and the new VFX suite are retained in the PR browser workflow. Their CI result must be reviewed before approval; local older browser runners encountered start/time-out issues on macOS.

The browser runner writes desktop/mobile screenshots, before/after refresh state and `result.json` to `artifacts/asset-librarian-smoke/vfx-r1/`; CI uploads these as workflow artifacts. No media are committed.

## Publication boundary

PR candidate only. No game code, playback, runtime effects or game-repo changes. No deployment or new Site version has been made; GPT Site version 67 is unchanged. WS0/Georg approval remains required before publication. The currently published Site’s other views, including Intake, must be preserved during the eventual integration; this source PR does not claim a production Intake smoke test.
