# github.md

repo: georg-doc/kayfabizarro
branch: main
path: media/3D_Assets

## Last sync

date: 2026-08-29T21:45:00Z

### Updated in this project

- **Rolli geschlossen, nicht weiterentwickelt.** Sechs Korrekturrunden an einer falschen
  Konstruktion (Cube-Pet-Gesichtsteile auf `media/3D_Assets/Toilet Paper Roll.glb` plus
  Verlet-Tuch für ein gerade hängendes Blatt). Das Blatt ist jetzt ein flaches weißes Rechteck
  (`SPEC.paper.mode = 'flat'`, Oberkante 0,0094 innerhalb des Rollenradius, Abweichung aus der
  Senkrechten 0,000000, Zittern 0,00000000). Lehren in
  `docs/petstudio-v10/POST_MORTEM_rolli_v10.md`. **Rolli geht in WS1 neu, als eigenes Modell.**
- **Recherchi v4 ins Projekt geholt** (`recherchi-v4/`, 8 Dateien, 371 KB) — aus Georgs lokalem
  Re-Home-Paket, **kein Byte geändert**. Nicht in das Studio hineingebaut: Recherchi lädt
  **three 0.185 webgpu** von unpkg und `three-html-render/polyfill` von jsdelivr, das Studio hält
  seine eigene three-Instanz — zwei Instanzen wären das zweite System, vor dem seine eigene Spec
  warnt. Art-Eintrag als **Entwurf** unter `contracts/recherchi.pet.json` (gegen
  `pet-LIBRARY.json` 0.4.3; nicht einspielen, ohne `version` zu zählen).
- **Fix-Kandidat aus dem Paket übernommen, nicht ausgeführt:** `recherchi-v4/assets/doccheck-doc.png`
  hängt an einem relativen Pfad; kanonisch wäre eine RAW-URL im Repo. Datei liegt daneben, läuft.
- Kein Repo-Pfad geändert, `media/3D_Assets` unberührt. Weiter offen: **`kfb-pets.v5.json` 1.2.7**
  muss nach `media/3D_Assets/` (dort liegt 1.2.6).

### Vorherige Runde (29.08., 07:10)

date: 2026-08-29T07:10:00Z

### Updated in this project

- **Rolli ist Bewohner von Pet Studio v10, mit dem Gesicht der Pets.**
  `petstudio-v9/KFB Pet Studio v10.dc.html` (Fork von v9) trägt ihn in derselben Liste wie die 24
  Pets; Augen und Mund kommen aus **denselben** Bausteinen (`_buildEyeRig`, `PetMouth`), das Modul
  liefert nur die Flächen. Modell zur Laufzeit aus dem Repo
  (`media/3D_Assets/Toilet Paper Roll.glb`, Zweitquelle `kayfabizarro.pages.dev`), rote Lippen aus
  `media/3D_Assets/Textures/FrizzleBob-RedMouth_01/`, Augenrig lokal aus
  `studio-v3/pet-eye-rig.v5.js`.
- **Befund am Repo-Modell, für künftige Requisiten wichtig:** `Toilet Paper Roll.glb` hat drei
  Meshes — `_1` Pappkern, `_2` Rolle **mit angehängtem Blatt**, `_3` Wandhalter. Das Blatt sind
  10 von 62 Dreiecken und reicht bis Radius 0,216 bei Rollenradius 0,115; wer das simulierte Blatt
  daneben hängt, sieht zwei. Getrennt wird nach Dreiecks-**Schwerpunkt**, nicht nach Eckpunkt.
- **⚠ Zurückgezogen (früher am selben Tag):** meine Meldung »im Repo liegt kein GLB der Klo-Rolle«
  war falsch. Ursache: die Verzeichnisabfrage listet nur **einbindbare** Dateien — GLB ist keine
  davon, und ich habe aus ihrem Schweigen einen Befund gemacht. Die Regel dagegen steht wörtlich in
  `media/3D_Assets/ASSETS.md`: *ein Manifest ist eine Behauptung, der Live-Abruf der Beweis.*
  **Für jeden künftigen Chat: Existenz eines Modells nie über eine Verzeichnisliste prüfen, immer
  über den Abruf der Adresse.**
- Kein Repo-Pfad geändert, `media/3D_Assets` unberührt.

### Vorherige Runde (29.08., 05:40)

date: 2026-08-29T05:40:00Z

### Updated in this project

- **Rolli ist Bewohner von Pet Studio v10.** `petstudio-v9/KFB Pet Studio v10.dc.html` (Fork von v9)
  trägt ihn in derselben Liste wie die 24 Pets; das Modell wird zur Laufzeit aus dem Repo geladen
  (`media/3D_Assets/Toilet Paper Roll.glb`, Zweitquelle `kayfabizarro.pages.dev`), das Augenrig kommt
  lokal aus `studio-v3/pet-eye-rig.v5.js`, die roten Lippen zur Laufzeit aus
  `media/3D_Assets/Textures/FrizzleBob-RedMouth_01/`. Am Bild abgenommen:
  `captures/studio-v10/rolli-im-studio.png`, GLB-Quelle `Repo (raw)`.
