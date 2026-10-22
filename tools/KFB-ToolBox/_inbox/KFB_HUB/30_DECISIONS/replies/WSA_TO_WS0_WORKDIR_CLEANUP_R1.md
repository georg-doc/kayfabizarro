# WSA → WS0 · Arbeitsordner-Inventur R1 · 22.10.2026

**NUR INVENTUR. Nichts gelöscht, verschoben, bereinigt, neu gebaut oder veröffentlicht. ToolBox bleibt auf Georgs Anweisung pausiert.**

Umfang: `/Users/georgv.westphalen/.codex/.chatgpt-projects/g-p-6aa43ccf8750819191582c384993f2c1/work`. 95 unmittelbare Einträge (79 Ordner, 16 Einzeldateien), 36.472301 GiB = 39.162 GB. Scan: 22.10.2026 16:29 CEST. Andere Projektordner, `sources/`, Browserdaten, Dropbox und weitere Laufwerke wurden nicht in die Speicherbilanz aufgenommen.

## Summen ohne Doppelzählung

| Gruppe | GiB | Zuordnung |
|---|---:|---|
| **behalten** | **15.179520** | 58 unmittelbare Einträge |
| **doppelt** | **7.652725** | 1 unmittelbare Einträge |
| **Zwischenstände** | **0.784977** | 2 unmittelbare Einträge + 4 getrennt bilanzierte Cache-/Projektionspfade |
| **unklar** | **12.855080** | 34 unmittelbare Einträge |
| **Gesamt** | **36.472301** | 95 Einträge vollständig zugeordnet |

Die Spalte „Ordner gesamt / Gruppenanteil“ unten zeigt bei gemischten Ordnern beide Werte. Vier verschachtelte Zwischenstände wurden vom jeweiligen Eltern-Gruppenanteil abgezogen und nur einmal bei Zwischenstände addiert. Ein Elternordner mit „behalten“ oder „unklar“ wird dadurch ausdrücklich nicht insgesamt löschbar.

## Wesentliche Befunde

- Größter nachgewiesener Doppelbestand: `kayfabizarro-voice-r1`, 7,652725 GiB. Der heute gelesene GitHub-Branch enthält den lokalen Commit. Ein späterer Löschschritt müsste zunächst den dann aktuellen Zustand und eventuell hinzugekommene Dateien erneut prüfen.
- `kayfabizarro-deploy-audit` (31 registrierte Worktrees), `kayfabizarro-toolbox-production-03` (13), `wsa-hub-update-2026-10-09` (2), `open-world-integrator-2026-10-07/receiving` (2) und `kfb-toolbox-source-diag-2026-10-22` (2) enthalten zentrale Git-Datenbanken. Registrierte Pfade schließen historische/stale Pfade ein. Kein Git-Prune, kein Entfernen einer gemeinsamen Datenbank.
- `kfb-audio-interaction-states`: lokal `13c8750173e5e52af3d357f981159c9f740b032e`; erreichbarer Branch `chatgpt-web/kfb-jukebox-catalog-01-audio-site-2026-10-04` @ `baa76264882b5c2ec1cac49ac5ec4f248e32f431`. GitHub-Compare liefert 404. Ursache offen; keine Sicherung behauptet.
- `v538`: lokal `e466995404e585a0cd72bebe359246b2c0e6e995` und `9791df2b1187b7df9b47cb5c7ce2b8ce09d14cdf`; heute erreichbarer privater Branch `intake/v538-2026-10-18` @ `945c6a00f831b670db7fd02f9fa02975de24fb8e`. Lokale Tracking-Refs sind hier ausdrücklich kein aktueller Remote-Beleg.
- FB R1/R2/R3, unfreigegebene R4-Quellen, P08, Postmortem und Pause-Paket sind geschützt. R2/R3 bleiben FAIL; Sicherung bedeutet keine Figurenfreigabe. R3 hat drei lokal zusätzliche Exportvarianten, die im Dropbox-Paket nicht vorliegen.
- `dist/` wurde nicht pauschal als Buildmüll eingestuft. In den Sites-Checkouts liegen dort tatsächlich bearbeitete Anwendungsquellen. Auch archivierte Fehlerpakete bleiben Belege.

## Vollständiges Inventar je unmittelbarem Unterordner

Größen in GiB; letzte Änderung = jüngster rekursiver Datei-/Verzeichnis-Mtime, nicht Commitdatum. Die Auflistung fasst den Inhalt zusammen, nicht jede einzelne Datei. Exakte lokale Git-Heads/Branches folgen im Anhang. „Remote-Nachweis offen“ heißt: der lokale Commit ist bekannt, seine vollständige externe Sicherung wurde nicht bestätigt.

### behalten

