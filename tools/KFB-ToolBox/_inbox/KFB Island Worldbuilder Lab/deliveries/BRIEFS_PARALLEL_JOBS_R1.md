# Parallele Aufträge R1 · für Claude Design, Cowork, ChatGPT bzw. Claude Chat und Recherche

Stand: 2026-10-10 · von der Steuer-Sitzung · Zweck: MVP-1 vorbereiten, ohne das Claude-Code-Kontingent zu belasten. Jeder Abschnitt ist ein eigener Auftrag zum Hineinkopieren. Ergebnisse lädt Georg auf GitHub hoch nach `tools/KFB-ToolBox/_inbox/MVP1_RETURNS/<Auftrag>_<werkzeug>/` (z. B. `A_claude-design/`); Dateiname `<datum>_<werkzeug>_<thema>`. Die Steuerung holt sie dort ab und gleicht sie mit dem Plan ab. Pakete mit allen nötigen Unterlagen (für Werkzeuge ohne Dropbox- bzw. GitHub-Zugriff): `KFB_HUB/30_PACKAGES/2026-10-10_mvp1-parallel/`.

**Für alle gilt:** §00 Weltlogik zuerst · §01 keine harten Schnitte · Maßstab K2 (H = Figurhöhe, MC = 6,4 Lab-Einheiten = ein Stockwerk, keine Meter) · keine realen Personen bzw. Firmen und keine Verschwörungs-Decks in der Spielwelt · nichts davon ist schon Kanon, alles ist Vorschlag bis zur Abnahme.

| # | Werkzeug | Auftrag | Wofür im MVP | Priorität |
| --- | --- | --- | --- | --- |
| A | Claude Design | Town-Lageplan + 3 Kamera-Skizzen | Stufe 2 | hoch |
| B | ChatGPT (mit GitHub) oder Claude Chat | Lorekeeper-Auftrag + Bewohner-Zeilen aus Kanon-Decks | Stufe 4a | hoch |
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
>
> **Regeln:** Maßstab K2 (Tür ≥ 1,15 Figurhöhen, keine Meter). Keine harten Kanten, alles knetig gerundet. Die Burg ist ein vorhandenes Asset und wird nur als Umriss eingezeichnet. Markiere alles als „Konzept“.

**Ablage:** GitHub `tools/KFB-ToolBox/_inbox/MVP1_RETURNS/A_claude-design/` · **Paket:** `A_claude-design_town-lageplan.zip`

---

## B · ChatGPT (mit GitHub-Zugriff) oder Claude Chat: Lorekeeper-Auftrag + Bewohner-Zeilen (Stufe 4a)

**Quellen (GitHub `georg-doc/kayfabizarro`, main):** `media/kfb/index.json` (Deck-Index), die Karten-JSONs von `embrace_protopia` und `frizzlebob_s_mission_control`, `skills/chat/workflows/KFB_PLAYABLE_MVP_CONSOLIDATION_V1_2026-09-21/GOLDEN_JOURNEY_MVP_2026-10-04.md` und `DECK_WORLD_SEED_CARD_PIPELINE_2026-10-04.md`. Ohne GitHub-Zugriff die Dateien hochladen.

> Schreibe die Dialogzeilen für die erste spielbare Runde von Kayfabizarro (MVP-1). Ablauf: Spieler startet in KFB Town, läuft über den Markt, fährt eine Runde auf der Ringstraße, fährt über die Brücke nach Protopia zum **Lorekeeper** (Mentor, Eremiten-Hügel mit Schreibpult), bekommt einen **Auftrag** und kehrt nach Town zurück.
>
> **Liefere als JSON**, je Zeile: `speaker`, `situation`, `de`, `en`, `source` (`deckId + cardNumber` bzw. Regelquelle; „frei“, wenn ohne Quelle):
> 1. **Lorekeeper:** Begrüßung (2 Varianten: erster Besuch, Wiederkehr); der Auftrag; Abschied. Der Auftrag soll eine echte Karte aus `embrace_protopia` als Kurier-Sache nach Town bringen lassen (Karte bleibt im Almanac, wird nur überbracht). Begründe die Wahl der Karte in einem Satz.
> 2. **Clown** (Markt, jongliert, flache Witze): 5 Zeilen.
> 3. **Dark Knight** (Wache vor der Burg): 3 Zeilen. **Farmersfrau** (Gemüsestand): 3. **King Kayfabian**: 2. **Caveman** (Mine): 2.
> 4. **Rückkehr nach Town:** eine Zeile der Person, die die Karte empfängt (schlage vor, wer passt).
>
> **Regeln:**
> - Jede Zeile 1–2 Sätze, Chill & Fun, Monkey-Island-Ton, satirisch, aber nicht verletzend.
> - Keine realen Personen bzw. Firmen, keine Inhalte aus Verschwörungs-Decks.
> - Kartennamen und Lore nur so, wie sie in den JSONs stehen; nichts erfinden, was als Karte ausgegeben wird.
> - KayfaBINGO, KayfaBONGO und KayfaBOGGLE nur in ihrer echten Bedeutung (Anerkennung, Erzählung statt Mechanik, eine klärende Frage).

**Ablage:** GitHub `tools/KFB-ToolBox/_inbox/MVP1_RETURNS/B_chat/` · **Paket:** `B_chat_mvp1-dialog.zip` (für Chats ohne GitHub-Zugriff)

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

Liefere Draufsicht, Weltlogik je Ort, 3 Kameras (Brückenkopf, Weg, Hügel-Ankunft) und Anker-Liste (Brücke, Tunnel bzw. Einschnitt, Hügel, Felder). Erst starten, wenn A zurück ist, damit beide Blätter dieselbe Sprache sprechen. **Ablage:** GitHub `tools/KFB-ToolBox/_inbox/MVP1_RETURNS/E_claude-design/` · **Paket:** `E_claude-design_protopia.zip` (dazu das Ergebnis von A hochladen)
