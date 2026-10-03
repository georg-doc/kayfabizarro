# NPC_SETTINGS_01 · MUMMY-01 · Rückgabe

**Stand:** 2026-10-01 · Atlas **S16** (`KFB_Resident_Atlas_S16.html#mummy`) · S15 bleibt Fight-Messbasis · candidate-only

## Gebaut

- Resident `mummy` in `data/cast.js` (28. Rezept), gleiches Format wie die 27 bestehenden.
- Quelle: Donor `main @ 9248211a…`, jede Datei mit `commit: MU_PIN`. Promo als RAW-URL am selben Pin.
- Aktor `mummy_b` (freies Gesicht) · Walking_A @ 0,64 s · Ankh an `handslot.l`, Identität.
- `mummy_a` (schwarzes Gesicht) · Waving @ 0,5 s · per `sitOn` mit Hüft-Bone auf 1,05 im Sarkophag-Raum.
- Landmarke Sarkophag, Deckel aufgeschoben über neuen Mechanismus `parts` in `lib/atlas.js` (Kind-Node versetzen, Datei unverändert).
- Krug mit Gold, gelehnte Vase, Vase mit Gold, umgekippte Vase nach artwork.png. Toilettenpapier optional (nur contents.png).

## Neu in lib/atlas.js

`parts: { <nodeName>: { off: [x,y,z], rot: [°,°,°] } }` — rückwärtskompatibel, greift nur, wo gesetzt.

## Nachtrag 01.10. (Georg-Befund)

- Deckel steckte in Mummy_A: Deckel jetzt `off [-0.75, 0.02, 0.05]`, Mummy_A `seat [1.1, 0.82, -0.3]`; Goldkrug `[-1.05, 0.7]` und Vase `[-0.8, -0.45]` aus dem Deckelüberstand genommen (rechts hinten, ab Taille sichtbar). In der Draufsicht geprüft, keine Durchdringung mehr.
- Treppige Schattenkanten (Schleife, Gesicht): three r184 ersetzt `PCFSoftShadowMap` still durch PCF **ohne** Filterradius. `lib/atlas.js` setzt jetzt `PCFShadowMap` explizit, `lib/shadow-contract.js` dazu `shadow.radius = 3`, `blurSamples = 12`. Frustum, Texel-Raster und Bias nach LESSONS_SHADOWS waren schon drin, die hab ich nicht angefasst. Gilt für alle Residents.
- Knetlook nur im Diorama (K1/H0 hängt am Diorama-Modus). Biome: nur Wiese, Friedhof, Alienwelt, kein Wüstenbiom.

## Nachtrag 01.10. · Runde 3 (Georg: Editor, Knete, Schatten, Eye-Rig)

- **Knete im Studio als Standard:** Knetform, Knetmaterial und Kontaktverdeckung (AO) laufen jetzt auch ohne Diorama (`lib/diorama.js` `setStudioClay`), der Studio-Boden bekommt die Knete mit. Neuer Kopf-Schalter „Knete“.
- **Helle Sichel am Fußkontakt:** Ursache war die halbe Auflösung der Kontaktverdeckung, nicht der Schatten-Bias. Gegenprobe mit gleicher Kamera am Hocker: halbe Auflösung zeigt die Sichel, volle Auflösung nicht. Die AO-Stufe „mittel“ läuft jetzt auf voller Auflösung, das Studio auf „hoch“. Schattenradius von 3 auf 2.
- **Editor-Menü in Stufe B1:** Linien-Symbole, aktiv = heller Grauton mit Innenkontur. Name der Auswahl steht vorn im Menü, darunter eine Zustandszeile. Der Auswahlrahmen liegt über allem und folgt jedes Bild.
- **Glieder-Griffe an der gewählten Figur:** Puppe, IK und Pose-Griffe hängen sich an die angeklickte Figur, nicht mehr fest an den Rezept-Aktor.
- **Kopfzeile:** „Bearbeiten“ steht fest rechts. „Details“ heißt jetzt ☰ (Inspektor).
- **Eye-Rig:** nicht gebaut, Vorschlag in `EYE_RIG_DEFAULT_BRIEF.md` (Blender MCP liefert `*_NoEyes.glb` und Anker).
- **Nicht geprüft:** Die Vorschau hier läuft ohne Bildschleife. Menüposition und Lage der Pose-Griffe konnte ich deshalb nicht im laufenden Bild sehen.

