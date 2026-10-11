# Fable-Review R1 → Steuerung · Doppel-Review MVP-Slice (12.10.2026)

Von: Fable-5.1-Sitzung auf dem Mac mini (Georg, 11./12.10.) · Auftrag: `_inbox/BRIEFING_Review_KFB_World_Lab.md` (Prüfer A Technik, Prüfer B blinde Art Direction, Blindlese 24 px, blinder Paarvergleich gegen ein Kartenbild) · Ablage der Vollfassung: `replies/FABLE_REVIEW_R1_2026-10-12/` (report.md, blindtests.md, measurements.json); Bilder (74 PNG) liegen auf dem Mac mini unter `~/Dropbox/CLAUDE/KFB Island Worldbuilder Lab/docs/critic/lab-mvp-slice/2026-10-11_review01/shots/`.

## 0 · Geprüfter Stand, ehrlich

Der Review lief auf der Dropbox-Kopie des Mac mini: Code und Doku vom 08. bis 10.10., **ohne** `src/island/r2d/`, `recipe.ts`, `composition.ts`, HUD, Audio, Bench. Der GitHub-Schnappschuss `sync/lab-snapshot-2026-10-11` und das Register (bis V-184) wurden erst nach dem Lauf gefunden. Zwei Folgen:

- Befunde zu Kamerasatz, Wirt (sechs Renderer), Draw Calls und Probe-Seiten können im Stand vom 11.10. überholt sein. Die Steuerung prüft sie mit einer Zeile je Punkt gegen den Schnappschuss, bevor sie ins Register gehen.
- Strukturelle Befunde (Fußpunkt, 404-Maskierung durch Vite, Zierschicht-Determinismus, Mobil, Tusche, Blindtests) sind vermutlich noch gültig, weil kein Eintrag im Register oder Plan R1 sie behandelt.

**Neuer, ungeklärter Fall (eine Zeile):** Die Dropbox-Kopie auf dem Mac mini trägt den Stand vom 10.10. früh; `PROJECT_STATE.md` dort endet vor „Kurswechsel finden statt bauen“. Entweder synct der Lab-Ordner nicht in beide Richtungen, oder die Steuerung schreibt nur in der GitHub-Arbeitskopie. Vorschlag: Regel zu V-117 ergänzen, dass die Dropbox-Kopie nur gilt, wenn das Kopf-Datum des Projektstands gleich GitHub ist.

## 1 · Ergebnis in drei Sätzen

Nicht bestanden. Prüfer B (blind, ohne Code): Mittel 6,4 (Claymation 7,0, Diorama 6,0, Farbe und Licht 7,0, Tusche 6,5, Kamera 5,5). Blinder Paarvergleich Welt gegen Karte zweimal „Nein“, erster Grund jeweils die fehlende Tuschelinie; Blindlese bei 24 px: Insel, Landmarke, Weg und Wasser tragen, Bewohner, Autos und Requisiten werden zu Flecken.

Kalibrierszene vorab pixelgenau (Farben exakt, Rechteck an der erwarteten Stelle). Verbund 4 Inseln reproduziert die Zahlen vom 08.10. (120 Calls / 261 k Dreiecke mit Kit, 158 / 483 k alt). Browser: Headless Chrome 155 (Playwright, Metal, M4) für Standbilder, Browser pane für Interaktion.

## 2 · Mängelliste (Vorschlag fürs Register; Bereich, Prüfung und Besitzer wie in DECISIONS.md)

Ohne Lizenzzeile (V-184). Prio nach Briefing: P1 blockiert den nächsten Slice, P2 warn, P3 info.

