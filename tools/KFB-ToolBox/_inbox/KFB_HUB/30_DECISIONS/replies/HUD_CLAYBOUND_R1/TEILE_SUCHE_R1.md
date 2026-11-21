# HUD Claybound R1 – Teile-Suche (zu KRITIK_BLIND_R1)

Stand 21.11. Nur gesucht, vermessen und zugeordnet. Nichts verändert, nichts generiert. Keine Datei war online-only (0 Byte).
Maße = Alpha-Bounding-Box (α ≥ 128) in Originalpixeln. Koordinaten `x,y,w,h` gelten innerhalb der jeweiligen Ebene bzw. des jeweiligen Bogens.
Faustregel: Ein Teil passt, wenn Originalbreite ≥ Bildschirmbreite am Zielplatz (Faktor ≤ 1,0). Beim heutigen Faktor 0,72 braucht es Bildschirmmaß ÷ 0,72.
Nummernkarten zu allen Bögen (Teil-Nummer = `#n`): `TEILE_SUCHE_R1_vorschau/00_nummern_*.jpg`.

## Wichtigster Fund
Die Bögen, aus denen die obere Papierleiste stammt, liegen **vollständig als ausgeblendete Ebenen in**
`KFB Claymation Reference/KFB HUB Skins + UI/KFB Paper HUD 05.psd` (64 MB). Als einzelne PNG gibt es sie nirgends; die 30 PNGs in `KFB Paper HUD 05 GvW/` sind nur Ausschnitte daraus. Mit Pillow lassen sich die Ebenen nicht lesen; ich habe sie zum Vermessen mit einem eigenen Leser nur in den Scratch-Ordner gelesen. Für einen Einbau oder einen ChatGPT-Upload sollte jemand die Ebenen in Photoshop als PNG exportieren.

## Leit-Serie: „Washi-1448“ (ein Lauf, vier Bögen à 1448×1086, echte Transparenz)
| PSD-Ebene | Kürzel | Inhalt |
|---|---|---|
| Ebene 38 | L39 | Slotleisten mit 1 bis 7 Slots, Einzelslots (quadratisch, achteckig, in Farbvarianten), Reiterleisten, Schalter, Kästchen, Regler, kleine Knopfplatten (X, Haken, +, −, Pfeile, Menü, Liste, Vollbild), Titel-Banner, Etiketten |
| Ebene 40 | L41 | Medienknöpfe (Play, Pause, Stopp, Spulen, Liste, Laut, Leise, Stumm, Zufall, Neu, Zahnrad, Funk), Equalizer, lange Streifen, Fuji-Platte, Radio-Ring, Wegweiser-Bänder |
| Ebene 51 | L43 | große Flächen, runde Plaketten, Ecken, Anhänger, Rosetten, Streifen. **Achtung: weißer Schleier mit α ≈ 20–40 über dem ganzen Hintergrund. So nicht brauchbar, erst freistellen.** |
| Ebene 23 (= Ebene 35, identisch) | L17 | Leisten mit Symbol-Kappe, Thermometer, Kompassring, Segmentring, Wolkenring, kleine Ringe, Ecken, Bänder, Equalizer-Felder |

Stil: gerissenes Washi-Papier in Creme auf mehrlagigen Unterlagen in Rot, Blau, Gelb und Salbei, mit Wolken-, Wellen- und Sonnenstrahl-Motiven; Licht und Kante sind auf allen vier Bögen gleich.
Im HUD stammen heute schon 1:1 von hier: `pap_fuji`, `pap_radio`, `pap_streifen`, `band_*` (alle L41) sowie `pb_*` (L41, verkleinert).

**Partner-Serie „Washi-1536“** (gleiches Motiv-Vokabular, aber eigener Lauf; nur für Elemente, die die Leit-Serie nicht hat, und dann das ganze Element daraus):
- **Ebene 1 (L01)**: sauber freigestellt. Enthält Kompass, Kartenscheibe, Checkliste, Notizbuch, Kartenstapel, Funk-Säule, Wimpel, Ort, Haus, Hilfe usw. („Ebene 1 Kopie“ ist derselbe Bogen mit herausgeschnittenen Teilen.)
- **Ebene 7 (L31)**: Geschwister-Bogen mit Schleier. Von hier kommen `pap_hp` und `pap_tempo`, die obere Leiste mischt also schon zwei Läufe.
- **Ebene 33 (L09)**: flachere Variante.
- **Ebene 5**: eingebrannter Hintergrund, unbrauchbar.

Fremd zur Leit-Serie:
- **Ebene 16 (L12)** und **Ebene 21 (L14)**: Pastell-Lauf (Papier bzw. Pastell-Knet-Symbole).
- **Ebene 12**: Knet-Papier-Hybrid, identisch mit `KFB HUD v5/Clay-Abenteuer-Spieloberflächen-Sprite-Sheet-2 (1).png`.

