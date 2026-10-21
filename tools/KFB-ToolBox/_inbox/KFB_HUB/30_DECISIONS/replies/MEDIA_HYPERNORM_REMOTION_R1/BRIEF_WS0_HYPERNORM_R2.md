# BRIEF · Hypernormalisation-Engine sauber übernehmen und fürs MVP nutzen · R2 · 2026-10-21 · WS0 → WS-Media
**Register:** V-617 und V-620. Ersetzt den P0-Ansatz (V-606/V-613).
- **Georg (q146/q147 FAIL):** Er will einen dynamischen Remix wie in der Engine, keine festen Regeln, nicht layouthaft, nicht repetitiv.
- **Georg danach:** Keine Video-Clips. Die Engine soll sauber übernommen, in Darstellung und Remix-/Collage-Logik verbessert, mit neuen Public-Domain-Assets ergänzt und performant, steuerbar und integriert im MVP genutzt werden.

**Tier 0**
1. **Die Engine ist H13 Kaleidoscope und ist schon gebaut:**
   - Songform, Ebenen-Stapel (Basis, Mitte, Schrift, Kamera, Übergang);
   - Unähnlichkeits-Auswahl;
   - musikgetriebene Bewegung.

   Du machst daraus **ein Modul** (`kfb-hypernorm`) für das Spiel. Keine neue Engine. `sequence.js` und Collage Engine v0 sind keine Vorlagen.
2. **Besser, nicht anders:**
   - Darstellung und Remix-Logik verbessern: weniger Layout-Look, weniger Wiederholung, bessere Bewegung, bessere Collage-Übergänge.
   - Zitate werden Schrift-Material der Engine (Phrasen, Autor, FrizzleBob-Frage als Bausteine über Shots verteilt), keine Folien.
3. **Im MVP:** Die Engine läuft auf den Spiel-Tafeln (1,79:1). Nah ist sie live und gedrosselt, fern ein eingefrorenes Bild. Sie ist steuerbar und hält das Leistungsbudget ein.

## Block
**Start (lesen, nichts überschreiben):**
- `KFB Billboard Kaleidoscope H13/kfb-collage-session-2026-09-30/`: `00_ONBOARDING.md`, `DOKU_H5-H13.md`, `FAIL_PROTOKOLL_collage-engine-v0.md`, `SPRINTPLAN.md`.
- Engine `KFB Billboard Kaleidoscope H13.dc.html`, Kernstellen:
  - `SECTIONS`/`FORMS`/`CTX`, `planCycle`, `genCand`, `simScore`, `planShot`;
  - `camAt`, `drawBase`/`drawMid`/`drawType`, `paint`.
- H14 mit Bake: `KFB Billboard Kaleidoscope H14-1/…/KFB Billboard Kaleidoscope H14.dc.html`.
- H4-Konzept mit Georg-PASS: `CONCEPT_H4.md` (git `survey/hypernorm`).
- Auf main liegen die Ordner unter `tools/KFB-ToolBox/_inbox/KFB Billboard Kaleidoscope H13/…`.

**1 · Sauber übernehmen:**
- Engine-Logik aus der DC-Hülle lösen: ein ES-Modul ohne DC-Laufzeit, ohne `localStorage`-Zwang und ohne globale `window.__kfb*`-Schalter.
- Schnittstelle:
  ```
  createHypernorm({ seed, ctx, pool, palette, bpm, quality })
    → paint(ctx2d, W, H, nowMs)
    → set({ ... })
    → freeze()
  ```
- Die Uhr kommt vom Spiel (ein Scheduler). Determinismus je Seed bleibt erhalten.
- Aus P0 bleiben: Vertragstests, Freigabefilter für Zitate, ≤ 3 Helligkeitssprünge pro Sekunde.

**2 · Verbessern** (Prüfung immer am Bild in Arbeitsgröße, nicht an Zahlen):
- **Remix:** Unähnlichkeits-Auswahl auch für Zitat-Bausteine und Quellen. Wiederholungen über 3 Minuten mit 3 Seeds im Kontaktbogen sichtbar machen und senken.
- **Collage:**
  - echte Ebenen-Mischung (Luma-Key, Ausschnitte, Streifen, Droste) statt Kacheln und Rahmen;
  - Übergänge, die Motive verbinden (Form- und Farb-Match), statt harter Layout-Wechsel.
- **Bewegung:** Kamera und Schrift auf den Beat. Kein starres Einblenden, keine Dauer-Zitterei.
- **Text:**
  - Schriftliches Material geht vor (Zitate, BANK, SCRIPTS);
  - `genText()`-Schablonen treten zurück;
  - Lesbarkeit eines Zitats über mehrere Shots, `TMAX` je Behandlung.

**3 · Pool erweitern:**
- Nur klare Quellen, die du ohne Rückfragen nutzt:
  - Library of Congress „No known restrictions“;
  - Wikimedia Commons PD-Vorlagen (PD-old, PD-USGov, CC0);
  - NASA;
  - Internet Archive (Prelinger, PD-markiert);
  - Smithsonian Open Access (CC0);
  - Rijksmuseum (CC0).
- Je Asset eine Zeile im Manifest: Quelle, URL und Kennzeichen. Fertig, keine Freigabeschleifen.
- Fällt etwas nicht klar in diese Liste, lass es weg.
- Ziel: +300 Platten bzw. Filmausschnitte, nach `CTX` sortiert (POLITICAL, HISTORICAL, COMMERCIAL, ARTISTIC, ABSTRACT).
- Ablage im Cloudflare-Build bzw. R2 als Assets der Engine, Mindestkante 640 px, WebP.

**4 · Steuerbar und im Spiel:**
- **Regler für Georg:** Kontext, Tempo bzw. BPM, Anteil Zitat/Bild, Palette (aus der Insel), Ruhe/Energie, Seed.
- **Ereignisse dürfen umschalten,** z. B. MIB-Einsatz → POLITICAL, Disco → Musik-Takt.
- **Spiel-Inhaltsart `hypernorm`** in `surfaceContent.js`, Canvas2D 1,79:1:
  - Nah: live, 15 Bilder/s.
  - Fern: eingefrorenes Bild.
  - Budget ≤ 1 ms je Bild für alle Tafeln zusammen.
- **Einbau:** über den WS1-Lead nach dem MVP-Zusammenführen (V-618).

**Abgabe:**
- Modul + Tests auf `media/kfb-hypernorm-r2`.
- Eine Spieltafel in der Probe-Welt zum Ansehen (Link).
- Ein Kontaktbogen (1 Bild je Shot, 3 Seeds).
- fps- bzw. ms-Tabelle.
- Kurzbericht an WS0. Georg urteilt an der Tafel im Spiel.

**Grenzen:** Kein Video-Clip als Abgabe. H13/H14 bleiben unangetastet. Kein Merge.
