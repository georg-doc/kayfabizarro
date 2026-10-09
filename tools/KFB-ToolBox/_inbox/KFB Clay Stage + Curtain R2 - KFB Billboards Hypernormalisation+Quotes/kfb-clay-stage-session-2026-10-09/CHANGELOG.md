# CHANGELOG · KFB Clay Stage

Additiv. Neue Einträge oben anhängen, alte nie umschreiben.

---

## R2 · 09.10.2026 · Referenzstand
Ordner `KFB_Clay_Stage_R2/`, Preview `KFB Clay Stage R2.dc.html`. Anlass: Georgs Review zu R1 (02-Pfeil, Bühne/Vorhang).
Georg-Entscheid: **passt, TUNE für später.**

### 02 Boomerang Arrow (`billboards/kit.js`)
- NEU `arcArrow(C, R, a0, a1, w, head, r)`: Pfeilumriss mit Schaft als exaktem Kreisbogen, Spitze `head`, runde Anfangskappe. `a1` darf `[außen, innen]` sein, damit die Bogenkanten genau auf der Spitzenbasis enden.
- NEU `insetTri(A, T, B, m)`: Dreieck mit allen Kanten um `m` parallel nach innen.
- GEÄNDERT 02: Schaft = Kreisbogen um C = [3,6; fy+0,6], R 6,4 m, 158° → −20°. Anfang verdeckt hinter der Tafel. Spitze symmetrisch, liegt auf dem Kreis, Achse 18,2° gegen die Tangente (Sehnenachse). Spitzenwinkel 53°.
- GEÄNDERT 02: Lichtkanal (accent2) = derselbe Pfeil mit 0,62 m Rand, läuft in die Spitze durch. Blink-Spitze = Innenspitze 0,12 m eingerückt, sitzt auf dem Kanal.
- ENTFERNT 02: Mittellinie als Spline durch sechs Handpunkte (Ursache der Dellen), runde gekippte Kanalspitze, lose Blink-Einlage.
- UNVERÄNDERT: `strokeOutline`, `offsetShape` (weiter im Kit), Familien 01, 03–07, Kontur 0,32 m.

### Bühne + Vorhang (`curtain/clay-look.js`, `curtain/host.js`)
- NEU Portal als Pappaufsteller vor dem Vorhang: 4,6 × 3,2 m, Öffnung ±1,42 m, Kante 0,24 m, Frontplatte 8 cm eingerückt, Kontur-Wulst, Seitenwangen 0,98 m, Laibung bis 2 cm vor den Stoff.
- NEU `STAGE`-Konstanten exportiert (`floorLift, XO, XI, OT, PT, PZ, Z0, Z1`).
- NEU `look.measure` (Öffnung, Stoffkante, Überdeckung, Saum, Boden, Saum im Boden) → im Snapshot `S.measure`, in der Bedienung angezeigt.
- GEÄNDERT Boden: 19 durchgehende Bretter bis hinter den Prospekt, Oberkante 4,5 cm über `DIM.floorY`. Saum steckt 2 cm im Boden.
- GEÄNDERT Kern-Aufruf: `hardware:'none'` statt `'rings'`. Blendbrett verdeckt die Stoffoberkante.
- GEÄNDERT Säulen: klobig, ungleich (Doppelsockel + Kugel / Einzelsockel + Block + Brett), leicht schief. Schild aus der Mitte versetzt. Vier Laternen ungleich.
- GEÄNDERT Schmuckvorhang: Bögen wie R1, Seitenschals aus vier Falten-Wülsten je Seite, Quasten senkrecht und unterschiedlich lang.
- GEÄNDERT Stoff: Faserstreifen 0,07 → 0,03, Knet-Marmorierung wie die Wülste, Rauheit 0,9.
- GEÄNDERT Ansichten im Host leicht neu gerahmt.
- ENTFERNT: Behelfsstreben, Seitenflats, Kopfbänder, Nägel, Säulenringe, Kordelringe, Stangenhaken, Flickenplanke, überstehende Planke, gekippte Quaste.

### Palette (`palette-roles.js`)
- NEU Rollen `portal`, `portalEdge`, `portalLine`.
- GEÄNDERT `valance = cloth` (Bögen in Stofffarbe, ein Material).

### Gemessen
Überdeckung Stoff/Portal 0,09 m je Seite · Saum 0,02 m im Boden · Spitzenwinkel 53,1° · Achsdrehung Spitze 18,2°.

---

## R1 · 09.10.2026
Ordner `KFB_Clay_Stage_R1/`, Preview `KFB Clay Stage R1.dc.html`. Details: `code/KFB_Clay_Stage_R1/RETURN.md`.
- NEU eine Preview-Seite für Billboards und Bühne + Vorhang, eine Rollenpalette (`palette-roles.js`) für beide.
- NEU Vorhang-Kern (Issue #372) unverändert über jsDelivr importiert und von außen eingekleidet (`dressClay`): Knete/Filz, Decals im clothUV-Raum, Bretterbühne, Säulen, Schmuckvorhang, Laternen.
- NEU Kit-Funktionen `strokeOutline`, `offsetShape`, `roundPoly` mit Radius je Ecke.
- GEÄNDERT 02 neu gebaut (ein Umriss + Kontur + Lichtkanal), 05 korrigiert, 07 Title Belt neu.
- GEÄNDERT schwarze Aus-Birnen ersetzt durch Palettenlicht.
- Basis: KFB Billboard Family v1 (04.10.2026), unverändert.
