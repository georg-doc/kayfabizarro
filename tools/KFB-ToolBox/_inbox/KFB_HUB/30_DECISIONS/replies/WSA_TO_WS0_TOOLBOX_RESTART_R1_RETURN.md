# WSA → WS0 · ToolBox restart R1 Return · 2026-10-24

**Status: PARTIAL / STOP an den sichtbaren Gesichtsfehlern. Keine Veröffentlichung, kein Merge.**

## Auftrag und Stand

Owner: bestehende KFB ToolBox / ToolBox-Studio, Sites-Projekt `appgprj_6ac2ba44282881919d1a49287a32054e`. Kein neues Tool. Georgs Wiederaufnahme und begrenzte Löschfreigabe umgesetzt. Der bisherige Live-Stand bleibt unverändert.

Quellen: Register-Repo `georg-doc/kayfabizarro`, Branch `docs/kfb-decisions-register-2026-10-11`, CHARACTERS_R1-Snapshot `8082e3e3a1c37a2e305ae4f382eb8b48fa7b1f00`. Der anschließend gelesene Register-Head `158bcbed7018992aef8bc53d5e4fea3bb41b2c18` ändert laut GitHub-Compare weder Restart-Brief noch CHARACTERS_R1. Anleitung und Source-Refs wurden aktuell gelesen; lokale Karten nur bei Übereinstimmung mit ihrem Register-SHA verwendet.

Lokale Implementierung: Branch `wsa/toolbox-restart-r1-2026-10-22`, Head `e98baa9ea24dafa6737b25a99255970e596e53b2`, Basis `afb97250a49dcc5dc0ea1ab1a82d332143b0fe6d`, Checkout `/Users/georgv.westphalen/.codex/.chatgpt-projects/g-p-6aa43ccf8750819191582c384993f2c1/work/toolbox-restart-r1`. **Nur lokal committed, nicht gepusht. Kein PR und keine neue Sites-Version.** Der Quell-Push wurde vor Ausführung von der automatischen Freigabeprüfung abgewiesen: Übertragung privater Register-/Kartenmetadaten in das Sites-Quellrepo nicht ausreichend freigegeben. Nicht über einen anderen Upload umgangen. Dieser textliche Return übermittelt den ausdrücklich beauftragten Befund an WS0; kein Quellbündel/GLB wird damit übertragen.

## 0 · Aufräumen abgeschlossen

Am 22.10. ausschließlich die sieben freigegebenen Inventurpfade entfernt: `kayfabizarro-voice-r1/`, `kfb-audio-site-stem-proof/` (leer), `work/` (leer), `open-world-integrator-2026-10-07/candidate-original/node_modules/`, `kfb-deck-library-r1-2026-10-09/.cloudflare-pages/`, dort `tools/asset_registry/__pycache__/` und `tools/asset_registry/tests/__pycache__/`.

Summe der zuvor inventarisierten belegten Blöcke: **9.059.913.728 Byte / 8,4377 GiB**. Das ist keine Messung physisch freigegebener APFS-Blöcke. Vor Entfernen der Voice-Kopie Remote-Sicherung sowie Arbeitsbaum/ignored/untracked/Reflog/Worktrees erneut geprüft. „behalten“ und „unklar“ wurden nicht gelöscht. Beleg: `/Users/georgv.westphalen/.codex/.chatgpt-projects/g-p-6aa43ccf8750819191582c384993f2c1/audit/wsa-workdir-cleanup-r1-2026-10-22/CLEANUP_EXECUTED_2026-10-22.json`. Ausgangsinventur auf Register-Commit `021af8a896ed36bdd057662da5d296916e34be1e`.

## 1 · Register-Auswahl lokal wiederhergestellt

132 Register-Charaktere, davon **131 Studio-Charaktere ohne FrizzleBob**, insgesamt **177 Auswahl-Einträge** einschließlich 46 zusätzlicher Looks. Dieselben canonical IDs/Aliasse aus CHARACTERS_R1 werden projiziert; keine neue Charakter-Wahrheit. FB wird im normalen Studio-Boot und Paritätstest ausgeschlossen; P08 nur auf ausdrücklich separater lokaler Referenzroute geladen.

