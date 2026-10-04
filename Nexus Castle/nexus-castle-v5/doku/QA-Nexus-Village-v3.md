# QA — Nexus Village v3 (UI · Terrain · Units · Assets)

Datum: 2026-08-14 · Datei: `Nexus Village v3.dc.html` · Belege: `screenshots/qa-01-overview.png`,
`screenshots/01-qa-02.png` (Hover + Party), `screenshots/02-qa-02.png` (Log offen)

## 1 UI
| Prüfpunkt | Ergebnis |
|---|---|
| Meta-Fläche minimiert | ✅ Statuszeile + zwei Knöpfe (`Log`, `Settings`), sonst nichts |
| Progressive Disclosure | ✅ Einstellungen (Quelle, Autonomie, Tempo, Tageszeit, Party, Ton, Jukebox) liegen im `Settings`-Fenster; Log ist ein Reiter; Party-Leiste ein-/ausklappbar |
| Gebäude-Meta erst on Hover/Click | ✅ Schild erscheint nur am gehoverten/gewählten Haus; Klick öffnet die Detailtafel |
| Responsiv | ✅ obere und untere Leiste sind Flex-Reihen mit `flex-wrap`; alle Fenster `min(px, calc(100vw − 20px))`, Log/Settings mit `max-height` + Scroll |
| Sprache | ✅ komplett EN (inkl. Weltbanner „APPROVAL NEEDED"); DE-Lokalisierung später über eine Textmap |
| Scrollbars | ✅ TS-Stil: Holzrinne, Messing-Griff, harte 2-px-Outline, keine Rundungen (`::-webkit-scrollbar*` + `scrollbar-color`) |
| Regler | ✅ Holzrinne + Messing-Knebel statt Systemslider |
| Slices | ✅ **verdrahtet und gemessen:** `ui-kit-ts.js` (uikit-v1.5, 99 Teile) zeichnet jede HUD-Fläche mit `paper9`/`band3` auf Canvas — Ecken 1:1, Kanten und Mitte gekachelt. Abnahmeprobe in der laufenden Seite: `[data-ts-key]` = **12**, aktive CSS-`border-image` = **0**. Belege `screenshots/01-qa-09.png`, `screenshots/02-qa-09.png` |
| Beschnitt | ✅ `clipX`/`clipY` aller 12 `[data-ts-key]` = **0** (Probe im laufenden Bild) — die Box folgt der gemalten Fläche, weil `paper9` auf ganze 64er-Zellen rastet; ohne `min-height` fehlte vorher die untere Schnitzkante jedes Knopfs |
| Maßstab | ✅ gezeichnet wird in **doppelter** Boxgröße und **ganzzahlig halbiert** gezeigt (`background-size`, `image-rendering:pixelated`) — auf DPR 2 pixelgenau. Grund: die TS-Blätter sind für eine 1920er Bühne gemalt; 64er Ecken bei 1:1 blähen ein 924er HUD auf und decken das Dorf zu |
| Sprechblasen | ✅ höchstens zwei Paare, 3–6 s Dauer, 10–20 s Sperre, Blase nur beim Sprecher und **weg** vom Partner |
| Alarm verdeckt das Dorf | ✅ Alarm sitzt jetzt in der rechten Spalte unter `Log`/`Settings`, nicht mehr über der Taverne |

## 2 Terrain
| Prüfpunkt | Ergebnis |
|---|---|
| Ebenenfolge | ✅ Wasser → Foam → Flat Ground; keine Shadow-Ebene (korrekt ohne Elevation) |
| Autotile | ✅ 4×4-Blob, Spalte/Zeile 3 = „single"; Insel konvex |
| Küste | ✅ Foam als 192-px-Stempel je Randkachel, 8 Frames |
| Wege | ✅ Sandmaske auf Kachelraster, Wegpunkte gesnappt, Haupt-/Nebenweg 38/30 px |
| Bäume im Wasser | ✅ keine — alle acht Nachbarkacheln müssen Land sein |
| Wolken | ✅ deckend (Alpha 0.9–1.0), driftend, wrappen |
| Tageszeit | ✅ 0–24 h, interpolierte `SKY`-Keyframes, Fensterglut nachts |

## 3 Units
| Prüfpunkt | Ergebnis |
|---|---|
| Schatten | ✅ nur der gebackene Sprite-Schatten, kein zweiter |
| Frames | ✅ 192-px-Frames, Zeile 0 Idle / Zeile 1 Lauf; Archer nutzt Idle-Variante |
| Wege | ✅ BFS über das Wegenetz, kein Luftlinienlauf |
| Absicht sichtbar | ✅ gestrichelte Linie in der Aktivitätsfarbe + Ziel-Raute; Label über dem Kopf |
| Interaktion | ✅ rastende Helden bilden Paare, wenden sich einander zu, Sprechblase mit laufenden Punkten |
| Tiefensortierung | ✅ nach Fuß-Y, Units laufen hinter Gebäude |

## 4 Assets
| Prüfpunkt | Ergebnis |
|---|---|
| Quellen | ✅ alles per raw-URL (Update 010 im Fork, Free Pack in `kayfabizarro`), nichts dauerhaft kopiert |
| ATLAS | ✅ 15 Einträge mit `pack/path/frame/role/frames/fps`; Loader iteriert die Tabelle |
| FX | ✅ Strips: Fire 12×64, Dust 10×64, Explosion 10×192, Splash 9×192 — einmalig, Lebensdauer = frames/fps |
| Wasser-Deko | ✅ Water Rocks (16 Frames), Quietscheente (3 Frames) |
| Offen | ⚠️ `2d-catalog.json` noch nicht gegen den ATLAS abgeglichen; Free-Pack-UI-Familie (Banner_Slots, Papers, WoodTable, Bars, Swords, Icons, Avatare) noch nicht aufgenommen |

## 5 Gefundene und behobene Fehler dieser Runde
- **#17** `roundRect` fehlte nach dem Template-Neubau → `TypeError`, Simulation stand still. Behoben.
- **#18** `partyOpen` fehlte im State → Party-Leiste ließ sich nicht öffnen. Behoben.
- **#19** Weltbanner am Wachturm war noch deutsch. Behoben.
- **#20** Doppelte Hover-Anzeige (Weltschild + DOM-Tooltip) → Tooltip entfernt.

## 6 Nächste Runde (klar umrissen)
1. Canvas-UI-Kit (`ui-kit-ts.js`) als HUD-Renderer einbauen → Slices kanonisch (Bug #16).
2. `2d-catalog.json` gegen den ATLAS abgleichen, Abweichungen im Changelog notieren.
3. Textmap für DE/EN (aktuell EN hart im Code).
4. Enemy Pack: Lager außerhalb der Insel, Raids auf dem Wegenetz.
