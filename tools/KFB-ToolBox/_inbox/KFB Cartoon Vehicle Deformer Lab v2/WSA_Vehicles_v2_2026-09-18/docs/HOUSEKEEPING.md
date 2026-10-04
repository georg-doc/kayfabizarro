# HOUSEKEEPING — KFB 3D Cartoon-Animation Library

Stand: 2026-09-18 · Session-Cut Fahrzeug-Linie.
Abschnitt 1 ist der Check-in vom 12.09. (Animation Lab v1.1, Cross-Rig) und bleibt unverändert stehen.
Die Fahrzeug-Linie `lab-v7` steht im Abschnitt am Ende.

## Status je Artefakt

| Datei | Status | Anmerkung |
|---|---|---|
| `KFB Animation Lab v1.dc.html` | AKTIV | Neue Linie, WS1 Sprint 2 Shell. Eigene UI (dezent, kein DC-Branding). Loader/Rig-Messung/Bildstreifen vom Clip-Schau-Donor. |
| `data/kfb-asset-library-v7.json` | ASSET | Georgs Asset-Export vom 12.09., Grundlage der Pfade im Roster. Nicht in den Export. |
| `SOURCE_PATHS.md` | AKTIV | Quellen, Pfade, doppelte Pack-Kopien, Backlog (Props, Waffen, VFX, SFX). |
| `README.md` | AKTIV | Einstieg in das Paket: Funktionen, Regeln, Aufbau, Standalone-Neubau. |
| `LAB_QA.md` | AKTIV | Abnahme v1 + v1.1 mit PROPOSAL / IMPLEMENTATION / TESTED RESULT je Punkt. **Ersetzt `QA_CLIPSCHAU.md`.** |
| `QA_CLIPSCHAU.md` | SUPERSEDED | Sprint-1-Fassung. Zwei Zeilen standen auf OPEN, die inzwischen gelaufen sind. Inhalt in `LAB_QA.md` übernommen und geschlossen. |
| `templates/KFB Lab UI Shell v1.html` | ASSET · VORLAGE | UI-Vorlage für FrizzleBob/Frankenstein Studio. Eigenständig, ohne Abhängigkeiten. |
| `lab/locomotion.js` | AKTIV · MODUL | Sprint-3-Testbett. Besitzt den CharacterRoot-Transform, wendet keine Root Motion an. Lab-Werte, keine Gameplay-Tuningwerte. |
| `lab/assets.js` | AKTIV · DATEN | Roster, Packs mit Rig-Verfügbarkeit, Familien, KFB-State-Liste. Keine three-Abhängigkeit. **Quelle gepinnt auf `b97b5ac5…`.** |
| `lab/zipstore.js` | AKTIV · MODUL | Store-only ZIP-Schreiber, keine Fremdbibliothek. Trägt das Beweis-Bündel des Batch. **Im Standalone mitgeführt** (Build-Script embettet assets, loco, zip). |
| `lab/verify-sources.js` | AKTIV · MODUL | Prüft alle vom Lab benutzten Pfade gegen eine Revision, ein Byte je Pfad. Wird bei jedem Re-Pin gebraucht. |
| `lab/kfb-map.js` | AKTIV · DATEN | Die semantische Brücke: 24 KFB-Zustände → echter Donor-Clip. Clipnamen sind Messwerte, Status und Begründung sind Urteil — getrennt gehalten. |
| `lab/gen-map.js` | AKTIV · MODUL | Verbindet die Karte mit den Inventaren und schreibt `AnimationMap.v0.json` + `MISSING_ANIMATIONS.md`. Jeder genannte Clip wird im Inventar nachgesehen; ein unbekannter Name ist ein Fehler, keine Warnung. |
| `export/AnimationMap.v0.json` | AKTIV · ARTEFAKT | Sprint-4-Ergebnis. Je Zustand und Rig genau ein Status, mit Dauer, Bindung, Root Motion und Quellpfad des Donor-Clips. |
| `MISSING_ANIMATIONS.md` | AKTIV · ARTEFAKT | Der Produktionsauftrag. Zwei Tabellen, dazu »Production order candidates« und »Blocked, not missing«. |
| `export/SourcePin_b97b5ac5.json` | AKTIV · BELEG | 94 geprüfte Pfade, alle vorhanden, Urteil `COMPLETE_AT_REVISION`. |
| `KFB Clip-Schau v1.dc.html` | FROZEN · DONOR | Evidence-Viewer. Wird nach Sprint 1 eingefroren, nicht weiter aufgeblasen. |
| `clipschau-v1/roster.js` | AKTIV · GETEILT | Daten-Modul. Wird von der Bühne importiert, soll auch Scheibe 2 tragen. Nicht als tot einstufen. |
| `HANDOVER_LAB_v1.1.md` | AKTIV | Übergabe an einen frischen Chat: die fünf Ergänzungen mit Reihenfolge, Abnahme und Abbruchregel. |
| `LAB_RETURN.md` | AKTIV | Übergabe an WS A, **Fassung 2 (v1.1)**: die drei Vorschläge aus Fassung 1 sind erledigt, fünf offene Entscheidungen stehen neu. |
| `export/KFB Animation Lab v1 -standalone-.html` | AKTIV · HANDOFF | Eine Datei, 490 KB, mit Cross-Rig, startet ohne Workspace. Neu bauen heißt: `export/lab-standalone-src.dc.html` erzeugen, dann bündeln. |
| `export/lab-standalone-src.dc.html` | ASSET · ZWISCHENSTUFE | Lab mit eingebetteten Modulquellen. Nur Build-Input, nicht bearbeiten. |
| `KFB Clip-Schau SESSION_LIVING.dc.html` | AKTIV | Stand-Dokument nach living-document. |
| `github.md` | AKTIV | Repo-Bindung, Sync-Stand, Screen map. |
| `data/kfb-asset-library.json` | ASSET · 4,7 MB | Kopie von Georgs Upload vom 09.09. Kanonisch ist das Repo. Gehört NICHT in den Export. |
| `uploads/kfb-asset-library (6).json` | SUPERSEDED | Original-Upload, durch `data/`-Kopie ersetzt. |
| `support.js` | ASSET | Laufzeit, nicht von mir geschrieben. |
| `_ds/doccheck-group-design-system-…/` | ASSET | Design-System, gebunden. Nicht im Export. |

