# Parallele Aufträge R1 · für Claude Design, Cowork, ChatGPT bzw. Claude Chat und Recherche

Stand: 2026-10-10 · von der Steuer-Sitzung · Zweck: MVP-1 vorbereiten, ohne das Claude-Code-Kontingent zu belasten. Jeder Abschnitt ist ein eigener Auftrag zum Hineinkopieren. Ergebnisse lädt Georg auf GitHub hoch nach `tools/KFB-ToolBox/_inbox/MVP1_RETURNS/<Auftrag>_<werkzeug>/` (z. B. `A_claude-design/`); Dateiname `<datum>_<werkzeug>_<thema>`. Die Steuerung holt sie dort ab und gleicht sie mit dem Plan ab. Pakete mit allen nötigen Unterlagen (für Werkzeuge ohne Dropbox- bzw. GitHub-Zugriff): `KFB_HUB/30_PACKAGES/2026-10-10_mvp1-parallel/`.

**Weltlogik (Georg 10.10.):** Die Inseln sind aus der zersprengten Erde herausgebrochene Schollen. Die Fragmentierung der Gesellschaft hat den Planeten auseinandergerissen. Form wie Asteroiden bzw. Erdschollen, nicht wie Teller; die Unterseite ist ein Querschnitt durch die Erde (Schichten, Wurzeln, Reste der alten Welt). Town liegt in der Mitte, dystopische bzw. Gefängnis-Inseln eher unten. Jede Insel muss schon an ihrer **Silhouette** erkennbar sein, aus der Ferne vom Racetrack und im Flug.

**Für alle gilt:** §00 Weltlogik zuerst · §01 keine harten Schnitte · Maßstab K2 (H = Figurhöhe, MC = 6,4 Lab-Einheiten = ein Stockwerk, keine Meter) · keine realen Personen bzw. Firmen und keine Verschwörungs-Decks in der Spielwelt · nichts davon ist schon Kanon, alles ist Vorschlag bis zur Abnahme.

| # | Werkzeug | Auftrag | Wofür im MVP | Priorität |
| --- | --- | --- | --- | --- |
| A | Claude Design | Town-Lageplan + 3 Kamera-Skizzen | Stufe 2 | hoch |
| B | ChatGPT (mit GitHub) oder Claude Chat | Triplet-Kandidaten (subject → connector → reframe, EN) für Lorekeeper + Bewohner | Stufe 4a | hoch |
| C | Cowork | Figuren-Karten-Inventur der MVP-Bewohner | Stufe 4a | mittel |
| D | Grok bzw. ChatGPT Web | KayKit-Creator-Recherche, MVP-Fokus | Stufe 2–3a | mittel |
| E | Claude Design | Protopia-Lageplan Eremiten-Hügel | Stufe 3a | später |

---

## A · Claude Design: KFB Town Lageplan + Kamera-Skizzen (Stufe 2)

**Hochladen:** `docs/KFB_MASTERPLAN_MVP_DRIVE_LOOP_R2.md`, `docs/SCALE_CONTRACT_K2.md`, `deliveries/BRIEF_LANDMARK_KFB_TOWN_TURM_R1.md`, ein Bild der R2D-Insel als Look-Referenz.

> Entwirf ein Konzeptblatt (eine HTML-Seite) für die Insel **KFB Town** im Spiel Kayfabizarro (Claymation-Cartoon, schwebende Inseln). Es ist ein Lageplan, kein 3D-Modell.
>
> **Welt:** Town ist die historische Hub-Insel, ca. 40 × 40 MacroCells (1 MC = ein Stockwerk), Plateau-Archetyp: eine Anhöhe, auf der die Stadt gebaut wurde.
> - Oben die Burg des Königs: Big Castle, Mittelturm mit Paladin, Dark Knight am Tor.
> - Eine Ton-Treppe führt vom Marktplatz hinauf.
> - Marktplatz mit jonglierendem Clown und Gemüsestand der Farmersfrau, dazu das königliche Billboard.
> - Am Rand des Plateaus läuft eine Ringstraße als Rennstrecke.
> - Hinten am Berg bzw. Plateau-Rand liegt der Eingang zur Goldmine des Caveman.
> - Eine Brücke führt nach Protopia (Satelliten-Insel).
>
> **Liefere:**
> 1. Draufsicht im MC-Raster mit allen Orten und Wegen.
> 2. Für jeden Ort einen Satz Weltlogik: wer hat es gebaut, warum liegt es hier.
> 3. Drei Kamera-Skizzen: Ankunft über die Brücke, Augenhöhe auf dem Markt Richtung Burg, Verfolgerkamera auf der Ringstraße.
> 4. Eine Anker-Liste: Treppe, Burg-Platz, Markt, Mine, Brücken-Anschluss, Ring-Einfahrt; je mit Name und Lage im Raster.
> 5. **Formsprache der Insel** (Georg: keine Einheits-Deckplatte): Silhouette von vorn und von der Seite inkl. Unterseite. Town ist ein Plateau mit unregelmäßiger Kantenhöhe, Burgfels-Abbruch unter der Burg und Terrassen zur Stadtseite. Nutze die Form-Modifikatoren aus `SPEC_WORLDBUILDER_GODMODE_VISION_R1.md` §2b und begründe jede Form mit einem Satz Weltlogik.
>
> **Regeln:** Maßstab K2 (Tür ≥ 1,15 Figurhöhen, keine Meter). Keine harten Kanten, alles knetig gerundet. Die Burg ist ein vorhandenes Asset und wird nur als Umriss eingezeichnet. Markiere alles als „Konzept“.

