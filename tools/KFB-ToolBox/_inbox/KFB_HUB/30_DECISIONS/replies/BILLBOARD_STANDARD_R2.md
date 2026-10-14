# Billboard-Standard R2 (ersetzt R1, gilt nach V-223, V-224 und V-228)

Einzige Quelle für das Billboard auf der Dialog-Bühne. Gebaut wird es von WS1 (B1).

## 1 · Körper
- **Vorlage:** World Billboard Clay01 r2, `briefd/billboard-clay.js` (Branch `work/billboard-island-integration-01-2026-10-01`, Ordner `KFB_WORLD_BILLBOARD_CLAY01_CLAUDE_DESIGN_SESSION_CUT_2026-10-01_r2/`), Stil `plain`.
- Knet-Rahmen auf zwei Pfosten (Referenz: `REFS_BILLBOARD/PLAIN_BILLBOARD_REFERENCE_GEORG_2026-10-14.webp`).
- **Kein TV-Stil, kein Mini-TV, keine Zusatzteile.**
- **Niedrig gesetzt:** kurze Pfosten. Die Figuren stehen davor; die Karte bleibt über bzw. zwischen ihnen lesbar.

## 2 · Fläche
- **Responsiv:** Die Bildfläche übernimmt das Seitenverhältnis des Inhalts (contain-fit in die maximale Fläche). Rahmen und Pfosten folgen.
  - Vorlage: `fit_face` aus `build_billboard_b3_v2.py` (Branch `claude/billboard-b3-exploration-2026-09-26`).
  - Eine JS-Umsetzung liegt in `replies/CLAUDE_DESIGN_STAGE_LIVE_R1/modules/billboard.module.js` (`fitFace`). Sie dient nur als Vorlage für die Vorlagen-Zeile, nicht als Modul.
- Keine feste 2:1-Fläche, keine 1024 × 512-Leinwand: Die Leinwand hat das Kartenverhältnis.

## 3 · Karte
- **Die ganze Querformat-Viertelseite** über `cardImage(deckId, n)`, mit Marginalien, **nie beschnitten**.
- **Randlos:** kein Füllrand, der Rahmen sitzt direkt an der Karte.
- **Innenecken:** Abgerundet wird nur so weit, wie der Papierrand der Viertelseite reicht. Der Radius ist kleiner als der gemessene weiße Rand der Seite, sodass Kartenbild und Marginalien nie angeschnitten werden. Lässt sich das nicht messen, bleiben die Ecken eckig.
- Nur Karten aus Decks, die das Zuordnungs-Audit als SAFE führt. Sonst gilt der Platzhalter mit wörtlichem Kartentext.

## 4 · Zustände
- **Ruhe:** Die Karte füllt die Fläche.
- **Lesefolge (Hypernormalisation):** kommt erst mit freigegebenen Zitaten (H13 als Bild-Besitzer, genau ein `BillboardScheduler`). Bis dahin gibt es keine Lesefolge und keinen Vollbild-Knopf.

## 5 · Vorlagen-Zeile, die WS1 vor B1 einreicht
- `billboard-clay.js` 1:1;
- Änderung nur für die responsive Fläche (`fitFace`) und den kurzen Pfosten-Parameter, jeweils mit Diff;
- Modul-Hülle nach `create/update/dispose`;
- `billboard-stage.js` wird nicht übernommen.

**Abnahme:** Bildpaar Referenz | Stand, Karte vollständig, randlos, Figuren davor.
