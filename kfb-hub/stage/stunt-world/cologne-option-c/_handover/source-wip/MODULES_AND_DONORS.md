# KFB Cologne Race · Option C · Module und Spender

Stand 2026-09-20. Dieses Dokument beantwortet eine Frage: **wem gehört was, und
wofür.** Es ist additiv — Einträge kommen dazu, alte werden nicht überschrieben.

---

## 1 · Module dieser Slice

Jedes Modul hat genau einen Besitz. Wo zwei Module dieselbe Sache anfassen
könnten, steht die Grenze dabei.

| Datei | Besitzt | Besitzt NICHT |
|---|---|---|
| `lab-v9/option-c-style.v1.js` | die gemessene Farbautorität; jede Farbe trägt ihren Flächenanteil aus den beiden Tafeln | Materialien, Licht, Geometrie |
| `lab-v9/cologne-route.v1.js` | Streckenverlauf, Kontrollpunkte, Spline, Breite, Überhöhung, Topologie-Marken, Heldenkamera-Positionen | Darstellung der Strecke |
| `lab-v9/cologne-track.v1.js` | TrackFlowDeformer: Band, Schultern, Mauern, Mittelstriche, Bauwerk, Tunnelschale, Randkaskade | den Verlauf selbst |
| `lab-v9/cologne-world.v1.js` | BuildingElastic, Rhein-Shader, LandmarkElastic Dom, Boden, RAW-Pin | Strecke, Fahrzeug, Klang |
| `lab-v9/cologne-landmarks.v1.js` | die fünf Kölner Genius Loci und ihr Freihalte-Versatz | OSM-Anker (die gehören dem Datensatz) |
| `lab-v9/cologne-play.v1.js` | **der einzige Bewegungsbesitzer**: Race-v0.8-Zahlen, Fahrzeugrahmen, Kameras | Antrieb, VFX, Klang |
| `lab-v9/cologne-drive.v1.js` | Antrieb und seine drei Skins, Spuren und Speedlines, Würfel-Begleiter | Bewegung |
| `lab-v9/cologne-props.v1.js` | Kenney-Requisiten, Torkette, Durchfahrt-Klang, Countdown, Kartenbild | Strecke, Welt |
| `lab-v9/cologne-audio.v1.js` | Motorenlauf-Schicht und der Audio-Pin | Jukebox (Oberfläche), SFX (props) |
| `lab-v9/cologne-sky.v1.js` | Kuppel, Sterne, Himmelskörper, Himmelskarten, Himmelswürfel | Szenenlicht |
| `lab-v9/cologne-stage.v1.js` | Zusammenbau, Schleife, Beleg, Streckenscan | keine Fachlogik |
| `KFB Cologne Race Option C.dc.html` | HUD v4 und Bedienung | nichts in der 3D-Bühne |

---

## 2 · Fremde Spender: Besitzer und Rolle

**Besitzer** heißt: wer die Wahrheit über diese Sache hält. **Rolle** heißt: was
davon hier verwendet wird — und was ausdrücklich nicht.

### Welt-Stil

| Spender | Besitzer | Rolle hier | Grenze |
|---|---|---|---|
| Option-C-Tafeln 01/02 · blobs `59fd27fc`, `ac0bf006` | Georg / KFB | **Farbautorität.** Beide einzeln geöffnet, kanalweise gebinnt; jeder Wert in `option-c-style.v1.js` trägt seinen Messanteil | keine Layout-Vorlage |
| `travel/travel-v16/terrain-v16/skydome-shader.js` @`f747574d4283` | Travel / TinySkies-Linie | **Himmelsmathematik**, Variante S: domain-verzerrtes 4-Oktaven-fbm, Flussbänder, Sternenfeld | Farbstopps kommen aus den Tafeln, NICHT aus den Travel-Story-Paletten. Verzerrung und Kontrast halbiert |
| `sky-cards.js` @`e4c2d3a03e58`, `sky-dice.js` @`e342997e4a5f` | Travel | **Platzierungsgrammatik** für Karten und Würfel in der Kuppel | Zahlenwerte neu gesetzt |
| `tools/osm-city-lab/src/style/cartoon-city.js` @`d08c19fc45d9` | OSM City Lab | **Gebäudegrammatik**: stabiler OSM-Identitäts-Seed, bodenverankert, nach oben stärker | `windowCodesForBuilding()` ungenutzt |
| `landmark-style-profiles.v1.json` @`2ef3ecaaf81f` | img2threejs | **Identitätspalette des Doms** | die übrigen Profile ungenutzt |

### Strecke und Geografie

