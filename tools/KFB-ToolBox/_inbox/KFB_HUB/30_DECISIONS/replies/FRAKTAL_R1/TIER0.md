# TIER0 · Zeilen für jeden Auftrag zu Verteilung, Partikeln und Übergängen (wörtlich kopieren)

1. Jedes kleine Element ist Kind einer Quelle: Fels, Busch, Uferlinie, Einschlag, Lochkante oder Ruhekeim auf kahlem Boden. Fels, Busch und Ruhekeim kommen aus dem WFC-Löser `kfb-place-field`/`collapse`, Ufer aus der Wasserkante, Einschlag und Lochkante aus dem Ereignis, keine eigenen Keime. Ohne Quelle = FAIL.
2. Eine Funktion: `kinder()` in `kfb-place-core`, ein Fall ist eine Zeile im Block `fraktal` von `kfb_place.r1.json`. Kein zweiter Verteiler, keine eigene Formel, Zufall nur aus Saat und Ort.
3. An der Quelle groß und dicht. Nach außen seltener, Abstände wachsen, Größe fällt in Stufen auf der Leiter 1 : 0,62 : 0,38. Kein stufenloser Verlauf.
4. Immer eine Richtung mit Ursache: Hang, Schatten, Strömung, Treffwinkel. Höchstens halber Umfang, größte Lücke mindestens ein Viertel. Nie Kranz, Saum, Ring.
5. Auswurf und Spritzer: Große bleiben nah und fallen, Mittlere fächern, Kleinste fliegen am weitesten. Der Fächer folgt dem Treffer.
6. Gruppen 3, 5 oder 7. Nachbarn nie gleich groß, Abstände ungleich (Ziel 2 : 1), höchstens zwei auf einer Geraden, Konturen deutlich überlappt oder mit Luft.
7. Linien an Ufer und Rissen folgen dem Gelände, laufen spitz aus und setzen im Rhythmus aus. Nie gleich breit durchgehend.
8. Mindestens die Hälfte des Bodens bleibt frei. Materialcodes nur gegen kahle Flächen, im Bewuchs höchstens einzeln.
9. Farbe aus Elternteil oder Boden an dieser Stelle, diskret, Kugeln nur über `ballCore`. Liegendes rechnet der Worker, Linien und Korn der Shader. Unter 3 Pixeln oder über der Flächenregel wird nicht mehr gestreut, Pixel sind die Grenze (V-1090).
10. Abgabe: `fraktal-check` grün (P1–P5), Zählwerte in `perf.json`, dann Einzelbilder aus dem Spiel (V-1100). Lesen nur `replies/FRAKTAL_R1/FRAKTAL_R1.md` §1 und §3.

**Papiere:** Diese Seite ersetzt `SPEC_PLACEMENT_GRAMMAR_R2.md` als Pflichtlektüre in Kanon Gebiet 2 und 15 und in `tools/brief_domains.json` (Bereich Welt), deren Zahlen schon überholt sind (W12), deren §7 und §8 als Tabellenzeilen weiterleben; Etherington-Zahlen, `ETHERINGTON_ZERSTOERUNG`, `MENTALES_MODELL_WELT_R3`, `KRATER_MENTALMODELL`, `KONZEPT_KFB_VERTEILER` und die Flächengrammatik bleiben nur Quelle, und `SPEC_PLACEMENT_GRAMMAR_R2` fällt damit als eigene Seite weg.
