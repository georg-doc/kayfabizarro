# BRIEF · Hypernormalisation R2: Zitate als Remix in der H13-Engine · 2026-10-21 · WS0 → WS-Media
**Register:** V-617, ersetzt den P0-Ansatz aus V-606/V-613. **Georg 21.10. (q146/q147 FAIL):** „ich will da keine festen Regeln, das soll ein dynamischer Remix sein, wie in der Hypernormalisation Engine! aber halt optimiert und nicht so layout-mäßig, Motion, repetitiv etc. → das ist doch alles schon gebaut?!“

**Tier 0**
1. **Die Engine ist H13 Kaleidoscope und ist schon gebaut.** Songform, Ebenen-Stapel (Basis, Mitte, Schrift, Kamera, Übergang), Auswahl nach größter Unähnlichkeit, musikgetriebene Bewegung. Du baust darauf auf, nicht daneben.
   - `sequence.js` (Clay Stage R2) ist **keine** Vorlage: feste Phasen, festes Layout.
   - Collage Engine v0 ist ebenfalls keine Vorlage.
2. **Zitate werden Material der Engine, keine Folien.** Ein freigegebenes Zitat erscheint als Schrift-Ebene in den vorhandenen Behandlungen und wird über Shots verteilt. Phrasen, Autor und FrizzleBob-Frage sind eigene Text-Bausteine, die die Engine einplant. Es gibt keine feste Reihenfolge und keine Abdunklung der Basis als Layout.
3. **Optimieren heißt** weniger layouthaft, weniger Wiederholung, bessere Bewegung. Beurteilt wird das Bild in Arbeitsgröße als Clip, nicht über Zahlen.

## Block
**Start (lesen, nichts überschreiben):**
- `KFB Billboard Kaleidoscope H13/kfb-collage-session-2026-09-30/`: `00_ONBOARDING.md`, `DOKU_H5-H13.md`, `FAIL_PROTOKOLL_collage-engine-v0.md`, `SPRINTPLAN.md`.
- Engine-Quelle: `KFB Billboard Kaleidoscope H13.dc.html`, Kernstellen:
  - `SECTIONS`/`FORMS`/`CTX`, `planCycle`, `genCand`, `simScore`, `planShot`;
  - `camAt`, `drawType`, `paint`.
- Neueste Ableitung: `KFB Billboard Kaleidoscope H14-1/kfb-h14-static-bake-2026-09-30/KFB Billboard Kaleidoscope H14.dc.html` (+ `HANDOVER_WSA_H14.md`).
- Konzept mit Georg-PASS: H4 `CONCEPT_H4.md` (git `survey/hypernorm`).
- Diese Ordner liegen in Georgs Dropbox, auf main aber unter `tools/KFB-ToolBox/_inbox/KFB Billboard Kaleidoscope H13/…`.

**Bauen als H15-Kopie** (H13/H14 bleiben eingefroren):
1. **Zitat-Quelle:** Der Pool kommt als Daten herein, wie in P0. Laufen dürfen nur freigegebene Zitate. Die Freigabe-Überlagerung aus `p0.pilot.json` bleibt erhalten (Thoreau, Morris, Wilde).
2. **Text-Bausteine statt `genText()`-Schablonen:** Zitat-Phrasen, Autor/Werk und die FrizzleBob-Frage gehen in die Text-Auswahl der Engine.
   - Behandlungen nach `TYPE_W` mit `TMAX`-Grenzen: GIANT_CROP, KNOCKOUT, ECHO, REDACT, RANSOM, SCRIPT usw.
   - Die Lesbarkeit eines ganzen Zitats entsteht über mehrere Shots, nicht in einer Folie.
   - BANK-Slogans und Schablonentext treten zurück: Schriftliches Material geht vor, so steht es im Onboarding.
3. **Weniger Wiederholung:** Die Unähnlichkeits-Auswahl gilt auch für Zitat-Bausteine. Gemessen wird über 3 Minuten mit 3 Seeds; Wiederholungen werden in einem Kontaktbogen sichtbar gemacht.
4. **Bewegung:** Kamera, Schrift-Bewegung und Übergänge der Engine auf Musik (Disco-Playlist bzw. die Audio-Site-Spur). Höchstens 3 Helligkeitssprünge pro Sekunde (aus P0, G7).
5. **Basis:** Die Engine-Basen bleiben (PLATE, KALEIDO, SLITSCAN, FILM, FRACTAL …). Die Deck-Karte ist eine Quelle unter vielen (KFBCorpus-Crops), nicht der feste Hintergrund. Gesperrte Platten bleiben aus.
6. **Ausgaben:**
   - Spiel-Tafel 1,79:1: nah live und gedrosselt, fern ein eingefrorenes Bild.
   - Remotion-Clip: gleicher Seed, gleiches Bild (V-527).
   - Aus P0 bleiben: Vertragstests, Freigabefilter, Determinismus.

**Abgabe:**
- 3 Clips mit Ton aus der Engine: je 60 s, 3 Seeds, mit den drei Zitaten.
- Ein Kontaktbogen (1 Bild je Shot).
- Vorher/Nachher gegen P0.
- Kurzbericht an WS0. Georg urteilt nach den Clips.

**Grenzen:** Keine neue Engine, keine festen Phasen. Nichts an H13/H14 überschreiben. Kein Merge. Private Renders bleiben privat bei Georg.
