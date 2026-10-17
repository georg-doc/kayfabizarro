## CURRENT IMPLEMENTATION · 2026-10-14 · rest mouth / Studio poses / functional Dots / shadow depth
User supplied and this run inspected screenshots 22.32.27 (small collar/armour contact crop) and 22.34.58 (actual ToolBox Animation Studio, configured FrizzleBob, source T-Pose and hand/foot dots). This is source/implementation follow-up, NOT new whole-product visual acceptance.

Site version 8 private deployment succeeded: https://kfb-toolbox.frizzlebob.chatgpt.site/ . Site source 67c7015a46036aa87ec21fa81dccef785ed511ca; deployment appgdep_6acfea44cdf48191a0de24935f0b0dfc.
- Rest mouth: missing legacy state migrates to mouth.rest='closed'; explicit saved choices survive. Existing FaceHost API reads/writes/exports/imports this field. At rest, the original model mouth carrier receives the existing chosen decal; talk returns to saved rest. Boot waits for that texture's pixels and updates the actual face BEFORE revealing the canvas, avoiding raw open-model-mouth first frame. Original attachment bytes remain intact. Export label corrected to Production-08.
- Studio: explicit Idle / bind-T-pose selector, existing PoseRig presets (Stand/Armchair/Cockpit/Bathtub/Surf) and saved poses. Single existing mixer/PoseRig path; bind mode stops clips and persists across tab transitions and workspace Save.
- Dots: Animation/Library and Studio have show/hide control for body IK targets, persisted through workspace Save. A paused Animation dot can be dragged directly; it borrows the existing editor/gizmo and writes the existing frame correction via _handleDrag/_upsertCorrection. Orbit restored on release/cancel. No extra IK solver or transform-control owner.
- Shadow: existing main/LESSONS_SHADOWS recipe and open issue #247 read. Existing fitted/snapped PCFSoft frustum, texel-relative bias and DoubleSide caster policy retained. Replaced the unnecessarily broad near/far span (~60m beyond actor) with useful caster + ground receiver depth coverage. No arbitrary per-prop offset, VSM or blanket caster suppression. This is a ToolBox consumer repair CANDIDATE; it does not close global issue #247 or prove the cropped contact seam is gone.

Tests actually rerun: 27/27 new targeted checks + 21/21 exact-actor hydration regression = 48/48 PASS. Uses actual Three r160 math, original PetMouth and FaceHost methods, Component pose/IK handlers; mocked image delivery and editor DOM pointer events. Covers closed rest save/export/import, original-model decal map/flipY at idle, after speech, texture readiness, wrong fields, bind/Idle/presets/saved pose, direct dot drag writing f7 correction, orbit restoration, visibility/playing guards, tight positive shadow depth, texel bias and repeat stability. Browser/WebGL rendering, before/after photos, orbit/motion contact-surface visual checks NOT RUN; no graphic PASS.
The old 180 source-identity assertions describe the earlier source-cut port and are not current no-code-change claims after these intentional behavior changes.
Remaining original V-244 work: real authenticated Site→GitHub Save for future riggings, full source-parity screenshots/visual shadow review, other issue dispositions. Local workspace Save is still local recovery, not GitHub Save. No Composer build, new renderer, merge, Cloudflare or Live promotion.
Next one gate: inspect actual Site v8 start mouth + Studio modes + paused-dot drag + same-view shadow contact; keep #247 open unless visual integrated evidence passes.

---

## CURRENT REPAIR · 2026-10-14 · Exact attached Georg actor imported on startup

Georg again reported wrong FrizzleBob/missing rigging, supplied two screenshots and a fresh JSON export. Both screenshots inspected directly. Actual attached JSON SHA-256 604449e169dcf522bf6d3d78eb59023ed8ba2de9985fa73141f3ffee79a3873e. Its pets[0] is field-for-field IDENTICAL to the original cut's supplied actor; only document metadata differs. No new rigging values were missing. The Site had never imported that entry on startup and defaulted to Driver Graft. Manual Import also did not switch to a named exported actor before applying its values. These were implementation defects, not a user configuration problem.

Fix: source P08 startup now selects Ear Rig v5 (its explicit source is v5b @23615cff) and hydrates the complete attached entry BEFORE the existing FaceHost/EyeRig mount. Existing saved wrong actor state receives one checksum-versioned migration with a local recovery backup; other actors and scene objects are retained. It awaits the existing hair mount, verifies the actual runtime face/ears/body/lid/hair values via the existing rig exporter against every supplied field, then reveals the canvas. Any missing rig or field mismatch is an explicit error, never a visible default stand-in. A successful import receipt is persisted locally; later edits are not re-overwritten by repeated loading. This is not the future GitHub Save feature.

