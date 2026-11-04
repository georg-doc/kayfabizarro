# Voll-Inventur des Bild-Pools · R1 · 04.11.2026 (WS-Verteiler)

Stand Code: `assets/popups-ingest-r1` @57260563. Die Bilder dazu liegen in `assets/private` @dc4fb07e (MB07 Oma, Varianten, Kontaktbögen), der Pop-up-Atlas @cb56cc06.

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
  - Gebaut am 04.11. (`scripts/assets/popup_atlas.py`, privat `assets/private` @cb56cc06, Ordner `popup_atlas_r1/`): 722 Stücke auf 43 Nah-Seiten (46,5 MB) und 13 Fern-Seiten (20,2 MB), zusammen 66,7 MB statt gut 320 MB. Meist ein Hauptbiom je Seite, keine Überlappungen, Alpha sauber.
  - Laden und Entladen je Zelle mit Obergrenze in kfbInsert/popupClayCore (WS-Design).
  - KTX2 erst nach Georgs Ja zum Werkzeug.
- **Slop-Atlas:** Seite 1 hat 3072 × 4032 px (336 Zellen), Seite 2 inzwischen 3072 × 768 (60 Zellen). Jede weitere Familie verlängert Seite 2, bis 4096 px Höhe; danach Seite 3. Flug liest Seiten schon getrennt. Kommt dort dieselbe 2048-px-Grenze wie bei den Pop-ups, schneide ich den Slop-Atlas in 2048er-Seiten um.
- **Platte:** Der Ingest braucht den privaten Stand im Scratch (etwa 0,9 GB) und entpackte Zips (etwa 0,2 GB). Ich lege beides nach dem Atlas in den Papierkorb.
- **Sichtung der Freistellung (04.11., nach Beleg Start-WFC):** 1118 Stücke gemessen (hart geschnittene Ränder, Fransen, Randrauheit), 181 Kandidaten angesehen.
  - Randreste des Nachbarstücks: 62 Stücke nachgeschnitten (Regel `randrest`).
  - Neu aus der Quelle geschnitten (40): Böse Meister, Bosse und Schergen, Tonwelt-Türen 2, Clay-Dioramen weltweit 3 (Raster mit Überlauf bzw. höhere Keying-Toleranz). Die weißen Säume der Bosse sind weg.
  - Raus: TR_ABENTEUER_01 (nur ein halber Truhenrand), Liste `aus_stuecke`.
  - Bleibt, braucht neue Quelle: Monster-Wissenschaftler (SL_FORSCHER_09–16). Der Leuchtschein um die Figuren ist im Bild fast deckend; ohne ihn werden die Figuren löchrig. Ein sauberer Bogen mit echtem Alpha würde helfen.
  - Kein Schnittfehler: die ausgefransten Ränder an SZ_APOKALYPSE_05/08 und mehreren Mystery-Szenen sind so gemalt.
  - Rest: TUER_SURREAL_16 (Zitronentür) berührt im Bogen die Nachbartür; der Überlauf greift deshalb nicht, der Rand bleibt gerade.
- **Ähnlichkeitsgrenze:** Ab 0,95 gilt ein Stück als Dublette, darunter als Variante. Die Sichtung aller 58 Paare bestätigt das: unter 0,95 sind es echte Neu-Renderings, darüber gleiche Bilder.
