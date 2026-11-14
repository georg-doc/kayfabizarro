# WSB_REIHE_R1 · Auftrag 2 · Würfelmonster-Beleg (V-1705) · RETURN

WSB (Mac mini), 14.11.2026. Brief §2, Konzeptblatt `replies/WSB_REIHE_R1/KONZEPTBLATT.md`. Spielstand gelesen: `game/integration-r2` @d3e8cdf0 (`src/data/npc/fluffer.kinds.k15.json`, 15 Arten). Nichts ins Spiel eingebaut, nichts gepusht.

## Grundlage
- **Karten:** die abgenommenen q_-Figurenkarten K15 r3 (`50_BLENDER/K15/data/kfb/q_<art>.figure.json`, V-666) mit den Modellen `K15/cubes_kfb/KFB_<Art>_kfbeyes.k11c.glb`.
  - Die Augenwerte sind unverändert (V-664, V-666).
- **Befallen:** eye-goo v1.1 `set('red')` mit schwarzem Augapfel, rot leuchtender Pupille und Lichthof (Bühnenzustand `rest_goor`).
- **Geheilt:** KFB-Auge weiß mit dunkler Pupille (`rest`).
- **Knete nachher:**
  - kfb-clay v1.1 Profil character, dazu die Werte kit-figure aus dem Spiel (`src/look/clayKit.js`, V-662: Lump 0,12/0,22, Dent 0,045/0,2, Dent2 0,1/0,24, maxSlope 0,5).
  - Paletten-Zug 0,18 (= MAX_PULL, V-340) zur Welt-Palette terrain3 mesa, so wie M1World die Kit-Figuren zieht (KIT_PAL).
  - Gleiche Werte für alle Arten, Atlas unverändert.
  - Karten: `karten/q_<art>.kitclay.figure.json` (Kopie der r3-Karte plus `material`).
- **Bühne:** eigene Kopie `50_BLENDER/WSB_REIHE_R1/stage/` (N35 v1.2, N35 unverändert). Sie liest die Karten-Felder `material.clayKit` und `palette/pull` als Option und kann den Weißanteil messen (`--eye-white`).
  - Das Protokoll hält kit und Zug fest (`render.clay.kit`, `palettePull`).

## Rückgabe
- **15 Blätter** `blaetter/A2_<art>.png`, Kamera vorn. Je Blatt fünf Felder:
  1. K11-Geist geheilt als Pflicht-Referenz
  2. befallen vorher
  3. befallen nachher
  4. geheilt vorher
  5. geheilt nachher
- Übersicht: `blaetter/A2_alle_15_nachher.jpg`.
- **Weißanteil im Code** (`blaetter/A2_weissanteil.json`):
  - Gemessen wird dieselbe Bildmessung für Golden und Arten: Augen unbeleuchtet mit eigener Farbe, weiß gegen dunkel.
  - K11-Geist (Golden): 0,391. Regel: geheilt mindestens 0,85 × Golden (V-589, V-659).
  - Alle 15 PASS (0,850–0,887). Befallen 0,000 (schwarz) bei allen.
- **Gates:** 30 Läufe (15 vorher, 15 nachher), alle PASS (G1–G6).
  - G3 nur mit Anhebung je Art (`data/lift_je_art_cm.txt`, 1,3–10,3 cm). Die Würfel sinken wie in K15 ein.
  - Die Referenz K11-Geist hat G1 und G5 FAIL. Sie ist nur ein Bild: Ihre Augen sind eine Texturkappe ohne Rig.

## Arten mit Augen-Befund
| Art | Augen (Anzahl, Sitz) | geheilt | Weißanteil | Regel | befallen | Knete vorher→nachher (mittlere Pixeldifferenz / Anteil > 8) | Anhebung cm |
|---|---|---|---|---|---|---|---|
| alien | 2 KFB-Augen, korrekt | weiß, Pupille dunkel | 0.875 | PASS | schwarz/rot (0) | 0.89 / 1.8 % | 1.6 |
| alien_tall | 2 KFB-Augen innen korrekt; 2 Kit-Augen außen bleiben schwarz (doppelt, aus K15 r3 bekannt) | weiß, Pupille dunkel | 0.880 | PASS | schwarz/rot (0) | 0.62 / 0.8 % | 2.58 |
| cactus | 2 KFB-Augen, korrekt | weiß, Pupille dunkel | 0.885 | PASS | schwarz/rot (0) | 0.89 / 3.3 % | 10.28 |
| chicken | 2 KFB-Augen, korrekt | weiß, Pupille dunkel | 0.875 | PASS | schwarz/rot (0) | 0.45 / 0.7 % | 1.72 |
| crab | 2 KFB-Augen, korrekt | weiß, Pupille dunkel | 0.861 | PASS | schwarz/rot (0) | 0.41 / 0.9 % | 1.77 |
| cyclops | 1 KFB-Auge (Zyklop), korrekt | weiß, Pupille dunkel | 0.874 | PASS | schwarz/rot (0) | 0.8 / 2.1 % | 1.89 |
| deer | 2 KFB-Augen, korrekt | weiß, Pupille dunkel | 0.865 | PASS | schwarz/rot (0) | 0.64 / 1.1 % | 2.47 |
| demon | 2 KFB-Augen, korrekt | weiß, Pupille dunkel | 0.872 | PASS | schwarz/rot (0) | 0.71 / 2.0 % | 3.2 |
| greendemon | 2 KFB-Augen, korrekt | weiß, Pupille dunkel | 0.872 | PASS | schwarz/rot (0) | 0.78 / 0.9 % | 2.73 |
| mushroom | 2 KFB-Augen, korrekt | weiß, Pupille dunkel | 0.870 | PASS | schwarz/rot (0) | 0.78 / 1.4 % | 1.38 |
| panda | 2 KFB-Augen, korrekt | weiß, Pupille dunkel | 0.858 | PASS | schwarz/rot (0) | 0.53 / 1.2 % | 1.83 |
| penguin | 2 KFB-Augen, korrekt | weiß, Pupille dunkel | 0.875 | PASS | schwarz/rot (0) | 0.45 / 1.5 % | 1.72 |
| pig | 2 KFB-Augen, korrekt | weiß, Pupille dunkel | 0.850 | PASS | schwarz/rot (0) | 0.84 / 1.5 % | 10.28 |
| tree | 2 KFB-Augen, korrekt | weiß, Pupille dunkel | 0.887 | PASS | schwarz/rot (0) | 0.29 / 0.2 % | 2.51 |
| yeti | 2 KFB-Augen, korrekt | weiß, Pupille dunkel | 0.853 | PASS | schwarz/rot (0) | 0.94 / 1.5 % | 1.26 |

