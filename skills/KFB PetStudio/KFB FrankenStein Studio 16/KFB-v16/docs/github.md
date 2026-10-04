# Quelle der 3D-Modelle

repo: georg-doc/kayfabizarro
branch: main
path: media/3D_Assets

**Nichts aus diesem Repo wird kopiert** — alle Modelle werden zur Laufzeit als Fernspender geladen
(`raw.githubusercontent.com/…/main/media/3D_Assets/…`). Das Projekt hält nur Code.

**⚠ Zwei Messregeln zu diesem Repo** (11.09. bezahlt):
- Der Verzeichnisbaum über die GitHub-Werkzeuge **zeigt `.glb` nicht an** (0 von 1202 Treffern für
  `.glb` im ganzen Ordner `3D_Assets`, obwohl das Projekt dutzende davon lädt). Wer sich auf den Baum
  verlässt, hält gefüllte Ordner für leer.
- `media/3D_Assets/CATALOG/` ist von Juli 2026 und kennt die neueren Uploads nicht.
  Verlässlicher: `frankenstein-v1/data/kfb-asset-library.json` (Georgs eigener Baum-Export) — und
  auch der ist nur so frisch wie sein Datum.

## Last sync

date: 2026-09-13T04:50:28Z

**Kein Commit-Hash** — der Verzeichnisbaum liefert weiter nur einen TREE-Hash (`f5bbd8b37ab3`).

### Updated in this project
- **Kartenmotiv KOPIERT, nicht verlinkt:** `media/kfb/KayfaBizarro_Card_Backside_01_lowrez.png`
  (800 × 447) liegt jetzt als `frizzlegraft-v1/kfb-card-backside.png` im Projekt und trägt die
  Ober- und Unterseite der Travel-Referenzkarte. Ein Blatt, das aus dem Netz nachlädt, ist beim
  nächsten Ausfall ein leeres Blatt.
- **Gesucht und gefunden im Repo:** das Motiv liegt dreifach (`media/kfb/…_01.png` in voller Größe,
  `…_lowrez.png`, und identisch als `overworld/overworld/card-backside.png`). Genommen wurde die
  kleine Fassung — 257 kB statt 1,05 MB, für eine 3 × 1,68 große Fläche mehr als genug.
- Alles andere dieser Sitzung (Armlöser, Kartengröße, Mitkippen der Figur) betrifft nur Projektdateien.

## Sync history

### Vorher (2026-09-13T02:39:03Z)
date: 2026-09-13T02:39:03Z

**Kein Commit-Hash** — der Verzeichnisbaum liefert weiter nur einen TREE-Hash. Angefaßt wurden in
dieser Sitzung zwei Repos: `georg-doc/kayfabizarro` (gemessen) und `georg-doc/KFB-Stunt-Car-Race`
(gelesen, `_inbox/Config_JSONs`, Tree `53e929f24f68`) — dort steht das Format, das der Voll-Export
des Studios treffen muß (`$schema: kfb.pets/1`, `pets[]`; `kfb-pet-graft-driver (1).json` ist der
Stand des Graft-Drivers).

### Updated in this project
- **Neues Blatt `KFB FrankenStein Studio v16.dc.html`** (Quelle in `petstudio-v9/`, Wurzelkopie
  erzeugt) mit Materialzonen, ovalen Augen und Surfpose. Keine neuen Ladepfade.
- **Gemessen an `driver_texture.png`** (`KayKit_Mystery_Series6/2 - August 2023 - Driver/textures/`,
  HTTP 200, 1024 × 1024): die Datei ist ein **Farbfeld-Atlas**, Raster **8 × 4** aus den Bildkanten
  gemessen. 3361 verschiedene Farben, die größten Gruppen sind Verläufe, keine gemalten Kleidungsstücke.
- **Gemessen an `Driver.glb`** (196 408 Byte, ein Material `driver_texture`, sieben Netze): welches
  Netz welches Atlasfeld benutzt — Jacke r1c1 (992 Dreiecke) · Hose r1c7 (376) · Schuh r2c3/r2c4 ·
  Shirt r3c5 · Rückenfeld r3c6/r3c7 (dort liegt das große GO GO GO) · Haut r0c0 · Brille r2c6.
  **Das ist die Trennlinie, die Mesh- und Materialnamen nicht liefern können.**
