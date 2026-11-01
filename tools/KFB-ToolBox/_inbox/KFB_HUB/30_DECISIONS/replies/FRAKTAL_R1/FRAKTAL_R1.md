# FRAKTAL_R1 · WFC über alle Maßstäbe · WS-Verteiler für WS0 · 31.10.2026, Fassung 2 (V-1117)

**Status:** Vorschlag für WS0, kein Kanon, bis eine V-Nummer es dorthin hebt. Georg lehnte die erste Fassung mit `kinder()` als Grundlage ab (V-1117): „Verteilungsmuster, die zu allen Seiten funktionieren“, mit Wahrscheinlichkeiten statt zusammengeklatschter Dreier-Grüppchen. Die erste Fassung liegt als `FRAKTAL_R1.vor_WFC.md` daneben.
**Kennzeichnung:** `gemessen` = aus der Löser-Ausgabe. `belegt` = steht in Register oder Code. `[V]` = Startwert ohne Beleg, an einer Musterregion zu eichen (V-568).

## 0 · Ergebnis

Das Muster ist **eine Löser-Kaskade, keine Formel**. Je Maßstab gibt es ein Raster und eine Tabelle: Wie wahrscheinlich ist ein Zustand, und wie verändert ein Nachbar diese Wahrscheinlichkeit, zu allen Seiten gleich? Die Zelle der feineren Ebene ist bedingt durch den Zustand der gröberen. Gruppen, Größenstufen, Abfall und Leere werden nicht gebaut, sie kommen aus den Tabellen und lassen sich messen.

**Der Löser kann das schon.** Für den Beweis war im Spiel-Code nur ein `export` an `createLevel` nötig, der Rest ist Tabelle. **Im Spiel läuft es aber nur bis 4 m.** Darunter sitzen heute handgebaute Gruppen, und genau die lehnt Georg ab.

**Beweis:** `WFC_BEWEIS/1_SAAT_A_ALLE_RICHTUNGEN.jpg`, `2_SAAT_B_ALLE_RICHTUNGEN.jpg`, `3_SAAT_A_NAH.jpg`, Tabelle in `WFC_BEWEIS/TABELLE.md`, Messwerte in `MESSWERTE.json`. Skript `scripts/place/wfc-skalen.mjs` @e68aa1bf. Echte Löser-Ausgabe von oben, Objekte als maßstabsgerechte Scheiben, flaches Gelände, ein Thema (Moos). Kein Spielbild.

## 1 · Die Grundlage

```
Ebene E, Raster mit Maß s_E, Zustände S_E

Vorwissen   w(z) = Σ_Eltern m · P_E(z | Zustand des Elternplatzes)      Eltern: gröbere Ebene, m fällt rund um die Elternmitte
Körper      Platz unter einem Objekt einer gröberen Ebene bleibt „leer“
Nachbarn    w(z) *= A(z, Zustand)   Abstand 1 Platz, zu allen Seiten     Nähe: zieht an (> 1) oder stößt ab (< 1)
            w(z) *= D(z, Zustand)   Abstand 2 Plätze, zu allen Seiten    Ferne: ergibt die Lücken zwischen den Gruppen
Auswahl     kleinste Entropie zuerst, Zufall nur aus Saat und Ort
Objekt      Zustand mit Eintrag r_m wird ein Objekt der Größe r_m; andere Zustände sind nur Bedingung für die nächste Ebene
```

**Die Ebenen im Beweis:**

| Ebene | Raster | Beispielzustände | Bedingt durch | Im Spiel |
|---|---|---|---|---|
| Zone | 32 m | ruhe, geröll, wiese, beet, dickicht | Thema | **ja** |
| Bodenplatz | 4 m | leer, fels, stein, kiesel, gras, blume, pilz, busch, strunk | Zone | **ja**, mit anderer Tabelle |
| Stück | 1 m | leer, kies, stein, kugel, gras, blume, pilz | Bodenplatz | **nein** |
| Korn | 0,25 m | leer, kiesel, krume, halm | Stück | **nein** |