The original attached bytes are preserved at dist/data/actors/frizzlebob-earrig-v5.georg-2026-10-14.kfb-pets.json and the compatibility equivalent. Import remains supported and now selects a matching known actor BEFORE loading its values. No new face engine, geometry or invented tuning.

Site v7 private deployment succeeded at https://kfb-toolbox.frizzlebob.chatgpt.site/ . Source 801a24fbdea46507ffee39722345e4c8b55ce5b5; deployment appgdep_6acfe0e840fc81918ea453fb4dcccac6; saved version appgprj_6ac2ba44282881919d1a49287a32054e~appgver_c988b8e1ed0c81918136f56bf17cd8fb.
21/21 targeted data-hydration, exact-byte/hash, source rejection, complete configuration, idempotent migration, negative mismatch and Component syntax checks PASS. The runtime verifier was exercised with test doubles, NOT actual WebGL; screenshot parity and actual post-v7 rendering remain NOT VERIFIED. Earlier 180 source-identity tests do not cover these intentional startup changes and were NOT rerun as an unchanged-entry claim.
Evidence inputs: user screenshots Bildschirmfoto 2026-10-14 um 22.00.44.png and 22.02.23.png (Library IDs libfile_ce714fd3ec6881918a67d0619e7934bf / libfile_2dfa79978bb8819181f4f75df1601e1f); JSON libfile_e5b7d4aae3748191b7e05756cc8a39ff. Read their supplied scratch copies, not inferred contents.
Remaining: closed rest-mouth isn't encoded in this unchanged source recipe; V-243 rest/export fix and real GitHub saving remain pending. This import repair does not claim those solved.
Next one gate: reload root once and inspect the actual configured Ear Rig with successful checksum/field receipt, then front/¾/side source parity and the already-authorized fixes. No manual import or reconfiguration should be needed for this startup.
No merge or Live promotion.

---

## CURRENT REPAIR · 2026-10-14 · Driver Graft missing-model URL
Georg observed SOURCE MISSING at the actual Site: /owners/petstudio-v9/assets/models/FrizzleBob_Yellow.gltf returned 404.
Cause: vendored original modules use import.meta.url to resolve model assets; the original remote module base was lost. Corrected only non-JavaScript model-origin resolution in ears.v2, headgraft.v1 and frizzlebob.v4a, at root and /production-08/. Model remains referenced remotely, no binary copied or substituted design.
Source URL: https://raw.githubusercontent.com/georg-doc/kayfabizarro/8922d4b1329fbd47b8754db9dd04ca6b9eb0ee9e/tools/KFB-ToolBox/kfb-rigs-embed-v3/petstudio-v9/assets/models/FrizzleBob_Yellow.gltf
G0: actual tree blob e0a757ece30accabc4c61f1ad11751b15bd06974; actual HTTPS download succeeds and hashes to that exact Git blob. GLTF embeds its buffer and has no external images. The unused Yellow_Gun path is absent at this original source commit; inherited optional gun variant remains SOURCE_REQUIRED, not an invented replacement.
7/7 focused syntax/root+compatibility-identity checks PASS. Updated source-identity checker rerun: 180/180 PASS. No WebGL PASS.
Private Site v6 deployed at https://kfb-toolbox.frizzlebob.chatgpt.site/ ; source eb58059114da126e4b0b97f78de4f8579b0c2758; deployment appgdep_6acfdee1fe788191a0faa1c0477c8172.
Actual Site render after repair NOT VERIFIED here. Reload the page. Other V-244 fixes, exact Georg profile parity and GitHub saving remain pending. Default actor is still source P08 Driver Graft until saved Georg entry is imported; it is not the configured FrizzleBob Ear Rig.
Next gate: actual Site opens without this error, then continue source parity/authorized work. No merge/Live.

---

## CURRENT CORRECTION · 2026-10-14 · Georg: ToolBox means the actual P08 tool

Georg rejected keeping the unrelated link overview as the ToolBox homepage. The root now serves the actual Production-08 authoring UI directly, using the exact candidate index and complete same-origin support, kfb-lib, owners and data directories. No redirect, iframe, redesign or second Site. Root overview JSON removed. /production-08/ retained as compatibility only. Earlier text below saying root router remains unchanged is SUPERSEDED.

Existing Site version 5 private deployment succeeded at https://kfb-toolbox.frizzlebob.chatgpt.site/ . Site source 021670d09ac0156e356363b3f7de1eb189f0f868; saved version appgprj_6ac2ba44282881919d1a49287a32054e~appgver_67570cd7090c81918e6642616be385a7; deployment appgdep_6acfddf108cc8191b95dd45c2189c5c8. Eight root-entry/source/dependency assertions PASS. No new visual/browser proof; existing 180 source/syntax tests unchanged, not rerun. All previously unresolved rigging fixes, source parity and real GitHub saving remain open. This corrects the entry surface only.

