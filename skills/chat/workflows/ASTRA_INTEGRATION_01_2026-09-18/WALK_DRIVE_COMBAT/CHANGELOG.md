# KFB Free Roam · additiver Changelog

Bestehende Einträge erhalten. Dieses Protokoll gehört nur zum abgegrenzten Walk↔Drive↔Combat-Vorbereitungsauftrag, nicht zu einem neuen Gesamtprojekt.

## 2026-09-18 · Preparation r1

**USER REQUEST:** Georg eröffnet diesen Arbeitsstrang zur Entwicklung/Pflege des KFB-Core-Zusammenspiels über GitHub; Basis `../WALK_DRIVE_COMBAT_PREFLIGHT.md` und beigefügter Kontext.

**SOURCE REVIEW:** vorhandene Race-/Travel-/Arena-/Atlas- und aktuelle ToolBox-Intake-Nähte geprüft, Dateiblobs in SOURCE_REVIEW festgehalten. Slice04 frei gelenktes dynamisches Fahrzeug gegenüber BOX1-s/x-Streckenmodell abgegrenzt. Reverse-Neutralphase, Rückwärts-Cap, Boost, sphärische Kontakte, Übergabetransaktion und Save-Nähte als konkrete Anpassungen benannt. Bestehendes City-Rezept gefunden; zwei doppelte Straßenbelegungen und zwei Baustellenpositionen im Korridor ausgewertet. ZIP-only-Notiz für KayKit-City anhand realer GLTF-/BIN-Präsenz am Atlas-Pin korrigiert, ohne den Originaldonor umzuschreiben.

**PROPOSAL:** Slice04 als Free-Drive-Spender, vorhandene WB0-Brücke als Receiver, BOX1 als Fahrgefühl-/Präsentationsreferenz. Konkreter Control-/Enter-/Exit-/Persistenzvertrag, gezielter Quartier-Bauauftrag, D01–D12-Abnahme und genau ein inaktiver Astra-Delta. Keine neue Engine, kein neuer Owner, keine Registry/Assetkopie.

**IMPLEMENTATION:** nur neue Vorbereitungsdokumente, eine read-only JS-Quell-/Rechenprobe und deren tatsächliche Ergebnisdatei. Keine Runtime-, Model-, Workflow-, Hub- oder aktiven r3-Briefänderungen. Kein Astra-Start. Rücknahme betrifft nur diese hinzugefügten Dateien, nicht fremde main-Commits.

**TESTED RESULT:** 5/5 begrenzte Quell-/Rechenprüfungen unter Node v22.16.0. Originaler City-Blob `be8364bd6dec7b423d6cf3c48163e73fffd5d471` bestätigt. Zwei gerade/Übergang-Doppelbelegungen; 21 Straßenplatzierungen auf19 Zellen; zwei Baustellenobjekte auf der Straßenachse. Ideale Kugel-/Tangentenebenenrechnung bestätigt. Der Prüfscript filtert ausdrücklich Straßenflächen, nicht `road-sign-street`. Keine vorgeschlagenen Donoränderungen angewendet.

**NOT TESTED:** Modellbounds/Sidecar-Closure, dynamische Physik, Reverse-Fahrt, sphärischer Receiver, Enter/Exit, Combat, Browser, Public-Deployment und menschliche Abnahme. Historische Donor-/Browserergebnisse nicht zu neuen Ergebnissen umbenannt.

**STATUS / NEXT:** READY WITH OPEN DECISIONS. Nächster begrenzter Lauf: physischer Spendernachweis auf tatsächlicher Travel-Kontaktgeometrie mit Einheiten-/Up-/Gebietsvertrag, dann valide Walk↔Drive-Transaktion. Ground=8-/Atlas-/BOX1-/v0.10-Gates bleiben bestehen. Recovery in `../WALK_DRIVE_COMBAT_RETURN.md`.

## 2026-09-18 · FR-S04-01 · fester Testeinstieg / implementierter Kontaktversuch

**USER DECISION:** Georg verlangt eine feste URL für aktuelle und ältere Testkonfigurationen mit Figuren/Fahrzeugen und die Fortsetzung am vorhandenen Slice-04-Fahrzeug.

**IMPLEMENTATION:** Race `ChatGPT_web/free-roam/` enthält quellengepinnten Slice-04-Adapter, Reverse-/Brake-Input, zwei vergleichbare Inputprofile, Originalkart, echten Travel-Terrainbäcker mit gebackener Kontaktgeometrie und begrenztem lokalen Physikraum. Ein wiederverwendbarer Build/Testlauf; akzeptierter Produktionscode und BOX1/v0.8 bleiben unverändert. Öffentlicher KFB-Navigator `/kfb-hub/free-roam/`, Release-Zeiger und feste Version `/versions/fr-s04-01/`. Bestehende Ground8-/BOX1-/Resident-/World-Atlas-Einstiege bleiben separate Owner-Vergleiche.

