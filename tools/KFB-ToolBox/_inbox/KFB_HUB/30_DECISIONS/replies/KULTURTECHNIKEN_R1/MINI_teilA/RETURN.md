# KFB-Kulturtechniken R1 · Teil A · RETURN (WSB, Mac mini, 15.11.2026, V-1788)

**Auftrag:** `30_DECISIONS/replies/KULTURTECHNIKEN_R1/BRIEF_WSB_KULTURTECHNIKEN_R1.md`.
- Teil A: Bestand je Technik zuordnen, Lücken auflisten, Kandidaten nur für Lücken. Am Bestand ist nichts geändert.
- Grundlage: `assets/private` @cd4983b2 und Stamm @69830312c.

## Kurz
1. **Bestand:** Lesen, Debatten und Brickfish-Werfen sind weitgehend abgedeckt. Beim Tanz liegen 24 abgenommene Clips vor, der Idle-Tanz im Spiel nutzt davon nur 4. Der größte Gewinn ohne neuen Clip: die übrigen 20 messen (beatsPerLoop, downbeatS, Schleife) und freischalten.
2. **Echte Lücken:**
   - Paartanz.
   - Tanzstile Robot, Disco/Funk und Charleston; Linientänze.
   - Überreichen und Annehmen (Geschenke, Handeln).
   - Fangen.
   - Rühren am Kessel.
   - Buch auf- und zuklappen.
   - Übergangs-Clips Idle ↔ Tanz.
   - Requisiten Kessel, Flasche, geschlossenes Buch, Comic-Heft.
3. **39 Kandidaten** auf der Bühne gerendert, je Kandidat ein eigener Clip (`.webp`, animiert) und ein großes Bild mit 6 Momenten (`.jpg`). Links FB, rechts ein NPC (Lord Hunky), beide mit KFB-Augen. Quellen sind nur Georgs vorhandene Mixamo-Downloads und Quaternius UAL 1/2 (lokal); nichts neu geladen, kein Login.
   - **35 lesbar** in `vorschau/`.
   - **4 nicht lesbar** in `vorschau/nicht_lesbar/`: Rumpfbeuge zum Boden, auf KFB-Proportionen landet der Kopf am Boden.
4. **Login-Folie** (`login_folie/LOGIN_FOLIE_teilA.jpg`):
   - 32 Mixamo-Kandidaten mit exaktem Namen, Link und Vorschaukachel aus der öffentlichen Mixamo-Suche (ohne Login gelesen).
   - Dazu Kevin Iglesias „Human Dance Animations FREE“ und CMU (Charleston).
   - Georg lädt die gewählte Kurzliste selbst nach `in_mixamo/`.
5. **Kontaktbogen** für WS0: `blaetter/KONTAKTBOGEN_teilA.jpg`.

## Bestand und Lücken je Technik
Volle Liste mit Pfaden: `data/bestand_r1.json`.

