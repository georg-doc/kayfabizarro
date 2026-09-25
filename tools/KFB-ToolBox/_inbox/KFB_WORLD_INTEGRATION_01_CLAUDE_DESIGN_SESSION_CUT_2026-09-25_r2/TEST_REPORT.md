# TEST REPORT · WORLD-INTEGRATION-01 r2 · 2026-09-25T19:25:00Z

## Static / source
| Prüfung | Ergebnis |
|---|---|
| Lokale Importe der Entry-Closure vorhanden | PASS (Skript beim Staging, siehe EXPORT_MANIFEST.clean) |
| JSON parse (Fixtures, SOURCE, Manifest) | PASS (Staging-Skript) |
| `zipcheck.py` | `ZIPCHECK_NOT_RUN` — kein Python in dieser Umgebung; dieselben Prüfungen in JS gegen das entpackte ZIP ausgeführt (EXPORT_MANIFEST.clean) |

## Runtime / browser (Claude-Design-Preview, ausgeführt nach der letzten Codeänderung)
| Test | Ergebnis |
|---|---|
| Welt-Selbsttest Hürth | **PASS 55/55** (`evidence/selftest-huerth-55.jpg`) |
| Welt-Selbsttest Köln Dom/Hbf | **PASS 55/55** (`evidence/selftest-cologne-55.jpg`) |
| WB2-Sandbox ohne `world` bootet | PASS (Status „source actor · Melee_Unarmed_Idle · texture bound", Key `kfb-wb2-terrain-sculpt-01`) |
| Sichtprüfung Hauswand/Dach/Fuß, drei Sonnenwinkel | beobachtet, kein heller Streifen, keine Akne, Kontakt anliegend (`evidence/house-*.jpg`) — Preview ≠ Human PASS |
| Haus auf gehobenem Gelände | beobachtet (`evidence/house-raised-terrain.jpg`) |
| Köln Dom + Hbf im WorldBuilder | beobachtet (`evidence/cologne-dom-hbf.jpg`) |

### Selbsttest-Zeilen (55)
Zone · Stadt = Zonengebäude (inkl. Landmarken-Basen) · Tile · WB2-Dokument · 12 KayKit-Zustände · nur Quell-Clips (Varianten markiert) · ein Face-Owner · Stufenkette idle→walk→walk.fast→run→sprint→run→walk.fast→walk→idle · kein Flackern (9 Wechsel) · je walk/walk.fast/run/sprint/backward/strafe.walk: Strecke = Stufentempo × Zeit, Zustand aus Bewegung, Rutschen im Boden (25 % Körpertempo bzw. Quell-Rest × Rate + 0,05) · crouch/sneak/crawl Fahrt + Halten · Sprung start→air→land · Apex 0,92 m (Controller 0,97) · Boden + idle · Tusche ⊆ sichtbar (0 Geisterpixel) · FACADE_RULE v1 · Wandnormalen ohne Deckel · oberste Reihe nicht mehr gekippt · Raise = Wahrheit · Mesh = Wahrheit · Walker auf Gelände · Clear · Reload · Play nach Reload · Boulder · Objekt fest · Objekt übersteht Reload · Haus auf dem Tile · Haus hebt sich · Haus senkt sich · Walker-Boden = Dach auf Support · Support-Reset · Tusche schließt Unsichtbares aus.

## Visual / human
Keine Georg-Rückmeldung zu r2 (`NOT_RUN`).

## Not tested
Selbsttest Alstädten · Mobil/Touch · WB2-Selbsttest 34/34 (löscht Nutzer-Key) · Human Gate · Clean Run im Browser aus dem entpackten ZIP (`CLEAN_RUN_NOT_EXECUTED`: kein lokaler HTTP-Server in dieser Umgebung; statische Prüfung ausgeführt).