## Tabelle je Element (Nummern wie in der Kritik-Gesamtliste)
Zielmaße sind aus den Screenshots geschätzt (Bildschirm-px bei 1600×900).

| # | Element | Fundstelle (Ebene · Teil · x,y,w,h) | Serie | Maße | passt | Bemerkung |
|---|---|---|---|---|---|---|
| 1 | Großer Fenstergrund | größte Flächen: L43#2 `214,11,599,152`; L43#6 `703,161,477,173`; L41#0 `12,9,858,138`; L01#5 `160,154,616,245`; L01#13 `139,613,647,192` | Leit / Partner | max. 858×138 bzw. 616×245 | **zu klein** | Bedarf Truhe 1180×445, Settings 1240×700 (bei 0,72 sogar 1640×620 bzw. 1720×970). Ecken (L17#83–87, L43#33–34) und lange Streifen (L43#19–26) sind vorhanden, aber nicht geprüft kachelbar. Ohne Test keinen 9-Slice empfehlen. Siehe `05_…png`. |
| 2 | Palettengrund (Ausklapp-Leisten) | L39#0/#5/#13/#15/#23/#26/#28 = Leiste mit 1–7 Slots (`20,14,268,83` … `18,515,534,65`); L39#32 = 4 Rundslots `1031,486,332,78` | Leit | Slots darin ≈ 58 px | **zu klein** bei heutigen 80-px-Slots | Passt 1:1, wenn die Flyout-Slots auf ≈ 58 px schrumpfen. Für das 2×4-Raster (Rucksack) und die senkrechte Playlist gibt es keinen Grund: fehlt. |
| 3 | Slot- bzw. Fachplatte 1:1 | L39#2 blau `1030,14,100,102`; #3 gelb `1143,15,99,101`; #4 rot `1255,14,107,102`; Achtecke #9–#11 (≈ 92×96) | Leit | ≈ 100×100 | ja (für 80er Slot) | leer/belegt = #2, aktiv = #3 (gelber Rand). Gesperrt fehlt (kein Schloss im Lauf). |
| 4 | Titel-Lasche bzw. Banner | L39#85 `18,1002,252,63`; #86 `292,996,235,69`; #89 `952,1000,231,71`; L17#55 `1024,641,199,62` | Leit | 164–252 × 62–78 | ja | Für kurze Titel bis etwa 250 px. Nicht die `band_*`, die gehören zu den Wegweisern. |
| 5 | Schließen-X | L39#55 `389,780,71,62` | Leit | 71×62 | ja | Bei 0,72 sind es 51×45. |
| 6 | Primärknopf (Annehmen/Herstellen) | L39-Etiketten #35 `22,601,208,65`, #36 `247,600,198,65`, #38 `674,601,158,62` | Leit | ≈ 200×64 | bedingt | Das sind Etiketten, keine ausgewiesenen Knöpfe; Zustände nur über Farbvarianten. Ein echter großer Knopf mit Zuständen fehlt. |
| 7 | Ausklapp-Pfeil | L39#49 ^ `750,779,70,62`; #50 v `841,779,68,62` | Leit | 70×62 | ja | Ersetzt den orangen Kreis `chev2`. |
| 8 | Ein/Aus-Schalter, Reiter | Schalter L39#70 aus `825,866,92,44`, #71 an `942,866,96,43`; Kästchen #72/#73; Regler #76 `17,927,310,51`; Reiterleisten L39#24 `545,359,401,66`, #27 `545,443,405,55` | Leit | s. Spalte Fundstelle | Schalter ja · Reiter bedingt | Die Reiterleisten haben nur 3 Reiter, die sich überlappen und nicht einzeln lösbar sind; Settings braucht 6. |
| 9 | Symbolsatz Menü/Pause | L41: Pause #11 `186,478,122,124`, Vorspulen #14, Liste #15, Laut #16, Neu #20 `178,619,131,123`, Zahnrad #21; L39: Vollbild #59 `934,781,66,61`, Liste #62 | Leit | 66–150 px | teilweise (7 von 12) | Fehlen im Lauf: Ort, Buch, Haus, Hilfe, Schraubenschlüssel. In der Partner-Serie gibt es Ort L01#37, Haus #38 und Hilfe #19, aber das wäre ein anderer Lauf und als Mischung im Pause-Menü verboten. `wim_wrench` ist ein Wimpel, also fremder Zusammenhang. |
| 10 | Zahnrad mit Platte | L41#21 `324,619,132,123` | Leit | 132×123 | ja | Dasselbe Teil wie `pb_zahnrad` (heute verkleinert auf 103×96). |
| 11 | Sockel unter Fäusten, Rucksack, Stiefel | L39#2–#4 (≈ 100) · L43#10 `691,350,172,168`, #11, #12 | Leit | 100 bzw. ≈ 170 | L39 zu klein · L43 bedingt | Die Symbole sind ≈ 110 px breit, der Sockel braucht ≈ 140–170. L43 hat die richtige Größe, aber den Schleier. |
| 12 | Porträtrahmen bzw. Plakette | L17#19 Wolkenring `903,393,163,162`; L43 runde Plakette `1210,404,226,225` (Schleier) | Leit | 163×162 | ja (L17#19) | Kopf ≈ 140 px. Der Porträtrahmen in L01#9 hat eine eingebrannte Silhouette und ist unbrauchbar. |
| 13 | Cooldown/Leer-Zustand Faust | L17 Segmentring `728,390,≈155,165` aus 6 einzeln freistehenden Segmenten | Leit | ≈ 155 | bedingt | Saubere Form; Fortschritt nur in 6 Stufen. Ein stufenloser Zustand fehlt. |
| 14 | Kompassring + Innenfläche + Marker | Ring mit 4 Spitzen L17 `544,383,180,181` | Leit | 180×181 | teilweise, zu klein | Der Kompass ist heute ≈ 250 px; bei ≤ 1,0 müsste er auf 180 schrumpfen. Innenfläche und Marker (Ziel, Spieler, Richtung) gibt es im Lauf nicht. Partner L01#7 hat die Rose eingebrannt, L01#8 Kartenscheibe `1285,136,239,240` hat ein rotes X eingebrannt: beide unpassend. |
| 15 | Symbol für „55“, lila Kolben-Banner | Wimpel L01#3 `1125,12,407,110` (5 Fahnen à ≈ 80×110) | Partner | 73×105 (`wim_flask`) | kein Bildteil-Problem | Nicht hochskaliert: Das Banner ist im HUD ≈ 65 px breit. Offen ist die Bedeutung („55“, Kolben), das ist eine Inhaltsfrage. |
| 16 | Wegweiser-Rohlinge | L41#31–#35 = heutige `band_*` (1:1 verifiziert), z. B. #33 `585,854,284,55`; Richtungspfeil L39#51 `<` / #52 `>` | Leit | ≈ 270×55 | ja | Dasselbe Band dreimal nehmen: gleiche Breite, gemeinsame linke Kante. Die Richtung als eigenes Pfeilteil daraufsetzen, nicht spiegeln (sonst kippt das Licht). |
| 17 | Einheitliche Item-Symbole | `Gemeinsame-Spiel-Icons/hero_*` (Faust 478×605, Bombe 440×541, Blaster 568×437, Granate 466×567); Pastell-Knet L14 (Ebene 21): Schwert, Jetpack, Rakete, Rucksack, Truhe, Karten, Fluff-Kugel, Fuß (166–256 px) | zwei fremde Serien | – | **fehlt** | Keine Serie deckt alle 13 ab. Es fehlen Granate/Bombe/Blaster in L14, außerdem Minigun, Raketenwerfer, Fahrzeuge, Schraubenschlüssel und Stiefel. Knet-3D und Papier-Washi sind ohnehin getrennte Ebenen. |
| 18 | Kartensymbol | L01#11 Kartenstapel `1150,391,244,236` | Partner | 244×236 | bedingt | Nur in der Partner-Serie. Ein KFB-Kartenrücken liegt nicht in den Suchordnern. |
| 19 | Seltenheitszeichen | Rosetten L43#42 `987,847,95,96`, #43 (Schleier); L17#24 Blütenring 82×80 | Leit | ≈ 95 | bedingt | Einen Stern gibt es nur in der Partner-Serie (L01#35, 54×54). |
| 20 | Orts-Vorschaubilder | `KFB Claymation Scenes + HUD/W01–W04_*.png`, `DS01–DS04_*.png` (768×768, freigestellt, ein Diorama-Lauf) | eigene Bildserie | 768² | teilweise | `o3` = W02, `o4` = W04, `o5` = DS04. Unterwasser und Aquarium gibt es in dieser Serie nicht. Die AquaCare-Hintergründe wären ein Stilbruch. |
| 21 | Garderoben-Porträts | – | – | – | **fehlt** | Nicht in den Suchordnern (Figuren-Pipeline). |
| 22 | Slop-Silhouetten | – | – | – | **fehlt** | Nicht in den Suchordnern (Slop-Atlas). |
| 23 | Equalizer/Aktiv-Marke Playlist | L41#38 `855,920,253,74`; #23 `612,618,265,108` | Leit | 253×74 | ja | Wird nur verkleinert eingesetzt. |
| 24 | Edle Aktiv-Markierung | Slot mit gelbem Rand L39#3/#10; erhöhter Reiter L39#24; Strahlenrahmen L17#68 `613,826,206,78`, Oval #69 `841,822,145,85` | Leit | s. Spalte Fundstelle | teilweise | Für Slots und Reiter vorhanden. Eine einheitliche Marke für Porträt und Titel müsste aus #68/#69 kommen; ob das trägt, ist ungeprüft. |
| 25 | Zahlenstil weiß mit Schatten | – | – | – | kein Bildteil | Das ist Schrift bzw. CSS. |

