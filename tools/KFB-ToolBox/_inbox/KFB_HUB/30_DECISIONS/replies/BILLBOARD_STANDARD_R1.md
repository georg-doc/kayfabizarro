> **ARCHIV (14.10.2026, V-228):** ersetzt durch `replies/BILLBOARD_STANDARD_R2.md`.

# Billboard-Standard R1 · Hypernormalisation + Plain-Billboard (14.10.2026, V-220)

Dies ist der verbindliche Standard für jedes Billboard und jede Karte auf einem Billboard, in der Wireface-Bühne, im Spiel und in Claude-Design-Entwürfen. Nichts davon wird nachgebaut; es wird übernommen (V-206).

## 1 · Körper: World Billboard Clay01, Variante `plain`
- **Quelle:** Branch `work/billboard-island-integration-01-2026-10-01`, Ordner `tools/KFB-ToolBox/_inbox/KFB_WORLD_BILLBOARD_CLAY01_CLAUDE_DESIGN_SESSION_CUT_2026-10-01_r2/`. Die Variante r1 liegt auch auf main.
  - `KFB Billboard Clay Island.dc.html`: die Design-Vorlage (Claude Design);
  - `briefd/billboard-clay.js`, `briefd/billboard-stage.js`: Körper und Bühne;
  - `billboard.embed-spec.v1.json`: Einbau-Vertrag (Schema `kfb.billboard-embed-spec/1`).
- **Status laut RETURN r2:** `DESIGN_DONOR_APPROVED_TUNE`.
  - Körperstile `plain` und `tv` (flacher Cartoon-Fernseher auf zwei Säulen), daneben `highway`.
  - Runde Innenecken für alle Stile (`faceCornerM`).
- **Für KFB gilt `bodyStyle: "plain"`.** Knet-Körper, keine Tusche-Outline (passend zu V-204).

## 2 · Karte im Billboard: eingesetzt, nicht aufgeklebt

> **Korrigiert durch V-224 (14.10. nachts):** keine feste 2:1-Fläche und kein Füllrand. Die Bildfläche ist responsiv (Seitenverhältnis der Karte, siehe §6). Die Zeilen unten zu `fit` und Rand gelten nicht mehr.
- **Bildfläche (face):** 12 × 6 m, Seitenverhältnis 2:1, als CanvasTexture mit 1024 × 512 px, mit runden Innenecken.
- **Die Karte wird in die Bildfläche gesetzt.**
  - Sie ist Inhalt der CanvasTexture bzw. des Content-Modus, nicht ein zweites Objekt davor.
  - Die Karte kommt als Querformat-Viertelseite über `cardImage(deckId, n)` und wird `fit` eingepasst, vollständig und unbeschnitten.
  - Rand bzw. Hintergrund der Fläche stammt aus der Insel- bzw. Kartenpalette.
- **Nicht erlaubt:** eine Karte als flaches Rechteck vor dem Billboard, ein Hochformat-Aufsteller oder eine Platzhalterkarte (siehe `WIREFACE_STAGE_VISUAL_DONOR_FAIL_2026-10-14.md`).

## 3 · Engine: Hypernormalisation
- **Planungs-Wahrheit:** Branch `planning/billboard-quote-hypernorm-curator-2026-10-04`, `skills/chat/workflows/KFB_BILLBOARD_QUOTE_HYPERNORMALISATION_2026-10-04/START_HERE.md` (dazu RETURN.md, TEST_PLAN.md, QUOTE_POOL_SCHEMA.json).
- **Bild-Besitzer: H13 Kaleidoscope** (main): `tools/KFB-ToolBox/_inbox/KFB Billboard Kaleidoscope H13/kfb-collage-session-2026-09-30/KFB Billboard Kaleidoscope H13.dc.html`, mit `00_ONBOARDING.md`, `DOKU_H5-H13.md` und `HANDOVER_WSA.md`.
  - H13 ist eingefroren. Arbeit daran nur durch Übernahme bzw. eine H14-Ableitung.
