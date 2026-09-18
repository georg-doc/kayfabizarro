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