## Geprüft und verworfen
- **`…/DC KFB GTA HUD icons + schleusen/`**: Das ist tatsächlich eine Serie (Panels, A–Z, Ziffern, Radio-Icons, Schleusenringe). Aber Glanzmetall, Messing und Neon im AquaCare-Unterwasserstil: Stilbruch und fremder Kontext.
- **`KFB HUD v5/`**:
  - Die 6 Bögen „ChatGPT-Bild 20. Nov. 03_17_*“ sind schlichtes Papier ohne Farbunterlagen; 03_17_35-4 hat einen Schachbrett-Schleier.
  - 9 weitere Bögen haben einen eingebrannten Hintergrund und sind unbrauchbar.
  - „Japanische Waschipapier-Sammlung-2“ ist freigestellt und nah am Stil, aber ein eigener Lauf (größtes Stück ≈ 730×270).
- **Andere Bildsprachen**: Steampunk-, Hazard-, Reactor- und Slime-Knet-Skins (Hauptordner, `KFB HUD skin + icons`, Ornaments, Radio-Glyphs, Radios), Toon/Pastel Clay R3/R4, Knet-UI „FLUFFY“ (Scenes-Ordner), Wenrexa-SciFi, skymon (= heutige `sky_*`), retro dungeonmode.
- **`KFB_PERGAMENT_STOFF_R1`**: prozedural erzeugt, Web-Look.
- **`MasterKit-Referenzen`, `Gemeinsame-Spiel-Icons/i_*`**: das sind die heutigen flachen Web-Glyphen.
- **`Claybound HUD+UI/`**: nur Bildschirmfotos.