## Nachtrag 01.10. · Runde 4

- **Lichtsaum am Fußkontakt, eigentliche Ursache:** Die Schattenkarte enthielt die Rückseiten (three.js: `shadowSide` null → BackSide). Die halbe AO-Auflösung aus Runde 3 war nur ein Nebenbefund. Fix in `lib/shadow-contract.js` `castRule`: `shadowSide = FrontSide` für einseitige Werfer, alle 30 Bilder nachgezogen. Gegenprobe am Hocker von Goth Girl: Mit BackSide bleibt der Saum, auch bei normalBias 0, Radius 0 und ohne K1. Mit FrontSide ist er weg, ohne Akne.
- **Mund und Augen bleiben in Form:** `lib/clay-k1.js` `softenSkinned` lässt Inseln unter 12 % der Netz-Diagonale ungeglättet. Taubin hatte diese kleinen Schalen rund gezogen.
- **Eye-Rig-Brief** steht zum Download bereit (`docs/NPC_SETTINGS_01/EYE_RIG_DEFAULT_BRIEF.md`). Blender MCP ist von hier nicht aufrufbar.

## Nachtrag 01.10. · Runde 5

- **Lautsprecher-Raster und Bodenbögen** kamen aus dem Knet-Material K2, nicht aus Form oder Schatten. Gegenprobe Werkzeug für Werkzeug am Lautsprecher: Der Fächer erzeugt das Kreuzraster, der Wisch die Bögen am Boden. Requisiten nutzen jetzt `TOOLMIX.prop` (Daumen, Delle, Falte, Rolle), der Studio-Boden `TOOLMIX.floor`. Häuser und Gelände im Diorama sind unverändert.
- **EYE-CLEANUP-01 gelesen:** alle vier Figuren Klasse island, Anker `eye_anchorl/r`. Noch nicht verdrahtet, Georgs PASS je Figur steht aus.

## Nachtrag 01.10. · Runde 6 · Eye-Rig verdrahtet

- **Abnahme:** `uploads/EYE_CLEANUP_01_review.json`. Georg gibt PASS für alle vier Figuren. Das schwarze Band bei Mummy_A bleibt. Geladen wird aus dem Arbeitsordner auf `georg-doc-patch-3`.
- **Rezeptfeld** `eyes: { rig: 'default', source, commit, anchors: 'eye_anchorl/r', skin }`: gesetzt bei witch, brute (Orc Brute), mummy_b und mummy_a. Bei `EYES.on` (Standard) lädt der Atlas die NoEyes-Datei statt `a`.
- **Neues Modul** `lib/frizzlegraft/anchored-eyes.v1.js`:
  - verwendet `pet-eye-rig.v6.js` (Kopie, unverändert) und `facehost.v1.js`
  - setzt nach `build()` jedes Auge auf seinen Anker: Lage, Drehung und Radius aus dem Empty
  - Augenmitte liegt 0,24 r hinter der alten Kappe
  - Lidfarbe ist die gemessene Haut
  - Augen-Meshes ohne Knete und ohne Schattenwurf
- **Kopf-Schalter „Augen“:** Er schaltet zwischen Eye-Rig und Originaldatei um. Blinzeln, Blick und Leben laufen pro Bild über `V.post`.
- **Geprüft per Nahsicht** an allen vier Figuren: Mumie B, Mumie A (Augen im Band), Witch (hinter der Brille), Orc Brute (Rig_Large).
- **Offen:**
  - Der Ladeweg ist ungepinnt (Branch statt Commit), bis die Dateien auf main liegen.
  - Der Mund (PetMouth) ist nicht gesetzt.
  - Alle übrigen Figuren behalten ihre Originalaugen, bis eine zweite Charge da ist.

## Offen

- Dünen und Steinbrocken: kein Pack-Asset, weggelassen.
- Mummy_A steht im massiven Sockel, sie sitzt nicht.
- Deckel- und Krug-Lagen sind Bildabgleich, nicht gemessen.
- `tools/prop-qa.html?resident=mummy` noch nicht gelaufen.
- Nicht in ENSEMBLE aufgenommen — erst nach PASS.

## Gate

Georg: **PASS / TUNE / REJECT** auf die Scenelet-Grammatik. Danach dieselbe Grammatik für die nächsten Kandidaten.
