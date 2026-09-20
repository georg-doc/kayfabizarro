# TEST REPORT · Cologne Option C Stage

## Static/runtime checks

- `qa/verify.mjs`: **18/18 PASS**
- JavaScript syntax: **16/16 PASS**
- `color-map.v1.json`: parse PASS
- whitespace/diff check: PASS
- forbidden acceptance links (`file://`, githack, github.io): none

## Browser checks

Environment: Codex in-app Chromium. Local HTTP checks plus exact public Cloudflare route.

1. Desktop normal start
   - scene booted through OSM load to playable countdown;
   - yellow center dashes and orange outer lines visible;
   - Doku icon opens and closes;
   - console errors/warnings: 0/0.
2. Desktop tunnel gate `?start=tunnel&seed=camera-gate`
   - scene booted at authored tunnel beat;
   - vehicle and camera remained inside the visible arch corridor at rest/countdown;
   - fixed seed reported in inline docs;
   - console errors/warnings: 0/0.
3. Mobile 390×844 tunnel gate
   - scene, tacho, minimap and compact top controls visible;
   - inline docs fit and remain dismissible;
   - console errors/warnings: 0/0.
4. Public Cloudflare tunnel gate
   - exact route opened at publication head `75a6d64ca0b18d1244017896da8b26bdbe83bcfd`;
   - loading screen advanced to the playable tunnel scene;
   - camera, vehicle, road markings, compact controls, tacho and minimap visible;
   - console errors/warnings: 0/0.
5. Public KFB Hub
   - exact Hub route opened at the same publication;
   - Cologne Option C appears in Briefings and links directly to public onboarding.

## Remaining human/dynamic proof

- complete moving tunnel pass in CHASE;
- one complete lap for support placement and facade occlusion;
- human visual acceptance of palette randomization and markings;