## Fehlt wirklich → ChatGPT-Bildauftrag
Stil-Referenz für die Punkte 1–7: die PSD-Ebenen 38, 40 und 23 als PNG exportiert hochladen (Ebene 51 nur mit dem Hinweis, dass der Schleier nicht nachzuahmen ist). Alle Teile in einem Lauf, echte Transparenz, ohne Text.

1. Großer Fenstergrund ≥ 1800×1000 px, dazu ein 9-Slice-Satz: 4 Ecken und nachweislich kachelbare gerade Kanten, ruhige Mitte.
2. Palettengründe: 2×4-Raster für 80er Slots (≈ 600×320), senkrechte Listenpalette (≈ 320×460).
3. Einzelne Reiter aktiv/inaktiv (≈ 180×60) und ein großer Primärknopf ohne Beschriftung (≈ 320×90) mit den Zuständen normal, hover, gedrückt, gesperrt.
4. Schloss-Symbol und gesperrter Slot; Sockelplatte für HUD-Symbole ≈ 160 px.
5. Symbole in der Plattenform von L41: Haus, Hilfe, Buch, Ort, Schraubenschlüssel, Vollbild, Truhe, Karte.
6. Kompass ≥ 260 px: Ring passend zu L17, leere Kartenscheibe, Marker für Ziel, Spieler und Richtung.
7. Seltenheitsstern in 3 Stufen.
8. Item-Symbolserie (13 Items, 1:1, gleiche Füllgröße). Getrennter Auftrag in Knet-3D. Hochladen: `teile3/fist.png`, `backpack.png`, `boot.png` und `Gemeinsame-Spiel-Icons/hero_*.webp`. Vorher entscheiden, ob Knet-3D oder Pastell-Knet (L14).
9. Orts-Vorschau „Unterwasser“ und „Aquarium“ im Diorama-Stil. Hochladen: W02, W04, DS04.
10. Garderoben-Porträts und Slop-Silhouetten kommen aus den eigenen Pipelines, nicht aus ChatGPT.

## Vorschau (`TEILE_SUCHE_R1_vorschau/`)
- `01_paletten_slots_reiter_schalter.png`
- `02_knoepfe_symbole.png`
- `03_titel_baender_wegweiser.png`
- `04_ringe_rahmen_ecken.png` (der Schleier von L43 ist als heller Kasten sichtbar)
- `05_fenstergruende_zu_klein.png` (Flächen gegen den Bedarf im gleichen Maßstab)
- `06_partner_serie_L01.png`
- `00_nummern_*.jpg`: Nummernkarten der fünf Bögen