| Technik | Bestand (Auszug) | Lücke (Beat · Rig) |
|---|---|---|
| Tanz | ML Tanz 24 Clips M+L; dieselben 24 auf FB (IDLE_R1); Idle-Tanz 4 Clips; Disco K12 mit Bodenausgleich je Figur; Band-Clips | 20 Tänze im Spiel ungenutzt (Bestand) · Robot, Disco/Funk, Charleston, YMCA/Macarena/Can Can, Salsa/Rumba (alle Rigs) · Paartanz (fehlt überall) · Übergänge Idle ↔ Tanz, Gehen → Tanz (fehlen; nur Blend-Daten) · KayKit Medium nach V-1752: keine Tänze |
| Lesen | K11 Sitzen + Holding_C; Umblättern `kfb_npc_read_page_turn_a`; Buch offen; Lachen als Comic-Reaktion | Lesen im Stehen/Gehen · Auf-/Zuklappen, Weglegen (fehlt überall, auch Mixamo) · Vorlesen · Requisiten Comic, geschlossenes Buch |
| Fluff | pick_fruit; Werkzeug-Clips K11 (Dig, Pickaxing, Working, Hammering, Chopping, Holding); PickUp/Interact/Use_Item; Zählen; Zaubergesten; Fluff-Kugel | Ernten in den Korb · Übergabe beim Handeln · Rühren, Einfüllen, Trinken · Requisiten Kessel, Flasche |
| Brickfish | Figur r4, Wurf-Requisit M/L, 8 Wurf-Clips mit Abwurf-Marken, Duell-Clips | Fangen · Unterhand-Zuwurf zum Partner |
| Geschenke | Present_Base / UnwrappedBase; Interact, PickUp, Holding_A–C, Cheering, happy, rejected | Überreichen/Annehmen (fehlt überall) · Auspacken · Dank/Verbeugung |
| Debatten | Gesprächsbibliothek 13 (M+L); Gesten 17; Rufe; haltung.js / kfb-choreo | Zuhörer-Varianten im Wechsel · Sitz-Debatte · Flüstern, Enttäuschung, Zustimmen |

**Requisiten-Kandidaten:** Quaternius Fantasy Props MegaKit, lokal unter `…/3D ASSETS/Fantasy Props MegaKit[Standard]/`.
- Kessel `Cauldron`.
- Flaschen `Potion_1/2/4`, `Bottle_1`.
- Bücher `Book_5`, `Book_7`, `Book_Simplified_Single`.
- Comic-Heft: kein Kandidat gefunden.
- Nur gemeldet, nichts modelliert.

## Kandidaten auf der Bühne
Höchstens 8 je Technik. Dateiname = Kandidat. Je Kandidat gibt es den animierten Clip `<name>.webp` und das große Bild `<name>.jpg`. Daten je Kandidat (Quelle, Datei, Dauer, Hüftweg, Hinweis): `data/kandidaten_r1.json`.

| Technik | lesbar | nicht lesbar |
|---|---|---|
| Tanz | t1 Gangnam Style · t2 House Dancing (Variante c) · t3 Breakdance Uprock · t4 Brooklyn Uprock (geht kurz zu Boden) · t5 Breakdance 1990 · t7 Freeze Var 1 · t8 UAL1 Dance_Loop | t6 Footwork 1 |
| Lesen | l1 Texting and Walking · l2 Walking while Texting · l3 Writing · l4 Cards (alle ohne Requisit; lesen sich erst mit Buch/Heft an KFB_Grip als Lesen) | – |
| Fluff | f3 Pick Fruit b · f5 UAL2 Consume (trinken) · f6 Casting Spell · f7 Shaking Dice (Schütteln) · f8 UAL1 Fixing_Kneeling | f1 UAL2 Farm_Harvest · f2 Pull Plant · f4 Dig and Plant Seeds |
| Brickfish | b1 UAL2 OverhandThrow · b2 Throwing Dice (Unterhand) · b3 Swatting Bugs (Abwehr statt Fangen) | – |
| Geschenke | g1 UAL2 Chest_Open (Auspacken) · g2 UAL1 PickUp_Table · g3 UAL1 Interact · g4 Walking with Shopping Bag · g5 Holding Idle · g6 Box Idle · g7 Happy Hand Gesture · g8 Acknowledging | – |
| Debatten | d1/d2 Standing Arguing · d3 Sitting Talking · d4 Having a Meeting · d5 Talking at Watercooler (beide sitzen ohne Stuhl) · d6 Sarcastic Head Nod · d7 Annoyed Head Shake · d8 Being Cocky | – |

**Bühne:**
- Ton, Licht und Boden wie die bisherigen Gegenproben (view5).
- Figuren: FB = `FB_WEB_KANON.r1d.glb` (Augen-Rig, beide Ohren, Schwanz), NPC = `LORD_HUNKY_WEB_KANON.r2.glb`.
- Kamera 30° vorn-seitlich in fester Höhe und festem Abstand; sie folgt der Hüfte nur waagerecht, der 1-m-Kreis markiert den Start.