| Prio | Bereich | Befund | Beleg | Vorschlag (mit Bestand) | Prüfung | Aufwand |
| --- | --- | --- | --- | --- | --- | --- |
| P1 | Insel | **Bodenkontakt:** jedes Gebäude konstruktiv 0,07 über dem Pad (`placeBuilding`: `max(height, base + 0.07)`); Autos (6 lang, Pad 3) am Hang bis 0,31 in der Luft; Fußpunkt an vier Orten (`placeBuilding`, `place.ts put()`, `NatureBuilder`, `syncResidents`) | `measurements.json ground_contact`; `G_nah_kit__orbit_-12_3.5_142…png` | eine Fußpunkt-Funktion im Feld (`grounding.ts footPolygon` ist der Bestand), von Gebäuden, Bewohnern, Natur und Fahrzeugen gleich benutzt | Q1 als Parity: kein Objekt > 0,02 H über dem Boden | M |
| P1 | Technik | **Fehlende Assets unsichtbar:** Vite antwortet auf fehlende Dateien mit 200 + HTML; die PSD-Texturen der Retro-Cars fehlen ohne 404; „Konsolenfehler null“ beweist nichts | `curl /assets/nix/gibtsnicht.png` → `200 text/html` | `appType: 'mpa'` oder 404-Middleware für `/assets/*`, `/roadbeds/*`; danach Lauf wiederholen | Parity: fehlende Datei erzeugt 404 | S |
| P1 | Technik | **Mobil nicht gebaut:** bei 375 × 812 deckt das Panel 74 %, Canvas 750 × 1624 bei dpr 2, Schattenkarte 4096², keine Touch-Gesten | `measurements.json mobile`; Panel-Screenshot | Entscheidung Georg: Mobil als Boden ja oder nein; wenn ja Profil (pixelRatio ≤ 1,5, Schatten 2048², Panel als Leiste, Touch-Orbit) | Mobil-Lauf je Lieferung im Parity | M |
| P1 | Look | **Tusche-Kanon fehlt:** kein Konturpass, `kfb-ink-canon.js` weder importiert noch nachgebaut; beide Blindtests „nicht dasselbe Universum“ | `blindtests.md` §B | Entscheidung Georg; wenn ja: Ink-Kanon des Deck Viewers als Post-Pass mit Schalter, Bildpaar im Spiel | Paarvergleich mit Linie mindestens „eher ja“ | M |
| P1 (prüfen) | Kamera | **Kamerasatz im Verbund kaputt** (alter Stand): `under` steht in der Pyramideninsel, `canyon-ref` von einer Palme verdeckt, `bucht-ref` mit Fremdobjekten | `B1_verbund_kit__under.png`, `…canyon-ref.png` | im Stand 11.10. prüfen; wenn Presets noch Konstanten sind: aus Rezept und Radius rechnen, Verdeckung per Raycast | 0 Presets mit Fremdobjekt vor dem Ziel | S |
| P1 (prüfen) | Technik | **Kein Wirt** (alter Stand): sechs Einstiege mit je eigenem Renderer, Licht, Farbraum, Zeitbasis; `__kfb.setTime` → null; `speckle.html` ohne `ready` | `grep "new THREE.WebGLRenderer" src` → 6 | Plan R1 C1b nennt „ein Renderer- bzw. Licht-Besitzer“; prüfen, ob Probe-Seiten ihn schon laden | eine Renderer-Instanz im Bundle | M |
| P1 (B) | Look | Kit-Vegetation Canyon facettiert ohne Dellen, Mühlrad ebenso; kein Nebel, kein Fülllicht, kein Rand; Bucht und Pyramide fast gleiche Palette; Glanz und Glas auf Fahrzeugen (Chrom `metalness 0.8`) | `report.md` §4.2 | V-053 Umgebungs-Knete mit Nahband, V-012 Materialmix; Dellenmaßstab je Objektklasse; Fahrzeuge matt; Bucht-Palette kippen (V-051 Insel-Thema) | Standbild gegen J17 `chase-*.jpg` | S bis M |
| P2 | Technik | **Zierschicht nicht deterministisch:** Animationsphase und Blinzeln aus `Math.random`; Gelände, Natur und Gebäude sind deterministisch (0 abweichende Pixel in zwei Läufen) | `D_diff_A1_A2__pyramide-ref.png` (789 Pixel, nur die Mumien) | `rng(seed)` mit Bewohner-ID; Lint gegen `Math.random`, `Date.now` außerhalb des Editors (passt zu V-171 Punkt 6) | Pixel-Diff zweier Läufe = 0 | S |
| P2 | Technik | Erster Palettenwechsel ruckelt (83,5 ms schlechtester Frame, synchroner Geometrie-Neubau); kein `renderer.compile` | `measurements.json first_material_change` | `renderer.compile` nach Boot; Palette ohne Delaunay-Neubau | längster Frame < 50 ms außerhalb des Ladens (Stufe-2-Lücken §4) | S/M |
| P2 | Prozess | `.claude/launch.json` im Lab zeigt auf `/Users/georgv.westphalen/…`; auf dem Mac mini tot | `ls` → nicht vorhanden | `$HOME` oder löschen (Konfiguration eine Ebene höher ist die richtige) | – | S |
| P2 | Farben | Zwei Farbquellen `PALETTES` und `ENV_ROLES` setzen nebeneinander (Terrain mischt) | `terrain.ts:426` | Plan R1 §2 sagt es schon: Zusammenführung in `ENV_ROLES` (Phase B) | – | M |
| P2 | Leistung | 120 Calls (Kit) bzw. 158 (alt) je Frame, Hälfte Schattenpass; Gebäude und Bewohner mit je eigenem Material | `measurements.json gate2` | alte Natur abschalten; Schattenwerfer begrenzen; Bewohner-Materialien teilen | V-115 ≥ 30 fps in drei Kameras | M |
| P2 | Licht | Keine Tageszeit im geprüften Stand (`setTime` → null) | – | Phase A8/A9 (Licht-Profile) ist laut Projektstand 11.10. erledigt; Review konnte es nicht sehen | – | – |
| P2 (B) | Look | Identische Instanzen ohne Streuung; zwei Wassermaterialien; Hub-Straße läuft über den Rand (`?rkit=1`-Welt, V-014 FAIL bekannt); gezackte Schattenkanten; Hochformat schneidet Inseln an | `report.md` §4.2 | siehe dort; Wasser durch V-052 fluid.js ersetzt (Phase B+ erledigt) | – | S |
| P3 | Technik | `THREE.Clock` deprecated; Kennzeichen „CICADA“ und „911“ aus der Auto-Textur im Bild; Wolken fehlen in der Übersicht | – | `THREE.Timer`; Entscheidung Text im Bild [V-041]; Wolken als Maßstabssignal | – | S |