Pencil `pencil` → B46-Karte `kfb_pencil_b46`, Eraser `eraser` → B46-Karte `kfb_eraser_b46`: beide im Browser mit vorhandenen Figuren, Augen und Mund sichtbar geprüft. Keine neue Figur oder Einstellung erzeugt. Kit-Figuren und Looks sind enthalten; Hexe A/B vorhanden, aber ihre aktuelle Modellreferenz ohne SHA sichtbar gesperrt. Kein Rückfall auf ein älteres Modell zum Umgehen der Prüfung.

**Quellenauflösung, keine Bildfreigabe:**

| Zustand | Einträge |
|---|---:|
| Augen-Rig fehlt | 32 |
| Karte fehlt | 50 |
| Modell-Prüfsumme fehlt | 31 |
| Quelle fehlt | 13 |
| Karte + aktuelles Modell bytegeprüft (Bildabnahme weiterhin offen) | 51 |

51 bytegeprüfte Einträge bedeutet ausdrücklich nicht 51 visuell akzeptierte Figuren. Die restlichen 126 Einträge bleiben mit Grund sichtbar; sie rendern kein Ersatzmodell. Alle 131 IDs sind auswählbar/als blockiert auffindbar, der Test schlägt beim Entfernen einer ID fehl.

Dramatis Personae: Der gemeinsame aktuelle Register-Snapshot wurde vorbereitet; die bestehende Asset-Library-Seite wurde in diesem Slice **nicht umgestellt oder veröffentlicht**. Ihre bisherige alte Datenliste ist damit noch kein nachgewiesener Paritäts-PASS.

### Gespeicherte Profile

14 lokale Dateien mit `kfb.pets/1` gefunden, vier unterschiedliche Datei-Hashes. Darin Hunky/Dory-Rezepte aus früheren Modellständen. Die Register-Profile wurden ebenfalls nach Pfad/SHA gesucht. Alte Einstellungen bleiben erhalten; kein Profil mit abweichendem Modell-SHA wurde auf aktuelle Geometrie angewandt. Alte Browser-Arbeitsdaten werden vor Routing-Migration unter registryRecovery erhalten; lokale Rig-Zuordnungen und Konflikte nicht gelöscht. **Georgs aktuelle gespeicherte Werte sind damit noch nicht vollständig wiederhergestellt.** Der Export-Versuch aus dem bestehenden Live-Browser lieferte keinen verifiziert gespeicherten kfb.pets-Download; daraus wird kein Erfolg abgeleitet.

### Hunky / Dory: richtige neuere Quellen gefunden, Gesichts-Anbindung STOP

Die vorherige Anbindung benutzte `body.glb` (r4) statt `body.glbCurrent`. Aktuelle Karten/Proof-Stage verweisen auf:

| Figur | Aktuelle Quelle unter KFB_HUB | SHA-256 |
|---|---|---|
| Lord Hunky | `50_BLENDER/RIM_R1/_privat_kauf_asset/LordHunky_edge80.r4e_rimV1.glb` | `3f793b0627bfa747511b3efa61b31205f162fd366ee28874c7792348eabb09b8` |
| Lady Dory | `50_BLENDER/RIM_R1/_privat_kauf_asset/LadyDory_RigMedium.toolbox.r10_rimV1.glb` | `a590cac43fbee780c82cf7517095f3b0331d389468a98da293b15ffd8d599730` |

Beide tatsächlich bytegeprüft und lokal isoliert aus ihren Karten geladen. Kein alter r4-HeadPart-Rezeptlauf auf bereits gebackene Geometrie. Shared EyeRig/E2 statt sichtbarer v6-Schalen. Hunky zeigt zwei Augenstiele, Dory das zentrale Auge und seitliche Fühler. **Bei beiden fehlt der sichtbare Mund in dieser generischen Registry-Anbindung.** Das ist ein Anbindungsfehler, keine Behauptung, dass die GLB-Quelle keinen Mund haben könne. Alte HeadPart-Mund-Montage kann nicht ohne passende aktuelle, modellgebundene Parameter übernommen werden. Keine Ersatzgeometrie oder neue Augenstiele gebaut; STOP-Hinweis im lokalen Quellstand. Keine Freigabe für diese Figuren.