- **Vertragsformat geprüft** an `_inbox/Config_JSONs/kfb-pet-graft-driver (1).json`: die neuen Felder
  `graft.mat`, `eye.oval`, `pose.stagger` sind Blattfelder unter `pets[]` und brauchen keinen neuen
  Weg — 81 → 89 Blattfelder, Rundlauf verlustfrei.


### Vorher (2026-09-12T18:10:00Z)
date: 2026-09-12T18:10:00Z

**Kein Commit-Hash** — der Verzeichnisbaum liefert einen TREE-Hash (`b97b5ac55df2`), keinen Commit;
ein geratener wäre schlimmer als keiner. Ein echter Unterschied seit dem letzten Stand ist deshalb
nicht abgrenzbar. Statt zu raten wurde geprüft, was das Projekt wirklich anfaßt: **28 Ladepfade,
alle HTTP 200** (fünf Wirtsfiguren · acht Animationssätze `Rig_Medium_*` · Badewanne · Orc-Bildtafel
· Sockel · zwei Panels · zwei Knöpfe · drei Rover · vier Mechs). Kein Pfad ist upstream weggewandert,
kein Blatt mußte neu gebaut werden.

### Updated in this project
- **`KFB Mech & Vehicle Rig v2.dc.html`** mit drei Reitern. Neue Ladepfade, alle geprüft:
  `SciFI_Ultimate Space Kit_Quaternius/Vehicles/GLTF/Rover_Round.gltf` ·
  `Bubbly_Bathroom_Tiny_Treats_1-1/Assets/gltf/bath.gltf` ·
  `kenney_car-kit/Models/GLB format/wheel-racing|default|dark.glb` ·
  `Frankensteining/Space engine by Poly by Google - 4w-3qcynW5d.glb` ·
  `Textures/rusty_metal_04|PaintedMetal017|Concrete024|Chainmail004/<Name>_diffuse|normal|roughness.jpg`.
- **Gemessen am Rover_Round:** Wanne 3,95 × 3,46 (y 0,28–5,17) · Antenne bis 5,168 · **Dachfläche
  3,563** (25 Strahlen, Median). Schüssel und Mast werden geschnitten, der Schnittrand mit einer
  gemessenen Deckelscheibe (r 0,634) geschlossen.
- **Gemessen an bath.gltf:** 2,000 × 1,608 × 3,000 · Innenboden 1,116 · **Wasserlinie 1,316** ·
  Rand 1,978 · innen 1,839 × 1,333.
- **Textur-Regel für dieses Repo:** die Kenney- und Quaternius-Netze haben **Atlas-UV** — eine
  Kacheltextur aus `Textures/` braucht eine **Box-Projektion**, sonst gibt sie pro Fläche nur einen
  Farbwert.
- **Neues Blatt `KFB Mech & Vehicle Rig v2.dc.html`** mit zweitem Reiter »Rover«: `SciFI_Ultimate
  Space Kit_Quaternius/Vehicles/GLTF/Rover_Round.gltf` als Träger (HTTP 200, erster echter Ladepfad
  für die Rover-Reihe). Gemessen: Wanne 3,95 × 3,46, Antenne bis 5,168, **Dachfläche 3,563**.
- **Neues Blatt `KFB Mech & Vehicle Rig v1.dc.html`:** Oberkörper ohne Hüfte (Geometrieschnitt an der
  gemessenen Hüftlinie), auf `button-floor-round.glb` als Sockel, mit Cockpit aus Knüppel, zwei
  Kenney-Knöpfen und einem Factory-Panel — **alles von Hand einstellbar**, die Messung bleibt nur als
  Rückmeldung (Durchdringung, Überstand, Handtiefe).
- **Arm-Posing mit gelöster Haltung:** die Ruhelage kommt aus den inversen Bindmatrizen des Skeletts,
  nicht aus dem laufenden Clip; Winkel werden gesucht statt geraten (`_solveHand`). Gemessen: rechte
  Hand 0,020 an der Knüppelkugel (Radius 0,098), linke 0,223 auf der Knopffläche (0,305).