Dokumentiert sind nur Profil, Seed und Paletten-Zug:
- Profil character mit den kit-figure-Werten.
- Seed `kfb_q_<art>`.
- Zug 0,18 zur Palette mesa `#f0c58a #e6a061 #cc6c42 #a54d38 #f3d9b0 #8c3f2f #3fa7a0`.

## Befunde für WS0
1. **Der Claymation-Look ist kaum zu sehen.**
   - Vorher und nachher unterscheiden sich im Mittel um 0,3–0,9 von 255 Stufen. Weniger als 3,4 % der Pixel ändern sich um mehr als 8 Stufen.
   - Die dunkle, graue Textur bleibt dunkel und grau, sichtbar bei Panda, Pinguin, Baum und Yeti.
   - Ursache:
     - Erlaubt sind höchstens 18 % Paletten-Zug (V-340). Die kit-figure-Werte vergrößern nur die Knet-Beulen.
     - Das Konzeptblatt verlangt dagegen: „Knete ersetzt die dunkle graue Monster-Textur durch die Kartenfarbe mit Knet-Struktur“.
     - Das geht nur mit Atlas-Tausch (verboten: „kein Übermalen des Atlas“) oder mit mehr Zug als MAX_PULL.
   - Entscheidung WS0/Georg: mehr Zug (Ausnahme von V-340), eine Kartenfarbe pro Art (Bemalung tauschen wie V-824/V-829), oder so lassen.
2. **Form der geheilten Augen weicht vom K11-Golden ab.**
   - Der Geist hat eine große schwarze Pupille mit Glanzpunkt (Weißanteil 0,39).
   - Die r3-Würfel haben eine kleine Pupille 0,30 (Weißanteil 0,85–0,89). Weiß ist es, und die Regel „nicht dunkler als Golden“ ist erfüllt.
   - „Gleiche Form“ trifft aber nicht zu. Nach WS0-Klarstellung behalten die r3-Würfel ihre Augenwerte; daher nicht geändert.
3. **Alien groß:** Die zwei äußeren Kit-Augen bleiben schwarz, geheilt wie befallen (aus K15 r3 offen).

## Kritiker (CRITIC_3D_R1, Figurenabnahme) · STOPP-BERICHT
| Runde | Stand | K4 | K6 | K10 | Mittel | Urteil |
|---|---|---|---|---|---|---|
| R1 | Ordner `blaetter/`, nur vorn, Ausschnitt | 5 | 5 | 6 | 5,3 | REWORK |
| R2 | Ordner `r2/blaetter/`: ganze Figur, seitlich, Gesicht nah, Augen zu, befallen nah, Fuß nah, Clip Idle | **8** | **7** | 6 | 7,0 | REWORK |

**R1 → R2 behoben:**
- Fehlende Kameras sind ergänzt (seitlich, Gesicht nah, Fuß nah).
- Der Bodenkontakt ist jetzt sichtbar: ganze Figur statt Ausschnitt.
- Lidschlag und Idle-Pose sind belegt.
- Die Beschriftung der Schwelle ist klarer: 0,333 = 0,85 × Golden 0,391. Der Kritiker hatte beim Schwein 0,850 gegen den Faktor 0,85 gelesen.

**Offen, außerhalb meiner Grenzen.** Die Augenwerte der r3-Karten bleiben (WS0-Klarstellung), der Atlas bleibt unverändert; deshalb Stopp:
1. **Alien groß (K10, „Immer ein Befund“):** Die zwei äußeren Kit-Augen sind schwarz, ohne Lid und ohne Heilung. Lösung bräuchte zwei weitere Anker mit KFB-Augen. Georg hatte 22.10. „mehrere Augen je Figur ins Backlog“ gesagt.
2. **Lidfarbe heller als der Kopf** bei Hirsch, Pilz und Baum; beim Alien groß gleich hell wie der Kopf (K10). Die Lidfarben stammen aus den r3-Karten (K15: „Hautton seitlich am Auge“).
3. **Grau als Hauptfläche** bei Panda und Pinguin, dazu eine graue, halbtransparente zweite Hülle beim Yeti (K6). Das ist der Original-Atlas bzw. das Original-Modell. Siehe Befund 1: Mit erlaubtem Zug ändert die Knete das nicht.

**Gültiger Stand ist R2:** `r2/blaetter/` (15 Blätter plus `A2_weissanteil.json`, alle PASS) und `r2/proof/<art>/` (30 Läufe Gate PASS).

## Dateien
- `karten/`
- `blaetter/`
- `proof/<art>/vorher|nachher/`: Einzelbilder, Kontaktbogen, Protokoll und `eye_white.json`
- `proof/ref_k11_geist/`
- `data/`
- `scripts/`