- **Ablauf:** Karte bzw. Welt wählt ein kuratiertes Zitat. Es wird als Hypernormalisation-Lesefolge abgespielt, dann folgen Quelle, FrizzleQuestion und optional eine Reflexion. Ein Knet-TV-Knopf unter dem Billboard öffnet die Vollbild-Lesefassung, ohne neu zu starten.
- **Genau ein `BillboardScheduler.tick()`**, kein zweiter Renderer, keine zweite Kamera, keine zweite Bildschleife. Audio ist Verbraucher des KFB-Audio-Vertrags.
- **Laut RETURN 07.10. ist noch kein Zitat für die Laufzeit freigegeben.** Bis dahin nur freigegebene Inhalte bzw. Karteninhalt.

## 4 · Spender-Standardwerte nicht ungeprüft übernehmen
Im r2-Quellpaket steht `billboard.embed-spec.v1.json` noch auf `bodyStyle: "highway"`, `faceCornerM: 0`, `contentMode: "kaleido-cuts"`. Das sind Beispielwerte des Spenders, nicht der KFB-Zielzustand. Für das KFB-Karten-Billboard gilt:
- `bodyStyle: "plain"`.
- `faceCornerM` größer als 0: die runden Innenecken aus r2. Den Wert übernimmt der Ausführende aus der r2-Stilvorgabe und meldet ihn in seiner Vorlagen-Zeile.
- Ruhebild ist die eingesetzte Karte; `kaleido-cuts` bzw. H13 läuft nur während der Hypernormalisation-Lesefolge.
- **Stand Hypernormalisation:** Das Owner-START_HERE sagt `IMPLEMENTATION NOT STARTED`, und es gibt keine freigegebenen Laufzeit-Zitate. Der Design-Vertrag ist also noch keine funktionierende Engine.
- **TV-Knopf:** laut START_HERE „unterhalb des Billboards“. Abweichungen (z. B. ein kleiner Fernseher vor dem Pfosten) beurteilt WS0 am Bild. Es gibt nie einen zweiten Scheduler und keine zweite Medienlogik.

## 5 · Georgs Referenzbild (V-223, 14.10. spät)
`REFS_BILLBOARD/PLAIN_BILLBOARD_REFERENCE_GEORG_2026-10-14.webp`, aus dem Claude-Design-Projekt „KFB Billboard Clay Island“, Variante Plain, K1 v8 Golden.
- Knet-Rahmen mit runden Innenecken auf zwei Pfosten.
- Der Inhalt ist eine in die Fläche integrierte Collage (Hypernormalisation). Keine reingeklebten Bildchen.
- Eine Karte wird genauso integriert, als Teil der Fläche bzw. der Lesefolge.
- Unfertige Varianten im Claude-Design-Projekt sind **kein** freigegebener Standard.
- **TV-Knopf:** vorerst nicht nötig, Entscheidung später.


## 6 · Bühnen-Billboard (V-224)
- **Kein TV und kein Mini-TV**, keine Zusatzteile; nur der Plain-Körper.
- **Niedrig gesetzt:** kurze Pfosten. Die Figuren agieren davor; die Karte bleibt über bzw. zwischen ihnen lesbar.
- **Responsiv:** Die Bildfläche übernimmt das Seitenverhältnis des Inhalts (contain-fit in die maximale Fläche).
  - Vorlage: `fit_face` in `tools/KFB-ToolBox/_handover/BILLBOARD_B3_EXPLORATION_2026-09-26/scripts/build_billboard_b3_v2.py` (Branch `claude/billboard-b3-exploration-2026-09-26`).
  - Gilt auch für die 3D-Fassung: Rahmen und Pfosten folgen der Fläche.
- **Karte:** die ganze Querformat-Viertelseite mit Marginalien, nie beschnitten, **randlos**; der Rahmen sitzt direkt an der Karte.
