# KARTENVIERTEL_FT_R1 · Fenster- und Tür-Bausatz „nachgebaut“ (WSB, 11.11.2026)

Auftrag WS0 (Georg 11.11., V-1606): Die Kartenviertel-Gebäude bekommen ein durchgängiges HyperNorm-Design. Auf die Fassade kommen ausgeschnittene oder nachgebaute Fenster und Türen, cartoonig versetzt; eine Tür und ein paar Fenster reichen pro Haus; keine Aufsätze. WSB baut die Variante „nachgebaut“ als kleinen Blender-Bausatz. Nichts ist im Spiel eingebaut.

## Teile (12 GLB in `glb/`, je Gebäudeart 2 Fenster + 1 Tür)
| Teil | Form | Breite × Höhe × Tiefe (m) | Dreiecke |
|---|---|---|---|
| Wohnhaus_Fenster_A | Sprossenfenster 2×3 mit Bank | 1,00 × 1,85 × 0,146 | 6076 |
| Wohnhaus_Fenster_B | Sprossenfenster mit Oberlicht | 1,15 × 2,15 × 0,148 | 5852 |
| Wohnhaus_Tuer | Haustür mit Oberlicht, Kassetten, Knauf | 1,50 × 2,50 × 0,148 | 6468 |
| Buero_Fenster_A | Bandfenster 2-teilig | 1,20 × 1,65 × 0,132 | 3644 |
| Buero_Fenster_B | Bandfenster mit Kippflügel | 1,20 × 1,90 × 0,131 | 4828 |
| Buero_Tuer | Glastür 2-flüglig, Sockel, Oberlicht, Stoßgriffe | 1,80 × 2,65 × 0,148 | 6748 |
| Fabrik_Fenster_A | Sprossen-Industriefenster 4×5 | 1,20 × 2,20 × 0,126 | 13820 |
| Fabrik_Fenster_B | Industriefenster 3×4 mit Kippreihe | 1,05 × 1,85 × 0,125 | 10652 |
| Fabrik_Tor | Rolltor mit Rollkasten und Fensterreihe | 2,00 × 2,90 × 0,148 | 10588 |
| Vorstadt_Fenster_A | Fenster 2×2 mit Lamellenläden | 1,77 × 1,74 × 0,140 | 10900 |
| Vorstadt_Fenster_B | Fenster 2×3 mit Brettläden | 1,97 × 2,01 × 0,141 | 11260 |
| Vorstadt_Tuer | Tür mit Blattfenster und Vordach-Kante (ohne Stützen, ohne Dach) | 1,72 × 2,60 × 0,148 | 4516 |

- Maße wie in der Köln-Stadtschale:
  - Fenster 0,8–1,2 m breit und 1,65–2,2 m hoch. Bei Vorstadt ist das Fenster selbst 0,9 bzw. 1,0 m breit; die Breite in der Tabelle zählt die aufgeklappten Läden mit.
  - Türen 1,45–2,0 m breit (Vorstadt: 1,45 m Zarge, 1,72 m mit Vordach-Kante) und 2,35–2,9 m hoch.
  - Tiefe 0,125–0,148 m, höchstens 0,15 m.
- **Ursprung:** Mitte der Unterkante; die Rückseite liegt auf der Wandebene (glTF z = 0). Die Vorderseite zeigt nach +Z, oben ist +Y.
- **Aufbau:** Die Wurzel ist leer und ohne Transform. Darunter hängt je Materialzone ein Netz, ebenfalls ohne Transform. Die Fenster sitzen also bündig auf der Fassade und stehen bis zu 15 cm vor.
- **Materialzonen** (getrennte Netze `<Teil>.rahmen | .blatt | .scheibe`, extras `kfb.zone`):
  - rahmen: Rahmen, Sprossen, Bank, Knauf, Rollkasten, Vordach-Kante.
  - blatt: Türblatt, Läden, Rolltor-Panzer, Stoßgriffe, Blechbank.
  - scheibe: ein Material `KFB_FT_Scheibe` für alle Teile, damit es nachts warm leuchten kann (V-1556/V-1557, Scheibe hinter dem Rahmen).
