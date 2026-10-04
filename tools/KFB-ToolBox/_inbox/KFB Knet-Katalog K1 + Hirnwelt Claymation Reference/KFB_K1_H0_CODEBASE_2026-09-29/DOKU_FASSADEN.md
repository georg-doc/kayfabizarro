# Doku · Fassaden, Häuser, Knet-Texturen, Verformung

## 1. Weg eines Hauses (K1 `prop('building_A', …)`, H0 `town()`)

1. **Laden** `loadG(KIT + 'building_X.gltf')`, gecacht je Pfad, Klon je Instanz.
2. **`clayify(root, {profile:'house', soften, softOpt, seed})`** geht über alle Meshes:
   - Vorstufe `softenGeometry` (Cache je Quellgeometrie): Unterteilen bis längste Kante < `maxEdge` (Standard 0,18; max. 3 Stufen, max. 90 000 Dreiecke), nach **Lage** verschweißen (UV-/Materialnähte reißen nicht), Taubin-Glättung (λ 0,5 / μ −0,53, 8 Durchläufe, Ränder bleiben), tieffrequente Beulen entlang der Normale (`lump` 0,018 · `lumpFreq` 1,6, relativ zur Objektgröße), Normalen je Lage gemittelt. Skin-Netze bleiben unberührt.
   - `seedGeometry(THREE, geom, seed + o.id)`: Attribut `claySeed`, damit gleiche Häuser nicht dasselbe Muster tragen.
   - `makeClayMaterial(THREE, U, {src, profile})`: das Quellmaterial (KayKit-Farbatlas) bleibt Farbträger, der Shader legt Knete darüber.
3. **`footed`**: auf Zielhöhe/-länge skalieren, Fuß auf y = 0 setzen. H0 setzt zusätzlich einen Knet-Sockel (`plinth`) unter jedes Haus und legt es mit `put` auf das Gelände.

Fassaden sind Fenster, Sims, Markisen als Geometrie der KayKit-Modelle. Die Knete kommt aus Vorstufe (Kanten rund, Wülste) plus Shader (Oberfläche). Es gibt keine eigene Fassaden-Textur.

## 2. Shader (clay-material.v8) · was auf einer Fassade zu sehen ist

Alle Spuren im **Objektraum**, ohne UVs, ohne Periode:
- **Handmaß** `uClayHand` (Standard 0,5): Handspuren, Feinkorn, Fingerabdrücke haben feste Weltgröße, unabhängig vom Profilmaßstab.
- **Druckfacetten**: 3D-Voronoi, jede Zelle eine leicht gekippte platte Fläche, Falten an Teilen der Zellgrenzen (Verfahren nach joebinns/clay, MIT, kein Code übernommen).
- **Kerben** (Modellierholz: Rinne mit Lippe), **Haarrisse** (Voronoi-Zellgrenzen, nur nah), **Druckstellen** (ovale Mulde, glatter, Fingerabdruck verstärkt), **Farbunruhe** `uClayMottle`.
- **Entfernungsbänder** aus `px = |fwidth(P)|`: nah = Fingerabdrücke/Haarrisse, mittel = Kerben, fern = Druckstellen/Facetten/Farbunruhe. Jede Spur blendet aus, sobald sie unter einem Pixel liegt.
- **Sechseck-Kachelung** (Heitz/Neyret, Mikkelsen): keine sichtbare Wiederholung.
- Globale Regler: `uClayGouge, uClayCrack, uClayDent, uClayMottle, uClayLodK, uClayHandMix, uClayDebug`.
- **Fingerabdruck-Textur**: `makePrintTexture(THREE, 'ref/clay-joebinns/Fingerprints01_3K.png', 2048)`; fehlt die Datei, landet eine Meldung in `info.errors` und die Relief-Karte springt ein.

## 3. Profil `house` (clay-profiles.v2)

`role world · scale 0.5 · stroke 1.0 · grain 1.0 · facet 1.0 · crease 1.0 · print 0.8 · gouge 0.40 · crack 0.22 · dent 0.3 · gougeSize 0.6 · crackSize 0.26 · dentSize 0.6` (Rest siehe Datei).
Zum Vergleich `road` (stroke 0.55, facet 0.6, crack 0.35), `nature` (dent 0.75), `figure` (gouge 0, crack 0).
Große Druckstellen/Kerben über Fingerkuppenmaß werden flacher statt tiefer (v8).

## 4. Verformung

- **Statisch** (K1/H0): nur die Vorstufe (Abschnitt 1). Häuser in H0 werden mit Höhe 1,9–3,3 skaliert, Seed `seed*10 + k`.
- **Biegung T4** (Fahrszene, nicht in K1/H0): biegt die gekneteten Häuser um die Strecke. Nur sinnvoll, wenn jedes Haus vorher einzeln geknetet wurde (siehe 5).
- Bekannte Grenze: Skin-Netze (Figuren) werden nicht unterteilt.

## 5. Änderungen aus dem letzten Bericht (Fahrszene, nicht in diesen Dateien)

- Fingerabdruck-Textur fehlte im Projekt, deshalb zeigten K1/H0-Dellen nichts. Kopiert aus dem H0-Paket nach `ref/clay-joebinns/Fingerprints01_3K.png`.
- Knet-Durchlauf lief zu grob und erst nach dem Zusammenfassen aller Häuser zu einem Mesh. Jetzt wie in H0: jedes KayKit-Haus einzeln kneten, dann T4-Biegung. Quelle-gegen-Knete-Vergleich nutzt dieselben Einstellungen.
- Schattenbereich um das Auto 72 m → 150 m, 70 m Vorlauf in Blickrichtung, Schärfe gleich durch größere Schattentextur.
- Offen: K1-Werte der Fahrszene fehlen im Repo, Abgleich lief über Screenshots und HOWTO. Kosten ca. 1,9 statt 1,7 Mio. Dreiecke je Bild. Helle Naht zwischen gestapelten Baumkugeln möglicherweise Kontaktschatten, ungeprüft.

## 6. Screenshots (vorhandene Pixelaufnahmen, keine neuen)

Neue Aufnahmen aus diesem Chat sind nicht möglich: WebGL lässt sich hier nicht abgreifen. Bitte K1/H0 lokal öffnen und die Ansichten aus `screenshots/` nachziehen, wenn aktuellere Fassadenbilder nötig sind.

| Datei | Zeigt |
|---|---|
| `01-d1-haeuser-nacht.png` | D1: zwei KayKit-Häuser, Auto, Kissenziegel-Plateau; Fassaden mit Wulst-Sims, Fensterrahmen, Markisen |
| `02-d1-haeuser-a.png`, `03-d1-haeuser-b.png`, `04-d1-v3e.png` | D1-Stände der Häuser-Knete |
| `05-h0-totale.png` | H0 Totale: Hirn mit Stirnstadt |
| `06-h0-02.png`, `08-h0-04.png` | H0 weitere Ansichten |
| `07-h0-gelaende-nah.png` | H0 Gelände nah: Druckwellen, Fingerabdrücke, Furche als Fluss |
| `09-h0v7-a.jpg`, `10-h0v7-nah.jpg` | H0 v7 nah: Straße/Bordstein in Knete |
| `11-k2-material-vergleich.jpg` | K2: Material v8 gegen v9 auf Kacheln |

## 7. Regeln aus dem Projekt

WS0-Module unter `lab-v2/vendor/` bleiben unberührt. Neue Fassung = neuer Dateiname `.vN.js` (Browser-Cache). Werte werden gemessen, nicht geraten.