**„leer“ vererbt sich:** Unter einem leeren Elternplatz bleibt alles leer. Darum gibt es Leere auf jeder Ebene, von der Lichtung bis zur Lücke im Kiesfleck. Das ist das Fraktale.

**Größen kommen aus dem Raster:** Fels 0,7–1,5 m, Brocken 0,38–0,7 m, Stein 0,17–0,36 m, Kiesel 0,04–0,09 m. Die Spannen stammen aus den vorhandenen `formation`-Einträgen und passen zum Viererschritt der Raster. Eine eigene Größenregel gibt es nicht.

## 2 · Was daraus entsteht

Zwei Saaten, je 192 m × 192 m, also neun Spielzellen zu 64 m. Größere Stichprobe nur bei den Blockwerten.

| Eigenschaft | Saat A | Saat B | Wie es entsteht |
|---|---|---|---|
| **Trägt in alle Richtungen:** Reihenfolge des Lösens | Prüfsumme gleich, von links oben wie von rechts unten | nur A geprüft | `createLevel`, Blockfarben |
| **Keine Naht:** Belegung Blockrand zu Blockinnerem | 1,016 (Stück), 1,012 (Korn), über 6 andere Saaten | – | Nachbarblock liest die fertigen Ränder |
| **Keine Vorzugsrichtung:** häufigste zu seltenste Richtung zwischen Stein- und Kugelpaaren | 1,40 | 1,16 | Tabelle hat keine Richtung; wenige Paare (rund 260 und 130), also grob |
| **Löser ohne Widerspruch:** Rückfälle | 0 | 0 | „leer“ ist immer möglich |
| **Leere:** freie 4-m-Zellen | 59 % | 60 % | `leer` vererbt sich, Nachbarn ziehen zusammen |
| **Abfall:** Stein, Kiesel, Kugel, Krume je m², 0–1 m gegen 8–14 m vom Felsrand | 1,39 → 0,07 | 1,24 → 0,05 | Eltern wirken rund um ihre Mitte, Nachbarn tragen es weiter |
| **Größenstufen:** Steine je m², ebenso | 0,079 → 0,003 | 0,089 → 0,002 | Feine Klassen leben nur nahe der gröberen |
| **Größe innerhalb einer Klasse:** Median im selben Vergleich | 5,4 → 4,9 cm | 5,1 → 4,9 cm | fällt kaum, die Größe wechselt über die Klassen (passt zu #170) |
| **Gruppen:** Fels, Brocken, Stein mit weniger als 1 m Luft dazwischen, Anzahl je Größe 1/2/3/4/5/6/9 | 91/27/10/5/1/2/1 | 91/25/7/8/2/1/0 | Nähe zieht an, Ferne stößt ab; keine Zahl vorgegeben. Einzelne überwiegen, Dreier sind nicht bevorzugt |
| **Mehrere Größen in einer Gruppe** (ab zwei Teilen) | 67 % | 72 % | Klassen stammen aus verschiedenen Ebenen |
| **Kein Kranz:** Felsen mit Kindern in allen 8 Sektoren bis 2,5 m vom Rand | 15 % (13 Felsen) | 12 % (17 Felsen) | Zufall je Platz, keine Regel; wenige Felsen, also grob |
| **Ausrichtung um den Fels:** Median der Resultante | 0,47 | 0,53 | offene Seiten entstehen von selbst |

## 3 · Was die Module schon können

| Fähigkeit | Stand | Stelle |
|---|---|---|
| Gewichtete Zustände, kleinste Entropie zuerst, Rückfall | **da** | `collapse` in `kfb-place-collapse` |
| Nachbarn zu allen Seiten, nah und fern, als Daten | **da**, je Paar symmetrisch und ohne Richtung | `matrix`, `blockLinks` |
| Endlos und unabhängig von der Lade-Reihenfolge | **da**, gemessen | `createLevel` |
| Feinere Ebene bedingt durch gröbere | **da**, beliebig tief über `priorAt` | Zone → Bodenplatz im Spiel; zwei weitere nur im Beweis |
| Ort als Bedingung (Hang, Sperre, Deck, Thema) | **Haken da** über `priorAt`, Einbau unter 4 m fehlt | `patch`, `alive` |

## 4 · Was fehlt, ehrlich

1. **Unter 4 m läuft keine Kaskade.** `rockGroup`, `pebbleDrift`, `grassGroup`, `flowerBed`, `mushroomGroup`, `bushGroup` und der Stamp-Teil sind Handarbeit mit eigenen Zahlen und müssten fallen. `solveLocal` und `nestPositions` fallen dann als Gruppenbauer weg; was davon für die Modellwahl noch nötig ist, ist nicht geprüft.
2. **Bodenplatz-Tabelle anders als im Spiel.** Der Beweis ersetzt Vorwissen und Nachbarn dieser Ebene und schaltet ihr Dichtefeld ab: mehr Zusammenhalt, seltener Fels, `stein` wird Brocken. Zone bleibt unverändert. **Georgs KEEP zu q339 galt dem alten Bild, das sich damit ändern kann.** Es braucht neue Einzelbilder aus dem Spiel.
3. **Rechenzeit.** Eine neue 64-m-Zelle braucht in Node einzeln rund 460 ms für alle Ebenen, vor allem das Korn. Das Spiel ist nicht gemessen. Blöcke unter leeren Eltern ließen sich überspringen, das ist nicht gebaut.
4. **Anzahl.** Rund 700–800 Objekte je Zelle im Mittel, meist Korn und unter der Sichtgrenze. Der Beweis zählt nur Objekte, nicht Pixel. Die Grenze zwischen Instanz und Shader (V-1090, V-403) ist offen.
5. **Fast-Berühren entsteht weiter.** 16 von 63 und 13 von 65 nahen Fels-Brocken-Stein-Paaren liegen im verbotenen Bereich (0,85–1,25 der Radien, V-749). Das regelt die Tabelle nicht von selbst. Vorschlag: im Vorwissen sperren, nicht nachträglich schieben. Gleich große Nachbarn sind nicht gemessen.
6. **Keine Richtung aus Ursache.** Hang, Schatten und Strömung sind im Beweis aus. Vorgesehen sind sie als Faktor im Vorwissen; richtungsabhängige Tabellen kann der Löser heute nicht und brauchten eine Löser-Änderung. Georgs Wunsch verlangt sie nicht.
7. **Nicht gezeigt:** Gelände, Sperren, Straßen, die anderen fünf Themen, Modelle, Einsinken, Farbe und das Spielbild. Die Tabellen sind Startwerte `[V]` und gehören nach `kfb_place` (V-749).
8. **Ein Thema angesehen, zwei Saaten gemessen.** Daraus folgt noch nicht, dass die Tabelle überall trägt.

## 5 · Die Fälle

Stehendes und Liegendes ist eine Tabellenzeile. `kinder()` gilt nur, wo ein Ereignis etwas auswirft.

| Fall | Weg | Wie |
|---|---|---|
| Fels, Brocken, Stein, Kiesel | **Kaskade** | Beweis |
| Fußkügelchen, Knet-Kügelchen, Krume (V-1112) | **Kaskade** | Zustände `kugel` und `krume` im Beweis |
| Gras, Blumen, Pilz, Busch, Strunk | **Kaskade** | Beweis; Modellwahl fehlt |
| Materialcodes auf leerem Boden (V-1036, V-1004) | **Kaskade** | Zeile in Zone `ruhe`; nicht geeicht |
| Fundstücke, Fluff-Nester (V-1005) | **Kaskade** | Eigene Zustände; nicht gebaut |
| Requisiten im Viertel (V-1071) | **Kaskade** | Haken `after` in `collapse` ist dafür gemacht; nicht geprüft |
| Ruhendes am Ufer | **Kaskade** | Wasserabstand als Bedingung im Vorwissen; nicht gebaut |
| Uferlinien | **offen** | Shader; ein Raster entlang der Bogenlänge wäre möglich, nicht geprüft. Konzept R2 von WS1 lokal nicht gelesen |
| Trümmer und Krater in Ruhe | **Kaskade** | Einschlag setzt die Bedingung der Ebenen; passt zu V-855 „Strahlen, dann WFC-Verdichtung“; nicht gebaut |
| Einschlag, Spritzer, Fluff im Flug | **`kinder()`** | Unten |
| Kartenrelief | **Ausnahme** | Das Bild bestimmt die Kugeln (`pointsFromImage`) |

**`kinder()` nur für Ereignisse:** Ort, Richtung, Wucht und Saat ergeben fliegende Teile. Große bleiben nah und fallen, Mittlere fächern, Kleinste fliegen am weitesten (#27, #28, `spill.js`). `ballCore impact` bricht das noch: Tempo unabhängig von der Größe, Richtung rundum (`LUECKEN.md`). Formel, Stufen 1 : 0,62 : 0,38 und Fälle stehen in `FRAKTAL_R1.vor_WFC.md` §1 und §3, nur für diese Fälle.

## 6 · Prüfungen

Sie prüfen das Ergebnis und bauen es nicht. Sie gehören auf die Löser-Ausgabe, das Skript liefert die meisten Werte. **Schwellen `[V]`:**
- Reihenfolge: gleiche Prüfsumme. Keine Rückfälle.
- Naht: Rand zu innen 1 ± 0,1 über mehrere Saaten.
- Leere: mindestens 50 % freie 4-m-Zellen (V-799).
- Abfall: Dichte nah mindestens 3 × fern (Grammatik §5).
- Gruppen: Häufigkeit über mehrere Größen, keine Größe vorgegeben.
- Fast-Berühren: 0 (V-749), heute nicht erfüllt.
- Sicht: Korn nur als Instanz, wenn es mindestens 3 Pixel hat (V-403).

Das Auge entscheidet weiter (V-817). **`PRUEFUNG.md` und `fraktal_ref.mjs` beziehen sich noch auf die erste Fassung:** P1 verlangt ein Feld `quelle`, das es in der Kaskade nicht gibt, P3 die Resultante je Quelle. Nicht umgeschrieben.

## 7 · Register und Papiere

- **V-1076, V-1007** tragen das, **V-1115** und `SKIZZE_EINE_FUNKTION.vor_WFC.jpg` wären abzulösen.
- **V-749 Nr. 5** „WFC nur lokal“ und der Kopfkommentar in `kfb-place-core` sind durch V-1076 überholt. **V-708 bleibt:** nie Landmarken, Gebäude, Straßen, Höhen.
- **V-797** „kein Clutter“ und **V-1036:** Korn nur, wo Eltern es tragen. Im Bild gut, im Spiel zu prüfen.
- **Regel „immer zu einer Seite“ aus Fassung 1 fällt** als Bauregel. Das ist meine Lesart von Georgs „zu allen Seiten“ und die Entscheidung von WS0. Hang und Schatten bleiben Faktoren, wo es sie gibt.
- **`LUECKEN.md`, `PRUEFUNG.md`** nicht umgeschrieben und als veraltet markiert; `FUER_GEORG.md` ist neu.

## 8 · Etherington bleibt Quelle

Die Tafeln belegen, was herauskommen soll, nicht wie es gebaut wird: #161 und #162 Klein, Mittel, Groß immer wieder angewendet; #117, #170 Ruhe und Unterbrechung; #27, #28 Auswurf; #169 aus der Ferne wenige Schlüsselsteine. Belege je Term in `FRAKTAL_R1.vor_WFC.md` §2.

## 9 · TUNE-Runde: Beziehung und Gelände (Stand @3f047405, Schalter `place=r3`)

Überholt §1 (Vorwissen), §3 und §4 Punkte 1, 3, 5, 6. Beweis in `WFC_BEWEIS_R2/`, Herkunft jedes Werts in `WFC_BEWEIS_R2/TABELLE_HERKUNFT.md`.

**Vorwissen jetzt:** Die Wahrscheinlichkeit eines Stücks oder Korns hängt von den wirklichen gröberen Objekten in Reichweite ab: Abstand zum Rand je Sorte als Kurve, Seite um das Objekt, Lücke zwischen zwei Felsen. Dazu kommen Hang, Senke, Kuppe, Wasserabstand, Straßenabstand und Sperren als Faktor. Hangab wird die Seite enger. Die Bodenplatz-Ebene setzt nur noch Objekte und unsichtbare Quellpunkte, keine Flächen-Zustände mehr; im Bild sind keine Zellformen zu erkennen. Modul `kfb-place-cascade`, keine Gruppenbauer.

**Gelände im Spiel:** Weltfeste 128-m-Kacheln vom Hauptfaden, darum bleibt alles eine reine Funktion von Saat und Ort. Bäume und große Formationen sind Objekte im Vorwissen (Sperre und Bezug), berechnet auf den Kachel-Höhen.

**Fast-Berühren:** Paare im Vorwissen gesperrt, in allen drei Draufsichten 0 Verstöße. Mit Bäumen und Formationen im Spiel nicht nachgezählt.

**Rechenzeit im Spiel:** Neue Zelle im Worker rund 90–130 ms im Median, höchstens 170–240 ms, 850–880 Objekte im Median. Bildzeit nicht gemessen; es sind rund dreimal so viele Instanzen wie mit `place=r2`.

**Noch offen:** Straße gibt es im Spiel dieses Stands nicht (`T.roadDistance` fehlt), das Straßenbild nutzt ein Prüfstück. Bodenbänder fehlen im Vorwissen, weil sie nur im Shader leben. Die Tabelle stammt aus einer einzigen Vorlage und ist nur an zwei Saaten und drei Themen angesehen. Die Pflichtliste ist nicht gelaufen.

## 10 · Reparaturrunde V-1132 (Stand 3331e98b, Schalter `place=r3`)

Überholt in §9 die Bodenplatz-Quellen und die Kugeln. Neue Ebenen `quelle` (4 m), `perle` (0,5 m) und `art` (6-m-Raster). Randabstand gegen den gemessenen Fußumriss der Felsen, Kügelchen über den Kugel-Kern. Vorgaben, Bilder und Messwerte in `WFC_BEWEIS_R3/VORGABEN_TABELLE.md`. **Blinder Kritiker: Nein.** Materialcode, Busch-Fuß und Artenwechsel sind offen. Die Prüfung `grundStat` ist zu weich.

**Letzte Runde (Stand 5aa08e74):** Fuß als ein Band-Modell für Fels und Busch, Fußumriss auch für Büsche, Materialcode als kleine Gruppen, Eltern nur Stein, Baum, Busch, Blumenart in Flecken von rund 6–12 m. Belege in `WFC_BEWEIS_R4/VORGABEN_TABELLE.md`. Kritiker: Nein, der grobe Fehler ist laut ihm behoben. Ufer, Hangfuß und Rinne sind nicht bearbeitet.

## 11 · Dichte über die Fläche (Stand 9d6e04eb, V-1165)

Oberste Ebene neu: Felder über Hunderte Meter als Vorwissen, Modell in `MODELL_DICHTE_R1.md`, Belege in `WFC_BEWEIS_R5/VORGABEN_TABELLE.md`. Kritiker: Nein, die Karte zeigt Felder, im Spiel sind sie kaum lesbar. Bildzeit ungültig gemessen.

## 12 · Verdichtet und Bänder (V-1184)

Felder nach dem Modell in `MODELL_DICHTE_R1.md`, je Feld eine herrschende Art, Wald und Felsfeld dicht, hohe Büsche als runde Kuppen. Grobe Ebenen je Zelle, Perle und Korn erst nah, Zellen vor dem Wagen im Voraus. Kiesel und Kügelchen tragen die Bänder des Bodens (`baender=hell` Standard, `voll` Vergleich, `aus`), Kügelchen an Fels oder Busch behalten nah am Fuß die Farbe des Elternteils. Tabelle: `src/data/worlds/kfb-place-cascade.r3.json`, nicht `kfb_place.r1.json`. Belege in `WFC_BEWEIS_R7/`.
