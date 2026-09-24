# TEST REPORT · Billboard B1 · 2026-09-24

Status: **PASS · PUBLIC_VERIFIED · HUMAN PENDING**

## Source fidelity
- B1 `bb-scene.js` vs accepted B0: **cmp PASS**.
- B1 `bb0-boot.js` vs accepted B0: **cmp PASS**.
- B0 donor face source: 4.20 × 2.10, Kenney `billboard.glb` @ `378b209355b13304e3cff656ec0806ca5b89df28`.

## Syntax
`node --check`: `bb1-boot.js`, `bb-scene.js`, `bb0-boot.js`, `wd-donors.js`, `wd-registry.js`.
Result: **5/5 PASS**.

## Local browser
Workflow run `35949250283` · job `107473997406`.
**20/20 PASS · 0 page/console errors · 0 failed HTTP assets.**

Measured:
- quarter: AR `1.794871794871795`, X `0.8974358974358975`;
- cover: AR `1.7917133258678613`, X `0.8958566629339306`;
- video: AR `1.7777777777777777`, X `0.8888888888888888`;
- slogan: AR `2`, X `1`.

## Public Cloudflare browser
Exact route: https://kayfabizarro.pages.dev/kfb-hub/pruefen/billboard-b1/

Workflow run `35949250283` · job `107474352324`.
**21/21 PASS · 0 page/console errors · 0 failed HTTP assets.**

Public source-canvas mean luma:
- quarter `185.76`;
- cover `172.71`;
- video `24.09`;
- slogan `113.07`.

Artifact:
- `billboard-b1-cloudflare-proof`;
- ID `10788012554`;
- `01-card-quarter.png`, `02-cover.png`, `03-video-poster.png`, `04-slogan.png`, `report.json`, `check.mjs`.

Assistant picture inspection of that exact public artifact: **4/4 intended source images visibly present**. No Georg acceptance is inferred.

## Failed evidence retained
Initial candidate `c8085eace867a8435dd8daeb78cb54bf95f496d8`: automated 20/20, but screenshots showed black content for quarter/cover/video.

Classification: **TECHNICAL PASS / VISUAL FAIL · superseded by one repair pass**.

Repair runtime `58a8b92d55548c6436ac60b15b521d8eff269afd` uses resolved owner canvases directly as billboard textures. No B0 source file changed.