- **Aus Georgs Sitzungs-Export übernommen:** `studio-v10/KloRolli.js` (dort vervollständigt: baut
  jetzt alle fünf Teile), die Bühne als Referenz, seine Übergabe und Projektregeln nach
  `docs/petstudio-v10/`.
- Kein Repo-Pfad geändert, `media/3D_Assets` unberührt.

### Vorherige Runde am selben Tag (04:35)

date: 2026-08-29T04:35:00Z

### Updated in this project

- **⚠⚠ Zurückgezogen, noch am selben Tag:** ich hatte gemeldet, im Repo liege kein GLB der Klo-Rolle.
  **Falsch.** Es liegt unter `media/3D_Assets/Toilet Paper Roll.glb` (13.428 Bytes), dazu ein ganzes
  Bad (Zahnbürste, Badewanne). Ursache: meine Verzeichnisabfrage listet nur **einbindbare** Dateien
  (Bilder, Schriften) — GLB ist keine davon, und ich habe aus ihrem Schweigen einen Befund gemacht.
  Die Regel dagegen steht wörtlich in `media/3D_Assets/ASSETS.md`: *ein Manifest ist eine Behauptung,
  der Live-Abruf der Beweis.* **Für jeden künftigen Chat: Existenz eines Modells nie über eine
  Verzeichnisliste prüfen, immer über den Abruf der Adresse.**
- Folge: `petstudio-v9/studio-v10/rolli-body.v1.js` ist ein **Ersatzkörper**, und die
  Geometrie-Zahlen des Prüfstands gelten nicht für Rolli. Körperunabhängig bleiben: der
  Träger-Befund am Augen-Bauteil, das `facing`-Feld im Vertrag, die drei Messfunktionen.
- Zur Laufzeit aus dem Repo geladen (unverändert, keine Kopie): die Mund-Bildwerke aus
  `media/3D_Assets/Textures/FrizzelBob-Mouth_01/`. Gemessen: geladen, Seitenverhältnis **1,621**.
- Kein Repo-Pfad geändert, `media/3D_Assets` unberührt.

### Vorherige Runde (29.08., früher)

date: 2026-08-29T04:20:00Z

### Updated in this project

- **Gelesen, nichts kopiert** (Pet Studio v10, Scheibe 2): das Repo nach dem GLB der Klo-Rolle
  durchsucht — **⚠ dieser Punkt ist oben zurückgezogen, das GLB liegt im Repo.**
- Zur Laufzeit aus dem Repo geladen (unverändert, keine Kopie): die Mund-Bildwerke aus
  `media/3D_Assets/Textures/FrizzelBob-Mouth_01/` über die RAW-Adresse in
  `petstudio-v9/studio-v3/pet-mouth.v1.js`. Gemessen: Bild geladen, Seitenverhältnis **1,621**.
- Kein Repo-Pfad geändert, `media/3D_Assets` unberührt.

### Vorherige Runde (28.08.)

date: 2026-08-28T22:00:00Z

### Updated in this project

- **Pet Studio v9 nach WS0 geholt** — **66 Dateien** aus
  `skills/KFB PetStudio/KFB Pet Studio v9/pet-studio-v9_2026-08-28_ws0-rehome/` in den eigenen Ordner
  `petstudio-v9/`. Kein vorhandener Pfad geändert, SpinballCast unberührt (Georgs Option A).
- Danach auf **v9-1** nachgezogen (7 Dateien, darunter drei, die in der Ankündigung nicht standen:
  `README_REHOME_WS0.md`, `docs/CHANGELOG_studio.md`, `docs/HOUSEKEEPING_root.md`).
- Gegen `LADEWEG.tsv` gerechnet: **65 von 68 byteidentisch**, 0 Größenabweichung,
  1 Inhaltsabweichung (`MANIFEST_v9_rehome.md`: Länge gleich, Prüfsumme nicht),
  **2 Dateien liegen im Repo-Export nicht** (`KFB Pet Studio v9 - standalone.html` 5,1 MB und
  `tools/check-loadpath.mjs`).
- Berichtigt: `pet-LIBRARY.json` **fehlte nicht im Paket** — meine Verzeichnisabfrage war zu flach
  (Tiefe 1 sieht `studio-v3/`, nicht `studio-v3/PET_EDITOR/`). Der fehlende Vertrag war die Ursache
  der fleckigen Oberfläche und der Ersatz-Augen.
- Sieben Dateinamen liegen dadurch **doppelt** im Projekt, in verschiedenen Fassungen — Tabelle in
  `petstudio-v9/README_re-home_WS0_2026-08-28.md`, welche Fassung für wen gilt.
- Aus dem Repo gelesen: `skills/session-entry-use-what-works_v1.md` (Arbeitsregeln gegen Nachbauen).
- **Eintrittspapier für SpinballCast v5** geschrieben, ohne Code: dreizehn Stücke mit Datei und Zeile,
  Beweislage und Naht je Stück; fünf Dateien als noch ungelesen markiert; ein Stück als unbewiesen
  (die Schrift auf der Klinge war in ihrer Quelle abgeschaltet).

### Vorherige Runde (27.08.)