**Ablage:** GitHub `tools/KFB-ToolBox/_inbox/MVP1_RETURNS/A_claude-design/` · **Paket:** `A_claude-design_town-lageplan.zip`

---

## B · ChatGPT (mit GitHub-Zugriff) oder Claude Chat: Triplet-Kandidaten für die MVP-Runde (Stufe 4a) · v2 (korrigiert)

**Korrektur gegenüber v1:** v1 verlangte frei geschriebene Dialogzeilen auf Deutsch und Englisch. Das widerspricht der ChatterBox-Logik. **ChatterBox besitzt den Inhalt** und wählt aus einem **Triplet-Pool**: drei bedeutungsvolle Beats `subject → connector → reframe`, auf **Englisch**, aus kanonischen Quellen. Die Voice Layer spricht nur, was ChatterBox auswählt. Vorlage und Hörprobe: KFB Audio · Voice Acting Bench (Site-Version 6) und PR #379, Branch `planning/kfb-chatterbox-voice-layer-v1-2026-10-08`, `VOICE_LAYER_INTEGRATION_CONTRACT.md`.

**Quellen:** wie v1 (Deck-Index, Karten-JSONs von `embrace_protopia` und `frizzlebob_s_mission_control`, Golden Journey, Deck-Pipeline), dazu der Voice-Layer-Vertrag und vorhandene ChatterBox-Phrasen (`chatter-phrases.js`, laut Vertrag die aktuelle Quelle).

> Erstelle **Triplet-Kandidaten** für die erste spielbare Runde von Kayfabizarro (MVP-1). Ablauf: Start in KFB Town, Markt, Ringstraße, Brücke nach Protopia zum **Lorekeeper** (Mentor, Eremiten-Hügel mit Schreibpult), Auftrag, zurück nach Town.
>
> **Format je Triplet (JSON):**
> `tripletId`, `residentId`, `situation`, `subject`, `connector`, `reframe` (je ein kurzer Beat, Englisch), `affect` (Vorschlag), `sourceRefs` (`deckId + cardNumber` bzw. Phrase-ID), `status: "candidate"`.
>
> 1. **Lorekeeper:** Begrüßung (erster Besuch bzw. Wiederkehr), Auftrag (eine echte Karte aus `embrace_protopia` als Kurier nach Town; die Karte bleibt im Almanac), Abschied: je 1–2 Triplets.
> 2. **Clown** (flache Markt-Witze) 3, **Dark Knight** 2, **Farmersfrau** 2, **King Kayfabian** 1, **Caveman** 1, **Empfänger in Town** 1.
> 3. Wo es passt, die Event-Rufe (Tier B) markieren statt neu zu schreiben: `Kayfa-BINGO!`, `Kayfa-BOGGLE?`, `Kayfa-BONGO!`, `BLÖDSINN!`, `What the FLUFF?!`, `Stay fluffy!`.
>
> **Regeln:**
> - Kein Fließtext-Dialog. Jeder Beat ist kurz, die drei Beats zusammen ergeben eine Pointe bzw. Umdeutung.
> - Inhalt nur aus Kartennamen bzw. Lore der JSONs und vorhandenen Phrasen; nichts als Karte ausgeben, was nicht im JSON steht.
> - Alles ist `candidate`, nicht Kanon; ChatterBox und Georg entscheiden.
> - Keine realen Personen bzw. Firmen, keine Inhalte aus Verschwörungs-Decks.
> - KayfaBINGO, KayfaBONGO und KayfaBOGGLE nur in ihrer echten Bedeutung.
> - Schweigen ist eine gültige Antwort.

**Ablage:** GitHub `tools/KFB-ToolBox/_inbox/MVP1_RETURNS/B_chat/` · **Paket:** `B_chat_mvp1-dialog.zip` (v4). Die Kandidaten kann Georg danach in der Voice Acting Bench anhören.
---

## C · Cowork (lokaler Zugriff auf Dropbox): Figuren-Karten-Inventur (Stufe 4a)

**Hinweis:** Nur lesen und Entwürfe schreiben, nichts verschieben oder löschen.

