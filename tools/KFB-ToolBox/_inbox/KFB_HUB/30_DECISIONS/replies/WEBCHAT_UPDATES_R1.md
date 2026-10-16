# WEBCHAT_UPDATES_R1 · Inventur der Web-Chat-Stränge (15./16.10.2026)

Stand 16.10.2026 · WS0 · nur gelesen (Repo `georg-doc/kayfabizarro`, Fetch 16.10., keine Pushes, nichts gelöscht). Register-Stand: `build_decisions.py` bis **V-328**.

## 0 · Überblick

| # | Thema | Fundort (Branch @ Commit) | Status |
|---|---|---|---|
| 1 | Beleuchtungskonzept | `research/kfb-world-lighting-color-cohesion-r1-2026-10-15` @ `7eb0c21b2` (Draft-PR #403) + `docs/kfb-decisions-register-2026-10-11` @ `1dde8925e`: `replies/WS0_INTAKE_WS1_DIORAMA_LIGHTING_R1_2026-10-15.md` (Issue #404) | Recherche + Intake, nichts gebaut, keine V-Nummer |
| 2 | Motion Comic | `planning/kfb-claude-remotion-motion-comic-rollout-r1-2026-10-15` @ `5a9cf92d3` (Draft-PR #402) | Recherche R1 + Richtung R2, nichts gebaut |
| 3 | Minispiel-/Fluff-/Karten-Schicht | `recovery/kfb-minigames-fluff-source-bridge-2026-10-15` @ `30ad965e8` (Draft-PR #400) | Konzepte R0.1–R0.4, nichts gebaut |
| 4 | Meta-Philosophie / Meta-Narrativ | `docs/kfb-decisions-register-2026-10-11` @ `1dde8925e` (direkt im WS0-Register-Branch, als `WS0_*`-Dateien) | Georgs Global Intent R1–R1.8 + Begleit-Intakes, editorial, keine V-Nummer |
| 5 | Opener-Recherche | `research/kfb-triplet-opener-diversity-r1-2026-10-15` @ `0362e46e7` (kein PR) | R3-Kandidaten, nicht freigegeben |
| 6 | Neue Mund-Sätze | `main` @ `ea603d31d` (16.10. 02:16), `e082405ee`, `3c41b2d6c` (15.10.) · Plugin-Vorprüfung im Register-Branch | 3 neue Bögen; V-326 (TBD), V-328 (RULE) |

**Prozess-Befund (wichtig):** Die Web-Chats zu Thema 1, 4 und 6 haben direkt in den WS0-Register-Branch geschrieben (`docs/kfb-decisions-register-2026-10-11`, 15.10. 21:06–22:52, Autor-Kennung wie WS0). Die Dateien heißen `WS0_*` und sind durch den Sync schon in `KFB_HUB/30_DECISIONS/replies/` gelandet; außerdem stehen ihre Einträge in `CHANGELOG.md` (R1.3–R1.7, Mouth-Preflight) und in `skills/chat/KFB_GAME_BIGGER_PICTURE_REFERENCE_2026-10-04.md`. Sie sind **nicht von WS0 verfasst**. Inhaltlich halten sie sich an die Grenze „keine V-Nummer, WS0 entscheidet“, aber die Herkunft ist im Dateinamen nicht erkennbar. Vorschlag unter §7.

**00_INBOX / 20_BRIEFINGS / 10_SSOT:** seit 14.10. keine neuen Web-Chat-Ablagen (nur `10_SSOT/README.md`, `.DS_Store`). `KFB Open World` nicht angefasst.

---

## 1 · Beleuchtungskonzept (Diorama-Licht, Tageslicht-Basis, Schatten, Farbe je Tageszeit)

### Fundort
- `research/kfb-world-lighting-color-cohesion-r1-2026-10-15@7eb0c21b2:skills/chat/research/KFB_WORLD_LIGHTING_COLOR_COHESION_R1_2026-10-15/` – `RETURN.md`, `RESEARCH_AUDIT.md`, `INTEGRATION_BRIEF.md`, `SOURCE_CANDIDATES.json` (16 externe Quellen), `TEST_REPORT.md`, `CHANGELOG.md`; dazu Anhang in `skills/chat/masterplan/WORLD_COLOR_LIGHTING_COHESION_TBD_2026-09-15.md`.
- `docs/kfb-decisions-register-2026-10-11@1dde8925e:tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/replies/WS0_INTAKE_WS1_DIORAMA_LIGHTING_R1_2026-10-15.md` (lokal identisch in `replies/`), GitHub-Issue #404.
- Vorhandene Grundlage, auf die beide verweisen: `replies/WSA_LIGHT_STUDY_C_R1.md` + `replies/light-presets.json` + `replies/WSA_LIGHT_STUDY_C_R1/` (11.10., nur im Register-Branch, **lokal in `replies/` nicht vorhanden**).
- WS1-Anfrage: `ws1/r3f-frame@d602c0ab5:WS1_STATUS.md` §38.2.

### Zusammenfassung
- Kernthese: Gemischte Asset-Familien (KayKit, Meshy, Kenney, Quaternius, eigener Clay) werden nicht durch ein gemeinsames DirectionalLight stimmig. Nötig: **ein** Licht-Rig, kleine Kalibrierung je Asset-Familie, wenige motivierte lokale Lichter, Stimmungs-Presets, Color Grading zuletzt.
- Drei Hauptstimmungen bei gleicher Kamera und Belichtung: **neutraler Tag**, **Golden Hour / cozy** (warmer Key, kühles Fill, keine ausgebrannten Clay-Flächen), **Story-Nacht** (Karte, Text, Augen, Blase lesbar; 1–2 motivierte Praktikabel-Lichter). Optional später ein surrealer Akzent.
- Schatten: `LESSONS_SHADOWS.md` (PCFSoft, angepasstes, texel-gerastetes Schatten-Frustum, Kontakt über Geometrie) gilt; **kein VSM** (Kontakt-Lecks).
- Fallen benannt: Tapete/JPEG-Himmel beleuchtet nichts; Himmel-Tönung + Story-Tint + Grading färben dreifach; PMREM nicht pro Bild neu backen; Meshy-Texturen haben teils eingebackene Schatten (nicht doppelt).
- Quellenliste extern (nur Kandidaten, nichts geladen): three.js Sky/PMREM/RoomEnvironment, Poly Haven CC0 (Kloppenheim overcast, Qwantani sunset), ambientCG, Kenney Skyboxes, drei Environment, Godot Environment, Reddit.
- Georgs Korrektur (Return-Nachtrag + Intake #404): Das alte R4-/Vier-Insel-Tor blockiert nicht. Licht-Referenz ist die **laufende WS1-Dialogszene** (zwei Figuren, echte Karte, Clay-Billboard, Meshy-Bühne). WS1 baut, WS0 vergibt.
- Erweiterung im Intake: optional **Metatheater/Pop-up** (gestaffelte Pappkulissen, gemalte Schatten, Rückseiten-Enthüllung) im selben Lichtpilot → siehe Thema 4.
- Recherche-Bilanz ehrlich: 0 Renders, 0 Runtime-Tests; der „Gracen“-Begriff (Georg: „Gracen-Daten“) ist in keiner Quelle als Feld belegt.

### Entschieden (Georg) vs. Vorschlag
- **Georg (15.10., im Intake bzw. WS1 §38.2 berichtet):** einheitliches Licht- und Schattenkonzept + Farbkonzept, das mit Lichtstimmung/Tageszeit variiert; Tageslicht als Basis; kein Blockieren durch R4; WS1 baut nach WS0-Vorlage. **Keine V-Nummer.**
- **Im Register schon fest:** V-050 (Profile Tag/Abend/Nacht/Innen, Abend TUNE: zu orange, zu dunkel), V-101 (Überblendung, keine harten Schnitte), V-132 (ein Licht-/Nebel-Schreiber), V-174 (4) (J17 = Licht- und Sättigungs-Maßstab), V-203 (Bodenkontakt + Kontaktschatten für Auto und Props), V-282 (Prüfbilder im Spiel-Licht, Histogramm), V-286 (Meshy nur leicht tönen), V-305 (Harmonie-Modell PASS).
- **Vorschlag, nicht angenommen:** J17-Tag als Basis, Abend-Kandidat E50, Drei-Stimmungs-Raster F0–F4 / G0–G4, Pop-up-Ergänzung.

### Konflikte mit dem WS0-Register
1. **Schreiber-Rolle:** PR #403 nennt „Travel/World EnvironmentHost“ bzw. `day-night.js` als einzigen Schreiber (V-132, Lab-Zeit). Nach V-228 ist **WS1 einziger Host/Licht-Schreiber**. Der Return-Nachtrag korrigiert das selbst; der Rest des PR #403 (INTEGRATION_BRIEF §B, Tor `OWNER-ACCEPTED_EXISTING-HOST…`) ist überholt.
2. **„18 %“ Meshy-Tönung** im Intake: V-286 sagt „leicht“; die 18 % stammen aus WS1 §38 („Georg: passt“). Passt, aber nicht als Zahl im Register.
3. **V-305 kennt keine Tageszeit:** Der Generator liefert eine Tages-Palette (Himmel = Laub +90°, L ≈ 0,82). Für Abend/Nacht fehlt eine Regel, wie Himmel/Nebel aus der Palette abgeleitet werden. Farbkonzept R1 §2.1: Licht trägt nicht die Marke, Story-Mode darf Licht nur tönen.
4. **V-298** (NPC-Performance zum Beat) und Licht: kein Konflikt, aber Performance-Bühnen brauchen dasselbe Preset (kein eigenes Showlicht ohne WS0).
5. **„YouTube-Recherche“ (WS1 §38.2 Frage 1):** Einzige ausgewertete Quelle ist das KayKit-Godot-Tutorial (`https://www.youtube.com/watch?v=Vfr3n4WKsc0`, Ambient Energy 0,75 bei 7:20; Beleg `tools/KFB-ToolBox/_inbox/MVP1_RETURNS/WSA_scene_study/C_VIDEO_FRAME_CAPTURE.json`). Eine weitere YouTube-Recherche fand ich weder im Repo noch im Hub.

### Was WS1 für ein Licht-Briefing braucht (Auszug, von WS0 zu entscheiden)

**a) Licht-Rig (Owner und Aufbau)**
- Ein Licht-Modul im WS1-R3F-Host schreibt Sonne, Hemisphäre, Fill/Gegenlicht, Nebel, Himmel, Exposure und Schatten (V-228). Dioramen liefern nur Daten: Preset-ID, Story-Mode, höchstens wenige Praktikabel-Lichter aus echtem Bühneninhalt.
- **Basis-Tageslicht J17-Tag** (Quelle `track-look.v5.js` Z. 93/126–129, gemessen in `WSA_LIGHT_STUDY_C_R1`):
  - Sonne `#fff4e6`, 2,9; Hemi Himmel `#eef4fa`, Boden `#9a8a78`, 1,05; Gegenlicht `#ffe6d6`, 0,6;
  - ACESFilmic, sRGB, Exposure nicht gesetzt (= 1);
  - Sonne **49,0° hoch, Azimut −53,1°** (Richtung zum Licht, ab +Z);
  - Nebel linear in Himmelsfarbe.
- **WS1 heute** (§38.2): Hemi `#fff4e0`/`#3a3226` 1,25, Sonne 1,8 aus (18, 30, 22), Schattenkarte 2048. Daraus gerechnet: Sonne ≈ 47° hoch, Azimut ≈ +39°, also **von der anderen Seite als J17**. Der Hemi-Boden ist fast schwarz-braun, J17 hat neutral `#9a8a78`.
- Intensitäten aus Travel/Lab nie 1:1 kopieren: Das Lab skaliert (Key ×0,48, Hemi ×0,714, Fill ×0,514). Kalibriert wird relativ zum J17-Tag.

**b) Tageszeit-Modell**
- Stufen: **Tag · Abend · Nacht**, dazu Innen/Tunnel (V-050).
- Spender für Abend/Nacht ist `travel/.../globe-v13/sky-presets.js` (SKY3-Cut auf main), Schlüssel `day`/`evening`/`night`.
- Abend:
  - Quelle: Sonne `#ffaa40` 3,5; Hemi `#ff9944`/`#554422` 0,94; Fill `#cc8855` 0,875; Nebel `#c07848`. Das ist V-050 TUNE: zu orange, zu dunkel.
  - Kandidat **E50**: Sonne `#ffd3ae`, Hemi und Fill wie J17, Stärken halb zwischen Abend und Tag (Key +21 %, Hemi +43 %, Fill +50 % gegenüber Abend). **Nicht angenommen.**
- Nacht (Quelle): Hemi `#283c80`/`#10202c` 0,625; Ambient `#7088bb` 0,375; Sonne/Mond `#102060` 1,25; Fill `#304880` 0,625; Nebel `#08142c`; Sterne und Aurora an. Lesbarkeit von Gesicht und Karte per Praktikabel-Licht; Spender ist der Lichtkreis nach V-096/V-097 (PointLight an der Figur, WhackMan 1:1).
- Übergang: Überblendung, keine harten Schnitte (V-101, Georgs No-hard-cuts-Regel). Dauer und ob es einen Auto-Tageslauf gibt, ist offen.

**c) Schatten-Regeln**
- Alle Figuren und Props werfen Sonnenschatten (V-203; WS1 §38: KayKit wirft jetzt wie FB).
- Kontaktschatten für **alle** Figuren und Props (V-203). Heute hat nur FB `contact-ao` (P08). Entscheidung nötig: auch für KayKit und Meshy-Requisiten.
- Gesichter empfangen keine Schatten (wie P08: Ohren werfen nicht, Gesicht `shadowOff`, Mund empfängt nicht). Der Körper empfängt.
- Die Ungleichheit KayKit-empfängt-nicht vs. FB-empfängt (WS1 §38, Studio-Vergleich 2,4 → 13,6) klärt das Briefing per Regel „Gesicht nie, Körper ja“.
- Technik: PCFSoft, angepasstes texel-gerastetes Frustum (`LESSONS_SHADOWS.md`), kein VSM, kein Peter-Panning. Dunkel am Fuß entsteht durch Eingraben, Schatten und AO, nicht durch Abdunkel-Scheiben (V-011).
- Stärke und Weichheit: Zahl offen → Bildpaar für Georg.

**d) Farbe × Licht (V-305, V-286, Farbkonzept §2.1)**
- Materialien tragen die Farbe:
  - alles Selbstgebaute bekommt die volle V-305-Palette mit Rollen;
  - Meshy-Texturen nur leicht getönt (18 % laut WS1 §38).
