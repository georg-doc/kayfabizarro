# B2b-P1 · Claude-Design-Sichtprüfung des eingefrorenen Kandidaten · 2026-09-26

Kein Stage, kein Public, kein Live. Nur ZIP und Preview in Claude Design. Das Rehome auf Stage übernimmt später Web.

## SOURCE
- `georg-doc/kayfabizarro`, PR #211, Branch `chatgpt-web/billboard-b2b-research-2026-09-25`
- Handoff-Head `6b29367df59f7c901ae66fea852999f6d62750e7`
- Kopiert von `tools/KFB-ToolBox/_handover/BILLBOARD_B2B_P1_2026-09-25/` @ eingefrorenem Runtime-Head `2348c069a99b57149d6a2685496b5ce1b40ebe1a`, 19 Dateien
- Nicht mitkopiert: die `.md`-Dateien und `failure-recovery/`. Sie liegen weiter auf PR #211.

## DECISION
- Georg (26.09.): Option **B**. Den Kandidaten unverändert zur Sichtprüfung zeigen, keinen Repair Pass 3, keine Änderung am Ticker oder Lifecycle.
- Bildpool für diesen Gate: die sechs Kenney-CC0-Bilder, wie sie sind.

## IMPLEMENTATION
- **Keine.** Runtime, Scheduler, Lifecycle, Ticker und Provenienz sind byte-gleich zur Kopie.
- Neu ist nur dieser Ordner als Verpackung, dazu `review-evidence/` und diese Datei.

## TESTED RESULT (Claude-Design-Preview, ca. 924×540)
| Bild | Zustand | Befund |
|---|---|---|
| `00-gate1-donor-isolated.png` | `donor-isolation.html`, Gate-1 `drawCollageFace()` isoliert | rendert: drei gerissene Fragmente der KFB-Karte, Kopfzeile »COLLAGE LOOP · HyperNormalisation cut« |
| `01-b2b.png` | COLLAGE · FRONT · LIVING_SCREEN · Seed 18472 | POSTER_STACK · ACID_FAIRGROUND |
| `02-b2b.png` | COLLAGE · RIGHT34 | Fläche folgt dem Panel |
| `03-b2b.png` | COLLAGE · BACK | echte Rückseite des Kenney-Körpers, keine gespiegelte Collage |
| `04-b2b.png` | COLLAGE · FRONT · FLAT_COLLAGE | ARCHIVE_FEVER · COLD_PRINT |
| `05-b2b.png` | Seed 90210 | SIGNAL_NOISE · MONO_PAPER, andere Komposition |
| `06-b2b.png` | wieder Seed 18472 | wieder POSTER_STACK · ACID_FAIRGROUND wie `01` |

- Bei dieser Viewport-Größe schneidet die FRONT-Kamera die Oberkante der Tafel ab. Das ist die Kamera aus B1, unverändert übernommen.
- NOT_TESTED hier: die Wiederholungsfreiheit über 30–45 s, die übrigen Modi CARD/COVER/VIDEO/SLOGAN und die Ruhe nach dem Moduswechsel (725→726). Der Ticker gehört in den separaten Web-Slice (Option A).

## EXPORT
ZIP dieses Ordners.

## PUBLIC DEPLOYMENT
Keins.

## GEORG ACCEPTANCE · 2026-09-26 · TUNE (Konzept, nicht Parameter)
Georg im Wortlaut sinngemäß:
- Der Kandidat ist eine Rotation im Stil von »City Lights«. Das ist keine Hypernormalisation und keine videoartige Darstellung. Er taugt als City-Lights-Modus.
- Hypernormalisation muss wie ein Video funktionieren, also Schnitt, Rhythmus und Montage, keine Diashow.
- Bildquellen sind **keine Testbilder aus dem GitHub-Repo** (Kenney-Previews), sondern echte Public-Domain-Quellen. Die kommen zusammen mit eigener SVG- und Pixel-Art-Ebene.
- Es braucht ein echtes Designkonzept mit Mathematik und Logik, gebaut nach Vorlagen als Blaupause und Benchmark.
- Die Slogans sind inhaltlich ok, aber nicht typografisch gesetzt. Sie wirken hingeworfen, nicht layoutet.
- Georg hatte Reddit-Referenzen genannt, auch mit gemischten Looks und Pixel Art. Im Repo auffindbar ist nur WithSeismic »Living mockups / LED walls«. Die übrigen Referenzen fehlen: **OPEN**, Georg sucht sie heraus.

## DECISION (Folge)
- Der eingefrorene P1 bleibt Beleg. Er wird nicht repariert und nicht umgebaut.
- Vorschlag: den P1-Look später als eigenen Modus `CITY_LIGHTS_ROTATION` führen, getrennt von der Hypernormalisation.
- Nächster Claude-Design-Slice: Konzept und Benchmark-Tafel für Hypernormalisation. Er beginnt erst, wenn die Referenzen da sind, und ohne Runtime-Code.

## OPEN
1. Georgs Referenzen (Reddit-Links oder Bilder)
2. PD-Pool: Kuratierung aus Smithsonian CC0, LoC und Chronicling America vor dem nächsten Bau
