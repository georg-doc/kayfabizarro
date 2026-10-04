# Test Report

**Getestete Revision:** 2026-09-17-r1
**Datum:** 2026-09-17
**Umgebung der Sprintmessungen:** Chromium-basierte Vorschau in Claude Design, WebGL2, Desktop.
**Umgebung der Paketprüfung:** dieselbe Vorschau, Projektwurzel statt entpacktem Paket.

## Wichtige Einschränkung

Die unten als PASS geführten Zeilen sind **Messungen aus dem laufenden Projekt**, nicht aus dem
entpackten Paket. Das Paket enthält Kopien derselben Bytes (siehe `../CHECKSUMS.sha256`), aber ein
Start aus dem entpackten Ordner über HTTP wurde in dieser Umgebung nicht ausgeführt: es gibt hier
keine Shell, die `python3 -m http.server` startet. Diese Zeile ist deshalb `NOT_RUN` — nicht PASS.

## Pflichtprüfungen aus dem Exportauftrag §7

| Prüfung | Ergebnis | Nachweis |
|---|---|---|
| Sauberer Start aus entpacktem Paket über HTTP | `NOT_RUN` | keine Shell in der Exportumgebung |
| Asset-Laden über RAW-URL, Soll/Ist | PASS (im Projekt) | Dungeon-Pack 19/19 Teile bestätigt; Hex 87; Forest 105; Tools 49; City 41; Racing 33/112; Dungeon-Inventar 46/86 Kandidaten |
| Fehlpfade | PASS | Fehlende Namen werden gezählt und im Prüfbalken genannt, nicht durch Ersatzgeometrie überspielt (`docs/PACK_GAPS.md`) |
| Szenenwechsel | PASS | S13.2 Ebenen-/Schrittfilter; rAF-Notnagel zeichnet nach Szenenwechsel weiter (Fix aus S11) |
| Reset | PASS | „Würfeln" baut aus der Saat neu; Kamera bleibt über `build.keepCam` |
| Transform-/Preset-Erhalt | PASS | Maße kommen bei jedem Bau aus `measured`, nicht aus gespeicherten Werten |
| Export → Import → Reload | **TEILWEISE / `NOT_TESTED`** | Recipe-JSON-**Export** läuft (`kaykit-dungeon-s13-2.recipe.json`). Einen **Import** gibt es nicht — die Seite kann kein Rezept einlesen. Siehe `FEATURE_PARITY.md` |
| Generator-Reproduzierbarkeit | PASS | Serie über 108 Grundrisse (3 Feldgrößen × 3 Dichten × 12 Saaten): 0 Fehlschläge, 0 freie Wandenden, 0 Inseln, 0 Räume < 2×2, 0 dunkle Räume |
| Desktopbedienung | PASS | Orbit/Zoom/Picking auf `pointerup`, Damping 0,14, geklemmte Distanzen |
| Mobile Bedienung | `NOT_RUN` | kein Gerätetest; responsives Layout < 1100 px ist implementiert und im Browser geprüft, nicht auf Hardware |
| Unterpfad / Deep-Link | PASS (statisch geprüft) | 0 projektinterne absolute Pfade in allen 15 Seiten; kein Router, also kein Deep-Link-Fallback nötig |
| Fehlende Modellabhängigkeiten | PASS | Ladeversuch je Name; 40 der 86 Dungeon-Kandidaten existieren nicht und sind als Lücke dokumentiert, nicht ersetzt |
| Netzwerk-/Konsolenfehler | PASS für S13.2 | letzte Prüfung des UI-Umbaus ohne Konsolenfehler |
| Offline-Start | **entfällt** | kein Prüfkriterium: Assets laufen planmäßig über die kanonische RAW-URL, siehe `DECISIONS.md` |

## Sprintmessungen mit Zahlen (aus `../CHANGELOG.md` und `SOURCE_github.md`)

- **Durchdringungen:** 0 von 93.528 Paaren bei 16×16, nachdem das Footprint-Audit `wall_corner`
  über seine beiden Schenkel prüft statt über die AABB (das L deckte sonst sein leeres Innenviertel
  mit → 5 Scheindurchdringungen à 0,33).
- **Strahlprobe:** 7/7 Türen durchlässig, 53/53 Wände sperrend, nachdem `wall_doorway_door` aus der
  Instanz entfernt wird. Öffnung gemessen 1,90 breit, mittig.
- **Draufsichtprobe:** 60 Fugen, 37 Zellen, 0 Fehler.
- **Leseprobe (Luminanz):** 8×8 A1 nachts 5/5; 8×8 TZCSA nachts 5/5 (min 0,098); 16×16 TZCSA nachts
  9/9 in 3 Stapeln; 12×12 q 7/7 (min 0,173).
- **Lichtleckage:** 0 gemessen (Lichtmasken 8/16 gegen Geometriemasken 9/17).
- **Bodenprofil von der Kerze nach außen:** 0,76 · 0,77 · 0,54 · 0,50 · 0,61 (glatter Abfall).
- **Wandzeile mit `decay 1`:** 0,521 · 0,503 · 0,487 · 0,474 · 0,464 · 0,453 · 0,444.
- **Kerzenwirkung 8×8 A1 nachts:** 13 dunkle Zellen → 0; min-Luminanz 0,098 → 0,31.
- **Hex-Achsen nach dem Fix:** Pixelscan und Geometrie liefern dieselben 18 Kantenstrings;
  33/33 Kettenfugen, 204/204 Uferkanten korrekt.

## Was diese Zahlen nicht belegen

Keine der Proben ist eine Abnahme durch einen Konsumenten. Begehbarkeit ist **geometrisch**
geprüft (ein Strahl kommt durch), nicht als Laufoberfläche in einer Runtime. Es gibt keine
Wandkollision, keine Stockwerklogik für einen Actor und keinen Einbau in Travel-Gelände.
L5 kann nur der empfangende Konsument vergeben.