- Licht trägt nicht die Marke: Lichtfarbe kommt von der Lichtquelle (mittags weiß, abends warm). Story-Mode darf das Licht leicht tönen (Größenordnung WS1-Story-Tint 12 %, Grenze ~15 %), nie ersetzen.
- Himmel am Tag = Palette `sky` (V-305). Für Abend/Nacht kommt der Himmel aus dem Tageszeit-Preset. Vorschlag: Palette-Himmel als Farbton-Anker, der Nachtgradient nur leicht in diese Richtung gedreht. Das ist eine **neue Regel, WS0 muss sie entscheiden**.
- Hemi-Himmel neutral lassen (J17 `#eef4fa`), damit Himmel, Tint und Grading nicht dreifach färben. Grading zuletzt, zunächst keins.
- Gedruckte Karte nie umfärben, kein Post-Processing darauf (BILLBOARD_STANDARD_R2). Fluff-Farben (V-305 col02) bleiben Materialfarbe.

**e) Abnahme-Raster** (nach V-310/V-312)
- Testszene: dieselbe Zwei-Figuren-Kartenszene (FB + GothGirl), feste Kamera, Tag / E50 / Nacht, jeweils 16:9 und 9:16.
- Prüfpunkte: Augen, Mund, Blase, Kartenkanten und Marginalien, Clay-Relief, Fußkontakt, Histogramm ohne Ausbrennen (V-282), Lichtzahl, Schatten-Pass, Bildzeit.
- WS1 prüft nur den Diff plus einen Rauchtest von ≤ 5 min.

