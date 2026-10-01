# Globale Clay-Textur 512 · Test bereit

Status: **LOKALER VERGLEICH BEREIT · PERFORMANCE NOCH NICHT GEMESSEN**
Date: 2026-10-01

## Was hier getestet wird

Eine einzige kleine globale Clay-Textur soll den teuren prozeduralen Clay-Look für mittlere/weite Entfernung ersetzen können.

Kein neuer Material-Owner. Keine neue Welt.

Die bestehende Inselwelt bleibt identisch.

## Technische Idee in normalem Deutsch

Zwei vorhandene KFB-Clay-Texturen werden nacheinander auf denselben kleinen 512×512-Datensatz reduziert:

- `Clay002`
- `clay_floor_001`

Die Originalfarbe des KayKit-/Weltobjekts bleibt erhalten.

Die 512²-Kachel liefert nur:
- Relief-Richtung;
- Rauheit;
- leichte Helligkeits-/Materialunruhe.

Zur Laufzeit wird genau **eine** solche gepackte RGBA-Textur triplanar über X/Y/Z projiziert.

Pro sichtbarem Pixel sind dafür drei Texturproben vorgesehen, nicht die vielen prozeduralen Clay-Berechnungen des aktuellen v10-Pfads.

## Verwendete Spender

### Clay002

- diffuse blob: `8e7dc121cbf97154b6c67674998bb3d7c5abcd89`
- roughness blob: `7c879ace8ef221531e9fa715063997364b5d13b3`

### clay_floor_001

- diffuse blob: `d889ddd32d38ef9fac55ea802e47da73cbd77deb`
- roughness blob: `4d5b3e7634e532111c7608156f4a49b6b18d2ffb`

Die Dateien werden nicht ersetzt oder überschrieben.

## 512²-Speicherbudget

Ein RGBA8-512²-Pack:
- Basis: 1,048,576 Bytes;
- mit voller Mipmap-Kette geschätzt: ca. 1.33 MiB.

Zur Produktion soll immer nur **eine aktive globale Materialkachel** nötig sein.

## GitHub-Code

- `global-clay-pack.v1.js` — erstellt den 512²-Pack aus einem vorhandenen Spender.
- `clay-material.v10-partsdiag.js` — besitzt zusätzlich einen leichten Ein-Textur-Pfad; Default bleibt weiterhin der bisherige Clay.
- `hex-archipel.r2c-partsdiag.js` — schaltet zwischen aktuellem Clay, Clay002, clay_floor und Clay aus.
- `../performance-probe.js` — misst die vier Zustände automatisch.

Der bestehende Original-/Baseline-Code bleibt unangetastet.

## Lokale Doppelklick-Datei

Name:
`KFB_Global_Clay_Lite_Doppelklick.html`

SHA-256:
`30bc4ff8e9a39479169301e9a6b198e00a185af402108badfd3e4c481374e81e`

Prüfung:
- extrahierter ES-Modulblock: `node --check` PASS.

## Bedienung

1. Datei in Google Chrome öffnen.
2. **Globale Textur messen** anklicken.
3. Tab während der Messung sichtbar lassen.
4. Danach **Download JSON**.
5. JSON zurück in den Web-Chat ziehen.

Automatische Reihenfolge:
1. aktueller prozeduraler Clay-Look;
2. Global Clay Lite · Clay002 · 512²;
3. Global Clay Lite · clay_floor_001 · 512²;
4. Clay komplett aus.

Zusätzlich kann man mit vier Buttons die Looks direkt visuell hin- und herschalten.

## Was danach entschieden wird

Noch kein Gewinner.

Nach dem JSON vergleichen wir:
- Bildwirkung;
- Framezeit;
- Nähe zum bisherigen Clay-Eindruck;
- Textur-/Speicherbudget.

Dann wählen wir **einen** der beiden Clay-Spender als globale Basis oder verwerfen beide.

Erst danach kommt Derek RGB als zweiter Ein-Textur-Kandidat.

## Genau der nächste Schritt

Georg führt **Globale Textur messen** aus und schickt das JSON zurück.
