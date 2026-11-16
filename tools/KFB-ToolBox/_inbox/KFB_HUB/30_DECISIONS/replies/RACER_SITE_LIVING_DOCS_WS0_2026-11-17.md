# WS0 · Racer + Claude Design · Übergabe und Living Document · 2026-11-17

Georgs Auftrag umgesetzt: kurze Claude-Übergabe, dauerhafte WIP-/Next-Steps-Dokumentation, spielbare Site mit Projektübersicht und modularer Austauschvertrag. Keine Hauptgame-Änderung, keine Merge-/Live-Promotion.

## Direkt weiterarbeiten
- [Private spielbare Site](https://kfb-racer-open-world.frizzlebob.chatgpt.site)
- [Werkstatt / 13 Bausteine mit Status, Owner und nächstem Schritt](https://kfb-racer-open-world.frizzlebob.chatgpt.site/project.html)
- [WS0: vollständiger WIP, Grenzen, Modultransfer und Next Steps](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/e86f92ca5647edb9060327b3fb86ae48004f5508/KFB_HUB/30_DECISIONS/replies/RACER_KERN_R1/WS0_RACER_LIVING_HANDOFF_2026-11-17.md)
- [Claude: Buntstift zuerst, danach Aquarell](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/e86f92ca5647edb9060327b3fb86ae48004f5508/KFB_HUB/30_DECISIONS/replies/RACER_KERN_R1/CLAUDE_DESIGN_DRAWING_HANDOFF_2026-11-17.md)
- [Aktive Aufgaben + Rücklieferungen · Issue #133](https://github.com/georg-doc/KFB-Stunt-Car-Race/issues/133)
- [Maschinenlesbarer Meilenstein](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/e86f92ca5647edb9060327b3fb86ae48004f5508/KFB_HUB/30_DECISIONS/replies/RACER_KERN_R1/RACER_LIVING_STATE.json)
- [Sechs verifizierte Quellpakete / Original-Lizenzen](https://github.com/georg-doc/kayfabizarro/blob/b520c0ab4c57933b264b4b997c0a8a1c97770fbe/tools/KFB-ToolBox/_inbox/KFB_PATCH_DESIGN_DONORS_R1_2026-11-16/README.md)

## Tatsächlicher Stand
R3-Spiel: zwei echte Orte, Track Core/Joyride-Kreisverkehr+Netz,16Varianten/15Originalmodelle, gemeinsamer VFX/SFX-/Vehicle-Lifecycle. Numeric/gameplay acceptance remains [R3 Return](https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/e12e1aa2926766bf42a86e5cac0e586b1a10b114/KFB_HUB/30_DECISIONS/replies/RACER_KERN_R1/RETURN_SITE_R3.md). Dieses Docs-Slice ändert keine Fahrlogik; R3-Laufzeitchecks wurden nicht erneut durchgeführt.

Offen sichtbar: fünf feste KFB-Reifengeometrien, neun geerdete Hoverversuche, Mensch-/Geräteperformance, größeres Straßennetz, Lowpoly/Fernwald-Anbindung, Crowds-Impact-Adapter, WebGPU-Partikelentscheidung, Zeichenshader-Integration. Keine Quellenbeschaffung als Game-Integration ausgeben. Ein P2-Ray-Präzisionsfall bleibt quarantined.

## Pflege und Austausch
Issue #133 ist die aktive Arbeitsliste. Der versionierte JSON-Meilenstein auf racer/kern-r1 wird beim sinnvollen Meilenstein in die bestehende Site übernommen; sichtbares Snapshotdatum, keine behauptete automatische Synchronisierung. Einzelne TODO-Änderungen verursachen keine Hub/Cloudflare-Veröffentlichung.
Racer→WS0: schlanke RoadRecipe/Surface-/Vehicle/VFX/SFX-Adapter. WS0→Racer: vorhandene Surface Truth, Fernwald, Hover, genehmigte Materials/Deformers/Light/Audio. Claude→beide: reversible Materialrezepte über vorhandene Owner.
Pro Transfer: exakter Source-/Receiving-Pin, Lizenz, init/update/dispose/reset, Koordinaten/Attribute/Shaderhooks, tatsächliche Source-Isolation+Tests, Rücklieferung und Readiness. Erst Receiving-PASS ändert Integrationsstatus. Keine zweite Welt/Clock/Kamera/AudioContext, private Assets bleiben privat.

## Native Veröffentlichung / tatsächliche neue Checks
- Site-Projekt appgprj_6afb696ed0748191adfb37df6e9cdac8, bestehendes owner-only Publikum erhalten, Version5.
- Gepushter Site-Source main@82c59263c3a24f8b151f0b8f480650f366d03fcf.
- Saved version appgprj_6afb696ed0748191adfb37df6e9cdac8~appgver_147440fd18008191a21d22fe6f2d34e0.
- Native deployment appgdep_6afb93db54b48191bba269613cb7b6e6 SUCCEEDED;2026-11-16T23:38:19.715924+00:00. Bestehende Site/Library-Identität aktualisiert, keine Duplikat-Site.
- project.js syntaxPASS;13eindeutige JSON-IDs/Owner/Status/Next/Quelle; Source- und built-JSON identisch; npm buildPASS82Module (vorhandene Warnungen).
- Browser1280×800 und390×844:13Zeilen, keine horizontale Überbreite; Filter13/11/2, Spiel↔Werkstatt-Navigation, errors[]; Screenshots evidence/living-docs im privaten Site-Source.
- Browser-Handoff zur exakten neuen Privat-URL zeigt im abgemeldeten Prüf-Browser korrekt ChatGPT-Anmeldung. Kein angemeldeter Hosted-Interactive-PASS behauptet.
- Neue Dateien project.html,src/project.{js,css},public/project/{2Handoffs+JSON},LIVING_DOCS_RETURN.md,evidence/living-docs; index.html/Vite-entry/README aktualisiert.
- Receiving-Docs auf racer/kern-r1@e86f92ca5647edb9060327b3fb86ae48004f5508 nach jedem Write exact-head+file zurückgelesen. Issue133 ebenfalls exakt zurückgelesen. Hauptgame game/integration-r2 beim Start gelesen@abe7bc24f02147dfcd785bf60feaae574aa13779; vor späterer Umsetzung neu lesen.

Nächster produktiver Schritt: Claude baut den Buntstift-Schalter an einem echten statischen und vorhandenen deformierten Objekt, Originalstil reversibel, Schatten/Resize/Desktop/Mobil geprüft, Receiving-Commit+Adapter zurückliefern. WS0 kann danach seinen vorhandenen Hauptgame-Anschluss gezielt übernehmen; kein weiterer Quellenzugriffsgate.