**Übertrag (nur Vorschau, keine Reparatur nach V-1752):**
- Je Knochen die Welt-Drehung aus der Quelle.
- Mixamo: gegen die KayKit-T-Ruhe. Die Downloads ohne Skin haben keine eigene Ruhehaltung, deshalb gilt als Bezug die Ruhe aus `Standing Arguing.fbx` (Medium) bzw. `Gangnam Style.fbx` (Large). Die Hüftbewegung steckt in diesen Dateien im Armatur-Objekt und ist mitgenommen.
- UAL: gegen den T-Moment aus `A_TPose`.
- Hüftweg im Verhältnis der Hüfthöhen.
- Ein fester Bodenwert je Clip (Füße, Zehen, Hände, Knie über den ganzen Clip), Werte in `data/vorschau_log.json`, meist −3 bis +4 cm, bei Bodenfiguren bis 13 cm. In Teil B gilt stattdessen der Bodenausgleich je Bild wie K12.

## Nur mit Login oder eigenem Download
`login_folie/LOGIN_FOLIE_teilA.jpg`, Liste mit Links in `data/login_kandidaten.json`, Kacheln in `login_folie/mixamo_kacheln/`.

- **Mixamo** (Namen exakt aus der öffentlichen Suche, 15.11.):
  - **Tanz:** Robot Hip Hop Dance, Silly Dancing, Ymca Dance, Macarena Dance, Can Can, Salsa Dancing, Rumba Dancing, Dancing Running Man.
  - **Fluff:** Harvesting, Drinking, Bartending, Pick Up Item, Dropping.
  - **Brickfish:** Receiver Catch, Football Catch, Goalkeeper Catch, Throw Object, Intercepting.
  - **Geschenke:** Thankful, Quick Informal Bow, Quick Formal Bow, Standing Thumbs Up, Excited, Happy, Picking Up, Lifting Object.
  - **Debatten:** Having A Meeting (Female), Telling A Secret, Disappointed, Agreeing, Talking, Pointing Gesture.
- **Lesen:** Mixamo hat nichts (Suchen nach „reading“ und „book“ ohne Treffer).
- **Kevin Iglesias, Human Dance Animations FREE:**
  - Fundorte: itch.io (Download, „name your price“) und Unity Asset Store (Konto).
  - Inhalt: 6 Tanzschritte und 2 Posen, laut Seite auf 120 BPM gebaut.
- **CMU Mocap:**
  - Charleston: Subjekte 93 und 103, über den KIT-Spiegel bestätigt.
  - Salsa als Paar: Subjekte 60/61, nach meinem Wissen, ungeprüft. Die CMU-Seite war bei WSB wegen eines Zertifikatsfehlers nicht erreichbar.
  - Das ist der einzige mögliche Paartanz.

## Für Teil B vorgemerkt
- Der Bodenausgleich wird bei Tanz und Boden-Clips viel zu tun haben (Breakdance).
- Die Sitz-Clips brauchen einen Stuhl, Lesen und Geschenke ein Requisit an `KFB_Grip`.
- Für FB und alle KFB-Figuren (großer Kopf) sind Clips mit tiefer Rumpfbeuge keine gute Wahl; kniende Fassungen lesen sich besser.

## Dateien
- `vorschau/` (35 × .webp + .jpg), `vorschau/nicht_lesbar/` (4 × .webp + .jpg).
- `login_folie/` (Folie, Mixamo-Kacheln, Seitenbild Kevin Iglesias).
- `blaetter/KONTAKTBOGEN_teilA.jpg`.
- `data/`: bestand_r1.json, kandidaten_r1.json, login_kandidaten.json, vorschau_log.json.
- `scripts/`: Übertrag, Rendern, Bogen, Folie, Mixamo-Suche.
- `in_mixamo/` (Ablage für Teil B), `SHA256SUMS.txt`.
