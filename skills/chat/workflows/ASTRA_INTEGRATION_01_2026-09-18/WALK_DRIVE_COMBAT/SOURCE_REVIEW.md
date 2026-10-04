# Free Roam · Source-/Owner-Matrix · 18.09.2026

**REVIEW SNAPSHOT, kein aktiver Integrations-Lock.** Dateien wurden über den GitHub-Connector gelesen. Ein Blob pinnt die gelesene Datei, nicht sämtliche Abhängigkeiten eines Builds. HEAD-Beobachtungen und einzelne Dateilesungen erfolgten nicht atomar. Vor Implementierung erneut vergleichen.

Beobachtete HEADs: kayfabizarro `579391758833253e73ea5daa5ebdc570a031ca0b`, vor Dokumentwrite `874f2f4443213492470fdba8d4d315a912464cb9`; Race `2f4843fa38e8264a3d11ba8f46541bce9a762ef5`; Travel `e763edd5f68bc9bf59a3e416ce45682c616ab0ef`; Arena `f6a59ad15b9ffcf3164b0ab013f223962b63f61f`. Der zwischen den beiden kayfabizarro-HEADs geprüfte Upload ergänzt ausschließlich `tools/2D Animation Studio/_inbox/_Dr_Vorlage.ai`; keine hiesige Runtime-Adoption.

Repository-Kürzel: K = `georg-doc/kayfabizarro`; R = `georg-doc/KFB-Stunt-Car-Race`; T = `georg-doc/KFB-Travel-Globe`; A = `georg-doc/KFB-Combat-Arena`.

| Repo / Datei | Gelesener Git-Blob | Zuständigkeit / Befund und Lesetiefe |
|---|---|---|
| K `skills/chat/workflows/ASTRA_INTEGRATION_01_2026-09-18/WALK_DRIVE_COMBAT_PREFLIGHT.md` | `d52c27ced986cedcd7057e8abb22daaa49b63ab6` | Vollständiger begrenzter Auftrag einschließlich §7/Startprompt; kein Runtime-Auftrag vorweg. |
| K ebenda `EXECUTION_BRIEF.md` | `c1a6356a1a6ff69a6aea3950d21e0005eddbd8fd` | Maßgebliche r3-Abschnitte World, Gates, Import, Arena, Ausführung gelesen; bleibt unverändert. |
| K ebenda `DELIVERY_CONTRACT.md` | `4313457743d41ff472936f422d5e355d4beb6b27` | Vollständig: echte ChatGPT-Site UND KFB-Cloudflare bei späterer Runtime-Auslieferung. |
| K `skills/chat/SYNC_PROTOCOL.md` | `c8af4c66b3f7ce2cd1da985fea617b578d602575` | Vollständig; vorhandene Owner und additive, explizite Übergaben. |
| K `skills/chat/PRODUCTION_SOP.md` | `c4282db22025a93803cc3377b47908c0c47e4029` | Vollständig; Reuse, kleine sichtbare Beweise, keine humanen Abnahmen aus Zahlen. |
| R `RECOVERY.md` | `66ae2133f0ee16d2989abcc8a41fae924c9adf45` | Aktueller Override und Lane-Grenzen; v0.8-Feel akzeptiert, andere Human-Gates separat. Audio-Quellstatus hier nicht durch neue vollständige Inboxsuche aufgelöst. |
| R `race/CONTRACT.md` | `d9e29a4ff6906af18684c56f87ae63b6c6a28589` | Vollständig: ein Host, STEP=1/60, Three 0.160.0/Rapier 0.17.3, Physikpose, Kamera, Events und Acquisition getrennt. |
| R `race/src/physics.js` | `1e5df99cc18d3c3156f84af25a1cf5bcbdfb4fd2` | Vollständiger Bewegungscode einschließlich Snapshot/Return gelesen: dynamisches Chassis, vier Rays; feste Gravity/Regionen/Checkpoints; kein Boost, kein eigener Reverse-Cap/Neutral-Dwell. Nicht ausgeführt. |
| R `ChatGPT_web/track-environment-lab/host/feel-lab-v08.mjs` | `84d71552ebe17b7332b18305bb111136ec746577` | Route/Frame-Aufbau, vollständiges step/Controls/Kamera/Telemetry gelesen; nicht gesamte Modell-/World-Darstellung inventarisiert. s/x-Streckenmodell, Q/E, Shift, Space, R. |
| R `race/SOURCES.json` | `20aa9290e3219aae54e2a55a0bcc90a83928dd03` | Vollständig; vorhandener Kart-oobi-Spender/Provenance, keine neue Fahrzeugbibliothek. Endgültigen Assetpfad im tatsächlichen Receiver schließen. |
| T `WSA_START.md` | `76d5be019ec5365520cfe12088d024b3880c7f73` | Aktuelle Ground=8-/Atlas-Gates und Ownerdelta gelesen; DRIVE deferred. |
| T `travel/CONTRACT.md` | `f61494659b8e111c261c59acd1aa58e01c9edd7c` | Vollständig; bestehende Welt-/Terrain-/Flight-/Licht-/Audio-Owner. |
| T `_handover/WORLD_BUILDER_GOD_MODE_2026-09-17/REUSE_MATRIX.md` | `cb18648c3cf68f8654019b06eb833e2ce2ced2a5` | Vollständig; WB0-Ground-Adapter und ausdrückliches DRIVE-Delta statt stiller Ownerwechsel. |
| T `site/world-builder/runtime-mode.js` | `1c55d1592cfc5d32c325be8992ed88f503ae0cf1` | Vollständig; nur GROUND/FLIGHT; kein transaktionales DRIVE, kein erwiesener Rollback nach Teleportfehler. |
| T `site/world-builder/ground-controller.js` | `4a3793ec250afa8debbdc1504d1e08f2f3444247` | Anfang/Parameter/Tangentenbasis gelesen; bodyHeight=0.022, Radius-Default5, vorhandene Ground-Controls. Keine vollständige neue Laufprüfung. |
| T `site/world-builder/support-surface.js` | `49a095a5b9be2ce867f4b05165587a3e38598465` | Vollständig; höchste geeignete radiale Fläche, nicht Unterfahrt/Wand/Freivolumen. |
| T `site/world-builder/world-recipe.js` | `080263866129a85d42d26ceee88fdbf2f4614c2e` | Vollständig; schema/Storage/Anker; Normalisierung ist kein Versionsvalidator, Import speichert vor Asset-Consumerbeweis. |
| T `_handover/WORLD_BUILDER_GOD_MODE_2026-09-17/MOVEMENT_IN_CONTEXT_REVIEW_2026-09-18.md` | `ee6c5af558197d76773935e74fe0d866ce5f17e5` | Review vollständig gelesen, keine eigene Clipvermessung. Modernes Motion-Pin `10a7fdce6b3a1ae22504ade71b7dbec5f25e0ff0`; rückwärts lenkendes Auto ist kein Backward-Walk-Clip. |
| A `WSA_START.md` | `7f75b5a49512e0169492ff93e9537e1396f7b978` | Vollständig; ursprüngliche 5A/A1-Quelle/Owner, kein gebautes World-Portal. |
| A `combat-arena-v2/player.v2.js` | `0947923f178bc5f2187086e99c5a1fc3601a44c7` | Aktuelle Zeilen200–284 direkt: prepareGun/gunReady/schuss/cancelShot; Action.time/Weight und Clipmarker1/24. Kein entkoppelter Combat-Adapter nachgewiesen. |
| K `tools/world_atlas/source/lib/kit-lab.js` | `964d4187665f1786067ff5917de80df5f086fc91` | PACKS, Loader/Measurement und buildScene gelesen. buildScene kann Fehler überspringen; kein Vollständigkeitsbeweis. |
| K `tools/world_atlas/source/scenes/city-block.js` | `be8364bd6dec7b423d6cf3c48163e73fffd5d471` | Vollständig gelesen, lokal originaler Blob bestätigt und Rezept ausgeführt. 134 Platzierungen, zwei Doppelbelegungen. |
| K `tools/KFB-ToolBox/_handover/STAGE_FIRST_V1_INTAKE_2026-09-18/START_HERE.md` | `17d994c4381c1a19c1af5b090568323fba8d1044` | Intake gelesen; Export vorhanden, Funktions-/Browserprüfung offen. ZIP nicht selbst entpackt, nicht vollständige ToolBox-Runtime gelesen. |