## 2 · FrizzleBob: R4 Referenzprüfung FAIL

Siehe `WSA_TO_WS0_FB_CANON_R4_RETURN.md`: tatsächlicher P08-Akteur in bestehender Proof-Stage, Rig-Augen, Originalbrauen −0,08/Pitch 8, sechs saubere Diagnoseansichten gespeichert. Kein GLB-Export. Mundbereich bleibt verschmiert/gerieft, Kopf und Lidhaut uneinheitlich. Unabhängige Bildprüfung bestätigt FAIL. Keine Bilder als Georg-Abnahmevorlage ausgegeben und keine FB_CANON-Karte/Hash umgestellt. Ohren-Reduktion nicht begonnen.

## Implementierung und Prüfungen

Geänderte lokale Hauptdateien: `dist/index.html`, `dist/kfb-lib/character-registry.v1.js`, `dist/data/character-registry/registry.json`, `dist/kfb-lib/reference-proof.v1.js`, vorhandene Proof-Stage-Owner unter `dist/kfb-lib/proof-stage/`; QA-Resolver, Tests und Empfangs-Patch unter `qa/`.

- PASS: Register-Parität 131 IDs / 177 Einträge; negativer Test meldet fehlenden Pencil; FB ausgeschlossen; Pencil/Eraser B46; Hexe A/B gelistet; glbCurrent bei Aliens; manipulierte Karte und Modell-Hash werden abgewiesen.
- PASS: Syntax des tatsächlichen Inline-JavaScripts (Importmap separat) und des Referenzadapters. Die erste Extraktion hatte die JSON-Importmap fälschlich als JavaScript geprüft; Extraktion korrigiert, kein Produktfehler daraus abgeleitet.
- Browser: Pencil/Eraser sichtbar; Aliens aktuelle Quellen sichtbar, aber Mund fehlt → FAIL. FB offen/halb/zu sowie vorn/¾/Seite sichtbar → Gesamt-FAIL.
- Gemeinsame Materialien/Licht/Geometrie nicht neu geschrieben. `qa/proof-owner-vendor.json` nennt Original- und aktuelle Hashes. Zwei explizite Empfangs-Patches: bereits konfigurierten P08-Akteur an Proof-Stage übergeben, N30-v1.1-Import. Alle anderen vendorten Owner bytegleich. v3-Lidwrapper importiert unveränderte v2-Geometrie und ergänzt nur das vorhandene claySeed-Attribut. Das ist kein Nachweis gleicher sichtbarer Kopf-/Lidtextur.
- Modell-Whitelist nur lokal; private GLBs nicht ins Site-dist kopiert. Lokale QA-Route ist keine veröffentlichte Abnahme-URL. Die `/__registry_model/`-Whitelist wird nur vom lokalen QA-Server bedient; ein gehosteter Zugriff auf die privaten aktuellen Kartenmodelle ist hier nicht implementiert. Ein Source-Push allein würde deshalb noch keinen funktionsfähigen Staging-Stand ergeben.

Belege liegen lokal unter `/Users/georgv.westphalen/.codex/.chatgpt-projects/g-p-6aa43ccf8750819191582c384993f2c1/work/toolbox-restart-r1/qa/evidence`; Hash-/Dateiliste `evidence-manifest.json`, Profil-Suchbeleg `qa/profile-search.json`, komplette Auflösung `qa/registry-resolution.json`. Screenshots wurden nicht an einen fremden Host übertragen. Historisches `fb-r4-visual-fail.jpg` zeigt noch irreführendes technisches PASS; Receipt und aktueller Quellstand führen das visuelle FAIL separat und vorrangig.

## Offene Punkte / nächstes Gate

