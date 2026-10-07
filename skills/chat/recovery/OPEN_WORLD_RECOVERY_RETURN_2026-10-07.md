# KFB Open World Recovery Return · 7. Oktober 2026

## Was ist kaputt?

Es gibt weiterhin **NO MVP**. Der jüngste Kandidat erzeugt eine Hex-basierte Welt und enthält brauchbare Welt- und Bewegungstechnik. Er erfüllt aber den vereinbarten Gesamtumfang nicht: direkter Editor, Terrain-Bearbeitung, Speichern und die verpflichtenden KFB-Systeme fehlen. Hex bestimmt tatsächlich den sichtbaren Boden und dessen Kollision; das widerspricht dem beschlossenen Continuous Terrain.

## Was können wir retten?

Seed-Erzeugung, Streaming, Bodenbewegung/Kollision, Bewegungsdiagnostik, Straßen-/Flussplanung, Dorf-/Naturplanung, POI-Daten, Asset-Laden und Ereignis-Isolation haben konkrete wiederverwendbare Mechanismen. Aus älterem WB2 sind ein gemeinsamer Editor, additive Terrain-Sculpt-Striche, Speichern/Import und Quellen-Isolation vorhanden. Diese Fähigkeiten werden gezielt übernommen. Eine frühere Gesamtabnahme wird dadurch nicht behauptet.

## Was fehlt zwingend?

Gemeinsamer kontinuierlicher Boden mit konsistenter Stützhöhe/Kollision, stabile Objekt-IDs, echte Authoring-Overrides und frischer Save/Reload. Danach müssen Motion, Joyride/Track, Sky, Drive, Resident/ChatterBox, Card/Almanac, Billboard/HyperNormalisation, Audio und Signature-Kompatibilität in derselben Welt funktionieren. Ihre sichtbaren Quellen müssen vor visueller Übernahme isoliert gezeigt werden. Die Kamera liegt in den vorhandenen Berichten weiter unter dem geforderten Niveau.

## Was ist der Recovery-Weg?

Ein Integrator erhält genau einen Plan: brauchbare Mechanismen bewahren, zuerst Surface Truth und Objektidentität korrigieren, dann den vorhandenen Editor/Sculpt/Store adaptieren und die bestehenden System-Owner anschließen. Kein weiterer zusammengesetzter Kandidat mit verkleinertem Umfang. Alle Pflichtanforderungen bleiben sichtbar. Erst die unabhängige vollständige Produktprüfung mit Authoring, Speichern und frischem Reload erlaubt ein Spiel-MVP.