| Ordner | Gesamt / Gruppenanteil GiB | Letzte Änderung CEST | Inhalt | zusätzliche Sicherung / Befund |
|---|---:|---|---|---|
| `audio-combat-audit-r1/` | 0.000717 | 18.10.2026 15:00 | AUDIT.json, README.md, WS0_GAPS.json, audit.mjs, event-donor-source.json, source-metadata.json | Keine vollständige Zweitsicherung nachgewiesen. Quellen, lokaler Änderungsstand oder Prüf-/Fehlbelege; vollständige Zweitsicherung nicht nachgewiesen. |
| `audio-combat-runtime-audit-r1/` | 0.000061 | 18.10.2026 15:18 | README.md, REPORT.json, test.mjs | Keine vollständige Zweitsicherung nachgewiesen. Quellen, lokaler Änderungsstand oder Prüf-/Fehlbelege; vollständige Zweitsicherung nicht nachgewiesen. |
| `audio-flight-runtime-audit-r1/` | 0.000092 | 18.10.2026 17:21 | README.md, REPORT.json, baseline-racer-manifest.json, test.mjs | Keine vollständige Zweitsicherung nachgewiesen. Quellen, lokaler Änderungsstand oder Prüf-/Fehlbelege; vollständige Zweitsicherung nicht nachgewiesen. |
| `audio-flight-source-audit-r1/` | 0.000050 | 18.10.2026 17:10 | README.md, REPORT.json, audit.mjs, source-metadata.json | Keine vollständige Zweitsicherung nachgewiesen. Quellen, lokaler Änderungsstand oder Prüf-/Fehlbelege; vollständige Zweitsicherung nicht nachgewiesen. |
| `audio-footsteps-isolated-audit/` | 0.094898 | 18.10.2026 17:42 | .git, .openai, FLIGHT_CRASH_R1_BRIEF.md, FOOTSTEPS_CONTACT_SITE_PATCH.diff, FOOTSTEPS_R2_SITE_PATCH.diff, WSA_COMBAT_DESTRUCTION_R1_RETURN.md, WSA_FLIGHT_CRASH_R1_RETURN.md … (16 Einträge) | lokal `audio-footsteps-isolated-audit` @ `f0ae805e4b76fd1a02e2cf6416505a836d677bec` (geändert); Remote-Nachweis offen Quellen, lokaler Änderungsstand oder Prüf-/Fehlbelege; vollständige Zweitsicherung nicht nachgewiesen. |
| `audio-footsteps-r2-v430-source/` | 0.023113 | 18.10.2026 00:39 | .git, .openai, FOOTSTEPS_R2_SITE_PATCH.diff, dist, pool-panel.html, qa-fixtures, qa-pool-results.txt … (10 Einträge) | lokal `audio-footsteps-r2-v430-source` @ `6c2b672506f9df38bf3b448dc7e3b828a56a7380` (geändert); Remote-Nachweis offen Quellen, lokaler Änderungsstand oder Prüf-/Fehlbelege; vollständige Zweitsicherung nicht nachgewiesen. |
| `audio-racer-audit-r1/` | 0.000046 | 18.10.2026 15:10 | README.md, REPORT.json, test.mjs | Keine vollständige Zweitsicherung nachgewiesen. Quellen, lokaler Änderungsstand oder Prüf-/Fehlbelege; vollständige Zweitsicherung nicht nachgewiesen. |
| `audio-v389-source/` | 0.008751 | 17.10.2026 04:59 | .git, .openai, dist, pool-panel.html, qa-fixtures, qa-pool-results.txt, qa-pool.mjs … (9 Einträge) | lokal `audio-v389-source` @ `3e5849b0a0375664e9463a5663bbdcfec1847f4c` (sauber); Remote-Nachweis offen Quellen, lokaler Änderungsstand oder Prüf-/Fehlbelege; vollständige Zweitsicherung nicht nachgewiesen. |
| `billboard-island-integration-01/` | 0.010471 | 01.10.2026 02:08 | .git, .github, kfb-hub, media, registry, skills, tools | lokal `billboard-island-integration-01` @ `ee3fb84380ad8d3ff3f6d0f5de5c14454efe9582` (geändert); Remote-Nachweis offen Quellen, lokaler Änderungsstand oder Prüf-/Fehlbelege; vollständige Zweitsicherung nicht nachgewiesen. |
| `chatterbox-pr357-gpt-site-fix/` | 1.905426 | 10.10.2026 07:12 | .DS_Store, .git, .gitignore, .nojekyll, KAYFABIZARRO Design System.zip, KFB Boxel Blitz, KFB Combat Arena … (26 Einträge) | lokal `chatterbox-pr357-gpt-site-fix` @ `6b1db4fccfc1dbb1437638160476b306e17c9ddc` (geändert); Remote-Nachweis offen Quellen, lokaler Änderungsstand oder Prüf-/Fehlbelege; vollständige Zweitsicherung nicht nachgewiesen. |
| `chatterbox-pr357-gpt-site-fix-clean/` | 0.059772 | 10.10.2026 07:12 | .DS_Store, .git, .gitignore, .nojekyll, KAYFABIZARRO Design System.zip, KayfaBizarro Rule Book (2).zip, KayfaBizarro_MedKayfab_v19.0_DE.docx … (18 Einträge) | lokal `chatterbox-pr357-gpt-site-fix-clean` @ `9198fda5f6bc90319a55956a52ed87d784b21300` (geändert); Remote-Nachweis offen Quellen, lokaler Änderungsstand oder Prüf-/Fehlbelege; vollständige Zweitsicherung nicht nachgewiesen. |
| `fb-canon-evidence-2026-10-22/` | 0.000076 | 22.10.2026 13:02 | P08-import-stop.png, WSA_TO_WS0_FB_CANON_R1_RETURN.md | R1-Return im Register dokumentiert; vollständige Zweitsicherung des Ordners inkl. Screenshot hier nicht verifiziert. Quellen, lokaler Änderungsstand oder Prüf-/Fehlbelege; vollständige Zweitsicherung nicht nachgewiesen. |
| `fb-canon-evidence-r2-2026-10-22/` | 0.009754 | 22.10.2026 13:47 | FB_CANON.disk-reimport.receipt.json, FB_CANON.export-reimport.receipt.json, FB_CANON.glb, FB_CANON.sha256, ToolBox-FB_CANON-R2.patch, WSA_TO_WS0_FB_CANON_R2_RETURN.md, images | Lokale Dropbox-Kopie `/Users/georgv.westphalen/Dropbox/CLAUDE/KFB_HUB/50_BLENDER/FB/_wsa_canon_r2_2026-10-22`: 13 SHA-256-Gleichheiten, 0 lokal zusätzliche Dateien; Cloud-Sync nicht bestätigt. Quellen, lokaler Änderungsstand oder Prüf-/Fehlbelege; vollständige Zweitsicherung nicht nachgewiesen. |
| `fb-canon-evidence-r3-2026-10-22/` | 0.028347 | 22.10.2026 14:43 | FB_CANON.binary-audit.json, FB_CANON.first-pass.glb, FB_CANON.glb, FB_CANON.mask-pass.glb, FB_CANON.receipt.json, FB_CANON.second-pass.glb, HANDOFF.json … (12 Einträge) | Lokale Dropbox-Kopie `/Users/georgv.westphalen/Dropbox/CLAUDE/KFB_HUB/50_BLENDER/FB/_wsa_canon_r3_2026-10-22`: 24 SHA-256-Gleichheiten, 3 lokal zusätzliche Dateien; Cloud-Sync nicht bestätigt. Quellen, lokaler Änderungsstand oder Prüf-/Fehlbelege; vollständige Zweitsicherung nicht nachgewiesen. |
| `fb-canon-r1/` | 0.045601 | 22.10.2026 15:12 | .git, .gitignore, .openai, README.md, ROSTER_R1.md, dist | lokal `fb-canon-r1` @ `afb97250a49dcc5dc0ea1ab1a82d332143b0fe6d` (geändert); Remote-Nachweis offen Pausierter, uncommitted/unpushed R4-Versuch einschließlich ignorierter QA-Assets; geschützt, keine Annahme als Canon. |
| `g4-bridge-source-audit-r1/` | 0.007404 | 11.10.2026 03:17 | BRIDGE_BYTE_LOCK.json, BRIDGE_SOURCE_CARD.jpg, BRIDGE_SOURCE_METRICS.json, CHANGELOG.md, MANIFEST.json, PARTS.md, PRISON_AFTER_BRIDGE.md … (14 Einträge) | Keine vollständige Zweitsicherung nachgewiesen. Quellen, lokaler Änderungsstand oder Prüf-/Fehlbelege; vollständige Zweitsicherung nicht nachgewiesen. |
| `g4-stairs-form-r3/` | 0.023029 | 11.10.2026 02:16 | ATTACH_R1, ATTACH_R1_PACKAGE_RECEIPT.json, FORM_R3, KFB_G4_FORM_R3_REVIEW_FAILURE_PACKET_2026-10-11.zip, KFB_G4_R3_B_ATTACHMENT_REVIEW_2026-10-11.zip, LOCAL_PACKAGE_RECEIPT.json, working | Keine vollständige Zweitsicherung nachgewiesen. Quellen, lokaler Änderungsstand oder Prüf-/Fehlbelege; vollständige Zweitsicherung nicht nachgewiesen. |
| `hub-workplaces-2026-10-17/` | 0.000019 | 17.10.2026 06:35 | compact-editor-proof.webp, status-source.json | Keine vollständige Zweitsicherung nachgewiesen. Quellen, lokaler Änderungsstand oder Prüf-/Fehlbelege; vollständige Zweitsicherung nicht nachgewiesen. |
| `island-mvp-r4/` | 0.180965 | 08.10.2026 02:06 | .DS_Store, .git, .gitignore, .nojekyll, .r4-review, KAYFABIZARRO Design System.zip, KayfaBizarro Rule Book (2).zip … (21 Einträge) | lokal `island-mvp-r4` @ `e31005f5cca79d675d717709a38af63aaaf339e1` (geändert); Remote-Nachweis offen Quellen, lokaler Änderungsstand oder Prüf-/Fehlbelege; vollständige Zweitsicherung nicht nachgewiesen. |
| `island-mvp-r4-site/` | 0.008282 | 08.10.2026 01:28 | .git, .openai, FROZEN_CANDIDATE_SOURCE.json, README.md, dist | lokal `island-mvp-r4-site` @ `615df460fbee99561f294439d2963baa7cb2d5b5` (geändert); Remote-Nachweis offen Quellen, lokaler Änderungsstand oder Prüf-/Fehlbelege; vollständige Zweitsicherung nicht nachgewiesen. |
| `kayfabizarro-deploy-audit/` | 2.107025 | 10.10.2026 07:11 | .git | lokal `kayfabizarro-deploy-audit` @ `5650b6c54d8789b20ea80abe857688173d506d3b` (geändert); Remote-Nachweis offen Zentrale Git-Datenbank mit abhängigen Worktrees; nicht als einzelne Repo-Kopie behandeln. |
| `kayfabizarro-toolbox-production-03/` | 3.017750 | 05.10.2026 02:05 | .git, kfb-hub, skills | lokal `kayfabizarro-toolbox-production-03` @ `9cc31312cb07bff80e160a5a8150eda067e81bb2` (sauber); Remote-Nachweis offen Zentrale Git-Datenbank mit abhängigen Worktrees; nicht als einzelne Repo-Kopie behandeln. |
| `kayfabizarro-voice-r1-source/` | 0.057735 | 10.10.2026 20:44 | .DS_Store, .git, .gitignore, .nojekyll, KAYFABIZARRO Design System.zip, KayfaBizarro Rule Book (2).zip, KayfaBizarro_MedKayfab_v19.0_DE.docx … (17 Einträge) | lokal `kayfabizarro-voice-r1-source` @ `99c749c630cfbcf11f6f6be9c2959ef54b4af150` (geändert); Remote-Nachweis offen Quellen, lokaler Änderungsstand oder Prüf-/Fehlbelege; vollständige Zweitsicherung nicht nachgewiesen. |
| `kayfabizarro-world-flight-clay-c0/` | 0.156673 | 27.09.2026 19:02 | .git, .github, kfb-hub, skills, tools, world-drive-interact-m2a-proof, world-flight-clay-c0-proof … (10 Einträge) | lokal `kayfabizarro-world-flight-clay-c0` @ `f24bb0ac4483e6dda6d5215cfd75d99c7ad26c7b` (geändert); Remote-Nachweis offen Quellen, lokaler Änderungsstand oder Prüf-/Fehlbelege; vollständige Zweitsicherung nicht nachgewiesen. |
| `kfb-audio-adaptive-pr365/` | 0.060398 | 06.10.2026 04:57 | .DS_Store, .git, .gitignore, .nojekyll, KAYFABIZARRO Design System.zip, KayfaBizarro Rule Book (2).zip, KayfaBizarro_MedKayfab_v19.0_DE.docx … (18 Einträge) | lokal `kfb-audio-adaptive-pr365` @ `f6745cc889295dee25739647689e13431d5b651f` (geändert); Remote-Nachweis offen Quellen, lokaler Änderungsstand oder Prüf-/Fehlbelege; vollständige Zweitsicherung nicht nachgewiesen. |
| `kfb-character-save-r1/` | 0.000164 | 18.10.2026 00:41 | README.md, TEST_REPORT.json, WSA_GITHUB_SAVE_R1_RETURN.md, character-proposals.test.mjs, character-proposals.v1.mjs, character.fixture.json, figure.fixture.json … (8 Einträge) | Keine vollständige Zweitsicherung nachgewiesen. Quellen, lokaler Änderungsstand oder Prüf-/Fehlbelege; vollständige Zweitsicherung nicht nachgewiesen. |
| `kfb-dramatis-personae-r1/` | 0.010258 | 18.10.2026 02:35 | WSA_DRAMATIS_PERSONAE_R1_RETURN.md, asset-site, audio-provenance.json, check-personae.mjs, completion.json, frizzlebob.png, gallery.png … (13 Einträge) | lokal `kfb-dramatis-personae-r1/asset-site` @ `7d1a363c7f2aaafea6e8e925d3b5c47b631fa345` (sauber); Remote-Nachweis offen Quellen, lokaler Änderungsstand oder Prüf-/Fehlbelege; vollständige Zweitsicherung nicht nachgewiesen. |
| `kfb-normal-webchat-test-r1/` | 0.000099 | 18.10.2026 04:10 | proofs | Keine vollständige Zweitsicherung nachgewiesen. Quellen, lokaler Änderungsstand oder Prüf-/Fehlbelege; vollständige Zweitsicherung nicht nachgewiesen. |
| `kfb-search-dory-r1/` | 0.000366 | 18.10.2026 02:36 | WSA_DORY_WEBCHAT_SEARCH_R2_RETURN.md, proofs, search.test.mjs | Keine vollständige Zweitsicherung nachgewiesen. Quellen, lokaler Änderungsstand oder Prüf-/Fehlbelege; vollständige Zweitsicherung nicht nachgewiesen. |
| `kfb-tool-cleanup-r1/` | 0.013500 | 17.10.2026 03:38 | build-fixture, build_cleanup.py, check-results.json, check_cleanup.mjs, completion.json, deliverables, donor-motion … (18 Einträge) | lokal `kfb-tool-cleanup-r1/old-hub` @ `fcd817798f5dbdefd444419e73dcbbded23ba8c0` (sauber); Remote-Nachweis offen Quellen, lokaler Änderungsstand oder Prüf-/Fehlbelege; vollständige Zweitsicherung nicht nachgewiesen. |
| `kfb-toolbox-roster-r1/` | 0.000652 | 17.10.2026 13:16 | WSA_TOOLBOX_ROSTER_R1_RETURN.md, proofs | Keine vollständige Zweitsicherung nachgewiesen. Quellen, lokaler Änderungsstand oder Prüf-/Fehlbelege; vollständige Zweitsicherung nicht nachgewiesen. |
| `kfb-toolbox-source-diag-2026-10-22/` | 0.059139 | 22.10.2026 15:15 | .git, .openai, README.md, ROSTER_R1.md, dist, work | lokal `kfb-toolbox-source-diag-2026-10-22` @ `53028aa47de97cf1c5791cdc72501212a5785094` (sauber); Remote-Nachweis offen Gemeinsame Git-Datenbank des pausierten FB-Checkouts; geschützt. |
| `kfb-webchat-authoring-r1/` | 0.000229 | 18.10.2026 01:21 | CONTRACT.md, TEST_REPORT.json, WSA_WEBCHAT_AUTHORING_R1_RETURN.md, authoring-contract.mjs, authoring.test.mjs, edit-site.py, kfb-triplets-0.4.0.zip … (10 Einträge) | Keine vollständige Zweitsicherung nachgewiesen. Quellen, lokaler Änderungsstand oder Prüf-/Fehlbelege; vollständige Zweitsicherung nicht nachgewiesen. |
| `light-study-c-r1/` | 0.001472 | 11.10.2026 21:49 | J17_SUN_MEASUREMENT.json, LIGHT_STUDY_C_R1_PRIVATE.zip, SOURCE_MANIFEST.json, VALIDATION.json, WSA_LIGHT_STUDY_C_R1.md, build_light.py, light-presets.json … (11 Einträge) | Keine vollständige Zweitsicherung nachgewiesen. Quellen, lokaler Änderungsstand oder Prüf-/Fehlbelege; vollständige Zweitsicherung nicht nachgewiesen. |
| `open-world-integrator-2026-10-07/` | 2.814224 / 2.680573 | 08.10.2026 02:18 | COWORKER_ZWISCHENBERICHT_2026-10-07.md, HUB_ISLAND_DECISION_REVISION_10.png, ISLAND_FINAL_SOURCE_MANIFEST_2026-10-07.json, ISLAND_HANDOFF_STATE_2026-10-07.json, KFB_INSELENTSCHEIDUNG_WB2_UEBERGABE_2026-10-07.md, PAUSE_HANDOFF_2026-10-07.md, PAUSE_LOCAL_DIFF_2026-10-07.patch … (36 Einträge) | lokal `open-world-integrator-2026-10-07/receiving` @ `98b82377abf60b1404ff06cfff21ed1acc863f1a` (geändert); Remote-Nachweis offen Quellen, lokaler Änderungsstand oder Prüf-/Fehlbelege; vollständige Zweitsicherung nicht nachgewiesen. |
| `open-world-recovery-audit-2026-10-07/` | 0.004330 | 07.10.2026 13:38 | CONTRACT_FREEZE.md, CRITIC_REPORT.md, FINAL_CLOSURE.json, GUARD_REPORT.md, LIBRARY_MANIFEST.json, candidate-inputs, donor-inputs … (15 Einträge) | Keine vollständige Zweitsicherung nachgewiesen. Quellen, lokaler Änderungsstand oder Prüf-/Fehlbelege; vollständige Zweitsicherung nicht nachgewiesen. |
| `place-relations-schema-r1/` | 0.000061 | 11.10.2026 14:41 | PROPOSAL.md, TEST_REPORT.json, attachment-types.example.json, existing-editor-relations.example.json, export_v1.py, publish.json, scene-study-v2.schema.json … (10 Einträge) | Keine vollständige Zweitsicherung nachgewiesen. Quellen, lokaler Änderungsstand oder Prüf-/Fehlbelege; vollständige Zweitsicherung nicht nachgewiesen. |
| `platform-deepdive-r1/` | 0.000027 | 18.10.2026 21:55 | PLATFORM_DEEPDIVE_R1.md | Keine vollständige Zweitsicherung nachgewiesen. Quellen, lokaler Änderungsstand oder Prüf-/Fehlbelege; vollständige Zweitsicherung nicht nachgewiesen. |
| `resident-coworker-briefs/` | 0.075218 | 28.09.2026 22:35 | .git, kfb-hub, skills, tools | lokal `resident-coworker-briefs` @ `0445a4cdb9a67e6c64b6450413a50fd0163b9435` (geändert); Remote-Nachweis offen Quellen, lokaler Änderungsstand oder Prüf-/Fehlbelege; vollständige Zweitsicherung nicht nachgewiesen. |
| `rhythm-props-inventory-r1/` | 0.039303 | 11.10.2026 23:03 | CATALOG_BOT_DELTA.json, CATALOG_CURRENT_TARGETED.json, CATALOG_CURRENT_TARGETED_FULL.json, CATALOG_DISCOVERY_OLDER_SNAPSHOT.json, DISCOVERY_PRIVATE.json, HOLIDAY_REFERENCE_RECEIPT.json, RHYTHM_PROPS_INVENTORY_R1_PRIVATE.zip … (20 Einträge) | Keine vollständige Zweitsicherung nachgewiesen. Quellen, lokaler Änderungsstand oder Prüf-/Fehlbelege; vollständige Zweitsicherung nicht nachgewiesen. |
| `scene-editor-r1/` | 0.089882 | 11.10.2026 14:27 | EDITOR_RULES_R1.patch, EDITOR_RULES_R1_PRIVATE.zip, RETURN.md, SOURCE_FIRST.md, TESTS.json, before, evidence … (12 Einträge) | Keine vollständige Zweitsicherung nachgewiesen. Quellen, lokaler Änderungsstand oder Prüf-/Fehlbelege; vollständige Zweitsicherung nicht nachgewiesen. |
| `sites/` | 0.006012 | 09.10.2026 21:29 | kfb-asset-librarian-v11 | lokal `sites/kfb-asset-librarian-v11` @ `04a89c73927656d894e503cf7c831de66eb74355` (geändert); Remote-Nachweis offen Quellen, lokaler Änderungsstand oder Prüf-/Fehlbelege; vollständige Zweitsicherung nicht nachgewiesen. |
| `toolbox-consolidation-paused-2026-10-22/` | 0.000679 | 22.10.2026 15:24 | PAUSED_STATE.json, R4_UNREVIEWED_TRACKED_CHANGES.patch, SHA256SUMS, WSA_TOOLBOX_REGRESSION_POSTMORTEM_2026-10-22.md, WSA_TO_WS0_TOOLBOX_CONSOLIDATION_STATUS_R1.md, unreviewed-source | Lokale Dropbox-Kopie `/Users/georgv.westphalen/Dropbox/CLAUDE/KFB_HUB/50_BLENDER/FB/_wsa_toolbox_paused_2026-10-22`: 9 SHA-256-Gleichheiten, 0 lokal zusätzliche Dateien; Cloud-Sync nicht bestätigt. Postmortem/Status zusätzlich Register-Commit [f404ba4065dd](https://github.com/georg-doc/kayfabizarro/commit/f404ba4065dd0ca79ca87a30858bea73f90162bf). Quellen, lokaler Änderungsstand oder Prüf-/Fehlbelege; vollständige Zweitsicherung nicht nachgewiesen. |
| `track-maker-r1/` | 0.188385 | 11.10.2026 04:36 | ARCHIVE_RECEIPT.json, CHANGELOG.md, IMAGE_MANIFEST.json, JOY_SOURCE_LOCK.json, KFB_PROTOPIA_MAKER_TRACK_R1_PRIVATE.zip, LICENSE_AND_PACK_BYTE_PROOF.json, PARTS.md … (42 Einträge) | Keine vollständige Zweitsicherung nachgewiesen. Quellen, lokaler Änderungsstand oder Prüf-/Fehlbelege; vollständige Zweitsicherung nicht nachgewiesen. |
| `track-maker-r2/` | 0.056232 | 11.10.2026 05:31 | FAILED_ARCHIVE_RECEIPT.json, R2_FAILED_PILOT_PRIVATE.zip, R2_NOT_DELIVERABLE.md, build_architecture.py, build_track.mjs, candidate.blend, candidate.blend1 … (21 Einträge) | Keine vollständige Zweitsicherung nachgewiesen. Quellen, lokaler Änderungsstand oder Prüf-/Fehlbelege; vollständige Zweitsicherung nicht nachgewiesen. |
| `track-module-look-r1/` | 0.001446 | 11.10.2026 15:49 | IMAGE_EVIDENCE.json, SEARCH_PROTOCOL_V140.json, SOURCE_MANIFEST.json, TRACK_MODULE_LOOK_R1_PRIVATE.zip, VALIDATION.json, WSA_TRACK_MODULE_LOOK_SPEC_R1.md, build_spec.py … (13 Einträge) | Keine vollständige Zweitsicherung nachgewiesen. Quellen, lokaler Änderungsstand oder Prüf-/Fehlbelege; vollständige Zweitsicherung nicht nachgewiesen. |
| `track-module-look-r2/` | 0.005180 | 11.10.2026 16:35 | AMBIGUITIES_V148.json, BOARD_COVERAGE.json, REFERENCE_BOARDS.json, REFS_CITY_STREETS_2026-10-11.metadata.json, REFS_COUNTRY_TUNNEL_2026-10-11.metadata.json, REFS_TRACK_DETAILS_2026-10-11.metadata.json, SEARCH_PROTOCOL_R2.json … (23 Einträge) | Keine vollständige Zweitsicherung nachgewiesen. Quellen, lokaler Änderungsstand oder Prüf-/Fehlbelege; vollständige Zweitsicherung nicht nachgewiesen. |
| `wb2-four-island-recovery/` | 0.084644 | 04.10.2026 20:33 | DEPLOYMENT.json, evidence, failure-recovery, index.html, kfb-hub, node_modules, overworld … (11 Einträge) | Keine vollständige Zweitsicherung nachgewiesen. Quellen, lokaler Änderungsstand oder Prüf-/Fehlbelege; vollständige Zweitsicherung nicht nachgewiesen. |
| `wb2-player-01/` | 0.070889 | 04.10.2026 19:40 | .git, .github, failure-recovery, fixtures, media, overworld, qa … (14 Einträge) | lokal `wb2-player-01` @ `77a9e3a263201cb5a48f7b61d6feabd75bdcc616` (geändert); Remote-Nachweis offen Quellen, lokaler Änderungsstand oder Prüf-/Fehlbelege; vollständige Zweitsicherung nicht nachgewiesen. |
| `world-m2a-playable-r5/` | 0.039917 | 28.09.2026 22:33 | .git, kfb-hub, skills, tools, world-drive-interact-m2a-r4-metrics.json, world-drive-interact-m2a-r5-proof | lokal `world-m2a-playable-r5` @ `df7220331932a28865af96d8411aac630d21dff7` (geändert); Remote-Nachweis offen Quellen, lokaler Änderungsstand oder Prüf-/Fehlbelege; vollständige Zweitsicherung nicht nachgewiesen. |
| `wsa-hub-update-2026-10-09/` | 3.910633 | 10.10.2026 03:33 | .DS_Store, .git, .gitignore, .nojekyll, 2026-10-09_wsa-work_hub-update.md, KAYFABIZARRO Design System.zip, KayfaBizarro Rule Book (2).zip … (20 Einträge) | lokal `wsa-hub-update-2026-10-09` @ `bb10b121f5a4e0c96c93c6a3fcfa6a7368840fd4` (geändert); Remote-Nachweis offen Zentrale Git-Datenbank mit abhängigen Worktrees; nicht als einzelne Repo-Kopie behandeln. |
| `wsa-scene-study/` | 0.033749 | 11.10.2026 14:04 | A_GIF_METADATA.json, A_KAYKIT_STAGING.md, A_STAGING_MEASUREMENTS.json, B_SOURCE_SCREENSHOTS.json, B_STREAKBYTE_ISLANDS.md, CHANGELOG.md, C_LIGHT.md … (21 Einträge) | Keine vollständige Zweitsicherung nachgewiesen. Quellen, lokaler Änderungsstand oder Prüf-/Fehlbelege; vollständige Zweitsicherung nicht nachgewiesen. |

### doppelt

| Ordner | Gesamt / Gruppenanteil GiB | Letzte Änderung CEST | Inhalt | zusätzliche Sicherung / Befund |
|---|---:|---|---|---|
| `kayfabizarro-voice-r1/` | 7.652725 | 10.10.2026 20:16 | .DS_Store, .git, .github, .gitignore, .nojekyll, FrizzleBob, KAYFABIZARRO Design System.zip … (38 Einträge) | GitHub `planning/kfb-chatterbox-voice-layer-v1-2026-10-08` @ [4f714235660b](https://github.com/georg-doc/kayfabizarro/commit/4f714235660b3c70a101012aeb0ffa4d834c8d00) enthält lokalen Head [373a18579ec4](https://github.com/georg-doc/kayfabizarro/commit/373a18579ec42beed727baa900dff00285549fda) (ahead 221 / behind 0). GitHub-Ancestry nachgewiesen; 13 untracked Dateien byteidentisch als HEAD-Blobs vorhanden; keine ignorierten Dateien und keine zusätzlichen Reflog-Commits außerhalb HEAD. Nur Kandidat, keine Löschfreigabe. |

### Zwischenstände

| Ordner | Gesamt / Gruppenanteil GiB | Letzte Änderung CEST | Inhalt | zusätzliche Sicherung / Befund |
|---|---:|---|---|---|
| `kfb-audio-site-stem-proof/` | 0.000000 | 06.10.2026 04:17 |  | Keine vollständige Zweitsicherung nachgewiesen. Leerer Platzhalter/Verzeichnis, gemessen 0 B; kein Speichergewinn. |
| `work/` | 0.000000 | 17.10.2026 04:36 | kfb-audio-v389 | Keine vollständige Zweitsicherung nachgewiesen. Leerer Platzhalter/Verzeichnis, gemessen 0 B; kein Speichergewinn. |

### unklar

| Ordner | Gesamt / Gruppenanteil GiB | Letzte Änderung CEST | Inhalt | zusätzliche Sicherung / Befund |
|---|---:|---|---|---|
| `animation-library-v1-update/` | 0.026882 | 28.09.2026 04:27 | .git, skills | lokal `animation-library-v1-update` @ `ad57540985609d147df8f9513da2e87bdf1a5fd1` (sauber); Remote-Nachweis offen Vollständige unabhängige Sicherung nicht nachgewiesen; keine Löschfreigabe. |
| `bubbles-r101/` | 0.013214 | 18.10.2026 23:34 | .git, .github, tools, work | lokal `bubbles-r101` @ `b3963767531a32b3a4fc8806bd52effab3b2598e` (sauber); Remote-Nachweis offen Vollständige unabhängige Sicherung nicht nachgewiesen; keine Löschfreigabe. |
| `claude-service-access-01/` | 0.075691 | 05.10.2026 00:48 | .git, kfb-hub, skills, tools | lokal `claude-service-access-01` @ `440f37d59972a581db95e8329ed954c0b88a86e3` (sauber); Remote-Nachweis offen Vollständige unabhängige Sicherung nicht nachgewiesen; keine Löschfreigabe. |
| `claude-service-connector-response/` | 0.075710 | 05.10.2026 02:05 | .git, kfb-hub, skills, tools | lokal `claude-service-connector-response` @ `621a3bc01c09ce2f979b47c8c2380f52dd3ec103` (sauber); Remote-Nachweis offen Vollständige unabhängige Sicherung nicht nachgewiesen; keine Löschfreigabe. |
| `evening-arena-source/` | 0.000977 | 18.10.2026 23:24 | _handover, assets, combat-arena-v1, combat-arena-v2, combat-arena-v4, index.html | Keine vollständige Zweitsicherung nachgewiesen. Vollständige unabhängige Sicherung nicht nachgewiesen; keine Löschfreigabe. |
| `halloween-pack-repair/` | 0.060455 | 28.09.2026 21:33 | .git, .github, asset-librarian, kfb-hub, media, skills, tools | lokal `halloween-pack-repair` @ `10a2c5e29bf752215dadb60b23f07253f63e9d34` (sauber); Remote-Nachweis offen Vollständige unabhängige Sicherung nicht nachgewiesen; keine Löschfreigabe. |
| `hex-catalog-level-slope/` | 0.006920 | 02.10.2026 18:34 | .git, skills, tools | lokal `hex-catalog-level-slope` @ `6ebebf7672cc455a51a193b6a4efa9862e049cbb` (sauber); Remote-Nachweis offen Vollständige unabhängige Sicherung nicht nachgewiesen; keine Löschfreigabe. |
| `hub-current-source/` | 0.075211 | 28.09.2026 00:24 | .git, kfb-hub, skills, tools | lokal `hub-current-source` @ `67e08aa9dd077fe76687ef49f4b3db9878235bd8` (sauber); Remote-Nachweis offen Vollständige unabhängige Sicherung nicht nachgewiesen; keine Löschfreigabe. |
| `hub-current-state/` | 0.033165 | 28.09.2026 00:28 | .git, kfb-hub, skills | lokal `hub-current-state` @ `ba035f6477c09a2213d7b5817c3cbc8a529993da` (sauber); Remote-Nachweis offen Vollständige unabhängige Sicherung nicht nachgewiesen; keine Löschfreigabe. |
| `kayfabizarro-world-city-lod-r3/` | 0.150585 | 27.09.2026 20:40 | .git, .github, kfb-hub, skills, tools | lokal `kayfabizarro-world-city-lod-r3` @ `b50da195376ca56dd34c814945bb5ba9f34c01f6` (sauber); Remote-Nachweis offen Vollständige unabhängige Sicherung nicht nachgewiesen; keine Löschfreigabe. |
| `kfb-audio-interaction-states/` | 4.514606 | 05.10.2026 01:37 | .git, .github, kfb-hub, media, skills, tools | lokal `kfb-audio-interaction-states` @ `13c8750173e5e52af3d357f981159c9f740b032e` (sauber); Remote-Nachweis offen Sauberer Checkout ist kein Backup-Beleg: GitHub-Vergleich des lokalen Heads liefert 404; Remote-Branch steht anders. Nicht als doppelt freigeben. |
| `kfb-audio-site-host/` | 0.000633 | 17.10.2026 04:35 | .git, .openai, dist | lokal `kfb-audio-site-host` @ `86e8a77810351e992e073c48d8596263357029b0` (sauber); Remote-Nachweis offen Vollständige unabhängige Sicherung nicht nachgewiesen; keine Löschfreigabe. |
| `kfb-audio-triplet-r1-site/` | 0.002754 | 10.10.2026 20:44 | .git, .openai, dist | lokal `kfb-audio-triplet-r1-site` @ `8f472837ea94d0b6f691ec2dfff6a68e68891a01` (sauber); Remote-Nachweis offen Vollständige unabhängige Sicherung nicht nachgewiesen; keine Löschfreigabe. |
| `kfb-chatterbox-voice-bench/` | 0.028095 | 10.10.2026 07:23 | .DS_Store, .git, .gitignore, .nojekyll, KAYFABIZARRO Design System.zip, KayfaBizarro Rule Book (2).zip, KayfaBizarro_MedKayfab_v19.0_DE.docx … (18 Einträge) | lokal `kfb-chatterbox-voice-bench` @ `22690da11c1be76828900fa719d698f90650bea3` (sauber); Remote-Nachweis offen Vollständige unabhängige Sicherung nicht nachgewiesen; keine Löschfreigabe. |
| `kfb-deck-library-r1-2026-10-09/` | 5.255562 / 4.604237 | 10.10.2026 03:32 | .DS_Store, .assetsignore, .cloudflare-pages, .git, .github, .gitignore, .nojekyll … (41 Einträge) | lokal `kfb-deck-library-r1-2026-10-09` @ `b51238af0c8781f898484a023760012e9655c780` (geändert); Remote-Nachweis offen Gemischter Repo-/Arbeitsbestand mit lokalen Änderungen und abhängiger Git-Datenbank; nur gesondert ausgewiesene Caches/Projektion sind Zwischenstände. |
| `kfb-hub-ui-v2/` | 0.000011 | 19.09.2026 13:47 | skills | Keine vollständige Zweitsicherung nachgewiesen. Vollständige unabhängige Sicherung nicht nachgewiesen; keine Löschfreigabe. |
| `kfb-modular-minigame-hub/` | 0.000023 | 19.09.2026 07:29 | skills | Keine vollständige Zweitsicherung nachgewiesen. Vollständige unabhängige Sicherung nicht nachgewiesen; keine Löschfreigabe. |
| `lab-import-packet-r1/` | 0.000042 | 11.10.2026 14:56 | MANIFEST.json, README.md, contract, relations.json | Keine vollständige Zweitsicherung nachgewiesen. Vollständige unabhängige Sicherung nicht nachgewiesen; keine Löschfreigabe. |
| `race-3d-radio/` | 0.000008 | 19.09.2026 13:47 | _handover | Keine vollständige Zweitsicherung nachgewiesen. Vollständige unabhängige Sicherung nicht nachgewiesen; keine Löschfreigabe. |
| `render-r0-shared-preset/` | 0.037331 | 28.09.2026 03:47 | .git, kfb-hub, skills, tools | lokal `render-r0-shared-preset` @ `0575af2163b6526020a0cc894351f3c40977a4aa` (sauber); Remote-Nachweis offen Vollständige unabhängige Sicherung nicht nachgewiesen; keine Löschfreigabe. |
| `surface-consolidation/` | 0.075569 | 04.10.2026 23:04 | .git, kfb-hub, skills, tools | lokal `surface-consolidation` @ `8f01af7fc38a388ba9fffa13638908165f8ccaa1` (sauber); Remote-Nachweis offen Vollständige unabhängige Sicherung nicht nachgewiesen; keine Löschfreigabe. |
| `track-t3-production-briefs/` | 0.075291 | 28.09.2026 01:06 | .git, kfb-hub, skills, tools | lokal `track-t3-production-briefs` @ `0480f89e57a9669be63bfe80a85171db42b9333c` (sauber); Remote-Nachweis offen Vollständige unabhängige Sicherung nicht nachgewiesen; keine Löschfreigabe. |
| `track-t3-rebrief/` | 0.089939 | 27.09.2026 22:54 | .git, kfb-hub, skills, tools | lokal `track-t3-rebrief` @ `52f467f3dbac3d4b70fb76faa8cc61326b0b67ac` (sauber); Remote-Nachweis offen Vollständige unabhängige Sicherung nicht nachgewiesen; keine Löschfreigabe. |
| `v538/` | 2.790798 | 18.10.2026 23:49 | canonical-manifest.json, github-head.headers, github-head.json, kayfabizarro-private-assets, license-search.json, private-repo-proof.png, remote-verification | lokal `v538/kayfabizarro-private-assets` @ `e466995404e585a0cd72bebe359246b2c0e6e995` (sauber); Remote-Nachweis offen; lokal `v538/remote-verification` @ `9791df2b1187b7df9b47cb5c7ce2b8ce09d14cdf` (sauber); Remote-Nachweis offen Zwei saubere lokale Checkouts, aber unterschiedliche lokale Heads; erreichbarer privater Branch zeigt anderen Head. Lokale Prüffotos/Manifest ebenfalls nicht vollständig gegengesichert. |

## Einzeldateien im Arbeitsordner

| Datei | Gruppe | MiB | Letzte Änderung CEST | Sicherung / Begründung |
|---|---|---:|---|---|
| `G4_BRIDGE_SOURCES_AND_PRISON_PREP_2026-10-11.zip` | unklar | 0.4180 | 11.10.2026 03:05 | Keine vollständige Zweitsicherung nachgewiesen. Vollständige unabhängige Sicherung nicht nachgewiesen; keine Löschfreigabe. |
| `LAB_IMPORT_RELATIONS_R1_APPROVAL_PENDING.zip` | unklar | 0.0078 | 11.10.2026 14:49 | Keine vollständige Zweitsicherung nachgewiesen. Vollständige unabhängige Sicherung nicht nachgewiesen; keine Löschfreigabe. |
| `LAB_IMPORT_RELATIONS_R1_V141.zip` | unklar | 0.0117 | 11.10.2026 14:56 | Keine vollständige Zweitsicherung nachgewiesen. Vollständige unabhängige Sicherung nicht nachgewiesen; keine Löschfreigabe. |
| `approved-import-publish.json` | unklar | 0.0234 | 11.10.2026 14:56 | Keine vollständige Zweitsicherung nachgewiesen. Vollständige unabhängige Sicherung nicht nachgewiesen; keine Löschfreigabe. |
| `audio-footsteps-contact-fix.tar.gz` | unklar | 20.7617 | 18.10.2026 00:55 | Keine vollständige Zweitsicherung nachgewiesen. Vollständige unabhängige Sicherung nicht nachgewiesen; keine Löschfreigabe. |
| `audio-footsteps-r2-v430.tar.gz` | unklar | 8.3516 | 18.10.2026 00:13 | Keine vollständige Zweitsicherung nachgewiesen. Vollständige unabhängige Sicherung nicht nachgewiesen; keine Löschfreigabe. |
| `audio-sand-walk-075.tar.gz` | unklar | 25.2109 | 18.10.2026 01:08 | Keine vollständige Zweitsicherung nachgewiesen. Vollständige unabhängige Sicherung nicht nachgewiesen; keine Löschfreigabe. |
| `audio-v389-site.tar.gz` | unklar | 3.1172 | 17.10.2026 04:53 | Keine vollständige Zweitsicherung nachgewiesen. Vollständige unabhängige Sicherung nicht nachgewiesen; keine Löschfreigabe. |
| `audio-wood-carpet-076-final.tar.gz` | unklar | 30.9180 | 18.10.2026 02:41 | Keine vollständige Zweitsicherung nachgewiesen. Vollständige unabhängige Sicherung nicht nachgewiesen; keine Löschfreigabe. |
| `audio-wood-carpet-076.tar.gz` | unklar | 30.9180 | 18.10.2026 02:41 | Keine vollständige Zweitsicherung nachgewiesen. Vollständige unabhängige Sicherung nicht nachgewiesen; keine Löschfreigabe. |
| `fb-canon-git-push.py` | behalten | 0.0039 | 22.10.2026 13:35 | Keine vollständige Zweitsicherung nachgewiesen. Quellen, lokaler Änderungsstand oder Prüf-/Fehlbelege; vollständige Zweitsicherung nicht nachgewiesen. |
| `fb-canon-git-read.py` | behalten | 0.0039 | 22.10.2026 12:54 | Keine vollständige Zweitsicherung nachgewiesen. Quellen, lokaler Änderungsstand oder Prüf-/Fehlbelege; vollständige Zweitsicherung nicht nachgewiesen. |
| `fb-canon-qa-server.py` | behalten | 0.0039 | 22.10.2026 13:41 | Keine vollständige Zweitsicherung nachgewiesen. Quellen, lokaler Änderungsstand oder Prüf-/Fehlbelege; vollständige Zweitsicherung nicht nachgewiesen. |
| `fb-canon-r3-git-push.py` | behalten | 0.0039 | 22.10.2026 14:37 | Keine vollständige Zweitsicherung nachgewiesen. Quellen, lokaler Änderungsstand oder Prüf-/Fehlbelege; vollständige Zweitsicherung nicht nachgewiesen. |
| `fb-canon-r3-qa-server.py` | behalten | 0.0039 | 22.10.2026 14:16 | Keine vollständige Zweitsicherung nachgewiesen. Quellen, lokaler Änderungsstand oder Prüf-/Fehlbelege; vollständige Zweitsicherung nicht nachgewiesen. |
| `fb-face-r4-qa-server.py` | behalten | 0.0039 | 22.10.2026 14:58 | Keine vollständige Zweitsicherung nachgewiesen. Quellen, lokaler Änderungsstand oder Prüf-/Fehlbelege; vollständige Zweitsicherung nicht nachgewiesen. |

## Getrennt bilanzierte Zwischenstände

| Pfad unter work/ | GiB | Wiederherstellung / Beleg |
|---|---:|---|
| `open-world-integrator-2026-10-07/candidate-original/node_modules` | 0.133652 | Installierte Abhängigkeiten; package.json und pnpm-lock.yaml am Elternpfad vorhanden. Kein Installationslauf, kein Patch-Nachweis; bei späterer Freigabe lokale Paketänderungen ausschließen. |
| `kfb-deck-library-r1-2026-10-09/.cloudflare-pages` | 0.651012 | Erzeugte öffentliche Projektion. Alle 2.023 Dateien per SHA-256 identisch mit gleichnamigen Quelldateien im Repo. Vorhandenes .github/scripts/build-cloudflare-pages.mjs erklärt die Erzeugung; NICHT ausgeführt. |
| `kfb-deck-library-r1-2026-10-09/tools/asset_registry/__pycache__` | 0.000202 | Aus Python-Quelldateien bei Bedarf neu erzeugbar. |
| `kfb-deck-library-r1-2026-10-09/tools/asset_registry/tests/__pycache__` | 0.000111 | Aus Python-Quelldateien bei Bedarf neu erzeugbar. |

Weitere erkannte `node_modules` ohne geprüften Eltern-Lock sowie `.cloudflare-pages` im Test-Fixture wurden nicht pauschal freigegeben; sie bleiben Teil ihrer Elternklassifikation. 0-B-Symlink-Verzeichnisse versprechen keinen Speichergewinn.

## Git-Anhang: alle 44 gefundenen Arbeitskopien

| Pfad | lokaler Branch | exakter lokaler HEAD | Zustand / ignorierte Pfade |
|---|---|---|---|
| `animation-library-v1-update` | `work/animation-library-v1-brief-2026-09-28` | `ad57540985609d147df8f9513da2e87bdf1a5fd1` | sauber |
| `audio-footsteps-isolated-audit` | `main` | `f0ae805e4b76fd1a02e2cf6416505a836d677bec` | 7 Statuszeilen |
| `audio-footsteps-r2-v430-source` | `main` | `6c2b672506f9df38bf3b448dc7e3b828a56a7380` | 13 Statuszeilen |
| `audio-v389-source` | `main` | `3e5849b0a0375664e9463a5663bbdcfec1847f4c` | sauber |
| `billboard-island-integration-01` | `work/billboard-island-integration-01-2026-10-01` | `ee3fb84380ad8d3ff3f6d0f5de5c14454efe9582` | 1 Statuszeilen |
| `bubbles-r101` | `wsa/kfb-bubbles-ssot-r1-2026-10-18` | `b3963767531a32b3a4fc8806bd52effab3b2598e` | sauber; ignoriert: tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/replies/KFB_BUBBLES_SSOT_R1/kfb-bubbles.v1/browser-tests.local.html, work/ |
| `chatterbox-pr357-gpt-site-fix` | `planning/chatterbox-triplet-curator-site-2026-10-04` | `6b1db4fccfc1dbb1437638160476b306e17c9ddc` | 4 Statuszeilen |
| `chatterbox-pr357-gpt-site-fix-clean` | `planning/chatterbox-triplet-curator-site-2026-10-04` | `9198fda5f6bc90319a55956a52ed87d784b21300` | 3 Statuszeilen |
| `claude-service-access-01` | `codex/claude-service-access-01` | `440f37d59972a581db95e8329ed954c0b88a86e3` | sauber |
| `claude-service-connector-response` | `codex/claude-service-connector-response` | `621a3bc01c09ce2f979b47c8c2380f52dd3ec103` | sauber |
| `fb-canon-r1` | `wsa/fb-face-preview-r4-2026-10-22` | `afb97250a49dcc5dc0ea1ab1a82d332143b0fe6d` | 4 Statuszeilen; ignoriert: dist/qa-assets/ |
| `halloween-pack-repair` | `work/halloween-pack-repair` | `10a2c5e29bf752215dadb60b23f07253f63e9d34` | sauber |
| `hex-catalog-level-slope` | `wsa/hex-catalog-level-slope-2026-10-02` | `6ebebf7672cc455a51a193b6a4efa9862e049cbb` | sauber |
| `hub-current-source` | `work/hub-current-state-source-2026-09-28` | `67e08aa9dd077fe76687ef49f4b3db9878235bd8` | sauber |
| `hub-current-state` | `work/hub-current-state-2026-09-28` | `ba035f6477c09a2213d7b5817c3cbc8a529993da` | sauber |
| `island-mvp-r4` | `detached` | `e31005f5cca79d675d717709a38af63aaaf339e1` | 29 Statuszeilen; ignoriert: tools/KFB-ToolBox/worldbuilder/procedural-test-world-01/open-world/node_modules |
| `island-mvp-r4-site` | `main` | `615df460fbee99561f294439d2963baa7cb2d5b5` | 27 Statuszeilen |
| `kayfabizarro-deploy-audit` | `main` | `5650b6c54d8789b20ea80abe857688173d506d3b` | 20097 Statuszeilen |
| `kayfabizarro-toolbox-production-03` | `work/hub-ux-v2-masterplan-2026-09-27` | `9cc31312cb07bff80e160a5a8150eda067e81bb2` | sauber |
| `kayfabizarro-voice-r1` | `planning/kfb-chatterbox-voice-layer-v1-2026-10-08` | `373a18579ec42beed727baa900dff00285549fda` | 3 Statuszeilen |
| `kayfabizarro-voice-r1-source` | `planning/kfb-chatterbox-voice-layer-v1-2026-10-08` | `99c749c630cfbcf11f6f6be9c2959ef54b4af150` | 6 Statuszeilen |
| `kayfabizarro-world-city-lod-r3` | `work/world-m2a-adaptive-quality-r4-2026-09-27` | `b50da195376ca56dd34c814945bb5ba9f34c01f6` | sauber |
| `kayfabizarro-world-flight-clay-c0` | `work/world-m2a-playability-r1-2026-09-27` | `f24bb0ac4483e6dda6d5215cfd75d99c7ad26c7b` | 22 Statuszeilen |
| `kfb-audio-adaptive-pr365` | `web/kfb-adaptive-music-stem-proof-2026-10-06` | `f6745cc889295dee25739647689e13431d5b651f` | 5 Statuszeilen |
| `kfb-audio-interaction-states` | `chatgpt-web/kfb-jukebox-catalog-01-audio-site-2026-10-04` | `13c8750173e5e52af3d357f981159c9f740b032e` | sauber |
| `kfb-audio-site-host` | `main` | `86e8a77810351e992e073c48d8596263357029b0` | sauber |
| `kfb-audio-triplet-r1-site` | `main` | `8f472837ea94d0b6f691ec2dfff6a68e68891a01` | sauber |
| `kfb-chatterbox-voice-bench` | `planning/kfb-chatterbox-voice-layer-v1-2026-10-08` | `22690da11c1be76828900fa719d698f90650bea3` | sauber |
| `kfb-deck-library-r1-2026-10-09` | `work/deck-grid-cloudflare-fix-2026-10-10` | `b51238af0c8781f898484a023760012e9655c780` | 6 Statuszeilen; ignoriert: .cloudflare-pages/, .wrangler/ |
| `kfb-dramatis-personae-r1/asset-site` | `main` | `7d1a363c7f2aaafea6e8e925d3b5c47b631fa345` | sauber |
| `kfb-tool-cleanup-r1/old-hub` | `main` | `fcd817798f5dbdefd444419e73dcbbded23ba8c0` | sauber |
| `kfb-toolbox-source-diag-2026-10-22` | `main` | `53028aa47de97cf1c5791cdc72501212a5785094` | sauber |
| `open-world-integrator-2026-10-07/receiving` | `chatgpt-web/wb2-convergence-golden-corridor-01-2026-10-04` | `98b82377abf60b1404ff06cfff21ed1acc863f1a` | 11 Statuszeilen; ignoriert: tools/KFB-ToolBox/worldbuilder/procedural-test-world-01/open-world/dist/, tools/KFB-ToolBox/worldbuilder/procedural-test-world-01/open-world/node_modules |
| `render-r0-shared-preset` | `work/render-r0-shared-preset-2026-09-28` | `0575af2163b6526020a0cc894351f3c40977a4aa` | sauber |
| `resident-coworker-briefs` | `work/resident-ui-coworker-mvp-briefs-2026-09-28` | `0445a4cdb9a67e6c64b6450413a50fd0163b9435` | 4 Statuszeilen |
| `sites/kfb-asset-librarian-v11` | `main` | `04a89c73927656d894e503cf7c831de66eb74355` | 1 Statuszeilen |
| `surface-consolidation` | `chatgpt-web/surface-consolidation-2026-10-04` | `8f01af7fc38a388ba9fffa13638908165f8ccaa1` | sauber |
| `track-t3-production-briefs` | `work/track-t3-production-briefs-2026-09-27` | `0480f89e57a9669be63bfe80a85171db42b9333c` | sauber |
| `track-t3-rebrief` | `work/track-t3-world-context-rebrief-2026-09-27` | `52f467f3dbac3d4b70fb76faa8cc61326b0b67ac` | sauber |
| `v538/kayfabizarro-private-assets` | `intake/v538-2026-10-18` | `e466995404e585a0cd72bebe359246b2c0e6e995` | sauber |
| `v538/remote-verification` | `intake/v538-2026-10-18` | `9791df2b1187b7df9b47cb5c7ce2b8ce09d14cdf` | sauber |
| `wb2-player-01` | `chatgpt-web/wb2-convergence-golden-corridor-01-2026-10-04` | `77a9e3a263201cb5a48f7b61d6feabd75bdcc616` | 45 Statuszeilen |
| `world-m2a-playable-r5` | `work/world-m2a-r6-focus-quality-2026-09-28` | `df7220331932a28865af96d8411aac630d21dff7` | 6 Statuszeilen |
| `wsa-hub-update-2026-10-09` | `work/wsa-hub-update-2026-10-09` | `bb10b121f5a4e0c96c93c6a3fcfa6a7368840fd4` | 1 Statuszeilen |

## Nachweisstand und Grenzen

GitHub wurde über die bestehende Verbindung lesend geprüft. Der Voice-Vergleich bestätigt ahead=221 / behind=0; 13 untracked Dateien sind bereits vorhandenen HEAD-Blobs bytegleich, keine ignorierten Dateien, keine zusätzlichen nur im Reflog/anderen lokalen Refs erreichbaren Commits außerhalb HEAD. Das ist der einzige vollständig als GitHub-Doppelbestand eingestufte große Checkout. Andere lokale Commit-/Branchangaben sind Wiederauffindehilfen, keine behauptete Zweitsicherung.

Dropbox wurde nur anhand bereits lokal verfügbarer Dateien gegengehasht; keine Cloud-Platzhalter nachgeladen und kein Cloud-Synchronisationsstatus behauptet. R2: 13/13 Dateien identisch; R3: 24/27 identisch und drei lokal zusätzliche Dateien; Pause-Paket: 9/9 identisch einschließlich SHA256SUMS. Die fehlenden R3-Dateien: `FB_CANON.first-pass.glb`, `FB_CANON.mask-pass.glb`, `FB_CANON.second-pass.glb`.

Die Messung nutzt belegte Dateisystemblöcke (`du -sk`), ergänzt um Metadaten und Dateihashes. APFS-Klone, gemeinsam genutzte Extents, Kompression und Hardlinks können den tatsächlich frei werdenden Platz verändern. Die Summe ist eine Inventargröße, keine Zusage physisch freigebbarer Bytes. Änderungszeiten können durch Git-Verwaltung entstehen. Keine Größen wurden aus Dateinamen geschätzt. Scanfehler: 0.

Lokale Detailnachweise stehen neben diesem Report: inventory.raw.json, git.raw.json, git.large-detail.json, caches.raw.json, backup-local.raw.json, github-proof.raw.json, generated-projection-check.json und classification.json. Sie enthalten Pfade und Git-Metadaten, keine absichtlich aufgenommenen Zugangsdaten; umfangreiche Rohinventare werden nicht ungeprüft in den öffentlichen Repo-Branch gestellt.

## Übergabe / nächstes Gate

Owner: WSA-Arbeitsordner-Inventur; Produkt: dieser Report, keine ToolBox-Änderung. Ziel: bestehender Register-Branch `docs/kfb-decisions-register-2026-10-11`, `tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/replies/WSA_TO_WS0_WORKDIR_CLEANUP_R1.md`. Vorbereitungsstand des Registers: `5cfa4f7e992d87e43331246ab54eb02ad58539aa`; endgültiger Dokumentations-Commit wird im Übergabehinweis genannt und nach dem Schreiben exakt gelesen.

**Nächstes Gate: Georgs ausdrückliches Ja für konkret benannte Pfade ausschließlich aus „doppelt“ und „Zwischenstände“.** Bis dahin keine Löschung. „Unklar“ bleibt gesperrt, „behalten“ bleibt geschützt. Bei späterer Zustimmung vor jedem Entfernen aktuellen Zustand und Worktree-Abhängigkeiten erneut prüfen. Die Figuren-/ToolBox-Pause bleibt davon unabhängig bestehen; kein Merge und kein Live.