- Sitzungs-Vorlage auf **Fassung 1.1** gehoben und im Repo unter `skills/session-design-briefing.md`
  abgelegt (ohne Versionsnummer im Namen = kanonische Adresse). Lokale Kopie identisch.
- Drei Änderungen gegen 1.0: Optionen sind Pflicht statt verboten · messen → verstehen → Grenzfälle
  → bauen als feste Reihenfolge · nichts als Beleg, was Georg nicht vor sich hat.
- Nachtrag am gelesenen Repo-Stand gefunden: der Kopf der Datei zeigte noch auf die alte Adresse
  `…_v1.md` — ein frischer Chat hätte Fassung 1.0 geladen. Lokal korrigiert, muss zurück ins Repo.
- Vierte Regel neu: Dateien werden als anklickbare Karte übergeben, nicht als Pfad im Fließtext.
- Kein Code und kein Asset aus dem Repo geändert; `media/3D_Assets` unberührt.

### Vorherige Runde

- `spinballcast-v3/glb-silhouette.v1.js` liest `arunangshubanerjee-yellow-scissors-2083.glb` binär
  (eigener GLB-Parser, kein three.js) und misst die echte Scherensilhouette.
- Die zwei Hälften stecken in EINER Mesh — Trennung über `splitComponents()`, portiert aus
  `spinballcast-v1/scissors.v3.js` (sbp-v3, Zeilen 1362–1385).
- Zurückgezogen: eine frühere Erklärtafel hatte die Klingenform erfunden und daraus 0,19 abgeleitet.
  Gemessen sind 0,82 (linke Hälfte) bzw. 0,56 (rechte) Überstand über den Kollider.
- Das GLB liegt NICHT im Projekt (Binärkopie schlug fehl) — die Seite lädt es zur Laufzeit von
  `raw.githubusercontent.com`. Ohne Netz kein Bild und keine Zahl, bewusst kein Ersatzumriss.

## Screen map

| Screen | Gebaut aus |
|---|---|
| `KFB Scherengeometrie gemessen v1.dc.html` | `media/3D_Assets/arunangshubanerjee-yellow-scissors-2083.glb` (zur Laufzeit geladen) · `spinballcast-v1/scissors.v3.js` (lokal, Ausrichtkette + Feldzahlen) |
| `KFB Flipper Contact Lab v1.dc.html` | `spinballcast-v1/scissors.v3.js` (Feldzahlen wörtlich) |
| `KFB Column Solver Lab v1.dc.html` | `cardbuilder/kfb-card-format.js` (`CARD_AR 1.74`, über den v3-Export gelesen) |
| `KFB Kameramodell Lab v1.dc.html` | eigene Geometrie; Kartenformat aus `cardbuilder/kfb-card-format.js`, Feldzahlen aus `spinballcast-v3/flipper-contact.v1.js` |
| `KFB SpinballCast v5 Eintrittspapier.dc.html` | `skills/session-entry-use-what-works_v1.md` (Arbeitsregeln) · Bestandsaufnahme der lokalen Module in `studio-v3/`, `podcast-v5/`, `spinballcast-v3/`, `spinballcast-v4/`, `ws1-buehne/` |
| `petstudio-v9/KFB Pet Studio v9.dc.html` (+ 65 Dateien) | `skills/KFB PetStudio/KFB Pet Studio v9-1/pet-studio-v9_2026-08-28_ws0-rehome/` — unverändert übernommen, geprüft gegen `LADEWEG.tsv` |
| `petstudio-v9/KFB Pet Studio v10.dc.html` | Fork von `petstudio-v9/KFB Pet Studio v9.dc.html` · Modell zur Laufzeit `media/3D_Assets/Toilet Paper Roll.glb` (Zweitquelle `kayfabizarro.pages.dev`) · Mund-Bildwerke `media/3D_Assets/Textures/FrizzleBob-RedMouth_01/` · Augenrig lokal `studio-v3/pet-eye-rig.v5.js` · Rolli-Modul lokal `studio-v10/KloRolli.js` (**FROZEN**) |
| `recherchi-v4/Recherchi v4.dc.html` (+ 7 Dateien) | Georgs lokales Paket `recherchi-v4_2026-08-29_rehome/` — unverändert übernommen. Laufzeitquellen: three 0.185.1 (unpkg), `three-html-render/polyfill` (jsdelivr), Roboto (Google Fonts). **Kein Repo-Asset** |
| `KFB Rolli Gesicht v1 Pruefstand.dc.html` | ⚠ eigene **Ersatz**geometrie (`petstudio-v9/studio-v10/rolli-body.v1.js`) — gebaut unter der falschen Annahme, es liege kein Rollen-GLB im Repo; das echte ist `media/3D_Assets/Toilet Paper Roll.glb`. **DEAD.** Gesichts-Bauteile lokal aus `petstudio-v9/studio-v3/` (`pet-eye-rig.v5.js`, `pet-mouth.v1.js`), Mund-Bildwerke zur Laufzeit aus `media/3D_Assets/Textures/FrizzelBob-Mouth_01/`, Grundplatte `media/kfb/KayfaBizarro_Card_Backside_01_lowrez.png` |