Zusätzlich: Arena `_handover/C0_REENTRY/OWNER_MAP.md` als **historischer Source-Audit** am Commit `bd01a150d26d572017365a2288c179bdfd830079` gelesen. Seine Root-/Host-/Gunfight-/Rewards-/Runflow-Aufteilung dient als gezielte Lesekarte, nicht als neue Vollprüfung des aktuellen Host-Wirings.

## Assetquelle, keine zweite Ablage

Atlas-Pin: **`8948a06b75cb18c970599afb29b6a772315fad0e` in K**. Der Loader referenziert vorhandene KayKit City Builder, Kenney Commercial, Kenney Suburban, Kenney City Roads und Racing-Kit-Pfade. Roads- und KayKit-City-GLTF-Verzeichnisse am Pin direkt abgefragt. Keine GLB-Geometrie oder Texture-/BIN-Vollständigkeit neu gemessen.

Konkrete KayKit-Dateien am Pin (Metadatenbeweis):

- `media/3D_Assets/KayKit_City_Builder_Bits_1.0_FREE/Assets/gltf/bench.gltf` → `33a9bcdac5c62f6c8faaa20140d91e671d313d8f`;
- zugehöriges `bench.bin` → `58206243d5cadf202aca63ba2e667ab13c8dc9aa`;
- `base.gltf` → `422da3dc6e8d5c9ab9670aee4a02043261be7c0f`, `base.bin` → `a570cfcacd0eb1c4019bf82459faba42fd514a0f`.

Damit ist die alte ZIP-only-Notiz des City-Rezepts widerlegt. Ein fertiges befahrbares KayKit-Quartier oder vollständige Sidecar-Closure folgt daraus nicht. Der Bauauftrag referenziert Originalpfade; keine Modelle, Texturen oder Fonts werden kopiert.
