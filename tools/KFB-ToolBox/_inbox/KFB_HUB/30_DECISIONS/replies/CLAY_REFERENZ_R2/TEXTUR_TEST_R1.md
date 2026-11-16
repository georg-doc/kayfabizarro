# Textur-Test R1 · fertige Knete-Texturen statt prozeduralem Relief · 16.11.2026

Georg fragte: Passen Poly Haven `patterned_clay_plaster`, ambientCG `Clay001` oder `Ground026`? Und was hat Patch?

## Wie getestet
- Bühne, Licht und Kamera wie im Stilbild v1.3 (`knete_v13.html`, Funktion `KFB_TEX`, Lauf mit `tests/render_tex.mjs`).
- FB aus r1j, Knete nur auf der Haut, Kanon-Wache PASS. Der Fels ist der Spiel-Fels `kfb_stone_leicht_felsen.r1`.
- Basis ist kfb-clay v1.1 mit Relief aus; Farbe, Rauheit und Rig bleiben unverändert. Dazu kommt die Normal-Karte der Textur, triplanar im Objektraum, also ohne UV und ohne Nähte.
- Kachel: FB 0,3 Figurenhöhe mit Stärke 0,6, Fels 0,6 × 1,8 m mit Stärke 0,8.
- Das ist nur ein Test im Harness, kein Kanon.

## Lizenz
Alle getesteten Texturen sind CC0 (ambientCG, Poly Haven); im Spiel trotzdem mit Nennung „ambientCG.com“ bzw. „Poly Haven“. Ins Spiel kopiert ist nichts.

## Befund je Textur (FB nah · Fels nah · Fahrtsicht)

| Textur | Figur | Fels | Urteil |
|---|---|---|---|
| ambientCG Clay001 (Georg) | feine Wischspuren, ruhig, liest als Knete | feine senkrechte Wischspuren | gut für Figuren |
| ambientCG Clay009 | glatt mit weichen, flachen Daumen-Wischflächen | sehr ruhig | **am besten für Figuren**, am nächsten an „glatt, Form trägt“ |
| ambientCG Clay005 | glatt, leicht fleckig | kaum zu sehen | Reserve für Figuren |
| ambientCG Clay007 | waagrechte Fingerzug-Wellen, im Gesicht zu streifig | **wie die lila Claybound-Platte** | **am besten für Fels, Platten, Requisiten** |
| ambientCG Clay003 | wie 001, kräftiger und streifiger | Streifen | eher nein |
| Poly Haven patterned_clay_plaster (Georg) | feines Putz-Raster, liest als Stuck | körniger Putz | für Häuser und Wände, nicht für Figuren |
| ambientCG Ground026 (Georg) | körnig, wie Sandpapier, also im Kleinen wieder Pocken | körnig | nur fürs Gelände (Knetkorn ist geparkt) |
| Clay006, Clay008 | nur als Vorschau angesehen: zu wild modelliert | – | nein |

In der Fahrtsicht zeigt keine Textur etwas, genau wie beim prozeduralen Relief: Die Details liegen unter einem Pixel. Lesbar wird Knete aus der Spielkamera nur über die Form.

## Fund am Rande
Die rosa Referenz-Kugel im Brief ist das BlenderKit-Material „Modelling Clay – Pink“ von James Middleton. Es gibt dieselbe Reihe auch in Gelb, Grün und weiteren Farben. Lizenz: BlenderKit Royalty Free (frei). Es liegt nur als .blend vor; die Karten müsste WSB in Blender herausbacken. Das wäre der direkteste Weg zum Look der Referenz-Kugel.

## Was eine Textur-Lösung für den Kanon bedeutet
- Kanon Gebiet 8 sagt: ein Knete-Modul, prozedural, ohne Texturen. Eine Detail-Karte je Profil, triplanar, wäre eine Erweiterung desselben Moduls (z. B. v1.4: Profil `character` = Clay009, `midground` = Clay007). Kein zweites Modul, aber eine Kanon-Änderung: Entscheidung von WS0 und Georg.
- Leistung: drei Textur-Abrufe je Pixel statt der Zellen-Schleifen, also eher billiger. clayBake könnte die Karte mitbacken.
- Risiken:
  - Kachel-Wiederholung auf großen Flächen. Bei Figuren und Felsen ist sie nicht sichtbar, beim Gelände ja.
  - Kein Ausblenden mit der Entfernung wie bei den Bändern; das ginge über Mipmaps und eine eigene Abstandsregel.
  - G2 (Streifen) muss für Clay001 und Clay007 neu gemessen werden.

## Bilder
`evidence/textur_1_figur.jpg` (Clay001 | Clay009), `evidence/textur_2_figur.jpg` (Patterned Clay Plaster | Ground026), `evidence/textur_3_fels.jpg` (Clay001 | Clay007). Alle Läufe: `evidence/tex_*_t1.jpg`.
