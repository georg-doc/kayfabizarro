# KFB Wireface Stage · live 3D · R1 (2026-10-14)

Status: PROPOSED. Szene läuft im Browser (three 0.186.1). Ein Belegbild ist kein Abnahmebeweis: WS0 prüft die laufende Szene.

## Start
Ordner mit einem statischen Server ausliefern, z. B. `npx serve .`, dann `KFB Wireface Stage Live.dc.html` öffnen. Über `file://` laden ES-Module nicht. Bedienung unten im Bild: Shots (Two-Shot, A nah, B reagiert, Karten-Insert), Auto-Schnitt, 16:9 oder 9:16, Neu starten, Pause, Ecken rund.

## Module nach Host-Vertrag R1.2 · `create(options) -> { object3d, update(dt, ctx), dispose() }`
| Datei | Inhalt |
|---|---|
| `modules/billboard.module.js` | World Billboard Clay01 r2 im Stil `plain` (Datei in `vendor/` unverändert). Fläche nach V-224 per `fitFace` = `fit_face` aus `build_billboard_b3_v2.py`: Karte 1,793 → Fläche 10,76 × 6,00 m; Rahmen und Pfosten folgen. Karte randlos in der Fläche (Canvas = Kartenproportion). Niedrig: `STYLES.plain.gb = 0,9`. Lesefolge: nur POWER, Etikett „card text (no curated quote yet)“. |
| `modules/ground.module.js` | Kompakter Knet-Boden (abgeflachte Kugel, K1 `terrainFg`). Kein Hex. Platzhalter für den Bühnenboden des Worldbuilder-Owners. |
| `modules/actors.module.js` | Zwei Aufsteller „Wireface demo stand-in“ (A spricht, B reagiert). Standbild per Drag-and-drop (linke Bildhälfte A, rechte B), lokal gespeichert. Hook `options.fromSdk(group)` für das echte SDK. |
| `modules/bubbles.module.js` | DOM-Schicht `#ui-bubbles`, Kopf-Anker pro Frame projiziert. Form wie `islands-npc.ts` Z. 89–98: eine Form, ein Zipfel, weicher Schatten, keine Tusche, keine Randwände. Reveal 300 ms, Stagger 520 ms, über dt (seek-fähig). |
| `modules/shots.module.js` | Vier Shots aus den echten Objektgrenzen; Karten-Insert passt die ganze Fläche ein. |
| `modules/sequence.module.js` | Master-Uhr in Schleife: Karte → A (Opener + Triplet) → B reagiert → Lesefolge 3 Satzteile → Karte. |
| `modules/host.js` | Demo-Host: Renderer, K1-Licht »Tag«, Takt (setInterval + rAF), Eingabe. In WS1 übernimmt der Slice-Host. |

## Quellen in `vendor/`
- `billboard-clay01-r2/` · `work/billboard-island-integration-01-2026-10-01` · `KFB_WORLD_BILLBOARD_CLAY01_…_r2/briefd/billboard-clay.js` + `billboard.embed-spec.v1.json`
- `k1/` · K1/H0-Golden-Module (clay-material.v8, clay-profiles.v2, clay-relief.v2, clay-soften.v1) + `clay-k1-adapter.js`. Fingerabdruck-Textur wird über jsDelivr @main geladen.
- `chatterbox/chatterbox-core.js` · ChatterBox Studio r2 (cbs-core-0.1)
- `assets/card_forget_utopia_7.png` · `replies/MODULE_INVENTORY_R1/proofs/` (1490 × 831)

## Offen und ehrlich
- **Wireface-Figuren fehlen.** Das Wireface SDK gibt es nur als Download mit Konto. Aufsteller und Etikett laufen, Zustand `WIREFACE_SDK_NOT_PRESENT`. EYE_RIG_UNPROVEN gilt weiter (V-214); die echten Figuren liefert WS1.
- **Runde Innenecken gegen „nie beschnitten“.** V-220 verlangt runde Innenecken, die Karte soll ganz bleiben. Standard hier: eckig (0). Der Schalter „Ecken rund“ zeigt 0,45 m, das schneidet die Kartenecken an.
- **Triplet-Text CONTENT REQUIRED.** Opener aus V-218, Rest aus Kartentitel und POWER. B-Reaktion = Auswahl-Label „KayfaBOGGLE?“.
- **Belegbilder** in `proof/` stammen aus der laufenden Szene (16:9 und 9:16: Two-Shot, A nah, B reagiert, Karten-Insert).
- Nicht getestet: Safari und Firefox, Mobilgeräte, mehrere Billboards gleichzeitig.