- **Farben** sind vorläufig, je Gebäudeart ein Rahmen- und ein Blatt-Ton. Der HN-Shader setzt später die Materialcodes je Gebäudeart (V-1606).
- **Wurzel-extras** `kfb`: Gebäudeart, Rolle, Titel, Maße, Ursprung, Zonen, Entscheidung V-1606.

## Knet-Form
- **Rahmen:** Gitter mit Löchern → Dicke → Fase → Subdivision. Stützkanten halten die Ecken der Öffnungen bei rund 4 cm Rundung, statt sie abzuschrägen. Die Sprossen sind eine eigene Schale, 2–3 cm hinter der Rahmenfront.
- **Hand-Unruhe:** gemeinsames Rauschen über alle Zonen (12 mm grob, 4 mm fein) und eine Scherung bis 1,6 cm. Jedes Teil hat eine eigene Saat; nichts läuft auseinander.
- **Proof** mit Knete (V-346): N35-Bühne v1.2, `--type prop --units m`, Clay-Modul kfb-clay.v1.1, Profil midground.

## Belege (`proof/`)
- `FT1_Uebersicht_Teile_vorn_seitlich.png`: alle 12 Teile von vorn und von der Seite.
- `FT1_Reihen_vorn.png`, `FT1_Reihen_dreiviertel.png`: je Gebäudeart als Reihe (Wohnhaus, Büro, Fabrik, Vorstadt).
- `FT1_Reihen_nacht.png`, `nacht/Alle/…_front.png`: nur ein Beleg mit warm leuchtender Scheibenzone (`--mood night`, Emission nur in den Beleg-Reihen `*.nacht.glb`; die gelieferten GLB haben keine Emission).
- `teile/<Teil>/`: vorn und seitlich je Teil. `reihe/<Art>/`: vorn, seitlich, dreiviertel. `reihe/Alle/`: alle zwölf.
- `reihe_glb/`: die Reihen-GLB der Belege, nicht fürs Spiel.

## QA
- (a) **Löcher:** G4 in allen 22 Läufen ohne offene Ränder; G3 und G6 in allen 22 PASS. Rückseite (Blick von hinten) geschlossen und flach auf der Wandebene.
- (b) **Normalen und Schatten:** G2 PASS (keine NaN-Normalen, keine Standardmaterialien), G6 Schattensaum 0 px, Nahaufnahme ohne Schattenakne.
- (c) **Augen:** entfällt (keine Figuren).
- (d) **Lage:** G3 Bodenkontakt 0,00 cm. Läden liegen 5–7 mm vor der Wand, Bank und Vordach-Kante sitzen am Rahmen. Lose Inseln (G4-Warnung) sind gewollt getrennte Stücke (Kassetten, Lamellen, Knauf, Bretter).
- (e) **Konzept:** Georg (V-1606) „ausgeschnittene oder nachgebaute Fenster/Tueren auf die Fassade, cartoonig versetzt … keine Aufsaetze wie Schornsteine“. Variante nachgebaut erfüllt; keine Aufsätze; die Vordach-Kante ist nur eine Kante ohne Aufbau. Das Versetzen auf der Fassade macht der Verteiler (WB-D1).
- (f) **Look:** ein Knet-Look, keine Fremdstile.
- (g) **Material folgt Flächen:** Zonen sind getrennte Netze; von vorn, ¾ und hinten hat jede Fläche eine Farbe.
- (h) entfällt.

## Hinweise
- Dreiecke: Fabrik- und Vorstadtteile liegen bei 10–14 Tsd. (feine Sprossen bzw. Lamellen mit Subdivision). Falls das Viertel viele davon zeigt, kann eine leichtere Stufe ohne Subdivision folgen (etwa ein Drittel), auf Zuruf.
- Bandfenster: Kante an Kante gesetzt, entsteht das Band mit doppelter Seitenzarge.
- Rolltor: Der Rollkasten sitzt sichtbar auf den Zargenpfosten (kleine Kerbe zwischen Pfosten und Kasten).
- Skript: `scripts/ft_bau.py` (`blender -b --python ft_bau.py -- <out> [nacht]`), Reihen-Render `reihen.sh`, Übersicht `sheet.mjs`, Stapel `stapel.mjs`. Blend: `blend/KFB_FT_Bausatz.ft1.blend`.