### Was WS0 als Nächstes tun sollte
1. Licht-Briefing `BRIEF_WS1_LICHT_R1.md` schreiben: Inhalt nach §1 a–e, Antwort auf WS1 §38.2 Fragen 1–5. In `WS0_TO_WS1.md` verlinken.
2. Meilenstein festlegen. Vorschlag: kleiner Licht-Pass **nach M2-G0**, ohne M2 umzuordnen. WS1 wartet ausdrücklich (§38.2 Punkt 5).
3. Georg zwei Bildfragen im Hub stellen, je ein großes Bild pro Variante, ein Klick: (a) Tag J17 vs. heutiges WS1-Licht, (b) Abend E50 vs. Quelle. Danach V-Nummer für die Basis vergeben.
4. Technische Regeln selbst festlegen (ohne Georg, V-228 technisch): ein Licht-Schreiber, Kontaktschatten für alle, Gesicht empfängt keinen Schatten.
5. `WSA_LIGHT_STUDY_C_R1.md` + `light-presets.json` vom Register-Branch nach lokal `replies/` holen (fehlt lokal).
6. PR #403 als „Spender, Tor überholt“ markieren. Issue #404 mit dem WS0-Entscheid beantworten.
7. Pop-up/Metatheater (Thema 4) höchstens als **eine** optionale Kulisse im selben Pilot, nicht als eigener Auftrag.

---

## 2 · Motion Comic (Cutscenes im Spiel + Marketing)

### Fundort
`planning/kfb-claude-remotion-motion-comic-rollout-r1-2026-10-15@5a9cf92d3:skills/chat/workflows/KFB_CLAUDE_REMOTION_MOTION_COMIC_ROLLOUT_R1_2026-10-15/` – `RETURN.md` (R2-Nachtrag oben), `INTERACTIVE_MOTION_RECIPES_R2.md` (aktuell gültig), `RESEARCH_AND_PIPELINE_R1.md` (R1, mit Umleitung), `CLAUDE_CODE_WS0_BRIEF.md` (R1-Auftrag an WS0, als überholt markiert), `CHANGELOG.md`. Draft-PR #402.

### Zusammenfassung
- R1 (video-first): 12–20-s-Motion-Comic aus **einer** echten 2×2-PDF-Seite (vier Karten), 16:9 plus eigenständig gestaltete 9:16-Fassung, per Remotion (React, frame-genau) als Kandidat. Schnittliste (EDL) als JSON mit `deckId`, `cardRef`, `shotId`, Frames, Text- und Audio-Referenz.
- **Georgs Richtungswechsel (R2):** Hauptprodukt ist eine **wiederverwendbare interaktive Animations-Bibliothek** für Karten. MP4/Remotion ist nur eine spätere Ausgabe.
- Rezept-Bausteine (Vorschlag):
  - Deck/Karte: `deck.shuffle.visual`, `deck.deal`, `card.flip.reveal`, `card.fan.spread`, `card.carousel.slide`, `card.inspect.hero`, `card.living.idle`;
  - Seite/Fläche: `page.panel.reveal`, `surface.billboard.sequence`;
  - Übergang/Dialog: `scene.transition.card`, `speech.bubble.cue`.
- Vertrag: Rezept = Daten; `sample(recipe, t)` bzw. `pose(p)` zustandslos und seekbar. **Die Uhr kommt vom Host** (Viewer, Spiel, Billboard-Scheduler, Export), kein eigenes rAF je Karte. Die Animation ändert nie Kartenreihenfolge oder Inventar.
- Spender (vorhanden, nicht neu geprüft):
  - CardStack v1 `createReveal().pose(p)` (`kfb-card-stack.js`, Selbsttest NOT_TESTED);
  - WS0 Living Illustration (2D-Canvas);
  - Billboard H13/H4/H5 + `BillboardScheduler.tick`;
  - Theater-Vorhang bleibt eigener Owner.