1. WS0: fehlende aktuelle Karten/eyeRig/SHA/Quellpfade laut vollständiger Liste unten konsolidieren; keine Roh-GLB-Fallbacks.
2. Bestehenden, modellgebundenen Mund-/Face-Mount für aktuelle Aliens und P08 klären und wiederverwenden. Der kleinste fehlgeschlagene Anschluss ist mit Bildbelegen konserviert; kein weiterer spekulativer Neubau.
3. Aktuelle gespeicherte Georg-Profile eindeutig der aktuellen Modellversion zuordnen; erst dann wieder anwenden. Keine Behauptung verlorener Daten.
4. Source-Branch-Übertragung an das bestehende private Sites-Projekt benötigt wegen Auto-Review eine konkrete Freigabe der enthaltenen Register-/Figurenkartenmetadaten. Bis dahin bleibt die Implementierung lokal gesichert. Danach weiterhin nur Staging, keine Live-Freigabe ableiten.
5. Erst nach sauberem FB-Referenzbild und Georgs PASS exportieren; später Höhe/38 Clips/Wiederimport/Ansichtspaarvergleich. Keine FB_CANON-Freigabe vorweggenommen.

**Nächstes fachliches Gate: ein source-treues, sauberes Gesichtsnahbild vor Export.**

## Vollständige Liste aktuell gesperrter Einträge

