# KFB Knet-Katalog K1 + Hirnwelt H0 · Code-Export (Fassaden, Häuser, Knet-Texturen, Verformung)

Stand: 29.09.2026 · ohne 3D-Assets (kommen per GitHub-Raw, siehe `ASSETS.md`).

## Inhalt

| Pfad | Zweck |
|---|---|
| `KFB Knet-Katalog K1.dc.html` | Bühne K1: 20 Muster in Weltmaß, je Klasse (Häuser, Straße, Natur, Figuren …) |
| `KFB Hirnwelt H0.dc.html` | Bühne H0: Gelände aus BodyParts3D, Stirnstadt mit KayKit-Häusern |
| `support.js` | Laufzeit der `.dc.html`-Dateien |
| `lab-clay/clay-catalog.v5.js` | Code K1 (Bühne, Katalog, `clayify`, Schatten, AO) |
| `lab-brain/brain-world.v8.js` | Code H0 (Gelände, Straßen, Häuser, Figuren) |
| `lab-clay/clay-material.v8.js` | Knet-Shader, den K1 und H0 laden (Handmaß, Kerben, Risse, Druckstellen, Fingerabdrücke) |
| `lab-clay/clay-material.v10.js` | neueste Fassung (Stand T3/K2), Referenz, von K1/H0 nicht geladen |
| `lab-clay/clay-relief.v2.js` | Relief-Karte (CPU), von K1/H0 geladen; `v5` = neueste, Referenz |
| `lab-clay/clay-soften.v1.js` | Vorstufe: Unterteilen, Verschweißen, Taubin-Glättung, Beulen (die eigentliche Verformung) |
| `lab-clay/clay-profiles.v2.js` | Profile je Asset-Klasse (`house`, `road`, `nature` …) |
| `lab-clay/clay-tools.v1.js`, `clay-toolmix.v2.js` | Werkzeug-Katalog und Mischungen (K2), Referenz |
| `lab-brain/brain-world.v1.bin/.json` | Bake des Hirngeländes (BodyParts3D), von H0 zur Laufzeit geladen |
| `docs/` | LIVING_CLAY, HOWTO, Projektnotizen, CHANGELOG, github.md |
| `screenshots/` | Pixelaufnahmen mit Bildunterschriften in `DOKU_FASSADEN.md` |
| `standalone/` | K1 und H0 als je eine HTML-Datei |

## Starten

Ordner über einen lokalen Server öffnen (`python3 -m http.server`), dann die `.dc.html` aufrufen.
Three.js 0.160 kommt per Import-Map von unpkg, Modelle per GitHub-Raw (Internet nötig).

## Nicht enthalten

`ref/clay-joebinns/Fingerprints01_3K.png` (Fingerabdruck-Textur, Asset), 3D-Modelle KayKit. Ohne die Textur läuft alles,
aber die Fingerabdruck-Dellen fehlen (Fehlermeldung im Statusfeld, Rückfall auf die Relief-Karte).
Lizenz: `ref/clay-joebinns/LICENSE-joebinns-clay.txt`.

## Wichtig: Stand der Dateien

Die mitgelieferten K1/H0 laden `clay-material.v8` und `clay-relief.v2`. Die Änderungen aus dem letzten Bericht
(Fingerabdruck-Textur im Projekt ergänzt, feinerer Knet-Durchlauf je Haus vor dem Zusammenfassen, Schattenfeld 150 m mit
70 m Vorlauf) gehören zur Fahrszene mit T4-Biegung und stecken **nicht** in diesen K1/H0-Dateien. Siehe `DOKU_FASSADEN.md` §5.