| Spender | Besitzer | Rolle hier | Grenze |
|---|---|---|---|
| `dom-zentrum-v0/{CLAUDE_CONTEXT,normalized}.json` | `tools/osm-city-lab` | **Geografische Wahrheit.** WO: Grundrisse, Rhein, Anker, Straßen | KFB besitzt WIE. Keine erfundene Geometrie trägt das Etikett OSM |
| FILAMENT #02 · `KilledByAPixel/SP13KTRA` @`166ad838` | fremd, **All rights reserved** | **Nur Maßstab** für Tempo und Taktschläge | kein Code, keine Kurventabelle, keine Koordinate, kein Weltmaßstab, keine Palette, kein Netz |
| `RACE_FLOW_RUNTIME_CONFIG.json` @`27ce5d67b1aa`, `RACE_FEEL_V08_CONFIG.json` @`38afec4b9eaf` | KFB-Stunt-Car-Race | **Der einzige Bewegungsbesitzer.** Zahlen wörtlich übernommen | nicht nachgeregelt, kein zweiter Controller |
| `koelner-dom/v0.2/index.html` | img2threejs | **Dom-Modell**, Faktor 1,873 auf die OSM-Höhe 157,38 m | Längsachse 18 % kurz — offen |

### HUD

| Spender | Besitzer | Rolle hier | Grenze |
|---|---|---|---|
| `hud-game-v3/SOURCE.json` @`affb1ba1d175` | KFB-Stunt-Car-Race | **Regelwerk v3**: Tacho behalten, echte Route, Querformat-Karten, große Radioknöpfe | — |
| `HUD_V4_CHANGE_BRIEF.md` · PR #30, Head `f4436c83c674` | KFB-Stunt-Car-Race | **Maßvorgaben v4**: Größen, Bangers, stufenlose Farbrampe, Bewegungszeiten | §6 (Radio raus) bewusst abgewichen — siehe RETURN.md |

### Requisiten, Karten, Klang

| Spender | Besitzer | Rolle hier | Grenze |
|---|---|---|---|
| `kfb-RACE_TRACK+UI_asset-handoff-animation-lab (7).json` · 213 Assets | KFB-ToolBox | **Auswahlquelle** für Tore und Ziffern | enthält KEINE Kölner Landmarke |
| Kenney Racing Kit | Kenney | `roadStart`, `flagCheckers`, `overhead*`, `billboard`, `camera_exclusive` | **führt keine Ziffern** |
| Platformer Game Kit Dec 2021 | Kenney | `Numbers_1..3` für den Countdown — **deklarierter Ersatz** | nicht als Racing-Kit-Kunst ausgeben |
| KayKit City Builder Bits | KayKit | drei Fahrzeuge, am glTF-Accessor vermessen | — |
| Tiny Treats Baked Goods | KayKit | `donut_pink` als Power Donut Drive | — |
| `media/kfb/index.json` @`af276a8b941a` + `card-art-2d.js` @`9485bdee2d87` | KFB | **echtes Kartenbild** über den `quarter()`-Vertrag | kein erfundenes Motiv |
| `media/3D_Assets/Audio/KFB Racer/` @`26c00b98a60e` | KFB | **Motorenlauf**, 19 Dateien als Pool für spätere Fahrzeug-Zuordnung | eigener Pin: der Ordner kam NACH dem Slice-Basis-Pin dazu |

---

## 3 · Klangschichten

Drei Besitzer, ein Mischer. Sie dürfen sich nicht übersteuern.

| Schicht | Besitzer | Verhalten |
|---|---|---|
| **BED** Motorenlauf | `cologne-audio.v1.js` | Endlosschleife, Tonhöhe 0,78–1,42 am Tempo, Pegel am Tempo und Gas |
| **MUSIC** Jukebox | die Oberfläche | eigener Regler, eigene Titel, vom Fahrer geschaltet |
| **SFX** Tordurchfahrt | `cologne-props.v1.js` | synthetisiert, kurz, am Tempo |

Kein Beat-Pumpen, kein Zittern — auf Ansage zurückgestellt.

---

## 4 · Streckenscan

`stage.auditRoute({clearanceM, step})` prüft jeden n-ten Stützpunkt gegen jedes
Netz, das in den Fahrraum ragt (Band plus Lichte darüber).

Ausgenommen und warum:
- `oms-*` — nach Farbton **verschmolzene** Netze; ihre Hülle umspannt die halbe
  Karte und sagt über einzelne Häuser nichts. Der belastbare Test für Gebäude
  ist der Punkt-in-Polygon-Test beim Bauen (`city.portals`, `city.skipped`).
- Startlinie, Tore, eigener Antrieb — die stehen **absichtlich** im Fahrraum.

Messreihe dieser Runde: **40 → 4** Befunde. Die vier Übrigen sind ein
Brückenpfeiler (4 von 200 Stützpunkten) und drei Teile eines Kenney-Netzes
(je 2) — notiert, nicht behoben.
