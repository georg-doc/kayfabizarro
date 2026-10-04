# Onboarding · frischer Chat · KFB Resident Atlas

**Stand:** 2026-09-17 · Sprint S32 · 21 Residents · Export `2026-09-17-r1` (`PORTABLE_EXPORT_COMPLETE`, online-portabel)

Dieses Dokument ist der Einstieg. Es ersetzt das Nachlesen von 32 Changelog-Einträgen.

## Lesereihenfolge (15 Minuten)

| # | Datei | Warum |
|---|---|---|
| 1 | `docs/RECOVERY.md` | Die vier tragenden Regeln und die fünf Fehlerklassen. Wichtigste Datei. |
| 2 | `docs/ATLAS_RETURN.md` | Entscheidungen, Befunde, OPEN 1–30. Das Gedächtnis. |
| 3 | Kopf von `data/cast.js` | Strukturregel Hand-Requisiten. |
| 4 | `docs/ATLAS_NEXT_SLICES.md` | Sieben Scheiben mit Briefing. |
| 5 | `docs/ARCHITECTURE.md` | Drei Module, Datenfluss, Architektur-Schulden. |

Nicht vorab lesen: `CHANGELOG.md` (32 Einträge, nur zum Nachschlagen).

## Housekeeping — vor dem ersten Sprint

| Aufgabe | Warum |
|---|---|
| `screenshots/` leeren | Enthält nur Arbeitsstände der letzten Session. |
| `uploads/` prüfen | Referenzbilder und Handoff-JSONs von Georg. **Zwei werden zur Laufzeit gebraucht** (`uploads/pasted-1789657767582-0.png` Cleric, `uploads/pasted-1789658364412-0.png` Hero Man). Vor dem Löschen greppen. |
| `media/3D_Assets/` | Enthält **keine** Modelle, nur `INDEX.md` und wenige Bilder — so gewollt (Entscheidung 14: alle Assets via GitHub). Nicht löschen: der Ordner trägt die Pfadstruktur, gegen die die Rezepte auflösen. |
| `_inbox/`, `scenes/`, `registry/` | Unverändert lassen. `registry/assets/v1/packs/index.json` wird gelesen. |
| Projekttitel | Heißt aktuell „Copy of KayKit Atlas Preflight Access", Inhalt ist der Resident Atlas S6. Umbenennen entscheidet Georg. |
| Ältere Szenen | `KayKit_City_Sample_S4.html`, `Kenney_City_Block_S2.html`, `Kenney_Racing_Track_S3.html`, `KayKit_Dungeon_Room_S1.html`, `KFB_Resident_Atlas_S5.html` sind frühere Kit-Lab-Stände. Bewusst erhalten, nicht anfassen. |

## Sprintplanung — Vorschlag, in dieser Reihenfolge

### S33 · QA-Prüfskript (Scheibe D) — zuerst, und zwar mit Grund

Dieselben vier Messungen sind in den letzten acht Sprints jedes Mal von Hand geschrieben worden. Das Skript hätte gefunden: die Caption-Verdeckung (S32), beide verschluckten Array-Kommas, mehrere veraltete Zahlen und den fehlenden Hand-Abstand (S28, drei Sprints unentdeckt).

Umfang: eine eigene Seite `tools/qa-pass.html`, die alle 21 Residents baut und pro Requisite ausgibt — Abstand zur **Hand**, zum **Kopf**, Unterkante über Grund, Bindungsquote, und zusätzlich eine **Projektionsprüfung gegen die HUD-Overlays**. An gefrorener Pose. Ausgabe als Tabelle plus JSON zum Ablegen.

Abbruchkriterium: wenn das Skript für einen Resident mehr als drei Auffälligkeiten meldet, erst den Resident reparieren, dann weitergehen — nicht 21 Baustellen gleichzeitig öffnen.

### S34 · UI kompakt und responsiv (Scheibe G)

Toggle-Icon oben rechts, alle Paletten mit einem Griff weg, Caption mit unter den Toggle, Header konsolidieren. Messkriterium: Bühnenfläche in Pixeln vor/nach, plus Projektionsprüfung auf Verdeckungsfreiheit.

### S35 · Jonglier-Clip (Scheibe B)

Briefing steht komplett in `ATLAS_NEXT_SLICES.md`: Flugbahn zuerst, dann Handanker, dann Arme per CCD, Keulenrotation zuletzt mit **ganzzahliger** Halbdrehungsbedingung. Zyklus aus einer Phasenfunktion, nicht aus Keyframes — sonst schließt der Loop nicht. Drei Keulen sicher, sechs erst rechnen.

### S36 · Dance Move Set (Scheibe C)

Drei Zielklassen mit unterschiedlicher Machbarkeit: Rig_Medium reich, Rig_Large eigenständig zu bauen (Rig_Medium-Clips binden, deformieren aber falsch), Rig_Legacy KISS mit sechs Bones und ohne Beinarbeit.

### S37 · Rest von Scheibe F: Startest und Zustands-Export

**Nicht** Assets ins Paket ziehen — das widerspricht Entscheidung 14 (alle Assets via GitHub, gepinnt). Offen sind die zwei echten Lücken: (1) Start aus dem entpackten Paket über HTTP tatsächlich ausführen und im `TEST_REPORT.md` von `NOT_RUN` auf ein Ergebnis setzen, (2) vollständiger Browser-Zustands-Export als JSON plus ein Import-Pfad für Studio-Patches. Optional und separat: three.js nach `vendor/` spiegeln, falls netzunabhängiger Betrieb je gefordert wird.

### Später · Architektur (Scheibe E)

`lib/atlas.js` teilen und die elf Attachment-Optionen konsolidieren. Berührt alle 21 Rezepte. Erst sinnvoll, wenn das QA-Skript aus S33 die Regression abfangen kann — vorher ist der Umbau blind.

## Arbeitsweise, die sich bewährt hat

1. **Messen, bevor man behauptet** — auch und besonders bei „geht nicht".
2. **Nach der letzten Parameteränderung erneut messen**, nicht nach der letzten Codeänderung.
3. **Nach dem Doku-Schritt laden** — Prosa in `data/cast.js` ist Code.
4. **Nach einem Widerruf projektweit nach den Begriffen des jeweiligen Widerrufs greppen**, case-insensitiv, Kommentare und Header eingeschlossen.
5. **Generierte Prosa im Panel** statt getippter: jede Notiz nennt ihre Messung. So fällt eine veraltete Zahl im Panel auf, nicht erst im Review.

## Owner-Grenzen

Atlas/ToolBox: Komposition, Messung, Kandidatenrezepte. Registry/Librarian: Quelle und Provenienz. Travel: Welt, Platzierung, Kontakt, Persistenz, Runtime. Race und Combat: eigene Implementierung. Animation Lab: Rig-, Motion- und Attachment-Freigabe. Alle Atlas-Ausgaben bleiben `candidate-only`; der Preview-Renderer wird nicht zum zweiten Travel-Renderer.