> Mache eine Inventur für die sichtbaren Bewohner von MVP-1 und lege je Figur einen Entwurf `kfb.character-card/1` an.
>
> **Figuren:** King Kayfabian (Paladin), Dark Knight, Clown, Farmersfrau, Farmer, Caveman, Lorekeeper, FrizzleBob.
>
> **Pflichtlektüre:** `~/Dropbox/CLAUDE/KFB Island Worldbuilder Lab/docs/SPEC_CHARACTER_INTEGRITY_R1.md` (Schema in §2, Prüfungen in §3).
>
> **Suche in** `~/Dropbox/CLAUDE` (nicht in `KFB Open World/`) und in der lokalen GitHub-Kopie `~/KFB_GitHub_sync`:
> - Modell-Dateien je Figur (`.glb`/`.gltf`, KayKit-Pfad);
> - Rig-Familie (Rig_Medium bzw. Rig_Large);
> - Augen-Profile (`eye-rig-medium.batch-1.json`, FrizzleBob-v5-Freigabe `acceptance_1-7_frizzlebob-earrig-v5.json`);
> - alle Kopien von `pet-eye-rig.v6.js` (Pfad, Größe, Änderungsdatum, Prüfsumme);
> - Props mit Hand bzw. Griff, Sitzpunkte, Animations-Clips (Clown: `KFB_Motion_clown_juggle_j5`).
>
> **Liefere:**
> 1. Eine Tabelle je Figur: was gefunden, Pfad, Status (freigegeben, Kandidat, fehlt).
> 2. Je Figur eine Entwurfs-JSON mit `"status": "DRAFT"`.
> 3. Eine Liste der `pet-eye-rig.v6.js`-Kopien mit Empfehlung, welche kanonisch werden sollte (gleiche Prüfsumme gruppieren).
> 4. Lücken: was für die Mindestprüfung in Stufe 4 noch fehlt.

**Ablage:** lokal `~/Dropbox/CLAUDE/KFB_HUB/00_INBOX/cowork/2026-10-xx_cowork_character-cards/` (Cowork auf dem Mac mit Dropbox-Zugriff; ohne lokalen Zugriff ist dieser Auftrag nicht machbar) · kein Paket nötig

---

## D · Grok bzw. ChatGPT Web: KayKit-Creator-Recherche mit MVP-Fokus

**Anschluss an:** GitHub-Branch `research/kaykit-creator-tutorial-atlas-2026-10-10` (vorhandene Auswertung zu Licht bzw. Umgebung). Nichts doppeln, nur ergänzen.

> Recherchiere die öffentlichen Tutorials, Posts und Streams von Kay Lousberg (KayKit) auf YouTube, X, Twitch und itch.io. Ergänzung zur bestehenden Licht-Recherche, Fokus auf das, was ein three.js-Cartoon-Spiel mit KayKit-Assets **jetzt** braucht:
> 1. **Szenen-Komposition:** Dichte, Gruppierung, Höhenstaffelung von Props auf kleinen Inseln bzw. Dioramen.
> 2. **Kamera:** Third-Person-Verfolger bzw. Isometrie, Blickwinkel, Brennweite bei Low-Poly-Szenen.
> 3. **Charaktere:** Einbau der KayKit-Rigs, Animationen, Props in der Hand (Hand-Slots), Sitzen.
> 4. **Farben bzw. Material:** Umgang mit dem Gradient-Atlas, Umfärben, Toon- bzw. Outline-Looks.
> 5. **Fahrzeuge bzw. Straßen,** falls vorhanden.
>
> **Liefere** je Fundstück: Link, Datum, 2–3 Sätze Kern-Aussage, und eine Spalte „für KFB übernehmen: ja / nein / prüfen“ mit Grund. Am Ende maximal 10 konkrete Empfehlungen. Keine Code- bzw. Asset-Kopien, keine Werte blind übernehmen (Godot bzw. Blender ≠ three.js).

**Ablage:** GitHub `tools/KFB-ToolBox/_inbox/MVP1_RETURNS/D_research/` · kein Paket nötig (reine Web-Recherche)

---

## E · Claude Design (später, nach A): Protopia Eremiten-Hügel (Stufe 3a)

Wie A, aber für **Protopia** (Satellit 20–28 MC, Berg-Archetyp):
- Bergweg von der Brücke, Schlucht bzw. Lichtung, Bach;
- oben der Eremiten-Hügel des Lorekeepers mit Schreibpult;
- Farmer-Felder bzw. Obstgarten.

Liefere Draufsicht, Weltlogik je Ort, 3 Kameras (Brückenkopf, Weg, Hügel-Ankunft) und Anker-Liste (Brücke, Tunnel bzw. Einschnitt, Hügel, Felder). Dazu die **Formsprache**: zerklüftete Berg-Insel mit Felsgraten, Abbruch und 1–2 schwebenden Brocken (Spec §2b), Silhouette vorn, Seite und Unterseite, klar anders als Town. Erst starten, wenn A zurück ist, damit beide Blätter dieselbe Sprache sprechen. **Ablage:** GitHub `tools/KFB-ToolBox/_inbox/MVP1_RETURNS/E_claude-design/` · **Paket:** `E_claude-design_protopia.zip` (dazu das Ergebnis von A hochladen)