Vorgänger-Versionen: keine. Erste Session.

## Clean-Run-Checkliste

1. `KFB Clip-Schau v1.dc.html` öffnen. Kopf zeigt »loading three…«, dann »… clips · three r160«.
2. Lorekeeper lädt selbsttätig, HUD zeigt Rig Medium (measured), Knochenspanne char/M/L.
3. Rechts Jump & Run: MovementBasic und MovementAdvanced mit Clips.
4. Play läuft, Zeitachse hat roten Abspielkopf, Soll-Balken zeigt fünf Phasen.
5. »Frame strip« erzeugt ein Bild mit Kopfzeile und acht Zeitmarken.
6. Rig-Schalter Medium/Large unten rechts wechselt das Clip-Angebot.

## Offene Pfad-Hygiene (Schritt 6 des Export-Skills)

Für die Vorschau richtig, für einen Standalone-Export falsch:

- `_ds/doccheck-group-design-system-…/colors_and_type.css` und `_ds_bundle.js` — relativ. Im Export nicht vorhanden.
- `./clipschau-v1/roster.js` — relativ, wird zur Laufzeit importiert.

Alles Schwere ist bereits sauber: sämtliche GLBs laufen über `https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/…` (`clipschau-v1/roster.js`, Konstante `RAW`). three r160 kommt von unpkg per Importmap.

Fix-Kandidat für den Export: entweder Roster-Inhalt in die Bühne ziehen (dann ist die DC eine Datei) oder `roster.js` als RAW-URL importieren, sobald sie im Repo liegt.


## Animation Lab v1 · Clean Run

1. `KFB Animation Lab v1.dc.html` öffnen. Kopfzeile links zeigt den Charakternamen mit Statuspunkt.
2. Lorekeeper lädt selbsttätig, Rig-Schalter M/L, gemessenes Rig ist vorgewählt.
3. Untere Leiste füllt sich mit echten Clipnamen und Dauern, während die Packs des Rigs nachladen.
4. Suche und Familienfilter greifen auf die geladene Clipliste.
5. Transport: Restart, Schritt ±1/30 s, Play, Tempo-Zyklus, Loop. Space / , / . / ←→ auf der Tastatur.
6. »Stage« schaltet beide Seitenpanels aus, Bühne maximal, untere Leiste bleibt.
7. »Data« zeigt Messwerte (Dauer, Bindung, Root-Motion, Knochenspannen, Ladefehler, Quelle) — sonst sind sie unsichtbar.
8. »Strip« erzeugt acht Frames an expliziten Mixer-Zeiten und öffnet Data.

