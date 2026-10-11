# WSA · Editor-Regeln R1 · 11.10.2026

Owner: bestehendes KFB Island Worldbuilder Lab (three r186). Georg autorisiert Übertragung der belegten Regeln; keine neue Asset-Sammlung, kein Golden/Merge.

## Implementiert
Bestehender Editor src/editor.ts, optionales sceneStudy in world version1 / src/island/spec.ts, neues reines Metadaten-/Prüfmodul src/scene-study.ts. Auswahl, Kamera-Fokus, Save/Import/Export/Reload und TransformControls bleiben der vorhandene Owner.

Orte benennen, Tätigkeit erfassen, tatsächliches ausgewähltes Source-Objekt als Fokus setzen; weitere Objekte derselben Insel zuordnen/entfernen. Orte aufrufen, Beziehungen mit Zweck zwischen Inseln speichern; Ort löschen entfernt seine Beziehungen. Fehlende Insel/Fokus-/Gruppenobjekte, isolierte Orte und leere Zwecke werden gemeldet. Selbstverbindung und leere Verbindungszwecke werden abgelehnt. UI trennt vollständige Beschreibung ausdrücklich von ungeprüftem Bodenanschluss/Freiraum/Fahrbarkeit.

Quellenübertragung: A gemeinsamer Handlungsfokus und passende Requisiten; B freier Ankunftsraum, Landmarkenstaffelung und sichtbare Höhenübergänge; C bestehender Licht-Owner unverändert; D keine zweite Straßenkonstruktion/Palette. Keine erfundene Dichte, feste Dreiergruppe, Figuren-Skalierung oder automatische Streuung. Beziehungen sind Design-Metadaten, keine gebauten/fahrbaren Straßen.

## Tatsächliche Donoren und Ergebnis
Test mit vorhandenen KayKit-Instanzen hex/yellow/building_watermill_yellow.gltf und hex/blue/building_tavern_blue.gltf. Ganze Testwelt vor/nach Erfassung identisch bis auf sceneStudy-Metadaten. Source-Objekte isoliert tatsächlich gerendert: donor-watermill.jpg und donor-tavern.jpg; echte UI-Bildaufnahme editor-relationships.jpg privat/lokal. Keine neue Architektur-Abnahme: die ältere Testwelt wird nicht als neue Szene präsentiert.

Vorlage-zuerst an Steuerung: replies/WSA_EDITOR_RULES_SOURCE_FIRST_2026-10-11.md, verifizierter Steering-Commit d8c2d08833c6f5abf244decca9120cd83e7d63eb. Genau drei lokale Source-Dateien installiert, vorherige Dateien gesichert und Source-Drift vor dem Schreiben ausgeschlossen. Vor-/Nach-Hashes: install-manifest.json. Öffentlicher reproduzierbarer Patch: EDITOR_RULES_R1.patch.

## Prüfung
TypeScript --noEmit PASS. Browser-Authoring PASS: Fokus/Tätigkeit, Cross-Island-Beziehung, Save/Fresh-Reload, fehlendes Fokusobjekt, Self-/Blank-Link-Ablehnung, Ortsnavigation und Lösch-Cascade; keine Page-Errors. Bestehende Parity auf dem Kandidaten: game 10/10 PASS (V-060, V-041, V-073 und bestehende B0-Kamera-/Gang-Abnahmen). Installiertes Lab ebenfalls game 10/10 PASS, ohne Page-Errors. Die abschließende Auswahlbezeichnungs-Korrektur ist TypeScript- und Browser-Authoring-geprüft; sie ändert keine Gameplay-Funktion. Kein allgemeiner Performance- oder Driving-Nachweis daraus.

## Grenzen / nächster Gate
Kein Phase-D-Gizmo für die acht unveränderten gekauften ganzen Demo-Szenen geliefert; keine gebaute Protopia/Makerspace-Szene, keine neue Track-Verbindung. Das bleibt beim vorhandenen Phase-D/E/F-Owner. Neue Editor-Regeln ersetzen diese Module nicht.
Nächster Gate: Georg prüft den Orts-/Beziehungsablauf im bestehenden Editor; danach kann der zuständige Owner reale Zugänge, Geländeanschlüsse und Wege mit den vorhandenen Modulen bauen und separat prüfen. Kein neuer Runtime-Owner, kein Plugin-Update, Golden, Merge oder öffentlicher Stage.