- **Konfiguration raus und rein** (Copy config · Datei ↓ ↑ · Text), Rundlauf verlustfrei; die Ablage
  ist im Vorschaufenster gesperrt (NotAllowedError), deshalb fällt ersatzweise eine Datei heraus.
- **Farbübernahme aus dem Studio:** `look.v1.js` liest denselben Eintrag (Sitzungsentwurf, sonst
  Repo-Vertrag) und legt Kopfzonen, Rollenfarben und Augenfarbe auf den Graft.
- **Badewanne von Hand skaliert** (zwei Regler, Modellform bleibt) statt dreier hergeleiteter Maßstäbe.

### Vorher (12.09., 02:20)
- Blatt v14 → `KFB FrankenStein Studio v15.dc.html`; Import/Export 94 Felder verlustfrei, Voll-Export
  29 Einträge; `pet.seat = { profile, widthK }` neu im Vertrag.

### 2026-09-11T15:01:31Z
- Gemessen: alle geprüften Figuren binden **100 %** der Animationsspuren; dem Mannequin fehlen nur
  die beiden Sockel `handslotl`/`handslotr` für Gegenstände.
- Elf ältere Charaktere werden per **Pfadprobe** gesucht (bis zu 42 Orte je Figur), weil ihre
  Dateinamen aus dem Baum nicht ablesbar sind. Werewolf: kein Treffer — Dateiname unbekannt.

## Screen map

| Blatt | lädt aus |
|---|---|
| `KFB FrizzleDummy Lab v1.dc.html` | `KayKit_Character_Animations_1.1/` (Mannequins + 8 Animationspakete) · `KayKit_Mystery_Series6/` · `KayKit_Adventurers_2.0_FREE/Characters/gltf/` · `KayKit_Skeletons/characters/gltf/` |
| `petstudio-v9/KFB FrankenStein Studio v15.dc.html` · Reiter **Anim** | `KayKit_Character_Animations_1.1/Animations/gltf/Rig_Medium/Rig_Medium_*.glb` (acht Dateien) |
| `frizzlegraft-v1/anim-audit.v1.js` | dieselben acht Dateien — zählt, spielt nicht |
| `frizzlegraft-v1/graft-biped.v1.js` | `KayKit_Mystery_Series6/…/Driver.glb` + `Mannequin_Medium.glb` |
| `frizzlegraft-v1/facehost.v1.js` | nichts — misst die geladene Figur |
| `KFB Mech & Vehicle Rig v2.dc.html` | wie v1 · zusätzlich `SciFI_Ultimate Space Kit_Quaternius/Vehicles/GLTF/Rover_Round.gltf` · `Bubbly_Bathroom_Tiny_Treats_1-1/Assets/gltf/bath.gltf` · `kenney_car-kit/Models/GLB format/wheel-*.glb` · `Frankensteining/Space engine …glb` · `Textures/<Satz>/…` |
| `KFB Mech & Vehicle Rig v1.dc.html` | `KayKit_Mystery_Series6/` (Driver · Clown · Orc Raider) · `KayKit_Character_Animations_1.1/Mannequin Character/` · `kenney_factory-kit_3.0/Models/GLB format/` (Sockel + zwei Panels) · `kenney_platformer-kit/Models/GLB format/` (zwei Knöpfe) |
| `frizzlegraft-v1/torsobase.v1.js` · `look.v1.js` | Sockel `button-floor-round.glb` · `look` lädt nichts, liest den Eintrag |
| `frizzlegraft-v1/seat-lab.v1.js` | `Bubbly_Bathroom_Tiny_Treats_1-1/Assets/gltf/bath.gltf` |
| noch ungenutzt, geprüft | `SciFI_Ultimate Space Kit_Quaternius/Vehicles/GLTF/` (3 Rover) · `Characters/GLTF/` (4 Mechs, je EIN Netz → Kopf muß geschnitten werden) |
| `frankenstein-v1/race/` | gepinnte Fassung `15e36b91…` (eigener Ladeweg, hiervon unberührt) |