## Locomotion · Sprint 3

»Move« schaltet die Teststage. W A S D bewegen, Q E drehen, Shift rennt, Space springt — Space gehalten streckt den Anstieg (bis 0,30 s halbierte Schwerkraft), im Full-Modus tauscht ein langer Halt ab 0,15 s auf `Jump_Full_Long`. Shift beim Absprung gibt 15 % mehr Startgeschwindigkeit.

Zwei Sprungarten zum Vergleichen: **Chain** spielt `Jump_Start` → `Jump_Idle` → `Jump_Land`, **Full** spielt `Jump_Full_Short`/`_Long`. **Trail** zeichnet die gelaufene Spur, **Follow** zieht die Kamera mit (Orbit bleibt frei), **Reset** setzt auf den Ursprung.

Was nicht da ist, wird gesagt statt ersetzt: fehlt ein Clip im aktiven Rig, steht er in der Leiste unter »not in Rig …«. Rig Large hat weder Jump noch Strafe noch Walking_Backwards — dort fällt die Stage auf `Walking_A` zurück und der Sprung bleibt ein reiner Bogen ohne Clip.

## Cross-Rig · v1.1 Aufgabe 3.1 · abgenommen

»M+L« in der Kopfzeile nimmt beide Rig-Familien in die Clipleiste. Fremde Clips tragen einen Akzentpunkt und sagen es im Tooltip. Das gemessene Rig hat immer Vorrang — ein fremder Clip füllt nur eine Lücke, er verdeckt nie einen eigenen Clip. »FIT« erscheint daneben, sobald Cross-Rig läuft: es entfernt die Positionsspuren des fremden Clips und behält die Drehungen; aus heißt »RAW«, wie geliefert. Der Modus steht im Data-Panel, in der Kopfzeile jedes Bildstreifens und im Versuchsprotokoll.

Jeder gespielte fremde Clip wird als Versuch festgehalten: Figur, gemessenes Rig, Clip-Rig, Bindung, Dauer, Root Motion, Modus, entfernte Spuren. Im Data-Panel bekommt er das Urteil **Holds / Limited / Fails** — vom Bediener, nicht vom Werkzeug. Export: »Download cross-rig trials« (`CrossRigTrials.json`), zusätzlich als Abschnitt `crossRigTrials` in `RigCompatibility.json` und als Tabelle in `AnimationInventory.md`.

**Befund Large-Lücke:** Orc Brute (Large, Spanne 3,32) mit `Jump_Start` aus Rig Medium bindet 23/23 und faltet trotzdem zusammen. Ursache sind die 23 Positionsspuren mit den Knochenabständen des Medium-Rigs. Ohne sie (46 Spuren bleiben) hält die Figur und der Sprung ist lesbar. Urteil: **trägt mit Einschränkung** — nur als Drehungs-Übernahme. Belege: `screenshots/xrig_orcbrute_JumpStart_RAW.png` und `…_FIT.png`.

Eingetragen sind sechs Versuche: `Jump_Start`, `Jump_Idle`, `Jump_Land` aus Rig Medium auf Orc Brute, je roh (**Fails**) und ohne Positionsspuren (**Limited**). Sie liegen im Speicherschlüssel `kfb-lab-v1:xtrials` und überleben einen Neustart. **Produktionsfolge: Custom-Sprungclips für Rig Large entfallen.**

In der Locomotion-Teststage wirkt Cross-Rig genauso: fehlt der Sprung im Rig Large, füllt ihn Medium und die Leiste sagt »cross-rig: jumpStart, …«. Fehlt er überall, steht er weiter unter »not in Rig …«.

## Quellen gepinnt · S4.1 · erledigt

`RAW` in `lab/assets.js` zeigt jetzt auf `b97b5ac55df2724fae623992433685583eece51e` statt auf `main`. Vorher geprüft, nicht blind ersetzt: `lab/verify-sources.js` hat alle 94 verschiedenen Pfade (45 Figuren, Texturen, 14 Pack-GLBs, 8 doppelte Pack-Kopien) an der Revision abgefragt — alle vorhanden, Bericht in `export/SourcePin_b97b5ac5.json`.