## 3 · Drei Dinge, die bleiben (A und B einig)

1. Inselmaterial und Scholle: Deckfläche, Wulstkante, Sockel mit durchgehender Knetstruktur (`G_nah_kit__orbit_-58_1_6…png`, `B1_verbund_kit__bucht-ref.png`).
2. Die Mumien: Bandagen als Knetstreifen, Dellen im Figurenmaßstab, Augen, Ankh, lesbare Haltung (`G_nah_kit__orbit_12_4_136…png`). Pyramide als Plattenstapel.
3. Messschnittstelle `__kfb` und `tools/shoot.mjs`; Straßenbett-Naht `kfb.road-bed/1` (T1 0, T2 244/244, Höhenfehler 0); Determinismus des Geländes.

## 4 · Was die Steuerung daraus machen sollte

1. Die Zeilen „P1 (prüfen)“ gegen den Schnappschuss 11.10. abgleichen, je eine Zeile, dann Register-Einträge für das, was bleibt.
2. Zwei Entscheidungen an Georg: Mobil als Qualitätsboden (ja oder nein), Tusche als Post-Pass (ja oder nein, mit Bildpaar).
3. Den Plan-Vorschlag `lab-docs/KFB_LEBENSSCHICHT_PLAN_R1.md` (Phasen I bis K: Bewohner leben, sprechen, erinnern) als Anhang zu Plan R1 prüfen. Er erfindet nichts Neues, sondern ordnet Bestand (Motion-Leitfaden, ChatterBox, Lean Memory, Rezeptfelder) in drei One-Shot-Aufträge und benennt die Blindspots (Clips, Kanon-Blätter für Prison Island, Toy Soldiers, Brick-Fish, Triplet-Menge).

Keine Codeänderung durch diese Sitzung. Angelegt wurden nur Review-Dateien; eine Testergänzung an `.claude/launch.json` wurde zurückgesetzt.