- Adapter je Fläche: Viewer (DOM/Canvas/WAAPI), Spiel-3D (CardStack im WS1-Takt), Billboard (Paint-Provider auf vorhandene CanvasTexture), Video-Export optional (Remotion/Bildfolge).
- Technik nicht entschieden: WAAPI bzw. Motion zuerst, GSAP als Alternative, Remotion nur für Export. Remotion ist **source-available**, gratis nur für Einzelne und Teams bis 3 Personen; das muss geprüft werden.
- 3D-Musikvideo bzw. Tanz (MUSIC-PERF-01, PR #391, 8 s / 240 Frames) bleibt ein getrennter Strang.

### Entschieden (Georg) vs. Vorschlag
- **Georg (15.10., im R2 berichtet, ohne V-Nummer):** interaktiv zuerst; Karten-Mischen, Austeilen, Flip, Fächer, Swipe, Panel-Reveal, Billboard-Sequenzen, Cutscenes, optional Social/Video.
- **Vorschlag:** alles Übrige (Rezeptliste, Vertrag, Werkzeug, erster Pilot im Deck Viewer v5).
- Register: keine V-Nummer zu Motion Comic. Verwandt sind V-279 (TBD: Deck-Songs als Spiel- und Marketing-Element, Karaoke), V-280 (Idee „Case-Fabulation“ mit Karaoke-Ebene), V-298 (NPC-Performance: 3–4 Dance-Moves zum Beat), V-259 (1,79:1 für alle Einbettungen).

### Konflikte mit dem WS0-Register
1. **Format:** Billboard H13/H4 arbeitet mit 2:1 (1024×512). V-259 und BILLBOARD_STANDARD_R2 verlangen 1,79:1 bzw. das echte Kartenformat. `surface.billboard.sequence` muss auf 1,79:1.
2. **Owner:** R2 nennt „WS0 Comic Card Deck Viewer v5 / Claude Code“ als ersten Umsetzer. Nach V-228 baut nur WS1 Laufzeit. Für den Viewer (eigenes Werkzeug, kein Spiel) muss WS0 klären, wer baut; Spiel-Cutscenes und Billboard-Adapter gehören in jedem Fall zu WS1.
3. **Prüfaufwand:** Das R2-Tor listet viele Testarten. V-312 verlangt ein schlankes Raster mit fester Bildserie. Beim Auftrag kürzen.
4. **Marketing:** Kein Posting, kein Scheduler, nur Ausgabe. Passt zu V-279, braucht aber eine eigene Entscheidung.
5. **Lieder:** V-325 stoppt Batch 8 v2/9. Song-Videos aus Triplet-Tracks warten damit mit.

### Was WS0 als Nächstes tun sollte
1. Georg fragen (glanceable): „Zuerst Karten-Animation im Viewer oder zuerst ein 15-s-Clip für Marketing?“ Danach V-Nummer.
2. Owner festlegen: Viewer-Pilot (WS0 als Werkzeug oder Auftrag) vs. Spiel-Adapter (WS1, später).
3. Pilot-Raster schreiben: eine echte 2×2-Seite, vier Karten einzeln gezeigt, drei Bewegungen (Mischen nur visuell, Flip, Swipe), Seek/Rückwärts, reduced motion, feste Bildserie.
4. 1,79:1 im Rezept-Vertrag festschreiben (V-259).
5. Remotion-Lizenz erst prüfen, wenn Export ansteht.

---

## 3 · Konzept-/Minispiel-Schicht (Minispiele, Fluff, Kartensammeln)

### Fundort
`recovery/kfb-minigames-fluff-source-bridge-2026-10-15@30ad965e8:skills/chat/recovery/`:
- `KFB_POSTMVP_MINIGAMES_FLUFF_SOURCE_RECOVERY_2026-10-15.md` (Index auf v0.3–v0.7.1)
- `KFB_POSTMVP_MINIGAMES_FLUFF_RECOVERY_RETURN_2026-10-15.md` (Return mit Nachträgen R0.1–R0.4)
- `KFB_WATER_HARVEST_MICROGAME_FIRST_PROOF_DESIGN_R0_1_2026-10-15.md`
- `KFB_DECK_HOMEBASE_COLLECTION_PROGRESSION_R0_2_2026-10-15.md`
- `KFB_HOME_RETURN_STONE_POI_3D_COMPASS_R0_3_2026-10-15.md`
- `KFB_PICKUP_FLUFF_CARD_LOOT_SOCIAL_CALLS_R0_4_2026-10-15.md`
- `skills/chat/START_HERE.md` (Verweis ergänzt)

Draft-PR #400. Originale v0.3–v0.9 liegen weiter auf `planning/kfb-fluff-crafting-almanac-ideation-2026-10-09`; WS0 hat sie am 15.10. schon in `replies/CONCEPTS_FLUFF_MINIGAMES_R1/` gesichert (V-294).

### Zusammenfassung
- **R0.1 Wasser-Ernte:** ein echter Teich, zwei Spielweisen.
  - Ruhiges Angeln: 7 KayKit-Clips `Fishing_*` aus `Rig_Medium_Tools`.
  - Cartoon-Bombenfischen: KayKit `clown_bomb`, Clay-Rauch, Wellen; Fische, Fluff und Props fliegen.
  - Beide Weg optional, Chill-and-Fun, beide liefern **ein** `ActivityResult`.
- **R0.2 Deck-Homebase:**
  - Ein Diorama je Deck als thematische Heimat mit Kurator-Resident; Karten liegen in der Welt, auch weit weg.
  - Nummeriertes 1..N-Album mit echter PDF-Kunst; Reihenfolge frei. Fortschritt = gezählte Karten, keine zweite XP-Währung.
  - Registry: 130 Decks / 6.985 Karten, 79 Decks mit 56 Karten.
  - Meilensteine bei 1/N, 25 %, 50 %, 75 %; bei 100 % ein Deck-Finale als Welt-Ereignis, mit Song nur wenn einer abgenommen ist.
- **R0.3 Ruhestein + 3D-Kompass:**
  - Ruhestein im WoW-Stil: Heimatanker im Spielstand, Rückweg per Taschenportal.
  - 3D-Clay-Kompass zeigt relativ zur Blickrichtung, mit Name und ehrlicher Distanz; im Flug **Pflicht mit Neigung hoch/runter**.
- **R0.4 Pickup:**
  - Ablauf: Ernte/Sprengung/Angeln → Fluff-Kugeln hüpfen, kommen zur Ruhe in Griffhöhe → **Einsammeln durch Drüberlaufen**, ein `+N Fluff`.
  - Karten: großer Reveal mit echter PDF-Karte, Bestätigen, dann Flug ins Almanach.
  - Besondere Props: Vorschau mit Nehmen/Fragen/Lassen/Anzweifeln.
  - Spender: WhackMan-Ballistik (Rig_Legacy, nur Formsprache), Overworld-2D-Kartenreveal (WIN → Karte → OK → Almanach).
- Schutzregeln überall: nur echte Karten (`deckId + cardNumber`), keine Lootboxen, keine Pflicht-Grind, Belohnung entsteht durch das Ergebnis, nicht durch Partikel.
- Alle Dokumente: **nach dem spielbaren MVP**; Tor `MINIGAME_FLUFF_SOURCE_AND_OWNER_AUDIT` erst mit Georgs Go.

### Entschieden (Georg) vs. Vorschlag
- **Georg (15.10., in den Dokumenten berichtet, ohne V-Nummer):** „top! dann los“ (R0.1); Deck-Homebase-Idee (R0.2); Ruhestein + Kompass mit Pflicht-Neigung im Flug (R0.3); automatisches Fluff-Einsammeln in Griffhöhe, Karten-Reveal, Social Calls bei Props (R0.4); „Trickfisch“ als Witzfigur.
- **Im Register fest:**
  - V-288 (Grund zu reisen → Reisen macht Spaß → Begegnung am Diorama);
  - V-294 (Zone = Diorama + Umland, 2–4 min Fahrt; Minispiele liefern Fluff und Karten; High/Low vorsehen, zunächst evtl. nicht nutzen; UFO als Hub);
  - V-305 (Fluff-Farben: High satt, Low dunkel);
  - V-319 (TBD: rund ums Diorama Zufallsbegegnungen, Minispiele, Kämpfe, Fluff-Ernte; Georg arbeitet es mit dem Web-Chat aus, **das ist dieser Strang**);
  - V-289 (Weltstruktur TBD).
- **Vorschlag:** alle Mechanik-Details, Schwellen, Zustandsmaschine, Kompass-Mathematik.

### Konflikte mit dem WS0-Register
1. **Owner:** Alle R0-Dokumente nennen „Island Worldbuilder Lab / Claude Code“ als Owner und das Tor `CLAUDE_CODE_RECOVERY_INTAKE_CONFIRMATION` an die Lab-Sitzung. Seit V-209/V-228 baut **WS1** die Laufzeit; das Lab/RKIT ruht. Die Adressierung ist überholt.
2. **Social Calls umgedeutet:** R0.4 nutzt KayfaBINGO = nehmen/bestätigen, **KayfaBONGO = verschieben/lassen**, BLÖDSINN = Behauptung anzweifeln. Die Freestyle-Regeln v18-4 (Z. 137–140) sagen: BONGO = „Power wie Mechanik aufgelöst → als Story neu erzählen“, BLÖDSINN = Regelbruch, Mehrheit entscheidet. Die Thema-4-Dokumente (Kubrick) nutzen die Regel-Bedeutung. **Widerspruch, Georg entscheidet.** Die Ruf-Farben aus V-292 betrifft das nicht.
3. **Meilensteine:** R0.2 schlägt 25/50/75/100 % vor; WS0s `GAME_LOOP_R1.md` „etwa alle 8 Karten eine Triplet-Strophe“. Beides Entwürfe, aber zwei Varianten.
4. **Weltstruktur:** R0.2/R0.3 setzen schwebende Inseln, Taschenportal und Brücken voraus. V-289 (Zonen vs. dynamisch vs. Mischform) ist offen; Ruhestein und Routenkompass hängen davon ab. Der Flugkompass hängt an V-274 (Flugmodus TBD).
5. **Ort der Karten:** R0.2 erlaubt Karten „auf fernen Inseln“. V-319 fokussiert „rund ums Diorama“. Kein harter Widerspruch, aber Gewichtung klären.
6. **Song beim Finale:** passt zu V-279 (TBD) und V-325 (Songs pausiert). R0.2 sagt richtig: Vollständigkeit nie vom Song abhängig machen.
7. **Performance beim Finale:** V-298 (Dance-Moves zum Beat) ist der passende Baustein, R0.2 kennt ihn nicht.

### Was WS0 als Nächstes tun sollte
1. Ein **Georg-Kurzblatt** (Hub, glanceable) mit vier Fragen:
   - Kartenquelle zuerst: Botengang / Freilegen / Mischung je Deck (`GAME_LOOP_R1` §3);
   - Meilensteine: alle 8 Karten oder 25/50/75/100 %;
   - Bedeutung von BONGO/BLÖDSINN im Spiel;
   - Ruhestein ja/nein.
2. `CONCEPTS_FLUFF_MINIGAMES_R1/OVERVIEW.md` um R0.1–R0.4 ergänzen, mit Quelle Branch@`30ad965e8`. Die Originale nach `source/` kopieren, damit alles an einem Ort liegt.
3. PR #400 kommentieren: Owner ist WS1 (V-228), Tor-Adresse ist WS0. Kein Merge.
4. Für MVP-1 nur den kleinsten Test aus `GAME_LOOP_R1` §5 behalten, ergänzt um R0.4-Pickup durch Drüberlaufen als Abnahmepunkt. Alles Weitere bleibt nach MVP.
5. V-Nummer erst nach Georgs Antworten. V-319 dann von TBD auf RULE setzen.

---

## 4 · Meta-Philosophie / Meta-Narrativ

### Fundort
Alles auf `docs/kfb-decisions-register-2026-10-11@1dde8925e`, Pfad `tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/replies/` (lokal identisch in `replies/`):
- `WS0_GLOBAL_INTENT_ROLE_CONSCIOUS_RESIDENTS_R1_2026-10-15.md` (80 KB, R1 bis R1.8) + `WS0_GLOBAL_INTENT_ROLE_CONSCIOUS_RESIDENTS_R1_1_RETURN_2026-10-15.md`
- `WS0_METATHEATRE_POPUP_DIORAMA_INTAKE_R1_2026-10-15.md` (Pop-up/Metatheater, Herriman/Sterrett)
- `WS0_KUBRICK_METATHEATRE_GAG_R1_2026-10-15.md`
- `WS0_MULTILAYER_ASTERIX_CLOSURE_INTAKE_R1_2026-10-15.md` + `..._RETURN_R1_2026-10-15.md`
- Anhänge in `skills/chat/KFB_GAME_BIGGER_PICTURE_REFERENCE_2026-10-04.md` (R1.1–R1.8) und `CHANGELOG.md` (15.10.)

Dazu WS0s eigenes, älteres `replies/META_NARRATIVE_R1.md` (Fluff-Genesis, 15.10. 12:31, V-294/V-295). Das ist **ein anderer Strang**: Kosmologie statt Figurenhaltung.

### Zusammenfassung
- **Leitsatz:** „Die Darsteller wissen, dass sie spielen; sie haben trotzdem ein Leben im Stück.“ Residents kennen ihre Rolle bzw. Charaktermaske und ihre Fehler-Loops. Sie spielen sie trotzdem mit Lust und Ernst, manchmal steigen sie aus.
- **R1.1:** Schicksal gewählt, zugewiesen und gefeiert; Dienst (Kampf, Amt) und Feierabend (Lagerfeuer) gelten beide. Selbsterkenntnis ist keine Absolution. „Kognitive Dissonanz ist der Resonanzraum von Kayfabizarro.“
- **R1.2 → von R1.3 korrigiert:** Die Idee, Residents existierten nur durch die Aufmerksamkeit des Spielers, ist **ausdrücklich verworfen**. Stattdessen Lebensfreude und eigener Wert. Kreislauf: leben, bauen, begegnen, spielen, evtl. zerstören, reparieren, erinnern, feiern (Doozers als Technik-Referenz).
- **R1.4:** Recht auf Klage, Erschöpfung, Groll; Epiktet (Enchiridion §17: die Rolle gut spielen). Keine Pflicht zum Glücklichsein, keine Therapie-Rede.
- **R1.5:** Homer-Simpson-Mechanik: Die Figur klagt und verrät dabei die Ursache, verpasst aber den Schluss. **Der Spieler schließt (Closure).**
- **R1.6–R1.8:** Verschwörungs- und Welterklärungen als spielerische Erkundung, mit Belegleiter (Northwoods, Tonkin, Liberty, JFK mit Quellen). **R1.8 (Georg-Korrektur):** keine Wahrheits-Etiketten oder Warnschilder auf Karten bzw. im Dialog. Stattdessen ein optionaler QR-Weg zu echten Originalquellen; KFB schreibt keinen Schluss vor.
- **Metatheater/Pop-up:**
  - Vorbilder: Caligari, Metropolis, Dracula, Brecht, Multiplane;
  - Herriman (Krazy Kat: Kulisse wechselt mitten in der Handlung, Figuren spielen weiter) und Sterrett (Polly and Her Pals: kubistische Räume);
  - „Pop-up-Standee“ als Requisit, Rückseiten-Enthüllung als gewollter Moment.
- **Asterix-Prinzip:** vier Lesarten zugleich (Slapstick, Rollenmaske, Anspielung, freiwilliger Quellenweg). Kein Pflichtwissen.
- **Kubrick-Gag:** „If Kubrick had staged the Moon landing, it would've looked better.“ Der Pappmond enthüllt die Inszenierung, die Closure bleibt beim Spieler. Ausdrücklich ein Vorschlag, keine Pool-Zeile.

### Entschieden (Georg) vs. Vorschlag
- **Georgs kreative Richtung (15.10., ohne V-Nummer):** rollenbewusste Residents, Kayfabe-Agency; R1.3-Korrektur (Lebensfreude statt Abhängigkeit); Recht auf Klage; Closure beim Spieler; R1.8 (keine Etiketten, QR-Quellenweg); Asterix-Mehrschichtigkeit; Metatheater/Pop-up als Idee.
- **Vorschlag:** alle Szenenbeispiele, Dialogzeilen (Kubrick u. a.), Pop-up-Raster, Bühnen-Grammatik (6 Rollen), Tests A/B/C.
- Register: **V-327** (16.10., „Unlesbares bleibt unlesbar“, metanarrativ: nicht alles löst sich auf) passt genau zu R1.8 und zur Closure-Idee. Der Anker Lord Hunky / Lady Dory / Fluff Incident steht in V-294/V-295 und META_NARRATIVE_R1.

### Konflikte mit dem WS0-Register
1. **Dialogweg:** Die Szenenbeispiele enthalten freie Prosa-Zeilen (Kubrick-Satz, Resident-Monologe). Nach ARCHITECTURE_R1 §3 und der ChatterBox-Triplet-Regel läuft jeder Dialog über Pool, Import-Skript, Hub-Urteil und ACCEPTED, und zwar als Triplet. Die Zeilen sind also nur Vorbild, kein Text.
2. **Wissensgrenze:** META_NARRATIVE_R1 (REC §2.2) sagt: Genesis-Kontext ist „not permission to make every Resident exposition-aware“. Der Global Intent §3.5 hält das ein (Maske kennen ≠ Academy kennen). Passt, beim Briefen aber beide zusammen nennen.
3. **Etiketten:** R1.6 (Belegleiter als Darstellungsidee) ist durch R1.8 überholt; im Dokument steht beides. Beim Zitieren nur R1.8 verwenden.
4. **QR-Index:** R1.8 stützt sich auf einen QR-Index, dessen kanonischer Ort **nicht verifiziert** ist. WS0 muss ihn finden, nichts erfinden.
5. **Herkunft:** Die Dateien heißen `WS0_*`, sind aber vom Web-Chat geschrieben (siehe §0).
6. **Pop-up im Lichtpilot:** Das Intake will Pop-up in denselben Pilot wie das Licht (Thema 1). Das Risiko ist Scope-Drift im aktiven MVP (V-312).

### Was WS0 als Nächstes tun sollte
1. Kurzfassung „Global Intent R1 (Stand R1.8)“ auf einer Seite in `META_NARRATIVE_R1.md` als §„Figurenhaltung“ aufnehmen, damit Fluff-Genesis und rollenbewusste Residents an einem Ort stehen. Klar markieren, was Georg sagte und was Vorschlag ist.
2. Georg **eine** V-Nummer vorschlagen: „Rollenbewusste Residents + Closure beim Spieler + keine Wahrheits-Etiketten (R1.3/R1.4/R1.5/R1.8)“, als Leitlinie für Triplets und ChatterBox.
3. QR-Index-Quelle suchen und pinnen (Card-Registry, Brain-Food-Links), bevor jemand darauf baut.
4. Pop-up/Metatheater: nicht in den Licht-Pass mischen. Höchstens ein späterer Bühnen-Test mit einer echten Kulisse nach MVP-0.
5. Zum Herkunfts-Problem siehe §7.

---

## 5 · Opener-Recherche (Suno-Triplet-Songs)

### Fundort
`research/kfb-triplet-opener-diversity-r1-2026-10-15@0362e46e7:skills/chat/workflows/KFB_TRIPLET_OPENER_RESEARCH_R1_2026-10-15/`:
- Auftrag: `DEEP_DIVE_WEBCHAT_BRIEF.md`, `PASTE_FOR_NEW_WEBCHAT.md`
- Kandidaten: `SEED_FRAMES_UNAPPROVED.json` (74), `RAW_CANDIDATES_R3.json` (134), `OPENERS_R3_CANDIDATES.json` (64 kuratiert)
- Auswertung: `RESEARCH_NOTES_R3.md`, `COMPARATIVE_REPORT_R3.md`, `TEST_RUN_R3.json`, `TEST_REPRODUCTION_R3.md`
- Prüfskript-Vorschlag: `R3_CHECKER_PROPOSAL.py`, `CHECKER_R3_CHANGE_PROPOSAL.md`
- Abschluss: `RETURN.md`, `CHANGELOG_R3.md`

Basis-Branch `editorial/kfb-triplets-eight-decks-r2-2026-10-15@31639721a`. Kein PR. Recherche-Stand 15.10. 20:36, also **vor** V-325 (16.10.).

### Zusammenfassung
- Befund: Die 27 freigegebenen Opener (`triplet_set_check.py`) wechseln meist nur das Wort („You know“, „Do you know“, „Did you hear of“), nicht die Situation.
- R3-Idee: Der Sprecher **findet, hört, sieht, liest, erinnert falsch, bekommt** die Zeile. Dadurch ändert sich seine Beziehung zur Karte, ohne einen Extra-Gag.
- 20 Erzähl-Familien, darunter READ_TEXT, FILM_SCREEN, ART_ENCOUNTER, MEETING_DIALOGUE, RUMOR_OVERHEARD, PERSONAL_WRITING, FOUND_EPHEMERA, MEMORY_DREAM, STAGE_AUDIENCE, OBJECT_LABEL, ORAL_HISTORY, LETTER_POST, WALL_GRAFFITI und CASE_FILE.
- **18er-Shortlist** für Georg, darunter genau seine Beispiele: „I read a book about“, „A friend told me about“, „I found a note saying:“, „My diary says:“, „I heard a rumor about“, „I saw a film about“, „I saw a painting of“, „I dreamed about“, „Backstage someone muttered:“, „An unsigned letter said:“, „On the back of a napkin:“, „My aunt used to say:“ …
- **„A politician once said/claimed“** ist absichtlich **nicht** auf der Shortlist (HOLD), weil er wie ein Beleg für Satire-Behauptungen klingen kann. Ebenso „An official statement read“ und „I watched a documentary on“.
- Klassen-Regel: Der Opener muss zur Kartenart passen (PERSON, PLACE, OBJECT, EVENT, INSTITUTION, SYSTEM). Beispiel: „I saw a painting of“ geht nicht mit Institutionen. Belegt sind 24 passende und 24 bewusst abgelehnte Kombinationen an echten Karten.
- Budget: R3-Opener kosten +123 bis +140 Zeichen je Track; bei 60 Karten bleiben 486 Zeichen unter 5000 (V-277).
- Quellen: Implikatur (SEP), Story-Preface (Konversationsanalyse), Folklore/Oral History (LOC, Smithsonian), Comic-Closure, Cut-up (nur als Rhythmus-Idee, nie Karten umstellen).
- Nicht gelaufen: Original-Python-Prüfskript auf den acht Decks, R3-Skript, Hörprobe, Georg-Urteil (alles 0).

### Entschieden (Georg) vs. Vorschlag
- **Georg, im Register:**
  - V-325 (16.10.): Batch 8 v2 + Batch 9 gestoppt; anekdotische Opener recherchieren; Opener **dramaturgisch im Bogen je Track**, nicht nach Verteilregel; „Hilfe, ich bin ein Mensch!“ bewusst ohne deutschen Titel. Ersetzt V-280, dessen Familienabstand als Mindestabstand bleibt.
  - Weiter gelten V-266/V-275/V-276/V-277: Opener nie verdichtet, je Track einmalig, Intro und „Stay Fluffy!“, < 5000 Zeichen.
  - V-222: Orts-Szenen als Bühnenfiktion je Figurenprofil. V-229: 19 Kandidaten angenommen.
- **Vorschlag:** alle 64 R3-Kandidaten, die 18er-Shortlist, die Klassen-Regel, die Prüfskript-Änderung.

### Konflikte mit dem WS0-Register
1. **Kernkonflikt mit V-325:** Der R3-Scheduler setzt Opener fest auf jede dritte Zeile (`index % 3 === 1`) und wählt nach Punktwert (neue Familie +1000, Shortlist +100, Doppelpunkt +10, minus Länge). Das ist **genau die mechanische Verteilung, die V-325 verwirft**. Ein Dramaturgie-Modell (Bogen je Track) fehlt in der Recherche ganz.
2. **Politiker-Opener:** Georg nennt „a politician once said“ ausdrücklich. Die Recherche parkt ihn als Hochrisiko. Georg entscheidet; mit R1.8 (keine Etiketten, freie Closure) wäre er als erkennbar fiktive Figurenstimme vertretbar.
3. **Prüfskript:** Der R3-Vorschlag ergänzt einen Familienabstand 10 je Erzähl-Familie. Das passt zu V-280 als Mindestabstand, darf aber keine Verteilregel werden.
4. **Ungenutzter Bestand:** `OPENER_RESEARCH_INVENTORY_R1.md` (WS0, 14.10.) nennt 43 Operatoren und **8 Beat-Grammatiken (BG-1 bis BG-8)** aus dem Perplexity-Doc. Das wäre die Grundlage für einen Bogen; R3 nutzt sie nicht.
5. **V-280-Idee „Case-Fabulation“** (Karten eines Tracks zu einer Geschichte verknüpfen) ist der natürliche Rahmen für den Bogen; R3 kennt sie nicht.

### Was WS0 als Nächstes tun sollte
1. **Opener-Dramaturgie-Modell R1** schreiben (V-325-Auftrag), z. B.:
   - Bogen je Track in Akten: Auftakt mit Fund (Notiz/Brief) → Gerüchte und Freunde → Persönliches (Tagebuch/Traum) → Wende (Akte, Zwischenruf aus der letzten Reihe) → Auflösung.
   - Opener dünn gesetzt, an Wendepunkten, nach Kartenart und Inhalt gewählt, nicht nach Zeilennummer.
   - Beat-Grammatiken BG-1–8 und V-280 „Case-Fabulation“ einbauen.
2. **Probe-Track** Epistemic Sabotage (Georgs Negativbeispiel): Bogen-Fassung gegen die alte Fassung, Hörvergleich im Hub.
3. Georg die **18er-Shortlist** als Klick-Liste (PASS/TUNE/FAIL) geben, plus eine Frage zum Politiker-Opener.
4. Prüfskript erst danach ändern: Opener-Zulassung nur aus Georg-PASS-IDs, Klassen-Prüfung, Mindestabstand. Keine Positionsregel.
5. R3-Scheduler (`TEST_REPRODUCTION_R3.md`) ausdrücklich **nicht** übernehmen.

---

## 6 · Neue Mund-Sätze + Plugin-Idee (Tönung je Figur/Farbe)

### Fundort
- `main@ea603d31d:media/3D_Assets/Textures/FrizzleBob-Mouths_PNGs/` (Upload 16.10. 02:16; frühere Uploads `3c41b2d6c` und `e082405ee` am 15.10.).
- Plugin-Vorprüfung (Web-Chat): `docs/kfb-decisions-register-2026-10-11@1dde8925e:…/replies/KFB_MOUTH_SHEET_PLUGIN_PREFLIGHT_R1_2026-10-15.md` (lokal identisch).
- Bezug: `replies/MOUTH_SHEET_SPEC_R1.md`, `replies/MOUTHS_GPT_R2/` (A/B/C geschnitten).

### Inventur (selbst gesichtet)

| Bogen auf main | seit | Pixel | Hintergrund | Formen | Stil | Status |
|---|---|---|---|---|---|---|
| `Clay-Mundformen als Animations-Sprite-Sheet.png` | 15.10. | 1448×1086 | Alpha | 12 (4×3) | runde Hautton-Lippen, kleine Zähne | = **A** in GPT-R2, geschnitten |
| `Claymation-Mundformen im 4×3-Raster.png` | 15.10. | 1448×1086 | Alpha | 12 (4×3) | Hautton, Zahnlücke, expressiv (Grimasse, Zunge) | = **B** in GPT-R2, geschnitten |
| `Claymation-Mund-Sprite-Sammlung.png` | 15.10. | 1448×1086 | Alpha | 12 (4×3) | dünne braune Wurst-Lippen | = **C** in GPT-R2, geschnitten (TUNE) |
| `Lila Monster-Mundausdrücke als Animationsvorlage.png` | **16.10.** | 1448×1086 | **weiß, kein Alpha** | 12 (4×3) | violette Monster-Lippen, Reißzähne, Zunge | neu |
| `NEUTRAL_Claymation-Mund-Sprite-Sheet in 4×4 Raster.png` | **16.10.** | 1254×1254 | Alpha | **16 (4×4)** | **lippenlos**: nur Zähne, Mundhöhle, dunkelbrauner Rand | neu |
| `YELLOW_Clay-Mundvisemen für Lippen-Synchronisation.png` | **16.10.** | 1448×1086 | **weiß, kein Alpha** | **20 (5×4), mit Beschriftung** | gelbe Clay-Lippen, Blockzähne | neu |

- **NEUTRAL** folgt nach Sicht der Reihenfolge von V-255:
  - Reihe 1: rest, mbp, small_open, mid_open;
  - Reihe 2: ah, ee, oh, oo;
  - Reihe 3: fv, l_th, smile_closed, smile_open;
  - Reihe 4: sad, surprised, grumpy, signature (Grinsen mit seitlicher Zunge).
  - Das ist der **erste echte V-255-Bogen**. Lippenlos heißt: Die Lippenfarbe kann je Figur entstehen. Er ist der beste Kandidat für Tönung.
- **YELLOW**: Viseme beschriftet: REST, SMILE, A, E, O, U, CLENCH, F/V, M/B/P, TH, L, D, S/Z, CH/J, R, SAD, SURPRISED, TONGUE, SMIRK, ANGRY.
  - Er deckt alle V-255-Formen bis auf `smile_closed` ab (small/mid open ≈ D bzw. S/Z) und hat 5 Extras (CLENCH, CH/J, R, D, TONGUE).
  - Er verletzt V-255 in drei Punkten: Text im Bogen, Zunge raus, kein grüner Hintergrund.
  - Er entspricht fast genau dem Piloten der Vorprüfung („gelbe Lippen + Blockzähne“).
- **Lila Monster**: 4×3 wie A/B/C, aber ohne Alpha. Der vorhandene `cut_align.py` (R2) zählt Alpha-Komponenten und erwartet 12; Weiß-Freistellung muss dazu.
- **Alte Decal-Sätze** zum Vergleich:
  - `FrizzelBob-Mouth_01` mit 13 PNG (Smile, Neutral, M, D, S, Ee, Uh, Ah, Oh, R, F, W-oo, L);
  - `FrizzleBob-FemaleMouth_01` mit 13 (gleiche Formen);
  - `FrizzleBob-RedMouth_01` mit 12 (ohne Smile, „Aa“ statt Ah);
  - je 274×169 px mit Alpha, Phonem-Satz ohne Emotionen.
- GPT-R2 A/B/C: je 12 PNGs 512×512, Anker (256, 220), upperLift 0,35, Kontaktschatten und noshadow-Fassung, `anchors.json`, Review-Bilder und 12-fps-Clips.

### Zusammenfassung der Plugin-Vorprüfung (Web-Chat)
- „KFB Mouth Sheet Maker“ wäre später ein **privates ChatGPT-Plugin**, nur als Bild-Erzeuger vorne dran. Es ist kein zweiter Mund-Runtime; Schnitt und Einbau laufen über den vorhandenen Cutter und die ToolBox.
- Rezept-Parameter: `lipStyle`, Farben für Lippe, Zahnfleisch, Mundhöhle, Zunge und Zähne, Zahnart, Persönlichkeit (nur für `signature`), Clay-Material, `rigFit` (upperLift 0,35).
- Ausgabe: 4×4-Bogen, 16 PNG 512×512 RGBA, `anchors.json`, Prüfsummen, Review-Bilder und Clip.
- Echte Lücke: Der R2-Cutter kann **kein festes 4×4-Zellraster und keinen Chroma-Hintergrund**. Nächstes Tor ist `MOUTH_SHEET_V255_4X4_PROCESSOR_ADAPTER`.
- Rhubarb (6+3) und Meta OVR (15 Viseme) dienen nur als Mapping-Vergleich, nicht als neue Matrix.

### Entschieden (Georg) vs. Vorschlag
- **Georg, im Register:**
  - V-255: 4×4-Vorgabe, Plugin später;
  - V-259: upperLift 0,35;
  - V-299: Lord Hunky = B, Lady Dory = A;
  - **V-326** (16.10., TBD): neue Sätze und Plugin-Idee für Tönung je Figur bzw. Farbe; Einbau „bis auf die Farbe schon sehr gut“;
  - **V-328** (16.10., RULE): alle sechs Bögen ins **Mund-Dropdown der ToolBox** für alle Figuren, Auswahl per Manifest, Tönung für tintable-Sätze; WS0 schneidet (cut_align, GPT-R2-Format), WSA baut das Dropdown (Briefing b34 Punkt 6).
- **Vorschlag:** Plugin-Parameter, 4×4-Adapter, Pilot-Rezept.

### Konflikte mit dem WS0-Register
1. YELLOW verletzt V-255 (Text, Zunge, kein Grün). Mit V-328 trotzdem in den Dropdown: Text beim Schnitt entfernen, TONGUE als Extra-Form führen und **nicht** in den 16 Standard-Slots.
2. Lila hat Zunge/Lippenbiss-artige Formen und ist 4×3 mit 12 statt 16 Formen, also nicht V-255-konform. Unter V-328 trotzdem erlaubt („alle sechs Bögen“).
3. V-249 sagt, Basis sind die drei Decal-Sätze, neue Stile nur bei Bedarf. V-328 erweitert das. Kein Konflikt, aber V-249 sollte auf V-328 verweisen.
4. Die Vorprüfung nennt die WSA-ToolBox als Mund-Owner; V-328 teilt Schnitt und Manifest WS0 zu, den Dropdown WSA. Passt.

### Was WS0 als Nächstes tun sollte
1. **Schnitt der drei neuen Bögen** nach V-328, Format wie GPT-R2:
   - (a) Lila: Weiß freistellen + Defringe, dann R2-Pfad (12);
   - (b) NEUTRAL: **4×4-Zell-Adapter** (genau das Tor aus der Vorprüfung), 16 V-255-Namen;
   - (c) YELLOW: Zellen 5×4, Beschriftung abschneiden, 20 Formen mit Zuordnungstabelle auf die V-255-Namen plus Extras.
2. **Manifest** `kfb.mouth-set/1` je Satz, als Datei für den Dropdown:
   - Kopf: id, Name, Quelle (Commit/Blob), Formen → Datei, Anker, upperLift;
   - Tönung: `tintable` mit Masken (Lippe, Zähne, Zunge, Mundhöhle).
3. **Tönung (Plugin-Kern):**
   - Beim Schnitt je PNG eine Lippenmaske per Farbcluster erzeugen, damit die ToolBox nur die Lippe umfärbt (HSL-Drehung bzw. Multiply); Zähne und Mundhöhle bleiben.
   - NEUTRAL bekommt nur den Rand getönt.
   - A/B/C/Lila/YELLOW: Lippen-Hue drehen, L und C aus der Figurpalette (V-305-Akzent bzw. Hautton).
4. Review wie GPT-R2 (große Einzelbilder, Talk-Clip 12 fps) und selbst prüfen; erst dann Hub-Karte für Georg.
5. Briefing b34 Punkt 6 (WSA) mit dem Manifest-Pfad ergänzen. Das ChatGPT-Plugin bleibt V-326 TBD, bis Tönung und 4×4-Pfad laufen.

---

## 7 · Nicht gefunden / offen

- **Kein eigener Branch „Meta-Philosophie“:** Der Strang liegt im WS0-Register-Branch (Thema 4).
- **Dramaturgisches Opener-Bogen-Modell** (V-325): nirgends vorhanden; die Recherche endet vor V-325.
- **Eigene YouTube-Licht-Recherche** über das KayKit-Godot-Tutorial hinaus: nicht gefunden.
- **Licht-Nachtwerte für die WS1-Szene:** nur die Travel-Presets (Quelle), keine kalibrierte Messung.
- **Tönungs-Plugin als Code oder Konzept:** nur Parameter in der Vorprüfung und V-326/V-328; kein eigenes Tönungs-Konzept.
- **QR-Index** (Thema 4, R1.8): Ort nicht verifiziert.
- **Neue Web-Chat-Ablagen in KFB_HUB-Inbox-Ordnern seit 14.10.:** keine.

### Prozess-Vorschlag zur Herkunft
Web-Chat-Dateien, die direkt im Register-Branch landen, kennzeichnen. Möglichkeiten:
- im Dateikopf „Autor: Web-Chat“ ergänzen, oder
- künftig als `WSA_*` ablegen lassen und von WS0 übernehmen.

`CHANGELOG.md` bleibt additiv; die Web-Chat-Einträge (15.10., R1.3–R1.7, Mouth-Preflight) nicht umschreiben. Stattdessen einen WS0-Eintrag ergänzen: „Herkunft Web-Chat, von WS0 gesichtet am 16.10., keine V-Nummer“.
