# Auftrag ChatGPT-Bild · KFB HUD Lücken R1 (ersetzt AUFTRAG_CHATGPT_BELOHNUNGSKARTEN_R1)

**Warum:** Die blinde Kritik (`KRITIK_BLIND_R1.md`) und die Teilesuche (`TEILE_SUCHE_R1.md`) haben gezeigt, was im Bestand fehlt. Alles andere kommt aus deiner Leit-Serie „Washi-1448“ (versteckte Ebenen in `KFB Paper HUD 05.psd`).

**Regeln für alle Blätter:**
- Gleicher Stil, gleiches Licht, gleiche Kante wie die Leit-Serie.
- Jedes Teil mindestens so groß, wie es im Spiel gezeigt wird; nichts wird später hochskaliert oder gedehnt.
- Freier Hintergrund, kein Text.
- Ein Element nur aus einem Blatt.

**Drei Aufträge in drei getrennten Chats:**
- **A:** UI-Kit, zwei Blätter im selben Chat nacheinander.
- **B:** Gegenstände.
- **C:** Orte.

---

## A · UI-Kit „Washi“ (ein Chat, zwei Blätter nacheinander)

**Hochladen** (Ordner `REFERENZ_WASHI_1448/` neben dieser Datei):
- `washi_bogen_A_slots_reiter_schalter.png`
- `washi_bogen_B_knoepfe_baender.png`
- `washi_bogen_C_ringe_rahmen.png`

**Bedeutung je Teil:**

| Teil | Wofür im Spiel |
|---|---|
| Fensterrahmen (Ecken + kachelbare Kanten + ruhige Innenfläche) | alle großen Fenster (Pause, Settings, Truhe, Kayfabricate, Almanach, Garderobe, Orte); 9-Slice ohne Dehnen |
| Listen-Panel (senkrecht) | Playlist, Song-Auswahl |
| Einzelner Reiter (normal / aktiv) | Settings-Reiter (6 Stück) |
| Großer Knopf (normal / hover / gedrückt / aus) | Annehmen, Herstellen, Weiterspielen |
| Auswahl-Pille (aus / an) | Auswahl in Settings (WALK/DRIVE/FLY usw.) |
| Schloss + gesperrte Fachplatte | gesperrte Slops, gesperrte Rezepte |
| Sockelplatte ohne Schleier | unter Fäusten, Rucksack, Stiefel |
| Porträtring groß | um den Spielerkopf unten links |
| 7 Symbole | Haus (Titel), Hilfe (Steuerung), Buch (Almanach), Ort-Nadel (Orte), Schraubenschlüssel (Werk), Truhe (Beute), Karte |
| Kompass-Innenfläche mit Markern | Minimap im Kompass |

```text
BLATT 1 von 2. Use the three attached sprite sheets as the exact and only style reference: handmade washi-paper HUD parts, layered torn paper in cream, blue-grey, coral and mustard, soft clay-like bevel, small cloud and seigaiha accents, soft top-left light, gentle drop shadow. Every new part must look like it comes from the same sheets, same light, same edge, same paper grain.

Create ONE new sprite sheet, fully transparent background, generous spacing, front view, no perspective, no text, no letters, no numbers:
1. A window frame kit for a large game window: four corners about 220 x 220 px each, four straight edge strips about 400 px long that tile seamlessly end to end (top, bottom, left, right), and one quiet plain paper fill tile 512 x 512 px that tiles seamlessly. Edges and fill must have NO ornaments so they can repeat; ornaments only on the corners.
2. One tall list panel about 420 x 700 px, plain inner area, subtle torn edge.
3. One single tab in two states, about 230 x 80 px each: normal (flat, muted) and active (raised, mustard rim).
4. One large primary button in four states, about 360 x 120 px each: normal, hover (slightly lifted, warmer), pressed (pushed in), disabled (faded grey-cream).
5. One segmented choice pill in two states, about 150 x 64 px: off and on (coral).
6. One paper padlock about 90 x 100 px and one locked slot plate about 110 x 112 px (same plate as the reference slots, with the padlock embossed).
7. One round socket plate about 200 x 200 px, clean, no white haze.
8. One large portrait ring about 260 x 260 px (cloud-ring style like the reference), inner opening about 190 px.
```

```text
BLATT 2 von 2. Same style and same rules as sheet 1, same chat. Create ONE more sprite sheet, transparent background, no text:
1. Seven icon badges on small round paper plates, about 110 x 110 px each: a house, a question mark (help), an open book, a map pin, a wrench, a treasure chest, a playing card.
2. A compass inner face about 300 x 300 px: plain map-paper disc with four small cardinal tick marks, no letters, plus a separate small player marker (paper arrowhead, about 40 px) and a separate small target marker (paper flag, about 40 px).
3. Three collectible card frames, portrait 5:7, about 700 x 980 px each, juicy and cartoony like a trading card game: COMMON (cream + blue-grey layer), RARE (+ coral layer), EPIC (+ mustard layer and torn flourish at the top corners). Each frame: large empty picture window in the upper 55 %, a blank title ribbon across its lower edge, a blank two-line copy box below, a round empty socket bottom right.
4. One matching card back (cream paper, folded-paper star emblem, seigaiha border).
5. Two rarity stars about 120 px: empty (pressed-in outline) and filled (raised mustard).
6. Two blank paper tags about 220 x 90 px: coral and mustard.
7. One selection rim matching the card frame shape: warm golden torn-paper glow rim, transparent inside.
```

---

## B · Gegenstände in Knet-3D (eigener Chat)

**Hochladen** (aus `HUD_CLAYBOUND_R1/teile3/`):
- `fist_t.webp`
- `backpack_t.webp`
- `boot_t.webp`
- `x_hero_blaster.webp`
- `x_hero_bomb.webp`

```text
Use the attached images as the exact style reference: chunky glossy claymation 3D objects, soft studio light from top-left, rounded forms, thick clay surfaces, subtle fingerprint texture, no outlines. Create ONE sprite sheet, transparent background, each object centered in its own 512 x 512 cell, same camera angle (three-quarter front, slightly from above), same scale logic (object fills about 80 % of its cell), no text:
fist, hero blaster (purple), short sword, gatling gun, rocket launcher, hand grenade, round clown bomb with face, jetpack with two red tanks, treasure chest, a playing card, a fluff ball, a rusty little racing car, a red flame dragster car.
```

---

## C · Orts-Bilder im Diorama-Stil (eigener Chat)

**Hochladen** (aus `HUD_CLAYBOUND_R1/teile3/`):
- `o1.webp`
- `o2.webp`
- `o3.webp` (dieselbe Diorama-Serie)

```text
Use the attached images as the exact style reference: small round claymation dioramas on a plinth, same camera, same light, same plinth, same saturation. Create two new dioramas in the same format and size as the references, transparent background, no text:
1. UNDERWATER: a sunken seabed diorama with kelp, coral, bubbles and a small shipwreck.
2. AQUARIUM: a glass aquarium tank diorama with a little castle, sand, plants and a cartoon fish.
```

---

**Einbau danach (WS0):**
- Teile ausschneiden, 1:1, ein Maßstab für alle Papierteile.
- Fenster per 9-Slice nur mit Ecken und gekachelten Kanten.
- Kartenrahmen in Truhe und Kayfabricate. Titel, Text und Zahlen kommen im Code dazu.