Stichprobe danach am gepinnten Stand: Rig Large liefert 34 Clips, Knochenspannen char 3,32 · M 1,24 · L 3,20 — identisch zum Audit vom 12.09. Keine Pack-Fehler. Die Revision steht ab jetzt in jedem Export (`revision`), in der Kopfzeile jedes Bildstreifens (`src b97b5ac5`) und im Data-Panel.

**Was der Check nicht sagt:** er beweist Vorhandensein an der Revision, nicht Byte-Gleichheit mit `main`.

## Semantische Karte und Fehlliste · S4.2 + S4.3 · erledigt

`export/AnimationMap.v0.json` und `MISSING_ANIMATIONS.md`, erzeugt aus `lab/kfb-map.js` + `lab/gen-map.js` gegen die echten Inventare. Alle 24 geforderten Zustände, je Rig genau ein Status.

| Rig | exakt | anpassbar | prozedural | fehlt |
|---|---:|---:|---:|---:|
| Medium | 11 | 6 | 5 | 2 |
| Large | 5 | 1 | 0 | 18 |

Die zwei Lücken bei Medium sind `Dance` (nichts in 139 Clips) und `DriveAirborneBrace` (echte Posenänderung, kein Offset). Bei Large sind von den 18 Fehlstellen 7 nicht wirklich fehlend, sondern **blockiert**: alle Fahrzeug-Zustände hängen an einer einzigen sitzenden Grundpose, die Rig Large nicht hat. Einmal bauen, sieben folgen.

`Jump` bei Large steht dank 3.1 als **FOUND_ADAPTABLE** — Medium-Kette über Cross-Rig, Positionsspuren entfernt, Urteil limited. Das ist der einzige Zustand, dessen Eintrag auf einem gefahrenen Versuch beruht statt auf dem Inventar allein.

**Trennung, die eingehalten wird:** Clipnamen sind gemessen und werden beim Erzeugen im Inventar nachgesehen — ein Name, den es nicht gibt, bricht den Lauf ab (ist beim ersten Lauf auch passiert und hat einen echten Fehler in der Verknüpfung gefunden). Status und Begründung sind Urteil und als solches gekennzeichnet.

## Evidence-Batch · S4.5 · Vollauf abgenommen

**Georgs Vollauf vom 12.09. 04:22 ist gegengeprüft:** 48 von 48 Zellen, keine Lücke, Revision b97b5ac5 im Manifest. Cross-Rig griff genau einmal — Mannequin Large, Jump, `rotations-only`. Robot Two, Werewolf Wolf und Mannequin Medium liefen komplett auf eigenen Clips. Mannequin Medium bindet 21/23, wie im Audit; die drei anderen 23/23.

Belege im Projekt: `export/EvidenceBatch_2026-09-12_manifest.json` (das ganze Manifest) und `screenshots/sheet_werewolf_wolf_fullrun.png` (ein Bogen aus dem Vollauf). Die vier Bögen, 48 Streifen und das Bündel liegen im Drop-Repo unter `_inbox/KFB Animation Lab v1-1/`.

## Evidence-Batch · wie er arbeitet

»Batch« neben »Strip«. Ein Druck fährt vier Figuren (Robot Two, Werewolf Wolf, Mannequin Medium, Mannequin Large) × vier Zustände (Idle, Walk, Run, Jump) × drei Kameras (Front, Seite, ¾) ab. Ergebnis nach Georgs Wahl **Option C**: vier Kontaktbögen zum Ansehen (je Figur einer, Zustände in Zeilen, Kameras in Spalten) und ein Bündel zum Ablegen — fünf Downloads statt 48.

Im Bündel liegen `sheets/` (die vier Bögen), `strips/` (die 48 Einzelstreifen in voller Größe), `manifest.json` (je Zelle: Clip, Rig, Dauer, Bindung, Root Motion, Quellpfad, Revision, ob Cross-Rig) und ein `README.txt`. Das Manifest nennt Soll und Ist der Zellenzahl, damit ein abgebrochener Lauf auffällt statt unbemerkt zu bleiben.

