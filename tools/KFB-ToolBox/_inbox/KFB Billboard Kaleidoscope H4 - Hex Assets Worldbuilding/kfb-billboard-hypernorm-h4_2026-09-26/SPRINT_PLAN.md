# Sprint · Billboard Hypernormalisation · ab H4

Stand 2026-09-26. Eigentümer: KFB ToolBox / Billboard Media Residency. Gilt, bis Georg es ändert.
Arbeitsweise: `WORKFLOW.md` (ein abgegrenzter Slice je Lauf, fünf Zeilen vor dem Bau, Ehrlichkeitsformat).

## Ausgangslage

- **H4 = PASS (Georg, 2026-09-26)**, „PASS für jetzt, kann später noch optimiert werden“. H4 ist Referenzstand.
  Datei: `KFB Billboard Kaleidoscope H4.dc.html`.
- H1, H2, H3 sind FROZEN (Referenz, nicht weiterbauen).
- B2b-P1 (`KFB_Billboard_B2b_P1_frozen_2348c06/`) bleibt Beleg, wird nicht repariert. Vorschlag: später als Modus `CITY_LIGHTS_ROTATION`.
- H4 ist eine **2D-Fläche** (Canvas 1024×512, Tafel 2:1). Sie läuft noch nicht auf der 3D-Tafel.

## Reihenfolge

Zuerst die Entscheidungen, dann Rechte, dann Ebenen. Jeder Slice ist einzeln abnehmbar und ersetzt H4 nicht; Neues kommt als H5-Kopie daneben.

| # | Slice | Ziel | Fertig, wenn | Hängt an |
|---|---|---|---|---|
| G0 | Entscheidungen (kein Code) | D1–D3 beantwortet | drei Antworten stehen in `REVIEW_CLAUDE_DESIGN.md` | Georg |
| S1 | Rechte-Kuratierung LoC | 33 Platten einzeln geprüft | `PROVENANCE_LOC_H4.json` trägt je Platte `rights` ≠ NOT_VERIFIED, Liste der Ausfälle | — |
| S2 | PD-Film als Basis `FILM` | echte Public-Domain-Clips als Basisebene | ein Clip läuft im Schnitt, Quelle + Rechte je Clip belegt, CORS auf dem Zielursprung geprüft | S1-Verfahren |
| S3 | `STAGE3D`-Ebene (KayKit) | Figur oder Prop mit Clip als Ebene | Figur kommt über den vorhandenen Besitzer (`mountGraft()` / `mountCarl()` / Resident-Atlas-Pfade), ein Renderer, Bone- und Clip-Bindung im UI ausgewiesen | D1 nicht nötig |
| S4 | KFB-Karten als Ebene | Kartenfläche aus `cardbuilder/` als Basis oder Mittelebene | echte Karte aus `kfb-card-builder.js`, `cardGrid` aus dem Manifest, keine Zahl in JS | Coworker-Manifest |
| S5 | GLSL-Stack | Kaleido, Slitscan, Oberfläche als Shader | nur wenn D1 = aufgehoben; fps auf Mittelklasse-Laptop gemessen, Canvas-2D-Pfad bleibt Rückfall | D1 |
| S6 | Tiefe/Feinschliff H4.x | TUNE-Liste aus Georgs nächstem Blick | nur benannte Punkte, kein freies Nachjustieren | Georg |
| W1 | Integration 3D-Tafel (Web) | H4/H5-Fläche als Textur auf dem Kenney-Billboard | Web-Slice, siehe `HANDOVER_WSA.md` | Web Lead |

## Entscheidungen für G0

- **D1 · Post-Effect-Stack.** Das B2b-Verbot eines Post-Stacks aufheben (für GLSL in S5) oder bestätigen (H5 bleibt Canvas 2D).
- **D2 · Rechte-Schwelle.** Nur „No known restrictions“ oder auch Einträge mit Credit-Pflicht? Vorschlag: nur ohne Einschränkung.
- **D3 · Reihenfolge der Ebenen.** Vorschlag: S2 Film → S3 KayKit → S4 Karten. Film verändert die Bildsprache am stärksten.

## Nicht in diesem Sprint

- Kein Umbau von B2b-P1, kein Eingriff in Ticker, Lifecycle, CARD/COVER/VIDEO/SLOGAN.
- Kein neues Asset-Registry, keine kopierten Modelle, Fonts oder Clips im Export.
- Kein Stage, Public oder Live aus Claude Design.

## OPEN

1. Georgs Reddit-Referenzen (seit B2b-P1 offen).
2. Rechte je Platte (S1).
3. Leistung auf Mittelklasse-Laptop und Mobil: NOT_TESTED.