**TESTED RESULT:** 9/9 reine Inputtests und 19/19 Source-Browserchecks bestanden. Screenshot-Review verwarf die erste zu küstennahe Fläche trotz enger grüner Quelltests; trockene Standortauswahl, 81 Bodenproben und erneuter Browserlauf an Quelle `d98600ef52c9f1fc28bd93bcbbe8f6f177eece37` / Race Run `35356984356`. Früherer MIME-Fehler durch Same-Origin-Packaging unveränderter Travel-JS-Quellen geschlossen; alte Befunde bleiben History.

**PUBLIC DEPLOYMENT / TEST:** Race PR #5 / Merge `04256ecb817e5d0e2e57a2476039294c26ceab79`; öffentlicher Mirror PR #57 / Merge `f044d7908d967e1cf8056b2f831a7d30529b1fda`. Tatsächliche Cloudflare-Prüfung `35358106388`, Job `105642348266`, Artefakt `10553581108`: 48/48 Quellen-/Byte-/Navigations-/Browserchecks PASS, keine Script-/Console-Fehler. ZIP heruntergeladen und gehasht, Report gelesen, Screenshots angesehen. Vollständige Herkunft, Hashes, Umfang und Grenzen in `kfb-hub/free-roam/PUBLIC_STATUS.md`. Die öffentlich abweichende abschließende LF in physics.js ist explizit im Mirrorvertrag und Byteprüfer erfasst; keine pauschale Byteidentität behauptet.

**OPEN / UNCHANGED:** Human-Fahrgefühl, physische Geräte und längeres Freeplay; tatsächliche Walk↔Drive-Übergabe im Travel-Host, geparkter Wagen/Exit/Save, weitere Fahrzeug-/Figurenkombinationen in der Probe, City/Combat/Audio/Deformer. Ein Kart auf lokalem Terrain ist kein vollständiger World-Consumer-PASS. Keine neue Engine/Registry/Owner; keine native ChatGPT-Site erzeugt; kein großer Astra-Start, r3 und inaktiver Delta bleiben unverändert. Recovery erhält einen additiven aktuellen Einstieg über der unberührten Vorbereitungshistorie.


## 2026-09-18 · Ground regression repair + FR-S04-02

**HUMAN FINDING:** Georg reports the public Ground comparison regressed (white/missing-looking terrain cards, locomotion too slow/out of sync, five test models at wrong scale classes) and rejects FR-S04-01 handling (A/D + Orbit conventions, unstable reverse, trap-prone circular test area).

**GROUND IMPLEMENTATION:** Travel PR #25 restores explicit measured rig classes / class-relative movement; PR #27 restores one-world-deck text-first terrain cards through an additive WB0 adapter; PR #28 advances the existing PDF artwork pump in Ground without re-enabling Flight presentation. Frozen B0 remains guarded.

**GROUND TESTED PUBLIC RESULT:** kayfabizarro run `35365887832` attempt 2 / job `105672379932` / artifact `10556777649` PASS on the actual fixed URL: 56/56 cards assigned + textured, progressive real PDF fronts; Medium/Large/Legacy/KFB-Mech/Raw-Mech classes and distinct speeds verified. Human visual/cadence acceptance remains open.

**FR-S04-02 IMPLEMENTATION:** Race PR #6 / merge `63cb97d5e321700e55f7658104b42c9c09d97d70`. Corrected A/D physical convention, reverse hysteresis + bounded reverse + candidate reverse assist, Ground-compatible Orbit direction, stronger low-speed steering, radius-48/radius-56 open baked-Travel fixture with no fence. FR-S04-01 preserved and labelled rejected/superseded rather than overwritten.

**FR-S04-02 SOURCE TESTED RESULT:** source `a7a48a8c6e1589a18134aa619e2be22d79124c32`, run `35365197941`, artifact `10555832979`: 9 intent tests + 33 browser assertions PASS including reverse no-chatter, actual turn response, Orbit convention, boost, Hop and 180-tick no-stuck curve.

**PUBLICATION:** kayfabizarro PR #63 publishes immutable `fr-s04-02` and moves the permanent navigator current pointer. Actual Cloudflare proof remains a separate gate and was running when this entry was written.

**NEXT:** human FR-S04-02 handling review first; then defined stunt-ramp slice on the wide fixture. Receiver work stays Walk↔Drive handoff / park / safe exit / restore. No owner replacement and no Astra full-run promotion from source tests alone.
