# HANDOVER_WSA · Billboard Hypernormalisation H4

Stand 2026-09-26. Für die Web-/Stage-Integration. Claude Design pusht nicht; dieses Paket ist ZIP plus Preview.

## Was übergeben wird

| Datei | Status | Zweck |
|---|---|---|
| `src/KFB Billboard Kaleidoscope H4.dc.html` | **PASS (Georg, 2026-09-26)** | Referenzstand der Hypernormalisation-Fläche |
| `src/KFB Billboard Kaleidoscope H3.dc.html` · `H2` · `H1` | FROZEN | Referenz, nicht integrieren |
| `src/support.js` | SHARED | DC-Laufzeit, von allen vier Dateien geladen |
| `PROVENANCE_LOC_H4.json` | DATEN | 33 Platten, Rechte **NOT_VERIFIED** |
| `evidence/` | BELEG | Screenshots H1–H4 aus der Claude-Design-Preview |
| `context/` | KONTEXT | Review- und SOURCE-Datei des eingefrorenen B2b-P1 |

## Was es ist und was nicht

- Eine eigenständige 2D-Fläche (Canvas 1024×512). Läuft im Browser, ohne Build.
- **Nicht** auf der 3D-Tafel. **Nicht** mit dem B2b-Ticker, Lifecycle oder den Modi CARD/COVER/VIDEO/SLOGAN verbunden.
- **Kein** Ersatz für B2b-P1. P1 bleibt eingefrorener Beleg (PR #211, Runtime-Head `2348c069a99b57149d6a2685496b5ce1b40ebe1a`).

## Vorschlag für den Web-Slice W1

1. Ziel: H4 als Modus `HYPERNORMALISATION` auf der Kenney-Billboard-Fläche, neben `CITY_LIGHTS_ROTATION` (P1-Look).
2. Eigentümer: KFB ToolBox / Billboard Media Residency.
3. Schnittstelle: H4 zeichnet in ein Canvas; die Tafel nutzt es als `CanvasTexture` mit `needsUpdate` je Frame. Der Compositor muss dafür aus der DC-Hülle gelöst werden (Klasse `Component`, Methoden `planCycle`, `planShot`, `step`, `drawShot`). Vorschlag: ein Modul `hypernorm-engine.js` mit `mount(canvas, {bpm, candidates, grain, seed, ctx})`.
4. Geschützte Grenze: B2a front/rear CSS3D cull, Kenney-Körper, bestehender Face-Owner, Ticker. Ein Renderer, ein Taktgeber.
5. Fertig, wenn: Fläche läuft auf FRONT, 3/4 und BACK (Rückseite bleibt Körper), fps auf Mittelklasse-Laptop gemessen, Moduswechsel ohne Doppelticker.

## Risiken

- **CORS.** `getImageData` auf LoC-Bildern verlangt `Access-Control-Allow-Origin` von `tile.loc.gov` auf dem Stage-Ursprung. In der Claude-Design-Preview lief es; auf `kayfabizarro.pages.dev` NOT_TESTED. Rückfall: Platten spiegeln (nur nach S1) oder Grades ohne Pixelzugriff.
- **Rechte.** Keine Platte ist einzeln gegen den LoC-Rights-Advisory geprüft. Vor PUBLIC DEPLOYMENT Pflicht (Sprint S1).
- **Fonts.** 16 Google-Fonts-Schnitte. Auf der Tafel müssen sie geladen sein, bevor der erste Frame zeichnet (H4 wartet per `document.fonts.load`).
- **Leistung.** Pixel-Grades und Slitscan sind CPU-lastig; die Ergebnisse werden gecacht (`this.cache`, begrenzt). Leistung außerhalb der Preview NOT_TESTED.
- **Post-Stack.** GLSL ist nicht gebaut und bis D1 nicht erlaubt.

## Prüffrage an Web

Soll H4 als eigenes Modul aus der DC gelöst werden (Vorschlag oben), oder bettet Web die DC-Seite per iframe als Textur-Quelle ein?