| Register-ID / Look | Sperrgrund |
|---|---|
| `4gtn_ceo` | Modell-Prüfsumme fehlt |
| `4gtn_forgotten` | Modell-Prüfsumme fehlt |
| `action_figure` | Karte fehlt |
| `agent` | Modell-Prüfsumme fehlt |
| `agent::agent_b40_glasses` | Modell-Prüfsumme fehlt |
| `agent_large` | Modell-Prüfsumme fehlt |
| `agent_large::agent_b40_large_glasses` | Modell-Prüfsumme fehlt |
| `animal_beaver` | Karte fehlt |
| `animal_bee` | Karte fehlt |
| `animal_cat` | Karte fehlt |
| `animal_caterpillar` | Karte fehlt |
| `animal_chick` | Karte fehlt |
| `animal_cow` | Karte fehlt |
| `animal_crab` | Karte fehlt |
| `animal_deer` | Karte fehlt |
| `animal_dog` | Karte fehlt |
| `animal_elephant` | Karte fehlt |
| `animal_fish` | Karte fehlt |
| `animal_fox` | Karte fehlt |
| `animal_giraffe` | Karte fehlt |
| `animal_hog` | Karte fehlt |
| `animal_koala` | Karte fehlt |
| `animal_lion` | Karte fehlt |
| `animal_monkey` | Karte fehlt |
| `animal_panda` | Karte fehlt |
| `animal_parrot` | Karte fehlt |
| `animal_penguin` | Karte fehlt |
| `animal_pig` | Karte fehlt |
| `animal_polar` | Karte fehlt |
| `animal_tiger` | Karte fehlt |
| `animatronic_creepy` | Karte fehlt |
| `animatronic_normal` | Karte fehlt |
| `black_knight` | Quelle fehlt |
| `brain_cyborg` | Modell-Prüfsumme fehlt |
| `brick_fish` | Modell-Prüfsumme fehlt |
| `caveman` | Karte fehlt |
| `clanker` | Karte fehlt |
| `demon_lord` | Quelle fehlt |
| `driver` | Karte fehlt |
| `farmer_a` | Karte fehlt |
| `farmer_b` | Modell-Prüfsumme fehlt |
| `farmer_daumen` | Modell-Prüfsumme fehlt |
| `farmer_hut` | Modell-Prüfsumme fehlt |
| `farmer_karre` | Modell-Prüfsumme fehlt |
| `frost_golem` | Karte fehlt |
| `helper_a` | Karte fehlt |
| `helper_b` | Karte fehlt |
| `hiker` | Karte fehlt |
| `kaeptn_kayfa_bizarro` | Modell-Prüfsumme fehlt |
| `kayfabrick_bot` | Modell-Prüfsumme fehlt |
| `kayfabrick_bot_one` | Modell-Prüfsumme fehlt |
| `kayfabrick_bot_two` | Modell-Prüfsumme fehlt |
| `lorekeeper::lorekeeper_b31` | Modell-Prüfsumme fehlt |
| `magical_girl` | Karte fehlt |
| `man_in_black` | Modell-Prüfsumme fehlt |
| `mannequin_medium` | Karte fehlt |
| `marksman` | Karte fehlt |
| `monster` | Karte fehlt |
| `monstrosity` | Quelle fehlt |
| `monstrosity::monstrosity_b` | Quelle fehlt |
| `mummy_a` | Quelle fehlt |
| `mummy_b` | Quelle fehlt |
| `ninja::ninja_npc` | Modell-Prüfsumme fehlt |
| `norman` | Quelle fehlt |
| `orc_brute` | Quelle fehlt |
| `orc_brute::orc_brute_b` | Quelle fehlt |
| `orc_legacy_a` | Modell-Prüfsumme fehlt |
| `orc_legacy_a::kfb_band_trumpeter` | Quelle fehlt |
| `orc_legacy_b` | Modell-Prüfsumme fehlt |
| `orc_legacy_b::kfb_band_leader` | Quelle fehlt |
| `orc_raider` | Quelle fehlt |
| `orc_raider::orc_raider_b` | Modell-Prüfsumme fehlt |
| `paladin` | Karte fehlt |
| `pet_chick` | Modell-Prüfsumme fehlt |
| `pet_cow` | Modell-Prüfsumme fehlt |
| `pet_pig` | Modell-Prüfsumme fehlt |
| `plant_warrior` | Karte fehlt |
| `protagonist_b` | Karte fehlt |
| `prototype_pete` | Karte fehlt |
| `q_alien` | Augen-Rig fehlt |
| `q_alien::kfb_q_alien_healed` | Augen-Rig fehlt |
| `q_alien_tall` | Augen-Rig fehlt |
| `q_alien_tall::kfb_q_alien_tall_healed` | Augen-Rig fehlt |
| `q_cactus` | Augen-Rig fehlt |
| `q_cactus::kfb_q_cactus_healed` | Augen-Rig fehlt |
| `q_chicken` | Augen-Rig fehlt |
| `q_chicken::kfb_q_chicken_healed` | Augen-Rig fehlt |
| `q_crab` | Augen-Rig fehlt |
| `q_crab::kfb_q_crab_healed` | Augen-Rig fehlt |
| `q_cyclops` | Augen-Rig fehlt |
| `q_cyclops::kfb_q_cyclops_healed` | Augen-Rig fehlt |
| `q_deer` | Augen-Rig fehlt |
| `q_deer::kfb_q_deer_healed` | Augen-Rig fehlt |
| `q_demon` | Augen-Rig fehlt |
| `q_demon::kfb_q_demon_healed` | Augen-Rig fehlt |
| `q_ghost` | Augen-Rig fehlt |
| `q_ghost::kfb_q_ghost_healed` | Augen-Rig fehlt |
| `q_greendemon` | Augen-Rig fehlt |
| `q_greendemon::kfb_q_greendemon_healed` | Augen-Rig fehlt |
| `q_mushroom` | Augen-Rig fehlt |
| `q_mushroom::kfb_q_mushroom_healed` | Augen-Rig fehlt |
| `q_panda` | Augen-Rig fehlt |
| `q_panda::kfb_q_panda_healed` | Augen-Rig fehlt |
| `q_penguin` | Augen-Rig fehlt |
| `q_penguin::kfb_q_penguin_healed` | Augen-Rig fehlt |
| `q_pig` | Augen-Rig fehlt |
| `q_pig::kfb_q_pig_healed` | Augen-Rig fehlt |
| `q_tree` | Augen-Rig fehlt |
| `q_tree::kfb_q_tree_healed` | Augen-Rig fehlt |
| `q_yeti` | Augen-Rig fehlt |
| `q_yeti::kfb_q_yeti_healed` | Augen-Rig fehlt |
| `robot_one` | Karte fehlt |
| `robot_two` | Karte fehlt |
| `space_ranger` | Karte fehlt |
| `suit_ct` | Modell-Prüfsumme fehlt |
| `superhero` | Karte fehlt |
| `survivalist` | Karte fehlt |
| `tiefling` | Karte fehlt |
| `toy_soldier` | Modell-Prüfsumme fehlt |
| `toy_soldier_cop` | Modell-Prüfsumme fehlt |
| `vampire` | Modell-Prüfsumme fehlt |
| `werewolf_man` | Karte fehlt |
| `werewolf_wolf` | Karte fehlt |
| `witch` | Quelle fehlt |
| `witch::witch_a` | Modell-Prüfsumme fehlt |
| `witch::witch_b` | Modell-Prüfsumme fehlt |