Jede Zelle trägt ihre Bedingungen im Bild. Fehlt ein Clip im geprüften Pack, steht `NOT FOUND IN AUDITED PACK` als Zelle — keine Lücke ohne Beleg. Cross-Rig ist während des Batch eingeschaltet: das eigene Rig gewinnt weiter, und wo ein fremder Clip einspringt, sagt die Zelle es (`CROSS-RIG FIT from Rig Medium`, `position tracks dropped`).

**Prüfnaht:** `window.__KFB_BATCH_DRY` lässt den Batch alles tun außer herunterladen, `window.__KFB_BATCH_FIGS` verkleinert die Figurenliste. Damit ist der Lauf prüfbar, ohne 48 Dateien zu erzeugen.

**Abnahme des Probelaufs:** Mannequin Large, 12 von 12 Zellen, keine Lücke, Bogen 3582×1354 — `screenshots/sheet_mannequin_large.png`. Die drei Bewegungszeilen sind die Kontrollprobe (native Large-Clips, bekannt gut), die Jump-Zeile der Prüffall (Medium über Cross-Rig). Der Bogen zeigt, was das Urteil *limited* meint: die Figur hält, die Arme stehen zu weit ab.

**Zwei Fehler aus dem Probelauf, beide behoben:** die Wiederherstellung am Ende überschrieb die Fehlermeldung des Batch (ein Absturz sah aus wie »nichts passiert«) und ebenso die Bogen-Vorschau. Beides wird jetzt nach der Wiederherstellung gesetzt. **Regel:** ein Aufräumschritt darf das Ergebnis nicht überschreiben — erst wiederherstellen, dann berichten.

## Nicht in dieser Fassung

- Inventory-Export, Semantic Map, Missing-Report — Sprint 1 / Sprint 4.
- COMPARE A/B (v1.1 Aufgabe 3.2) — **DEFER v1.2**, so vom Review des Chat Leads ausdrücklich zugelassen.
- Root-Motion-Schalter, Parcours (3.4–3.5) — offen.

## Reihenfolge nach dem Review des Chat Leads (12.09.)

Die v1-Abnahme hängt an drei fehlenden Artefakten, nicht am A/B-Vergleich. Neue Folge:

1. **Quellen festnageln** — SHA `b97b5ac55df2724fae623992433685583eece51e`. Nicht blind ersetzen: erst die 45 Figuren-, Textur- und Animationspfade gegen den SHA prüfen, dann `RAW` in `lab/assets.js` pinnen, Audit nachfahren, SHA in jeden Export schreiben. (Beantwortet offene Entscheidung 1.)
2. **`AnimationMap.v0.json`** über die 24 geforderten KFB-Zustände, je genau ein Status aus FOUND_EXACT / FOUND_ADAPTABLE / COMPOSITE / PROCEDURAL / MISSING / DEFER. Nur aus den echten Inventaren.
3. **`MISSING_ANIMATIONS.md`** — Spalten KFB State, Rig, echter Donor-Clip, Status, Beleg, empfohlene Maßnahme.
4. **Evidence-Satz** (3.3 Batch) für Idle, Walk, Run, Jump auf Robot Two, Werewolf Wolf, Mannequin Medium, Mannequin Large.
5. **Paket-Sync**, dann Stopp vor dem Review-Gate.


## Cleanup-Kandidaten · nur benannt, nichts ausgeführt

| Kandidat | Empfehlung | Grund |
|---|---|---|
| `data/kfb-asset-library.json` (4,7 MB) | löschen | durch `data/kfb-asset-library-v7.json` ersetzt |
| `uploads/kfb-asset-library (6).json` | löschen | Original des obigen Uploads |
| `uploads/kfb-asset-library (7).json` | löschen | liegt als `data/kfb-asset-library-v7.json` im Projekt |
| `uploads/Bildschirmfoto *.png` (3 Stück) | löschen | Feedback-Bilder, verarbeitet |
| `QA_CLIPSCHAU.md` | löschen | durch `LAB_QA.md` ersetzt, Inhalt vollständig übernommen |
| `screenshots/0*-xrig-*.png` (11 Stück) | löschen | Zwischenschritte beim Bauen, durch die beiden Strips ersetzt |
| `uploads/AnimationInventory*`, `uploads/RigCompatibility*` (8 Dateien) | behalten | Audit-Belege, gehören in den Export |
| `screenshots/standalone-reframe.png` | behalten | Abnahme-Capture des Standalone |
| `screenshots/xrig_orcbrute_JumpStart_{RAW,FIT}.png` | behalten | Abnahme 3.1, im Stand-Dokument verlinkt |
| `screenshots/standalone-xrig-coldstart.png` | behalten | Kaltstart-Abnahme nach dem Neubau |
| `screenshots/sheet_werewolf_wolf_fullrun.png` | behalten | Kontaktbogen aus Georgs Vollauf |
| `export/lab-standalone-src.dc.html` | behalten | Build-Input für den Standalone |

