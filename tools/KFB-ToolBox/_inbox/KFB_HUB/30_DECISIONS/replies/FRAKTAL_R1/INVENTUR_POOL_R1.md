# Voll-Inventur des Bild-Pools · R1 · 04.11.2026 (WS-Verteiler)

Stand Code: `assets/popups-ingest-r1` @57260563. Die Bilder dazu pushe ich nach `assets/private`, sobald die Platte wieder über 9 GB frei hat.

## Umfang
- Pool: alle Ordner unter `KFB Claymation Reference/`, mit allen MixedBags und den Ordnern darüber.
  - 721 Bilddateien und 53 Zips.
  - Nach dem Ausschluss bleiben 653 Dateien, davon 190 bytegleiche Kopien („(1)“, Zip-Inhalte).
- Verfahren: Ein Trockenlauf des Ingest über den ganzen Pool. `--inventur` schreibt je Datei die Regel, die Zahl der Teile und je Stück den Status.
- Ergebnis: Jede Datei mit Regel ist im Katalog, jede Zelle jedes Bogens ist registriert, keine offenen Dateien, keine Fehlschnitte.

## Gefundene Lücken (geschlossen)
1. **MixedBag 07 war nie aufgenommen.** Jetzt drin: neue Slop-Familie Oma (12, Alpha-Bögen), der weiße 12er-Bogen als Variante. Die Jetpack-Bögen von dort gehen an WSB.
2. **Varianten als Dubletten verworfen.** Die Ähnlichkeitsprüfung legte Neu-Renderings desselben Motivs zusammen, sobald der Wert über 0,78 lag. Das ist die Ursache für „aus 2 × 8 nur 8“. 58 Stücke mit Werten von 0,78 bis 0,95 sind jetzt als Varianten aufgenommen. Feld `variante: true`, `variante_von` = Original; sie tragen Klasse, Familie, Thema, Stufe und Höhe des Originals.
3. **Weggelassene Stücke** (28, Regel `weg`: Wahrzeichen, Pilzbäume, Szenen) sind als Varianten aufgenommen.
4. **Ausgeschlossene Bögen mit gutem Inhalt**, jetzt als Varianten aufgenommen:
   - Surreale Portal-Türen 2 (12)
   - Musikalische Kleckskobolde (5 neue, der Rest war schon da)
   - Truhen-Sprites `kfb_clay_treasure_chests_12_sprites` (11)
5. **Seltenheits-Boden:** Vorher stellte der Verteiler 37 Truhen nie, weil sie in keinem Biom gegen bessere Motive gewannen. Jetzt kommt jedes Stück in seinem besten Biom ab und zu vor (`einzelPlaetze popup.boden`, 15 % der Plätze).

Ergebnis: Katalog 1118 Stücke, davon 124 Varianten. Slops 396 in 31 Familien. Laut Feld `spiel` werden alle 1118 im Spiel gestellt.

## Bewusst weiter ausgeschlossen
| Was | Warum |
|---|---|
| HUD-, Radio-, 9-Slice-, Satellit-, Leisten- und Panel-Bögen, HAZARD | Kartenkante / WSA |
| Fluff-Zustände, Spray, Spritzer, Impact | VFX / WSB |
| Jetpack-Bögen (MB07, MB09, MB10) | WSB |
| Strecken, Insel, Mesa, Coconimo, Country Roads, Bath Vehicle, DioramaScenes (3D-Inselvorlagen), Okkultstudio, Akashic, Dystopia | Welt- und Konzeptbilder, keine Pop-ups |
| Vorschauen, Kontaktbögen, 64/96-px-Dateien, Quelldateien | Hilfsdateien |
| Philosophie- und Roboter-Truhenbögen (`chests_sheet_0x`, Weisheitsraster) | lassen sich nicht sauber trennen (halbe Truhen); die Einzelbilder derselben Truhen sind im Katalog |
| Historische Monsterhelden | Grund in Motivfarbe, lässt sich nicht freistellen; dieselben Figuren sind als Alpha-Bögen (Historical Icons) im Katalog |
| Frost-Truhen MB10 „-1“ | kein echtes Alpha, Ränder abgeschnitten; die Motive sind als MB12- bzw. „-2“-Fassung im Katalog |

## Grenzen und Vorschlag
- **Einzeldatei-Build:** Mit dem vollen privaten Stand bricht er ab, die eine HTML wird zu groß. Belege und Site brauchen den geteilten Build (`KFB_SPLIT=1` bzw. `KFB_SITE=1`); die Tests auf der Einzeldatei brauchen Umstellung oder Atlanten.
- **Pop-up-Bilder:** 1118 Stücke, davon 722 Pop-ups als Einzel-PNG (etwa 166 Megapixel, gut 320 MB). Plan (freigegeben):
  - Atlas-Seiten je Klasse und Thema, nach Hauptbiom geordnet; Nah-Fassung 512 px, Fern-Fassung 256 px; WebP, Seiten höchstens 2048 px, 6 px Rand.
  - Geschätzt etwa 30 Nah-Seiten und 8 Fern-Seiten statt 722 Dateien.
  - Laden und Entladen je Zelle mit Obergrenze in kfbInsert/popupClayCore (WS-Design).
  - KTX2 erst nach Georgs Ja zum Werkzeug.
- **Slop-Atlas:** Seite 1 hat 3072 × 4032 px (336 Zellen), Seite 2 inzwischen 3072 × 768 (60 Zellen). Jede weitere Familie verlängert Seite 2, bis 4096 px Höhe; danach Seite 3. Flug liest Seiten schon getrennt. Kommt dort dieselbe 2048-px-Grenze wie bei den Pop-ups, schneide ich den Slop-Atlas in 2048er-Seiten um.
- **Platte:** Der Ingest braucht den privaten Stand im Scratch (etwa 0,9 GB) und entpackte Zips (etwa 0,2 GB). Ich lege beides nach dem Atlas in den Papierkorb.
- **Ähnlichkeitsgrenze:** Ab 0,95 gilt ein Stück als Dublette, darunter als Variante. Die Sichtung aller 58 Paare bestätigt das: unter 0,95 sind es echte Neu-Renderings, darüber gleiche Bilder.
