# KFB Legacy Web Pet v0 · CHANGELOG

## 2026-09-21 · v0 candidate

Added one shared Legacy Web Pet presentation runtime for:
- ordinary Web/KFB Hub embed;
- Chrome MV3 extension host.

Added real Legacy character locomotion/action playback, shadow, Orc Warband camp, click VFX/SFX and right-click character settings.

Hub integration exists only on the feature branch and is disabled with `?pet=0`.

## 2026-09-21 · evidence

Authoritative run `35553968462`:
- 15/15 static PASS;
- MV3 build PASS;
- 12/12 Web/Hub WebGL PASS;
- 0 Web resource errors;
- 0 Web page/console errors.

Chrome extension arbitrary-page injection timed out before ready.

A previous run `35553680781` failed the same extension-ready gate. One test-only repair to the explicit Chromium extension channel did not change the result.

Per KFB two-pass rule, the extension gate is frozen and exported rather than receiving a third speculative repair.

Next gate:
`LWP-EXT-F1 · extension-load observability only`.