Nichts gelöscht. Jeder Schritt braucht Georgs Freigabe, einzeln.

## Pfad-Hygiene · Stand nach diesem Check-in

| Pfad | Status |
|---|---|
| GLBs, alle 45 Figuren und 14 Packs | RAW-URL, kanonisch |
| three r160 | unpkg per Importmap, extern, dokumentiert |
| `./lab/assets.js`, `./lab/locomotion.js` | relativ im Workspace, im Standalone als Quelle eingebettet (Base64 → Blob-Modul) |
| `./support.js` | relativ, im Standalone gebündelt |
| `_ds/…` | nicht mehr referenziert — das Lab hat kein DC-Branding |
| Schriften (IBM Plex) | Google Fonts, extern, Fallback System-Sans |

Kein relativer Asset-Pfad mehr offen.

---

## Fahrzeug-Linie `lab-v7` · Stand 2026-09-18 · Session-Cut

| Datei | Status | Anmerkung |
|---|---|---|
| `KFB Cartoon Vehicle Deformer Lab.dc.html` | AKTIV | Die Werkbank. Elf Briefing-Knöpfe plus `RAIL HOLD` und `NEUTRAL`, vier Profile, Signal-Regler, `Flip` und `Orient` mit Gedächtnis je Fixture. |
| `lab-v7/vehicle-cartoon-deformer.v2.js` | AKTIV · MODUL | Der Deformer: Knotenbaum, Springs, Kanäle, Priorität. Schreibt nur in eigene Presentation-Knoten. |
| `lab-v7/carrig.v1.js` | AKTIV · MODUL | Vermessen und Riggen: Inseln, Radsuche mit Paar-Regel, Aufrichten, Radaufstandspunkt. |
| `lab-v7/fixture-adapters.v2.js` | AKTIV · DATEN | 43 Fixtures, generiert aus Handoff (25) und Registry (18). Herkunft je Zeile, offene AssetRefs benannt. |
| `lab-v7/deformer-profiles.json` | AKTIV · DATEN | Vier Profile. Tuning-Vorschlag, **nicht eingefroren**. |
| `lab-v7/TEST_SEQUENCES.json` | AKTIV · DATEN | Zwölf deterministische Sequenzen mit erwartetem Read, jede endet im Ruhezustand. |
| `lab-v7/registry-vehicles.v1.js` | AKTIV · DATEN | Registry-Fahrzeugliste mit gepinnten RAW-Adressen. Von `fixture-adapters.v2.js` überholt, aber weiter die Quelle der Registry-Zeilen. |
| `RETURN_cartoon_vehicle_deformer.md` | AKTIV | Rückmeldung nach Briefing-Schema: IMPLEMENTED / STATIC TESTED / BROWSER TESTED / VISUALLY ACCEPTED / OPEN. |
| `LIVING_VEHICLES.md` | AKTIV | Stand-Dokument der Linie. |
| `CHANGELOG.md` | AKTIV | Zeitachse aller Sessions, additiv. |
| `HANDOVER_RACE_2026-09-18.md` | AKTIV | Übergabe an den Race-Chat: Naht, sechs offene Punkte R1–R6. |
| `HANDOVER_WSA_LEAD_2026-09-18.md` | AKTIV | Übergabe an den WSA-Lead: Stand, Abhängigkeiten, zwei weitergabefähige Regeln. |
| `lab-v7/cardeform.v1.js` | SUPERSEDED | Shader-Fassung. Briefing verlangt keinen Vertex-Overkill. Bleibt als Nachweis liegen. |
| `lab-v7/fixtures.v1.js` | SUPERSEDED | Keyframe-Fixtures. Ersetzt durch signalgetriebene Sequenzen. |
| `KFB Vehicle Lab v1.dc.html` | SUPERSEDED | Erste Werkbank, DocCheck-Rahmen. Bleibt lauffähig stehen. |
| `uploads/kfb-race-track-asset-handoff-generic-runtime.json` | ASSET | Georgs Handoff `kfb.asset-handoff.v1` @ `10a7fdce6b`. Quelle der 25 Handoff-Zeilen. Gehört nicht in den Export. |
| `3D Assets/KayKit_Space_Base_Bits_1.0_FREE/` | ASSET · UNVOLLSTÄNDIG | Nur Beiwerk (contents.png, sample.png, License.txt, Textur). Die glTF sind nicht kopierbar — `.bin`-Puffer. Siehe Befund B2. |