Die Living-Doc-Ansicht ist jetzt im **bestehenden Hub** verfügbar: [Open World MVP im KFB Hub](https://kfb-production-hub.frizzlebob.chatgpt.site/?view=open-world-mvp). UI/UX, Paper/Dark, Navigation und die übrigen Hub-Bedienelemente sind erhalten. Normale Matrix-/Statusänderungen laufen künftig über GitHub-JSON und Neuladen; der Nachweis ohne erneute Site-Veröffentlichung ist erbracht.

## Was musst du jetzt tun?

Für Hub und Audit: **nichts**. Produktarbeit bleibt angehalten. Der einzige nächste Gate ist die Freigabe genau eines Integrators anhand dieses vollständigen Recovery-Plans; dieser Audit startet keine Runtime-Implementierung. Abschließendes unabhängiges Guard-Routing: **RECOVERY PLAN READY · SAFE TO AUTHORIZE ONE INTEGRATOR**.

## Technischer Nachweis — nur für ausführende Chats

- Repo: georg-doc/kayfabizarro; Owner: KFB Open World / WorldBuilder.
- Audit-Branch: recovery/open-world-master-acceptance-audit-2026-10-07; Draft [PR #373](https://github.com/georg-doc/kayfabizarro/pull/373); coherent checkpoint: 3fee40df562804f1227030743022fc8bc723ba83. Evidence checkpoint: 53c1e48399e7ff561b5058338dfa0deb10cce7cf; final Return commit is recorded by verified PR ref and Production Control closure.
- Protected donor PR #348: 3ea6fbd1f81cfb4ff665f609b27825cd84e18cde; source/runtime remained read-only.
- Exact Dropbox candidate: 5f0cdfa2eb4c6927c50ca399f8dbd62fa79dc3a4 recovered from actual .git ref; 55/55 copied source files matched Dropbox content hashes, six critical rev rechecks unchanged.
- Mandatory classification: **HEX_ROLE = MACRO_TERRAIN_OWNER · ARCHITECTURE DRIFT**. Seam is LARGE and includes mesh, colliders/support, road/river/village contributions, level/walkability/placement consumers and override-aware memo invalidation. No heightProvider-only swap.
- Complete contract: 37 required rows, six explicit nonblockers; 0 GREEN / 14 PARTIAL / 16 MISSING / 4 CONFLICT / 3 UNPROVEN. No row removed or weakened; all 13 future gameplay-critic dimensions retained.
- Recovery critic: separate fresh-context /root/independent_critic; report OPEN_WORLD_RECOVERY_CRITIC_2026-10-07_01. Corrections are synchronized in ledger, Markdown, HTML and live feed. This critic is not the later gameplay critic.
- Existing Hub project: appgprj_6ab7358322a8819183d2fa036b7b12f9. Accepted baseline v10 source1013041360cc9c5cdb1990b4db81fab4e6c28236 loaded from current Sites source before editing.
- Exactly one new publication: **v11**, saved version appgprj_6ab7358322a8819183d2fa036b7b12f9~appgver_9701af82d558819183b84458b100e981, source6d9b51689c67a29b896e925fd4806e144f961ae2, deployment appgdep_6ac62ac353f881919a27f0867e90903e, native status succeeded.
- No-republish proof: main commit3b345b04b2964ba8aff02de9dcd1711872a40ef2 changed **only** kfb-hub/live/open-world-mvp.json revision2026-10-07.3→2026-10-07.4 and updatedAt. Exact live URL showed GitHub LIVE .4 after explicit refresh and full browser refresh. Same v11/version ID/deployment/source before and after; no second publish. Feed later closure metadata is GitHub-only.
- Root published checks: desktop1440×1000, mobile390×844; document scrollWidth390 at width390; zero console errors/warnings. Live board and live CSS retained. All five existing tabs, search/filter/detail/dependency routing, Paper/Dark reload, Pocket Inbox save/reload and Resident-overlay Idle_A were tested locally; no changes to existing browser-state key names.
- Eight meaningful loader tests: live success/no fallback; offline fallback; required:false downgrade rejection; truncated/duplicate-ID rejection; both feeds unavailable; complete all-GREEN derived pass; declared pass cannot override one missing required row. Three inline/external script syntax checks passed. Outage tests are controlled Node VM evidence, not a forced outage of GitHub or a gameplay claim.
- Evidence files: NO_REPUBLISH_PROOF.json; loader-tests.json; desktop/mobile live screenshots; before/after JSON screenshots; independent critic screenshot/report.
- Recovery artifacts: Master Acceptance Matrix, Donor Census, Architecture Freeze Audit, Candidate Source Evidence, Contract Freeze, JSON requirements, synchronized HTML Living Doc, Critic/Guard reports, this Return. Site changes: dist/index.html, open-world-mvp-view.js, open-world-mvp.css, open-world-mvp.fallback.json, SOURCE.json, RETURN.md. Existing runtime support, donor copy, board, overlay modules and local state retained.
- Optional game-dev CLI unavailable; repository/source checks, native Sites and real browser evidence used. Sealed Game Development Studio asset/performance evidence was not required or claimed.

## Unresolved and deferred

- No final integrated game exists; all current product acceptance rows remain nongreen.
- Actual visible donor isolation and current Golden comparison were not performed in this source audit: presentation stays UNPROVEN. Historical source proof and previous scores are separately labeled.
- No finished post-return Architecture Freeze implementation artifact was found; the 24 candidate proposals were classified against current source.
- Current ChatterBox TUNE, HyperNormalisation planning-only runtime gap, Day-only historical Sky control and hardcoded old Drive routes remain explicit integration work.
- Theatre Curtain r3 is a human-accepted donor using three0.186/WebGPU/TSL; old WB2 three0.160/WebGL/CPU tiled implementation is not that donor. Preserve host compatibility hook; if actual reveal is needed, solve backend/resource compatibility without adding a second renderer. Playback remains nonblocking for seamless base streaming.
- No runtime writes, product Site, Cloudflare route, merge or Live promotion. No new model/game strategy or second runtime owner.

## Final routing

**RECOVERY PLAN READY · SAFE TO AUTHORIZE ONE INTEGRATOR**

Guard identity: /root/production_guard. Final report is source-backed and independent; no missing source/product decision blocks the recovery plan. Exactly one next gate: authorize one WorldBuilder Integrator. Current product status stays NO MVP. Future runtime work is not authorized by audit readiness.
