# TIER0 · Zeilen für jeden Auftrag zu Verteilung, Partikeln und Übergängen (wörtlich kopieren)

1. Alles Stehende und Liegende kommt aus einer Löser-Kaskade: je Maßstab ein Raster und eine Tabelle von Nachbarschafts-Wahrscheinlichkeiten zu allen Seiten. Kein zweiter Verteiler, keine eigene Formel, Zufall nur aus Saat und Ort.
2. Löser ist `createLevel` und `collapse` aus `kfb-place-field` und `kfb-place-collapse`. Ein neuer Fall ist eine Tabellenzeile in `kfb_place.r1.json`, kein Code.
3. Die Zelle der feineren Ebene ist bedingt durch den Zustand der gröberen. „leer“ vererbt sich, unter einem Objekt bleibt der Platz frei. Keine feine Ebene ohne gröbere.
4. Gruppen, Größenstufen, Abfall und Lücken sind Ergebnis der Tabelle. Nie von Hand setzen: keine Dreier-Regel als Bauvorschrift, keine Kränze, Säume, Reihen, keine Abstandskurve je Objekt.
5. Größe hängt am Raster der Ebene. Keine eigene Größenregel, Spannen aus der Tabelle.
6. Hang, Schatten, Sperre, Thema, Deck und Wasserabstand wirken als Faktor im Vorwissen der Ebene, nie als Nachbearbeitung.
7. `kinder()` nur, wenn ein Ereignis etwas auswirft (Einschlag, Spritzer, Fluff im Flug): Große bleiben nah und fallen, Mittlere fächern, Kleinste fliegen am weitesten. Was danach liegt, gehört wieder der Kaskade. Ausnahmen: Kartenrelief, dort bestimmt das Bild die Kugeln; Linien an Ufer und Rissen folgen dem Gelände, laufen spitz aus und setzen aus.
8. Mindestens die Hälfte des Bodens bleibt frei, Materialcodes nur gegen kahle Flächen. Keine Konturen im Bereich 0,85–1,25 der Radien (V-749). Beides wird gemessen.
9. Farbe aus Elternteil oder Boden an dieser Stelle, diskret, Kugeln nur über `ballCore`. Unter 3 Pixeln keine Instanz, sondern Shader oder nichts (V-403, V-1090). Nie Landmarken, Gebäude, Straßen oder Höhen (V-708).
10. Abgabe: Löser-Ausgabe von oben über mehrere Zellen mit zwei Saaten plus die Tabelle, dann Einzelbilder aus dem Spiel (V-1100). Zählwerte in `perf.json`. Lesen nur `replies/FRAKTAL_R1/FRAKTAL_R1.md` §1 und §5.

**Papiere:** Nach Freigabe durch WS0 ersetzt diese Seite `SPEC_PLACEMENT_GRAMMAR_R2.md` als Pflichtlektüre in Kanon Gebiet 2 und 15 und in `tools/brief_domains.json` (Bereich Welt); Etherington-Zahlen, `ETHERINGTON_ZERSTOERUNG`, `MENTALES_MODELL_WELT_R3`, `KRATER_MENTALMODELL`, `KONZEPT_KFB_VERTEILER` und die Flächengrammatik bleiben nur Quelle.
**Stand:** Die Kaskade läuft im Spiel erst bis 4 m. `kfb_place` hat noch keine Tabellen für die feineren Ebenen, sie liegen vorerst in `scripts/place/wfc-skalen.r1.json`.
