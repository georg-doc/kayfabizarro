# WS0 → WSA work · Bauauftrag HyperNorm-Scenelet R1 „Das Archiv der lachenden Wahrheiten“ · 25.10.2026 (V-738, Georg Hub q198: „ja, so bauen lassen“)

## Tier 0
1. **Ziel:** ein begehbares, surreal-dadaistisches Video-Kunst-Scenelet als neuer Bereich „Experience“ in der bestehenden HyperNorm-Curator-Site (https://kfb-hypernormalisation-curator.frizzlebob.chatgpt.site). Keine neue Site; der Curator selbst bleibt unverändert.
2. **Verbindlich:** das Konzeptblatt `30_DECISIONS/replies/KONZEPTBLATT_HYPERNORM_SCENELET_R1.md` (Register-Branch, liegt auch im Material-Zweig). Es legt Raum, Medienschichten, Kamera und Steuerung, die sieben Fundstücke, die zwei Ketten, die Leistungswerte und die Gates fest.
3. **Bau als Modul** nach `30_DECISIONS/replies/SPEC_MODULAR_SITE_STAGE_R1.md` (`module.json`, Einstieg, Schalter), damit derselbe Code später im Spiel läuft. Arbeit auf einem `wsa/*`-Zweig, ein Draft-PR, kein Merge.

## Material
- **Privater Material-Zweig:** `georg-doc/KFB-Stunt-Car-Race`, Zweig `assets/hypernorm-r1` @937cdf1, 83 Dateien, 47 MB. Lade Datei für Datei mit Prüfsumme aus `MANIFEST.json`, kein Archiv.
  - `bnwn01/`: 69 BNWN-Clips (Nora) mit `manifest.json`, für die Fernseher.
  - `audio/`: Klangschichten, Klangschalen KS1–KS6 und Natur NA1–NA4 (m4a, −20 LUFS), für den Klangraum.
  - `fundstuecke/`: F1 Karte „The Moving Launch Date“, F7 dein Fnord-Blob-Gassenbild.
- **H13:** `tools/KFB-ToolBox/_inbox/KFB Billboard Kaleidoscope H13/kfb-collage-session-2026-09-30/KFB Billboard Kaleidoscope H13.dc.html` auf kayfabizarro `main`. Die Collage in der Mitte nutzt diese Engine (V-617), nicht einen Nachbau.
- **Schnitt-Grammatik:** `30_DECISIONS/replies/RESEARCH_HYPERNORM_EDIT_GRAMMAR_R1.md`, darin Wechsel aus Hacken und Halten sowie mindestens ein Halte-Shot pro 16 Takte.
- **Selbst holen (gemeinfrei):**
  - F3: ein Dokument aus dem UAP-Archiv der US National Archives (archives.gov/uap);
  - F4: Blake, „The Tyger“, Project Gutenberg #1934;
  - F6: Stein, „Tender Buttons“, Project Gutenberg #15396, ein Abschnitt.

  Quelle und Rechte kommen in den Katalog.
- **F2 und F5:**
  - F2: eine zweite KFB-Karte mit UFO- bzw. Akten-Bezug, bis WS0 sie nennt als markierter Platzhalter.
  - F5: Den Nora-Clip „Your vote has been harmonized for safety.“ produziert Georg noch (HeyGen, BNWN 02). Bis dahin läuft ein BNWN-01-Clip und ist im Katalog als Platzhalter markiert.

## Umfang des ersten Baus
- Ein Raum, die Collage in der Mitte, zwei Fernseher, sieben Fundstücke (F1–F7), zwei Ketten, eine Tür in eine Nebenkammer mit einer laufenden Collage. Dazu der Klangraum und eine Vitrine mit KFB-Auge (pet-eye-rig, Lider anthrazit). Woher das Augen-Modul kommt, steht im Return.
- **Katalog:** `fundstuecke.json` mit `id`, `familie`, `titel`, `quelle`, `rechte`, `datei`, `links` (≤ 3, mit `art`), `faden` (≤ 8 Wörter). Der Curator zeigt den Katalog lesend an. Bearbeiten kommt später.
- **Steuerung:**
  - Ich-Perspektive, Maus bzw. Wischen zum Umsehen, WASD bzw. Pfeile zum Gehen.
  - Klick bzw. Tippen fährt in 1,2 s zum Fundstück. Esc bzw. Rücktaste führt zurück.
  - Der Knopf „Zurück zur Mitte“ ist immer sichtbar.
  - Nach 20 s ohne Eingabe startet der Filmmodus.
- **Leistung:** Ziel 60 fps auf einem Mac Studio, mindestens 30 fps auf einem MacBook Air. Höchstens drei Videotexturen gleichzeitig, Videos in 480p.

## Abnahme
- **Gates als Prüfskript:**
  - Filmmodus 60 s ohne Eingabe mit Halte-Shot ≥ 4 s.
  - Alle Links im Katalog lösen auf.
  - Keine gekauften bzw. privaten Dateien öffentlich (V-071, V-470).
  - Jedes gemeinfreie Fundstück hat Quelle und Rechte.
  - fps gemessen.
- **Bilder für den Kritiker bei WS0:** die 4 festen Kritiker-Kameras (CRITIC_3D_R1) plus Spielkamera, dazu ein 30-s-Video (Raum, Collage, Fernseher-Stotter, Faden folgen, Tür). Ablage im PR bzw. als Link im Return.
- **Return:** Adresse des Experience-Bereichs (hinter dem bestehenden Zugang), Commit, Prüfliste, fps, Bilder. Blockiert etwas: BLOCKED mit Ursache und kleinstem fehlenden Teil, dann am Rest weiterarbeiten.

## Grenzen
- Keine neue Site, kein Merge, nichts löschen, keine Tokens von Georg.
- Gekauftes und Privates bleibt privat.
- Das veröffentlichte MVP (b214) und das Audit (b215) haben Vorrang, falls sie noch laufen.
