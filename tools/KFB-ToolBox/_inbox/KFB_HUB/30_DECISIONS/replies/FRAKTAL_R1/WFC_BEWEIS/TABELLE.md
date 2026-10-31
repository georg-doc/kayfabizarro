# Tabelle zum WFC-Beweis · Startwerte, an Moos angesehen

Vollständig in `TABELLE_VOLL.json` (`scripts/place/wfc-skalen.r1.json` @e68aa1bf). Zone 32 m unverändert aus `kfb-place-field.r2.json`. Saat A `kfb-endless-r1`, Saat B `kfb-saat-zwei`.
Nachbarwerte sind Faktoren: über 1 zieht an, unter 1 stößt ab, 1 ändert nichts. Sie gelten zu allen Seiten und in beide Richtungen eines Paares.

## Bodenplatz 4 m, bedingt durch die Zone

| Zone | leer | fels | stein | kiesel | gras | blume | busch | pilz | strunk |
|---|---|---|---|---|---|---|---|---|---|
| ruhe | 0,995 | | 0,002 | 0,002 | 0,001 | | | | |
| geröll | 0,56 | 0,07 | 0,11 | 0,17 | 0,05 | 0,02 | 0,01 | | |
| wiese | 0,62 | 0,02 | 0,03 | | 0,21 | 0,08 | 0,02 | | 0,005 |
| beet | 0,60 | 0,015 | 0,025 | | 0,10 | 0,24 | 0,01 | | |
| dickicht | 0,60 | 0,015 | 0,025 | | 0,13 | | 0,15 | 0,05 | 0,03 |

**Nachbarn nah:** leer–leer 1,3; leer–alles andere 0,8–0,9; fels–stein 5; fels–kiesel 6; fels–fels 0,5; kiesel–kiesel 2,2; gras–gras 2,2; gras–blume 2,2; blume–blume 2,6; pilz–busch 4; strunk–pilz 5.
**Nachbarn fern:** fels–fels 0,3; busch–busch 0,7; stein–stein 0,85; gras–gras 0,9; kiesel–kiesel 0,9.
**Objekte:** fels r 0,7–1,5 m; stein als Brocken r 0,38–0,7 m; busch r 0,7–1,2 m; strunk r 0,25–0,4 m.

## Stück 1 m, bedingt durch den Bodenplatz

| Bodenplatz | leer | stein | kies | kugel | gras | blume | pilz |
|---|---|---|---|---|---|---|---|
| leer | 1 | | | | | | |
| fels | 0,58 | 0,20 | 0,17 | 0,03 | 0,02 | | |
| stein | 0,58 | 0,20 | 0,18 | 0,03 | 0,01 | | |
| kiesel | 0,62 | 0,03 | 0,32 | 0,03 | | | |
| gras | 0,74 | | 0,02 | 0,01 | 0,21 | 0,02 | |
| blume | 0,74 | | | | 0,06 | 0,20 | |
| pilz | 0,76 | | | | 0,06 | | 0,18 |
| busch | 0,78 | | 0,03 | 0,04 | 0,11 | | 0,04 |
| strunk | 0,76 | | | 0,02 | 0,08 | | 0,14 |

**Nachbarn nah:** kugel–kugel 2,2; stein–kies 2; gras–blume 2; stein–stein 1,8; blume–blume 1,6; gras–gras 1,6; pilz–pilz 1,5; kies–kies 1,4.
**Nachbarn fern:** stein–stein 0,6; kugel–kugel 0,6; gras–gras 0,8; blume–blume 0,8; kies–kies 0,9.
**Objekte:** stein r 0,17–0,36 m; kugel r 0,14–0,22 m; gras r 0,18–0,32 m; blume r 0,14–0,22 m; pilz r 0,1–0,16 m. `kies` ist nur Bedingung für die nächste Ebene.

## Korn 0,25 m, bedingt durch das Stück

| Stück | leer | kiesel | krume | halm |
|---|---|---|---|---|
| leer | 1 | | | |
| kies | 0,62 | 0,36 | 0,02 | |
| stein | 0,66 | 0,28 | 0,05 | 0,01 |
| kugel | 0,74 | 0,02 | 0,24 | |
| gras | 0,86 | 0,015 | 0,015 | 0,11 |
| blume | 0,92 | | 0,02 | 0,06 |
| pilz | 0,92 | | 0,05 | 0,03 |

**Nachbarn nah:** krume–krume 1,8; halm–halm 1,6; kiesel–kiesel 1,3; kiesel–halm 0,5.
**Nachbarn fern:** krume–krume 0,7; kiesel–kiesel 0,9.
**Objekte:** kiesel r 0,04–0,09 m; krume r 0,035–0,07 m; halm r 0,03–0,06 m.

## Bilder

- `1_SAAT_A_ALLE_RICHTUNGEN.jpg`, 192 m: Lichtungen, dichte Stellen und Felsgruppen laufen über alle gestrichelten Zellgrenzen weiter, ohne Naht und ohne Vorzugsrichtung.
- `2_SAAT_B_ALLE_RICHTUNGEN.jpg`, gleiche Tabelle, andere Saat, gleicher Ausschnitt: anderer Ort, gleicher Charakter.
- `3_SAAT_A_NAH.jpg`, 32 m aus Bild 1 (x 11, z −72): Fels, Brocken, Stein, Kiesel, Kugel und Krume aus vier Ebenen. Dort sind auch die sich überlappenden und fast berührenden Paare zu sehen, die §4 Punkt 5 nennt.

Scheiben sind maßstabsgetreu, nur im Überblick mindestens 0,8 Pixel Radius. Flaches Gelände, kein Spielbild.
