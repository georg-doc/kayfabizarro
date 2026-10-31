# PRUEFUNG · Fünf mechanische Prüfungen für das eine Muster · 31.10.2026

Referenz: `fraktal_ref.mjs` in diesem Ordner, rein, ohne three; `node fraktal_ref.mjs` zeigt Gut- und Gegenproben. Einbau als `scripts/place/fraktal-check.mjs` durch die bauende Sitzung (Stufe A aus V-1107). Liegendes prüft es direkt auf der Worker-Ausgabe, Fliegendes auf der Auslöse-Liste plus Ruhelage. **Noch nichts davon läuft im Spiel.**

Eingabe je Kind: `x, z, r, d, quelle`. `L` ist die Reichweite des Falls aus der Tabelle.

| # | Prüfung | Rechnung | Schwelle | Herkunft |
|---|---|---|---|---|
| **P1** | **Kein Kind ohne Quelle** | Feld `quelle` gesetzt; `d ≤ 1,05 · L`. Gischt in Ruhe zusätzlich: `h(x, z) ≤ Spiegel + 0,05` | Null Waisen je Weltstück | **Invariante,** Georg V-1114, Korrektur 290c6324. Bis W10 entschieden: nasser Streifen zählt nicht als Land |
| **P2** | **Abfall** | Über viele Quellen gepoolt, drei Bänder über `u = d/L`: Dichte je Fläche, Median-Radius, Rangkorrelation Abstand zu Radius | Dichte innen ≥ 3 × außen und nicht steigend. Mit Größenkurve zusätzlich Größe innen ≥ 1,2 × außen, Rang ≤ −0,2 | Faktor 3 aus Grammatik §5 für den Größenabfall Band 0 zu 2 (dort über alle Größen); Rest **Vorschlag.** Kiesfläche und Kartenrelief ohne Größenteil (#170, W9) |
| **P3** | **Keine Rundum-Ordnung, keine Reihe** | Punkt und Ring: Resultante der Winkel, größte Winkellücke. Linie: Anteil der benachbarten Lückenpaare, die ≥ 30 % verschieden sind | Resultante ≥ 0,45, Lücke ≥ 25 % des Umfangs; Linie ≥ 60 % der Paare. ≥ 90 % der Quellen bestehen | Lücke `contact.gap_min` 0,25 und Paar-Regel `spread_pair_min` 0,3 **belegt** (V-749); 0,45 und 60 % **Vorschlag.** Riss-Sterne ausgenommen, ihr Auswurf nicht |
| **P4** | **Kein Teppich, keine Linie im Bild** | Clark-Evans der Kleinteile je Weltstück (1 = Zufall, gut 2 = Raster); Anteil der Dreier aus nächsten Nachbarn auf einer Geraden, Toleranz `line_tol` 0,05 | Clark-Evans ≤ 0,8; Geraden-Anteil ≤ 15 % ab 8 Kindern je Quelle. Innerhalb einer Gruppe bleibt `ruleReport` (null Geraden) | `line_tol` **belegt**; beide Grenzen **Vorschlag,** Vorlage 5 misst 0,41 |
| **P5** | **Ruhe und Sichtgrenze** | Freie 4-m-Zellen je Weltstück; Kugelfläche und Zählwerte aus `perf.json`; Durchmesser in Pixeln am Ausblend-Abstand | ≥ 50 % frei; kleinstes Element ≥ 3 px; Welt-Zelle höchstens 4 Aufrufe; Kugelfläche ≤ 1 % des Bildes | 50 % V-799; 3 px V-403; 4 Aufrufe V-1090, alle **belegt;** Kugelfläche **Vorschlag.** In `fraktal_ref` nur freie Zellen und Häufung gerechnet |

## Messwerte (31.10., Saat 4711, ohne Spiel, Gelände im Löser synthetisch)

| Probe | P1 Waisen | P2 Dichte innen/außen | P2 Größe innen/außen, Rang | P3 Resultante | P3 Quellen ok | P4 Clark-Evans | P5 frei | Urteil |
|---|---|---|---|---|---|---|---|---|
| Vorlage 5, aus dem Bild gemessen | – | 1,04 → 0,06 je m² | **1,0, Rang −0,04** | 0,80 (0,60–0,88) | – | 0,41 | 67 % | Vorlage, ohne Größenkurve |
| `place=r2` Moos, Fels→Kiesel | 6 von rund 6 000 | ≫ 3 | 1,88, −0,49 | 0,88 | 91 % | 0,43 | 60 % | **besteht** |
| `place=r2` Wüste | 4 | ≫ 3 | 1,88, −0,43 | 0,86 | 88 % (knapp unter 90) | 0,36 | 71 % | **besteht bis auf P3-Anteil** |
| `place=r2` Pastell | 3 | ≫ 3 | 1,98, −0,50 | 0,88 | 92 % | 0,41 | 64 % | **besteht** |
| Referenz Fels | 0 | 6,2 | 2,51, −0,59 | 0,91 | 97 % | – | – | PASS |
| Referenz Ufer | 0 | 4,6 | 2,71, −0,64 | Rhythmus 1,0 | 97 % | – | – | PASS |
| Referenz Einschlag | 0 | 5,9 | 2,40, Rang unter −0,2 | 0,84 | 100 % | – | – | PASS |
| **Gegenprobe Kranz** | 0 | ein Band | – | 0,00 | 0 % | – | – | FAIL, richtig |
| **Gegenprobe Teppich** | 0 | 0,5, steigt | 1,0, 0,03 | 0,12 | 0 % | – | – | FAIL, richtig |
| **Gegenprobe Reihe an der Kante** | 0 | ein Band | – | Rhythmus 0 | 0 % | – | – | FAIL, richtig |
| **Gegenprobe Waise im Gelände** | 1 200 | 0, steigt | – | – | 0 % | – | – | FAIL, richtig |
| **`ballCore impact`, heute, nachgerechnet** | 0 | groß | **1,04, Rang 0,00** | 0,50, **Lücke unter 25 %** | 0 % | – | – | **FAIL, Befund** |

**Lesart:**
- Fels→Kiesel im Verteiler ist die Referenz, die Prüfung kann also bestanden werden.
- Vorlage 5 zeigt gleich große Kiesel (Rang −0,04): Dort trägt die Dichte, passend zu #170. Für P2 heißt das Größenteil nur je Fall.
- Der Wüsten-Wert 88 % liegt knapp unter der Vorschlagsgrenze; entweder Grenze auf 85 % oder Kiesel-Drift prüfen. An der Musterregion entscheiden (V-568).
- Der Löser wurde mit leichten Steinen und synthetischem Gelände gerechnet, Reichweite je Fels `max(3,2 m; 3,2 × Hülle)`, gewertet nur Gruppen mit mindestens 4 Kieseln. Im Spiel kommt das echte Höhenraster dazu. Die Werte sind daher Anhaltspunkt, kein Nachweis im Spiel.
- Der Aufprall ist als einmaliger ballistischer Flug bis zum ersten Bodenkontakt nachgerechnet, ohne Ausrollen.
- Die Prüfung ersetzt nicht das Auge: Georg geht bei Einbettung vor (V-817). Sie verhindert nur, dass offensichtliche Musterfehler zu ihm kommen.
