# LIVING · KFB HUD + Flug-VFX

Stand 2026-10-09 · R3. Das eine Stand-Dokument dieser Linie. Verlauf: `CHANGELOG.md`. Nächster Sprint: `SPRINT_R4_PLAN.md`. Frischer Chat: `ONBOARDING_frischer_chat_hud_flight.md`.
Pflege: höchstens 120 Zeilen. Begründungen und Zahlenreihen gehören in den Changelog.

## Was es ist

HUD und Flug-Effekte für den KFB-MVP »Drive Loop« (Gehen, Fahren, Fliegen). Gebaut als Module für three.js, gezeigt auf einer Tafel. Ziel-Konsument: KFB Island Worldbuilder Lab (r186). Tafel läuft auf r170.

## Dateien

| Datei | Rolle | Ins MVP |
| --- | --- | --- |
| `hud-flight/kfb-hud.js` | `createHud()` · Plaketten, Moduswechsel, Fluff, Radio R3, Rucksack-Slot | ja |
| `hud-flight/kfb-flight-vfx.js` | `createFlightVfx()`, `createSpeedTrails()`, `hoverPose()`, `FLIGHT_IDLE` | ja |
| `hud-flight/kfb-backpack.js` | Prop-Bibliothek, Prop-Renderer, Rucksack-Miniatur, 20-Fächer-Overlay, Kassettendeck | ja |
| `hud-flight/kfb-jukebox-data.js` | Biome, Titel, Sender, Kassetten, Items, URLs | ja, als Daten |
| `hud-flight/hud-board-scene.js` | Platzhalter-Insel, -Figur, -Jetpack, -Kart | nein |
| `KFB HUD Flight Board.dc.html` | Tafeln A–F + Live | Referenz |

## Stand je Teil

**HUD** — Lila-Plakette aus hud-theme.v1, Mulde, Pfirsich-Knöpfe, feste Neigung je Teil. Gehen: Rucksack, Kompass, Fluff. Fahren: + Tacho, Radio. Fliegen: + Höhe, Tank. Unter 1180 px bis 62 %. Georg: gut, »noch sehr rund und glatt«.
**Radio R3** — Noten-Knopf (Musik an/aus, aus = nur Knopf), Pixel-Display (VT323, 1 Zeichen je 0,25 s, 1,8 s Pause), Zurück, Play, Weiter, Playlist-Menü. Mobil ohne Display oben. Spielt nichts selbst.
**Rucksack** — Hoarder_Backpack als wippende Miniatur; Overlay klappt aus dem Slot, 5 × 4 Mulden, Vorschau mit Name/Herkunft. Items: Taxi-Schlüssel, Donut (Essen → Fluff), Kassettenradio (Deck), Karte. Georg: »Rucksack-Design ganz gut«, Schwung gut.
**Kassette** — DOM-Platzhalter in Kompaktkassetten-Proportion. Kein Modell in KayKit/Tiny Treats.
**Speedlines** — zwei Bänder an Tank-Außenkanten bzw. hinteren Kart-Ecken, Creme, ab 18 km/h. Auch fürs Racing.
**Manöver-Linien** — radial, additiv hell, nur auf Auslöser (Barrel Roll, Boost).
**Jetpack-Schub** — drei Kern-Wülste je Düse + Tropfen mit Knetfleck-Zerfall. Schweben mit Minimalschub.
**Überflug** — Staub/Gischt unter 4,5 m und ab 50 km/h, abschaltbar.
**Puff** — Rubbel-Ring + Krümel bei Start/Landung.
**Biome** — vier Hex-Inseln (Burg, Utopia, Dystopia, Protopia). Palette treibt Welt und HUD.

## Entscheidungen Georg

- Begriffe: Speedlines = Bänder an Außenkanten; radiale Linien = Manöver/Beschleunigung, hell.
- Radio ohne Quellen- und Lautstärke-Drehknopf. Noten-Knopf schaltet Musik und minifiziert.
- Rucksack wird jetzt schon gebaut (im Briefing noch »später«).
- Look: Knet-Look wie Plaketten; Modelle KayKit/Tiny Treats zuerst, sonst Kenney/Quaternius.
- Playlist: Biom-Radio + eigene Tapes im Kassettendeck.
- Glatter Look darf vorerst bleiben; Knet-Textur folgt (Joyride-Slices).

## Offen

- TUNE: Knet-Textur auf Plaketten und Items (Clay SSOT, K7 Knet-HUD, K2/v10).
- OPEN: Verhältnis zu K7 Knet-HUD (`clay-hud.v1.js`, hat Rucksack + 20 Plätze) klären. Ein Owner, nicht zwei HUDs.
- OPEN: echte Figur + Combat-Mech-Jetpack; Düsen- und Trail-Anker neu setzen.
- OPEN: Radio-Events an den Audio-Owner (`song-transport.js`).
- OPEN: r186 im Lab nicht getestet; Performance = UNKNOWN.
- OPEN: Senderzuordnung Burg/Utopia/Protopia ist Vorschlag; Künstlerangaben fehlen in den Daten.
- OPEN: Biom-Hex vom Referenzblatt abgelesen, nicht aus `hex-archipel.r2c.js`.
- OPEN: Radio-Front im Item-Modell aus Maßen geschätzt (+z).
- SOURCE_REQUIRED: `MVP_DRIVE_LOOP_R1_PLAN.md`, `ENV_ROLES` (`src/palettes.ts`), `kfbBlend`, Mauerwerk-Familie A. In den zugänglichen Branches nicht gefunden.
- DEFERRED: Comic-Contrails aus Travel Globe v13.

## Nächstes Gate

Georg-Review der Tafel R3. Danach Sprint R4 (`SPRINT_R4_PLAN.md`), Start mit R4-0 Quellen und R4-1 K7-Abgleich.