Next gate remains TOOLBOX_P08_SITE_SOURCE_PARITY_01, now at the root URL, then continue authorized fixes/save. Georg may open the root to inspect the actual tool; no repeated configuration required. No merge/Live promotion.

---

# V-244 Return · incomplete port candidate · WS0 first
Date: 2026-10-14. Owner: existing KFB ToolBox. Repo: georg-doc/kayfabizarro. Branch: work/toolbox-p08-site-v244-2026-10-14. Draft PR #399, review base docs/kfb-decisions-register-2026-10-11.
Implementation head: 41013280fc0b7db6175f5f5d5a44ead48325c967. Final head is the current ref containing this Return; no self-referential SHA is fabricated.

## Actual result
Source-cut checksums 47/47 PASS. Site candidate uses supplied Production-08 UI/behavior, Georg's exact supplied JSON, 24 original pinned owner modules, selected commit/blob inventory (126 records), and four asset-reference-only adaptations. No new model or face implementation. Composer connection PLAN ONLY complete. 84 files in implementation checkpoint, plus this Return, test report and additive changelog in handoff checkpoint.

Private existing ToolBox Site version 4 deployed successfully. Project appgprj_6ac2ba44282881919d1a49287a32054e.
Site source head b5aec0a61d4b67386179ccd3ac2a21334af3b6fd.
Saved version appgprj_6ac2ba44282881919d1a49287a32054e~appgver_098e418736088191b6786150bbfad87d.
Deployment appgdep_6acfdb13206881918a93259eb58c72e8, status succeeded.
Exact candidate route for WS0: https://kfb-toolbox.frizzlebob.chatgpt.site/production-08/
The root route retains the former v3 router's bytes. Version 4 adds a private QA candidate route; it is not a repaired ToolBox acceptance or Live promotion. Exact route browser opening and visible revision NOT RUN. No screenshot exists. No Cloudflare surface required or used.

## Gates / defects
Acceptance 1 NOT RUN: same-camera front / ¾ / side paired images on the exact assembled actor, with named pose and full ears/feet. Supported control-browser is unavailable in this managed environment. Sites skill explicitly says to skip browser QA without it and forbids a substitute preview/browser-control path. No alternative browser, headless harness or preview server was improvised.
Steps 2 and 3 remain PENDING behind that explicit prerequisite. Closed mouth still preview-only; model brow/nose colours are still not exported; bind switch, v5/v5b IDs, export label, lid control and A4–A16 require the listed fixes/proofs. All are recorded in ISSUE_DISPOSITION.md; no invented won't-fix approvals.
Full dynamic asset/model/optional-scene closure not proven despite selected-family pin inventory.
GitHub save is not implemented. Existing Site source is static and contains no server-side adapter; connected-app eligibility discovery is not exposed. The brief's existing Site→GitHub donor route is SOURCE_REQUIRED. No client token, generic proxy, new persistence service or false Save success.
Source-cut handovers contain a bad baseline path; actual baseline is data/FB_V5_RIG_BASELINE_2026-10-14.json, not handover/… . Future v5c named by Blender is not an existing donor.

## Evidence
180/180 source and syntax assertions PASS (TEST_RESULTS.json, TEST_REPORT.md); 0 runtime/visual/hosted-write tests. Source commit and 84 implementation files fetched back from GitHub with zero diff against the local candidate. Git CLI push failed due absent GitHub credentials; connector write then succeeded and exact remote head/files were verified. One Site packaging attempt needed routine credential renewal; packaging/push/save/deploy then succeeded. No uncertain write was blindly replayed.
Independent Critic / Production Guard NOT RUN. No self-acceptance or global outcome STOP classification.

## WS0 next action — one gate
TOOLBOX_P08_SITE_SOURCE_PARITY_01: in a supported browser-capable WSA environment, open the exact private candidate route and true original cut, import the supplied actor JSON in both, hold identical camera/light/idle sample and capture front/¾/side pairs plus actor/pose/camera receipts. Verify runtime source closure. WS0 checks these before Georg receives a product review. Once passed, continue the already-authorized Step 2 fixes with before/after proof, then real GitHub saving; do not ask Georg to configure the figure again.
Read README.md for exact procedure; ISSUE_DISPOSITION.md for repairs; COMPOSER_CONNECTION_PLAN.md for the one-page recommendation. Do not build Composer.
Georg action now: none. Product is incomplete. No merge or Live promotion.
Central router / Hub product links unchanged because no canonical route or human gate changed; Production Control receives this incomplete handoff for WS0.