### Clean Run · Cartoon Vehicle Deformer Lab

1. `KFB Cartoon Vehicle Deformer Lab.dc.html` öffnen. Fixture-Liste links, 43 Zeilen mit Herkunftsmarke.
2. `car_hatchback` wählen. Kopfzeile meldet `4 Räder (node) · r 0,072 · Spur 0,35 · Radstand 0,50`.
3. `BRAKE` drücken: Nicken −2,45°, Längskompression −1,8 %, Fahrer laggt nach.
4. `DRIFT LEFT`: Yaw −7,25°, Gegenroll +1,25°, Seitenlast sichtbar reduziert.
5. `RAIL HOLD`: **ein** gesättigter Einschlag, monotoner Abfall auf 0,018, ein Übergang beim Loslassen. Ein zweiter Schlag wäre der alte Fehler.
6. `NEUTRAL`: `impact 0,00` über zwei Sekunden, sichtbar ruhig.
7. `RESET`: alle Springs exakt null, Knoten auf Identität.
8. Fixture wechseln: `dispose()` wirft die Knoten weg — kein Spring-Zustand wandert mit.

### Pfad-Hygiene · lab-v7

| Pfad | Status |
|---|---|
| Alle Fahrzeug-GLBs | gepinnte RAW-URLs (`10a7fdce6b` Handoff, `34cde3f8f7` Registry) |
| three r160 | unpkg per Importmap, extern |
| `./lab-v7/*.js`, `./lab-v7/*.json` | relativ im Workspace. **Für einen Standalone-Export offen** — dieselbe Lage wie bei der Clip-Schau, gleicher Fix (Quellen einbetten). |
| `_ds/doccheck-group-design-system-…/` | referenziert vom DocCheck-Rahmen der Werkbank. Bühne selbst bleibt neutral (R12). |

### Cleanup-Kandidaten · Fahrzeug-Linie · nur benannt, nichts ausgeführt

| Kandidat | Empfehlung | Grund |
|---|---|---|
| `screenshots/02-cvd-*.png` (13 Stück) | löschen | Zweitaufnahme desselben Zustands je Schritt, Aufnahme-Artefakt. `01-cvd-*` bleibt. |
| `screenshots/01-cvd-0{1..9}.png` | löschen | Zwischenschritte beim Bauen. 10–13 zeigen den abgenommenen Stand. |
| `screenshots/01-v7-01-check.png`, `01-v7-02-fixtures.png` | behalten | Erstaufnahme der Linie. |
| `lab-v7/cardeform.v1.js`, `lab-v7/fixtures.v1.js` | behalten | Nachweis der verworfenen Wege. Im Changelog begründet. |
| `KFB Vehicle Lab v1.dc.html` | behalten | Alte Fassung bleibt lauffähig stehen (Benennungsregel). |
| `3D Assets/KayKit_Space_Base_Bits_1.0_FREE/` | behalten bis B2 entschieden | Ohne die glTF wertlos, aber der Ordner ist der Beleg, dass es versucht wurde. |

Nichts gelöscht. Wie in der ersten Fassung: jeder Schritt braucht Georgs Freigabe, einzeln.

### Was dieses Housekeeping korrigiert

`LIVING_VEHICLES.md` nannte die Belege unter `screenshots/v7-0*`. Diesen Pfad gibt es nicht —
die Aufnahmen heißen `01-cvd-*` und `02-cvd-*`. Korrigiert, nicht überschrieben:
der falsche Pfad steht als Nachtrag daneben.
