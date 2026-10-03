# ACTIONFIGURE-MOTION-FREEPLAY-01 · RETURN

Status: **BROWSER PASS · SITE REVIEW READY · HUMAN LOOK DECISION OPEN**
Owner: KFB ToolBox / Animation-Motion authoring
Receiving owner: Draft PR #333
Tested implementation head: `f1ce90d31a18973fa981bc982309c4bb01b204b8`

## Für Georg: Was jetzt?

**Nächster Ausführender: Georg.**

**Deine Aufgabe:** Öffne den privaten Site-Link aus dem Chat und spiele kurz.

- **WASD** = bewegen / drehen
- **Shift** = sprinten
- **Space** = springen
- rechts **Jog A/B**, **Run A/B**, **Sprint A/B** vergleichen

Eine Rückmeldung wie
`Jog B · Run A · Sprint B · Sprung passt`
reicht vollständig.

Du musst **keine** Commits, PRs, CI-Runs oder Deployment-Zustände prüfen.

**Danach übernimmt wieder ChatGPT Web/GitHub:** deine Auswahl wird im zentralen Motion-Owner festgehalten und derselbe Owner wird an Procedural World #332 angedockt. Travel Globe bleibt außen vor.

## Browser proof

Real Chromium:
- idle: `kfb_idle_idle_f`
- forward: Run at 2.132 m/s · `kfb_locomotion_medium_run_a`
- sprint: 3.006 m/s · `kfb_locomotion_sprint_a`
- reverse: `kfb_locomotion_walk_backward_a`
- jump: `Jump_Start` · airborne · jumpY 0.615
- Jog/Run/Sprint A/B controls all switched to B successfully
- console errors: 0
- page errors: 0

Workflow:
- run `37125874478`
- job `111210930976`
- result **SUCCESS**
- artifact `11275251740`
- digest `sha256:bc6b663622137cc08e0a7e73cf318f77d9b0bf75336da0bd5de657106adeb236`

Evidence artifact:
- `actionfigure-freeplay.png`
- `actionfigure-freeplay-proof.json`

## Central-owner regression

Same candidate head:
- Motion State Foundation run `37125874493` · SUCCESS
- state machine 9/9
- reconciliation 6/6
- Ladder 02 integration 7/7
- Motion Lab owner integration 5/5
- **27/27 total · 0 fail**
- Resource Registry run `37125874476` · SUCCESS
- Asset Registry Refresh run `37125874484` · SUCCESS

## Site mirror

Exact browser-PASS HTML copied byte-for-byte into the existing KFB Production Control Site inbox.

- Site record: `c51be993-57e7-44c0-b821-1176dc965923`
- Site file: `c3588833-b1c3-4392-8582-1f80a2c55eed`
- file: `KFB_ActionFigure_Motion_Freeplay_01.html`
- bytes: 15,451
- SHA-256: `ebb861191bf68d1f46d71730ed6298b160fb18182bab46a322bd60402bf211ad`

The private expiring capability URL is delivered only in chat and is not committed.

Classification:
**SITE REVIEW · NOT PUBLIC STAGE**

Cloudflare is deferred until a later durable World/Hub milestone.

## Source / ownership

- exact authored ActionFigure donor:
  `media/3D_Assets/KayKit_Mystery_Series6/6 - December 2023 - Action Figure/character/gltf/ActionFigure.glb`
- source blob: `4785276defdb929cb397954eb74b76aecb84486b`
- central Motion owner only
- no Travel runtime
- no World #332 runtime yet
- no consumer-local gait state machine
- no merge / no Live promotion

## Repair history

Named browser gate used exactly two repair passes:
1. module-start syntax fix;
2. Motion-Library shorthand-path resolver fix.

Repair 2 passed. No Repair 3.
